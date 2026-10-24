export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export type FitnessGoal = 'lose_fat' | 'maintain' | 'build_muscle';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'athlete';

export type DietPreference =
  | 'balanced'
  | 'high_protein'
  | 'vegetarian'
  | 'vegan'
  | 'low_carb'
  | 'mediterranean';

export interface Macros {
  protein: number;
  carbs: number;
  fat: number;
}

export interface Nutrition {
  calories: number;
  macros: Macros;
}

export interface FoodItem {
  id: string;
  name: string;
  emoji: string;
  category: string;
  perGram: Nutrition;
}

export interface DiaryEntry {
  id: string;
  date: string;
  mealType: MealType;
  foodId: string;
  foodName: string;
  emoji: string;
  grams: number;
  calories: number;
  macros: Macros;
}

export interface DetectedFood {
  id: string;
  name: string;
  emoji: string;
  grams: number;
  perGram: Nutrition;
}

export interface AnalysisResult {
  detectedFoods: DetectedFood[];
  totalCalories: number;
  totalMacros: Macros;
}

export interface WaterLog {
  glasses: number;
}

export interface WeightEntry {
  date: string;
  weight: number;
}

export interface StreakDay {
  date: string;
  logged: boolean;
}

export interface UserSettings {
  name: string;
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  fitnessGoal: FitnessGoal;
  dietPreference: DietPreference;
  allergies: string[];
  weeklyBudgetEur: number;
  unit: 'metric' | 'imperial';
  notifications: {
    reminders: boolean;
    weeklyReport: boolean;
    goalUpdates: boolean;
  };
  isPro: boolean;
}

export interface DailyTargets {
  calories: number;
  macros: Macros;
  waterGlasses: number;
}

export interface MealPlanMeal {
  id: string;
  name: string;
  emoji: string;
  mealType: MealType;
  calories: number;
  macros: Macros;
  ingredients: string[];
  prepMinutes: number;
}

export interface MealPlanDay {
  day: string;
  totalCalories: number;
  totalMacros: Macros;
  meals: MealPlanMeal[];
}
