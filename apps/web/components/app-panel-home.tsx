'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowDownRight, ArrowRight, ArrowUpRight, Check, CircleDot } from 'lucide-react';
import { ProductRouter } from '@/components/product-router';
import {
  CountUp,
  Parallax,
  Reveal,
  RevealItem,
  RevealList,
  TiltCard,
  TimelineTrack,
  TitleReveal,
  useIntroGate
} from '@/components/motion';
import { projectScreens, type ProductRecord } from '@/lib/projects';

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

const studioSignals = [
  { value: '3', label: 'products live across catering, youth sports, and quote-to-event operations' },
  { value: '75', label: 'deployed backend functions behind the QuotePilot workspace alone' },
  { value: '13', label: 'connected staff surfaces in a single command center' },
  { value: '16', label: 'tagged production releases shipped in 2026' }
];

const heroStatus: Record<string, string> = {
  quietpilot: 'Live demo',
  leaguepilot: 'Live site',
  quoteflow: 'v0.6.0 live'
};

const momentBeats = [
  { key: 'trigger', label: 'The trigger' },
  { key: 'decision', label: 'The call to make' },
  { key: 'systemResponse', label: 'What the system does' },
  { key: 'authorityBoundary', label: 'Who stays in charge' },
  { key: 'resultingClarity', label: 'What becomes clear' }
] as const;

