import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Zap, Flame, Calendar, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useDashboard } from '../context/DashboardContext';

export default function WeightLossPlanner() {
  const { t } = useLanguage();
  const { state } = useDashboard();
  
  const [currentWeight, setCurrentWeight] = useState(state.metrics.weight.toString());
  const [targetWeight, setTargetWeight] = useState(state.goals.targetWeight.toString());
  const [timeframe, setTimeframe] = useState('12'); // weeks
  
  const [results, setResults] = useState<{
    diff: number;
    weeklyRate: number;
    dailyDeficit: number;
  } | null>(null);
  
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false); // For local calculation
  const [error, setError] = useState<string | null>(null);

  const calculatePlan = async () => {
    setIsCalculating(true);
    setError(null);
    setAiAnalysis(null);

    const inputData = { 
      currentWeight: parseFloat(currentWeight),
      targetWeight: parseFloat(targetWeight),
      timeframe: parseInt(timeframe)
    };

    try {
      const response = await fetch('/api/tool/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId: 'weight-loss-planner', inputData }),
      });

      if (!response.ok) throw new Error('Failed to calculate on server');

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error('Failed to execute weight loss planner on backend', err);
      setError("### ❌ Processing failed\nConnection error with backend AI services.");
    } finally {
      setIsCalculating(false);
    }
  };

  const getAIAnalysis = async () => {
    if (!results) return;
    setIsAiAnalyzing(true);
    setError(null);
    setAiAnalysis(null);

    const inputData = { 
      currentWeight: parseFloat(currentWeight),
      targetWeight: parseFloat(targetWeight),
      timeframe: parseInt(timeframe)
    };

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tool: 'Weight Loss Planner', 
          data: {
            ...inputData,
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
    <div className="space-y-8 pb-12">
        <div className="glass p-8 rounded-3xl border border-border-glass">
            <h2 className="text-2xl font-black text-text-primary mb-8 flex items-center gap-3">
                <Target className="text-accent" /> AI Weight Loss Planner
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-medium text-text-secondary mb-2">Current Weight (kg)</label>
                   <input type="number" value={currentWeight} onChange={e => setCurrentWeight(e.target.value)} className="w-full bg-surface border border-border-glass rounded-xl px-4 py-3 text-text-primary" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-text-secondary mb-2">Target Weight (kg)</label>
                   <input type="number" value={targetWeight} onChange={e => setTargetWeight(e.target.value)} className="w-full bg-surface border border-border-glass rounded-xl px-4 py-3 text-text-primary" />
                </div>
                <div className="col-span-1 md:col-span-2">
                   <label className="block text-sm font-medium text-text-secondary mb-2">Target Timeframe (Weeks)</label>
                   <input type="number" value={timeframe} onChange={e => setTimeframe(e.target.value)} className="w-full bg-surface border border-border-glass rounded-xl px-4 py-3 text-text-primary" />
                </div>
                <button 
                  onClick={calculatePlan} 
                  disabled={isCalculating}
                  className="col-span-1 md:col-span-2 py-4 bg-accent text-white font-black rounded-xl neon-glow hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    <Zap size={18} /> {isCalculating ? 'Crafting Strategy...' : 'Generate AI Weight Loss Plan'}
                </button>
            </div>
        </div>

        <AnimatePresence>
            {results && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass p-6 rounded-2xl border border-border-glass text-center">
                            <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-1">Total Loss</p>
                            <div className="text-3xl font-black text-text-primary">{results.diff}kg</div>
                        </div>
                        <div className="glass p-6 rounded-2xl border border-border-glass text-center text-text-primary">
                            <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-1">Weekly Rate</p>
                            <div className="text-3xl font-black">{results.weeklyRate.toFixed(2)}kg</div>
                        </div>
                        <div className="glass p-6 rounded-2xl border border-orange-500/20 text-center text-text-primary">
                            <p className="text-[10px] font-mono text-orange-400 uppercase tracking-widest mb-1">Daily Deficit</p>
                            <div className="text-3xl font-black text-orange-500">-{results.dailyDeficit} kcal</div>
                        </div>
                     </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
}
