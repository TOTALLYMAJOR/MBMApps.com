'use client';

import { useMemo, useState } from 'react';
import type { DemoMetric, PipelineSnapshot } from '@mbm/contracts';
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

  const canViewDealDetails = role === 'demo' || role === 'admin';

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {initialMetrics.map((metric) => (
          <article key={metric.key} className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-soft">
            <p className="text-xs uppercase tracking-[0.2em] text-mist">{metric.label}</p>
            <p className="mt-3 font-display text-3xl font-semibold text-white">{metric.value}</p>
            <p className="mt-2 text-xs text-signal">{metric.trend}</p>
          </article>
        ))}

        <DemoAuthPanel onRoleChange={setRole} />
      </div>

      <section className="rounded-3xl border border-white/10 bg-slate-900/65 p-6 shadow-panel">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl text-white">Pipeline Overview</h2>
            <p className="text-sm text-mist">Updated {new Date(initialPipeline.generatedAt).toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-mist">Open Pipeline Value</p>
            <p className="font-display text-3xl text-white">{currency(totals.value, initialPipeline.currency)}</p>
            <p className="text-xs text-mist">{totals.deals} active opportunities</p>
          </div>
        </div>

        {usingFallbackData ? (
          <p className="mt-4 rounded-xl border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-xs text-amber-100">
            Live API unavailable. Showing resilient fallback dataset.
          </p>
        ) : null}

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {initialPipeline.stages.map((stage) => (
            <article key={stage.id} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">{stage.name}</h3>
                <span className="text-xs text-mist">{stage.count} deals</span>
              </div>
              <p className="mt-2 text-sm text-signal">{currency(stage.totalValue, initialPipeline.currency)}</p>

              {canViewDealDetails ? (
                <ul className="mt-4 space-y-2 text-xs text-white/80">
                  {stage.deals.map((deal) => (
                    <li key={deal.id} className="rounded-lg border border-white/10 bg-slate-900/60 p-2">
                      <p className="font-medium text-white">{deal.account}</p>
                      <p>{currency(deal.amount, initialPipeline.currency)} | {deal.probability}% probability</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-xs text-mist">
                  Sign in with a `demo` or `admin` claim to view account-level opportunity details.
                </p>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
