import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { currentConsentPolicyVersion } from '@mbm/contracts';
import { POST } from '@/app/api/chat/route';

const originalEnv = { ...process.env };

const validPayload = {
  replyTo: 'visitor@example.com',
  transcript: 'Visitor: We need a durable operations workflow review.',
  source: 'mbmapps-guided-chat',
  website: '',
  consent: {
    dataProcessingAccepted: true,
    marketingOptIn: false,
    acceptedAt: '2026-09-13T12:00:00.000Z',
    policyVersion: currentConsentPolicyVersion
  }
};

function makeRequest(payload: unknown) {
  return new Request('https://mbmapps.com/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'https://mbmapps.com' },
    body: JSON.stringify(payload)
  });
}

function persistenceReceipt() {
  return {
    ok: true,
    submissionId: 'chat_test',
    receivedAt: '2026-09-13T12:00:01.000Z',
    state: 'persisted'
  };
}

describe('chat intake route', () => {
  beforeEach(() => {
    process.env = { ...originalEnv, BACKEND_API_URL: 'https://api.example.com' };
    delete process.env.RESEND_API_KEY;
    delete process.env.RESEND_FROM_EMAIL;
    delete process.env.CHAT_FORWARD_TO;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.unstubAllGlobals();
  });

  it('does not notify the provider when persistence fails', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 429 }));
    vi.stubGlobal('fetch', fetchMock);

    const response = await POST(makeRequest(validPayload));

    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ ok: false });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('rejects a malformed persistence receipt', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const response = await POST(makeRequest(validPayload));

    expect(response.status).toBe(503);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('keeps a persisted lead successful when notification is unavailable', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify(persistenceReceipt()), { status: 200 })
    );
    vi.stubGlobal('fetch', fetchMock);

    const response = await POST(makeRequest(validPayload));

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ state: 'persisted', notification: 'unavailable' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('keeps a persisted lead successful when provider delivery fails', async () => {
    process.env.RESEND_API_KEY = 'test-key';
    process.env.RESEND_FROM_EMAIL = 'MBMApps <website@example.com>';
    process.env.CHAT_FORWARD_TO = 'studio@example.com';
    const fetchMock = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(new Response(JSON.stringify(persistenceReceipt()), { status: 200 }))
      .mockResolvedValueOnce(new Response(null, { status: 503 }));
    vi.stubGlobal('fetch', fetchMock);

    const response = await POST(makeRequest(validPayload));

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ state: 'persisted', notification: 'failed' });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('reports provider acceptance after persistence', async () => {
    process.env.RESEND_API_KEY = 'test-key';
    process.env.RESEND_FROM_EMAIL = 'MBMApps <website@example.com>';
    process.env.CHAT_FORWARD_TO = 'studio@example.com';
    const fetchMock = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(new Response(JSON.stringify(persistenceReceipt()), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: 'email_test' }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const response = await POST(makeRequest(validPayload));

    expect(await response.json()).toMatchObject({ state: 'persisted', notification: 'provider-accepted' });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('filters honeypot submissions without persistence or provider calls', async () => {
    const fetchMock = vi.fn<typeof fetch>();
    vi.stubGlobal('fetch', fetchMock);

    const response = await POST(makeRequest({ ...validPayload, website: 'https://spam.example' }));

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ state: 'filtered' });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
