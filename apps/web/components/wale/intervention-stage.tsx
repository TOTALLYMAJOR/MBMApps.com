import {
  ArrowDown,
  ArrowUp,
  Check,
  CirclePause,
  Clock3,
  RotateCcw,
  ShieldCheck,
  Wrench
} from 'lucide-react';
import { auditScopes, defaultAuditScope, defaultFinding, defaultPlanItem, findings, planItems } from './model';
import type { PlanStatus } from './types';
import styles from './workbench.module.css';

interface InterventionStageProps {
  activeFindingId: string;
  planStatuses: Readonly<Record<string, PlanStatus>>;
  onSetPlanStatus: (id: string, status: PlanStatus) => void;
}

export function InterventionStage({ activeFindingId, planStatuses, onSetPlanStatus }: InterventionStageProps) {
  const includedCount = planItems.filter((item) => planStatuses[item.id] === 'included').length;
  const candidateCount = planItems.filter((item) => planStatuses[item.id] === 'candidate').length;
  const heldCount = planItems.filter((item) => planStatuses[item.id] === 'held').length;
  const contextFinding = findings.find((finding) => finding.id === activeFindingId) ?? defaultFinding;
  const contextPlan = planItems.find((item) => item.findingId === contextFinding.id) ?? defaultPlanItem;

  return (
    <div className={styles.interventionStage}>
      <section className={styles.planSummary} aria-labelledby="plan-summary-title">
        <div className={styles.contentTopline}>
          <span>wale://sample/intervention-plan</span>
          <span>operator editable</span>
        </div>
        <div className={styles.planSummaryBody}>
          <header className={styles.contentHeader}>
            <span className={styles.largeIcon} aria-hidden="true"><Wrench /></span>
            <div>
              <p>Bounded intervention plan</p>
              <h3 id="plan-summary-title">Change less. Prove more.</h3>
            </div>
          </header>
          <p className={styles.contentDescription}>
            The plan starts with reuse and reconnection. New capability remains the last rung, not the default answer.
          </p>

          <aside className={styles.contextThread} aria-label="Selected finding carried into intervention">
            <span>Selected thread · finding {String(contextFinding.rank).padStart(2, '0')}</span>
            <strong>{contextFinding.title}</strong>
            <p>{contextPlan.title}</p>
          </aside>

          <dl className={styles.planCounts}>
            <div data-status="included"><dt>Included</dt><dd>{String(includedCount).padStart(2, '0')}</dd></div>
            <div data-status="candidate"><dt>Candidate</dt><dd>{String(candidateCount).padStart(2, '0')}</dd></div>
            <div data-status="held"><dt>Held</dt><dd>{String(heldCount).padStart(2, '0')}</dd></div>
          </dl>

          <div className={styles.interventionLadder}>
            <span>01 Reuse effective capability</span>
            <span>02 Correct configuration</span>
            <span>03 Remove duplication</span>
            <span>04 Extend existing capability</span>
            <span>05 Apply reusable pattern</span>
            <span>06 Create only if necessary</span>
          </div>

          <aside className={styles.planAuthority}>
            <ShieldCheck aria-hidden="true" />
            <p><strong>Plan state is advisory.</strong> Inclusion prepares a reviewable proposal; it does not authorize implementation.</p>
          </aside>
        </div>
      </section>

      <section className={styles.planBoard} aria-labelledby="plan-board-title">
        <div className={styles.planBoardHeader}>
          <div><p>Recommended sequence</p><h4 id="plan-board-title">Operator plan</h4></div>
          <span>{includedCount} selected</span>
        </div>
        <div className={styles.planItems}>
          {planItems.map((item) => {
            const status = planStatuses[item.id] ?? item.status;
            const scope = auditScopes.find((candidate) => candidate.id === item.scopeId) ?? defaultAuditScope;
            const ScopeIcon = scope.icon;
            return (
              <article key={item.id} data-status={status} data-context={item.findingId === activeFindingId ? 'true' : 'false'}>
                <div className={styles.planOrder}>
                  <span>{String(item.order).padStart(2, '0')}</span>
                  <i />
                </div>
                <div className={styles.planItemBody}>
                  <header>
                    <span><ScopeIcon aria-hidden="true" /> {scope.shortLabel}</span>
                    <PlanStatusLabel status={status} />
                  </header>
                  <h5>{item.title}</h5>
                  <p>{item.mechanism}</p>
                  <dl>
                    <div><dt>Why now</dt><dd>{item.reason}</dd></div>
                    <div><dt>Cost</dt><dd>{item.cost}</dd></div>
                    <div><dt>Authority</dt><dd>{item.authority}</dd></div>
                    <div><dt>Rollback</dt><dd>{item.rollback}</dd></div>
                    <div className={styles.planVerification}><dt>Verification</dt><dd>{item.verification}</dd></div>
                  </dl>
                  <div className={styles.planItemActions} aria-label={`Set status for ${item.title}`}>
                    <button
                      type="button"
                      className={status === 'included' ? styles.planActionActive : undefined}
                      onClick={() => onSetPlanStatus(item.id, 'included')}
                      aria-pressed={status === 'included'}
                    ><Check aria-hidden="true" /> Include</button>
                    <button
                      type="button"
                      className={status === 'candidate' ? styles.planActionActive : undefined}
                      onClick={() => onSetPlanStatus(item.id, 'candidate')}
                      aria-pressed={status === 'candidate'}
                    ><Clock3 aria-hidden="true" /> Candidate</button>
                    <button
                      type="button"
                      className={status === 'held' ? styles.planActionActive : undefined}
                      onClick={() => onSetPlanStatus(item.id, 'held')}
                      aria-pressed={status === 'held'}
                    ><CirclePause aria-hidden="true" /> Hold</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <footer className={styles.planBoardFooter}>
          <span><RotateCcw aria-hidden="true" /> Every item retains rollback.</span>
          <span><ArrowDown aria-hidden="true" /> Sequence follows dependency, not visual rank.</span>
          <span><ArrowUp aria-hidden="true" /> Owner can hold any item.</span>
        </footer>
      </section>
    </div>
  );
}

function PlanStatusLabel({ status }: { status: PlanStatus }) {
  return <span className={styles.planStatus} data-status={status}>{status}</span>;
}
