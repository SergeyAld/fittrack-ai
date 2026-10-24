import { useState } from 'react';
import { Activity, ArrowRight, UserRound, Mail, ShieldCheck, ChevronLeft, Dumbbell } from 'lucide-react';
import type { ActivityLevel, FitnessGoal } from '@/types';

export interface LocalAccount { id: string; name: string; email: string; createdAt: string; profile?: { age: number; heightCm: number; weightKg: number; fitnessGoal: FitnessGoal; activityLevel: ActivityLevel } }
interface AccountGateProps { onContinue: (account: LocalAccount) => void }
const ACCOUNTS_KEY = 'fittrack_local_accounts_v1';
const SESSION_KEY = 'fittrack_local_session_v1';
export function readAccounts(): LocalAccount[] { try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]') as LocalAccount[]; } catch { return []; } }
export function readSession(): LocalAccount | null { try { const id = localStorage.getItem(SESSION_KEY); return readAccounts().find(a => a.id === id) || null; } catch { return null; } }
export function AccountGate({ onContinue }: AccountGateProps) {
  const [mode, setMode] = useState<'create' | 'signin'>('create');
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [error, setError] = useState('');
  const [age, setAge] = useState(''); const [heightCm, setHeightCm] = useState(''); const [weightKg, setWeightKg] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>('maintain'); const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [accounts, setAccounts] = useState(readAccounts);
  const submit = (e: React.FormEvent) => { e.preventDefault(); setError(''); const normalizedEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) { setError('Enter a valid email address.'); return; }
    if (mode === 'create') { if (name.trim().length < 2) { setError('Enter a name with at least 2 characters.'); return; }
      if (accounts.some(a => a.email === normalizedEmail)) { setError('An account with this email already exists. Try signing in.'); return; }
      setStep(2); return;
    }
    const account = accounts.find(a => a.email === normalizedEmail); if (!account) { setError('No local profile found for that email. Create an account on this device first.'); return; }
    localStorage.setItem(SESSION_KEY, account.id); onContinue(account);
  };
  const finishCreate = () => { const normalizedEmail = email.trim().toLowerCase(); const account: LocalAccount = { id: crypto.randomUUID(), name: name.trim(), email: normalizedEmail, createdAt: new Date().toISOString(), profile: { age: Number(age) || 0, heightCm: Number(heightCm) || 0, weightKg: Number(weightKg) || 0, fitnessGoal, activityLevel } }; const next = [...accounts, account]; localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(next)); localStorage.setItem(SESSION_KEY, account.id); setAccounts(next); onContinue(account); };
  const useGuest = () => { const guest: LocalAccount = { id: 'guest-' + crypto.randomUUID(), name: 'Guest', email: '', createdAt: new Date().toISOString() }; localStorage.setItem(SESSION_KEY, guest.id); onContinue(guest); };
  const inputClass = 'w-full rounded-xl border border-[#2a3548] bg-[#080b12] px-3.5 py-3 text-sm text-white outline-none focus:border-[#399cff]';
  return <div className="min-h-screen bg-[#080b12] text-white flex items-center justify-center px-5 py-10"><div className="w-full max-w-md">
    <div className="flex justify-center mb-8"><div className="h-14 w-14 rounded-2xl bg-[#399cff]/15 border border-[#399cff]/30 flex items-center justify-center"><Activity size={30} className="text-[#399cff]" /></div></div>
    <div className="text-center mb-8"><p className="text-[#399cff] text-xs font-bold uppercase tracking-[0.24em] mb-3">TRAIN SMARTER. FEEL STRONGER.</p><h1 className="text-4xl font-black tracking-tight">FitTrack <span className="text-[#399cff]">AI</span></h1><p className="text-slate-400 mt-3">Your fitness journey, your way.</p></div>
    <div className="rounded-3xl border border-[#253044] bg-[#101520] p-6 shadow-2xl">
      {step === 1 ? <>
        <div className="grid grid-cols-2 rounded-xl bg-[#080b12] p-1 mb-6"><button type="button" onClick={() => {setMode('create');setError('');setStep(1)}} className={`rounded-lg py-2.5 text-sm font-semibold ${mode==='create'?'bg-[#399cff] text-[#06111f]':'text-slate-400'}`}>Create account</button><button type="button" onClick={() => {setMode('signin');setError('');setStep(1)}} className={`rounded-lg py-2.5 text-sm font-semibold ${mode==='signin'?'bg-[#399cff] text-[#06111f]':'text-slate-400'}`}>Sign in</button></div>
        <h2 className="text-xl font-bold mb-1">{mode==='create'?'Get started':'Welcome back'}</h2><p className="text-sm text-slate-400 mb-6">{mode==='create'?'First, let’s create your profile.':'Use the email for a profile saved on this device.'}</p>
        <form onSubmit={submit} className="space-y-4">{mode==='create' && <label className="block"><span className="text-sm text-slate-300 mb-2 block">Your name</span><span className="flex items-center gap-3 rounded-xl border border-[#2a3548] bg-[#080b12] px-3"><UserRound size={18} className="text-slate-500"/><input required minLength={2} value={name} onChange={e=>setName(e.target.value)} autoComplete="name" placeholder="What should we call you?" className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-slate-600" /></span></label>}
        <label className="block"><span className="text-sm text-slate-300 mb-2 block">Email address</span><span className="flex items-center gap-3 rounded-xl border border-[#2a3548] bg-[#080b12] px-3"><Mail size={18} className="text-slate-500"/><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-slate-600" /></span></label>
        {error && <p role="alert" className="text-sm text-red-400">{error}</p>}<button type="submit" className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#399cff] py-3.5 font-bold text-[#06111f] hover:bg-[#64b1ff]">{mode==='create'?'Continue to your goals':'Sign in'}<ArrowRight size={18}/></button></form>
        <button onClick={useGuest} className="w-full mt-3 rounded-xl border border-[#2a3548] py-3 text-sm font-semibold text-slate-300 hover:bg-white/5">Continue as guest</button>
      </> : <>
        <button onClick={() => setStep(1)} className="mb-4 flex items-center gap-1 text-sm text-slate-400 hover:text-white"><ChevronLeft size={16}/> Back</button>
        <div className="mb-5 flex items-center gap-3"><div className="rounded-xl bg-[#399cff]/15 p-3"><Dumbbell className="text-[#399cff]" size={22}/></div><div><h2 className="text-xl font-bold">Your fitness profile</h2><p className="text-sm text-slate-400">Personalize your starting point.</p></div></div>
        <div className="space-y-4">
          <div><label className="mb-2 block text-sm text-slate-300">What's your goal?</label><div className="grid grid-cols-1 gap-2">{([{v:'lose_fat',title:'Lose fat',desc:'Focus on healthy habits and fitness'},{v:'maintain',title:'Maintain',desc:'Stay consistent and feel good'},{v:'build_muscle',title:'Build muscle',desc:'Get stronger over time'}] as const).map(g=><button key={g.v} type="button" onClick={()=>setFitnessGoal(g.v)} className={`rounded-xl border p-3 text-left ${fitnessGoal===g.v?'border-[#399cff] bg-[#399cff]/10':'border-[#2a3548] bg-[#080b12]'}`}><span className="block text-sm font-semibold">{g.title}</span><span className="text-xs text-slate-400">{g.desc}</span></button>)}</div></div>
          <div><label className="mb-2 block text-sm text-slate-300">Activity level</label><select className={inputClass} value={activityLevel} onChange={e=>setActivityLevel(e.target.value as ActivityLevel)}><option value="sedentary">Mostly sitting</option><option value="light">Lightly active</option><option value="moderate">Moderately active</option><option value="active">Very active</option><option value="athlete">Athlete / intense training</option></select></div>
          <div className="grid grid-cols-3 gap-2"><label className="text-xs text-slate-400">Age (optional)<input className={`${inputClass} mt-2`} type="number" min="1" max="120" value={age} onChange={e=>setAge(e.target.value)} placeholder="Years" /></label><label className="text-xs text-slate-400">Height cm<input className={`${inputClass} mt-2`} type="number" min="40" max="250" value={heightCm} onChange={e=>setHeightCm(e.target.value)} placeholder="Optional" /></label><label className="text-xs text-slate-400">Weight kg<input className={`${inputClass} mt-2`} type="number" min="2" max="500" step="0.1" value={weightKg} onChange={e=>setWeightKg(e.target.value)} placeholder="Optional" /></label></div>
          <p className="text-xs leading-relaxed text-slate-500">All ages can use FitTrack AI. For younger users, we focus on strength, energy, balanced habits, and safe activity—not restrictive diets or aggressive weight-loss targets.</p>
          <button onClick={finishCreate} className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#399cff] py-3.5 font-bold text-[#06111f] hover:bg-[#64b1ff]">Create my profile<ArrowRight size={18}/></button>
        </div>
      </>}
      <div className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-slate-500"><ShieldCheck size={16} className="mt-0.5 shrink-0"/>Prototype profiles are stored in this browser on this device. This is not secure authentication and does not sync across devices.</div>
    </div></div></div>;
}
