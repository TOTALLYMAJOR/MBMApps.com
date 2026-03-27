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
    <div className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8">
      <p className="text-xs uppercase tracking-[0.22em] text-signal">Live Product Demo</p>
      <h1 className="mt-3 font-display text-5xl text-white">Revenue Intelligence Dashboard</h1>
      <p className="mt-4 max-w-3xl text-lg text-mist">
        This dashboard demonstrates our production patterns: typed API contracts, resilient fallback states, and role-aware access using Firebase authentication.
      </p>

      <div className="mt-10">
        <DashboardShell
          initialMetrics={metricsResult.data}
          initialPipeline={pipelineResult.data}
          usingFallbackData={metricsResult.fallback || pipelineResult.fallback}
        />
      </div>
    </div>
  );
}
