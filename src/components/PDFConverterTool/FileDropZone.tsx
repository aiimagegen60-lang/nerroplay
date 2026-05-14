import React, { useCallback, useState } from 'react';
import { Upload, FileText, CheckCircle2 } from 'lucide-react';

interface Props {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
}

export default function FileDropZone({ onFileSelect, selectedFile }: Props) {
  const [isHovering, setIsHovering] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  }, [onFileSelect]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(true);
  };

  const handleDragLeave = () => {
    setIsHovering(false);
  };

  return (
    <div 
      className={`relative group border-2 border-dashed rounded-3xl p-10 transition-all duration-300 text-center ${
        isHovering ? 'border-accent bg-accent/5 scale-[1.02]' : 'border-border-glass bg-surface/50'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input 
        type="file" 
        accept="application/pdf"
        className="absolute inset-0 opacity-0 cursor-pointer"
        onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
      />
      
      <div className="flex flex-col items-center gap-4">
        {selectedFile ? (
          <div className="bg-emerald-500/20 p-4 rounded-2xl">
            <CheckCircle2 className="text-emerald-500 w-12 h-12" />
          </div>
        ) : (
          <div className="bg-accent/20 p-4 rounded-2xl group-hover:scale-110 transition-transform">
            <Upload className="text-accent w-12 h-12" />
          </div>
        )}
        
        <div>
          <h3 className="font-bold text-lg mb-1">
            {selectedFile ? selectedFile.name : 'Choose or Drop PDF'}
          </h3>
          <p className="text-sm text-text-muted font-mono">
            {selectedFile 
              ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` 
              : 'Drag & drop your file here to start'}
          </p>
        </div>
      </div>
    </div>
  );
}
