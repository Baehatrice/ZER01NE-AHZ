export type SliderMode = 'coverflow' | 'stack' | 'fan' | 'isometric';

export interface CardItem {
  id: string;
  letter?: string; // Floating 3D letter associated with the card
  title: string;
  subtitle: string;
  category: string;
  image: string;
  color: string; // Theme color (e.g., #ec4899)
  gradientFrom: string; // Gradient start color
  gradientTo: string; // Gradient end color
  description: string;
  stats: {
    label: string;
    value: string;
  }[];
  soundAmbient: string;
  highlights: string[];
  coordinates: string;
}
