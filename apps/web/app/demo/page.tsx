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
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="kicker">Live Product Demo</p>
              <h1 className="mt-3 max-w-4xl font-display text-5xl text-white md:text-6xl">Revenue Intelligence Dashboard</h1>
              <p className="text-mbm-muted mt-4 max-w-3xl text-lg leading-8">
                This environment demonstrates production patterns in action: typed API contracts, role-aware Firebase access, and resilient fallback behavior when upstream services degrade.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                {['Typed API Contracts', 'Realtime Auth Context', 'Graceful Fallback Mode', 'Telemetry Event Capture'].map((item) => (
                  <span key={item} className="surface-card px-3 py-1 text-xs uppercase tracking-[0.14em] text-white/85">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="surface-panel p-4 md:p-5">
              <p className="kicker text-white/70">QuietPilot Preview</p>
              <div className="mt-3 overflow-hidden rounded-xl border border-white/15 bg-black/45">
                <div className="aspect-video">
                  <video className="h-full w-full scale-[1.08] object-cover object-top" autoPlay loop muted playsInline preload="metadata">
                    <source src="/media/quiet-pilot.mp4" type="video/mp4" />
                    Your browser does not support the demo video.
                  </video>
                </div>
              </div>
              <p className="mt-3 text-xs text-white/60">Loads metadata first, then streams playback on demand to keep initial page rendering fast.</p>
            </div>
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
