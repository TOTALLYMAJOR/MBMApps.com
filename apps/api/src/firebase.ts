import { initializeApp, cert, getApps, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { config } from './config.js';
import { logger } from './logger.js';

let app: App | null = null;

export function getFirebaseApp(): App | null {
  if (app !== null) {
    return app;
  }

  if (
    config.FIREBASE_PROJECT_ID === undefined ||
    config.FIREBASE_CLIENT_EMAIL === undefined ||
    config.FIREBASE_PRIVATE_KEY === undefined
  ) {
    logger.warn('Firebase Admin credentials missing. Read endpoints may use synthetic fallback data; write endpoints are unavailable.');
    return null;
  }

  const existing = getApps()[0];
  if (existing !== undefined) {
    app = existing;
    return app;
  }

  app = initializeApp({
    credential: cert({
      projectId: config.FIREBASE_PROJECT_ID,
      clientEmail: config.FIREBASE_CLIENT_EMAIL,
      privateKey: config.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    })
  });

  return app;
}

export function getFirestoreDb() {
  const firebaseApp = getFirebaseApp();
  if (firebaseApp === null) {
    return null;
  }

  return getFirestore(firebaseApp);
}

export class IdentityVerificationUnavailableError extends Error {
  constructor() {
    super('Firebase identity verification is unavailable.');
    this.name = 'IdentityVerificationUnavailableError';
  }
}

export class InvalidIdentityTokenError extends Error {
  constructor() {
    super('The Firebase identity token is invalid.');
    this.name = 'InvalidIdentityTokenError';
  }
}

const invalidTokenCodes = new Set([
  'auth/argument-error',
  'auth/id-token-expired',
  'auth/id-token-revoked',
  'auth/invalid-id-token',
  'auth/user-disabled'
]);

export async function verifyFirebaseIdentity(idToken: string) {
  const firebaseApp = getFirebaseApp();
  if (firebaseApp === null) throw new IdentityVerificationUnavailableError();

  try {
    const decoded = await getAuth(firebaseApp).verifyIdToken(idToken, true);
    return { signInProvider: decoded.firebase.sign_in_provider };
  } catch (error) {
    const code = typeof error === 'object' && error !== null && 'code' in error
      ? String(error.code)
      : '';
    if (invalidTokenCodes.has(code)) throw new InvalidIdentityTokenError();
    throw new IdentityVerificationUnavailableError();
  }
}
