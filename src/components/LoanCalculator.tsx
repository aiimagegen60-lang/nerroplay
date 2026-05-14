"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from 'recharts';
import { Zap, RefreshCw, Download, DownloadCloud, Calculator, HelpCircle, CheckCircle2, XCircle, Info } from 'lucide-react';

const COLORS = ['#4ade80', '#f87171']; // Principal, Interest

const QNA_DATA = [
  { q: "EMI calculate karne ka formula kya hai?", a: "[P x R x (1+R)^N]/[(1+R)^N-1]. P = Principal, R = Rate of Interest, N = Tenure.", cta: "Hamara calculator use karein asan calculation ke liye" },
  { q: "Kya processing fee loan amount ka hissa hoti hai?", a: "Processing fee alag se deni padti hai ya loan amount se deduct hoti hai. Ye total payment cost badha deti hai." },
  { q: "CIBIL score loan interest ko kaise affect karta hai?", a: "High CIBIL score (750+) se interest rate kam mil sakta hai aur approval fast hota hai." },
  { q: "Personal Loan vs Home Loan interest me kya fark hai?", a: "Personal loan unsecured hota hai isliye rate high (10-20%) hota hai, Home loan secured hota hai isliye rate low (8-10%) hota hai." }
];

const QUIZ_DATA = [
  {
    q: "Kya tenure badhane se total interest cost kam hota hai?",
    options: ["Haan", "Nahi"],
    correct: 1,
    insight: "Tenure badhane se EMI kam hoti hai but Bank ko aap zyada interest pay karte hain long term me."
  },
  {
    q: "Unsecured loan ka example kaun sa hai?",
    options: ["Home Loan", "Personal Loan"],
    correct: 1,
    insight: "Personal loan ke liye koi security nahi chahiye hoti, isliye ise unsecured kehte hain."
  }
];

