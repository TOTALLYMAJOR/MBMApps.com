import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'MBMApps helps teams launch high-quality web platforms with confidence and speed.'
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16 lg:px-8">
      <p className="text-xs uppercase tracking-[0.22em] text-signal">About MBMApps</p>
      <h1 className="mt-3 font-display text-5xl text-white">A quality-first engineering partner for ambitious teams.</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-mist">
        MBMApps was built to help growing companies turn technical ambition into reliable, measurable outcomes. We combine product thinking,
        modern cloud architecture, and disciplined delivery practices to ship software that scales both traffic and business operations.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {[
          ['Reliability', 'Production readiness through typed contracts, observability, and robust release workflows.'],
          ['Velocity', 'Focused delivery cycles with predictable milestones and transparent technical decision-making.'],
          ['Partnership', 'Hands-on collaboration with your team to build capability, not dependency.']
        ].map(([title, detail]) => (
          <article key={title} className="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
            <h2 className="font-display text-2xl text-white">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-mist">{detail}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
