import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { Calculator, TrendingUp, Target, ChartLine, Zap, Info, ArrowUpRight, HelpCircle, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import AIDeepAnalysis from './AIDeepAnalysis';

const COLORS = ['#6366F1', '#F59E0B']; // Investment, Returns

const QNA_DATA = [
  { q: "SIP kya hota hai?", a: "SIP (Systematic Investment Plan) ek tarika hai jisme aap har mahine ek nishchit rashi mutual funds me invest karte hain." },
  { q: "SIP me kitna return milta hai?", a: "Aam taur par 10% – 15% ka average return mil sakta hai, lekin ye market ke utaar-chadaav par nirbhar karta hai." },
  { q: "5000 monthly SIP 10 saal me kitna hoga?", a: "12% return ke hisab se ye lagbhag ₹11.6 lakh ho sakta hai." },
  { q: "SIP safe hai ya risky?", a: "Long term (5-10 saal) me SIP kaafi safe aur profitable mani jati hai, although market risk hamesha rehta hai." },
  { q: "SIP vs FD kaun better hai?", a: "Inflation aur wealth creation ke liye SIP better hai, jabki FD security ke liye acchi hai lekin return kam deti hai." },
  { q: "SIP me minimum investment kitna hota hai?", a: "Kai mutual funds me aap mahine ke ₹500 se bhi SIP shuru kar sakte hain." },
  { q: "SIP kab shuru karni chahiye?", a: "Jitni jaldi ho sake (Power of Compounding ka fayda lene ke liye)." },
  { q: "Kya SIP me loss ho sakta hai?", a: "Short term me market volatility ki wajah se loss dikh sakta hai, par long term me ye compensate ho jata hai." },
  { q: "SIP band karne par kya hota hai?", a: "Aapka poora paisa safe rehta hai aur aap use kisi bhi waqt nikaal sakte hain." },
  { q: "SIP se crore kaise banaye?", a: "Consistency, long term patience aur yearly apni investment (Step-up) badhane se aap bade financial goals achieve kar sakte hain." }
];

const QUIZ_DATA = [
  {
    q: "Power of Compounding ka sabse bada factor kya hai?",
    options: ["Investment Amount", "Time (Durarion)"],
    correct: 1,
    insight: "Jitna zyada waqt aap invest rahenge, utna bada compounding ka asar dikhega."
  },
  {
    q: "Kya Step-up SIP se financial goal jaldi poora ho sakta hai?",
    options: ["Haan, kaafi jaldi", "Nahi, asar nahi padta"],
    correct: 0,
    insight: "Consistency ke saath investment badhane se wealth creation ki speed 2-3 guna badh sakti hai."
  }
];

export default function SIPCalculator() {
  const [monthly, setMonthly] = useState<number>(5000);
  const [rate, setRate] = useState<number>(12);
  const [years, setYears] = useState<number>(10);
  const [stepUp, setStepUp] = useState<number>(0); // Percentage
  const [goal, setGoal] = useState<number>(1000000);
  const [quizState, setQuizState] = useState<{current: number, selected: number | null, score: number}>({
    current: 0,
    selected: null,
    score: 0
  });

  const results = useMemo(() => {
    let currentMonthly = monthly;
    let totalInvested = 0;
    let currentBalance = 0;
    const r = rate / 12 / 100;
    const yearData = [];

    for (let y = 1; y <= years; y++) {
      for (let m = 1; m <= 12; m++) {
        totalInvested += currentMonthly;
        currentBalance = (currentBalance + currentMonthly) * (1 + r);
      }
      yearData.push({
        year: `Yr ${y}`,
        invested: Math.round(totalInvested),
        value: Math.round(currentBalance),
        returns: Math.round(currentBalance - totalInvested)
      });
      // Apply Step-up at the end of the year
      currentMonthly = currentMonthly * (1 + stepUp / 100);
    }

    const futureValue = Math.round(currentBalance);
    const invested = Math.round(totalInvested);
    const profit = Math.round(futureValue - invested);
    const progress = Math.min(100, Math.round((futureValue / goal) * 100));

    return { futureValue, invested, profit, yearData, progress };
  }, [monthly, rate, years, stepUp, goal]);

  const handleDeepAnalysis = async () => {
    const response = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        tool: 'SIP Calculator', 
        data: {
          monthly,
          rate,
          years,
          stepUp,
          results: {
            futureValue: results.futureValue,
            invested: results.invested,
            profit: results.profit,
            progress: results.progress
          }
        }
      }),
    });

    if (!response.ok) throw new Error('Failed to analyze');
    const data = await response.json();
    return data.analysis;
  };

  const chartData = [
    { name: 'Invested', value: results.invested },
    { name: 'Earnings', value: results.profit },
  ];

  const handleQuizAnswer = (idx: number) => {
    if (quizState.selected !== null) return;
    setQuizState(prev => ({
      ...prev,
      selected: idx,
      score: idx === QUIZ_DATA[prev.current].correct ? prev.score + 1 : prev.score
    }));
  };

  const nextQuiz = () => {
    setQuizState(prev => ({
      current: (prev.current + 1) % QUIZ_DATA.length,
      selected: null,
      score: prev.selected === null ? prev.score : prev.score
    }));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl md:text-4xl font-black text-text-primary uppercase tracking-tighter">
          PRO SIP CALCULATOR
        </h2>
        <p className="text-xs md:text-sm text-text-muted uppercase font-mono max-w-2xl mx-auto tracking-widest leading-relaxed">
          Master your wealth creation journey with the power of compounding. 
          Plan, visualize, and dominate your financial future.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Inputs */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-8 rounded-3xl border border-border-glass space-y-6">
            <h3 className="text-lg font-black text-text-primary uppercase flex items-center gap-2">
              <Calculator className="text-accent" /> Strategy
            </h3>
            
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-text-muted tracking-widest">Monthly Investment (₹)</label>
              <input 
                type="number" 
                value={monthly} 
                onChange={(e) => setMonthly(Math.max(100, +e.target.value))} 
                className="w-full bg-background p-4 rounded-xl border border-border-glass font-bold text-xl outline-none focus:border-accent transition-all tabular-nums"
              />
              <input 
                type="range" min="500" max="100000" step="500" 
                value={monthly} onChange={(e) => setMonthly(+e.target.value)}
                className="w-full accent-accent h-1.5 opacity-50 hover:opacity-100 transition-opacity"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-text-muted tracking-widest">Return Rate (% p.a.)</label>
              <input 
                type="number" 
                value={rate} 
                onChange={(e) => setRate(+e.target.value)} 
                className="w-full bg-background p-4 rounded-xl border border-border-glass font-bold text-xl outline-none focus:border-accent transition-all tabular-nums"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-text-muted tracking-widest">Time Period (Years)</label>
              <input 
                type="number" 
                value={years} 
                onChange={(e) => setYears(Math.max(1, +e.target.value))} 
                className="w-full bg-background p-4 rounded-xl border border-border-glass font-bold text-xl outline-none focus:border-accent transition-all tabular-nums"
              />
              <input 
                type="range" min="1" max="40" step="1" 
                value={years} onChange={(e) => setYears(+e.target.value)}
                className="w-full accent-accent h-1.5 opacity-50 hover:opacity-100 transition-opacity"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-text-muted tracking-widest">Yearly Step-Up (%)</label>
              <div className="flex gap-4 items-center">
                <input 
                  type="number" 
                  value={stepUp} 
                  onChange={(e) => setStepUp(Math.max(0, +e.target.value))} 
                  className="flex-1 bg-background p-4 rounded-xl border border-border-glass font-bold text-lg outline-none focus:border-accent transition-all"
                />
                <div className="text-xs font-mono text-text-muted italic">Increases SIP each year</div>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-3xl border border-border-glass bg-accent/5">
            <h4 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <Target size={14}/> Goal Tracker
            </h4>
            <div className="space-y-4">
                <input 
                    type="number" 
                    value={goal} 
                    onChange={(e) => setGoal(Math.max(1000, +e.target.value))} 
                    className="w-full bg-background p-3 rounded-xl border border-border-glass font-bold text-sm outline-none"
                    placeholder="Enter target amount"
                />
                <div className="relative h-2 bg-surface rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${results.progress}%` }}
                        className="absolute inset-0 bg-accent"
                    />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-text-muted uppercase">
                    <span>Target Achievement</span>
                    <span>{results.progress}%</span>
                </div>
            </div>
          </div>
        </div>

        {/* Center/Right: Results */}
        <div className="lg:col-span-2 space-y-8">
            {/* Main Result Card */}
            <div className="glass p-8 md:p-12 rounded-[2.5rem] border border-border-glass bg-gradient-to-br from-accent/10 to-transparent relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <TrendingUp size={120} />
                </div>
                <div className="relative z-10 text-center">
                    <h4 className="text-[10px] font-mono text-accent uppercase tracking-[0.3em] font-black mb-4">Estimated Future Value</h4>
                    <div className="text-5xl md:text-7xl font-black text-text-primary mb-12 flex items-center justify-center gap-2 tabular-nums">
                        <span className="text-accent text-3xl md:text-5xl">₹</span>
                        {results.futureValue.toLocaleString()}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-surface/50 backdrop-blur-md p-6 rounded-3xl border border-border-glass">
                            <p className="text-[10px] font-mono text-text-muted uppercase mb-1">Total Invested</p>
                            <p className="text-2xl font-black text-text-primary">₹{results.invested.toLocaleString()}</p>
                        </div>
                        <div className="bg-surface/50 backdrop-blur-md p-6 rounded-3xl border border-border-glass">
                            <p className="text-[10px] font-mono text-accent/80 uppercase mb-1">Total Returns</p>
                            <p className="text-2xl font-black text-accent flex items-center justify-center gap-1">
                                ₹{results.profit.toLocaleString()}
                                <ArrowUpRight size={20}/>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Visuals */}
            <div className="grid md:grid-cols-2 gap-8">
                <div className="glass p-8 rounded-3xl border border-border-glass">
                    <h4 className="text-sm font-black uppercase tracking-widest mb-8 flex items-center gap-2">
                        <ChartLine size={16} className="text-accent"/> Wealth Growth Chart
                    </h4>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={results.yearData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="year" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis hide />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #333', borderRadius: '12px', fontSize: '10px' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#6366F1" fillOpacity={1} fill="url(#colorValue)" />
                                <Area type="monotone" dataKey="invested" stroke="#F59E0B" fill="transparent" strokeDasharray="5 5" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass p-8 rounded-3xl border border-border-glass flex flex-col">
                    <h4 className="text-sm font-black uppercase tracking-widest mb-8">Investment Ratio</h4>
                    <div className="h-64 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={chartData} 
                                    innerRadius={70} 
                                    outerRadius={90} 
                                    paddingAngle={8} 
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`sip-cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #333', fontSize: '10px' }} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Insight */}
            <div className="glass p-8 rounded-3xl border border-border-glass space-y-6">
                <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <Zap className="text-accent" /> Compounding Intelligence
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4 text-[11px] text-text-secondary leading-relaxed uppercase">
                        <div className="flex gap-3">
                            <div className="p-2 bg-accent/10 rounded-lg text-accent h-fit"><Info size={18}/></div>
                            <div>
                                <p className="text-[10px] font-mono text-text-muted uppercase mb-1">Strategy Insight</p>
                                <p>
                                    Your returns are <span className="text-accent font-bold">{(results.profit/results.invested * 100).toFixed(1)}%</span> of your total investment. This is the <span className="text-text-primary font-bold">Power of Time</span> working for you.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-surface p-4 rounded-2xl border border-border-glass">
                        <p className="text-accent text-[10px] font-bold uppercase mb-2">PRO TIP</p>
                        <p className="text-[11px] text-text-secondary leading-normal uppercase">
                            Increase your SIP by <span className="text-text-primary font-bold">10% every year</span> to reach your targets <span className="text-accent">35% faster</span>.
                        </p>
                    </div>
                </div>
            </div>

            <AIDeepAnalysis 
                toolName="Wealth" 
                onAnalyze={handleDeepAnalysis} 
            />
        </div>
      </div>

      {/* QnA + Quiz SEO Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-10 rounded-3xl border border-border-glass">
            <div className="flex items-center gap-3 mb-10">
                <div className="w-1.5 h-10 bg-accent rounded-full" />
                <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight">SIP Investment FAQ</h3>
                    <p className="text-xs text-text-muted uppercase font-mono mt-1">Smart and Quick answers for every investor</p>
                </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                {QNA_DATA.map((item, i) => (
                    <div key={`faq-${i}-${item.q.substring(0,10)}`} className="bg-surface/30 p-6 rounded-2xl border border-border-glass hover:border-accent/30 transition-all flex flex-col justify-between">
                        <div>
                            <p className="font-bold text-accent text-[13px] mb-3 flex items-start gap-2">
                                <span className="opacity-40">Q.</span>
                                {item.q}
                            </p>
                            <p className="text-[11px] text-text-secondary leading-relaxed uppercase pl-5 border-l border-border-glass">
                                {item.a}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Quiz Sidebar */}
        <div className="glass p-8 rounded-3xl border border-border-glass bg-accent/5 flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-2 mb-6">
                    <HelpCircle className="text-accent" />
                    <h4 className="text-lg font-black uppercase tracking-tight">SIP Quiz</h4>
                </div>
                
                <div className="space-y-6">
                    <motion.div 
                        key={quizState.current}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                    >
                        <p className="text-sm font-bold text-text-primary leading-tight uppercase">
                            {QUIZ_DATA[quizState.current]?.q}
                        </p>
                        
                        <div className="space-y-2">
                            {QUIZ_DATA[quizState.current]?.options.map((opt, idx) => (
                                <button
                                    key={`quiz-opt-${quizState.current}-${idx}`}
                                    onClick={() => handleQuizAnswer(idx)}
                                    className={`w-full p-4 rounded-xl border font-bold text-xs uppercase transition-all flex items-center justify-between ${
                                        quizState.selected === null 
                                            ? 'border-border-glass bg-background hover:border-accent/50 text-text-secondary' 
                                            : idx === QUIZ_DATA[quizState.current].correct
                                                ? 'border-green-500 bg-green-500/10 text-green-500'
                                                : idx === quizState.selected
                                                    ? 'border-red-500 bg-red-500/10 text-red-500'
                                                    : 'border-border-glass bg-background/50 text-text-muted opacity-50'
                                    }`}
                                >
                                    {opt}
                                    {quizState.selected !== null && idx === QUIZ_DATA[quizState.current].correct && <CheckCircle2 size={16}/>}
                                    {quizState.selected === idx && idx !== QUIZ_DATA[quizState.current].correct && <XCircle size={16}/>}
                                </button>
                            ))}
                        </div>

                        <AnimatePresence>
                            {quizState.selected !== null && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-background/50 rounded-xl border border-border-glass"
                                >
                                    <p className="text-[10px] font-mono text-accent uppercase font-black mb-1">Expert Insight</p>
                                    <p className="text-[11px] text-text-secondary italic">
                                        {QUIZ_DATA[quizState.current].insight}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>

            <AIDeepAnalysis 
               onAnalyze={handleDeepAnalysis} 
               toolName="SIP AI Calculator" 
            />

            <button 
                onClick={nextQuiz}
                className="mt-8 w-full py-4 bg-accent text-background rounded-xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
                {quizState.selected !== null ? "Next Question" : "Skip Question"}
            </button>
        </div>
      </div>
    </div>
  );
}
