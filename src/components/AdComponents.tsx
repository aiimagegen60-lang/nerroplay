import React from 'react';
import { cn } from '../lib/utils';

export function AdBanner({ className }: { className?: string }) {
  return (
    <div className={cn('w-full glass rounded-xl p-4 flex flex-col items-center justify-center min-h-[120px] relative overflow-hidden group', className)}>
      <div className="absolute top-2 right-2 text-[10px] font-mono text-text-secondary uppercase tracking-widest opacity-50">
        Advertisement
      </div>
      <div className="text-text-secondary text-sm font-medium italic">
        Sponsorship Space Available
      </div>
      <div className="mt-2 w-32 h-1 bg-accent/20 rounded-full overflow-hidden">
        <div className="w-1/2 h-full bg-accent animate-pulse" />
      </div>
    </div>
  );
}
