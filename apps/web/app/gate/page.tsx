import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SignalLock } from '@/components/signal-lock';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to enter the MBMApps portfolio.',
  robots: { index: false, follow: false }
};

export default function GatePage() {
  return <Suspense><SignalLock /></Suspense>;
}
