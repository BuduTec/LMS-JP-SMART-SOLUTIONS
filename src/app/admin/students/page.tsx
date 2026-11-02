import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import { deactivateStudent } from '@/actions/admin';
import { Users, UserX, UserCheck, Shield } from 'lucide-react';

export default async function AdminStudentsPage() {
  const supabase = await createClient();

  const { data: students } = await supabase
    .from('profiles')
    .select(`
      *,
      enrolments(count)
    `)
    .eq('role', 'student')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-jpdark tracking-tight">Student Directory</h1>
        <p className="text-xs sm:text-sm text-jpmuted mt-0.5">
          View all registered engineers, active enrolments, and access statuses.
        </p>
      </div>

      <div className="card-jp overflow-hidden border border-slate-200 bg-white">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="p-4 pl-5">Student</th>
              <th className="p-4">Contact</th>
              <th className="p-4">Enrolments</th>
              <th className="p-4">Joined Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right pr-5">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(students || []).map((student: any) => {
              const toggleActive = deactivateStudent.bind(null, student.id, !student.is_active);
              const enrolmentCount = student.enrolments?.[0]?.count ?? 0;

              return (
                <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 pl-5">
                    <div className="font-bold text-jpdark">{student.full_name || 'Anonymous Student'}</div>
                    <span className="text-[11px] text-jpmuted">{student.email}</span>
                  </td>
                  <td className="p-4 text-jpmuted">
                    {student.phone || 'No phone provided'}
                  </td>
                  <td className="p-4 font-bold text-jpdark">
                    {enrolmentCount} {enrolmentCount === 1 ? 'course' : 'courses'}
                  </td>
                  <td className="p-4 text-jpmuted">{formatDate(student.created_at)}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        student.is_active
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {student.is_active ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="p-4 text-right pr-5">
                    <form action={toggleActive} className="inline-block">
                      <button
                        type="submit"
                        className={`text-[11px] font-bold px-3 py-1.5 rounded-full transition-colors ${
                          student.is_active
                            ? 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {student.is_active ? 'Deactivate' : 'Reactivate'}
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
