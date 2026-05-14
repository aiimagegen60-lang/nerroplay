import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { calculateAnkJyotish, AnkJyotishInput } from '../services/ankJyotishEngine';
import AIDeepAnalysis from './AIDeepAnalysis';
import { Star, Sparkles, User, Calendar, MapPin, Heart, Info, ArrowRight } from 'lucide-react';

const AnkJyotishTool = () => {
  const [formData, setFormData] = useState<AnkJyotishInput>({
    full_name: '',
    preferred_name: '',
    date_of_birth: '',
    gender: 'male',
    partner_name: '',
    partner_dob: '',
    partner_gender: null
  });

  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    const res = calculateAnkJyotish(formData);
    setResult(res);
  };

  const handleDeepAnalysis = async () => {
    if (!result || result.status === 'error') return "";
    const response = await fetch('/api/tool/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        toolId: 'ank-jyotish',
        inputData: formData,
        skipAnalysis: false
      })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data.analysis;
  };

  const renderAnalysis = (analysisText: string) => {
    try {
      let data = analysisText;
      if (typeof analysisText === 'string') {
        const cleaned = analysisText.replace(/```json/g, '').replace(/```/g, '').trim();
        data = JSON.parse(cleaned);
      }
      const aiData = (data as any)?.nerro_ai_analysis || data;

      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-800">
            <h4 className="text-xl font-bold text-indigo-900 dark:text-indigo-100 mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              Soul Profile Overview
            </h4>
            <p className="text-text-secondary leading-relaxed font-medium">
              {aiData.profile_overview}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface/50 p-6 rounded-3xl border border-border-glass">
              <h4 className="font-bold text-text-primary mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Strengths
              </h4>
              <ul className="space-y-2">
                {aiData.strengths?.map((s: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span className="text-green-500 font-black mt-0.5">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-surface/50 p-6 rounded-3xl border border-border-glass">
              <h4 className="font-bold text-text-primary mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                Energetic Imbalances
              </h4>
              <ul className="space-y-2">
                {aiData.energetic_imbalances?.map((s: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span className="text-orange-500 font-black mt-0.5">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-surface/50 p-6 rounded-3xl border border-border-glass">
            <h4 className="font-bold text-text-primary mb-4 uppercase tracking-wider text-sm">Subconscious Tendencies</h4>
            <p className="text-text-secondary text-sm leading-relaxed">
              {aiData.subconscious_tendencies}
            </p>
          </div>
          
          <div className="bg-surface/50 p-6 rounded-3xl border border-border-glass">
            <h4 className="font-bold text-text-primary mb-4 uppercase tracking-wider text-sm">Karmic Patterns</h4>
            <ul className="space-y-3">
              {aiData.karmic_patterns?.map((s: string, i: number) => (
                <li key={i} className="flex items-start gap-3 bg-background/50 p-3 rounded-xl text-sm text-text-secondary">
                  <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 font-black text-xs">{(i + 1)}</div>
                  <span className="mt-0.5">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-3xl border border-amber-100 dark:border-amber-800">
            <h4 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              Spiritual Guidance
            </h4>
            <p className="text-amber-800 dark:text-amber-200 leading-relaxed font-medium italic">
              "{aiData.spiritual_guidance}"
            </p>
          </div>
          
          <div className="bg-surface/50 p-6 rounded-3xl border border-border-glass">
            <h4 className="font-bold text-text-primary mb-3 uppercase tracking-wider text-sm">Emotional Reading</h4>
            <p className="text-text-secondary text-sm leading-relaxed">
              {aiData.emotional_reading}
            </p>
          </div>
        </div>
      );
    } catch (e) {
      console.error('Failed to parse AI JSON', e, analysisText);
      return <div className="text-red-500 text-sm p-4 bg-red-50 rounded-xl">Failed to render AI analysis format. Ensure the model returned valid JSON.</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface/50 backdrop-blur-xl rounded-3xl p-6 border border-border-glass">
            <h3 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              Birth Details
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Full Birth Name *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData(p => ({ ...p, full_name: e.target.value }))}
                    className="w-full pl-12 pr-4 py-3 bg-surface border border-border-glass rounded-2xl focus:ring-2 focus:ring-accent outline-none transition-all text-text-primary"
                    placeholder="E.g. Rahul Kumar Verma"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Date of Birth *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData(p => ({ ...p, date_of_birth: e.target.value }))}
                    className="w-full pl-12 pr-4 py-3 bg-surface border border-border-glass rounded-2xl focus:ring-2 focus:ring-accent outline-none transition-all text-text-primary [color-scheme:light] dark:[color-scheme:dark]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData(p => ({ ...p, gender: e.target.value as 'male' | 'female' }))}
                  className="w-full px-4 py-3 bg-surface border border-border-glass rounded-2xl focus:ring-2 focus:ring-accent outline-none transition-all text-text-primary"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <button
                onClick={handleCalculate}
                className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Generate Reading
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          {result && result.status === 'error' && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-start gap-3">
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{result.error_message}</p>
            </div>
          )}

          {result && result.status === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <h4 className="text-orange-100 font-medium mb-1">Moolank (Soul)</h4>
                  <div className="text-5xl font-black mb-2">{result.core_numbers.moolank.number}</div>
                  <p className="text-sm font-medium opacity-90">{result.core_numbers.moolank.archetype}</p>
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <span className="text-xs uppercase tracking-wider opacity-80">Ruling Planet</span>
                    <p className="font-bold">{result.core_numbers.moolank.planet_hindi} ({result.core_numbers.moolank.ruling_planet})</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-indigo-500 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <h4 className="text-purple-100 font-medium mb-1">Bhagyank (Destiny)</h4>
                  <div className="text-5xl font-black mb-2">{result.core_numbers.bhagyank.number}</div>
                  <p className="text-sm font-medium opacity-90">{result.core_numbers.bhagyank.archetype}</p>
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <span className="text-xs uppercase tracking-wider opacity-80">Ruling Planet</span>
                    <p className="font-bold">{result.core_numbers.bhagyank.planet_hindi} ({result.core_numbers.bhagyank.ruling_planet})</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <h4 className="text-emerald-100 font-medium mb-1">Namank (Name)</h4>
                  <div className="text-5xl font-black mb-2">{result.core_numbers.namank_birth.number}</div>
                  <p className="text-sm font-medium opacity-90">Kua Number: {result.core_numbers.kua_number.number}</p>
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <span className="text-xs uppercase tracking-wider opacity-80">Lucky Directions</span>
                    <p className="font-bold">{result.core_numbers.kua_number.best_directions.join(', ')}</p>
                  </div>
                </div>
              </div>

              <div className="bg-surface/50 backdrop-blur-xl rounded-3xl p-6 border border-border-glass">
                <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
                  <Star className="w-5 h-5 text-orange-500" />
                  Lo Shu Grid Analysis
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex justify-center items-center">
                    <div className="grid grid-cols-3 gap-2 p-4 bg-background rounded-2xl">
                      {[4, 9, 2, 3, 5, 7, 8, 1, 6].map(num => (
                        <div key={num} className="w-16 h-16 rounded-xl border border-border-glass flex items-center justify-center relative bg-surface">
                          {result.lo_shu_grid.grid[num.toString()] > 0 ? (
                            <span className="text-2xl font-black text-text-primary">{num}</span>
                          ) : (
                            <span className="text-lg font-medium text-text-muted">{num}</span>
                          )}
                          {result.lo_shu_grid.grid[num.toString()] > 1 && (
                            <span className="absolute bottom-1 right-1 text-xs font-bold text-orange-500 bg-orange-100 dark:bg-orange-900/50 px-1 rounded-sm">
                              x{result.lo_shu_grid.grid[num.toString()]}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-text-muted uppercase">Missing Numbers</h4>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {result.lo_shu_grid.missing_numbers.map((n: any) => (
                          <span key={n.number} className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-sm">
                            {n.number}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border-glass">
                      <div>
                        <span className="block text-xs font-medium text-text-muted mb-1">Mental Plane</span>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${result.lo_shu_grid.planes.mental_plane.strength === 'strong' ? 'bg-green-100 text-green-700' : 'bg-background text-text-muted'}`}>
                          {result.lo_shu_grid.planes.mental_plane.strength.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <span className="block text-xs font-medium text-text-muted mb-1">Emotional</span>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${result.lo_shu_grid.planes.emotional_plane.strength === 'strong' ? 'bg-green-100 text-green-700' : 'bg-background text-text-muted'}`}>
                          {result.lo_shu_grid.planes.emotional_plane.strength.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <span className="block text-xs font-medium text-text-muted mb-1">Physical</span>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${result.lo_shu_grid.planes.physical_plane.strength === 'strong' ? 'bg-green-100 text-green-700' : 'bg-background text-text-muted'}`}>
                          {result.lo_shu_grid.planes.physical_plane.strength.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <AIDeepAnalysis 
                onAnalyze={handleDeepAnalysis} 
                toolName="Ank Jyotish"
                renderAnalysis={renderAnalysis} 
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnkJyotishTool;
