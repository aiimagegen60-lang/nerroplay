import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Moon, 
  Sun, 
  Star, 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  ChevronRight,
  Zap,
  Info,
  Table as TableIcon,
  ShieldCheck,
  Trophy,
  Heart,
  Briefcase,
  Activity,
  ArrowRight,
  Share2,
  Download
} from 'lucide-react';
import AIDeepAnalysis from './AIDeepAnalysis';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import { useTheme } from '../context/ThemeContext';

// Simplified Astrology Logic
const ZODIAC_SIGNS = [
  { name: 'Aries (Mesha)', symbol: '♈', start: '03-21', end: '04-19', planet: 'Mars' },
  { name: 'Taurus (Vrishabha)', symbol: '♉', start: '04-20', end: '05-20', planet: 'Venus' },
  { name: 'Gemini (Mithuna)', symbol: '♊', start: '05-21', end: '06-20', planet: 'Mercury' },
  { name: 'Cancer (Karka)', symbol: '♋', start: '06-21', end: '07-22', planet: 'Moon' },
  { name: 'Leo (Simha)', symbol: '♌', start: '07-23', end: '08-22', planet: 'Sun' },
  { name: 'Virgo (Kanya)', symbol: '♍', start: '08-23', end: '09-22', planet: 'Mercury' },
  { name: 'Libra (Tula)', symbol: '♎', start: '09-23', end: '10-22', planet: 'Venus' },
  { name: 'Scorpio (Vrischika)', symbol: '♏', start: '10-23', end: '11-21', planet: 'Mars' },
  { name: 'Sagittarius (Dhanu)', symbol: '♐', start: '11-22', end: '12-21', planet: 'Jupiter' },
  { name: 'Capricorn (Makara)', symbol: '♑', start: '12-22', end: '01-19', planet: 'Saturn' },
  { name: 'Aquarius (Kumbha)', symbol: '♒', start: '01-20', end: '02-18', planet: 'Saturn' },
  { name: 'Pisces (Meena)', symbol: '♓', start: '02-19', end: '03-20', planet: 'Jupiter' },
];

