import React from 'react';
import Link from 'next/link';
import { createClient, getSupabaseConfig } from '@/lib/supabase/server';
import { getStoreAssessments } from '@/lib/admin-store';
import { Plus, CheckCircle2 } from 'lucide-react';

export default async function AdminAssessmentsPage() {
  const { isConfigured } = getSupabaseConfig();
  let assessments: any[] = getStoreAssessments();

  if (isConfigured) {
    const supabase = await createClient();
    const { data: dbAssessments } = await supabase
      .from('assessments')
      .select(`
        *,
        course:courses(title),
        questions(count)
      `)
      .order('created_at', { ascending: false });

    if (dbAssessments && dbAssessments.length > 0) {
      assessments = dbAssessments;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-jpdark tracking-tight">
            Technical Assessments & Certification Exams
          </h1>
          <p className="text-xs sm:text-sm text-jpmuted mt-0.5">
            Monitor graded engineering quizzes, pass thresholds, and time limits across courses.
          </p>
        </div>
        <Link
          href="/instructor/assessments/new"
          className="btn-primary text-xs py-2.5 px-5 font-bold flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" />
          <span>Create Assessment</span>
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
              <th className="p-4 pr-5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {assessments.map((a: any) => (
              <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="p-4 pl-5 font-bold text-jpdark flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-jpblue shrink-0" />
                  <span>{a.title}</span>
                </td>
                <td className="p-4 text-jpmuted">{a.course?.title || 'Engineering Masterclass'}</td>
                <td className="p-4 font-bold text-emerald-700">{a.pass_mark}%</td>
                <td className="p-4 text-jpmuted">
                  {a.time_limit_minutes ? `${a.time_limit_minutes} mins` : 'Untimed'}
                </td>
                <td className="p-4 pr-5 text-right">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700">
                    {a.is_published !== false ? 'Published' : 'Draft'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
