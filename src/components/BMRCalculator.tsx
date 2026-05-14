import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'motion/react';
import { Activity, Target, Flame, Info, Zap, User, Scale, Ruler, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

type Unit = 'cm' | 'ft';
type Gender = 'male' | 'female';

export default function BMRCalculator() {
  const { language, t } = useLanguage();
  const [unit, setUnit] = useState<Unit>('cm');
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  
  const [results, setResults] = useState<{
    bmr: number;
    metabolism: string;
    sedentary: number;
    moderate: number;
    active: number;
  } | null>(null);
  
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const savedStreak = localStorage.getItem("bmr_streak") || "0";
    setStreak(parseInt(savedStreak));
  }, []);

  const calculateBMR = async () => {
    if (!weight || !age || (unit === 'cm' && !heightCm) || (unit === 'ft' && (!heightFt || !heightIn))) return;

    setIsCalculating(true);
    setError(null);
    setAiAnalysis(null);

    const inputData = {
      gender,
      age,
      weight,
      height: unit === 'cm' ? heightCm : { ft: heightFt, in: heightIn },
      unit
    };

    try {
      const response = await fetch('/api/tool/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId: 'bmr-calculator', inputData }),
      });

      if (!response.ok) throw new Error('Failed to calculate on server');

      const data = await response.json();
      
      setResults({
        bmr: data.bmr,
        metabolism: data.metabolism,
        sedentary: data.sedentary,
        moderate: data.moderate,
        active: data.active
      });
      
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem("bmr_streak", newStreak.toString());
    } catch (err) {
      console.error('Failed to execute tool on backend', err);
      setError("### ❌ Processing failed\nWe're experiencing issues connecting to our backend.");
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
          tool: 'BMR Calculator', 
          data: {
            gender,
            age,
            weight,
            height: heightCm || `${heightFt}'${heightIn}"`,
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
    <div className="space-y-8">
      <div className="glass p-8 rounded-2xl border border-border-glass">
        <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
          <Flame className="text-accent" />
          {t('bmr.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">{t('gender')}</label>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setGender('male')} className={`py-3 rounded-lg border font-bold ${gender === 'male' ? 'bg-accent/10 border-accent text-accent' : 'bg-background border-border-glass text-text-muted'}`}>Male</button>
                <button onClick={() => setGender('female')} className={`py-3 rounded-lg border font-bold ${gender === 'female' ? 'bg-accent/10 border-accent text-accent' : 'bg-background border-border-glass text-text-muted'}`}>Female</button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">{t('age')}</label>
              <input type="number" value={age} onChange={e => setAge(e.target.value)} className="w-full bg-background border border-border-glass rounded-lg px-4 py-3 text-text-primary" />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">{t('weight')}</label>
              <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full bg-background border border-border-glass rounded-lg px-4 py-3 text-text-primary" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-text-secondary">{t('height')}</label>
                <div className="flex bg-background border border-border-glass rounded-lg overflow-hidden">
                  <button onClick={() => setUnit('cm')} className={`px-3 py-1 text-xs ${unit === 'cm' ? 'bg-accent text-white' : 'text-text-secondary'}`}>CM</button>
                  <button onClick={() => setUnit('ft')} className={`px-3 py-1 text-xs ${unit === 'ft' ? 'bg-accent text-white' : 'text-text-secondary'}`}>FT/IN</button>
                </div>
              </div>
              {unit === 'cm' ? (
                <input type="number" value={heightCm} onChange={e => setHeightCm(e.target.value)} placeholder="e.g. 175" className="w-full bg-background border border-border-glass rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent transition-colors" />
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" value={heightFt} onChange={e => setHeightFt(e.target.value)} placeholder="Ft" className="w-full bg-background border border-border-glass rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent transition-colors" />
                  <input type="number" value={heightIn} onChange={e => setHeightIn(e.target.value)} placeholder="In" className="w-full bg-background border border-border-glass rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent transition-colors" />
                </div>
              )}
            </div>
          </div>
        </div>
        <button onClick={calculateBMR} className="w-full mt-8 bg-accent text-white font-bold py-4 rounded-xl neon-glow">{t('calculate')}</button>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass p-6 rounded-2xl border border-accent/30 text-center">
              <p className="text-xs font-mono text-accent uppercase tracking-widest mb-2">BMR</p>
              <h4 className="text-3xl font-black text-text-primary">{results.bmr}</h4>
              <p className="text-[0.65rem] text-text-muted mt-1">kcal/day</p>
            </div>
            <div className="glass p-6 rounded-2xl border border-blue-500/20 text-center">
              <p className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-2">{t('energy_type')}</p>
              <h4 className="text-3xl font-black text-text-primary">{results.metabolism}</h4>
            </div>
            <div className="glass p-6 rounded-2xl border border-orange-500/20 text-center">
              <p className="text-xs font-mono text-orange-400 uppercase tracking-widest mb-2">Streak</p>
              <h4 className="text-3xl font-black text-text-primary">{streak} 🔥</h4>
            </div>
          </div>

          <div className="glass p-8 rounded-2xl border border-border-glass">
            <h3 className="text-xl font-bold text-text-primary mb-6">{t('daily_needs')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 glass rounded-xl">
                <p className="text-xs text-text-muted">Sedentary</p>
                <p className="text-2xl font-bold text-text-primary">{results.sedentary} kcal</p>
              </div>
              <div className="text-center p-4 glass rounded-xl">
                <p className="text-xs text-text-muted">Moderate</p>
                <p className="text-2xl font-bold text-text-primary">{results.moderate} kcal</p>
              </div>
              <div className="text-center p-4 glass rounded-xl">
                <p className="text-xs text-text-muted">Active</p>
                <p className="text-2xl font-bold text-text-primary">{results.active} kcal</p>
              </div>
            </div>
          </div>

        </motion.div>
      )}
    </div>
  );
}
