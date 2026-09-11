import { useEffect } from 'react';
import type { ButtonHTMLAttributes, PropsWithChildren, ReactNode } from 'react';

export function Card({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`rounded-3xl border border-ink/10 bg-white/90 p-5 shadow-[0_8px_30px_-12px_rgba(42,33,29,0.15)] backdrop-blur-sm ${className}`}>
      {children}
    </div>
  );
}

export function Button({
  className = '',
  variant = 'primary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'outline' }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed';
  const styles = {
    primary: 'bg-clay text-white shadow-lg shadow-clay/30 hover:bg-clay-dark hover:shadow-clay/40 active:scale-[0.98]',
    outline: 'border-2 border-ink/15 text-ink hover:border-clay hover:text-clay-dark',
    ghost: 'text-ink-soft hover:bg-ink/5',
  }[variant];
  return <button className={`${base} ${styles} ${className}`} {...props} />;
}

export function Chip({
  active,
  onClick,
  children,
  className = '',
}: PropsWithChildren<{ active?: boolean; onClick?: () => void; className?: string }>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
        active
          ? 'border-clay bg-clay text-white shadow-md shadow-clay/25'
          : 'border-ink/12 bg-white/70 text-ink-soft hover:border-clay/50 hover:text-ink'
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function Swatch({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <span
      className="inline-block shrink-0 rounded-full border border-black/10 align-middle shadow-sm"
      style={{ backgroundColor: color, width: size, height: size }}
    />
  );
}

export function ScoreBar({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color = pct >= 75 ? 'bg-sage' : pct >= 50 ? 'bg-clay' : 'bg-plum';
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-full rounded-full bg-ink/8">
        <div className={`h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-10 shrink-0 text-right text-xs font-semibold text-ink-soft">{pct}%</span>
    </div>
  );
}

export function Modal({ open, onClose, children, title }: PropsWithChildren<{ open: boolean; onClose: () => void; title: ReactNode }>) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-cream p-6 shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-ink/5"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
