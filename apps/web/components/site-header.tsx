'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigation } from '@/lib/site';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight text-ink">
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
                  'text-sm font-medium text-mist transition hover:text-white',
                  active && 'text-white'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/demo"
          className="rounded-full border border-electric/70 bg-electric/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-electric/35"
        >
          Live Demo
        </Link>
      </div>
    </header>
  );
}
