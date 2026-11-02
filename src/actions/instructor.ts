'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createAssessment(formData: FormData) {
  const courseId = formData.get('courseId') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const passMark = parseInt(formData.get('passMark') as string) || 70;
  const timeLimit = parseInt(formData.get('timeLimit') as string) || null;
  const maxAttempts = parseInt(formData.get('maxAttempts') as string) || null;

  if (!courseId || !title) {
    return { error: 'Course and title are required' };
  }

  const supabase = await createClient();
  const { data: assessment, error } = await supabase
    .from('assessments')
    .insert({
      course_id: courseId,
      title,
      description,
      pass_mark: passMark,
      time_limit_minutes: timeLimit,
      max_attempts: maxAttempts,
      is_published: true,
    })
    .select('id')
    .single();

  if (error) return { error: error.message };

  revalidatePath('/instructor/assessments');
  return { success: true, assessmentId: assessment.id };
}

export async function addQuestion(assessmentId: string, questionData: {
  text: string;
  type: string;
  marks: number;
  explanation?: string;
  options: { text: string; isCorrect: boolean }[];
}) {
  const supabase = await createClient();

  const { data: q, error: qErr } = await supabase
    .from('questions')
    .insert({
      assessment_id: assessmentId,
      question_text: questionData.text,
      question_type: questionData.type,
      marks: questionData.marks || 1,
      explanation: questionData.explanation,
    })
    .select('id')
    .single();

  if (qErr) return { error: qErr.message };

  if (questionData.options && questionData.options.length > 0) {
    const opts = questionData.options.map((opt, i) => ({
      question_id: q.id,
      option_text: opt.text,
      is_correct: opt.isCorrect,
      sort_order: i,
    }));

    await supabase.from('question_options').insert(opts);
  }

  revalidatePath('/instructor/assessments');
  return { success: true, questionId: q.id };
}
