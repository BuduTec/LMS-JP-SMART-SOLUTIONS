import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { CourseCard } from '@/components/CourseCard';
import { COURSE_CATEGORIES } from '@/lib/constants';
import { Course } from '@/types';
import Link from 'next/link';
import { Search, BookOpen } from 'lucide-react';

interface CoursesPageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
  }>;
}

export const dynamic = 'force-dynamic';

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const { category, q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from('courses')
    .select(`
      *,
      category:categories(id, name, slug)
    `)
    .order('sort_order', { ascending: true });

  if (category) {
    const { data: catRecord } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category)
      .single();

    if (catRecord) {
      query = query.eq('category_id', catRecord.id);
    }
  }

  if (q && q.trim() !== '') {
    query = query.ilike('title', `%${q.trim()}%`);
  }

  const { data: coursesData } = await query;
  const courses: Course[] = (coursesData as unknown as Course[]) || [];

  return (
    <div className="py-12 space-y-10">
      <section className="container-jp">
        <div className="max-w-2xl space-y-3">
          <div className="eyebrow">Course Catalogue</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-jpdark tracking-tight">
            Engineering & Technical Masterclasses
          </h1>
          <p className="text-jpmuted text-sm sm:text-base leading-relaxed">
            Practical, industry-aligned power systems, ETAP modeling, protection, and solar PV courses designed for practicing Nigerian engineers.
          </p>
        </div>

        <div className="mt-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <form method="GET" action="/courses" className="relative flex-1 max-w-md">
            {category && <input type="hidden" name="category" value={category} />}
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-jpmuted" />
            <input
              type="text"
              name="q"
              defaultValue={q || ''}
              placeholder="Search courses by topic (e.g. ETAP, Protection)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#D5E1ED] bg-white text-sm text-jpdark placeholder:text-jpmuted focus:outline-none focus:ring-2 focus:ring-jpblue focus:border-transparent transition-all"
            />
          </form>

          {(category || q) && (
            <Link
              href="/courses"
              className="text-xs font-semibold text-jpblue hover:underline self-center"
            >
              Reset all filters
            </Link>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href={q ? `/courses?q=${encodeURIComponent(q)}` : '/courses'}
            className={`btn-pill text-xs py-2 px-4 transition-all ${
              !category
                ? 'bg-jpblue text-white shadow-sm font-bold'
                : 'bg-white text-jpdark border border-[#D1E0EE] hover:bg-jplight'
            }`}
          >
            All Courses
          </Link>
          {COURSE_CATEGORIES.map((cat) => {
            const isActive = category === cat.slug;
            const href = q
              ? `/courses?category=${cat.slug}&q=${encodeURIComponent(q)}`
              : `/courses?category=${cat.slug}`;
            return (
              <Link
                key={cat.slug}
                href={href}
                className={`btn-pill text-xs py-2 px-4 transition-all ${
                  isActive
                    ? 'bg-jpblue text-white shadow-sm font-bold'
                    : 'bg-white text-jpdark border border-[#D1E0EE] hover:bg-jplight'
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container-jp">
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="card-jp p-12 text-center space-y-4 max-w-lg mx-auto">
            <BookOpen className="h-12 w-12 text-jpmuted mx-auto" />
            <h3 className="text-lg font-bold text-jpdark">No matching courses found</h3>
            <p className="text-sm text-jpmuted leading-relaxed">
              We couldn&apos;t find any courses matching your search criteria. Try a different keyword or view all courses.
            </p>
            <div className="pt-2">
              <Link href="/courses" className="btn-primary text-xs py-2 px-5">
                Clear Filters
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
