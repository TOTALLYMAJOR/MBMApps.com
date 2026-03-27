import type { Metadata } from 'next';

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
    <div className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8">
      <header>
        <p className="text-xs uppercase tracking-[0.24em] text-signal">Services</p>
        <h1 className="mt-3 font-display text-5xl text-white">Engineering outcomes, not feature factories.</h1>
        <p className="mt-4 max-w-2xl text-lg text-mist">
          We align architecture and execution with business goals so your software can scale confidently while moving faster.
        </p>
      </header>

      <section className="mt-10 grid gap-6 md:grid-cols-3">
        {services.map((service) => (
          <article key={service.title} className="rounded-3xl border border-white/10 bg-slate-900/65 p-6 shadow-soft">
            <h2 className="font-display text-2xl text-white">{service.title}</h2>
            <p className="mt-3 text-sm leading-6 text-mist">{service.description}</p>
            <ul className="mt-4 space-y-2 text-sm text-white/85">
              {service.outcomes.map((outcome) => (
                <li key={outcome} className="rounded-lg border border-white/10 bg-slate-950/55 px-3 py-2">
                  {outcome}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="mt-12 rounded-3xl border border-white/10 bg-slate-900/50 p-8">
        <h2 className="font-display text-3xl text-white">Stack capability highlights</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            ['Vercel', 'Global edge delivery, preview deployments, web vitals insights'],
            ['Railway', 'Containerized API hosting with straightforward scaling and runtime controls'],
            ['Firebase', 'Authentication, real-time data, and secure managed backend primitives'],
            ['Docker', 'Portable service packaging for local parity and multi-provider portability']
          ].map(([title, detail]) => (
            <article key={title} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <p className="font-semibold text-white">{title}</p>
              <p className="mt-1 text-sm text-mist">{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(architectureSchema) }} />
    </div>
  );
}
