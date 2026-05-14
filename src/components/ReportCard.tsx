import React from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface ReportCardProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  accentColor?: string;
}

export default function ReportCard({ title, icon, children, accentColor = 'accent' }: ReportCardProps) {
  const IconComponent = (Icons as any)[icon] || Icons.HelpCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass p-8 rounded-3xl border border-border-glass relative overflow-hidden group"
    >
      <div 
        className={`absolute top-0 left-0 w-1 h-full bg-${accentColor}`} 
        style={{ backgroundColor: accentColor !== 'accent' ? accentColor : 'var(--accent-color)' }}
      />
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-surface/50 border border-border-glass flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
          <IconComponent size={24} />
        </div>
        <h3 className="text-xl font-bold text-text-primary tracking-tight uppercase letter-spacing-wide">
          {title}
        </h3>
      </div>

      <div className="space-y-6 text-text-secondary leading-relaxed">
        {children}
      </div>
    </motion.div>
  );
}
