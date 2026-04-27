import { existsSync } from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { DashboardShell } from '@/components/dashboard-shell';
import { getDemoMetrics, getDemoPipeline } from '@/lib/backend-client';
import { quietPilotProduct } from '@/lib/site';

const QUIET_PILOT_ARTWORK_URL = '/media/quiet-pilot-flagship.png';
const QUIET_PILOT_ARTWORK_CANDIDATES = [
  path.join(process.cwd(), 'public/media/quiet-pilot-flagship.png'),
  path.join(process.cwd(), 'apps/web/public/media/quiet-pilot-flagship.png')
];

export const metadata: Metadata = {
  title: 'QuietPilot Demo Dashboard',
  description: 'QuietPilot dashboard demonstration backed by typed APIs and resilient fallback behavior.'
};

export default async function DemoPage() {
  const [metricsResult, pipelineResult] = await Promise.all([getDemoMetrics(), getDemoPipeline()]);
  const hasQuietPilotArtwork = QUIET_PILOT_ARTWORK_CANDIDATES.some((filePath) => existsSync(filePath));

  return (
    <div className="pb-20">
      <section className="hero-mesh relative overflow-hidden border-b border-white/10">
        <div className="ambient-grid pointer-events-none absolute inset-0 opacity-50" />
        <div className="mx-auto w-full max-w-6xl px-6 pb-14 pt-16 lg:px-8 lg:pt-20">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="kicker">Live Product Demo</p>
              <h1 className="mt-3 max-w-4xl font-display text-5xl text-white md:text-6xl">QuietPilot Revenue Command Center</h1>
              <p className="text-mbm-muted mt-4 max-w-3xl text-lg leading-8">
                This environment demonstrates QuietPilot production patterns in action: typed API contracts, role-aware Firebase access, and resilient fallback behavior when upstream services degrade.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={quietPilotProduct.path} className="btn-theme">
                  View QuietPilot
                </Link>
                <Link href={quietPilotProduct.appUrl} target="_blank" rel="noreferrer" className="btn-theme-ghost">
                  Open QuietPilot App
                </Link>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                {['Typed API Contracts', 'Realtime Auth Context', 'Graceful Fallback Mode', 'Telemetry Event Capture'].map((item) => (
                  <span key={item} className="surface-card px-3 py-1 text-xs uppercase tracking-[0.14em] text-white/85">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="surface-panel p-4 md:p-5">
              <p className="kicker text-white/70">QuietPilot Flagship</p>
              <div className="mt-3 overflow-hidden rounded-xl border border-white/15 bg-black/45">
                <div className="relative aspect-square overflow-hidden border-b border-white/10">
                  {hasQuietPilotArtwork ? (
                    <Image
                      src={QUIET_PILOT_ARTWORK_URL}
                      alt="QuietPilot flagship product artwork"
                      fill
                      sizes="(min-width: 1024px) 36vw, 100vw"
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="relative flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_0%,rgba(104,195,255,0.28),transparent_52%),linear-gradient(160deg,#050b17_0%,#09172d_48%,#0b1e34_100%)]">
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_52%_48%,rgba(190,230,255,0.24),transparent_44%)]" />
                      <span className="relative font-display text-7xl text-white/92 md:text-8xl">QP</span>
                    </div>
                  )}
                </div>
                <div className="border-b border-white/10 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-white/70">Flagship Identity Layer</p>
                  <p className="mt-2 text-xs leading-6 text-white/75">
                    Core brand visual for QuietPilot, positioned as the anchor asset for product recognition.
                  </p>
                </div>
                <div className="aspect-video">
                  <video className="h-full w-full scale-[1.08] object-cover object-top" autoPlay loop muted playsInline preload="metadata">
                    <source src="/media/quiet-pilot.mp4" type="video/mp4" />
                    Your browser does not support the demo video.
                  </video>
                </div>
              </div>
              <p className="mt-3 text-xs text-white/60">Artwork leads the story, while the live product motion remains below for credibility and technical proof.</p>
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
