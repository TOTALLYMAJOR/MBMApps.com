import { cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const APP_NAME = 'mbmapps-web-site-gate';

let app: App | null = null;

function getFirebaseApp(): App | null {
  if (app !== null) return app;

  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n').trim();
  if (!projectId || !clientEmail || !privateKey) return null;

  const existing = getApps().find((candidate) => candidate.name === APP_NAME);
  app = existing ?? initializeApp({
    credential: cert({ projectId, clientEmail, privateKey })
  }, APP_NAME);

  return app;
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
  try {
    const firebaseApp = getFirebaseApp();
    if (firebaseApp === null) throw new IdentityVerificationUnavailableError();

    const decoded = await getAuth(firebaseApp).verifyIdToken(idToken, true);
    return { signInProvider: decoded.firebase.sign_in_provider };
  } catch (error) {
    if (error instanceof IdentityVerificationUnavailableError) throw error;

    const code = typeof error === 'object' && error !== null && 'code' in error
      ? String(error.code)
      : '';
    if (invalidTokenCodes.has(code)) throw new InvalidIdentityTokenError();
    throw new IdentityVerificationUnavailableError();
  }
}
