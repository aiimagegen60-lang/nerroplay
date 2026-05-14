import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

import { blogPosts } from '../constants/blogData';

export default function BlogLanding() {
  return (
    <div className="max-w-7xl mx-auto py-24 px-4">
      <Helmet>
        <title>Health & Wellness Insights | NerroPlay Blog</title>
        <meta name="description" content="Expert health tips, fitness guides, and data-driven wellness advice from the NerroPlay team." />
      </Helmet>
      
      <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-text-primary italic">
          INSIGHTS & <span className="text-blue-600">INNOVATION</span>
        </h1>
        <p className="text-text-secondary font-medium text-lg leading-relaxed">
          Deep dives into physiological intelligence, metabolic optimization, and the future of digital wellness.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map(post => (
          <motion.div 
            key={post.id} 
            className="group relative glass p-8 rounded-[2.5rem] transition-all duration-500 overflow-hidden" 
            whileHover={{ y: -10 }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[0.6rem] font-mono font-black uppercase text-blue-500 tracking-[0.3em]">{post.date}</span>
                <span className="text-[0.6rem] font-mono font-black uppercase text-text-muted tracking-[0.3em]">{post.author}</span>
              </div>
              
              <h2 className="text-2xl font-black text-text-primary leading-tight italic group-hover:text-blue-500 transition-colors">
                {post.title}
              </h2>
              
              <p className="text-text-secondary font-medium text-sm leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
              
              <div className="pt-4 border-t border-border-glass">
                <Link 
                  to={`/blogs/${post.id}`} 
                  className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-text-primary hover:text-blue-500 transition-colors"
                >
                  Read Selection
                  <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
