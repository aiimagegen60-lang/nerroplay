
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Brain, Zap, Shield, Heart, Lightbulb, MessageSquare, Activity, Target, Compass, Globe, Clock, Utensils } from 'lucide-react';
import { CalorieResult, CalorieInput } from '../../lib/calorie/calorie-engine';
import { generateNerroCaloriePrompt } from '../../lib/calorie/nerro-calorie-prompts';
import { ReportBlock, MetricCard, HealthScoreRing } from '../bmi/ReportBlocks';
import NutritionWheel from '../bmi/NutritionWheel';
import { cn } from '../../lib/utils';
import { NerroHealthOutput } from './NerroHealthAI';

export default function NerroCalorieAI({ input, result }: { input: CalorieInput, result: CalorieResult }) {
  const [loading, setLoading] = useState(false);
  const [aiData, setAiData] = useState<NerroHealthOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const activateAI = async () => {
    setLoading(true);
    setError(null);
    try {
      const prompt = generateNerroCaloriePrompt(input, result);
      const response = await fetch('/api/ai/nerro-health', { // Reusing the same endpoint as it handles prompt -> JSON
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) throw new Error('Neural bridge timeout.');
      const data = await response.json();
      setAiData(data);
    } catch (err: any) {
      setError(err.message || 'System fault in Neural Oracle.');
    } finally {
      setLoading(false);
    }
  };

  if (!aiData && !loading) {
    return (
      <div className="glass-block p-12 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse text-primary shadow-xl shadow-primary/20">
            <Utensils size={32} />
          </div>
          <h2 className="text-3xl font-black text-text-primary uppercase tracking-tighter mb-4">Activate NERRO Calorie AI</h2>
          <p className="text-sm text-text-secondary max-w-lg mx-auto mb-10 leading-relaxed">
            Unlock neural metabolic intelligence. NERRO will analyze your caloric trajectory, macro partitioning, and energy efficiency to build your personalized 12-week nutrition roadmap.
          </p>
          <button 
            onClick={activateAI}
            className="px-10 py-5 bg-primary text-background rounded-2xl font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Engage Neural Analysis ✨
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="glass-block p-20 text-center min-h-[500px] flex flex-col items-center justify-center space-y-10">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-primary animate-pulse">
            <Sparkles size={32} />
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-2xl font-black text-text-primary uppercase tracking-tighter">Analyzing Metabolic Matrix...</h3>
          <div className="text-[10px] font-mono text-text-muted flex items-center justify-center gap-4">
            <span className="animate-pulse">Partitioning Macros</span>
            <span className="opacity-40 select-none">•</span>
            <span className="animate-pulse delay-75">Synergizing Energy</span>
            <span className="opacity-40 select-none">•</span>
            <span className="animate-pulse delay-150">Calibrating Roadmap</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !aiData) return <div className="p-10 glass border-red-500/20 text-red-500 text-center uppercase font-mono text-xs">{error || 'Neural fault.'}</div>;

  return (
    <div className="space-y-12">
      {/* Global Legal Disclaimer */}
      {aiData.legalDisclaimer && (
        <div className="p-6 bg-accent/5 border border-accent/20 rounded-3xl text-[10px] font-mono text-text-muted leading-relaxed text-center uppercase tracking-wider">
           <Shield className="inline-block mr-2 text-accent" size={14} />
           {aiData.legalDisclaimer}
        </div>
      )}

      {/* ROW 1: Identity */}
      <div className="glass-block p-10 flex flex-col md:flex-row items-center gap-10 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <div className="relative w-24 h-24 rounded-full bg-background border border-primary/20 flex items-center justify-center text-primary shadow-2xl">
              <Utensils size={40} className="animate-pulse" />
            </div>
          </div>
        </div>
        <div className="flex-grow text-center md:text-left">
          <div className="text-[10px] font-mono text-primary uppercase tracking-[0.3em] mb-2">NERRO AI Metabolic Persona</div>
          <h2 className="text-4xl md:text-5xl font-black text-text-primary uppercase tracking-tighter mb-4">{aiData.healthPersona}</h2>
          <p className="text-sm text-text-secondary leading-relaxed max-w-2xl opacity-80">{aiData.healthPersonaDescription}</p>
        </div>
        <div className="flex-shrink-0">
           <div className="p-4 rounded-3xl bg-primary/10 border border-primary/20 text-center">
              <div className="text-[9px] font-mono text-primary uppercase mb-1">Efficiency</div>
              <div className="text-4xl font-black text-primary">88%</div>
           </div>
        </div>
      </div>

      {/* ROW 2: Dimensional Scores */}
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(aiData.dimensionalScores || {}).map(([key, score], idx) => {
            // Filter only valid calorie-related scores
            if (typeof score !== 'number') return null;
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <MetricCard 
                  label={key.replace(/([A-Z])/g, ' $1')}
                  value={score}
                  subtext="Neural Nutrition Score"
                  colorClass={idx % 2 === 0 ? "border-primary" : "border-secondary"}
                />
              </motion.div>
            );
          })}
        </div>
        {aiData.dimensionalScoresDisclaimer && (
          <div className="text-center text-[9px] font-mono text-text-muted uppercase tracking-widest opacity-60">
            {aiData.dimensionalScoresDisclaimer}
          </div>
        )}
      </div>

      {/* ROW 3: Analysis Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 space-y-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-center">
             {['Nutrition', 'Metabolic', 'Cardiac', 'Energy'].map((t, i) => (
                <button 
                  key={t}
                  onClick={() => setActiveTab(i)}
                  className={cn(
                    "flex-shrink-0 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    activeTab === i ? "bg-primary text-background" : "bg-surface border border-border-glass text-text-muted hover:border-primary/30"
                  )}
                >
                  {t}
                </button>
             ))}
          </div>
          <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="glass-block p-10 min-h-[300px]"
             >
                <div className="mb-6 flex items-center gap-3">
                  <Activity size={20} className="text-primary" />
                  <h4 className="text-xl font-bold text-text-primary uppercase tracking-tight">{['Nutritional Strategy', 'Metabolic Logic', 'Cardiac Integrity', 'Energy Management'][activeTab]}</h4>
                </div>
                <p className="text-base text-text-secondary leading-loose opacity-90 first-letter:text-4xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-primary">
                  {[aiData.bodyCompositionInsight, aiData.metabolicPatternAnalysis, aiData.cardiovascularHealthNarrative, aiData.energyAndFatigueProfile][activeTab]}
                </p>
             </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ROW 4: Mind-Body */}
      <div className="glass-block p-10 flex flex-col md:flex-row gap-10 items-center">
         <div className="flex-shrink-0 text-center">
           <div className="text-5xl font-black text-primary tracking-tighter mb-2">{aiData.mindBodyScore}%</div>
           <div className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Psychosomatic Sync</div>
         </div>
         <div className="w-[1px] h-20 bg-border-glass hidden md:block" />
         <div className="flex-grow space-y-4">
            <h4 className="text-lg font-bold text-text-primary uppercase flex items-center gap-3"><Brain size={18} className="text-secondary" /> Cognitive Nutrition Integrity</h4>
            <p className="text-sm text-text-secondary leading-relaxed italic">"{aiData.mindBodyNarrative}"</p>
         </div>
         {(aiData.stressImpactOnMetabolism || aiData.stressImpactOnWeight) && (
            <div className="md:w-1/3 bg-background/50 p-6 rounded-2xl border border-border-glass">
                <div className="text-[10px] font-mono text-accent uppercase tracking-widest mb-2 flex items-center gap-2"><Zap size={14} /> Stress Impact</div>
                <p className="text-xs text-text-secondary leading-relaxed">{aiData.stressImpactOnMetabolism || aiData.stressImpactOnWeight}</p>
            </div>
         )}
      </div>

      {/* ROW 5: Lifestyle Matrix */}
       <div className="space-y-6">
        <h3 className="text-2xl font-black text-text-primary uppercase tracking-tighter">Your Nutrition Health Matrix</h3>
        <div className="glass-block overflow-hidden border-none shadow-none bg-surface/50">
          <div className="grid grid-cols-1 md:grid-cols-4 border-t border-l border-border-glass">
            {(aiData.lifestyleFactors || []).map((f, i) => (
              <div key={i} className="p-6 border-b border-r border-border-glass hover:bg-background transition-colors flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-bold text-text-primary">{f.factor}</span>
                  <div className={cn(
                    "px-2 py-0.5 rounded text-[8px] font-bold uppercase",
                    f.currentState === 'optimal' ? "bg-primary/20 text-primary" :
                    f.currentState === 'good' ? "bg-secondary/20 text-secondary" :
                    f.currentState === 'needs-attention' ? "bg-accent/20 text-accent" :
                    f.currentState === 'consider-reviewing' ? "bg-orange-500/20 text-orange-500" :
                    "bg-red-500/20 text-red-500"
                  )}>
                    {f.currentState}
                  </div>
                </div>
                <div className="text-[10px] text-text-muted mb-4 flex-grow italic">Impact: {f.impact}</div>
                <div className="p-2 bg-background rounded-lg border border-border-glass text-[9px] font-mono text-primary flex items-center gap-2">
                  <Compass size={10} /> {f.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
        {aiData.lifestyleFactorsDisclaimer && (
          <div className="text-center text-[9px] font-mono text-text-muted uppercase tracking-widest opacity-60">
            {aiData.lifestyleFactorsDisclaimer}
          </div>
        )}
       </div>

       {/* ROW 6: Timeline */}
       <div className="space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black text-text-primary uppercase tracking-tighter">Your Nutrition Roadmap</h3>
            {aiData.goalTimeline.timelineDisclaimer && (
              <p className="max-w-2xl mx-auto text-[9px] font-mono text-text-muted uppercase tracking-widest leading-relaxed">
                {aiData.goalTimeline.timelineDisclaimer}
              </p>
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-4">
             {Object.keys(aiData.goalTimeline || {}).map((key, idx) => {
                if (key === 'timelineDisclaimer') return null;
                const data = (aiData.goalTimeline as any)[key];
                return (
                  <div key={key} className={cn(
                    "flex-1 p-6 rounded-3xl border transition-all hover:scale-[1.02]",
                    idx === 1 ? "bg-primary border-primary shadow-xl shadow-primary/20" : "bg-surface border-border-glass"
                  )}>
                    <div className={cn(
                      "text-[10px] font-mono uppercase tracking-[0.2em] mb-4 py-1 px-3 rounded-full border w-fit",
                      idx === 1 ? "border-background/20 text-background" : "border-border-glass text-text-muted"
                    )}>{key}</div>
                    <div className={cn("text-base font-bold mb-3 italic", idx === 1 ? "text-background" : "text-text-primary")}>"{data.goal}"</div>
                    <div className={cn("text-xs leading-relaxed mb-6", idx === 1 ? "text-background/80" : "text-text-secondary")}>{data.action}</div>
                    <div className={cn(
                      "inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter",
                      idx === 1 ? "bg-background/20 text-background" : "bg-primary/10 text-primary"
                    )}>
                        <Target size={12} /> Expected: {data.expected}
                    </div>
                  </div>
                );
             })}
          </div>
       </div>

       {/* ROW 7: Recognition */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Metabolic Patterns", items: aiData.hiddenPatterns || [], icon: Globe, color: "text-primary" },
            { title: "Physical Strengths", items: aiData.coreStrengths || [], icon: Shield, color: "text-secondary" },
            { title: "Psychological Nodes", items: aiData.subconsciousBlocks || [], icon: Lightbulb, color: "text-accent" }
          ].map((col, idx) => (
            <div key={idx} className="glass-block p-8 border-t-4 border-t-primary/20">
               <div className="flex items-center gap-3 mb-8">
                  <col.icon size={20} className={col.color} />
                  <h4 className="text-lg font-black text-text-primary uppercase tracking-tighter">{col.title}</h4>
               </div>
               <ul className="space-y-4">
                  {(col.items || []).map((it, i) => (
                    <li key={i} className="flex items-start gap-3 group">
                       <div className="w-1.5 h-1.5 rounded-full bg-border-glass group-hover:bg-primary shrink-0 mt-1.5" />
                       <span className="text-xs text-text-secondary leading-relaxed group-hover:text-text-primary transition-colors">{it}</span>
                    </li>
                  ))}
               </ul>
            </div>
          ))}
       </div>

       {/* ROW 8-11: Final Blocks */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ReportBlock title="Macro Intelligence" icon={Heart} sectionNumber="09">
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <NutritionWheel macros={result.macroSplit} />
                   <div className="space-y-6">
                      <div>
                        <h5 className="text-[10px] font-mono text-primary uppercase tracking-widest mb-2 flex items-center gap-2"><Target size={14} /> Metabolic Typing</h5>
                        <p className="text-xs text-text-secondary italic">"{aiData.metabolicTyping}"</p>
                      </div>
                      <div>
                        <h5 className="text-[10px] font-mono text-accent uppercase tracking-widest mb-2">Optimization Risks</h5>
                        <div className="flex flex-wrap gap-2">
                          {(aiData.nutrientDeficiencyRisks || []).map((r, i) => (
                            <div key={i} className="px-2 py-1 bg-background border border-border-glass rounded text-[9px] font-mono">{r}</div>
                          ))}
                        </div>
                      </div>
                   </div>
                </div>
                {aiData.supplementDisclaimer && (
                  <p className="text-[9px] font-mono text-text-muted uppercase tracking-widest leading-relaxed text-center opacity-60">
                    {aiData.supplementDisclaimer}
                  </p>
                )}
              </div>
          </ReportBlock>

          <ReportBlock title="Next 24HR Calorie Sync" icon={Clock} sectionNumber="10">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   {Object.entries(aiData.next24Hours || {}).map(([key, task]) => {
                      if (key === 'disclaimer') return null;
                      return (
                        <div key={key} className="p-4 rounded-2xl bg-background border border-border-glass h-full">
                            <div className="text-[9px] font-mono text-text-muted uppercase tracking-[0.2em] mb-1">{key}</div>
                            <p className="text-[11px] font-bold text-text-primary leading-tight">{task as string}</p>
                        </div>
                      );
                   })}
                </div>
                {aiData.next24Hours.disclaimer && (
                  <p className="text-[9px] font-mono text-text-muted uppercase tracking-widest leading-relaxed text-center opacity-60">
                    {aiData.next24Hours.disclaimer}
                  </p>
                )}
              </div>
          </ReportBlock>
       </div>

       <div className="glass-block p-12 text-center bg-gradient-to-tr from-primary/10 via-background to-secondary/5 border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[120px] rounded-full -mr-32 -mt-32" />
          <div className="relative z-10">
             <div className="text-[10px] font-mono text-primary uppercase tracking-[0.5em] mb-8">Personalized Nutrition Affirmation</div>
             <blockquote className="text-3xl md:text-5xl font-display italic text-text-primary mb-8 tracking-tighter leading-tight">
                "{aiData.healthAffirmation}"
             </blockquote>
             <div className="max-w-2xl mx-auto">
                <p className="text-sm text-text-secondary leading-relaxed mb-10 opacity-80 whitespace-pre-wrap">{aiData.nerroMessage}</p>
                <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-text-muted uppercase tracking-widest">
                   <div className="w-12 h-[1px] bg-border-glass" />
                   NERRO NUTRITION INTELLIGENCE v1.2.0
                   <div className="w-12 h-[1px] bg-border-glass" />
                </div>
             </div>
          </div>
       </div>

    </div>
  );
}
