'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-jplight/60 flex items-center justify-center p-6">
      <div className="max-w-md w-full card-jp p-10 text-center space-y-6 bg-white border border-rose-200 shadow-jphover">
        <div className="h-16 w-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-extrabold text-jpdark">Something went wrong</h1>
          <p className="text-xs text-jpmuted leading-relaxed">
            An unexpected error occurred while loading this page. Our technical team has been notified.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={() => reset()}
            className="btn-primary text-xs py-2.5 px-5 font-bold flex items-center justify-center gap-2"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="btn-outline text-xs py-2.5 px-5 font-semibold flex items-center justify-center gap-2"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
