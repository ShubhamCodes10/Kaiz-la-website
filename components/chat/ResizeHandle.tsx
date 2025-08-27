import React from 'react';
import { cn } from '@/lib/utils'; 

export const ResizeHandle = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "absolute top-0 right-0 h-full w-1.5 cursor-col-resize bg-transparent hover:bg-border transition-colors group-data-[resizing]:bg-border",
        className
      )}
      {...props}
    />
  );
};