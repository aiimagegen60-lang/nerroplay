import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Calendar, Clock, MapPin, Heart, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

const partnerSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long')
    .regex(/^[a-zA-Z\s\-'.]+$/, 'Name contains invalid characters')
    .transform(val => val.trim()),
  
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine(val => {
      const date = new Date(val);
      if (isNaN(date.getTime())) return false;
      const year = date.getFullYear();
      return year >= 1900 && year <= new Date().getFullYear();
    }, 'Please enter a valid date of birth'),
  
  timeOfBirth: z
    .string()
    .min(1, 'Time of birth is required')
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter time in HH:MM format'),
  
  placeOfBirth: z
    .string()
    .min(2, 'Place of birth is required')
    .max(200, 'Place name is too long')
    .transform(val => val.trim())
});

const kundliMatchSchema = z.object({
  partner1: partnerSchema,
  partner2: partnerSchema
});

export type KundliMatchFormData = z.infer<typeof kundliMatchSchema>;

interface PartnerFormProps {
  onSubmit: (data: KundliMatchFormData) => void;
  isLoading?: boolean;
}

export default function PartnerForm({ onSubmit, isLoading }: PartnerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<KundliMatchFormData>({
    resolver: zodResolver(kundliMatchSchema),
    defaultValues: {
      partner1: { fullName: '', dateOfBirth: '', timeOfBirth: '12:00', placeOfBirth: '' },
      partner2: { fullName: '', dateOfBirth: '', timeOfBirth: '12:00', placeOfBirth: '' }
    }
  });

  const renderPartnerSection = (num: 1 | 2, label: string, iconColor: string) => {
    const field = num === 1 ? 'partner1' : 'partner2';
    const pErrors = errors[field];

    return (
      <div className="space-y-6 glass p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-accent/30 transition-all duration-500">
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${num === 1 ? 'from-pink-500/10 to-transparent' : 'from-blue-500/10 to-transparent'} blur-3xl -z-10`} />
        
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-2xl ${num === 1 ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'} flex items-center justify-center font-black text-xl shadow-sm`}>
            {label}
          </div>
          <div>
            <h3 className="font-black text-xl uppercase tracking-tighter text-text-primary">
              Partner {num} Details
            </h3>
            <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
              Enter birth data
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-black text-text-muted uppercase tracking-widest mb-2 ml-1">Full Birth Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                {...register(`${field}.fullName`)}
                className="w-full pl-12 pr-4 py-4 bg-background/50 border border-border-glass rounded-2xl focus:ring-2 focus:ring-accent outline-none font-medium transition-all"
                placeholder="Deepika Padukone"
              />
            </div>
            {pErrors?.fullName && <p className="text-accent text-[10px] font-bold mt-1 ml-1">{pErrors.fullName.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* DOB */}
            <div>
              <label className="block text-xs font-black text-text-muted uppercase tracking-widest mb-2 ml-1">Date of Birth</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="date"
                  {...register(`${field}.dateOfBirth`)}
                  className="w-full pl-12 pr-4 py-4 bg-background/50 border border-border-glass rounded-2xl focus:ring-2 focus:ring-accent outline-none font-medium transition-all [color-scheme:dark]"
                />
              </div>
              {pErrors?.dateOfBirth && <p className="text-accent text-[10px] font-bold mt-1 ml-1">{pErrors.dateOfBirth.message}</p>}
            </div>

            {/* TOB */}
            <div>
              <label className="block text-xs font-black text-text-muted uppercase tracking-widest mb-2 ml-1">Time of Birth</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="time"
                  {...register(`${field}.timeOfBirth`)}
                  className="w-full pl-12 pr-4 py-4 bg-background/50 border border-border-glass rounded-2xl focus:ring-2 focus:ring-accent outline-none font-medium transition-all [color-scheme:dark]"
                />
              </div>
              {pErrors?.timeOfBirth && <p className="text-accent text-[10px] font-bold mt-1 ml-1">{pErrors.timeOfBirth.message}</p>}
            </div>
          </div>

          {/* Place of Birth */}
          <div>
            <label className="block text-xs font-black text-text-muted uppercase tracking-widest mb-2 ml-1">Place of Birth</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                {...register(`${field}.placeOfBirth`)}
                className="w-full pl-12 pr-4 py-4 bg-background/50 border border-border-glass rounded-2xl focus:ring-2 focus:ring-accent outline-none font-medium transition-all"
                placeholder="Mumbai, Maharashtra"
              />
            </div>
            {pErrors?.placeOfBirth && <p className="text-accent text-[10px] font-bold mt-1 ml-1">{pErrors.placeOfBirth.message}</p>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto,1fr] items-center gap-6">
        {renderPartnerSection(1, '♀', 'pink')}
        
        <div className="hidden lg:flex flex-col items-center gap-4 py-10">
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-border-glass to-transparent" />
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-16 h-16 rounded-full bg-surface border border-border-glass flex items-center justify-center shadow-glow"
          >
            <Heart className="w-8 h-8 text-accent fill-accent/10" />
          </motion.div>
          <div className="w-px h-20 bg-gradient-to-t from-transparent via-border-glass to-transparent" />
        </div>

        {renderPartnerSection(2, '♂', 'blue')}
      </div>

      <div className="max-w-xl mx-auto flex flex-col items-center gap-6">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full group relative flex items-center justify-center gap-3 px-10 py-6 bg-text-primary text-background rounded-[2rem] font-black uppercase tracking-[0.2em] hover:bg-accent hover:text-black transition-all duration-500 overflow-hidden shadow-2xl disabled:opacity-50"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-white/10 to-accent/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-6 h-6 border-2 border-current border-t-transparent rounded-full"
            />
          ) : (
            <>
              <Sparkles className="w-6 h-6" />
              <span>Calculate Compatibility ✨</span>
            </>
          )}
        </button>

        <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black text-text-muted uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            Vedic Ashtakoot System
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            No Data Stored Locally
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            Advanced AI Intelligence
          </div>
        </div>
      </div>
    </form>
  );
}
