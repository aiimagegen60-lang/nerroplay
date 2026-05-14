import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Globe, Zap, Shield, Sparkles, Code, BarChart, Layout } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: Cpu,
      title: 'AI Integration',
      desc: 'Seamlessly integrate advanced neural networks into your existing workflows for automated decision making.',
      features: ['Custom Model Training', 'Real-time Inference', 'Neural API Access']
    },
    {
      icon: Shield,
      title: 'Cyber Security',
      desc: 'Protect your digital assets with our enterprise-grade security protocols and real-time threat monitoring.',
      features: ['Vulnerability Scanning', 'Traffic Analysis', 'Encryption Services']
    },
    {
      icon: BarChart,
      title: 'Data Intelligence',
      desc: 'Transform raw data into actionable insights with our sophisticated visualization and analysis tools.',
      features: ['Predictive Analytics', 'Interactive Dashboards', 'Big Data Processing']
    },
    {
      icon: Layout,
      title: 'UX Optimization',
      desc: 'Enhance user engagement and conversion rates with our AI-driven design and behavior analysis.',
      features: ['A/B Testing', 'Heatmap Generation', 'User Flow Mapping']
    }
  ];

  return (
    <div className="pt-20 pb-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-24">
        <h1 className="text-5xl md:text-7xl font-bold text-text-primary tracking-tighter mb-8">
          Professional <span className="text-accent neon-text">Services</span>
        </h1>
        <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
          Beyond our toolbox, we offer specialized services to help you scale your digital infrastructure and leverage the power of AI.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
        {services.map((service, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -10 }}
            className="glass p-10 rounded-[40px] hover:border-accent/40 transition-all"
          >
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-8">
              <service.icon size={32} />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-4">{service.title}</h3>
            <p className="text-text-secondary leading-relaxed mb-8">{service.desc}</p>
            <ul className="space-y-3">
              {service.features.map((feature, j) => (
                <li key={j} className="flex items-center gap-3 text-sm text-text-primary font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent neon-glow" />
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <div className="glass p-12 rounded-[40px] text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-accent/5 -z-10" />
        <h2 className="text-3xl font-bold text-text-primary mb-6">Need a Custom Solution?</h2>
        <p className="text-text-secondary mb-10 max-w-2xl mx-auto">
          Our team of senior engineers can build bespoke tools and AI models tailored to your specific business requirements.
        </p>
        <button className="px-10 py-4 rounded-2xl bg-accent text-background font-bold text-lg neon-glow hover:scale-105 transition-transform">
          SCHEDULE A CONSULTATION
        </button>
      </div>
    </div>
  );
}
