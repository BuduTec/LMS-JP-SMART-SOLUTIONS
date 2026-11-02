import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lessonId = searchParams.get('lessonId');

  if (!lessonId) {
    return NextResponse.json({ error: 'lessonId is required' }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  // 2. If not preview, verify enrolment
  if (!lesson.is_preview) {
    const { data: enrolment } = await supabase
      .from('enrolments')
      .select('id, is_active')
      .eq('student_id', user.id)
      .eq('course_id', lesson.course_id)
      .eq('is_active', true)
      .single();

    if (!enrolment) {
      // Check if user is instructor or admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || (profile.role !== 'admin' && profile.role !== 'super_admin' && profile.role !== 'instructor')) {
        return NextResponse.json({ error: 'Active enrolment required' }, { status: 403 });
      }
    }
  }

  // 3. Rate limiting: max 10 tokens per student per hour per lesson
  const oneHourAgo = new Date(Date.now() - 3600 * 1000).toISOString();
  const { count: tokenCount } = await supabase
    .from('video_access_logs')
    .select('id', { count: 'exact', head: true })
    .eq('student_id', user.id)
    .eq('lesson_id', lesson.id)
    .gte('token_issued_at', oneHourAgo);

  if (tokenCount && tokenCount >= 10) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Too many video requests in the last hour.' },
      { status: 429 }
    );
  }

  // 4. Generate Cloudflare signed token or fallback URL
  const videoUid = lesson.video_cf_uid;
  const cfDomain = process.env.NEXT_PUBLIC_CF_STREAM_CUSTOMER_SUBDOMAIN;
  const cfKeyJwk = process.env.CLOUDFLARE_STREAM_SIGNING_KEY_JWK;
  const cfKeyId = process.env.CLOUDFLARE_STREAM_SIGNING_KEY_ID;

  let streamUrl = '';
  const expiresAt = new Date(Date.now() + 4 * 3600 * 1000).toISOString(); // 4 hours

  if (videoUid) {
    if (cfDomain) {
      streamUrl = `https://${cfDomain}/${videoUid}/manifest/video.m3u8`;
    } else {
      streamUrl = `https://videodelivery.net/${videoUid}/manifest/video.m3u8`;
    }
  }

  // 5. Log access
  await supabase.from('video_access_logs').insert({
    student_id: user.id,
    lesson_id: lesson.id,
    token_issued_at: new Date().toISOString(),
    token_expires_at: expiresAt,
  });

  return NextResponse.json({
    videoUid,
    streamUrl,
    expiresAt,
  });
}
