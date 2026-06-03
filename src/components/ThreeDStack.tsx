import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'motion/react';
import { Shuffle, Layers } from 'lucide-react';
import { CardItem } from '../types';

interface ThreeDStackProps {
  cards: CardItem[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  onSelectCard: (card: CardItem) => void;
}

export default function ThreeDStack({
  cards,
  activeIndex,
  setActiveIndex,
  onSelectCard,
}: ThreeDStackProps) {
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);
  const [swiping, setSwiping] = useState(false);

  // Motion values for physical dragging of the TOP card
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  
  // Transform drag values to styling rotation and opacity
  const rotateOutput = useTransform(dragX, [-200, 200], [-25, 25]);
  const opacityOutput = useTransform(dragX, [-200, -100, 0, 100, 200], [0.5, 0.9, 1, 0.9, 0.5]);
  const glowOutput = useTransform(dragX, [-200, 0, 200], ['0px', '4px', '0px']);

  const topCard = cards[activeIndex];
  const nextCard1 = cards[(activeIndex + 1) % cards.length];
  const nextCard2 = cards[(activeIndex + 2) % cards.length];

  const handleNext = (dir: 'left' | 'right') => {
    if (swiping) return;
    setSwiping(true);
    setExitDirection(dir);

    // Wait for fly animation, then step activeIndex to next item
    setTimeout(() => {
      setActiveIndex((activeIndex + 1) % cards.length);
      setExitDirection(null);
      dragX.set(0);
      dragY.set(0);
      setSwiping(false);
    }, 400);
  };

  // Automated "촤라라락" dealer simulation
  const burstShuffle = () => {
    let count = 0;
    const interval = setInterval(() => {
      handleNext(Math.random() > 0.5 ? 'right' : 'left');
      count++;
      if (count >= 4) {
        clearInterval(interval);
      }
    }, 250);
  };

  // DragEnd physical swiping trigger
  const handleDragEnd = (_: any, info: any) => {
    const swipeThreshold = 140;
    if (info.offset.x > swipeThreshold) {
      handleNext('right');
    } else if (info.offset.x < -swipeThreshold) {
      handleNext('left');
    } else {
      // Return to center
      dragX.set(0);
      dragY.set(0);
    }
  };

