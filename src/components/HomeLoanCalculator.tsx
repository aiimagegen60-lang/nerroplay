import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Calculator, Zap, ChevronDown, ChevronUp, BarChart3, Info, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

const COLORS = ['#F59E0B', '#6366F1'];

const QNA_DATA = [
  { q: "Home loan EMI kaise calculate hoti hai?", a: "Home loan EMI reducing balance formula se calculate hoti hai, jisme interest bache hue loan amount pe lagta hai." },
  { q: "20 lakh home loan EMI kitni hogi?", a: "Ye tenure aur interest rate pe depend karta hai. Lagbhag ₹17,000 se ₹20,000 (20 years ke liye)." },
  { q: "Home loan interest rate kitna hota hai?", a: "Vartaman me ye lagbhag 8% – 10% ke beech hota hai, jo aapke CIBIL score pe bhi nirbhar karta hai." },
  { q: "Maximum tenure kitna milta hai?", a: "Zyadatar banks 20 se 30 saal tak ka tenure provide karte hain." },
  { q: "Down payment kitna dena padta hai?", a: "Property value ka 10% – 25% down payment ke roop me dena hota hai." },
  { q: "EMI kam kaise kare?", a: "Tenure badhakar ya higher down payment dekar aap apni monthly EMI kam kar sakte hain." },
  { q: "Prepayment se kya benefit hota hai?", a: "Prepayment karne se aapka principal jaldi khatam hota hai aur aapka total interest cost bach jata hai." },
  { q: "Fixed vs floating interest kya hota hai?", a: "Fixed me interest rate same rehta hai, jabki floating me market changes ke hisaab se badalta rehta hai." },
  { q: "CIBIL score kitna chahiye?", a: "750 ya usse zyada ka CIBIL score best home loan rates ke liye ideal hai." },
  { q: "Loan approve kaise jaldi hota hai?", a: "Stable income proof, saare zaroori documents aur ek accha credit score loan jaldi approve karwa sakta hai." }
];

const QUIZ_DATA = [
  {
    q: "Kya tenure kam karne se total interest badhta hai ya kam hota hai?",
    options: ["Interest Badhta hai", "Interest Kam hota hai"],
    correct: 1,
    insight: "Tenure kam karne se aap EMI zyada dete hain par interest kaafi bach jata hai."
  },
  {
    q: "Home loan interest kis pe lagta hai?",
    options: ["Full Loan Amount", "Remaining Balance"],
    correct: 1,
    insight: "Reducing balance method me interest sirf bache hue amount pe lagta hai."
  }
];

