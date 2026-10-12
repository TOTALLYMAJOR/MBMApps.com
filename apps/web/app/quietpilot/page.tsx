import type { Metadata } from 'next';
import { CateringPlatformLanding } from '@/components/quietpilot/catering-platform-landing';
import { quietPilotProduct, siteConfig } from '@/lib/site';

const pageTitle = 'QuietPilot — Catering Revenue Operations';
const pageDescription =
  'QuietPilot is the MBMApps flagship product for service businesses that need a calm command center for leads, quotes, proposals, staffing, inventory, jobs, and payments.';

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: 'https://www.quietpilot.us'
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: 'https://www.quietpilot.us',
    siteName: siteConfig.name,
    type: 'website'
  }
};

export default function QuietPilotPage() {
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: quietPilotProduct.name,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: quietPilotProduct.description,
    url: 'https://www.quietpilot.us',
    publisher: { '@type': 'Organization', name: siteConfig.legalName, url: siteConfig.url }
  };
  return <>
    <CateringPlatformLanding />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
  </>;
}
