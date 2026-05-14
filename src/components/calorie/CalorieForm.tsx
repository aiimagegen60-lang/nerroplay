
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Activity, User, Ruler, Weight, ArrowRight, ShieldCheck, Sparkles, Target, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';
import { CalorieInput, calculateCalories, ActivityLevel, Goal } from '../../lib/calorie/calorie-engine';
import { SafeStorage } from '../../lib/safe-storage';

export default function CalorieForm() {
  const navigate = useNavigate();
  const [data, setData] = useState<CalorieInput>({
    fullName: '',
    age: 25,
    gender: 'male',
    weight: 70,
    height: 170,
    activityLevel: 'moderate',
    goal: 'maintain'
  });

  const [liveCalories, setLiveCalories] = useState<number | null>(null);

  useEffect(() => {
    try {
      const result = calculateCalories(data);
      setLiveCalories(result.targetCalories);
    } catch (e) {
      setLiveCalories(null);
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = calculateCalories(data);
    SafeStorage.set('last_calorie_input', data);
    SafeStorage.set('last_calorie_result', result);
    navigate('/report/calorie');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="glass-block p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5">
            <Zap size={120} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Activity size={20} />
            </div>
            <h2 className="text-xl font-bold text-text-primary uppercase tracking-tight">Metabolic Analysis</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-text-secondary uppercase tracking-widest flex items-center gap-2">
                  <User size={12} className="text-primary" /> Full Name
                </label>
                <input 
                  type="text"
                  required
                  value={data.fullName}
                  onChange={(e) => setData({ ...data, fullName: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full bg-background border border-border-glass rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-text-secondary uppercase tracking-widest">Age</label>
                <input 
                  type="number"
                  min={15}
                  max={100}
                  required
                  value={data.age}
                  onChange={(e) => setData({ ...data, age: parseInt(e.target.value) || 25 })}
                  className="w-full bg-background border border-border-glass rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-text-secondary uppercase tracking-widest">Biological Gender</label>
              <div className="grid grid-cols-2 gap-2">
                {['male', 'female'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setData({ ...data, gender: g as any })}
                    className={cn(
                      "py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
                      data.gender === g 
                        ? "bg-primary text-background border-primary shadow-lg shadow-primary/20" 
                        : "bg-background border-border-glass text-text-secondary hover:border-primary/50"
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-text-secondary uppercase tracking-widest flex items-center gap-2">
                  <Ruler size={12} className="text-primary" /> Height (cm)
                </label>
                <input 
                  type="number"
                  required
                  value={data.height}
                  onChange={(e) => setData({ ...data, height: parseInt(e.target.value) || 0 })}
                  className="w-full bg-background border border-border-glass rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-text-secondary uppercase tracking-widest flex items-center gap-2">
                  <Weight size={12} className="text-primary" /> Weight (kg)
                </label>
                <input 
                  type="number"
                  required
                  value={data.weight}
                  onChange={(e) => setData({ ...data, weight: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-background border border-border-glass rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-text-secondary uppercase tracking-widest flex items-center gap-2">
                <Activity size={12} className="text-primary" /> Activity Level
              </label>
              <select 
                value={data.activityLevel}
                onChange={(e) => setData({ ...data, activityLevel: e.target.value as ActivityLevel })}
                className="w-full bg-background border border-border-glass rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
              >
                <option value="sedentary">Sedentary (Office job, little exercise)</option>
                <option value="light">Lightly Active (1-3 days exercise/week)</option>
                <option value="moderate">Moderately Active (3-5 days exercise/week)</option>
                <option value="active">Active (6-7 days exercise/week)</option>
                <option value="very_active">Very Active (Heavy exercise, physical job)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-text-secondary uppercase tracking-widest flex items-center gap-2">
                <Target size={12} className="text-primary" /> Your Goal
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['lose', 'maintain', 'gain'].map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => setData({ ...data, goal: goal as Goal })}
                    className={cn(
                      "py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all text-center",
                      data.goal === goal 
                        ? "bg-primary text-background border-primary shadow-lg shadow-primary/20" 
                        : "bg-background border-border-glass text-text-secondary hover:border-primary/50"
                    )}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Preview */}
            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 flex items-center justify-between">
              <div>
                <div className="text-[8px] font-mono text-primary uppercase tracking-[0.2em] mb-1">Target Daily Calories</div>
                <div className="text-2xl font-black text-text-primary tracking-tighter tabular-nums">
                  {liveCalories === null ? '--' : liveCalories} kcal
                </div>
              </div>
              <div className="text-right">
                <div className="text-[8px] font-mono text-text-muted uppercase tracking-[0.2em] mb-1">Weekly Forecast</div>
                <div className="text-xs font-bold text-primary uppercase tracking-tight">
                  {data.goal === 'lose' ? 'Steady Loss' : data.goal === 'gain' ? 'Lean Gain' : 'Balance'}
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-primary text-background rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 group"
            >
              Generate Nutrition Strategy <Sparkles size={16} />
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-center gap-2 text-text-muted">
              <ShieldCheck size={12} className="text-primary" />
              <p className="text-[8px] uppercase tracking-widest font-mono">
                Neuralplay Health Engine v1.2.0
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
