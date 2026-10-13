import { createHmac, timingSafeEqual } from 'node:crypto';
import { siteAccessTokenVersion, type SiteAccessRole } from '@mbm/contracts';
import { config } from './config.js';

function sameSignature(left: string, right: string) {
  const leftBytes = Buffer.from(left);
  const rightBytes = Buffer.from(right);
  return leftBytes.length === rightBytes.length && timingSafeEqual(leftBytes, rightBytes);
}

export function verifySiteSessionToken(
  token: string,
  now = Date.now(),
  secret = config.MBMAPPS_GATE_SECRET
): SiteAccessRole | null {
  if (!secret || secret.length < 32 || token.length > 2048) return null;

  const [version, roleValue, expiresAtValue, signature, ...extra] = token.split('.');
  if (extra.length || version !== siteAccessTokenVersion || !expiresAtValue || !signature) return null;
  if (roleValue !== 'guest' && roleValue !== 'member') return null;

  const expiresAt = Number(expiresAtValue);
  if (!Number.isInteger(expiresAt) || expiresAt <= Math.floor(now / 1000)) return null;

  const payload = `${version}.${roleValue}.${expiresAtValue}`;
  const expected = createHmac('sha256', secret).update(payload).digest('base64url');
  return sameSignature(signature, expected) ? roleValue : null;
}
