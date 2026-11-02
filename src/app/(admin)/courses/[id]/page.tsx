import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Course, Module, Lesson } from '@/types';
import { updateCourse, publishCourse } from '@/actions/admin';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Plus, FileText, Video, BookOpen } from 'lucide-react';

interface EditCoursePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminEditCoursePage({ params }: EditCoursePageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch course with modules and lessons
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
  const { data: categories } = await supabase.from('categories').select('*').order('sort_order');

  const boundUpdate = updateCourse.bind(null, course.id);
  const modules = ((course.modules || []) as Module[]).sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/admin/courses" className="text-xs font-bold text-jpblue flex items-center gap-1 hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Courses</span>
        </Link>
        <Link
          href={`/courses/${course.slug}`}
          target="_blank"
          className="btn-outline text-xs py-1.5 px-3 font-semibold"
        >
          View Public Page
        </Link>
      </div>

      {/* Edit Form */}
      <Card className="border border-slate-200 bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-extrabold text-jpdark">Edit Course Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={boundUpdate as any} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Course Title</Label>
              <Input id="title" name="title" defaultValue={course.title} required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="shortDescription">Short Description</Label>
              <Input
                id="shortDescription"
                name="shortDescription"
                defaultValue={course.short_description || ''}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Full Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={course.description || ''}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="categoryId">Category</Label>
                <select
                  id="categoryId"
                  name="categoryId"
                  defaultValue={course.category_id || ''}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="">Select Category</option>
                  {(categories || []).map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="price">Tuition Fee (NGN)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  defaultValue={course.price || ''}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  defaultValue={course.status}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm bg-white font-semibold"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" className="btn-primary text-xs py-2 px-6 font-bold flex items-center gap-1.5">
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Curriculum Manager */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-jpdark">Course Curriculum Modules ({modules.length})</h2>
        </div>

        <div className="space-y-4">
          {modules.map((mod, modIdx) => (
            <Card key={mod.id} className="border border-slate-200 bg-white">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="font-bold text-sm text-jpdark">
                  Module {modIdx + 1}: {mod.title}
                </span>
                <span className="text-xs text-jpmuted">
                  {mod.lessons?.length || 0} lessons
                </span>
              </div>
              <CardContent className="p-4 divide-y divide-slate-100">
                {(mod.lessons || []).map((lesson: any) => (
                  <div key={lesson.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {lesson.type === 'video' ? (
                        <Video className="h-4 w-4 text-jpblue" />
                      ) : (
                        <FileText className="h-4 w-4 text-jpmuted" />
                      )}
                      <span className="font-medium text-jpdark">{lesson.title}</span>
                    </div>
                    <span className="text-jpmuted font-mono text-[10px]">
                      {lesson.video_cf_uid ? `CF: ${lesson.video_cf_uid.substring(0, 8)}...` : 'No video UID'}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
