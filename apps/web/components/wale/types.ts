import type { LucideIcon } from 'lucide-react';

export type ExperiencePanel = 'intro' | 'workbench';

export type WorkbenchStageId =
  | 'scope'
  | 'evidence'
  | 'constraint'
  | 'intervention'
  | 'verification';

export type AuditScopeId =
  | 'instructions'
  | 'plugins'
  | 'mcps'
  | 'hooks'
  | 'packages'
  | 'design-docs';

export type EvidenceState =
  | 'AVAILABLE'
  | 'CONFIGURED'
  | 'ENFORCED'
  | 'OBSERVED'
  | 'VERIFIED'
  | 'UNKNOWN';

export type FindingSeverity = 'leading' | 'material' | 'watch';
export type PlanStatus = 'candidate' | 'included' | 'held';
export type VerificationStatus = 'ready' | 'blocked' | 'review';

export interface WorkbenchStage {
  id: WorkbenchStageId;
  number: string;
  label: string;
  command: string;
  description: string;
  icon: LucideIcon;
}

export interface AuditQuestion {
  id: string;
  prompt: string;
  answer: string;
  state: EvidenceState;
  source: string;
}

export interface EvidenceRecord {
  id: string;
  label: string;
  state: EvidenceState;
  value: string;
  source: string;
  observedAt: string;
  caveat: string;
}

export interface AuditScope {
  id: AuditScopeId;
  number: string;
  label: string;
  shortLabel: string;
  count: string;
  state: EvidenceState;
  icon: LucideIcon;
  purpose: string;
  boundary: string;
  observed: string;
  unknown: string;
  recommendation: string;
  authority: string;
  questions: readonly AuditQuestion[];
  evidence: readonly EvidenceRecord[];
}

export interface Finding {
  id: string;
  rank: number;
  severity: FindingSeverity;
  scopeId: AuditScopeId;
  title: string;
  condition: string;
  evidence: string;
  effect: string;
  competingDiagnosis: string;
  intervention: string;
  verification: string;
  residualRisk: string;
  confidence: string;
}

export interface PlanItem {
  id: string;
  order: number;
  findingId: string;
  scopeId: AuditScopeId;
  title: string;
  mechanism: string;
  reason: string;
  cost: string;
  authority: string;
  rollback: string;
  verification: string;
  status: PlanStatus;
}

export interface VerificationGate {
  id: string;
  label: string;
  description: string;
  status: VerificationStatus;
  evidenceRequired: string;
  failureMeaning: string;
}

export interface ConnectionStep {
  id: string;
  number: string;
  label: string;
  description: string;
  operatorAction: string;
  systemAction: string;
  boundary: string;
  status: VerificationStatus;
}

export interface TelemetryFrame {
  time: string;
  channel: string;
  message: string;
  tone: 'quiet' | 'normal' | 'bright' | 'warning';
}

export interface BreachShard {
  id: string;
  path: string;
  x: number;
  y: number;
  rotate: number;
  label: string;
  stage: WorkbenchStageId;
}

export interface ExperienceState {
  panel: ExperiencePanel;
  breachActive: boolean;
  stage: WorkbenchStageId;
  activeScope: AuditScopeId;
  activeFindingId: string;
  includedPlanIds: readonly string[];
}
