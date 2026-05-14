import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Instagram, Youtube, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: 'Platform',
      links: [
        { name: 'Home', path: '/' },
        { name: 'AI Tools', path: '/tools' },
        { name: 'Games', path: '/games' },
        { name: 'Dashboard', path: '/dashboard' },
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
        { name: 'FAQ', path: '/legal/faq' },
        { name: 'AI Transparency', path: '/legal/ai-transparency' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', path: '/legal/privacy' },
        { name: 'Terms of Service', path: '/legal/terms' },
        { name: 'Disclaimer', path: '/legal/disclaimer' },
        { name: 'Cookie Policy', path: '/legal/cookies' },
        { name: 'Data Usage', path: '/legal/data-usage' },
      ]
    }
  ];

  return (
    <footer className="bg-background border-t border-border-glass pt-20 pb-10 px-4 md:px-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between gap-16 mb-16">
          <div className="lg:max-w-md">
            <Link to="/" className="inline-flex items-center font-extrabold text-3xl tracking-tighter text-text-primary mb-6">
              NERRO<span className="text-accent">PLAY</span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed mb-8 max-w-sm">
              NERROPLAY is a premier, educational, AI-powered platform delivering algorithmic tools across health, finance, beauty, and smart living. We prioritize transparency, privacy, and scientific accuracy.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Instagram, url: 'https://instagram.com/nerroplay', label: 'Instagram' },
                { icon: Youtube, url: 'https://youtube.com/@nerroplay', label: 'YouTube' },
                { icon: Twitter, url: 'https://twitter.com/nerroplay', label: 'Twitter' },
                { icon: Mail, url: 'mailto:admin@nerroplay.online', label: 'Email' }
              ].map((social, i) => (
                <a
                  key={`social-${social.label}-${i}`}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg glass flex items-center justify-center text-text-secondary hover:text-accent hover:border-accent transition-all"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 md:gap-16 lg:gap-20">
            {sections.map((section, idx) => (
              <div key={`section-${section.title}-${idx}`}>
                <h4 className="text-xs font-mono font-black text-text-primary uppercase tracking-[0.2em] mb-6">{section.title}</h4>
                <ul className="space-y-4">
                  {section.links.map((link, lIdx) => (
                    <li key={`link-${link.name}-${lIdx}`}>
                      <Link to={link.path} className="text-sm text-text-secondary hover:text-accent transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-border-glass flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
            © {currentYear} NERROPLAY CORE. ALL RIGHTS RESERVED. VERSION 1.4.2
          </p>
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">SYSTEM_STATUS: OPERATIONAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
