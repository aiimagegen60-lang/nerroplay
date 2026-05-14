import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Moon, Sun, Clock, Zap, Activity, Target, Info, 
  Brain, Heart, Shield, AlertTriangle, ListChecks, 
  History, Flame, Trophy, Bell, Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import NerroSmartRecommendations from './NerroSmartRecommendations';

interface SleepRecord {
  date: string;
  hours: number;
  score: number;
}

export default function SleepCalculator() {
  const { language, t } = useLanguage();
  const [mode, setMode] = useState<'wake' | 'now'>('wake');
  const [wakeTime, setWakeTime] = useState('07:00');
  const timeInputRef = useRef<HTMLInputElement>(null);
  const [results, setResults] = useState<{
    times: Date[];
    mode: 'wake' | 'now';
  } | null>(null);
  
  const [streak, setStreak] = useState(0);
  const [history, setHistory] = useState<SleepRecord[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false); // For local calculation
  const [error, setError] = useState<string | null>(null);

  // Load history and streak
  useEffect(() => {
    const savedHistory = localStorage.getItem('nerro_sleep_history');
    const savedStreak = localStorage.getItem('nerro_sleep_streak');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedStreak) setStreak(parseInt(savedStreak));
  }, []);

  const calculateSleep = async () => {
    setIsCalculating(true);
    setAiAnalysis(null);
    setError(null);

    const inputData = { 
      mode, 
      wakeTime: mode === 'wake' ? wakeTime : undefined,
      now: mode === 'now' ? true : undefined
    };

    try {
      const response = await fetch('/api/tool/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId: 'sleep-calculator', inputData }),
      });

      if (!response.ok) throw new Error('Failed to calculate on server');

      const data = await response.json();
      // Map ISO strings back to Date objects
      const times = data.times.map((t: string) => new Date(t));
      
      setResults({ times, mode });
    } catch (err) {
      console.error('Failed to execute sleep tool on backend', err);
      setError("### ❌ Processing failed\nWe're experiencing issues connecting to our backend or AI providers.");
    } finally {
      setIsCalculating(false);
    }
  };

  const getAIAnalysis = async (time: Date, cycles: number) => {
    setIsAiAnalyzing(true);
    setAiAnalysis(null);
    setError(null);
    const inputData = { time: time.toISOString(), cycles };

    try {
      const response = await fetch('/api/tool/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId: 'sleep-calculator-analysis', inputData }),
      });
      if (!response.ok) throw new Error('Failed to get analysis');
      const data = await response.json();
      setAiAnalysis(data.analysis);
    } catch (err) {
      setError("### ❌ AI Analysis failed\nConnection error.");
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const saveSleep = (hours: number) => {
    const score = hours >= 7 && hours <= 9 ? 95 : hours >= 6 ? 75 : 50;
    const newRecord: SleepRecord = {
      date: new Date().toLocaleDateString(),
      hours,
      score
    };
    
    const newHistory = [newRecord, ...history].slice(0, 7);
    setHistory(newHistory);
    localStorage.setItem('nerro_sleep_history', JSON.stringify(newHistory));
    
    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem('nerro_sleep_streak', newStreak.toString());
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="relative min-h-screen space-y-8 pb-20">
      {/* 3D Night Sky Background */}
      <div className="fixed inset-0 -z-10 bg-[#050510] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a20] via-[#050510] to-[#000]" />
        {/* Stars */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            initial={{ opacity: Math.random() }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity }}
            className="absolute w-0.5 h-0.5 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
        {/* Moving Moon */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 w-32 h-32 rounded-full bg-gradient-to-br from-gray-100 to-gray-400 shadow-[0_0_50px_rgba(255,255,255,0.2)]"
        >
          <div className="absolute top-4 left-6 w-6 h-6 rounded-full bg-gray-500/20" />
          <div className="absolute bottom-8 right-10 w-4 h-4 rounded-full bg-gray-500/20" />
        </motion.div>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass p-4 rounded-2xl border border-blue-500/20 flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Flame className="text-orange-500 w-5 h-5" />
          </div>
          <div>
            <p className="text-[0.6rem] text-text-muted uppercase tracking-widest">{t('sleep.streak')}</p>
            <p className="text-lg font-black text-text-primary">{streak} 🔥</p>
          </div>
        </div>
        <div className="glass p-4 rounded-2xl border border-purple-500/20 flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Trophy className="text-yellow-500 w-5 h-5" />
          </div>
          <div>
            <p className="text-[0.6rem] text-text-muted uppercase tracking-widest">{t('sleep.score')}</p>
            <p className="text-lg font-black text-text-primary">88/100</p>
          </div>
        </div>
      </div>

      {/* Input Card */}
      <div className="glass p-8 rounded-3xl border border-border-glass relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Moon className="text-indigo-400" />
            {t('sleep.title')}
          </h2>
          
          <div className="flex bg-background/50 p-1 rounded-xl border border-border-glass">
            <button 
              onClick={() => setMode('wake')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'wake' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-text-muted hover:text-text-primary'}`}
            >
              {t('sleep.mode_wake')}
            </button>
            <button 
              onClick={() => setMode('now')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'now' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-text-muted hover:text-text-primary'}`}
            >
              {t('sleep.mode_now')}
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-10 space-y-8">
          {mode === 'wake' ? (
            <div className="relative group cursor-pointer" onClick={() => timeInputRef.current?.showPicker()}>
              <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/30 transition-all" />
              <div className="relative text-6xl font-black text-text-primary tracking-tighter">
                {new Date(`1970-01-01T${wakeTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
              </div>
              <input 
                ref={timeInputRef}
                type="time" 
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="text-center text-text-muted text-xs uppercase tracking-widest mt-2">Set Wake Up Time</div>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <div className="text-6xl font-black text-text-primary tracking-tighter">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-text-muted text-xs uppercase tracking-widest">Current Time</div>
            </div>
          )}

          <button 
            onClick={calculateSleep}
            className="px-12 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all neon-glow flex items-center gap-2"
          >
            <Zap size={18} /> {t('sleep.calculate')}
          </button>
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {results && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {results.times.map((time, i) => {
                const cycles = [9, 7.5, 6][i];
                const isBest = cycles === 7.5;
                return (
                  <motion.div
                    key={`sleep-result-${i}-${time.getTime()}`}
                    whileHover={{ scale: 1.02 }}
                    className={`glass p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${isBest ? 'border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.2)]' : 'border-border-glass'}`}
                    onClick={() => {
                      saveSleep(cycles);
                      getAIAnalysis(time, cycles / 1.5);
                    }}
                  >
                    {isBest && (
                      <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[0.5rem] px-2 py-1 font-bold uppercase rounded-bl-lg">
                        Recommended
                      </div>
                    )}
                    <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-2">
                      {results.mode === 'wake' ? 'Sleep at' : 'Wake at'}
                    </p>
                    <h4 className="text-3xl font-black text-text-primary">{formatTime(time)}</h4>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-text-secondary">
                        <Clock size={12} /> {cycles} {t('sleep.hours')}
                      </div>
                      <div className="text-[0.6rem] font-bold text-indigo-400 uppercase">
                        {cycles / 1.5} {t('sleep.cycles')}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Deep Result Engine */}
            <div className="glass p-8 rounded-3xl border border-border-glass">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-border-glass">
                <div>
                  <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                    <Brain className="text-indigo-400" size={20} />
                    {t('sleep.meaning_title')}
                  </h3>
                  <p className="text-text-secondary mt-1">{t('common.status')}: <span className="text-indigo-400 font-bold">{t('sleep.status_optimized')}</span></p>
                </div>
                <div className="mt-4 md:mt-0 px-4 py-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                  <p className="text-[0.6rem] font-mono text-indigo-400 uppercase tracking-widest">Efficiency</p>
                  <p className="text-lg font-black text-text-primary">94%</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div>
                    <h4 className="font-bold text-text-primary flex items-center gap-2 mb-3">
                      <Activity className="w-5 h-5 text-blue-500" /> {t('sleep.meaning_title')}
                    </h4>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      Sleep occurs in 90-minute cycles. Waking up at the end of a cycle (REM stage) ensures you feel refreshed. These calculations include a 15-minute buffer for falling asleep.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-text-primary flex items-center gap-2 mb-3">
                      <Shield className="w-5 h-5 text-green-500" /> {t('sleep.benefits_title')}
                    </h4>
                    <ul className="space-y-2">
                      {['Cognitive performance boost', 'Muscle tissue repair & growth', 'Hormonal balance (Ghrelin/Leptin)', 'Immune system strengthening', 'Emotional regulation'].map((item, idx) => (
                        <li key={`benefit-${idx}`} className="flex items-start gap-2 text-sm text-text-secondary">
                          <span className="text-indigo-500 mt-1">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-text-primary flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-5 h-5 text-red-500" /> {t('sleep.risks_title')}
                    </h4>
                    <ul className="space-y-2">
                      {['Increased cortisol (stress)', 'Metabolic slowdown & fat gain', 'Reduced focus & brain fog', 'Cardiovascular strain', 'Weakened immunity'].map((item, idx) => (
                        <li key={`risk-${idx}`} className="flex items-start gap-2 text-sm text-text-secondary">
                          <span className="text-red-500 mt-1">×</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h4 className="font-bold text-text-primary flex items-center gap-2 mb-3">
                      <ListChecks className="w-5 h-5 text-purple-500" /> {t('sleep.plan_title')}
                    </h4>
                    <ul className="space-y-2">
                      {['Maintain a fixed sleep/wake schedule', 'No blue light 60 mins before bed', 'Keep room temperature at 18-20°C', 'Avoid caffeine after 2 PM', 'Use blackout curtains for total darkness'].map((item, idx) => (
                        <li key={`plan-${idx}`} className="flex items-start gap-2 text-sm text-text-secondary">
                          <span className="text-indigo-500 mt-1">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-text-primary flex items-center gap-2 mb-3">
                      <History className="w-5 h-5 text-indigo-500" /> {t('sleep.routine_title')}
                    </h4>
                    <ul className="space-y-3">
                      {[
                        { step: '9:00 PM', desc: 'Dim lights & stop work' },
                        { step: '9:30 PM', desc: 'Warm shower & reading' },
                        { step: '10:00 PM', desc: 'Deep breathing & sleep' }
                      ].map(item => (
                        <li key={item.step} className="text-sm">
                          <span className="font-bold text-text-primary">{item.step}:</span>
                          <span className="text-text-secondary ml-2">{item.desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-10 p-5 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 flex items-center gap-4">
                <div className="p-3 bg-indigo-500/20 rounded-full">
                  <Zap className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <p className="text-[0.65rem] text-text-secondary font-bold uppercase tracking-widest">{t('sleep.habit_trigger')}</p>
                  <p className="text-text-primary font-medium italic">{t('sleep.habit_text')}</p>
                </div>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
