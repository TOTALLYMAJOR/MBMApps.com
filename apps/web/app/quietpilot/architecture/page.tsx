import type { Metadata } from 'next';
import { QuietPilotArchitectureTopology } from '@/components/quietpilot-architecture-topology';
import { quietPilotArchitectureIntro } from '@/lib/quietpilot-marketing';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'QuietPilot Architecture Topology',
  description: quietPilotArchitectureIntro.summary,
  alternates: {
    canonical: '/quietpilot/architecture'
  },
  openGraph: {
    title: 'QuietPilot Architecture Topology',
    description: quietPilotArchitectureIntro.summary,
    url: `${siteConfig.url}/quietpilot/architecture`,
    siteName: siteConfig.name,
    type: 'website'
  }
};

export default function QuietPilotArchitecturePage() {
  return <QuietPilotArchitectureTopology />;
}
