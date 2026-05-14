
import React from 'react';
import { cn } from '../../lib/utils';

export function ReportBlock({ children, title, icon: Icon, sectionNumber, className }: { 
  children: React.ReactNode; 
  title: string; 
  icon?: any;
  sectionNumber?: string;
  className?: string;
}) {
  return (
    <div className={cn("bg-surface border border-border-glass rounded-[2rem] p-8 shadow-card overflow-hidden relative", className)}>
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-border-glass">
        <div className="flex items-center gap-4">
          {Icon && (
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <Icon size={20} />
            </div>
          )}
          <h2 className="text-xl font-bold text-text-primary uppercase tracking-tight">{title}</h2>
        </div>
        {sectionNumber && (
          <div className="text-[10px] font-black font-mono text-text-muted bg-background px-3 py-1 rounded-full border border-border-glass uppercase tracking-widest">
            Module {sectionNumber}
          </div>
        )}
      </div>
      <div className="relative z-10">
        {children}
      </div>
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl" />
    </div>
  );
}

export function MetricCard({ label, value, subtext, icon: Icon, colorClass = "border-primary" }: {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: any;
  colorClass?: string;
}) {
  return (
    <div className={cn(
      "bg-surface border border-border-glass rounded-2xl p-5 shadow-sm transition-all hover:shadow-md border-l-[6px]",
      colorClass
    )}>
      {Icon && (
        <div className="text-text-muted mb-4">
          <Icon size={18} />
        </div>
      )}
      <div className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-1">{label}</div>
      <div className="text-2xl font-black text-text-primary tracking-tighter leading-none mb-2">{value}</div>
      {subtext && <div className="text-[10px] text-text-secondary leading-tight opacity-70">{subtext}</div>}
    </div>
  );
}

export function HealthScoreRing({ score, label, className }: { score: number; label: string; className?: string }) {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <svg className="w-24 h-24 transform -rotate-90">
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-border-glass"
        />
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-primary transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-2">
        <span className="text-xl font-black text-text-primary">{Math.round(score)}</span>
      </div>
      <span className="mt-2 text-[9px] font-mono text-text-muted uppercase tracking-widest">{label}</span>
    </div>
  );
}
