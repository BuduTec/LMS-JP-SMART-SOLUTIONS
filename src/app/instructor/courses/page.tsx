import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { BookOpen, Edit } from 'lucide-react';

export default async function InstructorCoursesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: courses } = await supabase
    .from('courses')
    .select(`
      *,
      category:categories(name),
      enrolments(count)
    `)
    .order('sort_order', { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-jpdark tracking-tight">Assigned Courses</h1>
        <p className="text-xs sm:text-sm text-jpmuted mt-0.5">
          Curate course modules, upload ETAP calculation spreadsheets, and organize lessons.
        </p>
      </div>

      <div className="card-jp overflow-hidden border border-slate-200 bg-white">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="p-4 pl-5">Course Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Enrolled Students</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right pr-5">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(courses || []).map((c: any) => (
              <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="p-4 pl-5 font-bold text-jpdark">{c.title}</td>
                <td className="p-4 text-jpmuted">{c.category?.name || 'Power Systems'}</td>
                <td className="p-4 font-bold text-jpdark">{c.enrolments?.[0]?.count || 0}</td>
                <td className="p-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                    {c.status}
                  </span>
                </td>
                <td className="p-4 text-right pr-5">
                  <Link
                    href={`/instructor/courses/${c.id}`}
                    className="btn-outline text-[11px] py-1.5 px-3 font-semibold inline-flex items-center gap-1"
                  >
                    <Edit className="h-3 w-3" />
                    <span>Manage</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
