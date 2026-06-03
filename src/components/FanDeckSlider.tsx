import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Eye } from 'lucide-react';
import { CardItem } from '../types';

interface FanDeckSliderProps {
  cards: CardItem[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  onSelectCard: (card: CardItem) => void;
}

export default function FanDeckSlider({
  cards,
  activeIndex,
  setActiveIndex,
  onSelectCard,
}: FanDeckSliderProps) {

  // Auto scroll/slide left-right handlers
  const handlePrev = () => {
    setActiveIndex((activeIndex - 1 + cards.length) % cards.length);
  };

  const handleNext = () => {
    setActiveIndex((activeIndex + 1) % cards.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

  return (
    <div 
      id="fan-deck-container"
      className="relative w-full h-[450px] md:h-[550px] flex flex-col justify-between items-center overflow-hidden"
    >
      {/* Dynamic ambient backdrop light */}
      <div 
        className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full blur-[140px] opacity-25 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${cards[activeIndex].color} 0%, rgba(0,0,0,0) 80%)`
        }}
      />

      {/* Fan spread arena */}
      <div className="relative flex-1 w-full flex items-center justify-center -mt-10 overflow-visible">
        <div className="relative w-full max-w-[800px] h-[340px] md:h-[400px] flex items-end justify-center perspective-[1200px]">
          
          {cards.map((card, idx) => {
            const distance = idx - activeIndex;
            const isCenter = idx === activeIndex;

            // Arced alignment calculations
            const angle = distance * 11; // Rotates card outward as distance increases
            const translateX = distance * 85; // Spaces cards along x axis
            const translateY = Math.abs(distance) * 16; // Curves card cluster downwards
            const translateZ = -Math.abs(distance) * 35; // Drops far cards back in 3D depth

            return (
              <motion.div
                key={card.id}
                id={`fan-card-${card.id}`}
                className="absolute bottom-8 w-[180px] md:w-[220px] h-[270px] md:h-[330px] rounded-2xl overflow-hidden border cursor-pointer origin-bottom transition-all"
                style={{
                  zIndex: 20 - Math.abs(distance),
                  backgroundColor: '#111318',
                  borderColor: isCenter ? `${card.color}60` : 'rgba(255,255,255,0.06)',
                  boxShadow: isCenter
                    ? `0 20px 45px -10px ${card.color}35, 0 4px 15px -4px ${card.color}15, Outset 0 1px 1px rgba(255,255,255,0.15)`
                    : '0 8px 16px -4px rgba(0,0,0,0.4)',
                }}
                animate={{
                  x: translateX,
                  y: translateY,
                  rotateZ: angle,
                  z: translateZ,
                  scale: isCenter ? 1.05 : 0.82,
                  opacity: Math.abs(distance) > 3 ? 0 : 1 - Math.abs(distance) * 0.18,
                }}
                whileHover={{
                  y: translateY - 35,
                  scale: isCenter ? 1.08 : 0.88,
                  transition: { type: 'spring', stiffness: 450, damping: 20 }
                }}
                transition={{
                  type: 'spring',
                  stiffness: 280,
                  damping: 24,
                  mass: 0.9
                }}
                onClick={() => {
                  if (isCenter) {
                    onSelectCard(card);
                  } else {
                    setActiveIndex(idx);
                  }
                }}
              >
                {/* Hero image preview */}
                <div className="relative h-[65%] w-full bg-zinc-900 overflow-hidden pointer-events-none">
                  <img
                    src={card.image}
                    alt={card.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-transparent" />
                  
                  {isCenter && (
                    <motion.div 
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-white"
                      animate={{ scale: [0.95, 1.05, 0.95] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                    </motion.div>
                  )}
                </div>

                {/* Card summary text block */}
                <div className="p-4 h-[35%] bg-[#111318] flex flex-col justify-between pointer-events-none">
                  <div>
                    <h3 className="font-bold text-sm md:text-base text-zinc-100 truncate">
                      {card.title}
                    </h3>
                    <p className="text-[10px] text-zinc-400 truncate font-mono">
                      {card.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-2 text-[8px] font-mono text-zinc-500">
                    <span>{card.category}</span>
                    <span 
                      className="transition-colors uppercase" 
                      style={{ color: isCenter ? card.color : '#8e8e93' }}
                    >
                      EXPLORE
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Sliding dots navigation bar */}
      <div className="flex items-center justify-center gap-1.5 p-2 bg-zinc-950/40 rounded-full border border-white/5 backdrop-blur-md px-6">
        {cards.map((card, idx) => (
          <button
            key={card.id}
            onClick={() => setActiveIndex(idx)}
            className="group p-1.5 focus:outline-none cursor-pointer"
          >
            <div 
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-6' : 'w-1.5 group-hover:bg-zinc-400'}`}
              style={{
                backgroundColor: idx === activeIndex ? cards[activeIndex].color : '#52525b'
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
