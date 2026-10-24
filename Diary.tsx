import { useState, useMemo } from 'react';
import { Search, Plus, Trash2, X, Camera } from 'lucide-react';
import type { DiaryEntry, MealType } from '@/types';
import { Sheet } from '@/components/ui/Sheet';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { searchFoods, FOOD_CATEGORIES } from '@/data/foods';
import { DEFAULT_TARGETS } from '@/hooks/useDiary';

interface DiaryProps {
  byMealType: Record<MealType, DiaryEntry[]>;
  totals: { calories: number; macros: { protein: number; carbs: number; fat: number } };
  onAddFood: (foodId: string, grams: number, mealType: MealType) => void;
  onRemoveEntry: (id: string) => void;
  onUpdateGrams: (id: string, grams: number) => void;
  onSnapTrack: () => void;
}

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snacks: 'Snacks',
};

const MEAL_ICONS: Record<MealType, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snacks: '🍿',
};

export function Diary({ byMealType, totals, onAddFood, onRemoveEntry, onUpdateGrams, onSnapTrack }: DiaryProps) {
  const [addingMeal, setAddingMeal] = useState<MealType | null>(null);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="pt-2 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Food Diary</h1>
          <p className="text-sm text-gray-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <button onClick={onSnapTrack} className="btn-primary px-4 py-2.5 text-sm">
          <Camera size={18} /> Snap
        </button>
      </div>

      {/* Daily totals summary */}
      <div className="card p-5">
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <p className="text-2xl font-bold font-display text-lime-400 tabular-nums">{totals.calories}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wide">kcal Eaten</p>
          </div>
          <div className="border-l border-forest-700/50">
            <p className="text-2xl font-bold font-display text-sky-300 tabular-nums">{totals.macros.protein}<span className="text-sm text-gray-500">g</span></p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wide">Protein</p>
          </div>
          <div className="border-l border-forest-700/50">
            <p className="text-2xl font-bold font-display text-amber-300 tabular-nums">{totals.macros.carbs}<span className="text-sm text-gray-500">g</span></p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wide">Carbs</p>
          </div>
          <div className="border-l border-forest-700/50">
            <p className="text-2xl font-bold font-display text-rose-300 tabular-nums">{totals.macros.fat}<span className="text-sm text-gray-500">g</span></p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wide">Fat</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-forest-700/50 flex items-center justify-between text-sm">
          <span className="text-gray-400">Remaining: <span className="text-lime-400 font-semibold">{Math.max(0, DEFAULT_TARGETS.calories - totals.calories)}</span> kcal</span>
          <span className="text-gray-500">Target: {DEFAULT_TARGETS.calories} kcal</span>
        </div>
      </div>

      {/* Meal sections */}
      {(['breakfast', 'lunch', 'dinner', 'snacks'] as MealType[]).map((meal) => {
        const items = byMealType[meal];
        const mealCalories = items.reduce((s, e) => s + e.calories, 0);
        const mealProtein = items.reduce((s, e) => s + e.macros.protein, 0);
        return (
          <div key={meal}>
            <SectionHeader
              title={`${MEAL_ICONS[meal]} ${MEAL_LABELS[meal]}`}
              subtitle={`${items.length} ${items.length === 1 ? 'item' : 'items'} · ${mealCalories} kcal · ${mealProtein}g protein`}
              action={
                <button
                  onClick={() => setAddingMeal(meal)}
                  className="h-9 w-9 rounded-xl bg-lime-400/15 flex items-center justify-center text-lime-400 hover:bg-lime-400/25 active:scale-95"
                  aria-label={`Add to ${MEAL_LABELS[meal]}`}
                >
                  <Plus size={20} />
                </button>
              }
            />
            <div className="space-y-2">
              {items.length === 0 ? (
                <div className="card p-4 text-center">
                  <p className="text-sm text-gray-500 italic">No food logged for {MEAL_LABELS[meal].toLowerCase()} yet</p>
                  <button onClick={() => setAddingMeal(meal)} className="mt-2 text-sm text-lime-400 font-medium hover:text-lime-300">
                    + Add food
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <FoodRow key={item.id} entry={item} onRemove={onRemoveEntry} onUpdateGrams={onUpdateGrams} />
                ))
              )}
            </div>
          </div>
        );
      })}

      <p className="text-xs text-gray-600 text-center pb-2">Sample data — nutrition values are demo estimates for prototyping.</p>

      {/* Add food sheet */}
      <Sheet open={addingMeal !== null} onClose={() => setAddingMeal(null)} title={`Add to ${addingMeal ? MEAL_LABELS[addingMeal] : ''}`}>
        {addingMeal && <AddFoodPanel mealType={addingMeal} onAdd={(foodId, grams) => { onAddFood(foodId, grams, addingMeal); setAddingMeal(null); }} />}
      </Sheet>
    </div>
  );
}

