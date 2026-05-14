import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Cpu, Zap, Moon, Sun } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.tools'), path: '/tools' },
    { name: 'Kundali Match', path: '/kundli-matching' },
    { name: 'Games', path: '/games' },
    { name: 'Blogs', path: '/blogs' },
  ];

  return (
    <nav className="h-28 bg-bg-glass backdrop-blur-md border-b border-border-glass flex items-center px-4 md:px-12 justify-between sticky top-0 z-50 transition-colors duration-300">
      <Link to="/" className="flex items-center font-extrabold text-3xl md:text-4xl tracking-tighter text-text-primary neon-text relative z-10">
        <span>NERRO</span><span className="text-accent">PLAY</span>
      </Link>

      {/* Desktop Nav and Actions */}
      <div className="hidden md:flex items-center gap-8">
        <div className="flex gap-8 text-[0.7rem] font-mono uppercase tracking-[0.2em] font-bold">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'transition-all hover:tracking-[0.25em]',
                location.pathname === link.path ? 'text-accent neon-text' : 'text-text-secondary hover:text-text-primary'
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-border-glass transition-all text-text-secondary hover:text-accent hover:scale-110"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="flex items-center gap-2 md:hidden">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-border-glass transition-colors text-text-secondary hover:text-accent"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="p-2 text-text-primary" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-28 left-0 w-full bg-surface border-b border-border-glass p-4 flex flex-col gap-4 md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'text-lg font-medium p-2',
                  location.pathname === link.path ? 'text-accent' : 'text-text-secondary'
                )}
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
