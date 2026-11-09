'use server';

import { createClient, createAdminClient, getSupabaseConfig } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { generateSlug } from '@/lib/utils';
import {
  appendStoreAuditLog,
  addStoreCourse,
  updateStoreCourse,
  toggleStoreCoursePublish,
  deleteStoreCourse,
  addStoreManualEnrolment,
  toggleStoreStudentActive,
  updateStorePlatformSettings,
  addStoreCategory,
} from '@/lib/admin-store';

export async function createAuditLog(
  action: string,
  resourceType?: string,
  resourceId?: string,
  details?: Record<string, unknown>
) {
  appendStoreAuditLog(action, resourceType, resourceId, details);
  const { isConfigured } = getSupabaseConfig();
  if (!isConfigured) return;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

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
  const title = (formData.get('title') as string)?.trim();
  const shortDescription = (formData.get('shortDescription') as string)?.trim();
  const description = (formData.get('description') as string)?.trim();
  const categoryId = formData.get('categoryId') as string;
  const price = parseFloat(formData.get('price') as string) || null;
  const mode = (formData.get('mode') as string) || 'Online';
  const difficultyLevel = (formData.get('difficultyLevel') as any) || 'intermediate';

  if (!title) return { error: 'Course title is required' };

  const { isConfigured } = getSupabaseConfig();

  // Always update in-memory store so changes reflect immediately
  addStoreCourse({
    title,
    shortDescription,
    description,
    categoryId,
    price,
    mode,
    difficultyLevel,
  });

  if (isConfigured) {
    try {
      const supabase = await createClient();
      const slug = generateSlug(title) + '-' + Math.random().toString(36).substring(2, 6);

      const { data: course } = await supabase
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
          difficulty_level: difficultyLevel,
          status: 'draft',
        })
        .select('id')
        .single();

      if (course) {
        await createAuditLog('create_course', 'course', course.id, { title, slug });
      }
    } catch {
      // Fallback store already updated
    }
  }

  revalidatePath('/admin/courses');
  revalidatePath('/admin/dashboard');
  revalidatePath('/courses');
  redirect('/admin/courses');
}

export async function updateCourse(courseId: string, formData: FormData) {
  const title = (formData.get('title') as string)?.trim();
  const shortDescription = (formData.get('shortDescription') as string)?.trim();
  const description = (formData.get('description') as string)?.trim();
  const categoryId = formData.get('categoryId') as string;
  const price = parseFloat(formData.get('price') as string) || null;
  const mode = formData.get('mode') as string;
  const difficultyLevel = formData.get('difficultyLevel') as any;
  const status = formData.get('status') as any;

  updateStoreCourse(courseId, {
    title,
    shortDescription,
    description,
    categoryId,
    price,
    mode: mode || 'Online',
    difficultyLevel,
    status: status || 'draft',
  });

  const { isConfigured } = getSupabaseConfig();
  if (isConfigured) {
    try {
      const supabase = await createClient();
      await supabase
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
    } catch {
      // Fallback store already updated
    }
  }

  revalidatePath('/admin/courses');
  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath('/admin/dashboard');
  revalidatePath('/courses');
}

export async function publishCourse(courseId: string, publish: boolean) {
  toggleStoreCoursePublish(courseId, publish);

  const { isConfigured } = getSupabaseConfig();
  if (isConfigured) {
    try {
      const supabase = await createClient();
      await supabase
        .from('courses')
        .update({
          status: publish ? 'published' : 'draft',
          updated_at: new Date().toISOString(),
        })
        .eq('id', courseId);
    } catch {
      // Fallback store already updated
    }
  }

  revalidatePath('/admin/courses');
  revalidatePath('/admin/dashboard');
  revalidatePath('/courses');
}

export async function deleteCourse(courseId: string) {
  deleteStoreCourse(courseId);

  const { isConfigured } = getSupabaseConfig();
  if (isConfigured) {
    try {
      const supabase = await createClient();
      await supabase.from('courses').delete().eq('id', courseId);
    } catch {
      // Fallback store already updated
    }
  }

  revalidatePath('/admin/courses');
  revalidatePath('/admin/dashboard');
}

export async function createCategory(formData: FormData) {
  const name = (formData.get('name') as string)?.trim();
  const description = (formData.get('description') as string)?.trim();
  if (!name) return;

  addStoreCategory({ name, description });

  const { isConfigured } = getSupabaseConfig();
  if (isConfigured) {
    try {
      const supabase = await createClient();
      await supabase.from('categories').insert({
        name,
        slug: generateSlug(name),
        description: description || null,
      });
    } catch {
      // Fallback store already updated
    }
  }

  revalidatePath('/admin/categories');
  revalidatePath('/admin/courses');
}

export async function createManualEnrolment(studentId: string, courseId: string, notes?: string) {
  addStoreManualEnrolment(studentId, courseId, notes);

  const { isConfigured } = getSupabaseConfig();
  if (isConfigured) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      await supabase.from('enrolments').upsert(
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
    } catch {
      // Fallback store already updated
    }
  }

  revalidatePath('/admin/enrolments');
  revalidatePath('/admin/students');
  revalidatePath('/admin/dashboard');
}

export async function deactivateStudent(studentId: string, isActive: boolean) {
  toggleStoreStudentActive(studentId, isActive);

  const { isConfigured } = getSupabaseConfig();
  if (isConfigured) {
    try {
      const supabase = await createClient();
      await supabase
        .from('profiles')
        .update({ is_active: isActive, updated_at: new Date().toISOString() })
        .eq('id', studentId);
    } catch {
      // Fallback store already updated
    }
  }

  revalidatePath('/admin/students');
  revalidatePath('/admin/dashboard');
}

export async function updatePlatformSettings(data: Record<string, any>) {
  updateStorePlatformSettings(data);

  const { isConfigured } = getSupabaseConfig();
  if (isConfigured) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      await supabase
        .from('platform_settings')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
          updated_by: user?.id,
        })
        .eq('id', 1);
    } catch {
      // Fallback store already updated
    }
  }

  revalidatePath('/admin/settings');
  revalidatePath('/admin/settings/features');
  revalidatePath('/admin/audit-logs');
}
