import { createClient, createAdminClient } from '@/lib/supabase/server';

export function generateCertificateNumber(): string {
  const year = new Date().getFullYear();
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  const timestampPart = Date.now().toString(36).substring(4).toUpperCase();
  return `JP-CERT-${year}-${randomPart}${timestampPart}`;
}

export async function checkEligibility(studentId: string, courseId: string) {
  const supabase = await createAdminClient();

  // 1. Check all published lessons are completed
  const { data: allLessons } = await supabase
    .from('lessons')
    .select('id')
    .eq('course_id', courseId)
    .eq('is_published', true);

  const { data: completedProgress } = await supabase
    .from('lesson_progress')
    .select('id')
    .eq('student_id', studentId)
    .eq('course_id', courseId)
    .eq('completed', true);

  const totalLessons = allLessons?.length || 0;
  const completedLessons = completedProgress?.length || 0;

  if (totalLessons === 0 || completedLessons < totalLessons) {
    return {
      eligible: false,
      reason: `You have completed ${completedLessons} of ${totalLessons} lessons.`,
    };
  }

  // 2. Check if assessments exist for this course, and if so, whether the student passed
  const { data: assessments } = await supabase
    .from('assessments')
    .select('id')
    .eq('course_id', courseId)
    .eq('is_published', true);

  if (assessments && assessments.length > 0) {
    const assessmentIds = assessments.map((a) => a.id);
    const { data: passedAttempts } = await supabase
      .from('assessment_attempts')
      .select('id')
      .eq('student_id', studentId)
      .in('assessment_id', assessmentIds)
      .eq('passed', true);

    if (!passedAttempts || passedAttempts.length === 0) {
      return {
        eligible: false,
        reason: 'You must pass the course assessment before receiving your certificate.',
      };
    }
  }

  return { eligible: true };
}

export async function issueCertificate(studentId: string, courseId: string) {
  const supabase = await createAdminClient();

  // 1. Verify feature is enabled
  const { data: settings } = await supabase
    .from('platform_settings')
    .select('certificates_enabled')
    .single();

  if (!settings?.certificates_enabled) {
    return { error: 'Certificate generation is currently disabled by administrator.' };
  }

  // 2. Check eligibility
  const eligibility = await checkEligibility(studentId, courseId);
  if (!eligibility.eligible) {
    return { error: eligibility.reason };
  }

  // 3. Issue certificate
  const certificateNumber = generateCertificateNumber();
  const { data: certificate, error } = await supabase
    .from('certificates')
    .upsert(
      {
        student_id: studentId,
        course_id: courseId,
        certificate_number: certificateNumber,
        is_valid: true,
        issued_at: new Date().toISOString(),
      },
      { onConflict: 'student_id,course_id' }
    )
    .select('*')
    .single();

  if (error) return { error: error.message };

  return { success: true, certificate };
}

export async function revokeCertificate(certificateId: string, reason: string) {
  const supabase = await createAdminClient();

  const { error } = await supabase
    .from('certificates')
    .update({
      is_valid: false,
      revoked_at: new Date().toISOString(),
      revocation_reason: reason,
    })
    .eq('id', certificateId);

  if (error) return { error: error.message };
  return { success: true };
}
