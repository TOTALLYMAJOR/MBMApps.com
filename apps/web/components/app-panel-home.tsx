import Image from 'next/image';
import Link from 'next/link';
import { ArrowDownRight, ArrowRight, ArrowUpRight, Check, CircleDot } from 'lucide-react';
import { ProductRouter } from '@/components/product-router';
import { projectScreens } from '@/lib/projects';

const method = [
  {
    index: '01',
    title: 'Model the real workflow',
    description: 'Build around the decisions, roles, handoffs, and states of the operation—not a generic CRM shape.'
  },
  {
    index: '02',
    title: 'Make authority explicit',
    description: 'Keep access, approvals, evidence, and system state visible instead of hiding them behind ambiguous automation.'
  },
  {
    index: '03',
    title: 'Surface the next responsible action',
    description: 'Show what needs attention, what is blocked, and what can safely happen next.'
  }
];

const studioCapabilities = [
  'Product architecture',
  'Workflow modeling',
  'SaaS application design',
  'Multi-tenant systems',
  'Operational portals',
  'Integration strategy'
];

export function AppPanelHome() {
  const primaryProduct = projectScreens[0];
  const supportingProducts = projectScreens.slice(1);

  return (
    <div className="portfolio-home">
      <section className="portfolio-hero" aria-labelledby="portfolio-hero-title">
        <div className="portfolio-grid" aria-hidden="true" />
        <div className="northstar-container portfolio-hero__layout">
          <div className="portfolio-hero__copy">
            <p className="portfolio-eyebrow">Independent software studio</p>
            <h1 id="portfolio-hero-title" className="portfolio-display">
              Purpose-built software for work that cannot run on guesswork.
            </h1>
            <p className="portfolio-lede">
              MBMApps creates focused operating systems for catering, youth sports, and quote-to-event workflows—turning fragmented processes into clear, usable applications.
            </p>
            <div className="portfolio-actions">
              <Link href="/apps" className="portfolio-button portfolio-button--primary">
                Browse apps <ArrowRight aria-hidden="true" />
              </Link>
              <Link href="/contact" className="portfolio-text-link">
                Start a conversation <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="portfolio-composition" aria-label="MBMApps application portfolio previews">
            <Link href={primaryProduct.path} className={`portfolio-window portfolio-window--primary portfolio-accent--${primaryProduct.accentToken}`}>
              <span className="portfolio-window__label">{primaryProduct.name}</span>
              <span className="portfolio-window__frame">
                <Image src={primaryProduct.screenshot.src} alt={primaryProduct.screenshot.alt} fill priority sizes="(max-width: 900px) 92vw, 42vw" />
              </span>
            </Link>
            <div className="portfolio-composition__supporting">
              {supportingProducts.map((product) => (
                <Link key={product.slug} href={product.path} className={`portfolio-window portfolio-window--supporting portfolio-accent--${product.accentToken}`}>
                  <span className="portfolio-window__label">{product.name}</span>
                  <span className="portfolio-window__frame">
                    <Image src={product.screenshot.src} alt={product.screenshot.alt} fill sizes="(max-width: 900px) 92vw, 22vw" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="apps" className="portfolio-section portfolio-index" aria-labelledby="application-index-title">
        <div className="northstar-container">
          <div className="portfolio-section-heading portfolio-section-heading--split">
            <div>
              <p className="portfolio-eyebrow">The applications</p>
              <h2 id="application-index-title">Three products. Three operating environments.</h2>
            </div>
            <p>One standard: make the next action clear.</p>
          </div>

          <div className="portfolio-product-grid">
            {projectScreens.map((product, index) => (
              <article key={product.slug} className={`portfolio-product-card portfolio-accent--${product.accentToken}`}>
                <div className="portfolio-product-card__topline">
                  <span>0{index + 1}</span>
                  <span>{product.parentLabel}</span>
                </div>
                <div className="portfolio-product-card__identity">
                  <span className="portfolio-product-card__monogram">{product.shortName}</span>
                  <div>
                    <h3>{product.name}</h3>
                    <p>{product.category}</p>
                  </div>
                </div>
                <div className="portfolio-product-card__image">
                  <Image src={product.screenshot.src} alt={product.screenshot.alt} fill sizes="(max-width: 760px) 92vw, (max-width: 1100px) 45vw, 29vw" />
                </div>
                <p className="portfolio-product-card__headline">{product.headline}</p>
                <p className="portfolio-product-card__summary">{product.description}</p>
                <div className="portfolio-chip-row" aria-label={`${product.name} capabilities`}>
                  {product.capabilities.slice(0, 3).map((capability) => <span key={capability.label}>{capability.label}</span>)}
                </div>
                <div className="portfolio-product-card__footer">
                  <span><CircleDot aria-hidden="true" /> {product.accessDescription}</span>
                  <a href={product.websiteUrl} data-product={product.analyticsId}>
                    {product.websiteLabel} <ArrowUpRight aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ProductRouter />

      <section className="portfolio-section portfolio-spotlights" aria-label="Application spotlights">
        <div className="northstar-container">
          {projectScreens.map((product, index) => (
            <article key={product.slug} className={`portfolio-spotlight portfolio-accent--${product.accentToken} ${index % 2 === 1 ? 'portfolio-spotlight--reverse' : ''}`}>
              <div className="portfolio-spotlight__visual">
                <div className="portfolio-spotlight__image">
                  <Image src={product.screenshot.src} alt={product.screenshot.alt} fill sizes="(max-width: 900px) 92vw, 50vw" />
                </div>
                <div className="portfolio-evidence">
                  <span>{product.screenshot.maturity}</span>
                  <p>{product.screenshot.caption}</p>
                </div>
              </div>
              <div className="portfolio-spotlight__copy">
                <p className="portfolio-eyebrow">0{index + 1} / {product.operatingEnvironment}</p>
                <p className="portfolio-parent-label">{product.parentLabel}</p>
                <h2>{product.name}</h2>
                <h3>{product.supportingStatement}</h3>
                <p className="portfolio-problem">{product.problemStatement}</p>
                <dl className="portfolio-capability-list">
                  {product.capabilities.map((capability) => (
                    <div key={capability.label}>
                      <dt><Check aria-hidden="true" /> {capability.label}</dt>
                      <dd>{capability.description}</dd>
                    </div>
                  ))}
                </dl>
                <p className="portfolio-proof-boundary"><strong>Authority boundary:</strong> {product.proofBoundary}</p>
                <div className="portfolio-actions">
                  <a href={product.websiteUrl} className="portfolio-button portfolio-button--product" data-product={product.analyticsId}>
                    {product.websiteLabel} <ArrowUpRight aria-hidden="true" />
                  </a>
                  <Link href={product.path} className="portfolio-text-link">View product brief <ArrowRight aria-hidden="true" /></Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="approach" className="portfolio-section portfolio-method" aria-labelledby="method-title">
        <div className="portfolio-grid" aria-hidden="true" />
        <div className="northstar-container">
          <div className="portfolio-section-heading portfolio-section-heading--split">
            <div>
              <p className="portfolio-eyebrow">The method</p>
              <h2 id="method-title">Different industries. The same demand for operational clarity.</h2>
            </div>
            <p>Our products follow the work closely enough to preserve roles, evidence, and the moments where human judgment still matters.</p>
          </div>
          <div className="portfolio-method-grid">
            {method.map((principle) => (
              <article key={principle.index}>
                <span>{principle.index}</span>
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="studio" className="portfolio-section portfolio-studio" aria-labelledby="studio-title">
        <div className="northstar-container portfolio-studio__layout">
          <div>
            <p className="portfolio-eyebrow">Start a conversation</p>
            <h2 id="studio-title">Tell us what needs to work better.</h2>
            <p className="portfolio-lede">
              Share the outcome, the constraint, and what is already in motion. We’ll respond with a scoped technical approach, an architecture recommendation, and a realistic path to launch.
            </p>
            <Link href="/contact" className="portfolio-button portfolio-button--primary">
              Book a discovery call <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <aside className="portfolio-studio__signal">
            <p className="portfolio-eyebrow">Practical next steps</p>
            <h3>Not a generic discovery script.</h3>
            <p>We review the operating context before recommending scope. Custom work may include:</p>
            <ul>
              {studioCapabilities.map((capability) => <li key={capability}><ArrowDownRight aria-hidden="true" /> {capability}</li>)}
            </ul>
          </aside>
        </div>
      </section>

      <section className="portfolio-section portfolio-paths" aria-labelledby="paths-title">
        <div className="northstar-container">
          <p className="portfolio-eyebrow">Select the right path</p>
          <h2 id="paths-title">Start with the product closest to your operation.</h2>
          <div className="portfolio-path-list">
            {projectScreens.map((product, index) => (
              <a key={product.slug} href={product.websiteUrl} data-product={product.analyticsId}>
                <span>0{index + 1}</span>
                <strong>{product.operatingEnvironment}</strong>
                <small>{product.name}</small>
                <ArrowUpRight aria-hidden="true" />
              </a>
            ))}
            <Link href="/contact">
              <span>04</span>
              <strong>A specialized workflow that needs custom software</strong>
              <small>MBMApps Studio</small>
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="portfolio-final">
        <div className="northstar-container">
          <p className="portfolio-eyebrow">Choose what moves next</p>
          <h2>Explore the applications—or bring us the workflow that still needs one.</h2>
          <div className="portfolio-actions portfolio-actions--centered">
            <Link href="/apps" className="portfolio-button portfolio-button--primary">Browse apps <ArrowRight aria-hidden="true" /></Link>
            <Link href="/contact" className="portfolio-text-link">Start a conversation <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
