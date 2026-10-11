// Adapted from QuietPilot living-event.ts; fictional marketing scenario only.
/**
 * The Living Event — scenario state machine for the public landing page.
 *
 * One fictional catered event ("The Calloway Wedding") moves through the
 * commercial spine as the visitor scrolls. Every number the landing page
 * shows is derived from this module so the narrative stays internally
 * consistent and unit-testable. All of it is sample context: nothing here
 * creates workspace data, payment settlement, or job readiness.
 */

export const livingEventIdentity = {
  name: 'The Calloway Wedding',
  clientName: 'Dana Calloway',
  date: 'Saturday, October 17',
  shortDate: 'Oct 17',
  venue: 'Stonebridge Vineyard',
  service: 'Plated reception',
  sampleLabel: 'Sample event',
} as const;

export const livingEventNumbers = {
  initialGuests: 140,
  revisedGuests: 168,
  perGuestPackageUsd: 125,
  quoteV1TotalUsd: 26_800,
  quoteV2TotalUsd: 30_300,
  marginV1Percent: 41.2,
  marginV2Percent: 40.7,
  floorRolesV1: 12,
  floorRolesV2: 14,
  floorGuestsPerRole: 12,
  settingsReservedV1: 144,
  preferredVendorSettingsAvailable: 16,
  addedPrepHours: 9,
  lateNoticeAddedCostUsd: 2_212,
  depositPercent: 30,
  depositUsd: 9_090,
} as const;

export const livingEventQuoteV1Lines = [
  { id: 'dinner', label: 'Plated dinner · 140 × $125', amountUsd: 17_500 },
  { id: 'labor', label: 'Floor and kitchen labor', amountUsd: 4_120 },
  { id: 'rentals', label: 'Rentals · settings, glassware, linen', amountUsd: 2_310 },
  { id: 'bar', label: 'Bar package · wine and signature pour', amountUsd: 2_870 },
] as const;

export const livingEventQualification = [
  { id: 'service-style', label: 'Service style', unknown: 'Not specified', known: 'Plated dinner' },
  {
    id: 'bar-service',
    label: 'Bar service',
    unknown: 'Not specified',
    known: 'Wine + signature pour',
  },
  {
    id: 'kitchen-access',
    label: 'Kitchen access',
    unknown: 'Unknown',
    known: 'On-site catering kitchen',
  },
  {
    id: 'dietary',
    label: 'Dietary counts',
    unknown: 'Missing',
    known: '9 vegetarian · 3 gluten-free',
  },
  { id: 'load-in', label: 'Load-in window', unknown: 'Unconfirmed', known: '1:00 PM confirmed' },
] as const;

export type LivingCascadeTone = 'commercial' | 'operational' | 'risk' | 'action';

export type LivingCascadeStep = {
  id: string;
  tone: LivingCascadeTone;
  label: string;
  value: string;
  detail: string;
};

/** The commercial blast radius of guests 140 -> 168, in causal order. */
export const livingEventCascade: readonly LivingCascadeStep[] = [
  {
    id: 'revenue',
    tone: 'commercial',
    label: 'Projected revenue',
    value: '+$3,500',
    detail: '28 more guests × $125 plated package',
  },
  {
    id: 'staffing',
    tone: 'operational',
    label: 'Service staff',
    value: '+2 floor roles',
    detail: 'The 1:12 floor ratio moves 12 roles to 14',
  },
  {
    id: 'settings',
    tone: 'operational',
    label: 'Place settings',
    value: '+24 needed',
    detail: '144 reserved against 168 covers now required',
  },
  {
    id: 'rental-risk',
    tone: 'risk',
    label: 'Rental capacity warning',
    value: '8 settings short',
    detail: 'Preferred vendor holds 16 uncommitted settings for Oct 17',
  },
  {
    id: 'prep',
    tone: 'operational',
    label: 'Prep hours',
    value: '+9 hours',
    detail: 'Batch scaling across two prep days',
  },
  {
    id: 'margin',
    tone: 'commercial',
    label: 'Projected margin',
    value: '41.2% → 40.7%',
    detail: 'Late-notice costs outpace the package price',
  },
  {
    id: 'next-action',
    tone: 'action',
    label: 'Revised safest next action',
    value: 'Reissue the quote at 168 guests',
    detail: 'Hold the proposal until rental coverage is confirmed',
  },
] as const;

export type LivingReadinessLane = {
  id: string;
  label: string;
  startsResolved: boolean;
  openStatus: string;
  openDetail: string;
  resolvedStatus: string;
  resolvedDetail: string;
};

