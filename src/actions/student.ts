'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function markLessonComplete(lessonId: string, courseId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Authentication required' };
  }

  // Upsert progress
  const { error } = await supabase.from('lesson_progress').upsert(
    {
      student_id: user.id,
      lesson_id: lessonId,
      course_id: courseId,
      completed: true,
      completed_at: new Date().toISOString(),
    },
    { onConflict: 'student_id,lesson_id' }
  );

  if (error) {
    return { error: error.message };
  }

  // Check if all course lessons are now completed
  const { data: allLessons } = await supabase
    .from('lessons')
    .select('id')
    .eq('course_id', courseId)
    .eq('is_published', true);

  const { data: completedProgress } = await supabase
    .from('lesson_progress')
    .select('id')
    .eq('student_id', user.id)
    .eq('course_id', courseId)
    .eq('completed', true);

  if (
    allLessons &&
    completedProgress &&
    allLessons.length > 0 &&
    completedProgress.length >= allLessons.length
  ) {
    // Record course completion
    await supabase.from('course_completions').upsert(
      {
        student_id: user.id,
        course_id: courseId,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'student_id,course_id' }
    );
  }

  revalidatePath(`/student/courses/${courseId}`);
  revalidatePath(`/student/courses/${courseId}/lessons/${lessonId}`);
  revalidatePath('/student/dashboard');

  return { success: true };
}

export async function updateProfile(prevState: any, formData: FormData) {
  const fullName = formData.get('fullName') as string;
  const phone = formData.get('phone') as string;
  const bio = formData.get('bio') as string;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Authentication required' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      phone: phone,
      bio: bio,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/student/account');
  return { success: 'Profile successfully updated!' };
}

export async function markNotificationRead(notificationId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .eq('user_id', user.id);

  revalidatePath('/student/notifications');
}
