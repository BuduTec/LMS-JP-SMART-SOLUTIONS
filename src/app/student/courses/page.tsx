import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient, getSupabaseConfig } from '@/lib/supabase/server';
import { SEEDED_COURSES } from '@/lib/constants';
import { Enrolment } from '@/types';
import { BookOpen, PlayCircle, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default async function StudentCoursesPage() {
  const { isConfigured } = getSupabaseConfig();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: enrolmentsData } = await supabase
    .from('enrolments')
    .select(`
      *,
      course:courses(
        id,
        title,
        slug,
        image_url,
        description,
        total_lessons,
        duration_text,
        category:categories(name)
      )
    `)
    .eq('student_id', user.id)
    .eq('is_active', true)
    .order('enrolled_at', { ascending: false });

  let enrolments: Enrolment[] = (enrolmentsData as unknown as Enrolment[]) || [];
  if (!isConfigured && enrolments.length === 0) {
    enrolments = SEEDED_COURSES.slice(0, 3).map((course, idx) => ({
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

  const defaultImage =
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-jpdark tracking-tight">My Enrolled Courses</h1>
        <p className="text-xs sm:text-sm text-jpmuted mt-1">
          Access your courses, lesson video streams, and downloadable project templates.
        </p>
      </div>

      {enrolments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolments.map((enrolment) => {
            const course = enrolment.course;
            if (!course) return null;

            return (
              <div
                key={enrolment.id}
                className="card-jp card-jp-hover overflow-hidden border border-[#D5E1ED] flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/9] w-full bg-slate-900">
                    <Image
                      src={course.image_url || defaultImage}
                      alt={course.title}
                      fill
                      referrerPolicy="no-referrer"
                      className="object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <Badge className="bg-jpblue/90 text-white text-[10px]">
                        {course.category?.name || 'Engineering'}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-base text-jpdark line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-jpmuted line-clamp-2">
                      {course.description || 'Hands-on practical engineering modules.'}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href={`/student/courses/${course.id}`}
                    className="btn-primary w-full text-center text-xs py-2.5 font-bold flex items-center justify-center gap-1.5"
                  >
                    <PlayCircle className="h-4 w-4" />
                    <span>Open Course Syllabus</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card-jp p-12 text-center space-y-4 max-w-lg mx-auto border border-dashed border-[#D5E1ED]">
          <BookOpen className="h-10 w-10 text-jpmuted mx-auto" />
          <h3 className="text-base font-bold text-jpdark">No active enrolments</h3>
          <p className="text-xs text-jpmuted leading-relaxed">
            You have not enrolled in any training masterclass yet. Browse our course catalogue to get started.
          </p>
          <div className="pt-2">
            <Link href="/courses" className="btn-primary text-xs py-2.5 px-6 font-bold inline-flex items-center gap-1.5">
              <span>Browse All Courses</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
