import Link from 'next/link';
import { projectScreens } from '@/lib/projects';
import { siteConfig } from '@/lib/site';

export function SiteFooter() {
  return (
    <footer className="northstar-footer">
      <div className="northstar-container py-16 lg:py-20">
        <div className="grid gap-12 border-b border-white/10 pb-14 lg:grid-cols-[1.25fr_0.75fr_0.75fr]">
          <div>
            <p className="northstar-kicker">MBMApps / Independent software studio</p>
            <p className="mt-5 max-w-xl font-display text-3xl font-light leading-tight tracking-[-0.04em] text-white sm:text-4xl">Purpose-built software for work that cannot run on guesswork.</p>
            <p className="mt-5 max-w-lg text-sm leading-7 text-white/48">{siteConfig.description}</p>
          </div>
          <div>
            <p className="northstar-kicker">Applications</p>
            <div className="mt-5 grid gap-3">
              {projectScreens.map((product) => (
                <a key={product.slug} href={product.websiteUrl} className="northstar-footer-link">{product.name}</a>
              ))}
            </div>
          </div>
          <div>
            <p className="northstar-kicker">Company</p>
            <div className="mt-5 grid gap-3">
              <Link href="/apps" className="northstar-footer-link">All applications</Link>
              <Link href="/#studio" className="northstar-footer-link">Studio</Link>
              <Link href="/about" className="northstar-footer-link">About</Link>
              <Link href="/contact" className="northstar-footer-link">Contact</Link>
            </div>
            <a href={`mailto:${siteConfig.email}`} className="northstar-footer-link mt-6 inline-flex">{siteConfig.email}</a>
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-6 text-xs text-white/36 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {siteConfig.legalName}</p>
          <a href={siteConfig.social.github} className="northstar-footer-link">GitHub / TOTALLYMAJOR</a>
        </div>
      </div>
    </footer>
  );
}
