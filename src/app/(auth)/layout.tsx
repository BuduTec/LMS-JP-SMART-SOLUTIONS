import React from 'react';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-jplight/60 relative">
      <div className="absolute inset-0 hero-grid opacity-15 pointer-events-none" />
      <div className="mb-6 relative z-10 text-center">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="h-12 w-12 rounded-2xl bg-hero-gradient flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <GraduationCap className="h-7 w-7 text-jpcyan" />
          </div>
          <div className="text-left">
            <div className="font-extrabold text-lg text-jpdark leading-none">
              JP SMART SOLUTIONS
            </div>
            <div className="text-xs font-semibold text-jpblue uppercase tracking-wider mt-0.5">
              Engineering Academy
            </div>
          </div>
        </Link>
      </div>
      <div className="w-full max-w-md relative z-10">{children}</div>
      <div className="mt-8 text-center text-xs text-jpmuted relative z-10">
        &copy; {new Date().getFullYear()} JP SMART SOLUTIONS LTD. Port Harcourt, Nigeria.
      </div>
    </div>
  );
}
