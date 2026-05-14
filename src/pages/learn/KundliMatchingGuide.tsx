import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sparkles, Heart, Info, ArrowRight, ChevronDown } from 'lucide-react';

export default function KundliMatchingGuide() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen py-32 px-6">
      <Helmet>
        <title>Kundli Matching — How Vedic Horoscope Matching Works | Kundli Matching PRO AI</title>
        <meta name="description" content="Discover how Kundli matching by date of birth and time works. Explore the significance of horoscope matching for marriage in Indian culture." />
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-16">
        <nav className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-text-muted">
          <a href="/">Home</a>
          <span>/</span>
          <a href="/tools">Tools</a>
          <span>/</span>
          <span className="text-primary">Kundli Matching Guide</span>
        </nav>

        <header className="space-y-6">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none"
          >
            Vedic <br />
            <span className="text-secondary">Kundli Matching</span>
          </motion.h1>
          <p className="text-xl font-bold text-text-secondary italic leading-relaxed">
            Unlocking the cosmic blueprints of two souls traveling together.
          </p>
        </header>

        <article className="prose prose-invert prose-slate max-w-none space-y-12 text-text-secondary">
          <section className="space-y-6">
            <h2 className="text-3xl font-black uppercase tracking-tight text-text-primary">Ancient Wisdom, Modern Sync</h2>
            <p className="text-lg leading-relaxed font-medium">
              Kundli matching, or Janam Kundli Milan, is a tradition rooted in the belief that celestial bodies influence human temperament, health, and life trajectory. In the context of marriage, it is used to identify how two independent cosmic blueprints will interact over decades of shared life.
            </p>
            <p className="text-lg leading-relaxed font-medium">
              While Guna Milan provides a score, a deep Kundli analysis looks at planetary yogas, house strengths, and dasha sequences to offer a multi-dimensional view of compatibility.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass p-8 space-y-4">
              <h3 className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-secondary">
                <Shield size={16} /> Structural Sync
              </h3>
              <p className="text-sm leading-relaxed">
                Ashtakoot (8 Koots) focuses on the Moon sign and Nakshatra to determine the underlying energetic structure of the relationship.
              </p>
            </div>
            <div className="glass p-8 space-y-4 text-left">
              <h3 className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-primary">
                <Sparkles size={16} /> Dynamic Sync
              </h3>
              <p className="text-sm leading-relaxed">
                Analysis of 7th house lords and Venus/Mars placements determines the active relationship dynamics and longevity of love.
              </p>
            </div>
          </div>

          <section className="space-y-6">
             <h2 className="text-3xl font-black uppercase tracking-tight text-text-primary">Why Time of Birth Matters</h2>
             <p className="text-lg leading-relaxed font-medium">
                In Vedic astrology, the rising sign (Lagna) changes every 2 hours. Your Moon Nakshatra changes every day. Without an accurate time of birth, your Kundli is incomplete. The time allows us to determine the exact degree of the Moon and the specific Navamsha (9-fold division chart) which is crucial for marriage compatibility.
             </p>
             <div className="flex items-start gap-4 p-8 glass bg-secondary/5 border-secondary/20 rounded-3xl">
                <Info className="text-secondary shrink-0" size={24} />
                <p className="text-sm font-bold text-text-secondary leading-relaxed">
                  NOTE: If you don't have an exact time, "Prashna Kundli" or "Rashi Matching" can be used as secondary methods, though birth-chart matching remains the gold standard.
                </p>
             </div>
          </section>

          <section className="space-y-12">
            <h2 className="text-4xl font-black uppercase tracking-tighter text-center">Matching FAQ</h2>
            <div className="space-y-4">
              <FAQItem 
                question="Is match by Rashi enough?" 
                answer="No. Rashi compatibility is only one part of the match (Graha Maitri). Matching Nakshatras (within the Rashi) provides far deeper tribal and physiological insight." 
              />
              <FAQItem 
                question="How accurate is online Kundli matching?" 
                answer="Online tools use the same traditional algorithms as human astrologers. The accuracy depends on the quality of the sidereal ephemeris used for calculations. Our engine uses Lahiri Ayanamsha for maximum professional accuracy." 
              />
            </div>
          </section>

          <div className="py-20 text-center space-y-8">
             <h3 className="text-3xl font-black uppercase">Start Your Analysis</h3>
             <a href="/kundli-matching" className="inline-flex items-center gap-3 px-10 py-5 bg-text-primary text-background rounded-full font-black uppercase tracking-[0.2em] hover:bg-secondary transition-all">
               Match Kundli Free <ArrowRight size={18} />
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
        <span className="text-lg font-black tracking-tight text-text-primary group-hover:text-secondary transition-colors">{question}</span>
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
