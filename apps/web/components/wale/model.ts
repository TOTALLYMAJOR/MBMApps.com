import {
  Activity,
  Braces,
  Boxes,
  FileCode2,
  FileStack,
  Gauge,
  GitBranch,
  ListChecks,
  PackageSearch,
  PlugZap,
  Radar,
  Route,
  ShieldCheck,
  Workflow
} from 'lucide-react';
import type {
  AuditScope,
  BreachShard,
  ConnectionStep,
  Finding,
  PlanItem,
  TelemetryFrame,
  VerificationGate,
  WorkbenchStage
} from './types';

export const workbenchStages: readonly WorkbenchStage[] = [
  {
    id: 'scope',
    number: '01',
    label: 'Scope',
    command: 'Map the control surface',
    description: 'Choose the repository capabilities Wale may inspect. Nothing outside the approved scope enters the assessment.',
    icon: ListChecks
  },
  {
    id: 'evidence',
    number: '02',
    label: 'Evidence',
    command: 'Separate signal from assumption',
    description: 'Record what is available, configured, enforced, observed, verified, or still unknown without collapsing those states.',
    icon: Radar
  },
  {
    id: 'constraint',
    number: '03',
    label: 'Constraint',
    command: 'Isolate the limiting condition',
    description: 'Compare plausible diagnoses and identify the single condition most likely to limit safe delivery.',
    icon: Gauge
  },
  {
    id: 'intervention',
    number: '04',
    label: 'Intervention',
    command: 'Choose the smallest useful move',
    description: 'Reuse, reconnect, remove conflict, or extend before creating another tool or control plane.',
    icon: Workflow
  },
  {
    id: 'verification',
    number: '05',
    label: 'Verification',
    command: 'Define the proof before change',
    description: 'Set runnable checks, authority gates, rollback, and honest claim boundaries before implementation begins.',
    icon: ShieldCheck
  }
];

export const telemetryFrames: readonly TelemetryFrame[] = [
  { time: '00:00.021', channel: 'BOOT', message: 'constraint breach protocol initialized', tone: 'normal' },
  { time: '00:00.068', channel: 'BOUND', message: 'illustrative sequence selected · no live repository', tone: 'warning' },
  { time: '00:00.114', channel: 'MODE', message: 'black-box reader set to sample / read-only', tone: 'normal' },
  { time: '00:00.184', channel: 'LINK', message: 'sample repository connected · local boundary', tone: 'normal' },
  { time: '00:00.241', channel: 'HASH', message: 'snapshot identity recorded for comparison', tone: 'quiet' },
  { time: '00:00.318', channel: 'AUTH', message: 'nested instruction authority resolved', tone: 'normal' },
  { time: '00:00.431', channel: 'MAP', message: 'instructions and approval controls mapped', tone: 'normal' },
  { time: '00:00.502', channel: 'PLUG', message: 'installed capability providers enumerated', tone: 'quiet' },
  { time: '00:00.577', channel: 'MCP', message: 'runtime availability kept separate from configuration', tone: 'normal' },
  { time: '00:00.677', channel: 'HOOK', message: 'hooks and enforcement points observed', tone: 'normal' },
  { time: '00:00.752', channel: 'PKG', message: 'package authority and duplication checked', tone: 'quiet' },
  { time: '00:00.836', channel: 'DOC', message: 'design and decision records aligned', tone: 'normal' },
  { time: '00:00.921', channel: 'TRACE', message: 'request-to-evidence path reconstructed', tone: 'normal' },
  { time: '00:01.052', channel: 'RANK', message: '18 plausible adjustments ranked', tone: 'bright' },
  { time: '00:01.144', channel: 'ALT', message: 'competing diagnoses retained', tone: 'quiet' },
  { time: '00:01.228', channel: 'COST', message: 'change cost and recovery path estimated', tone: 'normal' },
  { time: '00:01.314', channel: 'TRUST', message: 'claims bounded to observed evidence', tone: 'normal' },
  { time: '00:01.401', channel: 'TRACE', message: 'primary delivery seam compared with alternatives', tone: 'normal' },
  { time: '00:01.548', channel: 'SIGNAL', message: 'signal anomaly entered constraint aperture', tone: 'bright' },
  { time: '00:01.744', channel: 'FOCUS', message: 'leading constraint isolated', tone: 'bright' },
  { time: '00:01.886', channel: 'PLAN', message: 'smallest justified intervention prepared', tone: 'normal' },
  { time: '00:02.012', channel: 'VERIFY', message: 'runnable proof gates attached', tone: 'normal' },
  { time: '00:02.103', channel: 'BOUND', message: 'execution authority remains with operator', tone: 'warning' },
  { time: '00:02.298', channel: 'HOLD', message: 'no change dispatched from public surface', tone: 'normal' },
  { time: '00:02.440', channel: 'READY', message: 'awaiting operator review', tone: 'bright' }
];

