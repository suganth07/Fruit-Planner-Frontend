// Mapping of fruit names to emojis for display
export const fruitEmojis: { [key: string]: string } = {
  'apple': '🍎',
  'banana': '🍌',
  'orange': '🍊',
  'grape': '🍇',
  'grapes': '🍇',
  'strawberry': '🍓',
  'strawberries': '🍓',
  'blueberry': '🫐',
  'blueberries': '🫐',
  'kiwi': '🥝',
  'mango': '🥭',
  'papaya': '🧡', // Using orange heart as papaya emoji doesn't exist
  'pineapple': '🍍',
  'watermelon': '🍉',
  'pomegranate': '🔴', // Using red circle
  'avocado': '🥑',
  'cherry': '�',
  'cherries': '🍒',
  'peach': '🍑',
  'plum': '🟣',
  'apricot': '🟠',
  'coconut': '🥥',
  'lemon': '🍋',
  'lime': '💚', // Using green heart
  'grapefruit': '🟡', // Using yellow circle
  'blackberry': '⚫', // Using black circle
  'blackberries': '⚫',
  'raspberry': '🔴', // Using red circle
  'raspberries': '🔴',
  'cantaloupe': '�',
  'honeydew': '🍈',
  'cranberry': '�',
  'cranberries': '�',
  'date': '🟤', // Using brown circle
  'dates': '�',
  'fig': '🟤',
  'figs': '�',
  'dragon fruit': '🐉',
  'guava': '🟢',
  'passion fruit': '🟣',
  'lychee': '🤍', // Using white heart
  'jackfruit': '�',
  'star fruit': '⭐',
  'persimmon': '🟠',
  // Additional mappings for database fruit names
  'berries': '🫐',
  'mixed berries': '🫐',
  'berry': '🫐'
};

// Get emoji for a fruit name (case insensitive)
export const getFruitEmoji = (fruitName: string): string => {
  const key = fruitName.toLowerCase().trim()
    .replace(/\s*\([^)]*\)/g, '') // Remove parentheses and content
    .replace(/berries/g, 'berry') // Convert berries to berry
    .replace(/s$/, ''); // Remove trailing 's' for plurals
  
  return fruitEmojis[key] || fruitEmojis[fruitName.toLowerCase().trim()] || '🍎'; // Default to apple emoji
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
