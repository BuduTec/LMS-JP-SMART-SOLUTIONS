import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';

export default async function InstructorStudentsPage() {
  const supabase = await createClient();

  const { data: enrolments } = await supabase
    .from('enrolments')
    .select(`
      *,
      student:profiles(full_name, email, phone),
      course:courses(title)
    `)
    .order('enrolled_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-jpdark tracking-tight">My Course Students</h1>
        <p className="text-xs sm:text-sm text-jpmuted mt-0.5">
          Directory of enrolled participants across your technical curricula.
        </p>
      </div>

      <div className="card-jp overflow-hidden border border-slate-200 bg-white">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="p-4 pl-5">Student</th>
              <th className="p-4">Contact</th>
              <th className="p-4">Enrolled Course</th>
              <th className="p-4 pr-5 text-right">Enrolled At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(enrolments || []).map((e: any) => (
              <tr key={e.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="p-4 pl-5">
                  <div className="font-bold text-jpdark">{e.student?.full_name || 'Student'}</div>
                  <div className="text-[11px] text-jpmuted">{e.student?.email}</div>
                </td>
                <td className="p-4 text-jpmuted">{e.student?.phone || '—'}</td>
                <td className="p-4 font-semibold text-jpdark">{e.course?.title}</td>
                <td className="p-4 pr-5 text-right text-jpmuted">{formatDate(e.enrolled_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
