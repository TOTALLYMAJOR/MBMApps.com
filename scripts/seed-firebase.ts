import 'dotenv/config';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { syntheticMetrics, syntheticOperationalOutcomes, syntheticPipeline } from '@mbm/contracts';

function required(name: string) {
  const value = process.env[name];
  if (value === undefined || value.length === 0) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

async function main() {
  const projectId = required('FIREBASE_PROJECT_ID');
  const clientEmail = required('FIREBASE_CLIENT_EMAIL');
  const privateKey = required('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n');

  const app =
    getApps()[0] ??
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey
      })
    });

  const db = getFirestore(app);

  await Promise.all(
    syntheticMetrics.map((metric) => db.collection('demoMetrics').doc(metric.key).set(metric, { merge: true }))
  );

  await db.collection('demoPipeline').doc('latest').set({
    ...syntheticPipeline,
    generatedAt: new Date().toISOString()
  });

  await db.collection('operationalOutcomeSnapshots').doc('latest').set({
    ...syntheticOperationalOutcomes,
    capturedAt: new Date().toISOString()
  });

  console.log('Firebase seed complete.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
