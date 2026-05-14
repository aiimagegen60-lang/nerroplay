
import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { getCSSVar } from './BMIGauge';

interface BMIScaleBarProps {
  bmi: number;
}

export default function BMIScaleBar({ bmi }: BMIScaleBarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const primaryColor = getCSSVar('--primary', '#6d28d9');
    const borderColor = getCSSVar('--border-glass', 'rgba(0,0,0,0.1)');
    const textSecondary = getCSSVar('--text-secondary', '#475569');

    // 15 to 45 scale
    const targetProgress = Math.min(Math.max((bmi - 15) / (45 - 15), 0), 1);

    const draw = (progress: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const barH = 10;
      const y = h / 2;

      // Track background
      ctx.beginPath();
      ctx.roundRect(0, y - barH / 2, w, barH, 5);
      ctx.fillStyle = borderColor;
      ctx.fill();

      // Colored Segments (approximated on the 15-45 scale)
      const categories = [
        { label: 'U', start: 0, end: 0.11, color: '#f59e0b' },
        { label: 'N', start: 0.11, end: 0.33, color: '#10b981' },
        { label: 'O', start: 0.33, end: 0.5, color: '#f59e0b' },
        { label: 'Ob', start: 0.5, end: 1, color: '#ef4444' }
      ];

      categories.forEach(cat => {
        ctx.fillStyle = cat.color + '44'; // Low opacity background
        ctx.fillRect(cat.start * w, y - barH / 2, (cat.end - cat.start) * w, barH);
      });

      // User Marker
      const currentPos = targetProgress * progress * w;
      
      // Marker Line
      ctx.beginPath();
      ctx.moveTo(currentPos, y - 15);
      ctx.lineTo(currentPos, y + 15);
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Marker Circle
      ctx.beginPath();
      ctx.arc(currentPos, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = primaryColor;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Bubble above
      ctx.fillStyle = primaryColor;
      ctx.beginPath();
      ctx.roundRect(currentPos - 15, y - 35, 30, 16, 4);
      ctx.fill();
      
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 9px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(bmi.toFixed(1), currentPos, y - 24);

      // Scale Labels
      ctx.fillStyle = textSecondary;
      ctx.font = '8px JetBrains Mono';
      ctx.fillText('15', 5, y + 25);
      ctx.fillText('18.5', 0.11 * w, y + 25);
      ctx.fillText('25', 0.33 * w, y + 25);
      ctx.fillText('30', 0.5 * w, y + 25);
      ctx.fillText('45+', w - 15, y + 25);
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
  }, [bmi, theme]);

  return (
    <div className="w-full h-[60px]">
      <canvas ref={canvasRef} width={600} height={60} className="w-full h-full" />
    </div>
  );
}
