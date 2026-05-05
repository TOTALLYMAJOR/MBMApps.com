import { describe, expect, it } from 'vitest';
import { buildTelemetryPayload, readUtmAttribution, resolveDeviceClass } from '@/lib/telemetry';

describe('telemetry helpers', () => {
  it('classifies devices from viewport and user agent signals', () => {
    expect(resolveDeviceClass('Mozilla/5.0', 1280)).toBe('desktop');
    expect(resolveDeviceClass('Mozilla/5.0', 820)).toBe('tablet');
    expect(resolveDeviceClass('Mozilla/5.0', 390)).toBe('mobile');
    expect(resolveDeviceClass('Googlebot/2.1', 1280)).toBe('bot');
  });

  it('extracts UTM attribution', () => {
    const attribution = readUtmAttribution('?utm_source=newsletter&utm_medium=email&utm_campaign=champion');

    expect(attribution.source).toBe('newsletter');
    expect(attribution.medium).toBe('email');
    expect(attribution.campaign).toBe('champion');
  });

  it('builds enriched event payloads with session context', () => {
    const payload = buildTelemetryPayload(
      'cta_clicked',
      '/quietpilot',
      {
        surface: 'test'
      },
      undefined,
      {
        context: {
          sessionId: 'session_test',
          anonymousId: 'anon_test',
          routeSource: '/quietpilot',
          deviceClass: 'desktop',
          utm: {
            source: 'direct'
          }
        }
      }
    );

    expect(payload.schemaVersion).toBe(1);
    expect(payload.context.sessionId).toBe('session_test');
    expect(payload.context.deviceClass).toBe('desktop');
    expect(payload.metadata.surface).toBe('test');
  });

  it('supports key champion journey events emitted by web surfaces', () => {
    const events = ['contact_submitted', 'content_read', 'demo_stage_selected', 'quietpilot_opened'] as const;

    for (const event of events) {
      const payload = buildTelemetryPayload(event, '/test', {}, undefined, {
        context: {
          sessionId: 'session_test',
          anonymousId: 'anon_test',
          deviceClass: 'desktop'
        }
      });

      expect(payload.event).toBe(event);
      expect(payload.schemaVersion).toBe(1);
    }
  });
});
