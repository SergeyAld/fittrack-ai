import { useState } from 'react';
import { Activity, ArrowRight, UserRound, Mail, ShieldCheck } from 'lucide-react';

export interface LocalAccount { id: string; name: string; email: string; createdAt: string }
interface AccountGateProps { onContinue: (account: LocalAccount) => void }
const ACCOUNTS_KEY = 'fittrack_local_accounts_v1';
const SESSION_KEY = 'fittrack_local_session_v1';
export function readAccounts(): LocalAccount[] {
  try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]') as LocalAccount[]; } catch { return []; }
}
export function readSession(): LocalAccount | null {
  try { const id = localStorage.getItem(SESSION_KEY); return readAccounts().find(a => a.id === id) || null; } catch { return null; }
}
export function AccountGate({ onContinue }: AccountGateProps) {
  const [mode, setMode] = useState<'create' | 'signin'>('create');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [accounts, setAccounts] = useState(readAccounts);
  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) { setError('Enter a valid email address.'); return; }
    if (mode === 'create') {
      if (name.trim().length < 2) { setError('Enter a name with at least 2 characters.'); return; }
      if (accounts.some(a => a.email === normalizedEmail)) { setError('An account with this email already exists. Try signing in.'); return; }
      const account = { id: crypto.randomUUID(), name: name.trim(), email: normalizedEmail, createdAt: new Date().toISOString() };
      const next = [...accounts, account]; localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(next)); localStorage.setItem(SESSION_KEY, account.id); setAccounts(next); onContinue(account);
    } else {
      const account = accounts.find(a => a.email === normalizedEmail);
      if (!account) { setError('No local profile found for that email. Create an account on this device first.'); return; }
      localStorage.setItem(SESSION_KEY, account.id); onContinue(account);
    }
  };
  const useGuest = () => { const guest = { id: 'guest-' + crypto.randomUUID(), name: 'Guest', email: '', createdAt: new Date().toISOString() }; localStorage.setItem(SESSION_KEY, guest.id); onContinue(guest); };
  return <div className="min-h-screen bg-[#080b12] text-white flex items-center justify-center px-5 py-10">
    <div className="w-full max-w-md">
      <div className="flex justify-center mb-8"><div className="h-14 w-14 rounded-2xl bg-[#399cff]/15 border border-[#399cff]/30 flex items-center justify-center"><Activity size={30} className="text-[#399cff]" /></div></div>
      <div className="text-center mb-8"><p className="text-[#399cff] text-xs font-bold uppercase tracking-[0.24em] mb-3">TRAIN SMARTER. FEEL STRONGER.</p><h1 className="text-4xl font-black tracking-tight">FitTrack <span className="text-[#399cff]">AI</span></h1><p className="text-slate-400 mt-3">Your fitness journey, your way.</p></div>
      <div className="rounded-3xl border border-[#253044] bg-[#101520] p-6 shadow-2xl">
        <div className="grid grid-cols-2 rounded-xl bg-[#080b12] p-1 mb-6"><button type="button" onClick={() => {setMode('create');setError('')}} className={`rounded-lg py-2.5 text-sm font-semibold ${mode==='create'?'bg-[#399cff] text-[#06111f]':'text-slate-400'}`}>Create account</button><button type="button" onClick={() => {setMode('signin');setError('')}} className={`rounded-lg py-2.5 text-sm font-semibold ${mode==='signin'?'bg-[#399cff] text-[#06111f]':'text-slate-400'}`}>Sign in</button></div>
        <h2 className="text-xl font-bold mb-1">{mode==='create'?'Get started':'Welcome back'}</h2><p className="text-sm text-slate-400 mb-6">{mode==='create'?'Create your profile to personalize the app.':'Use the email for a profile saved on this device.'}</p>
        <form onSubmit={submit} className="space-y-4">
          {mode==='create' && <label className="block"><span className="text-sm text-slate-300 mb-2 block">Your name</span><span className="flex items-center gap-3 rounded-xl border border-[#2a3548] bg-[#080b12] px-3"><UserRound size={18} className="text-slate-500"/><input value={name} onChange={e=>setName(e.target.value)} autoComplete="name" placeholder="What should we call you?" className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-slate-600" /></span></label>}
          <label className="block"><span className="text-sm text-slate-300 mb-2 block">Email address</span><span className="flex items-center gap-3 rounded-xl border border-[#2a3548] bg-[#080b12] px-3"><Mail size={18} className="text-slate-500"/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-slate-600" /></span></label>
          {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
          <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#399cff] py-3.5 font-bold text-[#06111f] hover:bg-[#64b1ff] transition-colors">{mode==='create'?'Create my profile':'Continue'}<ArrowRight size={18}/></button>
        </form>
        <button onClick={useGuest} className="w-full mt-3 rounded-xl border border-[#2a3548] py-3 text-sm font-semibold text-slate-300 hover:bg-white/5">Continue as guest</button>
        <div className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-slate-500"><ShieldCheck size={16} className="mt-0.5 shrink-0"/>Prototype account: profiles are saved only in this browser on this device. This is not secure authentication and does not sync across devices yet.</div>
      </div>
    </div>
  </div>;
}
