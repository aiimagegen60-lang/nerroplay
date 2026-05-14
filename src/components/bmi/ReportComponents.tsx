
import React from 'react';
import { cn } from '../../lib/utils';
import { Recommendation, NextStep } from '../../lib/bmi/bmi-engine';
import { ChevronRight, Clock, Zap } from 'lucide-react';

export function ActionCard({ item }: { item: Recommendation }) {
  return (
    <div className="bg-surface border border-border-glass rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className="text-2xl">{item.icon}</div>
        <div className={cn(
          "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter",
          item.difficulty === 'easy' ? "bg-green-100 text-green-700" : 
          item.difficulty === 'moderate' ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
        )}>
          {item.difficulty}
        </div>
      </div>
      <h3 className="text-base font-bold text-text-primary mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
      <p className="text-xs text-text-secondary leading-relaxed mb-6 opacity-80">{item.description}</p>
      <div className="flex items-center justify-between pt-4 border-t border-border-glass">
        <div className="flex items-center gap-2 text-[10px] font-mono text-text-muted uppercase">
          <Clock size={12} /> {item.timeToResult}
        </div>
        <div className="px-2 py-1 bg-primary/10 text-primary rounded text-[8px] font-black uppercase">
          {item.category}
        </div>
      </div>
    </div>
  );
}

export function TimelineCard({ steps }: { steps: NextStep[] }) {
  return (
    <div className="space-y-8">
      {steps.map((step, idx) => (
        <div key={idx} className="relative pl-10 group">
          {idx !== steps.length - 1 && (
            <div className="absolute left-[15px] top-8 bottom-[-32px] w-[2px] bg-border-glass group-hover:bg-primary/30 transition-colors" />
          )}
          <div className={cn(
            "absolute left-0 top-1 w-8 h-8 rounded-full border-2 border-background flex items-center justify-center z-10 shadow-lg",
            idx === 0 ? "bg-primary text-background animate-pulse" : "bg-surface text-text-muted border-border-glass"
          )}>
            {idx === 0 ? <Zap size={14} /> : <div className="w-2 h-2 rounded-full bg-current" />}
          </div>
          <div className="bg-surface/50 p-6 rounded-2xl border border-border-glass group-hover:border-primary/20 transition-all">
            <div className="text-[10px] font-mono text-primary uppercase tracking-[0.2em] mb-2">{step.timeframe}</div>
            <h4 className="text-sm font-bold text-text-primary mb-2 italic">"{step.action}"</h4>
            <p className="text-xs text-text-secondary leading-relaxed mb-4">{step.description}</p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-background rounded-lg border border-border-glass text-[9px] font-mono text-text-muted uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Goal: {step.measurable}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CompareCard({ current, idealMin, idealMax }: { current: number; idealMin: number; idealMax: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
      <div className="p-6 bg-surface/50 rounded-2xl border border-border-glass">
        <div className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-2">Current State</div>
        <div className="text-3xl font-black text-text-primary tracking-tighter">{current} <span className="text-sm font-normal text-text-secondary opacity-50">kg</span></div>
        <div className="mt-4 h-2 bg-background rounded-full overflow-hidden border border-border-glass">
            <div className="h-full bg-accent w-full opacity-30" />
        </div>
      </div>

      <div className="p-6 bg-primary/5 rounded-2xl border border-primary/20">
        <div className="text-[10px] font-mono text-primary uppercase tracking-widest mb-2">Ideal Health Range</div>
        <div className="text-3xl font-black text-primary tracking-tighter">
            {Math.round(idealMin)}-{Math.round(idealMax)} 
            <span className="text-sm font-normal opacity-50 ml-2">kg</span>
        </div>
        <div className="mt-4 h-2 bg-primary/10 rounded-full overflow-hidden border border-primary/10">
            <div className="h-full bg-primary w-[60%] mx-auto rounded-full" />
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:flex w-10 h-10 rounded-full bg-background border border-border-glass items-center justify-center text-text-muted shadow-lg">
        <ChevronRight size={20} />
      </div>
    </div>
  );
}

export function RiskMeter({ label, score, inverse = false }: { label: string; score: number; inverse?: boolean }) {
  // inverse means higher score is better (like mobility)
  const displayScore = inverse ? score : score;
  let status = 'low';
  if (inverse) {
    status = score > 80 ? 'low' : score > 50 ? 'moderate' : 'high';
  } else {
    status = score < 30 ? 'low' : score < 60 ? 'moderate' : 'high';
  }

  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color = status === 'low' ? 'text-green-500' : status === 'moderate' ? 'text-accent' : 'text-red-500';

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-4">
        <svg className="w-20 h-20 transform -rotate-90">
          <circle cx="40" cy="40" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-border-glass" />
          <circle 
            cx="40" cy="40" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" 
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" 
            className={cn("transition-all duration-1000", color)} 
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-black text-text-primary">{Math.round(score)}%</span>
        </div>
      </div>
      <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest text-center leading-tight">
        {label}
      </span>
    </div>
  );
}
