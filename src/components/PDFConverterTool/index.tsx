import React, { useState, useCallback, useEffect } from 'react';
import { ConverterErrorBoundary } from './ErrorBoundary';
import { validateFile, getPDFDocument, STATUS } from './converterUtils';
import FileDropZone from './FileDropZone';
import FormatSelector from './FormatSelector';
import { convertToDocx } from './converters/toDocx';
import { convertToTxt } from './converters/toTxt';
import { convertToXlsx } from './converters/toXlsx';
import { convertToPptx } from './converters/toPptx';
import { convertToPng } from './converters/toPng';
import { RefreshCcw, Download, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function PDFConverterTool() {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentFormat, setCurrentFormat] = useState('');

  const onFileSelect = useCallback((selectedFile: File) => {
    try {
      validateFile(selectedFile);
      setFile(selectedFile);
      setStatus(STATUS.IDLE);
      setErrorMessage('');
    } catch (err: any) {
      setErrorMessage(err.message);
      setStatus(STATUS.ERROR);
    }
  }, []);

  const handleConvert = async (format: string) => {
    if (!file) return;
    
    setCurrentFormat(format);
    setStatus(STATUS.PARSING);
    setProgress(0);
    
    let pdfDoc: any = null;
    
    try {
      pdfDoc = await getPDFDocument(file);
      setStatus(STATUS.CONVERTING);
      
      switch (format) {
        case 'docx': await convertToDocx(pdfDoc, file.name, setProgress); break;
        case 'txt': await convertToTxt(pdfDoc, file.name, setProgress); break;
        case 'xlsx': await convertToXlsx(pdfDoc, file.name, setProgress); break;
        case 'pptx': await convertToPptx(pdfDoc, file.name, setProgress); break;
        case 'png': await convertToPng(pdfDoc, file.name, setProgress); break;
        default: throw new Error('Unsupported format');
      }
      
      setStatus(STATUS.DONE);
    } catch (err: any) {
      console.error('[PDFConverter] Fail:', err);
      setErrorMessage(err.message.includes('CORRUPT') ? 'PDF file is corrupted or protected.' : 'Conversion failed. Please try another format.');
      setStatus(STATUS.ERROR);
    } finally {
      // Memory cleanup: pdfjs-dist manages internal refs but we help where we can
      if (pdfDoc && pdfDoc.destroy) pdfDoc.destroy();
    }
  };

  const handleReset = () => {
    setFile(null);
    setStatus(STATUS.IDLE);
    setErrorMessage('');
    setProgress(0);
    setCurrentFormat('');
  };

  return (
    <ConverterErrorBoundary fallback={<ToolCrashFallback onReset={handleReset} />}>
      <div className="pdf-conv-main max-w-2xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-text-primary">Neural PDF Converter</h2>
            <p className="text-xs font-mono text-text-muted uppercase tracking-widest mt-1">Status: {status.replace('_', ' ')} // Neural Engine v2.4</p>
          </div>
          {file && (
             <button 
               onClick={handleReset}
               className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-accent hover:opacity-70 transition-opacity"
             >
               <RefreshCcw size={14} /> Clear System Buffer
             </button>
          )}
        </div>

        <div className="glass-morphism rounded-3xl p-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {status === STATUS.IDLE || status === STATUS.ERROR ? (
              <motion.div 
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-8 p-8"
              >
                <FileDropZone onFileSelect={onFileSelect} selectedFile={file} />
                
                {status === STATUS.ERROR && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-500">
                    <AlertTriangle size={20} />
                    <p className="text-xs font-bold font-mono">{errorMessage}</p>
                  </div>
                )}

                {file && (
                   <div className="space-y-4">
                     <p className="text-[10px] font-black uppercase tracking-widest text-center text-gray-500">Select Neural Target Format</p>
                     <FormatSelector onSelect={handleConvert} disabled={false} />
                   </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="processing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-16 flex flex-col items-center text-center space-y-8"
              >
                <div className="relative w-32 h-32">
                   <svg className="w-full h-full transform -rotate-90">
                     <circle 
                       cx="64" cy="64" r="60" 
                       className="stroke-gray-800"
                       strokeWidth="8" fill="transparent"
                     />
                     <circle 
                       cx="64" cy="64" r="60" 
                       className="stroke-accent transition-all duration-300"
                       strokeWidth="8" fill="transparent"
                       strokeDasharray={377}
                       strokeDashoffset={377 - (377 * progress) / 100}
                     />
                   </svg>
                   <div className="absolute inset-0 flex items-center justify-center">
                     <span className="text-2xl font-black font-mono">{progress}%</span>
                   </div>
                </div>

                <div>
                   <h3 className="text-xl font-bold mb-2">
                     {status === STATUS.DONE ? 'Protocol Complete' : 'Neural Processing...'}
                   </h3>
                   <p className="text-xs text-gray-400 font-mono uppercase tracking-widest">
                     {status === STATUS.DONE 
                       ? `Converted to ${currentFormat.toUpperCase()}` 
                       : `Deconstructing binary structure: Page ${Math.floor(progress / (100 / (file?.size ? 10 : 1)))}...`}
                   </p>
                </div>

                {status === STATUS.DONE && (
                   <div className="flex gap-4">
                     <button 
                       onClick={handleReset}
                       className="px-8 py-4 bg-gray-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-700 transition-colors"
                     >
                       Convert Another
                     </button>
                     <p className="text-[10px] text-gray-500 self-center uppercase font-mono tracking-widest">Check Downloads Folder</p>
                   </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Security / Quality Badges */}
        {!file && (
           <div className="flex justify-center gap-6 opacity-30">
             <span className="text-[9px] font-mono uppercase tracking-widest">100% Client-Side</span>
             <span className="text-[9px] font-mono uppercase tracking-widest">Zero Server Storage</span>
             <span className="text-[9px] font-mono uppercase tracking-widest">End-to-End Privacy</span>
           </div>
        )}
      </div>
    </ConverterErrorBoundary>
  );
}

function ToolCrashFallback({ onReset }: { onReset: () => void }) {
  return (
    <div className="p-12 glass-morphism rounded-[2.5rem] border border-red-500/20 text-center space-y-6">
      <div className="bg-red-500/20 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto">
        <AlertTriangle className="text-red-500" size={32} />
      </div>
      <div>
        <h3 className="text-xl font-bold text-red-500 uppercase tracking-tight">System Desync Detected</h3>
        <p className="text-xs text-text-secondary font-mono mt-2">The neural bridge was severed due to an unexpected memory state. Main core remains stable.</p>
      </div>
      <button 
        onClick={onReset}
        className="px-10 py-4 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
      >
        Force Re-Sync Engine
      </button>
    </div>
  );
}
