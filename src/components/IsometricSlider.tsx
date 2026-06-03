import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Compass, ChevronLeft, ChevronRight } from 'lucide-react';
import { CardItem } from '../types';
import Isometric3DObjects from './Isometric3DObjects';
import { gsap } from '../vendor/gsap';

interface IsometricSliderProps {
  cards: CardItem[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  onSelectCard: (card: CardItem) => void;
}

function interpolateColor(color1: string, color2: string, factor: number) {
  const parse = (c: string) => {
    const raw = c.replace('#', '');
    if (raw.length === 3) {
      return [
        parseInt(raw[0] + raw[0], 16),
        parseInt(raw[1] + raw[1], 16),
        parseInt(raw[2] + raw[2], 16),
      ];
    }
    return [
      parseInt(raw.substring(0, 2), 16),
      parseInt(raw.substring(2, 4), 16),
      parseInt(raw.substring(4, 6), 16),
    ];
  };
  const [r1, g1, b1] = parse(color1);
  const [r2, g2, b2] = parse(color2);
  const r = Math.round(r1 + factor * (r2 - r1));
  const g = Math.round(g1 + factor * (g2 - g1));
  const b = Math.round(b1 + factor * (b2 - b1));
  return `rgb(${r}, ${g}, ${b})`;
}

export default function IsometricSlider({
  cards,
  activeIndex,
  setActiveIndex,
  onSelectCard,
}: IsometricSliderProps) {
  const pitch = 55;
  const yaw = -14;
  const altitude = 40;
  const panelRef = useRef<HTMLDivElement>(null);
  const arenaRef = useRef<HTMLDivElement>(null);
  const [arenaWidth, setArenaWidth] = useState(960);
  const presentationStep = activeIndex === 2 ? 2 : 1;
  const horizontalSpread = Math.min(Math.max(arenaWidth * 0.62, 260), 1040);
  const leftAnchor = -horizontalSpread / 2;
  const rightAnchor = horizontalSpread / 2;

  // Define 26 visual nodes in 3D space
  const spaceNodes = React.useMemo(() => {
    const nodes = [];
    
    // Node 0: A (Real Card index 0)
    nodes.push({
      isReal: true,
      letter: 'A',
      idx: 0,
      color: '#ec4899',
      realCardIndex: 0,
      realCard: cards[0]
    });

    // Nodes 1-6: b, c, d, e, f, g (6 virtual nodes)
    const bToG = ['B', 'C', 'D', 'E', 'F', 'G'];
    bToG.forEach((letter, i) => {
      const factor = (i + 1) / 7;
      const col = interpolateColor('#ec4899', '#a3e635', factor);
      nodes.push({
        isReal: false,
        letter,
        idx: i + 1,
        color: col
      });
    });

    // Node 7: H (Real Card index 1)
    nodes.push({
      isReal: true,
      letter: 'H',
      idx: 7,
      color: '#a3e635',
      realCardIndex: 1,
      realCard: cards[1]
    });

    // Nodes 8-24: i to y (17 virtual nodes)
    const iToY = ['I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y'];
    iToY.forEach((letter, i) => {
      const factor = (i + 1) / 18;
      const col = interpolateColor('#a3e635', '#c084fc', factor);
      nodes.push({
        isReal: false,
        letter,
        idx: i + 8,
        color: col
      });
    });

    // Node 25: Z (Real Card index 2)
    nodes.push({
      isReal: true,
      letter: 'Z',
      idx: 25,
      color: '#c084fc',
      realCardIndex: 2,
      realCard: cards[2]
    });

    return nodes;
  }, [cards]);

  const handleNext = () => {
    setActiveIndex((activeIndex + 1) % cards.length);
  };

  const handlePrev = () => {
    setActiveIndex((activeIndex - 1 + cards.length) % cards.length);
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

  useEffect(() => {
    if (!arenaRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      setArenaWidth(entry.contentRect.width);
    });

    observer.observe(arenaRef.current);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (activeIndex !== 2 || !panelRef.current) return;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { overwrite: 'auto' } });

      timeline
        .from('.gsap-z-stage', {
          scale: 0.975,
          duration: 0.48,
          ease: 'power2.inOut',
        })
        .from('.gsap-z-stem-reveal', {
          scaleY: 0,
          opacity: 0,
          duration: 0.46,
          stagger: 0.022,
          ease: 'power2.out',
        }, 0.06)
        .from('.gsap-z-label-reveal', {
          y: 12,
          scale: 0.7,
          opacity: 0,
          duration: 0.42,
          stagger: 0.022,
          ease: 'back.out(1.35)',
        }, 0.18)
        .fromTo('.gsap-z-streak', {
          x: -120,
          scaleX: 0.16,
          opacity: 0,
        }, {
          x: 0,
          scaleX: 1,
          opacity: 0.55,
          duration: 0.42,
          stagger: 0.022,
          ease: 'power2.out',
        }, 0.08)
        .to('.gsap-z-streak', {
          opacity: 0,
          duration: 0.34,
          stagger: 0.012,
          ease: 'power1.out',
        }, 0.54);
    }, panelRef);

    return () => context.revert();
  }, [activeIndex]);

  return (
    <div ref={panelRef} id="isometric-canvas-panel" className="relative w-full h-[calc(100vh-48px)] min-h-[520px] flex flex-col items-center">
      
      {/* Main 3D Space Arena */}
      <div 
        ref={arenaRef}
        className="relative w-full flex-1 flex items-center justify-center overflow-hidden"
        style={{ perspective: '1800px' }}
      >
        {/* Fututistic Grid Floor with dynamic scale adjustment representing dynamic map projection details */}
        <motion.div 
          className="absolute inset-0 w-[120%] h-[120%] left-[-10%] top-[-10%] pointer-events-none opacity-[0.08]"
          animate={{
            backgroundSize: presentationStep === 1 ? '52px 52px' : '36px 36px',
          }}
          transition={{
            type: 'spring',
            stiffness: 120,
            damping: 30,
          }}
          style={{
            backgroundImage: `linear-gradient(rgba(113,113,122,0.32) 1px, transparent 1px), linear-gradient(90deg, rgba(113,113,122,0.32) 1px, transparent 1px)`,
            transform: `rotateX(${pitch}deg) rotateZ(${yaw}deg) translateZ(-160px)`
          }}
        />

        {/* Dynamic Space Platform Layer rendering cards & floating holographic elements */}
        <div 
          className="gsap-z-stage relative w-[180px] sm:w-[210px] md:w-[250px] h-[262px] sm:h-[306px] md:h-[365px] transition-transform duration-300 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${pitch}deg) rotateZ(${yaw}deg)`,
            top: 'clamp(32px, 7vh, 72px)',
          }}
        >
          {(() => {
            // Pre-calculate 3D spatial positions for all 26 nodes
            const computedNodes = spaceNodes.map((node) => {
              let tx = 0;
              let ty = 0;
              let tz = 0;
              let rotZ = 0;
              let scale = 1;
              let opacity = 1;

              const isCenter = node.isReal && node.realCardIndex === activeIndex;
              // Step 1 or 2: nodes >= 8 (I to Z) are hidden
              const isHidden = (activeIndex !== 2) && (node.idx >= 8);

              // Position engine mapping
              if (activeIndex === 0) {
                // Step 1: A and H occupy the outer anchors across the viewport.
                if (node.idx <= 7) {
                  const t = node.idx / 7;
                  tx = leftAnchor + horizontalSpread * t;
                  ty = 15 - 30 * t;
                  let baseZ = -30 + t * 45; // climb towards H
                  tz = isCenter ? baseZ + altitude : baseZ;
                  scale = node.isReal ? (isCenter ? 1.05 : 0.85) : 0.82;
                  opacity = node.isReal ? 1 : 0.45;
                } else {
                  // Offscreen right, invisible
                  tx = 450 + (node.idx - 8) * 8;
                  ty = 50;
                  tz = -350;
                  scale = 0.05;
                  opacity = 0;
                }
              } else if (activeIndex === 1) {
                // Step 2: Keep the same wide A-H arrangement while H is focused.
                if (node.idx <= 7) {
                  const t = node.idx / 7;
                  tx = leftAnchor + horizontalSpread * t;
                  ty = 20 - 30 * t;
                  let baseZ = -35 + t * 50;
                  tz = isCenter ? baseZ + altitude : baseZ;
                  scale = node.isReal ? (isCenter ? 1.05 : 0.85) : 0.82;
                  opacity = node.isReal ? 1 : 0.45;
                } else {
                  // Offscreen right, invisible
                  tx = 450 + (node.idx - 8) * 8;
                  ty = 50;
                  tz = -350;
                  scale = 0.05;
                  opacity = 0;
                }
              } else {
                // Step 3: Distribute A-Z on one continuous, evenly spaced line.
                const t = node.idx / 25;
                tx = leftAnchor + horizontalSpread * t;
                ty = 24 - 48 * t;
                const baseZ = -20 + 80 * t;
                tz = isCenter ? baseZ + altitude : baseZ;
                scale = node.isReal ? (isCenter ? 1.05 : 0.85) : 0.82;
                opacity = node.isReal ? 1 : 0.58;
              }

              const stemLength = node.isReal ? 196 : 148;

              return {
                node,
                tx,
                ty,
                tz,
                rotZ,
                scale,
                opacity,
                isCenter,
                isHidden,
                letterX: tx,
                letterY: ty,
                letterZ: tz + stemLength,
                stemLength,
              };
            });

            return (
              <>
                {activeIndex === 2 && spaceNodes.slice(8).map((node) => (
                  <div
                    key={`z-streak-${node.letter}`}
                    className="gsap-z-streak absolute h-px w-36 pointer-events-none origin-right"
                    style={{
                      left: `calc(50% + ${leftAnchor + horizontalSpread * (node.idx / 25)}px)`,
                      top: `calc(50% + ${18 - (node.idx - 8) * 2}px)`,
                      background: 'linear-gradient(90deg, transparent, #a1a1aa)',
                      transform: `translateZ(${120 + (node.idx - 8) * 5}px)`,
                    }}
                  />
                ))}

                {/* Thin guide lines linking cards to floating letters */}
                {computedNodes.map((pos) => {
                  const isHidden = pos.isHidden;
                  if (isHidden) return null;
                  return (
                    <motion.div
                      key={`tether-${pos.node.letter}`}
                      className="absolute pointer-events-none"
                      style={{
                        left: '50%',
                        top: '0',
                        width: '2px',
                        height: `${pos.stemLength}px`,
                        marginLeft: '-1px',
                        marginTop: '0',
                        transformStyle: 'preserve-3d',
                        transformOrigin: 'top center',
                      }}
                      animate={{
                        x: pos.tx,
                        y: pos.ty,
                        z: pos.tz,
                        rotateX: 90,
                      }}
                      transition={{
                        duration: 0.68,
                        ease: [0.22, 1, 0.36, 1],
                        delay: (activeIndex === 2 && pos.node.idx >= 8) ? (pos.node.idx - 7) * 0.022 : 0,
                      }}
                    >
                      <div
                        className={`h-full w-full origin-top ${pos.node.idx >= 8 ? 'gsap-z-stem-reveal' : ''}`}
                        style={{
                          background: 'linear-gradient(to top, rgba(113, 113, 122, 0.08), rgba(82, 82, 91, 0.84))',
                          opacity: pos.node.isReal ? 0.92 : 0.55,
                        }}
                      />
                    </motion.div>
                  );
                })}

                {/* 3. Floating 3D Holographic letters directly above cards */}
                {computedNodes.map((pos) => {
                  const isHidden = pos.isHidden;
                  if (isHidden) return null;
                  const isReal = pos.node.isReal;
                  const circleSize = isReal ? 64 : 36;
                  const fontSize = isReal ? 'text-2xl' : 'text-[11px]';
                  return (
                    <motion.div
                      key={`floating-letter-${pos.node.letter}`}
                      className="absolute pointer-events-none select-none flex items-center justify-center z-50"
                      style={{
                        left: '50%',
                        top: '0',
                        width: `${circleSize}px`,
                        height: `${circleSize}px`,
                        marginLeft: `-${circleSize / 2}px`,
                        marginTop: `-${circleSize / 2}px`,
                        transformStyle: 'preserve-3d',
                      }}
                      animate={{
                        x: pos.tx,
                        y: pos.ty,
                        z: pos.letterZ,
                        rotateX: -90,
                        rotateY: 0,
                        rotateZ: pos.rotZ,
                        scale: isReal ? (pos.isCenter ? 1.25 : 0.9) : 0.8,
                      }}
                      transition={{
                        duration: 0.62,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {/* Pulsing Holo Ring */}
                      <div
                        className={`absolute inset-0 rounded-full border flex items-center justify-center bg-white/95 ${pos.node.idx >= 8 ? 'gsap-z-label-reveal' : ''}`}
                        style={{
                          borderColor: isReal ? '#a1a1aa' : '#d4d4d8',
                          borderWidth: isReal ? '2px' : '1px',
                        }}
                      >
                        <span 
                          className={`${fontSize} font-black font-mono text-zinc-700 select-none pointer-events-none`}
                        >
                          {pos.node.letter}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}

                {/* 4. Underling standard functional & virtual 3D Cards */}
                {computedNodes.map((pos) => {
                  const node = pos.node;
                  const isHidden = pos.isHidden;

                  if (node.isReal) {
                    const card = node.realCard!;
                    const distance = node.realCardIndex! - activeIndex;
                    const isCenter = pos.isCenter;

                    return (
                      <motion.div
                        key={card.id}
                        id={`isometric-card-${card.id}`}
                        className="absolute inset-x-0 inset-y-0 rounded-[36deg] border bg-white flex flex-col justify-between cursor-pointer overflow-visible"
                        style={{
                          transformStyle: 'preserve-3d',
                          zIndex: 50 - Math.abs(distance),
                          borderColor: isCenter ? '#a1a1aa' : '#e4e4e7',
                          pointerEvents: isHidden ? 'none' : 'auto',
                        }}
                        animate={{
                          x: pos.tx,
                          y: pos.ty,
                          z: pos.tz,
                          rotateZ: pos.rotZ,
                          scale: pos.scale,
                          opacity: isHidden ? 0 : pos.opacity,
                        }}
                        whileHover={isHidden ? undefined : {
                          z: pos.tz + 30,
                          scale: pos.scale * 1.02,
                          transition: { type: 'spring', stiffness: 400, damping: 15 }
                        }}
                        transition={{
                          duration: 0.68,
                          ease: [0.22, 1, 0.36, 1],
                          delay: (activeIndex === 2 && node.idx >= 8) ? (node.idx - 7) * 0.022 : 0,
                        }}
                        onClick={() => {
                          if (isCenter) {
                            onSelectCard(card);
                          } else {
                            setActiveIndex(node.realCardIndex!);
                          }
                        }}
                      >
                        {/* 3D Holographic Image Plate */}
                        <div className="relative h-[62%] bg-zinc-100 rounded-t-[36deg] overflow-hidden pointer-events-none">
                          <img
                            src={card.image}
                            alt={card.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover select-none"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/70" />

                          {/* Category Stamp */}
                          <div className="absolute top-4 left-4 flex gap-1.5 items-center bg-white/90 px-3 py-1 rounded-full border border-zinc-200 text-[10px] font-mono tracking-wider uppercase"
                            style={{ color: card.color }}>
                            <Compass className="w-3 h-3" />
                            {card.category}
                          </div>
                        </div>

                        {/* Highly immersive 3D Procedural Objects pop out perpendicular to card floor */}
                        <Isometric3DObjects cardId={card.id} color={card.color} isActive={isCenter} />

                        {/* Info Text panel */}
                        <div className="p-5 h-[38%] bg-white flex flex-col justify-between pointer-events-none select-none">
                          <div>
                            <h3 className="text-lg font-bold tracking-tight text-zinc-800 font-sans leading-tight">
                              {card.title}
                            </h3>
                            <p className="text-[11px] text-zinc-500 font-mono mt-0.5 truncate uppercase tracking-tight">
                              {card.subtitle}
                            </p>
                          </div>

                          <div className="flex items-center justify-between border-t border-zinc-200 pt-3.5 text-[9px] font-mono text-zinc-500">
                            <span className="truncate max-w-[130px]">{card.coordinates}</span>
                            <span className="font-extrabold uppercase shrink-0 text-zinc-500">
                              EXPLORE ↗
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  } else {
                    // Virtual intermediate card elements (styled as elegant full-size shingled deck cards)
                    return (
                      <motion.div
                        key={`virtual-card-${node.letter}`}
                        className="absolute inset-x-0 inset-y-0 rounded-[36deg] border pointer-events-none"
                        style={{
                          transformStyle: 'preserve-3d',
                          zIndex: 10 + node.idx,
                          borderColor: '#e4e4e7',
                          backgroundColor: 'rgba(255, 255, 255, 0.78)',
                        }}
                        animate={{
                          x: pos.tx,
                          y: pos.ty,
                          z: pos.tz,
                          rotateZ: pos.rotZ,
                          scale: pos.scale,
                          opacity: isHidden ? 0 : pos.opacity,
                        }}
                        transition={{
                          duration: 0.68,
                          ease: [0.22, 1, 0.36, 1],
                          delay: (activeIndex === 2 && node.idx >= 8) ? (node.idx - 7) * 0.022 : 0,
                        }}
                      >
                        {/* Subtle Techy internal lines indicating virtual structure */}
                        <div className="absolute inset-3 rounded-[28deg] border border-zinc-200 bg-zinc-50/70 flex flex-col items-center justify-between p-3.5 overflow-hidden">
                          <span className="text-[10px] font-mono text-zinc-400 self-start">0{node.idx}</span>
                          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">{node.letter}</span>
                        </div>
                      </motion.div>
                    );
                  }
                })}
              </>
            );
          })()}</div>
      </div>

      {/* Slide Navigation Buttons */}
      <div className="flex items-center justify-center gap-6 absolute bottom-3 md:bottom-5 z-10 w-full px-8">
        <button
          id="iso-prev-btn"
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          className="p-3.5 rounded-full bg-white border border-zinc-200 text-zinc-500 hover:text-zinc-800 transition-all hover:bg-zinc-100 flex items-center justify-center active:scale-90 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 bg-white pb-1.5 pt-1 px-4 rounded-full border border-zinc-200">
          {cards.map((_, idx) => (
            <button
              key={idx}
              id={`iso-dot-${idx}`}
              onClick={(e) => { e.stopPropagation(); setActiveIndex(idx); }}
              className="group relative p-1.5 focus:outline-none cursor-pointer"
            >
              <div 
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-5' : 'w-1.5'}`} 
                style={{ 
                  backgroundColor: idx === activeIndex ? '#71717a' : '#d4d4d8' 
                }} 
              />
            </button>
          ))}
        </div>

        <button
          id="iso-next-btn"
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          className="p-3.5 rounded-full bg-white border border-zinc-200 text-zinc-500 hover:text-zinc-800 transition-all hover:bg-zinc-100 flex items-center justify-center active:scale-90 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}
