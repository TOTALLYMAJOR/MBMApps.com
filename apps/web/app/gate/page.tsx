import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SignalLock } from '@/components/signal-lock';

export const metadata: Metadata = {
  title: 'Private sign in',
  description: 'Owner-controlled entrance to the private MBMApps operating world.',
  robots: { index: false, follow: false }
};

export default function GatePage() {
  return <Suspense><SignalLock /></Suspense>;
}
