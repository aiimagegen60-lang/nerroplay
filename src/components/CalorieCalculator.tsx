import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'motion/react';
import { Activity, Apple, Dumbbell, Heart, Target, Zap, Ruler, User, Calendar, Scale, Flame, Info, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

type Unit = 'cm' | 'ft';
type Gender = 'male' | 'female';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'athlete';

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  athlete: 1.9
};

const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: 'Sedentary (Office job, little exercise)',
  light: 'Lightly Active (1-3 days/week)',
  moderate: 'Moderately Active (3-5 days/week)',
  active: 'Very Active (6-7 days/week)',
  athlete: 'Athlete (2x training/day)'
};

export default function CalorieCalculator() {
  const { language, t } = useLanguage();
  const [unit, setUnit] = useState<Unit>('cm');
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  
  const [results, setResults] = useState<{
    tdee: number;
    maintenance: number;
    loss: number;
    gain: number;
    metabolism: string;
  } | null>(null);
  
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateTDEE = async () => {
    if (!weight || (unit === 'cm' && !heightCm) || (unit === 'ft' && (!heightFt || !heightIn)) || !age) return;

    setIsCalculating(true);
    setError(null);
    setAiAnalysis(null);

    const inputData = {
      gender,
      age,
      weight,
      height: unit === 'cm' ? heightCm : { ft: heightFt, in: heightIn },
      unit,
      activity
    };

    try {
      const response = await fetch('/api/tool/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId: 'calorie-calculator', inputData }),
      });

      if (!response.ok) throw new Error('Failed to calculate on server');

      const data = await response.json();
      
      setResults({
        tdee: data.tdee,
        maintenance: data.tdee,
        loss: data.tdee - 500,
        gain: data.tdee + 500,
        metabolism: activity === 'sedentary' ? 'Slow' : activity === 'active' ? 'Fast' : 'Moderate'
      });
    } catch (err) {
      console.error('Failed to execute calorie tool on backend', err);
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
          tool: 'Calorie Calculator', 
          data: {
            gender,
            age,
            weight,
            height: heightCm || `${heightFt}'${heightIn}"`,
            activity,
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
      {/* Input Section */}
      <div className="glass p-8 rounded-2xl border border-border-glass">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
              <Flame className="text-accent" />
              Calorie Calculator
            </h2>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                <User size={14} /> Gender
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setGender('male')}
                  className={`py-3 rounded-lg border font-bold transition-all ${gender === 'male' ? 'bg-accent/10 border-accent text-accent' : 'bg-background border-border-glass text-text-muted'}`}
                >
                  Male
                </button>
                <button 
                  onClick={() => setGender('female')}
                  className={`py-3 rounded-lg border font-bold transition-all ${gender === 'female' ? 'bg-accent/10 border-accent text-accent' : 'bg-background border-border-glass text-text-muted'}`}
                >
                  Female
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                <Calendar size={14} /> Age
              </label>
              <input 
                type="number" 
                value={age} 
                onChange={e => setAge(e.target.value)} 
                placeholder="e.g. 25" 
                className="w-full bg-background border border-border-glass rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent transition-colors" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                <Scale size={14} /> Weight (kg)
              </label>
              <input 
                type="number" 
                value={weight} 
                onChange={e => setWeight(e.target.value)} 
                placeholder="e.g. 75" 
                className="w-full bg-background border border-border-glass rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent transition-colors" 
              />
            </div>
          </div>

          <div className="space-y-4">
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

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                <Activity size={14} /> Activity Level
              </label>
              <select 
                value={activity} 
                onChange={e => setActivity(e.target.value as ActivityLevel)}
                className="w-full bg-background border border-border-glass rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer"
              >
                {Object.entries(ACTIVITY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button 
          onClick={calculateTDEE} 
          className="w-full mt-8 bg-accent text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all neon-glow flex items-center justify-center gap-2"
        >
          <Zap size={18} /> Calculate TDEE
        </button>
      </div>

      {/* Results Section */}
      {results && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Calorie Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass p-6 rounded-2xl border border-blue-500/20 text-center">
              <p className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-2">Weight Loss</p>
              <h4 className="text-3xl font-black text-text-primary">{results.loss}</h4>
              <p className="text-[0.65rem] text-text-muted mt-1">kcal/day (-500 deficit)</p>
            </div>
            <div className="glass p-6 rounded-2xl border border-accent/30 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-accent" />
              <p className="text-xs font-mono text-accent uppercase tracking-widest mb-2">Maintenance</p>
              <h4 className="text-4xl font-black text-text-primary">{results.maintenance}</h4>
              <p className="text-[0.65rem] text-text-muted mt-1">kcal/day (TDEE)</p>
            </div>
            <div className="glass p-6 rounded-2xl border border-orange-500/20 text-center">
              <p className="text-xs font-mono text-orange-400 uppercase tracking-widest mb-2">Weight Gain</p>
              <h4 className="text-3xl font-black text-text-primary">{results.gain}</h4>
              <p className="text-[0.65rem] text-text-muted mt-1">kcal/day (+500 surplus)</p>
            </div>
          </div>

          {/* Deep Result Engine */}
          <div className="glass p-8 rounded-2xl border border-border-glass">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-border-glass">
              <div>
                <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                  <Info className="text-accent" size={20} />
                  Metabolic Profile
                </h3>
                <p className="text-text-secondary mt-1">Status: <span className="text-accent font-bold">{results.metabolism}</span></p>
              </div>
              <div className="mt-4 md:mt-0 px-4 py-2 bg-accent/10 rounded-lg border border-accent/20">
                <p className="text-[0.65rem] font-mono text-accent uppercase tracking-widest">Daily Target</p>
                <p className="text-lg font-black text-text-primary">{results.tdee} kcal</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div>
                  <h4 className="font-bold text-text-primary flex items-center gap-2 mb-3">
                    <Activity className="w-5 h-5 text-blue-500" /> Detailed Meaning
                  </h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Your Total Daily Energy Expenditure (TDEE) of {results.tdee} calories reflects your body's energy needs based on your {gender} physiology and {activity} lifestyle. This includes your basal metabolic rate plus physical movement.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-text-primary flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-red-500" /> Fat Loss Plan
                  </h4>
                  <p className="text-xs font-bold text-accent mb-2">Target: {results.loss} kcal/day</p>
                  <ul className="space-y-2">
                    {['Prioritize high-volume, low-calorie vegetables', 'Maintain 1.6g-2g protein per kg of bodyweight', 'Implement 16:8 intermittent fasting if suitable', 'Focus on NEAT (Non-Exercise Activity Thermogenesis)', 'Limit liquid calories and processed sugars'].map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="text-accent mt-1">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-text-primary flex items-center gap-2 mb-3">
                    <Dumbbell className="w-5 h-5 text-orange-500" /> Muscle Gain Plan
                  </h4>
                  <p className="text-xs font-bold text-accent mb-2">Surplus: {results.gain} kcal/day</p>
                  <ul className="space-y-2">
                    {['Progressive overload in resistance training', 'Pre-workout complex carbohydrates for energy', 'Post-workout protein + fast-acting carbs', 'Focus on compound movements (Squat, Deadlift, Press)', 'Ensure 0.8g-1g of healthy fats for hormonal health'].map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="text-accent mt-1">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="font-bold text-text-primary flex items-center gap-2 mb-3">
                    <Apple className="w-5 h-5 text-green-500" /> Diet Strategy
                  </h4>
                  <ul className="space-y-2">
                    {['40% Carbs / 30% Protein / 30% Fats split', 'Include fermented foods for gut health', 'Hydrate with 35ml water per kg of bodyweight', 'Minimize seed oils and trans fats', 'Use magnesium-rich foods for muscle recovery'].map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="text-accent mt-1">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-text-primary flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-yellow-500" /> Workout Plan
                  </h4>
                  <ul className="space-y-2">
                    {['3-5 days of resistance training weekly', '2 sessions of Zone 2 cardio (30-45 mins)', 'Focus on mobility and flexibility work', 'Incorporate HIIT for metabolic conditioning', 'Track volume and intensity progression'].map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="text-accent mt-1">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-text-primary flex items-center gap-2 mb-3">
                    <Heart className="w-5 h-5 text-pink-500" /> Lifestyle Tips
                  </h4>
                  <ul className="space-y-2">
                    {['Aim for 7-9 hours of high-quality sleep', 'Practice 10 mins of daily mindfulness', 'Limit blue light exposure 1 hour before bed', 'Take 10,000 steps daily regardless of workout', 'Manage cortisol through regular recovery days'].map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="text-accent mt-1">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-10 p-5 bg-accent/10 rounded-xl border border-accent/20 flex items-center gap-4">
              <div className="p-3 bg-accent/20 rounded-full">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-[0.65rem] text-text-secondary font-bold uppercase tracking-widest">Habit Trigger</p>
                <p className="text-text-primary font-medium italic">"Consistency beats intensity; track your intake for 21 days to lock in your metabolic rhythm."</p>
              </div>
            </div>
          </div>

        </motion.div>
      )}
    </div>
  );
}
