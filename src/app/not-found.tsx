import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-jplight/60 flex items-center justify-center p-6">
      <div className="max-w-md w-full card-jp p-10 text-center space-y-6 shadow-jphover bg-white border border-[#D5E1ED]">
        <div className="space-y-2">
          <span className="text-6xl font-extrabold text-jpblue tracking-tighter">404</span>
          <h1 className="text-2xl font-extrabold text-jpdark">Page Not Found</h1>
          <p className="text-xs text-jpmuted leading-relaxed">
            The page or engineering course resource you requested does not exist or has been relocated.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="btn-primary text-xs py-2.5 px-5 font-bold flex items-center justify-center gap-1.5"
          >
            <Home className="h-4 w-4" />
            <span>Go to Homepage</span>
          </Link>
          <Link
            href="/courses"
            className="btn-outline text-xs py-2.5 px-5 font-semibold flex items-center justify-center gap-1.5"
          >
            <Search className="h-4 w-4" />
            <span>Browse Courses</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
