import React, { useEffect, useState, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Heart, Brain, Zap, DollarSign, Stars, MessageSquare, Home, ShieldAlert, BookOpen, Share2, RefreshCw, AlertCircle } from 'lucide-react';
import { KundliMatchReport, KundliMatchInput } from '../lib/types';
import { SafeStorage } from '../lib/safe-storage';
import CompatibilityMeter from '../components/CompatibilityMeter';
import GunaGrid from '../components/GunaGrid';
import DoshaPanel from '../components/DoshaPanel';
import NerroRelationshipAI from '../components/NerroRelationshipAI';

// --- Error Boundary for Sections ---
class SectionErrorBoundary extends React.Component<
  { children: React.ReactNode; sectionName: string },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; sectionName: string }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="glass p-8 text-center space-y-4">
          <AlertCircle className="mx-auto text-accent" size={32} />
          <p className="font-bold text-text-secondary">Analysis module {this.props.sectionName} is offline.</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="text-xs font-black uppercase text-primary underline"
          >
            Retry Section
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function KundliMatchingReport() {
  const navigate = useNavigate();
  const [report, setReport] = useState<KundliMatchReport | null>(null);
  const [input, setInput] = useState<KundliMatchInput | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedInput = SafeStorage.get<KundliMatchInput | null>('current_kundli_input', null);
    const storedReport = SafeStorage.get<KundliMatchReport | null>('current_kundli_report', null);
    
    if (!storedInput || !storedReport) {
      navigate('/kundli-matching');
      return;
    }
    
    setInput(storedInput);
    setReport(storedReport);
  }, [navigate]);

  if (!isClient || !report || !input) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const renderCompatibilityArea = (data: any, icon: React.ComponentType<{ size?: number | string; className?: string }>, color: 'primary' | 'secondary' | 'accent', keyPrefix: string) => {
    const colorMap = {
      primary: 'bg-primary/10 text-primary bg-primary',
      secondary: 'bg-secondary/10 text-secondary bg-secondary',
      accent: 'bg-accent/10 text-accent bg-accent',
    };
    const parts = colorMap[color].split(' ');

    return (
      <SectionErrorBoundary key={keyPrefix} sectionName={data.label}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="glass p-10 space-y-8"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl ${parts[0]} ${parts[1]} flex items-center justify-center shadow-sm`}>
                {React.createElement(icon, { size: 24 })}
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tighter">{data.label}</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mt-1 italic">Synastry Index // {Math.round(data.score)}%</p>
              </div>
            </div>
            <div className="text-4xl font-black tracking-tighter text-text-primary">
              {Math.round(data.score)}%
            </div>
          </div>

          <div className="h-2 w-full bg-border-glass rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: `${data.score}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className={`h-full ${parts[2]}`}
            />
          </div>

          <p className="text-lg font-bold text-text-secondary leading-relaxed first-letter:text-4xl first-letter:font-black first-letter:mr-2 first-letter:float-left">
            {data.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-border-glass">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Core Strengths</h4>
              <ul className="space-y-2">
                {data.strengths.map((s: string, i: number) => (
                  <li key={`str-${keyPrefix}-${i}`} className="flex items-center gap-2 text-sm font-bold text-text-primary">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Growth Vectors</h4>
              <ul className="space-y-2">
                {data.growthOpportunities.map((s: string, i: number) => (
                  <li key={`grow-${keyPrefix}-${i}`} className="flex items-center gap-2 text-sm font-bold text-text-primary">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" /> {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </SectionErrorBoundary>
    );
  };

  return (
    <div className="min-h-screen py-32 px-6 max-w-7xl mx-auto space-y-20">
      <Helmet>
        <title>{input.partner1.fullName} & {input.partner2.fullName} | Kundli Compatibility Report</title>
      </Helmet>

      {/* Header */}
      <header className="text-center space-y-8">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="relative inline-block"
        >
           <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full animate-pulse" />
           <h1 className="relative text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none">
              Partner Kundali <br /> Match Report
           </h1>
        </motion.div>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 px-10 py-6 glass rounded-[3rem]">
           <ProfileBadge name={input.partner1.fullName} rashi={report.partner1Rashi} nakshatra={report.partner1Nakshatra} color="primary" />
           <Heart className="text-accent fill-accent/20 animate-pulse" size={40} />
           <ProfileBadge name={input.partner2.fullName} rashi={report.partner2Rashi} nakshatra={report.partner2Nakshatra} color="secondary" />
        </div>
      </header>

      {/* Score Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <SectionErrorBoundary sectionName="Meter">
          <CompatibilityMeter score={report.gunaMilanScore} grade={report.gunaMilanGrade} />
        </SectionErrorBoundary>
        
        <div className="space-y-6">
          <h2 className="text-4xl font-black uppercase tracking-tighter">Vedic Guna Sync</h2>
          <p className="text-xl font-bold text-text-secondary leading-relaxed">
            Your connection holds a score of <span className="text-text-primary">{report.gunaMilanScore}/36</span>. 
            This represents an structural alignment grade of <span className="text-primary">{report.gunaMilanGrade}</span>.
          </p>
          <div className="space-y-4 text-text-secondary font-medium italic leading-relaxed pt-6 border-t border-border-glass">
             <p>{report.relationshipEnergy.overallSummary}</p>
             <p className="text-sm">"Guna Milan is one lens of compatibility. A conscious, committed relationship is built on values and growth beyond any singular metric."</p>
          </div>
        </div>
      </section>

      {/* Ashtakoot Grid */}
      <SectionErrorBoundary sectionName="Ashtakoot">
        <GunaGrid data={report.ashtakootBreakdown} />
      </SectionErrorBoundary>

      {/* Detailed Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {renderCompatibilityArea(report.emotionalCompatibility, Heart, 'primary', 'emotional')}
        {renderCompatibilityArea(report.mentalCompatibility, Brain, 'secondary', 'mental')}
        {renderCompatibilityArea(report.physicalCompatibility, Zap, 'accent', 'physical')}
        {renderCompatibilityArea(report.financialCompatibility, DollarSign, 'primary', 'financial')}
        {renderCompatibilityArea(report.spiritualCompatibility, Stars, 'secondary', 'spiritual')}
        {renderCompatibilityArea(report.communicationCompatibility, MessageSquare, 'accent', 'communication')}
      </div>

      {/* Long term & family */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {renderCompatibilityArea(report.longTermStability, Home, 'primary', 'stability')}
        {renderCompatibilityArea(report.familyHarmony, BookOpen, 'secondary', 'harmony')}
      </div>

      {/* Dosha Analysis */}
      <SectionErrorBoundary sectionName="Dosha">
        <DoshaPanel 
          manglik={report.manglikDosha} 
          nadi={report.nadiDosha} 
          bhakoot={report.bhakootDosha} 
        />
      </SectionErrorBoundary>

      {/* AI Intelligence */}
      <SectionErrorBoundary sectionName="NERRO AI">
        <NerroRelationshipAI input={input} report={report} />
      </SectionErrorBoundary>

      {/* Remedy Engine */}
      <section className="space-y-12 pb-20">
         <div className="text-center">
            <h2 className="text-4xl font-black uppercase tracking-tighter">Cosmic Remedies</h2>
            <p className="text-text-muted mt-2 uppercase tracking-widest font-mono text-[10px]">Actionable Harmony protocols</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {report.remedies.map((remedy, i) => (
               <div key={`remedy-${i}-${remedy.title}`} className="glass p-8 space-y-4 group hover:border-primary/40 transition-all">
                  <div className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest inline-block">
                     {remedy.category}
                  </div>
                  <h4 className="text-xl font-black tracking-tight">{remedy.title}</h4>
                  <p className="text-text-secondary leading-relaxed font-bold">{remedy.description}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-muted group-hover:text-primary transition-colors">Benefit: {remedy.benefit}</p>
               </div>
            ))}
         </div>
      </section>

      {/* Bottom Actions */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 z-50 pointer-events-none">
         <div className="max-w-xl mx-auto flex items-center justify-between gap-4 pointer-events-auto glass p-4 rounded-[2rem] shadow-glow border-2 border-white/5 backdrop-blur-2xl">
            <button
               onClick={() => navigate('/kundli-matching')}
               className="flex items-center justify-center p-4 rounded-2xl glass hover:bg-surface text-text-muted transition-all"
            >
               <RefreshCw size={24} />
            </button>
            <button
               onClick={() => window.print()}
               className="flex-grow py-4 bg-text-primary text-background rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-accent hover:text-black transition-all"
            >
               Order PDF Report
            </button>
            <button
               className="flex items-center justify-center p-4 rounded-2xl glass hover:bg-surface text-text-muted transition-all"
            >
               <Share2 size={24} />
            </button>
         </div>
      </footer>

      {/* Global Disclaimer */}
      <div className="text-center py-20 opacity-40">
         <p className="max-w-4xl mx-auto text-[11px] font-bold text-text-secondary leading-relaxed">
            This compatibility analysis is based on traditional Vedic Jyotish Shastra principles and is provided for educational, cultural, and self-reflection purposes only. It does not constitute professional relationship advice. The quality of any partnership is shaped by the choices and values of both individuals.
         </p>
      </div>
    </div>
  );
}

function ProfileBadge({ name, rashi, nakshatra, color }: { name: string, rashi: string, nakshatra: string, color: string }) {
   return (
      <div className="text-center">
         <p className={`text-2xl font-black tracking-tighter text-${color} uppercase truncate max-w-[200px]`}>{name}</p>
         <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-text-primary">{rashi} Rashi</span>
            <div className="w-1 h-1 rounded-full bg-border-glass" />
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{nakshatra}</span>
         </div>
      </div>
   );
}
