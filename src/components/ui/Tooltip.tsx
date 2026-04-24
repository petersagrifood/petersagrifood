import React, { ReactNode } from 'react';
import { cn } from '@/src/lib/utils';

interface TooltipProps {
  children: ReactNode;
  content: string;
  className?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ children, content, className, position = 'top' }: TooltipProps) {
  const positionClasses = {
    top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
    bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
    left: "right-full top-1/2 mr-2 -translate-y-1/2",
    right: "left-full top-1/2 ml-2 -translate-y-1/2"
  };

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-slate-900",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-slate-900",
    left: "left-full top-1/2 -translate-y-1/2 border-l-slate-900",
    right: "right-full top-1/2 -translate-y-1/2 border-r-slate-900"
  };

  return (
    <div className={cn("group relative inline-flex", className)}>
      {children}
      <div className={cn(
        "invisible absolute whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-[10px] font-black italic uppercase tracking-widest text-white opacity-0 transition-all group-hover:visible group-hover:opacity-100 z-[200] shadow-2xl ring-1 ring-white/10",
        positionClasses[position]
      )}>
        {content}
        <div className={cn(
          "absolute border-8 border-transparent",
          arrowClasses[position]
        )} />
      </div>
    </div>
  );
}
