import type { ReactNode } from 'react';

type NorthstarPageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  signal?: string;
  aside?: ReactNode;
  actions?: ReactNode;
};

export function NorthstarPageHero({ eyebrow, title, description, signal = 'MBM / 2026', aside, actions }: NorthstarPageHeroProps) {
  return (
    <header className="northstar-page-hero">
      <div className="northstar-page-hero__orbit northstar-page-hero__orbit--large" aria-hidden="true" />
      <div className="northstar-page-hero__orbit northstar-page-hero__orbit--small" aria-hidden="true" />
      <div className="ambient-grid pointer-events-none absolute inset-0 opacity-20" />
      <div className="northstar-container relative z-10 grid gap-12 py-20 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end lg:py-28">
        <div>
          <p className="northstar-kicker">{eyebrow}</p>
          <h1 className="northstar-page-title">{title}</h1>
          <p className="northstar-page-copy">{description}</p>
          {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
        </div>
        <aside className="northstar-hero-aside">
          <div className="flex items-center justify-between gap-3">
            <span className="northstar-kicker">Signal</span>
            <span className="font-mono text-[0.68rem] text-indigo-200/80">{signal}</span>
          </div>
          <div className="mt-12">{aside ?? <p className="text-sm leading-7 text-white/58">Focused software. Disciplined delivery. Clear operating outcomes.</p>}</div>
        </aside>
      </div>
    </header>
  );
}
