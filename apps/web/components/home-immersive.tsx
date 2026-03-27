'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const AIDnaChipScene = dynamic(
  () => import('@/components/ai-dna-chip-scene').then((module) => module.AIDnaChipScene),
  {
    ssr: false,
    loading: () => (
      <div className="h-[360px] w-[320px] rounded-[28px] border border-white/15 bg-slate-950/35 shadow-panel" />
    )
  }
);

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
    label: 'Performance Baseline',
    value: 98,
    suffix: '/100',
    caption: 'Lighthouse budgets enforced in CI before release.'
  },
  {
    label: 'Release Lead Time',
    value: 4,
    suffix: ' days',
    caption: 'From scoped backlog to production deployment.'
  },
  {
    label: 'Failure Recovery',
    value: 99.95,
    suffix: '%',
    caption: 'Guardrails, observability, and rollback discipline.'
  }
];

const deliveryTracks: Record<TrackId, TrackBlueprint> = {
  platform: {
    label: 'Platform',
    title: 'Composable platform architecture with provider portability built in.',
    summary:
      'We design the core surface for scale first: typed contracts, container parity, environment segmentation, and deployment controls that keep release velocity high.',
    outcomes: [
      'Monorepo + shared contract modules to prevent frontend/backend drift',
      'Environment parity across local Docker, Vercel, and Railway',
      'Auditable CI gates with typed APIs and smoke verification'
    ],
    stack: ['Next.js App Router', 'TypeScript', 'Docker', 'GitHub Actions']
  },
  revenue: {
    label: 'Revenue',
    title: 'Lead and pipeline systems that convert technical quality into business growth.',
    summary:
      'Conversion moments are engineered, not guessed. We pair UX intent with telemetry and backend resilience so lead capture, quote workflows, and follow-up flows perform under load.',
    outcomes: [
      'Server-side validated contact + anti-spam handoff flow',
      'Tracked events for submission, engagement, and conversion moments',
      'Dashboard-ready data contracts for quote and funnel visibility'
    ],
    stack: ['Route Handlers', 'Event Telemetry', 'Schema Validation', 'Analytics Hooks']
  },
  reliability: {
    label: 'Reliability',
    title: 'Production confidence through observability, fault handling, and safe rollout practices.',
    summary:
      'We instrument the system so failures degrade gracefully and operators can act quickly. Reliability becomes a product feature users can feel.',
    outcomes: [
      'Request/error logging with actionable context for incident triage',
      'Fallback states that keep UX intact during downstream outages',
      'Core smoke checks for launch gates and post-deploy confidence'
    ],
    stack: ['Structured Logs', 'Health Endpoints', 'Web Vitals', 'Synthetic Smoke Tests']
  }
};

const executionRail = [
  '$ docker compose up --build',
  '$ npm run test && npm run build',
  '$ railway up --detach',
  '$ vercel deploy --prebuilt --prod'
];

const pipelinePulse = [
  { stage: 'Leads Captured', value: 128, tint: 'from-electric/70 to-electric/30' },
  { stage: 'Qualified', value: 74, tint: 'from-signal/70 to-signal/25' },
  { stage: 'Proposal Sent', value: 39, tint: 'from-cyan-300/70 to-cyan-400/20' },
  { stage: 'Won', value: 22, tint: 'from-emerald-300/70 to-emerald-500/25' }
];
const maxPipelineValue = pipelinePulse[0]?.value ?? 1;

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
      className="rounded-2xl border border-white/10 bg-slate-950/65 p-5 shadow-soft"
    >
      <p className="text-[0.66rem] uppercase tracking-[0.2em] text-mist">{label}</p>
      <p className="mt-3 font-display text-3xl font-semibold text-white">
        {rendered}
        <span className="ml-1 text-lg text-mist">{suffix}</span>
      </p>
      <p className="mt-3 text-sm leading-6 text-mist">{caption}</p>
    </motion.article>
  );
}

