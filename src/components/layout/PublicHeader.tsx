'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, BookOpen, Phone, ChevronRight, GraduationCap } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Courses', href: '/courses' },
  { name: 'About', href: '/about' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Contact', href: '/contact' },
];

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E1EBF5]">
      {/* Top micro-bar */}
      <div className="bg-jpdark text-white text-xs py-2 hidden sm:block">
        <div className="container-jp flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="h-2 w-2 rounded-full bg-jpcyan animate-pulse" />
              Empowering Engineers Across Nigeria & Africa
            </span>
            <span className="text-slate-400">|</span>
            <a
              href={`tel:${SITE_CONFIG.contact.phoneRaw}`}
              className="text-slate-300 hover:text-jpcyan flex items-center gap-1 transition-colors"
            >
              <Phone className="h-3 w-3" />
              {SITE_CONFIG.contact.phone}
            </a>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <span>Rumuruji St, Rumuodara, Port Harcourt</span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container-jp flex items-center justify-between h-20">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-11 w-11 rounded-xl bg-hero-gradient flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <GraduationCap className="h-6 w-6 text-jpcyan" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-jpdark group-hover:text-jpblue transition-colors">
              JP SMART SOLUTIONS
            </span>
            <span className="text-xs font-semibold tracking-wider text-jpblue uppercase">
              Engineering Academy
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-semibold transition-colors hover:text-jpblue ${
                  isActive ? 'text-jpblue' : 'text-jpdark/80'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-semibold text-jpdark hover:text-jpblue px-4 py-2 transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/courses"
            className="btn-primary flex items-center gap-2 group"
          >
            <BookOpen className="h-4 w-4" />
            <span>Start Learning</span>
            <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-jpdark hover:bg-jplight focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6 text-jpdark" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E1EBF5] bg-white px-4 pt-2 pb-6 space-y-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-base font-semibold text-jpdark hover:bg-jplight hover:text-jpblue transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-[#E1EBF5] flex flex-col gap-2.5">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-outline w-full text-center"
            >
              Log In
            </Link>
            <Link
              href="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary w-full text-center"
            >
              Browse All Courses
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
