import { useMemo } from 'react';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from 'recharts';
import { Flame, TrendingDown, Award, Target, Trophy } from 'lucide-react';
import type { WeightEntry } from '@/types';
import {
  WEEK_TREND, WEIGHT_HISTORY, generateStreak, currentStreak, GOAL_PROGRESS,
} from '@/data/progressData';
import { SectionHeader } from '@/components/ui/SectionHeader';

export function Progress() {
  const streak = useMemo(() => generateStreak(14), []);
  const streakCount = currentStreak(streak);

  const weightData = WEIGHT_HISTORY.map((w) => ({
    date: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: w.weight,
  }));

  const totalLost = (GOAL_PROGRESS.startWeight - GOAL_PROGRESS.currentWeight).toFixed(1);
  const goalPct = Math.min(100, ((GOAL_PROGRESS.startWeight - GOAL_PROGRESS.currentWeight) / (GOAL_PROGRESS.startWeight - GOAL_PROGRESS.targetWeight)) * 100);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="pt-2">
        <h1 className="font-display text-2xl font-bold">Progress</h1>
        <p className="text-sm text-gray-400">You're doing great — keep it up!</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card p-4">
          <div className="h-9 w-9 rounded-xl bg-lime-400/15 flex items-center justify-center mb-2">
            <TrendingDown size={18} className="text-lime-400" />
          </div>
          <p className="text-2xl font-bold font-display tabular-nums">{totalLost}kg</p>
          <p className="text-xs text-gray-400">Total lost</p>
        </div>
        <div className="card p-4">
          <div className="h-9 w-9 rounded-xl bg-amber-400/15 flex items-center justify-center mb-2">
            <Award size={18} className="text-amber-300" />
          </div>
          <p className="text-2xl font-bold font-display tabular-nums">{streakCount} days</p>
          <p className="text-xs text-gray-400">Logging streak</p>
        </div>
      </div>

      {/* Weight trend */}
      <div className="card p-5">
        <SectionHeader title="Weight Trend" subtitle="Last 7 weeks" />
        <div className="h-48 -ml-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weightData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
              <defs>
                <linearGradient id="weightLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#aef84f" />
                  <stop offset="100%" stopColor="#6cc40c" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#162e21" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} width={32} />
              <Line type="monotone" dataKey="weight" stroke="url(#weightLine)" strokeWidth={3} dot={{ fill: '#aef84f', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-forest-700/50 text-center">
          <div><p className="text-sm font-bold tabular-nums">{GOAL_PROGRESS.startWeight}kg</p><p className="text-[10px] text-gray-500">Start</p></div>
          <div><p className="text-sm font-bold text-lime-400 tabular-nums">{GOAL_PROGRESS.currentWeight}kg</p><p className="text-[10px] text-gray-500">Current</p></div>
          <div><p className="text-sm font-bold tabular-nums">{GOAL_PROGRESS.targetWeight}kg</p><p className="text-[10px] text-gray-500">Goal</p></div>
        </div>
      </div>

      {/* Calorie trend */}
      <div className="card p-5">
        <SectionHeader title="Weekly Calories" subtitle="Last 7 days" />
        <div className="h-44 -ml-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={WEEK_TREND} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
              <defs>
                <linearGradient id="calArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#aef84f" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#aef84f" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#162e21" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} width={32} />
              <Area type="monotone" dataKey="calories" stroke="#aef84f" strokeWidth={2.5} fill="url(#calArea)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Macro breakdown */}
      <div className="card p-5">
        <SectionHeader title="Macro Trends" subtitle="Protein, carbs & fat — 7 days" />
        <div className="h-44 -ml-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={WEEK_TREND} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#162e21" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} width={32} />
              <Bar dataKey="protein" fill="#38bdf8" radius={[4, 4, 0, 0]} maxBarSize={12} />
              <Bar dataKey="carbs" fill="#fbbf24" radius={[4, 4, 0, 0]} maxBarSize={12} />
              <Bar dataKey="fat" fill="#fb7185" radius={[4, 4, 0, 0]} maxBarSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-forest-700/50">
          <Legend color="bg-sky-400" label="Protein" />
          <Legend color="bg-amber-400" label="Carbs" />
          <Legend color="bg-rose-400" label="Fat" />
        </div>
      </div>

      {/* Logging streak grid */}
      <div className="card p-5">
        <SectionHeader title="Logging Streak" subtitle={`${streakCount} days in a row`} />
        <div className="grid grid-cols-7 gap-1.5">
          {streak.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className={`h-9 w-full rounded-lg flex items-center justify-center text-[10px] ${
                  day.logged ? 'bg-lime-400/80 text-forest-950 font-bold' : 'bg-forest-700/40 text-gray-600'
                }`}
              >
                {new Date(day.date).getDate()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Goal progress */}
      <div className="card p-5">
        <SectionHeader title="Goal Progress" subtitle="Weight loss journey" />
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 shrink-0">
            <svg width="80" height="80" className="-rotate-90">
              <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="8" className="text-forest-700" />
              <circle
                cx="40" cy="40" r="34" fill="none" stroke="#aef84f" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 34}
                strokeDashoffset={2 * Math.PI * 34 * (1 - goalPct / 100)}
                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold font-display text-lime-400 tabular-nums">{Math.round(goalPct)}%</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-300">
              {GOAL_PROGRESS.weeksIn} of {GOAL_PROGRESS.totalWeeks} weeks completed
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {(GOAL_PROGRESS.startWeight - GOAL_PROGRESS.currentWeight).toFixed(1)}kg down, {(GOAL_PROGRESS.currentWeight - GOAL_PROGRESS.targetWeight).toFixed(1)}kg to go
            </p>
          </div>
          <Trophy size={28} className="text-amber-400/80" />
        </div>
      </div>

      {/* Encouragement */}
      <div className="card p-5 bg-gradient-to-br from-lime-400/10 to-transparent border-lime-400/20">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-lime-400/20 flex items-center justify-center shrink-0">
            <Flame size={20} className="text-lime-400" />
          </div>
          <div>
            <p className="font-display font-semibold text-white">You're on a roll!</p>
            <p className="text-sm text-gray-300 mt-1">
              You've stayed consistent for {streakCount} days. Every logged meal is a step toward your goal. Keep showing up for yourself.
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-600 text-center pb-2">Demo data shown for prototyping.</p>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-3 w-3 rounded ${color}`} />
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  );
}
