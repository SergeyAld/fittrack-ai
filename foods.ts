import type { FoodItem } from '@/types';

export const FOOD_DATABASE: FoodItem[] = [
  { id: 'chicken-breast', name: 'Chicken Breast', emoji: '🍗', category: 'Protein', perGram: { calories: 1.65, macros: { protein: 0.31, carbs: 0, fat: 0.036 } } },
  { id: 'white-rice', name: 'White Rice, cooked', emoji: '🍚', category: 'Grain', perGram: { calories: 1.3, macros: { protein: 0.028, carbs: 0.28, fat: 0.003 } } },
  { id: 'brown-rice', name: 'Brown Rice, cooked', emoji: '🍚', category: 'Grain', perGram: { calories: 1.23, macros: { protein: 0.026, carbs: 0.26, fat: 0.01 } } },
  { id: 'oats', name: 'Oats, dry', emoji: '🥣', category: 'Grain', perGram: { calories: 3.79, macros: { protein: 0.13, carbs: 0.67, fat: 0.067 } } },
  { id: 'greek-yogurt', name: 'Greek Yogurt', emoji: '🥛', category: 'Dairy', perGram: { calories: 0.6, macros: { protein: 0.1, carbs: 0.036, fat: 0.019 } } },
  { id: 'egg', name: 'Egg, whole', emoji: '🥚', category: 'Protein', perGram: { calories: 1.43, macros: { protein: 0.13, carbs: 0.007, fat: 0.095 } } },
  { id: 'egg-white', name: 'Egg Whites', emoji: '🥚', category: 'Protein', perGram: { calories: 0.52, macros: { protein: 0.11, carbs: 0.007, fat: 0.002 } } },
  { id: 'salmon', name: 'Salmon Fillet', emoji: '🐟', category: 'Protein', perGram: { calories: 2.09, macros: { protein: 0.2, carbs: 0, fat: 0.13 } } },
  { id: 'beef-steak', name: 'Lean Beef Steak', emoji: '🥩', category: 'Protein', perGram: { calories: 2.17, macros: { protein: 0.26, carbs: 0, fat: 0.11 } } },
  { id: 'banana', name: 'Banana', emoji: '🍌', category: 'Fruit', perGram: { calories: 0.89, macros: { protein: 0.011, carbs: 0.23, fat: 0.003 } } },
  { id: 'apple', name: 'Apple', emoji: '🍎', category: 'Fruit', perGram: { calories: 0.52, macros: { protein: 0.003, carbs: 0.14, fat: 0.002 } } },
  { id: 'blueberries', name: 'Blueberries', emoji: '🫐', category: 'Fruit', perGram: { calories: 0.57, macros: { protein: 0.007, carbs: 0.14, fat: 0.003 } } },
  { id: 'avocado', name: 'Avocado', emoji: '🥑', category: 'Fruit', perGram: { calories: 1.6, macros: { protein: 0.02, carbs: 0.085, fat: 0.15 } } },
  { id: 'broccoli', name: 'Broccoli', emoji: '🥦', category: 'Vegetable', perGram: { calories: 0.34, macros: { protein: 0.028, carbs: 0.07, fat: 0.004 } } },
  { id: 'spinach', name: 'Spinach', emoji: '🥬', category: 'Vegetable', perGram: { calories: 0.23, macros: { protein: 0.029, carbs: 0.036, fat: 0.004 } } },
  { id: 'sweet-potato', name: 'Sweet Potato', emoji: '🍠', category: 'Vegetable', perGram: { calories: 0.86, macros: { protein: 0.016, carbs: 0.2, fat: 0.001 } } },
  { id: 'almonds', name: 'Almonds', emoji: '🌰', category: 'Nuts', perGram: { calories: 5.79, macros: { protein: 0.21, carbs: 0.22, fat: 0.5 } } },
  { id: 'peanut-butter', name: 'Peanut Butter', emoji: '🥜', category: 'Nuts', perGram: { calories: 5.88, macros: { protein: 0.25, carbs: 0.2, fat: 0.5 } } },
  { id: 'whole-wheat-bread', name: 'Whole Wheat Bread', emoji: '🍞', category: 'Grain', perGram: { calories: 2.47, macros: { protein: 0.13, carbs: 0.41, fat: 0.033 } } },
  { id: 'cottage-cheese', name: 'Cottage Cheese', emoji: '🧀', category: 'Dairy', perGram: { calories: 0.98, macros: { protein: 0.11, carbs: 0.034, fat: 0.043 } } },
  { id: 'cheddar', name: 'Cheddar Cheese', emoji: '🧀', category: 'Dairy', perGram: { calories: 4.02, macros: { protein: 0.25, carbs: 0.013, fat: 0.33 } } },
  { id: 'milk-2', name: 'Milk 2%', emoji: '🥛', category: 'Dairy', perGram: { calories: 0.5, macros: { protein: 0.034, carbs: 0.048, fat: 0.02 } } },
  { id: 'black-beans', name: 'Black Beans, cooked', emoji: '🫘', category: 'Legume', perGram: { calories: 1.32, macros: { protein: 0.089, carbs: 0.24, fat: 0.003 } } },
  { id: 'chickpeas', name: 'Chickpeas, cooked', emoji: '🫛', category: 'Legume', perGram: { calories: 1.64, macros: { protein: 0.089, carbs: 0.27, fat: 0.025 } } },
  { id: 'tofu', name: 'Tofu, firm', emoji: '🧈', category: 'Protein', perGram: { calories: 1.44, macros: { protein: 0.12, carbs: 0.033, fat: 0.083 } } },
  { id: 'tempeh', name: 'Tempeh', emoji: '🧈', category: 'Protein', perGram: { calories: 1.93, macros: { protein: 0.19, carbs: 0.092, fat: 0.11 } } },
  { id: 'quinoa', name: 'Quinoa, cooked', emoji: '🌾', category: 'Grain', perGram: { calories: 1.2, macros: { protein: 0.044, carbs: 0.21, fat: 0.019 } } },
  { id: 'pasta', name: 'Pasta, cooked', emoji: '🍝', category: 'Grain', perGram: { calories: 1.31, macros: { protein: 0.05, carbs: 0.25, fat: 0.011 } } },
  { id: 'tomato', name: 'Tomato', emoji: '🍅', category: 'Vegetable', perGram: { calories: 0.18, macros: { protein: 0.009, carbs: 0.039, fat: 0.002 } } },
  { id: 'cucumber', name: 'Cucumber', emoji: '🥒', category: 'Vegetable', perGram: { calories: 0.15, macros: { protein: 0.006, carbs: 0.036, fat: 0.001 } } },
  { id: 'olive-oil', name: 'Olive Oil', emoji: '🫒', category: 'Fat', perGram: { calories: 8.84, macros: { protein: 0, carbs: 0, fat: 1 } } },
  { id: 'protein-powder', name: 'Protein Powder', emoji: '💪', category: 'Supplement', perGram: { calories: 4.0, macros: { protein: 0.8, carbs: 0.08, fat: 0.05 } } },
  { id: 'dark-chocolate', name: 'Dark Chocolate 70%', emoji: '🍫', category: 'Snack', perGram: { calories: 5.98, macros: { protein: 0.078, carbs: 0.46, fat: 0.43 } } },
  { id: 'protein-bar', name: 'Protein Bar', emoji: '🍫', category: 'Snack', perGram: { calories: 3.72, macros: { protein: 0.32, carbs: 0.44, fat: 0.13 } } },
  { id: 'coffee-black', name: 'Black Coffee', emoji: '☕', category: 'Drink', perGram: { calories: 0.01, macros: { protein: 0, carbs: 0, fat: 0 } } },
  { id: 'hummus', name: 'Hummus', emoji: '🥙', category: 'Legume', perGram: { calories: 1.66, macros: { protein: 0.089, carbs: 0.14, fat: 0.095 } } },
  { id: 'pita', name: 'Pita Bread', emoji: '🫓', category: 'Grain', perGram: { calories: 2.75, macros: { protein: 0.091, carbs: 0.55, fat: 0.014 } } },
];

export const FOOD_CATEGORIES = [
  'Protein', 'Grain', 'Dairy', 'Fruit', 'Vegetable', 'Nuts', 'Legume', 'Snack', 'Fat', 'Supplement', 'Drink',
];

export function searchFoods(query: string): FoodItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return FOOD_DATABASE;
  return FOOD_DATABASE.filter((f) => f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q));
}

export function getFoodById(id: string): FoodItem | undefined {
  return FOOD_DATABASE.find((f) => f.id === id);
}
