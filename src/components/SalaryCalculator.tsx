import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { IndianRupee, TrendingDown, Calculator, Wallet, ShieldCheck, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import AIDeepAnalysis from './AIDeepAnalysis';
import { useLanguage } from '../context/LanguageContext';

interface TaxResult {
    grossAnnual: number;
    standardDeduction: number;
    taxableIncome: number;
    taxAmount: number;
    cess: number;
    totalTax: number;
    pfAmount: number;
    totalDeductions: number;
    inHandAnnual: number;
    inHandMonthly: number;
    regime: string;
    slabs: { range: string; rate: number; tax: number }[];
}

const REGIMES = [
    { id: 'new', label: 'New Regime (FY 24-25)', desc: 'Simplified, lower rates, no deductions' },
    { id: 'old', label: 'Old Regime', desc: 'Higher rates, allows 80C, HRA, etc.' }
];

export default function SalaryCalculator() {
    const [monthlySalary, setMonthlySalary] = useState<number>(100000);
    const [bonus, setBonus] = useState<number>(50000);
    const [regime, setRegime] = useState<'new' | 'old'>('new');
    const [profession, setProfession] = useState<'salaried' | 'self'>('salaried');

    const calculateTax = (annual: number, type: 'new' | 'old'): TaxResult => {
        const stdDed = profession === 'salaried' ? (type === 'new' ? 75000 : 50000) : 0;
        const taxableIncome = Math.max(0, annual - stdDed);
        let tax = 0;
        const slabs: { range: string; rate: number; tax: number }[] = [];

        if (type === 'new') {
            // New Regime Slabs Budget 2024
            const s = [
                { limit: 300000, rate: 0 },
                { limit: 700000, rate: 0.05 },
                { limit: 1000000, rate: 0.10 },
                { limit: 1200000, rate: 0.15 },
                { limit: 1500000, rate: 0.20 },
                { limit: Infinity, rate: 0.30 }
            ];
            
            let prevLimit = 0;
            for (const slab of s) {
                if (taxableIncome > prevLimit) {
                    const taxableInSlab = Math.min(taxableIncome - prevLimit, slab.limit - prevLimit);
                    const slabTax = taxableInSlab * slab.rate;
                    tax += slabTax;
                    slabs.push({ range: `${prevLimit/1000}k-${slab.limit === Infinity ? '∞' : slab.limit/1000}k`, rate: slab.rate * 100, tax: slabTax });
                }
                prevLimit = slab.limit;
            }
            // Rebate u/s 87A for New Regime (up to 7L taxable)
            if (taxableIncome <= 700000) tax = 0;

        } else {
            // Old Regime Slabs
            const s = [
                { limit: 250000, rate: 0 },
                { limit: 500000, rate: 0.05 },
                { limit: 1000000, rate: 0.20 },
                { limit: Infinity, rate: 0.30 }
            ];
            let prevLimit = 0;
            for (const slab of s) {
                if (taxableIncome > prevLimit) {
                    const taxableInSlab = Math.min(taxableIncome - prevLimit, slab.limit - prevLimit);
                    const slabTax = taxableInSlab * slab.rate;
                    tax += slabTax;
                    slabs.push({ range: `${prevLimit/1000}k-${slab.limit === Infinity ? '∞' : slab.limit/1000}k`, rate: slab.rate * 100, tax: slabTax });
                }
                prevLimit = slab.limit;
            }
            if (taxableIncome <= 500000) tax = 0;
        }

        const cess = tax * 0.04;
        const totalTax = tax + cess;
        const pfAmount = profession === 'salaried' ? (monthlySalary * 0.12 * 12) : 0;
        const totalDeductions = totalTax + pfAmount;
        const inHandAnnual = annual - totalDeductions;

        return {
            grossAnnual: annual,
            standardDeduction: stdDed,
            taxableIncome,
            taxAmount: tax,
            cess,
            totalTax,
            pfAmount,
            totalDeductions,
            inHandAnnual,
            inHandMonthly: inHandAnnual / 12,
            regime: type,
            slabs
        };
    };

    const results = useMemo(() => {
        const annual = (monthlySalary * 12) + bonus;
        return calculateTax(annual, regime);
    }, [monthlySalary, bonus, regime, profession]);

    const handleDeepAnalysis = async () => {
        const response = await fetch('/api/ai/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                tool: 'Salary Calculator', 
                data: {
                    grossAnnual: results.grossAnnual,
                    totalTax: results.totalTax,
                    inHandAnnual: results.inHandAnnual,
                    regime: results.regime,
                    profession
                }
            }),
        });

        if (!response.ok) throw new Error('Failed to analyze');
        const data = await response.json();
        return data.analysis;
    };

    const compare = useMemo(() => {
        const annual = (monthlySalary * 12) + bonus;
        return {
            new: calculateTax(annual, 'new'),
            old: calculateTax(annual, 'old')
        };
    }, [monthlySalary, bonus, profession]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(val);
    };

    const pieData = [
        { name: 'In-Hand', value: results.inHandAnnual, color: '#10b981' },
        { name: 'Tax', value: results.totalTax, color: '#ef4444' },
        { name: 'PF', value: results.pfAmount, color: '#4f46e5' },
    ];

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-12">
            <header className="text-center space-y-4">
                <h1 className="text-4xl md:text-6xl font-black text-text-primary tracking-tighter uppercase leading-none">
                    Salary <span className="text-accent underline decoration-accent/20">Architect.</span>
                </h1>
                <p className="text-text-muted font-mono uppercase tracking-[0.2em] text-xs">India FY 2024-25 Precision Tax Engine</p>
            </header>

            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Inputs */}
                <div className="lg:col-span-4 space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass p-8 rounded-3xl border border-white/5 space-y-6"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Calculator size={18} className="text-accent" />
                            <h2 className="text-[0.65rem] font-mono font-bold uppercase tracking-widest text-text-primary">Income Parameters</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2 text-left">
                                <label className="text-[0.6rem] font-mono text-text-muted uppercase tracking-widest flex justify-between">
                                    Monthly Base Salary <span>{formatCurrency(monthlySalary)}</span>
                                </label>
                                <div className="relative">
                                    <input 
                                        type="number"
                                        value={monthlySalary}
                                        onChange={(e) => setMonthlySalary(Number(e.target.value))}
                                        className="w-full bg-background/50 border border-border-glass rounded-xl p-4 pl-12 font-mono text-sm focus:border-accent outline-none"
                                    />
                                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                                </div>
                            </div>

                            <div className="space-y-2 text-left">
                                <label className="text-[0.6rem] font-mono text-text-muted uppercase tracking-widest flex justify-between">
                                    Annual Bonus / Variable <span>{formatCurrency(bonus)}</span>
                                </label>
                                <div className="relative">
                                    <input 
                                        type="number"
                                        value={bonus}
                                        onChange={(e) => setBonus(Number(e.target.value))}
                                        className="w-full bg-background/50 border border-border-glass rounded-xl p-4 pl-12 font-mono text-sm focus:border-accent outline-none"
                                    />
                                    <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[0.6rem] font-mono text-text-muted uppercase tracking-widest">Tax Regime</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {REGIMES.map((reg, idx) => (
                                        <button
                                            key={`regime-${reg.id}-${idx}`}
                                            onClick={() => setRegime(reg.id as any)}
                                            className={`p-4 rounded-xl border text-left transition-all ${
                                                regime === reg.id 
                                                ? 'bg-accent/10 border-accent text-text-primary' 
                                                : 'bg-background/20 border-border-glass text-text-muted hover:border-accent/40'
                                            }`}
                                        >
                                            <div className="text-xs font-bold uppercase">{reg.label}</div>
                                            <div className="text-[0.5rem] font-mono mt-1 opacity-60 tracking-wider uppercase">{reg.desc}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-2 p-1 bg-surface rounded-xl">
                                {['salaried', 'self'].map((p, idx) => (
                                    <button
                                        key={`prof-${p}-${idx}`}
                                        onClick={() => setProfession(p as any)}
                                        className={`flex-1 py-2 rounded-lg text-[0.6rem] font-mono font-bold uppercase transition-all ${
                                            profession === p ? 'bg-accent text-background' : 'text-text-muted'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    <div className="glass p-6 rounded-3xl border border-accent/10 bg-accent/5">
                        <h4 className="text-[0.65rem] font-mono font-bold uppercase tracking-widest text-accent mb-4 flex items-center gap-2">
                             <TrendingDown size={14} /> Tax Optimization
                        </h4>
                        <p className="text-[0.65rem] font-mono text-text-primary leading-relaxed uppercase">
                            {compare.new.totalTax < compare.old.totalTax 
                                ? `Switching to New Regime saves you ${formatCurrency(compare.old.totalTax - compare.new.totalTax)} annually.`
                                : `Old Regime is better for you by ${formatCurrency(compare.new.totalTax - compare.old.totalTax)} if you have max deductions.`
                            }
                        </p>
                    </div>
                </div>

                {/* Outputs */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="md:col-span-2 glass p-10 rounded-[2.5rem] border border-accent/20 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] rounded-full pointer-events-none" />
                            <span className="text-[0.65rem] font-mono text-accent uppercase tracking-[0.4em] font-bold">Monthly In-Hand</span>
                            <div className="text-6xl md:text-8xl font-black text-text-primary tracking-tighter mt-4 mb-6 leading-none">
                                {formatCurrency(results.inHandMonthly)}
                            </div>
                            <div className="flex flex-wrap items-center gap-4 border-t border-white/5 pt-6">
                                <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[0.6rem] font-mono font-bold uppercase flex items-center gap-2">
                                     <CheckCircle2 size={12} /> Optimization Level: {results.totalTax > results.grossAnnual * 0.2 ? 'Moderate' : 'High'}
                                </div>
                                <div className="text-[0.6rem] font-mono text-text-muted uppercase flex items-center gap-2">
                                    <ShieldCheck size={14} className="text-accent" /> FY 2024-25 Compliant
                                </div>
                            </div>
                        </motion.div>

                        <div className="glass p-8 rounded-3xl border border-white/5">
                            <span className="text-[0.6rem] font-mono text-text-muted uppercase tracking-widest">Total Income (Gross)</span>
                            <div className="text-3xl font-bold text-text-primary mt-2 tracking-tight">{formatCurrency(results.grossAnnual)}</div>
                        </div>

                        <div className="glass p-8 rounded-3xl border border-white/5">
                            <span className="text-[0.6rem] font-mono text-red-400 uppercase tracking-widest">Total Tax Deduction</span>
                            <div className="text-3xl font-bold text-red-500 mt-2 tracking-tight">{formatCurrency(results.totalTax)}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         {/* Distribution */}
                        <div className="glass p-8 rounded-[2.5rem] border border-white/5 h-[350px] flex flex-col">
                            <h3 className="text-[0.65rem] font-mono font-bold uppercase tracking-widest text-text-primary mb-8 flex justify-between items-center">
                                Distribution <span>Annual</span>
                            </h3>
                            <div className="flex-1 min-h-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={10} dataKey="value">
                                            {pieData.map((entry, index) => <Cell key={`salary-dist-${entry.name}`} fill={entry.color} stroke="none" />)}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#000', border: '1px solid #222', borderRadius: '12px', fontSize: '10px' }}
                                            formatter={(val: number) => formatCurrency(val)}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex justify-center gap-6 mt-6">
                                {pieData.map((d, i) => (
                                    <div key={`pie-leg-${d.name}-${i}`} className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                                        <span className="text-[0.55rem] font-mono text-text-muted uppercase">{d.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Slabs */}
                        <div className="glass p-8 rounded-[2.5rem] border border-white/5 h-[350px] overflow-hidden flex flex-col">
                            <h3 className="text-[0.65rem] font-mono font-bold uppercase tracking-widest text-text-primary mb-6">Tax Slab Breakdown</h3>
                            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                                {results.slabs.map((s, i) => (
                                    <div key={`slab-${s.range}-${i}`} className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between group hover:border-accent/40 transition-all">
                                        <div>
                                            <div className="text-[0.55rem] font-mono text-text-muted uppercase tracking-widest">{s.range}</div>
                                            <div className="text-[0.65rem] font-bold text-text-primary uppercase">{s.rate}% Rate</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[0.65rem] font-bold text-red-400">{formatCurrency(s.tax)}</div>
                                            <div className="text-[0.45rem] font-mono text-text-muted uppercase">Tax in Slab</div>
                                        </div>
                                    </div>
                                ))}
                                {results.totalTax === 0 && (
                                    <div className="h-full flex items-center justify-center text-[0.6rem] font-mono text-emerald-400 uppercase text-center p-8 bg-emerald-500/5 rounded-3xl border border-emerald-500/20">
                                        Rebate applied. Zero tax liability detected for this income level.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Comparison */}
                    <div className="glass rounded-[2rem] border border-white/5 overflow-hidden">
                        <div className="p-6 bg-white/5 flex items-center justify-between border-b border-white/5">
                            <h3 className="text-[0.65rem] font-mono font-bold uppercase tracking-widest text-text-primary">Regime Comparison</h3>
                            <span className="text-[0.55rem] font-mono text-accent uppercase">Annual Metrics</span>
                        </div>
                        <div className="grid grid-cols-2 divide-x divide-white/5">
                            <div className="p-8 space-y-6">
                                <div className="text-[0.6rem] font-mono text-slate-500 uppercase tracking-widest mb-1">Old Regime</div>
                                <div className="space-y-4">
                                     <div className="flex justify-between items-center">
                                         <span className="text-[0.5rem] font-mono text-text-muted uppercase">Total Tax</span>
                                         <span className="text-xs font-bold text-red-500">{formatCurrency(compare.old.totalTax)}</span>
                                     </div>
                                     <div className="flex justify-between items-center">
                                         <span className="text-[0.5rem] font-mono text-text-muted uppercase">In-Hand Salary</span>
                                         <span className="text-xs font-bold text-text-primary">{formatCurrency(compare.old.inHandAnnual)}</span>
                                     </div>
                                </div>
                            </div>
                            <div className="p-8 bg-accent/5 space-y-6">
                                <div className="text-[0.6rem] font-mono text-accent uppercase tracking-widest mb-1 flex items-center gap-2">New Regime <Zap size={10} fill="currentColor" /></div>
                                <div className="space-y-4">
                                     <div className="flex justify-between items-center">
                                         <span className="text-[0.5rem] font-mono text-text-muted uppercase">Total Tax</span>
                                         <span className="text-xs font-bold text-emerald-500">{formatCurrency(compare.new.totalTax)}</span>
                                     </div>
                                     <div className="flex justify-between items-center">
                                         <span className="text-[0.5rem] font-mono text-text-muted uppercase">In-Hand Salary</span>
                                         <span className="text-xs font-bold text-text-primary">{formatCurrency(compare.new.inHandAnnual)}</span>
                                     </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <AIDeepAnalysis 
                toolName="Wealth" 
                onAnalyze={handleDeepAnalysis} 
            />
            
            {/* SEO Section */}
            <section className="pt-20 border-t border-white/5 space-y-12">
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                    <h2 className="text-2xl font-black uppercase tracking-tight">Salary Tax Optimization Hub</h2>
                    <p className="text-xs font-mono text-text-muted uppercase leading-relaxed tracking-wider">
                        Navigate Indian income tax complexities with precision. Our engine calculates real-world take-home based on the latest 2024 budget mandates.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-6">
                        <h3 className="text-xs font-mono font-bold text-accent uppercase tracking-widest">Crucial Salary Knowledge</h3>
                        <div className="space-y-4">
                            {[
                                { q: "In-hand salary kaise calculate hoti hai?", a: "Gross salary – tax – PF = in-hand salary. It reflects what you actually receive in your bank account." },
                                { q: "Old vs new tax regime me kaun better hai?", a: "It depends. If your deductions (like HRA, 80C) are high, Old might lead. Otherwise, New regime is now more efficient for most." },
                                { q: "Bonus pe tax lagta hai?", a: "Yes, bonuses are fully taxable as per your income tax slab. There is no special lower rate for bonus." },
                                { q: "PF kitna cut hota hai?", a: "Statutory PF is usually 12% of your basic salary. Both employee and employer contribute the same." }
                            ].map((item, i) => (
                                <div key={`knowledge-${i}`} className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                                    <div className="text-[0.65rem] font-bold uppercase text-text-primary flex items-start gap-2">
                                        <ArrowRight size={14} className="text-accent shrink-0 mt-0.5" /> {item.q}
                                    </div>
                                    <p className="text-[0.6rem] font-mono text-text-muted leading-relaxed uppercase ml-6">{item.a}</p>
                                </div>
                            ))}
                        </div>
                     </div>

                     <div className="space-y-6">
                        <h3 className="text-xs font-mono font-bold text-accent uppercase tracking-widest">Taxation FAQ</h3>
                        <div className="space-y-4">
                            {[
                                { q: "CTC aur in-hand me difference kya hai?", a: "CTC includes variables like EPF, insurance, and performance bonus. In-hand is the monthly take-home amount." },
                                { q: "Monthly take-home kaise badhaye?", a: "Proper tax planning, choosing the right regime, and utilizing company benefits (LTA, Meal cards) can help." },
                                { q: "₹50,000 salary par kitna tax lagta hai?", a: "If total income is up to 7L annually in New Regime, tax is effectively zero due to rebate." },
                                { q: "Tax slab kya hota hai?", a: "It refers to the tiered system where your income is divided into ranges, each taxed at a different percentage." }
                            ].map((item, i) => (
                                <div key={`faq-${i}`} className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                                    <div className="text-[0.65rem] font-bold uppercase text-text-primary flex items-start gap-2">
                                        <ArrowRight size={14} className="text-accent shrink-0 mt-0.5" /> {item.q}
                                    </div>
                                    <p className="text-[0.6rem] font-mono text-text-muted leading-relaxed uppercase ml-6">{item.a}</p>
                                </div>
                            ))}
                        </div>
                     </div>
                </div>
            </section>

            <footer className="text-center py-12 opacity-40">
                <p className="text-[0.55rem] font-mono tracking-[0.6em] uppercase">Built with Financial Integrity © 2026</p>
            </footer>
        </div>
    );
}
