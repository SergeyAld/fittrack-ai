import { X } from 'lucide-react';
import { useEffect } from 'react';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Sheet({ open, onClose, title, children }: SheetProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-forest-800 border border-forest-700 rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto no-scrollbar animate-slide-up">
        {title && (
          <div className="sticky top-0 bg-forest-800/95 backdrop-blur-sm px-5 py-4 border-b border-forest-700 flex items-center justify-between">
            <h3 className="font-display font-semibold text-lg">{title}</h3>
            <button onClick={onClose} className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-forest-700" aria-label="Close">
              <X size={20} />
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
