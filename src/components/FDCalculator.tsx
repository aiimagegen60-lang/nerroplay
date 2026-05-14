import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { IndianRupee, TrendingUp, Info, Calendar, Percent, ShieldCheck, Zap } from 'lucide-react';

interface GrowthData {
  year: number;
  balance: number;
  interest: number;
}

interface FrequencyOption {
  label: string;
  value: number;
}

const FREQUENCIES: FrequencyOption[] = [
  { label: 'Yearly', value: 1 },
  { label: 'Half-Yearly', value: 2 },
  { label: 'Quarterly', value: 4 },
  { label: 'Monthly', value: 12 },
];

export default function FDCalculator() {
  const [principal, setPrincipal] = useState<number>(100000);
  const [rate, setRate] = useState<number>(7.5);
  const [tenure, setTenure] = useState<number>(5);
  const [frequency, setFrequency] = useState<number>(4);

  const results = useMemo(() => {
    const P = Math.max(0, principal ?? 0);
    const r = Math.max(0, rate ?? 0) / 100;
    const t = Math.max(0, tenure ?? 0);
    const n = frequency;

    const maturityAmount = P * Math.pow(1 + r / n, n * t);
    const totalInterest = maturityAmount - P;

    const growth: GrowthData[] = [];
    for (let i = 0; i <= Math.ceil(t); i++) {
        const amountAtYear = P * Math.pow(1 + r / n, n * i);
        growth.push({
            year: i,
            balance: Math.round(amountAtYear),
            interest: Math.round(amountAtYear - P)
        });
    }

    const freqComparison = FREQUENCIES.map(f => ({
        label: f.label,
        amount: Math.round(P * Math.pow(1 + r / f.value, f.value * t))
    }));

    let status = 'Moderate';
    let statusColor = 'text-yellow-400';
    if (rate > 8.5) { status = 'Strong'; statusColor = 'text-accent'; }
    else if (rate < 6) { status = 'Low'; statusColor = 'text-red-400'; }

    return {
      maturityAmount: Math.round(maturityAmount),
      totalInterest: Math.round(totalInterest),
      principal: P,
      growth,
      freqComparison,
      status,
      statusColor
    };
  }, [principal, rate, tenure, frequency]);

  const pieData = [
    { name: 'Principal', value: results.principal, color: '#6366f1' },
    { name: 'Interest', value: results.totalInterest, color: '#10b981' },
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="max-w-6xl mx-auto p-2">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-4 space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-6 rounded-3xl border border-white/5 space-y-6"
          >
            <div className="flex items-center gap-2 mb-4">
                <Zap size={18} className="text-accent" />
                <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-text-primary">Parameters</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[0.6rem] font-mono text-text-muted uppercase tracking-widest flex justify-between">
                  Principal Amount <span>{formatCurrency(principal)}</span>
                </label>
                <div className="relative">
                  <input 
                    type="number"
                    value={principal}
                    onChange={(e) => setPrincipal(Number(e.target.value))}
                    className="w-full bg-background/50 border border-border-glass rounded-xl p-4 pl-12 font-mono text-xs focus:border-accent outline-none transition-all"
                  />
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                </div>
                <input 
                  type="range" 
                  min="1000" 
                  max="10000000" 
                  step="5000"
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="w-full h-1 bg-surface rounded-lg appearance-none cursor-pointer accent-accent"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[0.6rem] font-mono text-text-muted uppercase tracking-widest flex justify-between">
                  Interest Rate (%) <span>{rate}%</span>
                </label>
                <div className="relative">
                  <input 
                    type="number"
                    value={rate}
                    step="0.1"
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full bg-background/50 border border-border-glass rounded-xl p-4 pl-12 font-mono text-xs focus:border-accent outline-none transition-all"
                  />
                  <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="20" 
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full h-1 bg-surface rounded-lg appearance-none cursor-pointer accent-accent"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[0.6rem] font-mono text-text-muted uppercase tracking-widest flex justify-between">
                  Time Period (Years) <span>{tenure} Yrs</span>
                </label>
                <div className="relative">
                  <input 
                    type="number"
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full bg-background/50 border border-border-glass rounded-xl p-4 pl-12 font-mono text-xs focus:border-accent outline-none transition-all"
                  />
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="30" 
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full h-1 bg-surface rounded-lg appearance-none cursor-pointer accent-accent"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[0.6rem] font-mono text-text-muted uppercase tracking-widest">
                  Compounding Frequency
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FREQUENCIES.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setFrequency(f.value)}
                      className={`py-2 rounded-xl border text-[0.55rem] font-mono font-bold uppercase transition-all ${
                        frequency === f.value 
                          ? 'bg-accent text-background border-accent' 
                          : 'bg-background/20 border-border-glass text-text-muted hover:border-accent/40'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="glass p-6 rounded-3xl border border-accent/10 bg-accent/5">
            <h4 className="text-[0.65rem] font-mono font-bold uppercase tracking-widest text-accent mb-4 flex items-center gap-2">
                <Info size={14} /> Intelligence
            </h4>
            <div className="space-y-4">
              <p className="text-[0.6rem] font-mono text-text-primary leading-relaxed uppercase">
                {tenure < 3 
                    ? "Short-term lock-in. Liquid assets prioritized over max yield."
                    : "Compounding power is accelerating. High efficiency detected."
                }
              </p>
              <div className="pt-4 border-t border-accent/10">
                 <span className="text-[0.5rem] font-mono text-text-muted uppercase">Frequency Gain:</span>
                 <div className="text-xs font-bold text-text-primary mt-1">
                    {formatCurrency(results.freqComparison[3].amount - results.freqComparison[0].amount)} added
                 </div>
                 <p className="text-[0.45rem] font-mono text-text-muted mt-1 uppercase">Switching to monthly compounding</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="md:col-span-3 glass p-8 rounded-[2.5rem] border border-accent/20 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] rounded-full group-hover:bg-accent/10 transition-all" />
              <span className="text-[0.6rem] font-mono text-accent uppercase tracking-[0.4em] font-bold">Maturity Amount</span>
              <div className="text-5xl md:text-7xl font-black text-text-primary tracking-tighter mt-4 mb-6 leading-none">
                {formatCurrency(results.maturityAmount)}
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className={`px-4 py-1.5 rounded-full border border-current text-[0.6rem] font-mono font-bold uppercase ${results.statusColor} bg-current/5`}>
                    {results.status} Returns
                </div>
                <div className="text-[0.6rem] font-mono text-text-muted uppercase flex items-center gap-2">
                    <ShieldCheck size={14} className="text-accent" /> Guaranteed Principal
                </div>
              </div>
            </motion.div>

            <div className="glass p-6 rounded-3xl border border-white/5">
                <span className="text-[0.55rem] font-mono text-text-muted uppercase tracking-widest">Interest Earned</span>
                <div className="text-2xl font-bold text-accent mt-2 tracking-tight">{formatCurrency(results.totalInterest)}</div>
            </div>

            <div className="glass p-6 rounded-3xl border border-white/5">
                <span className="text-[0.55rem] font-mono text-text-muted uppercase tracking-widest">Invested Capital</span>
                <div className="text-2xl font-bold text-text-primary mt-2 tracking-tight">{formatCurrency(results.principal)}</div>
            </div>

            <div className="glass p-6 rounded-3xl border border-white/5">
                <span className="text-[0.55rem] font-mono text-text-muted uppercase tracking-widest">Growth Factor</span>
                <div className="text-2xl font-bold text-text-primary mt-2 tracking-tight">{(results.maturityAmount / results.principal).toFixed(2)}x</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="glass p-8 rounded-[2rem] border border-white/5 h-[350px] flex flex-col">
                <h3 className="text-[0.65rem] font-mono font-bold uppercase tracking-widest text-text-primary mb-8">Capital Allocation</h3>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        innerRadius={65}
                        outerRadius={85}
                        paddingAngle={8}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#000', border: '1px solid #222', borderRadius: '12px', fontSize: '10px' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(val: number) => formatCurrency(val)}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#6366f1]" />
                    <span className="text-[0.55rem] font-mono text-text-muted uppercase">Principal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                    <span className="text-[0.55rem] font-mono text-text-muted uppercase">Returns</span>
                  </div>
                </div>
             </div>

             <div className="glass p-8 rounded-[2rem] border border-white/5 h-[350px]">
                <h3 className="text-[0.65rem] font-mono font-bold uppercase tracking-widest text-text-primary mb-8">Value Projection</h3>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={results.growth}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#111" />
                      <XAxis dataKey="year" fontSize={9} axisLine={false} tickLine={false} stroke="#555" />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#000', border: '1px solid #222', borderRadius: '12px', fontSize: '10px' }}
                        formatter={(value: number) => [formatCurrency(value), 'Balance']}
                      />
                      <Area type="monotone" dataKey="balance" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-[0.45rem] font-mono text-text-muted uppercase block">Start</span>
                    <span className="text-[0.65rem] font-mono text-text-primary font-bold">{formatCurrency(results.principal)}</span>
                  </div>
                  <div className="p-3 bg-accent/10 rounded-xl border border-accent/20">
                    <span className="text-[0.45rem] font-mono text-accent uppercase block">Finish</span>
                    <span className="text-[0.65rem] font-mono text-text-primary font-bold">{formatCurrency(results.maturityAmount)}</span>
                  </div>
                </div>
             </div>
          </div>

          <div className="glass rounded-[2rem] border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5 bg-white/5">
                <h3 className="text-[0.65rem] font-mono font-bold uppercase tracking-widest text-text-primary">Timeline Log</h3>
            </div>
            <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-left font-mono text-[0.6rem] uppercase">
                    <thead className="bg-[#050505] sticky top-0 z-10">
                        <tr>
                            <th className="p-4 text-text-muted font-normal tracking-widest border-b border-white/5">Phase</th>
                            <th className="p-4 text-text-muted font-normal tracking-widest border-b border-white/5">Accrued Interest</th>
                            <th className="p-4 text-text-muted font-normal tracking-widest border-b border-white/5 text-right">Net Value</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-background/30">
                        {results.growth.map((row) => (
                            <tr key={row.year} className="hover:bg-accent/5 transition-colors group">
                                <td className="p-4 text-text-primary">Year {row.year}</td>
                                <td className="p-4 text-accent/80 group-hover:text-accent transition-colors">{formatCurrency(row.interest)}</td>
                                <td className="p-4 text-text-primary text-right font-bold">{formatCurrency(row.balance)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
