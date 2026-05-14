import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { HeartPulse } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import NerroSmartRecommendations from './NerroSmartRecommendations';

interface Zone {
  name: string;
  min: number;
  max: number;
}

export default function HeartRateCalculator() {
  const { language, t } = useLanguage();
  const [age, setAge] = useState('30');
  const [restingHR, setRestingHR] = useState('70');
  const [goal, setGoal] = useState('fat_loss');
  const [bpm, setBpm] = useState(80);
  const [showGuide, setShowGuide] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const zones = useMemo(() => {
    const ageNum = parseInt(age) || 30;
    const restingHRNum = parseInt(restingHR) || 70;
    const maxHR = 220 - ageNum;
    const zoneDefs = [
      { name: t('hr.zone1'), min: 0.5, max: 0.6 },
      { name: t('hr.zone2'), min: 0.6, max: 0.7 },
      { name: t('hr.zone3'), min: 0.7, max: 0.8 },
      { name: t('hr.zone4'), min: 0.8, max: 0.9 },
      { name: t('hr.zone5'), min: 0.9, max: 1.0 },
    ];
    return zoneDefs.map((z) => ({
      name: z.name,
      min: Math.round((maxHR - restingHRNum) * z.min + restingHRNum),
      max: Math.round((maxHR - restingHRNum) * z.max + restingHRNum),
    }));
  }, [age, restingHR, t]);

  const bestZone = useMemo(() => {
    if (goal === 'fat_loss') return zones[1];
    if (goal === 'cardio') return zones[2];
    if (goal === 'endurance') return zones[3];
    return zones[4];
  }, [goal, zones]);

  const fetchAIAnalysis = async () => {
    setIsAiAnalyzing(true);
    setError(null);
    setAiAnalysis(null);

    const inputData = { age, restingHR };

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tool: 'Heart Rate Calculator', 
          data: {
            ...inputData,
            zones,
            goal
          }
        }),
      });

      if (!response.ok) throw new Error('Failed to generate AI analysis');

      const data = await response.json();
      setAiAnalysis(data.analysis);
    } catch (err) {
      console.error('Failed to execute heart rate AI on backend', err);
      setError("### ❌ AI Analysis failed\nWe're experiencing issues connecting to our AI providers.");
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  return (
    <div className="relative min-h-screen space-y-8 pb-20">
      {/* Animated Heart Pulse */}
      <div className="flex flex-col items-center justify-center py-10 gap-6">
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 60 / bpm, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.5)] z-10 relative"
          >
            <HeartPulse size={48} className="text-white" />
          </motion.div>
          <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-50" />
        </div>
        <div className="text-center">
          <p className="text-text-muted text-xs uppercase tracking-widest">Current Pulse</p>
          <p className="text-4xl font-black text-text-primary">{bpm} <span className="text-lg">BPM</span></p>
        </div>
        <input 
          type="range" min="60" max="180" value={bpm} 
          onChange={(e) => setBpm(parseInt(e.target.value))}
          className="w-64 accent-red-500"
        />
      </div>

      {/* Input Card */}
      <div className="glass p-8 rounded-3xl border border-border-glass">
        <h2 className="text-2xl font-bold text-text-primary mb-8">{t('hr.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs text-text-muted uppercase mb-2">{t('hr.age')}</label>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full bg-background/50 p-3 rounded-lg border border-border-glass" />
          </div>
          <div>
            <label className="block text-xs text-text-muted uppercase mb-2">{t('hr.resting_hr')}</label>
            <input type="number" value={restingHR} onChange={(e) => setRestingHR(e.target.value)} className="w-full bg-background/50 p-3 rounded-lg border border-border-glass" />
          </div>
          <div>
            <label className="block text-xs text-text-muted uppercase mb-2">{t('hr.goal')}</label>
            <select value={goal} onChange={(e) => setGoal(e.target.value)} className="w-full bg-background/50 p-3 rounded-lg border border-border-glass">
              <option value="fat_loss">Fat Burn</option>
              <option value="cardio">Cardio Fitness</option>
              <option value="endurance">Endurance</option>
              <option value="peak">Peak Performance</option>
            </select>
          </div>
        </div>
        <button
          onClick={() => setShowGuide(true)}
          className="w-full mt-8 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all"
        >
          {t('hr.view_plan')}
        </button>
      </div>

      {/* Zones */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {zones.map((zone, i) => (
          <motion.div 
            key={`${zone.name}-${i}`}
            className={`glass p-4 rounded-xl border ${bestZone.name === zone.name ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-border-glass'}`}
          >
            <p className="text-[0.6rem] text-text-muted uppercase font-bold">{zone.name}</p>
            <p className="text-xl font-black text-text-primary">{zone.min}-{zone.max} <span className="text-xs">BPM</span></p>
          </motion.div>
        ))}
      </div>

      {/* Training Plan Modal */}
      <AnimatePresence>
        {showGuide && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setShowGuide(false)}
          >
            <motion.div 
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="glass p-8 rounded-3xl border border-border-glass max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-text-primary mb-6">{t('hr.view_plan')}</h2>
              <div className="space-y-6 text-text-secondary text-sm">
                <h4 className="font-bold text-text-primary">{t('hr.plan.fat_burn')}</h4>
                <p>Zone 2 training, 30-45 mins, 3-4 times/week. Focus on consistency.</p>
                <h4 className="font-bold text-text-primary">{t('hr.plan.cardio')}</h4>
                <p>Zone 3 intervals, 20-30 mins, 2-3 times/week. Improves aerobic capacity.</p>
                <h4 className="font-bold text-text-primary">{t('hr.plan.endurance')}</h4>
                <p>Zone 3-4, 45-60 mins, 2 times/week. Builds stamina.</p>
                <h4 className="font-bold text-text-primary">{t('hr.plan.peak')}</h4>
                <p>Zone 4-5, high intensity intervals, 15-20 mins, 1 time/week. Max performance.</p>
              </div>
              <button onClick={() => setShowGuide(false)} className="mt-8 w-full py-3 bg-indigo-600 text-white rounded-xl font-bold">Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
