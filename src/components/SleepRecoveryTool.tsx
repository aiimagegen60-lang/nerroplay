import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Moon, Sun, Clock, Zap, Star, Sparkles, 
  Activity, Info, AlertTriangle, ListChecks, 
  History, Trophy, Share2, Timer, ChevronRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useDashboard } from '../context/DashboardContext';

type SleepMode = 'wake' | 'sleep_now';
type Quality = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type Stress = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export default function SleepRecoveryTool() {
  const { language } = useLanguage();
  const { state } = useDashboard();
  const [mode, setMode] = useState<SleepMode>('wake');
  const [targetTime, setTargetTime] = useState('07:00');
  const [quality, setQuality] = useState<Quality>(8);
  const [stress, setStress] = useState<Stress>(3);
  const [sleepHours, setSleepHours] = useState(7);

  const [results, setResults] = useState<{
    recoveryScore: number;
    status: string;
  } | null>(null);

  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false); // For local calculation
  const [error, setError] = useState<string | null>(null);

  const calculateSleep = async () => {
    setIsCalculating(true);
    setError(null);
    setAiAnalysis(null);

    const inputData = {
      sleepHours,
      quality,
      stress,
      mode,
      wakeTime: targetTime
    };

    try {
      const response = await fetch('/api/tool/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId: 'sleep-recovery', inputData }),
      });

      if (!response.ok) throw new Error('Failed to calculate on server');

      const data = await response.json();
      
      setResults({
        recoveryScore: data.recoveryScore,
        status: data.status
      });
    } catch (err) {
      console.error('Failed to execute sleep tool on backend', err);
      setError("### ❌ Processing failed\nConnection error with backend.");
    } finally {
      setIsCalculating(false);
    }
  };

  const getAIAnalysis = async () => {
    if (!results) return;
    setIsAiAnalyzing(true);
    setError(null);
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tool: 'Sleep Recovery', 
          data: {
            sleepHours,
            quality,
            stress,
            mode,
            wakeTime: targetTime,
            results
          }
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'AI analysis failed');
      setAiAnalysis(data.analysis);
    } catch (err) {
      setError('### ❌ AI Analysis failed\nCould not connect to AI service. Please try again.');
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 pb-20 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-black text-text-primary flex items-center gap-3">
          <Moon className="text-accent fill-accent" /> Sleep & Recovery
        </h2>
      </div>

      <div className="glass p-8 rounded-3xl border border-border-glass relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-xs font-mono text-text-muted uppercase tracking-widest">Sleep Duration (Hours)</label>
                <input 
                  type="number" 
                  value={sleepHours}
                  onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                  className="w-full bg-background/50 border border-border-glass rounded-xl px-4 py-3 text-text-primary focus:outline-none"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-text-muted uppercase tracking-widest">Quality (1-10)</label>
                <input 
                  type="number" 
                  min="1" max="10"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value) as Quality)}
                  className="w-full bg-background/50 border border-border-glass rounded-xl px-4 py-3 text-text-primary focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-text-muted uppercase tracking-widest">Stress (1-10)</label>
                <input 
                  type="number" 
                  min="1" max="10"
                  value={stress}
                  onChange={(e) => setStress(parseInt(e.target.value) as Stress)}
                  className="w-full bg-background/50 border border-border-glass rounded-xl px-4 py-3 text-text-primary focus:outline-none"
                />
              </div>
            </div>

            <button 
              onClick={calculateSleep}
              disabled={isCalculating}
              className="w-full py-5 bg-accent text-white font-black rounded-2xl neon-glow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg disabled:opacity-50"
            >
              <Zap fill="currentColor" size={20} /> {isCalculating ? 'Analyzing Sleep...' : 'Analyze Recovery'}
            </button>
          </div>

          <div className="flex items-center justify-center p-6 bg-accent/5 rounded-3xl border border-accent/20 border-dashed">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 rounded-full border-4 border-accent/30 flex items-center justify-center mx-auto relative">
                <Moon className="text-accent animate-pulse" size={32} />
              </div>
              <p className="text-sm text-text-muted italic max-w-xs">
                "Sleep is the greatest legal performance enhancer. Optimize it for life."
              </p>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {results && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass p-8 rounded-3xl border border-border-glass flex flex-col items-center justify-center text-center">
                <h3 className="text-sm font-mono text-text-muted uppercase tracking-widest mb-4">Recovery Score</h3>
                <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="10" className="text-border-glass" />
                    <motion.circle 
                      initial={{ strokeDashoffset: 365 }}
                      animate={{ strokeDashoffset: 365 - (365 * results.recoveryScore / 100) }}
                      cx="64" cy="64" r="58" fill="none" 
                      stroke="#8b5cf6" 
                      strokeWidth="10" strokeDasharray="365" strokeLinecap="round" />
                  </svg>
                  <div className="absolute text-5xl font-black text-text-primary">{results.recoveryScore}%</div>
                </div>
                <p className={`font-bold ${results.status === 'Excellent' ? 'text-green-500' : 'text-yellow-500'}`}>{results.status} Status</p>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
