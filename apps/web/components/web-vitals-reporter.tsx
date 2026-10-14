'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { useSiteSession } from '@/components/site-session';
import { trackEvent } from '@/lib/telemetry';

export function WebVitalsReporter() {
  const { role } = useSiteSession();

  useReportWebVitals((metric) => {
    if (!role) return;

    void trackEvent('web_vital', window.location.pathname, {
      id: metric.id,
      name: metric.name,
      value: Number(metric.value.toFixed(2)),
      rating: metric.rating ?? 'n/a'
    });
  });

  return null;
}
