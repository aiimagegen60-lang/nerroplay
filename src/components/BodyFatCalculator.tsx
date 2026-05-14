import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Percent, User, ArrowRight, Zap, Target, Activity, 
  Info, Shield, AlertTriangle, ListChecks, History, 
  Flame, Trophy, Share2, Sparkles, Ruler, ChevronRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import NerroSmartRecommendations from './NerroSmartRecommendations';

type BodyType = 'slim' | 'fit' | 'average' | 'heavy';
type Gender = 'male' | 'female';
type Unit = 'metric' | 'us';

interface BodyFatHistory {
  date: string;
  bodyFat: number;
}

const AVATAR_MALE_RANGES = [
  { max: 12, label: 'Lean', color: 'text-blue-400' },
  { max: 18, label: 'Fit', color: 'text-emerald-400' },
  { max: 23, label: 'Normal', color: 'text-yellow-400' },
  { max: 28, label: 'Fat', color: 'text-orange-400' },
  { max: 100, label: 'Obese', color: 'text-red-400' }
];

const AVATAR_FEMALE_RANGES = [
  { max: 18, label: 'Lean', color: 'text-blue-400' },
  { max: 24, label: 'Fit', color: 'text-emerald-400' },
  { max: 30, label: 'Normal', color: 'text-yellow-400' },
  { max: 36, label: 'Fat', color: 'text-orange-400' },
  { max: 100, label: 'Obese', color: 'text-red-400' }
];

