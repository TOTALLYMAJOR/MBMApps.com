import {
  championProfileSchema,
  championScoreSchema,
  deriveChampionProfile,
  deriveChampionScore,
  operationalOutcomeSnapshotSchema,
  type ChatLeadSubmission,
  type ContactSubmission,
  type ChampionCohort,
  type DemoMetric,
  type EventTelemetryPayload,
  type OperationalOutcomeSnapshot,
  type PipelineSnapshot,
  syntheticChampionCohorts,
  syntheticMetrics,
  syntheticOperationalOutcomes,
  syntheticPipeline
} from '@mbm/contracts';
import { randomUUID } from 'node:crypto';
import { Timestamp } from 'firebase-admin/firestore';
import { getFirestoreDb } from './firebase.js';

export class LeadPersistenceUnavailableError extends Error {
  constructor(message = 'Lead persistence is unavailable.', options?: ErrorOptions) {
    super(message, options);
    this.name = 'LeadPersistenceUnavailableError';
  }
}

type LeadPersistenceDb = {
  collection: (name: string) => {
    doc: (id: string) => {
      set: (record: Record<string, unknown>) => Promise<unknown>;
    };
  };
};

export async function persistLead(
  collection: string,
  id: string,
  record: Record<string, unknown>,
  db: LeadPersistenceDb | null = getFirestoreDb()
) {
  if (db === null) {
    throw new LeadPersistenceUnavailableError();
  }

  try {
    await db.collection(collection).doc(id).set(record);
  } catch (error) {
    throw new LeadPersistenceUnavailableError('Lead persistence failed.', { cause: error });
  }
}

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

export async function loadOperationalOutcomes(): Promise<OperationalOutcomeSnapshot> {
  const db = getFirestoreDb();
  if (db === null) {
    return syntheticOperationalOutcomes;
  }

  const doc = await db.collection('operationalOutcomeSnapshots').doc('latest').get();
  if (!doc.exists) {
    return syntheticOperationalOutcomes;
  }

  return operationalOutcomeSnapshotSchema.parse(doc.data());
}

export function buildContactRecord(submission: ContactSubmission, createdAt: Timestamp = Timestamp.now()) {
  const championProfile = deriveChampionProfile(submission);
  const championScore = deriveChampionScore(submission);

  return {
    ...submission,
    schemaVersion: 1,
    createdAt,
    status: 'new',
    lifecycleStatus: 'new',
    lifecycle: {
      status: 'new',
      updatedAt: createdAt,
      lossReason: null,
      measuredOutcome: null
    },
    championProfile,
    championScore,
    dataQuality: {
      piiBoundary: 'contact-submission',
      retentionPolicy: 'sales-intelligence-24-months',
      sourceSchemaVersion: 1
    }
  };
}

export async function storeContact(submission: ContactSubmission): Promise<string> {
  const id = `contact_${randomUUID()}`;
  await persistLead('contactSubmissions', id, buildContactRecord(submission));

  return id;
}

export function buildChatLeadRecord(submission: ChatLeadSubmission, createdAt: Timestamp = Timestamp.now()) {
  return {
    ...submission,
    schemaVersion: 1,
    channel: 'guided-chat',
    createdAt,
    status: 'new',
    lifecycleStatus: 'new',
    lifecycle: {
      status: 'new',
      updatedAt: createdAt,
      lossReason: null,
      measuredOutcome: null
    },
    dataQuality: {
      piiBoundary: 'guided-chat-lead',
      retentionPolicy: 'sales-intelligence-24-months',
      sourceSchemaVersion: 1
    }
  };
}

export async function storeChatLead(submission: ChatLeadSubmission): Promise<string> {
  const id = `chat_${randomUUID()}`;
  await persistLead('leadSubmissions', id, buildChatLeadRecord(submission));

  return id;
}

export function buildTelemetryRecord(event: EventTelemetryPayload, createdAt: Timestamp = Timestamp.now()) {
  return {
    ...event,
    createdAt,
    dataQuality: {
      sourceSchemaVersion: event.schemaVersion,
      piiBoundary: event.userId ? 'pseudonymous-user-event' : 'anonymous-event',
      retentionPolicy: 'behavioral-telemetry-13-months',
      botSignal: event.context.deviceClass === 'bot'
    }
  };
}

export async function storeTelemetry(event: EventTelemetryPayload): Promise<void> {
  const db = getFirestoreDb();
  if (db === null) {
    return;
  }

  await db.collection('telemetryEvents').add(buildTelemetryRecord(event));
}

export async function loadChampionCohorts(): Promise<ChampionCohort[]> {
  const db = getFirestoreDb();
  if (db === null) {
    return syntheticChampionCohorts;
  }

  const snapshot = await db.collection('contactSubmissions').orderBy('createdAt', 'desc').limit(250).get();
  if (snapshot.empty) {
    return syntheticChampionCohorts;
  }

  const buckets = new Map<
    string,
    {
      label: string;
      count: number;
      scoreTotal: number;
      wonCount: number;
      revenueTotal: number;
      signals: Map<string, number>;
    }
  >();

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const profileResult = championProfileSchema.safeParse(data.championProfile);
    const scoreResult = championScoreSchema.safeParse(data.championScore);

    if (!profileResult.success || !scoreResult.success) {
      continue;
    }

    const profile = profileResult.data;
    const score = scoreResult.data;
    const id = `${profile.primaryBusinessPain}-${profile.serviceCategory}`;
    const label = `${profile.primaryBusinessPain.replace(/-/g, ' ')} / ${profile.serviceCategory.replace(/-/g, ' ')}`;
    const bucket =
      buckets.get(id) ??
      {
        label,
        count: 0,
        scoreTotal: 0,
        wonCount: 0,
        revenueTotal: 0,
        signals: new Map<string, number>()
      };

    bucket.count += 1;
    bucket.scoreTotal += score.total;
    if (data.lifecycleStatus === 'closed_won' || data.status === 'closed_won') {
      bucket.wonCount += 1;
    }
    if (typeof data.revenueInfluenced === 'number') {
      bucket.revenueTotal += data.revenueInfluenced;
    }

    for (const reason of score.reasons) {
      bucket.signals.set(reason, (bucket.signals.get(reason) ?? 0) + 1);
    }

    buckets.set(id, bucket);
  }

  const generatedAt = new Date().toISOString();
  const cohorts = Array.from(buckets.entries()).map(([id, bucket]) => ({
    id,
    label: bucket.label,
    count: bucket.count,
    averageScore: Math.round(bucket.scoreTotal / Math.max(bucket.count, 1)),
    primarySignals: Array.from(bucket.signals.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([signal]) => signal),
    conversionRate: Math.round((bucket.wonCount / Math.max(bucket.count, 1)) * 100),
    averageRevenueInfluenced: Math.round(bucket.revenueTotal / Math.max(bucket.count, 1)),
    generatedAt
  }));

  return cohorts.length > 0 ? cohorts : syntheticChampionCohorts;
}
