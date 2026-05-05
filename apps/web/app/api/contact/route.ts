import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { contactSubmissionSchema, type EventTelemetryPayload } from '@mbm/contracts';
import { z } from 'zod';

const requestSchema = contactSubmissionSchema.extend({
  startedAt: z.number().int().optional().default(0)
});

function backendBaseUrl() {
  return process.env.BACKEND_API_URL ?? 'http://localhost:4000';
}

type TelemetryMetadata = Record<string, string | number | boolean | null>;

async function forwardTelemetry(event: EventTelemetryPayload['event'], metadata: TelemetryMetadata = {}) {
  const body = {
    schemaVersion: 1,
    event,
    path: '/contact',
    at: new Date().toISOString(),
    source: 'server',
    metadata: {
      source: 'next-api-contact',
      ...metadata
    }
  };

  try {
    await fetch(`${backendBaseUrl()}/v1/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store'
    });
  } catch {
    // Telemetry failures should not block lead submission UX.
  }
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: 'Invalid request payload.' }, { status: 400 });
  }

  const { startedAt, ...submission } = parsed.data;
  const elapsed = Date.now() - startedAt;

  if (submission.website.trim().length > 0 || elapsed < 1500) {
    void forwardTelemetry('contact_filtered', {
      filter_reason: submission.website.trim().length > 0 ? 'honeypot' : 'elapsed_under_threshold',
      elapsed_ms: elapsed
    });

    return NextResponse.json({
      ok: true,
      submissionId: `filtered_${randomUUID()}`,
      queued: true
    });
  }

  try {
    const response = await fetch(`${backendBaseUrl()}/v1/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store',
      body: JSON.stringify(submission)
    });

    if (!response.ok) {
      throw new Error(`Backend failed: ${response.status}`);
    }

    void forwardTelemetry('contact_submitted', {
      budget: submission.budget,
      timeline: submission.timeline,
      decision_role: submission.decisionRole,
      service_category: submission.serviceCategory,
      primary_business_pain: submission.primaryBusinessPain
    });
    const result = (await response.json()) as unknown;
    return NextResponse.json(result, { status: 200 });
  } catch {
    void forwardTelemetry('contact_queued', {
      queue_reason: 'backend_unavailable',
      budget: submission.budget,
      timeline: submission.timeline
    });

    return NextResponse.json(
      {
        ok: true,
        submissionId: `queued_${randomUUID()}`,
        queued: true,
        message: 'Submission queued while we reconnect services. We will follow up at the email provided.'
      },
      { status: 200 }
    );
  }
}
