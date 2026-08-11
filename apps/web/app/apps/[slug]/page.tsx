import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, CircleDot, FolderGit2 } from 'lucide-react';
import { getProjectBySlug, projectScreens } from '@/lib/projects';
import { siteConfig } from '@/lib/site';

type ProductPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projectScreens.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = getProjectBySlug((await params).slug);
  if (!product) return { title: 'Application' };

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: product.websiteUrl },
    openGraph: {
      title: `${product.name} — An MBMApps product`,
      description: product.description,
      url: product.websiteUrl,
      type: 'website',
      images: [{ url: product.screenshot.src, alt: product.screenshot.alt }]
    }
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = getProjectBySlug((await params).slug);
  if (!product) notFound();

  const scenario = [
    ['Trigger', product.scenario.trigger],
    ['Decision', product.scenario.decision],
    ['System response', product.scenario.systemResponse],
    ['Human authority', product.scenario.authorityBoundary],
    ['Resulting clarity', product.scenario.resultingClarity]
  ];

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: product.name,
    applicationCategory: product.category,
    operatingSystem: 'Web',
    description: product.description,
    url: product.websiteUrl,
    publisher: { '@type': 'Organization', name: siteConfig.legalName, url: siteConfig.url }
  };

  return (
    <div className={`portfolio-home portfolio-product-page portfolio-accent--${product.accentToken}`}>
      <header className="portfolio-product-page__hero">
        <div className="portfolio-grid" aria-hidden="true" />
        <div className="northstar-container portfolio-product-page__hero-layout">
          <div>
            <Link href="/apps" className="portfolio-text-link"><ArrowLeft aria-hidden="true" /> All applications</Link>
            <p className="portfolio-eyebrow">{product.parentLabel}</p>
            <span className="portfolio-product-card__monogram">{product.shortName}</span>
            <h1>{product.name}</h1>
            <p className="portfolio-product-page__category">{product.category}</p>
            <h2>{product.headline}</h2>
            <p>{product.description}</p>
            <p className="portfolio-catalog-card__access"><CircleDot aria-hidden="true" /> {product.status} · {product.accessDescription}</p>
            <div className="portfolio-actions">
              <a href={product.websiteUrl} className="portfolio-button portfolio-button--product" data-product={product.analyticsId}>
                {product.websiteLabel} <ArrowUpRight aria-hidden="true" />
              </a>
              {product.secondaryAction ? <Link href={product.secondaryAction.href} className="portfolio-text-link">{product.secondaryAction.label} <ArrowRight aria-hidden="true" /></Link> : null}
            </div>
          </div>
          <div className="portfolio-product-page__visual">
            <div className="portfolio-product-page__image">
              <Image src={product.screenshot.src} alt={product.screenshot.alt} fill priority sizes="(max-width: 900px) 92vw, 54vw" />
            </div>
            <div className="portfolio-evidence"><span>{product.screenshot.maturity}</span><p>{product.screenshot.caption}</p></div>
            {product.designSnapshot ? (
              <div className="portfolio-spotlight__snapshot">
                <div className="portfolio-product-page__image">
                  <Image src={product.designSnapshot.src} alt={product.designSnapshot.alt} fill sizes="(max-width: 900px) 92vw, 54vw" />
                </div>
                <div className="portfolio-evidence"><span>{product.designSnapshot.maturity}</span><p>{product.designSnapshot.caption}</p></div>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <main>
        <section className="portfolio-section northstar-container portfolio-product-page__capabilities" aria-labelledby="capabilities-title">
          <div>
            <p className="portfolio-eyebrow">Operating environment</p>
            <h2 id="capabilities-title">What {product.name} organizes.</h2>
            <p>{product.problemStatement}</p>
          </div>
          <dl>
            {product.capabilities.map((capability) => (
              <div key={capability.label}>
                <dt><Check aria-hidden="true" /> {capability.label}</dt>
                <dd>{capability.description}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="portfolio-section portfolio-product-page__moment" aria-labelledby="moment-title">
          <div className="northstar-container">
            <p className="portfolio-eyebrow">A real operating moment</p>
            <h2 id="moment-title">From trigger to responsible next action.</h2>
            <ol>
              {scenario.map(([label, description], index) => (
                <li key={label}>
                  <span>0{index + 1}</span>
                  <strong>{label}</strong>
                  <p>{description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="portfolio-section northstar-container portfolio-product-page__proof">
          <div>
            <p className="portfolio-eyebrow">Authority and evidence</p>
            <h2>Connected does not mean collapsed.</h2>
          </div>
          <div>
            <p>{product.proofBoundary}</p>
            <p>This product brief describes the verified workflow and current public or authenticated access path. It does not turn configuration-dependent behavior into a production claim.</p>
            <a href={product.sourceRepository.href}><FolderGit2 aria-hidden="true" /> {product.sourceRepository.label}</a>
          </div>
        </section>
      </main>

      <section className="portfolio-final">
        <div className="northstar-container">
          <p className="portfolio-eyebrow">Dedicated product destination</p>
          <h2>Continue with {product.name}.</h2>
          <div className="portfolio-actions portfolio-actions--centered">
            <a href={product.websiteUrl} className="portfolio-button portfolio-button--product" data-product={product.analyticsId}>{product.websiteLabel} <ArrowUpRight aria-hidden="true" /></a>
            <Link href="/apps" className="portfolio-text-link">Compare all applications <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
    </div>
  );
}
