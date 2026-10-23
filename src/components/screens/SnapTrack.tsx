import { useState, useRef, useCallback } from 'react';
import { Camera, Upload, X, Check, Loader2, AlertCircle, Plus, Trash2, Sparkles, ChevronLeft } from 'lucide-react';
import type { DetectedFood, AnalysisResult, MealType, DiaryEntry } from '@/types';
import {
  simulateAnalysisProgress,
  getDemoAnalysisResult,
  detectedToDiaryEntries,
  type AnalysisStage,
} from '@/services/mealAnalysis';
import { todayKey } from '@/services/storage';
import { Sheet } from '@/components/ui/Sheet';

interface SnapTrackProps {
  open: boolean;
  onClose: () => void;
  onAddToDiary: (entries: DiaryEntry[]) => void;
}

type Phase = 'capture' | 'preview' | 'analyzing' | 'results';

export function SnapTrack({ open, onClose, onAddToDiary }: SnapTrackProps) {
  const [phase, setPhase] = useState<Phase>('capture');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [progressLabel, setProgressLabel] = useState('');
  const [progressPct, setProgressPct] = useState(0);
  const [detected, setDetected] = useState<DetectedFood[]>([]);
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showManual, setShowManual] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const reset = useCallback(() => {
    setPhase('capture');
    setImagePreview(null);
    setProgressLabel('');
    setProgressPct(0);
    setDetected([]);
    setAdded(false);
    setError(null);
    setShowManual(false);
  }, []);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      setPhase('preview');
    };
    reader.onerror = () => setError('Could not read that image. Try another one.');
    reader.readAsDataURL(file);
  };

  const runAnalysis = async () => {
    setPhase('analyzing');
    setError(null);
    try {
      await simulateAnalysisProgress((evt) => {
        setProgressLabel(evt.label);
        setProgressPct(evt.progress);
      });
      const result: AnalysisResult = getDemoAnalysisResult();
      setDetected(result.detectedFoods);
      setPhase('results');
    } catch {
      setError('Something went wrong during analysis. Please try again.');
      setPhase('preview');
    }
  };

  const updateFood = (id: string, patch: Partial<DetectedFood>) => {
    setDetected((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  };

  const removeFood = (id: string) => {
    setDetected((prev) => prev.filter((f) => f.id !== id));
  };

  const totalCalories = detected.reduce((s, f) => s + f.perGram.calories * f.grams, 0);
  const totalProtein = detected.reduce((s, f) => s + f.perGram.macros.protein * f.grams, 0);
  const totalCarbs = detected.reduce((s, f) => s + f.perGram.macros.carbs * f.grams, 0);
  const totalFat = detected.reduce((s, f) => s + f.perGram.macros.fat * f.grams, 0);

  const confirmAdd = () => {
    const entries = detectedToDiaryEntries(detected, todayKey(), mealType);
    onAddToDiary(entries);
    setAdded(true);
    setTimeout(() => {
      handleClose();
    }, 1400);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-forest-950 flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-[env(safe-area-inset-top)] pb-3 border-b border-forest-700/50">
        <button onClick={handleClose} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-forest-800" aria-label="Back">
          {phase === 'results' ? <ChevronLeft size={22} /> : <X size={22} />}
        </button>
        <h2 className="font-display font-semibold text-lg flex-1">
          {phase === 'capture' && 'Snap & Track'}
          {phase === 'preview' && 'Review Photo'}
          {phase === 'analyzing' && 'Analyzing…'}
          {phase === 'results' && 'Detected Foods'}
        </h2>
        {phase === 'results' && (
          <span className="chip chip-on text-xs">
            <Sparkles size={12} /> DEMO
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* CAPTURE phase */}
        {phase === 'capture' && (
          <div className="p-5 flex flex-col items-center min-h-full">
            <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full">
              <div className="relative w-48 h-48 mb-8">
                <div className="absolute inset-0 rounded-full bg-lime-400/10 animate-pulse-ring" />
                <div className="relative h-full w-full rounded-full bg-forest-800 border-2 border-lime-400/40 flex items-center justify-center">
                  <Camera size={64} className="text-lime-400/60" />
                </div>
              </div>
              <h3 className="font-display text-xl font-bold text-center mb-2">Snap a photo of your meal</h3>
              <p className="text-sm text-gray-400 text-center mb-8 max-w-xs">
                Take a picture or upload one. Our AI estimates the food and nutrition for you.
              </p>

              {error && (
                <div className="w-full max-w-sm mb-4 flex items-center gap-2 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-sm">
                  <AlertCircle size={18} /> {error}
                </div>
              )}

              <div className="w-full max-w-sm space-y-3">
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="btn-primary w-full py-4 text-base"
                >
                  <Camera size={22} /> Take Photo
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-secondary w-full py-4 text-base"
                >
                  <Upload size={20} /> Upload Image
                </button>
                <button
                  onClick={() => setShowManual(true)}
                  className="btn-ghost w-full py-3 text-sm"
                >
                  Or log food manually
                </button>
              </div>
            </div>

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>
        )}

        {/* PREVIEW phase */}
        {phase === 'preview' && imagePreview && (
          <div className="p-5 flex flex-col items-center">
            <div className="w-full max-w-md">
              <div className="relative rounded-3xl overflow-hidden border border-forest-700 mb-5">
                <img src={imagePreview} alt="Meal preview" className="w-full h-72 object-cover" />
              </div>
              {error && (
                <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-sm">
                  <AlertCircle size={18} /> {error}
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={reset} className="btn-secondary flex-1 py-3.5">
                  <X size={20} /> Retake
                </button>
                <button onClick={runAnalysis} className="btn-primary flex-1 py-3.5">
                  <Sparkles size={20} /> Analyze Meal
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-4">
                Demo mode — results are simulated sample estimates, not real AI analysis.
              </p>
            </div>
          </div>
        )}

        {/* ANALYZING phase */}
        {phase === 'analyzing' && (
          <div className="p-5 flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative w-40 h-40 mb-8">
              <svg width="160" height="160" className="-rotate-90">
                <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="8" className="text-forest-700" />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="url(#analyzeGrad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 70}
                  strokeDashoffset={2 * Math.PI * 70 * (1 - progressPct)}
                  style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                />
                <defs>
                  <linearGradient id="analyzeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#aef84f" />
                    <stop offset="100%" stopColor="#6cc40c" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Loader2 size={28} className="text-lime-400 animate-spin mb-1" />
                <span className="text-xl font-bold font-display tabular-nums">{Math.round(progressPct * 100)}%</span>
              </div>
            </div>
            <p className="text-gray-300 font-medium animate-fade-in">{progressLabel}</p>
            <p className="text-xs text-gray-500 mt-2 max-w-xs text-center">
              Estimating portion sizes and nutrition. This is a demo simulation.
            </p>
          </div>
        )}

        {/* RESULTS phase */}
        {phase === 'results' && (
          <div className="p-4 pb-28 max-w-md mx-auto">
            {added ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="h-20 w-20 rounded-full bg-lime-400/20 flex items-center justify-center mb-4 animate-scale-in">
                  <Check size={40} className="text-lime-400" />
                </div>
                <h3 className="font-display text-xl font-bold mb-1">Added to your diary!</h3>
                <p className="text-sm text-gray-400">{detected.length} items logged to {mealType}.</p>
              </div>
            ) : detected.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <div className="h-16 w-16 rounded-full bg-forest-700 flex items-center justify-center mb-4">
                  <AlertCircle size={28} className="text-gray-400" />
                </div>
                <h3 className="font-display text-lg font-bold mb-1">No foods detected</h3>
                <p className="text-sm text-gray-400 mb-4 max-w-xs">Try another photo or add food manually.</p>
                <div className="flex gap-3">
                  <button onClick={reset} className="btn-secondary py-3 px-5">Try Again</button>
                  <button onClick={() => setShowManual(true)} className="btn-primary py-3 px-5">Add Manually</button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-lime-400/10 border border-lime-400/20">
                  <Sparkles size={16} className="text-lime-400 shrink-0" />
                  <p className="text-xs text-lime-300">
                    Demo estimates — simulated nutrition data for prototyping. Not real AI analysis.
                  </p>
                </div>

                {/* Meal type selector */}
                <p className="text-sm text-gray-400 mb-2">Add to which meal?</p>
                <div className="flex gap-2 mb-5 flex-wrap">
                  {(['breakfast', 'lunch', 'dinner', 'snacks'] as MealType[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMealType(m)}
                      className={mealType === m ? 'chip-on capitalize' : 'chip-off capitalize'}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                {/* Detected food cards */}
                <div className="space-y-3 mb-5">
                  {detected.map((food) => {
                    const cal = Math.round(food.perGram.calories * food.grams);
                    const p = Math.round(food.perGram.macros.protein * food.grams);
                    const c = Math.round(food.perGram.macros.carbs * food.grams);
                    const f = Math.round(food.perGram.macros.fat * food.grams);
                    return (
                      <div key={food.id} className="card p-4 animate-fade-in">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{food.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <input
                              value={food.name}
                              onChange={(e) => updateFood(food.id, { name: e.target.value })}
                              className="bg-transparent text-white font-semibold text-sm w-full focus:outline-none focus:text-lime-300"
                            />
                            <div className="flex items-center gap-2 mt-1">
                              <input
                                type="number"
                                value={food.grams}
                                min={0}
                                onChange={(e) => updateFood(food.id, { grams: Math.max(0, parseInt(e.target.value) || 0) })}
                                className="w-16 bg-forest-800 border border-forest-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-lime-400/50 tabular-nums"
                              />
                              <span className="text-xs text-gray-400">grams</span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFood(food.id)}
                            className="p-2 rounded-xl text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            aria-label="Remove food"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-forest-700/50">
                          <NutStat label="kcal" value={cal} />
                          <NutStat label="P" value={p} color="text-sky-300" />
                          <NutStat label="C" value={c} color="text-amber-300" />
                          <NutStat label="F" value={f} color="text-rose-300" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Totals */}
                <div className="card p-4 mb-4 bg-forest-800/80">
                  <p className="text-sm font-semibold text-gray-300 mb-3">Estimated Total</p>
                  <div className="grid grid-cols-4 gap-2">
                    <NutStat label="kcal" value={Math.round(totalCalories)} big />
                    <NutStat label="Protein" value={Math.round(totalProtein)} color="text-sky-300" big />
                    <NutStat label="Carbs" value={Math.round(totalCarbs)} color="text-amber-300" big />
                    <NutStat label="Fat" value={Math.round(totalFat)} color="text-rose-300" big />
                  </div>
                </div>

                {/* Add button */}
                <button onClick={confirmAdd} className="btn-primary w-full py-4 text-base fixed bottom-0 left-0 right-0 max-w-md mx-auto px-4 pb-[env(safe-area-inset-bottom)] bg-lime-400 rounded-none">
                  <Plus size={22} /> Add {detected.length} {detected.length === 1 ? 'item' : 'items'} to Diary
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Manual entry sheet */}
      <Sheet open={showManual} onClose={() => setShowManual(false)} title="Manual Entry">
        <ManualEntry
          onAdd={(name, grams, calories, macros) => {
            const entry: DiaryEntry = {
              id: `manual-${Date.now()}`,
              date: todayKey(),
              mealType,
              foodId: 'manual',
              foodName: name,
              emoji: '🍽️',
              grams,
              calories,
              macros,
            };
            onAddToDiary([entry]);
            setShowManual(false);
            handleClose();
          }}
        />
      </Sheet>
    </div>
  );
}

function NutStat({ label, value, color = 'text-white', big }: { label: string; value: number; color?: string; big?: boolean }) {
  return (
    <div className="text-center">
      <p className={`tabular-nums font-bold ${big ? 'text-lg' : 'text-sm'} ${color}`}>{value}</p>
      <p className="text-[10px] text-gray-500 uppercase tracking-wide">{label}</p>
    </div>
  );
}

function ManualEntry({ onAdd }: { onAdd: (name: string, grams: number, calories: number, macros: { protein: number; carbs: number; fat: number }) => void }) {
  const [name, setName] = useState('');
  const [grams, setGrams] = useState(100);
  const [calories, setCalories] = useState(200);
  const [protein, setProtein] = useState(15);
  const [carbs, setCarbs] = useState(25);
  const [fat, setFat] = useState(7);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-gray-400 mb-1.5 block">Food name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Homemade Tofu Curry" className="input" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-400 mb-1.5 block">Grams</label>
          <input type="number" value={grams} onChange={(e) => setGrams(parseInt(e.target.value) || 0)} className="input tabular-nums" />
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1.5 block">Calories</label>
          <input type="number" value={calories} onChange={(e) => setCalories(parseInt(e.target.value) || 0)} className="input tabular-nums" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-sm text-sky-300 mb-1.5 block">Protein (g)</label>
          <input type="number" value={protein} onChange={(e) => setProtein(parseInt(e.target.value) || 0)} className="input tabular-nums" />
        </div>
        <div>
          <label className="text-sm text-amber-300 mb-1.5 block">Carbs (g)</label>
          <input type="number" value={carbs} onChange={(e) => setCarbs(parseInt(e.target.value) || 0)} className="input tabular-nums" />
        </div>
        <div>
          <label className="text-sm text-rose-300 mb-1.5 block">Fat (g)</label>
          <input type="number" value={fat} onChange={(e) => setFat(parseInt(e.target.value) || 0)} className="input tabular-nums" />
        </div>
      </div>
      <button
        onClick={() => onAdd(name || 'Custom Food', grams, calories, { protein, carbs, fat })}
        disabled={!name.trim()}
        className="btn-primary w-full py-3.5"
      >
        <Plus size={20} /> Add to Diary
      </button>
    </div>
  );
}
