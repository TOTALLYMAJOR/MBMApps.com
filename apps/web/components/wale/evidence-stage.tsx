import { AlertTriangle, Check, CircleDashed, Database, FileSearch, ShieldCheck } from 'lucide-react';
import { auditScopes, defaultAuditScope, systemSummary } from './model';
import { EvidenceStateBadge, TruthBoundary } from './shared';
import type { AuditScopeId, EvidenceState } from './types';
import styles from './workbench.module.css';

const evidenceStates: readonly EvidenceState[] = [
  'AVAILABLE',
  'CONFIGURED',
  'ENFORCED',
  'OBSERVED',
  'VERIFIED',
  'UNKNOWN'
];

interface EvidenceStageProps {
  activeScopeId: AuditScopeId;
  onSelectScope: (index: number) => void;
}

export function EvidenceStage({ activeScopeId, onSelectScope }: EvidenceStageProps) {
  const activeIndex = Math.max(0, auditScopes.findIndex((scope) => scope.id === activeScopeId));
  const activeScope = auditScopes[activeIndex] ?? defaultAuditScope;

  const counts = evidenceStates.map((state) => ({
    state,
    count: auditScopes.reduce((total, scope) => total + scope.evidence.filter((record) => record.state === state).length, 0)
  }));

  return (
    <div className={styles.evidenceStage}>
      <section className={styles.evidenceOverview} aria-labelledby="evidence-overview-title">
        <div className={styles.contentTopline}>
          <span>wale://sample/evidence-ledger</span>
          <span>{systemSummary.evidenceRecords} records</span>
        </div>
        <div className={styles.evidenceOverviewBody}>
          <header className={styles.contentHeader}>
            <span className={styles.largeIcon} aria-hidden="true"><Database /></span>
            <div>
              <p>Evidence ledger</p>
              <h3 id="evidence-overview-title">State is not a ladder.</h3>
            </div>
          </header>
          <p className={styles.contentDescription}>
            Each state answers a different question. Installed does not mean configured. Configured does not mean enforced.
            Observed does not mean effective. Unknown stays visible.
          </p>

          <div className={styles.evidenceStateGrid}>
            {counts.map(({ state, count }) => (
              <article key={state} data-state={state.toLowerCase()}>
                <span>{state}</span>
                <strong>{String(count).padStart(2, '0')}</strong>
                <small>{evidenceStateDescription(state)}</small>
              </article>
            ))}
          </div>

          <TruthBoundary />
        </div>
      </section>

      <section className={styles.evidenceLedger} aria-labelledby="evidence-ledger-title">
        <div className={styles.evidenceScopeTabs} aria-label="Evidence category">
          {auditScopes.map((scope, index) => {
            const Icon = scope.icon;
            const active = scope.id === activeScope.id;
            return (
              <button
                key={scope.id}
                type="button"
                aria-pressed={active}
                className={active ? styles.evidenceTabActive : undefined}
                onClick={() => onSelectScope(index)}
              >
                <Icon aria-hidden="true" />
                <span>{scope.shortLabel}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.ledgerHeader}>
          <div>
            <p>Selected ledger</p>
            <h4 id="evidence-ledger-title">{activeScope.label}</h4>
          </div>
          <EvidenceStateBadge state={activeScope.state} />
        </div>

        <div className={styles.ledgerRows}>
          {activeScope.evidence.map((record) => (
            <article key={record.id}>
              <div className={styles.recordStateIcon} data-state={record.state.toLowerCase()} aria-hidden="true">
                {record.state === 'UNKNOWN' ? <AlertTriangle /> : record.state === 'VERIFIED' ? <ShieldCheck /> : <Check />}
              </div>
              <div className={styles.recordMain}>
                <div><h5>{record.label}</h5><EvidenceStateBadge state={record.state} /></div>
                <strong>{record.value}</strong>
                <p>{record.caveat}</p>
              </div>
              <dl>
                <div><dt>Source</dt><dd>{record.source}</dd></div>
                <div><dt>Observed</dt><dd>{record.observedAt}</dd></div>
              </dl>
            </article>
          ))}
        </div>

        <footer className={styles.ledgerFooter}>
          <FileSearch aria-hidden="true" />
          <span>Evidence remains attached to its source and caveat.</span>
          <span><CircleDashed aria-hidden="true" /> {systemSummary.unknowns} explicit unknowns</span>
        </footer>
      </section>
    </div>
  );
}

function evidenceStateDescription(state: EvidenceState) {
  switch (state) {
    case 'AVAILABLE': return 'Present in the represented environment.';
    case 'CONFIGURED': return 'Bound to a declared path or setting.';
    case 'ENFORCED': return 'Applied by a represented control.';
    case 'OBSERVED': return 'Seen during the sample assessment.';
    case 'VERIFIED': return 'Checked against a defined expectation.';
    case 'UNKNOWN': return 'Not established by available evidence.';
  }
}
