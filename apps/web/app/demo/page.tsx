import type { Metadata } from 'next';
import Image from 'next/image';
import { DashboardShell } from '@/components/dashboard-shell';
import { TrackedLink } from '@/components/tracked-link';
import { getDemoMetrics, getDemoPipeline, getOperationalOutcomes } from '@/lib/backend-client';
import { quietPilotProduct } from '@/lib/site';

export const metadata: Metadata = {
  title: 'QuietPilot Demo Dashboard',
  description: 'QuietPilot dashboard demonstration backed by typed APIs and resilient fallback behavior.'
};

export default async function DemoPage() {
  const [metricsResult, pipelineResult, outcomesResult] = await Promise.all([getDemoMetrics(), getDemoPipeline(), getOperationalOutcomes()]);
  return (
    <div className="pb-20">
      <section className="hero-mesh relative overflow-hidden border-b border-white/10">
        <div className="ambient-grid pointer-events-none absolute inset-0 opacity-50" />
        <div className="mx-auto w-full max-w-6xl px-6 pb-14 pt-16 lg:px-8 lg:pt-20">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="kicker">Read-only product demo</p>
              <h1 className="mt-3 max-w-4xl font-display text-5xl text-white md:text-6xl">See an event move from accepted to ready.</h1>
              <p className="text-mbm-muted mt-4 max-w-3xl text-lg leading-8">
                Inspect sample leads, proposals, payment risk, staffing gaps, inventory blockers, and job readiness. Nothing here creates a customer record or claims a live event is operationally clear.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <TrackedLink
                  href={quietPilotProduct.path}
                  className="btn-theme"
                  trackingEvent="cta_clicked"
                  trackingMetadata={{ surface: 'demo-hero', target: 'quietpilot-page' }}
                >
                  How QuietPilot works
                </TrackedLink>
                <TrackedLink
                  href={quietPilotProduct.appUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-theme-ghost"
                  trackingEvent="quietpilot_opened"
                  trackingMetadata={{ surface: 'demo-hero', target: 'quietpilot-app' }}
                >
                  Open the product site
                </TrackedLink>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                {['Sample data', 'Read-only states', 'No customer records', 'Operator decisions stay human'].map((item) => (
                  <span key={item} className="surface-card px-3 py-1 text-xs uppercase tracking-[0.14em] text-white/85">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="surface-panel p-4 md:p-5">
              <p className="kicker text-white/70">Operator view / sample state</p>
              <div className="mt-3 overflow-hidden rounded-xl border border-white/15 bg-black/45">
                <div className="relative aspect-[16/10] overflow-hidden border-b border-white/10">
                  <Image
                    src="/product-screens/quietpilot.png"
                    alt="QuietPilot read-only catering operations demo showing commercial and readiness states"
                    fill
                    sizes="(min-width: 1024px) 36vw, 100vw"
                    className="object-cover object-top"
                    quality={90}
                    priority
                  />
                </div>
                <div className="border-b border-white/10 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-white/70">What to inspect</p>
                  <p className="mt-2 text-xs leading-6 text-white/75">
                    Follow the evidence from accepted work to payment, staffing, inventory, production, and readiness review.
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs text-white/60">Sample states explain the workflow. They do not prove payment settlement, staffing clearance, or a live customer outcome.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto mt-10 w-full max-w-6xl px-6 lg:px-8">
        <DashboardShell
          initialMetrics={metricsResult.data}
          initialPipeline={pipelineResult.data}
          initialOutcomes={outcomesResult.data}
          usingFallbackData={metricsResult.fallback || pipelineResult.fallback || outcomesResult.fallback}
        />
      </div>
    </div>
  );
}
