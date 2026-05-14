
import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { getCSSVar } from './BMIGauge';

interface NutritionWheelProps {
  macros: { carbs: number; protein: number; fats: number };
}

export default function NutritionWheel({ macros }: NutritionWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const textPrimary = getCSSVar('--text-primary', '#000000');
    const textSecondary = getCSSVar('--text-secondary', '#475569');

    const total = macros.carbs + macros.protein + macros.fats;
    const segments = [
      { label: 'Carbs', value: macros.carbs / total, color: getCSSVar('--primary', '#6d28d9') },
      { label: 'Protein', value: macros.protein / total, color: getCSSVar('--secondary', '#0284c7') },
      { label: 'Fats', value: macros.fats / total, color: getCSSVar('--accent', '#d97706') }
    ];

    const draw = (progress: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = 70;
      const innerRadius = 50;

      let currentAngle = -Math.PI / 2;

      segments.forEach(seg => {
        const segmentAngle = seg.value * Math.PI * 2 * progress;
        
        ctx.beginPath();
        ctx.arc(cx, cy, radius, currentAngle, currentAngle + segmentAngle);
        ctx.arc(cx, cy, innerRadius, currentAngle + segmentAngle, currentAngle, true);
        ctx.closePath();
        
        ctx.fillStyle = seg.color;
        ctx.fill();
        
        currentAngle += segmentAngle;
      });

      // Center text
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 12px Inter';
      ctx.fillStyle = textPrimary;
      ctx.fillText('Macros', cx, cy - 5);
      ctx.font = 'normal 8px JetBrains Mono';
      ctx.fillStyle = textSecondary;
      ctx.fillText('Analysis', cx, cy + 10);
    };

    let startTime = performance.now();
    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / 1000, 1);
      draw(progress);
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [macros, theme]);

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} width={200} height={200} className="w-[180px] h-[180px]" />
      <div className="grid grid-cols-3 gap-4 mt-2">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-[10px] font-mono">{macros.carbs}% C</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-secondary" />
          <span className="text-[10px] font-mono">{macros.protein}% P</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-accent" />
          <span className="text-[10px] font-mono">{macros.fats}% F</span>
        </div>
      </div>
    </div>
  );
}
