import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'motion/react';
import { Activity, Apple, Dumbbell, Heart, Target, Zap, User, Scale, Info, Utensils, AlertCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

type Goal = 'fat-loss' | 'maintenance' | 'muscle-gain';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'athlete';

const PROTEIN_BASE: Record<Goal, number> = {
  'fat-loss': 1.6,
  'maintenance': 1.2,
  'muscle-gain': 2.0
};

const ACTIVITY_MULTIPLIER: Record<ActivityLevel, number> = {
  sedentary: 1.0,
  light: 1.1,
  moderate: 1.2,
  active: 1.3,
  athlete: 1.4
};

const GOAL_LABELS: Record<Goal, string> = {
  'fat-loss': 'Fat Loss',
  'maintenance': 'Maintenance',
  'muscle-gain': 'Muscle Gain'
};

const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: 'Sedentary',
  light: 'Lightly Active',
  moderate: 'Moderately Active',
  active: 'Very Active',
  athlete: 'Athlete'
};

export default function ProteinCalculator() {
  const { language, t } = useLanguage();
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState<Goal>('maintenance');
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  
  const [results, setResults] = useState<{
    totalProtein: number;
    perMeal: number;
    status: string;
  } | null>(null);
  
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateProtein = async () => {
    const w = parseFloat(weight);
    if (!w || w <= 0) return;

    setIsCalculating(true);
    setAiAnalysis(null);
    setError(null);

    const inputData = { weight: w, activity, goal };

    try {
      const response = await fetch('/api/tool/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          toolId: 'protein-calculator', 
          inputData,
          skipAnalysis: true
        }),
      });

      if (!response.ok) throw new Error('Failed to calculate on server');

      const data = await response.json();
      
      setResults({
        totalProtein: data.protein,
        perMeal: Math.round(data.protein / 4),
        status: 'Optimal'
      });
    } catch (err) {
      console.error('Failed to execute protein tool on backend', err);
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
          tool: 'Protein Intake Calculator', 
          data: {
            weight,
            goal,
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
        <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
          <Dumbbell className="text-accent" />
          Protein Intake Calculator
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                <Scale size={14} /> Weight (kg)
              </label>
              <input 
                type="number" 
                value={weight} 
                onChange={e => setWeight(e.target.value)} 
                placeholder="e.g. 70" 
                className="w-full bg-background border border-border-glass rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent transition-colors" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                <Target size={14} /> Fitness Goal
              </label>
              <select 
                value={goal} 
                onChange={e => setGoal(e.target.value as Goal)}
                className="w-full bg-background border border-border-glass rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer"
              >
                {Object.entries(GOAL_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
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
          onClick={calculateProtein} 
          className="w-full mt-8 bg-accent text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all neon-glow flex items-center justify-center gap-2"
        >
          <Zap size={18} /> Calculate Protein Needs
        </button>
      </div>

      {/* Results Section */}
      {results && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Protein Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass p-8 rounded-2xl border border-accent/30 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-accent" />
              <p className="text-xs font-mono text-accent uppercase tracking-widest mb-2">Daily Protein Intake</p>
              <h4 className="text-5xl font-black text-text-primary">
                {results.totalProtein} <span className="text-xl font-medium text-text-secondary">grams</span>
              </h4>
              <p className="text-[0.7rem] text-text-muted mt-2 uppercase tracking-tighter">Based on {GOAL_LABELS[goal]} & {ACTIVITY_LABELS[activity]} profile</p>
            </div>
            <div className="glass p-8 rounded-2xl border border-blue-500/20 text-center">
              <p className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-2">Protein Per Meal</p>
              <h4 className="text-4xl font-black text-text-primary">
                {results.perMeal} <span className="text-lg font-medium text-text-secondary">grams</span>
              </h4>
              <p className="text-[0.7rem] text-text-muted mt-2 uppercase tracking-tighter">Split across 4 balanced meals</p>
            </div>
          </div>

          {/* Deep Result Engine */}
          <div className="glass p-8 rounded-2xl border border-border-glass">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-border-glass">
              <div>
                <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                  <Info className="text-accent" size={20} />
                  Protein Strategy Engine
                </h3>
                <p className="text-text-secondary mt-1">Status: <span className="text-accent font-bold">{results.status}</span></p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div>
                  <h4 className="font-bold text-text-primary flex items-center gap-2 mb-3">
                    <Activity className="w-5 h-5 text-blue-500" /> Detailed Meaning
                  </h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Protein is essential for muscle repair, metabolic health, and effective fat loss. At {results.totalProtein}g per day, you provide your body with the necessary amino acids to preserve lean tissue while optimizing your thermic effect of food.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-text-primary flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-red-500" /> Fat Loss Strategy
                  </h4>
                  <ul className="space-y-2">
                    {['High satiety prevents overeating', 'Preserves muscle mass in a deficit', 'Increases thermic effect of food (TEF)', 'Regulates hunger hormones (Ghrelin)', 'Stabilizes blood sugar levels'].map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="text-accent mt-1">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-text-primary flex items-center gap-2 mb-3">
                    <Dumbbell className="w-5 h-5 text-orange-500" /> Muscle Gain Strategy
                  </h4>
                  <ul className="space-y-2">
                    {['Aim for 20-40g protein per meal', 'Prioritize protein within 2 hours of training', 'Consume slow-digesting protein before bed', 'Focus on Leucine-rich sources for MPS', 'Maintain a consistent daily intake'].map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="text-accent mt-1">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-text-primary flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500" /> Common Mistakes
                  </h4>
                  <ul className="space-y-2">
                    {['Low protein breakfast (Carb heavy)', 'Over-dependence on protein supplements', 'Skipping meals and losing consistency', 'Not tracking hidden protein sources', 'Ignoring hydration with high protein'].map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="text-red-500 mt-1">×</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="font-bold text-text-primary flex items-center gap-2 mb-3">
                    <Apple className="w-5 h-5 text-green-500" /> Best Protein Sources
                  </h4>
                  <ul className="space-y-2">
                    {['Whole Eggs (High bioavailability)', 'Chicken Breast (Lean protein)', 'Paneer/Tofu (Vegetarian options)', 'Lentils/Dal (Fiber + Protein)', 'Whey Protein (Post-workout)', 'Greek Yogurt (Probiotics)', 'Fish (Omega-3 + Protein)'].map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="text-accent mt-1">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-text-primary flex items-center gap-2 mb-3">
                    <Utensils className="w-5 h-5 text-purple-500" /> Meal Distribution Plan
                  </h4>
                  <ul className="space-y-3">
                    {[
                      { meal: 'Breakfast', desc: `${Math.round(results.totalProtein * 0.25)}g - Eggs, Protein Oats or Yogurt` },
                      { meal: 'Lunch', desc: `${Math.round(results.totalProtein * 0.35)}g - Chicken, Paneer, Fish or Legumes` },
                      { meal: 'Snack', desc: `${Math.round(results.totalProtein * 0.15)}g - Whey Shake, Nuts or Greek Yogurt` },
                      { meal: 'Dinner', desc: `${Math.round(results.totalProtein * 0.25)}g - Lean Meat, Paneer or Lentils` }
                    ].map(item => (
                      <li key={item.meal} className="text-sm">
                        <span className="font-bold text-text-primary">{item.meal}:</span>
                        <span className="text-text-secondary ml-2">{item.desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-text-primary flex items-center gap-2 mb-3">
                    <Heart className="w-5 h-5 text-pink-500" /> Lifestyle Tips
                  </h4>
                  <ul className="space-y-2">
                    {['Drink 3-4 liters of water daily', 'Include fiber to assist digestion', 'Prioritize 7-8 hours of sleep', 'Chew food thoroughly for better absorption', 'Manage stress to prevent muscle wasting'].map(item => (
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
                <p className="text-text-primary font-medium italic">"Adding protein to every meal = automatic body transformation"</p>
              </div>
            </div>
          </div>

        </motion.div>
      )}
    </div>
  );
}
