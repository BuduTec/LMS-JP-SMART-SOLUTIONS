'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { generateSlug } from '@/lib/utils';

export async function createAuditLog(action: string, resourceType?: string, resourceId?: string, details?: Record<string, unknown>) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const adminSupabase = await createAdminClient();
    await adminSupabase.from('audit_logs').insert({
      user_id: user?.id ?? null,
      action,
      resource_type: resourceType ?? null,
      resource_id: resourceId ?? null,
      details: details ?? null,
    });
  } catch (err) {
    console.error('Failed to log audit event:', err);
  }
}

export async function createCourse(formData: FormData) {
  const title = formData.get('title') as string;
  const shortDescription = formData.get('shortDescription') as string;
  const description = formData.get('description') as string;
  const categoryId = formData.get('categoryId') as string;
  const price = parseFloat(formData.get('price') as string) || null;
  const mode = (formData.get('mode') as string) || 'Online';
  const difficultyLevel = formData.get('difficultyLevel') as any;

  if (!title) return { error: 'Course title is required' };

  const supabase = await createClient();
  const slug = generateSlug(title) + '-' + Math.random().toString(36).substring(2, 6);

  const { data: course, error } = await supabase
    .from('courses')
    .insert({
      title,
      slug,
      short_description: shortDescription,
      description,
      category_id: categoryId || null,
      price,
      currency: 'NGN',
      mode,
      difficulty_level: difficultyLevel || 'intermediate',
      status: 'draft',
    })
    .select('id')
    .single();

  if (error) return { error: error.message };

  await createAuditLog('create_course', 'course', course.id, { title, slug });
  revalidatePath('/admin/courses');
  return { success: true, courseId: course.id };
}

export async function updateCourse(courseId: string, formData: FormData) {
  const title = formData.get('title') as string;
  const shortDescription = formData.get('shortDescription') as string;
  const description = formData.get('description') as string;
  const categoryId = formData.get('categoryId') as string;
  const price = parseFloat(formData.get('price') as string) || null;
  const mode = formData.get('mode') as string;
  const difficultyLevel = formData.get('difficultyLevel') as any;
  const status = formData.get('status') as any;

  const supabase = await createClient();
  const { error } = await supabase
    .from('courses')
    .update({
      title,
      short_description: shortDescription,
      description,
      category_id: categoryId || null,
      price,
      mode: mode || 'Online',
      difficulty_level: difficultyLevel,
      status: status || 'draft',
      updated_at: new Date().toISOString(),
    })
    .eq('id', courseId);

  if (error) return { error: error.message };

  await createAuditLog('update_course', 'course', courseId, { title, status });
  revalidatePath('/admin/courses');
  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath('/courses');
  return { success: true };
}

export async function publishCourse(courseId: string, publish: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('courses')
    .update({
      status: publish ? 'published' : 'draft',
      updated_at: new Date().toISOString(),
    })
    .eq('id', courseId);

  if (error) return { error: error.message };

  await createAuditLog(publish ? 'publish_course' : 'unpublish_course', 'course', courseId);
  revalidatePath('/admin/courses');
  revalidatePath('/courses');
  return { success: true };
}

export async function deleteCourse(courseId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', courseId);

  if (error) return { error: error.message };

  await createAuditLog('delete_course', 'course', courseId);
  revalidatePath('/admin/courses');
  return { success: true };
}

export async function createManualEnrolment(studentId: string, courseId: string, notes?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from('enrolments').upsert(
    {
      student_id: studentId,
      course_id: courseId,
      enrolled_by: user?.id,
      notes: notes || 'Manual administrative enrolment',
      is_active: true,
      enrolled_at: new Date().toISOString(),
    },
    { onConflict: 'student_id,course_id' }
  );

  if (error) return { error: error.message };

  await createAuditLog('manual_enrolment', 'enrolment', undefined, { studentId, courseId, notes });
  revalidatePath('/admin/enrolments');
  revalidatePath('/admin/students');
  return { success: true };
}

export async function deactivateStudent(studentId: string, isActive: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('profiles')
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq('id', studentId);

  if (error) return { error: error.message };

  await createAuditLog(isActive ? 'activate_student' : 'deactivate_student', 'profile', studentId);
  revalidatePath('/admin/students');
  return { success: true };
}

export async function updatePlatformSettings(data: Record<string, any>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user?.id || '')
    .single();

  if (profile?.role !== 'super_admin' && profile?.role !== 'admin') {
    return { error: 'Admin permissions required' };
  }

  const { error } = await supabase
    .from('platform_settings')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
      updated_by: user?.id,
    })
    .eq('id', 1);

  if (error) return { error: error.message };

  await createAuditLog('update_platform_settings', 'platform_settings', '1', data);
  revalidatePath('/admin/settings');
  revalidatePath('/admin/settings/features');
  return { success: true };
}
