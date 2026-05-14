
import React, { memo } from 'react';

export const NerroAvatarAnim = memo(({ isThinking, size = 'large' }: { isThinking?: boolean, size?: 'small' | 'large' | 'mini' }) => {
  const dimensions = {
    small: 'w-9 h-9',
    large: 'w-14 h-14',
    mini: 'w-6 h-6'
  }[size];

  return (
    <div className={`${dimensions} relative flex items-center justify-center shrink-0`}>
      {/* Outer Rotating Ring */}
      <div className={`absolute inset-0 rounded-full border border-primary/30 ${isThinking ? 'animate-[spin_3s_linear_infinite]' : 'animate-[spin_10s_linear_infinite]'}`} />
      
      {/* Inner Pulsing Orb */}
      <div className={`absolute inset-1 rounded-full bg-gradient-to-br from-primary via-secondary to-accent opacity-20 ${isThinking ? 'animate-pulse' : 'animate-[pulse_4s_ease-in-out_infinite]'}`} />
      
      {/* Core */}
      <div className="absolute inset-2 rounded-full bg-surface border border-border-glass flex items-center justify-center overflow-hidden shadow-glow">
        <span className="text-primary font-display font-bold text-lg select-none">N</span>
      </div>

      {/* Thinking Aura */}
      {isThinking && (
        <div className="absolute -inset-1 rounded-full border border-accent/40 animate-ping opacity-30" />
      )}
    </div>
  );
});
