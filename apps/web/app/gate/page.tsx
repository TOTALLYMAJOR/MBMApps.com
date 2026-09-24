import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SignalLock } from '@/components/signal-lock';

export const metadata: Metadata = {
  title: 'Entrance simulation',
  description: 'A simulated entrance to the MBMApps portfolio. No account or credentials required.',
  robots: { index: false, follow: false }
};

export default function GatePage() {
  return <Suspense><SignalLock /></Suspense>;
}
