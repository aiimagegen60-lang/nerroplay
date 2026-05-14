import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import { Book, Stars, Shield, Heart, Zap, ArrowRight, Info, ChevronDown } from 'lucide-react';

export default function GunaMilanGuide() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen py-32 px-6">
      <Helmet>
        <title>Guna Milan — Complete Guide to Vedic Ashtakoot Matching | Kundli Matching PRO AI</title>
        <meta name="description" content="Comprehensive guide to Guna Milan and the 36-point Ashtakoot matching system in Vedic astrology. Learn how compatibility is calculated." />
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-16">
        {/* Breadcrumbs */}
        <nav className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-text-muted">
          <a href="/">Home</a>
          <span>/</span>
          <a href="/tools">Tools</a>
          <span>/</span>
          <span className="text-primary">Guna Milan Guide</span>
        </nav>

        {/* Header */}
        <header className="space-y-6">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none"
          >
            What is <br />
            <span className="text-primary">Guna Milan?</span>
          </motion.h1>
          <p className="text-xl font-bold text-text-secondary italic leading-relaxed">
            The ancient science of structural compatibility in Vedic marriages.
          </p>
        </header>

        {/* Article Content */}
        <article className="prose prose-invert prose-slate max-w-none space-y-12 text-text-secondary">
          <section className="space-y-6">
            <h2 className="text-3xl font-black uppercase tracking-tight text-text-primary">The Foundation of Vedic Matching</h2>
            <p className="text-lg leading-relaxed font-medium">
              Guna Milan, also known as Ashtakoot Milan, is the cornerstone of marriage compatibility in Indian astrology. 
              The system analyzes the Moon's positions in the birth charts of both partners to determine their shared energetic resonance. 
              The word "Guna" means quality, and "Milan" means matching. Together, they represent a quality-check of the relationship's structural integrity.
            </p>
            <p className="text-lg leading-relaxed font-medium">
              Traditionally, the matching process is divided into 8 categories (Koots), each carrying a specific weight (points). 
              The total score adds up to 36 points. A score of 18 is considered the minimum required for a stable marriage, 
              though modern practitioners view this score alongside psychological and emotional factors.
            </p>
          </section>

          <section className="glass p-10 rounded-[3rem] space-y-8 border-primary/20">
            <h2 className="text-3xl font-black uppercase tracking-tight text-text-primary border-b border-border-glass pb-4">The 8 Koots of Ashtakoot</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <KootDetail 
                idx={1} 
                name="Varna" 
                points={1} 
                desc="Determines the mental compatibility and work/spiritual orientation of the couple." 
              />
              <KootDetail 
                idx={2} 
                name="Vasya" 
                points={2} 
                desc="Indicates the mutual attraction and the dynamic of who exerts more influence in the bond." 
              />
              <KootDetail 
                idx={3} 
                name="Tara" 
                points={3} 
                desc="Relates to the health, longevity, and well-being of each partner within the marriage." 
              />
              <KootDetail 
                idx={4} 
                name="Yoni" 
                points={4} 
                desc="Measures physical intimacy, biological compatibility, and deep instinctual sync." 
              />
              <KootDetail 
                idx={5} 
                name="Graha Maitri" 
                points={5} 
                desc="Reflects psychological synchronization and mental friendship based on ruling planets." 
              />
              <KootDetail 
                idx={6} 
                name="Gana" 
                points={6} 
                desc="Determines the temperamental match: Deva (divine), Manushya (human), or Rakshasa (demon)." 
              />
              <KootDetail 
                idx={7} 
                name="Bhakoot" 
                points={7} 
                desc="Refers to the emotional sync and the combined prosperity of the family unit." 
              />
              <KootDetail 
                idx={8} 
                name="Nadi" 
                points={8} 
                desc="The most vital koot, relating to genetics, health of offspring, and physiological sync." 
              />
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-black uppercase tracking-tight text-text-primary">What does your Score Mean?</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-border-glass">
                <thead className="bg-surface">
                  <tr>
                    <th className="p-6 text-xs font-black uppercase tracking-widest text-text-muted">Score Range</th>
                    <th className="p-6 text-xs font-black uppercase tracking-widest text-text-muted">Interpretation</th>
                    <th className="p-6 text-xs font-black uppercase tracking-widest text-text-muted">Verdict</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-glass font-bold text-sm">
                  <tr>
                    <td className="p-6 text-primary">32 - 36</td>
                    <td className="p-6 text-text-secondary">Extremely high compatibility, rarely found. Considered a divine union.</td>
                    <td className="p-6 uppercase text-[10px] tracking-widest">Perfect</td>
                  </tr>
                  <tr>
                    <td className="p-6 text-secondary">28 - 31</td>
                    <td className="p-6 text-text-secondary">Very high compatibility. Stable, harmonious, and highly successful.</td>
                    <td className="p-6 uppercase text-[10px] tracking-widest">Excellent</td>
                  </tr>
                  <tr>
                    <td className="p-6 text-accent">24 - 27</td>
                    <td className="p-6 text-text-secondary">Healthy alignment with some minor differences that strengthen growth.</td>
                    <td className="p-6 uppercase text-[10px] tracking-widest">Very Good</td>
                  </tr>
                  <tr>
                    <td className="p-6 text-text-primary">18 - 23</td>
                    <td className="p-6 text-text-secondary">Average sync. Needs conscious effort to bridge temperamental gaps.</td>
                    <td className="p-6 uppercase text-[10px] tracking-widest">Average</td>
                  </tr>
                  <tr>
                    <td className="p-6 text-text-muted">Below 18</td>
                    <td className="p-6 text-text-secondary">Challenging. Requires significant compromise and mutual effort to survive.</td>
                    <td className="p-6 uppercase text-[10px] tracking-widest">Caution</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-black uppercase tracking-tight text-text-primary">Modern Perspectives on Matching</h2>
            <p className="text-lg leading-relaxed font-medium">
              In the 21st century, Guna Milan is best used as a tool for awareness rather than a deterministic verdict. 
              While a high score indicates a natural structural harmony, it cannot replace shared values, commitment, and effective communication. 
              A low score is not a death sentence for a relationship; rather, it highlights areas where partners need to be more conscious and empathetic.
            </p>
            <div className="flex items-start gap-4 p-8 glass bg-primary/5 border-primary/20 rounded-3xl">
              <Info className="text-primary shrink-0" size={24} />
              <p className="text-sm font-bold text-text-secondary leading-relaxed">
                ASTRO TIP: Nadi and Bhakoot carry the highest weights (8 and 7 points). 
                If these two have zeros, it is called a Dosha. However, many "Doshas" have cancellation rules based on the ruling planets. Always look for deep analysis.
              </p>
            </div>
          </section>
        </article>

        {/* FAQ - JSON-LD Schema intended */}
        <section className="space-y-12">
          <h2 className="text-4xl font-black uppercase tracking-tighter text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <FAQItem 
              question="What is the significance of 18 points in Guna Milan?" 
              answer="Traditionally, 18 is considered the break-even point for marriage compatibility. Scores below this are thought to require more effort to maintain harmony. However, it's just one metric among many." 
            />
            <FAQItem 
              question="Is Nadi Dosha a deal-breaker?" 
              answer="Nadi Dosha is serious but often has cancellations (Pariharas). If both partners have the same Nadi but different Nakshatras or different Moon signs, the dosha is neutralized." 
            />
            <FAQItem 
              question="Can Guna Milan predict divorce?" 
              answer="No. Astrology identifies potential friction and energetic sync. Behavioral choices, personal evolution, and external circumstances ultimately determine the outcome of a marriage." 
            />
          </div>
        </section>

        {/* CTA */}
        <div className="py-20 text-center space-y-8">
           <h3 className="text-3xl font-black uppercase">Check Your Cosmic Sync</h3>
           <a href="/kundli-matching" className="inline-flex items-center gap-3 px-10 py-5 bg-text-primary text-background rounded-full font-black uppercase tracking-[0.2em] hover:bg-primary transition-all">
             Calculate My Guna score <ArrowRight size={18} />
           </a>
        </div>
      </div>
    </div>
  );
}

function KootDetail({ idx, name, points, desc }: { idx: number, name: string, points: number, desc: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black text-primary uppercase tracking-widest">Koot {idx} //</span>
        <span className="text-lg font-black uppercase text-text-primary">{name} ({points} Pts)</span>
      </div>
      <p className="text-sm font-medium leading-relaxed">{desc}</p>
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
        <span className="text-lg font-black tracking-tight text-text-primary group-hover:text-primary transition-colors">{question}</span>
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
