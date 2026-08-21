import Link from 'next/link';
import { ArrowRight, ArrowUpRight, CircleDot } from 'lucide-react';
import { getInsights } from '@/lib/content';
import { projectScreens } from '@/lib/projects';
import { siteConfig } from '@/lib/site';

const dateFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

export async function FlightLedgerHome() {
  const insights = await getInsights();
  const latestNote = insights[0];
  const capabilityCount = projectScreens.reduce((total, product) => total + product.capabilities.length, 0);

  const readouts = [
    { label: 'Products', value: String(projectScreens.length).padStart(2, '0') },
    { label: 'Capabilities', value: String(capabilityCount).padStart(2, '0') },
    { label: 'Field notes', value: String(insights.length).padStart(2, '0') },
    { label: 'Studio', value: 'CHI / US' }
  ];

  return (
    <div className="ledger-home">
      {latestNote ? (
        <Link href={`/insights/${latestNote.slug}`} className="ledger-signal">
          <span className="ledger-signal__label">Latest field note</span>
          <span className="ledger-signal__title">{latestNote.frontmatter.title}</span>
          <ArrowRight aria-hidden="true" />
        </Link>
      ) : null}

      <section className="ledger-hero" aria-labelledby="ledger-hero-title">
        <div className="northstar-container ledger-hero__layout">
          <div className="ledger-hero__copy">
            <p className="ledger-thesis">Precision, governed by proof.</p>
            <h1 id="ledger-hero-title">
              Purpose-built software for work that cannot run on guesswork.
            </h1>
            <p className="ledger-lede">
              {siteConfig.name} builds focused operating systems for catering, youth sports, and
              quote-to-event workflows—turning fragmented processes into clear, usable applications.
            </p>
            <div className="ledger-hero__actions">
              <Link href="/apps" className="ledger-button">
                Browse apps <ArrowRight aria-hidden="true" />
              </Link>
              <Link href="/contact" className="ledger-text-link">
                Start a conversation <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
          <dl className="ledger-readouts" aria-label="Studio readouts">
            {readouts.map((readout) => (
              <div key={readout.label}>
                <dt>{readout.label}</dt>
                <dd>{readout.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="ledger-section" aria-labelledby="ledger-register-title">
        <div className="northstar-container">
          <header className="ledger-section__heading">
            <p className="northstar-kicker">The register</p>
            <h2 id="ledger-register-title">Every application, one line each.</h2>
          </header>
        </div>
        <div className="ledger-register" role="list">
          {projectScreens.map((product, index) => (
            <article
              key={product.slug}
              role="listitem"
              className={`ledger-row portfolio-accent--${product.accentToken}`}
            >
              <div className="northstar-container ledger-row__grid">
                <span className="ledger-row__index">0{index + 1}</span>
                <span className="ledger-row__monogram" aria-hidden="true">{product.shortName}</span>
                <div className="ledger-row__identity">
                  <h3>{product.name}</h3>
                  <p>{product.category}</p>
                </div>
                <p className="ledger-row__environment">{product.operatingEnvironment}</p>
                <ul className="ledger-row__capabilities" aria-label={`${product.name} capabilities`}>
                  {product.capabilities.slice(0, 3).map((capability) => (
                    <li key={capability.label}>{capability.label}</li>
                  ))}
                </ul>
                <div className="ledger-row__status">
                  <span><CircleDot aria-hidden="true" /> {product.accessDescription}</span>
                  <div className="ledger-row__links">
                    <a href={product.websiteUrl} data-product={product.analyticsId}>
                      {product.websiteLabel} <ArrowUpRight aria-hidden="true" />
                    </a>
                    <Link href={product.path}>Product brief <ArrowRight aria-hidden="true" /></Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
          <div className="ledger-row ledger-row--studio">
            <div className="northstar-container ledger-row__grid">
              <span className="ledger-row__index">0{projectScreens.length + 1}</span>
              <span className="ledger-row__monogram" aria-hidden="true">MBM</span>
              <div className="ledger-row__identity">
                <h3>MBMApps Studio</h3>
                <p>Custom operating systems</p>
              </div>
              <p className="ledger-row__environment">A specialized workflow that still needs software</p>
              <ul className="ledger-row__capabilities">
                <li>Workflow modeling</li>
                <li>Product architecture</li>
                <li>Production readiness</li>
              </ul>
              <div className="ledger-row__status">
                <span><CircleDot aria-hidden="true" /> Discovery conversations open</span>
                <div className="ledger-row__links">
                  <Link href="/contact">Start a conversation <ArrowRight aria-hidden="true" /></Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ledger-section" aria-labelledby="ledger-panel-title">
        <div className="northstar-container">
          <header className="ledger-section__heading">
            <p className="northstar-kicker">Instrument panel</p>
            <h2 id="ledger-panel-title">What each system keeps visible.</h2>
            <p className="ledger-annotation">Access, approvals, evidence, and state—never hidden behind ambiguous automation.</p>
          </header>
          <div className="ledger-panel">
            {projectScreens.map((product) => (
              <div key={product.slug} className={`ledger-panel__column portfolio-accent--${product.accentToken}`}>
                <p className="ledger-panel__product">{product.name}</p>
                <dl>
                  {product.capabilities.map((capability) => (
                    <div key={capability.label}>
                      <dt>{capability.label}</dt>
                      <dd>{capability.description}</dd>
                    </div>
                  ))}
                </dl>
                <p className="ledger-panel__boundary">{product.proofBoundary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {insights.length > 0 ? (
        <section className="ledger-section" aria-labelledby="ledger-notes-title">
          <div className="northstar-container">
            <header className="ledger-section__heading ledger-section__heading--split">
              <div>
                <p className="northstar-kicker">Field notes</p>
                <h2 id="ledger-notes-title">Written from implementation work.</h2>
              </div>
              <Link href="/insights" className="ledger-text-link">All notes <ArrowRight aria-hidden="true" /></Link>
            </header>
            <div className="ledger-notes">
              {insights.map((post) => (
                <Link key={post.slug} href={`/insights/${post.slug}`} className="ledger-note">
                  <time dateTime={post.frontmatter.publishedAt}>
                    {dateFormat.format(new Date(post.frontmatter.publishedAt))}
                  </time>
                  <div>
                    <h3>{post.frontmatter.title}</h3>
                    <p>{post.frontmatter.summary}</p>
                  </div>
                  <span className="ledger-note__tags">
                    {post.frontmatter.tags.slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}
                  </span>
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="ledger-section ledger-coordinates" aria-labelledby="ledger-contact-title">
        <div className="northstar-container ledger-coordinates__layout">
          <div>
            <p className="northstar-kicker">Coordinates</p>
            <h2 id="ledger-contact-title">Tell us what needs to work better.</h2>
            <p className="ledger-lede">
              Share the outcome, the constraint, and what is already in motion. We respond with a scoped
              technical approach and a realistic path to launch.
            </p>
          </div>
          <div className="ledger-coordinates__actions">
            <Link href="/contact" className="ledger-button">Book a discovery call <ArrowRight aria-hidden="true" /></Link>
            <a href={`mailto:${siteConfig.email}`} className="ledger-text-link">{siteConfig.email}</a>
          </div>
        </div>
      </section>
    </div>
  );
}
