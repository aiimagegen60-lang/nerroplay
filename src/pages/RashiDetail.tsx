import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Compass, Award, Heart, Briefcase, 
  Wallet, Shield, Sparkles, HelpCircle, CheckCircle2 
} from 'lucide-react';
import { RASHI_DATA } from '../lib/rashi-data';
import { RashiName } from '../types';
import ToolSEO from '../components/ToolSEO';
import CosmicBackground from '../components/CosmicBackground';

export default function RashiDetail() {
  const { slug } = useParams();
  
  // Find rashi by slug (converting e.g. 'mesh' or 'aries' to proper RashiName)
  const rashiKey = Object.keys(RASHI_DATA).find(
    k => k.toLowerCase() === slug?.toLowerCase() || 
         RASHI_DATA[k as RashiName].hindiName.toLowerCase() === slug?.toLowerCase()
  ) as RashiName;

  const rashi = RASHI_DATA[rashiKey];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!rashi) {
    return (
      <div className="min-h-screen flex items-center justify-center p-10 text-text-muted">
        Rashi not found. <Link to="/tools" className="text-accent ml-2">Back to Tools</Link>
      </div>
    );
  }

  return (
    <div className="relative pt-12 pb-20 px-4 md:px-10">
      <CosmicBackground />
      <ToolSEO 
        title={rashi.seo.metaTitle}
        description={rashi.seo.metaDescription}
        path={`/rashi/${slug}`}
      />

      <div className="max-w-[1000px] mx-auto">
        <Link to="/tools/moon-sign-report" className="inline-flex items-center gap-2 text-xs font-mono text-text-muted hover:text-accent mb-10">
          <ArrowLeft size={14} />
          BACK TO MOON REPORT
        </Link>

        {/* Hero Section */}
        <section className="text-center mb-20 space-y-6">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-32 h-32 bg-accent/10 border border-accent/30 rounded-full flex items-center justify-center mx-auto text-6xl shadow-2xl shadow-accent/20"
          >
            {rashi.symbol}
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-black text-text-primary uppercase tracking-tighter">
              {rashi.name} <span className="text-accent">({rashi.hindiName})</span>
            </h1>
            <p className="text-sm text-text-muted font-mono uppercase tracking-[0.3em]">The {rashi.quality} {rashi.element} Powerhouse</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            {[
              { label: 'Ruling Planet', value: rashi.rulingPlanet },
              { label: 'Lucky Gem', value: rashi.gemstone },
              { label: 'Element', value: rashi.element },
              { label: 'Metal', value: rashi.metal }
            ].map((meta, i) => (
              <div key={`meta-${i}-${meta.label}`} className="px-4 py-2 glass rounded-xl border border-border-glass text-[10px] font-bold text-text-secondary uppercase">
                <span className="text-accent mr-2">{meta.label}:</span>
                {meta.value}
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-20">
            {/* Overview */}
            <section className="space-y-6">
              <h2 className="text-3xl font-black text-text-primary uppercase tracking-tight flex items-center gap-4 border-l-4 border-accent pl-6">
                Understanding {rashi.name}
              </h2>
              <div className="prose prose-invert text-text-secondary leading-relaxed space-y-4">
                <p className="text-lg text-text-primary font-medium italic mb-6">
                  {rashi.personality.overview}
                </p>
                <div dangerouslySetInnerHTML={{ __html: rashi.seo.longFormContent.replace(/\n/g, '<br/>') }} />
              </div>
            </section>

            {/* Personality Traits Grid */}
            <section className="space-y-10">
              <h2 className="text-3xl font-black text-text-primary uppercase tracking-tight">Personality Deep Dive</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="glass p-8 rounded-3xl border border-accent/20 bg-accent/5">
                  <h3 className="text-lg font-bold text-accent mb-6 uppercase flex items-center gap-2">
                    <Award size={18} /> Divine Strengths
                  </h3>
                  <ul className="space-y-4">
                    {rashi.personality.strengths.map((s, i) => (
                      <li key={`strength-${i}`} className="flex items-start gap-3 text-xs text-text-secondary">
                        <CheckCircle2 size={14} className="text-accent mt-0.5 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass p-8 rounded-3xl border border-orange-500/20 bg-orange-500/5">
                  <h3 className="text-lg font-bold text-orange-500 mb-6 uppercase flex items-center gap-2">
                    <Shield size={18} /> Karmic Challenges
                  </h3>
                  <ul className="space-y-4">
                    {rashi.personality.weaknesses.map((w, i) => (
                      <li key={`weakness-${i}`} className="flex items-start gap-3 text-xs text-text-secondary">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Life Areas */}
            <div className="space-y-16">
              <LifeAreaSection 
                title="Career & Ambition" 
                icon={<Briefcase />}
                data={rashi.career}
              />
              <LifeAreaSection 
                title="Love & Relationships" 
                icon={<Heart />}
                data={rashi.love}
              />
              <LifeAreaSection 
                title="Wealth & Prosperity" 
                icon={<Wallet />}
                data={rashi.wealth}
              />
            </div>

            {/* FAQ Section */}
            <section className="space-y-10">
              <h2 className="text-3xl font-black text-text-primary uppercase tracking-tight">Expert Insights (FAQ)</h2>
              <div className="space-y-4">
                {rashi.seo.faqs.map((faq, i) => (
                  <div key={`faq-${i}`} className="glass p-6 rounded-2xl border border-border-glass">
                    <h4 className="text-sm font-black text-text-primary mb-3 uppercase tracking-tight">{faq.question}</h4>
                    <p className="text-xs text-text-secondary leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="sticky top-32 space-y-8">
              <div className="glass p-8 rounded-3xl border border-accent/30 bg-accent/5">
                <h3 className="text-[10px] font-mono text-accent uppercase tracking-widest mb-6">Auspicious Guide</h3>
                <div className="space-y-4">
                    <SidebarItem label="Lucky Numbers" value={rashi.luckyNumbers.join(", ")} />
                    <SidebarItem label="Best Days" value={rashi.luckyDays.join(", ")} />
                    <SidebarItem label="Colors" value={rashi.color.join(", ")} />
                    <SidebarItem label="Direction" value={rashi.direction} />
                </div>
              </div>

              <div className="glass p-8 rounded-3xl border border-border-glass">
                <h3 className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-6">Explore Others</h3>
                <div className="grid grid-cols-4 gap-2">
                  {Object.keys(RASHI_DATA).map((key) => {
                    const r = RASHI_DATA[key as RashiName];
                    return (
                      <Link 
                        key={key} 
                        to={`/rashi/${r.name.toLowerCase()}`}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg border transition-all hover:scale-110 ${r.name === rashi.name ? 'border-accent bg-accent/10 text-accent' : 'border-border-glass bg-surface/50 text-text-muted'}`}
                      >
                        {r.symbol}
                      </Link>
                    )
                  })}
                </div>
              </div>

              <div className="p-1 rounded-3xl bg-gradient-to-br from-accent to-secondary">
                <div className="bg-background rounded-[1.4rem] p-8 space-y-6 text-center">
                    <Sparkles className="text-accent mx-auto" size={32} />
                    <h4 className="text-lg font-bold text-text-primary uppercase tracking-tight">Get Your Full Report</h4>
                    <p className="text-[10px] text-text-secondary">Reveal your complete Moon chart, Nakshatra details, and AI life strategy.</p>
                    <Link 
                      to="/tools/moon-sign-report"
                      className="block w-full py-3 bg-accent text-background rounded-xl text-[10px] font-black uppercase tracking-widest"
                    >
                      Calculate Now
                    </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LifeAreaSection({ title, icon, data }: { title: string, icon: React.ReactNode, data: any }) {
  return (
    <section className="space-y-6">
      <h3 className="text-2xl font-bold text-text-primary flex items-center gap-3">
        <span className="text-accent">{icon}</span>
        {title}
      </h3>
      <div className="p-8 glass rounded-[2.5rem] border border-border-glass bg-surface/30 space-y-6">
        <p className="text-sm text-text-secondary leading-relaxed">{data.overview}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 border-t border-border-glass">
            <div>
                <h4 className="text-[10px] font-mono text-accent uppercase tracking-widest mb-3">Key Insights</h4>
                <p className="text-xs text-text-primary font-medium">{data.workStyle || data.romanticNature || data.moneyMindset}</p>
            </div>
            {data.bestProfessions && (
                <div>
                    <h4 className="text-[10px] font-mono text-accent uppercase tracking-widest mb-3">Top Careers</h4>
                    <p className="text-xs text-text-primary">{data.bestProfessions.slice(0, 5).join(", ")}</p>
                </div>
            )}
            {data.compatibleRashis && (
                <div>
                    <h4 className="text-[10px] font-mono text-accent uppercase tracking-widest mb-3">Greatest Compatibility</h4>
                    <p className="text-xs text-text-primary">{data.compatibleRashis.join(", ")}</p>
                </div>
            )}
        </div>
      </div>
    </section>
  );
}

function SidebarItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-1">
      <span className="text-[8px] font-mono text-text-muted uppercase tracking-widest">{label}</span>
      <p className="text-xs font-bold text-text-primary">{value}</p>
    </div>
  );
}
