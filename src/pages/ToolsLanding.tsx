import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Search, Filter, Grid, List } from 'lucide-react';
import ToolCard from '../components/ToolCard';
import { TOOLS } from '../constants';
import { AdBanner } from '../components/AdComponents';

export default function ToolsLanding() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const categories = ['All', ...new Set(TOOLS.map(t => t.category))];

  const filteredTools = TOOLS.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(search.toLowerCase()) || 
                         tool.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || tool.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-20 pb-16 px-4 md:px-12 max-w-[1200px] mx-auto relative">
      <Helmet>
        <title>Educational AI Tools & Precision Calculators | NERROPLAY</title>
        <meta name="description" content="Explore a comprehensive suite of AI-powered educational tools for Health, Finance, Beauty, and Lifestyle. Accurate, safe, and professional." />
      </Helmet>
      <div className="mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-text-primary mb-6 uppercase leading-[0.9]">
          Platform.<br />
          <span className="text-accent">Insight.</span><br />
          Clarity.
        </h1>
        <p className="text-xs font-mono text-text-muted max-w-2xl uppercase tracking-widest leading-relaxed">
          NERROPLAY is an educational intelligence layer built on deterministic algorithmic logic. Explore professional tools designed to enhance your digital understanding.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-6 mb-12">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-accent group-focus-within:scale-110 transition-transform" size={18} />
          <input
            type="text"
            placeholder="Search tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface border border-accent/20 rounded-xl px-12 py-4 text-sm font-medium text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all placeholder:text-text-muted"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-4 rounded-xl font-mono text-[0.65rem] font-bold uppercase tracking-widest transition-all border ${
                category === cat 
                ? 'bg-accent text-black border-accent' 
                : 'bg-surface text-text-muted border-border-glass hover:border-accent hover:text-text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-20">
        {filteredTools.length > 0 ? (
          filteredTools.map((tool) => (
            <div key={tool.id}>
              <ToolCard tool={tool} />
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center glass rounded-lg border border-border-glass">
            <p className="text-text-muted text-sm">No tools found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