function FoodRow({ entry, onRemove, onUpdateGrams }: { entry: DiaryEntry; onRemove: (id: string) => void; onUpdateGrams: (id: string, grams: number) => void }) {
  const [editing, setEditing] = useState(false);
  const [gramInput, setGramInput] = useState(String(entry.grams));

  const saveGrams = () => {
    const g = Math.max(0, parseInt(gramInput) || 0);
    if (g > 0 && g !== entry.grams) onUpdateGrams(entry.id, g);
    else setGramInput(String(entry.grams));
    setEditing(false);
  };

  return (
    <div className="card p-3 flex items-center gap-3 animate-fade-in">
      <span className="text-xl shrink-0">{entry.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-white truncate">{entry.foodName}</p>
        <div className="flex items-center gap-3 mt-0.5">
          {editing ? (
            <input
              autoFocus
              type="number"
              value={gramInput}
              onChange={(e) => setGramInput(e.target.value)}
              onBlur={saveGrams}
              onKeyDown={(e) => { if (e.key === 'Enter') saveGrams(); }}
              className="w-16 bg-forest-800 border border-lime-400/40 rounded-md px-2 py-0.5 text-xs text-white focus:outline-none tabular-nums"
            />
          ) : (
            <button onClick={() => setEditing(true)} className="text-xs text-gray-400 hover:text-lime-300 tabular-nums">
              {entry.grams}g
            </button>
          )}
          <span className="text-xs text-sky-300 tabular-nums">P {entry.macros.protein}g</span>
          <span className="text-xs text-amber-300 tabular-nums">C {entry.macros.carbs}g</span>
          <span className="text-xs text-rose-300 tabular-nums">F {entry.macros.fat}g</span>
        </div>
      </div>
      <span className="text-sm font-semibold text-lime-400 tabular-nums shrink-0">{entry.calories}</span>
      <button onClick={() => onRemove(entry.id)} className="p-1.5 rounded-lg text-gray-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0" aria-label="Remove food">
        <Trash2 size={16} />
      </button>
    </div>
  );
}

function AddFoodPanel({ mealType, onAdd }: { mealType: MealType; onAdd: (foodId: string, grams: number) => void }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [grams, setGrams] = useState(100);

  const results = useMemo(() => {
    let list = searchFoods(query);
    if (category) list = list.filter((f) => f.category === category);
    return list.slice(0, 30);
  }, [query, category]);

  const selected = results.find((f) => f.id === selectedId);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search foods…"
          className="input pl-11"
          autoFocus
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <button onClick={() => setCategory(null)} className={category === null ? 'chip-on' : 'chip-off'}>
          All
        </button>
        {FOOD_CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setCategory(cat === category ? null : cat)} className={category === cat ? 'chip-on' : 'chip-off'}>
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
        {results.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">No foods found. Try a different search.</p>
        ) : (
          results.map((food) => (
            <button
              key={food.id}
              onClick={() => setSelectedId(food.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-colors text-left ${
                selectedId === food.id ? 'border-lime-400/50 bg-lime-400/10' : 'border-forest-700 bg-forest-800/50 hover:border-forest-600'
              }`}
            >
              <span className="text-xl">{food.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-white truncate">{food.name}</p>
                <p className="text-xs text-gray-500">{food.category} · {Math.round(food.perGram.calories * 100)} kcal/100g</p>
              </div>
              {selectedId === food.id && <X size={16} className="text-lime-400" />}
            </button>
          ))
        )}
      </div>

      {/* Grams + add */}
      {selected && (
        <div className="p-4 rounded-2xl bg-forest-800 border border-lime-400/20 space-y-3 animate-scale-in">
          <div className="flex items-center gap-2">
            <span className="text-lg">{selected.emoji}</span>
            <span className="font-medium text-sm flex-1">{selected.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-400">Portion</label>
            <input
              type="number"
              value={grams}
              onChange={(e) => setGrams(Math.max(0, parseInt(e.target.value) || 0))}
              className="input flex-1 tabular-nums py-2"
              min={0}
            />
            <span className="text-sm text-gray-400">g</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div><span className="font-bold text-lime-400 tabular-nums">{Math.round(selected.perGram.calories * grams)}</span><p className="text-gray-500">kcal</p></div>
            <div><span className="font-bold text-sky-300 tabular-nums">{Math.round(selected.perGram.macros.protein * grams)}g</span><p className="text-gray-500">Protein</p></div>
            <div><span className="font-bold text-amber-300 tabular-nums">{Math.round(selected.perGram.macros.carbs * grams)}g</span><p className="text-gray-500">Carbs</p></div>
            <div><span className="font-bold text-rose-300 tabular-nums">{Math.round(selected.perGram.macros.fat * grams)}g</span><p className="text-gray-500">Fat</p></div>
          </div>
          <button onClick={() => onAdd(selected.id, grams)} className="btn-primary w-full py-3">
            <Plus size={20} /> Add to {MEAL_LABELS[mealType]}
          </button>
        </div>
      )}
    </div>
  );
}
