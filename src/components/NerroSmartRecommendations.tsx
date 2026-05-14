import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Sparkles, CheckCircle2, TrendingDown, Scale } from 'lucide-react';

interface RecommendedProduct {
  name: string;
  tag: 'amazon_choice' | 'budget' | 'value';
  link: string;
  reason: string;
  image: string;
}

interface NerroSmartRecommendationsProps {
  products: RecommendedProduct[];
}

const getBadgeConfig = (tag: RecommendedProduct['tag']) => {
  switch (tag) {
    case 'amazon_choice':
      return { 
        label: '🥇 Amazon Choice', 
        style: 'bg-gradient-to-r from-amber-500 to-amber-700 text-black font-bold',
        icon: <CheckCircle2 size={12} className="inline mr-1" />
      };
    case 'budget':
      return { 
        label: '💸 Budget Pick', 
        style: 'bg-emerald-700/20 text-emerald-400 border border-emerald-700/30',
        icon: <TrendingDown size={12} className="inline mr-1" />
      };
    case 'value':
      return { 
        label: '⚖️ Value Option', 
        style: 'bg-blue-700/20 text-blue-400 border border-blue-700/30',
        icon: <Scale size={12} className="inline mr-1" />
      };
    default:
      return { label: '', style: '', icon: null };
  }
};

export default function NerroSmartRecommendations({ products }: NerroSmartRecommendationsProps) {
  if (!products || products.length === 0) return null;

  const sortedProducts = [...products].sort((a, b) => {
    const priority = { amazon_choice: 0, budget: 1, value: 2 };
    return priority[a.tag] - priority[b.tag];
  });

  return (
    <motion.section 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 pt-6 border-t border-border-glass"
    >
      <div className="flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-widest mb-4">
        <Sparkles size={14} /> AI Recommended
      </div>
      <h2 className="text-xl font-bold text-text-primary mb-1">Recommended for you</h2>
      <p className="text-sm text-text-secondary mb-6">Based on your analysis, these may help improve your results</p>

      <div className="max-h-[350px] overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        {sortedProducts.map((product, index) => {
          const badge = getBadgeConfig(product.tag);
          return (
            <div
              key={index}
              className="flex gap-4 p-3 bg-surface rounded-xl border border-border-glass hover:border-accent/30 transition-colors shadow-sm"
            >
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-20 h-20 rounded-lg object-cover flex-none"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col justify-between flex-1 min-w-0">
                <div>
                  <h3 className="text-sm font-bold text-text-primary mb-1 truncate">{product.name}</h3>
                  <p className="text-xs text-text-secondary mb-2 line-clamp-2">{product.reason}</p>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] ${badge.style}`}>
                    {badge.icon} {badge.label}
                  </span>
                </div>
                <a 
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-[10px] font-bold text-accent hover:underline flex items-center gap-1"
                >
                  Check on Amazon <ExternalLink size={10} />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-[10px] text-text-muted text-center italic">
        As an Amazon Associate, we earn from qualifying purchases.
      </p>
    </motion.section>
  );
}
