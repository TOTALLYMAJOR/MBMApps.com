'use client';

import { useMemo, useState } from 'react';
import type { DemoMetric, PipelineSnapshot } from '@mbm/contracts';
import { motion } from 'framer-motion';
import { DemoAuthPanel } from '@/components/demo-auth-panel';
import { currency } from '@/lib/utils';

type DashboardShellProps = {
  initialMetrics: DemoMetric[];
  initialPipeline: PipelineSnapshot;
  usingFallbackData: boolean;
};

type DemoRole = 'guest' | 'viewer' | 'demo' | 'admin';

export function DashboardShell({ initialMetrics, initialPipeline, usingFallbackData }: DashboardShellProps) {
  const [role, setRole] = useState<DemoRole>('guest');
  const [activeStageId, setActiveStageId] = useState(initialPipeline.stages[0]?.id ?? '');

  const totals = useMemo(() => {
    return initialPipeline.stages.reduce(
      (acc, stage) => {
        acc.deals += stage.count;
        acc.value += stage.totalValue;
        return acc;
      },
      { deals: 0, value: 0 }
    );
  }, [initialPipeline]);

  const maxStageValue = useMemo(
    () => initialPipeline.stages.reduce((max, stage) => Math.max(max, stage.totalValue), 1),
    [initialPipeline]
  );
  const activeStage = useMemo(
    () => initialPipeline.stages.find((stage) => stage.id === activeStageId) ?? initialPipeline.stages[0],
    [activeStageId, initialPipeline]
  );
  const canViewDealDetails = role === 'demo' || role === 'admin';

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {initialMetrics.map((metric, index) => (
          <motion.article
            key={metric.key}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
            className="surface-panel p-5 shadow-soft"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">{metric.label}</p>
            <p className="mt-3 font-display text-3xl font-semibold text-white">{metric.value}</p>
            <p className="mt-2 text-xs text-signal/90">{metric.trend}</p>
          </motion.article>
        ))}

        <DemoAuthPanel onRoleChange={setRole} />
      </div>

      <section className="surface-panel p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl text-white">Pipeline Overview</h2>
            <p className="text-sm text-white/65">Updated {new Date(initialPipeline.generatedAt).toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">Open Pipeline Value</p>
            <p className="font-display text-3xl text-white">{currency(totals.value, initialPipeline.currency)}</p>
            <p className="text-xs text-white/60">{totals.deals} active opportunities</p>
          </div>
        </div>

        {usingFallbackData ? (
          <p className="mt-4 rounded-xl border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-xs text-amber-100">
            Live API unavailable. Showing resilient fallback dataset.
          </p>
        ) : null}

        <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-3">
            {initialPipeline.stages.map((stage, index) => {
              const isActive = stage.id === activeStage?.id;

              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setActiveStageId(stage.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    isActive ? 'border-electric/60 bg-electric/10' : 'border-white/10 bg-black/45 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">{stage.name}</h3>
                    <span className="text-xs text-white/60">{stage.count} deals</span>
                  </div>
                  <p className="mt-2 text-sm text-signal/95">{currency(stage.totalValue, initialPipeline.currency)}</p>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(stage.totalValue / maxStageValue) * 100}%` }}
                    viewport={{ once: true, amount: 0.9 }}
                    transition={{ duration: 0.6, delay: index * 0.08 }}
                    className="mt-3 h-2 rounded-full bg-gradient-to-r from-electric via-signal to-warning"
                  />
                </button>
              );
            })}
          </div>

          <article className="surface-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">Stage Drilldown</p>
                <h3 className="mt-2 font-display text-2xl text-white">{activeStage?.name ?? 'Pipeline'}</h3>
              </div>
              <span className="rounded-full border border-white/20 px-2 py-1 text-xs text-white/80">
                {activeStage?.count ?? 0} deals
              </span>
            </div>

            <p className="mt-3 text-sm text-signal">
              {currency(activeStage?.totalValue ?? 0, initialPipeline.currency)}
            </p>

            {canViewDealDetails ? (
              <ul className="mt-4 space-y-2 text-xs text-white/80">
                {(activeStage?.deals ?? []).map((deal) => (
                  <li key={deal.id} className="surface-card p-3">
                    <p className="font-medium text-white">{deal.account}</p>
                    <p className="mt-1">
                      {currency(deal.amount, initialPipeline.currency)} | {deal.probability}% probability
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="surface-card mt-4 p-3 text-xs text-white/65">
                Sign in with a `demo` or `admin` claim to view account-level opportunity details.
              </p>
            )}

            <div className="surface-card mt-4 p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Access Scope</p>
              <p className="mt-2 text-sm text-white/85">
                Current role: <span className="font-mono text-signal">{role}</span>
              </p>
              <p className="mt-1 text-xs text-white/65">
                Viewer mode exposes aggregate totals only, while elevated roles unlock opportunity-level detail.
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
