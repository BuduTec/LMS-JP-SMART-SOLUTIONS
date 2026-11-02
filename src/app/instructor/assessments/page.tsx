import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { CheckCircle2, Plus, Clock, Award } from 'lucide-react';

export default async function InstructorAssessmentsPage() {
  const supabase = await createClient();

  const { data: assessments } = await supabase
    .from('assessments')
    .select(`
      *,
      course:courses(title),
      questions(count)
    `)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-jpdark tracking-tight">Assessment Bank</h1>
          <p className="text-xs sm:text-sm text-jpmuted mt-0.5">
            Create and maintain quizzes and certification tests for course cohorts.
          </p>
        </div>
        <Link
          href="/instructor/assessments/new"
          className="btn-primary text-xs py-2 px-5 font-bold flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" />
          <span>New Assessment</span>
        </Link>
      </div>

      <div className="card-jp overflow-hidden border border-slate-200 bg-white">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="p-4 pl-5">Assessment Title</th>
              <th className="p-4">Associated Course</th>
              <th className="p-4">Pass Mark</th>
              <th className="p-4">Time Limit</th>
              <th className="p-4 pr-5 text-right">Questions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(assessments || []).map((a: any) => (
              <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="p-4 pl-5 font-bold text-jpdark">{a.title}</td>
                <td className="p-4 text-jpmuted">{a.course?.title}</td>
                <td className="p-4 font-bold text-emerald-700">{a.pass_mark}%</td>
                <td className="p-4 text-jpmuted">
                  {a.time_limit_minutes ? `${a.time_limit_minutes} mins` : 'No limit'}
                </td>
                <td className="p-4 pr-5 text-right font-bold text-jpdark">
                  {a.questions?.[0]?.count || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
