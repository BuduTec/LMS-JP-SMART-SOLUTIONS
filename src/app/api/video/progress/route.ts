import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lessonId, courseId, positionSeconds, durationSeconds } = body;

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

    // Upsert last position
    await supabase.from('lesson_progress').upsert(
      {
        student_id: user.id,
        lesson_id: lessonId,
        course_id: courseId,
        last_position_seconds: Math.round(positionSeconds || 0),
        watch_duration_seconds: Math.round(durationSeconds || 0),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'student_id,lesson_id' }
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