export const auditScopes: readonly AuditScope[] = [
  {
    id: 'instructions',
    number: '01',
    label: 'Repository instructions',
    shortLabel: 'Instructions',
    count: '3 authority layers',
    state: 'ENFORCED',
    icon: FileCode2,
    purpose: 'Resolve which human and repository instructions govern the current path before tools or implementation are selected.',
    boundary: 'Wale reads the declared hierarchy. It does not invent approval authority or outrank the consuming repository.',
    observed: 'Root and application instructions agree on bounded source changes, explicit validation, and proof-safe delivery language.',
    unknown: 'Whether every downstream execution receipt retains the exact instruction snapshot remains unverified in this sample.',
    recommendation: 'Bind the resolved instruction digest to each delegated handoff and returned receipt.',
    authority: 'Owner-held product direction; repository-held implementation policy.',
    questions: [
      { id: 'instructions-root', prompt: 'Is a root authority file present?', answer: 'Present and parsed', state: 'OBSERVED', source: 'sample://AGENTS.md' },
      { id: 'instructions-nested', prompt: 'Are nested rules resolved for this route?', answer: 'One nested scope applied', state: 'VERIFIED', source: 'sample://apps/web/AGENTS.md' },
      { id: 'instructions-conflict', prompt: 'Are conflicting rules surfaced?', answer: 'No conflict in sample path', state: 'OBSERVED', source: 'sample://authority-map' },
      { id: 'instructions-receipt', prompt: 'Is the resolved snapshot retained?', answer: 'Retention not demonstrated', state: 'UNKNOWN', source: 'sample://handoff-receipt' }
    ],
    evidence: [
      { id: 'instruction-e1', label: 'Root authority', state: 'AVAILABLE', value: 'AGENTS.md', source: 'sample repository', observedAt: 'snapshot start', caveat: 'Availability does not prove enforcement.' },
      { id: 'instruction-e2', label: 'Nested authority', state: 'CONFIGURED', value: 'apps/web scope', source: 'sample resolver', observedAt: 'scope map', caveat: 'Configuration is sample data.' },
      { id: 'instruction-e3', label: 'Conflict check', state: 'VERIFIED', value: 'No material collision', source: 'sample comparison', observedAt: 'authority pass', caveat: 'Bounded to represented files.' },
      { id: 'instruction-e4', label: 'Receipt binding', state: 'UNKNOWN', value: 'Not observed', source: 'sample handoff', observedAt: 'not available', caveat: 'Unknown is not a failure claim.' }
    ]
  },
  {
    id: 'plugins',
    number: '02',
    label: 'Skills and plugins',
    shortLabel: 'Plugins',
    count: '6 capabilities',
    state: 'OBSERVED',
    icon: PlugZap,
    purpose: 'Distinguish installed knowledge packages from capabilities that are actually loaded, applicable, and used in the active path.',
    boundary: 'Presence is inventory evidence only. Wale never upgrades installation into runtime availability or successful use.',
    observed: 'Six sample capabilities match the work, while two overlap in frontend review responsibilities.',
    unknown: 'Load state for one optional visual-review provider is not represented in the sample runtime record.',
    recommendation: 'Route to one primary UI review capability and retain the secondary provider as explicit fallback.',
    authority: 'Repository routing rules decide which capability is eligible.',
    questions: [
      { id: 'plugins-installed', prompt: 'Which skills are installed?', answer: 'Six relevant entries', state: 'AVAILABLE', source: 'sample://capability-catalog' },
      { id: 'plugins-loaded', prompt: 'Which skills are loaded now?', answer: 'Five represented as loaded', state: 'OBSERVED', source: 'sample://runtime-manifest' },
      { id: 'plugins-overlap', prompt: 'Do responsibilities overlap?', answer: 'Two UI review candidates', state: 'VERIFIED', source: 'sample://routing-audit' },
      { id: 'plugins-used', prompt: 'Is successful use evidenced?', answer: 'Three receipts represented', state: 'OBSERVED', source: 'sample://execution-receipts' }
    ],
    evidence: [
      { id: 'plugins-e1', label: 'Catalog entries', state: 'AVAILABLE', value: '6 matched', source: 'sample capability catalog', observedAt: 'inventory pass', caveat: 'Match does not prove suitability.' },
      { id: 'plugins-e2', label: 'Loaded providers', state: 'OBSERVED', value: '5 of 6', source: 'sample runtime record', observedAt: 'bootstrap', caveat: 'Illustrative runtime only.' },
      { id: 'plugins-e3', label: 'Routing policy', state: 'ENFORCED', value: 'Primary + fallback', source: 'sample instructions', observedAt: 'authority pass', caveat: 'Enforcement is represented, not live.' },
      { id: 'plugins-e4', label: 'Outcome evidence', state: 'UNKNOWN', value: 'No outcome receipt', source: 'sample outcomes', observedAt: 'not available', caveat: 'Use is not effectiveness.' }
    ]
  },
  {
    id: 'mcps',
    number: '03',
    label: 'MCP connections',
    shortLabel: 'MCPs',
    count: '4 providers',
    state: 'CONFIGURED',
    icon: Route,
    purpose: 'Map external context and action providers, then separate registration, authentication, callability, and authorization.',
    boundary: 'A configured endpoint is not treated as loaded, authenticated, callable, or authorized without distinct evidence.',
    observed: 'Four providers are declared. Structural memory is callable in the sample path; two action providers remain intentionally unused.',
    unknown: 'Authentication freshness for one optional external provider is not included in the sample assessment.',
    recommendation: 'Add a lightweight capability preflight that records status without invoking action tools.',
    authority: 'External mutations remain separately authorized even when a provider is healthy.',
    questions: [
      { id: 'mcps-declared', prompt: 'Which providers are declared?', answer: 'Four sample providers', state: 'AVAILABLE', source: 'sample://mcp-config' },
      { id: 'mcps-loaded', prompt: 'Which providers are loaded?', answer: 'Two loaded', state: 'OBSERVED', source: 'sample://tool-catalog' },
      { id: 'mcps-callable', prompt: 'Which providers answered preflight?', answer: 'Structural memory answered', state: 'VERIFIED', source: 'sample://preflight' },
      { id: 'mcps-authorized', prompt: 'Are action providers authorized?', answer: 'No action authority granted', state: 'ENFORCED', source: 'sample://authority-envelope' }
    ],
    evidence: [
      { id: 'mcps-e1', label: 'Static configuration', state: 'CONFIGURED', value: '4 endpoints', source: 'sample configuration', observedAt: 'bootstrap', caveat: 'Static binding is not runtime proof.' },
      { id: 'mcps-e2', label: 'Graph provider', state: 'VERIFIED', value: 'Read query returned', source: 'sample preflight', observedAt: 'discovery', caveat: 'Read success grants no write authority.' },
      { id: 'mcps-e3', label: 'Action providers', state: 'ENFORCED', value: 'Held inactive', source: 'sample authority envelope', observedAt: 'scope gate', caveat: 'Healthy but deliberately unused.' },
      { id: 'mcps-e4', label: 'Credential freshness', state: 'UNKNOWN', value: 'One provider unknown', source: 'sample secrets boundary', observedAt: 'redacted', caveat: 'No secret values inspected.' }
    ]
  },
  {
    id: 'hooks',
    number: '04',
    label: 'Hooks and controls',
    shortLabel: 'Hooks',
    count: '8 control points',
    state: 'OBSERVED',
    icon: GitBranch,
    purpose: 'Trace where instructions, validation, journaling, security, and publication rules are actually enforced.',
    boundary: 'Wale reports represented enforcement points and gaps; it does not claim hooks cover manual or external work.',
    observed: 'Pre-tool scope checks and post-tool evidence records are represented. A failed validation is retained with the turn.',
    unknown: 'Coverage for work performed outside the governed client cannot be inferred from the sample hook record.',
    recommendation: 'Attach intervention reasons to the existing receipt instead of adding another event store.',
    authority: 'Hooks enforce declared policy; they do not create product approval.',
    questions: [
      { id: 'hooks-pre', prompt: 'Are pre-action checks represented?', answer: 'Scope and risk checks present', state: 'OBSERVED', source: 'sample://hook-map' },
      { id: 'hooks-post', prompt: 'Are results retained?', answer: 'Hash-chained record represented', state: 'OBSERVED', source: 'sample://journal' },
      { id: 'hooks-failure', prompt: 'Are failures explicit?', answer: 'Failed steps retained', state: 'VERIFIED', source: 'sample://failure-receipt' },
      { id: 'hooks-bypass', prompt: 'Is bypass coverage known?', answer: 'External paths excluded', state: 'ENFORCED', source: 'sample://claim-boundary' }
    ],
    evidence: [
      { id: 'hooks-e1', label: 'Pre-action gate', state: 'ENFORCED', value: 'Scope checked', source: 'sample hook record', observedAt: 'before mutation', caveat: 'Only covered client routes.' },
      { id: 'hooks-e2', label: 'Creation record', state: 'OBSERVED', value: 'Path and digest retained', source: 'sample journal', observedAt: 'after mutation', caveat: 'Raw secret-bearing output excluded.' },
      { id: 'hooks-e3', label: 'Validation record', state: 'VERIFIED', value: 'Exit status retained', source: 'sample receipt', observedAt: 'validation close', caveat: 'Pass does not imply deployment.' },
      { id: 'hooks-e4', label: 'Manual path', state: 'UNKNOWN', value: 'Outside coverage', source: 'claim boundary', observedAt: 'declared exclusion', caveat: 'Explicitly not covered.' }
    ]
  },
  {
    id: 'packages',
    number: '05',
    label: 'Packages and runtimes',
    shortLabel: 'Packages',
    count: '12 material links',
    state: 'VERIFIED',
    icon: PackageSearch,
    purpose: 'Identify package authority, version alignment, duplicated capability, and the runtime path actually exercised by validation.',
    boundary: 'Package inventory remains technical evidence. Wale does not infer product fitness or customer outcome from dependency state.',
    observed: 'Workspace dependency edges resolve in the sample snapshot. One validation lane requires a generated contracts build first.',
    unknown: 'Hosted runtime parity is not represented; the sample proves only the local dependency graph.',
    recommendation: 'Keep the existing pre-validation contracts build and record its digest with the test receipt.',
    authority: 'Workspace manifests and lockfile remain canonical.',
    questions: [
      { id: 'packages-lock', prompt: 'Is the dependency snapshot fixed?', answer: 'Lockfile present', state: 'VERIFIED', source: 'sample://package-lock' },
      { id: 'packages-workspace', prompt: 'Do workspace links resolve?', answer: 'Contracts build required', state: 'OBSERVED', source: 'sample://workspace-graph' },
      { id: 'packages-duplicate', prompt: 'Is capability duplicated?', answer: 'No material runtime duplicate', state: 'OBSERVED', source: 'sample://dependency-audit' },
      { id: 'packages-hosted', prompt: 'Is hosted parity proven?', answer: 'Not represented', state: 'UNKNOWN', source: 'sample://hosted-runtime' }
    ],
    evidence: [
      { id: 'packages-e1', label: 'Lock identity', state: 'VERIFIED', value: 'Snapshot recorded', source: 'sample lockfile', observedAt: 'bootstrap', caveat: 'Illustrative hash withheld.' },
      { id: 'packages-e2', label: 'Workspace build', state: 'OBSERVED', value: 'Contracts first', source: 'sample task graph', observedAt: 'validation', caveat: 'Local toolchain only.' },
      { id: 'packages-e3', label: 'Runtime imports', state: 'VERIFIED', value: 'Resolved locally', source: 'sample compiler', observedAt: 'typecheck', caveat: 'Not production runtime proof.' },
      { id: 'packages-e4', label: 'Hosted parity', state: 'UNKNOWN', value: 'No hosted receipt', source: 'sample deployment boundary', observedAt: 'not available', caveat: 'Local success stays local.' }
    ]
  },
  {
    id: 'design-docs',
    number: '06',
    label: 'Design and decisions',
    shortLabel: 'Design docs',
    count: '5 records',
    state: 'AVAILABLE',
    icon: FileStack,
    purpose: 'Connect product intent, design direction, recorded decisions, exceptions, and visual baselines to the implementation path.',
    boundary: 'A recommendation or visual draft is not approval. Recorded owner direction remains required before implementation.',
    observed: 'The sample contains a product brief, interaction contract, decision log, visual baseline, and one open exception.',
    unknown: 'Owner ratification for the open exception is not represented.',
    recommendation: 'Keep the exception visible in the plan and require explicit disposition before publication.',
    authority: 'Product direction remains owner-held; approved baselines govern rendered comparison.',
    questions: [
      { id: 'design-brief', prompt: 'Is product intent available?', answer: 'Brief represented', state: 'AVAILABLE', source: 'sample://product-brief' },
      { id: 'design-decision', prompt: 'Is direction approved?', answer: 'Four decisions recorded', state: 'OBSERVED', source: 'sample://decision-log' },
      { id: 'design-baseline', prompt: 'Is visual comparison governed?', answer: 'Baseline approval required', state: 'ENFORCED', source: 'sample://visual-policy' },
      { id: 'design-exception', prompt: 'Are exceptions explicit?', answer: 'One awaiting disposition', state: 'UNKNOWN', source: 'sample://exception-register' }
    ],
    evidence: [
      { id: 'design-e1', label: 'Product brief', state: 'AVAILABLE', value: 'Current snapshot', source: 'sample design record', observedAt: 'scope pass', caveat: 'Availability is not approval.' },
      { id: 'design-e2', label: 'Decision log', state: 'OBSERVED', value: '4 accepted entries', source: 'sample memory', observedAt: 'alignment pass', caveat: 'Sample records only.' },
      { id: 'design-e3', label: 'Visual baseline', state: 'ENFORCED', value: 'Approval-bound', source: 'sample baseline policy', observedAt: 'render gate', caveat: 'Not silently updateable.' },
      { id: 'design-e4', label: 'Open exception', state: 'UNKNOWN', value: 'Owner decision pending', source: 'sample exception register', observedAt: 'review gate', caveat: 'No approval inferred.' }
    ]
  }
];

