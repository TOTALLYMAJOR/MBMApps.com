import type { Metadata } from 'next';
import { WaleExperience } from '@/components/wale/wale-experience';

export const metadata: Metadata = {
  title: { absolute: 'Wale Concept Designs | MBMApps' },
  description:
    'A protected interactive concept study for Wale, from the abyss arrival through a deterministic sample run.',
  alternates: { canonical: '/conceptdesigns' }
};

export default function ConceptDesignsPage() {
  return <WaleExperience />;
}
