
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Share2, Printer, RefreshCw, Activity, Zap, Flame, Target, Utensils, Calendar, Clock, Pizza, Beef, Leaf, Brain } from 'lucide-react';
import { cn } from '../lib/utils';
import { CalorieResult, calculateCalories, CalorieInput } from '../lib/calorie/calorie-engine';
import { SafeStorage } from '../lib/safe-storage';
import { MetricCard, ReportBlock } from '../components/bmi/ReportBlocks';
import NutritionWheel from '../components/bmi/NutritionWheel';
import { TimelineCard } from '../components/bmi/ReportComponents';

export default function CalorieReport() {
  const navigate = useNavigate();
  const [report, setReport] = useState<CalorieResult | null>(null);
  const [inputData, setInputData] = useState<CalorieInput | null>(null);

  useEffect(() => {
    try {
      const savedInput = SafeStorage.get<CalorieInput | null>('last_calorie_input', null);
      if (!savedInput) {
        navigate('/tools/calorie-calculator');
        return;
      }
      setInputData(savedInput);
      setReport(calculateCalories(savedInput));
    } catch (err) {
      console.error("Error initializing calorie report:", err);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  if (!report || !inputData) return null;

  return (
    <div className="min-h-screen pb-20 bg-background text-text-primary overflow-x-hidden">
      <Helmet>
        <title>Your Metabolic Nutrition Report | NERROPLAY HEALTH</title>
      </Helmet>

      {/* Sticky Header Actions */}
      <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-md border-b border-border-glass py-4 px-4 mb-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs font-mono text-text-muted hover:text-primary transition-colors">
                <ChevronLeft size={14} /> BACK
            </button>
            <div className="flex gap-4">
                <button onClick={() => window.print()} className="p-2 glass rounded-lg text-text-secondary hover:text-primary transition-colors">
                    <Printer size={18} />
                </button>
                <button onClick={() => navigate('/tools/calorie-calculator')} className="flex items-center gap-2 px-4 py-2 bg-primary text-background rounded-xl text-[10px] font-black uppercase tracking-widest">
                    <RefreshCw size={14} /> RE-CALCULATE
                </button>
            </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 space-y-12">
        {/* HEADER BOARD */}
        <div className="glass-block p-10 bg-gradient-to-br from-primary/5 to-transparent flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tighter uppercase leading-none">
                    Metabolic <span className="text-primary italic">Status</span>
                </h1>
                <div className="flex flex-wrap gap-4 font-mono text-[10px] text-text-muted uppercase tracking-widest">
                    <span>{inputData.fullName || 'User'}</span>
                    <span className="opacity-20">•</span>
                    <span>{inputData.age}Y</span>
                    <span className="opacity-20">•</span>
                    <span>{inputData.weight}KG</span>
                    <span className="opacity-20">•</span>
                    <span>{inputData.activityLevel}</span>
                </div>
            </div>
            <div className="flex items-center gap-10">
                <div className="text-center">
                    <div className="text-[10px] font-mono text-text-muted uppercase tracking-[0.3em] mb-2">Daily Target</div>
                    <div className="text-7xl font-black text-primary tracking-tighter tabular-nums leading-none">
                        {report.targetCalories}
                    </div>
                </div>
                <div className="px-6 py-3 rounded-2xl border-2 border-primary/20 bg-primary/10 text-primary font-black text-center text-xs uppercase tracking-[0.2em]">
                    KCAL / DAY
                </div>
            </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard label="BMR (Resting)" value={`${report.bmr} kcal`} subtext="Baseline survival energy" icon={Clock} />
            <MetricCard label="TDEE (Active)" value={`${report.tdee} kcal`} subtext="Total daily maintenance" icon={Activity} />
            <MetricCard label="Goal Vector" value={inputData.goal.toUpperCase()} subtext={`Targeting ${inputData.goal}`} icon={Target} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* NUTRITION FOCUS */}
            <ReportBlock title="Macros & Micros Strategy" icon={Utensils} sectionNumber="01">
                <div className="space-y-8">
                    <div className="flex justify-center">
                        <NutritionWheel macros={report.macroSplit} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 rounded-2xl bg-surface border border-border-glass text-center">
                            <div className="text-[9px] font-mono text-primary uppercase mb-1">Protein</div>
                            <div className="text-xl font-black text-text-primary">{report.macroSplit.protein}g</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-surface border border-border-glass text-center">
                            <div className="text-[9px] font-mono text-secondary uppercase mb-1">Carbs</div>
                            <div className="text-xl font-black text-text-primary">{report.macroSplit.carbs}g</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-surface border border-border-glass text-center">
                            <div className="text-[9px] font-mono text-accent uppercase mb-1">Fats</div>
                            <div className="text-xl font-black text-text-primary">{report.macroSplit.fats}g</div>
                        </div>
                    </div>
                </div>
            </ReportBlock>

            {/* PERFORMANCE ANALYSIS */}
            <ReportBlock title="Neroplay Performance Sync" icon={Brain} sectionNumber="02">
                <div className="space-y-6">
                    <div className="p-6 bg-primary/5 border border-primary/20 rounded-3xl">
                        <h4 className="text-[10px] font-mono text-primary uppercase tracking-widest mb-4 flex items-center gap-2"><Flame size={14} /> Metabolic Forecast</h4>
                        <p className="text-sm text-text-secondary leading-relaxed">
                            Based on your activity level of <span className="font-bold text-text-primary">{inputData.activityLevel}</span>, your metabolism is currently in an <strong>{inputData.activityLevel === 'sedentary' ? 'Economy' : 'High-Performance'}</strong> state. 
                            To achieve your <strong>{inputData.goal}</strong> goal, we recommend maintaining a consistent intake of <strong>{report.targetCalories} kcal</strong>.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center gap-4 p-4 border border-border-glass rounded-2xl">
                             <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                                <Leaf size={20} />
                             </div>
                             <div>
                                <div className="text-[9px] font-mono text-text-muted uppercase">Recommended Priority</div>
                                <div className="text-sm font-bold text-text-primary">Nutrient Density {'>'} Calorie Restriction</div>
                             </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 border border-border-glass rounded-2xl">
                             <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                <Zap size={20} />
                             </div>
                             <div>
                                <div className="text-[9px] font-mono text-text-muted uppercase">Metabolic Flexibility</div>
                                <div className="text-sm font-bold text-text-primary">High potential for muscle re-composition</div>
                             </div>
                        </div>
                    </div>
                </div>
            </ReportBlock>
        </div>

        <div className="py-12">
            <button 
                onClick={() => navigate('/tools/calorie-calculator')}
                className="mx-auto flex items-center gap-3 px-8 py-4 glass rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:text-primary transition-all"
            >
                <RefreshCw size={14} /> Adjust Input Parameters
            </button>
        </div>
      </div>
    </div>
  );
}
