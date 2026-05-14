import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Heart, Shield, AlertTriangle, Zap, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useDashboard } from '../context/DashboardContext';

export default function HealthRiskAnalyzer() {
  const { t } = useLanguage();
  const { state } = useDashboard();
  
  const [age, setAge] = useState(state.metrics.age.toString());
  const [smoker, setSmoker] = useState<'yes' | 'no'>('no');
  const [exercise, setExercise] = useState<'regularly' | 'rarely'>('regularly');
  const [medicalHistory, setMedicalHistory] = useState('');
  
  const [results, setResults] = useState<{ riskScore: number; level: string } | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateScore = async () => {
    setIsCalculating(true);
    setError(null);
    setAiAnalysis(null);

    const inputData = { 
      age: parseInt(age), 
      bmi: state.metrics.bmi || 24,
      smoker,
      exercise,
      medicalHistory
    };

    try {
      const response = await fetch('/api/tool/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId: 'health-risk-analyzer', inputData }),
      });

      if (!response.ok) throw new Error('Failed to calculate on server');

      const data = await response.json();
      setResults({ 
        riskScore: data.riskScore, 
        level: data.level
      });
    } catch (err) {
      console.error('Failed to execute health risk tool on backend', err);
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
      age: parseInt(age), 
      bmi: state.metrics.bmi || 24,
      smoker,
      exercise,
      medicalHistory
    };

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tool: 'Health Risk Analyzer', 
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
                <Shield className="text-accent" /> PRO Health Risk Analyzer
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Age</label>
                    <input type="number" value={age} onChange={e => setAge(e.target.value)} className="w-full bg-surface border border-border-glass rounded-xl px-4 py-3 text-text-primary" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Smoking Status</label>
                    <select value={smoker} onChange={e => setSmoker(e.target.value as 'yes' | 'no')} className="w-full bg-surface border border-border-glass rounded-xl px-4 py-3 text-text-primary appearance-none">
                        <option value="no">Non-Smoker</option>
                        <option value="yes">Smoker</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Exercise Habit</label>
                    <select value={exercise} onChange={e => setExercise(e.target.value as 'regularly' | 'rarely')} className="w-full bg-surface border border-border-glass rounded-xl px-4 py-3 text-text-primary appearance-none">
                        <option value="regularly">Regular Exercise</option>
                        <option value="rarely">Rarely Exercise</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Medical History</label>
                    <input type="text" value={medicalHistory} onChange={e => setMedicalHistory(e.target.value)} placeholder="e.g. Hypertension, Diabetes" className="w-full bg-surface border border-border-glass rounded-xl px-4 py-3 text-text-primary" />
                </div>
                <button 
                  onClick={calculateScore} 
                  disabled={isCalculating}
                  className="col-span-1 md:col-span-2 py-4 bg-accent text-white font-black rounded-xl neon-glow hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    <Zap size={18} /> {isCalculating ? 'Analyzing Risks...' : 'Analyze Health Risk'}
                </button>
            </div>
        </div>

        <AnimatePresence>
            {results && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="glass p-8 rounded-3xl border border-border-glass flex flex-col items-center justify-center">
                            <h4 className="text-sm font-mono text-text-muted mb-4 uppercase tracking-[0.2em]">Risk Score</h4>
                            <div className="relative w-40 h-40 flex items-center justify-center">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="12" className="text-border-glass" />
                                    <motion.circle 
                                        initial={{ strokeDashoffset: 440 }}
                                        animate={{ strokeDashoffset: 440 - (440 * (results.riskScore * 10) / 100) }}
                                        cx="80" cy="80" r="70" fill="none" stroke={results.riskScore < 4 ? '#22c55e' : results.riskScore < 8 ? '#eab308' : '#ef4444'} 
                                        strokeWidth="12" strokeDasharray="440" strokeLinecap="round" />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-4xl font-black text-text-primary">{results.riskScore}</span>
                                    <span className="text-[10px] text-text-muted">/ 10</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass p-8 rounded-3xl border border-border-glass flex flex-col items-center justify-center text-center">
                            <div className={`p-4 rounded-full mb-4 ${results.level === 'Low' ? 'bg-green-500/20 text-green-500' : results.level === 'Moderate' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'}`}>
                                <Heart size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-text-primary mb-2">{results.level} Risk Profile</h3>
                            <p className="text-sm text-text-secondary leading-relaxed">
                                {results.level === 'Low' ? 'Your profile matches a healthy trajectory.' : results.level === 'Moderate' ? 'Attention needed in lifestyle choices.' : 'Critical changes required for long-term health.'}
                            </p>
                        </div>
                     </div>
                </motion.div>
             )}
         </AnimatePresence>
    </div>
  );
}