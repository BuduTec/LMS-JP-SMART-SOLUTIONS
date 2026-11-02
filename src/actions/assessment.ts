'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function startAttempt(assessmentId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Authentication required' };

  // Fetch assessment
  const { data: assessment } = await supabase
    .from('assessments')
    .select('id, course_id, max_attempts')
    .eq('id', assessmentId)
    .single();

  if (!assessment) return { error: 'Assessment not found' };

  // Check attempt limit
  if (assessment.max_attempts) {
    const { count } = await supabase
      .from('assessment_attempts')
      .select('id', { count: 'exact', head: true })
      .eq('assessment_id', assessmentId)
      .eq('student_id', user.id);

    if (count && count >= assessment.max_attempts) {
      return { error: 'Maximum allowed attempts reached for this assessment' };
    }
  }

  // Create new attempt
  const { data: attempt, error } = await supabase
    .from('assessment_attempts')
    .insert({
      assessment_id: assessmentId,
      student_id: user.id,
      started_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (error) return { error: error.message };

  return { success: true, attemptId: attempt.id };
}

export async function submitAssessment(
  attemptId: string,
  assessmentId: string,
  answers: Record<string, string[]>
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Authentication required' };

  // Fetch assessment details & questions with correct options
  const { data: assessment } = await supabase
    .from('assessments')
    .select(`
      id,
      course_id,
      pass_mark,
      questions(
        id,
        marks,
        options:question_options(id, is_correct)
      )
    `)
    .eq('id', assessmentId)
    .single();

  if (!assessment) return { error: 'Assessment not found' };

  let totalMarks = 0;
  let earnedMarks = 0;
  const questions = assessment.questions || [];

  for (const q of questions) {
    totalMarks += q.marks || 1;
    const selected = answers[q.id] || [];
    const correctOptionIds = (q.options || [])
      .filter((opt: any) => opt.is_correct)
      .map((opt: any) => opt.id);

    // Exact match comparison for options
    const isCorrect =
      correctOptionIds.length === selected.length &&
      correctOptionIds.every((id: string) => selected.includes(id));

    const marksAwarded = isCorrect ? q.marks || 1 : 0;
    earnedMarks += marksAwarded;

    // Record answer
    await supabase.from('attempt_answers').insert({
      attempt_id: attemptId,
      question_id: q.id,
      selected_option_ids: selected,
      is_correct: isCorrect,
      marks_awarded: marksAwarded,
    });
  }

  const scorePercentage = totalMarks > 0 ? (earnedMarks / totalMarks) * 100 : 0;
  const passed = scorePercentage >= assessment.pass_mark;

  // Update attempt record
  await supabase
    .from('assessment_attempts')
    .update({
      score: Math.round(scorePercentage),
      passed,
      submitted_at: new Date().toISOString(),
    })
    .eq('id', attemptId);

  // If passed, record notification
  if (passed) {
    await supabase.from('notifications').insert({
      user_id: user.id,
      title: 'Assessment Passed!',
      body: `Congratulations! You scored ${Math.round(scorePercentage)}% and passed your assessment.`,
      link: `/student/assessments/${assessmentId}/results?attemptId=${attemptId}`,
    });
  }

  revalidatePath(`/student/assessments/${assessmentId}`);
  revalidatePath('/student/assessments');
  revalidatePath('/student/dashboard');

  return { success: true, score: scorePercentage, passed };
}
