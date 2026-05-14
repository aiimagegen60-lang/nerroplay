import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, Heart, Activity, CheckCircle2, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import PartnerForm, { KundliMatchFormData } from '../components/PartnerForm';
import { calculateKundliMatch } from '../lib/kundli-engine';
import { SafeStorage } from '../lib/safe-storage';

export default function KundliMatchingHome() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: KundliMatchFormData) => {
    setIsLoading(true);
    try {
      // Small artificial delay for "calculating cosmic patterns" feel
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const report = calculateKundliMatch(data);
      
      // Store in session storage for the report page
      SafeStorage.set('current_kundli_input', data);
      SafeStorage.set('current_kundli_report', report);
      
      navigate('/kundli-matching/report');
    } catch (error) {
      console.error('Calculation error:', error);
      alert('Something went wrong with the calculation. Please check your inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Partner Kundali Matching Tool | NerroPlay</title>
        <meta name="description" content="Calculate professional Vedic Kundli matching (Gun Milan) with AI-powered relationship analysis. Deep compatibility insights for partners." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/5 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
        </div>

        <div className="max-w-6xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-primary/20"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Vedic Relationship Intelligence v2.4</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9]"
          >
            Partner <span className="text-primary italic">Kundali</span><br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary">Matching Tool</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-text-secondary text-lg md:text-xl font-medium leading-relaxed"
          >
            Vedic Kundli Matching powered by <span className="text-secondary font-black">5,000 years</span> of Jyotish wisdom and modern AI relationship pattern recognition.
          </motion.p>
        </div>
      </section>

      {/* Form Section */}
      <section id="match-form" className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <PartnerForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6 bg-surface/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<Activity className="text-primary" />}
              title="36-Point Guna Milan"
              description="Full Ashtakoot analysis including Nadi, Bhakoot, and Gana matching for a comprehensive structural sync report."
            />
            <FeatureCard 
              icon={<Heart className="text-accent" />}
              title="NERRO AI Insights"
              description="Deep relationship dynamism analysis using neural patterns to reveal emotional resonance and attachment styles."
            />
            <FeatureCard 
              icon={<CheckCircle2 className="text-secondary" />}
              title="Dosha Remedies"
              description="Detected Manglik or Nadi doshas are matched with authentic Vedic remedies and psychological growth guidance."
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto space-y-20">
          <div className="text-center">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">How it Works</h2>
            <div className="h-1 w-20 bg-accent mx-auto rounded-full" />
          </div>

          <div className="space-y-12">
            <Step number={1} title="Data Entry" description="Provide accurate birth dates, times, and locations for both partners to calculate sidereal positions." />
            <Step number={2} title="Astro-Engine Computation" description="Our engine calculates Rashi, Nakshatra, and all 8 Koots using Lahiri Ayanamsha algorithms." />
            <Step number={3} title="AI Pattern Recognition" description="NERRO AI overlays psychological relationship models onto the Vedic data for modern relevance." />
            <Step number={4} title="Report Generation" description="Receive a 14-section deep compatibility report with actionable guidance and spiritual remedies." />
          </div>
        </div>
      </section>

      {/* SEO Section Teaser */}
      <section className="py-32 px-6 glass rounded-[4rem] mx-6 mb-20 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <h2 className="text-4xl font-black uppercase tracking-tighter">Understanding Vedic Matching</h2>
          <p className="text-lg text-text-secondary leading-relaxed max-w-3xl mx-auto">
            Traditional Kundali Matching (Guna Milan) has been the cornerstone of Vedic marriage compatibility for millennia. 
            By analyzing the Moon's placement in 27 Nakshatras, we unlock the deep energetic blueprint shared between two individuals. 
            This isn't just about prediction—it's about understanding the unique dance of temperaments, energies, and life paths.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/learn/guna-milan" className="px-8 py-4 glass hover:bg-surface transition-all rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
              Learn Guna Milan <ArrowRight size={14} />
            </a>
            <a href="/learn/manglik-dosha" className="px-8 py-4 glass hover:bg-surface transition-all rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
              Manglik Guide <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="space-y-6">
      <div className="w-16 h-16 rounded-3xl glass flex items-center justify-center shadow-card group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-black uppercase tracking-tighter">{title}</h3>
      <p className="text-text-secondary leading-relaxed font-medium">{description}</p>
    </div>
  );
}

function Step({ number, title, description }: { number: number, title: string, description: string }) {
  return (
    <div className="flex gap-8 group">
      <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-surface border-2 border-border-glass flex items-center justify-center text-2xl font-black text-accent tracking-tighter group-hover:border-accent transition-colors">
        {number}
      </div>
      <div className="pt-2">
        <h4 className="text-xl font-black uppercase tracking-tight mb-2">{title}</h4>
        <p className="text-text-secondary font-medium leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
