import Link from 'next/link';
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'High-Quality Web Technology At Scale',
  description:
    'MBMApps delivers scalable web products with modern architecture, measurable business impact, and production-grade reliability.'
};

const capabilities = [
  {
    title: 'Platform Engineering',
    detail: 'Composable web platforms with production observability, CI/CD, and resilient cloud architecture.'
  },
  {
    title: 'Revenue Systems',
    detail: 'Quote, pipeline, and conversion systems that reduce operational drag and increase close rates.'
  },
  {
    title: 'Experience Quality',
    detail: 'Delightful UX backed by measurable performance budgets and quality engineering discipline.'
  }
];

const stack = [
  'Next.js App Router',
  'TypeScript',
  'Vercel',
  'Railway',
  'Firebase',
  'Docker'
];

export default function HomePage() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.legalName,
    url: siteConfig.url,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Chicago',
      addressRegion: 'IL',
      addressCountry: 'US'
    },
    sameAs: [siteConfig.social.github, siteConfig.social.linkedin]
  };

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10 bg-hero-grid">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pb-20 pt-20 lg:px-8 lg:pt-28">
          <p className="animate-rise text-xs uppercase tracking-[0.24em] text-signal">Production-Grade Product Engineering</p>
          <h1 className="max-w-4xl animate-rise font-display text-5xl font-semibold leading-tight text-white md:text-6xl">
            We build revenue-driving web platforms that perform under real-world scale.
          </h1>
          <p className="max-w-2xl animate-rise text-lg text-mist">
            MBMApps helps growth-stage and mid-market teams ship faster, automate key workflows, and maintain software quality as traffic and complexity increase.
          </p>
          <div className="flex flex-wrap gap-4 animate-rise">
            <Link href="/contact" className="rounded-full bg-electric px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500">
              Book a Discovery Call
            </Link>
            <Link href="/demo" className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:border-white/40">
              Explore Live Demo
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {stack.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/80"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-16 md:grid-cols-3 lg:px-8">
        {capabilities.map((item, index) => (
          <article
            key={item.title}
            className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-soft"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <h2 className="font-display text-2xl font-semibold text-white">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-mist">{item.detail}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-16 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-slate-900/55 p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.24em] text-signal">Execution Model</p>
          <h2 className="mt-3 font-display text-3xl text-white">From strategy to deployment, with measurable outcomes.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ['01', 'Architecture Blueprint', 'Define service boundaries, data contracts, and deployment topology for reliability and speed.'],
              ['02', 'Build + Integrate', 'Ship product slices with typed APIs, observability hooks, and automated quality gates.'],
              ['03', 'Launch + Optimize', 'Deploy to production, monitor usage/performance, and iterate against business KPIs.']
            ].map(([step, title, detail]) => (
              <article key={step} className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
                <p className="font-mono text-xs text-signal">{step}</p>
                <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm text-mist">{detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-20 lg:px-8">
        <div className="rounded-3xl border border-electric/35 bg-electric/10 p-8 text-center md:p-10">
          <h2 className="font-display text-3xl text-white">Need a trusted partner to scale your web platform?</h2>
          <p className="mt-3 text-mist">Let&apos;s map your technical roadmap and ship your highest-leverage product improvements.</p>
          <Link
            href="/contact"
            className="mt-6 inline-flex rounded-full bg-electric px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Start Your Project
          </Link>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
    </>
  );
}
