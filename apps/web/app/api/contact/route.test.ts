import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { currentConsentPolicyVersion } from '@mbm/contracts';
import { POST } from '@/app/api/contact/route';

const originalEnv = { ...process.env };

const validPayload = {
  name: 'Avery Morgan',
  email: 'avery@example.com',
  company: 'Northline Foods',
  website: '',
  message: 'We need a durable workflow for quotes and job readiness.',
  budget: '25k-75k',
  timeline: '30-days',
  source: 'mbmapps-contact-form',
  decisionRole: 'operations-leader',
  industry: 'Food Services',
  companySize: '51-200',
  locationCount: 14,
  serviceCategory: 'food-services',
  currentTools: ['HubSpot'],
  currentCrmOrOpsSystem: 'HubSpot',
  operationalMaturity: 'spreadsheet-led',
  primaryBusinessPain: 'quote-speed',
  topConstraint: 'team-capacity',
  consent: {
    dataProcessingAccepted: true,
    marketingOptIn: false,
    acceptedAt: '2026-09-13T12:00:00.000Z',
    policyVersion: currentConsentPolicyVersion
  }
};

function makeRequest(payload: unknown) {
  return new Request('https://mbmapps.com/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'https://mbmapps.com' },
    body: JSON.stringify(payload)
  });
}

describe('contact intake route', () => {
  beforeEach(() => {
    process.env = { ...originalEnv, BACKEND_API_URL: 'https://api.example.com' };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.unstubAllGlobals();
  });

  it('returns a persisted receipt only after the backend confirms it', async () => {
    const receipt = {
      ok: true,
      submissionId: 'contact_test',
      receivedAt: '2026-09-13T12:00:01.000Z',
      state: 'persisted'
    };
    const fetchMock = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(new Response(JSON.stringify(receipt), { status: 200 }))
      .mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const response = await POST(makeRequest(validPayload));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(receipt);
  });

  it('does not claim a queue when persistence fails', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 503 }));
    vi.stubGlobal('fetch', fetchMock);

    const response = await POST(makeRequest(validPayload));
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body).toMatchObject({ ok: false });
    expect(body).not.toHaveProperty('queued');
  });

  it('rejects malformed backend success bodies', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const response = await POST(makeRequest(validPayload));

    expect(response.status).toBe(503);
  });

  it('returns a filtered receipt for honeypots without calling the persistence route', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const response = await POST(makeRequest({ ...validPayload, website: 'https://spam.example' }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.state).toBe('filtered');
    expect(fetchMock.mock.calls.some(([url]) => String(url).endsWith('/v1/contact'))).toBe(false);
  });
});
