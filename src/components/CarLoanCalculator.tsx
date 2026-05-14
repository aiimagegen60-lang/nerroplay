import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Calculator, IndianRupee, Zap, Info, BarChart3, ChevronDown, ChevronUp, HelpCircle, CheckCircle2, XCircle } from 'lucide-react';

const COLORS = ['#F59E0B', '#6366F1'];

const QNA_DATA = [
  { q: "Car loan EMI kaise calculate hoti hai?", a: "Car loan EMI reducing balance method se calculate hoti hai jisme interest remaining loan amount pe lagta hai.", cta: "Apni EMI instantly calculate karo hamare tool se" },
  { q: "Car loan me interest rate kitna hota hai?", a: "8% – 12% (car loan), 10% – 18% (commercial / heavy vehicle). Depends on CIBIL, income, and bank." },
  { q: "5 lakh ke car loan par EMI kitni hogi?", a: "Depends on rate and tenure. Example: 10% pe 5 saal → approx ₹10,600 EMI.", cta: "Exact EMI check karo calculator me" },
  { q: "Car loan ke liye minimum salary kitni honi chahiye?", a: "Usually: ₹20,000 – ₹30,000/month." },
  { q: "Car loan ke liye maximum tenure kitna milta hai?", a: "5–7 years (car), 3–5 years (commercial vehicle)." },
  { q: "Down payment kitna dena padta hai?", a: "10% – 25%. Lower down payment = higher EMI." },
  { q: "Kya zero down payment car loan mil sakta hai?", a: "Yes, but EMI high hoti hai aur interest bhi zyada rehta hai." },
  { q: "Car loan jaldi approve kaise hota hai?", a: "Good CIBIL score (750+), stable income, and proper documents." },
  { q: "Car loan me total kitna extra paisa dena padta hai?", a: "Important components: Interest + processing fee + insurance.", cta: "Total cost calculate karo hamare tool se" },
  { q: "Car loan jaldi kaise close kare (prepayment)?", a: "Extra EMI pay karo ya lump sum payment karo, isse interest save hota hai." }
];

const QUIZ_DATA = [
  {
    q: "Car loan me interest kis pe lagta hai?",
    options: ["Full Loan Amount", "Remaining Balance"],
    correct: 1,
    insight: "Zyadatar car loans reducing balance method pe hote hain, jisme interest bache hue amount pe lagta hai."
  },
  {
    q: "Kya zero down payment option humare long term interest ko badhata hai?",
    options: ["Haan, kaafi badhta hai", "Nahi, asar nahi padta"],
    correct: 0,
    insight: "Higher loan amount matlab zyada interest payment over time."
  }
];

