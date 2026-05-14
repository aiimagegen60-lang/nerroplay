import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, Play, Trophy, Cpu, X, Maximize2, Loader2, Plus, Globe, Image as ImageIcon, FileText, Send } from 'lucide-react';
import { GAMES as STATIC_GAMES } from '../constants';
import { getSupabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function GamesLanding() {
  const { user } = useAuth();
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [dynamicGames, setDynamicGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGame, setNewGame] = useState({
    name: '',
    description: '',
    image_url: '',
    game_url: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchGames = async () => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (data && !error) {
        setDynamicGames(data);
      }
    } catch (err) {
      console.error("Failed to fetch games from Supabase:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleAddGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      const supabase = getSupabase();
      const { error } = await supabase
        .from('games')
        .insert([{
          ...newGame,
          is_active: true,
          added_by: user.id
        }]);

      if (error) throw error;

      setShowAddModal(false);
      setNewGame({ name: '', description: '', image_url: '', game_url: '' });
      fetchGames();
    } catch (err) {
      console.error("Error adding game:", err);
      alert("Failed to add game. Make sure the 'games' table exists in Supabase.");
    } finally {
      setSubmitting(false);
    }
  };

  const allGames = [...STATIC_GAMES, ...dynamicGames.map(g => ({
    id: g.id,
    name: g.name,
    description: g.description,
    image: g.image_url,
    url: g.game_url
  }))];

  return (
    <div className="pt-20 pb-16 px-4 md:px-12 max-w-[1200px] mx-auto relative">
      <Helmet>
        <title>Neural Games & Neuro-Simulations | NerroPlay</title>
        <meta name="description" content="Test your reflexes and cognitive skills with our wide range of neural games and simulations." />
      </Helmet>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-text-primary mb-6 uppercase leading-[0.9]">
            Play.<br /> 
            <span className="text-accent">Compete.</span><br /> 
            Dominate.
          </h1>
          <p className="text-xs font-mono text-text-muted max-w-2xl uppercase tracking-widest leading-relaxed">
            NerroPlay Games are high-fidelity neuro-simulations. Test your bio-reflexes and cognitive synchronization against our neural competitive layer.
          </p>
        </div>

        {user && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-accent text-background rounded-xl text-[0.65rem] font-mono font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-accent/20"
          >
            <Plus size={16} /> Add Neural Game
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="text-accent animate-spin mb-4" size={32} />
          <span className="text-[0.6rem] font-mono text-text-muted uppercase tracking-widest">Synchronizing Neural Channels...</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-20">
          {allGames.map((game) => (
            <motion.div
              key={game.id}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-2xl border border-border-glass bg-surface transition-all hover:border-accent"
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={game.image} 
                  alt={game.name} 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0 opacity-50 group-hover:opacity-100"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
              </div>

              <div className="p-5 relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[0.55rem] font-mono text-accent uppercase tracking-widest flex items-center gap-1.5">
                    <Cpu size={10} /> Link: OK
                  </span>
                  <span className="text-[0.55rem] font-mono text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                    <Trophy size={10} /> Compete
                  </span>
                </div>
                <h3 className="text-base font-bold text-text-primary mb-2 uppercase tracking-tight group-hover:text-accent transition-colors">{game.name}</h3>
                <p className="text-[0.65rem] text-text-muted font-mono uppercase mb-4 leading-relaxed line-clamp-2 h-8">
                  {game.description}
                </p>
                
                <button 
                  onClick={() => setSelectedGame(game)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-surface border border-border-glass rounded-lg text-[0.6rem] font-mono font-bold uppercase tracking-[0.2em] transition-all hover:bg-accent hover:text-background hover:border-accent group-hover:shadow-lg group-hover:shadow-accent/20"
                >
                  <Play size={12} fill="currentColor" /> Initialize
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Game Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-lg glass rounded-3xl border border-accent/20 p-8 relative"
            >
              <button 
                onClick={() => setShowAddModal(false)}
                className="absolute top-6 right-6 p-2 text-text-muted hover:text-accent transition-colors"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-black text-text-primary uppercase tracking-tighter mb-2">Deploy New Module</h2>
              <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-8">Register game in the NerroPlay Global Index</p>

              <form onSubmit={handleAddGame} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[0.65rem] font-mono text-accent uppercase tracking-widest flex items-center gap-2">
                    <FileText size={12} /> Game Identity
                  </label>
                  <input 
                    required
                    type="text"
                    value={newGame.name}
                    onChange={e => setNewGame({...newGame, name: e.target.value})}
                    placeholder="Enter game name..."
                    className="w-full bg-background border border-border-glass rounded-xl p-4 font-mono text-xs uppercase focus:border-accent transition-all outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[0.65rem] font-mono text-accent uppercase tracking-widest flex items-center gap-2">
                    <Globe size={12} /> Simulation URL
                  </label>
                  <input 
                    required
                    type="url"
                    value={newGame.game_url}
                    onChange={e => setNewGame({...newGame, game_url: e.target.value})}
                    placeholder="https://..."
                    className="w-full bg-background border border-border-glass rounded-xl p-4 font-mono text-xs focus:border-accent transition-all outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[0.65rem] font-mono text-accent uppercase tracking-widest flex items-center gap-2">
                    <ImageIcon size={12} /> GitHub Raw Logo URL
                  </label>
                  <input 
                    required
                    type="url"
                    value={newGame.image_url}
                    onChange={e => setNewGame({...newGame, image_url: e.target.value})}
                    placeholder="https://raw.githubusercontent.com/..."
                    className="w-full bg-background border border-border-glass rounded-xl p-4 font-mono text-xs focus:border-accent transition-all outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[0.65rem] font-mono text-accent uppercase tracking-widest flex items-center gap-2">
                    <FileText size={12} /> Neural Summary
                  </label>
                  <textarea 
                    required
                    value={newGame.description}
                    onChange={e => setNewGame({...newGame, description: e.target.value})}
                    placeholder="Brief objective of the game..."
                    rows={3}
                    className="w-full bg-background border border-border-glass rounded-xl p-4 font-mono text-xs uppercase focus:border-accent transition-all outline-none resize-none"
                  />
                </div>

                <button 
                  disabled={submitting}
                  type="submit"
                  className="w-full py-4 bg-accent text-background rounded-xl font-mono font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                  {submitting ? 'Transmitting Data...' : 'Confirm Deployment'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Overlay Container */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-10"
          >
            <div className="relative w-full h-[85vh] md:h-[95vh] max-w-[98vw] lg:max-w-screen-2xl glass rounded-3xl border border-accent/30 overflow-hidden flex flex-col mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-border-glass bg-surface/50">
                <div className="flex items-center gap-4">
                  <Gamepad2 className="text-accent" size={24} />
                  <div>
                    <h2 className="text-sm md:text-lg font-bold text-text-primary uppercase tracking-tighter">{selectedGame.name}</h2>
                    <p className="text-[0.5rem] md:text-[0.6rem] font-mono text-accent uppercase tracking-widest">Active Neuro-Session</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   <button 
                    onClick={() => setSelectedGame(null)}
                    className="p-2 md:p-3 bg-surface border border-border-glass rounded-xl text-text-muted hover:text-accent transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Game Viewport */}
              <div className="flex-grow bg-black relative flex items-center justify-center overflow-auto p-2">
                <div className="w-full h-full flex items-center justify-center">
                  <iframe 
                    src={selectedGame.url} 
                    className="h-full w-auto aspect-[9/16] md:w-full md:h-full md:aspect-auto border-none shadow-2xl"
                    title={selectedGame.name}
                    allow="autoplay; fullscreen; pointer-lock"
                  />
                </div>
              </div>

              {/* Footer / Controls */}
              <div className="p-3 md:p-4 bg-surface/50 border-t border-border-glass flex justify-between items-center px-4 md:px-8">
                 <div className="flex items-center gap-4 md:gap-6">
                    <div className="flex flex-col">
                        <span className="text-[0.4rem] md:text-[0.5rem] font-mono text-text-muted uppercase">Connection</span>
                        <span className="text-[0.5rem] md:text-[0.6rem] font-mono text-green-500 uppercase">Synchronized</span>
                    </div>
                    <div className="hidden sm:flex flex-col">
                        <span className="text-[0.4rem] md:text-[0.5rem] font-mono text-text-muted uppercase">Latency</span>
                        <span className="text-[0.5rem] md:text-[0.6rem] font-mono text-accent uppercase">12ms</span>
                    </div>
                 </div>
                 <div className="text-[0.5rem] md:text-[0.65rem] font-mono text-text-muted uppercase tracking-[0.2em]">
                    NarroPlay Engine v2.4
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
