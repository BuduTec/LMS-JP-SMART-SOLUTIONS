import React from 'react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle2, XCircle, Award, RotateCcw, ArrowRight } from 'lucide-react';

interface ResultsPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    attemptId?: string;
  }>;
}

export default async function AssessmentResultsPage({
  params,
  searchParams,
}: ResultsPageProps) {
  const { id: assessmentId } = await params;
  const { attemptId } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  if (!attemptId) redirect(`/student/assessments/${assessmentId}`);

  // Fetch attempt details
  const { data: attempt } = await supabase
    .from('assessment_attempts')
    .select(`
      *,
      assessment:assessments(
        id,
        title,
        pass_mark,
        course_id,
        course:courses(title)
      ),
      answers:attempt_answers(
        id,
        question_id,
        is_correct,
        marks_awarded,
        question:questions(
          question_text,
          explanation
        )
      )
    `)
    .eq('id', attemptId)
    .eq('student_id', user.id)
    .single();

  if (!attempt) notFound();

  const isPassed = attempt.passed;
  const score = attempt.score ?? 0;

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      {/* Summary Card */}
      <Card className="border border-[#D5E1ED] shadow-jphover text-center overflow-hidden">
        <div
          className={`p-8 ${
            isPassed ? 'bg-emerald-50 text-emerald-950' : 'bg-rose-50 text-rose-950'
          }`}
        >
          <div
            className={`h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
              isPassed ? 'bg-emerald-200 text-emerald-800' : 'bg-rose-200 text-rose-800'
            }`}
          >
            {isPassed ? (
              <CheckCircle2 className="h-9 w-9" />
            ) : (
              <XCircle className="h-9 w-9" />
            )}
          </div>
          <span className="text-xs font-bold uppercase tracking-wider block">
            {attempt.assessment?.title}
          </span>
          <h1 className="text-3xl font-extrabold mt-1">
            {isPassed ? 'Assessment Passed!' : 'Assessment Not Passed'}
          </h1>
          <div className="mt-3 text-4xl font-extrabold font-mono">
            {score}%
          </div>
          <p className="text-xs mt-1 opacity-80">
            Pass Mark Required: {attempt.assessment?.pass_mark}%
          </p>
        </div>

        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href={`/student/assessments/${assessmentId}`}
              className="btn-outline text-xs py-2.5 px-5 font-bold flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Retake Assessment</span>
            </Link>
            <Link
              href="/student/dashboard"
              className="btn-primary text-xs py-2.5 px-6 font-bold flex items-center justify-center gap-1.5"
            >
              <span>Return to Dashboard</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Question Feedback Breakdown */}
      {attempt.answers && attempt.answers.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-jpdark">Question Feedback Breakdown</h2>
          <div className="space-y-3">
            {attempt.answers.map((ans: any, i: number) => (
              <div
                key={ans.id}
                className={`card-jp p-4 border text-xs space-y-2 ${
                  ans.is_correct ? 'border-emerald-200 bg-emerald-50/30' : 'border-rose-200 bg-rose-50/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-jpdark">
                    Q{i + 1}. {ans.question?.question_text}
                  </span>
                  <span
                    className={`font-bold shrink-0 ${
                      ans.is_correct ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {ans.is_correct ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
                {ans.question?.explanation && (
                  <p className="text-[11px] text-jpmuted italic pt-1 border-t border-slate-200">
                    Explanation: {ans.question.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
