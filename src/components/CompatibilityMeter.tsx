import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface CompatibilityMeterProps {
  score: number;
  grade: string;
}

export default function CompatibilityMeter({ score, grade }: CompatibilityMeterProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const maxScore = 36;
  const percentage = (score / maxScore) * 100;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayScore(score);
    }, 500);
    return () => clearTimeout(timer);
  }, [score]);

  const getColor = () => {
    if (score >= 28) return 'var(--primary)';
    if (score >= 18) return 'var(--secondary)';
    return 'var(--accent)';
  };

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Background Track */}
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="128"
            cy="128"
            r={radius}
            fill="transparent"
            stroke="var(--border-glass)"
            strokeWidth="16"
            className="transition-all duration-1000"
          />
          {/* Animated Progress */}
          <motion.circle
            cx="128"
            cy="128"
            r={radius}
            fill="transparent"
            stroke={getColor()}
            strokeWidth="16"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            strokeLinecap="round"
          />
        </svg>

        {/* Score Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-baseline"
          >
            <span className="text-7xl font-black tracking-tighter text-text-primary">
              {Math.round(displayScore)}
            </span>
            <span className="text-2xl font-black text-text-muted ml-1">/36</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-2 px-6 py-1.5 rounded-full bg-text-primary text-background font-black text-[10px] uppercase tracking-[0.2em] shadow-glow"
          >
            {grade}
          </motion.div>
        </div>

        {/* Orbiting Decor */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          className="absolute inset-0"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-accent shadow-[0_0_15px_var(--accent)]" />
        </motion.div>
      </div>

      <div className="mt-8 text-center max-w-sm">
        <div className="h-1 w-24 bg-accent mx-auto mb-4 rounded-full opacity-30" />
        <p className="text-xs font-mono text-text-secondary leading-relaxed uppercase tracking-wider">
          Ashtakoot Guna Milan Score based on moon alignment principles.
        </p>
      </div>
    </div>
  );
}
