import { useState } from 'react';
import { Check, Crown, X, Zap, BarChart3, Brain, Sparkles } from 'lucide-react';

interface UpgradeProps {
  open: boolean;
  onClose: () => void;
  onSubscribe: () => void;
  isPro: boolean;
}

const FREE_FEATURES = [
  { label: 'Food diary', included: true },
  { label: 'Calorie tracking', included: true },
  { label: 'Macro tracking', included: true },
  { label: 'Meal scanning (limited demo)', included: true },
  { label: 'Basic progress charts', included: true },
  { label: 'Advanced analytics', included: false },
  { label: 'Expanded meal planning', included: false },
  { label: 'AI coaching', included: false },
];

const PRO_FEATURES = [
  { icon: BarChart3, title: 'Advanced Analytics', desc: 'Deep insights into trends, patterns and long-term progress' },
  { icon: Zap, title: 'Expanded Meal Planning', desc: 'Unlimited AI-generated plans with smart substitutions' },
  { icon: Brain, title: 'AI Coaching', desc: 'Personalized recommendations and adaptive goal tracking' },
  { icon: Sparkles, title: 'Priority Meal Scanning', desc: 'Unlimited photo analysis with faster response times' },
];

export function Upgrade({ open, onClose, onSubscribe, isPro }: UpgradeProps) {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-forest-950/95 backdrop-blur-sm flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-[env(safe-area-inset-top)] pb-3 border-b border-forest-700/50">
        <h2 className="font-display font-semibold text-lg">FitTrack Pro</h2>
        <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-forest-800" aria-label="Close">
          <X size={22} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar max-w-md mx-auto w-full px-4 py-5 pb-8">
        {isPro ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="h-20 w-20 rounded-full bg-lime-400/20 flex items-center justify-center mb-4">
              <Crown size={40} className="text-lime-400" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-2">You're a Pro member!</h3>
            <p className="text-sm text-gray-400 max-w-xs">Enjoy unlimited access to all FitTrack AI features.</p>
            <button onClick={onClose} className="btn-primary mt-6 px-8 py-3">Back to app</button>
          </div>
        ) : (
          <>
            {/* Hero */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-lime-400 to-lime-600 mb-4">
                <Crown size={32} className="text-forest-950" />
              </div>
              <h1 className="font-display text-3xl font-bold mb-2">Unlock FitTrack Pro</h1>
              <p className="text-gray-400 text-sm max-w-xs mx-auto">
                Take your nutrition and fitness tracking to the next level with advanced AI features.
              </p>
            </div>

            {/* Pro features */}
            <div className="space-y-3 mb-8">
              {PRO_FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="card p-4 flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-lime-400/15 flex items-center justify-center shrink-0">
                      <Icon size={20} className="text-lime-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-white">{f.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{f.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Billing toggle */}
            <div className="card p-2 mb-4 flex gap-2">
              <button
                onClick={() => setBilling('monthly')}
                className={`flex-1 py-3 rounded-2xl text-center transition-colors ${billing === 'monthly' ? 'bg-forest-700' : ''}`}
              >
                <p className="text-sm font-semibold">Monthly</p>
                <p className="text-xs text-gray-400">€3.99/mo</p>
              </button>
              <button
                onClick={() => setBilling('yearly')}
                className={`flex-1 py-3 rounded-2xl text-center transition-colors relative ${billing === 'yearly' ? 'bg-forest-700' : ''}`}
              >
                <span className="absolute -top-1 right-2 chip chip-on text-[10px] py-0.5 px-2">SAVE 37%</span>
                <p className="text-sm font-semibold">Yearly</p>
                <p className="text-xs text-gray-400">€29.99/yr</p>
              </button>
            </div>

            {/* Price card */}
            <div className="card p-5 mb-5 border-lime-400/30 bg-lime-400/5">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold font-display text-lime-400 tabular-nums">
                  €{billing === 'monthly' ? '3.99' : '29.99'}
                </span>
                <span className="text-gray-400">/{billing === 'monthly' ? 'month' : 'year'}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {billing === 'monthly' ? 'Billed monthly' : 'Just €2.50/month — billed annually'}
              </p>
            </div>

            {/* CTA */}
            <button onClick={onSubscribe} className="btn-primary w-full py-4 text-base mb-3">
              <Crown size={20} /> Start Pro {billing === 'monthly' ? '— €3.99/month' : '— €29.99/year'}
            </button>
            <p className="text-xs text-gray-500 text-center mb-6">
              Demo pricing — no real payment. Tapping subscribe is for prototyping only.
            </p>

            {/* Feature comparison */}
            <div className="card divide-y divide-forest-700/50">
              {FREE_FEATURES.map((f) => (
                <div key={f.label} className="flex items-center gap-3 p-3.5">
                  {f.included ? (
                    <Check size={18} className="text-lime-400 shrink-0" />
                  ) : (
                    <X size={18} className="text-gray-600 shrink-0" />
                  )}
                  <span className={`text-sm ${f.included ? 'text-gray-200' : 'text-gray-500'}`}>{f.label}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 text-center mt-6">Demo prices for prototype only. No actual charges.</p>
          </>
        )}
      </div>
    </div>
  );
}
