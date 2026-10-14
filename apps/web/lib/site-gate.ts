import { siteAccessTokenVersion, type SiteAccessRole } from '@mbm/contracts';

export const GATE_COOKIE_NAME = 'mbmapps_signal_access';

const textEncoder = new TextEncoder();

type GateEnvironment = {
  MBMAPPS_GATE_SECRET?: string;
  MBMAPPS_GATE_SESSION_HOURS?: string;
};

export type GateConfiguration = {
  configured: boolean;
  secret: string;
  sessionSeconds: number;
};

export type GateSession = {
  role: SiteAccessRole;
  expiresAt: number;
};

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, textEncoder.encode(value));
  return bytesToBase64Url(new Uint8Array(signature));
}

function constantTimeEqual(left: string, right: string) {
  const leftBytes = textEncoder.encode(left.normalize('NFKC'));
  const rightBytes = textEncoder.encode(right.normalize('NFKC'));
  const size = Math.max(leftBytes.length, rightBytes.length);
  let difference = leftBytes.length ^ rightBytes.length;

  for (let index = 0; index < size; index += 1) {
    difference |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
  }

  return difference === 0;
}

export function getGateConfiguration(environment: GateEnvironment = process.env as GateEnvironment): GateConfiguration {
  const secret = environment.MBMAPPS_GATE_SECRET?.trim() ?? '';
  const requestedHours = Number(environment.MBMAPPS_GATE_SESSION_HOURS ?? 12);
  const sessionHours = Number.isFinite(requestedHours) ? Math.min(Math.max(requestedHours, 1), 168) : 12;

  return {
    configured: secret.length >= 32,
    secret,
    sessionSeconds: Math.round(sessionHours * 60 * 60)
  };
}

export async function createGateToken(secret: string, role: SiteAccessRole, now = Date.now(), ttlSeconds = 12 * 60 * 60) {
  const expiresAt = Math.floor((now + ttlSeconds * 1000) / 1000);
  const payload = `${siteAccessTokenVersion}.${role}.${expiresAt}`;
  return `${payload}.${await sign(payload, secret)}`;
}

export async function readGateSession(token: string | undefined, secret: string, now = Date.now()): Promise<GateSession | null> {
  if (!token || !secret) return null;
  const [version, roleValue, expiresAtValue, signature, ...extra] = token.split('.');
  if (extra.length || version !== siteAccessTokenVersion || !expiresAtValue || !signature) return null;
  if (roleValue !== 'guest' && roleValue !== 'member') return null;

  const expiresAt = Number(expiresAtValue);
  if (!Number.isInteger(expiresAt) || expiresAt <= Math.floor(now / 1000)) return null;

  const expected = await sign(`${version}.${roleValue}.${expiresAtValue}`, secret);
  if (!constantTimeEqual(signature, expected)) return null;
  return { role: roleValue, expiresAt };
}

export async function verifyGateToken(token: string | undefined, secret: string, now = Date.now()) {
  return (await readGateSession(token, secret, now)) !== null;
}

export function safeReturnPath(candidate: string | null | undefined) {
  if (!candidate || !candidate.startsWith('/') || candidate.startsWith('//')) return '/';

  try {
    const parsed = new URL(candidate, 'https://mbmapps.local');
    if (parsed.origin !== 'https://mbmapps.local') return '/';
    if (parsed.pathname === '/gate' || parsed.pathname.startsWith('/api/site-gate')) return '/';
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return '/';
  }
}
