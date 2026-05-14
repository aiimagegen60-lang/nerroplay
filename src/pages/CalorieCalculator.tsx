
import React from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Sparkles, Brain, Activity, ShieldCheck, ArrowDownCircle, Utensils, Zap, Info } from 'lucide-react';
import CalorieForm from '../components/calorie/CalorieForm';
import { AdBanner } from '../components/AdComponents';

export default function CalorieCalculator() {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Daily Calorie Calculator — TDEE & BMR Health Intelligence | NERROPLAY</title>
        <meta name="description" content="Calculate your TDEE and BMR with NERRO AI. Get personalized nutrition goals, macro splits, and a 12-week workout strategy." />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-primary/5 blur-[120px] rounded-full -z-10" />
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-8 border border-primary/20"
          >
            <Sparkles size={14} /> Metabolic Intelligence Engine
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] mb-8"
          >
            Fuel Your <span className="text-primary italic">Ambition.</span><br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary">Optimize</span> Metabolism.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-text-secondary text-lg md:text-xl font-medium leading-relaxed mb-12"
          >
            Calculate your TDEE, BMR, and receive a personalized nutrition and workout strategy powered by <span className="text-primary font-black">NERRO AI.</span>
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center gap-4"
          >
             <button 
              onClick={() => document.getElementById('calorie-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex flex-col items-center gap-2 text-text-muted hover:text-primary transition-colors group"
             >
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Start Calculation</span>
                <ArrowDownCircle className="animate-bounce group-hover:scale-110 transition-transform" />
             </button>
          </motion.div>
        </div>
      </section>

      {/* Main Form Section */}
      <section id="calorie-form" className="py-20 px-4 bg-surface/30 border-y border-border-glass">
        <CalorieForm />
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {[
            { icon: Utensils, title: "Macro Precision", desc: "Get deep-level breakdown of proteins, fats, and carbs tailored to your goal." },
            { icon: Brain, title: "Neural Metabolic Logic", desc: "NERRO identifies your metabolic typing and hormonal calorie sensitivity." },
            { icon: Activity, title: "TDEE + BMR Sync", desc: "Accurate calculations using MSJ equations and activity-based scaling." },
            { icon: Zap, title: "Performance Ready", desc: "Build a physical roadmap that fuels your performance, not just weight changes." }
          ].map((item, i) => (
            <div key={i} className="p-8 rounded-3xl border border-border-glass hover:border-primary/20 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <item.icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-3 uppercase tracking-tight">{item.title}</h3>
              <p className="text-xs text-text-secondary leading-relaxed opacity-70">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-black text-text-primary uppercase tracking-tighter">Beyond The <span className="text-primary">Calorie Count</span></h2>
              <div className="prose prose-slate dark:prose-invert text-base text-text-secondary leading-relaxed space-y-6">
                <p>
                  Metabolism is not a static number; it's a dynamic energetic system. Standard calculators treat your body like a furnace, but NERRO treats it like a precision-engineered engine.
                </p>
                <div className="p-6 bg-primary/5 border-l-4 border-l-primary rounded-r-2xl italic">
                  "Nutrition is information. Your calorie target is the volume, but food quality is the signal."
                </div>
                <p>
                  Our AI analysis helps you understand how sleep, stress, and activity frequency affect your TDEE. We provide more than just a number; we provide a biological strategy for long-term health.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full animate-pulse" />
              <div className="relative glass-block p-1 bg-gradient-to-br from-primary/20 to-secondary/20">
                 <div className="bg-surface rounded-[1.8rem] p-8 space-y-6">
                    <div className="flex items-center gap-4 border-b border-border-glass pb-6">
                      <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                         <Activity size={24} />
                      </div>
                      <h4 className="text-xl font-bold text-text-primary uppercase">NERRO HEALTH BOARD</h4>
                    </div>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center text-xs font-mono uppercase">
                          <span>Metabolic Rate</span>
                          <span className="text-primary">Active</span>
                       </div>
                       <div className="h-1.5 bg-border-glass rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-[85%]" />
                       </div>
                       <div className="flex justify-between items-center text-xs font-mono uppercase">
                          <span>Energy Storage</span>
                          <span className="text-secondary">Optimal</span>
                       </div>
                       <div className="h-1.5 bg-border-glass rounded-full overflow-hidden">
                          <div className="h-full bg-secondary w-[60%]" />
                       </div>
                    </div>
                 </div>
              </div>
            </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 bg-background border-t border-border-glass">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
             <h2 className="text-4xl font-black text-text-primary uppercase tracking-tighter">Nutrition & AI FAQ</h2>
             <p className="text-text-muted font-mono text-[10px] uppercase tracking-widest">Metabolic Science & Protocol Documentation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { q: "What is BMR?", a: "Basal Metabolic Rate is the number of calories your body needs to maintain basic life functions while at complete rest." },
              { q: "How accurate is TDEE?", a: "Total Daily Energy Expenditure is an estimate. It varies based on accurate activity reporting and individual metabolic variance." },
              { q: "Are macro ratios fixed?", a: "No, we suggest a balanced 40/30/30 split, but NERRO AI may suggest adjustments based on your specific goals." },
              { q: "Is caloric deficit safe?", a: "A 500kcal deficit is standard for sustainable 0.5kg/week loss. Avoid extreme deficits below your BMR without medical supervision." }
            ].map((faq, i) => (
              <div key={i} className="p-8 bg-surface border border-border-glass rounded-3xl hover:border-primary/30 transition-colors">
                <h4 className="font-bold text-text-primary mb-4 italic flex items-center gap-3 text-sm">
                   <Info size={16} className="text-primary" />
                   "{faq.q}"
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed opacity-80">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="py-12 px-4">
        <AdBanner />
      </div>
    </div>
  );
}