export const findings: readonly Finding[] = [
  {
    id: 'context-not-continuous', rank: 1, severity: 'leading', scopeId: 'mcps',
    title: 'Repository knowledge is present but not continuously available.',
    condition: 'Structural memory answers a direct preflight, while one development entry path begins without loading the provider.',
    evidence: 'The sample capability record separates configured, loaded, and callable states and shows the mismatch at bootstrap.',
    effect: 'Agents repeat discovery and may reason from a stale or incomplete model before the structural source is available.',
    competingDiagnosis: 'Missing documentation was considered, but the relevant records already exist and are discoverable after connection.',
    intervention: 'Connect the existing structural-memory provider during the governed bootstrap sequence.',
    verification: 'Start a clean sample session and prove list, status, coverage, and one bounded symbol lookup before planning.',
    residualRisk: 'Provider health can still drift; retain a visible degraded mode and never silently fall back for exhaustive claims.',
    confidence: 'High · represented by three independent sample records'
  },
  {
    id: 'receipt-context-gap', rank: 2, severity: 'material', scopeId: 'hooks',
    title: 'Recovery occurs without retaining why intervention was needed.',
    condition: 'The execution receipt records validation and final state but not the operator signal that triggered recovery.',
    evidence: 'Sample hook and receipt views share the same run identity yet expose different intervention context.',
    effect: 'A successful retry closes the task but loses the learning that could prevent repetition.',
    competingDiagnosis: 'A second event store would retain more data but would duplicate the existing receipt authority.',
    intervention: 'Extend the current receipt with a bounded intervention-reason field and evidence reference.',
    verification: 'Replay one failed validation, intervene, recover, and verify the reason survives in the final receipt.',
    residualRisk: 'Free-form reasons can become noisy; use a short controlled category plus optional note.',
    confidence: 'Medium-high · sample path reconstructed end to end'
  },
  {
    id: 'claim-boundary-drift', rank: 3, severity: 'material', scopeId: 'instructions',
    title: 'Delivery language can outrun attached evidence.',
    condition: 'Local validation records are strong, while hosted runtime and outcome evidence are absent from the sample.',
    evidence: 'The sample register contains local compiler, test, and browser results with no hosted receipt.',
    effect: 'A technically correct change may be described as deployed, accepted, or effective without corresponding proof.',
    competingDiagnosis: 'More tests would strengthen local evidence but would not establish hosted or outcome state.',
    intervention: 'Apply the existing claim-boundary vocabulary at handoff and publication gates.',
    verification: 'Reject a sample completion statement that exceeds its evidence tier, then accept the corrected local-only claim.',
    residualRisk: 'Human-authored external messages may bypass the governed surface.',
    confidence: 'High · evidence-state gap is explicit'
  },
  {
    id: 'plugin-overlap', rank: 4, severity: 'watch', scopeId: 'plugins',
    title: 'Two UI review capabilities compete for primary routing.',
    condition: 'Both capabilities match rendered interface work and neither is marked as the primary route in the sample catalog.',
    evidence: 'Capability descriptions overlap on accessibility, responsiveness, and final visual review.',
    effect: 'Duplicate inspection adds latency and can produce conflicting aesthetic recommendations.',
    competingDiagnosis: 'Parallel review can be valuable for high-risk releases, but this sample task is a bounded landing surface.',
    intervention: 'Choose one primary reviewer and invoke the second only for explicit independent challenge.',
    verification: 'Route two sample UI tasks and confirm one deterministic primary with a visible fallback rule.',
    residualRisk: 'Novel work may still benefit from deliberate multi-review.',
    confidence: 'Medium · outcome cost is inferred from routing overlap'
  },
  {
    id: 'workspace-prebuild', rank: 5, severity: 'watch', scopeId: 'packages',
    title: 'Web validation depends on a generated workspace contract.',
    condition: 'Web typecheck and tests cannot resolve the contracts package until its existing build step has run.',
    evidence: 'The sample task graph declares the build order and the package exports generated declarations.',
    effect: 'Direct sub-workspace commands can fail for environment reasons that resemble source defects.',
    competingDiagnosis: 'Publishing the package externally would avoid local generation but adds release overhead and another drift seam.',
    intervention: 'Preserve the root validation command and surface the prerequisite when web-only checks are requested.',
    verification: 'Run clean install, contracts build, web typecheck, and web tests in sequence.',
    residualRisk: 'Manual web-only commands remain possible; diagnostics should name the missing prerequisite.',
    confidence: 'High · deterministic sample reproduction'
  },
  {
    id: 'exception-pending', rank: 6, severity: 'watch', scopeId: 'design-docs',
    title: 'One design exception remains owner-held.',
    condition: 'The interaction contract and baseline agree, but an exception record has no final disposition.',
    evidence: 'The sample design register marks the exception as pending rather than accepted or rejected.',
    effect: 'Implementation could accidentally normalize a temporary deviation into the product language.',
    competingDiagnosis: 'Automatic baseline update would remove the mismatch but would bypass owner authority.',
    intervention: 'Carry the exception into the plan as a blocking review item.',
    verification: 'Require an explicit accept, reject, or time-bound defer disposition before publication.',
    residualRisk: 'A deferred exception can become stale; attach a review trigger.',
    confidence: 'High · status explicitly represented'
  }
];

