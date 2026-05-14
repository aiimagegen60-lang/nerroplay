import React from 'react';
import { motion } from 'motion/react';
import { Mail, MessageSquare, MapPin, Phone } from 'lucide-react';

export default function Contact() {
  return (
    <div className="pt-20 pb-20 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text-primary tracking-tighter mb-8">
            Global <span className="text-accent neon-text">Support</span>
          </h1>
          <p className="text-xl text-text-secondary mb-12 leading-relaxed">
            Have questions about our AI tools or educational content? Our support team responds to all inquiries within 24-48 business hours.
          </p>

          <div className="space-y-8">
            {[
              { icon: Mail, label: 'ADMINISTRATION', value: 'admin@nerroplay.online' },
              { icon: Mail, label: 'SUPPORT', value: 'admin@nerroplay.online' },
              { icon: MessageSquare, label: 'RESPONSE TIME', value: 'Within 48 Business Hours' },
              { icon: MapPin, label: 'LOCATION', value: 'Narroplay Global Digital Operations' },
            ].map((item) => (
              <div key={`contact-${item.label}`} className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-text-secondary group-hover:text-accent group-hover:border-accent transition-all">
                  <item.icon size={24} />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-text-secondary uppercase tracking-widest mb-1">{item.label}</div>
                  <div className="text-lg font-bold text-text-primary">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-10 rounded-[40px] border-white/5 relative overflow-hidden">
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/5 blur-[100px] rounded-full" />
          
          <form className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-text-secondary uppercase tracking-widest ml-1">Full Name</label>
                <input type="text" className="w-full bg-surface/50 border border-border-glass rounded-xl p-4 text-text-primary focus:outline-none focus:border-accent/50" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-text-secondary uppercase tracking-widest ml-1">Email Address</label>
                <input type="email" className="w-full bg-surface/50 border border-border-glass rounded-xl p-4 text-text-primary focus:outline-none focus:border-accent/50" placeholder="john@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono text-text-secondary uppercase tracking-widest ml-1">Subject</label>
              <select className="w-full bg-surface/50 border border-border-glass rounded-xl p-4 text-text-primary focus:outline-none focus:border-accent/50 appearance-none">
                <option>General Inquiry</option>
                <option>Technical Support</option>
                <option>Partnership Proposal</option>
                <option>Billing Question</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono text-text-secondary uppercase tracking-widest ml-1">Message</label>
              <textarea className="w-full bg-surface/50 border border-border-glass rounded-xl p-4 text-text-primary focus:outline-none focus:border-accent/50 min-h-[150px]" placeholder="How can we help you?"></textarea>
            </div>
            <button className="w-full py-4 rounded-xl bg-accent text-background font-bold text-lg neon-glow hover:scale-[1.02] transition-transform">
              SEND TRANSMISSION
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
