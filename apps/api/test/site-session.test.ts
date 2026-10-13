import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { siteAccessTokenVersion } from '@mbm/contracts';
import { verifySiteSessionToken } from '../src/site-session.js';

const secret = 'a-signing-secret-with-at-least-thirty-two-characters';

function token(role: 'guest' | 'member', now: number, ttlSeconds = 60) {
  const expiresAt = Math.floor((now + ttlSeconds * 1000) / 1000);
  const payload = `${siteAccessTokenVersion}.${role}.${expiresAt}`;
  const signature = createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

describe('site session verification', () => {
  it('reads signed member and guest roles', () => {
    const now = 1_800_000_000_000;

    expect(verifySiteSessionToken(token('member', now), now, secret)).toBe('member');
    expect(verifySiteSessionToken(token('guest', now), now, secret)).toBe('guest');
  });

  it('rejects expiry, role substitution, and signature tampering', () => {
    const now = 1_800_000_000_000;
    const memberToken = token('member', now);

    expect(verifySiteSessionToken(memberToken, now + 61_000, secret)).toBeNull();
    expect(verifySiteSessionToken(memberToken.replace('.member.', '.guest.'), now, secret)).toBeNull();
    expect(verifySiteSessionToken(`${memberToken}x`, now, secret)).toBeNull();
  });
});
