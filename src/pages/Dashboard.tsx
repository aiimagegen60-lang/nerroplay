import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  TrendingDown, 
  Droplets, 
  Moon, 
  Zap, 
  Target, 
  Plus, 
  ChevronRight, 
  Award, 
  Flame,
  LayoutGrid,
  Heart,
  Scale,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { Link } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';
import { useLanguage } from '../context/LanguageContext';
import ReactMarkdown from 'react-markdown';
import HealthRiskAnalyzer from '../components/HealthRiskAnalyzer';

export default function Dashboard() {
  const { state, updateDaily, updateMetrics } = useDashboard();
  const [isLoggedIn] = useState(false); // Simulate login

  if (!isLoggedIn) {
     return (
       <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center glass border border-border-glass rounded-[3rem] mt-20 mx-4">
          <Helmet>
            <title>User Dashboard | NerroPlay</title>
            <meta name="description" content="Manage your health metrics, tool usage, and AI-driven wellness insights from your personal dashboard." />
          </Helmet>
          <h2 className="text-4xl font-black text-text-primary mb-6">Login Required</h2>
          <p className="text-text-muted mb-8 text-lg">Please log in to access your professional-grade dashboard.</p>
          <div className="px-6 py-3 bg-accent/10 rounded-2xl border border-accent/20 text-accent font-bold">Login system integration active soon.</div>
       </div>
     );
  }

  if (!state.onboarded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center glass border border-border-glass rounded-[3rem] space-y-6 mt-20 mx-4">
        <Helmet>
          <title>Complete Onboarding | NerroPlay Dashboard</title>
        </Helmet>
        <h2 className="text-4xl font-black text-text-primary">Complete Your Onboarding</h2>
        <p className="text-text-muted max-w-lg text-lg">Please use at least one of our professional health tools to generate your initial metrics data before accessing the full dashboard capabilities.</p>
        <Link to="/tools" className="px-8 py-4 bg-accent text-white rounded-2xl font-bold hover:opacity-90 transition-all">Explore Tools & Generate Metrics</Link>
      </div>
    );
  }

  const { t } = useLanguage();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];
  const todayData = state.daily[today] || {
    date: today,
    water: 0,
    calories: 0,
    sleep: 0,
    workout: false
  };

  // Calculate Health Score (Mock logic for now based on metrics)
  const calculateHealthScore = () => {
    // 0-100 logic
    let score = 85; 
    return score;
  };

  const healthScore = calculateHealthScore();

  // Added for tracking tool usage
  const [usedTools, setUsedTools] = useState<Set<string>>(new Set());

  // Mocking user session for tool tracking - in a real app this would come from a database or context
  useEffect(() => {
    // Check local storage for used tools
    const savedUsedTools = localStorage.getItem('usedTools');
    if (savedUsedTools) {
      setUsedTools(new Set(JSON.parse(savedUsedTools)));
    }
  }, []);

  const getAIInsight = async () => {
    // Condition: All related tools must be used for deep analysis
    const requiredTools = ['weight-loss-planner', 'nutrition-planner', 'sleep-recovery', 'heart-rate-calculator'];
    const allUsed = requiredTools.every(tool => usedTools.has(tool));
    
    if (!allUsed) {
        setAiInsight("### ⚠️ Analysis Locked\nPlease use all health tools (Weight Loss Planner, Nutrition Planner, Sleep & Recovery, Heart Rate Tool) to unlock your deep metabolic and wellness analysis.");
        return;
    }

    setIsAnalyzing(true);
    setAiInsight(null); // Clear previous output
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'DashboardInsight',
          data: {
            metrics: state.metrics,
            goals: state.goals,
            today: todayData
          }
        })
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setAiInsight(data.analysis);
    } catch (error) {
      console.error('Failed to fetch AI insight', error);
      setAiInsight("### ❌ AI Analysis failed\nWe're experiencing issues connecting to our AI providers. Please check your connection or try again in a few moments.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const weightProgressData = [
    { day: 'Mon', weight: 75.5 },
    { day: 'Tue', weight: 75.2 },
    { day: 'Wed', weight: 74.8 },
    { day: 'Thu', weight: 74.5 },
    { day: 'Fri', weight: 74.2 },
    { day: 'Sat', weight: 74.0 },
    { day: 'Sun', weight: 73.8 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 pb-32">
      <Helmet>
        <title>User Dashboard | NerroPlay</title>
        <meta name="description" content="Manage your health metrics, tool usage, and AI-driven wellness insights from your personal dashboard." />
      </Helmet>
      {/* 🧠 Overview Panel */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black text-text-primary tracking-tight">Welcome Back, Champion!</h1>
            <p className="text-text-muted font-mono text-sm tracking-widest uppercase mt-1">Today is {new Date().toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-3 px-6 py-2 bg-accent/20 border border-accent/30 rounded-full text-accent font-bold animate-pulse">
            <Flame size={20} fill="currentColor" />
            <span>7 Day Streak🔥</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard 
            icon={<Target className="text-accent" />} 
            label="Daily Calories" 
            value={`${todayData.calories} / ${state.goals.dailyCalorieTarget}`} 
            sub="250 Remaining" 
            progress={(todayData.calories / state.goals.dailyCalorieTarget) * 100}
          />
          <StatCard 
            icon={<Droplets className="text-blue-500" />} 
            label="Hydration" 
            value={`${todayData.water} glasses`} 
            sub={`${state.goals.dailyWaterGoal - todayData.water} to goal`} 
            progress={(todayData.water / state.goals.dailyWaterGoal) * 100}
            onAdd={() => updateDaily(today, { water: todayData.water + 1 })}
          />
          <StatCard 
            icon={<Moon className="text-purple-500" />} 
            label="Sleep Recovery" 
            value={`${todayData.sleep}h / ${state.goals.dailySleepGoal}h`} 
            sub="Optimal Balance" 
            progress={(todayData.sleep / state.goals.dailySleepGoal) * 100}
          />
          <StatCard 
            icon={<Activity className="text-emerald-500" />} 
            label="Health Score" 
            value={healthScore} 
            sub="Level: Advanced" 
            progress={healthScore}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* 📊 Health Metrics Info */}
          <section className="glass p-8 rounded-[2rem] border border-border-glass">
            <h3 className="text-xl font-black text-text-primary mb-6 flex items-center gap-2">
              <Scale className="text-accent" /> Metrics Analysis
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-surface rounded-2xl border border-border-glass">
                <p className="text-xs font-mono text-text-muted uppercase mb-1">BMI</p>
                <div className="text-3xl font-black text-text-primary">24.2</div>
                <div className="text-[10px] font-bold text-emerald-500 mt-1 uppercase">Healthy</div>
              </div>
              <div className="text-center p-4 bg-surface rounded-2xl border border-border-glass">
                <p className="text-xs font-mono text-text-muted uppercase mb-1">Body Fat</p>
                <div className="text-3xl font-black text-text-primary">18.5%</div>
                <div className="text-[10px] font-bold text-amber-500 mt-1 uppercase">Fitness</div>
              </div>
              <div className="text-center p-4 bg-surface rounded-2xl border border-border-glass">
                <p className="text-xs font-mono text-text-muted uppercase mb-1">WHtR</p>
                <div className="text-3xl font-black text-text-primary">0.48</div>
                <div className="text-[10px] font-bold text-emerald-500 mt-1 uppercase">Low Risk</div>
              </div>
            </div>
          </section>

          {/* 🎯 Goals & Progress */}
          <section className="glass p-8 rounded-[2rem] border border-border-glass overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-black text-text-primary flex items-center gap-2">
                  <TrendingDown className="text-accent" /> Weight Journey
                </h3>
                <p className="text-sm text-text-muted italic">Target: {state.goals.targetWeight} kg</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-accent">30% Complete</div>
                <p className="text-[10px] font-mono text-text-muted">4.2kg to go</p>
              </div>
            </div>
            
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightProgressData}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} 
                  />
                  <YAxis 
                    hide 
                    domain={['dataMin - 2', 'dataMax + 2']} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-glass)', borderRadius: '12px', fontSize: '12px' }}
                    itemStyle={{ color: 'var(--color-accent)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="var(--color-accent)" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorWeight)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          {/* 🔥 Daily Tracker System */}
          <section className="glass p-8 rounded-[2rem] border border-border-glass sticky top-24">
            <h3 className="text-xl font-black text-text-primary mb-6 flex items-center gap-2">
              <Plus className="text-accent" /> Quick Log
            </h3>
            <div className="space-y-4">
              <QuickLogItem 
                icon={<Flame size={18} />} 
                label="Workout" 
                checked={todayData.workout} 
                onChange={() => updateDaily(today, { workout: !todayData.workout })}
              />
              <div className="flex flex-col gap-2 p-4 bg-surface rounded-2xl border border-border-glass">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-text-primary flex items-center gap-2">
                    <Zap size={18} className="text-accent" /> Calories
                  </span>
                  <span className="text-xs font-mono text-text-muted">{todayData.calories} kcal</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="4000" 
                  step="50"
                  value={todayData.calories}
                  onChange={(e) => updateDaily(today, { calories: parseInt(e.target.value) })}
                  className="w-full accent-accent"
                />
              </div>
              <div className="flex flex-col gap-2 p-4 bg-surface rounded-2xl border border-border-glass">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-text-primary flex items-center gap-2">
                    <Moon size={18} className="text-purple-500" /> Sleep
                  </span>
                  <span className="text-xs font-mono text-text-muted">{todayData.sleep} hours</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="12" 
                  step="0.5"
                  value={todayData.sleep}
                  onChange={(e) => updateDaily(today, { sleep: parseFloat(e.target.value) })}
                  className="w-full accent-accent"
                />
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* 🤖 AI Insight Panel */}
      <section className="glass p-8 rounded-[3rem] border border-border-glass relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <Zap size={120} className="text-accent" />
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="p-6 bg-accent/20 rounded-3xl border border-accent/40 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
            <Award className="text-accent" size={48} />
          </div>
          <div className="flex-grow text-center md:text-left space-y-2">
            <h3 className="text-3xl font-black text-text-primary">AI Wellness Concierge</h3>
            <p className="text-text-muted max-w-xl italic">
              "Analyzing your patterns... You're ready for deep neural optimization."
            </p>
          </div>
          <button 
            onClick={getAIInsight}
            disabled={isAnalyzing}
            className="px-8 py-4 bg-accent text-white dark:text-background font-black rounded-2xl neon-glow hover:scale-105 transition-all disabled:opacity-50"
          >
            {isAnalyzing ? "Processing..." : "Generate Insights"}
          </button>
        </div>

        <AnimatePresence>
          {aiInsight && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-12 p-8 bg-surface/50 rounded-3xl border border-border-glass"
            >
              <div className="prose dark:prose-invert max-w-none text-text-secondary leading-relaxed">
                <ReactMarkdown>{aiInsight}</ReactMarkdown>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 🛠 Tools Access Grid */}
      <section className="space-y-8">
        <h3 className="text-3xl font-black text-text-primary text-center">Your Pro Tools Suite</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ToolCard 
            id="weight-loss-planner" 
            name="Weight Loss Planner" 
            desc="Optimize calorie deficit & timelines" 
            icon={<TrendingDown className="text-accent" />} 
          />
          <ToolCard 
            id="nutrition-planner" 
            name="Nutrition Planner" 
            desc="Precision macro-tracking system" 
            icon={<Scale className="text-blue-500" />} 
          />
          <ToolCard 
            id="sleep-recovery" 
            name="Sleep & Recovery" 
            desc="Master your circadian rhythm" 
            icon={<Moon className="text-purple-500" />} 
          />
          <ToolCard 
            id="beauty-analyzer" 
            name="AI Beauty Analyzer" 
            desc="Neural face & skin analysis" 
            icon={<Sparkles className="text-pink-500" />} 
          />
          <ToolCard 
            id="heart-rate-calculator" 
            name="Heart Rate Tool" 
            desc="Target zone training system" 
            icon={<Heart className="text-red-500" />} 
          />
        </div>
      </section>

      {/* 🛡️ Exclusive Health Risk Analyzer Section */}
      <section className="glass p-8 rounded-[3rem] border border-border-glass">
        <h3 className="text-3xl font-black text-text-primary text-center mb-10">Exclusive Health Risk Analyzer</h3>
        <HealthRiskAnalyzer />
      </section>
    </div>
  );
}