function HeroSection() {
  const introDone = useIntroGate();
  const primaryProduct = projectScreens[0];
  const supportingProducts = projectScreens.slice(1);

  return (
    <section className="portfolio-hero" aria-labelledby="portfolio-hero-title">
      <div className="portfolio-grid" aria-hidden="true" />
      <div className="portfolio-aurora" aria-hidden="true" />
      <div className="northstar-container portfolio-hero__layout">
        <div className="portfolio-hero__copy">
          <Reveal play={introDone} delay={0.05} y={16}>
            <p className="portfolio-eyebrow">Independent software studio</p>
          </Reveal>
          <TitleReveal
            as="h1"
            id="portfolio-hero-title"
            className="portfolio-display"
            text="Purpose-built software for work that cannot run on guesswork."
            play={introDone}
            delay={0.18}
          />
          <Reveal play={introDone} delay={0.62}>
            <p className="portfolio-lede">
              MBMApps creates focused operating systems for catering, youth sports, and quote-to-event workflows—turning fragmented processes into clear, usable applications.
            </p>
          </Reveal>
          <Reveal play={introDone} delay={0.76}>
            <div className="portfolio-actions">
              <Link href="/apps" className="portfolio-button portfolio-button--primary">
                Browse apps <ArrowRight aria-hidden="true" />
              </Link>
              <Link href="/contact" className="portfolio-text-link">
                Start a conversation <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
          <Reveal play={introDone} delay={0.9} y={14}>
            <ul className="portfolio-hero__status" aria-label="Current product status">
              {projectScreens.map((product) => (
                <li key={product.slug} className={`portfolio-accent--${product.accentToken}`}>
                  <span className="portfolio-live-dot" aria-hidden="true" />
                  {product.name} · {heroStatus[product.slug] ?? product.status}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="portfolio-composition" aria-label="MBMApps application portfolio previews">
          <Reveal play={introDone} delay={0.42} y={44} className="portfolio-composition__primary">
            <TiltCard maxTilt={5}>
              <Link
                href={primaryProduct.path}
                className={`portfolio-window portfolio-window--primary portfolio-accent--${primaryProduct.accentToken}`}
              >
                <span className="portfolio-window__label">{primaryProduct.name}</span>
                <span className="portfolio-window__frame portfolio-float portfolio-float--slow">
                  <Image
                    src={primaryProduct.screenshot.src}
                    alt={primaryProduct.screenshot.alt}
                    fill
                    priority
                    sizes="(max-width: 900px) 92vw, 42vw"
                  />
                </span>
              </Link>
            </TiltCard>
          </Reveal>
          <div className="portfolio-composition__supporting">
            {supportingProducts.map((product, index) => (
              <Reveal key={product.slug} play={introDone} delay={0.58 + index * 0.14} y={40}>
                <TiltCard maxTilt={6}>
                  <Link
                    href={product.path}
                    className={`portfolio-window portfolio-window--supporting portfolio-accent--${product.accentToken} ${
                      index % 2 === 0 ? 'portfolio-window--offset-left' : 'portfolio-window--offset-right'
                    }`}
                  >
                    <span className="portfolio-window__label">{product.name}</span>
                    <span className={`portfolio-window__frame portfolio-float ${index % 2 === 0 ? 'portfolio-float--drift' : 'portfolio-float--late'}`}>
                      <Image src={product.screenshot.src} alt={product.screenshot.alt} fill sizes="(max-width: 900px) 92vw, 22vw" />
                    </span>
                  </Link>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SignalsBand() {
  return (
    <section className="portfolio-signals" aria-label="Studio signals">
      <div className="northstar-container">
        <Reveal y={14}>
          <p className="portfolio-eyebrow">Proof, not promises</p>
        </Reveal>
        <RevealList className="portfolio-signals__grid" as="ul" stagger={0.1}>
          {studioSignals.map((signal) => (
            <RevealItem key={signal.label} as="li" pop>
              <CountUp value={signal.value} className="portfolio-signals__value" />
              <p>{signal.label}</p>
            </RevealItem>
          ))}
        </RevealList>
        <Reveal y={12} delay={0.2}>
          <p className="portfolio-signals__caption">Counted from the source repositories and release history—not a slide deck.</p>
        </Reveal>
      </div>
    </section>
  );
}

function ApplicationIndex() {
  return (
    <section id="apps" className="portfolio-section portfolio-index" aria-labelledby="application-index-title">
      <div className="northstar-container">
        <div className="portfolio-section-heading portfolio-section-heading--split">
          <div>
            <Reveal y={14}>
              <p className="portfolio-eyebrow">The applications</p>
            </Reveal>
            <TitleReveal as="h2" id="application-index-title" text="Three products. Three operating environments." />
          </div>
          <Reveal delay={0.25}>
            <p>One standard: make the next action clear.</p>
          </Reveal>
        </div>

        <RevealList className="portfolio-product-grid" stagger={0.12}>
          {projectScreens.map((product, index) => (
            <RevealItem key={product.slug} as="article" className={`portfolio-product-card portfolio-accent--${product.accentToken}`}>
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
              <div className="portfolio-product-card__image portfolio-sheen">
                <Image src={product.screenshot.src} alt={product.screenshot.alt} fill sizes="(max-width: 760px) 92vw, (max-width: 1100px) 45vw, 29vw" />
              </div>
              <p className="portfolio-product-card__headline">{product.headline}</p>
              <p className="portfolio-product-card__summary">{product.description}</p>
              <div className="portfolio-chip-row" aria-label={`${product.name} capabilities`}>
                {product.capabilities.slice(0, 3).map((capability) => (
                  <span key={capability.label}>{capability.label}</span>
                ))}
              </div>
              <div className="portfolio-product-card__footer">
                <span>
                  <CircleDot aria-hidden="true" /> {product.accessDescription}
                </span>
                <a href={product.websiteUrl} data-product={product.analyticsId}>
                  {product.websiteLabel} <ArrowUpRight aria-hidden="true" />
                </a>
              </div>
            </RevealItem>
          ))}
        </RevealList>
      </div>
    </section>
  );
}

function MomentTimeline({ product }: { product: ProductRecord }) {
  return (
    <TimelineTrack className="portfolio-moment">
      <p className="portfolio-moment__title">One moment, end to end</p>
      <RevealList as="ol" className="portfolio-moment__beats" stagger={0.14}>
        {momentBeats.map((beat, index) => (
          <RevealItem key={beat.key} as="li">
            <span className="portfolio-moment__marker" aria-hidden="true" />
            <div>
              <span className="portfolio-moment__label">
                0{index + 1} · {beat.label}
              </span>
              <p>{product.scenario[beat.key]}</p>
            </div>
          </RevealItem>
        ))}
      </RevealList>
    </TimelineTrack>
  );
}

function Spotlights() {
  return (
    <section className="portfolio-section portfolio-spotlights" aria-label="Application spotlights">
      <div className="northstar-container">
        {projectScreens.map((product, index) => (
          <article
            key={product.slug}
            className={`portfolio-spotlight portfolio-accent--${product.accentToken} ${index % 2 === 1 ? 'portfolio-spotlight--reverse' : ''}`}
          >
            <div className="portfolio-spotlight__visual">
              <Parallax distance={34}>
                <Reveal y={30}>
                  <div className="portfolio-spotlight__image portfolio-sheen">
                    <Image src={product.screenshot.src} alt={product.screenshot.alt} fill sizes="(max-width: 900px) 92vw, 50vw" />
                  </div>
                  <div className="portfolio-evidence">
                    <span>{product.screenshot.maturity}</span>
                    <p>{product.screenshot.caption}</p>
                  </div>
                </Reveal>
              </Parallax>
              <MomentTimeline product={product} />
            </div>
            <div className="portfolio-spotlight__copy">
              <Reveal y={14}>
                <p className="portfolio-eyebrow">
                  0{index + 1} / {product.operatingEnvironment}
                </p>
                <p className="portfolio-parent-label">{product.parentLabel}</p>
              </Reveal>
              <TitleReveal as="h2" text={product.name} />
              <Reveal delay={0.15}>
                <h3>{product.supportingStatement}</h3>
                <p className="portfolio-problem">{product.problemStatement}</p>
              </Reveal>
              <RevealList as="dl" className="portfolio-capability-list" stagger={0.09}>
                {product.capabilities.map((capability) => (
                  <RevealItem key={capability.label}>
                    <dt>
                      <Check aria-hidden="true" /> {capability.label}
                    </dt>
                    <dd>{capability.description}</dd>
                  </RevealItem>
                ))}
              </RevealList>
              <RevealList as="ul" className="portfolio-signal-row" stagger={0.1} delay={0.1}>
                {product.signals.map((signal) => (
                  <RevealItem key={signal.label} as="li" pop>
                    <CountUp value={signal.value} className="portfolio-signal-row__value" />
                    <span>{signal.label}</span>
                  </RevealItem>
                ))}
              </RevealList>
              <Reveal delay={0.15}>
                <p className="portfolio-proof-boundary">
                  <strong>Authority boundary:</strong> {product.proofBoundary}
                </p>
                <div className="portfolio-actions">
                  <a href={product.websiteUrl} className="portfolio-button portfolio-button--product" data-product={product.analyticsId}>
                    {product.websiteLabel} <ArrowUpRight aria-hidden="true" />
                  </a>
                  <Link href={product.path} className="portfolio-text-link">
                    View product brief <ArrowRight aria-hidden="true" />
                  </Link>
                </div>
              </Reveal>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function MethodSection() {
  return (
    <section id="approach" className="portfolio-section portfolio-method" aria-labelledby="method-title">
      <div className="portfolio-grid" aria-hidden="true" />
      <div className="northstar-container">
        <div className="portfolio-section-heading portfolio-section-heading--split">
          <div>
            <Reveal y={14}>
              <p className="portfolio-eyebrow">The method</p>
            </Reveal>
            <TitleReveal as="h2" id="method-title" text="Different industries. The same demand for operational clarity." />
          </div>
          <Reveal delay={0.25}>
            <p>Our products follow the work closely enough to preserve roles, evidence, and the moments where human judgment still matters.</p>
          </Reveal>
        </div>
        <RevealList className="portfolio-method-grid" stagger={0.12}>
          {method.map((principle) => (
            <RevealItem key={principle.index} as="article">
              <span>{principle.index}</span>
              <h3>{principle.title}</h3>
              <p>{principle.description}</p>
            </RevealItem>
          ))}
        </RevealList>
      </div>
    </section>
  );
}

function StudioSection() {
  return (
    <section id="studio" className="portfolio-section portfolio-studio" aria-labelledby="studio-title">
      <div className="northstar-container portfolio-studio__layout">
        <div>
          <Reveal y={14}>
            <p className="portfolio-eyebrow">Start a conversation</p>
          </Reveal>
          <TitleReveal as="h2" id="studio-title" text="Tell us what needs to work better." />
          <Reveal delay={0.2}>
            <p className="portfolio-lede">
              Share the outcome, the constraint, and what is already in motion. We’ll respond with a scoped technical approach, an architecture recommendation, and a realistic path to launch.
            </p>
            <Link href="/contact" className="portfolio-button portfolio-button--primary">
              Book a discovery call <ArrowRight aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
        <Reveal delay={0.25} y={34}>
          <aside className="portfolio-studio__signal">
            <p className="portfolio-eyebrow">Practical next steps</p>
            <h3>Not a generic discovery script.</h3>
            <p>We review the operating context before recommending scope. Custom work may include:</p>
            <RevealList as="ul" stagger={0.07}>
              {studioCapabilities.map((capability) => (
                <RevealItem key={capability} as="li">
                  <ArrowDownRight aria-hidden="true" /> {capability}
                </RevealItem>
              ))}
            </RevealList>
          </aside>
        </Reveal>
      </div>
    </section>
  );
}

function PathsSection() {
  return (
    <section className="portfolio-section portfolio-paths" aria-labelledby="paths-title">
      <div className="northstar-container">
        <Reveal y={14}>
          <p className="portfolio-eyebrow">Select the right path</p>
        </Reveal>
        <TitleReveal as="h2" id="paths-title" text="Start with the product closest to your operation." />
        <RevealList className="portfolio-path-list" stagger={0.09}>
          {projectScreens.map((product, index) => (
            <RevealItem key={product.slug}>
              <a href={product.websiteUrl} data-product={product.analyticsId}>
                <span>0{index + 1}</span>
                <strong>{product.operatingEnvironment}</strong>
                <small>{product.name}</small>
                <ArrowUpRight aria-hidden="true" />
              </a>
            </RevealItem>
          ))}
          <RevealItem>
            <Link href="/contact">
              <span>04</span>
              <strong>A specialized workflow that needs custom software</strong>
              <small>MBMApps Studio</small>
              <ArrowRight aria-hidden="true" />
            </Link>
          </RevealItem>
        </RevealList>
      </div>
    </section>
  );
}

function FinalSection() {
  return (
    <section className="portfolio-final">
      <div className="portfolio-aurora portfolio-aurora--final" aria-hidden="true" />
      <div className="northstar-container">
        <Reveal y={14}>
          <p className="portfolio-eyebrow">Choose what moves next</p>
        </Reveal>
        <TitleReveal as="h2" text="Explore the applications—or bring us the workflow that still needs one." />
        <Reveal delay={0.3}>
          <div className="portfolio-actions portfolio-actions--centered">
            <Link href="/apps" className="portfolio-button portfolio-button--primary">
              Browse apps <ArrowRight aria-hidden="true" />
            </Link>
            <Link href="/contact" className="portfolio-text-link">
              Start a conversation <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function AppPanelHome() {
  return (
    <div className="portfolio-home">
      <noscript>
        <style>{`.portfolio-home [style] { opacity: 1 !important; transform: none !important; filter: none !important; }`}</style>
      </noscript>
      <HeroSection />
      <SignalsBand />
      <ApplicationIndex />
      <ProductRouter />
      <Spotlights />
      <MethodSection />
      <StudioSection />
      <PathsSection />
      <FinalSection />
    </div>
  );
}
