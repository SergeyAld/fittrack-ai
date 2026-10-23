import type { WeightEntry, StreakDay } from '@/types';

export const WEIGHT_HISTORY: WeightEntry[] = [
  { date: '2026-09-11', weight: 82.4 },
  { date: '2026-09-18', weight: 82.0 },
  { date: '2026-09-25', weight: 81.3 },
  { date: '2026-10-02', weight: 80.8 },
  { date: '2026-10-09', weight: 80.5 },
  { date: '2026-10-16', weight: 80.1 },
  { date: '2026-10-23', weight: 79.6 },
];

export const CALORIE_TREND: number[] = [2150, 1980, 2240, 1870, 2020, 2310, 2050];
export const PROTEIN_TREND: number[] = [145, 160, 138, 172, 155, 168, 180];
export const CARB_TREND: number[] = [210, 195, 240, 180, 200, 225, 198];
export const FAT_TREND: number[] = [70, 62, 78, 58, 65, 72, 60];

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const WEEK_TREND = CALORIE_TREND.map((cal, i) => ({
  day: DAY_LABELS[i],
  calories: cal,
  protein: PROTEIN_TREND[i],
  carbs: CARB_TREND[i],
  fat: FAT_TREND[i],
}));

export function generateStreak(days: number): StreakDay[] {
  const result: StreakDay[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    result.push({
      date: d.toISOString().slice(0, 10),
      logged: i > 1,
    });
  }
  return result;
}

export const GOAL_PROGRESS = {
  startWeight: 84,
  currentWeight: 79.6,
  targetWeight: 76,
  weeksIn: 6,
  totalWeeks: 12,
};

export function currentStreak(streak: StreakDay[]): number {
  let count = 0;
  for (let i = streak.length - 1; i >= 0; i--) {
    if (streak[i].logged) count++;
    else break;
  }
  return count;
}
