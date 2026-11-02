import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  Clock,
  BookOpen,
  ShieldCheck,
  CheckCircle,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { createPublicClient } from '@/lib/supabase/server';
import { formatCurrency, formatDuration } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { SITE_CONFIG } from '@/lib/constants';
import { Course, Module, Lesson } from '@/types';

export const dynamic = 'force-dynamic';

interface CourseDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: CourseDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createPublicClient();

  const { data: course } = await supabase
    .from('courses')
    .select('title, short_description, meta_title, meta_description, image_url')
    .eq('slug', slug)
    .maybeSingle();

  if (!course) {
    return {
      title: 'Course Not Found',
    };
  }

  return {
    title: course.meta_title || `${course.title} | ${SITE_CONFIG.name}`,
    description: course.meta_description || course.short_description,
    openGraph: {
      title: course.title,
      description: course.short_description || undefined,
      images: course.image_url ? [course.image_url] : undefined,
    },
  };
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { slug } = await params;
  const supabase = createPublicClient();

  const { data: courseData } = await supabase
    .from('courses')
    .select(`
      *,
      category:categories(id, name, slug),
      instructor:profiles!courses_instructor_id_fkey(id, full_name, bio, avatar_url),
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
          is_preview,
          sort_order
        )
      )
    `)
    .eq('slug', slug)
    .maybeSingle();

  if (!courseData) {
    notFound();
  }

  const course = courseData as unknown as Course;

  const sortedModules = ((course.modules || []) as Module[]).sort(
    (a, b) => a.sort_order - b.sort_order
  );

  const defaultImage =
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80';

  const duration = course.total_duration_minutes
    ? formatDuration(course.total_duration_minutes)
    : course.duration_text || 'Self-paced';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.short_description || course.description,
    provider: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      sameAs: SITE_CONFIG.url,
    },
    educationalLevel: course.difficulty_level || 'Professional',
  };

  return (
    <div className="py-10 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="container-jp">
        <div className="text-xs text-jpmuted flex items-center gap-2 mb-4">
          <Link href="/" className="hover:text-jpblue">
            Home
          </Link>
          <span>/</span>
          <Link href="/courses" className="hover:text-jpblue">
            Courses
          </Link>
          <span>/</span>
          <span className="text-jpdark font-medium truncate max-w-xs">{course.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-jpblue text-white font-semibold">
                {course.category?.name || 'Power Systems'}
              </Badge>
              {course.difficulty_level && (
                <Badge variant="secondary" className="capitalize">
                  {course.difficulty_level}
                </Badge>
              )}
              <span className="text-xs text-jpmuted flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {course.mode}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-jpdark tracking-tight leading-tight">
              {course.title}
            </h1>

            <p className="text-base sm:text-lg text-jpmuted leading-relaxed">
              {course.short_description || course.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-jpdark/80 pt-2 border-y border-[#E1EBF5] py-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-jpblue" />
                <span>{duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-jpblue" />
                <span>
                  {course.total_lessons > 0
                    ? `${course.total_lessons} Lessons`
                    : `${sortedModules.length} Modules`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-jpblue" />
                <span>Practical Engineering Certificate</span>
              </div>
            </div>

            <div className="relative aspect-[16/9] w-full rounded-[22px] overflow-hidden shadow-jpcard border border-[#E1EBF5]">
              <Image
                src={course.image_url || defaultImage}
                alt={course.title}
                fill
                priority
                className="object-cover"
              />
            </div>

            {course.learning_objectives && course.learning_objectives.length > 0 && (
              <div className="card-jp p-8 space-y-4">
                <h2 className="text-xl font-bold text-jpdark">What You&apos;ll Learn</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {course.learning_objectives.map((obj, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-jpdark/90">
                      <CheckCircle className="h-4 w-4 text-jpblue shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="card-jp p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-jpdark">Course Curriculum</h2>
                  <p className="text-xs text-jpmuted mt-1">
                    {sortedModules.length} Modules • Structured from fundamentals to practical simulation
                  </p>
                </div>
              </div>

              {sortedModules.length > 0 ? (
                <div className="space-y-4">
                  {sortedModules.map((module, idx) => {
                    const lessons = ((module.lessons || []) as Lesson[]).sort(
                      (a, b) => a.sort_order - b.sort_order
                    );
                    return (
                      <div
                        key={module.id}
                        className="border border-[#E1EBF5] rounded-2xl overflow-hidden bg-white"
                      >
                        <div className="p-4 bg-jplight/60 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="h-7 w-7 rounded-lg bg-jpblue-50 text-jpblue font-bold text-xs flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-sm text-jpdark">{module.title}</span>
                          </div>
                          <span className="text-xs text-jpmuted font-medium">
                            {lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'}
                          </span>
                        </div>
                        {lessons.length > 0 && (
                          <div className="p-2 divide-y divide-[#EAF0F6]">
                            {lessons.map((lesson) => (
                              <div
                                key={lesson.id}
                                className="py-2.5 px-3 flex items-center justify-between text-xs text-jpdark hover:bg-jplight/40 rounded-lg transition-colors"
                              >
                                <div className="flex items-center gap-2.5">
                                  {lesson.is_preview ? (
                                    <BookOpen className="h-3.5 w-3.5 text-jpblue" />
                                  ) : (
                                    <Lock className="h-3.5 w-3.5 text-jpmuted" />
                                  )}
                                  <span className="font-medium">{lesson.title}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {lesson.is_preview && (
                                    <Badge variant="cyan" className="text-[10px] py-0 px-2">
                                      Preview
                                    </Badge>
                                  )}
                                  {lesson.video_duration_seconds && (
                                    <span className="text-jpmuted">
                                      {Math.round(lesson.video_duration_seconds / 60)}m
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-jplight text-center text-xs text-jpmuted">
                  Detailed lesson modules are being populated for this course. Full syllabus available upon enrolment.
                </div>
              )}
            </div>
          </div>

          <div className="lg:sticky lg:top-24 space-y-6">
            <div className="card-jp p-7 shadow-jphover border border-[#D5E1ED] space-y-6">
              <div>
                <span className="text-xs text-jpmuted uppercase tracking-wider font-semibold">
                  Course Investment
                </span>
                <div className="text-3xl font-extrabold text-jpdark mt-1">
                  {formatCurrency(course.price, course.currency)}
                </div>
                <p className="text-xs text-jpmuted mt-1">
                  Single payment • Full lifetime access to lessons & workbooks
                </p>
              </div>

              <Link
                href={`/checkout/${course.id}`}
                className="btn-primary w-full text-center flex items-center justify-center gap-2 py-3.5 font-bold shadow-lg"
              >
                <span>Enrol Now</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <div className="space-y-3 pt-4 border-t border-[#E1EBF5] text-xs text-jpdark/80">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-jpblue" />
                  <span>Interactive lesson videos & slides</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-jpblue" />
                  <span>Downloadable ETAP / design project files</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-jpblue" />
                  <span>Practical assessments & verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-jpblue" />
                  <span>Direct instructor support via portal</span>
                </div>
              </div>

              <div className="pt-2 text-center">
                <a
                  href={SITE_CONFIG.contact.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-jpblue hover:underline"
                >
                  Questions about this course? Chat with us on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
