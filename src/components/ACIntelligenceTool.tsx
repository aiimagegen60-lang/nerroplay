import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import imageCompression from 'browser-image-compression';
import { 
  Wind, 
  Upload, 
  Zap, 
  IndianRupee, 
  ShieldCheck, 
  TrendingDown, 
  ShoppingBag, 
  RefreshCcw,
  Info,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Camera
} from 'lucide-react';
import AIDeepAnalysis from './AIDeepAnalysis';

const ACIntelligenceTool = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [manualData, setManualData] = useState({
    daily_usage_hours: 8,
    electricity_rate: 7,
    city: 'Delhi',
    room_size: 150,
    unit_preference: 'split',
    recommendation_requested: true
  });

  const cityRates: Record<string, number> = {
    'Mumbai': 9,
    'Delhi': 7,
    'Bangalore': 7.5,
    'Chennai': 5.5,
    'Kolkata': 7,
    'Other': 7
  };

  const handleCityChange = (city: string) => {
    setManualData({
      ...manualData,
      city: city,
      electricity_rate: cityRates[city] || 7
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Format Validation
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      
      if (!validTypes.includes(file.type) && !['jpg', 'jpeg', 'png'].includes(fileExt || '')) {
         setError('Sahi image format use karo (JPG, PNG, JPEG)! Filter ya PDF allow nahi hai.');
         const inputElement = e.target as HTMLInputElement;
         inputElement.value = ''; 
         return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError('Image size too large. Keep it under 10MB.');
        return;
      }
      
      try {
        const options = {
          maxSizeMB: 0.8,
          maxWidthOrHeight: 1280,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();
        reader.onloadend = () => setImage(reader.result as string);
        reader.readAsDataURL(compressedFile);
        setError(null);
      } catch (err) {
        console.error("Compression error:", err);
        const reader = new FileReader();
        reader.onloadend = () => setImage(reader.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDeepAnalysis = async () => {
    if (!results) return "";
    const response = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tool: 'AC Intelligence Expert',
        data: {
          detectedData: results.detected_data,
          calculation: results.calculation,
          comparison: results.comparison,
          tonnage_advice: results.tonnage_advice
        }
      })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data.analysis;
  };

  const analyzeAC = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const response = await fetch('/api/ac/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_provided: !!image,
          image: image,
          manual_data: manualData
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.message || data.error);
      setResults(data);
    } catch (err: any) {
      console.error(err);
      setError('Arre photo clear nahi hai! Star rating table seedha dikhna chahiye. JPG/PNG formats hi chalenge.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent py-10 space-y-10 text-text-primary">
      <div className="max-w-6xl mx-auto space-y-10 px-4">
        
        {/* Input Header */}
        <div className="text-center space-y-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex p-4 bg-indigo-500/10 rounded-full text-indigo-500 mb-2"
          >
            <Wind size={32} />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-text-primary">
            AC <span className="text-indigo-500">Intelligence</span> Expert
          </h1>
          <p className="text-text-muted max-w-2xl mx-auto font-medium">
            India's smartest air conditioner advisor. Scan photo to save thousands on your electricity bill! ⚡
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Input Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <section className="glass p-6 md:p-8 rounded-[2.5rem] space-y-8">
              <h2 className="text-xl font-black flex items-center gap-2 text-text-primary">
                <Upload size={20} className="text-indigo-500" /> Image Analysis
              </h2>

              {/* Image Upload Area */}
              <div className="relative group">
                <input 
                  type="file" accept="image/*" 
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`aspect-video rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${
                  image ? 'border-indigo-500 bg-indigo-500/10' : 'border-border-glass bg-surface/30 group-hover:border-indigo-300'
                }`}>
                  {image ? (
                    <img src={image} alt="AC Label" className="w-full h-full object-contain rounded-3xl p-2" />
                  ) : (
                    <>
                      <div className="p-4 bg-background rounded-2xl shadow-sm mb-3">
                        <Camera className="text-text-muted" />
                      </div>
                      <p className="text-sm font-bold text-text-secondary">Upload Star Rating Label</p>
                      <p className="text-[10px] text-text-muted mt-1 uppercase tracking-widest leading-none">Wait, photo clear honi chahiye!</p>
                    </>
                  )}
                </div>
              </div>

              {/* Manual Overrides */}
              <div className="space-y-6 pt-4 border-t border-border-glass">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-text-muted uppercase tracking-widest">Aapka City 📍</label>
                    <select 
                      value={manualData.city} 
                      onChange={e => handleCityChange(e.target.value)}
                      className="w-full bg-surface px-4 py-3 rounded-xl border border-border-glass outline-none focus:ring-2 focus:ring-indigo-500 appearance-none font-bold text-sm text-text-primary"
                    >
                      {Object.keys(cityRates).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-text-muted uppercase tracking-widest">Room Size (Sq Ft)</label>
                    <input 
                      type="number" 
                      value={manualData.room_size} 
                      onChange={e => setManualData({...manualData, room_size: Number(e.target.value)})}
                      className="w-full bg-surface px-4 py-3 rounded-xl border border-border-glass outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-text-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-text-muted uppercase tracking-widest">Daily Usage (Hrs)</label>
                    <input 
                      type="number" 
                      value={manualData.daily_usage_hours} 
                      onChange={e => setManualData({...manualData, daily_usage_hours: Number(e.target.value)})}
                      className="w-full bg-surface px-4 py-3 rounded-xl border border-border-glass outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-text-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-text-muted uppercase tracking-widest">Rate (₹/Unit)</label>
                    <input 
                      type="number" 
                      value={manualData.electricity_rate} 
                      onChange={e => setManualData({...manualData, electricity_rate: Number(e.target.value)})}
                      className="w-full bg-surface px-4 py-3 rounded-xl border border-border-glass outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-text-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-text-muted uppercase tracking-widest">AC Preference</label>
                    <div className="flex gap-2">
                      {['split', 'window'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setManualData({...manualData, unit_preference: type as any})}
                          className={`flex-1 py-3 rounded-xl border font-bold text-sm capitalize transition-all ${
                            manualData.unit_preference === type 
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20' 
                            : 'bg-surface border-border-glass text-text-secondary'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                </div>

                <button 
                  onClick={analyzeAC}
                  disabled={isAnalyzing}
                  className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 text-lg active:scale-95"
                >
                  {isAnalyzing ? (
                    'Processing Signal...'
                  ) : (
                    <>Ab Analysis Dekho! <Zap size={18} className="fill-white" /></>
                  )}
                </button>
              </div>
            </section>
          </div>

          {/* Right: Results Dashboard */}
          <div className="lg:col-span-7 space-y-6">
            <AnimatePresence mode="wait">
              {!results && !error && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12 bg-surface/30 border-2 border-dashed border-border-glass rounded-[3rem] space-y-4"
                >
                  <RefreshCcw size={48} className="text-text-muted opacity-30 animate-spin-slow" />
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-text-muted">Awaiting Input</h3>
                    <p className="text-sm text-text-muted">Upload a photo of your AC's BEE Star Label (usually placed on the front panel)</p>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 bg-rose-500/5 border border-rose-500/20 rounded-[2.5rem] flex items-start gap-4"
                >
                  <AlertCircle className="text-rose-500 shrink-0" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-rose-500">Arre Check Karo!</h4>
                    <p className="text-sm text-text-secondary font-medium">{error}</p>
                  </div>
                </motion.div>
              )}

              {results && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* High Level Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-text-primary text-background p-8 rounded-[2.5rem] space-y-2 relative overflow-hidden group shadow-2xl border border-border-glass">
                      <Zap className="absolute -bottom-6 -right-6 text-background/10 group-hover:text-background/20 transition-all rotate-12" size={160} />
                      <p className="text-xs font-black uppercase tracking-[0.2em] opacity-60">Estimated Monthly Bill</p>
                      <h3 className="text-5xl font-black flex items-center gap-1">
                        <IndianRupee size={32} className="text-accent" /> {results?.calculation?.monthly_bill ?? '---'}
                      </h3>
                      <div className="pt-4 space-y-1">
                        <p className="text-xs opacity-40 font-medium tracking-tight">Daily: {results?.calculation?.daily_units ?? 0} Units</p>
                        <p className="text-xs opacity-40 font-medium tracking-tight">Monthly: {results?.calculation?.monthly_units ?? 0} Units</p>
                        <p className="text-sm font-bold text-accent mt-2">Annual: ₹{results?.calculation?.annual_bill ?? 0}</p>
                      </div>
                    </div>

                    <div className="bg-indigo-600 text-white p-8 rounded-[2.5rem] space-y-2 relative overflow-hidden group shadow-2xl">
                      <TrendingDown className="absolute -bottom-6 -right-6 text-white/5 group-hover:text-white/10 transition-all rotate-12" size={160} />
                      <p className="text-xs font-black uppercase tracking-[0.2em] opacity-60">Potentially Bachta Hai</p>
                      <h3 className="text-5xl font-black flex items-center gap-1">
                        <IndianRupee size={32} className="text-emerald-400" /> {results?.comparison?.[results.comparison.length-1]?.annual_savings ?? 0}
                        <span className="text-sm font-bold opacity-40 ml-1">/year</span>
                      </h3>
                      <p className="text-xs text-indigo-100/60 font-medium leading-relaxed mt-4">
                        Agar aap 5★ Inverter AC pe switch karte hain toh yeh aapke total saal bhar ke electricity kharche pe itna discount dega! 💸
                      </p>
                    </div>
                  </div>

                  {/* Tonnage Advice */}
                  <div className="max-w-6xl mx-auto">
                    <AIDeepAnalysis 
                       onAnalyze={handleDeepAnalysis} 
                       toolName="AC Intelligence Expert" 
                    />
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-900/20 p-6 rounded-3xl flex items-start gap-4">
                    <Info className="text-amber-600 shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-amber-900 dark:text-amber-400">Sahi Tonnage Ki Salah ✅</h4>
                      <p className="text-sm text-amber-800/80 dark:text-amber-400/80 mt-1 leading-relaxed">
                        {results?.tonnage_advice}
                      </p>
                    </div>
                  </div>

                  {/* Comparison Table */}
                  <div className="glass overflow-hidden shadow-sm">
                    <div className="p-6 md:p-8 bg-surface border-b border-border-glass">
                       <h3 className="text-xl font-black italic text-text-primary">Ab dekhte hain — agar aap ek better AC lete toh kitna bachta!</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-border-glass text-[10px] uppercase font-black tracking-widest text-text-muted">
                            <th className="px-6 py-4">AC Option</th>
                            <th className="px-6 py-4">Star</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Monthly Bill</th>
                            <th className="px-6 py-4 text-right">Annual Savings</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border-glass">
                          {results.comparison?.map((row: any, i: number) => (
                            <tr key={`comp-${row.star}-${i}`} className={`group transition-all ${i === 0 ? 'bg-surface text-text-primary' : 'hover:bg-accent/5 text-text-secondary'}`}>
                              <td className="px-6 py-4 font-bold text-sm shrink-0">{row.option}</td>
                              <td className="px-6 py-4 font-bold text-amber-500">{row.star}</td>
                              <td className="px-6 py-4 text-xs font-medium text-text-muted">{row.type}</td>
                              <td className="px-6 py-4 font-bold">₹{row.monthly_bill}</td>
                              <td className="px-6 py-4 text-right">
                                {row.annual_savings > 0 ? (
                                  <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full font-bold text-[10px]">
                                    ₹{row.annual_savings} saved
                                  </span>
                                ) : (
                                  <span className="text-text-muted opacity-30">---</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-6">
                    <h3 className="text-2xl font-black italic flex items-center gap-2 px-2 text-text-primary">
                       🏆 HAMARI TOP PICKS FOR YOU
                    </h3>
                    <div className="grid grid-cols-1 gap-6">
                      {results.recommendations?.map((ac: any, i: number) => (
                        <motion.div 
                          key={`rec-${ac.model_name}-${i}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="glass p-8 rounded-[2.5rem] shadow-sm hover:border-accent/50 transition-all relative overflow-hidden group"
                        >
                          <div className="absolute top-0 right-0 px-6 py-2 bg-accent text-black font-black text-[10px] tracking-widest rounded-bl-3xl italic">
                            {ac.category}
                          </div>

                          <div className="flex flex-col md:flex-row gap-8 items-start">
                             <div className="w-20 h-20 bg-background rounded-3xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                                <Wind className="text-accent" size={32} />
                             </div>
                             <div className="flex-1 space-y-4">
                                <div>
                                   <p className="text-[10px] font-black uppercase text-accent tracking-widest italic">{ac.brand} | {ac.tonnage} Ton | {ac.star_rating} Star</p>
                                   <h4 className="text-xl font-bold tracking-tight text-text-primary">{ac.model_name}</h4>
                                </div>
                                
                                <p className="text-sm font-medium text-text-secondary leading-relaxed max-w-lg">
                                   ✅ <span className="italic">{ac.why_buy}</span>
                                </p>

                                <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                                   <p className="text-xs font-bold text-emerald-600 italic">
                                      ✨ Nerro Insight: Yeh AC agle {ac.payback_years} saal mein electricity bills se hi apni poori cost recover kar lega!
                                   </p>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                                  <div className="text-left flex-1">
                                    <p className="text-text-muted uppercase tracking-widest mb-1">Estimated Price</p>
                                    <p className="text-3xl font-black text-text-primary">~₹{ac.approx_price}</p>
                                  </div>
                                  <a 
                                    href={ac.amazon_link || '#'} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="w-full sm:w-auto px-8 py-5 bg-text-primary text-background font-black rounded-2xl shadow-xl shadow-accent/20 flex items-center justify-center gap-2 uppercase text-xs tracking-widest group"
                                  >
                                    BUY ON AMAZON <ShoppingBag size={16} className="group-hover:animate-bounce" />
                                  </a>
                                </div>
                             </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Seasonal Tips */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10">
                    <div className="space-y-6">
                       <h4 className="text-xl font-black italic flex items-center gap-2 text-text-primary">💡 PRO TIPS TO SAVE MORE</h4>
                       <div className="space-y-3">
                          {[
                            "Set temperature to 24°C (not 18°C!) — saves 6% per degree",
                            "Use sleep mode at night",
                            "Clean filter every 2 weeks in summer",
                            "Use ceiling fan with AC — allows higher temp setting",
                            "Service AC before summer (April) for 15% better efficiency"
                          ].map((tip, idx) => (
                            <div key={`tip-${tip.substring(0, 10)}-${idx}`} className="flex items-center gap-3 p-4 glass rounded-2xl shadow-sm hover:shadow-md transition-all text-sm font-bold text-text-secondary">
                               <CheckCircle2 className="text-emerald-500 shrink-0" size={16} /> {tip}
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="bg-indigo-600 text-white p-8 rounded-[3rem] space-y-6 shadow-2xl border border-white/10">
                       <h4 className="text-xl font-black italic text-white">WINDOW vs SPLIT GUIDE</h4>
                       <div className="space-y-6 text-sm">
                          <div>
                            <p className="font-black mb-2 text-indigo-300">Window AC choose karo agar:</p>
                            <ul className="space-y-1 opacity-80 list-disc list-inside">
                              <li>Budget ₹20,000 se kam hai</li>
                              <li>Choti room (up to 120 sq ft)</li>
                              <li>No outdoor unit space</li>
                              <li>Easy installation chahiye</li>
                            </ul>
                          </div>
                          <div className="h-px bg-white/20" />
                          <div>
                            <p className="font-black mb-2 text-blue-300">Split AC choose karo agar:</p>
                            <ul className="space-y-1 opacity-80 list-disc list-inside">
                              <li>Better cooling efficiency chahiye</li>
                              <li>Room 150+ sq ft hai</li>
                              <li>Noise less chahiye (very quiet)</li>
                              <li>Inverter technology chahiye</li>
                            </ul>
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Final CTA */}
                  <div className="pt-10 text-center pb-20">
                     <p className="text-text-muted font-bold mb-4 italic">🛒 Amazon pe aaj order karo — Free delivery + Easy EMI available hai!</p>
                     <button className="px-12 py-6 bg-text-primary text-background font-black rounded-3xl shadow-2xl hover:scale-[1.03] active:scale-95 transition-all text-xl uppercase tracking-widest italic group border border-border-glass">
                        Go To Amazon <ChevronRight className="inline group-hover:translate-x-2 transition-transform" />
                     </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Info Section */}
      <footer className="max-w-4xl mx-auto py-20 border-t border-border-glass">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-text-primary">Understanding BEE Labels</h4>
              <p className="text-text-secondary text-sm leading-relaxed">
                The BEE Star Label allows consumers to compare the energy efficiency of appliances. For ACs, look for the <b>ISEER</b> rating — higher is better. 
                5-star ACs are typically 20-30% more efficient than 3-star models.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-text-primary">Inverter vs Fixed Speed</h4>
              <p className="text-text-secondary text-sm leading-relaxed">
                Inverter ACs adjust their compressor speed to maintain temperature, whereas fixed speed ACs cycle on and off. 
                Inverters are significantly quieter and consume less electricity over long usage periods.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ACIntelligenceTool;
