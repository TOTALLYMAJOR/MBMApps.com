'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const terminalNavigation = [
  { href: '/', label: 'home', key: 'h' },
  { href: '/apps', label: 'apps', key: 'a' },
  { href: '/case-studies', label: 'work', key: 'w' },
  { href: '/services', label: 'services', key: 's' },
  { href: '/insights', label: 'articles', key: 'r' },
  { href: '/about', label: 'about', key: 'b' },
  { href: '/contact', label: 'contact', key: 'c' }
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="northstar-header terminal-nav site-terminal-nav sticky top-0 z-40">
      <div className="terminal-shell terminal-nav__inner">
        <nav className="terminal-nav__links" aria-label="Primary navigation">
          {terminalNavigation.map((item) => {
            const active = item.href === '/' ? pathname === '/' : !item.href.includes('#') && pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'site-terminal-nav__link',
                  active && 'is-active'
                )}
                aria-current={active ? 'page' : undefined}
              >
                <span>[{item.key}]</span> {item.label}
              </Link>
            );
          })}
        </nav>
        <Link href="/" className="site-terminal-brand" aria-label="MBMApps home">MBMApps<span aria-hidden="true" /></Link>
      </div>
    </header>
  );
}
