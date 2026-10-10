import type { Metadata } from 'next';
import { WaleArchiveShell } from '@/components/wale-archive-shell';

export const metadata: Metadata = {
  title: { absolute: 'Wale — The Living Archive' },
  description:
    'An interactive Wale study of discovery, evidence, and accountable system evolution.',
  alternates: { canonical: '/wale' }
};

export default function WalePage() {
  return <WaleArchiveShell />;
}
