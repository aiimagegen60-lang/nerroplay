
import React, { useState, useRef, useEffect } from 'react';
import { Send, CornerDownLeft, Image as ImageIcon, X } from 'lucide-react';

interface ChatInputBarProps {
  onSendMessage: (msg: string, image?: string) => void;
  disabled?: boolean;
}

export const ChatInputBar = ({ onSendMessage, disabled }: ChatInputBarProps) => {
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleSend = () => {
    if ((input.trim() || image) && !disabled) {
      onSendMessage(input.trim(), image || undefined);
      setInput('');
      setImage(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    // Reset input value
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="relative p-4 md:p-6 bg-background/80 backdrop-blur-xl border-t border-border-glass">
      <div className="max-w-4xl mx-auto flex flex-col gap-3">
        {image && (
          <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-border-glass group">
            <img src={image} alt="Preview" className="w-full h-full object-cover" />
            <button 
              onClick={() => setImage(null)}
              className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        )}
        
        <div className="flex gap-4 items-end">
          <div className="relative flex-1 group">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask NERRO anything about your cosmic path..."
              disabled={disabled}
              className="w-full bg-surface/50 border border-border-glass rounded-xl pl-12 pr-5 py-4 text-sm font-medium text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-none placeholder:text-text-muted disabled:opacity-50"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="absolute left-4 bottom-4 p-1 text-text-muted hover:text-primary transition-colors disabled:opacity-50"
              title="Add image"
            >
              <ImageIcon size={18} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              className="hidden" 
              accept="image/*" 
            />
          </div>

          <button
            onClick={handleSend}
            disabled={(!input.trim() && !image) || disabled}
            className={`h-[54px] w-[54px] rounded-xl flex items-center justify-center transition-all bg-primary text-black ${
              (!input.trim() && !image) || disabled ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:scale-105 active:scale-95 shadow-glow'
            }`}
          >
            <Send size={20} fill="currentColor" />
          </button>
        </div>
      </div>
      <div className="text-center mt-3">
        <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-text-muted/60">
          NERRO Astro is for spiritual guidance • Educational purposes only
        </p>
      </div>
    </div>
  );
};
