'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigation } from '@/lib/site';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="northstar-header sticky top-0 z-40">
      <div className="northstar-container flex items-center justify-between py-4">
        <Link href="/" className="group flex min-h-11 items-center gap-3 text-xl tracking-[-0.04em] text-white" aria-label="MBMApps home">
          <span className="font-semibold">MBM</span><span className="-ml-3 font-light text-white/72">Apps</span>
        </Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {navigation.map((item) => {
            const active = item.href.startsWith('/#') ? false : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'northstar-nav-link',
                  active && 'northstar-nav-link--active'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <span className="availability-mark availability-mark--live hidden lg:inline-flex">
            <span className="availability-mark__dot" aria-hidden="true" />
            Open for new engagements
          </span>
          <Link href="/contact" className="northstar-header-link hidden sm:inline-flex">Start a conversation</Link>
          <Link href="/apps" className="northstar-header-cta">Browse apps</Link>
        </div>
      </div>
    </header>
  );
}
