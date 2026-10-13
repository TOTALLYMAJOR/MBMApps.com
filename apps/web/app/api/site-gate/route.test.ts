import { webcrypto } from 'node:crypto';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { DELETE, POST } from './route';

const originalEnv = { ...process.env };

function request(body: unknown, ip: string) {
  return new Request('https://mbmapps.com/api/site-gate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'https://mbmapps.com',
      'x-forwarded-for': ip
    },
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
      BACKEND_API_URL: 'https://api.mbmapps.test',
      MBMAPPS_GATE_SECRET: 'a-signing-secret-with-at-least-thirty-two-characters'
    };
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ ok: true, role: 'member' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })));
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.unstubAllGlobals();
  });

  it('requires a Firebase ID token rather than accepting the former simulation mode', async () => {
    const response = await POST(request({ mode: 'simulation', next: '/tools' }, '192.0.2.1'));

    expect(response.status).toBe(400);
    expect(response.headers.get('set-cookie')).toBeNull();
  });

  it('issues an HTTP-only member cookie only after server verification', async () => {
    const response = await POST(request({
      idToken: 'verified-firebase-member-token',
      next: 'https://example.com/escape'
    }, '192.0.2.2'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, next: '/' });
    expect(response.headers.get('set-cookie')).toContain('mbmapps_signal_access=v2.member.');
    expect(response.headers.get('set-cookie')).toContain('HttpOnly');
    expect(response.headers.get('set-cookie')).toContain('SameSite=strict');
    expect(fetch).toHaveBeenCalledWith(
      'https://api.mbmapps.test/v1/auth/verify',
      expect.objectContaining({ method: 'POST', cache: 'no-store' })
    );
  });

  it('issues a restricted guest cookie for a verified anonymous identity', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({ ok: true, role: 'guest' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }));

    const response = await POST(request({ idToken: 'verified-firebase-guest-token', next: '/apps' }, '192.0.2.3'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, next: '/apps' });
    expect(response.headers.get('set-cookie')).toContain('mbmapps_signal_access=v2.guest.');
  });

  it('does not issue a cookie for an invalid or substituted backend response', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({ ok: true, role: 'admin' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }));

    const response = await POST(request({ idToken: 'untrusted-firebase-token-value' }, '192.0.2.4'));

    expect(response.status).toBe(503);
    expect(response.headers.get('set-cookie')).toBeNull();
  });

  it('fails closed when the session signing secret is absent', async () => {
    delete process.env.MBMAPPS_GATE_SECRET;
    const response = await POST(request({ idToken: 'verified-firebase-member-token' }, '192.0.2.5'));

    expect(response.status).toBe(503);
    expect(response.headers.get('set-cookie')).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('clears the site session through an HTTP-only cookie', async () => {
    const response = await DELETE(new Request('https://mbmapps.com/api/site-gate', {
      method: 'DELETE',
      headers: { Origin: 'https://mbmapps.com' }
    }));

    expect(response.status).toBe(200);
    expect(response.headers.get('set-cookie')).toContain('mbmapps_signal_access=');
    expect(response.headers.get('set-cookie')).toContain('Max-Age=0');
    expect(response.headers.get('set-cookie')).toContain('HttpOnly');
  });
});
