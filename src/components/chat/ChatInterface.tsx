
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatSession, ChatMessage, UserBirthData, AstrologyContext, MessageStatus } from '../../types/chat.types';
import { buildAstroContext } from '../../lib/astrology-context-builder';
import { SafeStorage } from '../../lib/safe-storage';
import { MessageBubble } from './MessageBubble';
import { ChatInputBar } from './ChatInputBar';
import { NerroAvatarAnim } from './NerroAvatarAnim';
import { RefreshCw, ArrowLeft, Star, Moon, Sun, Info, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatInterfaceProps {
  initialSession: ChatSession;
  onReset: () => void;
}

export const ChatInterface = ({ initialSession, onReset }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialSession.messages);
  const [isThinking, setIsThinking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  useEffect(() => {
    // Load Google Translate Script
    const scriptId = 'google-translate-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }

    const initFnName = 'googleTranslateElementInit';
    (window as any)[initFnName] = () => {
      if ((window as any).google && (window as any).google.translate) {
        new (window as any).google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'hi,mr,te,ta,kn,ml,gu,pa,bn,as,or,ur,ne,sa',
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        }, 'google_translate_element');
      }
    };

    return () => {
      // Script stays globally but we clean up the wrapper if needed
    };
  }, []);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleBack = () => {
    navigate('/tools');
  };

  const saveSession = (msgs: ChatMessage[]) => {
    SafeStorage.set('nerro_astro_session', {
      ...initialSession,
      messages: msgs,
      lastActiveAt: new Date()
    });
  };

  const handleSendMessage = async (content: string, image?: string) => {
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: image ? `${content}\n\n[Palm Analysis Requested]` : content,
      timestamp: new Date(),
      status: 'complete',
      imageUrl: image
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsThinking(true);

    try {
      const response = await fetch('/api/ai/nerro-astro-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: content,
          astrologyContext: initialSession.astrologyContext,
          chatHistory: messages.slice(-10), // Limit context for token safety
          image
        })
      });

      if (!response.ok) throw new Error('Network error');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader');

      setIsThinking(false);
      
      const nerroMsgId = crypto.randomUUID();
      const nerroMsg: ChatMessage = {
        id: nerroMsgId,
        role: 'nerro',
        content: '',
        timestamp: new Date(),
        status: 'streaming',
        isStreaming: true
      };

      setMessages(prev => [...prev, nerroMsg]);

      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                fullContent += parsed.text;
                setMessages(prev => prev.map(m => 
                  m.id === nerroMsgId ? { ...m, content: fullContent } : m
                ));
              }
            } catch (e) {}
          }
        }
      }

      setMessages(prev => prev.map(m => 
        m.id === nerroMsgId ? { ...m, status: 'complete', isStreaming: false } : m
      ));
      
      const finalMessages: ChatMessage[] = [...newMessages, { 
        ...nerroMsg, 
        content: fullContent, 
        status: 'complete' as MessageStatus, 
        isStreaming: false 
      }];
      saveSession(finalMessages);

    } catch (error) {
      console.error('Chat Error:', error);
      setIsThinking(false);
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'nerro',
        content: 'I apologize, but there is a slight cosmic interference at the moment. Please try again.',
        timestamp: new Date(),
        status: 'error'
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  const quickQuestions = [
    "Read my palm for marriage timing.",
    "When will I get a new job opportunity?",
    "Analyze my Life Line and Fate Line.",
    "What career suits my Nakshatra best?",
    "Vedic remedies for career growth?",
    "Check my palm for prosperity markers."
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex w-80 flex-col border-r border-border-glass bg-surface/30">
        <div className="p-6 border-b border-border-glass">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={handleBack}
              className="p-2 -ml-2 rounded-lg hover:bg-surface text-text-muted hover:text-text-primary transition-all flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              <span className="text-[10px] font-mono uppercase font-black">Exit Chat</span>
            </button>
            <div className="flex items-center gap-3">
              <RefreshCw 
                size={14} 
                className="text-text-muted cursor-pointer hover:text-primary transition-colors" 
                onClick={onReset}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <NerroAvatarAnim size="small" />
            <div>
              <h2 className="text-sm font-bold text-text-primary tracking-tight">NERRO ASTRO</h2>
              <p className="text-[10px] font-mono uppercase text-text-muted">Neural Rashi Oracle</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass p-4 rounded-xl border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Star size={12} className="text-primary" />
                <span className="text-[11px] font-mono font-bold uppercase text-text-primary">Consultant</span>
              </div>
              <p className="text-sm font-bold text-text-primary mb-1">{initialSession.birthData.fullName}</p>
              <p className="text-[10px] text-text-muted">{initialSession.birthData.dateOfBirth} • {initialSession.birthData.placeOfBirth}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-surface border border-border-glass p-3 rounded-xl">
                <div className="flex items-center gap-1.5 mb-1">
                  <Moon size={10} className="text-accent" />
                  <span className="text-[9px] font-mono uppercase text-text-muted">Rashi</span>
                </div>
                <p className="text-xs font-bold text-text-primary">{initialSession.astrologyContext.moonSign}</p>
              </div>
              <div className="bg-surface border border-border-glass p-3 rounded-xl">
                <div className="flex items-center gap-1.5 mb-1">
                  <Sun size={10} className="text-primary" />
                  <span className="text-[9px] font-mono uppercase text-text-muted">Nakshatra</span>
                </div>
                <p className="text-xs font-bold text-text-primary">{initialSession.astrologyContext.nakshatra}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-4">Palm & Astro Query</h3>
          <div className="space-y-2">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="w-full text-left p-3 text-[11px] rounded-lg border border-border-glass hover:border-primary/50 hover:bg-primary/5 transition-all text-text-muted hover:text-text-primary"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-border-glass text-center">
            <p className="text-[9px] font-mono uppercase text-text-muted/50 mb-3 tracking-tighter">Powered by NERRO Quantum Core</p>
            <div className="flex items-center justify-center gap-4">
               <Info size={14} className="text-text-muted hover:text-primary cursor-help" />
               <LayoutDashboard size={14} className="text-text-muted hover:text-primary cursor-pointer" onClick={() => navigate('/dashboard')} />
            </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative h-screen overflow-hidden bg-background">
        {/* Unified Header with Translator */}
        <div className="p-2 border-b border-border-glass bg-surface/80 backdrop-blur-xl flex items-center justify-end sticky top-0 z-50 h-14 lg:h-12">
            <div className="flex items-center gap-4 px-4 w-full justify-between lg:justify-end">
               <div className="lg:hidden flex items-center gap-3">
                  <button 
                    onClick={handleBack}
                    className="p-2 rounded-lg bg-surface border border-border-glass text-text-muted"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div className="text-left">
                      <p className="text-[10px] font-mono text-text-primary uppercase font-black leading-none mb-1">NERRO Astro AI</p>
                      <p className="text-[9px] font-mono text-text-muted uppercase tracking-tighter leading-none">{initialSession.astrologyContext.moonSign} • {initialSession.astrologyContext.nakshatra}</p>
                  </div>
               </div>

               <div className="flex items-center gap-3">
                  <div id="google_translate_element" className="google-translate-container" />
                  <div className="lg:hidden">
                    <button 
                        onClick={onReset}
                        className="p-2 rounded-lg bg-surface border border-border-glass text-text-muted"
                    >
                        <RefreshCw size={14} />
                    </button>
                  </div>
               </div>
            </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 md:px-8 space-y-4 scroll-smooth"
        >
          <div className="max-w-4xl mx-auto py-10">
            {messages.length === 0 && (
                <div className="text-center py-20 flex flex-col items-center">
                    <NerroAvatarAnim size="large" />
                    <h2 className="mt-6 text-xl font-bold text-text-primary tracking-tight">Quantum Jyotish Link Active</h2>
                    <p className="mt-2 text-sm text-text-muted max-w-sm px-6">
                        Calculations based on sidereal Lahiri Ayanamsha are synced. Send a message or a <span className="text-primary font-bold">Palm Image</span> to begin your reading.
                    </p>
                    
                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg px-4">
                        {quickQuestions.slice(0, 4).map((q, i) => (
                           <button 
                            key={i}
                            onClick={() => handleSendMessage(q)}
                            className="p-4 bg-surface/30 border border-border-glass rounded-2xl text-left hover:border-primary/50 transition-all group"
                           >
                              <p className="text-xs text-text-muted group-hover:text-text-primary">{q}</p>
                           </button>
                        ))}
                    </div>
                </div>
            )}
            
            <div className="space-y-6">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
            </div>
            
            {isThinking && (
              <div className="flex justify-start my-6">
                 <div className="flex flex-row items-center">
                    <NerroAvatarAnim size="small" isThinking />
                    <div className="ml-3 bg-surface/50 border border-border-glass p-4 rounded-2xl rounded-bl-none shadow-glow-sm">
                       <div className="flex gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                       </div>
                    </div>
                 </div>
              </div>
            )}
            <div className="h-4" />
          </div>
        </div>

        <div className="border-t border-border-glass bg-background/50 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto w-full">
              <ChatInputBar 
                  onSendMessage={handleSendMessage} 
                  disabled={isThinking || (messages.length > 0 && messages[messages.length-1].isStreaming)} 
              />
          </div>
        </div>
      </div>
    </div>
  );
};