export default function HomeLoanCalculator() {
  const [loan, setLoan] = useState<number>(2500000);
  const [rate, setRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(20);
  const [showTable, setShowTable] = useState(false);
  const [quizState, setQuizState] = useState<{current: number, selected: number | null, score: number}>({
    current: 0,
    selected: null,
    score: 0
  });

  const results = useMemo(() => {
    const months = tenureYears * 12;
    const r = rate / 12 / 100;
    
    // EMI Formula
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
      schedule.push({
        month: i,
        emi: Math.round(emi),
        principal: Math.round(principal),
        interest: Math.round(interest),
        balance: Math.max(0, Math.round(balance))
      });
    }

    const isRisky = emi > 50000; // Arbitrary threshold for "risky"

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      schedule,
      isRisky
    };
  }, [loan, rate, tenureYears]);

  const chartData = [
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
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Info */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl md:text-3xl font-black text-text-primary uppercase tracking-tight">Home Loan EMI Calculator</h2>
        <p className="text-sm text-text-muted uppercase font-mono max-w-2xl mx-auto tracking-wide">
          Instantly calculate your monthly EMI, total interest, and full repayment breakdown with our advanced PRO engine.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Controls */}
        <div className="glass p-8 rounded-3xl border border-border-glass space-y-6">
          <h3 className="text-xl font-black text-text-primary uppercase flex items-center gap-2">
            <Calculator className="text-accent" /> Configure Loan
          </h3>
          
          <div className="space-y-4">
            <label className="text-sm font-bold block text-text-secondary">Loan Amount (₹)</label>
            <input 
              type="number" 
              value={loan} 
              onChange={(e) => setLoan(Math.max(0, +e.target.value))} 
              className="w-full bg-background p-4 rounded-xl border border-border-glass font-bold text-lg focus:border-accent outline-none"
              placeholder="Enter loan amount"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
                <label className="text-sm font-bold block text-text-secondary">Interest Rate (%)</label>
                <input 
                    type="number" 
                    step="0.1"
                    value={rate} 
                    onChange={(e) => setRate(+e.target.value)} 
                    className="w-full bg-background p-4 rounded-xl border border-border-glass font-bold text-lg focus:border-accent outline-none"
                    placeholder="Rate"
                />
            </div>
            <div className="space-y-4">
                <label className="text-sm font-bold block text-text-secondary">Tenure (Years)</label>
                <input 
                    type="number" 
                    value={tenureYears} 
                    onChange={(e) => setTenureYears(Math.max(1, +e.target.value))} 
                    className="w-full bg-background p-4 rounded-xl border border-border-glass font-bold text-lg focus:border-accent outline-none"
                    placeholder="Tenure"
                />
            </div>
          </div>
        </div>

        {/* Big EMI Highlight */}
        <div className="glass p-8 rounded-3xl border border-border-glass flex flex-col items-center justify-center text-center bg-accent/5">
            <h4 className="text-text-muted font-mono uppercase tracking-widest text-xs mb-2">Monthly EMI Amount</h4>
            <div className="text-6xl md:text-7xl font-black text-accent mb-8 tabular-nums">
                ₹{results.emi.toLocaleString()}
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
                <div className="bg-surface p-6 rounded-2xl border border-border-glass">
                    <p className="text-text-muted text-[10px] uppercase font-mono mb-1">Total Interest</p>
                    <p className="text-xl font-bold">₹{results.totalInterest.toLocaleString()}</p>
                </div>
                <div className="bg-surface p-6 rounded-2xl border border-border-glass">
                    <p className="text-text-muted text-[10px] uppercase font-mono mb-1">Total Payment</p>
                    <p className="text-xl font-bold">₹{results.totalPayment.toLocaleString()}</p>
                </div>
            </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Visualization */}
        <div className="glass p-8 rounded-3xl border border-border-glass">
            <h4 className="text-lg font-black mb-6 flex items-center gap-2 tracking-tight uppercase">
                <BarChart3 className="text-accent"/> Principal vs Interest
            </h4>
            <div className="h-72">
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
                                <Cell key={`home-cell-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #333', color: '#FFF' }}
                        />
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Insight Section */}
        <div className="glass p-8 rounded-3xl border border-border-glass space-y-6">
            <h4 className="text-lg font-black flex items-center gap-2 uppercase tracking-tight">
                <Zap className="text-accent" /> Loan Intelligence
            </h4>
            
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${results.isRisky ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                        <Info size={20}/>
                    </div>
                    <div>
                        <p className="text-xs font-mono uppercase text-text-muted">Repayment Status</p>
                        <p className="font-bold text-sm tracking-tight">
                            {results.isRisky ? 'EMI is relatively high. Ensure stable cashflow.' : 'EMI seems affordable based on loan scale.'}
                        </p>
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-surface border border-border-glass space-y-3">
                    <p className="uppercase text-[10px] font-mono text-accent font-bold">Smart Analysis</p>
                    <p className="text-xs text-text-secondary leading-relaxed uppercase">
                        With a <span className="text-text-primary font-bold">{tenureYears} year</span> tenure, your total interest is 
                        <span className="text-text-primary font-bold"> ₹{results.totalInterest.toLocaleString()}</span>. 
                        Reducing the tenure by even 5 years could save you lakhs in interest.
                    </p>
                </div>

                <div className="bg-accent/10 p-5 rounded-2xl border border-accent/20">
                    <p className="text-accent text-[10px] font-mono font-black uppercase mb-1">PRO TIP</p>
                    <p className="text-text-primary text-xs font-bold leading-tight uppercase">
                        Always aim for a 20%+ down payment. It significantly reduces your borrowing cost and monthly stress.
                    </p>
                </div>
            </div>

            <button 
                onClick={() => setShowTable(!showTable)} 
                className="w-full py-4 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-accent border border-accent/20 rounded-xl hover:bg-accent/5 transition-colors"
            >
                {showTable ? "Hide Repayment Schedule" : "View Amortization Table"} 
                {showTable ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
            </button>
        </div>
      </div>

      {/* Repayment Table */}
      <AnimatePresence>
        {showTable && (
            <motion.div 
                initial={{ height: 0, opacity: 0 }} 
                animate={{ height: 'auto', opacity: 1 }} 
                exit={{ height: 0, opacity: 0 }} 
                className="glass p-8 rounded-3xl border border-border-glass overflow-hidden"
            >
                <div className="flex justify-between items-center mb-6">
                    <h4 className="text-lg font-black uppercase tracking-tight">Monthly Repayment Schedule</h4>
                    <span className="text-[10px] font-mono text-text-muted bg-surface px-2 py-1 rounded">Reducing Balance Logic</span>
                </div>
                <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead className="sticky top-0 bg-background/80 backdrop-blur-md z-10">
                            <tr className="text-text-muted uppercase text-[10px] font-mono border-b border-border-glass">
                                <th className="pb-4">Month</th>
                                <th className="pb-4">EMI</th>
                                <th className="pb-4">Principal</th>
                                <th className="pb-4">Interest</th>
                                <th className="pb-4">Balance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-glass">
                            {results.schedule.map(row => (
                                <tr key={row.month} className="hover:bg-accent/5 transition-colors text-[11px] font-mono">
                                    <td className="py-4 text-text-muted">{row.month}</td>
                                    <td className="py-4 font-bold">₹{row.emi.toLocaleString()}</td>
                                    <td className="py-4 text-green-500">₹{row.principal.toLocaleString()}</td>
                                    <td className="py-4 text-red-500">₹{row.interest.toLocaleString()}</td>
                                    <td className="py-4 text-text-primary">₹{row.balance.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* QnA + Quiz Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-10 rounded-3xl border border-border-glass">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-8 bg-accent rounded-full" />
                <h3 className="text-2xl font-black uppercase tracking-tight">Home Loan FAQ</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                {QNA_DATA.map((item, i) => (
                    <div key={`faq-${item.q.substring(0, 20)}-${i}`} className="bg-surface/50 p-6 rounded-2xl border border-border-glass group hover:border-accent/40 transition-all">
                        <p className="font-bold text-accent text-sm mb-3 flex items-start gap-2">
                            <span className="bg-accent/10 px-2 py-0.5 rounded text-[10px]">Q</span>
                            {item.q}
                        </p>
                        <p className="text-xs text-text-secondary leading-relaxed pl-7">
                            {item.a}
                        </p>
                    </div>
                ))}
            </div>
        </div>

        {/* Quiz Sidebar/Block */}
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
                            {QUI_DATA[quizState.current]?.q || "Ready for next question?"}
                        </p>
                        
                        <div className="space-y-2">
                            {QUI_DATA[quizState.current]?.options.map((opt, idx) => (
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

                        {quizState.selected !== null && (
                            <motion.div 
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-background/50 rounded-xl border border-border-glass"
                            >
                                <p className="text-[10px] font-mono text-accent uppercase font-black mb-1">Analysis</p>
                                <p className="text-[11px] text-text-secondary italic">
                                    {QUIZ_DATA[quizState.current].insight}
                                </p>
                            </motion.div>
                        )}
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

const QUI_DATA = QUIZ_DATA; // Helper