export default function BodyFatCalculator() {
  const { language, t } = useLanguage();
  const [mode, setMode] = useState<'smart' | 'advanced'>('smart');
  const [gender, setGender] = useState<Gender>('male');
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [unit, setUnit] = useState<Unit>('metric');
  const [bodyType, setBodyType] = useState<BodyType>('average');
  
  // Advanced measurements (cm)
  const [neck, setNeck] = useState(38);
  const [waist, setWaist] = useState(85);
  const [hip, setHip] = useState(95);
  
  // US units temporary state
  const [ft, setFt] = useState(5);
  const [inch, setInch] = useState(7);

  const [results, setResults] = useState<{
    bodyFat: number;
    category: string;
    idealRange: string;
  } | null>(null);

  const [previewFat, setPreviewFat] = useState(20);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [history, setHistory] = useState<BodyFatHistory[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('nerro_bodyfat_history');
    const savedStreak = localStorage.getItem('nerro_bodyfat_streak');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedStreak) setStreak(parseInt(savedStreak));
  }, []);

  const calculateBodyFat = async () => {
    setIsCalculating(true);
    setAiAnalysis(null);
    setResults(null);
    setError(null);

    const inputData = {
      gender,
      weight,
      height,
      unit,
      mode,
      neck,
      waist,
      hip,
      bodyType,
      ft,
      inch
    };

    try {
      const response = await fetch('/api/tool/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId: 'body-fat-calculator', inputData }),
      });

      if (!response.ok) throw new Error('Failed to calculate on server');

      const data = await response.json();
      
      setResults({
        bodyFat: data.bodyFat,
        category: data.category,
        idealRange: data.idealRange
      });
      setPreviewFat(data.bodyFat);

      // Save to history locally for UI
      const newRecord = { date: new Date().toLocaleDateString(), bodyFat: data.bodyFat };
      const newHistory = [newRecord, ...history].slice(0, 7);
      setHistory(newHistory);
      localStorage.setItem('nerro_bodyfat_history', JSON.stringify(newHistory));
      
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('nerro_bodyfat_streak', newStreak.toString());
    } catch (err) {
      console.error('Failed to execute body fat tool on backend', err);
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
          tool: 'Body Fat Calculator', 
          data: {
            gender,
            weight,
            height,
            bodyFat: results.bodyFat,
            category: results.category
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

  const shareTarget = () => {
    const shareUrl = "https://nerroplay.online?tool=bodyfat-calculator";
    const text = `I just tracked my Body Fat on NerroPlay! Currently ${results?.bodyFat}%. Goal: ${gender === 'male' ? '12%' : '18%'}. Check your body analysis here!`;
    if (navigator.share) {
      navigator.share({ title: 'NerroPlay Transformation', text, url: shareUrl });
    } else {
      navigator.clipboard.writeText(text + " " + shareUrl);
    }
  };

  const getAvatarLabel = (fat: number) => {
    const ranges = gender === 'male' ? AVATAR_MALE_RANGES : AVATAR_FEMALE_RANGES;
    return ranges.find(r => fat <= r.max) || ranges[ranges.length - 1];
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass p-4 rounded-2xl border border-yellow-500/20 flex items-center gap-3">
          <div className="p-2 bg-yellow-500/20 rounded-lg">
            <Flame className="text-orange-500 w-5 h-5" />
          </div>
          <div>
            <p className="text-[0.6rem] text-text-muted uppercase tracking-widest">Streak</p>
            <p className="text-lg font-black text-text-primary">{streak} Day{streak !== 1 ? 's' : ''} 🔥</p>
          </div>
        </div>
        <div className="glass p-4 rounded-2xl border border-orange-500/20 flex items-center gap-3">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <Target className="text-red-500 w-5 h-5" />
          </div>
          <div>
            <p className="text-[0.6rem] text-text-muted uppercase tracking-widest">Target</p>
            <p className="text-lg font-black text-text-primary">{gender === 'male' ? '12%' : '20%'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Phase */}
        <div className="space-y-6">
          <div className="glass p-8 rounded-3xl border border-border-glass relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500" />
            
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                <Percent className="text-orange-400" />
                {t('bodyfat.title')}
              </h2>
              <div className="flex bg-background/50 p-1 rounded-xl border border-border-glass">
                <button 
                  onClick={() => setMode('smart')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'smart' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-text-muted hover:text-text-primary'}`}
                >
                  {t('bodyfat.smart_mode')}
                </button>
                <button 
                  onClick={() => setMode('advanced')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'advanced' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-text-muted hover:text-text-primary'}`}
                >
                  {t('bodyfat.advanced_mode')}
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-4">{t('common.gender')}</label>
                <div className="grid grid-cols-2 gap-4">
                  {(['male', 'female'] as Gender[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`py-3 rounded-xl border flex items-center justify-center gap-2 transition-all font-bold ${gender === g ? 'bg-orange-500/10 border-orange-500 text-orange-400' : 'border-border-glass text-text-muted opacity-50'}`}
                    >
                      <User size={18} /> {t(`common.${g}`)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Height */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-text-secondary">{t('common.height')}</label>
                  <div className="flex bg-background border border-border-glass rounded-lg overflow-hidden">
                    <button onClick={() => setUnit('metric')} className={`px-3 py-1 text-xs ${unit === 'metric' ? 'bg-orange-500 text-white' : 'text-text-secondary'}`}>CM</button>
                    <button onClick={() => setUnit('us')} className={`px-3 py-1 text-xs ${unit === 'us' ? 'bg-orange-500 text-white' : 'text-text-secondary'}`}>FT/IN</button>
                  </div>
                </div>
                {unit === 'metric' ? (
                  <input type="number" value={height} onChange={e => setHeight(parseInt(e.target.value) || 0)} placeholder="e.g. 175" className="w-full bg-background border border-border-glass rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-orange-500 transition-colors" />
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" value={ft} onChange={e => setFt(parseInt(e.target.value) || 0)} placeholder="Ft" className="w-full bg-background border border-border-glass rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-orange-500 transition-colors" />
                    <input type="number" value={inch} onChange={e => setInch(parseInt(e.target.value) || 0)} placeholder="In" className="w-full bg-background border border-border-glass rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-orange-500 transition-colors" />
                  </div>
                )}
              </div>

              {/* Weight */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-text-secondary">{t('common.weight')} (kg)</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" min="30" max="150" step="0.5"
                    value={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value))}
                    className="flex-1 accent-orange-500"
                  />
                  <div className="glass px-4 py-2 rounded-lg w-24 text-center font-bold">{weight} kg</div>
                </div>
              </div>

              {mode === 'smart' ? (
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-3">{t('bodyfat.body_type')}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['slim', 'fit', 'average', 'heavy'] as BodyType[]).map(type => (
                      <button
                        key={type}
                        onClick={() => setBodyType(type)}
                        className={`py-2 px-4 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all ${bodyType === type ? 'bg-orange-500 text-white border-orange-500' : 'border-border-glass text-text-muted'}`}
                      >
                        {t(`bodyfat.${type}`)}
                      </button>
                    ))}
                  </div>
                  <p className="mt-4 text-[10px] text-text-muted italic opacity-60">"Don’t know exact measurements? No problem — use smart mode"</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-500">
                  <div className="space-y-2">
                    <label className="text-[10px] text-text-muted uppercase font-mono tracking-widest">{t('bodyfat.neck')}</label>
                    <input type="number" value={neck} onChange={(e) => setNeck(parseInt(e.target.value))} className="w-full bg-background/50 border border-border-glass rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-text-muted uppercase font-mono tracking-widest">{t('bodyfat.waist')} (cm)</label>
                    <div className="flex gap-2">
                      <input type="number" value={waist} onChange={(e) => setWaist(parseInt(e.target.value))} className="w-full bg-background/50 border border-border-glass rounded-xl px-4 py-3 text-sm" />
                      <select onChange={(e) => setWaist(parseInt(e.target.value))} className="bg-background/50 border border-border-glass rounded-xl px-2 text-sm">
                        <option value="">Size</option>
                        {Array.from({length: 8}, (_, i) => 28 + i * 2).map(size => (
                          <option key={size} value={Math.round(size * 2.54)}>{size}"</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {gender === 'female' && (
                    <div className="space-y-2 col-span-2">
                      <label className="text-[10px] text-text-muted uppercase font-mono tracking-widest">{t('bodyfat.hip')}</label>
                      <input type="number" value={hip} onChange={(e) => setHip(parseInt(e.target.value))} className="w-full bg-background/50 border border-border-glass rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500" />
                    </div>
                  )}
                </div>
              )}

              <button 
                onClick={calculateBodyFat}
                className="w-full py-4 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-orange-600/20 flex items-center justify-center gap-2"
              >
                <Percent size={18} /> {t('common.calculate')}
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Avatar Section */}
        <div className="glass p-8 rounded-3xl border border-border-glass flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden group">
          <div className="absolute inset-0 bg-radial-gradient from-orange-500/5 to-transparent opacity-50" />
          
          <h3 className="text-xl font-black text-text-primary mb-8 relative z-10 flex items-center gap-2">
             <Ruler className="text-orange-400" />
             Character Transformation
          </h3>

          <div className="flex-1 flex items-center justify-center w-full relative">
            {/* Visual Representation of Avatar */}
            <div className="relative w-48 h-80 flex items-center justify-center">
              {/* Outer Glow */}
              <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
                className={`absolute inset-0 rounded-full blur-[40px] ${getAvatarLabel(previewFat).color.replace('text-', 'bg-')}/20`}
              />
              
              {/* Abstract Body Shape (SVG) */}
              <motion.svg 
                viewBox="0 0 100 200" 
                className={`w-full h-full transition-all duration-700 ${getAvatarLabel(previewFat).color}`}
              >
                <motion.path 
                  fill="currentColor"
                  // Adjust weight/waist width based on fat percentage
                  d={`
                    M 50,20 
                    C 60,20 65,35 65,50 
                    L 65,70 
                    C ${55 + previewFat},100 ${55 + previewFat},140 60,180 
                    L 40,180 
                    C ${45 - previewFat},140 ${45 - previewFat},100 35,70 
                    L 35,50 
                    C 35,35 40,20 50,20
                  `}
                  className="drop-shadow-[0_0_10px_currentColor]"
                />
              </motion.svg>
            </div>

            <div className="absolute right-0 top-1/2 -translate-y-1/2 space-y-4">
              <div className="glass p-3 rounded-xl border border-border-glass text-center min-w-[100px]">
                <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">{t('common.status')}</p>
                <p className={`font-black tracking-tighter text-lg ${getAvatarLabel(previewFat).color}`}>{getAvatarLabel(previewFat).label}</p>
              </div>
              <div className="glass p-3 rounded-xl border border-border-glass text-center min-w-[100px]">
                <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Fat %</p>
                <p className="font-black tracking-tighter text-lg text-text-primary">{previewFat.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div className="w-full mt-10 space-y-4 relative z-10">
            <div className="flex justify-between items-center text-[10px] font-mono text-text-muted uppercase tracking-widest">
              <span>{t('bodyfat.current_body')}</span>
              <span>{t('bodyfat.target_body')}</span>
            </div>
            <input 
              type="range" min="5" max="45" step="0.5"
              value={previewFat}
              onChange={(e) => setPreviewFat(parseFloat(e.target.value))}
              className="w-full accent-orange-500 h-1.5 bg-background/50 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-center text-[10px] text-orange-400 font-bold uppercase tracking-widest animate-pulse">
              {t('bodyfat.preview_future')}
            </p>
          </div>
        </div>
      </div>

      {/* Results Phase */}
      <AnimatePresence>
        {results && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Main Result Card */}
            <div className="glass p-10 rounded-3xl border border-border-glass relative overflow-hidden">
               <div className="flex flex-col md:flex-row items-center gap-10">
                 <div className="relative w-40 h-40">
                   {/* Animated Progress Circle */}
                   <svg className="w-full h-full transform -rotate-90">
                     <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-border-glass" />
                     <motion.circle 
                       cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" 
                       strokeDasharray="440"
                       initial={{ strokeDashoffset: 440 }}
                       animate={{ strokeDashoffset: 440 - (results.bodyFat / 50) * 440 }}
                       transition={{ duration: 1.5, ease: "easeOut" }}
                       className="text-orange-500 drop-shadow-[0_0_8px_#f97316]"
                     />
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-4xl font-black text-text-primary leading-none">{results.bodyFat}%</span>
                     <span className="text-[10px] text-text-muted uppercase font-mono mt-1">Fat Mass</span>
                   </div>
                 </div>

                 <div className="flex-1 space-y-4">
                   <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-orange-500/10 border border-orange-500/30 ${getAvatarLabel(results.bodyFat).color}`}>
                     {results.category} {t('bmi.category')}
                   </div>
                   <h3 className="text-3xl font-black text-text-primary tracking-tight">
                     {results.bodyFat < 15 ? 'Elite Athleticism' : results.bodyFat < 25 ? 'Healthy Balance' : 'System Overload'}
                   </h3>
                   <p className="text-text-secondary leading-relaxed max-w-lg">
                     Based on your body composition, your fat storage is in the <span className="text-text-primary font-bold">{results.category}</span> zone. 
                     The ideal range for a {gender} of your profile is <span className="text-orange-400 font-bold">{results.idealRange}</span>.
                   </p>
                   <div className="flex gap-4">
                     {isAiAnalyzing && (
                       <div className="flex items-center gap-2 text-orange-500 font-mono text-[10px] animate-pulse">
                         <Activity size={12} className="animate-spin" /> ANALYZING DEEP DATA...
                       </div>
                     )}
                     <button onClick={shareTarget} className="p-2.5 glass rounded-xl text-text-primary border border-border-glass hover:bg-surface transition-all">
                       <Share2 size={16} />
                     </button>
                   </div>
                 </div>
               </div>
            </div>

            {/* Detailed Insights */}
            <div className="glass p-8 rounded-3xl border border-border-glass relative overflow-hidden">
              <div className="flex items-center gap-4 mb-10 pb-6 border-b border-border-glass">
                <div className="p-3 bg-orange-500/10 rounded-xl">
                  <Activity className="text-orange-500" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-text-primary uppercase tracking-tighter">Deep Intelligence Engine</h3>
                  <div className="flex gap-4 mt-1">
                    <div className="flex items-center gap-1 text-[10px] text-text-muted uppercase font-mono tracking-widest">
                       <Shield size={10} className="text-emerald-500" /> Metabolic Protection: Active
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-text-muted uppercase font-mono tracking-widest">
                       <Sparkles size={10} className="text-blue-500" /> Hormone Balance: {results.bodyFat < 10 || results.bodyFat > 35 ? 'Compromised' : 'Optimal'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div>
                    <h4 className="font-bold text-text-primary flex items-center gap-2 mb-3 text-sm uppercase tracking-widest">
                      <Zap className="w-4 h-4 text-orange-500" /> {t('bodyfat.fat_loss_plan')}
                    </h4>
                    <p className="text-xs text-text-secondary leading-relaxed mb-4">
                      Focus on a 300-500kcal deficit. Integrate LISS cardio for consistent lipid oxidation and prioritize fiber intake.
                    </p>
                    <ul className="space-y-2">
                       {['Morning Fasted Walk', 'Zero Sugar Policy', '10k Steps Minimum'].map(t => (
                         <li key={t} className="flex items-center gap-2 text-[11px] text-text-muted">
                           <ChevronRight size={10} className="text-orange-500" /> {t}
                         </li>
                       ))}
                    </ul>
                  </div>

                  <div>
                     <h4 className="font-bold text-text-primary flex items-center gap-2 mb-3 text-sm uppercase tracking-widest">
                       <Target className="w-4 h-4 text-blue-500" /> {t('bodyfat.muscle_def')}
                     </h4>
                     <p className="text-xs text-text-secondary leading-relaxed mb-4">
                       To reveal muscle definition, resistance training must be paired with high protein (1.8g - 2.2g per kg of body weight).
                     </p>
                     <ul className="space-y-2">
                        {['Compund Lifts (Heavy)', 'Isometric Holds', 'Refeed Days Optimization'].map(t => (
                          <li key={t} className="flex items-center gap-2 text-[11px] text-text-muted">
                            <ChevronRight size={10} className="text-blue-500" /> {t}
                          </li>
                        ))}
                     </ul>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="glass p-6 rounded-2xl bg-red-500/5 border border-red-500/10">
                    <h4 className="font-bold text-red-400 flex items-center gap-2 mb-3 text-sm uppercase tracking-widest">
                      <AlertTriangle className="w-4 h-4" /> {t('bmr.risks')}
                    </h4>
                    <p className="text-[11px] text-text-muted leading-relaxed italic">
                      {results.bodyFat > 28 ? 'Higher fat levels increase visceral fat, leading to insulin resistance and cardiovascular strain.' : 'Excessively low fat levels can crash testosterone and disrupt the endocrine system.'}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-text-primary flex items-center gap-2 mb-3 text-sm uppercase tracking-widest">
                      <Shield className="w-4 h-4 text-emerald-500" /> {t('bodyfat.ideal_range')}
                    </h4>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-black text-text-primary leading-none">{results.idealRange}</span>
                      <span className="text-[10px] text-text-muted uppercase pb-1 tracking-widest">Scientific Goal</span>
                    </div>
                    <div className="mt-4 h-2 w-full bg-background rounded-full overflow-hidden flex">
                      <div className="h-full bg-blue-500/30" style={{ width: '20%' }} />
                      <div className="h-full bg-emerald-500" style={{ width: gender === 'male' ? '12%' : '18%' }} />
                      <div className="h-full bg-yellow-500/30" style={{ width: '30%' }} />
                      <div className="h-full bg-red-500/30" style={{ width: '38%' }} />
                    </div>
                  </div>

                  <div className="p-4 bg-orange-500/5 rounded-2xl border border-orange-500/10 flex items-center gap-4">
                    <div className="p-2 bg-orange-500/20 rounded-full">
                      <Flame className="w-4 h-4 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-[0.6rem] text-text-secondary font-bold uppercase tracking-widest">{t('bodyfat.habit_trigger')}</p>
                      <p className="text-[10px] text-text-primary font-medium italic">"Body fat control karo = real transformation start"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
