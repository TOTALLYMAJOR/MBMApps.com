import type { Metadata } from 'next';
import { FlightLedgerHome } from '@/components/flight-ledger-home';
import { projectScreens } from '@/lib/projects';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Purpose-Built Software and Operating Systems',
  description:
    'Explore MBMApps applications for catering operations, youth-sports management, and quote-to-event workflows, or start a conversation about a custom system.',
  robots: { index: false, follow: false }
};

export default function HomeCandidatePage() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.legalName,
    url: siteConfig.url,
    email: siteConfig.email,
    sameAs: [siteConfig.social.github]
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'MBMApps applications',
    itemListElement: projectScreens.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: project.name,
        applicationCategory: project.category,
        operatingSystem: 'Web',
        description: project.description,
        url: project.websiteUrl
      }
    }))
  };

  return (
    <>
      <FlightLedgerHome />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
    </>
  );
}
