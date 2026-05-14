import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Brain, Zap, Shield, Heart, Lightbulb, MessageSquare, RefreshCw } from 'lucide-react';
import { NERRO_AI_SYSTEM_PROMPT } from '../lib/nerro-ai-prompts';
import { AstrologyReport, NerroAIOutput, BirthData } from '../types';

interface NerroAIPanelProps {
  report: AstrologyReport;
  birthData: BirthData;
}

export default function NerroAIPanel({ report, birthData }: NerroAIPanelProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<NerroAIOutput | null>(null);

  const performAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const prompt = NERRO_AI_SYSTEM_PROMPT
        .replace('{{fullName}}', birthData.fullName)
        .replace('{{moonSign}}', report.moonSign)
        .replace('{{moonNakshatra}}', report.moonNakshatra)
        .replace('{{nakshatraPada}}', report.nakshatraPada.toString())
        .replace('{{moonLord}}', report.moonLord);

      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          isJson: true
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'The Neural Oracle is currently silent.');
      }

      const result = await response.json();
      setAiAnalysis(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'The Neural Oracle is currently silent. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-20 space-y-10">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-[10px] font-mono text-accent uppercase tracking-[0.2em]">
          <Sparkles size={12} />
          Neural Rashi Oracle (NERRO)
        </div>
        <h2 className="text-3xl font-bold text-text-primary uppercase tracking-tighter">AI Spiritual Intelligence</h2>
        <p className="text-sm text-text-secondary max-w-xl mx-auto">
          Activate our proprietary AI layer to synthesize cosmic patterns and provide a deeply non-generic psychological and spiritual analysis.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!aiAnalysis ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center py-12"
          >
            <button
              onClick={performAnalysis}
              disabled={loading}
              className="group relative px-10 py-5 bg-accent text-background font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent/20 disabled:opacity-50 disabled:cursor-wait"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <RefreshCw className="animate-spin" size={16} />
                  Synchronizing Neural Bridge...
                </span>
              ) : (
                'Activate NERRO Deep Analysis'
              )}
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {[
              { title: 'Emotional Patterns', text: aiAnalysis.emotionalPatterns, icon: Heart },
              { title: 'Karmic Tendencies', text: aiAnalysis.karmicTendencies, icon: Brain },
              { title: 'Hidden Strengths', text: aiAnalysis.hiddenStrengths, icon: Zap },
              { title: 'Shadow Insights', text: aiAnalysis.subconsciousFears, icon: Shield },
            ].map((item) => (
              <div key={`pattern-${item.title}`} className="glass p-8 rounded-3xl border border-border-glass bg-surface/30">
                <div className="flex items-center gap-3 mb-4 text-accent font-bold uppercase tracking-widest text-[10px]">
                  <item.icon size={14} />
                  {item.title}
                </div>
                <p className="text-sm text-text-secondary leading-relaxed italic">
                  "{item.text}"
                </p>
              </div>
            ))}

            <div className="md:col-span-2 glass p-10 rounded-3xl border border-accent/20 bg-accent/5">
                <div className="flex items-center gap-3 mb-6 text-accent font-bold uppercase tracking-widest text-xs">
                    <MessageSquare size={16} />
                    Message to Your Soul
                </div>
                <p className="text-lg md:text-xl font-serif italic text-text-primary leading-relaxed text-center">
                    {aiAnalysis.soulMessage}
                </p>
                <div className="mt-8 pt-8 border-t border-accent/10 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-[10px] font-mono text-accent uppercase tracking-widest mb-4">Core Life Lessons</h4>
                        <ul className="space-y-3">
                            {aiAnalysis.lifeLessons.map((lesson, i) => (
                                <li key={`lesson-${i}`} className="flex font-sans items-start gap-2 text-xs text-text-secondary">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1 shrink-0" />
                                    {lesson}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-[10px] font-mono text-accent uppercase tracking-widest mb-4">Weekly Cosmic Focus</h4>
                        <p className="text-xs text-text-secondary leading-normal mb-6">
                            {aiAnalysis.weeklyFocus}
                        </p>
                        <div className="p-4 bg-accent/10 rounded-xl">
                            <h5 className="text-[8px] font-mono text-accent uppercase tracking-widest mb-2">Daily Affirmation</h5>
                            <p className="text-xs font-bold text-text-primary uppercase tracking-tight">
                                "{aiAnalysis.dailyAffirmation}"
                            </p>
                        </div>
                    </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="p-4 glass rounded-xl border border-red-500/20 text-red-500 text-xs text-center font-mono">
           {error}
        </div>
      )}
    </div>
  );
}
