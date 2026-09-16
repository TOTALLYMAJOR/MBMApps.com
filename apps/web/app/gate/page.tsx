import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SignalLock } from '@/components/signal-lock';

export const metadata: Metadata = {
  title: 'Signal Lock',
  description: 'Private entrance to the MBMApps operating world.',
  robots: { index: false, follow: false }
};

export default function GatePage() {
  return <Suspense><SignalLock /></Suspense>;
}
