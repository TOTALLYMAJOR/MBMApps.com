import Link from 'next/link';
import { ProductDestinationLink } from '@/components/product-destination-link';
import { projectScreens } from '@/lib/projects';
import { siteConfig } from '@/lib/site';

export function SiteFooter() {
  return (
    <footer className="northstar-footer">
      <div className="northstar-container">
        <div className="northstar-footer__grid">
          <div>
            <p className="northstar-kicker">MBMApps / Independent software studio</p>
            <p className="northstar-footer__statement">Purpose-built software for work that cannot run on guesswork.</p>
            <p className="northstar-footer__note">{siteConfig.description}</p>
          </div>
          <div>
            <p className="northstar-kicker">Applications</p>
            <div className="northstar-footer__links">
              {projectScreens.map((product) => <ProductDestinationLink key={product.slug} className="northstar-footer-link" href={product.experienceHref}>{product.name}</ProductDestinationLink>)}
            </div>
          </div>
          <div>
            <p className="northstar-kicker">Company</p>
            <div className="northstar-footer__links">
              <Link className="northstar-footer-link" href="/apps">All applications</Link>
              <Link className="northstar-footer-link" href="/tools">Tools and simulators</Link>
              <Link className="northstar-footer-link" href="/case-studies">Selected work</Link>
              <Link className="northstar-footer-link" href="/insights">Articles</Link>
              <Link className="northstar-footer-link" href="/discuss">Discuss AI</Link>
              <Link className="northstar-footer-link" href="/about">About</Link>
              <Link className="northstar-footer-link" href="/contact">Contact</Link>
              <a className="northstar-footer-link northstar-footer-link--email" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            </div>
          </div>
        </div>
        <div className="northstar-footer__meta">
          <p>© {new Date().getFullYear()} {siteConfig.legalName} · chicago, usa · built for clear decisions</p>
          <div className="instrument-strip">
            <span className="instrument-chip"><span className="instrument-chip__dot" aria-hidden="true" />{projectScreens.length} products listed</span>
            <a className="northstar-footer-link" href={siteConfig.social.github}>GitHub / TOTALLYMAJOR</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
