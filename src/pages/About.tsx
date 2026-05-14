import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Globe, Zap, Shield, Sparkles, Code } from 'lucide-react';

export default function About() {
  return (
    <div className="pt-20 pb-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-24">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold text-text-primary tracking-tighter mb-8"
        >
          Intelligence <span className="text-accent neon-text">Responsibly Managed</span>
        </motion.h1>
        <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
          NERROPLAY is a legitimate, educational, AI-powered SaaS platform offering trustworthy tools across Health & Fitness, Beauty & Skincare, Finance, Spirituality & Lifestyle, and Utilities & Smart Living.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
        <div className="glass p-12 rounded-[40px] border border-border-glass">
          <h2 className="text-3xl font-bold text-text-primary mb-6">Our Educational Mission</h2>
          <p className="text-text-secondary leading-relaxed text-lg mb-8">
            At NERROPLAY, our objective is to simplify complex calculations and provide educational insights. Whether you are calculating your BMI or checking a loan schedule, our platform serves as a reliable secondary reference designed to inform and empower. We ensure all users understand that calculations are algorithmic and deterministic at their core.
          </p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent">
              <Globe size={24} />
            </div>
            <span className="font-bold text-text-primary">Global Information Access</span>
          </div>
        </div>
        <div className="glass p-12 rounded-[40px] border border-border-glass">
          <h2 className="text-3xl font-bold text-text-primary mb-6">Ethical AI Framework</h2>
          <p className="text-text-secondary leading-relaxed text-lg mb-8">
            We use Artificial Intelligence not as a replacement for professional advice, but as a layer of logical synthesis. All tools operate on deterministic algorithms, with the AI providing a human-readable bridge to understanding the raw data.
          </p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent">
              <Cpu size={24} />
            </div>
            <span className="font-bold text-text-primary">Transparency-First AI</span>
          </div>
        </div>
      </div>

      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-text-primary mb-12">Legitimacy Pillars</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Shield, title: 'Data Sovereignty', desc: 'Inputs are processed in real-time, never sold or mishandled.' },
            { icon: Zap, title: 'Precision', desc: 'Scientific formulas meet modern computing performance.' },
            { icon: Sparkles, title: 'Transparency', desc: 'Clear distinction between math and AI interpretation.' },
            { icon: Code, title: 'Maintained', desc: 'Updated regularly by the NERROPLAY Core engineering team.' },
          ].map((value) => (
            <div key={`pillar-${value.title}`} className="p-6">
              <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center text-accent mx-auto mb-6">
                <value.icon size={32} />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">{value.title}</h3>
              <p className="text-text-secondary text-sm">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
