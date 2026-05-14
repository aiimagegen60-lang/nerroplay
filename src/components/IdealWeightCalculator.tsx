import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { Ruler, Scale, Flame, User, Target, Zap, Activity, Info, ChevronRight, Share2, Sparkles, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import NerroSmartRecommendations from './NerroSmartRecommendations';

type Unit = 'metric' | 'us';
type Gender = 'male' | 'female';
type BodyType = 'slim' | 'fit' | 'heavy';

export default function IdealWeightCalculator() {
  const { language, t } = useLanguage();
  const [unit, setUnit] = useState<Unit>('us');
  const [gender, setGender] = useState<Gender>('male');
  
  const [height, setHeight] = useState('170'); // CM default
  const [feet, setFeet] = useState('5');
  const [inches, setInches] = useState('7');
  
  const [weight, setWeight] = useState('70');
  const [bodyType, setBodyType] = useState<BodyType>('fit');
  
  const [results, setResults] = useState<{
    minIdeal: number;
    maxIdeal: number;
    averageIdeal: number;
    status: 'underweight' | 'ideal' | 'overweight';
  } | null>(null);

  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false); // For local calculation
  const [streak, setStreak] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedStreak = localStorage.getItem('nerro_idealweight_streak');
    if (savedStreak) setStreak(parseInt(savedStreak));
  }, []);

  const calculateIdealWeight = async () => {
    if (!weight || (unit === 'metric' && !height) || (unit === 'us' && (!feet || !inches))) return;
    
    setIsCalculating(true);
    setAiAnalysis(null);
    setError(null);
    
    const inputData = { 
      gender, 
      height: unit === 'metric' ? height : undefined,
      ft: unit === 'us' ? feet : undefined,
      in: unit === 'us' ? inches : undefined,
      unit 
    };

    try {
      const response = await fetch('/api/tool/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId: 'ideal-weight-calculator', inputData }),
      });

      if (!response.ok) throw new Error('Failed to calculate on server');

      const data = await response.json();
      const avg = data.idealWeight;
      const min = avg - 2;
      const max = avg + 2;

      const currentWeightKg = parseInt(weight);
      let status: 'underweight' | 'ideal' | 'overweight' = 'ideal';
      if (currentWeightKg < min) status = 'underweight';
      else if (currentWeightKg > max) status = 'overweight';

      setResults({
        minIdeal: min,
        maxIdeal: max,
        averageIdeal: avg,
        status
      });
      
      // Streak logic
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('nerro_idealweight_streak', newStreak.toString());
    } catch (err) {
      console.error('Failed to execute ideal weight tool on backend', err);
      setError("### ❌ Processing failed\nConnection error with backend.");
    } finally {
      setIsCalculating(false);
    }
  };

  const getAIAnalysis = async () => {
    if (!results) return;
    setIsAiAnalyzing(true);
    setAiAnalysis(null);
    setError(null);

    const inputData = { 
        gender, 
        height: unit === 'metric' ? height : undefined,
        ft: unit === 'us' ? feet : undefined,
        in: unit === 'us' ? inches : undefined,
        unit 
    };

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tool: 'Ideal Weight', 
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
      console.error(err);
      setError('### ❌ AI Analysis failed\nCould not connect to AI service. Please try again.');
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
        {/* Input Section */}
        <div className="glass p-8 rounded-3xl border border-border-glass">
            <h2 className="text-2xl font-black text-text-primary mb-8 flex items-center gap-3">
                <Target className="text-accent" /> Ideal Weight Calculator
            </h2>
            
            <div className="space-y-6">
                {/* Gender */}
                <div className="grid grid-cols-2 gap-4">
                    {(['male', 'female'] as Gender[]).map(g => (
                        <button key={g} onClick={() => setGender(g)} className={`py-4 rounded-xl border font-bold ${gender === g ? 'bg-accent/10 border-accent text-accent' : 'border-border-glass text-text-muted'}`}>
                            {g === 'male' ? 'Male' : 'Female'}
                        </button>
                    ))}
                </div>

                {/* Height */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-text-secondary">{t('height')}</label>
                    <div className="flex bg-background border border-border-glass rounded-lg overflow-hidden">
                      <button onClick={() => setUnit('metric')} className={`px-3 py-1 text-xs ${unit === 'metric' ? 'bg-accent text-white' : 'text-text-secondary'}`}>CM</button>
                      <button onClick={() => setUnit('us')} className={`px-3 py-1 text-xs ${unit === 'us' ? 'bg-accent text-white' : 'text-text-secondary'}`}>FT/IN</button>
                    </div>
                  </div>
                  {unit === 'metric' ? (
                    <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g. 175" className="w-full bg-background border border-border-glass rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent transition-colors" />
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" value={feet} onChange={e => setFeet(e.target.value)} placeholder="Ft" className="w-full bg-background border border-border-glass rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent transition-colors" />
                      <input type="number" value={inches} onChange={e => setInches(e.target.value)} placeholder="In" className="w-full bg-background border border-border-glass rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent transition-colors" />
                    </div>
                  )}
                </div>

                <button onClick={calculateIdealWeight} className="w-full py-4 bg-accent text-white font-black rounded-xl neon-glow disabled:opacity-50" disabled={isCalculating}>
                    {isCalculating ? 'Calculating...' : 'Calculate'}
                </button>
            </div>
        </div>

        {/* Results */}
        <AnimatePresence>
            {results && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                    <div className="glass p-8 rounded-3xl border border-border-glass">
                        <h3 className="text-center text-xs font-mono text-text-muted uppercase tracking-widest mb-2">Ideal Weight (Avg)</h3>
                        <div className="text-center text-6xl font-black text-text-primary mb-2">
                            {results.averageIdeal}<span className="text-2xl text-text-muted">kg</span>
                        </div>
                        <p className="text-center text-accent font-bold uppercase tracking-widest">{results.status}</p>
                    </div>

                    {/* Scale */}
                    <div className="glass p-6 rounded-3xl border border-border-glass">
                         <h4 className="text-sm font-bold text-text-primary mb-4">Weight Scale</h4>
                         <div className="h-4 bg-background rounded-full overflow-hidden flex">
                             <div className="h-full bg-blue-500/50" style={{width: '33%'}} />
                             <div className="h-full bg-green-500" style={{width: '34%'}} />
                             <div className="h-full bg-red-500/50" style={{width: '33%'}} />
                         </div>
                    </div>

                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
}
