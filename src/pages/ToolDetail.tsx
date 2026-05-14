import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, HelpCircle, BookOpen, Calculator, AlertTriangle, Lightbulb, CheckCircle2, Info } from 'lucide-react';
import * as Icons from 'lucide-react';
import { TOOLS } from '../constants';
import ToolSEO from '../components/ToolSEO';
import TrustSignals from '../components/TrustSignals';
import BMICalculator from '../components/BMICalculator';
import CalorieCalculator from '../components/CalorieCalculator';
import ProteinCalculator from '../components/ProteinCalculator';
import WaterCalculator from '../components/WaterCalculator';
import SleepCalculator from '../components/SleepCalculator';
import HeartRateCalculator from '../components/HeartRateCalculator';
import BMRCalculator from '../components/BMRCalculator';
import BodyFatCalculator from '../components/BodyFatCalculator';
import IdealWeightCalculator from '../components/IdealWeightCalculator';
import WHtRCalculator from '../components/WHtRCalculator';
import CalorieDeficitCalculator from '../components/CalorieDeficitCalculator';
import WeightLossPlanner from '../components/WeightLossPlanner';
import NutritionPlanner from '../components/NutritionPlanner';
import HealthRiskAnalyzer from '../components/HealthRiskAnalyzer';
import SleepRecoveryTool from '../components/SleepRecoveryTool';
import BeautyAnalyzer from '../components/BeautyAnalyzer';
import LoanCalculator from '../components/LoanCalculator';
import BikeLoanCalculator from '../components/BikeLoanCalculator';
import CarLoanCalculator from '../components/CarLoanCalculator';
import HomeLoanCalculator from '../components/HomeLoanCalculator';
import SIPCalculator from '../components/SIPCalculator';
import FDCalculator from '../components/FDCalculator';
import FashionStyler from '../components/FashionStyler';
import SalaryCalculator from '../components/SalaryCalculator';
import MenStyler from '../components/MenStyler';
import HomePurchaseCapability from '../components/HomePurchaseCapability';
import KundliTool from '../components/KundliTool';
import ACIntelligenceTool from '../components/ACIntelligenceTool';
import PDFConverterTool from '../components/PDFConverterTool';
import ProfitCalculator from '../components/ProfitCalculator';
import AnkJyotishTool from '../components/AnkJyotishTool';
import MoonSignReportTool from '../components/MoonSignReportTool';
import { AdBanner } from '../components/AdComponents';
import ErrorBoundary from '../components/ErrorBoundary';

