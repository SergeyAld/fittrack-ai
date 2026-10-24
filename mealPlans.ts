import type { MealPlanDay, MealPlanMeal, FitnessGoal, DietPreference } from '@/types';

const MEAL_LIBRARY: Record<MealPlanMeal['mealType'], Omit<MealPlanMeal, 'id' | 'mealType'>[]> = {
  breakfast: [
    { name: 'Greek Yogurt Power Bowl', emoji: '🥣', calories: 420, macros: { protein: 32, carbs: 48, fat: 11 }, ingredients: ['200g Greek yogurt', '40g oats', '100g blueberries', '15g almonds', '1 tsp honey'], prepMinutes: 5 },
    { name: 'Spinach Scramble Toast', emoji: '🍳', calories: 380, macros: { protein: 24, carbs: 34, fat: 16 }, ingredients: ['3 eggs', '50g spinach', '2 slices whole-wheat bread', '5g olive oil'], prepMinutes: 10 },
    { name: 'Protein Pancakes', emoji: '🥞', calories: 450, macros: { protein: 36, carbs: 52, fat: 12 }, ingredients: ['40g protein powder', '60g oats', '1 banana', '150ml milk', '1 egg'], prepMinutes: 12 },
    { name: 'Avocado Egg Toast', emoji: '🥑', calories: 410, macros: { protein: 20, carbs: 36, fat: 22 }, ingredients: ['2 eggs', '60g avocado', '2 slices whole-wheat bread', 'Pinch of salt & pepper'], prepMinutes: 8 },
    { name: 'Berry Chia Pudding', emoji: '🫐', calories: 350, macros: { protein: 14, carbs: 44, fat: 13 }, ingredients: ['40g chia seeds', '200ml milk', '100g blueberries', '10g honey'], prepMinutes: 5 },
  ],
  lunch: [
    { name: 'Grilled Chicken & Rice Bowl', emoji: '🍚', calories: 560, macros: { protein: 45, carbs: 62, fat: 14 }, ingredients: ['180g chicken breast', '150g white rice', '100g broccoli', '15g olive oil'], prepMinutes: 20 },
    { name: 'Salmon Quinoa Salad', emoji: '🐟', calories: 520, macros: { protein: 38, carbs: 45, fat: 18 }, ingredients: ['150g salmon', '120g quinoa', '100g spinach', '50g tomato', '10g olive oil'], prepMinutes: 22 },
    { name: 'Chickpea Buddha Bowl', emoji: '🥙', calories: 480, macros: { protein: 22, carbs: 68, fat: 14 }, ingredients: ['150g chickpeas', '100g brown rice', '100g spinach', '60g avocado', '20g hummus'], prepMinutes: 15 },
    { name: 'Turkey Wrap', emoji: '🌯', calories: 490, macros: { protein: 34, carbs: 48, fat: 16 }, ingredients: ['120g turkey', '1 pita', '60g spinach', '30g tomato', '15g olive oil'], prepMinutes: 10 },
    { name: 'Tempeh Stir-Fry', emoji: '🥘', calories: 530, macros: { protein: 30, carbs: 58, fat: 18 }, ingredients: ['150g tempeh', '120g brown rice', '100g broccoli', '100g sweet potato', '10g olive oil'], prepMinutes: 18 },
  ],
  dinner: [
    { name: 'Steak & Sweet Potato', emoji: '🥩', calories: 600, macros: { protein: 48, carbs: 50, fat: 20 }, ingredients: ['180g beef steak', '200g sweet potato', '100g spinach', '10g olive oil'], prepMinutes: 25 },
    { name: 'Tofu Coconut Curry', emoji: '🍛', calories: 540, macros: { protein: 28, carbs: 62, fat: 18 }, ingredients: ['150g tofu', '120g brown rice', '100g broccoli', '50g tomato', '15g olive oil'], prepMinutes: 20 },
    { name: 'Salmon Pasta', emoji: '🍝', calories: 620, macros: { protein: 40, carbs: 70, fat: 16 }, ingredients: ['150g salmon', '120g pasta', '100g spinach', '15g olive oil', '30g tomato'], prepMinutes: 22 },
    { name: 'Chicken Veggie Bake', emoji: '🍗', calories: 520, macros: { protein: 44, carbs: 44, fat: 16 }, ingredients: ['180g chicken breast', '200g sweet potato', '100g broccoli', '10g olive oil'], prepMinutes: 30 },
    { name: 'Mediterranean Chickpea Plate', emoji: '🥗', calories: 500, macros: { protein: 24, carbs: 60, fat: 16 }, ingredients: ['150g chickpeas', '60g pita', '100g spinach', '60g avocado', '50g cucumber'], prepMinutes: 12 },
  ],
  snacks: [
    { name: 'Apple & Almonds', emoji: '🌰', calories: 220, macros: { protein: 6, carbs: 30, fat: 11 }, ingredients: ['1 apple', '25g almonds'], prepMinutes: 2 },
    { name: 'Protein Shake', emoji: '💪', calories: 180, macros: { protein: 30, carbs: 8, fat: 4 }, ingredients: ['40g protein powder', '250ml milk'], prepMinutes: 3 },
    { name: 'Cottage Cheese & Berries', emoji: '🧀', calories: 200, macros: { protein: 22, carbs: 18, fat: 6 }, ingredients: ['150g cottage cheese', '100g blueberries'], prepMinutes: 2 },
    { name: 'Dark Chocolate Square', emoji: '🍫', calories: 150, macros: { protein: 3, carbs: 16, fat: 9 }, ingredients: ['25g dark chocolate'], prepMinutes: 0 },
    { name: 'Peanut Butter Toast', emoji: '🥜', calories: 260, macros: { protein: 10, carbs: 28, fat: 13 }, ingredients: ['20g peanut butter', '1 slice whole-wheat bread'], prepMinutes: 3 },
  ],
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

let mealIdCounter = 0;

function makeMeal(type: MealPlanMeal['mealType'], index: number): MealPlanMeal {
  const base = MEAL_LIBRARY[type][index % MEAL_LIBRARY[type].length];
  return {
    id: `plan-meal-${mealIdCounter++}`,
    mealType: type,
    ...base,
  };
}

function adjustForGoal(goal: FitnessGoal, meals: MealPlanMeal[]): MealPlanMeal[] {
  return meals.map((m) => ({ ...m }));
}

export function generateMealPlan(goal: FitnessGoal, _preference: DietPreference): MealPlanDay[] {
  return DAYS.map((day, dayIdx) => {
    const offset = (dayIdx * 2) % 5;
    const meals: MealPlanMeal[] = [
      makeMeal('breakfast', offset % 5),
      makeMeal('lunch', (offset + 1) % 5),
      makeMeal('dinner', (offset + 2) % 5),
      makeMeal('snacks', (offset + 3) % 5),
    ];
    const adjusted = adjustForGoal(goal, meals);
    const totalCalories = adjusted.reduce((s, m) => s + m.calories, 0);
    const totalMacros = adjusted.reduce(
      (acc, m) => ({
        protein: acc.protein + m.macros.protein,
        carbs: acc.carbs + m.macros.carbs,
        fat: acc.fat + m.macros.fat,
      }),
      { protein: 0, carbs: 0, fat: 0 },
    );
    return { day, totalCalories, totalMacros, meals: adjusted };
  });
}

export function generateReplacementMeal(mealType: MealPlanMeal['mealType'], currentIndex: number): MealPlanMeal {
  const nextIndex = (currentIndex + 1) % MEAL_LIBRARY[mealType].length;
  return makeMeal(mealType, nextIndex);
}

export function buildShoppingList(plan: MealPlanDay[]): string[] {
  const set = new Set<string>();
  plan.forEach((day) => day.meals.forEach((m) => m.ingredients.forEach((i) => set.add(i))));
  return Array.from(set).sort();
}

export const GOAL_ADJUSTMENTS: Record<FitnessGoal, { label: string; desc: string; targetCalories: number }> = {
  lose_fat: { label: 'Lose Fat', desc: 'Moderate calorie deficit, high protein', targetCalories: 1900 },
  maintain: { label: 'Maintain', desc: 'Balanced macros for steady energy', targetCalories: 2300 },
  build_muscle: { label: 'Build Muscle', desc: 'Slight surplus, high protein', targetCalories: 2700 },
};
