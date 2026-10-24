import { useState, useMemo } from 'react';
import { RefreshCw, ChevronRight, ShoppingCart, Clock, Sparkles, Check } from 'lucide-react';
import type { FitnessGoal, DietPreference, MealPlanDay, MealPlanMeal } from '@/types';
import { generateMealPlan, generateReplacementMeal, buildShoppingList, GOAL_ADJUSTMENTS } from '@/data/mealPlans';
import { Sheet } from '@/components/ui/Sheet';
import { SectionHeader } from '@/components/ui/SectionHeader';

const GOALS: { id: FitnessGoal; label: string; desc: string }[] = [
  { id: 'lose_fat', label: 'Lose Fat', desc: 'Calorie deficit' },
  { id: 'maintain', label: 'Maintain', desc: 'Balanced energy' },
  { id: 'build_muscle', label: 'Build Muscle', desc: 'Calorie surplus' },
];

const DIETS: { id: DietPreference; label: string }[] = [
  { id: 'balanced', label: 'Balanced' },
  { id: 'high_protein', label: 'High Protein' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'low_carb', label: 'Low Carb' },
  { id: 'mediterranean', label: 'Mediterranean' },
];

const ALLERGENS = ['Gluten', 'Dairy', 'Nuts', 'Eggs', 'Soy', 'Shellfish', 'Peanuts'];

const BUDGET_OPTIONS = [
  { value: 40, label: '€40/week' },
  { value: 60, label: '€60/week' },
  { value: 80, label: '€80/week' },
  { value: 120, label: '€120/week' },
];

