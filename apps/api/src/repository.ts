import {
  type ContactSubmission,
  type DemoMetric,
  type EventTelemetryPayload,
  type PipelineSnapshot,
  syntheticMetrics,
  syntheticPipeline
} from '@mbm/contracts';
import { randomUUID } from 'node:crypto';
import { Timestamp } from 'firebase-admin/firestore';
import { getFirestoreDb } from './firebase.js';

export async function loadMetrics(): Promise<DemoMetric[]> {
  const db = getFirestoreDb();
  if (db === null) {
    return syntheticMetrics;
  }

  const snapshot = await db.collection('demoMetrics').get();
  if (snapshot.empty) {
    return syntheticMetrics;
  }

  return snapshot.docs.map((doc) => doc.data() as DemoMetric);
}

export async function loadPipeline(): Promise<PipelineSnapshot> {
  const db = getFirestoreDb();
  if (db === null) {
    return syntheticPipeline;
  }

  const doc = await db.collection('demoPipeline').doc('latest').get();
  if (!doc.exists) {
    return syntheticPipeline;
  }

  return doc.data() as PipelineSnapshot;
}

export async function storeContact(submission: ContactSubmission): Promise<string> {
  const id = `contact_${randomUUID()}`;
  const db = getFirestoreDb();

  if (db === null) {
    return id;
  }

  await db.collection('contactSubmissions').doc(id).set({
    ...submission,
    createdAt: Timestamp.now(),
    status: 'new'
  });

  return id;
}

export async function storeTelemetry(event: EventTelemetryPayload): Promise<void> {
  const db = getFirestoreDb();
  if (db === null) {
    return;
  }

  await db.collection('telemetryEvents').add({
    ...event,
    createdAt: Timestamp.now()
  });
}
