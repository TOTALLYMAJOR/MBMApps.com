import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  createGateToken,
  GATE_COOKIE_NAME,
  getGateConfiguration,
  isCorrectSignalPath,
  passphraseMatches,
  safeReturnPath
} from '@/lib/site-gate';

export const runtime = 'nodejs';

const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 6;
const attempts = new Map<string, { count: number; resetsAt: number }>();

const entranceSchema = z.object({
  sequence: z.array(z.string()).max(8),
  passphrase: z.string().min(1).max(256),
  next: z.string().max(2048).optional()
});

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

function refused(message: string, status: number, field?: 'sequence' | 'passphrase') {
  return NextResponse.json({ ok: false, message, ...(field ? { field } : {}) }, { status });
}

export async function POST(request: Request) {
  const configuration = getGateConfiguration();
  if (!configuration.enabled) {
    return refused('The entrance is not configured.', 503);
  }

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
    body = await request.json();
  } catch {
    state.count += 1;
    return refused('The entrance request could not be read.', 400);
  }

  const parsed = entranceSchema.safeParse(body);
  if (!parsed.success) {
    state.count += 1;
    return refused('Complete the signal path and enter the invite phrase.', 400);
  }

  if (!isCorrectSignalPath(parsed.data.sequence)) {
    state.count += 1;
    return refused('The signal path is out of sequence.', 400, 'sequence');
  }

  if (!passphraseMatches(parsed.data.passphrase, configuration.passphrase)) {
    state.count += 1;
    return refused('That invite phrase does not complete the signal.', 401, 'passphrase');
  }

  attempts.delete(key);
  const token = await createGateToken(configuration.secret, Date.now(), configuration.sessionSeconds);
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