/** Readiness board lanes after re-acceptance. Accepted does not mean ready. */
export const livingEventReadinessLanes: readonly LivingReadinessLane[] = [
  {
    id: 'proposal',
    label: 'Proposal',
    startsResolved: true,
    openStatus: 'Accepted',
    openDetail: 'Quote v2 snapshot sealed at $30,300',
    resolvedStatus: 'Accepted',
    resolvedDetail: 'Quote v2 snapshot sealed at $30,300',
  },
  {
    id: 'payment',
    label: 'Payment',
    startsResolved: false,
    openStatus: 'Verification pending',
    openDetail: '$9,090 deposit invoiced · no settlement evidence on file yet',
    resolvedStatus: 'Deposit evidence recorded',
    resolvedDetail: '$9,090 · provider-backed evidence on file',
  },
  {
    id: 'staffing',
    label: 'Staffing',
    startsResolved: false,
    openStatus: '1 role unresolved',
    openDetail: '13 of 14 floor roles confirmed · captain pending',
    resolvedStatus: '14 of 14 roles confirmed',
    resolvedDetail: 'Marisol V. accepted the captain shift',
  },
  {
    id: 'inventory',
    label: 'Inventory',
    startsResolved: false,
    openStatus: '2 rental items unresolved',
    openDetail: 'Place settings ×24 split across vendors · chargers ×168 hold lapsed at requote',
    resolvedStatus: 'Rental holds reserved',
    resolvedDetail: 'Hartley Rentals ×16 · Fielding Event Supply ×8 · chargers reconfirmed ×168',
  },
  {
    id: 'schedule',
    label: 'Schedule',
    startsResolved: true,
    openStatus: 'Clear',
    openDetail: 'Load-in 1:00 PM confirmed · no fleet conflict',
    resolvedStatus: 'Clear',
    resolvedDetail: 'Load-in 1:00 PM confirmed · no fleet conflict',
  },
] as const;

export type LivingEvidenceArrival = {
  laneId: string;
  headline: string;
  detail: string;
};

/** Evidence arrives one item at a time; only then may readiness clear. */
export const livingEventEvidence: readonly LivingEvidenceArrival[] = [
  {
    laneId: 'payment',
    headline: 'Deposit evidence recorded',
    detail: '$9,090 deposit · provider-backed evidence on file · sample',
  },
  {
    laneId: 'staffing',
    headline: 'Captain confirmed',
    detail: 'Marisol V. accepted the captain shift · 14 of 14 floor roles covered',
  },
  {
    laneId: 'inventory',
    headline: 'Rental holds reserved',
    detail: 'Hartley Rentals ×16 and Fielding Event Supply ×8 settings · chargers ×168 reconfirmed',
  },
] as const;

export const livingEventSpineStages = [
  'Inquiry',
  'Lead',
  'Quote',
  'Proposal',
  'Acceptance',
  'Payment',
  'Job Readiness',
  'Downstream Sync',
] as const;

export type LivingEventBeat = {
  id: string;
  /** 0 = hero prologue, 1 = commitment, 2 = the change, 3 = readiness, 4 = offer. */
  act: 0 | 1 | 2 | 3 | 4;
  stageLabel: string;
  /** Index into livingEventSpineStages, or null once the story hands off to the offer. */
  spineIndex: number | null;
  guests: number;
  quoteLabel: string;
  marginLabel: string;
  readiness: 'not-applicable' | 'held' | 'ready';
  pulseMetric: string;
  pulseConsequence: string;
  nextAction: string;
};

