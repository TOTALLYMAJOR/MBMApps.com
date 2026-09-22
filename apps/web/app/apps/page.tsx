import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import { projectScreens } from '@/lib/projects';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Applications',
  description: 'Explore QuietPilot, LeaguePilot, and QuoteFlow—the three focused operating applications built by MBMApps.',
  alternates: { canonical: '/apps' }
};

export default function AppsPage() {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'MBMApps applications',
    numberOfItems: projectScreens.length,
    itemListElement: projectScreens.map((product, index) => ({
      '@type': 'ListItem', position: index + 1, item: {
        '@type': 'SoftwareApplication', name: product.name, applicationCategory: product.category,
        operatingSystem: 'Web', description: product.description, url: product.websiteUrl,
        sameAs: `${siteConfig.url}${product.path}`
      }
    }))
  };

  return (
    <div className="terminal-home terminal-page">
      <section className="terminal-shell terminal-pagehead">
        <p className="terminal-command"><span>~/mbmapps/apps</span> $ ls --products --available</p>
        <h1>applications<span className="terminal-cursor" aria-hidden="true" /></h1>
        <p className="terminal-lede">Three independent products for three operating environments. Compare who each serves, what it fixes, and how to inspect it.</p>
        <div className="terminal-links"><Link href="/">[back home]</Link><Link href="/contact">[ask which fits]</Link></div>
      </section>

      <section className="terminal-section terminal-shell" aria-labelledby="all-apps-title">
        <div className="terminal-section__head">
          <div><h2 id="all-apps-title"><span>*</span> all apps</h2><p><span>$</span> cat --briefs</p></div>
          <p>{projectScreens.length} purpose-built systems</p>
        </div>
        <div className="terminal-product-grid">
          {projectScreens.map((product, index) => (
            <article key={product.slug} className={`terminal-product terminal-product--${product.accentToken}`}>
              <Link href={product.path} className="terminal-product__image">
                <Image src={product.screenshot.src} alt={product.screenshot.alt} fill sizes="(min-width: 900px) 31vw, 100vw" priority={index === 0} />
              </Link>
              <div className="terminal-product__body">
                <p className="terminal-product__index">0{index + 1} / independent application</p>
                <div className="terminal-product__title"><h3>{product.name}</h3><ArrowUpRight aria-hidden="true" /></div>
                <p className="terminal-product__category">{product.category}</p>
                <p className="terminal-product__audience"><span>For</span> {product.audience.join(' · ')}</p>
                <p>{product.description}</p>
                <p className="terminal-product__problem"><span>Solves</span> {product.problemStatement}</p>
                <div className="terminal-tags">{product.capabilities.slice(0, 4).map((capability) => <span key={capability.label}>{capability.label}</span>)}</div>
                <div className="terminal-links"><Link href={product.path}>[view brief]</Link><a href={product.websiteUrl}>[{product.websiteLabel.toLowerCase()}]</a></div>
                <p className="terminal-proof"><Check aria-hidden="true" /> {product.accessDescription}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="terminal-section terminal-shell terminal-contact" aria-label="Custom systems">
        <div><p className="terminal-command"><span>~/mbmapps/apps</span> $ custom</p><h2><span>*</span> none of these fit exactly?</h2><p>The studio takes on a small number of custom operating systems each year. Describe the workflow and we will map it against what already exists.</p></div>
        <div className="terminal-contact__actions"><Link href="/contact">[contact the studio]</Link><Link href="/tools">[browse tools]</Link></div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
    </div>
  );
}
