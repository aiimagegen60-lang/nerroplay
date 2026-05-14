import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Trash2, 
  Zap, 
  ShieldCheck, 
  Heart, 
  Award, 
  CheckCircle2, 
  ChevronRight,
  Info,
  Droplets,
  Sun,
  Scissors,
  Star,
  Target,
  Share2,
  History,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import AIDeepAnalysis from './AIDeepAnalysis';

interface BeautyResult {
  score: number;
  glowUp: number;
  faceShape: string;
  skinTone: string;
  undertone: string;
  confidence: number;
  summarizedAnalysis: string;
  features: {
    skin: string;
    eyes: string;
    jawline: string;
  };
  suggestions: {
    hair: string[];
    skin: string[];
    style: string[];
  };
  improvementPlan: string[];
}

export default function BeautyAnalyzer() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<BeautyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<BeautyResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('nerro_beauty_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

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
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
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
         setError('Sahi image format use karo (JPG, PNG, JPEG)! Face scan ke liye clear photo chahiye.');
         return;
      }
      const compressed = await compressImage(file);
      setImage(compressed);
      setResult(null);
      setError(null);
    }
  };

  const onDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      if (!validTypes.includes(file.type) && !['jpg', 'jpeg', 'png'].includes(fileExt || '')) {
         setError('Sahi image format use karo (JPG, PNG, JPEG)! Clear portrait image use kare.');
         return;
      }
      const compressed = await compressImage(file);
      setImage(compressed);
      setResult(null);
      setError(null);
    }
  }, []);

  const handleDeepAnalysis = async () => {
    if (!result) return "";
    const response = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tool: 'Beauty AI Analyzer',
        data: {
          score: result.score,
          glowUp: result.glowUp,
          faceShape: result.faceShape,
          skinTone: result.skinTone,
          undertone: result.undertone,
          features: result.features
        }
      })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data.analysis;
  };

  const analyzeBeauty = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const response = await fetch('/api/analyze_face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: image })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Analysis signal lost.');
      }

      setResult(data);
      
      // Save to history
      const newHistory = [data, ...history].slice(0, 5);
      setHistory(newHistory);
      localStorage.setItem('nerro_beauty_history', JSON.stringify(newHistory));
      
    } catch (err: any) {
      console.error("AI Analysis Error:", err);
      setError(err.message || "Neuro-analysis synchronization failed. Check image clarity.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const shareResult = () => {
    if (!result) return;
    const shareUrl = "https://nerroplay.online?tool=beauty-analyzer";
    const text = `I just got my AI Beauty Analysis on NerroPlay! Beauty Score: ${result.score}, Glow-Up Potential: ${result.glowUp}%! Check your face now.`;
    if (navigator.share) {
      navigator.share({
        title: 'NerroPlay AI Beauty Analyzer',
        text: text,
        url: shareUrl,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text + " " + shareUrl);
      // Optional: notification could be added here
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-text-primary p-4 md:p-12">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* 🎬 Header */}
        <header className="text-center space-y-4 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[0.65rem] font-mono tracking-widest uppercase"
          >
            <Sparkles size={14} /> SaaS-Grade Visual Intelligence
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] text-text-primary">
            AI Beauty <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Architect.</span>
          </h1>
          <p className="text-text-muted text-sm font-mono uppercase tracking-widest max-w-xl mx-auto">
            Deep neural facial analysis for esthetic optimization and glow-up strategy.
          </p>
        </header>

        {/* 📸 Core Input Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="space-y-6">
              <div className="glass p-8 rounded-[2.5rem] border border-border-glass relative overflow-hidden group min-h-[400px] flex flex-col items-center justify-center">
                {!image ? (
                  <div 
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-full flex flex-col items-center justify-center text-center cursor-pointer space-y-6 group/inner hover:bg-surface/50 transition-all rounded-[2rem]"
                  >
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                    <div className="w-24 h-24 bg-cyan-500/10 rounded-full flex items-center justify-center group-hover/inner:scale-110 transition-transform">
                      <Camera size={40} className="text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold uppercase tracking-tighter text-text-primary">Capture Face</h3>
                      <p className="text-xs text-text-muted font-mono mt-1 italic">DRAG & DROP OR TAP TO UPLOAD</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full rounded-[2rem] overflow-hidden border-4 border-background shadow-2xl">
                    <img src={image} alt="Subject" className="w-full h-full object-cover" />
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center">
                        <div className="relative w-20 h-20">
                          <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full" />
                          <div className="absolute inset-0 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                        <p className="mt-8 text-[0.65rem] font-mono text-cyan-400 tracking-[0.3em] uppercase animate-pulse font-black">Scanning Neural Paths...</p>
                      </div>
                    )}
                    <button 
                      onClick={() => { setImage(null); setResult(null); }}
                      className="absolute top-4 right-4 p-2 bg-red-500/20 text-red-500 backdrop-blur-md rounded-full hover:bg-red-500 hover:text-white transition-all border border-red-500/30"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                )}
              </div>

              {image && !result && !isAnalyzing && (
                <button 
                  onClick={analyzeBeauty}
                  className="w-full py-6 bg-cyan-500 text-slate-950 font-black rounded-2xl flex items-center justify-center gap-4 hover:scale-[1.02] transition-all shadow-xl shadow-cyan-500/20 uppercase tracking-tighter group italic"
                >
                  <Zap size={24} fill="currentColor" className="group-hover:animate-pulse" /> Finalize Neural Scan
                </button>
              )}

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-4">
                  <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-red-400 text-xs font-mono uppercase leading-relaxed font-bold italic">{error}</p>
                </div>
              )}
           </div>

           <div className="space-y-6">
              <div className="glass p-8 rounded-[2.5rem] border border-border-glass space-y-8 flex flex-col justify-center h-full">
                <div className="space-y-2">
                   <h2 className="text-xs font-mono text-cyan-500 uppercase tracking-widest font-black flex items-center gap-2">
                      <ShieldCheck size={14} /> Biometric Protocols
                   </h2>
                   <p className="text-sm text-text-secondary leading-relaxed font-medium">
                      NerroPlay uses advanced neural architecture to analyze facial symmetry, skin luminosity, and volumetric ratios. Your data is processed locally and cleared after sync.
                   </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                   <ProtocolItem icon={<Camera size={16} />} text="Use clear, centered lighting" />
                   <ProtocolItem icon={<Target size={16} />} text="Neutral facial expression required" />
                   <ProtocolItem icon={<Droplets size={16} />} text="Remove glasses for symmetry check" />
                </div>

                {history.length > 0 && (
                  <div className="pt-6 border-t border-border-glass space-y-4">
                    <h3 className="text-[0.6rem] font-mono text-text-muted uppercase tracking-widest flex items-center gap-2 font-black">
                       <History size={14} /> Previous Calibrations
                    </h3>
                    <div className="flex gap-3">
                       {history.map((h, i) => (
                         <div key={`hist-${h.score}-${i}`} className="px-3 py-1 bg-surface border border-border-glass rounded-full text-[0.6rem] font-mono text-text-secondary font-bold">
                           SCR-{h.score}
                         </div>
                       ))}
                    </div>
                  </div>
                )}
              </div>
           </div>
        </section>

        {/* 📊 Results Section */}
        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              {/* 🏆 Primary Score Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <ScoreCard 
                   title="Beauty Score" 
                   value={result.score} 
                   color="cyan" 
                   icon={<Award size={20} />} 
                   description="Current facial esthetic index"
                 />
                 <ScoreCard 
                   title="Glow-Up Potential" 
                   value={result.glowUp} 
                   color="purple" 
                   icon={<Sparkles size={20} />} 
                   description="Optimization room detected"
                 />
                 <MetricCard label="Face Shape" value={result.faceShape} sub="Structure" />
                 <MetricCard label="Confidence" value={`${result.confidence}%`} sub="Analysis Accuracy" />
              </div>
                        {/* 🧠 Analysis Grid */}               {/* 🧠 Analysis Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
                 <div className="lg:col-span-12 space-y-8">
                    <section className="glass p-10 rounded-[3rem] border border-border-glass relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-8 opacity-5">
                          <Zap size={120} className="text-cyan-500" />
                       </div>
                       <div className="relative z-10 space-y-8">
                          <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black text-text-primary uppercase flex items-center gap-3 italic">
                               <Info size={24} className="text-cyan-500" /> Feature Matrix
                            </h3>
                            <button 
                              onClick={shareResult}
                              className="p-3 bg-surface rounded-2xl hover:bg-accent/10 transition-all text-text-secondary hover:text-text-primary border border-border-glass shadow-sm"
                            >
                              <Share2 size={20} />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <FeatureBox title="Skin Profile" content={result.features.skin} />
                             <FeatureBox title="Ocular Stats" content={result.features.eyes} />
                             <FeatureBox title="Jaw Definition" content={result.features.jawline} />
                          </div>
                       </div>
                    </section>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {result && (
          <div className="mt-8 max-w-6xl mx-auto space-y-8">
            <AIDeepAnalysis 
              onAnalyze={handleDeepAnalysis} 
              toolName="Beauty AI Analyzer" 
            />
          </div>
        )}

        {/* 🧩 SEO / Info Section */}
        {!result && (
          <section className="pt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
             <InfoTile 
                icon={<Sun className="text-amber-500" />} 
                title="Luminous Calibration" 
                text="Detects subsurface scattering and radiance across 42 facial zones." 
             />
             <InfoTile 
                icon={<Star className="text-indigo-400" />} 
                title="Symmetry Analysis" 
                text="Mathematical mapping of facial bilaterality and golden ratio deviance." 
             />
             <InfoTile 
                icon={<ShieldCheck className="text-emerald-500" />} 
                title="SaaS-Grade Privacy" 
                text="All scans are anonymous and encrypted for your neural profile." 
             />
          </section>
        )}

        <footer className="pt-24 pb-12 text-center">
           <p className="text-[0.55rem] font-mono text-text-muted uppercase tracking-[0.6em] font-black italic">
              Powered by NerroPlay Neural Architecture © 2026
           </p>
        </footer>
      </div>
    </div>
  );
}

function ProtocolItem({ icon, text }: any) {
  return (
    <div className="flex items-center gap-3 p-3 bg-surface/50 rounded-xl border border-border-glass">
      <div className="text-cyan-500">{icon}</div>
      <span className="text-[0.65rem] font-mono text-text-secondary uppercase tracking-tight font-medium">{text}</span>
    </div>
  );
}

function ScoreCard({ title, value, color, icon, description }: any) {
  const colors: any = {
    cyan: "text-cyan-400 bg-cyan-400/5 border-cyan-400/20",
    purple: "text-purple-400 bg-purple-400/5 border-purple-400/20"
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`glass p-8 rounded-[2.5rem] border ${colors[color]} flex flex-col items-center justify-center text-center shadow-xl shadow-accent/5`}
    >
      <div className="mb-4">{icon}</div>
      <h4 className="text-[0.65rem] font-black font-mono uppercase tracking-[0.2em] mb-4 text-text-muted">{title}</h4>
      <div className="text-6xl font-black tracking-tighter mb-2 text-text-primary italic">{value}</div>
      <p className="text-[0.55rem] font-mono uppercase text-text-muted opacity-60 tracking-widest font-bold">{description}</p>
    </motion.div>
  );
}

