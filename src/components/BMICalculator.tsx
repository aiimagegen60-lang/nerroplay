import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BMI_CATEGORIES } from '../constants/bmiData';
import { Activity, AlertTriangle, Apple, Dumbbell, Heart, Target, Zap, Sparkles } from 'lucide-react';
import AIDeepAnalysis from './AIDeepAnalysis';
import { useLanguage } from '../context/LanguageContext';
import { useDashboard } from '../context/DashboardContext';

export default function BMICalculator() {
  const { language, t } = useLanguage();
  const { updateOnboarding } = useDashboard();
  const [height, setHeight] = useState('');
  const [ft, setFt] = useState('');
  const [inch, setInch] = useState('');
  const [unit, setUnit] = useState<'metric' | 'us'>('metric');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<keyof typeof BMI_CATEGORIES | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateBMI = () => {
    setError(null);

    // Validation & Setup
    const w = parseFloat(weight);
    
    let hInMeters = 0;
    if (unit === 'metric') {
      const h = parseFloat(height);
      if (h > 0) hInMeters = h / 100;
    } else {
      const f = parseFloat(ft);
      const i = parseFloat(inch) || 0;
      if (f > 0) hInMeters = (f * 12 + i) * 0.0254;
    }

    // Input basic check
    if (!weight || (unit === 'metric' && !height) || (unit === 'us' && !ft)) {
      setBmi(null);
      setCategory(null);
      setError('Please enter your weight and height');
      return;
    }

    // Validation 
    if (isNaN(w) || w <= 0 || isNaN(hInMeters) || hInMeters <= 0) {
      setBmi(null);
      setCategory(null);
      setError('Invalid weight or height values');
      return;
    }

    // Edge cases for height (50cm to 300cm)
    if (hInMeters < 0.5 || hInMeters > 3.0) {
      setError('Please enter a realistic height (50cm - 300cm)');
      setBmi(null);
      setCategory(null);
      return;
    }

    // Formula: BMI = kg / m^2
    const calculatedBmi = parseFloat((w / (hInMeters * hInMeters)).toFixed(1));
    setBmi(calculatedBmi);

    // Category Mapping
    if (calculatedBmi < 18.5) setCategory('underweight');
    else if (calculatedBmi < 25) setCategory('normal');
    else if (calculatedBmi < 30) setCategory('overweight');
    else setCategory('obese');

    updateOnboarding(true);
  };

  const handleDeepAnalysis = async () => {
    if (!bmi) throw new Error('Calculate BMI first');
    
    const response = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        tool: 'BMI Calculator', 
        data: {
          height, 
          weight, 
          bmi, 
          category 
        }
      }),
    });
    
    if (!response.ok) throw new Error('AI analysis failed');
    const data = await response.json();
    return data.analysis;
  };

  const getProgressWidth = () => {
    if (!bmi) return '0%';
    // Min BMI 10, Max BMI 40 for progress bar scale
    const percentage = Math.min(Math.max((bmi - 10) / 30 * 100, 0), 100);
    return `${percentage}%`;
  };

  return (
    <div className="space-y-8">
      <div className="glass p-8 rounded-2xl border border-border-glass">
        <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
          <Activity className="text-accent" />
          {t('bmi.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-text-secondary">{t('bmi.height')}</label>
              <div className="flex bg-background border border-border-glass rounded-lg overflow-hidden">
                <button onClick={() => setUnit('metric')} className={`px-3 py-1 text-xs ${unit === 'metric' ? 'bg-accent text-white' : 'text-text-secondary'}`}>CM</button>
                <button onClick={() => setUnit('us')} className={`px-3 py-1 text-xs ${unit === 'us' ? 'bg-accent text-white' : 'text-text-secondary'}`}>FT/IN</button>
              </div>
            </div>
            {unit === 'metric' ? (
              <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g. 175" className="w-full bg-background border border-border-glass rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent transition-colors" />
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <input type="number" value={ft} onChange={e => setFt(e.target.value)} placeholder="Ft" className="w-full bg-background border border-border-glass rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent transition-colors" />
                <input type="number" value={inch} onChange={e => setInch(e.target.value)} placeholder="In" className="w-full bg-background border border-border-glass rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent transition-colors" />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">{t('bmi.weight')}</label>
            <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 70" className="w-full bg-background border border-border-glass rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent transition-colors" />
          </div>
        </div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm flex items-center gap-2"
          >
            <AlertTriangle size={16} />
            {error}
          </motion.div>
        )}

        <button onClick={calculateBMI} className="w-full mt-6 bg-accent text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity neon-glow">{t('calc.button.bmi')}</button>
      </div>

      {bmi && category && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`glass p-8 rounded-2xl border ${BMI_CATEGORIES[category].border}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h3 className={`text-4xl font-black ${BMI_CATEGORIES[category].color}`}>
                {bmi} <span className="text-xl font-medium text-text-secondary">{t('bmi.result')}</span>
              </h3>
              <p className={`text-xl font-bold mt-1 ${BMI_CATEGORIES[category].color}`}>{t('bmi.category')}: {t(`bmi.${category}`)}</p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <p className="text-sm text-text-secondary">{language === 'hi' ? 'आदर्श सीमा' : 'Ideal Range'}</p>
              <p className="font-mono font-bold text-text-primary">{BMI_CATEGORIES[category].idealRange}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="h-4 w-full bg-background rounded-full overflow-hidden flex">
              <div className="h-full bg-blue-500" style={{ width: '28.3%' }} title="Underweight (<18.5)"></div>
              <div className="h-full bg-green-500" style={{ width: '21.3%' }} title="Normal (18.5-24.9)"></div>
              <div className="h-full bg-orange-500" style={{ width: '16.6%' }} title="Overweight (25-29.9)"></div>
              <div className="h-full bg-red-500" style={{ width: '33.8%' }} title="Obese (30+)"></div>
            </div>
            <div className="relative h-4 mt-2">
              <motion.div 
                initial={{ left: 0 }}
                animate={{ left: getProgressWidth() }}
                className="absolute top-0 -ml-2 w-4 h-4 bg-text-primary rounded-full border-2 border-surface shadow-lg"
              />
            </div>
          </div>

          <p className="text-text-primary text-lg mb-8 leading-relaxed border-l-4 border-accent pl-4">
            {BMI_CATEGORIES[category].meaning}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-text-primary flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-orange-500" /> {language === 'hi' ? 'स्वास्थ्य जोखिम' : 'Health Risks'}
                </h4>
                <ul className="space-y-2">
                  {BMI_CATEGORIES[category].risks.map(r => (
                    <li key={r} className="flex items-start gap-2 text-text-secondary">
                      <span className="text-accent mt-1">•</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-text-primary flex items-center gap-2 mb-3">
                  <Apple className="w-5 h-5 text-green-500" /> {language === 'hi' ? 'आहार योजना' : 'Diet Plan'}
                </h4>
                <ul className="space-y-2">
                  {BMI_CATEGORIES[category].diet.map(d => (
                    <li key={d} className="flex items-start gap-2 text-text-secondary">
                      <span className="text-accent mt-1">•</span> {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-text-primary flex items-center gap-2 mb-3">
                  <Dumbbell className="w-5 h-5 text-blue-500" /> {language === 'hi' ? 'वर्कआउट प्लान' : 'Workout Plan'}
                </h4>
                <ul className="space-y-2">
                  {BMI_CATEGORIES[category].workout.map(w => (
                    <li key={w} className="flex items-start gap-2 text-text-secondary">
                      <span className="text-accent mt-1">•</span> {w}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-text-primary flex items-center gap-2 mb-3">
                  <Heart className="w-5 h-5 text-red-500" /> {language === 'hi' ? 'जीवनशैली सुझाव' : 'Lifestyle Suggestions'}
                </h4>
                <ul className="space-y-2">
                  {BMI_CATEGORIES[category].lifestyle.map(l => (
                    <li key={l} className="flex items-start gap-2 text-text-secondary">
                      <span className="text-accent mt-1">•</span> {l}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-accent/10 rounded-xl border border-accent/20 flex items-center gap-4">
            <div className="p-3 bg-accent/20 rounded-full">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-text-secondary font-bold uppercase tracking-wider">{t('habit.trigger.title')}</p>
              <p className="text-text-primary font-medium">{BMI_CATEGORIES[category].habit}</p>
            </div>
          </div>

          <AIDeepAnalysis 
            toolName="Health" 
            onAnalyze={handleDeepAnalysis} 
          />
        </motion.div>
      )}
    </div>
  );
}
