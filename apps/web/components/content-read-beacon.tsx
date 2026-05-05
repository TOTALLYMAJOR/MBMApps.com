'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/telemetry';

type MetadataValue = string | number | boolean | null;

type ContentReadBeaconProps = {
  path: string;
  section: 'case-study' | 'insight';
  slug: string;
  metadata?: Record<string, MetadataValue>;
};

const checkpoints = [25, 50, 75, 100];

export function ContentReadBeacon({ path, section, slug, metadata = {} }: ContentReadBeaconProps) {
  useEffect(() => {
    const sent = new Set<number>();
    const startedAt = Date.now();
    const baseMetadata = {
      ...metadata,
      section,
      slug
    };

    void trackEvent('content_read', path, {
      ...baseMetadata,
      read_depth_percent: 0
    });

    const handleScroll = () => {
      const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const depth = Math.min(100, Math.round((window.scrollY / scrollable) * 100));

      for (const checkpoint of checkpoints) {
        if (depth >= checkpoint && !sent.has(checkpoint)) {
          sent.add(checkpoint);
          void trackEvent('content_read', path, {
            ...baseMetadata,
            read_depth_percent: checkpoint
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      void trackEvent('content_read', path, {
        ...baseMetadata,
        read_duration_seconds: Math.round((Date.now() - startedAt) / 1000)
      });
    };
  }, [metadata, path, section, slug]);

  return null;
}
