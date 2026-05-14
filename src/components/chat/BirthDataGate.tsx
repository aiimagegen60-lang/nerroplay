
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserBirthData } from '../../types/chat.types';
import { Sparkles, Calendar, Clock, MapPin, User } from 'lucide-react';
import { motion } from 'motion/react';

const birthSchema = z.object({
  fullName: z.string().min(2, "Name is too short"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  timeOfBirth: z.string().optional(),
  placeOfBirth: z.string().min(1, "Place of birth is required"),
  knowsExactTime: z.boolean()
});

interface BirthDataGateProps {
  onComplete: (data: UserBirthData) => void;
}

export const BirthDataGate = ({ onComplete }: BirthDataGateProps) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<UserBirthData>({
    resolver: zodResolver(birthSchema),
    defaultValues: {
      knowsExactTime: true
    }
  });

  const knowsExactTime = watch('knowsExactTime');

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl glass p-8 md:p-10 rounded-[2rem] border border-border-glass shadow-card overflow-hidden relative"
      >
        {/* Background Accents */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="text-center mb-10 relative">
          <div className="inline-flex p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-6 animate-pulse">
            <Sparkles size={24} />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tighter text-text-primary mb-3">
            NERRO ASTRO AI
          </h1>
          <p className="text-text-muted text-sm font-mono uppercase tracking-widest">
            Neural Vedic Astrology Intelligence
          </p>
        </div>

        <form onSubmit={handleSubmit(onComplete)} className="space-y-6 relative">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-text-muted ml-1 flex items-center gap-2">
                <User size={12} className="text-primary" /> Full Name
              </label>
              <input
                {...register('fullName')}
                placeholder="Ex. Arjun Sharma"
                className="w-full bg-surface/50 border border-border-glass rounded-xl px-4 py-4 text-sm font-medium focus:outline-none focus:border-primary transition-all"
              />
              {errors.fullName && <p className="text-red-500 text-[10px] ml-1">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-text-muted ml-1 flex items-center gap-2">
                <Calendar size={12} className="text-primary" /> Date of Birth
              </label>
              <input
                {...register('dateOfBirth')}
                type="date"
                className="w-full bg-surface/50 border border-border-glass rounded-xl px-4 py-4 text-sm font-medium focus:outline-none focus:border-primary transition-all"
              />
              {errors.dateOfBirth && <p className="text-red-500 text-[10px] ml-1">{errors.dateOfBirth.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-text-muted ml-1 flex items-center gap-2">
                <Clock size={12} className="text-primary" /> Time of Birth
              </label>
              <input
                {...register('timeOfBirth')}
                type="time"
                disabled={!knowsExactTime}
                className="w-full bg-surface/50 border border-border-glass rounded-xl px-4 py-4 text-sm font-medium focus:outline-none focus:border-primary transition-all disabled:opacity-30"
              />
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register('knowsExactTime')}
                  className="w-3 h-3 rounded border-border-glass bg-surface"
                />
                <span className="text-[10px] font-mono uppercase text-text-muted">I don't know exact time</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-text-muted ml-1 flex items-center gap-2">
                <MapPin size={12} className="text-primary" /> Place of Birth
              </label>
              <input
                {...register('placeOfBirth')}
                placeholder="Ex. New Delhi, India"
                className="w-full bg-surface/50 border border-border-glass rounded-xl px-4 py-4 text-sm font-medium focus:outline-none focus:border-primary transition-all"
              />
              {errors.placeOfBirth && <p className="text-red-500 text-[10px] ml-1">{errors.placeOfBirth.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-black font-bold py-5 rounded-2xl shadow-glow hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase tracking-widest mt-4"
          >
            Start My Reading ✨
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-border-glass flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2 text-[9px] font-mono text-text-muted uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Free to use
          </div>
          <div className="flex items-center gap-2 text-[9px] font-mono text-text-muted uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Private & Secure
          </div>
          <div className="flex items-center gap-2 text-[9px] font-mono text-text-muted uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Vedic Precision
          </div>
        </div>
      </motion.div>
    </div>
  );
};
