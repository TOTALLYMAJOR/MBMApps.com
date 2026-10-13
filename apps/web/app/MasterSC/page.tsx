import type { Metadata } from 'next';
import { MasterScShowcase } from '@/components/master-sc-showcase';
import { masterScProduct } from '@/lib/projects';

export const metadata: Metadata = {
  title: 'MasterSC Interactive Showcase',
  description:
    'A protected, interactive showcase for the local-first SC2 Master Coach desktop system, using deterministic sample interface state.',
  alternates: { canonical: '/MasterSC' },
  openGraph: {
    title: 'MasterSC Interactive Showcase | MBMApps',
    description:
      'Explore the replay-intelligence and guided-execution model through deterministic sample interface state.',
    url: '/MasterSC',
    type: 'website'
  }
};

export default function MasterScPage() {
  return (
    <MasterScShowcase
      product={{
        name: masterScProduct.name,
        status: masterScProduct.status,
        accessDescription: masterScProduct.accessDescription,
        proofBoundary: masterScProduct.proofBoundary,
        sourceRepository: masterScProduct.sourceRepository,
        secondaryAction: masterScProduct.secondaryAction
      }}
    />
  );
}
