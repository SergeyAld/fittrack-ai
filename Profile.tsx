import { useState } from 'react';
import { Check, ChevronRight, Crown, Bell, Shield, Ruler, LogOut } from 'lucide-react';
import type { UserSettings, ActivityLevel, FitnessGoal, DietPreference } from '@/types';
import { Sheet } from '@/components/ui/Sheet';
import { SectionHeader } from '@/components/ui/SectionHeader';

interface ProfileProps {
  settings: UserSettings;
  onUpdate: (settings: UserSettings) => void;
  onUpgrade: () => void;
  onSignOut: () => void;
}

const ACTIVITY_LEVELS: { id: ActivityLevel; label: string; desc: string }[] = [
  { id: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
  { id: 'light', label: 'Light', desc: '1-3 days/week' },
  { id: 'moderate', label: 'Moderate', desc: '3-5 days/week' },
  { id: 'active', label: 'Active', desc: '6-7 days/week' },
  { id: 'athlete', label: 'Athlete', desc: '2x per day' },
];

const GOALS: { id: FitnessGoal; label: string }[] = [
  { id: 'lose_fat', label: 'Lose Fat' },
  { id: 'maintain', label: 'Maintain' },
  { id: 'build_muscle', label: 'Build Muscle' },
];

const DIETS: { id: DietPreference; label: string }[] = [
  { id: 'balanced', label: 'Balanced' },
  { id: 'high_protein', label: 'High Protein' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'low_carb', label: 'Low Carb' },
  { id: 'mediterranean', label: 'Mediterranean' },
];

export function Profile({ settings, onUpdate, onUpgrade, onSignOut }: ProfileProps) {
  const [editing, setEditing] = useState<keyof UserSettings | null>(null);

  const patch = (p: Partial<UserSettings>) => onUpdate({ ...settings, ...p });

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="pt-2">
        <h1 className="font-display text-2xl font-bold">Profile & Settings</h1>
      </div>

      {/* Profile card */}
      <div className="card p-5 flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-lime-400 to-lime-600 flex items-center justify-center text-forest-950 font-bold text-2xl font-display shrink-0">
          {settings.name.charAt(0) || 'A'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-lg truncate">{settings.name || 'Athlete'}</p>
          <p className="text-sm text-gray-400">{settings.age} yrs · {settings.heightCm}cm · {settings.weightKg}kg</p>
        </div>
        {settings.isPro && (
          <span className="chip chip-on text-xs">
            <Crown size={12} /> PRO
          </span>
        )}
      </div>

      {/* Pro upgrade CTA */}
      {!settings.isPro && (
        <button onClick={onUpgrade} className="card card-hover p-4 w-full flex items-center gap-3 text-left">
          <div className="h-10 w-10 rounded-xl bg-lime-400/15 flex items-center justify-center">
            <Crown size={20} className="text-lime-400" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">Upgrade to FitTrack Pro</p>
            <p className="text-xs text-gray-400">Advanced analytics & AI coaching</p>
          </div>
          <ChevronRight size={18} className="text-gray-500" />
        </button>
      )}

      {/* Personal info */}
      <div>
        <SectionHeader title="Personal Info" />
        <div className="card divide-y divide-forest-700/50">
          <Row label="Name" value={settings.name} onClick={() => setEditing('name')} />
          <Row label="Age" value={`${settings.age} years`} onClick={() => setEditing('age')} />
          <Row label="Height" value={settings.unit === 'metric' ? `${settings.heightCm}cm` : `${Math.round(settings.heightCm * 0.3937)}in`} onClick={() => setEditing('heightCm')} />
          <Row label="Weight" value={settings.unit === 'metric' ? `${settings.weightKg}kg` : `${(settings.weightKg * 2.205).toFixed(1)}lb`} onClick={() => setEditing('weightKg')} />
        </div>
      </div>

      {/* Activity & Goals */}
      <div>
        <SectionHeader title="Fitness" />
        <div className="card divide-y divide-forest-700/50">
          <Row label="Activity Level" value={ACTIVITY_LEVELS.find((a) => a.id === settings.activityLevel)?.label || ''} onClick={() => setEditing('activityLevel')} />
          <Row label="Fitness Goal" value={GOALS.find((g) => g.id === settings.fitnessGoal)?.label || ''} onClick={() => setEditing('fitnessGoal')} />
          <Row label="Diet Preference" value={DIETS.find((d) => d.id === settings.dietPreference)?.label || ''} onClick={() => setEditing('dietPreference')} />
        </div>
      </div>

      {/* Preferences */}
      <div>
        <SectionHeader title="Preferences" />
        <div className="card divide-y divide-forest-700/50">
          <ToggleRow
            label="Measurement Units"
            value={settings.unit === 'metric' ? 'Metric (kg/cm)' : 'Imperial (lb/in)'}
            onToggle={() => patch({ unit: settings.unit === 'metric' ? 'imperial' : 'metric' })}
          />
        </div>
      </div>

      {/* Notifications */}
      <div>
        <SectionHeader title="Notifications" />
        <div className="card divide-y divide-forest-700/50">
          <ToggleRow
            label="Meal Reminders"
            icon={<Bell size={18} className="text-gray-400" />}
            onToggle={() => patch({ notifications: { ...settings.notifications, reminders: !settings.notifications.reminders } })}
            toggle={settings.notifications.reminders}
          />
          <ToggleRow
            label="Weekly Report"
            onToggle={() => patch({ notifications: { ...settings.notifications, weeklyReport: !settings.notifications.weeklyReport } })}
            toggle={settings.notifications.weeklyReport}
          />
          <ToggleRow
            label="Goal Updates"
            onToggle={() => patch({ notifications: { ...settings.notifications, goalUpdates: !settings.notifications.goalUpdates } })}
            toggle={settings.notifications.goalUpdates}
          />
        </div>
      </div>

      {/* Data & Privacy */}
      <div>
        <SectionHeader title="Data & Privacy" />
        <div className="card divide-y divide-forest-700/50">
          <button onClick={() => { if (confirm('Clear all locally stored diary and settings data?')) { localStorage.clear(); location.reload(); } }} className="w-full flex items-center gap-3 p-4 text-left hover:bg-forest-800/50 transition-colors">
            <Shield size={18} className="text-gray-400" />
            <span className="text-sm text-gray-200 flex-1">Clear local data</span>
            <ChevronRight size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 py-4">
        <button onClick={() => { if (confirm('Sign out of this local profile? Your saved data will remain on this device.')) onSignOut(); }} className="flex items-center gap-2 rounded-xl border border-[#2a3548] px-4 py-3 text-sm text-slate-300 hover:bg-white/5">
          <LogOut size={16} /> Sign out
        </button>
      </div>

      {/* Edit sheets */}
      <Sheet open={editing === 'name'} onClose={() => setEditing(null)} title="Edit Name">
        <input
          value={settings.name}
          onChange={(e) => patch({ name: e.target.value })}
          className="input"
          autoFocus
          placeholder="Your name"
        />
      </Sheet>

      <Sheet open={editing === 'age'} onClose={() => setEditing(null)} title="Edit Age">
        <input
          type="number"
          value={settings.age}
          onChange={(e) => patch({ age: Math.max(10, Math.min(120, parseInt(e.target.value) || 0)) })}
          className="input tabular-nums"
          autoFocus
        />
      </Sheet>

      <Sheet open={editing === 'heightCm'} onClose={() => setEditing(null)} title="Edit Height">
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={settings.heightCm}
            onChange={(e) => patch({ heightCm: Math.max(100, Math.min(250, parseInt(e.target.value) || 0)) })}
            className="input tabular-nums"
            autoFocus
          />
          <span className="text-gray-400">cm</span>
        </div>
      </Sheet>

      <Sheet open={editing === 'weightKg'} onClose={() => setEditing(null)} title="Edit Weight">
        <div className="flex items-center gap-3">
          <input
            type="number"
            step={0.1}
            value={settings.weightKg}
            onChange={(e) => patch({ weightKg: Math.max(30, Math.min(300, parseFloat(e.target.value) || 0)) })}
            className="input tabular-nums"
            autoFocus
          />
          <span className="text-gray-400">{settings.unit === 'metric' ? 'kg' : 'lb'}</span>
        </div>
      </Sheet>

      <Sheet open={editing === 'activityLevel'} onClose={() => setEditing(null)} title="Activity Level">
        <div className="space-y-2">
          {ACTIVITY_LEVELS.map((a) => (
            <button
              key={a.id}
              onClick={() => { patch({ activityLevel: a.id }); setEditing(null); }}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition-colors ${
                settings.activityLevel === a.id ? 'border-lime-400/50 bg-lime-400/10' : 'border-forest-700 hover:bg-forest-800'
              }`}
            >
              <div className="flex-1">
                <p className="font-medium text-sm text-white">{a.label}</p>
                <p className="text-xs text-gray-500">{a.desc}</p>
              </div>
              {settings.activityLevel === a.id && <Check size={18} className="text-lime-400" />}
            </button>
          ))}
        </div>
      </Sheet>

      <Sheet open={editing === 'fitnessGoal'} onClose={() => setEditing(null)} title="Fitness Goal">
        <div className="space-y-2">
          {GOALS.map((g) => (
            <button
              key={g.id}
              onClick={() => { patch({ fitnessGoal: g.id }); setEditing(null); }}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-colors ${
                settings.fitnessGoal === g.id ? 'border-lime-400/50 bg-lime-400/10' : 'border-forest-700 hover:bg-forest-800'
              }`}
            >
              <span className="font-medium text-sm text-white">{g.label}</span>
              {settings.fitnessGoal === g.id && <Check size={18} className="text-lime-400" />}
            </button>
          ))}
        </div>
      </Sheet>

      <Sheet open={editing === 'dietPreference'} onClose={() => setEditing(null)} title="Diet Preference">
        <div className="space-y-2">
          {DIETS.map((d) => (
            <button
              key={d.id}
              onClick={() => { patch({ dietPreference: d.id }); setEditing(null); }}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-colors ${
                settings.dietPreference === d.id ? 'border-lime-400/50 bg-lime-400/10' : 'border-forest-700 hover:bg-forest-800'
              }`}
            >
              <span className="font-medium text-sm text-white">{d.label}</span>
              {settings.dietPreference === d.id && <Check size={18} className="text-lime-400" />}
            </button>
          ))}
        </div>
      </Sheet>
    </div>
  );
}

function Row({ label, value, onClick }: { label: string; value: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between p-4 text-left hover:bg-forest-800/50 transition-colors">
      <span className="text-sm text-gray-400">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm text-white font-medium">{value}</span>
        <ChevronRight size={16} className="text-gray-600" />
      </div>
    </button>
  );
}

function ToggleRow({ label, value, icon, toggle, onToggle }: { label: string; value?: string; icon?: React.ReactNode; toggle?: boolean; onToggle: () => void }) {
  return (
    <div className="w-full flex items-center gap-3 p-4">
      {icon}
      <div className="flex-1">
        <p className="text-sm text-gray-200">{label}</p>
        {value && <p className="text-xs text-gray-500 mt-0.5">{value}</p>}
      </div>
      <button
        onClick={onToggle}
        className={`relative h-6 w-11 rounded-full transition-colors shrink-0 ${toggle ? 'bg-lime-400' : 'bg-forest-600'}`}
        role="switch"
        aria-checked={toggle}
        aria-label={label}
      >
        <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${toggle ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  );
}
