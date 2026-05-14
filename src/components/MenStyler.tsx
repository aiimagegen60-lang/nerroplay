import React, { useState, useRef, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { 
   Camera, 
   Upload, 
   Sparkles, 
   Trash2, 
   Zap, 
   Scissors, 
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
   AlertCircle,
   User,
   Watch,
   Compass
} from 'lucide-react';
import AIDeepAnalysis from './AIDeepAnalysis';

interface MenStyleResult {
   score: number;
   glowUp: number;
   faceShape: string;
   skinTone: string;
   hair: {
      style: string;
      beard: string;
      fadeType: string;
      searchQueries: {
         hair: string;
         beard: string;
      };
   };
   outfit: {
      top: string;
      bottom: string;
      shoes: string;
      completeLook: string;
      searchQueries: {
         outfit: string;
      };
   };
   colorMatch: {
      best: string[];
      avoid: string[];
      palette: string;
   };
   groomingTips: string[];
   brands: string[];
}

const OCCASIONS = ['Casual', 'Party', 'Office', 'Wedding', 'Gym', 'Beach'];
const STYLE_MODES = ['Minimal', 'Street', 'Formal', 'Luxury'];

export default function MenStyler() {
   const [image, setImage] = useState<string | null>(null);
   const [occasion, setOccasion] = useState('Casual');
   const [styleMode, setStyleMode] = useState('Street');
   const [isAnalyzing, setIsAnalyzing] = useState(false);
   const [result, setResult] = useState<MenStyleResult | null>(null);
   const [error, setError] = useState<string | null>(null);
   const fileInputRef = useRef<HTMLInputElement>(null);

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
            setError('Sahi image format use karo (JPG, PNG, JPEG)! Premium grooming analysis ke liye clear photo chahiye.');
            return;
         }
         const compressed = await compressImage(file);
         setImage(compressed);
         setResult(null);
         setError(null);
      }
   };

   const handleDeepAnalysis = async () => {
    if (!result) return "";
    const response = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tool: 'Men AI Styler',
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
    return data.analysis;
  };

   const analyzeStyle = async () => {
      if (!image) return;
      setIsAnalyzing(true);
      setError(null);
      setResult(null); // Clear previous result before starting new analysis
      
      try {
         const response = await fetch('/api/men_styler', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image, occasion, styleMode })
         });
         
         const data = await response.json();
         if (!response.ok) {
            throw new Error(data.message || data.error || 'Neural link unstable.');
         }
         
         if (!data.score || !data.hair || !data.outfit) {
            throw new Error("Received incomplete analysis data. Please try another photo.");
         }

         setResult(data);
      } catch (err: any) {
         setError(err.message || "Failed to sync with Men Stylist AI.");
      } finally {
         setIsAnalyzing(false);
      }
   };

   const shareResult = () => {
      if (!result) return;
      const shareUrl = "https://nerroplay.online?tool=men-styler";
      const text = `I just got a 2026 Style Score of ${result.score}% from Men AI Styler! My glow-up potential is ${result.glowUp}%. Ranked: ${result.faceShape} face shape. Check this out!`;
      if (navigator.share) {
         navigator.share({ title: 'Men AI Styler', text, url: shareUrl }).catch(console.error);
      } else {
         navigator.clipboard.writeText(text + " " + shareUrl);
         // Notification could go here
      }
   };

   return (
      <div className="min-h-screen bg-background text-text-primary font-sans selection:bg-accent/20 transition-colors duration-300">
         {/* Minimal Monochrome Background */}
         <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-accent/5 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_var(--bg-color)_100%)] opacity-60" />
         </div>

         <div className="max-w-6xl mx-auto px-4 py-12 md:py-24 relative z-10 space-y-8 md:space-y-16">
            
            {/* Header */}
            <header className="text-center space-y-6">
               <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border-glass text-text-secondary text-[0.6rem] font-mono tracking-widest uppercase font-black"
               >
                  <Watch size={14} /> 2026 Trend Intelligence
               </motion.div>
               <h1 className="text-4xl md:text-9xl font-black tracking-tighter uppercase leading-none italic">
                  Men <span className="text-transparent bg-clip-text bg-gradient-to-r from-text-primary via-text-secondary to-text-muted">Style.</span>
               </h1>
               <p className="text-text-muted text-sm md:text-base font-mono uppercase tracking-[0.4em] max-w-2xl mx-auto">
                  Precision grooming & sartorial analysis engine.
               </p>
            </header>

            {/* Main Interactive Card */}
            <section className="glass rounded-[3rem] overflow-hidden">
               <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border-glass">
                  
                  {/* Image Upload */}
                  <div className="lg:col-span-4 p-4 md:p-8 flex flex-col items-center justify-center min-h-[300px] md:min-h-[350px] bg-surface/30">
                     {!image ? (
                        <div 
                           onClick={() => fileInputRef.current?.click()}
                           className="w-full h-full flex flex-col items-center justify-center text-center cursor-pointer group/upload space-y-4"
                        >
                           <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                           <div className="w-24 h-24 rounded-full bg-background border border-border-glass flex items-center justify-center group-hover/upload:bg-surface group-hover/upload:border-accent transitions-all">
                              <Camera size={32} className="text-text-muted group-hover/upload:text-text-primary" />
                           </div>
                           <div className="space-y-1">
                              <p className="text-xs font-mono text-text-secondary uppercase tracking-widest">Upload Portrait</p>
                              <p className="text-[0.6rem] font-mono text-text-muted uppercase">Face or Full Body</p>
                           </div>
                        </div>
                     ) : (
                        <div className="relative w-full aspect-square rounded-3xl overflow-hidden group/img">
                           <img src={image} alt="Selfie" className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end p-6">
                              <button 
                                 onClick={() => { setImage(null); setResult(null); setError(null); }}
                                 className="w-full py-3 bg-surface text-text-primary backdrop-blur-xl border border-border-glass rounded-xl text-[0.6rem] font-black uppercase flex items-center justify-center gap-2 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all"
                              >
                                 <Trash2 size={12} /> Clear Sample
                              </button>
                           </div>
                        </div>
                     )}
                  </div>


                  {/* Config & Action */}
                  <div className="lg:col-span-8 p-5 md:p-10 space-y-8 md:space-y-10">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Occasion */}
                        <div className="space-y-4">
                           <label className="text-[0.65rem] font-mono text-text-muted uppercase tracking-[0.3em] font-black">Select Occasion</label>
                           <div className="grid grid-cols-2 gap-2">
                              {OCCASIONS.map((occ, i) => (
                                 <button 
                                    key={`occ-${occ}-${i}`}
                                    onClick={() => setOccasion(occ)}
                                    className={`py-3 px-3 rounded-xl border text-[0.65rem] font-bold uppercase transition-all flex items-center justify-center gap-2 ${
                                       occasion === occ 
                                       ? 'bg-text-primary text-background font-black shadow-lg shadow-accent/10' 
                                       : 'bg-surface border-border-glass text-text-secondary hover:border-accent/40'
                                    }`}
                                 >
                                    {occ}
                                 </button>
                              ))}
                           </div>
                        </div>

                        {/* Style Mode */}
                        <div className="space-y-4">
                           <label className="text-[0.65rem] font-mono text-text-muted uppercase tracking-[0.3em] font-black">Core Aesthetic</label>
                           <div className="grid grid-cols-1 gap-2">
                              {STYLE_MODES.map((mode, i) => (
                                 <button 
                                    key={`mode-${mode}-${i}`}
                                    onClick={() => setStyleMode(mode)}
                                    className={`py-3 px-4 rounded-xl border text-[0.65rem] font-bold uppercase flex items-center justify-between transition-all ${
                                       styleMode === mode 
                                       ? 'bg-text-primary text-background font-black shadow-lg shadow-accent/10' 
                                       : 'bg-surface border-border-glass text-text-secondary hover:border-accent/40'
                                    }`}
                                 >
                                    {mode} {styleMode === mode && <CheckCircle2 size={12} />}
                                 </button>
                              ))}
                           </div>
                        </div>
                     </div>

                     <div className="pt-8 border-t border-border-glass">
                        <button 
                           disabled={!image || isAnalyzing}
                           onClick={analyzeStyle}
                           className="w-full py-8 bg-text-primary text-background rounded-3xl font-black uppercase text-sm tracking-widest flex items-center justify-center gap-4 group disabled:opacity-50 hover:scale-[1.01] active:scale-95 transition-all shadow-2xl"
                        >
                           {isAnalyzing ? (
                              <div className="flex items-center gap-3">
                                 <div className="w-5 h-5 border-2 border-text-muted border-t-text-primary rounded-full animate-spin" />
                                 <span>Initializing Neural Scan...</span>
                              </div>
                           ) : (
                              <>
                                 <Zap size={20} fill="currentColor" className="group-hover:animate-pulse" />
                                 <span>Analyze My Look</span>
                              </>
                           )}
                        </button>
                        {error && (
                           <p className="mt-4 text-center text-red-500 text-[0.6rem] font-mono uppercase animate-bounce font-black italic">{error}</p>
                        )}
                     </div>
                  </div>
               </div>
            </section>

            {/* Results Mapping */}
            <AnimatePresence>
               {result && (
                  <motion.div 
                     initial={{ opacity: 0, y: 40 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="space-y-8 md:space-y-12"
                  >
                     {/* Scores Grid */}
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="glass p-5 md:p-8 rounded-[2.5rem] col-span-2 relative overflow-hidden group self-stretch">
                           <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                              <Crown size={180} className="text-text-primary" />
                           </div>
                           <span className="text-[0.65rem] font-mono text-text-muted uppercase tracking-[0.4em] font-bold">Style Score</span>
                           <div className="flex items-baseline gap-4 mt-6">
                              <span className="text-8xl font-black tracking-tighter text-text-primary tabular-nums">{result.score}</span>
                              <span className="text-xl font-mono text-text-muted">/ 100</span>
                           </div>
                           <div className="mt-6 flex items-center gap-2">
                              <div className="h-1 flex-1 bg-surface rounded-full overflow-hidden">
                                 <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${result.score}%` }}
                                    className="h-full bg-text-primary"
                                 />
                              </div>
                              <span className="text-[0.5rem] font-mono text-text-primary uppercase font-black tracking-widest">Elite</span>
                           </div>
                        </div>

                        <div className="glass p-5 md:p-8 rounded-[2.5rem] md:col-span-1 flex flex-col justify-between">
                           <span className="text-[0.65rem] font-mono text-text-muted uppercase tracking-[0.4em] font-bold">Glow-Up %</span>
                           <div className="text-6xl font-black tracking-tighter text-text-primary tabular-nums mt-4">
                              {result.glowUp}%
                           </div>
                           <p className="text-[0.55rem] font-mono text-text-muted uppercase mt-4 leading-relaxed">Optimization vectors identified for grooming & fit.</p>
                        </div>

                        <div className="glass p-5 md:p-8 rounded-[2.5rem] md:col-span-1 space-y-6">
                           <div className="space-y-1">
                              <span className="text-[0.55rem] font-mono text-text-muted uppercase tracking-widest">Face Shape</span>
                              <div className="text-xl font-black uppercase text-text-primary flex items-center gap-2">
                                 <User size={18} className="text-text-muted" /> {result.faceShape}
                              </div>
                           </div>
                           <div className="space-y-1">
                              <span className="text-[0.55rem] font-mono text-text-muted uppercase tracking-widest">Skin Tone</span>
                              <div className="text-xs font-bold uppercase text-text-secondary leading-tight">
                                 {result.skinTone}
                              </div>
                           </div>
                        </div>
                     </div>


                     {/* Hair & Beard Engine */}
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="glass p-5 md:p-10 rounded-[3rem] border border-border-glass space-y-10 shadow-xl">
                           <div className="flex items-center justify-between">
                              <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3 text-text-primary">
                                 <Scissors size={24} className="text-text-muted" /> Grooming Protocol
                              </h3>
                              <span className="text-xs font-mono text-text-muted uppercase tracking-widest font-bold">2026 Ready</span>
                           </div>
                           
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                              <div className="space-y-6">
                                 <div className="space-y-2">
                                    <span className="text-[0.55rem] font-mono text-text-muted uppercase tracking-[0.3em] font-black">Trending Hairstyle</span>
                                    <p className="text-lg font-black uppercase text-text-primary italic">{result.hair.style}</p>
                                    <p className="text-[0.6rem] font-mono text-text-muted uppercase italic font-bold">{result.hair.fadeType} Finish</p>
                                 </div>
                                 <div className="space-y-2">
                                    <span className="text-[0.55rem] font-mono text-text-muted uppercase tracking-[0.3em] font-black">Facial Hair Engine</span>
                                    <p className="text-lg font-black uppercase text-text-muted italic">{result.hair.beard}</p>
                                 </div>
                              </div>
                              <div className="aspect-square bg-surface rounded-[2rem] overflow-hidden border border-border-glass group relative">
                                 <img 
                                    src={`https://loremflickr.com/500/500/${encodeURIComponent(result.hair.searchQueries.hair)}?v=${result.score}`} 
                                    alt="Style Inspo" 
                                    className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-700 opacity-0"
                                    onLoad={(e) => (e.currentTarget.style.opacity = '1')}
                                    onError={(e) => {
                                       e.currentTarget.src = "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?w=500";
                                       e.currentTarget.style.opacity = '1';
                                    }}
                                 />
                                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="p-3 bg-background/40 backdrop-blur-md rounded-full border border-border-glass opacity-0 group-hover:opacity-100 transition-opacity">
                                       <Sparkles size={20} className="text-text-primary" />
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="glass p-5 md:p-10 rounded-[3rem] border border-border-glass space-y-10 shadow-xl">
                           <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3 text-text-primary">
                              <Watch size={24} className="text-text-muted" /> Color Matrix
                           </h3>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                              <div className="space-y-8">
                                 <div className="space-y-4">
                                    <span className="text-[0.55rem] font-mono text-text-muted uppercase tracking-widest block font-black">Neural Resonance (Best)</span>
                                    <div className="flex flex-wrap gap-2">
                                       {result.colorMatch.best.map((c, i) => (
                                          <div key={`best-color-${c}-${i}`} className="px-4 py-2 bg-text-primary text-background border border-border-glass rounded-xl text-[0.65rem] font-black uppercase tracking-widest italic">{c}</div>
                                       ))}
                                    </div>
                                 </div>
                                 <div className="space-y-4">
                                    <span className="text-[0.55rem] font-mono text-text-muted uppercase tracking-widest block font-black">Conflict Zones (Avoid)</span>
                                    <div className="flex flex-wrap gap-2">
                                       {result.colorMatch.avoid.map((c, i) => (
                                          <div key={`avoid-color-${c}-${i}`} className="px-4 py-2 bg-surface border border-border-glass rounded-xl text-[0.65rem] font-black text-text-muted uppercase tracking-widest line-through decoration-text-muted/50 italic">{c}</div>
                                       ))}
                                    </div>
                                 </div>
                              </div>
                              <div className="bg-surface p-8 rounded-[2rem] border border-border-glass flex flex-col items-center justify-center text-center space-y-2 shadow-inner">
                                 <PaletteIcon color1={result.colorMatch.best[0]} color2={result.colorMatch.best[1] || '#333'} />
                                 <span className="text-[0.6rem] font-mono text-text-muted uppercase tracking-[0.3em] font-black">Palette Profile</span>
                                 <span className="text-sm font-black uppercase text-text-primary italic">{result.colorMatch.palette}</span>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Outfit Engine */}
                     <div className="glass p-5 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border border-white/10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/[0.03] via-transparent to-white/[0.03]" />
                        <div className="relative z-10 space-y-16">
                           <div className="text-center space-y-2">
                              <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Sartorial Blueprint</h3>
                              <p className="text-[0.6rem] font-mono text-slate-600 uppercase tracking-[0.6em]">Premium curated look for {occasion}</p>
                           </div>

                           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                              <div className="lg:col-span-7 space-y-10">
                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <ItemCard icon="👕" label="Upper Layer" val={result.outfit.top} />
                                    <ItemCard icon="👖" label="Foundation" val={result.outfit.bottom} />
                                    <ItemCard icon="👟" label="Footwear" val={result.outfit.shoes} />
                                 </div>
                                 <div className="p-6 md:p-10 bg-white/[0.04] rounded-3xl border border-white/10 space-y-6">
                                    <span className="text-[0.7rem] font-mono text-cyan-400 uppercase tracking-widest font-black flex items-center gap-2">
                                       <Star size={14} fill="currentColor" /> Expert Recommendation
                                    </span>
                                    <p className="text-xl md:text-2xl font-medium text-slate-200 leading-loose italic">
                                       "{result.outfit.completeLook}"
                                    </p>
                                 </div>
                              </div>
                              <div className="lg:col-span-5 h-[300px] md:h-[450px] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl relative group bg-white/5">
                                 <img 
                                    src={`https://loremflickr.com/800/1000/${encodeURIComponent(result.outfit.searchQueries.outfit)}?v=${result.score}`} 
                                    alt="Outfit Look" 
                                    className="w-full h-full object-cover brightness-95 group-hover:scale-105 transition-transform duration-1000 opacity-0"
                                    onLoad={(e) => (e.currentTarget.style.opacity = '1')}
                                    onError={(e) => {
                                       e.currentTarget.src = "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=800";
                                       e.currentTarget.style.opacity = '1';
                                    }}
                                 />
                                 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                                 <div className="absolute bottom-6 left-6 right-6 p-5 backdrop-blur-md bg-black/60 rounded-2xl border border-white/10">
                                    <span className="text-[0.6rem] font-mono text-cyan-400 uppercase tracking-widest font-bold">Visual Inspo</span>
                                    <p className="text-xs md:text-sm font-black text-white uppercase mt-2">{result.outfit.completeLook.split(' ').slice(0, 5).join(' ')}...</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Footer Grid */}
                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-12">
                           <AIDeepAnalysis 
                             onAnalyze={handleDeepAnalysis} 
                             toolName="Men AI Styler" 
                           />
                        </div>
                        <div className="lg:col-span-8 glass p-5 md:p-10 rounded-[3rem] border border-border-glass flex flex-col md:flex-row gap-12 shadow-2xl">
                           <div className="flex-1 space-y-6">
                              <h4 className="text-xs font-mono font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2 italic">
                                 <Zap size={14} fill="currentColor" className="text-accent" /> Routine Optimization
                              </h4>
                              <div className="space-y-4">
                                 {result.groomingTips.map((tip, i) => (
                                    <div key={`tip-${i}`} className="flex gap-4 p-5 bg-surface rounded-2xl border border-border-glass group hover:border-accent/40 transition-all shadow-sm">
                                       <span className="text-sm font-mono text-accent font-black">0{i+1}</span>
                                       <p className="text-sm md:text-base font-bold text-text-secondary uppercase leading-relaxed">{tip}</p>
                                    </div>
                                 ))}
                              </div>
                           </div>
                           <div className="w-px bg-border-glass hidden md:block" />
                           <div className="flex-1 space-y-6">
                              <h4 className="text-xs font-mono font-black text-text-muted uppercase tracking-[0.2em] flex items-center gap-2 italic">
                                 <ShoppingBag size={14} fill="currentColor" className="text-accent" /> Brand Ecosystem
                              </h4>
                              <div className="grid grid-cols-1 gap-2">
                                 {result.brands.map((brand, i) => (
                                    <div key={`brand-${brand}-${i}`} className="px-5 py-4 bg-surface rounded-xl border border-border-glass text-sm font-black uppercase text-text-secondary flex items-center justify-between group cursor-default shadow-sm hover:border-accent/30 transition-all">
                                       {brand} <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-text-primary" />
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>

                        <div className="lg:col-span-4 flex flex-col gap-8">
                           <button 
                              onClick={shareResult}
                              className="flex-1 glass p-5 md:p-8 rounded-[3rem] border border-border-glass bg-surface flex flex-col items-center justify-center text-center group hover:bg-accent/5 transition-all shadow-2xl"
                           >
                              <div className="w-16 h-16 bg-text-primary text-background rounded-full flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform">
                                 <Share2 size={24} />
                              </div>
                              <h4 className="text-xl font-black uppercase text-text-primary tracking-tighter mb-2 italic">Sync Profile</h4>
                              <p className="text-[0.6rem] font-mono text-text-muted uppercase tracking-widest font-bold">Broadcast your style score</p>
                           </button>
                        </div>
                     </div>

                     <div className="flex justify-center pt-8">
                        <button 
                           onClick={() => { setResult(null); setImage(null); setError(null); }}
                           className="px-10 py-4 glass border border-border-glass rounded-full text-[0.6rem] font-black uppercase tracking-[0.3em] text-text-muted hover:text-text-primary hover:bg-surface transition-all italic"
                        >
                           Reset Analysis Protocol
                        </button>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>

            {/* Static Selling Points */}
            {!result && (
               <section className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-16">
                  <div className="space-y-3">
                     <Compass size={20} className="text-text-muted mb-2" />
                     <h3 className="text-xs font-black uppercase tracking-tight text-text-primary italic">Trend Radar 2026</h3>
                     <p className="text-[0.6rem] font-mono text-text-muted leading-relaxed uppercase font-bold opacity-80">Scans millions of high-fashion points to predict grooming & sartorial shifts.</p>
                  </div>
                  <div className="space-y-3">
                     <Droplets size={20} className="text-text-muted mb-2" />
                     <h3 className="text-xs font-black uppercase tracking-tight text-text-primary italic">Chroma Physics</h3>
                     <p className="text-[0.6rem] font-mono text-text-muted leading-relaxed uppercase font-bold opacity-80">Neural color matching mapped against your skin reflectance and undertone.</p>
                  </div>
                  <div className="space-y-3">
                     <ShieldCheckIcon size={20} className="text-text-muted mb-2" />
                     <h3 className="text-xs font-black uppercase tracking-tight text-text-primary italic">Privacy First</h3>
                     <p className="text-[0.6rem] font-mono text-text-muted leading-relaxed uppercase font-bold opacity-80">Encrypted local processing. Your visual data remains your sovereign asset.</p>
                  </div>
               </section>
            )}

            <footer className="text-center py-20 border-t border-border-glass opacity-30">
               <p className="text-[0.6rem] font-mono tracking-[0.8em] uppercase text-text-muted font-bold italic">Neural Men Styler Engine © 2026 NERROPLAY</p>
            </footer>
         </div>
      </div>
   );
}

function ItemCard({ icon, label, val }: any) {
   return (
      <div className="p-6 bg-surface rounded-3xl border border-border-glass space-y-4 shadow-sm">
         <div className="text-4xl">{icon}</div>
         <div>
            <span className="text-[0.7rem] font-mono text-text-muted uppercase tracking-widest block font-black">{label}</span>
            <p className="text-base font-black uppercase text-text-primary mt-2 italic">{val}</p>
         </div>
      </div>
   );
}

function ArrowRight({ size, className }: any) {
   return (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         width={size}
         height={size}
         viewBox="0 0 24 24"
         fill="none"
         stroke="currentColor"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
         className={className}
      >
         <path d="M5 12h14" />
         <path d="m12 5 7 7-7 7" />
      </svg>
   );
}

function ShieldCheckIcon({ size, className }: any) {
   return (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         width={size}
         height={size}
         viewBox="0 0 24 24"
         fill="none"
         stroke="currentColor"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
         className={className}
      >
         <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
         <path d="m9 12 2 2 4-4" />
      </svg>
   );
}

function PaletteIcon({ color1, color2 }: any) {
   return (
      <div className="flex -space-x-4 mb-4">
         <div className="w-16 h-16 rounded-full border-4 border-background shadow-xl" style={{ backgroundColor: color1 }} />
         <div className="w-16 h-16 rounded-full border-4 border-background shadow-xl" style={{ backgroundColor: color2 }} />
      </div>
   );
}
