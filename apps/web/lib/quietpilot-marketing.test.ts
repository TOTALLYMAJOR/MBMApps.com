import { describe, expect, it } from 'vitest';
import { quietPilotTopologySequence, quietPilotWorkflowSteps } from '@/lib/quietpilot-marketing';

describe('quietpilot marketing content', () => {
  it('contains the required workflow architecture steps in order', () => {
    expect(quietPilotWorkflowSteps.map((step) => step.label)).toEqual([
      'Lead Intake',
      'Inventory & COGS',
      'Quote Versioning',
      'Approval',
      'Proposal Acceptance',
      'Payment Gate',
      'Job Creation',
      'Downstream Sync'
    ]);
  });

  it('contains the topology sequence labels and valid progress values', () => {
    expect(quietPilotTopologySequence.map((step) => step.label)).toEqual([
      'Heuristic Analysis',
      'Topology Design',
      'Neural Synthesis',
      'Stateful Execution',
      'Edge Distribution'
    ]);

    for (const step of quietPilotTopologySequence) {
      expect(step.progress).toBeGreaterThan(0);
      expect(step.progress).toBeLessThanOrEqual(100);
      expect(step.copy.length).toBeGreaterThan(40);
    }
  });
});
