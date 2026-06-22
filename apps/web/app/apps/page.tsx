import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { projectScreens } from '@/lib/projects';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Explore MBMApps project subpages across QuietPilot, coaching, youth sports, studio work, and design canvases.'
};

export default function AppsPage() {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'MBMApps projects',
    itemListElement: projectScreens.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${siteConfig.url}${project.path}`,
      name: project.name,
      description: project.description
    }))
  };

  return (
    <>
      <div className="pb-20">
        <section className="hero-mesh relative overflow-hidden border-b border-white/10">
          <div className="ambient-grid pointer-events-none absolute inset-0 opacity-45" />
          <div className="mx-auto w-full max-w-6xl px-6 pb-14 pt-16 lg:px-8 lg:pt-20">
            <p className="kicker">Projects</p>
            <h1 className="mt-3 max-w-4xl font-display text-5xl text-white md:text-6xl">MBMApps app subpages, all in one place.</h1>
            <p className="text-mbm-muted mt-5 max-w-3xl text-lg leading-8">
              Each project gets a dedicated surface with its operating model, audience, current status, and source direction.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/#app-panel"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/14 bg-white px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-50"
              >
                Open app panel
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/16 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
              >
                Start a project
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-10 grid w-full max-w-6xl gap-5 px-6 md:grid-cols-2 lg:px-8">
          {projectScreens.map((project) => {
            const Icon = project.icon;

            return (
              <article key={project.slug} className="surface-panel p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="kicker">{project.category}</p>
                    <h2 className="mt-3 font-display text-3xl text-white">{project.name}</h2>
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-white/12 bg-white/[0.06] text-white/75">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>
                <p className="text-mbm-muted mt-4 text-sm leading-7">{project.summary}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="surface-card rounded-full px-3 py-1 text-xs font-semibold text-white/75">{project.status}</span>
                  <span className="surface-card rounded-full px-3 py-1 text-xs font-semibold text-white/75">{project.shortName}</span>
                </div>
                <div className="mt-5 grid gap-2 sm:grid-cols-3">
                  {project.metrics.map((metric) => (
                    <div key={metric.label} className="surface-card p-3">
                      <p className="font-display text-xl font-semibold text-white">{metric.value}</p>
                      <p className="mt-1 text-xs text-white/48">{metric.label}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href={project.path}
                  className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/14 bg-white/[0.05] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.09]"
                >
                  View subpage
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </section>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
    </>
  );
}
