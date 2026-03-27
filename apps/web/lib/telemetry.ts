'use client';

import type { EventTelemetryPayload } from '@mbm/contracts';

type EventName = EventTelemetryPayload['event'];

type MetadataValue = string | number | boolean | null;

export async function trackEvent(
  event: EventName,
  path: string,
  metadata: Record<string, MetadataValue> = {},
  userId?: string
) {
  const payload: EventTelemetryPayload = {
    event,
    path,
    at: new Date().toISOString(),
    metadata,
    userId
  };

  const body = JSON.stringify(payload);

  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    const blob = new Blob([body], { type: 'application/json' });
    const accepted = navigator.sendBeacon('/api/telemetry', blob);
    if (accepted) {
      return;
    }
  }

  await fetch('/api/telemetry', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body,
    keepalive: true
  });
}
