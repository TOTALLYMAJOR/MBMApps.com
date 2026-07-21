import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, ChevronRight, ShoppingBag } from 'lucide-react';
import { projectScreens } from '@/lib/projects';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Apps',
  description: 'Browse MBMApps software, see what is available now, and purchase or request access from one clear catalog.'
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
        <section className="storefront-hero relative overflow-hidden border-b border-white/10">
          <div className="ambient-grid pointer-events-none absolute inset-0 opacity-45" />
          <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16 pt-20 lg:px-8 lg:pb-20 lg:pt-24">
            <p className="storefront-index">App catalog / {projectScreens.length} products</p>
            <h1 className="mt-5 max-w-4xl font-display text-5xl font-light tracking-[-0.055em] text-white md:text-7xl">Find the right app. See the next step.</h1>
            <p className="text-mbm-muted mt-5 max-w-3xl text-lg leading-8">
              Buy available software directly, request access to private previews, or explore what MBMApps is building next.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/quietpilot/purchase"
                className="storefront-hero-button storefront-hero-button--primary"
              >
                Buy QuietPilot
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/#app-panel"
                className="storefront-hero-button"
              >
                Open product explorer
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-10 grid w-full max-w-6xl gap-5 px-6 md:grid-cols-2 lg:px-8">
          {projectScreens.map((project) => {
            const Icon = project.icon;

            return (
              <article key={project.slug} className="storefront-card group relative flex min-h-[31rem] flex-col overflow-hidden">
                <div className="storefront-card__glow" aria-hidden="true" />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="storefront-index">{project.shortName} / {project.category}</p>
                    <h2 className="mt-4 font-display text-4xl font-light tracking-[-0.045em] text-white">{project.name}</h2>
                  </div>
                  <span className="storefront-icon shrink-0">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>
                <p className="text-mbm-muted mt-4 text-sm leading-7">{project.summary}</p>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span className={`availability-mark ${project.commerce.availability === 'Available now' ? 'availability-mark--live' : ''}`}>
                    <span className="availability-mark__dot" aria-hidden="true" />
                    {project.commerce.availability}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[0.68rem] font-semibold text-white/45">{project.status}</span>
                </div>
                <div className="mt-auto grid gap-2 pt-7 sm:grid-cols-3">
                  {project.metrics.map((metric) => (
                    <div key={metric.label} className="rounded-lg border border-white/8 bg-black/20 p-3">
                      <p className="font-display text-xl font-semibold text-white">{metric.value}</p>
                      <p className="mt-1 text-xs text-white/48">{metric.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Link href={project.commerce.actionHref} className={`storefront-action ${project.commerce.availability === 'Available now' ? 'storefront-action--primary' : ''}`}>
                    {project.commerce.actionLabel}
                    {project.commerce.availability === 'Available now' ? <ShoppingBag className="h-4 w-4" aria-hidden="true" /> : <ArrowUpRight className="h-4 w-4" aria-hidden="true" />}
                  </Link>
                  <Link href={project.path} className="storefront-detail-link">
                    App details
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
    </>
  );
}
