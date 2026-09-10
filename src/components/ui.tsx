import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

export function Card({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function Button({
  className = '',
  variant = 'primary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' }) {
  const base = 'rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed';
  const styles =
    variant === 'primary'
      ? 'bg-slate-900 text-white hover:bg-slate-700'
      : 'bg-transparent text-slate-600 hover:bg-slate-100';
  return <button className={`${base} ${styles} ${className}`} {...props} />;
}

export function Swatch({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <span
      className="inline-block rounded-full border border-slate-300 align-middle"
      style={{ backgroundColor: color, width: size, height: size }}
    />
  );
}

export function ScoreBar({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color = pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500';
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-full rounded-full bg-slate-100">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-10 shrink-0 text-right text-xs font-medium text-slate-500">{pct}%</span>
    </div>
  );
}
