import React from 'react';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Lesson, Course, Module, LessonResource } from '@/types';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  FileText,
  Download,
  BookOpen,
} from 'lucide-react';
import { maskEmail } from '@/lib/utils';
import { markLessonComplete } from '@/actions/student';
import { VideoPlayer } from '@/components/VideoPlayer';

interface LessonViewerPageProps {
  params: Promise<{
    courseId: string;
    lessonId: string;
  }>;
}

export default async function LessonViewerPage({ params }: LessonViewerPageProps) {
  const { courseId, lessonId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Verify active enrolment
  const { data: enrolment } = await supabase
    .from('enrolments')
    .select('id')
    .eq('student_id', user.id)
    .eq('course_id', courseId)
    .eq('is_active', true)
    .single();

  if (!enrolment) redirect('/courses');

  // Fetch current lesson
  const { data: lessonData } = await supabase
    .from('lessons')
    .select(`
      *,
      resources:lesson_resources(*)
    `)
    .eq('id', lessonId)
    .eq('course_id', courseId)
    .single();

  if (!lessonData) notFound();

  const lesson = lessonData as unknown as Lesson;

  // Fetch all lessons in course to find prev and next
  const { data: allLessonsData } = await supabase
    .from('lessons')
    .select('id, title, module_id, sort_order')
    .eq('course_id', courseId)
    .eq('is_published', true)
    .order('sort_order', { ascending: true });

  const allLessons = allLessonsData || [];
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // Check if current lesson is completed
  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('completed, last_position_seconds')
    .eq('student_id', user.id)
    .eq('lesson_id', lessonId)
    .maybeSingle();

  const isCompleted = progress?.completed ?? false;
  const initialPosition = progress?.last_position_seconds ?? 0;
  const maskedEmail = maskEmail(user.email || '');

  // Bound server action for mark as complete button
  const completeAction = markLessonComplete.bind(null, lessonId, courseId);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between text-xs pb-2 border-b border-[#E1EBF5]">
        <Link
          href={`/student/courses/${courseId}`}
          className="text-jpblue font-bold flex items-center gap-1.5 hover:underline"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Course Syllabus</span>
        </Link>

        <div className="flex items-center gap-3">
          {prevLesson && (
            <Link
              href={`/student/courses/${courseId}/lessons/${prevLesson.id}`}
              className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </Link>
          )}
          {nextLesson && (
            <Link
              href={`/student/courses/${courseId}/lessons/${nextLesson.id}`}
              className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Lesson Media Viewer */}
      <div className="card-jp overflow-hidden border border-[#D5E1ED] bg-white">
        {lesson.type === 'video' && (
          <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
            {/* Cloudflare Video Player with Watermark */}
            <VideoPlayer
              lessonId={lesson.id}
              videoUid={lesson.video_cf_uid}
              initialPosition={initialPosition}
              watermarkText={maskedEmail}
            />
          </div>
        )}

        {lesson.type === 'text' && (
          <div className="p-8 sm:p-10 prose max-w-none text-sm text-jpdark leading-relaxed">
            <h1 className="text-2xl font-extrabold text-jpdark">{lesson.title}</h1>
            <div className="mt-4 whitespace-pre-wrap">{lesson.content}</div>
          </div>
        )}

        {lesson.type === 'pdf' && (
          <div className="p-8 text-center space-y-4">
            <FileText className="h-12 w-12 text-jpblue mx-auto" />
            <h2 className="text-lg font-bold text-jpdark">{lesson.title}</h2>
            <p className="text-xs text-jpmuted max-w-md mx-auto">
              This module includes a PDF reading and technical guide.
            </p>
            {lesson.content && (
              <a
                href={lesson.content}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-xs py-2.5 px-6 font-bold inline-flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                <span>Open PDF Document</span>
              </a>
            )}
          </div>
        )}

        {/* Lesson Controls & Completion */}
        <div className="p-6 bg-[#F8FAFD] border-t border-[#E1EBF5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-jpdark">{lesson.title}</h2>
            <p className="text-xs text-jpmuted mt-0.5">
              {lesson.description || 'Watch the video lesson completely to master this technical topic.'}
            </p>
          </div>

          <form action={completeAction}>
            <button
              type="submit"
              disabled={isCompleted}
              className={`btn-pill text-xs py-2.5 px-5 font-bold flex items-center gap-2 transition-all ${
                isCompleted
                  ? 'bg-emerald-100 text-emerald-800 cursor-default'
                  : 'bg-jpblue text-white hover:bg-jpblue-600 shadow-sm'
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{isCompleted ? 'Lesson Completed' : 'Mark as Complete'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Resources Section if any */}
      {lesson.resources && lesson.resources.length > 0 && (
        <div className="card-jp p-6 border border-[#D5E1ED] bg-white space-y-3">
          <h3 className="font-bold text-sm text-jpdark">Lesson Downloads & Project Files</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {lesson.resources.map((res: LessonResource) => (
              <a
                key={res.id}
                href={res.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl border border-[#D5E1ED] hover:border-jpblue flex items-center justify-between text-xs text-jpdark hover:bg-jplight transition-colors"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <FileText className="h-4 w-4 text-jpblue shrink-0" />
                  <span className="font-semibold truncate">{res.title}</span>
                </div>
                <Download className="h-3.5 w-3.5 text-jpmuted shrink-0 ml-2" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
