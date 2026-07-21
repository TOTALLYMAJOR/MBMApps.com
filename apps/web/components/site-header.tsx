'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrackedLink } from '@/components/tracked-link';
import { navigation } from '@/lib/site';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/60 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-ink">
          <span className="h-2.5 w-2.5 rounded-sm bg-indigo-400 shadow-[0_0_16px_rgba(129,140,248,0.75)]" aria-hidden="true" />
          MBMApps
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navigation.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium uppercase tracking-[0.08em] text-white/65 transition hover:text-white',
                  active && 'text-white'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <TrackedLink
          href="/apps"
          className="btn-theme gap-2"
          trackingEvent="cta_clicked"
          trackingMetadata={{ surface: 'site-header', target: 'apps-catalog' }}
        >
          Browse apps
        </TrackedLink>
      </div>
    </header>
  );
}
