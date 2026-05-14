import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Brain } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '../context/LanguageContext';

interface AIDeepAnalysisProps {
  onAnalyze: () => Promise<any>;
  toolName: string;
  renderAnalysis?: (data: any) => React.ReactNode;
}

export default function AIDeepAnalysis({ onAnalyze, toolName, renderAnalysis }: AIDeepAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const { t } = useLanguage();

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await onAnalyze();
      setAnalysis(result);
      setShowAnalysis(true);
    } catch (err) {
      console.error('AIDeepAnalysis Error:', err);
      setError('Neural Synthesis failed. Please re-run the calculation and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="mt-12 space-y-8">
      <div className="flex items-center justify-center">
        <div className="h-px bg-border-glass w-full max-w-xs" />
        <div className="px-4 text-text-muted font-mono text-[0.55rem] md:text-[0.6rem] tracking-[0.4em] uppercase font-black">AI LAYER</div>
        <div className="h-px bg-border-glass w-full max-w-xs" />
      </div>

      <div className="relative glass p-6 md:p-10 rounded-[2.5rem] overflow-hidden group transition-all duration-500">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div className="space-y-1">
            <h3 className="text-2xl md:text-3xl font-black flex items-center gap-3 italic text-text-primary">
              <Brain className="text-blue-500" size={28} />
              {t('ai.analysis.title')}
            </h3>
            <p className="text-text-secondary font-medium tracking-tight text-sm md:text-base">
              Neural {toolName} synthesis & physiological optimization protocol.
            </p>
          </div>

          {!showAnalysis && !isAnalyzing && (
            <button
              onClick={handleAnalyze}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-blue-600/20 group whitespace-nowrap uppercase text-xs tracking-widest"
            >
              <Sparkles size={18} className="group-hover:animate-spin" />
              {t('ai.analysis.button')}
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {isAnalyzing ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 space-y-6"
            >
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                <Zap className="absolute inset-0 m-auto text-blue-500 animate-pulse" size={24} />
              </div>
              <div className="text-center space-y-2">
                <p className="text-text-muted dark:text-accent font-mono animate-pulse uppercase tracking-[0.3em] text-[0.65rem] font-black">
                  {t('ai.analysis.loading')}
                </p>
                <p className="text-[0.5rem] text-text-muted uppercase tracking-[0.4em] font-mono font-black">Neural Engine Processing...</p>
              </div>
            </motion.div>
          ) : showAnalysis && analysis ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="prose prose-slate dark:prose-invert max-w-none"
            >
              {renderAnalysis ? (
                renderAnalysis(analysis)
              ) : (
                <div className="p-6 md:p-8 bg-surface/50 rounded-[2rem] border border-border-glass leading-relaxed text-text-secondary text-sm md:text-base shadow-sm">
                  <ReactMarkdown components={{
                    p: ({children}) => <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>,
                    h1: ({children}) => <h1 className="text-lg font-black uppercase tracking-tight mb-4 text-text-primary italic">{children}</h1>,
                    h2: ({children}) => <h2 className="text-base font-black uppercase tracking-tight mb-3 text-text-primary italic">{children}</h2>,
                    h3: ({children}) => <h3 className="text-sm font-black uppercase tracking-tight mb-2 text-text-primary italic">{children}</h3>,
                    li: ({children}) => <li className="mb-2 last:mb-0 list-disc ml-4 font-medium">{children}</li>,
                    ul: ({children}) => <ul className="mb-4">{children}</ul>,
                    strong: ({children}) => <strong className="font-black text-text-primary italic">{children}</strong>,
                    em: ({children}) => <em className="italic text-accent font-bold underline decoration-accent/30">{children}</em>,
                  }}>{analysis as string}</ReactMarkdown>
                </div>
              )}
              
              <div className="mt-8 pt-6 border-t border-border-glass flex items-center justify-between">
                 <p className="text-[0.6rem] text-text-muted uppercase tracking-widest font-mono">{t('ai.analysis.powered')}</p>
                 <button 
                  onClick={() => setShowAnalysis(false)}
                  className="text-[0.6rem] text-blue-500 hover:text-blue-600 uppercase tracking-widest font-bold font-mono"
                 >
                   Reset Layer
                 </button>
              </div>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-medium text-center"
            >
              {error}
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 border-2 border-dashed border-border-glass rounded-[2.5rem]"
            >
              <p className="text-[0.65rem] font-black text-text-muted dark:text-blue-500/50 uppercase tracking-[0.4em] mb-4">Elite Diagnostics Layer Active</p>
              <p className="text-text-secondary max-w-md mx-auto text-xs md:text-sm font-bold leading-relaxed uppercase tracking-tight">
                Unlock a multi-dimensional life synthesis. Our AI models deep-dive into your {toolName} clusters to uncover hidden physiological pathways.
              </p>
              <div className="flex justify-center gap-3 mt-10">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '200ms' }} />
                <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '400ms' }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
