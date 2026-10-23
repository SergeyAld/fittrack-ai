import { Home, BookOpen, UtensilsCrossed, TrendingUp, User } from 'lucide-react';

export type TabId = 'home' | 'diary' | 'plans' | 'progress' | 'profile';

interface BottomNavProps {
  active: TabId;
  onChange: (tab: TabId) => void;
  onSnapTrack: () => void;
}

const TABS: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'diary', label: 'Diary', icon: BookOpen },
  { id: 'plans', label: 'Plans', icon: UtensilsCrossed },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
  { id: 'profile', label: 'Profile', icon: User },
];

export function BottomNav({ active, onChange, onSnapTrack }: BottomNavProps) {
  return (
    <>
      {/* Floating Snap & Track button */}
      <button
        onClick={onSnapTrack}
        aria-label="Snap & Track meal"
        className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 lg:bottom-6 lg:left-auto lg:right-6 lg:translate-x-0"
      >
        <span className="relative flex items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-lime-400/30 animate-pulse-ring" />
          <span className="relative h-14 w-14 rounded-full bg-lime-400 flex items-center justify-center text-forest-950 shadow-glow-lime active:scale-95 transition-transform">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7h3l2-3h8l2 3h3v12H3z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </span>
        </span>
      </button>

      {/* Bottom nav bar */}
      <nav className="fixed bottom-0 inset-x-0 z-40 lg:hidden">
        <div className="mx-auto max-w-md bg-forest-900/90 backdrop-blur-lg border-t border-forest-700/60 px-2 pb-[env(safe-area-inset-bottom)]">
          <div className="grid grid-cols-5 gap-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = active === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onChange(tab.id)}
                  className="flex flex-col items-center gap-1 py-2.5 transition-colors"
                  aria-label={tab.label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon
                    size={22}
                    className={isActive ? 'text-lime-400' : 'text-gray-500'}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className={`text-[10px] font-medium ${isActive ? 'text-lime-400' : 'text-gray-500'}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Desktop sidebar */}
      <nav className="hidden lg:flex fixed top-0 left-0 bottom-0 w-60 bg-forest-900/80 backdrop-blur-lg border-r border-forest-700/60 flex-col py-6 px-4 z-40">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="h-9 w-9 rounded-xl bg-lime-400 flex items-center justify-center text-forest-950 font-bold text-lg">F</div>
          <span className="font-display font-bold text-lg">FitTrack AI</span>
        </div>
        <div className="flex flex-col gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-lime-400/15 text-lime-300' : 'text-gray-400 hover:text-white hover:bg-forest-800'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {tab.label}
              </button>
            );
          })}
        </div>
        <button
          onClick={onSnapTrack}
          className="mt-auto btn-primary py-3"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7h3l2-3h8l2 3h3v12H3z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          Snap & Track
        </button>
      </nav>
    </>
  );
}
