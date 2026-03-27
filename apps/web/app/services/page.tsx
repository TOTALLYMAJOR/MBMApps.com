import type { Metadata } from 'next';
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
        <section className="hero-mesh relative overflow-hidden border-b border-white/10">
          <div className="ambient-grid pointer-events-none absolute inset-0 opacity-50" />
          <div className="mx-auto w-full max-w-6xl px-6 pb-16 pt-16 lg:px-8 lg:pt-20">
            <p className="kicker">Services</p>
            <h1 className="mt-3 max-w-4xl font-display text-5xl text-white md:text-6xl">Engineering outcomes, not feature factories.</h1>
            <p className="text-mbm-muted mt-4 max-w-3xl text-lg leading-8">
              We align architecture and execution with business goals so your software scales confidently while delivery speed increases.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                ['Blueprint Velocity', 'Architecture direction in days, not months.'],
                ['Operational Discipline', 'Typed contracts, safe deploy gates, and observability.'],
                ['Business Translation', 'Technical decisions tied to ROI and growth levers.']
              ].map(([title, detail]) => (
                <article key={title} className="surface-card p-4">
                  <p className="font-semibold text-white">{title}</p>
                  <p className="text-mbm-muted mt-2 text-sm">{detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto mt-10 grid w-full max-w-6xl gap-6 px-6 md:grid-cols-3 lg:px-8">
          {services.map((service) => (
            <article key={service.title} className="surface-panel p-6">
              <h2 className="font-display text-2xl text-white">{service.title}</h2>
              <p className="text-mbm-muted mt-3 text-sm leading-6">{service.description}</p>
              <ul className="mt-4 space-y-2 text-sm text-white/85">
                {service.outcomes.map((outcome) => (
                  <li key={outcome} className="surface-card px-3 py-2">
                    {outcome}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
          <ServicesSwitchboard />
        </div>

        <section className="section-shell mx-auto mt-12 w-full max-w-6xl p-8 md:p-10 lg:px-10">
          <h2 className="font-display text-3xl text-white">Stack capability highlights</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              ['Vercel', 'Global edge delivery, preview deployments, web vitals insights'],
              ['Railway', 'Containerized API hosting with straightforward scaling and runtime controls'],
              ['Firebase', 'Authentication, real-time data, and secure managed backend primitives'],
              ['Docker', 'Portable service packaging for local parity and multi-provider portability']
            ].map(([title, detail]) => (
              <article key={title} className="surface-card p-4">
                <p className="font-semibold text-white">{title}</p>
                <p className="text-mbm-muted mt-1 text-sm">{detail}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(architectureSchema) }} />
    </>
  );
}