export const livingEventBeats: readonly LivingEventBeat[] = [
  {
    id: 'inquiry',
    act: 0,
    stageLabel: 'Inquiry',
    spineIndex: 0,
    guests: 140,
    quoteLabel: 'No quote yet',
    marginLabel: '—',
    readiness: 'not-applicable',
    pulseMetric: '140 guests',
    pulseConsequence: 'Scope is not commercially safe yet',
    nextAction: 'Qualify the inquiry',
  },
  {
    id: 'qualified',
    act: 1,
    stageLabel: 'Qualified',
    spineIndex: 1,
    guests: 140,
    quoteLabel: 'Estimate $20k–$26k',
    marginLabel: '—',
    readiness: 'not-applicable',
    pulseMetric: '5 unknowns resolved',
    pulseConsequence: 'The promise now has a shape',
    nextAction: 'Draft quote v1',
  },
  {
    id: 'quoted',
    act: 1,
    stageLabel: 'Quoted',
    spineIndex: 2,
    guests: 140,
    quoteLabel: 'Quote v1 · $26,800',
    marginLabel: '41.2% projected',
    readiness: 'not-applicable',
    pulseMetric: '$26,800 · v1 locked',
    pulseConsequence: 'The number is a version, not a guess',
    nextAction: 'Send the proposal',
  },
  {
    id: 'accepted',
    act: 1,
    stageLabel: 'Accepted',
    spineIndex: 4,
    guests: 140,
    quoteLabel: 'Quote v1 · $26,800',
    marginLabel: '41.2% projected',
    readiness: 'not-applicable',
    pulseMetric: 'v1 snapshot sealed',
    pulseConsequence: 'Viewed was not accepted. Now it is.',
    nextAction: 'Invoice the deposit',
  },
  {
    id: 'change',
    act: 2,
    stageLabel: 'Change detected',
    spineIndex: 2,
    guests: 168,
    quoteLabel: 'Quote v1 · superseded',
    marginLabel: 'Recalculating',
    readiness: 'not-applicable',
    pulseMetric: '140 → 168 guests',
    pulseConsequence: '7 downstream consequences found',
    nextAction: 'Reissue the quote at 168 guests',
  },
  {
    id: 'requoted',
    act: 2,
    stageLabel: 'Re-accepted',
    spineIndex: 4,
    guests: 168,
    quoteLabel: 'Quote v2 · $30,300',
    marginLabel: '40.7% projected',
    readiness: 'not-applicable',
    pulseMetric: 'v2 snapshot sealed',
    pulseConsequence: 'The change became a new agreement',
    nextAction: 'Collect deposit evidence',
  },
  {
    id: 'held',
    act: 3,
    stageLabel: 'Held',
    spineIndex: 6,
    guests: 168,
    quoteLabel: 'Quote v2 · $30,300',
    marginLabel: '40.7% projected',
    readiness: 'held',
    pulseMetric: '3 proofs outstanding',
    pulseConsequence: 'Accepted does not mean ready',
    nextAction: 'Resolve payment, staffing, and inventory proof',
  },
  {
    id: 'evidence',
    act: 3,
    stageLabel: 'Evidence arriving',
    spineIndex: 6,
    guests: 168,
    quoteLabel: 'Quote v2 · $30,300',
    marginLabel: '40.7% projected',
    readiness: 'held',
    pulseMetric: 'Proofs clearing',
    pulseConsequence: 'Evidence replaces uncertainty',
    nextAction: 'Hold readiness until the last proof clears',
  },
  {
    id: 'ready',
    act: 3,
    stageLabel: 'Ready',
    spineIndex: 6,
    guests: 168,
    quoteLabel: 'Quote v2 · $30,300',
    marginLabel: '40.7% projected',
    readiness: 'ready',
    pulseMetric: 'Readiness cleared',
    pulseConsequence: 'Nothing assumed. Everything proven.',
    nextAction: 'Deliver on Oct 17',
  },
  {
    id: 'offer',
    act: 4,
    stageLabel: 'Your operation',
    spineIndex: null,
    guests: 168,
    quoteLabel: 'Core · $199/month',
    marginLabel: '—',
    readiness: 'not-applicable',
    pulseMetric: '$199/month',
    pulseConsequence: 'The discipline is the product',
    nextAction: 'Start QuietPilot Core',
  },
] as const;

export const livingEventBeatCount = livingEventBeats.length;

export function formatLivingUsd(valueUsd: number): string {
  return `$${valueUsd.toLocaleString('en-US')}`;
}

export function sumQuoteV1LinesUsd(): number {
  return livingEventQuoteV1Lines.reduce((total, line) => total + line.amountUsd, 0);
}

export function revenueDeltaUsd(): number {
  return (
    (livingEventNumbers.revisedGuests - livingEventNumbers.initialGuests) *
    livingEventNumbers.perGuestPackageUsd
  );
}

export function floorRolesForGuests(guests: number): number {
  return Math.ceil(guests / livingEventNumbers.floorGuestsPerRole);
}

export function additionalSettingsNeeded(): number {
  return livingEventNumbers.revisedGuests - livingEventNumbers.settingsReservedV1;
}

export function settingsShortfall(): number {
  return additionalSettingsNeeded() - livingEventNumbers.preferredVendorSettingsAvailable;
}

export function depositForQuoteV2Usd(): number {
  return Math.round((livingEventNumbers.quoteV2TotalUsd * livingEventNumbers.depositPercent) / 100);
}

export function unresolvedLaneIds(): readonly string[] {
  return livingEventReadinessLanes.filter((lane) => !lane.startsResolved).map((lane) => lane.id);
}
