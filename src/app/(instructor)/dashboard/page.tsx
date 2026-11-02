import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { BookOpen, Users, CheckCircle2, Award, Plus, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default async function InstructorDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch courses assigned to instructor
  const { data: courses } = await supabase
    .from('courses')
    .select(`
      id,
      title,
      status,
      category:categories(name),
      enrolments(count)
    `)
    .or(`instructor_id.eq.${user.id},instructor_id.is.null`);

  const assignedCourses = courses || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-jpdark tracking-tight">Instructor Hub</h1>
          <p className="text-xs sm:text-sm text-jpmuted mt-0.5">
            Manage your engineering courses, student submissions, and technical quizzes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/instructor/assessments/new" className="btn-primary text-xs py-2 px-4 font-bold">
            + New Assessment
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
        <Card className="border border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-jpmuted">
              Assigned Courses
            </CardTitle>
            <BookOpen className="h-4 w-4 text-jpblue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-jpdark">
              {assignedCourses.length}
            </div>
            <p className="text-[11px] text-jpmuted mt-1">Curricula in progress</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-jpmuted">
              Course Students
            </CardTitle>
            <Users className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-jpdark">
              {assignedCourses.reduce((sum, c: any) => sum + (c.enrolments?.[0]?.count || 0), 0)}
            </div>
            <p className="text-[11px] text-jpmuted mt-1">Total active enrolments</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-jpmuted">
              Assessments
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-jpcyan" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-jpdark">Active</div>
            <p className="text-[11px] text-jpmuted mt-1">Quiz modules monitored</p>
          </CardContent>
        </Card>
      </div>

      {/* Courses List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-jpdark">Assigned Engineering Masterclasses</h2>
        <div className="card-jp overflow-hidden border border-slate-200 bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4 pl-5">Course Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Students</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assignedCourses.map((c: any) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 pl-5 font-bold text-jpdark">{c.title}</td>
                  <td className="p-4 text-jpmuted">{c.category?.name || 'Power Systems'}</td>
                  <td className="p-4 font-bold text-jpdark">
                    {c.enrolments?.[0]?.count || 0} students
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4 text-right pr-5">
                    <Link
                      href={`/instructor/courses/${c.id}`}
                      className="btn-outline text-[11px] py-1.5 px-3 font-semibold"
                    >
                      Manage Modules
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
