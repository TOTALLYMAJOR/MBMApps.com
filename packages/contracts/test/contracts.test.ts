import { describe, expect, it } from 'vitest';
import {
  contactSubmissionSchema,
  demoMetricSchema,
  pipelineSnapshotSchema,
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
      source: 'test-suite'
    });

    expect(parsed.company).toBe('MBM Foods');
  });
});
