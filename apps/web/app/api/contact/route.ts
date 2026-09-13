import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import {
  contactResponseSchema,
  contactSubmissionSchema,
  leadFilteredResponseSchema,
  type EventTelemetryPayload
} from '@mbm/contracts';
import { backendBaseUrl, PublicIntakeRequestError, readPublicIntakePayload } from '@/lib/public-intake';

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
  let payload: unknown;

  try {
    payload = await readPublicIntakePayload(request);
  } catch (error) {
    if (error instanceof PublicIntakeRequestError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: error.status });
    }
    return NextResponse.json({ ok: false, message: 'Invalid request payload.' }, { status: 400 });
  }

  const parsed = contactSubmissionSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: 'Invalid request payload.' }, { status: 400 });
  }

  if (parsed.data.website.trim().length > 0) {
    void forwardTelemetry('contact_filtered', { filter_reason: 'honeypot' });

    return NextResponse.json(leadFilteredResponseSchema.parse({
      ok: true,
      submissionId: `filtered_${randomUUID()}`,
      receivedAt: new Date().toISOString(),
      state: 'filtered'
    }));
  }

  try {
    const response = await fetch(`${backendBaseUrl()}/v1/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify(parsed.data)
    });
    const result = await response.json().catch(() => null);
    const receipt = contactResponseSchema.safeParse(result);

    if (!response.ok || !receipt.success) {
      return NextResponse.json(
        { ok: false, message: 'We could not save this request. Please try again or use the direct email option.' },
        { status: 503 }
      );
    }

    void forwardTelemetry('contact_submitted', {
      budget: parsed.data.budget,
      timeline: parsed.data.timeline,
      decision_role: parsed.data.decisionRole,
      service_category: parsed.data.serviceCategory,
      primary_business_pain: parsed.data.primaryBusinessPain
    });
    return NextResponse.json(receipt.data);
  } catch {
    return NextResponse.json(
      { ok: false, message: 'We could not save this request. Please try again or use the direct email option.' },
      { status: 503 }
    );
  }
}
