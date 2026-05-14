
import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

export function getCSSVar(name: string, fallback: string): string {
  try {
    const val = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return val || fallback;
  } catch {
    return fallback;
  }
}

interface BMIGaugeProps {
  bmi: number;
  categoryLabel: string;
}

export default function BMIGauge({ bmi, categoryLabel }: BMIGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const startAngle = Math.PI;
    const endAngle = 2 * Math.PI;
    
    // Scale position (15-45 mapped to 0-PI)
    const targetValue = Math.min(Math.max((bmi - 15) / (45 - 15), 0), 1);
    const targetAngle = startAngle + targetValue * Math.PI;

    const primaryColor = getCSSVar('--primary', '#6d28d9');
    const borderColor = getCSSVar('--border-glass', 'rgba(0,0,0,0.1)');
    const textPrimary = getCSSVar('--text-primary', '#000000');
    const textSecondary = getCSSVar('--text-secondary', '#475569');

    const draw = (progress: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height - 40;
      const radius = 130;

      // Background Arc
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.lineWidth = 12;
      ctx.strokeStyle = borderColor;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Colored Zones
      const zones = [
        { start: 0, end: 0.11, color: 'rgba(217, 119, 6, 0.4)' }, // Underweight
        { start: 0.11, end: 0.33, color: 'rgba(109, 40, 217, 0.8)' }, // Normal
        { start: 0.33, end: 0.5, color: 'rgba(217, 119, 6, 0.6)' }, // Overweight
        { start: 0.5, end: 1, color: 'rgba(220, 38, 38, 0.6)' } // Obese
      ];

      zones.forEach(zone => {
        ctx.beginPath();
        ctx.arc(cx, cy, radius, startAngle + zone.start * Math.PI, startAngle + zone.end * Math.PI);
        ctx.strokeStyle = zone.color;
        ctx.stroke();
      });

      // Needle
      const easeOutElastic = (t: number): number => {
        const p = 0.3;
        return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
      };

      const easedProgress = easeOutElastic(progress);
      const currentAngle = startAngle + (targetAngle - startAngle) * easedProgress;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(currentAngle + Math.PI / 2);
      
      // Needle shape
      ctx.beginPath();
      ctx.moveTo(-4, 0);
      ctx.lineTo(0, -radius + 20);
      ctx.lineTo(4, 0);
      ctx.fillStyle = textPrimary;
      ctx.fill();

      // Pivot
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fillStyle = primaryColor;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#fff';
      ctx.stroke();
      
      ctx.restore();

      // Stats
      ctx.textAlign = 'center';
      ctx.font = 'bold 32px Inter, sans-serif';
      ctx.fillStyle = textPrimary;
      ctx.fillText(bmi.toString(), cx, cy + 10);
      
      ctx.font = 'normal 10px JetBrains Mono, monospace';
      ctx.fillStyle = textSecondary;
      ctx.fillText(categoryLabel.toUpperCase(), cx, cy + 25);
    };

    let startTime = performance.now();
    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / 1500, 1);
      draw(progress);
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [bmi, categoryLabel, theme]);

  return (
    <div className="flex justify-center items-center w-full min-h-[220px]">
      <canvas 
        ref={canvasRef} 
        width={320} 
        height={220} 
        className="w-full max-w-[320px] h-auto"
      />
    </div>
  );
}
