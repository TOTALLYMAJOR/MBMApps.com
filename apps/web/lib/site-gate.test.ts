import { webcrypto } from 'node:crypto';
import { beforeAll, describe, expect, it } from 'vitest';
import {
  createGateToken,
  readGateSession,
  safeReturnPath,
  verifyGateToken
} from './site-gate';

beforeAll(() => {
  Object.defineProperty(globalThis, 'crypto', { value: webcrypto, configurable: true });
});

describe('Signal Lock security contract', () => {
  it('issues a signed role token that expires and rejects tampering', async () => {
    const now = 1_800_000_000_000;
    const token = await createGateToken('test-signing-secret', 'guest', now, 60);

    await expect(verifyGateToken(token, 'test-signing-secret', now + 59_000)).resolves.toBe(true);
    await expect(verifyGateToken(token, 'test-signing-secret', now + 61_000)).resolves.toBe(false);
    await expect(verifyGateToken(`${token}x`, 'test-signing-secret', now + 10_000)).resolves.toBe(false);
    await expect(readGateSession(token, 'test-signing-secret', now + 10_000)).resolves.toMatchObject({ role: 'guest' });
  });

  it('does not allow a signed guest token to be relabeled as a member', async () => {
    const now = 1_800_000_000_000;
    const token = await createGateToken('test-signing-secret', 'guest', now, 60);

    await expect(readGateSession(token.replace('.guest.', '.member.'), 'test-signing-secret', now)).resolves.toBeNull();
  });

  it('keeps redirects on this site', () => {
    expect(safeReturnPath('/tools/prompt-register?recipe=83')).toBe('/tools/prompt-register?recipe=83');
    expect(safeReturnPath('https://example.com/steal')).toBe('/');
    expect(safeReturnPath('//example.com/steal')).toBe('/');
    expect(safeReturnPath('/gate')).toBe('/');
  });
});
