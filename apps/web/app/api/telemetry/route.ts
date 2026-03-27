import { NextResponse } from 'next/server';
import { eventTelemetrySchema } from '@mbm/contracts';

function backendBaseUrl() {
  return process.env.BACKEND_API_URL ?? 'http://localhost:4000';
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = eventTelemetrySchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    await fetch(`${backendBaseUrl()}/v1/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(parsed.data),
      cache: 'no-store'
    });
  } catch {
    // Intentionally soft-fail: telemetry should not break UX flows.
  }

  return NextResponse.json({ ok: true });
}