export const planItems: readonly PlanItem[] = [
  {
    id: 'plan-connect-memory', order: 1, findingId: 'context-not-continuous', scopeId: 'mcps', status: 'included',
    title: 'Load structural memory at governed bootstrap',
    mechanism: 'Reuse the configured provider and run a read-only readiness preflight before planning.',
    reason: 'Closes the leading context gap without adding a tool, database, or approval path.',
    cost: 'Small · configuration and one bounded preflight',
    authority: 'Repository instructions govern fallback and exhaustive-claim behavior.',
    rollback: 'Disable bootstrap binding; retain explicit manual connection path.',
    verification: 'Fresh session returns project, index, coverage, and a bounded symbol result.'
  },
  {
    id: 'plan-receipt-context', order: 2, findingId: 'receipt-context-gap', scopeId: 'hooks', status: 'included',
    title: 'Retain intervention context in existing receipts',
    mechanism: 'Add a controlled reason category and optional bounded note to the current receipt schema.',
    reason: 'Preserves recovery learning at the existing evidence authority.',
    cost: 'Medium · schema, writer, reader, and replay fixture',
    authority: 'Receipt schema owner approves the field; product authority remains unchanged.',
    rollback: 'Readers ignore the additive field; writer flag disables emission.',
    verification: 'Failed run, intervention, recovery, and final receipt preserve the same reason identity.'
  },
  {
    id: 'plan-claim-gate', order: 3, findingId: 'claim-boundary-drift', scopeId: 'instructions', status: 'candidate',
    title: 'Bind completion language to evidence tier',
    mechanism: 'Reuse the claim-boundary registry at generated handoff and publication surfaces.',
    reason: 'Prevents local evidence from silently becoming deployment or outcome language.',
    cost: 'Small · deterministic policy check',
    authority: 'Owner-controlled vocabulary and repository claim registry.',
    rollback: 'Advisory mode reports mismatches without blocking.',
    verification: 'Known overclaim fails; equivalent bounded statement passes.'
  },
  {
    id: 'plan-route-ui', order: 4, findingId: 'plugin-overlap', scopeId: 'plugins', status: 'held',
    title: 'Set one primary UI review route',
    mechanism: 'Clarify primary and fallback responsibilities in the existing routing record.',
    reason: 'Reduces duplicate latency while retaining deliberate independent challenge.',
    cost: 'Small · routing metadata only',
    authority: 'Repository capability-routing policy.',
    rollback: 'Remove priority and return to explicit manual selection.',
    verification: 'Two representative UI tasks resolve to the declared primary.'
  },
  {
    id: 'plan-prebuild', order: 5, findingId: 'workspace-prebuild', scopeId: 'packages', status: 'candidate',
    title: 'Expose the contracts prerequisite in web validation',
    mechanism: 'Keep the root task graph and add a precise diagnostic to direct web-only validation guidance.',
    reason: 'Avoids misclassifying missing generated declarations as application defects.',
    cost: 'Small · documentation and task output',
    authority: 'Workspace package scripts remain canonical.',
    rollback: 'Remove diagnostic with no runtime impact.',
    verification: 'Clean checkout follows the named sequence without package resolution failures.'
  },
  {
    id: 'plan-exception', order: 6, findingId: 'exception-pending', scopeId: 'design-docs', status: 'held',
    title: 'Resolve or time-bound the open design exception',
    mechanism: 'Present the exception, consequence, exact review surface, and reconsideration trigger.',
    reason: 'Keeps temporary variance from becoming silent product policy.',
    cost: 'Owner review · no implementation before disposition',
    authority: 'Owner-held design direction.',
    rollback: 'Not applicable until a direction is selected.',
    verification: 'Recorded disposition references the exact reviewed snapshot.'
  }
];

