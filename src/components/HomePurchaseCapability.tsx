import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Wallet, 
  Percent, 
  Calendar, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Info,
  PieChart as PieIcon,
  Zap,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import ReactMarkdown from 'react-markdown';

const HomePurchaseCapability = () => {
  // Inputs
  const [monthlyIncome, setMonthlyIncome] = useState<number>(100000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenure, setTenure] = useState<number>(20);
  
  // UI State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [showFAQ, setShowFAQ] = useState<number | null>(null);

  // Core Calculation Flow
  const results = useMemo(() => {
    const annualIncome = monthlyIncome * 12;
    
    // Rule 1: 3x Income
    const maxProperty = annualIncome * 3;
    
    // Rule 2: 30% EMI
    const maxEMI = monthlyIncome * 0.3;
    
    // Rule 3: 20% Down Payment
    const downPayment = maxProperty * 0.2;
    const loanAmount = maxProperty * 0.8;

    // Standard EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
    const r = interestRate / 12 / 100;
    const n = tenure * 12;
    const estimatedEMI = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    const totalRepayment = estimatedEMI * n;
    const totalInterest = totalRepayment - loanAmount;

    // Safety Logic
    const emiToIncomeRatio = (estimatedEMI / monthlyIncome) * 100;
    const status = estimatedEMI <= maxEMI ? 'SAFE' : 'RISKY';
    const safetyProgress = Math.min(100, (estimatedEMI / maxEMI) * 100);

    return {
      maxProperty,
      maxEMI,
      downPayment,
      loanAmount,
      estimatedEMI: Math.round(estimatedEMI),
      totalInterest: Math.round(totalInterest),
      emiToIncomeRatio: Math.round(emiToIncomeRatio),
      status,
      safetyProgress
    };
  }, [monthlyIncome, interestRate, tenure]);

  const chartData = [
    { name: 'Down Payment', value: results.downPayment, color: '#10b981' },
    { name: 'Principal Loan', value: results.loanAmount, color: '#3b82f6' },
  ];

  const emiComparisonData = [
    {
      name: 'Monthly Income',
      EMI: results.estimatedEMI,
      Balance: monthlyIncome - results.estimatedEMI,
    }
  ];

  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);

  const getAIAnalysis = async () => {
    setIsAiAnalyzing(true);
    setAiAnalysis(null);
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tool: 'Home Purchase Capability', 
          data: {
            monthlyIncome,
            interestRate,
            tenure,
            results: {
              maxProperty: results.maxProperty,
              maxEMI: results.maxEMI,
              downPayment: results.downPayment,
              loanAmount: results.loanAmount,
              estimatedEMI: results.estimatedEMI,
              totalInterest: results.totalInterest,
              emiToIncomeRatio: results.emiToIncomeRatio,
              status: results.status
            }
          }
        }),
      });
      const data = await response.json();
      setAiAnalysis(data.analysis);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const faqData = [
    { q: "Main kitne ka ghar afford kar sakta hoon?", a: "Income ke 3× tak property safe hoti hai. Agar aapki annual income ₹12 lakh hai, toh ₹36 lakh tak ka ghar safe hai." },
    { q: "3-30-20 rule kya hai?", a: "3x Income (Property value), 30% Max EMI (Monthly income ka), aur 20% Min Down Payment." },
    { q: "EMI income ka kitna percent hona chahiye?", a: "30% se kam safe hai. 40%+ hone par financial stress badh sakta hai." },
    { q: "Down payment kitna dena chahiye?", a: "At least 20% recommended hai takki loan amount aur interest kam rahe." },
    { q: "₹50,000 salary me kitna ghar le sakte hain?", a: "Rule ke hisaab se ₹18-20 lakh tak ki property aur ₹15,000 tak ki EMI safe hai." },
    { q: "Loan kitna lena safe hota hai?", a: "Utna loan jisme EMI aapki net salary ka 30% exceed na kare." },
    { q: "Interest rate ka kya impact hota hai?", a: "1% extra interest apke pure tenure me lakhon ka fark dal sakta hai." },
    { q: "Tenure badhane se kya hota hai?", a: "EMI kam hoti hai magar overall interest payout bohot badh jata hai." },
    { q: "Kya bina down payment ghar le sakte hain?", a: "Le sakte hain (100% funding), magar ye bohot risky hota hai aur EMI bohot heavy ho jati hai." },
    { q: "Safe home buying ka best rule kya hai?", a: "Humesha 3-30-20 rule follow karein aur rainy-day fund alag rakhein." }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <section className="text-center space-y-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black text-text-primary tracking-tight"
        >
          Home Purchase <span className="text-accent">Capability Tool</span>
        </motion.h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          Built on the professional <span className="font-bold text-accent">3-30-20 Rule</span> to ensure your home purchase doesn't become a financial burden.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input System */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass p-8 rounded-3xl border border-border-glass space-y-8">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Wallet className="text-accent" /> Financial Profile
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-3">Monthly Income (₹)</label>
                <input 
                  type="range" min="10000" max="1000000" step="5000"
                  value={monthlyIncome} onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="w-full accent-accent h-2 bg-background-muted rounded-full"
                />
                <div className="flex justify-between mt-4">
                  <span className="text-2xl font-black text-text-primary">{formatCurrency(monthlyIncome)}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-3">Interest Rate (%)</label>
                <div className="relative">
                   <input 
                    type="number" step="0.1"
                    value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full bg-background-secondary border border-border-glass rounded-xl px-4 py-3 text-text-primary font-bold focus:ring-2 focus:ring-accent outline-none"
                  />
                  <Percent className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-3">Loan Tenure (Years)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[10, 15, 20, 25, 30].map(yr => (
                    <button
                      key={yr}
                      onClick={() => setTenure(yr)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                        tenure === yr ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-background-secondary text-text-secondary hover:bg-background-muted'
                      }`}
                    >
                      {yr}Y
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-accent/10 border border-accent/20 p-6 rounded-2xl flex gap-4 items-start">
            <Info className="text-accent shrink-0" size={20} />
            <p className="text-sm text-text-secondary leading-relaxed">
              <strong>The 3-30-20 Rule:</strong> Property price should be &lt; 3x your annual income, EMI should be &lt; 30% of your monthly income, and you should have a 20% down payment ready.
            </p>
          </div>
        </div>

        {/* Right: Output System */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Capability Card */}
          <div className="glass p-10 rounded-[2.5rem] border border-border-glass relative overflow-hidden">
            <div className={`absolute top-0 right-0 px-8 py-2 rounded-bl-3xl font-black text-xs tracking-widest ${
              results.status === 'SAFE' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
            }`}>
              {results.status} BUDGET
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <div>
                  <p className="text-text-secondary font-bold uppercase tracking-wider text-xs mb-2">Max Affordable Property Price</p>
                  <h3 className="text-5xl md:text-6xl font-black text-text-primary tracking-tighter">
                    {formatCurrency(results.maxProperty)}
                  </h3>
                </div>

                <div className="space-y-4">
                   <div className="flex justify-between items-end">
                      <span className="text-sm text-text-secondary font-medium">Affordability Meter</span>
                      <span className={`text-sm font-black ${results.status === 'SAFE' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {results.status === 'SAFE' ? 'Recommended Limit' : 'Exceeding Limit'}
                      </span>
                   </div>
                   <div className="h-4 bg-background-secondary rounded-full overflow-hidden border border-border-glass p-0.5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${results.safetyProgress}%` }}
                        className={`h-full rounded-full ${
                          results.status === 'SAFE' ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                      />
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-5 bg-background-secondary rounded-2xl border border-border-glass">
                  <p className="text-xs font-medium text-text-muted mb-1">Down Payment (20%)</p>
                  <p className="text-xl font-bold text-text-primary">{formatCurrency(results.downPayment)}</p>
                </div>
                <div className="p-5 bg-background-secondary rounded-2xl border border-border-glass">
                  <p className="text-xs font-medium text-text-muted mb-1">Recommended EMI (30%)</p>
                  <p className="text-xl font-bold text-text-primary">{formatCurrency(results.maxEMI)}</p>
                </div>
                <div className="p-5 bg-background-secondary rounded-2xl border border-border-glass">
                  <p className="text-xs font-medium text-text-muted mb-1">Loan Amount</p>
                  <p className="text-xl font-bold text-text-primary">{formatCurrency(results.loanAmount)}</p>
                </div>
                <div className="p-5 bg-accent/20 rounded-2xl border border-accent/30">
                  <p className="text-xs font-bold text-accent mb-1">Est. Monthly EMI</p>
                  <p className="text-xl font-bold text-text-primary">{formatCurrency(results.estimatedEMI)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="glass p-8 rounded-3xl border border-border-glass">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <PieIcon className="text-emerald-500" size={20} /> Property Breakdown
                </h3>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', background: '#111', color: '#fff' }}
                        formatter={(val: number) => formatCurrency(val)}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                   {chartData.map(item => (
                     <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs text-text-secondary uppercase font-bold">{item.name}</span>
                     </div>
                   ))}
                </div>
             </div>

             <div className="glass p-8 rounded-3xl border border-border-glass">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <TrendingUp className="text-blue-500" size={20} /> EMI vs Income
                </h3>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={emiComparisonData} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" hide />
                      <Tooltip cursor={{ fill: 'transparent' }} formatter={(val: number) => formatCurrency(val)} />
                      <Bar dataKey="EMI" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} barSize={40} />
                      <Bar dataKey="Balance" stackId="a" fill="#1e293b" radius={[0, 10, 10, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-text-secondary">
                    EMI is <span className={`font-black ${results.status === 'SAFE' ? 'text-emerald-500' : 'text-rose-500'}`}>{results.emiToIncomeRatio}%</span> of your monthly income.
                  </p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* SEO Q&A Section */}
      <section className="max-w-4xl mx-auto space-y-8">
         <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-text-primary">Financial Planning FAQ</h2>
            <p className="text-text-secondary">Essential insights for every home buyer.</p>
         </div>

         <div className="space-y-4">
            {faqData.map((faq, idx) => (
               <div 
                key={idx} 
                className="glass rounded-2xl border border-border-glass overflow-hidden transition-all"
               >
                  <button 
                    onClick={() => setShowFAQ(showFAQ === idx ? null : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-background-muted/50 transition-colors"
                  >
                     <span className="font-bold text-text-primary md:text-lg">{faq.q}</span>
                     {showFAQ === idx ? <ChevronUp className="text-accent" /> : <ChevronDown className="text-text-muted" />}
                  </button>
                  <AnimatePresence>
                     {showFAQ === idx && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-6 pb-6"
                        >
                           <p className="text-text-secondary text-sm md:text-base leading-relaxed pt-2 border-t border-border-glass">
                              {faq.a}
                           </p>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>
            ))}
         </div>
      </section>

      {/* Footer CTA */}
      <section className="glass p-12 rounded-[3rem] border border-accent/20 bg-gradient-to-br from-accent/10 to-transparent text-center space-y-8">
         <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-text-primary">Ready to commit to your dream?</h2>
            <p className="text-text-secondary max-w-xl mx-auto">Use these numbers to negotiate better loan rates and select a property that builds your future, not your stress.</p>
         </div>
         <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 bg-accent text-white font-black rounded-2xl hover:scale-105 transition-all shadow-xl shadow-accent/20 flex items-center gap-2">
               Download PDF Report <ArrowRight size={20} />
            </button>
            <button className="px-8 py-4 bg-background-secondary text-text-primary font-black rounded-2xl border border-border-glass hover:bg-background-muted transition-all">
               Email to Advisor
            </button>
         </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .neon-glow {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
        }
      `}} />
    </div>
  );
};

export default HomePurchaseCapability;
