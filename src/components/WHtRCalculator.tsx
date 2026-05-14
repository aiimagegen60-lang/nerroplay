import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Percent, Ruler, Scale, Zap, Info, ShieldAlert, CheckCircle2, ChevronRight, Activity, Heart, Apple } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import AIDeepAnalysis from './AIDeepAnalysis';

type Unit = 'metric' | 'us';
type Gender = 'male' | 'female';

interface WHtRAnalysisData {
  risk_summary: string;
  comparison: string;
  top_risks: string[];
  action_plan: {
    category: string;
    title: string;
    detail: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  goal: {
    target_waist_cm: number;
    reduction_needed_cm: number;
    realistic_monthly_loss_cm: number;
    message: string;
  };
  disclaimer: string;
}

export default function WHtRCalculator() {
  const { t } = useLanguage();
  const [unit, setUnit] = useState<Unit>('us');
  const [gender, setGender] = useState<Gender>('male');
  const [heightCm, setHeightCm] = useState('170');
  const [feet, setFeet] = useState('5');
  const [inches, setInches] = useState('7');
  const [waist, setWaist] = useState('80');
  const [weight, setWeight] = useState('70');

  const [result, setResult] = useState<{ratio: number, status: string, risk_category: string} | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateWHtR = async () => {
    if (!waist || (unit === 'metric' && !heightCm) || (unit === 'us' && (!feet || !inches))) return;

    setIsCalculating(true);
    setResult(null);
    setError(null);

    const inputData = { 
      waist, 
      gender,
      height: unit === 'metric' ? heightCm : undefined,
      hft: unit === 'us' ? feet : undefined,
      hin: unit === 'us' ? inches : undefined,
      weight,
      unit 
    };

    try {
      const response = await fetch('/api/tool/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId: 'whtr-calculator', inputData, skipAnalysis: true }),
      });

      if (!response.ok) throw new Error('Failed to calculate on server');

      const data = await response.json();
      setResult({ 
        ratio: data.ratio, 
        status: data.status, 
        risk_category: data.category || 'healthy'
      });
    } catch (err) {
      console.error('Failed to execute whtr tool on backend', err);
      setError("Processing failed. Please check your inputs.");
    } finally {
      setIsCalculating(false);
    }
  };

  const handleDeepAnalysis = async () => {
    if (!result) throw new Error('Calculate WHtR first');
    
    // Total height in CM for AI
    let finalHeightCm = Number(heightCm);
    if (unit === 'us') {
      finalHeightCm = (Number(feet) * 30.48) + (Number(inches) * 2.54);
    }

    const payload = {
      tool: 'WHtR',
      data: {
        gender,
        height_cm: finalHeightCm,
        waist_cm: Number(waist),
        weight_kg: weight ? Number(weight) : null,
        whtr: result.ratio,
        risk_category: result.risk_category
      }
    };

    const response = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('AI Synthesis failed');
    const data = await response.json();
    return data.analysis;
  };

