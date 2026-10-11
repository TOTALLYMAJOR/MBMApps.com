'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  ArrowLeftRight,
  BarChart3,
  Calculator,
  Check,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  FileCheck2,
  Gauge,
  Inbox,
  Layers,
  LockKeyhole,
  Menu,
  Radio,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
  UserRound,
  X,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { quietPilotProduct } from '@/lib/site';
const demoShiftHref = quietPilotProduct.demoPath;
import {
  livingEventCascade,
  livingEventIdentity,
  livingEventNumbers,
  livingEventQuoteV1Lines,
  livingEventQualification,
  livingEventReadinessLanes,
  livingEventSpineStages,
} from './living-event';
import styles from './catering-platform-landing.module.css';

const stageDetails = [
  {
    title: 'Structure the inquiry',
    body: 'Capture the event date, service style, guest count, venue, and open questions before a promise becomes a quote.',
    metric: '5 unknowns resolved',
    note: 'Sample qualification record',
  },
  {
    title: 'Qualify the opportunity',
    body: 'Keep the lead, commercial context, and next action together so the sales team can move with shared context.',
    metric: '140 guests',
    note: 'Sample lead context',
  },
  {
    title: 'Price with consequences visible',
    body: 'Connect scope, labor, rentals, and projected margin before the quote becomes a customer-facing commitment.',
    metric: '$26,800',
    note: 'Sample quote v1',
  },
  {
    title: 'Carry one governed proposal',
    body: 'Keep the quoted scope and customer decision tied to the same commercial snapshot instead of scattered attachments.',
    metric: 'Quote v1 locked',
    note: 'Sample proposal state',
  },
  {
    title: 'Preserve the accepted snapshot',
    body: 'An accepted proposal records the customer decision. It does not silently imply payment, staffing, inventory, or readiness.',
    metric: 'Accepted ≠ ready',
    note: 'Sample decision boundary',
  },
  {
    title: 'Track payment evidence',
    body: 'Keep the scheduled amount and provider-backed evidence distinct so browser state never masquerades as settlement truth.',
    metric: '$9,090',
    note: 'Sample deposit evidence',
  },
  {
    title: 'Hold until evidence clears',
    body: 'Bring proposal, payment, staffing, inventory, and schedule evidence into one readiness decision with an explicit next action.',
    metric: '3 blockers cleared',
    note: 'Sample readiness board',
  },
  {
    title: 'Hand off without losing context',
    body: 'Carry the governed event state into downstream operations while preserving source, owner, and unresolved work.',
    metric: 'One event record',
    note: 'Sample downstream handoff',
  },
] as const;

