import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, User, Share2 } from 'lucide-react';
import { blogPosts } from '../constants/blogData';

export default function BlogPost() {
  const { id } = useParams();
  const post = blogPosts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center">
        <h1 className="text-4xl font-black mb-8">Post Not Found</h1>
        <Link to="/blogs" className="text-blue-500 font-bold uppercase tracking-widest text-xs">← Back to Insights</Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <Helmet>
        <title>{post.title} | NerroPlay Blog</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        <Link 
          to="/blogs" 
          className="inline-flex items-center gap-2 text-[0.6rem] font-black uppercase tracking-[0.3em] text-text-muted hover:text-blue-500 transition-colors"
        >
          <ArrowLeft size={12} />
          Back to Selection
        </Link>

        <header className="space-y-8">
          <div className="flex flex-wrap gap-6 items-center text-[0.65rem] font-mono font-black uppercase tracking-widest text-text-muted">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-blue-500" />
              {post.date}
            </div>
            <div className="flex items-center gap-2">
              <User size={14} className="text-blue-500" />
              {post.author}
            </div>
            <div className="flex items-center gap-2 ml-auto cursor-pointer hover:text-blue-500 transition-colors">
              <Share2 size={14} />
              Share
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary leading-tight italic tracking-tighter">
            {post.title}
          </h1>
          
          <div className="p-6 bg-surface border border-border-glass rounded-3xl italic text-text-secondary text-lg font-medium">
            "{post.excerpt}"
          </div>
        </header>

        <div className="prose prose-slate dark:prose-invert max-w-none prose-h2:text-2xl prose-h2:font-black prose-h2:italic prose-h2:tracking-tight prose-h2:mt-12 prose-h2:mb-6 prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-relaxed prose-p:mb-6 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-500/5 prose-blockquote:p-6 prose-blockquote:rounded-r-3xl prose-a:text-blue-500 prose-a:no-underline hover:prose-a:underline">
          <ReactMarkdown
            components={{
              blockquote: ({ children }) => (
                <div className="my-8 p-6 bg-slate-50 dark:bg-white/5 border-l-4 border-blue-500 rounded-r-3xl">
                  {children}
                </div>
              ),
              a: ({ children, href }) => (
                <a href={href} className="text-blue-600 dark:text-blue-400 font-bold hover:underline" target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
              strong: ({ children }) => (
                <strong className="font-black text-text-primary italic">
                  {children}
                </strong>
              )
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        <footer className="pt-16 border-t border-border-glass text-center space-y-8">
          <p className="text-xs font-mono font-black uppercase tracking-[0.4em] text-text-muted">Evolution Protocol Complete</p>
          <div className="flex flex-col items-center gap-4">
             <h3 className="text-2xl font-black italic tracking-tight text-text-primary">Ready for your own transformation?</h3>
             <Link 
               to="/tools" 
               className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
             >
               Explore All Systems
             </Link>
          </div>
        </footer>
      </motion.div>
    </div>
  );
}