const KundliChart = ({ planets }: { planets: any[] }) => {
  return (
    <div className="relative w-full aspect-square max-w-sm mx-auto bg-surface border-2 border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl p-4 transition-colors duration-300">
      <svg viewBox="0 0 400 400" className="w-full h-full stroke-amber-500/50 dark:stroke-amber-500/30 fill-none stroke-[2]">
        <rect x="0" y="0" width="400" height="400" />
        <line x1="0" y1="0" x2="400" y2="400" />
        <line x1="200" y1="0" x2="0" y2="200" />
        <line x1="0" y1="200" x2="200" y2="400" />
        <line x1="200" y1="400" x2="400" y2="200" />
        <line x1="400" y1="200" x2="200" y2="0" />
        <line x1="0" y1="400" x2="400" y2="0" />
      </svg>
      {/* Lagna (H1) */}
      <div className="absolute top-[25%] left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <span className="text-[8px] block text-text-muted opacity-60 font-black">Lagna (H1)</span>
        <div className="flex flex-wrap justify-center gap-1 mt-1">
          {planets.slice(0, 2).map((p, i) => (
             <span key={i} className="text-[8px] font-black bg-amber-500 text-white px-1 rounded uppercase">{p.name.substring(0,2)}</span>
          ))}
        </div>
      </div>
      {/* House 4 */}
      <div className="absolute top-1/2 left-[15%] -translate-y-1/2 text-center pointer-events-none">
        <span className="text-[8px] block text-text-muted opacity-60 font-black">H4</span>
        <div className="flex flex-wrap justify-center gap-1 mt-1">
          {planets.slice(2, 4).map((p, i) => (
             <span key={i} className="text-[8px] font-black bg-indigo-500 text-white px-1 rounded uppercase">{p.name.substring(0,2)}</span>
          ))}
        </div>
      </div>
      {/* House 7 */}
      <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <span className="text-[8px] block text-text-muted opacity-60 font-black">H7</span>
        <div className="flex flex-wrap justify-center gap-1 mt-1">
           {planets.slice(4, 5).map((p, i) => (
             <span key={i} className="text-[8px] font-black bg-rose-500 text-white px-1 rounded uppercase">{p.name.substring(0,2)}</span>
          ))}
        </div>
      </div>
      {/* House 10 */}
      <div className="absolute top-1/2 right-[15%] -translate-y-1/2 text-center pointer-events-none">
        <span className="text-[8px] block text-text-muted opacity-60 font-black">H10</span>
        <div className="flex flex-wrap justify-center gap-1 mt-1">
           {planets.slice(5, 7).map((p, i) => (
             <span key={i} className="text-[8px] font-black bg-emerald-500 text-white px-1 rounded uppercase">{p.name.substring(0,2)}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu",
  "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta",
  "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha",
  "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
  "Uttara Bhadrapada", "Revati"
];

const KundliTool = () => {
  // Theme Management
  const { theme, toggleTheme } = useTheme();

  // Inputs
  const [formData, setFormData] = useState({
    name: '',
    dob: '1995-06-15',
    tob: '12:00',
    pob: 'New Delhi'
  });

  // UI State
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Deterministic Astrology Engine
  const astrologyData = useMemo(() => {
    if (!formData.dob) return null;

    const date = new Date(formData.dob);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    // 1. Calculate Zodiac
    const dateStr = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const zodiac = ZODIAC_SIGNS.find(z => {
      if (z.start <= z.end) {
        return dateStr >= z.start && dateStr <= z.end;
      } else {
        // Handle Capricorn overflow
        return dateStr >= z.start || dateStr <= z.end;
      }
    }) || ZODIAC_SIGNS[0];

    // 2. Approximate Nakshatra (Simplified logic based on birth month/day segmentation)
    const dayOfYear = Math.floor((date.getTime() - new Date(year, 0, 0).getTime()) / 86400000);
    const nakshatraIndex = Math.floor((dayOfYear / 365) * NAKSHATRAS.length) % NAKSHATRAS.length;
    const nakshatra = NAKSHATRAS[nakshatraIndex];

    // 3. Planet Mapping (Mock structured logic for demonstration)
    const planets = [
      { name: 'Sun', sign: ZODIAC_SIGNS[(month + 2) % 12].name, degree: (day * 1.2).toFixed(1) + '°', quality: 'Strong' },
      { name: 'Moon', sign: ZODIAC_SIGNS[(day % 12)].name, degree: ((year % 30) + 2).toFixed(1) + '°', quality: 'Balanced' },
      { name: 'Mars', sign: ZODIAC_SIGNS[(month * 2) % 12].name, degree: (day / 2).toFixed(1) + '°', quality: day % 2 === 0 ? 'Exalted' : 'Average' },
      { name: 'Mercury', sign: zodiac.name, degree: (day + 5).toFixed(1) + '°', quality: 'Sharp' },
      { name: 'Jupiter', sign: ZODIAC_SIGNS[(year % 12)].name, degree: '12.4°', quality: 'Divine' },
      { name: 'Venus', sign: ZODIAC_SIGNS[(month + 5) % 12].name, degree: '18.9°', quality: 'Radiant' },
      { name: 'Saturn', sign: ZODIAC_SIGNS[(year % 30) % 12].name, degree: '24.1°', quality: 'Karmic' }
    ];

    // 4. Dosha Check
    const isManglik = (day % 4 === 0) ? 'Yes' : 'No';
    const rahuInfluence = (month % 2 === 0) ? 'High' : 'Low';
    const sadeSati = (year % 3 === 0) ? 'Peak' : (year % 5 === 0 ? 'Start' : 'Not Active');
    
    // 5. Scoring (Audit Score)
    const karmaScore = Math.floor(60 + (day % 40));
    
    // 6. Overall Status
    const status = isManglik === 'Yes' ? 'Vigyan (Alert)' : 'Shubh (Propitious)';
    const insight = isManglik === 'Yes' 
      ? 'Mars dominates your Lagna. Career boost milega par personal life mein "heat" handle karni hogi.' 
      : 'Panch Mahapurush Yoga ka asar hai. Luck is on your side, but hard work (Shram) is needed.';

    return {
      zodiac,
      nakshatra,
      planets,
      isManglik,
      rahuInfluence,
      sadeSati,
      karmaScore,
      status,
      insight
    };
  }, [formData.dob]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.dob) {
      setShowResults(true);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  const handleDeepAnalysis = async () => {
    if (!astrologyData) return "";
    const response = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tool: 'Kundli Super Tool',
        data: {
          userName: formData.name,
          zodiac: astrologyData?.zodiac.name,
          nakshatra: astrologyData?.nakshatra,
          isManglik: astrologyData?.isManglik,
          karmaScore: astrologyData?.karmaScore,
          sadeSati: astrologyData?.sadeSati,
          planets: astrologyData?.planets
        }
      }),
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data.analysis;
  };

  // Feedback State
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleShare = async () => {
    if (!astrologyData) return;

    const shareText = `Check out my Kundli on NerroPlay!\n\nName: ${formData.name}\nZodiac: ${astrologyData.zodiac.name}\nNakshatra: ${astrologyData.nakshatra}\nKarma Score: ${astrologyData.karmaScore}/100\nStatus: ${astrologyData.status}\n\nGenerated by NerroPlay Kundli Super Tool.`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Janam Kundli | NerroPlay',
          text: shareText,
          url: 'https://nerroplay.online?tool=kundli'
        });
        setFeedback('Shared successfully!');
      } else {
        await navigator.clipboard.writeText(shareText);
        setFeedback('Kundli details copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
      // Fallback to clipboard if share fails (e.g. in iframe)
      try {
        await navigator.clipboard.writeText(shareText);
        setFeedback('Copied to clipboard (Share unavailable)');
      } catch (clipErr) {
        setFeedback('Failed to share or copy.');
      }
    }
  };

  const handleDownloadPDF = async () => {
    if (!resultsRef.current || !astrologyData) {
      setFeedback('Error: Results not found');
      return;
    }

    setFeedback('Generating PDF...');
    const btn = document.getElementById('download-btn');
    const shareBtn = btn?.previousElementSibling as HTMLElement;
    if (btn) btn.style.visibility = 'hidden';
    if (shareBtn) shareBtn.style.visibility = 'hidden';

    try {
      const canvas = await html2canvas(resultsRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
        logging: false,
        windowWidth: 1200 // Ensure wide enough capture
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Kundli_${formData.name.replace(/\s+/g, '_')}.pdf`);
      setFeedback('PDF Downloaded!');
    } catch (err) {
      console.error('PDF generation error:', err);
      setFeedback('PDF Generation Failed.');
    } finally {
      if (btn) btn.style.visibility = 'visible';
      if (shareBtn) shareBtn.style.visibility = 'visible';
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-500 bg-background text-text-primary pb-20">
      <div className="max-w-6xl mx-auto px-6 pt-10 space-y-12">
        
        {/* Header & Theme Toggle */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              Kundli <span className="text-amber-500">Super Tool</span>
            </h1>
            <p className="text-text-secondary font-medium">
              Vedic Astrology meets AI Intelligence.
            </p>
          </div>
        </header>

        {/* Input Section */}
        <section className="glass p-8 md:p-10 transition-colors duration-300">
          <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
                <User size={14} /> Full Name
              </label>
              <input 
                type="text" required placeholder="Enter name"
                className="w-full bg-background border border-border-glass rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500 transition-all text-text-primary"
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
                <Calendar size={14} /> DOB
              </label>
              <input 
                type="date" required
                className="w-full bg-background border border-border-glass rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500 transition-all text-text-primary"
                value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
                <Clock size={14} /> Time
              </label>
              <input 
                type="time" required
                className="w-full bg-background border border-border-glass rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500 transition-all text-text-primary"
                value={formData.tob} onChange={e => setFormData({...formData, tob: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
                <MapPin size={14} /> Place
              </label>
              <input 
                type="text" required placeholder="Birth city"
                className="w-full bg-background border border-border-glass rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500 transition-all text-text-primary"
                value={formData.pob} onChange={e => setFormData({...formData, pob: e.target.value})}
              />
            </div>

            <div className="lg:col-span-4 pt-4">
              <button 
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 text-lg"
              >
                Generate Kundli <Zap size={20} className="fill-white" />
              </button>
            </div>
          </form>
        </section>

        {/* Results Section */}
        <AnimatePresence>
          {showResults && astrologyData && (
            <motion.div 
              ref={resultsRef}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12 pb-20"
            >
              {/* Top Bento Row: Chart & Core Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Visual Chart */}
                <div className="lg:col-span-12 space-y-6">
                  <div className="bg-surface border border-border-glass p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group transition-colors duration-300">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-45 transition-transform">
                       <MapPin size={120} />
                    </div>
                    <h2 className="text-xl font-black mb-8 flex items-center gap-2">
                       <Sparkles className="text-amber-500" size={20} /> Vedic Chart View
                    </h2>
                    <KundliChart planets={astrologyData.planets} />
                    <div className="mt-8 flex justify-center gap-4">
                       <div className="flex items-center gap-2 text-[10px] font-black uppercase text-text-muted">
                          <div className="w-2 h-2 rounded-full bg-amber-500" /> Benefic
                       </div>
                       <div className="flex items-center gap-2 text-[10px] font-black uppercase text-text-muted">
                          <div className="w-2 h-2 rounded-full bg-indigo-500" /> Malefic
                       </div>
                    </div>
                  </div>
                </div>

                {/* Core Stats Bento */}
                <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Karma Audit */}
                  <div className="bg-slate-900 dark:bg-slate-950 text-white p-8 rounded-[2.5rem] relative overflow-hidden group border border-white/5 dark:border-slate-800">
                    <Activity className="absolute -bottom-6 -right-6 text-white/5 rotate-12 transition-all group-hover:scale-110" size={160} />
                    <p className="text-xs font-black uppercase tracking-[0.2em] opacity-60">Karma Audit Score</p>
                    <div className="flex items-end gap-2 mt-2">
                      <h3 className="text-6xl font-black">{astrologyData.karmaScore}</h3>
                      <span className="text-amber-500 font-black text-xl mb-2">/100</span>
                    </div>
                    <p className="text-sm font-medium mt-4 text-text-muted">Higher score indicates strong past life merits (Punya).</p>
                  </div>

                  {/* Sade Sati Status */}
                  <div className={`p-8 rounded-[2.5rem] relative overflow-hidden border ${
                    astrologyData.sadeSati === 'Peak' 
                      ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' 
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                  }`}>
                    <ShieldCheck className="absolute -bottom-4 -right-4 opacity-10" size={120} />
                    <p className="text-xs font-black uppercase tracking-[0.2em] opacity-60">Sade Sati Phase</p>
                    <h3 className="text-4xl font-black mt-2">{astrologyData.sadeSati}</h3>
                    <p className="text-xs font-bold mt-4 leading-relaxed">
                      {astrologyData.sadeSati === 'Peak' ? 'Shani Dev is testing you. Patience is luxury.' : 'Clear skies. Shani Dev is neutral. Full speed ahead!'}
                    </p>
                  </div>

                  {/* Rashi & Nakshatra */}
                  <div className="bg-surface border border-border-glass p-8 rounded-[2.5rem] space-y-6 transition-colors duration-300">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-2xl">
                          {astrologyData.zodiac.symbol}
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Moon Sign</p>
                          <h4 className="text-xl font-black text-amber-500">{astrologyData.zodiac.name}</h4>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                          <Star className="text-indigo-500" size={24} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nakshatra</p>
                          <h4 className="text-xl font-black text-indigo-500">{astrologyData.nakshatra}</h4>
                        </div>
                     </div>
                  </div>

                  {/* Status/Insight */}
                  <div className="bg-amber-500 text-white p-8 rounded-[2.5rem] shadow-xl shadow-amber-500/20">
                    <div className="flex items-center gap-2 mb-4">
                      <Zap size={16} className="fill-white" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Aura Insight</span>
                    </div>
                    <h4 className="text-2xl font-black italic">{astrologyData.status}</h4>
                    <p className="text-sm font-bold mt-3 leading-relaxed opacity-90">{astrologyData.insight}</p>
                  </div>
                </div>

                <div className="lg:col-span-12">
                   <AIDeepAnalysis 
                     onAnalyze={handleDeepAnalysis} 
                     toolName="Kundli Super Tool" 
                   />
                </div>
              </div>

              {/* Planet Table Grid */}
              <div className="bg-surface p-10 rounded-[3rem] border border-border-glass transition-colors duration-300">
                <div className="flex items-center justify-between mb-10">
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black flex items-center gap-3">
                       <TableIcon className="text-amber-500" /> Graham Sthiti
                    </h2>
                    <p className="text-sm text-text-secondary font-medium italic">Planetary positions impacting your lifeline.</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-border-glass text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                        <th className="pb-6 px-4">Graha (Planet)</th>
                        <th className="pb-6 px-4">Raashi (Sign)</th>
                        <th className="pb-6 px-4">Ansh (Degree)</th>
                        <th className="pb-6 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-glass">
                      {astrologyData.planets.map((p, i) => (
                        <tr key={i} className="group hover:bg-surface/50 transition-all">
                          <td className="py-6 px-4 font-black text-lg">{p.name}</td>
                          <td className="py-6 px-4 font-bold text-text-secondary">{p.sign}</td>
                          <td className="py-6 px-4 font-mono text-text-muted">{p.degree}</td>
                          <td className="py-6 px-4">
                             <span className="px-3 py-1 rounded-full bg-background border border-border-glass text-[10px] font-black uppercase tracking-widest text-text-muted">
                                {p.quality}
                             </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Status & Insight Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-10 rounded-[2rem] bg-indigo-600 text-white space-y-4 shadow-xl shadow-indigo-600/20">
                  <h4 className="text-sm font-black uppercase tracking-widest opacity-80">Current Status</h4>
                  <p className="text-4xl font-black">{astrologyData.status}</p>
                  <p className="text-indigo-100 leading-relaxed font-medium">
                    {astrologyData.insight}
                  </p>
                </div>
                <div className="p-10 rounded-[2rem] bg-surface border border-border-glass space-y-4 transition-colors duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <Info className="text-amber-500" />
                    <h4 className="font-black uppercase tracking-widest text-text-muted">Celestial Tip</h4>
                  </div>
                  <p className="text-lg font-bold">Actionable Guidance:</p>
                  <p className="text-text-secondary leading-relaxed">
                    {astrologyData.isManglik === 'Yes' 
                      ? "Consider reciting Hanuman Chalisa daily to balance the Martian energy. Focus on meditation before taking major life decisions."
                      : "Your moon alignment is perfect for creative ventures. This month is ideal for starting new financial habits or investments."
                    }
                  </p>
                </div>
              </div>

              {/* Final CTA Card */}
              <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 rounded-[3rem] p-10 md:p-16 text-white overflow-hidden relative group">
                <Sparkles className="absolute -top-10 -left-10 text-white/10 rotate-12" size={300} />
                <div className="relative z-10 text-center space-y-8 max-w-2xl mx-auto">
                   <h2 className="text-4xl md:text-5xl font-black italic tracking-tight">Your Destiny is in your hands!</h2>
                   <p className="text-lg font-bold text-amber-100 italic">"Grah-Nakshtra rasta dikhate hain, par manjil aap khud tay karte ho."</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 relative">
                       <AnimatePresence>
                         {feedback && (
                           <motion.div 
                             initial={{ opacity: 0, y: 10 }}
                             animate={{ opacity: 1, y: 0 }}
                             exit={{ opacity: 0, y: -10 }}
                             className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-black text-white text-xs font-bold rounded-full border border-white/20 whitespace-nowrap z-50 shadow-2xl"
                           >
                             {feedback}
                           </motion.div>
                         )}
                       </AnimatePresence>
                       <button 
                         onClick={handleShare}
                         className="px-10 py-5 bg-background text-amber-600 font-black rounded-2xl shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 text-lg border border-border-glass"
                       >
                         Share Your Kundli <Share2 size={20} />
                       </button>
                       <button 
                         id="download-btn"
                         onClick={handleDownloadPDF}
                         className="px-10 py-5 bg-black/20 backdrop-blur-md border border-white/20 text-white font-black rounded-2xl hover:bg-black/30 transition-all flex items-center justify-center gap-2 text-lg"
                       >
                         Download PDF <Download size={20} />
                       </button>
                    </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default KundliTool;
