'use client';

import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';

type ServiceTrackId = 'platform' | 'automation' | 'cloud';

type ServiceTrack = {
  id: ServiceTrackId;
  label: string;
  title: string;
  summary: string;
  deliverables: string[];
  kpis: Array<{ label: string; value: number }>;
  stack: string[];
};

const serviceTracks: ServiceTrack[] = [
  {
    id: 'platform',
    label: 'Platform Build',
    title: 'Scalable product surfaces designed for growth and maintainability.',
    summary:
      'We architect and ship product foundations with typed boundaries, reusable domain modules, and release controls that stay reliable as usage scales.',
    deliverables: [
      'App Router structure with route-level rendering strategy',
      'Shared contract package to keep API + UI in lockstep',
      'Quality gates for lint/type/test/build before release'
    ],
    kpis: [
      { label: 'Dev Throughput', value: 82 },
      { label: 'Regression Risk', value: 18 },
      { label: 'Performance Budget', value: 91 }
    ],
    stack: ['Next.js', 'TypeScript', 'Contract Modules', 'Automated QA']
  },
  {
    id: 'automation',
    label: 'Revenue Automation',
    title: 'Quote-to-close workflows that turn operations into leverage.',
    summary:
      'We transform fragile manual handoffs into measured systems so pipeline movement, conversion velocity, and forecast clarity improve predictably.',
    deliverables: [
      'Contact + intake flows with anti-spam and safe fallbacks',
      'Pipeline telemetry events tied to product interactions',
      'Operational dashboards for quote, conversion, and velocity views'
    ],
    kpis: [
      { label: 'Lead Response Speed', value: 88 },
      { label: 'Pipeline Visibility', value: 93 },
      { label: 'Workflow Latency', value: 22 }
    ],
    stack: ['Route Handlers', 'Telemetry Events', 'Dashboards', 'Schema Validation']
  },
  {
    id: 'cloud',
    label: 'Cloud Reliability',
    title: 'Portable cloud topology with production-grade confidence.',
    summary:
      'We deploy with environment discipline and observability-first operations so your team can ship quickly without losing incident control.',
    deliverables: [
      'Container parity from local Docker to hosted runtime',
      'Provider-aware deployment paths across Vercel and Railway',
      'Operational readiness checks for launch and rollback scenarios'
    ],
    kpis: [
      { label: 'Deploy Confidence', value: 96 },
      { label: 'Uptime Discipline', value: 94 },
      { label: 'Recovery Window', value: 14 }
    ],
    stack: ['Vercel', 'Railway', 'Firebase', 'Docker + CI/CD']
  }
];

export function ServicesSwitchboard() {
  const [activeId, setActiveId] = useState<ServiceTrackId>('platform');
  const active = useMemo(() => {
    const defaultTrack = serviceTracks[0];
    if (defaultTrack === undefined) {
      return undefined;
    }
    return serviceTracks.find((track) => track.id === activeId) ?? defaultTrack;
  }, [activeId]);

  if (active === undefined) {
    return null;
  }

  return (
    <section className="mt-12 rounded-3xl border border-white/10 bg-slate-950/55 p-8 md:p-10">
      <p className="text-xs uppercase tracking-[0.24em] text-signal">Service Switchboard</p>
      <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">Select a track and inspect the delivery model.</h2>

      <div className="mt-7 flex flex-wrap gap-3">
        {serviceTracks.map((track) => {
          const activeTrack = track.id === activeId;
          return (
            <button
              key={track.id}
              type="button"
              onClick={() => setActiveId(track.id)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                activeTrack
                  ? 'border-electric/70 bg-electric/20 text-white'
                  : 'border-white/20 bg-white/5 text-mist hover:border-white/40 hover:text-white'
              }`}
              aria-pressed={activeTrack}
            >
              {track.label}
            </button>
          );
        })}
      </div>

      <motion.div
        key={active.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mt-7 grid gap-6 rounded-2xl border border-white/10 bg-slate-950/75 p-6 md:grid-cols-[1.1fr_0.9fr]"
      >
        <div>
          <h3 className="font-display text-2xl text-white">{active.title}</h3>
          <p className="mt-3 text-sm leading-7 text-mist">{active.summary}</p>

          <div className="mt-5 space-y-3">
            {active.deliverables.map((item) => (
              <p key={item} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/90">
                {item}
              </p>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-mist">Execution Signals</p>
            <div className="mt-3 space-y-3">
              {active.kpis.map((kpi, index) => (
                <div key={kpi.label}>
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-white/90">{kpi.label}</span>
                    <span className="font-mono text-mist">{kpi.value}</span>
                  </div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${kpi.value}%` }}
                    transition={{ duration: 0.55, delay: index * 0.08 }}
                    className="h-2 rounded-full bg-gradient-to-r from-electric to-signal"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-signal/30 bg-signal/10 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-signal">Technology Fit</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {active.stack.map((item) => (
                <span key={item} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.14em] text-white/90">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
