// Mapping of fruit names to emojis for display
export const fruitEmojis: { [key: string]: string } = {
  'apple': '🍎',
  'banana': '🍌',
  'orange': '🍊',
  'strawberry': '🍓',
  'kiwi': '🥝',
  'mango': '🥭',
  'pineapple': '🍍',
  'grapes': '🍇',
  'blueberry': '🫐',
  'watermelon': '🍉',
  'peach': '🍑',
  'cherry': '🍒',
  'avocado': '🥑',
  'papaya': '🥭',
  'coconut': '🥥',
  'lemon': '🍋',
  'lime': '🍈',
  'pomegranate': '🍎',
  'dragon fruit': '🐉',
  'guava': '🟢',
  'passion fruit': '🟣',
  'lychee': '🫐',
  'jackfruit': '🟡',
  'star fruit': '⭐',
  'cantaloupe': '🍈',
  'honeydew': '🍈',
  'plum': '🟣',
  'apricot': '🟠',
  'fig': '🟤',
  'persimmon': '🟠'
};

// Get emoji for a fruit name (case insensitive)
export const getFruitEmoji = (fruitName: string): string => {
  const key = fruitName.toLowerCase().trim();
  return fruitEmojis[key] || '🍎'; // Default to apple emoji
};

// Recommendation level colors and badges
export const getRecommendationStyle = (level: string) => {
  switch (level) {
    case 'recommended':
      return {
        color: '#4CAF50',
        backgroundColor: '#E8F5E8',
        badge: '✓ Recommended',
        textColor: '#2E7D32'
      };
    case 'moderate':
      return {
        color: '#FF9800',
        backgroundColor: '#FFF3E0',
        badge: '⚠ Moderate',
        textColor: '#E65100'
      };
    case 'limit':
      return {
        color: '#FF5722',
        backgroundColor: '#FFEBEE',
        badge: '⚠ Limit',
        textColor: '#C62828'
      };
    case 'avoid':
      return {
        color: '#F44336',
        backgroundColor: '#FFEBEE',
        badge: '✕ Avoid',
        textColor: '#B71C1C'
      };
    default:
      return {
        color: '#9E9E9E',
        backgroundColor: '#F5F5F5',
        badge: '',
        textColor: '#616161'
      };
  }
};
