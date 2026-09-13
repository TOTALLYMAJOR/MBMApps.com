import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Timestamp } from 'firebase-admin/firestore';
import { chatLeadSubmissionSchema, contactSubmissionSchema, eventTelemetrySchema } from '@mbm/contracts';
import { createApp } from '../src/app.js';
import {
  buildChatLeadRecord,
  buildContactRecord,
  buildTelemetryRecord,
  LeadPersistenceUnavailableError,
  persistLead
} from '../src/repository.js';

const storeContact = vi.fn(async () => 'contact_test');
const storeChatLead = vi.fn(async () => 'chat_test');
const app = createApp({ leadRepository: { storeContact, storeChatLead } });

const enrichedContactPayload = {
  name: 'Jordan Lee',
  email: 'jordan@mbmapps.com',
  company: 'Northline Kitchens',
  message: 'We need a platform to automate quoting and measure conversion by segment.',
  budget: '25k-75k',
  timeline: '30-days',
  source: 'integration-test',
  website: '',
  decisionRole: 'operations-leader',
  industry: 'Food Services',
  companySize: '51-200',
  locationCount: 14,
  teamSize: 42,
  monthlyQuoteVolume: 80,
  serviceCategory: 'food-services',
  currentTools: ['HubSpot', 'Google Sheets'],
  currentCrmOrOpsSystem: 'HubSpot',
  operationalMaturity: 'spreadsheet-led',
  primaryBusinessPain: 'quote-speed',
  topConstraint: 'team-capacity',
  consent: {
    dataProcessingAccepted: true,
    marketingOptIn: true,
    acceptedAt: new Date().toISOString()
  }
};

