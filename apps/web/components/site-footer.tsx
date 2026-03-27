import Link from 'next/link';
import { navigation, siteConfig } from '@/lib/site';

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black/50">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 md:grid-cols-3 lg:px-8">
        <div>
          <p className="font-display text-xl font-semibold text-white">MBMApps</p>
          <p className="text-mbm-muted mt-3 max-w-xs text-sm leading-6">{siteConfig.description}</p>
        </div>
        <div>
          <p className="kicker text-white/70">Navigate</p>
          <div className="mt-3 flex flex-col gap-2">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm text-white/85 transition hover:text-signal">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="kicker text-white/70">Contact</p>
          <p className="mt-3 text-sm text-white/85">{siteConfig.location}</p>
          <p className="text-sm text-white/85">{siteConfig.email}</p>
          <p className="text-sm text-white/85">{siteConfig.phone}</p>
          <p className="mt-4 text-xs text-white/55">© {new Date().getFullYear()} {siteConfig.legalName}</p>
        </div>
      </div>
    </footer>
  );
}
