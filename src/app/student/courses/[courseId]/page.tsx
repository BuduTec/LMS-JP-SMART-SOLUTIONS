import React from 'react';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient, getSupabaseConfig } from '@/lib/supabase/server';
import { SEEDED_COURSES } from '@/lib/constants';
import { Course, Module, Lesson, LessonProgress } from '@/types';
import {
  CheckCircle2,
  Circle,
  PlayCircle,
  FileText,
  Lock,
  ArrowRight,
  Download,
  BookOpen,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface StudentCoursePageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function StudentCourseOverviewPage({
  params,
}: StudentCoursePageProps) {
  const { courseId } = await params;
  const { isConfigured } = getSupabaseConfig();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const seededCourse = SEEDED_COURSES.find((c) => c.id === courseId || c.slug === courseId);

  if (isConfigured && !seededCourse) {
    // Verify enrolment
    const { data: enrolment } = await supabase
      .from('enrolments')
      .select('id, is_active')
      .eq('student_id', user.id)
      .eq('course_id', courseId)
      .eq('is_active', true)
      .single();

    if (!enrolment) {
      redirect(`/courses`);
    }
  }

  // Fetch course structure
  const { data: courseData } = await supabase
    .from('courses')
    .select(`
      *,
      modules(
        id,
        title,
        description,
        sort_order,
        lessons(
          id,
          title,
          type,
          video_duration_seconds,
          sort_order,
          resources:lesson_resources(
            id,
            title,
            file_url,
            file_type,
            file_size_bytes
          )
        )
      )
    `)
    .eq('id', courseId)
    .maybeSingle();

  const resolvedCourse = courseData || seededCourse;
  if (!resolvedCourse) notFound();

  const course = resolvedCourse as unknown as Course;

  // Fetch user lesson progress
  const { data: progressData } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('student_id', user.id)
    .eq('course_id', courseId);

  const progressList: LessonProgress[] = (progressData as unknown as LessonProgress[]) || [];
  const completedLessonIds = new Set(
    progressList.filter((p) => p.completed).map((p) => p.lesson_id)
  );

  const modules = ((course.modules || []) as Module[]).sort(
    (a, b) => a.sort_order - b.sort_order
  );

  let totalLessons = 0;
  let firstIncompleteLessonId: string | null = null;
  const allResources: any[] = [];

  modules.forEach((mod) => {
    const lessons = ((mod.lessons || []) as Lesson[]).sort(
      (a, b) => a.sort_order - b.sort_order
    );
    totalLessons += lessons.length;
    lessons.forEach((l) => {
      if (!completedLessonIds.has(l.id) && !firstIncompleteLessonId) {
        firstIncompleteLessonId = l.id;
      }
      if (l.resources && l.resources.length > 0) {
        l.resources.forEach((r) => allResources.push({ ...r, lessonTitle: l.title }));
      }
    });
  });

  const percentComplete =
    totalLessons > 0 ? Math.round((completedLessonIds.size / totalLessons) * 100) : 0;

  // Fallback to first lesson if all complete
  const targetLessonId =
    firstIncompleteLessonId || (modules[0]?.lessons?.[0]?.id ?? null);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Course Header Banner */}
      <div className="card-jp p-8 bg-hero-gradient text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-3">
          <div className="text-xs font-semibold text-jpcyan uppercase tracking-wider">
            Enrolled Course Syllabus
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {course.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            {course.short_description || course.description}
          </p>

          <div className="pt-2 flex items-center gap-4 text-xs">
            <span className="font-semibold text-white">Progress: {percentComplete}%</span>
            <div className="w-48 bg-white/20 rounded-full h-2 overflow-hidden">
              <div
                className="bg-jpcyan h-full rounded-full transition-all duration-300"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
            <span className="text-slate-300">
              {completedLessonIds.size}/{totalLessons} lessons
            </span>
          </div>
        </div>

        {targetLessonId && (
          <Link
            href={`/student/courses/${course.id}/lessons/${targetLessonId}`}
            className="btn-cyan text-xs font-bold py-3.5 px-7 self-start md:self-auto flex items-center gap-2 shadow-lg"
          >
            <span>{percentComplete === 100 ? 'Review Lessons' : 'Continue Course'}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Module / Lesson Tree (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-jpdark">Course Modules & Lessons</h2>

          <div className="space-y-4">
            {modules.map((mod, modIdx) => {
              const lessons = ((mod.lessons || []) as Lesson[]).sort(
                (a, b) => a.sort_order - b.sort_order
              );

              return (
                <div
                  key={mod.id}
                  className="card-jp overflow-hidden border border-[#D5E1ED] bg-white"
                >
                  <div className="p-4 bg-jplight/80 border-b border-[#E1EBF5] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="h-6 w-6 rounded-md bg-jpblue-50 text-jpblue font-bold text-xs flex items-center justify-center">
                        {modIdx + 1}
                      </span>
                      <span className="font-bold text-sm text-jpdark">{mod.title}</span>
                    </div>
                    <span className="text-xs text-jpmuted font-medium">
                      {lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'}
                    </span>
                  </div>

                  <div className="divide-y divide-[#EAF0F6]">
                    {lessons.map((lesson) => {
                      const isDone = completedLessonIds.has(lesson.id);

                      return (
                        <Link
                          key={lesson.id}
                          href={`/student/courses/${course.id}/lessons/${lesson.id}`}
                          className="p-3.5 px-4 flex items-center justify-between text-xs hover:bg-jplight/60 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            {isDone ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                            ) : (
                              <Circle className="h-4 w-4 text-jpmuted/60 shrink-0" />
                            )}
                            <span
                              className={`font-medium group-hover:text-jpblue transition-colors ${
                                isDone ? 'text-jpdark/70' : 'text-jpdark'
                              }`}
                            >
                              {lesson.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-jpmuted">
                            {lesson.video_duration_seconds && (
                              <span>{Math.round(lesson.video_duration_seconds / 60)}m</span>
                            )}
                            <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 text-jpblue transition-opacity" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resources Panel (1 col) */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-jpdark">Course Downloads</h2>

          <div className="card-jp p-5 border border-[#D5E1ED] space-y-4 bg-white">
            <p className="text-xs text-jpmuted leading-relaxed">
              Download supplementary ETAP models, single-line diagrams, and calculation spreadsheets.
            </p>

            {allResources.length > 0 ? (
              <div className="space-y-2.5">
                {allResources.map((res: any) => (
                  <a
                    key={res.id}
                    href={res.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl border border-[#D5E1ED] hover:border-jpblue flex items-center justify-between text-xs text-jpdark hover:bg-jplight transition-colors group"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="h-4 w-4 text-jpblue shrink-0" />
                      <span className="font-semibold truncate">{res.title}</span>
                    </div>
                    <Download className="h-3.5 w-3.5 text-jpmuted group-hover:text-jpblue shrink-0 ml-2" />
                  </a>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-jplight text-center text-xs text-jpmuted">
                All templates and study files will appear here as you progress through lessons.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