describe('MBM API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('serves health check', async () => {
    const response = await request(app).get('/healthz');

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
  });

  it('returns demo metrics', async () => {
    const response = await request(app).get('/v1/demo/metrics');

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(Array.isArray(response.body.metrics)).toBe(true);
  });

  it('returns operational outcomes', async () => {
    const response = await request(app).get('/v1/demo/outcomes');

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.outcomes.revenueInfluenced).toBeGreaterThan(0);
  });

  it('returns champion cohorts', async () => {
    const response = await request(app).get('/v1/champion/cohorts');

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(Array.isArray(response.body.cohorts)).toBe(true);
  });

  it('rejects invalid contact payloads', async () => {
    const response = await request(app).post('/v1/contact').send({ name: 'A' });

    expect(response.status).toBe(400);
    expect(response.body.code).toBe('VALIDATION_ERROR');
  });

  it('accepts valid contact payload', async () => {
    const response = await request(app).post('/v1/contact').send(enrichedContactPayload);

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.state).toBe('persisted');
    expect(storeContact).toHaveBeenCalled();
  });

  it('persists guided-chat leads through the same intake seam', async () => {
    const response = await request(app).post('/v1/chat').send({
      replyTo: 'visitor@example.com',
      transcript: 'Visitor: We need a workflow review with durable delivery evidence.',
      consent: {
        dataProcessingAccepted: true,
        marketingOptIn: false,
        acceptedAt: new Date().toISOString(),
        policyVersion: '2026-05-05'
      }
    });

    expect(response.status).toBe(200);
    expect(response.body.state).toBe('persisted');
    expect(storeChatLead).toHaveBeenCalled();
  });

  it('reports persistence outages instead of accepting a lead', async () => {
    const unavailableApp = createApp({
      leadRepository: {
        storeContact: async () => { throw new LeadPersistenceUnavailableError(); },
        storeChatLead: async () => { throw new LeadPersistenceUnavailableError(); }
      }
    });
    const response = await request(unavailableApp).post('/v1/contact').send(enrichedContactPayload);

    expect(response.status).toBe(503);
    expect(response.body.ok).toBe(false);
    expect(response.body.code).toBe('LEAD_PERSISTENCE_UNAVAILABLE');
  });

  it('reports chat persistence outages instead of accepting a lead', async () => {
    const unavailableApp = createApp({
      leadRepository: {
        storeContact: async () => { throw new LeadPersistenceUnavailableError(); },
        storeChatLead: async () => { throw new LeadPersistenceUnavailableError(); }
      }
    });
    const response = await request(unavailableApp).post('/v1/chat').send({
      replyTo: 'visitor@example.com',
      transcript: 'Visitor: We need a workflow review with durable delivery evidence.',
      consent: {
        dataProcessingAccepted: true,
        acceptedAt: new Date().toISOString()
      }
    });

    expect(response.status).toBe(503);
    expect(response.body.code).toBe('LEAD_PERSISTENCE_UNAVAILABLE');
  });

  it('filters honeypots without persisting them', async () => {
    const response = await request(app).post('/v1/chat').send({
      replyTo: 'visitor@example.com',
      transcript: 'Visitor: We need a workflow review with durable delivery evidence.',
      website: 'https://spam.example',
      consent: {
        dataProcessingAccepted: true,
        acceptedAt: new Date().toISOString()
      }
    });

    expect(response.status).toBe(200);
    expect(response.body.state).toBe('filtered');
    expect(storeChatLead).not.toHaveBeenCalled();
  });

  it('fails closed when lead persistence is missing or rejects a write', async () => {
    await expect(persistLead('leadSubmissions', 'chat_test', {}, null)).rejects.toBeInstanceOf(LeadPersistenceUnavailableError);

    const rejectingDb = {
      collection: () => ({
        doc: () => ({
          set: async () => { throw new Error('Firestore unavailable'); }
        })
      })
    };
    await expect(persistLead('leadSubmissions', 'chat_test', {}, rejectingDb)).rejects.toBeInstanceOf(LeadPersistenceUnavailableError);
  });

  it('accepts telemetry payloads', async () => {
    const response = await request(app).post('/v1/events').send({
      event: 'web_vital',
      path: '/demo',
      at: new Date().toISOString(),
      context: {
        sessionId: 'session_api_test',
        anonymousId: 'anon_api_test',
        routeSource: '/demo',
        deviceClass: 'desktop'
      },
      metadata: {
        metric: 'LCP',
        value: 2043
      }
    });

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
  });

  it('builds enriched contact records with champion intelligence fields', () => {
    const submission = contactSubmissionSchema.parse(enrichedContactPayload);
    const record = buildContactRecord(submission, Timestamp.fromDate(new Date('2026-05-04T12:00:00.000Z')));

    expect(record.lifecycleStatus).toBe('new');
    expect(record.championProfile.primaryBusinessPain).toBe('quote-speed');
    expect(record.championScore.total).toBeGreaterThan(60);
    expect(record.dataQuality.retentionPolicy).toBe('sales-intelligence-24-months');
  });

  it('builds governed chat lead records without polluting champion cohorts', () => {
    const submission = chatLeadSubmissionSchema.parse({
      replyTo: 'visitor@example.com',
      transcript: 'Visitor: We need a workflow review with durable delivery evidence.',
      consent: {
        dataProcessingAccepted: true,
        acceptedAt: new Date().toISOString()
      }
    });
    const record = buildChatLeadRecord(submission, Timestamp.fromDate(new Date('2026-09-13T12:00:00.000Z')));

    expect(record.channel).toBe('guided-chat');
    expect(record.lifecycleStatus).toBe('new');
    expect(record.dataQuality.piiBoundary).toBe('guided-chat-lead');
  });

  it('builds telemetry records with governance metadata', () => {
    const payload = eventTelemetrySchema.parse({
      event: 'quietpilot_opened',
      path: '/quietpilot',
      at: new Date().toISOString(),
      context: {
        sessionId: 'session_api_test',
        anonymousId: 'anon_api_test',
        deviceClass: 'desktop'
      },
      metadata: {
        surface: 'site-header'
      }
    });
    const record = buildTelemetryRecord(payload, Timestamp.fromDate(new Date('2026-05-04T12:00:00.000Z')));

    expect(record.schemaVersion).toBe(1);
    expect(record.dataQuality.piiBoundary).toBe('anonymous-event');
    expect(record.dataQuality.retentionPolicy).toBe('behavioral-telemetry-13-months');
  });
});
