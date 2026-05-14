import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Activity, Info, Zap, Utensils, Apple, Info as InfoIcon, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useDashboard } from '../context/DashboardContext';

type Goal = 'fat-loss' | 'maintenance' | 'muscle-gain';
type Preference = 'balanced' | 'vegan' | 'keto' | 'paleo';

export default function NutritionPlanner() {
  const { t } = useLanguage();
  const { state } = useDashboard();
  
  const [calories, setCalories] = useState('2000');
  const [preference, setPreference] = useState<Preference>('balanced');
  const [goal, setGoal] = useState<Goal>('maintenance');
  const [allergens, setAllergens] = useState('');
  
  const [results, setResults] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false); // For local generation
  const [error, setError] = useState<string | null>(null);

  const generatePlan = async () => {
    setIsGenerating(true);
    setError(null);
    setAiAnalysis(null);

    const inputData = { 
      calories: parseInt(calories),
      preference,
      goal,
      allergens
    };

    try {
      const response = await fetch('/api/tool/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId: 'nutrition-planner', inputData }),
      });

      if (!response.ok) throw new Error('Failed to calculate on server');

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error('Failed to execute nutrition tool on backend', err);
      setError("### ❌ Processing failed\nConnection error with backend AI services.");
    } finally {
      setIsGenerating(false);
    }
  };

  const getAIAnalysis = async () => {
    if (!results) return;
    setIsAiAnalyzing(true);
    setError(null);
    setAiAnalysis(null);

    const inputData = { 
      calories: parseInt(calories),
      preference,
      goal,
      allergens
    };

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tool: 'Nutrition Planner', 
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
                <Utensils className="text-accent" /> AI Nutrition Planner
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-medium text-text-secondary mb-2">Daily Calorie Target</label>
                   <input type="number" value={calories} onChange={e => setCalories(e.target.value)} className="w-full bg-surface border border-border-glass rounded-xl px-4 py-3 text-text-primary" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-text-secondary mb-2">Dietary Preference</label>
                   <select value={preference} onChange={e => setPreference(e.target.value as Preference)} className="w-full bg-surface border border-border-glass rounded-xl px-4 py-3 text-text-primary appearance-none">
                      <option value="balanced">Balanced</option>
                      <option value="vegan">Vegan</option>
                      <option value="keto">Keto</option>
                      <option value="paleo">Paleo</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-text-secondary mb-2">Primary Goal</label>
                   <select value={goal} onChange={e => setGoal(e.target.value as Goal)} className="w-full bg-surface border border-border-glass rounded-xl px-4 py-3 text-text-primary appearance-none">
                      <option value="fat-loss">Fat Loss</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="muscle-gain">Muscle Gain</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-text-secondary mb-2">Allergens / Avoid</label>
                   <input type="text" value={allergens} onChange={e => setAllergens(e.target.value)} placeholder="e.g. Nuts, Dairy" className="w-full bg-surface border border-border-glass rounded-xl px-4 py-3 text-text-primary" />
                </div>
                <button 
                  onClick={generatePlan} 
                  disabled={isGenerating}
                  className="col-span-1 md:col-span-2 py-4 bg-accent text-white font-black rounded-xl neon-glow hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    <Zap size={18} /> {isGenerating ? 'Generating Menu...' : 'Generate AI Nutrition Plan'}
                </button>
            </div>
        </div>

        <AnimatePresence>
            {results && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass p-6 rounded-2xl border border-blue-500/20 text-center">
                            <p className="text-[10px] font-mono text-blue-400 uppercase tracking-widest mb-1">Protein</p>
                            <div className="text-3xl font-black text-text-primary">{results.protein}g</div>
                        </div>
                        <div className="glass p-6 rounded-2xl border border-yellow-500/20 text-center text-text-primary">
                            <p className="text-[10px] font-mono text-yellow-400 uppercase tracking-widest mb-1">Carbs</p>
                            <div className="text-3xl font-black">{results.carbs}g</div>
                        </div>
                        <div className="glass p-6 rounded-2xl border border-pink-500/20 text-center text-text-primary">
                            <p className="text-[10px] font-mono text-pink-400 uppercase tracking-widest mb-1">Fats</p>
                            <div className="text-3xl font-black">{results.fats}g</div>
                        </div>
                     </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
}
