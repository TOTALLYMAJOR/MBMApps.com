'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrackedLink } from '@/components/tracked-link';
import { navigation } from '@/lib/site';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="northstar-header sticky top-0 z-40">
      <div className="northstar-container flex items-center justify-between py-4">
        <Link href="/" className="group flex items-center gap-3 font-display text-lg font-medium tracking-[-0.025em] text-white">
          <span className="northstar-logo-mark" aria-hidden="true"><span /><span /><span /></span>
          <span>MBMApps</span>
        </Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {navigation.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

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
        <div className="flex items-center gap-2">
          <Link href="/services" className="northstar-header-link hidden sm:inline-flex">Build with us</Link>
          <TrackedLink
            href="/apps"
            className="northstar-header-cta"
            trackingEvent="cta_clicked"
            trackingMetadata={{ surface: 'site-header', target: 'apps-catalog' }}
          >
            Browse apps
          </TrackedLink>
        </div>
      </div>
    </header>
  );
}