export function MealPlans() {
  const [goal, setGoal] = useState<FitnessGoal>('lose_fat');
  const [diet, setDiet] = useState<DietPreference>('balanced');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [budget, setBudget] = useState(60);
  const [showShopping, setShowShopping] = useState(false);

  const plan = useMemo(() => generateMealPlan(goal, diet), [goal, diet]);

  const [selectedDay, setSelectedDay] = useState(0);
  const dayPlan = plan[selectedDay];

  const replaceMeal = (mealIndex: number) => {
    const oldMeal = dayPlan.meals[mealIndex];
    const newMeal = generateReplacementMeal(oldMeal.mealType, mealIndex);
    const newMeals = [...dayPlan.meals];
    newMeals[mealIndex] = newMeal;
    const newTotalCalories = newMeals.reduce((s, m) => s + m.calories, 0);
    const newTotalMacros = newMeals.reduce(
      (acc, m) => ({ protein: acc.protein + m.macros.protein, carbs: acc.carbs + m.macros.carbs, fat: acc.fat + m.macros.fat }),
      { protein: 0, carbs: 0, fat: 0 },
    );
    plan[selectedDay] = { ...dayPlan, meals: newMeals, totalCalories: newTotalCalories, totalMacros: newTotalMacros };
    // Force re-render via state toggle
    setSelectedDay(selectedDay);
  };

  const shoppingList = useMemo(() => buildShoppingList(plan), [plan]);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="pt-2">
        <h1 className="font-display text-2xl font-bold">AI Meal Planner</h1>
        <p className="text-sm text-gray-400">Personalized plans based on your goals</p>
      </div>

      {/* Goal selector */}
      <div>
        <SectionHeader title="Fitness Goal" />
        <div className="grid grid-cols-3 gap-3">
          {GOALS.map((g) => (
            <button
              key={g.id}
              onClick={() => setGoal(g.id)}
              className={`card p-4 text-left transition-all ${goal === g.id ? 'border-lime-400/50 bg-lime-400/10' : 'card-hover'}`}
            >
              <p className={`font-semibold text-sm ${goal === g.id ? 'text-lime-300' : 'text-white'}`}>{g.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{g.desc}</p>
              <p className="text-xs text-gray-400 mt-2 tabular-nums">{GOAL_ADJUSTMENTS[g.id].targetCalories} kcal</p>
            </button>
          ))}
        </div>
      </div>

      {/* Diet preference */}
      <div>
        <SectionHeader title="Dietary Preference" />
        <div className="flex gap-2 flex-wrap">
          {DIETS.map((d) => (
            <button key={d.id} onClick={() => setDiet(d.id)} className={diet === d.id ? 'chip-on' : 'chip-off'}>
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Allergies */}
      <div>
        <SectionHeader title="Allergies & Restrictions" subtitle="Tap to exclude ingredients" />
        <div className="flex gap-2 flex-wrap">
          {ALLERGENS.map((a) => {
            const active = allergies.includes(a);
            return (
              <button
                key={a}
                onClick={() => setAllergies((prev) => (active ? prev.filter((x) => x !== a) : [...prev, a]))}
                className={active ? 'chip-on' : 'chip-off'}
              >
                {active && <Check size={14} />} {a}
              </button>
            );
          })}
        </div>
      </div>

      {/* Budget */}
      <div>
        <SectionHeader title="Weekly Food Budget" subtitle={`Selected: €${budget}/week`} />
        <div className="grid grid-cols-4 gap-2">
          {BUDGET_OPTIONS.map((b) => (
            <button key={b.value} onClick={() => setBudget(b.value)} className={budget === b.value ? 'chip-on' : 'chip-off'}>
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Day selector */}
      <div className="pt-2">
        <SectionHeader title="Weekly Plan" subtitle="7 days of meals" />
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {plan.map((day, i) => (
            <button
              key={i}
              onClick={() => setSelectedDay(i)}
              className={`shrink-0 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                selectedDay === i ? 'bg-lime-400 text-forest-950' : 'bg-forest-800 text-gray-400 border border-forest-700'
              }`}
            >
              {day.day.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* Day plan detail */}
      <div className="space-y-3">
        <div className="card p-4 bg-forest-800/60">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg">{dayPlan.day}</h3>
            <div className="text-right">
              <p className="text-lg font-bold text-lime-400 tabular-nums">{dayPlan.totalCalories} kcal</p>
              <p className="text-xs text-gray-400">P{dayPlan.totalMacros.protein}g · C{dayPlan.totalMacros.carbs}g · F{dayPlan.totalMacros.fat}g</p>
            </div>
          </div>
        </div>

        {dayPlan.meals.map((meal, idx) => (
          <MealCard key={meal.id} meal={meal} onReplace={() => replaceMeal(idx)} />
        ))}
      </div>

      {/* Shopping list button */}
      <button onClick={() => setShowShopping(true)} className="btn-secondary w-full py-3.5">
        <ShoppingCart size={20} /> View Shopping List ({shoppingList.length})
      </button>

      <div className="flex items-center gap-2 p-3 rounded-xl bg-lime-400/10 border border-lime-400/20 mb-2">
        <Sparkles size={14} className="text-lime-400 shrink-0" />
        <p className="text-xs text-lime-300">Demo plans generated from local sample data — not medical or dietary advice.</p>
      </div>

      <Sheet open={showShopping} onClose={() => setShowShopping(false)} title="Shopping List">
        <div className="space-y-2">
          {shoppingList.map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-forest-800/60 border border-forest-700">
              <div className="h-5 w-5 rounded-md border-2 border-forest-600 shrink-0" />
              <span className="text-sm text-gray-200">{item}</span>
            </div>
          ))}
        </div>
      </Sheet>
    </div>
  );
}

function MealCard({ meal, onReplace }: { meal: MealPlanMeal; onReplace: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center gap-3 p-4 text-left">
        <span className="text-2xl shrink-0">{meal.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-white">{meal.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {meal.calories} kcal · P{meal.macros.protein}g · C{meal.macros.carbs}g · F{meal.macros.fat}g
          </p>
        </div>
        <ChevronRight size={18} className={`text-gray-500 transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-3 animate-fade-in">
          <div className="pt-2 border-t border-forest-700/50">
            <p className="text-xs text-gray-500 mb-1.5 flex items-center gap-1.5"><Clock size={12} /> {meal.prepMinutes} min prep</p>
            <p className="text-xs font-semibold text-gray-400 mb-1.5">Ingredients</p>
            <ul className="space-y-1">
              {meal.ingredients.map((ing, i) => (
                <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-lime-400/60" /> {ing}
                </li>
              ))}
            </ul>
          </div>
          <button onClick={onReplace} className="btn-ghost w-full py-2.5 text-sm border border-forest-700">
            <RefreshCw size={16} /> Replace this meal
          </button>
        </div>
      )}
    </div>
  );
}
