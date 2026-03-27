'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type TrackId = 'platform' | 'revenue' | 'reliability';

type TrackBlueprint = {
  label: string;
  title: string;
  summary: string;
  outcomes: string[];
  stack: string[];
};

const metrics = [
  {
    label: 'Qualified Pipeline',
    value: 128,
    suffix: ' accounts',
    caption: 'Live leads with scoring + backend validation in production.'
  },
  {
    label: 'Median Launch Cycle',
    value: 4,
    suffix: ' days',
    caption: 'From scoped objective to tested release candidate.'
  },
  {
    label: 'Incident Recovery',
    value: 99.95,
    suffix: '%',
    caption: 'Measured by automated health checks and rollback policy.'
  }
];

const deliveryTracks: Record<TrackId, TrackBlueprint> = {
  platform: {
    label: 'Platform',
    title: 'A composable platform that survives scale, team growth, and provider shifts.',
    summary:
      'We design for operational durability first: typed contracts, environment symmetry, release controls, and guardrails that keep velocity high without sacrificing quality.',
    outcomes: [
      'Shared contract packages that eliminate frontend/backend schema drift',
      'Containerized parity across local, preview, and production environments',
      'Release gating with typed checks and smoke test orchestration'
    ],
    stack: ['Next.js App Router', 'TypeScript', 'Docker', 'GitHub Actions']
  },
  revenue: {
    label: 'Revenue',
    title: 'A conversion system engineered like product infrastructure, not marketing copy.',
    summary:
      'Every growth moment is treated as a technical surface. We pair UX pathways with telemetry and reliability so contact capture, qualification, and follow-up flows compound.',
    outcomes: [
      'Server-validated intake with resilient anti-spam controls',
      'Actionable event taxonomy from click to qualified conversion',
      'Dashboard-ready data contracts for funnel and quote operations'
    ],
    stack: ['Route Handlers', 'Event Telemetry', 'Schema Validation', 'Analytics Hooks']
  },
  reliability: {
    label: 'Reliability',
    title: 'Production behavior designed for graceful degradation and rapid operator action.',
    summary:
      'Reliability is a design principle, not a patch. We instrument the stack so failure states are observable, recoverable, and controlled under real traffic.',
    outcomes: [
      'Structured request/error logging with meaningful triage context',
      'Fallback UX states that hold quality under partial outages',
      'Repeatable smoke gates for pre-launch and post-deploy verification'
    ],
    stack: ['Structured Logs', 'Health Endpoints', 'Web Vitals', 'Synthetic Smoke Tests']
  }
};

const executionRail = [
  'git pull --rebase origin main',
  'npm run test && npm run build',
  'railway up --detach',
  'vercel deploy --prebuilt --prod'
];

const signalTape = [
  { stage: 'Leads Captured', value: 128, tint: 'from-[#6f94ff]/85 to-[#3f5db9]/40' },
  { stage: 'Qualified', value: 74, tint: 'from-[#8eadff]/80 to-[#5f7fd8]/35' },
  { stage: 'Proposal', value: 39, tint: 'from-[#b5c9ff]/75 to-[#6f92eb]/35' },
  { stage: 'Won', value: 22, tint: 'from-[#d4e2ff]/70 to-[#84a1f0]/30' }
];

const maxPipelineValue = signalTape[0]?.value ?? 1;

function AnimatedMetric({ value, suffix, label, caption }: (typeof metrics)[number]) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 900;

    const update = (timestamp: number) => {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const next = value * (1 - Math.pow(1 - progress, 3));
      setDisplay(next);

      if (progress < 1) {
        window.requestAnimationFrame(update);
      }
    };

    const frame = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(frame);
  }, [value]);

  const rendered = Number.isInteger(value) ? Math.round(display).toString() : display.toFixed(2);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.55 }}
      className="rounded-2xl border border-white/15 bg-black/35 p-5 shadow-soft backdrop-blur-sm"
    >
      <p className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-white/55">{label}</p>
      <p className="mt-3 font-display text-3xl font-semibold text-white">
        {rendered}
        <span className="ml-1 text-lg text-white/55">{suffix}</span>
      </p>
      <p className="mt-3 text-sm leading-6 text-white/70">{caption}</p>
    </motion.article>
  );
}

