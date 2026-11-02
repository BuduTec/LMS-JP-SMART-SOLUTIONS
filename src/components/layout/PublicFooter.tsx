import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, GraduationCap, ArrowUpRight } from 'lucide-react';
import { SITE_CONFIG, COURSE_CATEGORIES } from '@/lib/constants';

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-jpdark text-white border-t border-slate-800">
      <div className="container-jp pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-hero-gradient flex items-center justify-center shadow-inner">
                <GraduationCap className="h-6 w-6 text-jpcyan" />
              </div>
              <div>
                <h3 className="font-extrabold text-base tracking-tight text-white">
                  JP SMART SOLUTIONS
                </h3>
                <p className="text-xs font-semibold tracking-wider text-jpcyan uppercase">
                  Engineering Academy
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              Nigeria&apos;s specialized technical academy offering hands-on training in ETAP software, power system analysis, relay protection, and solar PV engineering.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
              <span>Accredited Curriculum & Industry-Certified Instructors</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link href="/courses" className="hover:text-jpcyan transition-colors flex items-center gap-1">
                  <span>Browse Courses</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-jpcyan transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-jpcyan transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-jpcyan transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-jpcyan transition-colors">
                  Student Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Training Areas */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Specializations
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              {COURSE_CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/courses?category=${cat.slug}`}
                    className="hover:text-jpcyan transition-colors flex items-center justify-between"
                  >
                    <span>{cat.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Academy Office
            </h4>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-jpcyan shrink-0 mt-0.5" />
                <span>{SITE_CONFIG.contact.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-jpcyan shrink-0" />
                <a
                  href={`tel:${SITE_CONFIG.contact.phoneRaw}`}
                  className="hover:text-jpcyan transition-colors"
                >
                  {SITE_CONFIG.contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-jpcyan shrink-0" />
                <a
                  href={`mailto:${SITE_CONFIG.contact.email}`}
                  className="hover:text-jpcyan transition-colors"
                >
                  {SITE_CONFIG.contact.email}
                </a>
              </div>
              <div className="pt-2">
                <a
                  href={SITE_CONFIG.contact.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-cyan text-xs py-2 px-4 inline-flex items-center gap-1.5"
                >
                  <span>Chat on WhatsApp</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {currentYear} {SITE_CONFIG.companyName}. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/refunds" className="hover:text-white transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