  return (
    <div 
      id="stack-container"
      className="relative w-full h-[450px] md:h-[550px] flex flex-col justify-between items-center select-none overflow-hidden"
    >
      {/* Background radial glow matching the front card */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[340px] rounded-full blur-[130px] opacity-20 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${topCard.color} 0%, rgba(0,0,0,0) 70%)`
        }}
      />

      {/* Main card viewport */}
      <div className="relative flex-1 w-full max-w-[310px] md:max-w-[350px] mt-4 flex items-center justify-center">
        <div className="relative w-full h-[360px] md:h-[420px] pb-4">
          
          {/* Card 3 (Bottom-most represented stack card) */}
          <motion.div
            className="absolute inset-x-0 top-0 h-full rounded-3xl bg-[#111318] border border-white/5 shadow-lg select-none pointer-events-none origin-bottom opacity-40 flex flex-col overflow-hidden"
            animate={{
              y: 20,
              scale: 0.88,
              rotate: -2,
              z: -30
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="flex-1 bg-zinc-900 overflow-hidden relative">
              <img src={nextCard2.image} referrerPolicy="no-referrer" alt="" className="w-full h-full object-cover opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-transparent" />
            </div>
            <div className="p-5 h-24 bg-[#111318]" />
          </motion.div>

          {/* Card 2 (Middle stack card) */}
          <motion.div
            className="absolute inset-x-0 top-0 h-full rounded-3xl bg-[#111318] border border-white/5 shadow-xl select-none pointer-events-none origin-bottom opacity-75 flex flex-col overflow-hidden"
            animate={{
              y: 10,
              scale: 0.94,
              rotate: 3,
              z: -15
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="flex-1 bg-zinc-900 overflow-hidden relative">
              <img src={nextCard1.image} referrerPolicy="no-referrer" alt="" className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-transparent" />
            </div>
            <div className="p-5 h-24 bg-[#111318]" />
          </motion.div>

          {/* Card 1 (Active/Top drag-ready card) */}
          <AnimatePresence mode="popLayout">
            {!exitDirection && (
              <motion.div
                key={activeIndex}
                id={`stack-top-${topCard.id}`}
                className="absolute inset-x-0 top-0 h-full rounded-3xl bg-[#111318] border border-white/10 shadow-2xl flex flex-col overflow-hidden cursor-grab active:cursor-grabbing origin-center select-none"
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                onDragEnd={handleDragEnd}
                style={{
                  x: dragX,
                  y: dragY,
                  rotate: rotateOutput,
                  opacity: opacityOutput,
                  boxShadow: `0 20px 40px -10px ${topCard.color}20, 0 0 15px -2px ${topCard.color}15, Inset 0 1px 1px rgba(255,255,255,0.15)`
                }}
                exit={{
                  x: exitDirection === 'left' ? -380 : 380,
                  rotate: exitDirection === 'left' ? -35 : 35,
                  opacity: 0,
                  transition: { duration: 0.35, ease: 'easeOut' }
                }}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => {
                  if (Math.abs(dragX.get()) < 10) {
                    onSelectCard(topCard);
                  }
                }}
              >
                {/* Visual Header Image */}
                <div className="relative flex-1 bg-zinc-900 overflow-hidden pointer-events-none">
                  <img
                    src={topCard.image}
                    alt={topCard.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-[#111318]/10 to-transparent" />
                  
                  {/* Category overlay label */}
                  <div className="absolute top-4 left-4 flex gap-1.5 items-center bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/5 text-[11px] font-mono tracking-wider uppercase"
                    style={{ color: topCard.color }}>
                    <Layers className="w-3   h-3" />
                    {topCard.category}
                  </div>
                </div>

                {/* Body details */}
                <div className="p-5 md:p-6 bg-[#111318] flex flex-col justify-between pointer-events-none">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-0.5">
                      {topCard.title}
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: topCard.color }} />
                      {topCard.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 mt-4 pt-3 text-zinc-500 font-mono text-[10px]">
                    <span className="text-zinc-400">{topCard.coordinates}</span>
                    <span className="text-xs px-2.5 py-0.5 bg-zinc-950/80 rounded-md border border-white/10" style={{ color: topCard.color }}>
                      TAP TO UNVEIL
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Control bar */}
      <div className="flex items-center justify-center gap-4 mt-2 mb-1 z-10">
        <button
          id="throw-left-btn"
          onClick={() => handleNext('left')}
          disabled={swiping}
          className="px-5 py-2.5 rounded-full bg-zinc-900 border border-white/5 text-zinc-400 hover:text-rose-400 hover:border-zinc-800 transition-all flex items-center gap-1.5 active:scale-95 text-xs font-mono cursor-pointer disabled:opacity-30"
        >
          ← SWIPE LEFT
        </button>

        <button
          id="burst-shuffle-btn"
          onClick={burstShuffle}
          disabled={swiping}
          title="Dynamic Dealer Shuffling Action"
          className="p-3.5 rounded-full bg-zinc-900 border border-white/10 text-white hover:bg-zinc-800 transition-all flex items-center justify-center active:rotate-180 duration-500 cursor-pointer shadow-lg disabled:opacity-30"
        >
          <Shuffle className="w-4 h-4 text-emerald-400" />
        </button>

        <button
          id="throw-right-btn"
          onClick={() => handleNext('right')}
          disabled={swiping}
          className="px-5 py-2.5 rounded-full bg-zinc-900 border border-white/5 text-zinc-400 hover:text-emerald-400 hover:border-zinc-800 transition-all flex items-center gap-1.5 active:scale-95 text-xs font-mono cursor-pointer disabled:opacity-30"
        >
          SWIPE RIGHT →
        </button>
      </div>

      <p className="text-zinc-600 text-[11px] font-mono select-none text-center">
        💡 Use left/right arrow keys or drag/flick to shuffle cards organically
      </p>
    </div>
  );
}
