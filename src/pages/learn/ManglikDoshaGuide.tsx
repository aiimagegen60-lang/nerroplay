import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Shield, AlertTriangle, Info, ArrowRight, ChevronDown } from 'lucide-react';

export default function ManglikDoshaGuide() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen py-32 px-6">
      <Helmet>
        <title>Manglik Dosha — Complete Guide, Remedies & Cancellation | Kundli Matching PRO AI</title>
        <meta name="description" content="What is Manglik Dosha? Learn about Mars influence in marriage compatibility, Manglik remedies, and cancellation factors in Vedic astrology." />
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-16">
        <nav className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-text-muted">
          <a href="/">Home</a>
          <span>/</span>
          <a href="/tools">Tools</a>
          <span>/</span>
          <span className="text-primary">Manglik Dosha Guide</span>
        </nav>

        <header className="space-y-6">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none"
          >
            The <span className="text-accent">Manglik</span> <br />
            Dosha Guide
          </motion.h1>
          <p className="text-xl font-bold text-text-secondary italic leading-relaxed">
            Understanding the intense energy of Mars (Mangal) in relationships.
          </p>
        </header>

        <article className="prose prose-invert prose-slate max-w-none space-y-12 text-text-secondary">
          <section className="space-y-6">
            <h2 className="text-3xl font-black uppercase tracking-tight text-text-primary">What is Manglik Dosha?</h2>
            <p className="text-lg leading-relaxed font-medium">
              Manglik Dosha occurs when Mars (Mangal) is placed in the 1st, 4th, 7th, 8th, or 12th house of a birth chart. Mars represents energy, assertion, and drive. When it sits in these houses—which relate specifically to personality, home, marriage, and longevity—it creates an intense energetic signature that requires conscious effort to balance.
            </p>
            <p className="text-lg leading-relaxed font-medium">
              A Person with this placement is called a "Manglik." Traditionally, it is believed that two Mangliks should marry each other to balance out this high-intensity Martian energy.
            </p>
          </section>

          <div className="bg-accent/5 border-2 border-accent/20 rounded-[3rem] p-10 space-y-8">
            <h3 className="text-2xl font-black uppercase tracking-tighter text-accent flex items-center gap-3">
              <Zap /> Types of Manglik Energy
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <h4 className="font-black text-text-primary uppercase tracking-widest text-xs">Anshik Manglik (Mild)</h4>
                <p className="text-sm">When Mars is placed in a way that its intensity is reduced by other planetary influences or its house position.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-black text-text-primary uppercase tracking-widest text-xs">Purna Manglik (Strong)</h4>
                <p className="text-sm">When Mars is strongly positioned, creating a high degree of assertion and dynamic drive in the individual's personality.</p>
              </div>
            </div>
          </div>

          <section className="space-y-6">
            <h2 className="text-3xl font-black uppercase tracking-tight text-text-primary">Cancellation Factors (Pariharas)</h2>
            <p className="text-lg leading-relaxed font-medium">
              Many people worry about Manglik Dosha unnecessarily. Vedic scriptures provide several "Pariharas" (cancellations). If Mars is in its own sign (Aries, Scorpio), exalted sign (Capricorn), or combined with specific benefics like Jupiter, the "dosha" is effectively neutralized.
            </p>
            <div className="flex items-start gap-4 p-8 glass bg-accent/5 border-accent/20 rounded-3xl">
              <Shield className="text-accent shrink-0" size={24} />
              <p className="text-sm font-bold text-text-secondary leading-relaxed">
                MODERN PERSPECTIVE: Manglik Dosha is simply a high-energy profile. This drive can be channeled into building a successful career or a passionate partnership rather than just conflict.
              </p>
            </div>
          </section>

          <section className="space-y-12">
            <h2 className="text-4xl font-black uppercase tracking-tighter text-center">Dosha FAQ</h2>
            <div className="space-y-4">
              <FAQItem 
                question="Can a Manglik marry a Non-Manglik?" 
                answer="Yes. Compatibility depends on the overall Guna score and specific planetary placements. If the non-Manglik has a strong Saturn or Jupiter influence, it can often balance the partner's Mars energy." 
              />
              <FAQItem 
                question="Does Manglik Dosha end after age 28?" 
                answer="Traditional belief suggests that the intensity of Mars matures at 28. While the astrological placement doesn't change, the individual often gains the psychological maturity to handle the energy more effectively." 
              />
            </div>
          </section>

          <div className="py-20 text-center space-y-8">
             <h3 className="text-3xl font-black uppercase">Check Your Mars Status</h3>
             <a href="/kundli-matching" className="inline-flex items-center gap-3 px-10 py-5 bg-text-primary text-background rounded-full font-black uppercase tracking-[0.2em] hover:bg-accent hover:text-black transition-all">
               Calculate Doshas Free <ArrowRight size={18} />
             </a>
          </div>
        </article>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="glass overflow-hidden transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-8 text-left flex justify-between items-center group"
      >
        <span className="text-lg font-black tracking-tight text-text-primary group-hover:text-accent transition-colors">{question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
           <ChevronDown size={20} className="text-text-muted" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="p-8 pt-0 text-text-secondary leading-relaxed font-medium bg-surface/30">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
