import { useState } from 'react';
import { Activity, ArrowRight, UserRound, Mail, ShieldCheck, ChevronLeft, Dumbbell } from 'lucide-react';
import type { ActivityLevel, FitnessGoal } from '@/types';

export interface AccountProfile {
  age: number;
  heightCm: number;
  weightKg: number;
  fitnessGoal: FitnessGoal;
  activityLevel: ActivityLevel;
  unit: 'metric' | 'imperial';
}
export interface LocalAccount { id: string; name: string; email: string; createdAt: string; profile?: AccountProfile }
interface AccountGateProps { onContinue: (account: LocalAccount) => void }

const ACCOUNTS_KEY = 'fittrack_local_accounts_v1';
const SESSION_KEY = 'fittrack_local_session_v1';

export function readAccounts(): LocalAccount[] {
  try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]') as LocalAccount[]; } catch { return []; }
}
export function readSession(): LocalAccount | null {
  try { const id = localStorage.getItem(SESSION_KEY); return readAccounts().find(a => a.id === id) || null; } catch { return null; }
}

const GOALS = [
  { v: 'lose_fat', title: 'Lose fat', desc: 'Build healthy habits and a gentle calorie deficit' },
  { v: 'maintain', title: 'Maintain', desc: 'Stay consistent and feel good' },
  { v: 'build_muscle', title: 'Build muscle', desc: 'Get stronger over time' },
] as const;

const ACTIVITY: { v: ActivityLevel; label: string }[] = [
  { v: 'sedentary', label: 'Mostly sitting (little exercise)' },
  { v: 'light', label: 'Lightly active (1-3 days/week)' },
  { v: 'moderate', label: 'Moderately active (3-5 days/week)' },
  { v: 'active', label: 'Very active (6-7 days/week)' },
  { v: 'athlete', label: 'Athlete (intense training)' },
];

const LB_PER_KG = 2.20462;
const CM_PER_IN = 2.54;

const inputClass = 'w-full rounded-xl border border-[#2a3548] bg-[#080b12] px-3.5 py-3 text-sm text-white outline-none focus:border-[#399cff] placeholder:text-slate-600';

