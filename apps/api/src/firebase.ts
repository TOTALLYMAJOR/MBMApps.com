import { initializeApp, cert, getApps, type App } from 'firebase-admin/app';
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
