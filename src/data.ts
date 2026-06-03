import { CardItem } from './types';

export const CARD_ITEMS: CardItem[] = [
  {
    id: 'cyberpunk-tokyo',
    letter: 'A',
    title: 'Neo-Tokyo',
    subtitle: 'Nostalgic Neon & Rain',
    category: 'Cyberpunk Odyssey',
    image: 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?q=80&w=800&auto=format&fit=crop',
    color: '#ec4899', // Pink
    gradientFrom: '#ec4899',
    gradientTo: '#8b5cf6',
    description: 'An immersive realm where skyscraper neon beams pierce through midnight rain. Walk along narrow alleys filled with retro-futuristic vending machines, hologram ads whistling sweet melodies, and cozy underground noodle shops serving steaming ramen. The air is electric, filled with synth tracks and ambient mechanical hums.',
    stats: [
      { label: 'Humidty', value: '92%' },
      { label: 'Intensity', value: 'K-6 Grid' },
      { label: 'Altitude', value: '45m' }
    ],
    soundAmbient: 'Rain on steel awnings, low-fidelity electronic radio tunes',
    highlights: ['Kabukicho Holo-Street', 'Cyber-alley Arcade', 'Capsule Inn Horizon'],
    coordinates: '35.6762° N, 139.6503° E'
  },
  {
    id: 'kyoto-zen',
    letter: 'H',
    title: 'Kyoto Sanctuary',
    subtitle: 'Silence of the Whispering Grove',
    category: 'Ethereal Zen',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800&auto=format&fit=crop',
    color: '#a3e635', // Lime/Light green
    gradientFrom: '#84cc16',
    gradientTo: '#10b981',
    description: 'Lush green stalks of towering bamboo reach toward the heavens, casting delicate shadows across moss-carpeted stone lanterns and soft pebble pathways. The gentle click-clack of a shishi-odoshi (bamboo water fountain) breaks the serene quietude, letting your mind settle in meditative peace.',
    stats: [
      { label: 'Air-Clean', value: '99%' },
      { label: 'Humidty', value: '60%' },
      { label: 'Calm-Rate', value: 'Max' }
    ],
    soundAmbient: 'Bamboo leaves rustling, steady bamboo water fountain clicks',
    highlights: ['Sagano Dream Trails', 'Koto-in Moss Courtyard', 'River Hozu Bridge'],
    coordinates: '35.0116° N, 135.7681° E'
  },
  {
    id: 'nebula-observatory',
    letter: 'Z',
    title: 'Andromeda Peak',
    subtitle: 'Cosmic Stellar Nursery',
    category: 'Space Exploration',
    image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=800&auto=format&fit=crop',
    color: '#c084fc', // Purple
    gradientFrom: '#a855f7',
    gradientTo: '#f43f5e',
    description: 'Gazing upwards through crystalline high-altitude atmospheres, the sky reveals magnificent glowing nebulae of pink, deep violet, and hydrogen blue gas. Glimmering constellations trace legends across the eternal cosmos while distant shooting stars leave glowing residue trails. A sense of cosmic perspective takes over.',
    stats: [
      { label: 'Atmosphere', value: '0.12 atm' },
      { label: 'Gravity', value: '0.38 g' },
      { label: 'Obs-Clarity', value: '99.8%' }
    ],
    soundAmbient: 'Ethereal sub-bass vibration, celestial chime pads',
    highlights: ['Starry Peak Telescope', 'Cosmic Dust Grotto', 'Nebula Ridge Lookout'],
    coordinates: '72.5000° S, 40.0000° E'
  }
];
