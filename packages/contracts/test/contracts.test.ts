import { describe, expect, it } from 'vitest';
import {
  chatLeadDeliveryResponseSchema,
  chatLeadSubmissionSchema,
  championScoreSchema,
  contactSubmissionSchema,
  deriveChampionProfile,
  deriveChampionScore,
  demoMetricSchema,
  eventTelemetrySchema,
  operationalOutcomeSnapshotSchema,
  pipelineSnapshotSchema,
  syntheticOperationalOutcomes,
  syntheticMetrics,
  syntheticPipeline
} from '../src/index.js';

describe('contracts', () => {
  it('validates synthetic metrics', () => {
    for (const metric of syntheticMetrics) {
      expect(() => demoMetricSchema.parse(metric)).not.toThrow();
    }
  });

  it('validates synthetic pipeline snapshot', () => {
    expect(() => pipelineSnapshotSchema.parse(syntheticPipeline)).not.toThrow();
  });

  it('validates contact submissions', () => {
    const parsed = contactSubmissionSchema.parse({
      name: 'Morgan Blake',
      email: 'morgan@example.com',
      company: 'MBM Foods',
      message: 'We need quoting automation and client lifecycle dashboards for two regions.',
      budget: '25k-75k',
      timeline: 'quarter',
      source: 'test-suite',
      decisionRole: 'operations-leader',
      industry: 'Food Services',
      companySize: '51-200',
      locationCount: 14,
      teamSize: 48,
      monthlyQuoteVolume: 90,
      serviceCategory: 'food-services',
      currentTools: ['HubSpot', 'Sheets'],
      currentCrmOrOpsSystem: 'HubSpot',
      operationalMaturity: 'spreadsheet-led',
      primaryBusinessPain: 'conversion-visibility',
      topConstraint: 'data-quality',
      consent: {
        dataProcessingAccepted: true,
        marketingOptIn: false,
        acceptedAt: new Date().toISOString()
      }
    });

    expect(parsed.company).toBe('MBM Foods');
    expect(parsed.locationCount).toBe(14);
    expect(parsed.currentTools).toContain('HubSpot');
  });

  it('requires governed consent for guided-chat leads', () => {
    const acceptedAt = new Date().toISOString();
    const parsed = chatLeadSubmissionSchema.parse({
      replyTo: 'visitor@example.com',
      transcript: 'Visitor: We need a workflow review with delivery evidence.',
      consent: {
        dataProcessingAccepted: true,
        acceptedAt
      }
    });

    expect(parsed.source).toBe('mbmapps-guided-chat');
    expect(parsed.consent.acceptedAt).toBe(acceptedAt);
    expect(parsed.consent.policyVersion).toBe('2026-05-05');
    expect(chatLeadSubmissionSchema.safeParse({
      ...parsed,
      consent: { ...parsed.consent, dataProcessingAccepted: false }
    }).success).toBe(false);
  });

  it('separates persistence evidence from provider notification state', () => {
    expect(chatLeadDeliveryResponseSchema.parse({
      ok: true,
      submissionId: 'chat_123',
      receivedAt: new Date().toISOString(),
      state: 'persisted',
      notification: 'unavailable',
      message: 'Transcript saved.'
    }).notification).toBe('unavailable');
    expect(eventTelemetrySchema.safeParse({
      event: 'contact_queued',
      path: '/contact',
      at: new Date().toISOString()
    }).success).toBe(false);
  });

  it('derives champion profile and score from enriched submissions', () => {
    const submission = contactSubmissionSchema.parse({
      name: 'Morgan Blake',
      email: 'morgan@example.com',
      company: 'MBM Foods',
      message: 'We need quoting automation and client lifecycle dashboards for two regions.',
      budget: '75k-plus',
      timeline: '30-days',
      source: 'test-suite',
      decisionRole: 'operations-leader',
      industry: 'Food Services',
      companySize: '51-200',
      locationCount: 14,
      teamSize: 48,
      monthlyQuoteVolume: 90,
      serviceCategory: 'food-services',
      currentTools: ['HubSpot', 'Sheets'],
      currentCrmOrOpsSystem: 'HubSpot',
      operationalMaturity: 'spreadsheet-led',
      primaryBusinessPain: 'quote-speed',
      topConstraint: 'team-capacity'
    });

    const profile = deriveChampionProfile(submission);
    const score = deriveChampionScore(submission);

    expect(profile.primaryBusinessPain).toBe('quote-speed');
    expect(() => championScoreSchema.parse(score)).not.toThrow();
    expect(score.total).toBeGreaterThan(70);
    expect(score.reasons.length).toBeGreaterThan(0);
  });

  it('validates expanded telemetry with attribution context', () => {
    const parsed = eventTelemetrySchema.parse({
      event: 'demo_stage_selected',
      path: '/demo',
      at: new Date().toISOString(),
      context: {
        sessionId: 'session_test',
        anonymousId: 'anon_test',
        referrer: 'https://example.com',
        routeSource: '/demo',
        deviceClass: 'desktop',
        utm: {
          source: 'newsletter',
          campaign: 'champion'
        }
      },
      metadata: {
        stage_id: 'proposal',
        stage_value: 292000
      }
    });

    expect(parsed.schemaVersion).toBe(1);
    expect(parsed.context.utm.source).toBe('newsletter');
  });

  it('validates operational outcome snapshots', () => {
    expect(() => operationalOutcomeSnapshotSchema.parse(syntheticOperationalOutcomes)).not.toThrow();
  });
});
