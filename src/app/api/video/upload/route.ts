import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify instructor or admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (
    !profile ||
    (profile.role !== 'admin' && profile.role !== 'super_admin' && profile.role !== 'instructor')
  ) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_STREAM_API_TOKEN;

  if (!accountId || !apiToken) {
    // Return mock upload URL if CF credentials are not configured yet
    return NextResponse.json({
      uploadUrl: '',
      uid: 'sample_video_uid_' + Date.now(),
      mock: true,
      message: 'Cloudflare Stream credentials not configured in environment',
    });
  }

  try {
    const cfResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/direct_upload`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          maxDurationSeconds: 7200,
          requireSignedURLs: true,
        }),
      }
    );

    const data = await cfResponse.json();
    if (!cfResponse.ok || !data.success) {
      return NextResponse.json(
        { error: 'Failed to create Cloudflare upload URL', details: data },
        { status: 502 }
      );
    }

    return NextResponse.json({
      uploadUrl: data.result.uploadURL,
      uid: data.result.uid,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal server error creating upload' },
      { status: 500 }
    );
  }
}
