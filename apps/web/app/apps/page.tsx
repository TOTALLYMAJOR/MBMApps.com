import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, CircleDot } from 'lucide-react';
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
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: product.name,
        applicationCategory: product.category,
        operatingSystem: 'Web',
        description: product.description,
        url: product.websiteUrl,
        sameAs: `${siteConfig.url}${product.path}`
      }
    }))
  };

  return (
    <div className="portfolio-home portfolio-catalog">
      <header className="portfolio-catalog__hero">
        <div className="portfolio-grid" aria-hidden="true" />
        <div className="northstar-container">
          <Link href="/" className="portfolio-text-link"><ArrowLeft aria-hidden="true" /> MBMApps home</Link>
          <p className="portfolio-eyebrow">Application portfolio / 03</p>
          <h1>Focused software for distinct operating environments.</h1>
          <p>Each product has its own audience, workflow, authority model, and dedicated destination. Choose the one closest to the work you need to run.</p>
        </div>
      </header>

      <main className="northstar-container portfolio-catalog__list">
        {projectScreens.map((product, index) => (
          <article key={product.slug} className={`portfolio-catalog-card portfolio-accent--${product.accentToken}`}>
            <div className="portfolio-catalog-card__visual">
              <div className="portfolio-catalog-card__image">
                <Image src={product.screenshot.src} alt={product.screenshot.alt} fill priority={index === 0} sizes="(max-width: 900px) 92vw, 51vw" />
              </div>
              <div className="portfolio-evidence">
                <span>{product.screenshot.maturity}</span>
                <p>{product.screenshot.caption}</p>
              </div>
            </div>
            <div className="portfolio-catalog-card__copy">
              <div className="portfolio-product-card__topline"><span>0{index + 1}</span><span>{product.parentLabel}</span></div>
              <span className="portfolio-product-card__monogram">{product.shortName}</span>
              <h2>{product.name}</h2>
              <p className="portfolio-catalog-card__category">{product.category}</p>
              <h3>{product.supportingStatement}</h3>
              <p>{product.description}</p>
              <div className="portfolio-chip-row">
                {product.capabilities.map((capability) => <span key={capability.label}>{capability.label}</span>)}
              </div>
              <p className="portfolio-catalog-card__access"><CircleDot aria-hidden="true" /> {product.status} · {product.accessDescription}</p>
              <div className="portfolio-actions">
                <a href={product.websiteUrl} className="portfolio-button portfolio-button--product" data-product={product.analyticsId}>
                  {product.websiteLabel} <ArrowUpRight aria-hidden="true" />
                </a>
                <Link href={product.path} className="portfolio-text-link">Product brief <ArrowRight aria-hidden="true" /></Link>
              </div>
            </div>
          </article>
        ))}
      </main>

      <section className="portfolio-final">
        <div className="northstar-container">
          <p className="portfolio-eyebrow">No close match?</p>
          <h2>Bring us the workflow that still needs its own system.</h2>
          <div className="portfolio-actions portfolio-actions--centered">
            <Link href="/contact" className="portfolio-button portfolio-button--primary">Start a conversation <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
    </div>
  );
}
