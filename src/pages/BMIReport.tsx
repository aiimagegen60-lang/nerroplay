
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Download, Share2, Printer, RefreshCw, Activity, Heart, ShieldAlert, Zap, Utensils, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';
import { BMIResult, calculateBMI, UserHealthData } from '../lib/bmi/bmi-engine';
import { SafeStorage } from '../lib/safe-storage';
import BMIGauge from '../components/bmi/BMIGauge';
import BMIScaleBar from '../components/bmi/BMIScaleBar';
import { ReportBlock, MetricCard, HealthScoreRing } from '../components/bmi/ReportBlocks';
import { RiskMeter, ActionCard, TimelineCard, CompareCard } from '../components/bmi/ReportComponents';
import NutritionWheel from '../components/bmi/NutritionWheel';
import NerroHealthAI from '../components/nerro/NerroHealthAI';

export default function BMIReport() {
  const navigate = useNavigate();
  const [report, setReport] = useState<BMIResult | null>(null);
  const [userData, setUserData] = useState<UserHealthData | null>(null);

  useEffect(() => {
    try {
      const savedData = SafeStorage.get<UserHealthData | null>('last_bmi_data', null);
      if (!savedData) {
        navigate('/tools/bmi-calculator');
        return;
      }
      setUserData(savedData);
      const calculated = calculateBMI(savedData);
      setReport(calculated);
    } catch (err) {
      console.error("Critical error in BMI Report initialization:", err);
    }
    
    // Smooth scroll to top on mount
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  if (!report || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest animate-pulse">Syncing Neural Health Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-background text-text-primary overflow-x-hidden">
      {/* Sticky Header Actions */}
      <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-md border-b border-border-glass py-4 px-4 mb-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs font-mono text-text-muted hover:text-primary transition-colors">
                <ChevronLeft size={14} /> BACK TO ANALYZER
            </button>
            <div className="flex gap-4">
                <button onClick={() => window.print()} className="p-2 glass rounded-lg text-text-secondary hover:text-primary transition-colors">
                    <Printer size={18} />
                </button>
                <button className="p-2 glass rounded-lg text-text-secondary hover:text-primary transition-colors">
                    <Share2 size={18} />
                </button>
                <button onClick={() => navigate('/tools/bmi-calculator')} className="flex items-center gap-2 px-4 py-2 bg-primary text-background rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                    <RefreshCw size={14} /> RE-ANALYZE
                </button>
            </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 space-y-12">
        {/* REPORT HEADER */}
        <div 
            className="glass-block p-10 bg-gradient-to-br from-primary/5 to-transparent flex flex-col md:flex-row items-center justify-between gap-10"
        >
            <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tighter uppercase leading-none">
                    Hello, <span className="text-primary italic">{userData.fullName || 'Health Seeker'}</span>
                </h1>
                <div className="flex flex-wrap gap-4 font-mono text-[10px] text-text-muted uppercase tracking-widest">
                    <span>{userData.age} Years</span>
                    <span className="opacity-20">•</span>
                    <span>{userData.gender}</span>
                    <span className="opacity-20">•</span>
                    <span>{report.weightKg} kg</span>
                    <span className="opacity-20">•</span>
                    <span>{report.heightCm} cm</span>
                </div>
            </div>
            <div className="flex items-center gap-10">
                <div className="text-center">
                    <div className="text-[10px] font-mono text-text-muted uppercase tracking-[0.3em] mb-2 text-center">Body Mass Index</div>
                    <div className="text-7xl font-black text-primary tracking-tighter tabular-nums leading-none">
                        {report.bmi}
                    </div>
                </div>
                <div className={cn(
                    "px-6 py-3 rounded-2xl border-2 font-black text-center text-xs uppercase tracking-[0.2em] shadow-xl",
                    report.category === 'normal' ? "border-green-500/20 bg-green-500/10 text-green-600" : "border-accent/20 bg-accent/10 text-accent"
                )}>
                    {report.categoryLabel}
                </div>
            </div>
        </div>

        {/* SECTION 1: BMI OVERVIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ReportBlock title="BMI Gauge Analysis" icon={Activity} sectionNumber="01">
                <BMIGauge bmi={report.bmi} categoryLabel={report.categoryLabel} />
            </ReportBlock>
            <ReportBlock title="Health Narrative" icon={Heart} sectionNumber="02">
                <div className="space-y-6">
                    <p className="text-sm text-text-secondary leading-relaxed first-letter:text-4xl first-letter:font-black first-letter:text-primary first-letter:mr-3 first-letter:float-left">
                        {report.categoryDescription}
                    </p>
                    <div className="p-5 bg-background rounded-2xl border border-border-glass">
                        <h4 className="text-[10px] font-mono text-primary uppercase tracking-widest mb-3">Health Profile Adjustment</h4>
                        <p className="text-xs text-text-secondary italic">"{report.ageAdjustedCategory} {report.genderNote}"</p>
                    </div>
                </div>
            </ReportBlock>
        </div>

        {/* SECTION 2: SCALE */}
        <ReportBlock title="Body Mass Distribution Scale" icon={Activity} sectionNumber="03">
            <div className="space-y-12">
                <BMIScaleBar bmi={report.bmi} />
                <CompareCard current={report.weightKg} idealMin={report.idealWeightMin} idealMax={report.idealWeightMax} />
                <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 text-center">
                    <p className="text-sm text-text-secondary">
                        To reach your ideal weight midpoint of <span className="text-primary font-black">{report.idealWeightMidpoint} kg</span>, 
                        an adjustment of <span className="text-primary font-black">{Math.abs(report.distanceFromIdeal)} kg</span> is suggested.
                    </p>
                </div>
            </div>
        </ReportBlock>

        {/* SECTION 3: RISK ASSESSMENT */}
        <ReportBlock title="Health Risk Profile" icon={ShieldAlert} sectionNumber="04">
            <div className="space-y-12">
                <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl flex items-start gap-4">
                    <ShieldAlert className="text-orange-500 shrink-0" size={20} />
                    <p className="text-[10px] text-orange-600 font-medium leading-normal">
                        DISCLAIMER: These are statistical health risk associations based on body mass demographics and metabolic modeling. They are NOT medical diagnoses. Please consult a physician.
                    </p>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    <RiskMeter label="Cardiovascular Risk" score={report.cardiovascularRisk} />
                    <RiskMeter label="Metabolic Load" score={report.metabolicRisk} />
                    <RiskMeter label="Mobility Index" score={report.mobilityScore} inverse />
                    <RiskMeter label="Bio-Vitality Score" score={report.energyScore} inverse />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {report.healthRisks.map((risk, idx) => (
                        <div key={idx} className="p-6 bg-surface border border-border-glass rounded-2xl space-y-4">
                            <div className="flex justify-between items-center">
                                <h4 className="text-base font-bold text-text-primary">{risk.name}</h4>
                                <div className={cn(
                                    "px-2 py-0.5 rounded text-[8px] font-black uppercase",
                                    risk.severity === 'low' ? "bg-green-100 text-green-700" :
                                    risk.severity === 'moderate' ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"
                                )}>
                                    {risk.severity} Severity
                                </div>
                            </div>
                            <p className="text-xs text-text-secondary leading-relaxed">{risk.description}</p>
                            <div className="p-3 bg-primary/5 rounded-xl text-[10px] text-primary flex items-center gap-3">
                                <Zap size={14} /> <strong>Tip:</strong> {risk.preventionTip}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </ReportBlock>

        {/* SECTION 4: RECOMMENDATIONS */}
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Zap size={24} className="text-primary" />
                <h2 className="text-2xl font-black text-text-primary uppercase tracking-tighter">Smart Health Interventions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {report.recommendations.map((item) => (
                    <ActionCard key={item.id} item={item} />
                ))}
            </div>
        </div>

        {/* SECTION 5: NUTRITION */}
        <ReportBlock title="Nutritional Intelligence" icon={Utensils} sectionNumber="05">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div className="space-y-8">
                   <div className="p-6 bg-primary border-primary border shadow-xl shadow-primary/20 rounded-3xl text-background">
                       <div className="text-[10px] font-mono uppercase tracking-[0.2em] mb-2 opacity-70">Focus Objective</div>
                       <h4 className="text-2xl font-black tracking-tighter uppercase">{report.nutritionFocus.primaryFocus}</h4>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                       <MetricCard label="Calorie Target" value={`${report.nutritionFocus.dailyCalorieRange.min}-${report.nutritionFocus.dailyCalorieRange.max}`} subtext="Daily range for metabolic balance" />
                       <MetricCard label="Protein Goal" value={`${report.nutritionFocus.proteinGoalG}g`} subtext="Optimal for muscle synthesis" />
                       <MetricCard label="Water Intake" value={`${report.nutritionFocus.waterGoalL}L`} subtext="Hydration baseline per weight" />
                       <MetricCard label="Fiber Target" value={`${report.nutritionFocus.fiberGoalG}g`} subtext="Digestive health baseline" />
                   </div>
               </div>
               <div className="flex flex-col items-center">
                   <NutritionWheel macros={report.nutritionFocus.macroSplit} />
                   <div className="mt-8 space-y-4 w-full">
                       <div className="flex flex-wrap gap-2 justify-center">
                           {report.nutritionFocus.keyFoods.map(food => (
                               <span key={food} className="px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest">{food}</span>
                           ))}
                       </div>
                       <div className="flex flex-wrap gap-2 justify-center">
                           {report.nutritionFocus.foodsToLimit.map(food => (
                               <span key={food} className="px-3 py-1 bg-red-500/5 text-red-400 rounded-full text-[10px] font-black uppercase tracking-widest leading-none border border-red-500/10">{food}</span>
                           ))}
                       </div>
                   </div>
               </div>
           </div>
           <p className="mt-12 text-sm text-text-secondary leading-relaxed border-l-4 border-primary pl-6 p-4 bg-primary/5 rounded-r-2xl">
                {report.nutritionFocus.nutritionSummary}
           </p>
        </ReportBlock>

        {/* SECTION 6: NEXT STEPS */}
        <ReportBlock title="Action Roadmap — Next 24-72h" icon={Calendar} sectionNumber="06">
            <TimelineCard steps={report.nextSteps} />
        </ReportBlock>

        {/* SECTION 7: NERRO AI */}
        <section className="pt-20 border-t border-border-glass">
            <NerroHealthAI report={report} />
        </section>

      </div>
    </div>
  );
}