function MetricCard({ label, value, sub }: any) {
  return (
    <div className="glass p-8 rounded-[2.5rem] border border-border-glass flex flex-col items-center justify-center text-center shadow-xl">
      <span className="text-[0.6rem] font-mono text-text-muted uppercase tracking-widest mb-4 font-black">{label}</span>
      <div className="text-3xl font-black text-text-primary uppercase tracking-tight italic">{value}</div>
      <span className="text-[0.5rem] font-mono text-text-muted uppercase mt-4 tracking-[0.2em] font-bold">{sub}</span>
    </div>
  );
}

function FeatureBox({ title, content }: any) {
  return (
    <div className="p-5 bg-surface rounded-3xl border border-border-glass group hover:border-cyan-500/30 transition-all">
       <h4 className="text-[0.6rem] font-black text-cyan-500 uppercase mb-2 tracking-widest">{title}</h4>
       <p className="text-xs text-text-secondary leading-relaxed group-hover:text-text-primary transition-colors font-medium">{content}</p>
    </div>
  );
}

function RecommendationBlock({ title, items, icon, color }: any) {
  const colorStyles: any = {
    cyan: "border-cyan-500/10 text-cyan-400",
    purple: "border-purple-500/10 text-purple-400"
  };

  return (
    <div className={`glass p-8 rounded-[2.5rem] border ${colorStyles[color]} space-y-6 shadow-xl`}>
       <h3 className="text-xs font-mono font-black uppercase tracking-widest flex items-center gap-3 italic">
          {icon} {title}
       </h3>
       <div className="space-y-4">
          {items.map((item: string, i: number) => (
            <div key={`rec-item-${item.substring(0, 10)}-${i}`} className="flex items-center gap-3 group">
               <CheckCircle2 size={16} className={`${colorStyles[color]} opacity-50 group-hover:opacity-100 transition-opacity`} />
               <p className="text-xs font-mono text-text-secondary uppercase tracking-tight group-hover:text-text-primary transition-colors font-bold">
                  {item}
               </p>
            </div>
          ))}
       </div>
    </div>
  );
}

function InfoTile({ icon, title, text }: any) {
  return (
    <div className="glass p-8 rounded-[2rem] border border-border-glass space-y-4 hover:border-accent/40 transition-all cursor-default">
       <div className="w-12 h-12 bg-surface rounded-2xl flex items-center justify-center border border-border-glass shadow-sm">
          {icon}
       </div>
       <h4 className="text-sm font-black uppercase tracking-tight text-text-primary">{title}</h4>
       <p className="text-[0.65rem] font-mono text-text-muted leading-relaxed uppercase tracking-tight font-bold">{text}</p>
    </div>
  );
}
