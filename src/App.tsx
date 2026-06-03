import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { CARD_ITEMS } from './data';
import { CardItem } from './types';
import IsometricSlider from './components/IsometricSlider';
import CardDetail from './components/CardDetail';

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null);
  return (
    <div
      id="app-root-scaffold"
      className="h-screen bg-[#f5f5f2] text-zinc-800 flex flex-col selection:bg-zinc-200 relative overflow-hidden antialiased"
    >
      <main className="flex-1 w-full px-4 md:px-8 flex flex-col justify-start relative z-10 font-sans">
        <IsometricSlider
          cards={CARD_ITEMS}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          onSelectCard={setSelectedCard}
        />
      </main>

      <footer className="h-12 shrink-0 border-t border-zinc-200 bg-white/60 px-8 flex items-center justify-between text-zinc-500 font-mono text-[10px] gap-4">
        <span>© 2026 Interactive Card Deck Lab</span>
        <span>CURATED: {CARD_ITEMS.length} TOTAL ESCAPES</span>
      </footer>

      <AnimatePresence>
        {selectedCard && (
          <CardDetail
            card={selectedCard}
            onClose={() => setSelectedCard(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
