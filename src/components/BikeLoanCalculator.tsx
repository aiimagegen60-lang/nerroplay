import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Calculator, IndianRupee, Percent, CalendarDays, Zap, HelpCircle, CheckCircle2, XCircle } from 'lucide-react';

const COLORS = ['#F59E0B', '#6366F1']; // Interest, Loan

const QNA_DATA = [
  { q: "Bike loan me EMI kaise calculate hoti hai?", a: "Bike loan me EMI flat interest pe calculate hoti hai, jisme interest poore loan amount pe lagta hai.", cta: "Exact EMI jaanne ke liye hamara calculator use karo" },
  { q: "Bike loan me flat interest aur reducing interest me kya difference hai?", a: "Flat interest → poore loan pe interest. Reducing → remaining amount pe interest. Bike loan mostly flat hota hai." },
  { q: "1 lakh ke bike loan par kitna interest lagega?", a: "Ye depend karta hai interest rate aur tenure pe. Example: 12% pe 2 saal = ₹24,000 interest.", cta: "Apna exact interest calculate karo" },
  { q: "Bike loan ke liye minimum salary kitni honi chahiye?", a: "Usually: ₹10,000 – ₹15,000/month. But depend karta hai bank/finance company ke upar." },
  { q: "Bike loan kitne time ke liye milta hai?", a: "12 months se 36 months, kabhi kabhi 48 months bhi milta hai." },
  { q: "Bike loan lene ke liye kaunse documents chahiye?", a: "Aadhaar card, PAN card, Salary proof / bank statement." },
  { q: "Down payment kitna dena padta hai?", a: "10% – 30% typical. Zero down bhi milta hai (usually high interest)." },
  { q: "Kya bina CIBIL score ke bike loan mil sakta hai?", a: "Possible hai but interest rate thoda zyada ho sakta hai." },
  { q: "Bike loan jaldi approve hota hai?", a: "Good CIBIL score, stable income, proper documents." },
  { q: "Bike loan lene se total kitna extra paisa dena padta hai?", a: "Important cheezein: Interest + Processing fee + Insurance costs.", cta: "Total cost calculate karo hamare tool se" }
];

const QUIZ_DATA = [
  {
    q: "Bike loan me interest rate calculation method ka naam kya hai?",
    options: ["Flat Interest", "Reducing Balance"],
    correct: 0,
    insight: "Bike loans me aksar Flat Interest method use hota hai, jo reducing se thoda mehenga padta hai."
  },
  {
    q: "Kya tenure 3 saal se badhane par EMI kam hoti hai?",
    options: ["Haan, par total interest badh jayega", "Nahi, asar nahi hota"],
    correct: 0,
    insight: "Tenure badhane se monthly EMI kam hoti hai but aapka total interest cost badh jata hai."
  }
];

export default function BikeLoanCalculator() {
  const [loan, setLoan] = useState<number>(100000);
  const [rate, setRate] = useState<number>(9.5);
  const [tenureMonths, setTenureMonths] = useState<number>(24);
  const [quizState, setQuizState] = useState<{current: number, selected: number | null, score: number}>({
    current: 0,
    selected: null,
    score: 0
  });

  const results = useMemo(() => {
    const years = tenureMonths / 12;
    const interest = (loan * rate * years) / 100;
    const total = loan + interest;
    const emi = total / tenureMonths;

    let costStatus = 'low';
    if (rate > 15) costStatus = 'high';
    else if (rate > 10) costStatus = 'moderate';

    return {
      interest: Math.round(interest),
      total: Math.round(total),
      emi: Math.round(emi),
      costStatus
    };
  }, [loan, rate, tenureMonths]);

  const data = [
    { name: 'Interest', value: results.interest },
    { name: 'Loan Amount', value: loan },
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
            <input 
              type="number" 
              value={loan} 
              onChange={(e) => setLoan(Math.max(0, +e.target.value))} 
              className="w-full bg-background p-3 rounded-xl border border-border-glass font-bold text-lg" 
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
                    className="w-full bg-background p-3 rounded-xl border border-border-glass font-bold text-lg" 
                />
            </div>
            <div className="space-y-4">
                <label className="text-sm font-bold block text-text-secondary">Tenure (Months)</label>
                <input 
                    type="number" 
                    value={tenureMonths} 
                    onChange={(e) => setTenureMonths(+e.target.value)} 
                    className="w-full bg-background p-3 rounded-xl border border-border-glass font-bold text-lg" 
                />
            </div>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl border border-border-glass flex flex-col items-center justify-center text-center">
            <h4 className="text-text-muted font-mono uppercase tracking-widest text-xs mb-2">Monthly EMI</h4>
            <div className="text-5xl font-black text-accent mb-8 tabular-nums">₹{results.emi.toLocaleString()}</div>
            <div className="grid grid-cols-2 gap-6 w-full">
                <div className="bg-surface p-4 rounded-xl border border-border-glass">
                    <p className="text-text-muted text-xs uppercase font-mono mb-1">Interest</p>
                    <p className="text-lg font-bold">₹{results.interest.toLocaleString()}</p>
                </div>
                <div className="bg-surface p-4 rounded-xl border border-border-glass">
                    <p className="text-text-muted text-xs uppercase font-mono mb-1">Total</p>
                    <p className="text-lg font-bold">₹{results.total.toLocaleString()}</p>
                </div>
            </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl border border-border-glass">
            <h4 className="text-lg font-black mb-6 uppercase tracking-tight">Payment Breakdown</h4>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                            {data.map((entry, index) => (
                                <Cell key={`bike-cell-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
        
        <div className="glass p-8 rounded-3xl border border-border-glass space-y-4">
            <h4 className="text-lg font-black flex items-center gap-2 uppercase tracking-tight"><Zap className="text-accent" /> Deep Insight</h4>
            <p className="uppercase text-xs font-mono text-text-muted leading-relaxed">
                <span className="text-accent font-bold">Cost analysis: </span>
                Your loan cost is categorised as <span className="font-bold text-text-primary capitalize">{results.costStatus}</span>.
            </p>
            <p className="uppercase text-xs font-mono text-text-muted leading-relaxed">
                This is a <span className="font-bold text-text-primary">Flat Interest Loan</span>. Unlike reducing balance, you pay interest on the original loan amount throughout the tenure.
            </p>
            <div className="bg-accent/10 p-4 rounded-xl border border-accent/20">
                <p className="text-accent text-sm font-bold uppercase mb-1 font-mono">PRO TIP</p>
                <p className="text-text-secondary text-[11px] uppercase leading-tight font-bold">Keeping tenure shorter significantly reduces the total interest paid in flat interest loans.</p>
            </div>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-8 rounded-3xl border border-border-glass">
            <h3 className="text-xl font-black mb-6 uppercase tracking-tight">Bike Loan FAQ</h3>
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
                                    <p className="text-[10px] font-mono text-accent uppercase font-black mb-1">Market Analysis</p>
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
