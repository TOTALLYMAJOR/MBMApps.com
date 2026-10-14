import { webcrypto } from 'node:crypto';
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from './middleware';
import { createGateToken, GATE_COOKIE_NAME } from './lib/site-gate';

const originalEnv = { ...process.env };
const secret = 'a-signing-secret-with-at-least-thirty-two-characters';

function protectedRequest(path: string, token?: string) {
  return new NextRequest(`https://mbmapps.com${path}`, {
    headers: token ? { Cookie: `${GATE_COOKIE_NAME}=${token}` } : undefined
  });
}

describe('site access middleware', () => {
  beforeAll(() => {
    Object.defineProperty(globalThis, 'crypto', { value: webcrypto, configurable: true });
  });

  beforeEach(() => {
    process.env = { ...originalEnv, MBMAPPS_GATE_SECRET: secret };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('redirects an unauthenticated page request to the entrance', async () => {
    const response = await middleware(protectedRequest('/apps?filter=active'));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('https://mbmapps.com/gate?next=%2Fapps%3Ffilter%3Dactive');
  });

  it('allows a guest to browse ordinary protected pages', async () => {
    const token = await createGateToken(secret, 'guest');
    const response = await middleware(protectedRequest('/apps', token));

    expect(response.status).toBe(200);
    expect(response.headers.get('x-middleware-next')).toBe('1');
  });

  it('hides discussion and rejects chat API access for a guest', async () => {
    const token = await createGateToken(secret, 'guest');
    const discuss = await middleware(protectedRequest('/discuss', token));
    const chat = await middleware(protectedRequest('/api/chat', token));

    expect(discuss.status).toBe(307);
    expect(discuss.headers.get('location')).toBe('https://mbmapps.com/');
    expect(chat.status).toBe(403);
  });

  it('allows member access to chat surfaces', async () => {
    const token = await createGateToken(secret, 'member');
    const discuss = await middleware(protectedRequest('/discuss', token));
    const chat = await middleware(protectedRequest('/api/chat', token));

    expect(discuss.status).toBe(200);
    expect(chat.status).toBe(200);
  });

  it('fails closed when the session signing secret is not configured', async () => {
    delete process.env.MBMAPPS_GATE_SECRET;
    const page = await middleware(protectedRequest('/apps'));
    const api = await middleware(protectedRequest('/api/contact'));

    expect(page.status).toBe(307);
    expect(api.status).toBe(503);
  });
});
