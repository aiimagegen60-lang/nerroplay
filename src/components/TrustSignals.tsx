import React from 'react';
import { Calendar, User, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface TrustSignalsProps {
  author: string;
  lastUpdated: string;
}

export default function TrustSignals({ author, lastUpdated }: TrustSignalsProps) {
  return (
    <div className="flex flex-wrap gap-6 py-6 border-y border-border-glass mb-10">
      <div className="flex items-center gap-2 text-[10px] font-mono text-text-muted uppercase tracking-widest">
        <User size={14} className="text-accent" />
        <span>Reviewed by: <span className="text-text-primary font-bold">{author}</span></span>
      </div>
      <div className="flex items-center gap-2 text-[10px] font-mono text-text-muted uppercase tracking-widest">
        <Calendar size={14} className="text-accent" />
        <span>Last Updated: <span className="text-text-primary font-bold">{lastUpdated}</span></span>
      </div>
      <div className="flex items-center gap-2 text-[10px] font-mono text-text-muted uppercase tracking-widest">
        <ShieldCheck size={14} className="text-accent" />
        <span>Verified Calculation</span>
      </div>
      <div className="flex items-center gap-2 text-[10px] font-mono text-text-muted uppercase tracking-widest">
        <CheckCircle2 size={14} className="text-accent" />
        <span>Professional Grade</span>
      </div>
    </div>
  );
}
