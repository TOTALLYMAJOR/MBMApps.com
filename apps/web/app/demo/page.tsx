import type { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard-shell';
import { getDemoMetrics, getDemoPipeline } from '@/lib/backend-client';

export const metadata: Metadata = {
  title: 'Live Demo Dashboard',
  description: 'Authenticated dashboard demonstration backed by typed APIs and resilient fallback behavior.'
};

export default async function DemoPage() {
  const [metricsResult, pipelineResult] = await Promise.all([getDemoMetrics(), getDemoPipeline()]);

  return (
    <div className="pb-20">
      <section className="hero-mesh relative overflow-hidden border-b border-white/10">
        <div className="ambient-grid pointer-events-none absolute inset-0 opacity-50" />
        <div className="mx-auto w-full max-w-6xl px-6 pb-14 pt-16 lg:px-8 lg:pt-20">
          <p className="text-xs uppercase tracking-[0.22em] text-signal">Live Product Demo</p>
          <h1 className="mt-3 max-w-4xl font-display text-5xl text-white md:text-6xl">Revenue Intelligence Dashboard</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-mist">
            This environment demonstrates production patterns in action: typed API contracts, role-aware Firebase access, and resilient fallback behavior when upstream services degrade.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {['Typed API Contracts', 'Realtime Auth Context', 'Graceful Fallback Mode', 'Telemetry Event Capture'].map((item) => (
              <span key={item} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.14em] text-white/85">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto mt-10 w-full max-w-6xl px-6 lg:px-8">
        <DashboardShell
          initialMetrics={metricsResult.data}
          initialPipeline={pipelineResult.data}
          usingFallbackData={metricsResult.fallback || pipelineResult.fallback}
        />
      </div>
    </div>
  );
}
