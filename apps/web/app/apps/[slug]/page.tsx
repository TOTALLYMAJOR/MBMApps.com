import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, CheckCircle2, ChevronRight, FolderGit2 } from 'lucide-react';
import { getProjectBySlug, projectScreens } from '@/lib/projects';
import { siteConfig } from '@/lib/site';

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return projectScreens.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project'
    };
  }

  return {
    title: project.name,
    description: project.description,
    alternates: {
      canonical: project.path
    },
    openGraph: {
      title: `${project.name} | MBMApps`,
      description: project.description,
      url: `${siteConfig.url}${project.path}`,
      type: 'website'
    }
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const Icon = project.icon;
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.name,
    applicationCategory: project.category,
    operatingSystem: 'Web',
    description: project.description,
    url: `${siteConfig.url}${project.path}`,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.legalName,
      url: siteConfig.url
    }
  };

  return (
    <>
      <div className="pb-20">
        <section className="hero-mesh relative overflow-hidden border-b border-white/10">
          <div className="ambient-grid pointer-events-none absolute inset-0 opacity-45" />
          <div className="mx-auto w-full max-w-6xl px-6 pb-14 pt-16 lg:px-8 lg:pt-20">
            <Link href="/apps" className="inline-flex items-center gap-2 text-sm font-semibold text-white/64 transition hover:text-white">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Projects
            </Link>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-end">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="surface-card rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
                    {project.category}
                  </span>
                  <span className="surface-card rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
                    {project.status}
                  </span>
                </div>
                <h1 className="mt-4 max-w-4xl font-display text-5xl text-white md:text-6xl">{project.name}</h1>
                <p className="text-mbm-muted mt-5 max-w-3xl text-lg leading-8">{project.description}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href={project.primary.href}
                    target={project.primary.external ? '_blank' : undefined}
                    rel={project.primary.external ? 'noreferrer' : undefined}
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-white/14 bg-white px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-50"
                  >
                    {project.primary.label}
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link
                    href={project.secondary.href}
                    target={project.secondary.external ? '_blank' : undefined}
                    rel={project.secondary.external ? 'noreferrer' : undefined}
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-white/16 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                  >
                    {project.secondary.label}
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              <aside className="surface-panel p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-md border border-white/12 bg-white/[0.06] text-white/75">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="kicker">Audience</p>
                    <p className="mt-1 text-sm leading-6 text-white/72">{project.audience}</p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-10 grid w-full max-w-6xl gap-5 px-6 lg:grid-cols-3 lg:px-8">
          {project.metrics.map((metric) => {
            const MetricIcon = metric.icon;

            return (
              <article key={metric.label} className="surface-card p-5">
                <MetricIcon className="h-5 w-5 text-white/58" aria-hidden="true" />
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/42">{metric.label}</p>
                <p className="mt-2 font-display text-3xl font-semibold text-white">{metric.value}</p>
                <p className="text-mbm-muted mt-1 text-sm">{metric.detail}</p>
              </article>
            );
          })}
        </section>

        <section className="mx-auto mt-6 grid w-full max-w-6xl gap-6 px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
          <article className="surface-panel p-6">
            <p className="kicker">Operating stages</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {project.stages.map((stage, index) => (
                <div key={stage} className="surface-card p-4">
                  <p className="font-mono text-xs text-white/40">0{index + 1}</p>
                  <p className="mt-2 font-semibold text-white">{stage}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="surface-panel p-6">
            <p className="kicker">Capabilities</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {project.capabilities.map((capability) => (
                <div key={capability} className="surface-card flex items-center gap-3 p-4">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-200" aria-hidden="true" />
                  <p className="text-sm font-semibold text-white/82">{capability}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="section-shell mx-auto mt-6 w-full max-w-6xl p-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="kicker">Source repository</p>
              <div className="surface-card mt-4 flex items-start gap-3 p-4">
                <FolderGit2 className="mt-0.5 h-5 w-5 shrink-0 text-white/58" aria-hidden="true" />
                <Link
                  href={project.sourceRepository.href}
                  target="_blank"
                  rel="noreferrer"
                  className="break-words font-mono text-xs leading-6 text-white/58 transition hover:text-white"
                >
                  {project.sourceRepository.label}
                </Link>
              </div>
            </div>
            <div>
              <p className="kicker">Project signals</p>
              <div className="mt-4 grid gap-3">
                {project.proofPoints.map((point) => (
                  <p key={point} className="surface-card px-4 py-3 text-sm leading-6 text-white/72">
                    {point}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
    </>
  );
}
