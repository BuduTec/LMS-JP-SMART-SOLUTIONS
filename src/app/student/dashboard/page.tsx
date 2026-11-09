import React from 'react';
import Link from 'next/link';
import { createClient, getSupabaseConfig } from '@/lib/supabase/server';
import { SEEDED_COURSES } from '@/lib/constants';
import { BookOpen, CheckCircle2, Award, Clock, ArrowRight, PlayCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Enrolment, LessonProgress } from '@/types';

export default async function StudentDashboardPage() {
  const { isConfigured } = getSupabaseConfig();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', user.id)
    .single();

  // Enrolments with course info
  const { data: enrolmentsData } = await supabase
    .from('enrolments')
    .select(`
      *,
      course:courses(
        id,
        title,
        slug,
        image_url,
        total_lessons,
        category:categories(name)
      )
    `)
    .eq('student_id', user.id)
    .eq('is_active', true);

  let enrolments: Enrolment[] = (enrolmentsData as unknown as Enrolment[]) || [];
  if (!isConfigured && enrolments.length === 0) {
    enrolments = SEEDED_COURSES.slice(0, 2).map((course, idx) => ({
      id: `demo-enrol-${idx + 1}`,
      student_id: user.id,
      course_id: course.id,
      payment_id: null,
      enrolled_at: '2026-11-02T00:00:00Z',
      expires_at: null,
      is_active: true,
      enrolled_by: null,
      notes: 'Active Enrolment',
      course,
    }));
  }

  // Completed lessons count
  const { count: completedLessonsCount } = await supabase
    .from('lesson_progress')
    .select('id', { count: 'exact', head: true })
    .eq('student_id', user.id)
    .eq('completed', true);

  // Completed courses count
  const { count: completedCoursesCount } = await supabase
    .from('course_completions')
    .select('id', { count: 'exact', head: true })
    .eq('student_id', user.id);

  // Passed assessments count
  const { count: passedAssessmentsCount } = await supabase
    .from('assessment_attempts')
    .select('id', { count: 'exact', head: true })
    .eq('student_id', user.id)
    .eq('passed', true);

  // Recent progress
  const { data: recentProgress } = await supabase
    .from('lesson_progress')
    .select(`
      *,
      lesson:lessons(id, title, course_id, course:courses(id, title))
    `)
    .eq('student_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(5);

  const studentName = profile?.full_name || user.email?.split('@')[0] || 'Engineer';

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="card-jp p-8 bg-hero-gradient text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="eyebrow bg-white/10 text-jpcyan border-white/20">
            Student Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {studentName}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-lg">
            Track your ongoing ETAP modules, study progress, and assessment completions.
          </p>
        </div>
        <Link
          href="/courses"
          className="btn-cyan text-xs font-bold py-3 px-6 self-start md:self-auto flex items-center gap-2"
        >
          <span>Explore More Courses</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border border-[#D5E1ED]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-jpmuted">
              Enrolled Courses
            </CardTitle>
            <BookOpen className="h-4 w-4 text-jpblue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-jpdark">{enrolments.length}</div>
            <p className="text-[11px] text-jpmuted mt-1">Active training curricula</p>
          </CardContent>
        </Card>

        <Card className="border border-[#D5E1ED]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-jpmuted">
              Lessons Completed
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-jpdark">
              {completedLessonsCount || 0}
            </div>
            <p className="text-[11px] text-jpmuted mt-1">Masterclasses finished</p>
          </CardContent>
        </Card>

        <Card className="border border-[#D5E1ED]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-jpmuted">
              Courses Finished
            </CardTitle>
            <Award className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-jpdark">
              {completedCoursesCount || 0}
            </div>
            <p className="text-[11px] text-jpmuted mt-1">100% completed</p>
          </CardContent>
        </Card>

        <Card className="border border-[#D5E1ED]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-jpmuted">
              Assessments Passed
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-jpcyan" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-jpdark">
              {passedAssessmentsCount || 0}
            </div>
            <p className="text-[11px] text-jpmuted mt-1">Technical quizzes passed</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: My Courses & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Enrolled Courses (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-jpdark">My Active Courses</h2>
            <Link href="/student/courses" className="text-xs font-semibold text-jpblue hover:underline">
              View all
            </Link>
          </div>

          {enrolments.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {enrolments.map((enrolment) => (
                <div
                  key={enrolment.id}
                  className="card-jp p-5 border border-[#D5E1ED] flex flex-col justify-between space-y-4"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-jpblue bg-jpblue-50 px-2 py-0.5 rounded-full">
                      {enrolment.course?.category?.name || 'Power Systems'}
                    </span>
                    <h3 className="font-bold text-sm text-jpdark mt-2 line-clamp-2">
                      {enrolment.course?.title}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <Link
                      href={`/student/courses/${enrolment.course_id}`}
                      className="btn-primary w-full text-center text-xs py-2.5 font-bold flex items-center justify-center gap-1.5"
                    >
                      <PlayCircle className="h-3.5 w-3.5" />
                      <span>Continue Learning</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card-jp p-8 text-center space-y-3 border border-dashed border-[#D5E1ED]">
              <BookOpen className="h-8 w-8 text-jpmuted mx-auto" />
              <h3 className="text-sm font-bold text-jpdark">You are not yet enrolled in any course</h3>
              <p className="text-xs text-jpmuted max-w-sm mx-auto">
                Explore our engineering masterclasses in ETAP, power system protection, and solar PV.
              </p>
              <div className="pt-1">
                <Link href="/courses" className="btn-primary text-xs py-2 px-5 font-bold">
                  Browse Course Catalogue
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity (1 col) */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-jpdark">Recent Progress</h2>
          <div className="card-jp p-5 border border-[#D5E1ED] divide-y divide-[#EAF0F6]">
            {recentProgress && recentProgress.length > 0 ? (
              recentProgress.map((item: any) => (
                <div key={item.id} className="py-3 first:pt-0 last:pb-0 space-y-1">
                  <div className="text-xs font-semibold text-jpdark line-clamp-1">
                    {item.lesson?.title}
                  </div>
                  <div className="text-[11px] text-jpmuted flex items-center justify-between">
                    <span>{item.lesson?.course?.title}</span>
                    {item.completed && (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Done
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-jpmuted">
                No recent study activity yet. Select a course to start streaming lessons!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
