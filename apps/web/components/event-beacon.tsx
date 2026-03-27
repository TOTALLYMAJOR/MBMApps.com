'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/telemetry';

type EventBeaconProps = {
  event: 'case_study_viewed' | 'demo_login';
  path: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export function EventBeacon({ event, path, metadata = {} }: EventBeaconProps) {
  useEffect(() => {
    void trackEvent(event, path, metadata);
  }, [event, metadata, path]);

  return null;
}
