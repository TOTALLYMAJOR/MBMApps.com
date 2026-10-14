import { safeReturnPath } from './site-gate';

// Presentation handoff only; this never establishes or extends an identity.
export function destinationAfterSignIn(candidate: string | null | undefined) {
  const next = safeReturnPath(candidate);
  return next === '/' ? '/?welcome=1' : next;
}