export default function ToolDetail() {
  const { id } = useParams();
  const tool = TOOLS.find(t => t.id === id);
  const [resetKey, setResetKey] = React.useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    setResetKey(prev => prev + 1); // Reset tool state on navigation change
  }, [id]);

  if (!tool) return <div className="p-10 text-text-muted">Tool not found.</div>;

  const IconComponent = (Icons as any)[tool.icon] || Icons.HelpCircle;

  const handleToolReset = () => {
    setResetKey(prev => prev + 1);
  };

  return (
    <div className="pt-12 pb-20 px-4 md:px-10 max-w-[1000px] mx-auto">
      <ToolSEO 
        title={tool.metadata.seoTitle || `${tool.name} | NERROPLAY AI`}
        description={tool.metadata.metaDescription || tool.description}
        path={`/tools/${tool.id}`}
      />

      <Link to="/tools" className="inline-flex items-center gap-2 text-xs font-mono text-text-muted hover:text-accent mb-10">
        <ArrowLeft size={14} />
        BACK TO TOOLBOX
      </Link>

      <div className="flex items-center gap-4 mb-8">
        <div className="text-accent">
          <IconComponent size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">{tool.name}</h1>
          <div className="flex gap-4 mt-2 font-mono text-[0.7rem] text-text-muted uppercase tracking-widest">
            <span>{tool.category}</span>
            <span>v{tool.metadata.version}</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-text-secondary leading-relaxed mb-6 max-w-2xl">
        {tool.description}
      </p>

      <TrustSignals 
        author={tool.metadata.author} 
        lastUpdated={tool.metadata.lastUpdated} 
      />

        <ErrorBoundary 
          key={resetKey}
          onReset={handleToolReset}
          fallback={<div className="p-10 glass rounded-2xl border border-red-500/20 text-center">
            <h3 className="text-lg font-bold text-red-500 mb-2 uppercase tracking-tight">Interface Desync</h3>
            <p className="text-xs text-text-secondary font-mono mb-6">The module's logic bridge was unexpectedly severed. System core remains stable.</p>
            <button 
              onClick={handleToolReset}
              className="px-6 py-3 bg-red-500 text-white rounded-xl text-[0.6rem] font-black uppercase tracking-widest hover:bg-red-600 transition-colors"
            >
              Force Re-Calibration
            </button>
          </div>}
        >
          <div key={resetKey}>
            {tool.id === 'bmi-calculator' ? (
            <BMICalculator />
          ) : tool.id === 'bmr-calculator' ? (
            <BMRCalculator />
          ) : tool.id === 'calorie-calculator' ? (
            <CalorieCalculator />
          ) : tool.id === 'protein-calculator' ? (
            <ProteinCalculator />
          ) : tool.id === 'water-calculator' ? (
            <WaterCalculator />
          ) : tool.id === 'sleep-calculator' ? (
            <SleepCalculator />
          ) : tool.id === 'heart-rate-calculator' ? (
            <HeartRateCalculator />
          ) : tool.id === 'body-fat-calculator' ? (
            <BodyFatCalculator />
          ) : tool.id === 'ideal-weight-calculator' ? (
            <IdealWeightCalculator />
          ) : tool.id === 'whtr-calculator' ? (
            <WHtRCalculator />
          ) : tool.id === 'calorie-deficit-calculator' ? (
            <CalorieDeficitCalculator />
          ) : tool.id === 'weight-loss-planner' ? (
            <WeightLossPlanner />
          ) : tool.id === 'nutrition-planner' ? (
            <NutritionPlanner />
          ) : tool.id === 'health-risk-analyzer' ? (
            <HealthRiskAnalyzer />
          ) : tool.id === 'sleep-recovery' ? (
            <SleepRecoveryTool />
          ) : tool.id === 'beauty-analyzer' ? (
            <BeautyAnalyzer />
          ) : tool.id === 'loan-calculator' ? (
            <LoanCalculator />
          ) : tool.id === 'bike-loan-calculator' ? (
            <BikeLoanCalculator />
          ) : tool.id === 'car-loan-calculator' ? (
            <CarLoanCalculator />
          ) : tool.id === 'home-loan-calculator' ? (
            <HomeLoanCalculator />
          ) : tool.id === 'sip-calculator' ? (
            <SIPCalculator />
          ) : tool.id === 'fd-calculator' ? (
            <FDCalculator />
          ) : tool.id === 'fashion-styler' ? (
            <FashionStyler />
          ) : tool.id === 'salary-calculator' ? (
            <SalaryCalculator />
          ) : tool.id === 'men-styler' ? (
            <MenStyler />
          ) : tool.id === 'home-purchase-capability' ? (
            <HomePurchaseCapability />
          ) : tool.id === 'profit-calculator' ? (
            <ProfitCalculator />
          ) : tool.id === 'ank-jyotish' ? (
            <AnkJyotishTool />
          ) : tool.id === 'kundli-tool' ? (
            <KundliTool />
          ) : tool.id === 'ac-intelligence-tool' ? (
            <ACIntelligenceTool />
          ) : tool.id === 'pdf-converter' ? (
            <PDFConverterTool />
          ) : tool.id === 'moon-sign-report' ? (
            <MoonSignReportTool />
          ) : (
            <div className="max-w-xl mx-auto">
              <div className="space-y-6">
                <div className="glass p-8 rounded-2xl border border-border-glass text-center">
                  <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
                    <IconComponent size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2 uppercase tracking-tight">Tool Launch Ready</h3>
                  <p className="text-sm text-text-secondary mb-8">This interface is currently being optimized for high-performance neural processing.</p>
                  
                  <div className="space-y-3">
                    <button className="w-full py-4 rounded-xl bg-accent text-background font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-accent/20">
                      Initialize Tool
                    </button>
                    <button className="w-full py-4 rounded-xl glass text-text-primary font-bold text-sm uppercase tracking-widest hover:bg-white/5 transition-all">
                      Save to Favorites
                    </button>
                  </div>
                </div>
                
                <div className="ad-banner">Sponsorship Space Available</div>
              </div>
            </div>
          )}
          </div>
        </ErrorBoundary>

        {/* Educational Content Section */}
        <div className="mt-20 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                <BookOpen className="text-accent" size={24} />
                Educational Guide
              </h2>
              <div className="prose prose-slate dark:prose-invert text-sm text-text-secondary leading-relaxed">
                <p>{tool.education?.howItWorks || `The ${tool.name} utility at NERROPLAY provides algorithmic estimations based on standard professional practices. It is designed to assist users in understanding complex variables through a simplified interface.`}</p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                <Calculator className="text-accent" size={24} />
                How It Works
              </h2>
              <div className="glass p-6 rounded-2xl border border-border-glass bg-surface/50">
                <div className="text-xs font-mono text-text-muted uppercase tracking-widest mb-4">Core Model</div>
                <p className="text-sm text-text-primary font-bold italic mb-4">
                  {tool.education?.formula || 'Algorithmic Synthesis Engine (ASE)'}
                </p>
                <div className="flex items-start gap-3 p-3 bg-accent/10 rounded-lg">
                  <Info size={16} className="text-accent shrink-0 mt-0.5" />
                  <p className="text-[10px] leading-normal text-text-secondary">
                    Measurements are processed in-flight. No sensitive health or financial data is permanently stored on NEROOPLAY servers per our Privacy Policy.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-3xl border border-border-glass">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent mb-6">
                <Lightbulb size={20} />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-3">Why use this?</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {tool.education?.whyUseThis || 'To gain rapid, AI-assisted insights into your data using verified mathematical frameworks.'}
              </p>
            </div>

            <div className="glass p-8 rounded-3xl border border-border-glass">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500 mb-6">
                <AlertTriangle size={20} />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-3">Limitations</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {tool.education?.limitations || 'Results are estimates and should be used as secondary informational references only.'}
              </p>
            </div>

            <div className="glass p-8 rounded-3xl border border-border-glass">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-500 mb-6">
                <HelpCircle size={20} />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-3">Common Mistakes</h3>
              <ul className="space-y-2">
                {(tool.education?.commonMistakes || ['Inaccurate input data', 'Misunderstanding estimations', 'Over-reliance on AI outputs']).map((m) => (
                  <li key={`mistake-${m.substring(0, 10)}`} className="text-[10px] text-text-secondary flex items-start gap-2">
                    <CheckCircle2 size={12} className="text-accent shrink-0 mt-0.5" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {tool.faqs && tool.faqs.length > 0 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-text-primary">Frequently Asked Questions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tool.faqs.map((faq) => (
                  <div key={`faq-${faq.question.substring(0, 15)}`} className="p-6 bg-surface border border-border-glass rounded-2xl">
                    <h4 className="font-bold text-text-primary mb-2 italic">"{faq.question}"</h4>
                    <p className="text-sm text-text-secondary leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
    </div>
  );
}
