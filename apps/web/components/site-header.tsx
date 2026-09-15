'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const primaryNavigation = [
  { href: '/apps', label: 'Apps' },
  { href: '/#approach', label: 'Approach' },
  { href: '/#studio', label: 'Studio', panel: 'studio' },
  { href: '/#components', label: 'Components', panel: 'components' },
  { href: '/about', label: 'About' }
];

export function SiteHeader() {
  const pathname = usePathname();
  const [light, setLight] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem('mbm-theme') === 'light';
    setLight(saved);
    document.documentElement.dataset.theme = saved ? 'light' : 'dark';

    const syncTheme = (event: Event) => {
      const next = (event as CustomEvent<{ light: boolean }>).detail?.light ?? false;
      setLight(next);
      document.documentElement.dataset.theme = next ? 'light' : 'dark';
    };
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('mbm-theme-change', syncTheme);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('mbm-theme-change', syncTheme);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  function toggleTheme() {
    const next = !light;
    setLight(next);
    window.localStorage.setItem('mbm-theme', next ? 'light' : 'dark');
    document.documentElement.dataset.theme = next ? 'light' : 'dark';
    window.dispatchEvent(new CustomEvent('mbm-theme-change', { detail: { light: next } }));
  }

  function openPanel(panel: string | undefined) {
    if (!panel || pathname !== '/') return;
    window.dispatchEvent(new CustomEvent('mbm-open-panel', { detail: { panel } }));
  }

  // The homepage owns its terminal navigation. Rendering the shared header
  // there creates two competing navigation bars; inner routes keep this one.
  if (pathname === '/') return null;

  return (
    <header className="northstar-header" data-scrolled={scrolled ? 'true' : 'false'}>
      <div className="northstar-container northstar-header__inner">
        <Link className="northstar-brand" aria-label="MBMApps home" href="/">
          <span className="northstar-brand__mark"><strong>MBM</strong><span>Apps</span></span>
        </Link>

        <nav className="northstar-nav" aria-label="Primary navigation">
          {primaryNavigation.map((item) => {
            const active = item.href === '/apps'
              ? pathname.startsWith('/apps')
              : item.href === '/about'
                ? pathname.startsWith('/about')
                : false;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn('northstar-nav-link', active && 'active')}
                aria-current={active ? 'page' : undefined}
                onClick={() => openPanel(item.panel)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="northstar-header__actions">
          <span className="availability-mark">
            <span className="availability-mark__dot" aria-hidden="true" />
            Open for new engagements
          </span>
          <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${light ? 'dark' : 'light'} theme`}>
            {light ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
            <span>[t] {light ? 'dark' : 'light'}</span>
          </button>
          <Link className="northstar-header-link" href="/contact">Start a conversation</Link>
          <Link className="northstar-header-cta" href="/apps">Browse apps</Link>
        </div>
      </div>
    </header>
  );
}
