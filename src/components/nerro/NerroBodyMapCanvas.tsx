
import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { getCSSVar } from '../bmi/BMIGauge';

interface NerroBodyMapCanvasProps {
  scores: {
    cv: number;
    metabolic: number;
    mobility: number;
    energy: number;
  };
}

export default function NerroBodyMapCanvas({ scores }: NerroBodyMapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const textSecondary = getCSSVar('--text-secondary', '#475569');
    const primaryColor = getCSSVar('--primary', '#6d28d9');
    const secondaryColor = getCSSVar('--secondary', '#0284c7');
    const accentColor = getCSSVar('--accent', '#d97706');

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      
      // Simple Body Silhouette
      ctx.beginPath();
      ctx.strokeStyle = textSecondary;
      ctx.lineWidth = 1;
      
      // Head
      ctx.arc(cx, 40, 15, 0, Math.PI * 2);
      // Neck
      ctx.moveTo(cx, 55); ctx.lineTo(cx, 65);
      // Shoulders
      ctx.moveTo(cx - 30, 75); ctx.lineTo(cx + 30, 75);
      // Torso
      ctx.moveTo(cx - 30, 75); ctx.lineTo(cx - 20, 150);
      ctx.lineTo(cx + 20, 150); ctx.lineTo(cx + 30, 75);
      // Arms
      ctx.moveTo(cx - 30, 75); ctx.lineTo(cx - 45, 130);
      ctx.moveTo(cx + 30, 75); ctx.lineTo(cx + 45, 130);
      // Hips
      ctx.moveTo(cx - 20, 150); ctx.lineTo(cx + 20, 150);
      // Legs
      ctx.moveTo(cx - 15, 150); ctx.lineTo(cx - 20, 250);
      ctx.moveTo(cx + 15, 150); ctx.lineTo(cx + 20, 250);
      
      ctx.stroke();

      const pulse = Math.sin(time / 500) * 0.2 + 0.8;

      const drawZone = (x: number, y: number, r: number, score: number, color: string) => {
        const opacity = (score / 100) * 0.4 * pulse;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = color.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
        // Fallback for hex
        if (color.startsWith('#')) {
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
        ctx.fill();
      };

      // CV Risk Zone (Heart)
      drawZone(cx - 5, 90, 8, 100 - scores.cv, primaryColor);
      // Metabolic Zone (Abdomen)
      drawZone(cx, 120, 12, 100 - scores.metabolic, secondaryColor);
      // Mobility Zones (Knees/Joints)
      drawZone(cx - 18, 200, 6, scores.mobility, accentColor);
      drawZone(cx + 18, 200, 6, scores.mobility, accentColor);
      // Energy Zone (Head)
      drawZone(cx, 40, 10, scores.energy, primaryColor);
    };

    const animate = (time: number) => {
      draw(time);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [scores, theme]);

  return (
    <div className="flex justify-center p-4">
      <canvas ref={canvasRef} width={200} height={300} className="w-[180px] h-[270px] drop-shadow-2xl" />
    </div>
  );
}
