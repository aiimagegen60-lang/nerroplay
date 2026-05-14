
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Activity, User, Ruler, Weight, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import { UserHealthData, calculateBMI, CATEGORIES } from '../../lib/bmi/bmi-engine';
import { SafeStorage } from '../../lib/safe-storage';

export default function BMIForm() {
  const navigate = useNavigate();
  const [data, setData] = useState<UserHealthData>({
    fullName: '',
    age: 25,
    gender: 'male',
    heightUnit: 'cm',
    heightCm: 170,
    heightFtFt: 5,
    heightFtIn: 7,
    weightUnit: 'kg',
    weight: 70
  });

  const [liveBmi, setLiveBmi] = useState<number | null>(null);
  const [liveCategory, setLiveCategory] = useState<string>('');

  useEffect(() => {
    try {
      const result = calculateBMI(data);
      setLiveBmi(result.bmi);
      setLiveCategory(result.categoryLabel);
    } catch (e) {
      setLiveBmi(null);
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = calculateBMI(data);
    SafeStorage.set('last_bmi_data', data);
    SafeStorage.set('last_bmi_result', result);
    navigate('/report/bmi');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="glass-block p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5">
            <Activity size={120} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Activity size={20} />
            </div>
            <h2 className="text-xl font-bold text-text-primary uppercase tracking-tight">Your Health Analysis</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
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
                  className="w-full bg-background border border-border-glass rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                />
              </div>

              {/* Age */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-text-secondary uppercase tracking-widest">Age (5-120)</label>
                <input 
                  type="number"
                  min={5}
                  max={120}
                  required
                  value={data.age}
                  onChange={(e) => setData({ ...data, age: parseInt(e.target.value) || 25 })}
                  className="w-full bg-background border border-border-glass rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                />
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-text-secondary uppercase tracking-widest">Biological Gender</label>
              <div className="grid grid-cols-3 gap-2">
                {['male', 'female', 'other'].map((g) => (
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Height */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono text-text-secondary uppercase tracking-widest flex items-center gap-2">
                    <Ruler size={12} className="text-primary" /> Height
                  </label>
                  <div className="flex gap-1 bg-background/50 p-1 rounded-lg border border-border-glass scale-75 origin-right">
                    {['cm', 'ft'].map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setData({ ...data, heightUnit: u as any })}
                        className={cn(
                          "px-2 py-0.5 rounded text-[8px] font-bold uppercase",
                          data.heightUnit === u ? "bg-primary text-background" : "text-text-muted"
                        )}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
                {data.heightUnit === 'cm' ? (
                  <input 
                    type="number"
                    value={data.heightCm}
                    onChange={(e) => setData({ ...data, heightCm: parseInt(e.target.value) || 0 })}
                    className="w-full bg-background border border-border-glass rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                    placeholder="Height in cm"
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="number"
                      placeholder="ft"
                      value={data.heightFtFt}
                      onChange={(e) => setData({ ...data, heightFtFt: parseInt(e.target.value) || 0 })}
                      className="w-full bg-background border border-border-glass rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                    />
                    <input 
                      type="number"
                      placeholder="in"
                      value={data.heightFtIn}
                      onChange={(e) => setData({ ...data, heightFtIn: parseInt(e.target.value) || 0 })}
                      className="w-full bg-background border border-border-glass rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono text-text-secondary uppercase tracking-widest flex items-center gap-2">
                    <Weight size={12} className="text-primary" /> Weight
                  </label>
                  <div className="flex gap-1 bg-background/50 p-1 rounded-lg border border-border-glass scale-75 origin-right">
                    {['kg', 'lbs'].map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setData({ ...data, weightUnit: u as any })}
                        className={cn(
                          "px-2 py-0.5 rounded text-[8px] font-bold uppercase",
                          data.weightUnit === u ? "bg-primary text-background" : "text-text-muted"
                        )}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
                <input 
                  type="number"
                  value={data.weight}
                  onChange={(e) => setData({ ...data, weight: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-background border border-border-glass rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                  placeholder={`Weight in ${data.weightUnit}`}
                />
              </div>
            </div>

            {/* Live Preview */}
            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 flex items-center justify-between">
              <div>
                <div className="text-[8px] font-mono text-primary uppercase tracking-[0.2em] mb-1">Live BMI Preview</div>
                <div className="text-2xl font-black text-text-primary tracking-tighter">
                  {liveBmi === null ? '--' : liveBmi}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[8px] font-mono text-text-muted uppercase tracking-[0.2em] mb-1">Status</div>
                <div className="text-xs font-bold text-primary uppercase tracking-tight">
                  {liveCategory || 'Pending...'}
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-primary text-background rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 group"
            >
              Generate My Health Report <Sparkles size={16} />
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-center gap-2 text-text-muted">
              <ShieldCheck size={12} className="text-primary" />
              <p className="text-[8px] uppercase tracking-widest font-mono">
                Educational purposes only. Not a medical substitute.
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
