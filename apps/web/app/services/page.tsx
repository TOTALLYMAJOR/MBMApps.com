import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import { NorthstarPageHero } from '@/components/northstar-page-hero';
import { ServicesSwitchboard } from '@/components/services-switchboard';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Engineering services for scalable web products, platform modernization, and growth systems.'
};

const services = [
  {
    title: 'Scalable Product Builds',
    description: 'End-to-end design and delivery of production-ready web applications with App Router architecture, typed contracts, and modular services.',
    outcomes: ['Accelerate launch cycles', 'Reduce reliability incidents', 'Improve maintainability for future teams']
  },
  {
    title: 'Revenue Workflow Automation',
    description: 'Custom quote, pricing, CRM, and customer lifecycle systems tuned to your exact operating model.',
    outcomes: ['Faster quote turnaround', 'Higher conversion visibility', 'Automated pipeline reporting']
  },
  {
    title: 'Cloud Architecture And DevEx',
    description: 'Deployment topology and tooling across Vercel, Railway, Firebase, Docker, and CI/CD workflows for resilient operations.',
    outcomes: ['Safe deploy workflows', 'Environment parity', 'Observability and traceability at launch']
  }
];

const architectureSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Web Platform Engineering',
  provider: {
    '@type': 'Organization',
    name: 'MBMApps LLC'
  },
  areaServed: 'US',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'MBMApps Service Lines',
    itemListElement: services.map((service) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: service.title,
        description: service.description
      }
    }))
  }
};

export default function ServicesPage() {
  return (
    <>
      <div className="pb-20">
        <NorthstarPageHero
          eyebrow="Engineering services"
          title="Engineering outcomes, not feature factories."
          description="We connect architecture and execution to the operating result: faster quoting, clearer revenue movement, safer releases, and software that remains understandable as it grows."
          signal="03 / tracks"
          actions={(
            <>
              <Link href="/contact" className="storefront-hero-button storefront-hero-button--primary">Start a project <ArrowUpRight className="h-4 w-4" /></Link>
              <Link href="/case-studies" className="storefront-hero-button">See outcomes</Link>
            </>
          )}
          aside={(
            <div className="northstar-rule-list">
              {[
                ['01', 'Product systems'],
                ['02', 'Revenue workflows'],
                ['03', 'Cloud reliability']
              ].map(([index, label]) => (
                <div key={index} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <span className="northstar-number text-xs">{index}</span>
                  <span className="text-sm text-white/66">{label}</span>
                </div>
              ))}
            </div>
          )}
        />

        <section className="northstar-section northstar-container">
          <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_0.65fr] lg:items-end">
            <div>
              <p className="northstar-kicker">Delivery lines</p>
              <h2 className="northstar-section-heading mt-4">Choose the constraint we should remove first.</h2>
            </div>
            <p className="max-w-lg text-sm leading-7 text-white/50 lg:justify-self-end">Each engagement is scoped around a measurable operating change, then built with typed boundaries, release controls, and a handoff your team can own.</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
          {services.map((service, index) => (
            <article key={service.title} className={`northstar-card flex min-h-[22rem] flex-col p-6 md:p-8 ${index === 0 ? 'lg:col-span-2' : ''}`}>
              <p className="northstar-number text-xs">0{index + 1}</p>
              <h2 className="mt-auto max-w-2xl pt-16 font-display text-3xl font-light tracking-[-0.04em] text-white md:text-4xl">{service.title}</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/52">{service.description}</p>
              <ul className="mt-6 grid gap-3 text-sm text-white/76 sm:grid-cols-3">
                {service.outcomes.map((outcome) => (
                  <li key={outcome} className="flex items-start gap-2 border-t border-white/10 pt-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-300" aria-hidden="true" />{outcome}
                  </li>
                ))}
              </ul>
            </article>
          ))}
          </div>
        </section>

        <div className="northstar-container">
          <ServicesSwitchboard />
        </div>

        <section className="northstar-section northstar-container">
          <p className="northstar-kicker">Delivery stack</p>
          <h2 className="northstar-section-heading mt-4">Tools selected for the operating model.</h2>
          <div className="northstar-rule-list mt-10 border-y border-white/10">
            {[
              ['Vercel', 'Global edge delivery, preview deployments, web vitals insights'],
              ['Railway', 'Containerized API hosting with straightforward scaling and runtime controls'],
              ['Firebase', 'Authentication, real-time data, and secure managed backend primitives'],
              ['Docker', 'Portable service packaging for local parity and multi-provider portability']
            ].map(([title, detail]) => (
              <article key={title} className="grid gap-3 py-6 sm:grid-cols-[12rem_1fr] sm:items-center">
                <p className="font-display text-xl font-medium text-white">{title}</p>
                <p className="max-w-2xl text-sm leading-7 text-white/48">{detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="northstar-container">
          <div className="northstar-cta-band">
            <p className="northstar-kicker">Next move</p>
            <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <h2 className="max-w-3xl font-display text-4xl font-light tracking-[-0.05em] text-white md:text-5xl">Bring the hard constraint. We’ll map the shortest credible route through it.</h2>
              <Link href="/contact" className="storefront-action storefront-action--primary">Request a technical approach <ArrowUpRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </section>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(architectureSchema) }} />
    </>
  );
}