export function HomeImmersive() {
  const [track, setTrack] = useState<TrackId>('platform');
  const activeTrack = deliveryTracks[track];

  return (
    <>
      <section className="hero-mesh relative overflow-hidden border-b border-white/10">
        <div className="ambient-grid pointer-events-none absolute inset-0 opacity-50" />
        <div className="absolute right-6 top-20 z-[2] hidden lg:block 2xl:right-16">
          <AIDnaChipScene />
        </div>
        <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-10 px-6 pb-20 pt-16 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:pt-24">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-xs uppercase tracking-[0.24em] text-signal">Advanced Product Engineering Studio</p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl font-semibold leading-tight text-white md:text-6xl">
              Sophisticated web systems that convert quality engineering into measurable growth.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-mist">
              MBMApps builds high-performance digital platforms where design precision, resilient architecture, and delivery discipline work as one system.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/contact" className="rounded-full bg-electric px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500">
                Start a Discovery Call
              </Link>
              <Link href="/demo" className="rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:border-signal/70">
                Open Live Demo
              </Link>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, scale: 0.98, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.15 }}
            className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-950/70 p-6 shadow-panel"
          >
            <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-electric/20 blur-3xl" />
            <div className="absolute -bottom-16 -left-12 h-44 w-44 rounded-full bg-signal/20 blur-3xl" />
            <p className="text-[0.65rem] uppercase tracking-[0.22em] text-mist">Delivery Pulse</p>
            <div className="mt-5 space-y-4">
              {pipelinePulse.map((row, index) => (
                <div key={row.stage}>
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-white/90">{row.stage}</span>
                    <span className="font-mono text-mist">{row.value}</span>
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
            <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-mist">Now Shipping</p>
              <p className="mt-2 text-sm text-white">Cross-cloud deployment choreography with provider-safe runtime contracts.</p>
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
        <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.24em] text-signal">Capability Matrix</p>
          <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">Choose the track, inspect the operating model.</h2>

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
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? 'border border-electric/70 bg-electric/20 text-white'
                      : 'border border-white/20 bg-white/5 text-mist hover:border-white/40 hover:text-white'
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
            className="mt-7 grid gap-6 rounded-2xl border border-white/10 bg-slate-950/70 p-6 md:grid-cols-[1.2fr_0.8fr]"
          >
            <div>
              <h3 className="font-display text-2xl text-white">{activeTrack.title}</h3>
              <p className="mt-3 text-sm leading-7 text-mist">{activeTrack.summary}</p>
              <div className="mt-5 space-y-3">
                {activeTrack.outcomes.map((item) => (
                  <p key={item} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/90">
                    {item}
                  </p>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-mist">Technology Fit</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {activeTrack.stack.map((item) => (
                  <span key={item} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.14em] text-white/85">
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-6 rounded-xl border border-signal/30 bg-signal/10 p-4">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-signal">Implementation Note</p>
                <p className="mt-2 text-sm leading-6 text-white/90">
                  Delivery is engineered around typed boundaries and measurable thresholds, so scaling does not degrade quality.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-20 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-black/25 p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.24em] text-signal">Command Rail</p>
          <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">The build and deploy choreography is intentional, testable, and repeatable.</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-white/10 bg-slate-950/75 p-5">
              {executionRail.map((line, index) => (
                <motion.p
                  key={line}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 0.45, delay: 0.08 * index }}
                  className="font-mono text-sm leading-8 text-white/90"
                >
                  <span className="text-signal">$</span> {line.replace('$ ', '')}
                </motion.p>
              ))}
            </div>
            <div className="rounded-2xl border border-electric/25 bg-electric/10 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-electric">Execution Outcome</p>
              <p className="mt-3 text-sm leading-7 text-white/90">
                Shipping quality is not luck. It is the result of a rigorous system where design, engineering, infrastructure, and observability operate as a single production pipeline.
              </p>
              <Link href="/services" className="mt-5 inline-flex rounded-full border border-electric/60 px-4 py-2 text-sm font-semibold text-white transition hover:bg-electric/20">
                See Service Blueprint
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
