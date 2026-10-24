import type { DiaryEntry, WaterLog, UserSettings, WeightEntry } from '@/types';

const KEYS = {
  diary: 'fittrack_diary',
  water: 'fittrack_water',
  settings: 'fittrack_settings',
  weight: 'fittrack_weight',
};

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or unavailable — silent fail in prototype
  }
}

export const storage = {
  getDiary(): DiaryEntry[] {
    return read<DiaryEntry[]>(KEYS.diary, []);
  },
  saveDiary(entries: DiaryEntry[]): void {
    write(KEYS.diary, entries);
  },

  getWater(): WaterLog {
    return read<WaterLog>(KEYS.water, { glasses: 0 });
  },
  saveWater(log: WaterLog): void {
    write(KEYS.water, log);
  },

  getSettings(): UserSettings | null {
    return read<UserSettings | null>(KEYS.settings, null);
  },
  saveSettings(settings: UserSettings): void {
    write(KEYS.settings, settings);
  },

  getWeightHistory(): WeightEntry[] {
    return read<WeightEntry[]>(KEYS.weight, []);
  },
  saveWeightHistory(history: WeightEntry[]): void {
    write(KEYS.weight, history);
  },
};