export const verificationGates: readonly VerificationGate[] = [
  { id: 'verify-authority', label: 'Authority resolved', description: 'Exact instruction hierarchy and owner-held decisions are attached.', status: 'ready', evidenceRequired: 'Authority digest + scope record', failureMeaning: 'Stop before implementation.' },
  { id: 'verify-context', label: 'Context current', description: 'Structural source is ready and material paths have coverage evidence.', status: 'ready', evidenceRequired: 'Index identity + path coverage', failureMeaning: 'Bound affected conclusions.' },
  { id: 'verify-tests', label: 'Runnable checks', description: 'Compiler, lint, tests, and route-specific interaction checks are named.', status: 'ready', evidenceRequired: 'Fresh command receipts', failureMeaning: 'Do not claim technical completion.' },
  { id: 'verify-hosted', label: 'Hosted state', description: 'Deployment and provider state require separate fresh observation.', status: 'blocked', evidenceRequired: 'Hosted runtime receipt', failureMeaning: 'Keep claims local.' },
  { id: 'verify-outcome', label: 'Outcome state', description: 'User or operational effect is not inferred from delivery evidence.', status: 'review', evidenceRequired: 'Owner-defined outcome observation', failureMeaning: 'Do not claim effectiveness.' }
];

export const connectionSteps: readonly ConnectionStep[] = [
  { id: 'connect-start', number: '01', label: 'Start local bridge', description: 'Launch the loopback-only Wale bridge from the repository environment.', operatorAction: 'Start the existing local command.', systemAction: 'Expose bounded readiness only.', boundary: 'No public filesystem access.', status: 'ready' },
  { id: 'connect-scope', number: '02', label: 'Approve repository scope', description: 'Select the exact checkout and material paths allowed for assessment.', operatorAction: 'Confirm root, branch, and scope.', systemAction: 'Freeze the assessment envelope.', boundary: 'No sibling repository inference.', status: 'review' },
  { id: 'connect-observe', number: '03', label: 'Run read-only observation', description: 'Map authority, capabilities, evidence, and delivery paths without mutation.', operatorAction: 'Review the declared read boundary.', systemAction: 'Collect bounded observations.', boundary: 'No implementation or external action.', status: 'ready' },
  { id: 'connect-review', number: '04', label: 'Review diagnosis and plan', description: 'Compare the leading constraint, alternatives, costs, rollback, and unknowns.', operatorAction: 'Accept, hold, or reject plan items.', systemAction: 'Retain decisions with snapshot identity.', boundary: 'Recommendation is not approval.', status: 'review' },
  { id: 'connect-dispatch', number: '05', label: 'Authorize a bounded change', description: 'Dispatch only the selected item through the repository execution path.', operatorAction: 'Grant explicit scoped authority.', systemAction: 'Execute, validate, and return evidence.', boundary: 'No ambient or autonomous expansion.', status: 'blocked' }
];

