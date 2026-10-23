import type { DetectedFood, AnalysisResult, DiaryEntry, MealType } from '@/types';

const DEMO_PATTERNS: DetectedFood[][] = [
  [
    { id: 'd1', name: 'Grilled Chicken Breast', emoji: '🍗', grams: 180, perGram: { calories: 1.65, macros: { protein: 0.31, carbs: 0, fat: 0.036 } } },
    { id: 'd2', name: 'Steamed Broccoli', emoji: '🥦', grams: 120, perGram: { calories: 0.34, macros: { protein: 0.028, carbs: 0.07, fat: 0.004 } } },
    { id: 'd3', name: 'White Rice', emoji: '🍚', grams: 150, perGram: { calories: 1.3, macros: { protein: 0.028, carbs: 0.28, fat: 0.003 } } },
    { id: 'd4', name: 'Olive Oil', emoji: '🫒', grams: 10, perGram: { calories: 8.84, macros: { protein: 0, carbs: 0, fat: 1 } } },
  ],
  [
    { id: 'd1', name: 'Greek Yogurt', emoji: '🥛', grams: 200, perGram: { calories: 0.6, macros: { protein: 0.1, carbs: 0.036, fat: 0.019 } } },
    { id: 'd2', name: 'Blueberries', emoji: '🫐', grams: 100, perGram: { calories: 0.57, macros: { protein: 0.007, carbs: 0.14, fat: 0.003 } } },
    { id: 'd3', name: 'Almonds', emoji: '🌰', grams: 25, perGram: { calories: 5.79, macros: { protein: 0.21, carbs: 0.22, fat: 0.5 } } },
  ],
  [
    { id: 'd1', name: 'Salmon Fillet', emoji: '🐟', grams: 160, perGram: { calories: 2.09, macros: { protein: 0.2, carbs: 0, fat: 0.13 } } },
    { id: 'd2', name: 'Quinoa', emoji: '🌾', grams: 130, perGram: { calories: 1.2, macros: { protein: 0.044, carbs: 0.21, fat: 0.019 } } },
    { id: 'd3', name: 'Spinach', emoji: '🥬', grams: 100, perGram: { calories: 0.23, macros: { protein: 0.029, carbs: 0.036, fat: 0.004 } } },
  ],
  [
    { id: 'd1', name: 'Whole Eggs', emoji: '🥚', grams: 120, perGram: { calories: 1.43, macros: { protein: 0.13, carbs: 0.007, fat: 0.095 } } },
    { id: 'd2', name: 'Avocado', emoji: '🥑', grams: 80, perGram: { calories: 1.6, macros: { protein: 0.02, carbs: 0.085, fat: 0.15 } } },
    { id: 'd3', name: 'Whole Wheat Toast', emoji: '🍞', grams: 70, perGram: { calories: 2.47, macros: { protein: 0.13, carbs: 0.41, fat: 0.033 } } },
  ],
  [
    { id: 'd1', name: 'Beef Steak', emoji: '🥩', grams: 200, perGram: { calories: 2.17, macros: { protein: 0.26, carbs: 0, fat: 0.11 } } },
    { id: 'd2', name: 'Sweet Potato', emoji: '🍠', grams: 220, perGram: { calories: 0.86, macros: { protein: 0.016, carbs: 0.2, fat: 0.001 } } },
    { id: 'd3', name: 'Olive Oil', emoji: '🫒', grams: 12, perGram: { calories: 8.84, macros: { protein: 0, carbs: 0, fat: 1 } } },
  ],
];

let patternIndex = Math.floor(Math.random() * DEMO_PATTERNS.length);

export type AnalysisStage = 'idle' | 'analyzing' | 'done' | 'error';

export interface AnalysisProgressEvent {
  label: string;
  progress: number;
}

export const ANALYSIS_STEPS: AnalysisProgressEvent[] = [
  { label: 'Scanning image…', progress: 0.15 },
  { label: 'Detecting food items…', progress: 0.4 },
  { label: 'Estimating portion sizes…', progress: 0.65 },
  { label: 'Calculating nutrition…', progress: 0.85 },
  { label: 'Finalizing results…', progress: 1 },
];

export function simulateAnalysisProgress(
  onProgress: (event: AnalysisProgressEvent) => void,
): Promise<void> {
  return new Promise((resolve) => {
    let step = 0;
    const tick = () => {
      if (step >= ANALYSIS_STEPS.length) {
        resolve();
        return;
      }
      onProgress(ANALYSIS_STEPS[step]);
      step++;
      const remaining = ANALYSIS_STEPS.length - step;
      if (remaining > 0) setTimeout(tick, 650 + Math.random() * 400);
      else setTimeout(tick, 500);
    };
    setTimeout(tick, 600);
  });
}

export function getDemoAnalysisResult(): AnalysisResult {
  patternIndex = (patternIndex + 1) % DEMO_PATTERNS.length;
  const detected = DEMO_PATTERNS[patternIndex].map((f) => ({ ...f, id: `${f.id}-${Date.now()}` }));
  const totalCalories = detected.reduce((s, f) => s + f.perGram.calories * f.grams, 0);
  const totalMacros = detected.reduce(
    (acc, f) => ({
      protein: acc.protein + f.perGram.macros.protein * f.grams,
      carbs: acc.carbs + f.perGram.macros.carbs * f.grams,
      fat: acc.fat + f.perGram.macros.fat * f.grams,
    }),
    { protein: 0, carbs: 0, fat: 0 },
  );
  return { detectedFoods: detected, totalCalories, totalMacros };
}

export function detectedToDiaryEntries(
  foods: DetectedFood[],
  date: string,
  mealType: MealType,
): DiaryEntry[] {
  return foods.map((f) => ({
    id: `entry-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    date,
    mealType,
    foodId: f.id,
    foodName: f.name,
    emoji: f.emoji,
    grams: f.grams,
    calories: Math.round(f.perGram.calories * f.grams),
    macros: {
      protein: Math.round(f.perGram.macros.protein * f.grams),
      carbs: Math.round(f.perGram.macros.carbs * f.grams),
      fat: Math.round(f.perGram.macros.fat * f.grams),
    },
  }));
}
