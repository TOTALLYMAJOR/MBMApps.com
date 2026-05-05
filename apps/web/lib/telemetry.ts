'use client';

import type { EventTelemetryPayload, TelemetryContext, UtmAttribution } from '@mbm/contracts';

type EventName = EventTelemetryPayload['event'];

type MetadataValue = string | number | boolean | null;

type TelemetryOptions = {
  context?: Partial<TelemetryContext>;
  source?: EventTelemetryPayload['source'];
};

const anonymousStorageKey = 'mbmapps:anonymous-id';
const sessionStorageKey = 'mbmapps:session-id';

function createTelemetryId(prefix: string) {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function readStorage(storage: Storage | undefined, key: string, prefix: string) {
  if (storage === undefined) {
    return createTelemetryId(prefix);
  }

  try {
    const existing = storage.getItem(key);
    if (existing !== null && existing.length > 0) {
      return existing;
    }

    const next = createTelemetryId(prefix);
    storage.setItem(key, next);
    return next;
  } catch {
    return createTelemetryId(prefix);
  }
}

function safeStorage(kind: 'local' | 'session') {
  if (typeof window === 'undefined') {
    return undefined;
  }

  try {
    return kind === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return undefined;
  }
}

export function resolveDeviceClass(userAgent = '', width?: number): TelemetryContext['deviceClass'] {
  const normalized = userAgent.toLowerCase();

  if (/bot|crawler|spider|crawling/.test(normalized)) {
    return 'bot';
  }

  if (typeof width === 'number') {
    if (width < 768) {
      return 'mobile';
    }
    if (width < 1024) {
      return 'tablet';
    }
    return 'desktop';
  }

  if (/mobi|iphone|android/.test(normalized)) {
    return 'mobile';
  }
  if (/ipad|tablet/.test(normalized)) {
    return 'tablet';
  }

  return normalized.length > 0 ? 'desktop' : 'unknown';
}

export function readUtmAttribution(search = ''): UtmAttribution {
  const params = new URLSearchParams(search.startsWith('?') ? search : `?${search}`);
  const read = (key: string) => params.get(key) ?? undefined;

  return {
    source: read('utm_source'),
    medium: read('utm_medium'),
    campaign: read('utm_campaign'),
    term: read('utm_term'),
    content: read('utm_content')
  };
}

function buildContext(overrides: Partial<TelemetryContext> = {}): TelemetryContext {
  if (typeof window === 'undefined') {
    return {
      sessionId: overrides.sessionId ?? createTelemetryId('session'),
      anonymousId: overrides.anonymousId ?? createTelemetryId('anon'),
      referrer: overrides.referrer ?? '',
      routeSource: overrides.routeSource ?? 'server',
      deviceClass: overrides.deviceClass ?? 'unknown',
      utm: overrides.utm ?? {}
    };
  }

  const sessionId = overrides.sessionId ?? readStorage(safeStorage('session'), sessionStorageKey, 'session');
  const anonymousId = overrides.anonymousId ?? readStorage(safeStorage('local'), anonymousStorageKey, 'anon');

  return {
    sessionId,
    anonymousId,
    referrer: overrides.referrer ?? document.referrer ?? '',
    routeSource: overrides.routeSource ?? window.location.pathname,
    deviceClass: overrides.deviceClass ?? resolveDeviceClass(navigator.userAgent, window.innerWidth),
    utm: overrides.utm ?? readUtmAttribution(window.location.search)
  };
}

export function buildTelemetryPayload(
  event: EventName,
  path: string,
  metadata: Record<string, MetadataValue> = {},
  userId?: string,
  options: TelemetryOptions = {}
): EventTelemetryPayload {
  return {
    schemaVersion: 1,
    event,
    path,
    at: new Date().toISOString(),
    source: options.source ?? 'web',
    context: buildContext(options.context),
    metadata,
    userId
  };
}

export async function trackEvent(
  event: EventName,
  path: string,
  metadata: Record<string, MetadataValue> = {},
  userId?: string,
  options: TelemetryOptions = {}
) {
  const payload = buildTelemetryPayload(event, path, metadata, userId, options);

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
