import type { Macros } from '@/types';

interface MacroBarProps {
  label: string;
  value: number;
  target: number;
  unit?: string;
  color: 'protein' | 'carbs' | 'fat';
}

const COLOR_MAP = {
  protein: { bar: 'bg-sky-400', text: 'text-sky-300', soft: 'bg-sky-400/15' },
  carbs: { bar: 'bg-amber-400', text: 'text-amber-300', soft: 'bg-amber-400/15' },
  fat: { bar: 'bg-rose-400', text: 'text-rose-300', soft: 'bg-rose-400/15' },
};

export function MacroBar({ label, value, target, unit = 'g', color }: MacroBarProps) {
  const c = COLOR_MAP[color];
  const pct = Math.min(100, target > 0 ? (value / target) * 100 : 0);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-300">{label}</span>
        <span className="text-gray-400 tabular-nums">
          {value}
          <span className="text-gray-500"> / {target}{unit}</span>
        </span>
      </div>
      <div className={`h-2 rounded-full ${c.soft}`}>
        <div
          className={`h-full rounded-full ${c.bar} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function MacroBars({ macros, targets }: { macros: Macros; targets: Macros }) {
  return (
    <div className="space-y-4">
      <MacroBar label="Protein" value={macros.protein} target={targets.protein} color="protein" />
      <MacroBar label="Carbs" value={macros.carbs} target={targets.carbs} color="carbs" />
      <MacroBar label="Fat" value={macros.fat} target={targets.fat} color="fat" />
    </div>
  );
}
