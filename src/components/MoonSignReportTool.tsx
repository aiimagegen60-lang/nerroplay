import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Moon, Star, Shield, Zap, Heart, Briefcase, 
  Wallet, Compass, Map, Sun, Award, Flame, 
  Droplet, Wind, Mountain, Share2, Printer, 
  ArrowLeft, RefreshCw, Sparkles, Calendar 
} from 'lucide-react';
import BirthForm from './BirthForm';
import ReportCard from './ReportCard';
import NerroAIPanel from './NerroAIPanel';
import CosmicBackground from './CosmicBackground';
import { BirthData, AstrologyReport } from '../types';
import { calculateAstrologyReport } from '../lib/astrology-engine';

export default function MoonSignReportTool() {
  const [report, setReport] = useState<AstrologyReport | null>(null);
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = (data: BirthData) => {
    setLoading(true);
    setBirthData(data);
    // Simulate complex calculation
    setTimeout(() => {
      const results = calculateAstrologyReport(data);
      setReport(results);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  const resetReport = () => {
    setReport(null);
    setBirthData(null);
  };

  return (
    <div className="relative min-h-screen">
      <CosmicBackground />
      
      <div className="relative z-10 py-10">
        {!report ? (
          <div className="max-w-xl mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12 space-y-4"
            >
              <div className="w-20 h-20 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-6 border border-accent/20 animate-pulse">
                <Moon size={40} />
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-text-primary uppercase tracking-tighter leading-none">
                Moon Sign <span className="text-accent">&</span> Rashi Report
              </h1>
              <p className="text-sm text-text-secondary leading-relaxed max-w-sm mx-auto">
                Discover your Vedic emotional blueprint. Enter your birth details to reveal your Rashi, Nakshatra, and AI-powered spiritual insights.
              </p>
            </motion.div>

            <BirthForm onSubmit={handleCalculate} loading={loading} />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto px-4 space-y-12">
            {/* Report Header */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass p-10 rounded-[3rem] border border-accent/30 bg-accent/5 backdrop-blur-3xl text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 flex gap-3">
                <button 
                  onClick={() => window.print()}
                  className="p-3 bg-surface/50 border border-border-glass rounded-xl text-text-muted hover:text-accent transition-colors"
                >
                  <Printer size={18} />
                </button>
                <button 
                  onClick={resetReport}
                  className="p-3 bg-surface/50 border border-border-glass rounded-xl text-text-muted hover:text-accent transition-colors"
                >
                  <RefreshCw size={18} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="w-24 h-24 bg-accent text-background rounded-full flex items-center justify-center mx-auto text-4xl shadow-2xl shadow-accent/50">
                  {report.moonSign === 'Aries' ? '♈' : 
                   report.moonSign === 'Taurus' ? '♉' :
                   report.moonSign === 'Gemini' ? '♊' :
                   report.moonSign === 'Cancer' ? '♋' : '🌙'}
                </div>
                
                <div className="space-y-1">
                  <h2 className="text-[10px] font-mono text-accent uppercase tracking-[0.4em]">Celestial Revelation for</h2>
                  <h3 className="text-3xl font-black text-text-primary uppercase tracking-tight">{birthData?.fullName}</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                  {[
                    { label: 'Moon Sign', value: report.moonSign, icon: Moon },
                    { label: 'Nakshatra', value: report.moonNakshatra, icon: Star },
                    { label: 'Rashi Lord', value: report.moonLord, icon: Award },
                    { label: 'Sun Sign', value: report.sunSign, icon: Sun },
                  ].map((stat) => (
                    <div key={`stat-${stat.label}`} className="glass p-4 rounded-2xl border border-border-glass bg-surface/30">
                      <div className="text-[8px] font-mono text-text-muted uppercase tracking-widest mb-1 flex items-center justify-center gap-1">
                        <stat.icon size={10} className="text-accent" />
                        {stat.label}
                      </div>
                      <div className="text-xs font-bold text-text-primary uppercase tracking-tight">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Main Report Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ReportCard title="Personality Analysis" icon="Award">
                <p>{report.personalityAnalysis.overview}</p>
                <div className="grid grid-cols-2 gap-3 pt-4">
                  {report.personalityAnalysis.strengths.slice(0, 4).map((s, i) => (
                    <div key={`personality-str-${i}`} className="p-3 bg-accent/5 border border-accent/10 rounded-xl text-[10px] font-bold text-accent uppercase tracking-tight">
                      {s}
                    </div>
                  ))}
                </div>
              </ReportCard>

              <ReportCard title="Emotional Nature" icon="Heart">
                <p>{report.emotionalNature.overview}</p>
                <div className="space-y-4 pt-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-mono text-text-muted uppercase">Core Triggers</span>
                    <p className="text-xs text-text-primary">{report.emotionalNature.triggers.join(", ")}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-mono text-text-muted uppercase">Nurturing Pattern</span>
                    <p className="text-xs text-text-primary">{report.emotionalNature.selfCare}</p>
                  </div>
                </div>
              </ReportCard>

              <ReportCard title="Career & Success" icon="Briefcase">
                <p>{report.careerEnergy.overview}</p>
                <div className="space-y-4 pt-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-mono text-text-muted uppercase">Best Paths</span>
                    <p className="text-xs text-text-primary">{report.careerEnergy.bestProfessions.slice(0, 4).join(", ")}</p>
                  </div>
                </div>
              </ReportCard>

              <ReportCard title="Wealth & Abundance" icon="Wallet">
                <p>{report.wealthPattern.overview}</p>
                <div className="flex items-center gap-3 pt-4">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                        <Zap size={18} />
                    </div>
                    <div>
                        <span className="text-[8px] font-mono text-text-muted uppercase">Wealth Activator</span>
                        <p className="text-xs font-bold text-text-primary uppercase tracking-tight">{report.wealthPattern.wealthActivators[0]}</p>
                    </div>
                </div>
              </ReportCard>

              <ReportCard title="Love & Relationships" icon="Heart">
                <p>{report.loveRelationships.overview}</p>
                <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="space-y-2">
                        <span className="text-[8px] font-mono text-text-muted uppercase">Magnetic With</span>
                        <div className="flex flex-wrap gap-1">
                            {report.loveRelationships.compatibleRashis.slice(0, 3).map((r, i) => (
                                <span key={`compatible-${r}-${i}`} className="px-2 py-1 bg-accent/10 rounded-md text-[9px] font-bold text-accent">{r}</span>
                            ))}
                        </div>
                    </div>
                </div>
              </ReportCard>

              <ReportCard title="Spiritual Evolution" icon="Compass">
                <p>{report.spiritualPath.overview}</p>
              </ReportCard>
            </div>

            {/* Lucky Elements Grid */}
            <div className="glass p-10 rounded-[2.5rem] border border-border-glass">
                <h3 className="text-xl font-bold text-text-primary mb-8 text-center uppercase tracking-tighter">Your Auspicious Elements</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
                    {[
                        { label: 'Colors', value: report.luckyElements.colors[0], icon: Droplet },
                        { label: 'Days', value: report.luckyElements.days[0], icon: Calendar },
                        { label: 'Numbers', value: report.luckyElements.numbers[0], icon: HashIcon },
                        { label: 'Gemstone', value: report.luckyElements.gemstone, icon: Mountain },
                        { label: 'Metal', value: report.luckyElements.metal, icon: Shield },
                        { label: 'Direction', value: report.luckyElements.direction, icon: Compass },
                    ].map((item) => (
                        <div key={`auspicious-${item.label}`} className="space-y-2">
                            <div className="w-10 h-10 bg-surface rounded-xl border border-border-glass flex items-center justify-center text-accent mx-auto">
                                <item.icon size={18} />
                            </div>
                            <div className="text-[8px] font-mono text-text-muted uppercase tracking-widest">{item.label}</div>
                            <div className="text-[10px] font-bold text-text-primary uppercase">{item.value}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Remedies & Mantras */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass p-8 rounded-3xl border border-border-glass space-y-6">
                    <h3 className="text-lg font-bold text-text-primary flex items-center gap-3">
                        <Flame className="text-orange-500" size={20} />
                        Recommended Mantra
                    </h3>
                    <div className="p-6 bg-surface/50 border border-border-glass rounded-2xl text-center">
                        <p className="text-xl font-serif text-text-primary italic mb-4">"{report.recommendedMantras[0].primaryMantra}"</p>
                        <p className="text-xs text-text-secondary leading-relaxed mb-4">{report.recommendedMantras[0].meaning}</p>
                        <div className="flex justify-center gap-6 text-[8px] font-mono text-text-muted uppercase tracking-widest">
                            <span>{report.recommendedMantras[0].repetitions} Repetitions</span>
                            <span>{report.recommendedMantras[0].chantingTime}</span>
                        </div>
                    </div>
                </div>

                <div className="glass p-8 rounded-3xl border border-border-glass space-y-6">
                    <h3 className="text-lg font-bold text-text-primary flex items-center gap-3">
                        <Shield className="text-secondary" size={20} />
                        Vedic Remedies
                    </h3>
                    <div className="space-y-4">
                        {report.vedicRemedies.map((remedy, i) => (
                            <div key={`remedy-${remedy.title.substring(0, 10)}-${i}`} className="p-4 bg-surface/30 border border-border-glass rounded-xl space-y-2">
                                <h4 className="text-xs font-bold text-text-primary uppercase">{remedy.title}</h4>
                                <p className="text-[10px] text-text-secondary leading-normal">{remedy.description}</p>
                                <div className="text-[8px] font-mono text-secondary uppercase tracking-widest">{remedy.benefit}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* NERRO AI Analysis */}
            <NerroAIPanel report={report} birthData={birthData!} />

            {/* Footer Trust Section */}
            <div className="text-center pt-20 pb-10 space-y-6 opacity-60">
                <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest max-w-lg mx-auto">
                    This report is for educational and self-reflection purposes only based on traditional Vedic Astrology principles.
                </p>
                <div className="flex justify-center gap-8">
                    <div className="flex items-center gap-2 text-[8px] font-mono text-text-muted uppercase">
                        <Shield size={12} />
                        Private Data
                    </div>
                    <div className="flex items-center gap-2 text-[8px] font-mono text-text-muted uppercase">
                        <Award size={12} />
                        Vedic Wisdom
                    </div>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const HashIcon = ({ size }: { size: number }) => (
  <span className="font-mono font-bold" style={{ fontSize: size }}>#</span>
);

const CalendarIcon = ({ size }: { size: number }) => (
  <Calendar size={size} />
);
