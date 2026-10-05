export type ExperienceScene = 'decision' | 'portal' | 'theater' | 'comparison' | 'reveal';

export interface BudgetProjection {
  label: 'MINIMUM INTERVENTION' | 'CORE IMPLEMENTATION' | 'EXPANDED IMPLEMENTATION' | 'BROAD IMPLEMENTATION';
  files: number;
  estimatedLoc: number;
  transactions: string;
  architecture: string;
  included: readonly string[];
  deferred: readonly string[];
}

export interface SpecimenState {
  name: 'SABLEFIN';
  serial: 'SF-01';
  role: 'DECISION SPECIMEN';
  plates: number;
  branches: number;
  measurements: number;
  reach: number;
  architecturePreserved: boolean;
}

export interface RunEvent {
  time: string;
  stage: 'INTENT' | 'DISCOVER' | 'DECISION' | 'PLAN' | 'BOUND' | 'EXECUTE' | 'VERIFY' | 'RESULT';
  title: string;
  detail: string;
  surface: 'intent' | 'spine' | 'seam' | 'plates' | 'tail' | 'eye' | 'whole';
}

export interface BoundRun {
  result: 'VERIFIED' | 'VERIFIED WITH EVIDENCE GAP' | 'BOUNDED · INCOMPLETE';
  deliveredLoc: number;
  files: number;
  checks: string;
  evidenceGaps: number;
  variant: 'PRESERVED PATH' | 'OPEN PATH';
  summary: string;
  events: readonly RunEvent[];
}

export const heroCopy = {
  eyebrow: 'DEVELOPMENT DECISION INTELLIGENCE',
  primary: 'Your coding agent can show you one implementation.',
  payoff: 'WALE explores the other thousand.',
  support: 'Change the constraints. Change the instructions. Change the strategy. See what those decisions actually do to the outcome.',
  invitation: 'CHANGE ONE DECISION. WATCH THE FUTURE CHANGE.',
  boundary: 'ILLUSTRATIVE RUN · SAMPLE REPOSITORY'
} as const;

export const budgetAnchors = [1, 10, 100, 1_000, 10_000] as const;

export function budgetFromSlider(position: number) {
  const bounded = Math.max(0, Math.min(100, position));
  return Math.max(1, Math.min(10_000, Math.round(10 ** (bounded / 25))));
}

export function sliderFromBudget(budget: number) {
  const bounded = Math.max(1, Math.min(10_000, budget));
  return Math.log10(bounded) * 25;
}

export function budgetProjection(budget: number): BudgetProjection {
  const bounded = Math.max(1, Math.min(10_000, Math.round(budget)));
  if (bounded >= 5_000) {
    return {
      label: 'BROAD IMPLEMENTATION', files: 18, estimatedLoc: 4_300,
      transactions: 'HIGHER REVIEW BURDEN', architecture: 'ARCHITECTURE SURFACE +3',
      included: ['role model', 'route enforcement', 'core verification', 'management UI', 'migration support', 'extended audit history'],
      deferred: []
    };
  }
  if (bounded >= 2_000) {
    return {
      label: 'EXPANDED IMPLEMENTATION', files: 11, estimatedLoc: 1_760,
      transactions: '1 LARGE TRANSACTION', architecture: 'DEPENDENCY SURFACE +2',
      included: ['role model', 'route enforcement', 'core verification', 'management UI', 'migration support'],
      deferred: ['extended audit history']
    };
  }
  if (bounded >= 500) {
    return {
      label: 'CORE IMPLEMENTATION', files: 4, estimatedLoc: 420,
      transactions: '1 TRANSACTION', architecture: 'EXISTING ARCHITECTURE PRESERVED',
      included: ['role model', 'route enforcement', 'core verification'],
      deferred: ['management UI', 'broad migration', 'extended audit history']
    };
  }
  const files = Math.max(1, Math.min(3, Math.ceil(bounded / 150)));
  return {
    label: 'MINIMUM INTERVENTION', files, estimatedLoc: Math.max(1, Math.floor(bounded * 0.84)),
    transactions: '1 BOUNDED TRANSACTION', architecture: 'EXISTING PATH ONLY',
    included: bounded >= 100 ? ['role model', 'route enforcement'] : ['discovery and bounded change'],
    deferred: ['full verification surface', 'management UI', 'migration support']
  };
}

export function specimenForDecision(budget: number, architecturePreserved: boolean): SpecimenState {
  const scale = Math.max(0, Math.min(1, Math.log10(Math.max(1, budget)) / 4));
  return {
    name: 'SABLEFIN', serial: 'SF-01', role: 'DECISION SPECIMEN',
    plates: 3 + Math.round(scale * 6),
    branches: 1 + Math.round(scale * 3) + (architecturePreserved ? 0 : 3),
    measurements: 5 + Math.round(scale * 10) + (architecturePreserved ? 0 : 3),
    reach: Number((0.28 + scale * 0.5 + (architecturePreserved ? 0 : 0.16)).toFixed(2)),
    architecturePreserved
  };
}

export const evidenceEvents = [
  { time: '00:01.744', stage: 'FOCUS', message: 'leading constraint isolated' },
  { time: '00:01.886', stage: 'PLAN', message: 'minimum sufficient intervention prepared' },
  { time: '00:02.012', stage: 'VERIFY', message: 'required proof gates attached' },
  { time: '00:02.103', stage: 'BOUND', message: 'execution remains inside approved scope' },
  { time: '00:02.298', stage: 'READY', message: 'candidate prepared for execution' }
] as const;