function StatCard({ icon, label, value, sub, progress, onAdd }: any) {
  return (
    <div className="glass p-6 rounded-3xl border border-border-glass group hover:border-accent transition-all relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-surface rounded-xl">
          {icon}
        </div>
        {onAdd && (
          <button 
            onClick={onAdd}
            className="p-1.5 bg-accent/20 text-accent rounded-lg border border-accent/30 hover:bg-accent transition-all hover:text-white"
          >
            <Plus size={16} />
          </button>
        )}
      </div>
      <div>
        <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-1">{label}</p>
        <div className="text-2xl font-black text-text-primary mb-1">{value}</div>
        <p className="text-[10px] text-text-muted italic">{sub}</p>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-surface">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          className="h-full bg-accent"
        />
      </div>
    </div>
  );
}

function ToolCard({ id, name, desc, icon }: any) {
  return (
    <Link 
      to={`/tools/${id}`}
      className="glass p-6 rounded-3xl border border-border-glass group hover:bg-accent hover:border-accent transition-all duration-500 block"
    >
      <div className="flex items-center gap-4">
        <div className="p-4 bg-surface rounded-2xl group-hover:bg-white/20 transition-colors text-inherit">
          {React.cloneElement(icon as React.ReactElement<any>, { 
            size: 32, 
            className: "group-hover:text-white transition-colors" 
          })}
        </div>
        <div>
          <h4 className="font-bold text-text-primary group-hover:text-white transition-colors">{name}</h4>
          <p className="text-xs text-text-muted group-hover:text-white/80 transition-colors">{desc}</p>
        </div>
        <ChevronRight className="ml-auto text-text-muted group-hover:text-white transition-colors" />
      </div>
    </Link>
  );
}

function QuickLogItem({ icon, label, checked, onChange }: any) {
  return (
    <button 
      onClick={onChange}
      className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between ${
        checked 
          ? 'bg-accent/10 border-accent text-accent' 
          : 'bg-surface border-border-glass text-text-muted hover:border-text-muted'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-bold">{label}</span>
      </div>
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${checked ? 'border-accent bg-accent' : 'border-border-glass'}`}>
        {checked && <div className="w-2 h-2 bg-white rounded-full" />}
      </div>
    </button>
  );
}
