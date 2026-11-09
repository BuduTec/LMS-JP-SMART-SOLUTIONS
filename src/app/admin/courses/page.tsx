import React from 'react';
import Link from 'next/link';
import { createClient, getSupabaseConfig } from '@/lib/supabase/server';
import { getStoreCourses } from '@/lib/admin-store';
import { Course } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Plus, Edit } from 'lucide-react';
import { publishCourse } from '@/actions/admin';

export default async function AdminCoursesPage() {
  const { isConfigured } = getSupabaseConfig();
  let courses: Course[] = getStoreCourses();

  if (isConfigured) {
    const supabase = await createClient();
    const { data: coursesData } = await supabase
      .from('courses')
      .select(`
        *,
        category:categories(name)
      `)
      .order('sort_order', { ascending: true });

    if (coursesData && coursesData.length > 0) {
      courses = coursesData as unknown as Course[];
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-jpdark tracking-tight">Course Catalogue Manager</h1>
          <p className="text-xs sm:text-sm text-jpmuted mt-0.5">
            Create, edit, structure modules, and publish engineering masterclasses.
          </p>
        </div>
        <Link href="/admin/courses/new" className="btn-primary text-xs py-2.5 px-5 font-bold flex items-center gap-1.5">
          <Plus className="h-4 w-4" />
          <span>Create New Course</span>
        </Link>
      </div>

      <div className="card-jp overflow-hidden border border-slate-200 bg-white">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="p-4 pl-5">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Status</th>
              <th className="p-4">Tuition (NGN)</th>
              <th className="p-4 text-right pr-5">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {courses.map((course) => {
              const isPublished = course.status === 'published';
              const togglePublishAction = publishCourse.bind(null, course.id, !isPublished);

              return (
                <tr key={course.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 pl-5 font-bold text-jpdark max-w-xs">
                    <div>{course.title}</div>
                    <span className="text-[11px] text-jpmuted font-normal">/{course.slug}</span>
                  </td>
                  <td className="p-4 text-jpmuted">
                    {course.category?.name || 'Uncategorized'}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        isPublished
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {course.status}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-jpdark">
                    {formatCurrency(course.price, course.currency)}
                  </td>
                  <td className="p-4 text-right pr-5 space-x-2">
                    <Link
                      href={`/admin/courses/${course.id}`}
                      className="btn-outline text-[11px] py-1.5 px-3 inline-flex items-center gap-1"
                    >
                      <Edit className="h-3 w-3" />
                      <span>Edit & Curriculum</span>
                    </Link>

                    <form action={togglePublishAction} className="inline-block">
                      <button
                        type="submit"
                        className={`text-[11px] font-bold px-3 py-1.5 rounded-full transition-colors ${
                          isPublished
                            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {isPublished ? 'Unpublish' : 'Publish Live'}
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
