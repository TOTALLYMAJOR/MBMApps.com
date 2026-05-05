'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import type { EventTelemetryPayload } from '@mbm/contracts';
import { trackEvent } from '@/lib/telemetry';

type MetadataValue = string | number | boolean | null;

type TrackedLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string;
  trackingEvent?: EventTelemetryPayload['event'];
  trackingMetadata?: Record<string, MetadataValue>;
  trackingPath?: string;
};

export function TrackedLink({
  href,
  trackingEvent = 'cta_clicked',
  trackingMetadata = {},
  trackingPath,
  onClick,
  ...props
}: TrackedLinkProps) {
  return (
    <Link
      href={href}
      onClick={(event) => {
        void trackEvent(trackingEvent, trackingPath ?? href, trackingMetadata);
        onClick?.(event);
      }}
      {...props}
    />
  );
}
