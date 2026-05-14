
import React from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Sparkles, Brain, Activity, ShieldCheck, ArrowDownCircle, BookOpen, Calculator, Info } from 'lucide-react';
import BMIForm from '../components/bmi/BMIForm';
import { AdBanner } from '../components/AdComponents';

export default function BMIAnalyzer() {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>BMI Analyzer PRO AI — Free BMI Calculator with Health Intelligence Report</title>
        <meta name="description" content="Calculate your BMI instantly and receive a comprehensive AI health intelligence report. Get personalized nutrition advice, health risk assessment, and NERRO AI insights." />
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
            <Sparkles size={14} /> AI-Powered Health Diagnosis
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] mb-8"
          >
            Know Your <span className="text-primary italic">Body.</span><br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary">Transform</span> Your Health.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-text-secondary text-lg md:text-xl font-medium leading-relaxed mb-12"
          >
            Enter your details and receive a comprehensive AI health intelligence report powered by <span className="text-primary font-black">NERRO</span> — going far beyond a simple BMI number.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center gap-4"
          >
             <button 
              onClick={() => document.getElementById('bmi-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex flex-col items-center gap-2 text-text-muted hover:text-primary transition-colors group"
             >
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Begin Analysis</span>
                <ArrowDownCircle className="animate-bounce group-hover:scale-110 transition-transform" />
             </button>
          </motion.div>
        </div>
      </section>

      {/* Main Form Section */}
      <section id="bmi-form" className="py-20 px-4 bg-surface/30 border-y border-border-glass">
        <BMIForm />
      </section>

      {/* Trust & Educational Section */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {[
            { icon: ShieldCheck, title: "Clinically Informed", desc: "Based on WHO standard BMI categories and modern nutritional frameworks." },
            { icon: Brain, title: "AI-Powered", desc: "NERRO AI identifies behavioral patterns and hidden health trends." },
            { icon: Activity, title: "12 Dimension Analysis", desc: "We track everything from physical vitality to immune resilience." },
            { icon: Sparkles, title: "Free Intelligence", desc: "High-grade medical wellness reports without any subscription." }
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
              <h2 className="text-4xl md:text-5xl font-black text-text-primary uppercase tracking-tighter">Why BMI Alone <span className="text-primary">Isn't Enough</span></h2>
              <div className="prose prose-slate dark:prose-invert text-base text-text-secondary leading-relaxed space-y-6">
                <p>
                  While Body Mass Index (BMI) is a valuable statistical tool used globally by medical professionals to estimate health risks associated with weight, it is essentially a measure of <strong>quantity, not quality.</strong> 
                </p>
                <div className="p-6 bg-primary/5 border-l-4 border-l-primary rounded-r-2xl italic">
                  "Health is a multi-dimensional synthesis of physical, metabolic, and behavioral markers."
                </div>
                <p>
                  Standard calculators tell you where you are on a scale. NERRO AI tells you <em>why</em> you are there and how to move forward. By analyzing the intersection of your physical data with behavioral patterns, we provide a holistic view of your wellness trajectory.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full animate-pulse" />
              <div className="relative glass-block p-1 bg-gradient-to-br from-primary/20 to-secondary/20">
                 <div className="bg-surface rounded-[1.8rem] p-8 space-y-6">
                    <div className="flex items-center gap-4 border-b border-border-glass pb-6">
                      <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                         <Calculator size={24} />
                      </div>
                      <h4 className="text-xl font-bold text-text-primary">Medical Reference</h4>
                    </div>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center text-xs font-mono uppercase">
                          <span>Physical Dimension</span>
                          <span className="text-primary">+34%</span>
                       </div>
                       <div className="h-1.5 bg-border-glass rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-[70%]" />
                       </div>
                       <div className="flex justify-between items-center text-xs font-mono uppercase">
                          <span>Metabolic Load</span>
                          <span className="text-secondary">-12%</span>
                       </div>
                       <div className="h-1.5 bg-border-glass rounded-full overflow-hidden">
                          <div className="h-full bg-secondary w-[45%]" />
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
             <h2 className="text-4xl font-black text-text-primary uppercase tracking-tighter">Frequently Asked Questions</h2>
             <p className="text-text-muted font-mono text-[10px] uppercase tracking-widest">Medical Documentation & AI Protocols</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { q: "Is BMI an accurate health measure?", a: "BMI is a reliable screening tool but doesn't account for muscle mass or body composition. We use it as a baseline and enhance it with AI analysis." },
              { q: "What does NERRO AI analyze?", a: "NERRO analyzes 8 dimensions including metabolic health, CV wellness, and behavioral patterns to generate your personalized report." },
              { q: "How is this different from other calculators?", a: "Unlike static calculators, we provide a full health intelligence profile with nutrition, exercises, and a 12-month roadmap." },
              { q: "Is my data stored anywhere?", a: "Your privacy is paramount. Calculations happen in-flight and sensitive data is not permanently stored." },
              { q: "Should I see a doctor?", a: "Yes. This report is educational. Any significant health changes should be discussed with a qualified healthcare professional." }
            ].map((faq, i) => (
              <div key={i} className="p-8 bg-surface border border-border-glass rounded-3xl hover:border-primary/30 transition-colors">
                <h4 className="font-bold text-text-primary mb-4 italic flex items-center gap-3">
                   <Info size={16} className="text-primary" />
                   "{faq.q}"
                </h4>
                <p className="text-sm text-text-secondary leading-relaxed opacity-80">{faq.a}</p>
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