export default function CarLoanCalculator() {
  const [loan, setLoan] = useState<number>(500000);
  const [rate, setRate] = useState<number>(10);
  const [tenureYears, setTenureYears] = useState<number>(5);
  const [showTable, setShowTable] = useState(false);
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

    let status = 'affordable';
    if (emi > loan * 0.05) status = 'risky'; // Simplified affordability

    return { emi: Math.round(emi), totalInterest: Math.round(totalInterest), totalPayment: Math.round(totalPayment), schedule, status };
  }, [loan, rate, tenureYears]);

  const data = [
    { name: 'Interest', value: results.totalInterest },
    { name: 'Principal', value: loan },
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
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl border border-border-glass space-y-6">
          <h3 className="text-xl font-black text-text-primary uppercase flex items-center gap-2">
            <Calculator className="text-accent" /> Loan Details
          </h3>
          <div className="space-y-4">
            <label className="text-sm font-bold block text-text-secondary">Loan Amount (₹)</label>
            <input type="number" value={loan} onChange={(e) => setLoan(Math.max(0, +e.target.value))} className="w-full bg-background p-3 rounded-xl border border-border-glass" />
          </div>
          <div className="space-y-4">
            <label className="text-sm font-bold block text-text-secondary">Interest Rate (%)</label>
            <input type="number" value={rate} onChange={(e) => setRate(+e.target.value)} className="w-full bg-background p-3 rounded-xl border border-border-glass" />
          </div>
          <div className="space-y-4">
            <label className="text-sm font-bold block text-text-secondary">Tenure (Years)</label>
            <input type="number" value={tenureYears} onChange={(e) => setTenureYears(+e.target.value)} className="w-full bg-background p-3 rounded-xl border border-border-glass" />
          </div>
        </div>
        <div className="glass p-8 rounded-3xl border border-border-glass flex flex-col items-center justify-center text-center">
            <h4 className="text-text-muted font-mono uppercase tracking-widest text-xs mb-2">Monthly EMI</h4>
            <div className="text-5xl font-black text-accent mb-8">₹{results.emi.toLocaleString()}</div>
            <div className="grid grid-cols-2 gap-6 w-full">
                <div className="bg-surface p-4 rounded-xl">
                    <p className="text-text-muted text-xs uppercase font-mono">Total Interest</p>
                    <p className="text-lg font-bold">₹{results.totalInterest.toLocaleString()}</p>
                </div>
                <div className="bg-surface p-4 rounded-xl">
                    <p className="text-text-muted text-xs uppercase font-mono">Total Payment</p>
                    <p className="text-lg font-bold">₹{results.totalPayment.toLocaleString()}</p>
                </div>
            </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl border border-border-glass">
            <h4 className="text-lg font-black mb-6 flex items-center gap-2"><BarChart3/> Principal vs Interest</h4>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                            {data.map((entry, index) => (
                                <Cell key={`car-cell-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
        <div className="glass p-8 rounded-3xl border border-border-glass space-y-4">
            <h4 className="text-lg font-black flex items-center gap-2"><Zap className="text-accent" /> Deep Insight</h4>
            <p className="uppercase text-xs font-mono text-text-muted leading-relaxed">
                Your loan EMI status is <span className="font-bold text-text-primary capitalize">{results.status}</span>.
            </p>
            <p className="uppercase text-xs font-mono text-text-muted leading-relaxed">
                Higher tenure results in more total interest paid over time due to reducing balance effect.
            </p>
            <div className="bg-accent/10 p-4 rounded-xl border border-accent/20">
                <p className="text-accent text-sm font-bold">PRO TIP</p>
                <p className="text-text-secondary text-xs">Increase your down payment upfront to drastically reduce your monthly burden.</p>
            </div>
            <button onClick={() => setShowTable(!showTable)} className="w-full mt-4 flex items-center justify-center gap-2 text-xs font-bold text-accent">
                {showTable ? "Hide Amortization" : "View Amortization Table"} {showTable ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
            </button>
        </div>
      </div>
      
      <AnimatePresence>
        {showTable && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="glass p-8 rounded-3xl border border-border-glass overflow-hidden">
                <h4 className="text-lg font-black mb-6">Amortization Table</h4>
                <div className="max-h-96 overflow-y-auto">
                    <table className="w-full text-xs font-mono">
                        <thead><tr className="text-text-muted uppercase text-left"><th className="pb-2">Month</th><th className="pb-2">EMI</th><th className="pb-2">Principal</th><th className="pb-2">Interest</th><th className="pb-2">Balance</th></tr></thead>
                        <tbody>{results.schedule.map(row => <tr key={row.month} className="border-t border-border-glass">
                            <td className="py-2">{row.month}</td>
                            <td>₹{row.emi.toLocaleString()}</td>
                            <td>₹{row.principal.toLocaleString()}</td>
                            <td>₹{row.interest.toLocaleString()}</td>
                            <td>₹{row.balance.toLocaleString()}</td>
                        </tr>)}</tbody>
                    </table>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-8 rounded-3xl border border-border-glass">
            <h3 className="text-xl font-black mb-6 uppercase tracking-tight">Car Loan FAQ</h3>
            <div className="grid md:grid-cols-2 gap-4">
                {QNA_DATA.map((item, i) => (
                    <div key={`faq-${item.q.substring(0, 20)}-${i}`} className="bg-surface p-6 rounded-2xl border border-border-glass">
                        <p className="font-bold text-accent mb-2">❓ {item.q}</p>
                        <p className="text-xs text-text-secondary leading-relaxed mb-3">{item.a}</p>
                        {item.cta && (<p className="text-[10px] uppercase font-bold text-text-primary border-t border-border-glass pt-2">👉 {item.cta}</p>)}
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
                                    key={`opt-${opt}-${idx}`}
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
                                    <p className="text-[10px] font-mono text-accent uppercase font-black mb-1">Expert Hub</p>
                                    <p className="text-[11px] text-text-secondary italic">
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
                className="mt-8 w-full py-4 bg-accent text-background rounded-xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
                {quizState.selected !== null ? "Next Question" : "Skip Question"}
            </button>
        </div>
      </div>
    </div>
  );
}
