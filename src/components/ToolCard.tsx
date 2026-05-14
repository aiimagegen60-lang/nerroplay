import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { Tool } from '../types';
import { cn } from '../lib/utils';

export default function ToolCard({ tool }: { tool: Tool }) {
  const IconComponent = (Icons as any)[tool.icon] || Icons.HelpCircle;
  const targetPath = tool.customPath || `/tools/${tool.id}`;
  const isSpirituality = tool.category === 'Spirituality & Lifestyle';

  return (
    <Link to={targetPath} className="block group h-full relative">
      {tool.id === 'kundli-matching' && (
        <div className="absolute -top-3 -right-3 z-10">
          <div className="bg-primary text-background text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-xl animate-pulse">
            Super Report AI
          </div>
        </div>
      )}
      <div className={cn(
        "tool-card h-full flex flex-col cursor-pointer transition-all duration-500",
        isSpirituality && "border-primary/20 hover:border-primary/40 shadow-[0_0_20px_-12px_rgba(var(--primary),0.2)] hover:shadow-[0_0_30px_-10px_rgba(var(--primary),0.3)]"
      )}>
        <div className={cn(
          "text-accent group-hover:scale-110 transition-transform mb-4 w-fit h-fit p-3 bg-background rounded-xl border border-border-glass",
          isSpirituality && "text-primary border-primary/20 bg-primary/5"
        )}>
          <IconComponent size={20} />
        </div>
        
        <h3 className={cn(
          "font-bold text-text-primary text-base mb-1 group-hover:text-accent transition-colors leading-tight",
          isSpirituality && "group-hover:text-primary"
        )}>
          {tool.name}
        </h3>
        
        <div className={cn(
          "text-[0.65rem] font-mono text-accent uppercase tracking-widest mb-3 opacity-80",
          isSpirituality && "text-primary"
        )}>
          {tool.category} // v{tool.metadata.version}
        </div>
        
        <p className="text-[0.7rem] text-text-secondary line-clamp-2 mb-4">
          {tool.description}
        </p>
        
        <div className="text-[0.6rem] font-mono text-text-muted uppercase tracking-widest mt-auto flex items-center justify-between border-t border-border-glass pt-3">
          <span>{tool.metadata.author}</span>
          <Icons.ChevronRight size={12} className="text-accent" />
        </div>
      </div>
    </Link>
  );
}
