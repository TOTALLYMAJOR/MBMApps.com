export const GATE_COOKIE_NAME = 'mbmapps_signal_access';
export const SIGNAL_PATH = ['observe', 'reason', 'build', 'verify'] as const;

const TOKEN_VERSION = 'v1';
const textEncoder = new TextEncoder();

type GateEnvironment = {
  MBMAPPS_GATE_ENABLED?: string;
  MBMAPPS_GATE_PASSPHRASE?: string;
  MBMAPPS_GATE_SECRET?: string;
  MBMAPPS_GATE_SESSION_HOURS?: string;
};

export type GateConfiguration = {
  enabled: boolean;
  passphrase: string;
  secret: string;
  sessionSeconds: number;
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
  const passphrase = environment.MBMAPPS_GATE_PASSPHRASE?.trim() ?? '';
  const secret = environment.MBMAPPS_GATE_SECRET?.trim() ?? '';
  const requestedHours = Number(environment.MBMAPPS_GATE_SESSION_HOURS ?? 12);
  const sessionHours = Number.isFinite(requestedHours) ? Math.min(Math.max(requestedHours, 1), 168) : 12;

  return {
    enabled: environment.MBMAPPS_GATE_ENABLED === 'true' && passphrase.length >= 12 && secret.length >= 32,
    passphrase,
    secret,
    sessionSeconds: Math.round(sessionHours * 60 * 60)
  };
}

export function isCorrectSignalPath(path: readonly string[]) {
  return path.length === SIGNAL_PATH.length && path.every((step, index) => step === SIGNAL_PATH[index]);
}

export function passphraseMatches(candidate: string, expected: string) {
  return constantTimeEqual(candidate.trim(), expected);
}

export async function createGateToken(secret: string, now = Date.now(), ttlSeconds = 12 * 60 * 60) {
  const expiresAt = Math.floor((now + ttlSeconds * 1000) / 1000);
  const payload = `${TOKEN_VERSION}.${expiresAt}`;
  return `${payload}.${await sign(payload, secret)}`;
}

export async function verifyGateToken(token: string | undefined, secret: string, now = Date.now()) {
  if (!token || !secret) return false;
  const [version, expiresAtValue, signature, ...extra] = token.split('.');
  if (extra.length || version !== TOKEN_VERSION || !expiresAtValue || !signature) return false;

  const expiresAt = Number(expiresAtValue);
  if (!Number.isInteger(expiresAt) || expiresAt <= Math.floor(now / 1000)) return false;

  const expected = await sign(`${version}.${expiresAtValue}`, secret);
  return constantTimeEqual(signature, expected);
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
