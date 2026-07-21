import Link from 'next/link';
import { navigation, siteConfig } from '@/lib/site';

export function SiteFooter() {
  return (
    <footer className="northstar-footer">
      <div className="northstar-container py-16 lg:py-20">
        <div className="grid gap-12 border-b border-white/10 pb-14 lg:grid-cols-[1.25fr_0.75fr_0.75fr]">
          <div>
            <p className="northstar-kicker">MBMApps / Chicago</p>
            <p className="mt-5 max-w-xl font-display text-3xl font-light leading-tight tracking-[-0.04em] text-white sm:text-4xl">Software products and engineering systems built to carry real work.</p>
            <p className="mt-5 max-w-lg text-sm leading-7 text-white/48">{siteConfig.description}</p>
          </div>
          <div>
            <p className="northstar-kicker">Explore</p>
            <div className="mt-5 grid gap-3">
              {navigation.slice(0, 5).map((item) => (
                <Link key={item.href} href={item.href} className="northstar-footer-link">{item.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <p className="northstar-kicker">Company</p>
            <div className="mt-5 grid gap-3">
              {navigation.slice(5).map((item) => (
                <Link key={item.href} href={item.href} className="northstar-footer-link">{item.label}</Link>
              ))}
            </div>
            <a href={`mailto:${siteConfig.email}`} className="northstar-footer-link mt-6 inline-flex">{siteConfig.email}</a>
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-6 text-xs text-white/36 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {siteConfig.legalName}</p>
          <p>{siteConfig.location} · {siteConfig.phone}</p>
        </div>
      </div>
    </footer>
  );
}
