import { NextResponse } from 'next/server';
import { z } from 'zod';
import { siteAccessVerificationRequestSchema } from '@mbm/contracts';
import {
  InvalidIdentityTokenError,
  verifyFirebaseIdentity
} from '@/lib/firebase/admin';
import {
  createGateToken,
  GATE_COOKIE_NAME,
  getGateConfiguration,
  safeReturnPath
} from '@/lib/site-gate';
import {
  assertSameOrigin,
  PublicIntakeRequestError,
  readPublicIntakePayload
} from '@/lib/public-intake';

export const runtime = 'nodejs';

const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 6;
const attempts = new Map<string, { count: number; resetsAt: number }>();

const entranceSchema = siteAccessVerificationRequestSchema.extend({
  next: z.string().max(2048).optional()
});
const memberProviders = new Set(['google.com', 'microsoft.com', 'apple.com']);

function roleForProvider(provider: string | undefined): 'guest' | 'member' | null {
  if (provider === 'anonymous') return 'guest';
  if (provider !== undefined && memberProviders.has(provider)) return 'member';
  return null;
}

function clientKey(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')?.trim()
    || 'unknown';
}

function attemptState(key: string, now = Date.now()) {
  const current = attempts.get(key);
  if (!current || current.resetsAt <= now) {
    const fresh = { count: 0, resetsAt: now + WINDOW_MS };
    attempts.set(key, fresh);
    return fresh;
  }
  return current;
}

function refused(message: string, status: number) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function POST(request: Request) {
  const configuration = getGateConfiguration();
  const key = clientKey(request);
  const state = attemptState(key);
  if (state.count >= MAX_ATTEMPTS) {
    const retryAfter = Math.max(1, Math.ceil((state.resetsAt - Date.now()) / 1000));
    return NextResponse.json(
      { ok: false, message: 'Too many attempts. Let the signal settle, then try again.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    );
  }

  let body: unknown;
  try {
    body = await readPublicIntakePayload(request);
  } catch (error) {
    state.count += 1;
    if (error instanceof PublicIntakeRequestError) return refused(error.message, error.status);
    return refused('The entrance request could not be read.', 400);
  }

  const parsed = entranceSchema.safeParse(body);
  if (!parsed.success) {
    state.count += 1;
    return refused('The entrance request is incomplete.', 400);
  }

  if (!configuration.configured) {
    return refused('The entrance is not configured.', 503);
  }

  let role: 'guest' | 'member';
  try {
    const identity = await verifyFirebaseIdentity(parsed.data.idToken);
    const verifiedRole = roleForProvider(identity.signInProvider);
    if (verifiedRole === null) {
      state.count += 1;
      return refused('Firebase could not verify this sign-in. Sign in again and retry.', 503);
    }
    role = verifiedRole;
  } catch (error) {
    state.count += 1;
    if (error instanceof InvalidIdentityTokenError) {
      return refused('Firebase could not verify this sign-in. Sign in again and retry.', 401);
    }
    return refused('Sign-in verification is unavailable. Try again shortly.', 503);
  }

  attempts.delete(key);
  const token = await createGateToken(configuration.secret, role, Date.now(), configuration.sessionSeconds);
  const response = NextResponse.json({ ok: true, next: safeReturnPath(parsed.data.next) });
  response.cookies.set({
    name: GATE_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: configuration.sessionSeconds
  });
  return response;
}

export async function DELETE(request: Request) {
  try {
    assertSameOrigin(request);
  } catch (error) {
    if (error instanceof PublicIntakeRequestError) return refused(error.message, error.status);
    return refused('The sign-out request could not be read.', 400);
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: GATE_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0
  });
  return response;
}