export const breachShards: readonly BreachShard[] = [
  { id: 'shard-scope-a', path: 'M916 176l34-18 9 42-37 11Z', x: 188, y: -82, rotate: 148, label: 'SCOPE', stage: 'scope' },
  { id: 'shard-scope-b', path: 'M887 208l23-36 22 27-15 31Z', x: 74, y: -122, rotate: -92, label: 'BOUND', stage: 'scope' },
  { id: 'shard-evidence-a', path: 'M953 218l46-9-2 38-38 13Z', x: 260, y: -31, rotate: 92, label: 'EVIDENCE', stage: 'evidence' },
  { id: 'shard-evidence-b', path: 'M969 258l31 5-8 30-29-8Z', x: 326, y: -2, rotate: -143, label: 'SOURCE', stage: 'evidence' },
  { id: 'shard-constraint-a', path: 'M931 274l41-5 8 35-46 14Z', x: 298, y: 24, rotate: 186, label: 'CONSTRAINT', stage: 'constraint' },
  { id: 'shard-constraint-b', path: 'M965 296l23 8-13 24-26-9Z', x: 350, y: 65, rotate: -208, label: 'SIGNAL', stage: 'constraint' },
  { id: 'shard-intervention-a', path: 'M944 336l38 11-20 37-35-18Z', x: 245, y: 104, rotate: 132, label: 'INTERVENE', stage: 'intervention' },
  { id: 'shard-intervention-b', path: 'M886 319l27 12-18 31-23-14Z', x: 108, y: 72, rotate: 215, label: 'REUSE', stage: 'intervention' },
  { id: 'shard-verification-a', path: 'M905 386l28 18-31 29-22-25Z', x: 144, y: 130, rotate: -118, label: 'VERIFY', stage: 'verification' },
  { id: 'shard-verification-b', path: 'M942 385l31 17-25 25-29-20Z', x: 238, y: 148, rotate: 168, label: 'PROOF', stage: 'verification' }
];

