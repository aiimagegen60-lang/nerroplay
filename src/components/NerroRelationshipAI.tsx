import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Brain, Zap, Heart, MessageSquare, Target, Stars, ShieldAlert, ChevronRight } from 'lucide-react';
import { NerroRelationshipOutput, KundliMatchReport, KundliMatchInput } from '../lib/types';
import { generateNerroRelationshipPrompt } from '../lib/nerro-ai-prompts';

interface NerroRelationshipAIProps {
  input: KundliMatchInput;
  report: KundliMatchReport;
}

export default function NerroRelationshipAI({ input, report }: NerroRelationshipAIProps) {
  const [analysis, setAnalysis] = useState<NerroRelationshipOutput | null>(report.nerroAnalysis || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activateAI = async (retryCount = 0) => {
    setIsLoading(true);
    setError(null);
    try {
      const prompt = generateNerroRelationshipPrompt(input, report);
      
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
        throw new Error(errorData.message || 'AI Generation failed');
      }
      
      const data = await response.json();
      setAnalysis(data);
    } catch (err: any) {
      console.error(`AI Activation Error (Attempt ${retryCount + 1}):`, err);
      if (retryCount < 2) {
        // Linear backoff: 1s, 2s
        const backoff = (retryCount + 1) * 1000;
        setTimeout(() => activateAI(retryCount + 1), backoff);
        return;
      }
      setError(err.message || 'Neural link could not be established. Please try again later.');
    } finally {
      if (retryCount >= 2 || analysis) {
        setIsLoading(false);
      }
    }
  };

  const renderCard = (title: string, content: string, icon: React.ComponentType<{ size?: number | string; className?: string }>, color: 'primary' | 'secondary' | 'accent') => {
    const colorMap = {
      primary: 'border-l-primary bg-primary/10 text-primary',
      secondary: 'border-l-secondary bg-secondary/10 text-secondary',
      accent: 'border-l-accent bg-accent/10 text-accent',
    };

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`glass p-8 space-y-4 border-l-4 ${colorMap[color].split(' ')[0]}`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${colorMap[color].split(' ').slice(1).join(' ')}`}>
            {React.createElement(icon, { size: 20 })}
          </div>
          <h4 className="font-black text-xs uppercase tracking-widest text-text-muted">{title}</h4>
        </div>
        <p className="text-base font-bold leading-relaxed text-text-primary">{content}</p>
      </motion.div>
    );
  };

  return (
    <section className="space-y-12">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Relationship Intelligence v2.0</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">
          NERRO <span className="text-primary">AI Analysis</span>
        </h2>
        <p className="max-w-2xl text-text-secondary font-medium italic">
          Deep pattern recognition merging 5,000 years of Vedic wisdom with contemporary psychological models.
        </p>
      </div>

      {!analysis && !isLoading ? (
        <div className="flex justify-center py-10">
          <button
            onClick={() => activateAI()}
            className="group relative px-12 py-6 bg-text-primary text-background rounded-[2rem] font-black uppercase tracking-[0.2em] hover:bg-primary transition-all duration-500 shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 fill-current" />
              <span>Activate NERRO Neural Analysis</span>
            </div>
          </button>
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center py-20 space-y-8"
          >
            <div className="relative w-32 h-32">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="absolute inset-0 border-4 border-primary/20 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute inset-2 border-4 border-accent/40 border-t-accent rounded-full"
              />
              <div className="absolute inset-4 flex items-center justify-center">
                <Brain className="w-10 h-10 text-primary animate-pulse" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="font-black uppercase tracking-[0.3em] text-text-primary">Generating Intelligence</p>
              <p className="text-xs font-mono text-text-muted animate-pulse">Analyzing karmic imprints & soul contracts...</p>
            </div>
          </motion.div>
        )}

        {analysis && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="md:col-span-2 glass bg-gradient-to-br from-primary/5 to-accent/5 p-10 rounded-[3rem] text-center border-2 border-primary/20">
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-primary mb-4">Relationship Archetype</h3>
              <p className="text-5xl md:text-6xl font-black tracking-tighter uppercase text-text-primary mb-6">
                {analysis.relationshipArchetype}
              </p>
              <div className="h-px w-32 bg-primary/20 mx-auto" />
            </div>

            {renderCard('Emotional Dynamics', analysis.emotionalDynamics, Heart, 'primary')}
            {renderCard('Attachment Styles', analysis.attachmentStyleAnalysis, ShieldAlert, 'secondary')}
            {renderCard('Karmic Patterns', analysis.karmicPatterns, Stars, 'accent')}
            {renderCard('Communication', analysis.communicationProfile, MessageSquare, 'primary')}

            <div className="glass p-10 space-y-6">
              <h4 className="flex items-center gap-3 font-black text-lg uppercase tracking-tighter">
                <Zap className="text-accent" size={24} />
                Hidden Strengths
              </h4>
              <ul className="space-y-4">
                {analysis.hiddenStrengths.map((s, i) => (
                  <li key={`strength-${s.substring(0, 10)}-${i}`} className="flex items-center gap-3 text-base font-bold text-text-secondary">
                    <ChevronRight size={16} className="text-accent" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass p-10 space-y-6">
              <h4 className="flex items-center gap-3 font-black text-lg uppercase tracking-tighter">
                <Target className="text-secondary" size={24} />
                Growth Trajectory
              </h4>
              <ul className="space-y-4">
                {analysis.growthOpportunities.map((s, i) => (
                  <li key={`growth-${s.substring(0, 10)}-${i}`} className="flex items-center gap-3 text-base font-bold text-text-secondary">
                    <ChevronRight size={16} className="text-secondary" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass p-10 space-y-4 border-t-4 border-primary">
               <h4 className="font-black text-[10px] uppercase tracking-widest text-text-muted">Advice for {input.partner1.fullName}</h4>
               <p className="text-lg font-bold italic leading-relaxed">"{analysis.partnerAdvice.forPartner1}"</p>
            </div>

            <div className="glass p-10 space-y-4 border-t-4 border-secondary">
               <h4 className="font-black text-[10px] uppercase tracking-widest text-text-muted">Advice for {input.partner2.fullName}</h4>
               <p className="text-lg font-bold italic leading-relaxed">"{analysis.partnerAdvice.forPartner2}"</p>
            </div>

            <div className="md:col-span-2 glass p-12 bg-text-primary text-background rounded-[3rem] text-center space-y-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
               <div className="relative space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.5em] text-accent">Soul Message</h3>
                  <p className="text-3xl md:text-4xl font-serif italic max-w-4xl mx-auto leading-relaxed">
                    "{analysis.soulMessage}"
                  </p>
                  <div className="inline-block px-8 py-3 rounded-2xl bg-white/5 border border-white/10">
                     <p className="text-[10px] font-black uppercase tracking-widest text-accent">Daily Practice</p>
                     <p className="text-sm font-bold mt-1">{analysis.dailyPractice}</p>
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center py-10 space-y-4"
          >
            <ShieldAlert className="text-accent w-12 h-12" />
            <p className="text-accent font-bold">{error}</p>
            <button 
              onClick={() => activateAI()}
              className="px-6 py-2 rounded-xl bg-accent text-black font-black uppercase text-[10px] tracking-widest"
            >
              Retry Connection
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
