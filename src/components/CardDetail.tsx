import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Play, Square, Volume2, MapPin, Sparkles, 
  Calendar, PenTool, Send, Trash2, Heart, Check, HelpCircle
} from 'lucide-react';
import { CardItem } from '../types';

interface CardDetailProps {
  card: CardItem | null;
  onClose: () => void;
}

interface JournalEntry {
  id: string;
  text: string;
  date: string;
  rating: number;
}

export default function CardDetail({ card, onClose }: CardDetailProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [journalText, setJournalText] = useState('');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [activeRating, setActiveRating] = useState(5);

  // Audio synthesis references
  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundNodesRef = useRef<any[]>([]);

  // Load journal entries from localStorage when card loads
  useEffect(() => {
    if (!card) return;
    const key = `journal-${card.id}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      setJournalEntries(JSON.parse(stored));
    } else {
      setJournalEntries([]);
    }
    // Stop audio whenever card changes
    stopAudio();
  }, [card]);

  // Handle Audio Synthesis based on Theme
  const startAudio = () => {
    if (!card) return;
    try {
      // Create new audio context
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;
      soundNodesRef.current = [];

      const masterVolume = ctx.createGain();
      masterVolume.gain.setValueAtTime(0.3, ctx.currentTime);
      masterVolume.connect(ctx.destination);
      soundNodesRef.current.push(masterVolume);

      if (card.id === 'cyberpunk-tokyo') {
        // Synthesizing Neon Rain (Pink noise + LowPass resonance filter for rain drops)
        // Rain Noise Node
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        
        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, ctx.currentTime);

        const rainVolume = ctx.createGain();
        rainVolume.gain.setValueAtTime(0.12, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(rainVolume);
        rainVolume.connect(masterVolume);
        
        whiteNoise.start();
        soundNodesRef.current.push(whiteNoise, filter, rainVolume);

        // Slow cyber pad chord synth
        const freqs = [110, 165, 220, 275]; // Cyber Minor pad
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const pGain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          
          const pFilter = ctx.createBiquadFilter();
          pFilter.type = 'lowpass';
          pFilter.frequency.setValueAtTime(400, ctx.currentTime);

          pGain.gain.setValueAtTime(0.04 - (idx * 0.005), ctx.currentTime);
          
          // Slow pulse of filters resembles wind-swept neon
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.setValueAtTime(0.08 + idx * 0.05, ctx.currentTime);
          lfoGain.gain.setValueAtTime(150, ctx.currentTime);

          lfo.connect(lfoGain);
          lfoGain.connect(pFilter.frequency);
          
          osc.connect(pFilter);
          pFilter.connect(pGain);
          pGain.connect(masterVolume);

          lfo.start();
          osc.start();
          soundNodesRef.current.push(osc, pFilter, pGain, lfo, lfoGain);
        });

      } else if (card.id === 'arctic-lights' || card.id === 'nebula-observatory') {
        // Synthesizing cosmic aurora/galactic space pad nodes (Slowing sine wave pad chords with phase detuning)
        const fundamental = card.id === 'arctic-lights' ? 98 : 73; // Low G / D
        const cosmicNotes = [1, 1.5, 2, 2.5, 3]; // Harmonics
        
        cosmicNotes.forEach((harmonic, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(fundamental * harmonic + (Math.random() * 2), ctx.currentTime);
          
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(500, ctx.currentTime);

          // Deep cosmic swell curves
          gain.gain.setValueAtTime(0.002, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.06 - idx * 0.01, ctx.currentTime + 3);

          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.setValueAtTime(0.05 + (idx * 0.02), ctx.currentTime);
          lfoGain.gain.setValueAtTime(0.015, ctx.currentTime);

          lfo.connect(lfoGain);
          lfoGain.connect(gain.gain);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(masterVolume);

          lfo.start();
          osc.start();
          soundNodesRef.current.push(osc, gain, filter, lfo, lfoGain);
        });
      } else if (card.id === 'deep-reef') {
        // Synthesizing soothing underwater bubble swells (Ocean wave simulation)
        const waveLfo = ctx.createOscillator();
        const waveGain = ctx.createGain();
        waveLfo.type = 'sine';
        waveLfo.frequency.setValueAtTime(0.12, ctx.currentTime); // 8 second cycle

        const waveOsc = ctx.createOscillator();
        const bFilter = ctx.createBiquadFilter();
        bFilter.type = 'lowpass';
        bFilter.frequency.setValueAtTime(250, ctx.currentTime);

        waveOsc.type = 'triangle';
        waveOsc.frequency.setValueAtTime(55, ctx.currentTime); // Low sub drone

        waveGain.gain.setValueAtTime(0.05, ctx.currentTime);
        waveLfo.connect(waveGain.gain);

        waveOsc.connect(bFilter);
        bFilter.connect(waveGain);
        waveGain.connect(masterVolume);

        waveLfo.start();
        waveOsc.start();
        soundNodesRef.current.push(waveLfo, waveGain, waveOsc, bFilter);

        // Occasional relaxing marine high chime bubble drops
        const triggerBubble = () => {
          if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
          const osc = ctx.createOscillator();
          const bubbleGain = ctx.createGain();
          
          osc.type = 'sine';
          // high pitch chime bubbles
          osc.frequency.setValueAtTime(500 + Math.random() * 800, ctx.currentTime);
          bubbleGain.gain.setValueAtTime(0.001, ctx.currentTime);
          bubbleGain.gain.exponentialRampToValueAtTime(0.02, ctx.currentTime + 0.1);
          bubbleGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
          
          osc.connect(bubbleGain);
          bubbleGain.connect(masterVolume);
          osc.start();
          osc.stop(ctx.currentTime + 1.5);
        };

        const bubbleTimer = setInterval(triggerBubble, 3000);
        soundNodesRef.current.push({ stop: () => clearInterval(bubbleTimer) });

      } else {
        // Default Forest Zen or Desert Sunset wind (Filtered white noise wind rustle)
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const source = ctx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        const bandpass = ctx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.Q.setValueAtTime(2.5, ctx.currentTime);
        bandpass.frequency.setValueAtTime(350, ctx.currentTime);

        // Wind speed LFO modulatation
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.15, ctx.currentTime);
        lfoGain.gain.setValueAtTime(150, ctx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(bandpass.frequency);

        const vol = ctx.createGain();
        vol.gain.setValueAtTime(0.09, ctx.currentTime);

        source.connect(bandpass);
        bandpass.connect(vol);
        vol.connect(masterVolume);

        lfo.start();
        source.start();
        soundNodesRef.current.push(source, bandpass, lfo, lfoGain, vol);

        // Ambient chime bell bells occasionally
        const triggerChime = () => {
          if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(329.63, ctx.currentTime); // E4
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(332, ctx.currentTime); // Detuned

          gain.gain.setValueAtTime(0.015, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(masterVolume);

          osc1.start();
          osc1.stop(ctx.currentTime + 3);
          osc2.start();
          osc2.stop(ctx.currentTime + 3);
        };

        const chimeTimer = setInterval(triggerChime, 6000);
        soundNodesRef.current.push({ stop: () => clearInterval(chimeTimer) });
      }

      setIsPlaying(true);

    } catch (err) {
      console.warn('Web Audio synthesis not supported in this iframe window', err);
    }
  };

  const stopAudio = () => {
    setIsPlaying(false);
    soundNodesRef.current.forEach(node => {
      try {
        if (typeof node.stop === 'function') {
          node.stop();
        } else {
          node.disconnect();
        }
      } catch (e) {}
    });
    soundNodesRef.current = [];
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
  };

  const toggleAmbientAudio = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  // Save new Journal memory
  const addJournalEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!card || !journalText.trim()) return;

    const newEntry: JournalEntry = {
      id: Math.random().toString(),
      text: journalText,
      date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      rating: activeRating,
    };

    const updated = [newEntry, ...journalEntries];
    setJournalEntries(updated);
    localStorage.setItem(`journal-${card.id}`, JSON.stringify(updated));
    setJournalText('');
  };

  const deleteEntry = (id: string) => {
    if (!card) return;
    const updated = journalEntries.filter(item => item.id !== id);
    setJournalEntries(updated);
    localStorage.setItem(`journal-${card.id}`, JSON.stringify(updated));
  };

  if (!card) return null;

  return (
    <motion.div
      id="detail-modal-root"
      className="fixed inset-0 z-50 overflow-y-auto bg-zinc-200/85 flex justify-center items-start md:items-center p-0 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        id="detail-card-panel"
        className="relative w-full max-w-4xl bg-white text-zinc-800 min-h-screen md:min-h-0 md:rounded-3xl overflow-hidden border border-zinc-200 flex flex-col md:grid md:grid-cols-12"
        initial={{ scale: 0.95, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 15 }}
        transition={{ type: 'spring', duration: 0.4 }}
      >
        {/* Close Button Pin */}
        <button
          id="detail-close-btn"
          onClick={() => { stopAudio(); onClose(); }}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-white/90 border border-zinc-200 text-zinc-700 hover:bg-zinc-100 transition active:scale-95 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT PANEL: Splendid Immersive View (cols-5) */}
        <div className="relative md:col-span-5 h-[280px] md:h-[620px] bg-zinc-900 flex flex-col overflow-hidden">
          <img
            src={card.image}
            alt={card.title}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Shaded ambient layouts overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1014] via-[#0e1014]/40 to-black/20" />
          
          <div className="absolute bottom-6 left-6 right-6">
            <span 
              className="text-[10px] font-mono tracking-widest px-2.5 py-1 rounded-full bg-black/60 border border-white/10 uppercase"
              style={{ color: card.color }}
            >
              {card.category}
            </span>
            <h2 className="text-3xl md:text-4xl font-black mt-3 text-white tracking-tight">
              {card.title}
            </h2>
            <p className="text-sm font-mono text-zinc-300 mt-1 uppercase tracking-wide flex items-center gap-1.5">
              <MapPin className="w-4 h-4" style={{ color: card.color }} />
              {card.coordinates}
            </p>
          </div>
        </div>

        {/* RIGHT PANEL: Details, Soundscape Synthesis, and Journal Entries (cols-7) */}
        <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between max-h-[620px] overflow-y-auto">
          <div>
            {/* Ambient storytelling */}
            <h3 className="text-xs font-mono tracking-widest text-zinc-500 uppercase mb-2">Narrative</h3>
            <p className="text-zinc-300 leading-relaxed text-sm whitespace-pre-line mb-6 italic">
              " {card.description} "
            </p>

            {/* Grid of customized metrics */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {card.stats.map((st, i) => (
                <div 
                  key={i} 
                  className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 flex flex-col justify-between"
                >
                  <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500">{st.label}</span>
                  <span className="text-base font-bold text-zinc-700 mt-1.5 font-sans">
                    {st.value}
                  </span>
                </div>
              ))}
            </div>

            {/* REAL-TIME SOUNDSCAPE SYNTHESIS BOARD */}
            <div className="relative border border-zinc-200 bg-zinc-50 rounded-2xl p-4.5 mb-6 flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between mb-4 z-10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-yellow-500 inline" /> Soundscapes
                  </span>
                  <p className="text-xs font-semibold text-zinc-400 mt-0.5 mt-1 font-mono">{card.soundAmbient}</p>
                </div>

                <button 
                  id="ambient-play-btn"
                  onClick={toggleAmbientAudio}
                  className="px-4.5 py-2.5 rounded-full text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer select-none border"
                  style={{ 
                    backgroundColor: isPlaying ? 'transparent' : card.color,
                    borderColor: isPlaying ? `${card.color}80` : 'transparent',
                     color: isPlaying ? card.color : '#ffffff'
                  }}
                >
                  {isPlaying ? (
                    <>
                      <Square className="w-3 h-3 fill-current" /> STOP AMBIENT
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" /> PLAY COZINESS
                    </>
                  )}
                </button>
              </div>

              {/* Reactive Equalizer Display */}
              <div className="flex items-end justify-between h-9 px-1 gap-1 border-t border-zinc-200 pt-3 z-10 select-none">
                <span className="text-[9px] font-mono text-zinc-600">Synth Level: 300Hz</span>
                <div className="flex items-end gap-1 overflow-hidden h-7">
                  {Array.from({ length: 18 }).map((_, idx) => (
                    <motion.div
                      key={idx}
                      className="w-1.5 rounded-t-sm"
                      style={{ 
                        backgroundColor: card.color,
                        opacity: isPlaying ? 1 - (idx * 0.03) : 0.15
                      }}
                      animate={isPlaying ? {
                        height: [12, 28, 16, 24, 8, 20, 14, 26, 10, 18, 12, 24, 16, 28, 8, 20, 12, 16][idx % 18]
                      } : {
                        height: 4
                      }}
                      transition={isPlaying ? {
                        duration: 0.6 + (idx * 0.04) % 0.4,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      } : {
                        duration: 0.2
                      }}
                    />
                  ))}
                </div>
                <span className="text-[9px] font-mono text-zinc-600">Spatial</span>
              </div>
            </div>

            {/* TRAVELER JOURNAL LOG */}
            <div className="mt-2 text-zinc-700">
              <div className="flex items-center gap-2 mb-3">
                <PenTool className="w-4 h-4" style={{ color: card.color }} />
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">Expedition Journal & Memo</h4>
              </div>

              {/* Write new entry */}
              <form onSubmit={addJournalEntry} className="flex flex-col gap-2.5 bg-zinc-50 p-3.5 rounded-xl border border-zinc-200 mb-4">
                <textarea
                  id="entry-textarea"
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value)}
                  placeholder="Record your thoughts or journal your fantasy about this destination..."
                  rows={2}
                  className="w-full bg-white border border-zinc-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-zinc-400 resize-none text-zinc-700"
                />

                <div className="flex items-center justify-between mt-1">
                  {/* Custom Star Scale */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-zinc-500 font-mono">My Rating:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          id={`star-btn-${star}`}
                          onClick={() => setActiveRating(star)}
                          className="text-xs tracking-tight p-0.5 hover:scale-110 active:scale-90 text-yellow-400 focus:outline-none cursor-pointer"
                        >
                          ★{star <= activeRating ? '' : '☆'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="submit-journal-btn"
                    className="px-4 py-1.5 rounded-md text-[11px] font-mono tracking-wider font-bold transition flex items-center gap-1 bg-zinc-700 text-white hover:bg-zinc-600 cursor-pointer"
                  >
                    <Send className="w-3 h-3" /> SAVE JOURNAL
                  </button>
                </div>
              </form>

              {/* Display existing journal items */}
              <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
                {journalEntries.length === 0 ? (
                  <p className="text-zinc-500 font-mono text-[11px] text-center py-4 bg-zinc-50 rounded-xl border border-dashed border-zinc-300">
                    No logs recorded. Be the first explorer to record coordinates and mood!
                  </p>
                ) : (
                  journalEntries.map((item) => (
                    <motion.div
                      key={item.id}
                      className="bg-zinc-50 p-3 rounded-lg border border-zinc-200 group flex items-start justify-between"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-yellow-400 text-xs font-mono">
                            {'★'.repeat(item.rating)}
                          </span>
                          <span className="text-[9px] text-zinc-600 font-mono">
                            {item.date}
                          </span>
                        </div>
                        <p className="text-zinc-700 text-xs leading-normal font-sans break-words whitespace-pre-wrap">
                          {item.text}
                        </p>
                      </div>

                      <button
                        onClick={() => deleteEntry(item.id)}
                        className="p-1 rounded text-zinc-500 hover:text-rose-500 hover:bg-zinc-100 transition flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Delete Journal Entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