export default function LoanCalculator() {
  const [loan, setLoan] = useState(1000000);
  const [rate, setRate] = useState(9.5);
  const [tenureYears, setTenureYears] = useState(5);
  const [processingFee, setProcessingFee] = useState(0);
  const [quizState, setQuizState] = useState<{current: number, selected: number | null, score: number}>({
    current: 0,
    selected: null,
    score: 0
  });

  const results = useMemo(() => {
    const months = tenureYears * 12;
    const r = rate / 12 / 100;
    const emi = (loan * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - loan;
    
    // Amortization Schedule
    const schedule = [];
    let balance = loan;
    for (let i = 1; i <= months; i++) {
        const interest = balance * r;
        const principal = emi - interest;
        balance -= principal;
        schedule.push({ month: i, emi: Math.round(emi), principal: Math.round(principal), interest: Math.round(interest), balance: Math.max(0, Math.round(balance)) });
    }

    return { 
      emi: Math.round(emi), 
      totalInterest: Math.round(totalInterest), 
      totalPayment: Math.round(totalPayment + processingFee),
      schedule
    };
  }, [loan, rate, tenureYears, processingFee]);

  const pieData = [
    { name: "Principal", value: loan },
    { name: "Interest", value: results.totalInterest }
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

  const downloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + ["Month,EMI,Principal,Interest,Balance", ...results.schedule.map(row => `${row.month},${row.emi},${row.principal},${row.interest},${row.balance}`)].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "amortization_schedule.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl border border-border-glass space-y-6">
          <h3 className="text-xl font-black text-text-primary uppercase flex items-center gap-2">
            <Calculator className="text-accent" /> Loan Parameters
          </h3>
          <div className="space-y-4">
            <label className="text-sm font-bold block text-text-secondary italic">Loan Amount (₹)</label>
            <input type="number" value={loan} onChange={(e) => setLoan(Math.max(0, +e.target.value))} className="w-full bg-background p-3 rounded-xl border border-border-glass font-bold text-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
                <label className="text-sm font-bold block text-text-secondary italic">Interest Rate (%)</label>
                <input type="number" step="0.1" value={rate} onChange={(e) => setRate(+e.target.value)} className="w-full bg-background p-3 rounded-xl border border-border-glass font-bold text-lg" />
            </div>
            <div className="space-y-4">
                <label className="text-sm font-bold block text-text-secondary italic">Tenure (Years)</label>
                <input type="number" value={tenureYears} onChange={(e) => setTenureYears(+e.target.value)} className="w-full bg-background p-3 rounded-xl border border-border-glass font-bold text-lg" />
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-sm font-bold block text-text-secondary italic">Processing Fee (₹)</label>
            <input type="number" value={processingFee} onChange={(e) => setProcessingFee(Math.max(0, +e.target.value))} className="w-full bg-background p-3 rounded-xl border border-border-glass" />
          </div>
        </div>

        <div className="glass p-8 rounded-3xl border border-border-glass flex flex-col items-center justify-center text-center">
            <h4 className="text-text-muted font-mono uppercase tracking-widest text-xs mb-2">Monthly EMI</h4>
            <div className="text-5xl font-black text-accent mb-8 tabular-nums">₹{results.emi.toLocaleString()}</div>
            <div className="grid grid-cols-2 gap-6 w-full">
                <div className="bg-surface p-4 rounded-xl border border-border-glass">
                    <p className="text-text-muted text-xs uppercase font-mono mb-1">Interest</p>
                    <p className="text-lg font-bold">₹{results.totalInterest.toLocaleString()}</p>
                </div>
                <div className="bg-surface p-4 rounded-xl border border-border-glass">
                    <p className="text-text-muted text-xs uppercase font-mono mb-1">Total Payment</p>
                    <p className="text-lg font-bold">₹{results.totalPayment.toLocaleString()}</p>
                </div>
            </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl border border-border-glass">
            <h4 className="text-lg font-black mb-6 uppercase tracking-tight">Financial Split</h4>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                            {pieData.map((entry, index) => (
                                <Cell key={`loan-cell-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
        
        <div className="glass p-8 rounded-3xl border border-border-glass">
            <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-black uppercase tracking-tight">Growth Trend</h4>
                <button onClick={downloadCSV} className="text-accent">
                    <DownloadCloud size={20} />
                </button>
            </div>
            <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={results.schedule.filter((_,i) => i % 6 === 0)}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="month" hide />
                        <YAxis hide />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '8px' }}
                            itemStyle={{ color: '#6366F1' }}
                        />
                        <Line type="monotone" dataKey="balance" stroke="#6366F1" strokeWidth={3} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      <div className="glass p-8 rounded-3xl border border-border-glass">
        <h4 className="text-lg font-black mb-6 uppercase tracking-tight flex items-center gap-2">
            <Info className="text-accent" /> Amortization Schedule
        </h4>
        <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-[10px] font-mono">
                <thead className="text-text-muted uppercase text-left sticky top-0 bg-background/90 backdrop-blur pb-2">
                    <tr><th className="pb-2">Mnth</th><th className="pb-2 text-center">Principal</th><th className="pb-2 text-center">Interest</th><th className="pb-2 text-right">Balance</th></tr>
                </thead>
                <tbody className="divide-y divide-border-glass">
                    {results.schedule.map(row => (
                        <tr key={row.month}>
                            <td className="py-2">{row.month}</td>
                            <td className="py-2 text-center text-green-400">₹{row.principal.toLocaleString()}</td>
                            <td className="py-2 text-center text-red-400">₹{row.interest.toLocaleString()}</td>
                            <td className="py-2 text-right">₹{row.balance.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-8 rounded-3xl border border-border-glass">
            <h3 className="text-xl font-black mb-6 uppercase tracking-tight">Loan Insights FAQ</h3>
            <div className="grid md:grid-cols-2 gap-4">
                {QNA_DATA.map((item, i) => (
                    <div key={`faq-${item.q.substring(0, 20)}-${i}`} className="bg-surface p-6 rounded-2xl border border-border-glass">
                        <p className="font-bold text-accent mb-2">❓ {item.q}</p>
                        <p className="text-xs text-text-secondary leading-relaxed mb-3">{item.a}</p>
                        {item.cta && (
                            <p className="text-[10px] uppercase font-bold text-text-primary border-t border-border-glass pt-2">👉 {item.cta}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>

        {/* Quiz Sidebar */}
        <div className="glass p-8 rounded-3xl border border-border-glass bg-accent/5 flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-2 mb-6">
                    <HelpCircle className="text-accent" />
                    <h4 className="text-lg font-black uppercase tracking-tight">Finance Quiz</h4>
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
                                    key={`quiz-opt-${opt}-${idx}`}
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
                                    <p className="text-[10px] font-mono text-accent uppercase font-black mb-1">Knowledge Hub</p>
                                    <p className="text-[11px] text-text-secondary italic leading-relaxed">
                                        {QUIZ_DATA[quizState.current].insight}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>

            <button 
                onClick={nextQuiz}
                className="mt-8 w-full py-4 bg-accent text-background rounded-xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-accent/20"
            >
                {quizState.selected !== null ? "Next Question" : "Skip Question"}
            </button>
        </div>
      </div>
    </div>
  );
}
