import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'motion/react';
import { 
  Droplets, Activity, Sun, Info, Zap, 
  CheckCircle2, AlertCircle, Calendar, 
  Clock, GlassWater, Waves, Target, Sparkles
} from 'lucide-react';

import { useLanguage } from '../context/LanguageContext';

type ActivityLevel = 'low' | 'moderate' | 'high';
type Weather = 'normal' | 'hot' | 'very-hot';

const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  low: 'Low (Sedentary)',
  moderate: 'Moderate (Active)',
  high: 'High (Athlete)'
};

const WEATHER_LABELS: Record<Weather, string> = {
  normal: 'Normal (Cool)',
  hot: 'Hot (Warm)',
  'very-hot': 'Very Hot (Extreme)'
};

export default function WaterCalculator() {
  const { language, t } = useLanguage();
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [weather, setWeather] = useState<Weather>('normal');
  const [glassesDrank, setGlassesDrank] = useState(0);
  
  const [results, setResults] = useState<{
    liters: number;
    glasses: number;
    status: string;
  } | null>(null);
  
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Local Storage Persistence & Daily Reset
  useEffect(() => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem("water_date");

    if (savedDate !== today) {
      localStorage.setItem("water_date", today);
      localStorage.setItem("water_drank", "0");
      setGlassesDrank(0);
    } else {
      const savedWater = localStorage.getItem("water_drank");
      if (savedWater) setGlassesDrank(Number(savedWater));
    }
  }, []);

  const updateGlasses = (newValue: number) => {
    setGlassesDrank(newValue);
    localStorage.setItem("water_drank", newValue.toString());
  };

  const addGlass = () => {
    if (results && glassesDrank < results.glasses) {
      updateGlasses(glassesDrank + 1);
    }
  };

  const removeGlass = () => {
    if (glassesDrank > 0) {
      updateGlasses(glassesDrank - 1);
    }
  };

  const calculateWater = async () => {
    const w = parseFloat(weight);
    if (!w || w <= 0) return;

    setIsCalculating(true);
    setAiAnalysis(null);
    setError(null);

    const inputData = { 
      weight: w, 
      activity, 
      climate: weather === 'very-hot' ? 'hot' : weather 
    };

    try {
      const response = await fetch('/api/tool/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          toolId: 'water-calculator', 
          inputData,
          skipAnalysis: true
        }),
      });

      if (!response.ok) throw new Error('Failed to calculate on server');

      const data = await response.json();
      setResults({
        liters: data.liters,
        glasses: data.glasses,
        status: 'Optimal'
      });
    } catch (err) {
      console.error('Failed to execute water tool on backend', err);
      setError("### ❌ Processing failed\nWe're experiencing issues connecting to our backend or AI providers.");
    } finally {
      setIsCalculating(false);
    }
  };

  const generateAIAnalysis = async () => {
    if (!results) return;
    
    setIsAiAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tool: 'Water Intake Calculator', 
          data: {
            weight,
            activity,
            weather,
            results
          }
        }),
      });

      if (!response.ok) throw new Error('Failed to generate AI analysis');

      const data = await response.json();
      setAiAnalysis(data.analysis);
    } catch (err) {
      console.error('AI Analysis failed', err);
      setError("### ❌ AI Analysis failed\nWe're experiencing issues connecting to our AI providers.");
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const progress = results ? Math.min((glassesDrank / results.glasses) * 100, 100) : 0;

  return (
    <div className="space-y-8 relative">
      {/* Input Section */}
      <div className="glass p-8 rounded-2xl border border-border-glass relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Droplets size={120} className="text-blue-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
          <Droplets className="text-blue-500" />
          {t('water.title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                <Activity size={14} /> {t('water.weight')}
              </label>
              <input 
                type="number" 
                value={weight} 
                onChange={e => setWeight(e.target.value)} 
                placeholder="e.g. 70" 
                className="w-full bg-background/50 border border-border-glass rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-blue-500 transition-colors" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                <Activity size={14} /> {t('water.activity')}
              </label>
              <select 
                value={activity} 
                onChange={e => setActivity(e.target.value as ActivityLevel)}
                className="w-full bg-background/50 border border-border-glass rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
              >
                {Object.entries(ACTIVITY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                <Sun size={14} /> {t('water.weather')}
              </label>
              <select 
                value={weather} 
                onChange={e => setWeather(e.target.value as Weather)}
                className="w-full bg-background/50 border border-border-glass rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
              >
                {Object.entries(WEATHER_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button 
          onClick={calculateWater} 
          className="w-full mt-8 bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2"
        >
          <Zap size={18} /> {t('calc.button.water')}
        </button>
      </div>

      {/* Results Section */}
      {results && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Visual Water Tracker */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 glass p-8 rounded-2xl border border-blue-500/20 flex flex-col items-center justify-center relative overflow-hidden">
              {/* Floating Bubbles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={`bubble-${i}`}
                    className="absolute bg-white/20 rounded-full"
                    style={{
                      width: Math.random() * 10 + 5,
                      height: Math.random() * 10 + 5,
                      left: `${Math.random() * 100}%`,
                      bottom: '-20px'
                    }}
                    animate={{
                      y: [-20, -300],
                      opacity: [0, 1, 0],
                      x: [0, (Math.random() - 0.5) * 50]
                    }}
                    transition={{
                      duration: Math.random() * 3 + 2,
                      repeat: Infinity,
                      delay: Math.random() * 5
                    }}
                  />
                ))}
              </div>

              {/* 3D Wave System Container */}
              <div className={`relative w-48 h-48 rounded-full overflow-hidden border-4 transition-all duration-500 ${progress === 100 ? 'border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.5)]' : 'border-white/20 shadow-[0_0_20px_rgba(59,130,246,0.3)]'}`}>
                {/* Water Level */}
                <motion.div
                  className="absolute bottom-0 left-0 w-full bg-blue-500 transition-all duration-700 ease-in-out"
                  style={{ height: `${progress}%` }}
                >
                  {/* Wave Layer 1 */}
                  <div className="wave wave1"></div>
                  {/* Wave Layer 2 */}
                  <div className="wave wave2"></div>
                </motion.div>

                {/* Percentage Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-bold z-10">
                  <span className="text-3xl font-black">{Math.round(progress)}%</span>
                  <span className="text-[0.6rem] uppercase tracking-widest opacity-80">{language === 'hi' ? 'हाइड्रेटेड' : 'Hydrated'}</span>
                </div>
              </div>

              <div className="mt-8 flex flex-col items-center gap-4">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={removeGlass}
                    className="w-12 h-12 rounded-full glass border border-blue-500/30 flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition-all active:scale-90"
                  >
                    -
                  </button>
                  <div className="text-center">
                    <p className="text-2xl font-black text-text-primary">{glassesDrank}/{results.glasses}</p>
                    <p className="text-[0.6rem] text-text-muted uppercase tracking-widest">{t('water.glasses_drank')}</p>
                  </div>
                  <button 
                    onClick={addGlass}
                    className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-500 transition-all active:scale-90 shadow-lg"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs font-mono text-blue-400">
                  {results.glasses - glassesDrank > 0 
                    ? `${results.glasses - glassesDrank} ${t('water.glasses_remaining')}` 
                    : t('water.goal_achieved')}
                </p>
              </div>
            </div>

            <div className="lg:col-span-2 glass p-8 rounded-2xl border border-border-glass">
              <h3 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
                <GlassWater size={20} className="text-blue-500" />
                {t('water.live_tracker')}
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
                {Array.from({ length: results.glasses }).map((_, i) => (
                  <motion.div 
                    key={`glass-${i}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`aspect-[3/4] glass rounded-lg border flex items-end p-1 overflow-hidden transition-all duration-500 ${i < glassesDrank ? 'border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'border-blue-500/10'}`}
                  >
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: i < glassesDrank ? '100%' : '0%' }}
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-sm" 
                    />
                  </motion.div>
                ))}
              </div>
              <p className="text-[0.65rem] text-text-muted mt-6 uppercase tracking-widest text-center">{t('water.tracker_hint')}</p>
            </div>
          </div>

          {/* Deep Result Engine */}
          <div className="glass p-8 rounded-2xl border border-border-glass">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-border-glass">
              <div>
                <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                  <Info className="text-blue-500" size={20} />
                  {t('water.intelligence')}
                </h3>
                <p className="text-text-secondary mt-1">{t('water.status')}: <span className="text-blue-500 font-bold">{t('water.optimal')}</span></p>
              </div>
              <div className="mt-4 md:mt-0 px-4 py-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p className="text-[0.65rem] font-mono text-blue-500 uppercase tracking-widest">{t('water.daily_intake')}</p>
                <p className="text-lg font-black text-text-primary">{results.liters} {language === 'hi' ? 'लीटर' : 'Liters'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div>
                  <h4 className="font-bold text-text-primary flex items-center gap-2 mb-3">
                    <Waves className="w-5 h-5 text-blue-500" /> {t('water.meaning')}
                  </h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {language === 'hi' 
                      ? `पानी सभी चयापचय प्रक्रियाओं के लिए प्राथमिक उत्प्रेरक है। ${results.liters}L पर, आप यह सुनिश्चित कर रहे हैं कि आपके सेलुलर कार्य, पोषक तत्व परिवहन और तापमान विनियमन चरम दक्षता पर काम कर रहे हैं।`
                      : `Water is the primary catalyst for all metabolic processes. At ${results.liters}L, you are ensuring that your cellular functions, nutrient transport, and temperature regulation are operating at peak efficiency.`
                    }
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-text-primary flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" /> {t('water.benefits')}
                  </h4>
                  <ul className="space-y-2">
                    {(language === 'hi' 
                      ? ['दिन भर ऊर्जा का स्तर बना रहता है', 'बेहतर पाचन क्रिया और आंतों का स्वास्थ्य', 'प्राकृतिक त्वचा की चमक और विषहरण', 'थर्मोजेनेसिस के माध्यम से वजन घटाने में सहायता', 'चरम संज्ञानात्मक और मस्तिष्क प्रदर्शन']
                      : ['Sustained energy levels throughout the day', 'Enhanced digestive function and gut health', 'Natural skin glow and detoxification', 'Supports fat loss through thermogenesis', 'Peak cognitive and brain performance']
                    ).map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="text-blue-500 mt-1">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-text-primary flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-red-500" /> {t('water.risks')}
                  </h4>
                  <ul className="space-y-2">
                    {(language === 'hi'
                      ? ['पुराना थकान और दोपहर में ऊर्जा की कमी', 'बार-बार सिरदर्द और मानसिक धुंधलापन', 'खराब फोकस और कम प्रतिक्रिया समय', 'धीमी चयापचय दर और वजन रुकना']
                      : ['Chronic fatigue and afternoon energy crashes', 'Frequent headaches and mental fog', 'Poor focus and reduced reaction time', 'Slowed metabolic rate and weight plateaus']
                    ).map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="text-red-500 mt-1">×</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="font-bold text-text-primary flex items-center gap-2 mb-3">
                    <Clock className="w-5 h-5 text-yellow-500" /> {t('water.plan')}
                  </h4>
                  <ul className="space-y-2">
                    {(language === 'hi'
                      ? ['जागने के तुरंत बाद 500ml पानी पिएं', 'हर भोजन से 30 मिनट पहले हाइड्रेट करें', 'व्यायाम के दौरान और बाद में सेवन बढ़ाएं', 'लगातार पानी पिएं, एक बार में बहुत ज्यादा नहीं']
                      : ['Drink 500ml immediately upon waking', 'Hydrate 30 mins before every meal', 'Increase intake during and after exercise', 'Sip water consistently, do not chug']
                    ).map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="text-blue-500 mt-1">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-text-primary flex items-center gap-2 mb-3">
                    <Calendar className="w-5 h-5 text-purple-500" /> {t('water.schedule')}
                  </h4>
                  <ul className="space-y-3">
                    {(language === 'hi'
                      ? [
                          { time: 'सुबह', desc: '2-3 गिलास (जागने के बाद और नाश्ते से पहले)' },
                          { time: 'दोपहर', desc: '4-5 गिलास (काम और दोपहर के भोजन के बाद)' },
                          { time: 'शाम', desc: '2-3 गिलास (रात के खाने से पहले और वर्कआउट)' },
                          { time: 'रात', desc: '1 गिलास (सोने से 1 घंटा पहले)' }
                        ]
                      : [
                          { time: 'Morning', desc: '2-3 Glasses (Wake up & Pre-breakfast)' },
                          { time: 'Afternoon', desc: '4-5 Glasses (Work & Post-lunch)' },
                          { time: 'Evening', desc: '2-3 Glasses (Pre-dinner & Workout)' },
                          { time: 'Night', desc: '1 Glass (1 hour before bed)' }
                        ]
                    ).map((item, i) => (
                      <li key={`schedule-${item.time}-${i}`} className="text-sm">
                        <span className="font-bold text-text-primary">{item.time}:</span>
                        <span className="text-text-secondary ml-2">{item.desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-text-primary flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-orange-500" /> {t('water.tips')}
                  </h4>
                  <ul className="space-y-2">
                    {(language === 'hi'
                      ? ['हर जगह 1L की बोतल साथ रखें', 'पानी पीने के लिए हर घंटे का रिमाइंडर सेट करें', 'अवशोषण के लिए इलेक्ट्रोलाइट्स या समुद्री नमक मिलाएं', 'तरबूज जैसे पानी से भरपूर फल खाएं']
                      : ['Carry a reusable 1L bottle everywhere', 'Set hourly phone reminders to sip', 'Add electrolytes or sea salt for absorption', 'Eat water-rich fruits like watermelon']
                    ).map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="text-blue-500 mt-1">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-10 p-5 bg-blue-500/10 rounded-xl border border-blue-500/20 flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Zap className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-[0.65rem] text-text-secondary font-bold uppercase tracking-widest">{t('water.habit_trigger')}</p>
                <p className="text-text-primary font-medium italic">{t('water.habit_text')}</p>
              </div>
            </div>
          </div>

        </motion.div>
      )}
      
      <style>{`
        @keyframes wave {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .wave {
          position: absolute;
          width: 200%;
          height: 200%;
          top: -150%;
          left: -50%;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 40%;
          animation: wave 6s infinite linear;
          pointer-events: none;
        }
        .wave2 {
          animation-duration: 10s;
          opacity: 0.5;
          border-radius: 35%;
        }
      `}</style>
    </div>
  );
}
