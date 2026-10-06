import type { Metadata } from 'next';
import { WaleLaunch } from '@/components/wale-launch';

export const metadata: Metadata = {
  title: { absolute: 'Wale — Interactive Development Intelligence' },
  description:
    'Wale audits a repository development environment, explains its strongest constraint, and prepares bounded improvements with human approval.',
  alternates: { canonical: '/wale' }
};

export default function WalePage() {
  return <WaleLaunch />;
}
