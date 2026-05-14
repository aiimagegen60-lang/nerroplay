import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Flame, Activity, User, Ruler, ChevronRight, Zap, Scale, Info, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active';
type Goal = 'normal' | 'aggressive';

export default function CalorieDeficitCalculator() {
  const { t } = useLanguage();
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState('25');
  const [unit, setUnit] = useState<'metric' | 'us'>('us');
  const [heightCm, setHeightCm] = useState('170');
  const [feet, setFeet] = useState('5');
  const [inches, setInches] = useState('7');
  const [weight, setWeight] = useState('70');
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [goal, setGoal] = useState<Goal>('normal');
  
  const [results, setResults] = useState<{bmr: number, tdee: number, deficit: number, dailyTarget: number, weeklyLoss: number} | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const savedStreak = localStorage.getItem('nerro_deficit_streak');
    if (savedStreak) setStreak(parseInt(savedStreak));
  }, []);

  const calculateDeficit = async () => {
    if (!weight || !age || (unit === 'metric' && !heightCm) || (unit === 'us' && (!feet || !inches))) return;

    setIsCalculating(true);
    setAiAnalysis(null);

    const inputData = { 
      gender, 
      age, 
      weight, 
      height: unit === 'metric' ? heightCm : undefined, 
      feet: unit === 'us' ? feet : undefined, 
      inches: unit === 'us' ? inches : undefined, 
      unit, 
      activity, 
      goal 
    };

    try {
      const response = await fetch('/api/tool/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId: 'calorie-deficit-calculator', inputData }),
      });

      if (!response.ok) throw new Error('Failed to calculate on server');

      const data = await response.json();
      setResults({ 
        bmr: data.bmr, 
        tdee: data.tdee, 
        deficit: data.deficit, 
        dailyTarget: data.dailyTarget, 
        weeklyLoss: data.weeklyLoss 
      });

      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('nerro_deficit_streak', newStreak.toString());
    } catch (err) {
      console.error('Failed to execute calorie deficit tool on backend', err);
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
          tool: 'Calorie Deficit Calculator', 
          data: {
            gender, age, weight, unit, activity, goal,
            results
          }
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'AI analysis failed');
      setAiAnalysis(data.analysis);
    } catch (err) {
      console.error(err);
      setError('### ❌ AI Analysis failed\nCould not connect to AI service. Please try again.');
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
        <div className="glass p-8 rounded-3xl border border-border-glass">
            <h2 className="text-2xl font-black text-text-primary mb-8 flex items-center gap-3">
                <Flame className="text-accent" /> Calorie Deficit Calculator
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                         <button onClick={() => setGender('male')} className={`py-4 rounded-xl border font-bold ${gender === 'male' ? 'bg-accent/10 border-accent text-accent' : 'border-border-glass text-text-muted'}`}>Male</button>
                         <button onClick={() => setGender('female')} className={`py-4 rounded-xl border font-bold ${gender === 'female' ? 'bg-accent/10 border-accent text-accent' : 'border-border-glass text-text-muted'}`}>Female</button>
                    </div>
                    <input type="number" value={age} onChange={e => setAge(e.target.value)} className="w-full bg-background border border-border-glass rounded-lg px-4 py-3" placeholder="Age" />
                    <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full bg-background border border-border-glass rounded-lg px-4 py-3" placeholder="Weight (kg)" />
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-text-secondary">{t('height')}</label>
                      <div className="flex bg-background border border-border-glass rounded-lg overflow-hidden">
                        <button onClick={() => setUnit('metric')} className={`px-3 py-1 text-xs ${unit === 'metric' ? 'bg-accent text-white' : 'text-text-secondary'}`}>CM</button>
                        <button onClick={() => setUnit('us')} className={`px-3 py-1 text-xs ${unit === 'us' ? 'bg-accent text-white' : 'text-text-secondary'}`}>FT/IN</button>
                      </div>
                    </div>
                    {unit === 'metric' ? (
                      <input type="number" value={heightCm} onChange={e => setHeightCm(e.target.value)} placeholder="e.g. 175" className="w-full bg-background border border-border-glass rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent transition-colors" />
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <input type="number" value={feet} onChange={e => setFeet(e.target.value)} placeholder="Ft" className="w-full bg-background border border-border-glass rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent transition-colors" />
                        <input type="number" value={inches} onChange={e => setInches(e.target.value)} placeholder="In" className="w-full bg-background border border-border-glass rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent transition-colors" />
                      </div>
                    )}
                  </div>
                  <select value={activity} onChange={e => setActivity(e.target.value as ActivityLevel)} className="w-full bg-background border border-border-glass rounded-lg px-4 py-3">
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Lightly Active</option>
                    <option value="moderate">Moderately Active</option>
                    <option value="active">Very Active</option>
                  </select>
                </div>
            </div>
            <button onClick={calculateDeficit} className="w-full mt-6 py-4 bg-accent text-white font-black rounded-xl neon-glow">Calculate</button>
        </div>

        {results && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <div className="glass p-8 rounded-3xl border border-border-glass">
                    <div className="text-center">
                        <p className="text-xs font-mono text-text-muted uppercase tracking-widest">Daily Target</p>
                        <div className="text-6xl font-black text-text-primary">{results.dailyTarget} <span className="text-xl text-accent">kcal</span></div>
                    </div>
                </div>
                
                <section className="glass p-8 rounded-3xl border border-border-glass">
                    <h3 className="text-xl font-black mb-4">What is a Calorie Deficit?</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">A calorie deficit occurs when you consume fewer calories than your body burns, forcing it to utilize stored fat for energy. It is the fundamental principle of fat loss.</p>
                </section>
            </motion.div>
        )}
    </div>
  );
}
