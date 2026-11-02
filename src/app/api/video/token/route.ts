import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

/**
 * Generates a Cloudflare Stream signed token (RS256 JWT) using the private key
 * stored in CLOUDFLARE_STREAM_SIGNING_KEY_JWK (base64-encoded JWK JSON).
 *
 * Falls back gracefully when CF credentials are not yet configured.
 */
async function generateCFSignedToken(
  videoUid: string,
  keyId: string,
  keyJwkBase64: string,
  expirySeconds = 14400 // 4 hours
): Promise<string | null> {
  try {
    const keyJwk = JSON.parse(Buffer.from(keyJwkBase64, 'base64').toString('utf-8'));

    const privateKey = await crypto.subtle.importKey(
      'jwk',
      keyJwk,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const exp = Math.floor(Date.now() / 1000) + expirySeconds;

    const header = Buffer.from(JSON.stringify({ alg: 'RS256', kid: keyId })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({ sub: videoUid, kid: keyId, exp })).toString('base64url');
    const signingInput = `${header}.${payload}`;

    const signature = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      privateKey,
      Buffer.from(signingInput)
    );

    return `${signingInput}.${Buffer.from(signature).toString('base64url')}`;
  } catch (err) {
    console.error('[video/token] Failed to generate CF signed token:', err);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lessonId = searchParams.get('lessonId');

  if (!lessonId) {
    return NextResponse.json({ error: 'lessonId is required' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 1. Fetch lesson details
  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select('id, course_id, video_cf_uid, is_published, is_preview')
    .eq('id', lessonId)
    .single();

  if (lessonError || !lesson) {
    return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
  }

  // 2. If not a free-preview lesson, verify enrolment
  if (!lesson.is_preview) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const isPrivileged =
      profile?.role === 'admin' ||
      profile?.role === 'super_admin' ||
      profile?.role === 'instructor';

    if (!isPrivileged) {
      const { data: enrolment } = await supabase
        .from('enrolments')
        .select('id')
        .eq('student_id', user.id)
        .eq('course_id', lesson.course_id)
        .eq('is_active', true)
        .maybeSingle();

      if (!enrolment) {
        return NextResponse.json(
          { error: 'Active enrolment required to access this lesson' },
          { status: 403 }
        );
      }
    }
  }

  // 3. Rate limit: max 20 token requests per student per hour per lesson
  const oneHourAgo = new Date(Date.now() - 3600 * 1000).toISOString();
  const { count: tokenCount } = await supabase
    .from('video_access_logs')
    .select('id', { count: 'exact', head: true })
    .eq('student_id', user.id)
    .eq('lesson_id', lesson.id)
    .gte('token_issued_at', oneHourAgo);

  if (tokenCount && tokenCount >= 20) {
    return NextResponse.json(
      { error: 'Too many video requests. Please wait before retrying.' },
      { status: 429 }
    );
  }

  // 4. Build the signed token or fall back to plain UID
  const videoUid = lesson.video_cf_uid;
  const cfDomain = process.env.NEXT_PUBLIC_CF_STREAM_CUSTOMER_SUBDOMAIN;
  const cfKeyJwk = process.env.CLOUDFLARE_STREAM_SIGNING_KEY_JWK;
  const cfKeyId = process.env.CLOUDFLARE_STREAM_SIGNING_KEY_ID;

  const expiresAt = new Date(Date.now() + 4 * 3600 * 1000).toISOString();
  let signedToken: string | null = null;
  let streamUrl = '';

  if (videoUid) {
    if (cfKeyJwk && cfKeyId) {
      signedToken = await generateCFSignedToken(videoUid, cfKeyId, cfKeyJwk);
    }

    const src = signedToken ?? videoUid;
    streamUrl = cfDomain
      ? `https://${cfDomain}/${src}/manifest/video.m3u8`
      : `https://videodelivery.net/${src}/manifest/video.m3u8`;
  }

  // 5. Log access for audit trail and rate limiting
  await supabase.from('video_access_logs').insert({
    student_id: user.id,
    lesson_id: lesson.id,
    token_issued_at: new Date().toISOString(),
    token_expires_at: expiresAt,
  });

  return NextResponse.json({
    // videoUid contains the signed token when available, otherwise raw UID
    // The CF Stream React component uses this as the `src` prop
    videoUid: signedToken ?? videoUid,
    streamUrl,
    expiresAt,
  });
}
