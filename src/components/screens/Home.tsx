import { Droplets, Plus, Minus, PlusCircle, UtensilsCrossed, Flame, Camera } from 'lucide-react';
import type { DiaryEntry, MealType, WaterLog } from '@/types';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { MacroBars } from '@/components/ui/MacroBar';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { DEFAULT_TARGETS } from '@/hooks/useDiary';
import { todayKey } from '@/services/storage';

interface HomeProps {
  totals: { calories: number; macros: { protein: number; carbs: number; fat: number } };
  water: WaterLog;
  byMealType: Record<MealType, DiaryEntry[]>;
  onAddWater: () => void;
  onRemoveWater: () => void;
  onSnapTrack: () => void;
  onAddFood: () => void;
  onMealPlans: () => void;
}

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snacks: 'Snacks',
};

export function Home({
  totals,
  water,
  byMealType,
  onAddWater,
  onRemoveWater,
  onSnapTrack,
  onAddFood,
  onMealPlans,
}: HomeProps) {
  const remaining = Math.max(0, DEFAULT_TARGETS.calories - totals.calories);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const dailyProgressPct = Math.min(100, (totals.calories / DEFAULT_TARGETS.calories) * 100);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Greeting */}
      <div className="pt-2">
        <p className="text-gray-400 text-sm">{greeting}, Alex</p>
        <h1 className="font-display text-2xl font-bold text-balance">Let's hit your goals.</h1>
      </div>

      {/* Calorie ring card */}
      <div className="card p-6 flex flex-col items-center">
        <ProgressRing
          value={totals.calories}
          max={DEFAULT_TARGETS.calories}
          size={200}
          label={`${totals.calories}`}
          sublabel={`of ${DEFAULT_TARGETS.calories} kcal`}
        />
        <div className="grid grid-cols-3 gap-4 w-full mt-5 pt-5 border-t border-forest-700/50">
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Eaten</p>
            <p className="text-lg font-bold text-white tabular-nums">{totals.calories}</p>
          </div>
          <div className="text-center border-x border-forest-700/50">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Remaining</p>
            <p className="text-lg font-bold text-lime-400 tabular-nums">{remaining}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Goal</p>
            <p className="text-lg font-bold text-white tabular-nums">{DEFAULT_TARGETS.calories}</p>
          </div>
        </div>
      </div>

      {/* Macro bars */}
      <div className="card p-5">
        <SectionHeader title="Macros" subtitle="Today's protein, carbs & fat" />
        <MacroBars macros={totals.macros} targets={DEFAULT_TARGETS.macros} />
      </div>

      {/* Water tracker */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-sky-400/15 flex items-center justify-center">
              <Droplets size={18} className="text-sky-300" />
            </div>
            <div>
              <p className="font-semibold">Water</p>
              <p className="text-xs text-gray-400">{water.glasses} of {DEFAULT_TARGETS.waterGlasses} glasses</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onRemoveWater} className="h-8 w-8 rounded-xl bg-forest-700 flex items-center justify-center text-gray-300 hover:bg-forest-600 active:scale-95" aria-label="Remove glass">
              <Minus size={16} />
            </button>
            <span className="font-bold text-lg w-8 text-center tabular-nums">{water.glasses}</span>
            <button onClick={onAddWater} className="h-8 w-8 rounded-xl bg-sky-400/20 flex items-center justify-center text-sky-300 hover:bg-sky-400/30 active:scale-95" aria-label="Add glass">
              <Plus size={16} />
            </button>
          </div>
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: DEFAULT_TARGETS.waterGlasses }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-8 rounded-lg transition-all duration-300 ${
                i < water.glasses ? 'bg-sky-400/80' : 'bg-forest-700/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={onAddFood} className="card card-hover p-4 text-left active:scale-[0.98] transition-transform">
          <div className="h-10 w-10 rounded-xl bg-lime-400/15 flex items-center justify-center mb-3">
            <PlusCircle size={20} className="text-lime-400" />
          </div>
          <p className="font-semibold">Add Food</p>
          <p className="text-xs text-gray-400 mt-0.5">Log manually</p>
        </button>
        <button onClick={onMealPlans} className="card card-hover p-4 text-left active:scale-[0.98] transition-transform">
          <div className="h-10 w-10 rounded-xl bg-amber-400/15 flex items-center justify-center mb-3">
            <UtensilsCrossed size={20} className="text-amber-300" />
          </div>
          <p className="font-semibold">Meal Plans</p>
          <p className="text-xs text-gray-400 mt-0.5">AI suggestions</p>
        </button>
      </div>

      {/* Today's meals */}
      <div>
        <SectionHeader title="Today's Meals" subtitle="Your logged food so far" />
        <div className="space-y-3">
          {(['breakfast', 'lunch', 'dinner', 'snacks'] as MealType[]).map((meal) => {
            const items = byMealType[meal];
            const mealCalories = items.reduce((s, e) => s + e.calories, 0);
            return (
              <div key={meal} className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-200">{MEAL_LABELS[meal]}</h3>
                  <span className="text-xs text-gray-400 tabular-nums">{mealCalories} kcal</span>
                </div>
                {items.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">Nothing logged yet</p>
                ) : (
                  <div className="space-y-1.5">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 text-sm">
                        <span className="text-lg">{item.emoji}</span>
                        <span className="text-gray-200 flex-1 truncate">{item.foodName}</span>
                        <span className="text-gray-400 tabular-nums">{item.grams}g</span>
                        <span className="text-gray-400 tabular-nums w-12 text-right">{item.calories}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily progress summary */}
      <div className="card p-5">
        <SectionHeader title="Daily Progress" subtitle="How you're doing today" />
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Flame size={16} className="text-lime-400" />
              <span className="text-sm text-gray-300">Calorie goal</span>
            </div>
            <div className="h-3 rounded-full bg-forest-700/50 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-lime-300 to-lime-500 transition-all duration-700"
                style={{ width: `${dailyProgressPct}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1.5 tabular-nums">{dailyProgressPct.toFixed(0)}% complete</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold font-display text-lime-400 tabular-nums">{dailyProgressPct.toFixed(0)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
