import { describe, expect, it } from 'vitest';
import {
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
