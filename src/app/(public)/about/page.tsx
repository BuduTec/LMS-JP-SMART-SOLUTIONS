import React from 'react';
import Link from 'next/link';
import { Shield, Users, Zap, MapPin, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata = {
  title: 'About JP Smart Solutions Academy',
  description: 'Learn about JP Smart Solutions Ltd and our mission to provide practical, high-value engineering training across Nigeria and West Africa.',
};

export default function AboutPage() {
  return (
    <div className="py-12 space-y-16">
      <section className="container-jp">
        <div className="max-w-3xl space-y-4">
          <div className="eyebrow">Engineering Excellence</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-jpdark tracking-tight leading-tight">
            Bridging the gap between engineering theory and real-world industrial practice.
          </h1>
          <p className="text-base sm:text-lg text-jpmuted leading-relaxed">
            Headquartered in Port Harcourt, Rivers State, JP Smart Solutions Ltd is an engineering consultancy and technical training provider dedicated to building the next generation of power system analysts, protection engineers, and clean energy designers.
          </p>
        </div>
      </section>

      <section className="container-jp">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card-jp p-8 space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-jpblue-50 text-jpblue flex items-center justify-center">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-jpdark">Software & Practical Rigor</h3>
            <p className="text-sm text-jpmuted leading-relaxed">
              We focus heavily on hands-on software simulation using industry-standard packages like ETAP, teaching engineers how to construct single-line diagrams, run load flow, coordinate relays, and analyze arc flash dangers.
            </p>
          </div>

          <div className="card-jp p-8 space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-jpblue-50 text-jpblue flex items-center justify-center">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-jpdark">Industry Standards</h3>
            <p className="text-sm text-jpmuted leading-relaxed">
              Every course aligns strictly with IEEE, IEC, and Nigerian Electricity Regulatory Commission (NERC) distribution/transmission codes, ensuring what you learn translates directly into site safety and compliance.
            </p>
          </div>

          <div className="card-jp p-8 space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-jpblue-50 text-jpblue flex items-center justify-center">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-jpdark">Practicing Instructors</h3>
            <p className="text-sm text-jpmuted leading-relaxed">
              Our modules are developed and led by active consultants with years of experience delivering utility-scale substations, industrial power plants, and commercial solar microgrids across Nigeria.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-jplight py-16 border-y border-[#E1EBF5]">
        <div className="container-jp grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="eyebrow">Corporate Background</div>
            <h2 className="text-3xl font-extrabold text-jpdark tracking-tight">
              JP SMART SOLUTIONS LTD
            </h2>
            <p className="text-sm text-jpmuted leading-relaxed">
              Formally registered and operating in Nigeria, JP Smart Solutions Ltd provides comprehensive engineering design, power audit, protection setting calculation, and professional workforce development services.
            </p>
            <div className="space-y-3 text-sm text-jpdark">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-jpblue shrink-0 mt-0.5" />
                <span>{SITE_CONFIG.contact.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-jpblue shrink-0" />
                <span>{SITE_CONFIG.contact.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-jpblue shrink-0" />
                <span>{SITE_CONFIG.contact.email}</span>
              </div>
            </div>
          </div>

          <div className="card-jp p-8 bg-white border border-[#D5E1ED] space-y-5">
            <h3 className="text-lg font-bold text-jpdark">Our Commitment to Learners</h3>
            <div className="space-y-3 text-xs sm:text-sm text-jpdark/80">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-jpblue shrink-0" />
                <span>No superficial slides — 100% applied engineering studies</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-jpblue shrink-0" />
                <span>Downloadable calculation spreadsheets and ETAP project models</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-jpblue shrink-0" />
                <span>Prompt technical instructor answers to course questions</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-jpblue shrink-0" />
                <span>Continuous lifetime access to enrolled content updates</span>
              </div>
            </div>
            <div className="pt-2">
              <Link href="/courses" className="btn-primary text-xs py-2.5 px-6">
                Explore Our Courses
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
