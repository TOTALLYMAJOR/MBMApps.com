import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  CircleDashed,
  KeyRound,
  LockKeyhole,
  Play,
  ShieldCheck,
  TerminalSquare
} from 'lucide-react';
import { connectionSteps, defaultFinding, defaultPlanItem, findings, planItems, verificationGates } from './model';
import { TruthBoundary } from './shared';
import styles from './workbench.module.css';

export function VerificationStage({ activeFindingId }: { activeFindingId: string }) {
  const contextFinding = findings.find((finding) => finding.id === activeFindingId) ?? defaultFinding;
  const contextPlan = planItems.find((item) => item.findingId === contextFinding.id) ?? defaultPlanItem;

  return (
    <div className={styles.verificationStage}>
      <section className={styles.verificationMain} aria-labelledby="verification-title">
        <div className={styles.contentTopline}>
          <span>wale://sample/verification-gates</span>
          <span>proof before claim</span>
        </div>
        <div className={styles.verificationBody}>
          <header className={styles.contentHeader}>
            <span className={styles.largeIcon} aria-hidden="true"><ShieldCheck /></span>
            <div>
              <p>Verification contract</p>
              <h3 id="verification-title">Define proof before change.</h3>
            </div>
          </header>
          <p className={styles.contentDescription}>
            Technical completion, hosted readiness, release state, and outcome are separate claims. Each needs its own evidence.
          </p>

          <aside className={styles.contextThread} aria-label="Selected finding carried into verification">
            <span>Proof thread · finding {String(contextFinding.rank).padStart(2, '0')}</span>
            <strong>{contextPlan.title}</strong>
            <p>{contextPlan.verification}</p>
          </aside>

          <div className={styles.verificationGates}>
            {verificationGates.map((gate) => (
              <article key={gate.id} data-status={gate.status}>
                <span className={styles.gateIcon} aria-hidden="true">
                  {gate.status === 'ready' ? <CheckCircle2 /> : gate.status === 'blocked' ? <AlertTriangle /> : <CircleDashed />}
                </span>
                <div>
                  <header><h4>{gate.label}</h4><span>{gate.status}</span></header>
                  <p>{gate.description}</p>
                  <dl>
                    <div><dt>Evidence required</dt><dd>{gate.evidenceRequired}</dd></div>
                    <div><dt>If absent</dt><dd>{gate.failureMeaning}</dd></div>
                  </dl>
                </div>
              </article>
            ))}
          </div>

          <TruthBoundary />
        </div>
      </section>

      <aside className={styles.connectionSequence} aria-labelledby="connection-title">
        <div className={styles.connectionHeader}>
          <span className={styles.connectionIcon} aria-hidden="true"><TerminalSquare /></span>
          <div><p>Local connection</p><h4 id="connection-title">Guided start sequence</h4></div>
        </div>

        <ol>
          {connectionSteps.map((step) => (
            <li key={step.id} data-status={step.status}>
              <div className={styles.connectionStepNumber}><span>{step.number}</span><i /></div>
              <article>
                <header><h5>{step.label}</h5><span>{step.status}</span></header>
                <p>{step.description}</p>
                <dl>
                  <div><dt>Operator</dt><dd>{step.operatorAction}</dd></div>
                  <div><dt>System</dt><dd>{step.systemAction}</dd></div>
                </dl>
                <small><LockKeyhole aria-hidden="true" /> {step.boundary}</small>
              </article>
            </li>
          ))}
        </ol>

        <p className={styles.linkPrerequisite}>Prerequisite: start the local Wale bridge on port 8787.</p>
        <a className={styles.guidedStart} href="http://127.0.0.1:8787/?start=guided">
          <span><Play aria-hidden="true" /> Start guided Wale</span>
          <ArrowUpRight aria-hidden="true" />
        </a>

        <div className={styles.localBoundaryCard}>
          <KeyRound aria-hidden="true" />
          <div>
            <strong>Loopback boundary</strong>
            <p>The public surface receives bounded status, never ambient filesystem access or secret values.</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
