import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CheckCircle2, AlertCircle, Clock, ArrowRight, Award } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default async function StudentAssessmentsListPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Fetch student enrolments
  const { data: enrolments } = await supabase
    .from('enrolments')
    .select('course_id')
    .eq('student_id', user.id)
    .eq('is_active', true);

  const courseIds = (enrolments || []).map((e) => e.course_id);

  // Fetch assessments for these courses
  let assessments: any[] = [];
  if (courseIds.length > 0) {
    const { data } = await supabase
      .from('assessments')
      .select(`
        *,
        course:courses(title),
        attempts:assessment_attempts(
          id,
          score,
          passed,
          submitted_at
        )
      `)
      .in('course_id', courseIds)
      .eq('is_published', true);

    assessments = data || [];
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-jpdark tracking-tight">Assessments & Quizzes</h1>
        <p className="text-xs sm:text-sm text-jpmuted mt-0.5">
          Verify your mastery of power system models and relay coordination.
        </p>
      </div>

      {assessments.length > 0 ? (
        <div className="space-y-4">
          {assessments.map((a) => {
            const userAttempts = (a.attempts || []).filter(
              (att: any) => att.submitted_at !== null
            );
            const highestScore = userAttempts.reduce(
              (max: number, att: any) => Math.max(max, att.score || 0),
              0
            );
            const hasPassed = userAttempts.some((att: any) => att.passed);

            return (
              <div
                key={a.id}
                className="card-jp p-6 border border-[#D5E1ED] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-jpblue bg-jpblue-50 px-2 py-0.5 rounded-full">
                    {a.course?.title || 'Engineering Course'}
                  </span>
                  <h3 className="font-bold text-base text-jpdark">{a.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-jpmuted">
                    <span>Pass mark: {a.pass_mark}%</span>
                    {a.time_limit_minutes && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {a.time_limit_minutes} mins
                      </span>
                    )}
                    <span>
                      Attempts: {userAttempts.length}
                      {a.max_attempts ? ` / ${a.max_attempts}` : ''}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {hasPassed ? (
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Passed ({highestScore}%)
                      </span>
                      <Link
                        href={`/student/assessments/${a.id}`}
                        className="btn-outline text-xs py-2 px-4 font-semibold"
                      >
                        Retake
                      </Link>
                    </div>
                  ) : (
                    <Link
                      href={`/student/assessments/${a.id}`}
                      className="btn-primary text-xs py-2 px-5 font-bold flex items-center gap-1.5"
                    >
                      <span>{userAttempts.length > 0 ? 'Retry Quiz' : 'Take Quiz'}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card-jp p-12 text-center space-y-3 border border-dashed border-[#D5E1ED]">
          <Award className="h-10 w-10 text-jpmuted mx-auto" />
          <h3 className="text-base font-bold text-jpdark">No assessments currently assigned</h3>
          <p className="text-xs text-jpmuted max-w-sm mx-auto leading-relaxed">
            As you progress through your enrolled course lessons, module quizzes and final tests will unlock here.
          </p>
        </div>
      )}
    </div>
  );
}
