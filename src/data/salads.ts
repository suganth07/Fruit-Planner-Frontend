export interface SaladRecipe {
  id: number;
  name: string;
  type: 'fruit' | 'green' | 'mixed' | 'protein';
  image: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  benefits: string[];
  medicalBenefits: MedicalBenefit[];
  prepTime: number; // minutes
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  youtubeSearchQuery: string;
}

export interface Ingredient {
  name: string;
  amount: string;
  optional?: boolean;
}

export interface MedicalBenefit {
  condition: string;
  benefit: string;
}

export const saladRecipes: SaladRecipe[] = [
  {
    id: 1,
    name: 'Rainbow Fruit Salad',
    type: 'fruit',
    image: '🥗',
    description: 'A colorful and nutritious fruit salad packed with vitamins and antioxidants',
    ingredients: [
      { name: 'Apple', amount: '2 medium, diced' },
      { name: 'Orange', amount: '2 medium, segmented' },
      { name: 'Strawberries', amount: '1 cup, sliced' },
      { name: 'Blueberries', amount: '1/2 cup' },
      { name: 'Grapes', amount: '1 cup, halved' },
      { name: 'Banana', amount: '1 medium, sliced' },
      { name: 'Honey', amount: '2 tbsp', optional: true },
      { name: 'Lemon juice', amount: '1 tbsp' },
      { name: 'Fresh mint', amount: '2 tbsp, chopped', optional: true }
    ],
    instructions: [
      'Wash all fruits thoroughly',
      'Dice apples and keep in lemon water to prevent browning',
      'Segment oranges and remove seeds',
      'Slice strawberries and banana',
      'Combine all fruits in a large bowl',
      'Drizzle with honey and lemon juice',
      'Gently toss to combine',
      'Garnish with fresh mint',
      'Chill for 30 minutes before serving'
    ],
    benefits: [
      'High in Vitamin C and antioxidants',
      'Boosts immune system',
      'Provides natural energy',
      'Supports healthy digestion',
      'Low in calories and fat-free'
    ],
    medicalBenefits: [
      { condition: 'diabetes_type_2', benefit: 'Natural sugars with fiber help regulate blood sugar' },
      { condition: 'heart_disease', benefit: 'Antioxidants support cardiovascular health' },
      { condition: 'high_cholesterol', benefit: 'Soluble fiber helps lower cholesterol levels' },
      { condition: 'obesity', benefit: 'Low calorie, high fiber option for weight management' }
    ],
    prepTime: 15,
    servings: 4,
    difficulty: 'Easy',
    youtubeSearchQuery: 'healthy rainbow fruit salad recipe easy'
  },
  {
    id: 2,
    name: 'Mediterranean Green Salad',
    type: 'green',
    image: '🥬',
    description: 'Fresh Mediterranean-style salad with mixed greens and healthy fats',
    ingredients: [
      { name: 'Mixed lettuce', amount: '4 cups' },
      { name: 'Spinach', amount: '2 cups' },
      { name: 'Cucumber', amount: '1 large, diced' },
      { name: 'Cherry tomatoes', amount: '1 cup, halved' },
      { name: 'Red onion', amount: '1/4 cup, thinly sliced' },
      { name: 'Olives', amount: '1/4 cup' },
      { name: 'Feta cheese', amount: '1/2 cup, crumbled', optional: true },
      { name: 'Olive oil', amount: '3 tbsp' },
      { name: 'Lemon juice', amount: '2 tbsp' },
      { name: 'Oregano', amount: '1 tsp, dried' }
    ],
    instructions: [
      'Wash and dry all greens thoroughly',
      'Tear lettuce into bite-sized pieces',
      'Dice cucumber and halve tomatoes',
      'Thinly slice red onion',
      'Combine greens in a large bowl',
      'Add cucumber, tomatoes, and onion',
      'Whisk olive oil, lemon juice, and oregano',
      'Drizzle dressing over salad',
      'Top with olives and feta cheese',
      'Toss gently and serve immediately'
    ],
    benefits: [
      'Rich in vitamins K, A, and folate',
      'High in antioxidants and minerals',
      'Supports bone health',
      'Promotes healthy digestion',
      'Heart-healthy monounsaturated fats'
    ],
    medicalBenefits: [
      { condition: 'high_blood_pressure', benefit: 'Potassium-rich vegetables help regulate blood pressure' },
      { condition: 'osteoporosis', benefit: 'High vitamin K content supports bone health' },
      { condition: 'anemia', benefit: 'Iron-rich spinach helps prevent anemia' },
      { condition: 'heart_disease', benefit: 'Olive oil provides heart-healthy fats' }
    ],
    prepTime: 10,
    servings: 3,
    difficulty: 'Easy',
    youtubeSearchQuery: 'mediterranean green salad olive oil dressing'
  },
  {
    id: 3,
    name: 'Quinoa Power Bowl',
    type: 'protein',
    image: '🍲',
    description: 'Protein-packed quinoa salad with vegetables and nuts',
    ingredients: [
      { name: 'Quinoa', amount: '1 cup, cooked' },
      { name: 'Chickpeas', amount: '1 can, drained' },
      { name: 'Avocado', amount: '1 medium, sliced' },
      { name: 'Bell pepper', amount: '1 red, diced' },
      { name: 'Carrots', amount: '2 medium, grated' },
      { name: 'Almonds', amount: '1/4 cup, sliced' },
      { name: 'Pumpkin seeds', amount: '2 tbsp' },
      { name: 'Tahini', amount: '3 tbsp' },
      { name: 'Lemon juice', amount: '2 tbsp' },
      { name: 'Garlic', amount: '1 clove, minced' }
    ],
    instructions: [
      'Cook quinoa according to package directions and cool',
      'Drain and rinse chickpeas',
      'Dice bell pepper and grate carrots',
      'Slice avocado just before serving',
      'Whisk tahini, lemon juice, and garlic for dressing',
      'Combine quinoa, chickpeas, and vegetables',
      'Drizzle with tahini dressing',
      'Top with avocado, almonds, and pumpkin seeds',
      'Toss gently and serve'
    ],
    benefits: [
      'Complete protein source',
      'High in fiber and minerals',
      'Provides sustained energy',
      'Rich in healthy fats',
      'Supports muscle health'
    ],
    medicalBenefits: [
      { condition: 'diabetes_type_2', benefit: 'Low glycemic index helps stabilize blood sugar' },
      { condition: 'high_cholesterol', benefit: 'Fiber and healthy fats help lower cholesterol' },
      { condition: 'heart_disease', benefit: 'Omega-3 fatty acids support heart health' },
      { condition: 'obesity', benefit: 'High protein and fiber promote satiety' }
    ],
    prepTime: 25,
    servings: 4,
    difficulty: 'Medium',
    youtubeSearchQuery: 'quinoa power bowl recipe healthy tahini dressing'
  },
  {
    id: 4,
    name: 'Tropical Paradise Salad',
    type: 'fruit',
    image: '🥭',
    description: 'Exotic fruit salad with tropical flavors and coconut',
    ingredients: [
      { name: 'Mango', amount: '1 large, diced' },
      { name: 'Pineapple', amount: '1 cup, chunks' },
      { name: 'Papaya', amount: '1 cup, diced' },
      { name: 'Kiwi', amount: '2 medium, sliced' },
      { name: 'Coconut flakes', amount: '1/4 cup' },
      { name: 'Lime juice', amount: '2 tbsp' },
      { name: 'Coconut water', amount: '1/4 cup' },
      { name: 'Fresh basil', amount: '2 tbsp, chopped', optional: true }
    ],
    instructions: [
      'Peel and dice mango and papaya',
      'Cut pineapple into bite-sized chunks',
      'Slice kiwi into rounds',
      'Combine all fruits in a bowl',
      'Mix lime juice with coconut water',
      'Pour dressing over fruits',
      'Sprinkle with coconut flakes',
      'Garnish with fresh basil',
      'Chill for 1 hour before serving'
    ],
    benefits: [
      'Rich in vitamin C and enzymes',
      'Supports immune function',
      'Natural digestive aids',
      'Hydrating and refreshing',
      'Anti-inflammatory properties'
    ],
    medicalBenefits: [
      { condition: 'acid_reflux', benefit: 'Papaya enzymes aid in digestion' },
      { condition: 'high_blood_pressure', benefit: 'Potassium helps regulate blood pressure' },
      { condition: 'arthritis', benefit: 'Anti-inflammatory compounds reduce joint pain' },
      { condition: 'kidney_disease', benefit: 'Natural diuretic properties support kidney function' }
    ],
    prepTime: 20,
    servings: 4,
    difficulty: 'Easy',
    youtubeSearchQuery: 'tropical fruit salad mango pineapple papaya'
  },
  {
    id: 5,
    name: 'Antioxidant Berry Medley',
    type: 'fruit',
    image: '🫐',
    description: 'Super antioxidant-rich berry salad with nuts and seeds',
    ingredients: [
      { name: 'Blueberries', amount: '1 cup' },
      { name: 'Strawberries', amount: '1 cup, sliced' },
      { name: 'Raspberries', amount: '1/2 cup' },
      { name: 'Blackberries', amount: '1/2 cup' },
      { name: 'Walnuts', amount: '1/4 cup, chopped' },
      { name: 'Chia seeds', amount: '1 tbsp' },
      { name: 'Greek yogurt', amount: '1/4 cup', optional: true },
      { name: 'Honey', amount: '1 tbsp', optional: true }
    ],
    instructions: [
      'Gently wash all berries and pat dry',
      'Slice strawberries if large',
      'Combine all berries in a bowl',
      'Sprinkle with chopped walnuts',
      'Add chia seeds for extra nutrition',
      'Drizzle with honey if desired',
      'Add dollops of Greek yogurt',
      'Serve immediately for best texture'
    ],
    benefits: [
      'Extremely high in antioxidants',
      'Supports brain health',
      'Anti-aging properties',
      'Boosts memory and cognition',
      'Natural anti-inflammatory'
    ],
    medicalBenefits: [
      { condition: 'diabetes_type_2', benefit: 'Low glycemic berries help control blood sugar' },
      { condition: 'heart_disease', benefit: 'Anthocyanins support cardiovascular health' },
      { condition: 'high_cholesterol', benefit: 'Soluble fiber helps reduce LDL cholesterol' },
      { condition: 'arthritis', benefit: 'Anti-inflammatory compounds reduce joint inflammation' }
    ],
    prepTime: 10,
    servings: 3,
    difficulty: 'Easy',
    youtubeSearchQuery: 'antioxidant berry salad healthy recipe'
  },
  {
    id: 6,
    name: 'Garden Fresh Mixed Salad',
    type: 'mixed',
    image: '🥒',
    description: 'Fresh garden vegetables with herbs and light vinaigrette',
    ingredients: [
      { name: 'Lettuce mix', amount: '3 cups' },
      { name: 'Cucumber', amount: '1 large, sliced' },
      { name: 'Radishes', amount: '4 medium, sliced' },
      { name: 'Carrots', amount: '2 medium, julienned' },
      { name: 'Bell pepper', amount: '1 yellow, strips' },
      { name: 'Fresh herbs', amount: '1/4 cup mixed (parsley, dill)' },
      { name: 'Sunflower seeds', amount: '2 tbsp' },
      { name: 'Apple cider vinegar', amount: '2 tbsp' },
      { name: 'Olive oil', amount: '3 tbsp' },
      { name: 'Dijon mustard', amount: '1 tsp' }
    ],
    instructions: [
      'Wash and dry all vegetables thoroughly',
      'Slice cucumber and radishes thinly',
      'Julienne carrots into thin strips',
      'Cut bell pepper into strips',
      'Tear lettuce into bite-sized pieces',
      'Chop fresh herbs finely',
      'Whisk vinegar, oil, and mustard for dressing',
      'Combine all vegetables in a large bowl',
      'Drizzle with dressing and toss',
      'Top with sunflower seeds and herbs'
    ],
    benefits: [
      'High in vitamins A and C',
      'Rich in dietary fiber',
      'Low calorie and nutrient dense',
      'Supports digestive health',
      'Provides essential minerals'
    ],
    medicalBenefits: [
      { condition: 'high_blood_pressure', benefit: 'Low sodium, high potassium vegetables' },
      { condition: 'obesity', benefit: 'Very low calorie, high volume for satiety' },
      { condition: 'diabetes_type_2', benefit: 'High fiber helps regulate blood sugar' },
      { condition: 'liver_disease', benefit: 'Antioxidants support liver detoxification' }
    ],
    prepTime: 15,
    servings: 4,
    difficulty: 'Easy',
    youtubeSearchQuery: 'fresh garden salad apple cider vinegar dressing'
  }
];
