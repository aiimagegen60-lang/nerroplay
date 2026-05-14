import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Sparkles, User } from 'lucide-react';
import { BirthData } from '../types';

interface BirthFormProps {
  onSubmit: (data: BirthData) => void;
  loading?: boolean;
}

export default function BirthForm({ onSubmit, loading }: BirthFormProps) {
  const [formData, setFormData] = useState<BirthData>({
    fullName: '',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.form 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      onSubmit={handleSubmit}
      className="glass p-8 md:p-12 rounded-[2.5rem] border border-border-glass bg-surface/50 backdrop-blur-3xl shadow-2xl space-y-8"
    >
      <div className="space-y-2 text-center mb-10">
        <h2 className="text-2xl font-black text-text-primary uppercase tracking-tighter">Enter Birth Details</h2>
        <p className="text-xs text-text-muted font-mono uppercase tracking-[0.2em]">Secure Encryption Active</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-2 col-span-full">
          <label className="text-[10px] font-mono text-accent uppercase tracking-widest pl-2">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="text"
              required
              placeholder="e.g. Aryan Sharma"
              value={formData.fullName}
              onChange={e => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full h-14 pl-12 pr-4 bg-background/50 border border-border-glass rounded-2xl text-text-primary placeholder:text-text-muted/50 focus:border-accent/50 outline-none transition-all"
            />
          </div>
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-accent uppercase tracking-widest pl-2">Date of Birth</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="date"
              required
              value={formData.dateOfBirth}
              onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className="w-full h-14 pl-12 pr-4 bg-background/50 border border-border-glass rounded-2xl text-text-primary outline-none focus:border-accent/50 transition-all [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Time of Birth */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-accent uppercase tracking-widest pl-2">Time of Birth</label>
          <div className="relative">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="time"
              required
              value={formData.timeOfBirth}
              onChange={e => setFormData({ ...formData, timeOfBirth: e.target.value })}
              className="w-full h-14 pl-12 pr-4 bg-background/50 border border-border-glass rounded-2xl text-text-primary outline-none focus:border-accent/50 transition-all [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Place of Birth */}
        <div className="space-y-2 col-span-full">
          <label className="text-[10px] font-mono text-accent uppercase tracking-widest pl-2">Place of Birth</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="text"
              required
              placeholder="City, State, Country"
              value={formData.placeOfBirth}
              onChange={e => setFormData({ ...formData, placeOfBirth: e.target.value })}
              className="w-full h-14 pl-12 pr-4 bg-background/50 border border-border-glass rounded-2xl text-text-primary placeholder:text-text-muted/50 focus:border-accent/50 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-16 bg-accent text-background rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-3"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Sparkles className="animate-pulse" size={18} />
            CALCULATING COSNOS...
          </span>
        ) : (
          <>
            <Sparkles size={18} />
            Reveal My Moon Report
          </>
        )}
      </button>

      <div className="flex justify-center gap-4 text-[8px] font-mono text-text-muted uppercase tracking-widest pt-4 opacity-50">
        <span>No Registration</span>
        <span>•</span>
        <span>Free Report</span>
        <span>•</span>
        <span>Vedic Engine v2.4</span>
      </div>
    </motion.form>
  );
}
