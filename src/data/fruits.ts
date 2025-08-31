export interface FruitData {
  id: number;
  name: string;
  emoji: string;
  benefits: string;
  calories: number;
  fiber: number;
  vitaminC: number;
  potassium: number;
}

export const fruitsData: FruitData[] = [
  {
    id: 1,
    name: 'Apple',
    emoji: '🍎',
    benefits: 'Rich in fiber, helps lower cholesterol, supports heart health',
    calories: 52,
    fiber: 2.4,
    vitaminC: 4.6,
    potassium: 107
  },
  {
    id: 2,
    name: 'Banana',
    emoji: '🍌',
    benefits: 'High in potassium, supports muscle function, natural energy boost',
    calories: 89,
    fiber: 2.6,
    vitaminC: 8.7,
    potassium: 358
  },
  {
    id: 3,
    name: 'Orange',
    emoji: '🍊',
    benefits: 'Excellent source of vitamin C, boosts immune system',
    calories: 47,
    fiber: 2.4,
    vitaminC: 53.2,
    potassium: 181
  },
  {
    id: 4,
    name: 'Strawberry',
    emoji: '🍓',
    benefits: 'Low in calories, high antioxidants, supports skin health',
    calories: 32,
    fiber: 2.0,
    vitaminC: 58.8,
    potassium: 153
  },
  {
    id: 5,
    name: 'Kiwi',
    emoji: '🥝',
    benefits: 'High vitamin C, aids digestion, supports immune function',
    calories: 61,
    fiber: 3.0,
    vitaminC: 92.7,
    potassium: 312
  },
  {
    id: 6,
    name: 'Mango',
    emoji: '🥭',
    benefits: 'Rich in vitamin A, supports eye health, boosts immunity',
    calories: 60,
    fiber: 1.6,
    vitaminC: 36.4,
    potassium: 168
  },
  {
    id: 7,
    name: 'Pineapple',
    emoji: '🍍',
    benefits: 'Contains bromelain, aids digestion, anti-inflammatory',
    calories: 50,
    fiber: 1.4,
    vitaminC: 47.8,
    potassium: 109
  },
  {
    id: 8,
    name: 'Grapes',
    emoji: '🍇',
    benefits: 'Rich in antioxidants, supports heart health, brain function',
    calories: 62,
    fiber: 0.9,
    vitaminC: 3.2,
    potassium: 191
  },
  {
    id: 9,
    name: 'Blueberry',
    emoji: '🫐',
    benefits: 'High antioxidants, improves memory, supports brain health',
    calories: 57,
    fiber: 2.4,
    vitaminC: 9.7,
    potassium: 77
  },
  {
    id: 10,
    name: 'Watermelon',
    emoji: '🍉',
    benefits: 'Hydrating, low calories, rich in lycopene',
    calories: 30,
    fiber: 0.4,
    vitaminC: 8.1,
    potassium: 112
  },
  {
    id: 11,
    name: 'Peach',
    emoji: '🍑',
    benefits: 'Rich in vitamin A, supports skin health, aids digestion',
    calories: 39,
    fiber: 1.5,
    vitaminC: 6.6,
    potassium: 190
  },
  {
    id: 12,
    name: 'Cherry',
    emoji: '🍒',
    benefits: 'Anti-inflammatory, supports sleep, rich in antioxidants',
    calories: 50,
    fiber: 1.6,
    vitaminC: 7.0,
    potassium: 173
  },
  {
    id: 13,
    name: 'Avocado',
    emoji: '🥑',
    benefits: 'Healthy fats, supports heart health, aids nutrient absorption',
    calories: 160,
    fiber: 6.7,
    vitaminC: 10.0,
    potassium: 485
  },
  {
    id: 14,
    name: 'Papaya',
    emoji: '🫐',
    benefits: 'Rich in enzymes, aids digestion, supports immune system',
    calories: 43,
    fiber: 1.7,
    vitaminC: 60.9,
    potassium: 182
  },
  {
    id: 15,
    name: 'Coconut',
    emoji: '🥥',
    benefits: 'Rich in healthy fats, supports brain function, hydrating',
    calories: 354,
    fiber: 9.0,
    vitaminC: 3.3,
    potassium: 356
  },
  {
    id: 16,
    name: 'Lemon',
    emoji: '🍋',
    benefits: 'High vitamin C, aids detox, supports immune system',
    calories: 17,
    fiber: 1.6,
    vitaminC: 51.0,
    potassium: 80
  },
  {
    id: 17,
    name: 'Lime',
    emoji: '🟢',
    benefits: 'Rich in vitamin C, aids digestion, supports skin health',
    calories: 20,
    fiber: 1.9,
    vitaminC: 29.1,
    potassium: 68
  },
  {
    id: 18,
    name: 'Pomegranate',
    emoji: '🫐',
    benefits: 'High antioxidants, supports heart health, anti-inflammatory',
    calories: 83,
    fiber: 4.0,
    vitaminC: 10.2,
    potassium: 236
  },
  {
    id: 19,
    name: 'Dragon Fruit',
    emoji: '🐉',
    benefits: 'Low calories, high fiber, supports digestive health',
    calories: 60,
    fiber: 3.0,
    vitaminC: 3.0,
    potassium: 107
  },
  {
    id: 20,
    name: 'Guava',
    emoji: '🟡',
    benefits: 'Very high vitamin C, supports immune system, aids digestion',
    calories: 68,
    fiber: 5.4,
    vitaminC: 228.3,
    potassium: 417
  },
  {
    id: 21,
    name: 'Passion Fruit',
    emoji: '🟣',
    benefits: 'High fiber, supports digestion, rich in antioxidants',
    calories: 97,
    fiber: 10.4,
    vitaminC: 30.0,
    potassium: 348
  },
  {
    id: 22,
    name: 'Lychee',
    emoji: '🫐',
    benefits: 'High vitamin C, supports skin health, boosts immunity',
    calories: 66,
    fiber: 1.3,
    vitaminC: 71.5,
    potassium: 171
  },
  {
    id: 23,
    name: 'Jackfruit',
    emoji: '🟡',
    benefits: 'Rich in fiber, supports digestive health, high potassium',
    calories: 95,
    fiber: 1.5,
    vitaminC: 13.7,
    potassium: 448
  },
  {
    id: 24,
    name: 'Star Fruit',
    emoji: '⭐',
    benefits: 'Low calories, high vitamin C, supports immune function',
    calories: 31,
    fiber: 2.8,
    vitaminC: 34.4,
    potassium: 133
  },
  {
    id: 25,
    name: 'Cantaloupe',
    emoji: '🍈',
    benefits: 'High vitamin A, supports eye health, hydrating',
    calories: 34,
    fiber: 0.9,
    vitaminC: 36.7,
    potassium: 267
  },
  {
    id: 26,
    name: 'Honeydew',
    emoji: '🍈',
    benefits: 'Hydrating, supports skin health, rich in vitamin C',
    calories: 36,
    fiber: 0.8,
    vitaminC: 18.0,
    potassium: 228
  },
  {
    id: 27,
    name: 'Plum',
    emoji: '🟣',
    benefits: 'Rich in antioxidants, supports bone health, aids digestion',
    calories: 46,
    fiber: 1.4,
    vitaminC: 9.5,
    potassium: 157
  },
  {
    id: 28,
    name: 'Apricot',
    emoji: '🟠',
    benefits: 'High vitamin A, supports eye health, rich in fiber',
    calories: 48,
    fiber: 2.0,
    vitaminC: 10.0,
    potassium: 259
  },
  {
    id: 29,
    name: 'Fig',
    emoji: '🟤',
    benefits: 'High fiber, supports digestive health, rich in minerals',
    calories: 74,
    fiber: 2.9,
    vitaminC: 2.0,
    potassium: 232
  },
  {
    id: 30,
    name: 'Persimmon',
    emoji: '🟠',
    benefits: 'Rich in vitamin A, supports immune system, high fiber',
    calories: 70,
    fiber: 3.6,
    vitaminC: 7.5,
    potassium: 161
  }
];
