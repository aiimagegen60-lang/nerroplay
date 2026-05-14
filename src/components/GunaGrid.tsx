import React from 'react';
import { motion } from 'motion/react';
import { AshtakootResult } from '../lib/types';

interface GunaGridProps {
  data: AshtakootResult[];
}

export default function GunaGrid({ data }: GunaGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {data.map((koot, idx) => (
        <motion.div
          key={koot.kootName}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          viewport={{ once: true }}
          className="glass p-6 group hover:translate-y-[-4px] transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-black text-xs uppercase tracking-widest text-text-muted mb-1">
                {koot.kootName}
              </h3>
              <p className="text-[10px] font-medium text-text-secondary leading-tight line-clamp-1 italic">
                {koot.kootDescription}
              </p>
            </div>
            <div className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
              koot.achievedScore === koot.maxScore ? 'bg-primary/10 text-primary' : 
              koot.achievedScore > 0 ? 'bg-secondary/10 text-secondary' : 'bg-accent/10 text-accent'
            }`}>
              {koot.achievedScore} / {koot.maxScore}
            </div>
          </div>

          <div className="space-y-4">
            <div className="h-1.5 w-full bg-border-glass rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${koot.percentage}%` }}
                transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                viewport={{ once: true }}
                className={`h-full ${
                  koot.achievedScore === koot.maxScore ? 'bg-primary' : 
                  koot.achievedScore > 0 ? 'bg-secondary' : 'bg-accent'
                }`}
              />
            </div>

            <p className="text-[11px] font-bold text-text-primary leading-relaxed">
              {koot.interpretation}
            </p>
            
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${
                koot.impact === 'high' ? 'bg-accent' : 
                koot.impact === 'medium' ? 'bg-secondary' : 'bg-primary'
              }`} />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted">
                {koot.impact} Impact
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
