import Link from 'next/link';
import type { Metadata } from 'next';
import { HomeImmersive } from '@/components/home-immersive';
import { quietPilotProduct, siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'High-Quality Web Technology At Scale',
  description:
    'MBMApps delivers scalable web products with modern architecture, measurable business impact, and production-grade reliability.'
};

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
      <HomeImmersive />
      <section className="mx-auto w-full max-w-6xl px-6 pb-20 lg:px-8">
        <div className="section-shell p-8 text-center md:p-10">
          <p className="kicker">{'// Next Move'}</p>
          <h2 className="mt-3 font-display text-3xl text-white">QuietPilot is the flagship product.</h2>
          <p className="text-mbm-muted mt-3">See the service-operations command center, then open the app when you are ready to inspect the operator workflow.</p>
          <Link href={quietPilotProduct.appUrl} target="_blank" rel="noreferrer" className="btn-theme mt-6">
            Open QuietPilot
          </Link>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
    </>
  );
}