export function AccountGate({ onContinue }: AccountGateProps) {
  const [mode, setMode] = useState<'create' | 'signin'>('create');
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [accounts, setAccounts] = useState(readAccounts);

  // Stats (kept as strings so the user can type freely)
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');   // cm, or inches when imperial
  const [weight, setWeight] = useState('');   // kg, or lb when imperial
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>('maintain');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');

  const saveAndEnter = (account: LocalAccount) => {
    const next = [...accounts, account];
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(next));
    localStorage.setItem(SESSION_KEY, account.id);
    setAccounts(next);
    onContinue(account);
  };

  const submitStep1 = (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) { setError('Enter a valid email address.'); return; }
    if (mode === 'create') {
      if (name.trim().length < 2) { setError('Enter a name with at least 2 characters.'); return; }
      if (accounts.some(a => a.email === normalizedEmail)) { setError('An account with this email already exists. Try signing in.'); return; }
      setStep(2);
      return;
    }
    const account = accounts.find(a => a.email === normalizedEmail);
    if (!account) { setError('No local profile found for that email. Create an account on this device first.'); return; }
    localStorage.setItem(SESSION_KEY, account.id);
    onContinue(account);
  };

  const baseAccount = (): LocalAccount => ({
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    createdAt: new Date().toISOString(),
  });

  const finishCreate = (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    const a = Number(age), h = Number(height), w = Number(weight);
    const heightCm = unit === 'metric' ? h : h * CM_PER_IN;
    const weightKg = unit === 'metric' ? w : w / LB_PER_KG;

    if (!age || !Number.isFinite(a) || a < 5 || a > 100) { setError('Enter an age between 5 and 100.'); return; }
    if (!height || !Number.isFinite(h) || heightCm < 90 || heightCm > 250) {
      setError(unit === 'metric' ? 'Enter a height between 90 and 250 cm.' : 'Enter a height between 36 and 98 inches.'); return;
    }
    if (!weight || !Number.isFinite(w) || weightKg < 20 || weightKg > 350) {
      setError(unit === 'metric' ? 'Enter a weight between 20 and 350 kg.' : 'Enter a weight between 44 and 770 lb.'); return;
    }

    saveAndEnter({
      ...baseAccount(),
      profile: {
        age: Math.round(a),
        heightCm: Math.round(heightCm),
        weightKg: Math.round(weightKg * 10) / 10,
        fitnessGoal, activityLevel, unit,
      },
    });
  };

  const skipStats = () => saveAndEnter(baseAccount());

  const useGuest = () => {
    const guest: LocalAccount = { id: 'guest-' + crypto.randomUUID(), name: 'Guest', email: '', createdAt: new Date().toISOString() };
    localStorage.setItem(SESSION_KEY, guest.id);
    onContinue(guest);
  };

  const switchUnit = (next: 'metric' | 'imperial') => {
    if (next === unit) return;
    // Convert whatever is already typed so the numbers stay meaningful
    const h = Number(height), w = Number(weight);
    if (height && Number.isFinite(h)) setHeight(String(next === 'imperial' ? Math.round(h / CM_PER_IN) : Math.round(h * CM_PER_IN)));
    if (weight && Number.isFinite(w)) setWeight(String(next === 'imperial' ? Math.round(w * LB_PER_KG) : Math.round(w / LB_PER_KG * 10) / 10));
    setUnit(next); setError('');
  };

  return (
    <div className="min-h-screen bg-[#080b12] text-white flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8"><div className="h-14 w-14 rounded-2xl bg-[#399cff]/15 border border-[#399cff]/30 flex items-center justify-center"><Activity size={30} className="text-[#399cff]" /></div></div>
        <div className="text-center mb-8">
          <p className="text-[#399cff] text-xs font-bold uppercase tracking-[0.24em] mb-3">TRAIN SMARTER. FEEL STRONGER.</p>
          <h1 className="text-4xl font-black tracking-tight">FitTrack <span className="text-[#399cff]">AI</span></h1>
          <p className="text-slate-400 mt-3">Your fitness journey, your way.</p>
        </div>

        <div className="rounded-3xl border border-[#253044] bg-[#101520] p-6 shadow-2xl">
          {step === 1 ? (
            <>
              <div className="grid grid-cols-2 rounded-xl bg-[#080b12] p-1 mb-6">
                <button type="button" onClick={() => { setMode('create'); setError(''); }} className={`rounded-lg py-2.5 text-sm font-semibold ${mode === 'create' ? 'bg-[#399cff] text-[#06111f]' : 'text-slate-400'}`}>Create account</button>
                <button type="button" onClick={() => { setMode('signin'); setError(''); }} className={`rounded-lg py-2.5 text-sm font-semibold ${mode === 'signin' ? 'bg-[#399cff] text-[#06111f]' : 'text-slate-400'}`}>Sign in</button>
              </div>
              <h2 className="text-xl font-bold mb-1">{mode === 'create' ? 'Get started' : 'Welcome back'}</h2>
              <p className="text-sm text-slate-400 mb-6">{mode === 'create' ? 'First, let’s create your profile.' : 'Use the email for a profile saved on this device.'}</p>
              <form onSubmit={submitStep1} className="space-y-4">
                {mode === 'create' && (
                  <label className="block">
                    <span className="text-sm text-slate-300 mb-2 block">Your name</span>
                    <span className="flex items-center gap-3 rounded-xl border border-[#2a3548] bg-[#080b12] px-3">
                      <UserRound size={18} className="text-slate-500" />
                      <input value={name} onChange={e => setName(e.target.value)} autoComplete="name" placeholder="What should we call you?" className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-slate-600" />
                    </span>
                  </label>
                )}
                <label className="block">
                  <span className="text-sm text-slate-300 mb-2 block">Email address</span>
                  <span className="flex items-center gap-3 rounded-xl border border-[#2a3548] bg-[#080b12] px-3">
                    <Mail size={18} className="text-slate-500" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-slate-600" />
                  </span>
                </label>
                {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
                <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#399cff] py-3.5 font-bold text-[#06111f] hover:bg-[#64b1ff] transition-colors">
                  {mode === 'create' ? 'Continue to your stats' : 'Sign in'}<ArrowRight size={18} />
                </button>
              </form>
              <button onClick={useGuest} className="w-full mt-3 rounded-xl border border-[#2a3548] py-3 text-sm font-semibold text-slate-300 hover:bg-white/5">Continue as guest</button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => { setStep(1); setError(''); }} className="mb-4 flex items-center gap-1 text-sm text-slate-400 hover:text-white"><ChevronLeft size={16} /> Back</button>
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-[#399cff]/15 p-3"><Dumbbell className="text-[#399cff]" size={22} /></div>
                <div><h2 className="text-xl font-bold">Your stats & goals</h2><p className="text-sm text-slate-400">Personalize your starting point.</p></div>
              </div>

              <form onSubmit={finishCreate} className="space-y-5">
                <div>
                  <span className="mb-2 block text-sm text-slate-300">Units</span>
                  <div className="grid grid-cols-2 rounded-xl bg-[#080b12] p-1">
                    <button type="button" onClick={() => switchUnit('metric')} className={`rounded-lg py-2 text-sm font-semibold ${unit === 'metric' ? 'bg-[#399cff] text-[#06111f]' : 'text-slate-400'}`}>Metric (kg, cm)</button>
                    <button type="button" onClick={() => switchUnit('imperial')} className={`rounded-lg py-2 text-sm font-semibold ${unit === 'imperial' ? 'bg-[#399cff] text-[#06111f]' : 'text-slate-400'}`}>Imperial (lb, in)</button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <label className="text-xs text-slate-400">Age
                    <input className={`${inputClass} mt-2`} type="number" inputMode="numeric" min="5" max="100" value={age} onChange={e => setAge(e.target.value)} placeholder="Years" />
                  </label>
                  <label className="text-xs text-slate-400">Height ({unit === 'metric' ? 'cm' : 'in'})
                    <input className={`${inputClass} mt-2`} type="number" inputMode="decimal" step="any" value={height} onChange={e => setHeight(e.target.value)} placeholder={unit === 'metric' ? '175' : '69'} />
                  </label>
                  <label className="text-xs text-slate-400">Weight ({unit === 'metric' ? 'kg' : 'lb'})
                    <input className={`${inputClass} mt-2`} type="number" inputMode="decimal" step="any" value={weight} onChange={e => setWeight(e.target.value)} placeholder={unit === 'metric' ? '75' : '165'} />
                  </label>
                </div>

                <div>
                  <span className="mb-2 block text-sm text-slate-300">What’s your goal?</span>
                  <div className="grid grid-cols-1 gap-2">
                    {GOALS.map(g => (
                      <button key={g.v} type="button" onClick={() => setFitnessGoal(g.v)} className={`rounded-xl border p-3 text-left ${fitnessGoal === g.v ? 'border-[#399cff] bg-[#399cff]/10' : 'border-[#2a3548] bg-[#080b12]'}`}>
                        <span className="block text-sm font-semibold">{g.title}</span>
                        <span className="text-xs text-slate-400">{g.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm text-slate-300">Activity level</span>
                  <select className={inputClass} value={activityLevel} onChange={e => setActivityLevel(e.target.value as ActivityLevel)}>
                    {ACTIVITY.map(o => <option key={o.v} value={o.v}>{o.label}</option>)}
                  </select>
                </label>

                <p className="text-xs leading-relaxed text-slate-500">For younger users we focus on strength, energy, and balanced habits, not restrictive diets or aggressive weight-loss targets.</p>
                {error && <p role="alert" className="text-sm text-red-400">{error}</p>}

                <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#399cff] py-3.5 font-bold text-[#06111f] hover:bg-[#64b1ff] transition-colors">Create my profile<ArrowRight size={18} /></button>
                <button type="button" onClick={skipStats} className="w-full text-center text-sm text-slate-400 hover:text-white">Skip for now, I’ll add them later</button>
              </form>
            </>
          )}
          <div className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-slate-500"><ShieldCheck size={16} className="mt-0.5 shrink-0" />Prototype profiles are stored in this browser on this device. This is not secure authentication and does not sync across devices.</div>
        </div>
      </div>
    </div>
  );
}