export const systemSummary = {
  scopes: auditScopes.length,
  evidenceRecords: auditScopes.reduce((total, scope) => total + scope.evidence.length, 0),
  questions: auditScopes.reduce((total, scope) => total + scope.questions.length, 0),
  findings: findings.length,
  rankedAdjustments: 18,
  includedPlanItems: planItems.filter((item) => item.status === 'included').length,
  unknowns: auditScopes.reduce((total, scope) => total + scope.evidence.filter((record) => record.state === 'UNKNOWN').length, 0)
} as const;

function requireFirst<T>(values: readonly T[], label: string): T {
  const first = values.at(0);
  if (first === undefined) throw new Error(`Wale model requires at least one ${label}.`);
  return first;
}

export const defaultWorkbenchStage = requireFirst(workbenchStages, 'workbench stage');
export const defaultAuditScope = requireFirst(auditScopes, 'audit scope');
export const defaultFinding = requireFirst(findings, 'finding');
export const defaultPlanItem = requireFirst(planItems, 'plan item');

export const decorativeIcons = {
  activity: Activity,
  braces: Braces,
  boxes: Boxes,
  file: FileCode2,
  stack: FileStack,
  gauge: Gauge,
  branch: GitBranch,
  list: ListChecks,
  package: PackageSearch,
  plug: PlugZap,
  radar: Radar,
  route: Route,
  shield: ShieldCheck,
  workflow: Workflow
} as const;
