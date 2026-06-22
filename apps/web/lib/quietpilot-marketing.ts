export type QuietPilotWorkflowStepId =
  | 'lead-intake'
  | 'inventory-cogs'
  | 'quote-versioning'
  | 'approval'
  | 'proposal-acceptance'
  | 'payment-gate'
  | 'job-creation'
  | 'downstream-sync';

export type QuietPilotWorkflowStep = {
  id: QuietPilotWorkflowStepId;
  label: string;
  summary: string;
  signal: string;
};

export const quietPilotWorkflowSteps = [
  {
    id: 'lead-intake',
    label: 'Lead Intake',
    summary: 'Capture service inquiries with enough context for fast qualification.',
    signal: 'New demand enters the operator queue.'
  },
  {
    id: 'inventory-cogs',
    label: 'Inventory & COGS',
    summary: 'Keep package pricing grounded in real materials, capacity, and cost assumptions.',
    signal: 'Commercial risk is visible before quoting.'
  },
  {
    id: 'quote-versioning',
    label: 'Quote Versioning',
    summary: 'Create immutable quote snapshots as pricing moves through review and proposal.',
    signal: 'Historical pricing stays auditable.'
  },
  {
    id: 'approval',
    label: 'Approval',
    summary: 'Route discounts, exceptions, and margin pressure through explicit operator review.',
    signal: 'Owners see overrides before they become promises.'
  },
  {
    id: 'proposal-acceptance',
    label: 'Proposal Acceptance',
    summary: 'Bind customer acceptance to the exact proposal, quote version, and terms state.',
    signal: 'The commercial record is clear.'
  },
  {
    id: 'payment-gate',
    label: 'Payment Gate',
    summary: 'Prevent fulfillment from advancing until required deposits or invoices are settled.',
    signal: 'Operations do not outrun cash collection.'
  },
  {
    id: 'job-creation',
    label: 'Job Creation',
    summary: 'Turn accepted work into operational records with staffing and readiness context.',
    signal: 'The team knows what must happen next.'
  },
  {
    id: 'downstream-sync',
    label: 'Downstream Sync',
    summary: 'Send the right accounting, CRM, and operations updates after the source of truth changes.',
    signal: 'Integrations follow the workflow instead of driving it.'
  }
] as const satisfies readonly QuietPilotWorkflowStep[];

export type QuietPilotTopologyStep = {
  id: string;
  label: string;
  progress: number;
  copy: string;
};

export const quietPilotTopologySequence = [
  {
    id: 'heuristic-analysis',
    label: 'Heuristic Analysis',
    progress: 20,
    copy:
      'Read the demand signal, business constraints, and operator workload before the system commits to a workflow path.'
  },
  {
    id: 'topology-design',
    label: 'Topology Design',
    progress: 40,
    copy:
      'Map service boundaries, tenant context, proposal state, payment gates, and downstream integration channels.'
  },
  {
    id: 'neural-synthesis',
    label: 'Neural Synthesis',
    progress: 60,
    copy:
      'Blend assistive recommendations with deterministic controls so AI can advise without owning commercial state.'
  },
  {
    id: 'stateful-execution',
    label: 'Stateful Execution',
    progress: 80,
    copy:
      'Advance work through observable checkpoints, immutable snapshots, retries, and explicit operator decisions.'
  },
  {
    id: 'edge-distribution',
    label: 'Edge Distribution',
    progress: 100,
    copy:
      'Project the right signal to customer portals, worker queues, payment flows, and integration adapters.'
  }
] as const satisfies readonly QuietPilotTopologyStep[];

export const quietPilotArchitectureIntro = {
  title: 'Architecture Topology',
  eyebrow: 'Sequence Alpha // Echo',
  summary:
    'A visual model of the QuietPilot operating topology: workflow state, commercial controls, and downstream readiness moving through one service-business engine.'
} as const;
