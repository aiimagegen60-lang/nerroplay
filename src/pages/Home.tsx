import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Gamepad2, Zap, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import ToolCard from '../components/ToolCard';
import { GAMES, TOOLS } from '../constants';
import { AdBanner } from '../components/AdComponents';

export default function Home() {
  return (
    <div className="pt-20 pb-20 max-w-[1200px] mx-auto relative px-4 md:px-12">
      <Helmet>
        <title>NERROPLAY | Legitimate AI-Powered Educational Tools</title>
        <meta name="description" content="Access trustworthy AI calculators for health, finance, beauty, and more. NERROPLAY provides educational and professional algorithmic tools." />
      </Helmet>
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tighter text-text-primary mb-8 leading-[1] uppercase">
          Empowering<br />
          Through<br />
          <span className="text-accent">Intelligence.</span>
        </h1>
        <p className="text-sm font-mono text-text-muted mb-12 max-w-xl mx-auto uppercase tracking-wider leading-relaxed">
          NERROPLAY is a premier educational SaaS platform. We combine deterministic mathematical precision with advanced AI to provide trustworthy insights for curious minds.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/tools"
            className="primary-btn bg-accent text-black scale-110"
          >
            Explore Tools
          </Link>
          <Link
            to="/games"
            className="primary-btn bg-surface text-text-primary border border-border-glass"
          >
            Play Games
          </Link>
        </div>
      </section>


      <section className="mb-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-[0.6rem] font-mono text-accent uppercase tracking-[0.3em] mb-2 block">Top Recommendations</span>
            <h2 className="text-2xl font-bold text-text-primary tracking-tight">Featured Tools</h2>
          </div>
          <Link to="/tools" className="text-xs font-mono text-accent uppercase tracking-widest hover:text-text-primary transition-colors">
            View All Tools
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS.filter(t => t.id === 'kundli-matching' || t.id === 'bmi-calculator' || t.id === 'beauty-analyzer').map((tool) => (
            <div key={tool.id}>
              <ToolCard tool={tool} />
            </div>
          ))}
        </div>
      </section>

      {/* Categorized Tools Sections */}
      {Array.from(new Set(TOOLS.map(t => t.category))).map((category) => {
        const categoryTools = TOOLS.filter(t => t.category === category).slice(0, 3);
        if (categoryTools.length === 0) return null;

        return (
          <section key={category} className="mb-24">
            <div className="flex items-end justify-between mb-8 border-b border-border-glass pb-4">
              <div>
                <span className="text-[0.6rem] font-mono text-accent uppercase tracking-[0.3em] mb-1 block">Specialized Utility</span>
                <h2 className="text-xl font-bold text-text-primary tracking-tight">{category}</h2>
              </div>
              <Link 
                to={`/tools?category=${encodeURIComponent(category)}`} 
                className="text-[10px] font-mono text-text-muted uppercase tracking-widest hover:text-accent transition-colors"
              >
                Explore Category
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categoryTools.map((tool) => (
                <div key={tool.id}>
                  <ToolCard tool={tool} />
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {/* Featured Games */}
      <section className="mb-32">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-[0.6rem] font-mono text-accent uppercase tracking-[0.3em] mb-2 block">Neural Simulations</span>
            <h2 className="text-2xl font-bold text-text-primary tracking-tight">Active Simulations</h2>
          </div>
          <Link to="/games" className="text-xs font-mono text-accent uppercase tracking-widest hover:text-text-primary transition-colors">
            View All Games
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {GAMES.slice(0, 2).map((game) => (
             <Link key={game.id} to="/games" className="group relative overflow-hidden rounded-3xl border border-border-glass bg-surface aspect-[16/9] flex flex-col justify-end p-8 transition-all hover:border-accent">
                <img 
                  src={game.image} 
                  alt={game.name} 
                  className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <Gamepad2 size={16} className="text-accent" />
                    <span className="text-[0.6rem] font-mono text-accent uppercase tracking-widest">Entry Simulation</span>
                  </div>
                  <h3 className="text-2xl font-black text-text-primary mb-2 uppercase tracking-tight">{game.name}</h3>
                  <p className="text-xs text-text-muted font-mono uppercase max-w-sm">{game.description}</p>
                </div>
             </Link>
           ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: Zap, title: 'ULTRA-FAST', desc: 'Optimized for high-performance computing.' },
            { icon: Shield, title: 'SECURE CORE', desc: 'Enterprise-grade encryption and safety.' },
            { icon: Sparkles, title: 'AI DRIVEN', desc: 'Powered by advanced neural architectures.' },
          ].map((feature) => (
            <div key={feature.title} className="flex flex-col items-center text-center space-y-3">
              <feature.icon size={20} className="text-text-muted mb-2" />
              <h3 className="text-xs font-black uppercase tracking-tight text-text-primary italic">{feature.title}</h3>
              <p className="text-[0.6rem] font-mono text-text-muted leading-relaxed uppercase font-bold opacity-80">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