const featureCards = [
  {
    icon: FileCheck2,
    title: 'Quote continuity',
    body: 'When scope changes, QuietPilot keeps the quote version, projected margin, and customer decision connected.',
    proof: '140 → 168 guests · quote v1 → v2',
  },
  {
    icon: Gauge,
    title: 'Commercial blast radius',
    body: 'See how one change touches revenue, staffing, rentals, prep hours, and the safest next action.',
    proof: '+7 linked consequences in the sample',
  },
  {
    icon: CircleDollarSign,
    title: 'Payment truth',
    body: 'Distinguish scheduled amounts, checkout handoffs, browser returns, and provider-backed evidence.',
    proof: 'Handoff never equals activation',
  },
  {
    icon: ClipboardCheck,
    title: 'Job readiness',
    body: 'Hold the event until the operational evidence needed for service is present and reviewable.',
    proof: 'Accepted ≠ paid ≠ ready',
  },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;
const stageIcons = [
  Inbox,
  UserRound,
  Calculator,
  FileCheck2,
  ShieldCheck,
  CircleDollarSign,
  ClipboardCheck,
  Send,
];

function WindowDots() {
  return (
    <span className={styles.windowDots} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

function StagePreview({ stage }: { stage: number }) {
  if (stage === 0 || stage === 1) {
    return (
      <div className={styles.previewRows}>
        <div className={styles.previewIdentity}>
          <span>DC</span>
          <div>
            <strong>{livingEventIdentity.clientName}</strong>
            <small>
              {livingEventIdentity.name} · {livingEventIdentity.shortDate}
            </small>
          </div>
        </div>
        {livingEventQualification.slice(0, 3).map((item) => (
          <div className={styles.previewLine} key={item.id}>
            <span>{item.label}</span>
            <strong>{stage === 0 ? item.unknown : item.known}</strong>
          </div>
        ))}
      </div>
    );
  }
  if (stage === 2) {
    return (
      <div className={styles.previewRows}>
        {livingEventQuoteV1Lines.map((line) => (
          <div className={styles.previewLine} key={line.id}>
            <span>{line.label}</span>
            <strong>${line.amountUsd.toLocaleString('en-US')}</strong>
          </div>
        ))}
        <div className={styles.previewHighlight}>
          <span>Projected margin · quote v1</span>
          <strong>{livingEventNumbers.marginV1Percent}%</strong>
        </div>
      </div>
    );
  }
  if (stage === 3 || stage === 4) {
    return (
      <div className={styles.previewDocument}>
        <FileCheck2 aria-hidden="true" size={28} />
        <strong>{stage === 3 ? 'Proposal · quote v1' : 'Accepted · quote v2'}</strong>
        <span>{livingEventIdentity.name}</span>
        <div className={styles.documentLines} aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className={styles.previewHighlight}>
          <span>{stage === 3 ? 'Quoted scope' : 'Accepted snapshot'}</span>
          <strong>
            $
            {(stage === 3
              ? livingEventNumbers.quoteV1TotalUsd
              : livingEventNumbers.quoteV2TotalUsd
            ).toLocaleString('en-US')}
          </strong>
        </div>
        <small>
          {stage === 3
            ? 'Customer decision pending'
            : 'Acceptance does not establish payment or readiness.'}
        </small>
      </div>
    );
  }
  if (stage === 5) {
    return (
      <div className={styles.previewRows}>
        <div className={styles.previewLine}>
          <span>Deposit · {livingEventNumbers.depositPercent}%</span>
          <strong>${livingEventNumbers.depositUsd.toLocaleString('en-US')}</strong>
        </div>
        <div className={styles.paymentTrack} aria-hidden="true">
          <span />
        </div>
        <div className={styles.previewLine}>
          <span>Invoice state</span>
          <strong>Invoiced</strong>
        </div>
        <div className={styles.previewHighlight}>
          <span>Settlement evidence</span>
          <strong>Pending</strong>
        </div>
        <small>Scheduled amounts do not establish collection.</small>
      </div>
    );
  }
  return (
    <div className={styles.previewRows}>
      {livingEventReadinessLanes.slice(0, 4).map((lane) => (
        <div className={styles.previewLine} key={lane.id}>
          <span>{lane.label}</span>
          <strong>{lane.openStatus}</strong>
        </div>
      ))}
      <div className={styles.previewHighlight}>
        <span>{stage === 6 ? 'Readiness' : 'Downstream handoff'}</span>
        <strong>Held for review</strong>
      </div>
    </div>
  );
}

function FeatureVisual({ index }: { index: number }) {
  if (index === 0)
    return (
      <div className={styles.featureVisual}>
        <div className={styles.previewLine}>
          <span>Plated dinner · 140 × $125</span>
          <strong>$17,500</strong>
        </div>
        <div className={styles.previewHighlight}>
          <span>Projected margin · quote v1</span>
          <strong>41.2%</strong>
        </div>
      </div>
    );
  if (index === 1)
    return (
      <div className={styles.featureVisual}>
        <div className={styles.riskPreview}>
          <Gauge aria-hidden="true" size={22} />
          <div>
            <strong>Rental capacity</strong>
            <small>8 settings short · sample</small>
          </div>
        </div>
      </div>
    );
  if (index === 2)
    return (
      <div className={styles.featureVisual}>
        <div className={styles.paymentVisual}>
          <CircleDollarSign aria-hidden="true" size={30} />
          <span>
            Invoice<small>≠ settlement</small>
          </span>
          <LockKeyhole aria-hidden="true" size={25} />
        </div>
      </div>
    );
  return (
    <div className={styles.featureVisual}>
      <div className={styles.bridge}>
        <span>Sales</span>
        <ArrowLeftRight aria-hidden="true" size={22} />
        <span>Operations</span>
      </div>
    </div>
  );
}

function useHydratedReducedMotion() {
  const [reducedMotion, setReducedMotion] = React.useState(true);

  React.useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return reducedMotion;
}

function SectionReveal({
  children,
  delay = 0,
  reducedMotion,
}: {
  children: React.ReactNode;
  delay?: number;
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      key={reducedMotion ? 'static' : 'motion'}
      initial={reducedMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: reducedMotion ? 0 : 0.46, delay: reducedMotion ? 0 : delay, ease }}
    >
      {children}
    </motion.div>
  );
}

function formatStageNumber(index: number) {
  return String(index + 1).padStart(2, '0');
}

export function CateringPlatformLanding() {
  const reducedMotion = useHydratedReducedMotion();
  const [activeStage, setActiveStage] = React.useState(2);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const activeDetail = stageDetails[activeStage] ?? stageDetails[0];
  const ActiveIcon = stageIcons[activeStage] ?? Inbox;
  const pageRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const root = pageRef.current;
    if (!root) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        (entry.target as HTMLElement).dataset.inView = String(entry.isIntersecting);
      }
    });
    root.querySelectorAll('[data-ambient]').forEach((node) => observer.observe(node));
    const visibility = () => {
      root.dataset.pageHidden = String(document.hidden);
    };
    visibility();
    document.addEventListener('visibilitychange', visibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [reducedMotion]);

  const reveal = reducedMotion
    ? { opacity: 1 }
    : { opacity: 1, transition: { duration: 0.7, ease } };

  return (
    <div
      ref={pageRef}
      className={styles.page}
      data-qp-skin="public-landing"
      data-landing-design="catering-platform"
    >
      <a className={styles.skipLink} href="#quietpilot-content">
        Skip to main content
      </a>

      <header className={styles.header}>
        <div className={styles.navbar}>
          <Link className={styles.brand} href={quietPilotProduct.path} aria-label="QuietPilot for catering">
            <span className={styles.brandMark}>
              <Layers aria-hidden="true" size={20} />
            </span>
            <span>
              QuietPilot
              <small>for catering</small>
            </span>
          </Link>

          <nav className={styles.desktopNav} aria-label="Landing navigation">
            <a href="#platform">The Spine</a>
            <a href="#features">Platform</a>
            <a href="#readiness">Readiness</a>
            <a href="#pricing">Pricing</a>
          </nav>

          <div className={styles.navActions}>
            <Link className={styles.loginLink} href={quietPilotProduct.appUrl}>
              Log in
            </Link>
            <Link className={styles.navCta} href="https://www.quietpilot.us/get-started">
              Request access <ArrowRight aria-hidden="true" size={15} />
            </Link>
            <button
              className={styles.menuButton}
              type="button"
              aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((current) => !current)}
            >
              {mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <nav className={styles.mobileNav} aria-label="Mobile landing navigation">
            <a href="#platform" onClick={() => setMobileOpen(false)}>
              Platform
            </a>
            <a href="#readiness" onClick={() => setMobileOpen(false)}>
              Readiness
            </a>
            <a href="#pricing" onClick={() => setMobileOpen(false)}>
              Pricing
            </a>
            <Link href={quietPilotProduct.appUrl}>Log in</Link>
          </nav>
        ) : null}
      </header>

      <section id="quietpilot-content" className={styles.hero}>
        <div className={styles.heroGlow} aria-hidden="true" />
        <motion.div
          key={reducedMotion ? 'hero-copy-static' : 'hero-copy-motion'}
          className={styles.heroCopy}
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={reveal}
        >
          <p className={styles.heroPill}>
            <span aria-hidden="true" /> Revenue operations for catering
          </p>
          <h1>
            The Operating System for
            <span>Catering Revenue.</span>
          </h1>
          <p className={styles.heroLead}>
            One commercial spine. From the first inquiry to the final handoff, keep your quotes,
            customer decisions, and operational readiness connected.
          </p>
          <div className={styles.heroActions}>
            <Link className={styles.primaryButton} href="https://www.quietpilot.us/get-started">
              Request QuietPilot access <ArrowRight aria-hidden="true" size={18} />
            </Link>
            <Link className={styles.secondaryButton} href={demoShiftHref}>
              Walk the sample event <ChevronRight aria-hidden="true" size={17} />
            </Link>
          </div>
        </motion.div>

        <motion.div
          key={reducedMotion ? 'hero-artifact-static' : 'hero-artifact-motion'}
          className={styles.heroArtifact}
          initial={reducedMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: reducedMotion ? 0 : 0.8, delay: 0.12, ease }}
          role="group"
          aria-label="Sample event readiness preview"
          data-ambient="console"
        >
          <div className={styles.artifactTopbar}>
            <WindowDots />
            <span className={styles.consoleTitle}>
              <Radio aria-hidden="true" size={12} /> Sample event · Command preview
            </span>
          </div>
          <div className={styles.artifactGrid}>
            <article>
              <BarChart3 className={styles.statIcon} aria-hidden="true" size={28} />
              <span>Accepted quote</span>
              <strong>$30,300</strong>
              <small>Sample quote v2</small>
            </article>
            <article>
              <Gauge className={styles.statIcon} aria-hidden="true" size={28} />
              <span>Projected margin</span>
              <strong>40.7%</strong>
              <small>Projection, not actual</small>
            </article>
            <article>
              <Users className={styles.statIcon} aria-hidden="true" size={28} />
              <span>Guest count</span>
              <strong>{livingEventNumbers.revisedGuests}</strong>
              <small>{livingEventIdentity.shortDate} · revised scope</small>
            </article>
            <div className={styles.telemetry}>
              <span className={styles.scanLine} aria-hidden="true" />
              <Radio aria-hidden="true" size={24} />
              <strong>{livingEventIdentity.name}</strong>
              <span>Next safe action · Confirm rental capacity</span>
            </div>
          </div>
          <div className={styles.artifactFooter}>
            <ShieldCheck aria-hidden="true" size={18} />
            <span>Accepted does not mean paid, staffed, stocked, or ready.</span>
          </div>
        </motion.div>
        <p className={styles.boundaryNote}>
          Read-only sample. Nothing shown here creates workspace data, payment settlement, or job
          readiness.
        </p>
      </section>

      <section id="platform" className={styles.section} aria-labelledby="spine-title">
        <SectionReveal reducedMotion={reducedMotion}>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>The commercial spine</p>
            <h2 id="spine-title">One event. Every consequential handoff.</h2>
            <p>Select a stage to see what QuietPilot keeps connected and what remains unproven.</p>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.08} reducedMotion={reducedMotion}>
          <div className={styles.spineShell}>
            <div
              className={styles.stageRail}
              role="tablist"
              aria-label="QuietPilot lifecycle stages"
              onKeyDown={(event) => {
                const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
                if (!keys.includes(event.key)) return;
                event.preventDefault();
                const next =
                  event.key === 'Home'
                    ? 0
                    : event.key === 'End'
                      ? livingEventSpineStages.length - 1
                      : (activeStage +
                          (event.key === 'ArrowRight' ? 1 : -1) +
                          livingEventSpineStages.length) %
                        livingEventSpineStages.length;
                setActiveStage(next);
                const tabs = event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]');
                tabs[next]?.focus();
              }}
            >
              <span className={styles.spineLine} aria-hidden="true">
                <span
                  style={{
                    transform: `scaleX(${activeStage / (livingEventSpineStages.length - 1)})`,
                  }}
                />
              </span>
              {livingEventSpineStages.map((stage, index) => {
                const Icon = stageIcons[index] ?? Inbox;
                return (
                  <button
                    key={stage}
                    type="button"
                    role="tab"
                    aria-selected={activeStage === index}
                    aria-controls="landing-stage-panel"
                    id={`landing-stage-${index}`}
                    tabIndex={activeStage === index ? 0 : -1}
                    data-past={index < activeStage}
                    className={activeStage === index ? styles.stageActive : undefined}
                    onClick={() => setActiveStage(index)}
                  >
                    <span className={styles.stageNode}>
                      <Icon aria-hidden="true" size={22} />
                    </span>
                    <span className={styles.stageLabel}>
                      <small>{formatStageNumber(index)}</small> {stage}
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              id="landing-stage-panel"
              className={styles.stagePanel}
              role="tabpanel"
              aria-labelledby={`landing-stage-${activeStage}`}
              tabIndex={0}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeStage}
                  initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={{ duration: reducedMotion ? 0 : 0.24, ease }}
                  className={styles.stagePanelCopy}
                >
                  <p className={styles.stageCount}>Stage {formatStageNumber(activeStage)}</p>
                  <h3>{activeDetail.title}</h3>
                  <p>{activeDetail.body}</p>
                  <div className={styles.stageMetric}>
                    <span>{activeDetail.note}</span>
                    <strong>{activeDetail.metric}</strong>
                  </div>
                  <div className={styles.stageNavigation}>
                    <button
                      type="button"
                      disabled={activeStage === 0}
                      onClick={() => setActiveStage((index) => Math.max(0, index - 1))}
                    >
                      <ArrowLeft aria-hidden="true" size={14} /> Previous
                    </button>
                    <button
                      type="button"
                      disabled={activeStage === stageDetails.length - 1}
                      onClick={() =>
                        setActiveStage((index) => Math.min(stageDetails.length - 1, index + 1))
                      }
                    >
                      Next stage <ArrowRight aria-hidden="true" size={14} />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div
                className={styles.stagePreview}
                role="group"
                aria-label={`${livingEventSpineStages[activeStage]} sample preview`}
              >
                <div className={styles.previewBar}>
                  <WindowDots />
                  <span>
                    <ActiveIcon aria-hidden="true" size={12} />{' '}
                    {livingEventSpineStages[activeStage]} · Sample
                  </span>
                </div>
                <div className={styles.previewBody} key={activeStage}>
                  <StagePreview stage={activeStage} />
                </div>
                <ActiveIcon
                  className={styles.previewWatermark}
                  aria-hidden="true"
                  size={130}
                  strokeWidth={0.7}
                />
              </div>
            </div>
          </div>
        </SectionReveal>
      </section>

      <section
        id="features"
        className={`${styles.section} ${styles.featureSection}`}
        aria-labelledby="features-title"
      >
        <SectionReveal reducedMotion={reducedMotion}>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>What stays connected</p>
            <h2 id="features-title">The operating context behind the event.</h2>
          </div>
        </SectionReveal>
        <div className={styles.featureGrid}>
          {featureCards.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <SectionReveal key={feature.title} delay={index * 0.05} reducedMotion={reducedMotion}>
                <article className={styles.featureCard}>
                  <span className={styles.featureIcon}>
                    <Icon aria-hidden="true" size={20} />
                  </span>
                  <h3>{feature.title}</h3>
                  <p>{feature.body}</p>
                  <small>{feature.proof}</small>
                  <FeatureVisual index={index} />
                </article>
              </SectionReveal>
            );
          })}
        </div>
      </section>

      <section
        className={`${styles.section} ${styles.cascadeSection}`}
        aria-labelledby="cascade-title"
      >
        <SectionReveal reducedMotion={reducedMotion}>
          <div className={styles.cascadeIntro}>
            <p className={styles.eyebrow}>The change</p>
            <h2 id="cascade-title">One number changed. Everything it touched stayed visible.</h2>
            <p>
              The sample event moves from 140 to 168 guests. QuietPilot presents the commercial and
              operational blast radius before the revised promise moves forward.
            </p>
          </div>
        </SectionReveal>
        <ol className={styles.cascadeList}>
          {livingEventCascade.map((item, index) => (
            <motion.li
              key={item.id}
              initial={reducedMotion ? false : { opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: reducedMotion ? 0 : 0.35,
                delay: reducedMotion ? 0 : index * 0.055,
                ease,
              }}
              data-tone={item.tone}
            >
              <span className={styles.cascadeIndex}>{formatStageNumber(index)}</span>
              <div>
                <strong>{item.label}</strong>
                <small>{item.detail}</small>
              </div>
              <b>{item.value}</b>
            </motion.li>
          ))}
        </ol>
      </section>

      <section
        id="readiness"
        className={`${styles.section} ${styles.readinessSection}`}
        aria-labelledby="readiness-title"
      >
        <SectionReveal reducedMotion={reducedMotion}>
          <div className={styles.readinessCopy}>
            <p className={styles.eyebrow}>Job readiness</p>
            <h2 id="readiness-title">Accepted is a decision. Ready is an evidence state.</h2>
            <p>
              QuietPilot keeps each readiness lane distinct so a signed proposal cannot hide an
              unresolved payment, staffing, inventory, or schedule dependency.
            </p>
            <div className={styles.doctrine}>
              Accepted ≠ paid · Paid ≠ staffed · Staffed ≠ stocked · Scheduled ≠ ready
            </div>
          </div>
        </SectionReveal>
        <SectionReveal delay={0.08} reducedMotion={reducedMotion}>
          <div className={styles.readinessBoard} role="group" aria-label="Sample readiness board">
            <div className={styles.boardHeader}>
              <div>
                <span className={styles.sampleChip}>Sample event</span>
                <strong>{livingEventIdentity.name}</strong>
              </div>
              <span className={styles.heldChip}>Held for review</span>
            </div>
            <div className={styles.readinessRows}>
              {livingEventReadinessLanes.map((lane) => (
                <div
                  key={lane.id}
                  className={styles.readinessRow}
                  data-resolved={lane.startsResolved}
                >
                  <span className={styles.readinessIcon}>
                    {lane.startsResolved ? (
                      <Check aria-hidden="true" size={14} />
                    ) : (
                      <span aria-hidden="true">!</span>
                    )}
                  </span>
                  <div>
                    <strong>{lane.label}</strong>
                    <small>{lane.openDetail}</small>
                  </div>
                  <span>{lane.openStatus}</span>
                </div>
              ))}
            </div>
            <div className={styles.boardFooter}>
              <span>Next safe action</span>
              <strong>Resolve the remaining evidence before marking the sample ready.</strong>
            </div>
          </div>
        </SectionReveal>
      </section>

      <section
        id="pricing"
        className={`${styles.section} ${styles.pricingSection}`}
        aria-labelledby="pricing-title"
      >
        <SectionReveal reducedMotion={reducedMotion}>
          <div className={styles.priceCard}>
            <div className={styles.priceCopy}>
              <p className={styles.eyebrow}>QuietPilot Core</p>
              <h2 id="pricing-title">Put the commercial spine behind your next event.</h2>
              <p>
                Built for one organization and its workspaces. Checkout creates a subscription handoff; activation
                waits for provider evidence.
              </p>
              <ul>
                <li>
                  <Check aria-hidden="true" size={16} /> Inquiry-to-readiness workflow
                </li>
                <li>
                  <Check aria-hidden="true" size={16} /> Quote, proposal, and customer-decision
                  continuity
                </li>
                <li>
                  <Check aria-hidden="true" size={16} /> Payment-evidence and readiness boundaries
                </li>
              </ul>
            </div>
            <div className={styles.priceAction}>
              <span>
                <strong>Core</strong>
              </span>
              <small>Review current pricing and workspace setup</small>
              <Link className={styles.primaryButton} href={quietPilotProduct.purchasePath}>
                Review QuietPilot Core <ArrowRight aria-hidden="true" size={18} />
              </Link>
              <Link href={demoShiftHref}>Walk the sample first</Link>
            </div>
          </div>
        </SectionReveal>
      </section>

      <section className={styles.finalCta} aria-labelledby="final-cta-title">
        <Sparkles aria-hidden="true" size={24} />
        <h2 id="final-cta-title">Stop rebuilding the event truth at every handoff.</h2>
        <p>Give sales, operations, and ownership one accountable path from inquiry to service.</p>
        <div className={styles.heroActions}>
          <Link className={styles.primaryButton} href="https://www.quietpilot.us/get-started">
            Request access <ArrowRight aria-hidden="true" size={18} />
          </Link>
          <Link className={styles.secondaryButton} href={demoShiftHref}>
            Explore the demo
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>QuietPilot · Catering revenue operations</span>
        <nav aria-label="Footer navigation">
          <Link href={quietPilotProduct.appUrl}>Log in</Link>
          <Link href="https://www.quietpilot.us/get-started">Get started</Link>
          <Link href={demoShiftHref}>Demo</Link>
        </nav>
      </footer>

    </div>
  );
}
