import { ArrowRight, Gauge, GitCompareArrows, ShieldQuestion, Target } from 'lucide-react';
import { auditScopes, defaultAuditScope, defaultFinding, findings, systemSummary } from './model';
import type { AuditScopeId } from './types';
import styles from './workbench.module.css';

interface ConstraintStageProps {
  activeFindingId: string;
  activeFindingIndex: number;
  findingRefs: React.MutableRefObject<Array<HTMLButtonElement | null>>;
  onSelectFinding: (index: number, focus?: boolean) => void;
  onFindingKey: (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => void;
  onJumpToIntervention: () => void;
}

export function ConstraintStage({
  activeFindingId,
  activeFindingIndex,
  findingRefs,
  onSelectFinding,
  onFindingKey,
  onJumpToIntervention
}: ConstraintStageProps) {
  const activeFinding = findings[activeFindingIndex] ?? defaultFinding;
  const scope = auditScopes.find((candidate) => candidate.id === activeFinding.scopeId) ?? defaultAuditScope;
  const ScopeIcon = scope.icon;

  return (
    <div className={styles.constraintStage}>
      <aside className={styles.findingRail} aria-label="Ranked findings">
        <div className={styles.panelLabel}>
          <span>Ranked findings</span>
          <small>{systemSummary.rankedAdjustments} adjustments considered</small>
        </div>
        <div className={styles.findingButtons} role="tablist" aria-label="Ranked constraints">
          {findings.map((finding, index) => {
            const active = finding.id === activeFindingId;
            return (
              <button
                key={finding.id}
                ref={(node) => { findingRefs.current[index] = node; }}
                type="button"
                id={`wale-finding-tab-${finding.id}`}
                role="tab"
                aria-selected={active}
                aria-controls="wale-finding-panel"
                className={active ? styles.findingActive : undefined}
                onClick={() => onSelectFinding(index)}
                onKeyDown={(event) => onFindingKey(event, index)}
                aria-current={active ? 'true' : undefined}
                tabIndex={active ? 0 : -1}
              >
                <span className={styles.findingRank}>{String(finding.rank).padStart(2, '0')}</span>
                <span className={styles.findingButtonCopy}>
                  <small>{scopeLabel(finding.scopeId)} · {finding.severity}</small>
                  <strong>{finding.title}</strong>
                </span>
                <ArrowRight aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </aside>

      <section
        className={styles.findingDetail}
        id="wale-finding-panel"
        role="tabpanel"
        aria-labelledby={`wale-finding-tab-${activeFinding.id}`}
      >
        <p className={styles.srOnly} aria-live="polite">Selected finding: {activeFinding.title}.</p>
        <div className={styles.contentTopline}>
          <span>wale://sample/findings/{activeFinding.rank}</span>
          <span className={styles.severity} data-severity={activeFinding.severity}>{activeFinding.severity}</span>
        </div>
        <div className={styles.contentScroll}>
          <header className={styles.findingHero}>
            <span className={styles.findingTarget} aria-hidden="true"><Target /></span>
            <div>
              <p>Leading constraint analysis · rank {activeFinding.rank}</p>
              <h3>{activeFinding.title}</h3>
              <span className={styles.findingScope}><ScopeIcon aria-hidden="true" /> {scope.label}</span>
            </div>
          </header>

          <div className={styles.diagnosticChain} aria-label="Diagnostic chain">
            <span>Observed condition</span><i /><span>Measured gap</span><i /><span>Constraint</span><i /><span>Intervention</span><i /><span>Verification</span>
          </div>

          <div className={styles.findingNarrative}>
            <article>
              <span><Gauge aria-hidden="true" /> Observed condition</span>
              <p>{activeFinding.condition}</p>
            </article>
            <article>
              <span><GitCompareArrows aria-hidden="true" /> Evidence</span>
              <p>{activeFinding.evidence}</p>
            </article>
            <article className={styles.findingEffect}>
              <span><Target aria-hidden="true" /> Limiting effect</span>
              <p>{activeFinding.effect}</p>
            </article>
            <article>
              <span><ShieldQuestion aria-hidden="true" /> Competing diagnosis</span>
              <p>{activeFinding.competingDiagnosis}</p>
            </article>
          </div>

          <section className={styles.interventionPreview}>
            <div>
              <span>Smallest justified intervention</span>
              <h4>{activeFinding.intervention}</h4>
              <p>{activeFinding.verification}</p>
            </div>
            <button type="button" onClick={onJumpToIntervention}>Review intervention <ArrowRight aria-hidden="true" /></button>
          </section>

          <div className={styles.riskStrip}>
            <div><span>Confidence</span><strong>{activeFinding.confidence}</strong></div>
            <div><span>Residual risk</span><strong>{activeFinding.residualRisk}</strong></div>
          </div>
        </div>
      </section>
    </div>
  );
}

function scopeLabel(scopeId: AuditScopeId) {
  return auditScopes.find((scope) => scope.id === scopeId)?.shortLabel ?? scopeId;
}
