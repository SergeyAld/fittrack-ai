import { useCallback, useMemo } from 'react';
import type { DiaryEntry, MealType, WaterLog, Macros, DailyTargets } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { FOOD_DATABASE } from '@/data/foods';
import { todayKey } from '@/services/storage';

const SAMPLE_ENTRIES: DiaryEntry[] = (() => {
  const today = todayKey();
  return [
    { id: 's1', date: today, mealType: 'breakfast', foodId: 'oats', foodName: 'Oats with Banana', emoji: '🥣', grams: 80, calories: 303, macros: { protein: 11, carbs: 54, fat: 5 } },
    { id: 's2', date: today, mealType: 'breakfast', foodId: 'greek-yogurt', foodName: 'Greek Yogurt', emoji: '🥛', grams: 150, calories: 90, macros: { protein: 15, carbs: 5, fat: 3 } },
    { id: 's3', date: today, mealType: 'lunch', foodId: 'chicken-breast', foodName: 'Chicken Breast', emoji: '🍗', grams: 160, calories: 264, macros: { protein: 50, carbs: 0, fat: 6 } },
    { id: 's4', date: today, mealType: 'lunch', foodId: 'brown-rice', foodName: 'Brown Rice', emoji: '🍚', grams: 140, calories: 172, macros: { protein: 4, carbs: 36, fat: 1 } },
    { id: 's5', date: today, mealType: 'snacks', foodId: 'almonds', foodName: 'Almonds', emoji: '🌰', grams: 20, calories: 116, macros: { protein: 4, carbs: 4, fat: 10 } },
  ];
})();

export const DEFAULT_TARGETS: DailyTargets = {
  calories: 2300,
  macros: { protein: 170, carbs: 250, fat: 75 },
  waterGlasses: 8,
};

function computeNutrition(foodId: string, grams: number) {
  const food = FOOD_DATABASE.find((f) => f.id === foodId);
  if (!food) return { calories: 0, macros: { protein: 0, carbs: 0, fat: 0 } };
  return {
    calories: Math.round(food.perGram.calories * grams),
    macros: {
      protein: Math.round(food.perGram.macros.protein * grams),
      carbs: Math.round(food.perGram.macros.carbs * grams),
      fat: Math.round(food.perGram.macros.fat * grams),
    },
  };
}

export function useDiary() {
  const [entries, setEntries] = useLocalStorage<DiaryEntry[]>('fittrack_diary_v2', SAMPLE_ENTRIES);
  const [water, setWater] = useLocalStorage<WaterLog>('fittrack_water_v2', { glasses: 3 });

  const today = todayKey();

  const todayEntries = useMemo(() => entries.filter((e) => e.date === today), [entries, today]);

  const byMealType = useMemo(() => {
    const groups: Record<MealType, DiaryEntry[]> = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: [],
    };
    todayEntries.forEach((e) => {
      groups[e.mealType].push(e);
    });
    return groups;
  }, [todayEntries]);

  const totals = useMemo(() => {
    return todayEntries.reduce(
      (acc, e) => ({
        calories: acc.calories + e.calories,
        macros: {
          protein: acc.macros.protein + e.macros.protein,
          carbs: acc.macros.carbs + e.macros.carbs,
          fat: acc.macros.fat + e.macros.fat,
        },
      }),
      { calories: 0, macros: { protein: 0, carbs: 0, fat: 0 } as Macros },
    );
  }, [todayEntries]);

  const addEntry = useCallback(
    (entry: Omit<DiaryEntry, 'id'>) => {
      const full: DiaryEntry = {
        ...entry,
        id: `entry-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      };
      setEntries((prev) => [...prev, full]);
      return full;
    },
    [setEntries],
  );

  const addFood = useCallback(
    (foodId: string, grams: number, mealType: MealType) => {
      const food = FOOD_DATABASE.find((f) => f.id === foodId);
      if (!food) return;
      const nut = computeNutrition(foodId, grams);
      addEntry({
        date: today,
        mealType,
        foodId,
        foodName: food.name,
        emoji: food.emoji,
        grams,
        calories: nut.calories,
        macros: nut.macros,
      });
    },
    [addEntry, today],
  );

  const updateGrams = useCallback(
    (id: string, grams: number) => {
      setEntries((prev) =>
        prev.map((e) => {
          if (e.id !== id) return e;
          const nut = computeNutrition(e.foodId, grams);
          return { ...e, grams, calories: nut.calories, macros: nut.macros };
        }),
      );
    },
    [setEntries],
  );

  const removeEntry = useCallback(
    (id: string) => {
      setEntries((prev) => prev.filter((e) => e.id !== id));
    },
    [setEntries],
  );

  const addEntries = useCallback(
    (newEntries: DiaryEntry[]) => {
      setEntries((prev) => [...prev, ...newEntries]);
    },
    [setEntries],
  );

  const addWater = useCallback(() => {
    setWater((w) => ({ glasses: w.glasses + 1 }));
  }, [setWater]);

  const removeWater = useCallback(() => {
    setWater((w) => ({ glasses: Math.max(0, w.glasses - 1) }));
  }, [setWater]);

  return {
    entries,
    todayEntries,
    byMealType,
    totals,
    water,
    addEntry,
    addFood,
    addEntries,
    updateGrams,
    removeEntry,
    addWater,
    removeWater,
  };
}
