import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, AlertCircle, CheckCircle2, ChevronDown, Sparkles } from 'lucide-react';
import { DoshaResult } from '../lib/types';

interface DoshaPanelProps {
  manglik: DoshaResult;
  nadi: DoshaResult;
  bhakoot: DoshaResult;
}

export default function DoshaPanel({ manglik, nadi, bhakoot }: DoshaPanelProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter">Dosha Analysis</h2>
          <p className="text-xs font-mono text-text-muted uppercase tracking-widest mt-1 italic">
            Integrity check // Vedic Fault Detection
          </p>
        </div>
        <div className="px-4 py-2 glass border-amber-500/30 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Educational Guidance only</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DoshaCard title="Manglik Dosha" result={manglik} icon={Sparkles} />
        <DoshaCard title="Nadi Dosha" result={nadi} icon={ShieldAlert} />
        <DoshaCard title="Bhakoot Dosha" result={bhakoot} icon={AlertCircle} />
      </div>

      <div className="glass p-8 bg-surface/50 border-border-glass rounded-[2rem]">
        <p className="text-sm font-bold text-text-secondary leading-relaxed italic">
          "Dosha analysis is one interpretive lens in Vedic astrology. Many loving, successful marriages exist across all dosha combinations. These insights are intended for awareness and reflection, rather than deterministic outcomes."
        </p>
      </div>
    </div>
  );
}

function DoshaCard({ title, result, icon: Icon }: { title: string, result: DoshaResult, icon: any }) {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusColor = () => {
    if (!result.present) return 'text-primary bg-primary/5 border-primary/20';
    if (result.severity === 'mild') return 'text-amber-500 bg-amber-500/5 border-amber-500/20';
    return 'text-accent bg-accent/5 border-accent/20';
  };

  return (
    <div className={`glass p-8 rounded-[2.5rem] border-2 transition-all duration-500 ${isOpen ? 'ring-2 ring-accent/20' : ''}`}>
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl ${result.present ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'}`}>
          <Icon size={24} />
        </div>
        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor()}`}>
          {result.present ? (result.severity === 'strong' ? 'High Impact' : result.severity === 'mild' ? 'Mild Presence' : 'Detected') : 'Not Detected'}
        </div>
      </div>

      <h3 className="text-2xl font-black tracking-tighter uppercase mb-4">{title}</h3>
      <p className="text-sm font-bold text-text-secondary leading-relaxed line-clamp-3 mb-6">
        {result.description}
      </p>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 glass border-border-glass rounded-2xl flex items-center justify-center gap-2 hover:bg-surface transition-colors group"
      >
        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted group-hover:text-text-primary transition-colors">
          {isOpen ? 'Fold Details' : 'Deep Analysis'}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown size={16} className="text-text-muted" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-8 space-y-6">
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-text-muted">Traditional Remedies</h4>
                <ul className="space-y-2">
                  {result.traditionalRemedies.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm font-bold text-text-primary">
                      <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                      {r}
                    </li>
                  ))}
                  {result.traditionalRemedies.length === 0 && <li className="text-sm italic text-text-muted">No specific remedies required.</li>}
                </ul>
              </div>

              {result.cancellationFactors.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-text-muted">Cancellation Factors</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.cancellationFactors.map((f, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-green-500/5 text-green-600 border border-green-500/20 text-[10px] font-bold">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3 p-6 bg-surface/50 rounded-2xl border border-border-glass">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-text-muted">Modern Perspective</h4>
                <p className="text-xs font-bold leading-relaxed text-text-secondary">
                  {result.modernPerspective}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