  const renderAnalysis = (data: WHtRAnalysisData) => (
    <div className="space-y-10 py-4">
      {/* Risk Summary Card */}
      <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 p-8 rounded-[2.5rem] border border-blue-500/20 relative overflow-hidden">
        <Activity className="absolute -bottom-4 -right-4 w-32 h-32 text-blue-500/5 rotate-12" />
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/20 rounded-full text-blue-500 text-xs font-bold uppercase tracking-widest">
            Diagnostic Summary
          </div>
          <p className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight">
            {typeof data.risk_summary === 'string' ? data.risk_summary : 'Analysis summary unavailable'}
          </p>
          <div className="p-4 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-blue-500/10 text-sm font-medium text-slate-600 dark:text-slate-400">
            {typeof data.comparison === 'string' ? data.comparison : 
             (typeof data.comparison === 'object' && data.comparison !== null) ? 
             JSON.stringify(data.comparison) : 'Comparison data unavailable'}
          </div>
        </div>
      </div>

      {/* Top Risks & Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-50/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-8 rounded-[2.5rem] space-y-6 shadow-sm">
          <h4 className="text-[0.6rem] font-black uppercase tracking-[0.2em] flex items-center gap-2 text-slate-400 dark:text-slate-500">
            <ShieldAlert size={14} className="text-red-500" />
            Elevated Risks
          </h4>
          <div className="space-y-3">
            {data.top_risks.map((risk, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {typeof risk === 'string' ? risk : JSON.stringify(risk)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-50/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-8 rounded-[2.5rem] space-y-6 shadow-sm">
          <h4 className="text-[0.6rem] font-black uppercase tracking-[0.2em] flex items-center gap-2 text-slate-400 dark:text-slate-500">
            <Zap size={14} className="text-amber-500" />
            3-Month Target
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 text-center shadow-sm">
              <p className="text-[0.6rem] uppercase tracking-widest text-slate-400 font-mono mb-1">Target Waist</p>
              <p className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">{data.goal.target_waist_cm}cm</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 text-center shadow-sm">
              <p className="text-[0.6rem] uppercase tracking-widest text-slate-400 font-mono mb-1">Total Loss</p>
              <p className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">{data.goal.reduction_needed_cm}cm</p>
            </div>
          </div>
          <p className="text-[0.65rem] italic text-slate-500 dark:text-slate-400 font-bold text-center uppercase tracking-tight">
            {typeof data.goal.message === 'string' ? data.goal.message : 'Steady progress leads to lasting results.'}
          </p>
        </div>
      </div>

      {/* Action Plan */}
      <div className="space-y-6">
        <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-slate-500 dark:text-slate-400 px-2">
          Optimization Protocol
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.action_plan.map((action, i) => (
            <div key={i} className="group p-6 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl hover:border-blue-500/50 transition-all shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                  <span className="text-[0.6rem] font-mono font-black uppercase text-blue-500 dark:text-blue-400 tracking-[0.2em] mb-1">
                    {typeof action.category === 'string' ? action.category : 'Plan'}
                  </span>
                  <h5 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                    {typeof action.title === 'string' ? action.title : 'Action Item'}
                  </h5>
                </div>
                {action.priority === 'high' && (
                  <span className="px-2 py-0.5 bg-red-500/10 text-red-500 dark:text-red-400 text-[0.55rem] font-black uppercase rounded-full tracking-widest border border-red-500/20">Urgent</span>
                )}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed tracking-tight">
                {typeof action.detail === 'string' ? action.detail : JSON.stringify(action.detail)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-[0.65rem] text-slate-400 dark:text-slate-600 italic leading-relaxed text-center font-mono">
        {typeof data.disclaimer === 'string' ? data.disclaimer : 'Consult with a healthcare provider for medical advice.'}
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl space-y-12 pb-24">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-500/10 rounded-full text-blue-500 font-mono text-[0.65rem] uppercase tracking-[0.3em] font-black">
          <Zap size={14} className="animate-pulse" />
          Physiological Intelligence
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white italic">
          WAIST-TO-HEIGHT <span className="text-blue-600 uppercase tracking-[.1em] not-italic text-3xl">RATIO</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto text-sm md:text-base leading-relaxed">
          Unlock a precise biometric analysis of heart risk and central adiposity using elite anthropometric modeling.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings Panel */}
        <div className="lg:col-span-12">
          <div className="bg-white dark:bg-slate-950 p-8 md:p-12 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 shadow-xl space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Biological Metadata */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[0.65rem] font-mono font-black text-slate-400 uppercase tracking-widest px-2">Biological Profile</label>
                  <div className="flex p-2 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                    {(['male', 'female'] as Gender[]).map(g => (
                      <button 
                        key={g} 
                        onClick={() => setGender(g)} 
                        className={`flex-1 py-4 rounded-3xl font-black uppercase text-xs tracking-widest transition-all ${gender === g ? 'bg-white dark:bg-slate-800 shadow-xl text-blue-600 scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end px-2">
                    <label className="text-[0.65rem] font-mono font-black text-slate-400 uppercase tracking-widest">Stature Matrix</label>
                    <div className="flex gap-2">
                       {['metric', 'us'].map((u) => (
                         <button key={u} onClick={() => setUnit(u as Unit)} className={`text-[0.55rem] font-black uppercase tracking-widest hover:text-blue-500 transition-all ${unit === u ? 'text-blue-600 underline underline-offset-4' : 'text-slate-400'}`}>
                           {u}
                         </button>
                       ))}
                    </div>
                  </div>
                  {unit === 'metric' ? (
                    <div className="relative group">
                      <Ruler className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={24} />
                      <input 
                        type="number" 
                        value={heightCm} 
                        onChange={e => setHeightCm(e.target.value)} 
                        placeholder="Height (CM)" 
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] pl-16 pr-8 py-6 text-xl font-black text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 focus:outline-none focus:border-blue-500 transition-all" 
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative group">
                        <input type="number" value={feet} onChange={e => setFeet(e.target.value)} placeholder="FT" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] px-8 py-6 text-xl font-black text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all" />
                      </div>
                      <div className="relative group">
                        <input type="number" value={inches} onChange={e => setInches(e.target.value)} placeholder="IN" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] px-8 py-6 text-xl font-black text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Anthropometric Data */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[0.65rem] font-mono font-black text-slate-400 uppercase tracking-widest px-2">Abdominal Girth (CM)</label>
                  <div className="relative group">
                    <Ruler className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={24} />
                    <input 
                      type="number" 
                      value={waist} 
                      onChange={e => setWaist(e.target.value)} 
                      placeholder="Waist Circumference" 
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] pl-16 pr-8 py-6 text-xl font-black text-slate-900 dark:text-white placeholder:text-slate-300 focus:outline-none focus:border-blue-500 transition-all" 
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[0.65rem] font-mono font-black text-slate-400 uppercase tracking-widest px-2">Gravitational Mass (KG)</label>
                  <div className="relative group">
                    <Scale className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={24} />
                    <input 
                      type="number" 
                      value={weight} 
                      onChange={e => setWeight(e.target.value)} 
                      placeholder="Optional Weight" 
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] pl-16 pr-8 py-6 text-xl font-black text-slate-900 dark:text-white placeholder:text-slate-300 focus:outline-none focus:border-blue-500 transition-all" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={calculateWHtR} 
              className="w-full py-8 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-[2.5rem] shadow-2xl shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 uppercase tracking-[0.3em] text-xs disabled:opacity-50" 
              disabled={isCalculating}
            >
              {isCalculating ? 'Processing Biological Data...' : (
                <>
                  <Zap size={20} className="text-amber-300 group-hover:animate-pulse" />
                  Execute System Analysis
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="space-y-12"
          >
            {/* Primary Results Display */}
            <div className="relative p-12 bg-white dark:bg-white/5 rounded-[4rem] border border-slate-200 dark:border-white/10 shadow-2xl dark:shadow-none text-center overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-blue-600 to-purple-600" />
               <div className="space-y-6">
                  <h3 className="text-[0.65rem] font-mono font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.5em]">Ratio Coefficient</h3>
                  <div className="text-[8rem] md:text-[10rem] font-black italic tracking-tighter leading-none text-slate-900 dark:text-white drop-shadow-2xl">
                    {result.ratio}
                  </div>
                  <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 mt-8">
                     <div className="flex items-center gap-3">
                        <CheckCircle2 className="text-green-500" size={24} />
                        <span className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white italic">{result.status}</span>
                     </div>
                     <div className="h-px md:h-12 w-12 md:w-px bg-slate-200 dark:bg-white/10" />
                     <div className="flex items-center gap-3">
                        <Heart className="text-red-500" size={24} />
                        <span className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white italic">Risk: {result.risk_category.replace('_', ' ')}</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* AI Layer */}
            <AIDeepAnalysis 
              toolName="WHtR Intelligence" 
              onAnalyze={handleDeepAnalysis}
              renderAnalysis={renderAnalysis}
            />

            {/* Info Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 opacity-75 grayscale hover:grayscale-0 transition-all">
              <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                  <Apple size={24} />
                </div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white italic">Understanding WHtR</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed uppercase tracking-tight">
                  Unlike BMI, WHtR accounts for abdominal body fat distribution. It is a powerful predictor of cardiometabolic health outcomes across all ages.
                </p>
              </div>
              <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500">
                  <Activity size={24} />
                </div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white italic">Healthy Thresholds</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed uppercase tracking-tight">
                  A healthy ratio for most people is below 0.5. Staying within this zone significantly lowers the risk of chronic physiological dysfunctions.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="p-6 bg-red-50/50 dark:bg-red-500/5 border border-red-200 dark:border-red-900/20 rounded-3xl text-red-500 text-sm font-black text-center uppercase tracking-widest">
          {error}
        </div>
      )}
    </div>
  );
}
