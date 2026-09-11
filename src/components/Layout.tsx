import type { PropsWithChildren } from 'react';
import { NavLink } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/', label: 'My Closet', end: true },
  { to: '/match', label: 'Find an Outfit', end: false },
];

export function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen pb-16">
      <header className="sticky top-0 z-40 border-b border-ink/8 bg-cream/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div>
            <h1 className="font-display text-2xl font-semibold italic text-ink">Day Decide</h1>
            <p className="hidden text-xs text-ink-soft sm:block">Your virtual wardrobe</p>
          </div>
          <nav className="flex gap-1 rounded-full bg-ink/5 p-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    isActive ? 'bg-white text-ink shadow-sm' : 'text-ink-soft hover:text-ink'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