export const runEvents: readonly RunEvent[] = [
  { time: '00:00', stage: 'INTENT', title: 'Add team permissions.', detail: 'Requirement REQ-04 registered.', surface: 'intent' },
  { time: '00:07', stage: 'DISCOVER', title: 'Existing authorization middleware found.', detail: 'Current spine is available for reuse.', surface: 'spine' },
  { time: '00:12', stage: 'DECISION', title: 'Reuse the current authorization path.', detail: 'Do not introduce a second permission system.', surface: 'seam' },
  { time: '00:21', stage: 'PLAN', title: '4 files · 418 LOC estimated · 1 transaction', detail: 'Plan remains inside the selected maximum.', surface: 'plates' },
  { time: 'BOUND RECEIPT', stage: 'BOUND', title: 'CONFIGURATION BOUND', detail: 'Selected maximum and architecture constraint locked before execution.', surface: 'spine' },
  { time: '00:34', stage: 'EXECUTE', title: '4 files changed · 437 eligible source LOC', detail: 'Changed surfaces remain traceable to REQ-04.', surface: 'tail' },
  { time: '00:48', stage: 'VERIFY', title: '26 / 26 required checks passed', detail: '0 unresolved evidence gaps.', surface: 'eye' },
  { time: '00:53', stage: 'RESULT', title: 'VERIFIED', detail: 'Result applies to this exact sample run.', surface: 'whole' }
];

function contextualEvents(run: Omit<BoundRun, 'events'>, selectedBudget: number): readonly RunEvent[] {
  const projected = budgetProjection(selectedBudget);
  const planEstimate = run.variant === 'PRESERVED PATH' && selectedBudget >= 437 ? 418 : projected.estimatedLoc;
  return runEvents.map((event) => {
    if (event.stage === 'PLAN') return { ...event, title: `${run.files} files · ${planEstimate} LOC estimated · 1 transaction` };
    if (event.stage === 'BOUND') return { ...event, detail: `${selectedBudget.toLocaleString()} eligible LOC maximum · ${run.variant}.` };
    if (event.stage === 'EXECUTE') return { ...event, title: `${run.files} files changed · ${run.deliveredLoc} eligible source LOC` };
    if (event.stage === 'VERIFY') return { ...event, title: `${run.checks} required checks passed`, detail: `${run.evidenceGaps} unresolved evidence gap${run.evidenceGaps === 1 ? '' : 's'}.` };
    if (event.stage === 'RESULT') return { ...event, title: run.result, detail: `${run.summary} Result applies to this exact sample run.` };
    if (event.stage === 'DECISION' && run.variant === 'OPEN PATH') return { ...event, title: 'Permit a secondary authorization abstraction.', detail: 'Architecture preservation was disabled for this bound run.' };
    return event;
  });
}

export function runForDecision(budget: number, architecturePreserved: boolean): BoundRun {
  const bounded = Math.max(1, Math.min(10_000, Math.round(budget)));
  if (bounded < 437) {
    const base = {
      result: 'BOUNDED · INCOMPLETE' as const,
      deliveredLoc: bounded,
      files: Math.max(1, Math.ceil(bounded / 130)),
      checks: '18 / 26', evidenceGaps: 1,
      variant: architecturePreserved ? 'PRESERVED PATH' as const : 'OPEN PATH' as const,
      summary: 'The selected maximum stopped execution before complete verification.'
    };
    return { ...base, events: contextualEvents(base, bounded) };
  }
  if (!architecturePreserved) {
    const deliveredLoc = Math.min(bounded, Math.max(462, Math.round(bounded * 0.92)));
    const base = {
      result: 'VERIFIED WITH EVIDENCE GAP' as const,
      deliveredLoc, files: Math.max(5, Math.ceil(deliveredLoc / 105)),
      checks: '25 / 26', evidenceGaps: 1, variant: 'OPEN PATH' as const,
      summary: 'The requirement completed through a wider architecture surface.'
    };
    return { ...base, events: contextualEvents(base, bounded) };
  }
  const deliveredLoc = bounded >= 500 ? 437 : bounded;
  const base = {
    result: 'VERIFIED' as const,
    deliveredLoc, files: 4, checks: '26 / 26', evidenceGaps: 0,
    variant: 'PRESERVED PATH' as const,
    summary: 'The requirement was satisfied inside the selected constraint.'
  };
  return { ...base, events: contextualEvents(base, bounded) };
}

export const comparisonRows = [
  { label: 'DELIVERED LOC', runA: '437', runB: '2,184' },
  { label: 'FILES', runA: '4', runB: '13' },
  { label: 'HUMAN TOUCHES', runA: '1', runB: '4' },
  { label: 'REWORK', runA: '0', runB: '312' },
  { label: 'REQUIREMENTS', runA: '8/8', runB: '8/8' },
  { label: 'QUALITY REGRESSIONS', runA: '0', runB: '2' },
  { label: 'EVIDENCE GAPS', runA: '0', runB: '1' }
] as const;

export const intentTrace = {
  location: 'permissions.ts:148', run: 'WLR-82A91', requirement: 'REQ-04',
  reason: 'Unauthorized routes must reject access', constraint: 'PRESERVE EXISTING ARCHITECTURE',
  verification: 'permissions.integration.test.ts', result: 'VERIFIED'
} as const;
