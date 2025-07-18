export interface BirthdayTheme {
  id: string;
  name: string;
  description: string;
  price: number;
  ageGroup: 'children' | 'teenagers' | 'adults' | 'seniors';
}

export const birthdayThemes: BirthdayTheme[] = [
  // Children (1-12 years)
  {
    id: 'children-colorful-balloons',
    name: 'Colorful Balloon Paradise',
    description: 'Bright colorful balloons, streamers, and fun decorations',
    price: 75,
    ageGroup: 'children'
  },
  {
    id: 'children-cartoon-theme',
    name: 'Cartoon Character Theme',
    description: 'Popular cartoon character decorations and themed accessories',
    price: 85,
    ageGroup: 'children'
  },
  {
    id: 'children-princess-theme',
    name: 'Princess/Prince Theme',
    description: 'Royal decorations with crowns, tiaras, and elegant touches',
    price: 90,
    ageGroup: 'children'
  },
  {
    id: 'children-superhero-theme',
    name: 'Superhero Adventure',
    description: 'Action-packed superhero decorations and themed elements',
    price: 85,
    ageGroup: 'children'
  },

  // Teenagers (13-17 years)
  {
    id: 'teenagers-modern-neon',
    name: 'Modern Neon Lights',
    description: 'LED neon decorations with contemporary styling',
    price: 95,
    ageGroup: 'teenagers'
  },
  {
    id: 'teenagers-music-theme',
    name: 'Music & Entertainment',
    description: 'Music-themed decorations with disco elements',
    price: 100,
    ageGroup: 'teenagers'
  },
  {
    id: 'teenagers-social-media',
    name: 'Social Media Vibes',
    description: 'Instagram-worthy decorations with photo props',
    price: 90,
    ageGroup: 'teenagers'
  },
  {
    id: 'teenagers-gaming-theme',
    name: 'Gaming Paradise',
    description: 'Gaming-themed decorations and LED lighting',
    price: 95,
    ageGroup: 'teenagers'
  },

  // Adults (18-59 years)
  {
    id: 'adults-elegant-gold',
    name: 'Elegant Gold & Black',
    description: 'Sophisticated gold and black decorations with premium touches',
    price: 120,
    ageGroup: 'adults'
  },
  {
    id: 'adults-champagne-luxury',
    name: 'Champagne Luxury',
    description: 'Luxurious champagne-themed decorations with crystal accents',
    price: 135,
    ageGroup: 'adults'
  },
  {
    id: 'adults-romantic-roses',
    name: 'Romantic Rose Garden',
    description: 'Romantic rose decorations with ambient lighting',
    price: 125,
    ageGroup: 'adults'
  },
  {
    id: 'adults-corporate-chic',
    name: 'Corporate Chic',
    description: 'Professional yet celebratory decorations for business occasions',
    price: 110,
    ageGroup: 'adults'
  },

  // Seniors (60+ years)
  {
    id: 'seniors-classic-elegance',
    name: 'Classic Elegance',
    description: 'Timeless elegant decorations with refined touches',
    price: 115,
    ageGroup: 'seniors'
  },
  {
    id: 'seniors-vintage-charm',
    name: 'Vintage Charm',
    description: 'Vintage-inspired decorations with nostalgic elements',
    price: 120,
    ageGroup: 'seniors'
  },
  {
    id: 'seniors-garden-party',
    name: 'Garden Party Theme',
    description: 'Fresh floral decorations with garden-inspired elements',
    price: 125,
    ageGroup: 'seniors'
  },
  {
    id: 'seniors-milestone-celebration',
    name: 'Milestone Celebration',
    description: 'Special milestone decorations for significant birthdays',
    price: 130,
    ageGroup: 'seniors'
  }
];

export const getThemesByAge = (age: number): BirthdayTheme[] => {
  let ageGroup: 'children' | 'teenagers' | 'adults' | 'seniors';
  
  if (age >= 1 && age <= 12) {
    ageGroup = 'children';
  } else if (age >= 13 && age <= 17) {
    ageGroup = 'teenagers';
  } else if (age >= 18 && age <= 59) {
    ageGroup = 'adults';
  } else {
    ageGroup = 'seniors';
  }
  
  return birthdayThemes.filter(theme => theme.ageGroup === ageGroup);
};

export const getThemeById = (id: string): BirthdayTheme | undefined => {
  return birthdayThemes.find(theme => theme.id === id);
};

export const getAgeGroupLabel = (age: number): string => {
  if (age >= 1 && age <= 12) return 'Children (1-12 years)';
  if (age >= 13 && age <= 17) return 'Teenagers (13-17 years)';
  if (age >= 18 && age <= 59) return 'Adults (18-59 years)';
  return 'Seniors (60+ years)';
};
