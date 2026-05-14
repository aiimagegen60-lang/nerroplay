import React, { useState } from 'react';
import { generateProfitAnalysis, ProfitEngineInput } from '../services/profitCalculationEngine';
import { motion } from 'framer-motion';

export default function ProfitCalculator() {
  const [input, setInput] = useState<ProfitEngineInput>({
    currency_symbol: '₹',
    currency_code: 'INR',
    selling_price: 1000,
    quantity: null,
    discount_percent: null,
    production_cost: { raw_material: null, labour: null, packaging: null, quality_control: null },
    operational_cost: { rent_warehouse: null, electricity_utilities: null, equipment_depreciation: null, staff_salary: null },
    logistics_cost: { shipping_courier: null, import_export_duty: null, returns_handling: null, inventory_holding: null },
    marketing_cost: { advertising_spend: null, platform_fee_percent: null, sales_commission_percent: null, discounts_offers: null },
    financial_cost: { payment_gateway_percent: null, gst_tax_percent: null, loan_interest: null, miscellaneous_buffer_percent: null },
  });

  const [result, setResult] = useState<any>(null);

  const handleChange = (category: keyof ProfitEngineInput, field: string, value: string) => {
    const numValue = value === '' ? null : Number(value);
    
    if (category === 'currency_symbol' || category === 'currency_code' || category === 'selling_price' || category === 'quantity' || category === 'discount_percent') {
      setInput((prev: any) => ({ ...prev, [category]: category === 'currency_symbol' || category === 'currency_code' ? value : numValue }));
    } else {
      setInput((prev: any) => ({
        ...prev,
        [category]: {
          ...prev[category],
          [field]: numValue
        }
      }));
    }
  };

  const handleCalculate = () => {
    const analysis = generateProfitAnalysis(input);
    setResult(analysis);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* INPUT FORM */}
        <div className="space-y-6 bg-surface p-6 rounded-3xl border border-border">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Pricing & Strategy
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Selling Price*</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">{input.currency_symbol}</span>
                <input 
                  type="number" 
                  value={input.selling_price || ''} 
                  onChange={(e) => handleChange('selling_price', '', e.target.value)} 
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-background border border-border focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Quantity (Optional)</label>
              <input 
                type="number" 
                value={input.quantity || ''} 
                onChange={(e) => handleChange('quantity', '', e.target.value)} 
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-blue-500 outline-none"
                placeholder="Total Units"
              />
            </div>
            <div>
               <label className="block text-sm font-medium mb-1">Discount %</label>
              <input 
                type="number" 
                value={input.discount_percent || ''} 
                onChange={(e) => handleChange('discount_percent', '', e.target.value)} 
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-blue-500 outline-none"
                placeholder="20"
              />
            </div>
            <div>
               <label className="block text-sm font-medium mb-1">Currency Code</label>
               <select 
                  value={input.currency_code} 
                  onChange={(e) => {
                    const code = e.target.value;
                    const map: Record<string,string> = { INR: '₹', USD: '$', EUR: '€', GBP: '£'};
                    setInput(p => ({...p, currency_code: code, currency_symbol: map[code] || '$'}));
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-blue-500 outline-none"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
            </div>
          </div>

          <div className="h-px bg-border my-6"></div>
          
          <h2 className="text-xl font-bold flex items-center gap-2">Cost Breakdown</h2>

          <div className="space-y-6">
            <CostSection 
              title="Production & Materials" 
              fields={[
                { label: 'Raw Material', key: 'raw_material' },
                { label: 'Labour / Wages', key: 'labour' },
                { label: 'Packaging', key: 'packaging' },
                { label: 'Quality Control', key: 'quality_control' },
              ]}
              category="production_cost"
              input={input}
              onChange={handleChange}
            />

            <CostSection 
              title="Operational & Admin" 
              fields={[
                { label: 'Rent / Warehouse', key: 'rent_warehouse' },
                { label: 'Electricity / Utilities', key: 'electricity_utilities' },
                { label: 'Depreciation', key: 'equipment_depreciation' },
                { label: 'Staff Salary', key: 'staff_salary' },
              ]}
              category="operational_cost"
              input={input}
              onChange={handleChange}
            />

             <CostSection 
              title="Logistics & Shipping" 
              fields={[
                { label: 'Shipping / Courier', key: 'shipping_courier' },
                { label: 'Customs / Duty', key: 'import_export_duty' },
                { label: 'Returns Handling', key: 'returns_handling' },
                { label: 'Inventory Holding', key: 'inventory_holding' },
              ]}
              category="logistics_cost"
              input={input}
              onChange={handleChange}
            />

            <CostSection 
              title="Marketing & Channels" 
              fields={[
                { label: 'Advertising Spend', key: 'advertising_spend' },
                { label: 'Discounts / Offers', key: 'discounts_offers' },
                { label: 'Platform Fee %', key: 'platform_fee_percent', isPercent: true },
                { label: 'Sales Commission %', key: 'sales_commission_percent', isPercent: true },
              ]}
              category="marketing_cost"
              input={input}
              onChange={handleChange}
            />

             <CostSection 
              title="Financial & Taxes" 
              fields={[
                { label: 'Loan Interest', key: 'loan_interest' },
                { label: 'Payment Gateway %', key: 'payment_gateway_percent', isPercent: true },
                { label: 'Output GST %', key: 'gst_tax_percent', isPercent: true },
                { label: 'Miscellaneous Buffer %', key: 'miscellaneous_buffer_percent', isPercent: true },
              ]}
              category="financial_cost"
              input={input}
              onChange={handleChange}
            />

          </div>

          <button 
            onClick={handleCalculate}
            className="w-full py-4 mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg"
          >
            Calculate Profit Matrix
          </button>
        </div>

        {/* RESULTS PANEL */}
        <div className="space-y-6">
          {result && result.status === 'success' ? (
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              
              <div className={`p-6 rounded-3xl border ${
                result.health_score.rating === 'excellent' || result.health_score.rating === 'great' ? 'bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-800' :
                result.health_score.rating === 'poor' ? 'bg-red-50/50 border-red-200 dark:bg-red-900/10 dark:border-red-800' :
                'bg-yellow-50/50 border-yellow-200 dark:bg-yellow-900/10 dark:border-yellow-800'
              }`}>
                <div className="flex justify-between items-center mb-4">
                   <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary">Overall Health</h3>
                   <span className="font-bold">{result.health_score.score} / 100</span>
                </div>
                <div className="w-full bg-background rounded-full h-3 overflow-hidden">
                   <div 
                     className={`h-full ${
                       result.health_score.rating === 'excellent' || result.health_score.rating === 'great' ? 'bg-green-500' :
                       result.health_score.rating === 'poor' ? 'bg-red-500' : 'bg-yellow-500'
                     }`} 
                     style={{ width: `${result.health_score.score}%`}} 
                   />
                </div>
                <p className="mt-4 text-sm font-medium">{result.margin_classification.label} — {result.health_score.rationale}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 {result.display_fields.map((field: any, idx: number) => (
                   <div key={idx} className={`p-5 rounded-2xl border border-border bg-surface ${field.is_primary ? 'shadow-sm' : ''}`}>
                      <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">{field.label}</p>
                      <p className={`text-xl sm:text-2xl font-black ${
                        field.color_hint === 'positive' ? 'text-green-600 dark:text-green-400' :
                        field.color_hint === 'negative' ? 'text-red-600 dark:text-red-400' :
                        field.color_hint === 'warning' ? 'text-yellow-600 dark:text-yellow-400' : 'text-text-primary'
                      }`}>{field.formatted}</p>
                   </div>
                 ))}
              </div>

              <div className="bg-surface p-6 rounded-3xl border border-border max-w-full overflow-hidden">
                 <h3 className="text-lg font-bold mb-4">Cost Structure Analysis</h3>
                 
                 <div className="space-y-4">
                    {['production', 'operational', 'logistics', 'marketing', 'financial'].map((cat: string) => {
                       const data = result.cost_breakdown[cat];
                       if (data.subtotal === 0) return null;
                       return (
                         <div key={cat}>
                            <div className="flex justify-between text-sm mb-1">
                               <span className="capitalize font-medium text-text-secondary">{cat}</span>
                               <span className="font-bold">{data.share_percent}%</span>
                            </div>
                            <div className="w-full bg-border rounded-full h-2">
                               <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${data.share_percent}%` }}></div>
                            </div>
                         </div>
                       )
                    })}
                 </div>
              </div>

              <div className="bg-surface p-6 rounded-3xl border border-border">
                 <h3 className="text-lg font-bold mb-4">Strategic Insights</h3>
                 <div className="space-y-4">
                    {result.insights.map((insight: any, idx: number) => (
                       <div key={idx} className="flex gap-3 items-start">
                          <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                            insight.type === 'success' ? 'bg-green-500' : 
                            insight.type === 'warning' ? 'bg-red-500' :
                            insight.type === 'alert' ? 'bg-yellow-500' : 'bg-blue-500' 
                          }`} />
                          <div>
                            <p className="text-sm font-bold">{insight.title}</p>
                            <p className="text-sm text-text-secondary leading-relaxed mt-1">{insight.detail}</p>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              <p className="text-xs text-text-muted text-center mt-8">{result.disclaimer}</p>

             </motion.div>
          ) : result && result.status === 'error' ? (
            <div className="p-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400">
               {result.error_message}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-border rounded-3xl p-12 text-center text-text-muted">
               <div>
                  <h3 className="text-lg font-bold mb-2">Input your costs</h3>
                  <p className="text-sm">Enter your selling price and any costs associated with your business to instantly generate a comprehensive profit analysis.</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CostSection({ title, fields, category, input, onChange }: any) {
  return (
    <div>
      <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">{title}</h3>
      <div className="grid grid-cols-2 gap-3">
         {fields.map((field: any) => (
           <div key={field.key}>
              <label className="block text-xs font-medium text-text-muted mb-1 truncate" title={field.label}>{field.label}</label>
              <div className="relative">
                {!field.isPercent && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">{input.currency_symbol}</span>}
                <input 
                  type="number" 
                  value={input[category][field.key] || ''} 
                  onChange={(e) => onChange(category, field.key, e.target.value)} 
                  className={`w-full py-2.5 rounded-xl bg-background border border-border focus:border-blue-500 outline-none text-sm ${field.isPercent ? 'px-3' : 'pl-7 pr-3'}`}
                  placeholder="0"
                />
              </div>
           </div>
         ))}
      </div>
    </div>
  )
}
