import Link from 'next/link';
import type { Metadata } from 'next';
import { HomeImmersive } from '@/components/home-immersive';
import { siteConfig } from '@/lib/site';

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
