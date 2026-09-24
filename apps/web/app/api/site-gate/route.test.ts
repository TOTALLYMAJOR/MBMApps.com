import { webcrypto } from 'node:crypto';
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { POST } from './route';

const originalEnv = { ...process.env };

function request(body: unknown, ip: string) {
  return new Request('https://mbmapps.com/api/site-gate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body)
  });
}

describe('Signal Lock entrance route', () => {
  beforeAll(() => {
    Object.defineProperty(globalThis, 'crypto', { value: webcrypto, configurable: true });
  });

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      MBMAPPS_GATE_ENABLED: 'true',
      MBMAPPS_GATE_PASSPHRASE: 'a sufficiently long invite phrase',
      MBMAPPS_GATE_SECRET: 'a-signing-secret-with-at-least-thirty-two-characters'
    };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('refuses an incorrect signal path before checking the phrase', async () => {
    const response = await POST(request({
      sequence: ['observe', 'build', 'reason', 'verify'],
      passphrase: 'a sufficiently long invite phrase',
      next: '/tools'
    }, '192.0.2.1'));

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ ok: false, field: 'sequence' });
  });

  it('does not issue access for the wrong phrase', async () => {
    const response = await POST(request({
      sequence: ['observe', 'reason', 'build', 'verify'],
      passphrase: 'the wrong phrase',
      next: '/tools'
    }, '192.0.2.2'));

    expect(response.status).toBe(401);
    expect(response.headers.get('set-cookie')).toBeNull();
  });

  it('issues an HTTP-only access cookie and a safe return path', async () => {
    const response = await POST(request({
      sequence: ['observe', 'reason', 'build', 'verify'],
      passphrase: 'a sufficiently long invite phrase',
      next: 'https://example.com/escape'
    }, '192.0.2.3'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, next: '/' });
    expect(response.headers.get('set-cookie')).toContain('mbmapps_signal_access=');
    expect(response.headers.get('set-cookie')).toContain('HttpOnly');
    expect(response.headers.get('set-cookie')).toContain('SameSite=strict');
  });

  it('opens the simulated entrance without credentials', async () => {
    const response = await POST(request({ mode: 'simulation', next: '/tools' }, '192.0.2.4'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, next: '/tools' });
    expect(response.headers.get('set-cookie')).toContain('mbmapps_signal_access=');
    expect(response.headers.get('set-cookie')).toContain('HttpOnly');
  });

  it('opens the public portfolio when the configured gate is disabled', async () => {
    process.env.MBMAPPS_GATE_ENABLED = 'false';
    const response = await POST(request({ mode: 'simulation', next: '/apps' }, '192.0.2.5'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, next: '/apps' });
    expect(response.headers.get('set-cookie')).toBeNull();
  });
});
