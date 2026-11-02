import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, BookOpen, ArrowRight } from 'lucide-react';
import { Course } from '@/types';
import { formatCurrency, formatDuration } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const categoryName = course.category?.name || 'Engineering';
  const duration = course.total_duration_minutes
    ? formatDuration(course.total_duration_minutes)
    : course.duration_text || 'Self-paced';

  const defaultPlaceholder = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="card-jp card-jp-hover flex flex-col h-full overflow-hidden group border border-[#E1EBF5]">
      {/* Course Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
        <Image
          src={course.image_url || defaultPlaceholder}
          alt={course.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Badges on image */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <Badge className="bg-jpblue/90 backdrop-blur-sm text-white font-medium border-none shadow-sm text-[11px] px-2.5 py-0.5">
            {categoryName}
          </Badge>
          {course.difficulty_level && (
            <Badge variant="secondary" className="capitalize text-[11px] bg-white/90 backdrop-blur-sm text-jpdark border-none shadow-sm">
              {course.difficulty_level}
            </Badge>
          )}
        </div>

        {course.mode && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="text-white text-xs font-semibold px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {course.mode}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-jpdark group-hover:text-jpblue transition-colors line-clamp-2 leading-snug">
            <Link href={`/courses/${course.slug}`}>{course.title}</Link>
          </h3>
          <p className="mt-2 text-sm text-jpmuted line-clamp-2 leading-relaxed">
            {course.short_description || course.description || 'Comprehensive practical engineering training designed for working professionals and engineering students.'}
          </p>
        </div>

        {/* Metadata & Footer */}
        <div className="mt-6 pt-4 border-t border-[#EAF0F6]">
          <div className="flex items-center justify-between text-xs text-jpmuted mb-4">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-jpblue" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-jpblue" />
              <span>{course.total_lessons > 0 ? `${course.total_lessons} Lessons` : 'Practical Modules'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-xs text-jpmuted block">Tuition Fee</span>
              <span className="text-lg font-extrabold text-jpdark">
                {formatCurrency(course.price, course.currency)}
              </span>
            </div>
            <Link
              href={`/courses/${course.slug}`}
              className="btn-pill bg-jplight text-jpblue hover:bg-jpblue hover:text-white text-xs font-bold px-4 py-2 flex items-center gap-1.5 transition-colors"
            >
              <span>View Course</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
