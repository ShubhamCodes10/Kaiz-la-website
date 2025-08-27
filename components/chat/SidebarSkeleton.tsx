import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function SidebarSkeleton() {
  return (
    <div className="space-y-2 p-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-2 p-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      ))}
    </div>
  );
}