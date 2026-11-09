import { type NextRequest, NextResponse } from 'next/server';
import { createPublicClient } from '@/lib/supabase/server';
import { getStoreCourseById } from '@/lib/admin-store';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;

  try {
    const supabase = createPublicClient();
    const { data: course } = await supabase
      .from('courses')
      .select('id, title, slug, short_description, image_url, price, currency, mode, duration_text')
      .or(`id.eq.${courseId},slug.eq.${courseId}`)
      .maybeSingle();

    if (course) {
      return NextResponse.json(course);
    }
  } catch {
    // Fall back to admin-store courses below
  }

  const seeded = getStoreCourseById(courseId);
  if (seeded) {
    return NextResponse.json(seeded);
  }

  return NextResponse.json({ error: 'Course not found' }, { status: 404 });
}
