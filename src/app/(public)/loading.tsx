import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function PublicLoading() {
  return (
    <div className="container-jp py-12 space-y-10">
      <div className="space-y-4 max-w-xl">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-10 w-full rounded-2xl" />
        <Skeleton className="h-4 w-3/4 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card-jp p-4 space-y-4 border border-[#E1EBF5]">
            <Skeleton className="aspect-video w-full rounded-xl" />
            <Skeleton className="h-6 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-full rounded-lg" />
            <div className="pt-2 flex justify-between">
              <Skeleton className="h-6 w-20 rounded-md" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
