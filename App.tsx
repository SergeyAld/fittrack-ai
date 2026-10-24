import { useState } from 'react';
import { AccountGate, readSession, type LocalAccount } from '@/components/AccountGate';
import { Activity, Sparkles } from 'lucide-react';
import { BottomNav, type TabId } from '@/components/BottomNav';
import { Home } from '@/components/screens/Home';
import { Diary } from '@/components/screens/Diary';
import { MealPlans } from '@/components/screens/MealPlans';
import { Progress } from '@/components/screens/Progress';
import { Profile } from '@/components/screens/Profile';
import { SnapTrack } from '@/components/screens/SnapTrack';
import { Upgrade } from '@/components/screens/Upgrade';
import { useDiary } from '@/hooks/useDiary';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { UserSettings } from '@/types';

const DEFAULT_SETTINGS: UserSettings = {
  name: 'Guest', age: 0, heightCm: 0, weightKg: 0,
  activityLevel: 'moderate', fitnessGoal: 'maintain', dietPreference: 'balanced',
  allergies: [], weeklyBudgetEur: 60, unit: 'metric',
  notifications: { reminders: true, weeklyReport: true, goalUpdates: true }, isPro: false,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [account, setAccount] = useState<LocalAccount | null>(() => readSession());
  const [snapOpen, setSnapOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [settings, setSettings] = useLocalStorage<UserSettings>('fittrack_settings_v1', DEFAULT_SETTINGS);
  const diary = useDiary();

  const showSnap = () => setSnapOpen(true);
  const addFood = () => setActiveTab('diary');

  const enterAccount = (nextAccount: LocalAccount) => {
    setAccount(nextAccount);
    setSettings({ ...DEFAULT_SETTINGS, name: nextAccount.name, ...(nextAccount.profile ? { age: nextAccount.profile.age, heightCm: nextAccount.profile.heightCm, weightKg: nextAccount.profile.weightKg, fitnessGoal: nextAccount.profile.fitnessGoal, activityLevel: nextAccount.profile.activityLevel } : {}) });
    setActiveTab('home');
  };

  if (!account) return <AccountGate onContinue={enterAccount} />;

  return (
    <div className="min-h-screen bg-[#080b12] text-white">
      <BottomNav active={activeTab} onChange={setActiveTab} onSnapTrack={showSnap} />
      <main className="mx-auto min-h-screen w-full max-w-md px-4 pb-32 pt-5 lg:ml-60 lg:max-w-3xl lg:px-8 lg:pb-10">
        <header className="mb-6 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-400 text-lg font-black text-forest-950">F</div>
            <div>
              <p className="font-display text-lg font-bold leading-tight">FitTrack <span className="text-[#399cff]">AI</span></p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500">TRAIN SMARTER. FEEL STRONGER.</p>
            </div>
          </div>
          <button onClick={() => setUpgradeOpen(true)} className="flex items-center gap-1.5 rounded-full border border-lime-400/30 bg-lime-400/10 px-3 py-2 text-xs font-semibold text-lime-300"><Sparkles size={14}/> Go Pro</button>
        </header>

        {activeTab === 'home' && <Home totals={diary.totals} water={diary.water} byMealType={diary.byMealType} onAddWater={diary.addWater} onRemoveWater={diary.removeWater} onSnapTrack={showSnap} onAddFood={addFood} onMealPlans={() => setActiveTab('plans')} />}
        {activeTab === 'diary' && <Diary byMealType={diary.byMealType} totals={diary.totals} onAddFood={diary.addFood} onRemoveEntry={diary.removeEntry} onUpdateGrams={diary.updateGrams} onSnapTrack={showSnap} />}
        {activeTab === 'plans' && <MealPlans />}
        {activeTab === 'progress' && <Progress />}
        {activeTab === 'profile' && <Profile settings={settings} onUpdate={setSettings} onUpgrade={() => setUpgradeOpen(true)} onSignOut={() => { localStorage.removeItem('fittrack_local_session_v1'); setAccount(null); }} />}

        <footer className="mt-10 border-t border-forest-800 pt-4 text-center text-xs text-gray-600">
          <div className="mb-1 flex items-center justify-center gap-1"><Activity size={12}/> Small steps add up.</div>
          Food and photo-analysis values are estimates for this demo. Adjust entries to match your meal.
        </footer>
      </main>

      <SnapTrack open={snapOpen} onClose={() => setSnapOpen(false)} onAddToDiary={(entries) => { diary.addEntries(entries); setSnapOpen(false); setActiveTab('diary'); }} />
      <Upgrade open={upgradeOpen} onClose={() => setUpgradeOpen(false)} isPro={settings.isPro} onSubscribe={() => { setSettings({ ...settings, isPro: true }); setUpgradeOpen(false); }} />
    </div>
  );
}
