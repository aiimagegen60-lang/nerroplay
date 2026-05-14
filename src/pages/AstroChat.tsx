
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import { BirthDataGate } from '../components/chat/BirthDataGate';
import { ChatInterface } from '../components/chat/ChatInterface';
import { UserBirthData, ChatSession, AstrologyContext } from '../types/chat.types';
import { buildAstroContext } from '../lib/astrology-context-builder';
import { SafeStorage } from '../lib/safe-storage';
import { Sparkles, MessageCircle, Star } from 'lucide-react';

export default function AstroChat() {
  const [status, setStatus] = useState<'gate' | 'loading' | 'active'>('loading');
  const [session, setSession] = useState<ChatSession | null>(null);

  useEffect(() => {
    const saved = SafeStorage.get<ChatSession | null>('nerro_astro_session', null);
    
    if (saved) {
      // Basic expiry check (24 hours)
      const lastActive = new Date(saved.lastActiveAt).getTime();
      const now = new Date().getTime();
      if (now - lastActive < 24 * 60 * 60 * 1000) {
        setSession(saved);
        setStatus('active');
        return;
      }
      SafeStorage.remove('nerro_astro_session');
    }
    setStatus('gate');
  }, []);

  const handleBirthDataComplete = (data: UserBirthData) => {
    setStatus('loading');
    
    // Simulate brief calculation pulse
    setTimeout(() => {
      const context = buildAstroContext(data);
      const newSession: ChatSession = {
        sessionId: crypto.randomUUID(),
        birthData: data,
        astrologyContext: context,
        messages: [],
        createdAt: new Date(),
        lastActiveAt: new Date()
      };
      
      setSession(newSession);
      SafeStorage.set('nerro_astro_session', newSession);
      setStatus('active');
    }, 1500);
  };

  const handleReset = () => {
    if (confirm("Are you sure? This will permanently clear your current astrology chat history.")) {
      SafeStorage.remove('nerro_astro_session');
      setSession(null);
      setStatus('gate');
    }
  };

  return (
    <div className="fixed inset-0 min-h-screen bg-background relative overflow-hidden flex flex-col">
      <Helmet>
        <title>NERRO Astro AI - Free Vedic Astrology Chat | Personal Jyotish Guide</title>
        <meta name="description" content="Talk to your personal Vedic astrologer powered by NERRO AI. Real-time Rashi and Nakshatra insights, life guidance, and remedies." />
      </Helmet>

      {/* Decorative stars / background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
         <div className="absolute top-[10%] left-[5%] w-1 h-1 bg-white rounded-full animate-pulse" />
         <div className="absolute top-[30%] left-[80%] w-1 h-1 bg-white rounded-full animate-pulse [animation-delay:1s]" />
         <div className="absolute top-[60%] left-[15%] w-1 h-1 bg-white rounded-full animate-pulse [animation-delay:2s]" />
         <div className="absolute top-[80%] left-[85%] w-1 h-1 bg-white rounded-full animate-pulse [animation-delay:0.5s]" />
      </div>

      <div className="relative flex-grow flex flex-col h-full overflow-hidden">
        <AnimatePresence mode="wait">
          {status === 'gate' && (
            <motion.div
              key="gate"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-grow pt-10"
            >
              <BirthDataGate onComplete={handleBirthDataComplete} />
            </motion.div>
          )}

          {status === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-grow flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full border-4 border-primary/20 animate-[spin_3s_linear_infinite]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Star className="text-primary animate-pulse" size={32} />
                </div>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-text-primary mb-2">NERRO is Reading the Universe</h2>
              <p className="text-text-muted font-mono uppercase tracking-[0.2em] text-[10px]">Syncing birth data with sidereal Lahiri planetary positions...</p>
            </motion.div>
          )}

          {status === 'active' && session && (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex-grow h-full flex flex-col"
            >
              <ChatInterface initialSession={session} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
