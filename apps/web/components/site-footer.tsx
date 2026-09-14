import Link from 'next/link';
import { siteConfig } from '@/lib/site';

export function SiteFooter() {
  return (
    <footer className="northstar-footer site-terminal-footer">
      <div className="terminal-shell terminal-footer">
        <p>© {new Date().getFullYear()} {siteConfig.legalName} · next.js · typescript</p>
        <nav aria-label="Footer navigation">
          <Link href="/apps">[apps]</Link>
          <Link href="/insights">[articles]</Link>
          <Link href="/contact">[contact]</Link>
          <a href={siteConfig.social.github}>[github]</a>
        </nav>
        <p>chicago, usa · built for clear decisions</p>
      </div>
    </footer>
  );
}
