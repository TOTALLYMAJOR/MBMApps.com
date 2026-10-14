import type { Metadata } from 'next';
import { WaleHomeChapter } from '@/components/wale/wale-home-chapter';

export const metadata: Metadata = {
  title: { absolute: 'Wale Concept — MBMApps' },
  description: 'The preserved Wale development decision intelligence concept from MBMApps.',
  alternates: { canonical: '/concepts' }
};

export default function ConceptsPage() {
  return (
    <div className="terminal-home terminal-home--homepage terminal-home--motion-ready">
      <WaleHomeChapter />
    </div>
  );
}
