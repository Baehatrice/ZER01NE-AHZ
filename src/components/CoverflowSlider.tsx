import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Share2, Compass, Heart } from 'lucide-react';
import { CardItem } from '../types';

interface CoverflowSliderProps {
  cards: CardItem[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  onSelectCard: (card: CardItem) => void;
}

export default function CoverflowSlider({
  cards,
  activeIndex,
  setActiveIndex,
  onSelectCard,
}: CoverflowSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragStartX, setDragStartX] = useState<number | null>(null);

  const handleNext = () => {
    setActiveIndex((activeIndex + 1) % cards.length);
  };

  const handlePrev = () => {
    setActiveIndex((activeIndex - 1 + cards.length) % cards.length);
  };

  // Drag handlers
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragStartX(clientX);
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (dragStartX === null) return;
    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const diff = dragStartX - clientX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    setDragStartX(null);
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

  return (
    <div 
      id="coverflow-container"
      className="relative w-full h-[450px] md:h-[550px] flex flex-col justify-between items-center select-none overflow-hidden"
      ref={containerRef}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchEnd={handleDragEnd}
    >
      {/* Dynamic light reflection background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] rounded-full blur-[140px] opacity-25 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${cards[activeIndex].color} 0%, rgba(0,0,0,0) 70%)`
        }}
      />

      {/* Grid of fanning cards */}
      <div className="relative w-full flex-1 flex justify-center items-center perspective-[1000px] -mt-4">
        <div className="relative w-full max-w-[320px] md:max-w-[380px] h-[360px] md:h-[440px] flex justify-center items-center">
          {cards.map((card, idx) => {
            const offset = idx - activeIndex;
            const isCenter = idx === activeIndex;
            
            // Standard perspective calculations
            let x = 0;
            let rotateY = 0;
            let z = 0;
            let scale = 1;
            let opacity = 1;

            if (offset === 0) {
              x = 0;
              rotateY = 0;
              z = 100;
              scale = 1.05;
              opacity = 1;
            } else if (offset < 0) {
              // Left cards
              const factor = Math.abs(offset);
              x = offset * 120 - 40;
              rotateY = 38;
              z = -50 * factor;
              scale = 0.85 - factor * 0.05;
              opacity = Math.max(0.2, 0.9 - factor * 0.25);
            } else {
              // Right cards
              const factor = Math.abs(offset);
              x = offset * 120 + 40;
              rotateY = -38;
              z = -50 * factor;
              scale = 0.85 - factor * 0.05;
              opacity = Math.max(0.2, 0.9 - factor * 0.25);
            }

            // Wrap around visual tweaks
            // If card is too far away, fade it out
            if (Math.abs(offset) > 3) {
              opacity = 0;
            }

            return (
              <motion.div
                key={card.id}
                id={`card-${card.id}`}
                className="absolute w-full h-full cursor-pointer rounded-3xl overflow-hidden shadow-2xl origin-center flex flex-col border border-white/10 shrink-0"
                style={{
                  zIndex: 10 - Math.abs(offset),
                  backgroundColor: '#111318',
                  boxShadow: isCenter 
                    ? `0 25px 50px -12px ${card.color}25, 0 0 20px 0px ${card.color}15,Inset 0 1px 1px rgba(255,255,255,0.15)`
                    : '0 10px 25px -5px rgba(0,0,0,0.5)',
                }}
                animate={{
                  x,
                  rotateY,
                  z,
                  scale,
                  opacity,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 280,
                  damping: 26,
                  mass: 0.8
                }}
                onClick={() => {
                  if (isCenter) {
                    onSelectCard(card);
                  } else {
                    setActiveIndex(idx);
                  }
                }}
              >
                {/* Hero Card Image */}
                <div className="relative flex-1 bg-zinc-900 overflow-hidden pointer-events-none">
                  <img
                    src={card.image}
                    alt={card.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  {/* Subtle Top Ambient Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-[#111318]/20 to-transparent" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-4 left-4 flex gap-1.5 items-center bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/5 text-[11px] font-mono tracking-wider uppercase"
                    style={{ color: card.color }}>
                    <Compass className="w-3 h-3 animate-spin duration-1000" style={{ animationDuration: '6s' }} />
                    {card.category}
                  </div>
                </div>

                {/* Card footer description */}
                <div className="p-5 md:p-6 flex flex-col justify-between bg-[#111318] pointer-events-none">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-1 font-sans">
                      {card.title}
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: card.color }} />
                      {card.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 mt-4 pt-3.5 text-zinc-500 font-mono text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <Heart className="w-3 h-3 text-zinc-600 group-hover:text-rose-500" />
                      <span>{card.coordinates}</span>
                    </div>
                    <span 
                      className="px-2 py-0.5 rounded-sm border bg-[#171923]"
                      style={{ 
                        borderColor: `${card.color}1c`, 
                        color: card.color,
                        boxShadow: `0 0 8px ${card.color}0c`
                      }}
                    >
                      OPEN CARD
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons for precision click */}
      <div className="flex items-center justify-center gap-6 mt-2 relative z-10 w-full px-8">
        <button
          id="prev-btn"
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          className="p-3.5 rounded-full bg-zinc-900 border border-white/5 hover:border-white/20 text-zinc-400 hover:text-white transition-all hover:bg-zinc-800 flex items-center justify-center active:scale-90 shadow-lg cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 bg-zinc-950/60 pb-1.5 pt-1 px-4 rounded-full border border-white/5 backdrop-blur-md">
          {cards.map((_, idx) => (
            <button
              key={idx}
              id={`nav-dot-${idx}`}
              onClick={(e) => { e.stopPropagation(); setActiveIndex(idx); }}
              className="group relative p-1.5 focus:outline-none cursor-pointer"
            >
              <div 
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-5' : 'w-1.5'}`} 
                style={{ 
                  backgroundColor: idx === activeIndex ? cards[activeIndex].color : '#52525b' 
                }} 
              />
            </button>
          ))}
        </div>

        <button
          id="next-btn"
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          className="p-3.5 rounded-full bg-zinc-900 border border-white/5 hover:border-white/20 text-zinc-400 hover:text-white transition-all hover:bg-zinc-800 flex items-center justify-center active:scale-90 shadow-lg cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
