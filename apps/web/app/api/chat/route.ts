import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import {
  chatLeadDeliveryResponseSchema,
  chatLeadSubmissionSchema,
  leadFilteredResponseSchema,
  leadPersistenceResponseSchema
} from '@mbm/contracts';
import { sendChatEmail } from '@/lib/chat-email';
import { backendBaseUrl, PublicIntakeRequestError, readPublicIntakePayload } from '@/lib/public-intake';
import { GATE_COOKIE_NAME, getGateConfiguration, readGateSession } from '@/lib/site-gate';

export const runtime = 'nodejs';

function requestError(error: PublicIntakeRequestError) {
  return NextResponse.json({ ok: false, message: error.message }, { status: error.status });
}

export async function POST(request: Request) {
  const configuration = getGateConfiguration();
  const token = request.headers.get('cookie')
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${GATE_COOKIE_NAME}=`))
    ?.slice(GATE_COOKIE_NAME.length + 1);
  const session = configuration.configured
    ? await readGateSession(token, configuration.secret)
    : null;
  if (session === null) {
    return NextResponse.json({ ok: false, message: 'A valid site session is required.' }, { status: 401 });
  }
  if (session.role !== 'member') {
    return NextResponse.json({ ok: false, message: 'Member access is required.' }, { status: 403 });
  }

  let payload: unknown;

  try {
    payload = await readPublicIntakePayload(request);
  } catch (error) {
    if (error instanceof PublicIntakeRequestError) return requestError(error);
    return NextResponse.json({ ok: false, message: 'Invalid request payload.' }, { status: 400 });
  }

  const parsed = chatLeadSubmissionSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: 'Enter a valid email, add a chat message, and accept the reply notice.' }, { status: 400 });
  }

  if (parsed.data.website.trim().length > 0) {
    return NextResponse.json(leadFilteredResponseSchema.parse({
      ok: true,
      submissionId: `filtered_${randomUUID()}`,
      receivedAt: new Date().toISOString(),
      state: 'filtered'
    }));
  }

  let persistence;
  try {
    const response = await fetch(`${backendBaseUrl()}/v1/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(parsed.data),
      cache: 'no-store'
    });
    const result = await response.json().catch(() => null);
    const receipt = leadPersistenceResponseSchema.safeParse(result);

    if (!response.ok || !receipt.success) {
      return NextResponse.json({
        ok: false,
        message: 'We could not save this transcript. Please try again or use the email-app handoff below.'
      }, { status: 503 });
    }

    persistence = receipt.data;
  } catch {
    return NextResponse.json({
      ok: false,
      message: 'We could not save this transcript. Please try again or use the email-app handoff below.'
    }, { status: 503 });
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail = process.env.RESEND_FROM_EMAIL?.trim();
  const toEmail = process.env.CHAT_FORWARD_TO?.trim();

  if (!apiKey || !fromEmail || !toEmail) {
    return NextResponse.json(chatLeadDeliveryResponseSchema.parse({
      ...persistence,
      notification: 'unavailable',
      message: 'Your transcript is saved. For the fastest response, open it in your email app below.'
    }));
  }

  try {
    await sendChatEmail(parsed.data, { apiKey, fromEmail, toEmail });
    return NextResponse.json(chatLeadDeliveryResponseSchema.parse({
      ...persistence,
      notification: 'provider-accepted',
      message: 'Your transcript is saved, and the email provider accepted the studio notification.'
    }));
  } catch {
    return NextResponse.json(chatLeadDeliveryResponseSchema.parse({
      ...persistence,
      notification: 'failed',
      message: 'Your transcript is saved, but the studio notification failed. Use the email-app handoff below for the fastest response.'
    }));
  }
}