export function HomeImmersive() {
  const [track, setTrack] = useState<TrackId>('platform');
  const activeTrack = deliveryTracks[track];

  return (
    <>
      <section className="hero-mesh film-grain relative overflow-hidden border-b border-white/10">
        <div className="ambient-grid pointer-events-none absolute inset-0 opacity-35" />

        <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-12 px-6 pb-20 pt-16 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:pt-24">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="kicker">{'// MBMApps Operating Thesis'}</p>
            <h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[1.05] text-white md:text-6xl lg:text-7xl">
              ENGINEERING DISCIPLINE THAT TURNS DIGITAL PRODUCTS INTO MARKET ADVANTAGE.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 md:text-lg">
              We build high-performance web systems with the same mindset used in elite investment operations: signal over noise, repeatable execution, and asymmetric upside.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/contact" className="btn-theme">
                Start a Discovery Call
              </Link>
              <Link href="/demo" className="btn-theme-ghost">
                Open Live Demo
              </Link>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, scale: 0.98, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.15 }}
            className="surface-panel relative overflow-hidden p-6 backdrop-blur"
          >
            <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-electric/25 blur-3xl" />
            <div className="absolute -bottom-16 -left-12 h-44 w-44 rounded-full bg-signal/20 blur-3xl" />
            <p className="kicker text-white/65">Signal Feed</p>
            <div className="mt-5 space-y-4">
              {signalTape.map((row, index) => (
                <div key={row.stage}>
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-white/90">{row.stage}</span>
                    <span className="font-mono text-white/65">{row.value}</span>
                  </div>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(row.value / maxPipelineValue) * 100}%` }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ delay: 0.2 + index * 0.12, duration: 0.75 }}
                    className={`h-2 rounded-full bg-gradient-to-r ${row.tint}`}
                  />
                </div>
              ))}
            </div>
            <div className="surface-card mt-6 p-4">
              <p className="kicker text-white/80">Now Shipping</p>
              <p className="mt-2 text-sm text-white/85">Cross-cloud deployment choreography with typed runtime boundaries.</p>
            </div>
          </motion.aside>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-5 px-6 py-14 md:grid-cols-3 lg:px-8">
        {metrics.map((item) => (
          <AnimatedMetric key={item.label} {...item} />
        ))}
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-14 lg:px-8">
        <div className="section-shell p-8 md:p-10">
          <p className="kicker">Operating Tracks</p>
          <h2 className="mt-4 font-display text-3xl text-white md:text-4xl">Pick the track and inspect the execution model.</h2>

          <div className="mt-7 flex flex-wrap gap-3">
            {(Object.keys(deliveryTracks) as TrackId[]).map((id) => {
              const item = deliveryTracks[id];
              const isActive = id === track;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTrack(id)}
                  aria-pressed={isActive}
                  className={`rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.08em] transition ${
                    isActive ? 'border border-electric/70 bg-electric/15 text-white' : 'border border-white/25 bg-white/5 text-white/70 hover:border-white/40 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <motion.div
            key={track}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="surface-card mt-7 grid gap-6 p-6 md:grid-cols-[1.2fr_0.8fr]"
          >
            <div>
              <h3 className="font-display text-2xl text-white">{activeTrack.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/70">{activeTrack.summary}</p>
              <div className="mt-5 space-y-3">
                {activeTrack.outcomes.map((item) => (
                  <p key={item} className="rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white/85">
                    {item}
                  </p>
                ))}
              </div>
            </div>
            <div className="surface-card p-5">
              <p className="kicker text-white/65">Tech Fit</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {activeTrack.stack.map((item) => (
                  <span key={item} className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.12em] text-white/80">
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-6 rounded-xl border border-electric/35 bg-electric/10 p-4">
                <p className="kicker text-white/80">Implementation Note</p>
                <p className="mt-2 text-sm leading-6 text-white/90">
                  Delivery is orchestrated around typed boundaries and measurable thresholds, so scaling does not erode quality.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-20 lg:px-8">
        <div className="section-shell p-8 md:p-10">
          <p className="kicker">Execution Rail</p>
          <h2 className="mt-4 font-display text-3xl text-white md:text-4xl">The delivery cadence is explicit, testable, and repeatable.</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-white/15 bg-black/55 p-5">
              {executionRail.map((line, index) => (
                <motion.p
                  key={line}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 0.45, delay: 0.08 * index }}
                  className="font-mono text-sm leading-8 text-white/90"
                >
                  <span className="text-signal">$</span> {line}
                </motion.p>
              ))}
            </div>
            <div className="rounded-2xl border border-electric/35 bg-electric/10 p-5">
              <p className="kicker text-white/80">Outcome</p>
              <p className="mt-3 text-sm leading-7 text-white/90">
                Shipping quality is designed into the system: product experience, engineering, infrastructure, and observability operate as a single production instrument.
              </p>
              <Link
                href="/services"
                className="btn-theme-ghost mt-5"
              >
                See Service Blueprint
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
