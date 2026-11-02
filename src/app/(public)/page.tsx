import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Award, CheckCircle2, Zap, Sparkles, Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { CourseCard } from '@/components/CourseCard';
import { COURSE_CATEGORIES, SITE_CONFIG } from '@/lib/constants';
import { Course } from '@/types';

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();

  const { data: coursesData } = await supabase
    .from('courses')
    .select(`
      *,
      category:categories(id, name, slug)
    `)
    .order('sort_order', { ascending: true })
    .limit(6);

  const courses: Course[] = (coursesData as unknown as Course[]) || [];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative hero-grid text-white pt-24 pb-28 overflow-hidden">
        <div className="container-jp relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="eyebrow bg-white/10 text-jpcyan border-white/20 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-jpcyan" />
              <span>JP SMART SOLUTIONS ACADEMY • PORT HARCOURT</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12]">
              Learn the engineering skills{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-jpcyan to-blue-200">
                employers actually use.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl">
              Specialized hands-on technical masterclasses in ETAP software, power system analysis, relay protection engineering, and solar PV designs taught by experienced practicing engineers.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link href="/courses" className="btn-cyan text-base font-bold py-3.5 px-8 flex items-center gap-2 group shadow-lg">
                <span>Browse Courses</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#how-it-works"
                className="btn-pill bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 px-7 border border-white/20 backdrop-blur-sm transition-colors"
              >
                How It Works
              </Link>
            </div>

            <div className="pt-8 flex flex-wrap items-center gap-6 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-jpcyan" />
                <span>Industry-standard ETAP software models</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-jpcyan" />
                <span>Nigerian grid & international IEC/IEEE standards</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-jpcyan" />
                <span>Practical calculation workbooks included</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="-mt-12 relative z-20">
        <div className="container-jp">
          <div className="card-jp bg-white p-8 sm:p-10 shadow-jphover border border-[#D9E6F2]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-[#E1EBF5]">
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-jpblue">10+</div>
                <div className="text-xs sm:text-sm font-semibold text-jpdark uppercase tracking-wider">
                  Technical Courses
                </div>
                <p className="text-xs text-jpmuted">Covering ETAP, Solar & Protection</p>
              </div>
              <div className="space-y-1 pt-6 sm:pt-0">
                <div className="text-3xl sm:text-4xl font-extrabold text-jpblue">100%</div>
                <div className="text-xs sm:text-sm font-semibold text-jpdark uppercase tracking-wider">
                  Online & Flexible
                </div>
                <p className="text-xs text-jpmuted">Learn at your own pace anytime</p>
              </div>
              <div className="space-y-1 pt-6 sm:pt-0">
                <div className="text-3xl sm:text-4xl font-extrabold text-jpblue">Port Harcourt</div>
                <div className="text-xs sm:text-sm font-semibold text-jpdark uppercase tracking-wider">
                  Nigeria Based
                </div>
                <p className="text-xs text-jpmuted">Physical & virtual support</p>
              </div>
              <div className="space-y-1 pt-6 sm:pt-0">
                <div className="text-3xl sm:text-4xl font-extrabold text-jpblue">Hands-on</div>
                <div className="text-xs sm:text-sm font-semibold text-jpdark uppercase tracking-wider">
                  Practical Engineering
                </div>
                <p className="text-xs text-jpmuted">Real single-line diagrams & studies</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="container-jp">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="eyebrow mb-2">Curriculum Spotlight</div>
            <h2 className="text-3xl font-extrabold text-jpdark tracking-tight">
              Featured Engineering Courses
            </h2>
            <p className="mt-2 text-jpmuted text-sm sm:text-base max-w-xl">
              From power system optimization to relay coordination and utility-scale solar designs.
            </p>
          </div>
          <Link href="/courses" className="btn-outline self-start md:self-auto flex items-center gap-2">
            <span>Explore All 10 Courses</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="card-jp p-12 text-center space-y-3">
            <BookOpen className="h-10 w-10 text-jpblue mx-auto" />
            <h3 className="text-lg font-bold text-jpdark">Courses Being Prepared</h3>
            <p className="text-sm text-jpmuted max-w-md mx-auto">
              Our engineering curriculum is currently being updated for the upcoming session. Check back shortly.
            </p>
          </div>
        )}
      </section>

      {/* Categories Grid */}
      <section className="bg-jplight py-20 border-y border-[#E1EBF5]">
        <div className="container-jp">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="eyebrow mb-2">Specializations</div>
            <h2 className="text-3xl font-extrabold text-jpdark tracking-tight">
              Explore By Domain
            </h2>
            <p className="mt-2 text-jpmuted text-sm sm:text-base">
              Structured learning pathways designed specifically for electrical engineers, renewable energy developers, and technical technicians.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {COURSE_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/courses?category=${cat.slug}`}
                className="card-jp card-jp-hover p-7 bg-white flex flex-col justify-between group"
              >
                <div>
                  <div className="h-12 w-12 rounded-2xl bg-jpblue-50 text-jpblue flex items-center justify-center mb-5 group-hover:bg-jpblue group-hover:text-white transition-colors">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-jpdark group-hover:text-jpblue transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-2 text-sm text-jpmuted leading-relaxed">
                    Practical modules, simulation files, single-line diagrams and applied design exercises.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-jpblue">
                  <span>Browse Category</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}

            <div className="card-jp p-7 bg-hero-gradient text-white flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-white/10 text-jpcyan flex items-center justify-center mb-5">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Corporate & On-Site Training
                </h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  Customized engineering training for utility companies, EPC contractors, and industrial plants across West Africa.
                </p>
              </div>
              <div className="mt-6">
                <Link
                  href="/contact"
                  className="btn-cyan text-xs font-bold py-2.5 px-5 inline-flex items-center gap-1.5"
                >
                  <span>Request Corporate Proposal</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="container-jp">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="eyebrow mb-2">Step-by-Step Pathway</div>
          <h2 className="text-3xl font-extrabold text-jpdark tracking-tight">
            How Learning Works at JP Smart Academy
          </h2>
          <p className="mt-2 text-jpmuted text-sm sm:text-base">
            Start advancing your engineering proficiency in three straightforward steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card-jp p-8 text-center relative space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-jpblue-50 text-jpblue font-extrabold text-xl flex items-center justify-center mx-auto shadow-sm">
              01
            </div>
            <h3 className="text-lg font-bold text-jpdark">Browse & Select</h3>
            <p className="text-sm text-jpmuted leading-relaxed">
              Explore our catalogue of ETAP, power system analysis, protection, and solar PV courses. Review syllabi, prerequisites, and lesson previews.
            </p>
          </div>

          <div className="card-jp p-8 text-center relative space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-jpblue-50 text-jpblue font-extrabold text-xl flex items-center justify-center mx-auto shadow-sm">
              02
            </div>
            <h3 className="text-lg font-bold text-jpdark">Enrol & Secure Checkout</h3>
            <p className="text-sm text-jpmuted leading-relaxed">
              Enrol smoothly using local Nigerian debit cards, bank transfer, or USSD via Paystack. Instant access is granted upon verification.
            </p>
          </div>

          <div className="card-jp p-8 text-center relative space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-jpblue-50 text-jpblue font-extrabold text-xl flex items-center justify-center mx-auto shadow-sm">
              03
            </div>
            <h3 className="text-lg font-bold text-jpdark">Learn & Apply</h3>
            <p className="text-sm text-jpmuted leading-relaxed">
              Stream ultra-fast Cloudflare-powered video masterclasses, download calculation sheets and ETAP project files, and test your skills with quizzes.
            </p>
          </div>
        </div>
      </section>

      {/* Student Testimonials Placeholder (Empty state) */}
      <section className="container-jp">
        <div className="card-jp p-10 bg-jplight/60 border-dashed border-2 border-[#D1E0EE] text-center space-y-4">
          <Award className="h-10 w-10 text-jpblue mx-auto" />
          <h3 className="text-xl font-bold text-jpdark">Student Reviews & Engineering Impact</h3>
          <p className="text-sm text-jpmuted max-w-xl mx-auto leading-relaxed">
            We are currently gathering structured feedback from our current cohort of engineers across Nigeria. Student verified testimonials will appear here as cohorts conclude their capstone assessments.
          </p>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="container-jp">
        <div className="rounded-[28px] hero-grid text-white p-10 sm:p-14 relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl space-y-6 relative z-10">
            <span className="eyebrow bg-white/10 text-jpcyan border-white/20">
              Transform Your Career
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Ready to master power system modeling and engineering analysis?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Join dozens of electrical engineers and technical professionals mastering ETAP, relay coordination, and clean solar PV designs with JP Smart Solutions Ltd.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link href="/courses" className="btn-cyan font-bold py-3 px-8 text-sm">
                Get Started Today
              </Link>
              <a
                href={SITE_CONFIG.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 text-sm border border-white/20 transition-colors"
              >
                Speak With an Advisor
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
