import React from 'react';
import { motion } from 'motion/react';

interface PrismProps {
  x: number; // percentage from left
  y: number; // percentage from top
  w: number; // width in pixels
  d: number; // depth (horizontal floor length) in pixels
  h: number; // height (standing up along Z-axis) in pixels
  color: string;
  opacity?: number;
  hasWindows?: boolean;
  roofType?: 'flat' | 'slanted' | 'pagoda' | 'dome' | 'cone';
  roofColor?: string;
  delay?: number;
}

// Reusable 3D CSS Prism (Box) standing perpendicular on the XY card floor
function CSS3DPrism({
  x,
  y,
  w,
  d,
  h,
  color,
  opacity = 0.95,
  hasWindows = false,
  roofType = 'flat',
  roofColor,
  delay = 0,
}: PrismProps) {
  const halfW = w / 2;
  const halfD = d / 2;
  const actualRoofColor = roofColor || color;

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${w}px`,
        height: `${d}px`,
        transformStyle: 'preserve-3d',
      }}
      initial={{ translateZ: -100, scaleZ: 0, opacity: 0 }}
      animate={{ translateZ: 0, scaleZ: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 140,
        damping: 18,
        delay: delay,
      }}
    >
      {/* 1. FRONT face (facing down/outwards) */}
      <div
        className="absolute bottom-0 left-0 bg-gradient-to-t border-t border-white/20"
        style={{
          width: `${w}px`,
          height: `${h}px`,
          backgroundColor: color,
          opacity: opacity,
          backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.4), rgba(255,255,255,0.1))',
          transform: `rotateX(-90deg)`,
          transformOrigin: 'bottom',
        }}
      >
        {hasWindows && (
          <div className="grid grid-cols-3 gap-1 p-1 h-full opacity-80">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-yellow-200/80 rounded-xs"
              />
            ))}
          </div>
        )}
      </div>

      {/* 2. BACK face (facing up/inwards) */}
      <div
        className="absolute top-0 left-0 bg-gradient-to-t border-b border-black/40"
        style={{
          width: `${w}px`,
          height: `${h}px`,
          backgroundColor: color,
          opacity: opacity * 0.85,
          backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)',
          transform: `rotateX(90deg)`,
          transformOrigin: 'top',
        }}
      />

      {/* 3. LEFT face */}
      <div
        className="absolute top-0 left-0 bg-gradient-to-t border-r border-black/30"
        style={{
          width: `${d}px`,
          height: `${h}px`,
          backgroundColor: color,
          opacity: opacity * 0.75,
          backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.5), rgba(255,255,255,0.05))',
          transform: `rotateY(-90deg) rotateZ(90deg)`,
          transformOrigin: 'left top',
        }}
      >
        {hasWindows && (
          <div className="grid grid-cols-2 gap-1 p-1 h-full opacity-60">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-yellow-300/70 rounded-xs"
              />
            ))}
          </div>
        )}
      </div>

      {/* 4. RIGHT face */}
      <div
        className="absolute top-0 right-0 bg-gradient-to-t"
        style={{
          width: `${d}px`,
          height: `${h}px`,
          backgroundColor: color,
          opacity: opacity * 0.9,
          backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.3), rgba(255,255,255,0.15))',
          transform: `rotateY(90deg) rotateZ(-90deg)`,
          transformOrigin: 'right top',
        }}
      />

      {/* 5. TOP face (at the peak height 'h') */}
      <div
        className="absolute top-0 left-0 border border-white/20"
        style={{
          width: `${w}px`,
          height: `${d}px`,
          backgroundColor: actualRoofColor,
          opacity: opacity * 1.05,
          transform: `translateZ(${h}px)`,
          backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(0,0,0,0.25))',
        }}
      >
        {/* Render Roof types to break the box feel */}
        {roofType === 'pagoda' && (
          <div 
            className="absolute -inset-1 rounded-sm border border-zinc-300 bg-zinc-200 flex items-center justify-center transition-all"
            style={{
              transform: `translateZ(10px) scale(0.9)`,
              transformStyle: 'preserve-3d',
              backgroundColor: '#ef4444'
            }}
          />
        )}
        {roofType === 'dome' && (
          <div 
            className="absolute inset-1 rounded-full border border-white/20 bg-gradient-to-br from-indigo-300 to-indigo-800"
            style={{
              transform: `translateZ(8px) scale(0.9)`,
            }}
          />
        )}
      </div>
    </motion.div>
  );
}

interface Isometric3DObjectsProps {
  cardId: string;
  color: string;
  isActive: boolean;
}

export default function Isometric3DObjects({
  cardId,
  color,
  isActive,
}: Isometric3DObjectsProps) {
  if (!isActive) return null;

  // Render thematic procedural 3D scenery standing vertically perpendicular on the card
  switch (cardId) {
    case 'cyberpunk-tokyo':
      return (
        <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
          {/* Substantial Neo-Tokyo Cyber Skyscrapers */}
          <CSS3DPrism x={20} y={15} w={38} d={34} h={130} color="#64748b" opacity={0.9} hasWindows delay={0.1} />
          <CSS3DPrism x={58} y={10} w={42} d={38} h={170} color="#475569" opacity={0.95} hasWindows delay={0.2} roofType="dome" />
          <CSS3DPrism x={38} y={42} w={32} d={30} h={100} color="#94a3b8" opacity={0.88} hasWindows delay={0.3} />
        </div>
      );

    case 'arctic-lights':
      return (
        <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
          {/* Magical Translucent Ice Crystals / Glaciers */}
          <CSS3DPrism x={25} y={25} w={45} d={45} h={110} color="#bfdbfe" opacity={0.65} delay={0.1} roofType="dome" roofColor="#bae6fd" />
          <CSS3DPrism x={55} y={18} w={36} d={36} h={80} color="#cbd5e1" opacity={0.7} delay={0.25} />
          <CSS3DPrism x={42} y={40} w={32} d={32} h={55} color="#ccfbf1" opacity={0.6} delay={0.4} />
        </div>
      );

    case 'sahara-oasis':
      return (
        <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
          {/* Desert Dunes / Golden Pyramids */}
          <CSS3DPrism x={35} y={20} w={60} d={60} h={75} color="#78350f" opacity={0.95} delay={0.15} roofColor="#f59e0b" />
          
          {/* Palm trees columns representation */}
          <CSS3DPrism x={20} y={40} w={12} d={12} h={60} color="#451a03" opacity={0.9} delay={0.3} roofColor="#15803d" />
          <CSS3DPrism x={72} y={35} w={10} d={10} h={50} color="#451a03" opacity={0.9} delay={0.42} roofColor="#166534" />
        </div>
      );

    case 'kyoto-zen':
      return (
        <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
          {/* Traditional Crimson Red & Black Kyoto Pagoda */}
          <CSS3DPrism x={42} y={15} w={35} d={35} h={140} color="#a8a29e" opacity={0.98} delay={0.1} roofType="pagoda" roofColor="#d6d3d1" />
          
          {/* Bamboo cylinder tubes */}
          <CSS3DPrism x={18} y={30} w={12} d={12} h={110} color="#064e3b" opacity={0.88} delay={0.25} />
          <CSS3DPrism x={26} y={42} w={10} d={10} h={90} color="#065f46" opacity={0.88} delay={0.32} />
          <CSS3DPrism x={72} y={28} w={12} d={12} h={120} color="#14532d" opacity={0.88} delay={0.4} />
        </div>
      );

    case 'deep-reef':
      return (
        <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
          {/* Underwater columns and reef chambers */}
          <CSS3DPrism x={22} y={22} w={34} d={34} h={90} color="#bfdbfe" opacity={0.7} delay={0.1} />
          <CSS3DPrism x={58} y={28} w={30} d={30} h={120} color="#c4b5fd" opacity={0.7} delay={0.25} />
          <CSS3DPrism x={40} y={46} w={24} d={24} h={70} color="#bae6fd" opacity={0.65} delay={0.4} />
        </div>
      );

    case 'nebula-observatory':
      return (
        <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
          {/* Stellar High Observatory Dome tower */}
          <CSS3DPrism x={38} y={15} w={48} d={48} h={130} color="#94a3b8" opacity={0.95} delay={0.15} roofType="dome" roofColor="#cbd5e1" />
          
          {/* Secondary radio satellite dishes towers */}
          <CSS3DPrism x={15} y={40} w={25} d={25} h={75} color="#c4b5fd" opacity={0.9} delay={0.3} />
          <CSS3DPrism x={70} y={35} w={24} d={24} h={60} color="#bae6fd" opacity={0.9} delay={0.45} />
        </div>
      );

    case 'amalfi-coast':
      return (
        <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
          {/* Nested Mediterranean pastel cliff houses stacked at scenic steps */}
          <CSS3DPrism x={18} y={15} w={38} d={34} h={110} color="#fef3c7" opacity={0.98} delay={0.1} roofColor="#b45309" />
          <CSS3DPrism x={52} y={10} w={36} d={34} h={80} color="#fecdd3" opacity={0.98} delay={0.22} roofColor="#be123c" />
          <CSS3DPrism x={38} y={42} w={32} d={30} h={55} color="#ccfbf1" opacity={0.95} delay={0.38} roofColor="#0f766e" />
        </div>
      );

    default:
      return null;
  }
}
