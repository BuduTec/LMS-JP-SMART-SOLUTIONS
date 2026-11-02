import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Course, Module } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft, Video, FileText } from 'lucide-react';

interface InstructorEditCourseProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function InstructorEditCoursePage({ params }: InstructorEditCourseProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: courseData } = await supabase
    .from('courses')
    .select(`
      *,
      modules(
        id,
        title,
        sort_order,
        lessons(
          id,
          title,
          type,
          video_cf_uid,
          sort_order
        )
      )
    `)
    .eq('id', id)
    .single();

  if (!courseData) notFound();

  const course = courseData as unknown as Course;
  const modules = ((course.modules || []) as Module[]).sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/instructor/courses" className="text-xs font-bold text-jpblue flex items-center gap-1 hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Instructor Courses</span>
        </Link>
      </div>

      <Card className="border border-slate-200 bg-white">
        <CardHeader>
          <span className="text-xs font-bold uppercase text-jpblue tracking-wider">Course Syllabus</span>
          <CardTitle className="text-xl font-extrabold text-jpdark">{course.title}</CardTitle>
          <p className="text-xs text-jpmuted">{course.short_description || course.description}</p>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-jpdark">Curriculum Modules & Lessons</h2>

        {modules.map((mod, i) => (
          <Card key={mod.id} className="border border-slate-200 bg-white">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-sm text-jpdark">
                Module {i + 1}: {mod.title}
              </span>
              <span className="text-xs text-jpmuted">{mod.lessons?.length || 0} lessons</span>
            </div>
            <CardContent className="p-4 divide-y divide-slate-100">
              {(mod.lessons || []).map((l: any) => (
                <div key={l.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {l.type === 'video' ? (
                      <Video className="h-4 w-4 text-jpblue" />
                    ) : (
                      <FileText className="h-4 w-4 text-jpmuted" />
                    )}
                    <span className="font-medium text-jpdark">{l.title}</span>
                  </div>
                  <span className="text-[10px] text-jpmuted font-mono">
                    {l.video_cf_uid ? `CF: ${l.video_cf_uid.substring(0, 8)}...` : 'Resource'}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
