import React from 'react';

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-jplight/60 flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 border-4 border-jpblue border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-jpmuted">
          Loading JP Smart Solutions Academy...
        </span>
      </div>
    </div>
  );
}
