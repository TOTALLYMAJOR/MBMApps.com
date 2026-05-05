'use client';

import { useEffect } from 'react';
import type { EventTelemetryPayload } from '@mbm/contracts';
import { trackEvent } from '@/lib/telemetry';

type EventBeaconProps = {
  event: EventTelemetryPayload['event'];
  path: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export function EventBeacon({ event, path, metadata = {} }: EventBeaconProps) {
  useEffect(() => {
    void trackEvent(event, path, metadata);
  }, [event, metadata, path]);

  return null;
}
