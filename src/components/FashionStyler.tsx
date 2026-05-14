import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { 
   Camera, 
   Upload, 
   Sparkles, 
   Trash2, 
   Zap, 
   Palette, 
   ShoppingBag, 
   Star, 
   Share2, 
   CheckCircle2, 
   ChevronRight,
   Layout,
   Crown,
   Info,
   Droplets,
   Heart,
   AlertCircle
} from 'lucide-react';
import AIDeepAnalysis from './AIDeepAnalysis';

interface FashionResult {
   score: number;
   glowUp: number;
   faceShape: string;
   skinTone: string;
   nails: {
      colors: string[];
      designs: string[];
   };
   makeup: {
      lipstick: string[];
      foundation: string;
      eye: string[];
   };
   outfit: {
      colors: string[];
      innerWear: string[];
      outdoor: string[];
      occasionWear: string[];
   };
   colorMatch: {
      best: string[];
      avoid: string[];
   };
   brands: {
      nail: string[];
      lipstick: string[];
      fashion: string[];
   };
}

const OCCASIONS = ['Casual', 'Party', 'Wedding', 'Beach', 'Office'];
const STYLE_MODES = ['Minimal', 'Glam', 'Trendy'];

export default function FashionStyler() {
   const [image, setImage] = useState<string | null>(null);
   const [occasion, setOccasion] = useState('Party');
   const [styleMode, setStyleMode] = useState('Glam');
   const [isAnalyzing, setIsAnalyzing] = useState(false);
   const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
   const [result, setResult] = useState<FashionResult | null>(null);
   const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
   const [error, setError] = useState<string | null>(null);
   const fileInputRef = useRef<HTMLInputElement>(null);

   const handleDeepAnalysis = async () => {
    if (!result) return "";
    const response = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tool: 'Fashion AI Styler',
        data: {
          score: result.score,
          glowUp: result.glowUp,
          faceShape: result.faceShape,
          skinTone: result.skinTone,
          occasion: occasion,
          styleMode: styleMode,
          colorMatch: result.colorMatch
        }
      })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data.analysis;
  };

   const compressImage = async (file: File): Promise<string> => {
      return new Promise((resolve) => {
         const reader = new FileReader();
         reader.readAsDataURL(file);
         reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
               const canvas = document.createElement('canvas');
               const MAX_WIDTH = 1000;
               const MAX_HEIGHT = 1000;
               let width = img.width;
               let height = img.height;

               if (width > height) {
                  if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
               } else {
                  if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
               }
               canvas.width = width;
               canvas.height = height;
               const ctx = canvas.getContext('2d');
               ctx?.drawImage(img, 0, 0, width, height);
               resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
         };
      });
   };

   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
         const fileExt = file.name.split('.').pop()?.toLowerCase();
         if (!validTypes.includes(file.type) && !['jpg', 'jpeg', 'png'].includes(fileExt || '')) {
            setError('Sahi image format use karo (JPG, PNG, JPEG)! Fashion analysis ke liye clear photo chahiye.');
            return;
         }
         const compressed = await compressImage(file);
         setImage(compressed);
         setResult(null);
         setError(null);
      }
   };

   const getAIAnalysis = async () => {
      if (!result) return;
      setIsAiAnalyzing(true);
      setError(null);
      try {
         const response = await fetch('/api/ai/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               tool: 'AI Fashion Styler',
               data: {
                  score: result.score,
                  glowUp: result.glowUp,
                  faceShape: result.faceShape,
                  skinTone: result.skinTone,
                  occasion: occasion,
                  styleMode: styleMode
               }
            })
         });
         const data = await response.json();
         if (data.error) throw new Error(data.error);
         setAiAnalysis(data.analysis);
      } catch (err: any) {
         setError(err.message || 'AI Analysis failed');
      } finally {
         setIsAiAnalyzing(false);
      }
   };

   const analyzeFashion = async () => {
      if (!image) return;
      setIsAnalyzing(true);
      setError(null);
      
      try {
         const response = await fetch('/api/fashion_styler', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image, occasion, styleMode })
         });
         
         const data = await response.json();
         if (!response.ok) {
            throw new Error(data.message || data.error || 'Neural link unstable.');
         }
         setResult(data);
      } catch (err: any) {
         setError(err.message || "Failed to sync with Stylist AI.");
      } finally {
         setIsAnalyzing(false);
      }
   };

   const shareResult = () => {
      if (!result) return;
      const shareUrl = "https://nerroplay.online?tool=fashion-styler";
      const text = `I just got styled by NerroPlay AI! Score: ${result.score}, Potential: ${result.glowUp}%. My outfit for the next ${occasion} is sorted!`;
      if (navigator.share) {
         navigator.share({ title: 'AI Fashion Styler', text, url: shareUrl }).catch(console.error);
      } else {
         navigator.clipboard.writeText(text + " " + shareUrl);
      }
   };

   return (
      <div className="min-h-screen bg-background text-text-primary px-0 md:px-4 py-4 md:py-8 relative overflow-hidden font-sans selection:bg-accent/20">
         
         {/* Minimal Monochrome Background */}
         <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-accent/5 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_var(--bg-color)_100%)] opacity-60" />
         </div>

         <div className="max-w-6xl mx-auto space-y-8 md:space-y-12 relative z-10">
            
            {/* Header */}
            <header className="text-center space-y-6 mb-12 md:mb-20 px-4">
               <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border-glass text-text-secondary text-[0.7rem] md:text-[0.6rem] font-mono tracking-widest uppercase font-bold"
               >
                  <Crown size={14} /> Elite Style Engineering
               </motion.div>
               <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] md:leading-[0.8] mb-4">
                  Fashion <br className="hidden md:block" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-text-primary via-text-secondary to-text-muted">Intelli.</span>
               </h1>
               <p className="text-text-muted text-base md:text-sm font-mono uppercase tracking-[0.2em] md:tracking-[0.3em] max-w-2xl mx-auto leading-relaxed">
                  Hyper-personalized luxury styling powered by deep neural vision.
               </p>
            </header>

            {/* Input Section */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               <div className="lg:col-span-12">
                  <div className="glass p-1 rounded-[2.5rem] overflow-hidden">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border-glass">
                        {/* Image Box */}
                        <div className="p-4 md:p-8 flex flex-col items-center justify-center min-h-[300px] bg-surface/30">
                           {!image ? (
                              <div 
                                 onClick={() => fileInputRef.current?.click()}
                                 className="w-full h-full flex flex-col items-center justify-center text-center cursor-pointer group/upload"
                              >
                                 <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                                 <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center group-hover/upload:bg-surface transitions-all mb-4">
                                    <Camera size={32} className="text-text-muted group-hover:text-text-primary" />
                                 </div>
                                 <p className="text-[0.6rem] font-mono text-text-muted uppercase tracking-widest">Tap to Upload Photo</p>
                              </div>
                           ) : (
                              <div className="relative w-full h-full rounded-2xl overflow-hidden group/img">
                                 <img src={image} alt="Input" className="w-full h-64 object-cover" />
                                 <button 
                                    onClick={() => { setImage(null); setResult(null); setError(null); }}
                                    className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center gap-2 opacity-0 group-hover/img:opacity-100 transition-all text-xs font-black uppercase text-red-600"
                                 >
                                    <Trash2 size={20} /> Clear Sample
                                 </button>
                              </div>
                           )}
                        </div>


                        <div className="p-4 md:p-8 space-y-4">
                           <label className="text-[0.75rem] md:text-[0.6rem] font-mono text-text-muted uppercase tracking-widest flex items-center gap-2 mb-2">
                              <Star size={14} className="text-text-primary" /> Occasion
                           </label>
                           <div className="grid grid-cols-2 gap-3">
                              {OCCASIONS.map((occ, i) => (
                                 <button 
                                    key={`occ-${occ}-${i}`}
                                    onClick={() => setOccasion(occ)}
                                    className={`py-4 px-3 rounded-xl border text-[0.75rem] md:text-[0.65rem] font-bold uppercase transition-all min-h-[48px] md:min-h-[44px] flex items-center justify-center ${
                                       occasion === occ 
                                       ? 'bg-text-primary text-background font-black shadow-lg shadow-accent/10' 
                                       : 'bg-surface border-border-glass text-text-secondary hover:border-accent'
                                    }`}
                                 >
                                    {occ}
                                 </button>
                              ))}
                           </div>
                        </div>

                        {/* Selector 2 */}
                        <div className="p-4 md:p-8 space-y-4">
                           <label className="text-[0.75rem] md:text-[0.6rem] font-mono text-text-muted uppercase tracking-widest flex items-center gap-2 mb-2">
                              <Layout size={14} className="text-text-primary" /> Style Mode
                           </label>
                           <div className="space-y-3">
                              {STYLE_MODES.map((mode, i) => (
                                 <button 
                                    key={`mode-${mode}-${i}`}
                                    onClick={() => setStyleMode(mode)}
                                    className={`w-full py-5 px-4 rounded-xl border text-[0.75rem] md:text-[0.65rem] font-bold uppercase flex items-center justify-between transition-all min-h-[48px] md:min-h-[44px] ${
                                       styleMode === mode 
                                       ? 'bg-text-primary text-background font-black shadow-lg shadow-accent/10' 
                                       : 'bg-surface border-border-glass text-text-secondary hover:border-accent'
                                    }`}
                                 >
                                    {mode} {styleMode === mode && <CheckCircle2 size={12} />}
                                 </button>
                              ))}
                           </div>
                        </div>

                        {/* Execute */}
                        <div className="p-4 md:p-8 flex items-center justify-center">
                           <button 
                              disabled={!image || isAnalyzing}
                              onClick={analyzeFashion}
                              className="w-full h-full py-8 bg-text-primary text-background font-black rounded-3xl flex flex-col items-center justify-center gap-4 hover:scale-[1.02] transition-all disabled:opacity-50 group active:scale-95 shadow-2xl"
                           >
                              {isAnalyzing ? (
                                 <div className="w-10 h-10 border-4 border-text-secondary border-t-transparent rounded-full animate-spin" />
                              ) : (
                                 <>
                                    <Zap size={32} fill="currentColor" className="group-hover:animate-pulse" />
                                    <span className="text-xs uppercase tracking-widest">Analyze Style</span>
                                 </>
                              )}
                           </button>
                        </div>
                     </div>
                  </div>
                  {error && (
                     <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
                        <AlertCircle size={18} className="text-red-500" />
                        <p className="text-xs font-mono text-red-500 uppercase">{error}</p>
                     </div>
                  )}
               </div>
            </section>

            {/* 📊 Analysis Output */}
            <AnimatePresence>
               {result && (
                  <motion.div 
                     initial="hidden"
                     animate="visible"
                     variants={{
                        hidden: { opacity: 0 },
                        visible: {
                           opacity: 1,
                           transition: { staggerChildren: 0.1 }
                        }
                     }}
                     className="space-y-8 md:space-y-12"
                  >
                     {/* Hero Scores */}
                     <motion.div 
                        variants={{
                           hidden: { opacity: 0, y: 20 },
                           visible: { opacity: 1, y: 0 }
                        }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                     >
                        <motion.div 
                           whileHover={{ y: -5 }}
                           className="glass p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] relative overflow-hidden group"
                        >
                           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                              <Crown size={120} className="text-text-primary" />
                           </div>
                           <span className="text-[0.75rem] md:text-[0.65rem] font-mono text-text-muted uppercase tracking-[0.2em] md:tracking-[0.4em] font-bold">Style Quotient</span>
                           <div className="flex items-baseline gap-4 mt-6 md:mt-4">
                              <span className="text-7xl md:text-8xl font-black tracking-tighter text-text-primary">{result.score}</span>
                              <span className="text-xl font-mono text-text-muted">/ 100</span>
                           </div>
                           <p className="text-xs md:text-[0.6rem] text-text-secondary font-mono mt-6 md:mt-4 uppercase tracking-widest leading-relaxed">Excellent alignment for {occasion} vibes.</p>
                        </motion.div>

                        <motion.div 
                           whileHover={{ y: -5 }}
                           className="glass p-5 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] relative overflow-hidden group"
                        >
                           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                              <Sparkles size={120} className="text-text-primary" />
                           </div>
                           <span className="text-[0.65rem] font-mono text-text-muted uppercase tracking-[0.4em] font-bold">Optimization Gain</span>
                           <div className="flex items-baseline gap-4 mt-4">
                              <span className="text-6xl md:text-8xl font-black tracking-tighter text-text-primary">{result.glowUp}%</span>
                           </div>
                           <p className="text-[0.6rem] text-text-secondary font-mono mt-4 uppercase tracking-widest leading-relaxed">High potential for visual elevation detected.</p>
                        </motion.div>
                     </motion.div>

                     {/* 💅 Nails & Makeup */}
                     <motion.div 
                        variants={{
                           hidden: { opacity: 0, scale: 0.95 },
                           visible: { opacity: 1, scale: 1 }
                        }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                     >
                        {/* Nails */}
                        <div className="glass p-5 md:p-10 rounded-[3rem] border border-border-glass space-y-8 shadow-xl transition-all">
                           <div className="flex items-center justify-between">
                              <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3 text-text-primary">
                                 <Droplets size={24} className="text-text-muted" /> Nail Artistry
                              </h3>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-4">
                                 <span className="text-[0.55rem] font-mono text-text-muted uppercase tracking-widest">Neural Palette</span>
                                 <div className="flex gap-2">
                                    {result.nails.colors.map(color => (
                                       <div key={color} className="group relative">
                                          <div className="w-10 h-10 rounded-full border border-border-glass" style={{ backgroundColor: color }} />
                                          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[0.45rem] font-mono opacity-0 group-hover:opacity-100 transition-opacity bg-background text-text-primary px-1 rounded uppercase shadow-sm border border-border-glass z-20">{color}</span>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                              <div className="space-y-4">
                                 <span className="text-[0.55rem] font-mono text-text-muted uppercase tracking-widest">Recommended Designs</span>
                                 <ul className="space-y-2">
                                    {result.nails.designs.map(d => (
                                       <li key={d} className="text-[0.65rem] font-mono text-text-secondary uppercase flex items-center gap-2">
                                          <div className="w-1 h-1 bg-accent/20 rounded-full" /> {d}
                                       </li>
                                    ))}
                                 </ul>
                              </div>
                           </div>
                        </div>

                        {/* Makeup */}
                        <div className="glass p-5 md:p-10 rounded-[3rem] border border-border-glass space-y-8 shadow-xl transition-all">
                           <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3 text-text-primary">
                              <Sparkles size={24} className="text-text-muted" /> Face Calibration
                           </h3>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-4">
                                 <span className="text-[0.55rem] font-mono text-text-muted uppercase tracking-widest">Lipstick Shades</span>
                                 <div className="flex flex-wrap gap-2">
                                    {result.makeup.lipstick.map(shade => (
                                       <span key={shade} className="px-3 py-1 bg-surface border border-border-glass rounded-lg text-[0.6rem] font-mono text-text-secondary uppercase">{shade}</span>
                                    ))}
                                 </div>
                              </div>
                              <div className="space-y-2">
                                 <span className="text-[0.55rem] font-mono text-text-muted uppercase tracking-widest block">Neural Base</span>
                                 <div className="p-3 bg-surface rounded-xl border border-border-glass text-xs text-text-primary font-bold uppercase">{result.makeup.foundation}</div>
                              </div>
                           </div>
                        </div>
                     </motion.div>

                     {/* Outfit Engine */}
                     <motion.div 
                        variants={{
                           hidden: { opacity: 0, scale: 0.95 },
                           visible: { opacity: 1, scale: 1 }
                        }}
                        className="glass bg-white dark:bg-black p-5 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border border-slate-200 dark:border-white/10 relative overflow-hidden"
                     >
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/[0.02] dark:from-white/[0.02] to-transparent opacity-50" />
                        <div className="relative z-10 space-y-12">
                           <div className="text-center">
                              <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2 text-slate-900 dark:text-white">Curated Outfit System</h3>
                              <p className="text-[0.6rem] font-mono text-slate-500 uppercase tracking-[0.5em]">The Elite Setup for {occasion}</p>
                           </div>

                           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
                              <OutfitComp label="Core Setup" items={result.outfit.occasionWear} />
                              <OutfitComp label="Layering" items={result.outfit.outdoor} />
                              <OutfitComp label="Underlays" items={result.outfit.innerWear} />
                              <OutfitComp label="Color Echo" items={result.outfit.colors} isColors />
                           </div>

                           <div className="pt-12 border-t border-slate-200 dark:border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                              <div className="space-y-6">
                                 <h4 className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-2">
                                    <CheckCircle2 size={14} /> Peak Performance Colors
                                 </h4>
                                 <div className="grid grid-cols-2 gap-4">
                                    {result.colorMatch.best.map(c => (
                                       <div key={c} className="p-4 bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/20 rounded-2xl text-xs font-bold text-center uppercase tracking-widest text-slate-700 dark:text-slate-200">{c}</div>
                                    ))}
                                 </div>
                              </div>
                              <div className="space-y-6">
                                 <h4 className="text-xs font-mono font-bold text-red-600 dark:text-red-500 uppercase flex items-center gap-2">
                                    <AlertCircle size={14} /> Neural Conflict Zones
                                 </h4>
                                 <div className="grid grid-cols-2 gap-4">
                                    {result.colorMatch.avoid.map(c => (
                                       <div key={c} className="p-4 bg-red-500/5 dark:bg-red-900/20 border border-red-500/10 dark:border-red-900/30 rounded-2xl text-xs font-bold text-center uppercase tracking-widest italic text-red-600 dark:text-red-400">{c}</div>
                                    ))}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </motion.div>

                     {/* Brands & Best Look */}
                     <motion.div 
                        variants={{
                           hidden: { opacity: 0, y: 30 },
                           visible: { opacity: 1, y: 0 }
                        }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                     >
                        <div className="lg:col-span-12">
                           <AIDeepAnalysis 
                             onAnalyze={handleDeepAnalysis} 
                             toolName="Fashion AI Styler" 
                           />
                        </div>
                        <div className="lg:col-span-8 glass bg-white dark:bg-black p-6 md:p-10 rounded-[3rem] border border-slate-200 dark:border-white/5 space-y-8 shadow-xl dark:shadow-none transition-all">
                           <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">Luxury Ecosystem</h3>
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <BrandList title="Apparel" brands={result.brands.fashion} />
                              <BrandList title="Cosmetics" brands={result.brands.lipstick} />
                              <BrandList title="Details" brands={result.brands.nail} />
                           </div>
                        </div>

                        <div className="lg:col-span-4 space-y-6">
                           <div className="glass bg-white dark:bg-black p-5 md:p-8 rounded-[3rem] border border-cyan-500/20 bg-cyan-700/5 dark:bg-cyan-700/10 flex flex-col items-center justify-center text-center shadow-xl dark:shadow-none transition-all">
                              <Heart size={40} className="text-cyan-500 mb-6 animate-pulse" />
                              <h3 className="text-xl font-black uppercase tracking-tighter mb-4 text-slate-900 dark:text-white">Neural Best Match</h3>
                              <button 
                                 onClick={shareResult}
                                 className="w-full py-4 bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950 font-black rounded-2xl flex items-center justify-center gap-2 uppercase text-xs tracking-tighter hover:scale-105 active:scale-95 transition-all shadow-lg dark:shadow-cyan-500/20"
                              >
                                 <Share2 size={18} /> Broadcast Style
                              </button>
                           </div>

                           <div className="glass bg-white dark:bg-black p-6 rounded-3xl border border-slate-200 dark:border-white/5 shadow-md dark:shadow-none transition-all">
                              <div className="flex items-center justify-between mb-4">
                                 <span className="text-[0.6rem] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">Face Intelligence</span>
                                 <span className="text-[0.6rem] font-mono text-cyan-600 dark:text-cyan-400 capitalize font-bold">{result.faceShape}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                 <span className="text-[0.6rem] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">Skin Tone</span>
                                 <span className="text-[0.6rem] font-mono text-slate-900 dark:text-slate-200 capitalize font-bold">{result.skinTone}</span>
                              </div>
                           </div>
                        </div>
                     </motion.div>

                     <div className="text-center pt-8">
                        <button 
                           onClick={() => { setResult(null); setImage(null); }}
                           className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[0.65rem] font-mono text-slate-500 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest"
                        >
                           New Stylist Protocol
                        </button>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>

            {/* 🧩 Static Info */}
            {!result && (
               <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
                  <FeatureCard 
                     icon={<ShoppingBag className="text-cyan-400" />} 
                     title="Elite Sourcing" 
                     desc="Brands curated from luxury labels to niche trend-setters." 
                  />
                  <FeatureCard 
                     icon={<Palette className="text-purple-400" />} 
                     title="Color Matrix" 
                     desc="Chromatic analysis based on your unique undertone and context." 
                  />
                  <FeatureCard 
                     icon={<Zap className="text-amber-400" />} 
                     title="Neural Speed" 
                     desc="Complete architectural style breakdown in under 5 seconds." 
                  />
               </section>
            )}

            <footer className="text-center py-12 border-t border-slate-200 dark:border-white/5">
               <p className="text-[0.55rem] font-mono text-slate-400 dark:text-slate-600 uppercase tracking-[0.8em]">Neural Styler Engine © 2026 NERROPLAY</p>
            </footer>
         </div>
      </div>
   );
}

function OutfitComp({ label, items, isColors = false }: any) {
   return (
      <div className="space-y-4 text-center md:text-left">
         <span className="text-[0.7rem] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">{label}</span>
         <div className="space-y-2">
            {items.map((item: string) => (
               <div key={item} className="flex items-center gap-3">
                  {isColors ? (
                     <div className="w-3 h-3 rounded-full border border-slate-200 dark:border-white/10 shrink-0" style={{ backgroundColor: item }} />
                  ) : (
                     <div className="w-2 h-2 bg-slate-900/20 dark:bg-white/40 rounded-full shrink-0" />
                  )}
                  <span className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-200 uppercase truncate">{item}</span>
               </div>
            ))}
         </div>
      </div>
   );
}

function BrandList({ title, brands }: any) {
   return (
      <div className="space-y-4">
         <span className="text-[0.7rem] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <ShoppingBag size={12} /> {title}
         </span>
         <div className="space-y-2">
            {brands.map(b => (
               <div key={b} className="p-4 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 text-xs md:text-sm font-black uppercase text-slate-800 dark:text-slate-200 flex items-center justify-between hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                  {b} <ChevronRight size={14} className="opacity-40" />
               </div>
            ))}
         </div>
      </div>
   );
}

function FeatureCard({ icon, title, desc }: any) {
   return (
      <div className="glass bg-white dark:bg-black p-6 md:p-8 rounded-[2rem] border border-slate-200 dark:border-white/5 space-y-4 hover:border-slate-300 dark:hover:border-white/10 transition-all cursor-default text-center md:text-left shadow-lg dark:shadow-none">
         <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto md:mx-0">{icon}</div>
         <h4 className="text-base font-black uppercase tracking-tight text-slate-800 dark:text-white">{title}</h4>
         <p className="text-xs md:text-sm font-mono text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-tight">{desc}</p>
      </div>
   );
}
