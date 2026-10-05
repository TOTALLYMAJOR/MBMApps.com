import { AlertTriangle, ArrowLeft, ArrowRight, LockKeyhole, ShieldCheck } from 'lucide-react';
import type { EvidenceState, WorkbenchStage } from './types';
import styles from './workbench.module.css';

export function EvidenceStateBadge({ state }: { state: EvidenceState }) {
  return (
    <span className={styles.evidenceState} data-state={state.toLowerCase()}>
      <i aria-hidden="true" />
      {state}
    </span>
  );
}

export function TruthBoundary({ compact = false }: { compact?: boolean }) {
  return (
    <div className={styles.truthBoundary} data-compact={compact ? 'true' : 'false'}>
      <LockKeyhole aria-hidden="true" />
      <div>
        <strong>Illustrative product preview</strong>
        <span>Sample repository data. No live connection, filesystem access, or autonomous change.</span>
      </div>
    </div>
  );
}

export function StageFooter({
  stage,
  canGoBack,
  canGoForward,
  onBack,
  onForward
}: {
  stage: WorkbenchStage;
  canGoBack: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onForward: () => void;
}) {
  return (
    <footer className={styles.stageFooter}>
      <div>
        <span>Current command</span>
        <strong>{stage.command}</strong>
      </div>
      <div className={styles.stageFooterActions}>
        {canGoBack ? (
          <button type="button" onClick={onBack}>
            <ArrowLeft aria-hidden="true" /> Previous stage
          </button>
        ) : null}
        {canGoForward ? (
          <button className={styles.stageNext} type="button" onClick={onForward}>
            Continue <ArrowRight aria-hidden="true" />
          </button>
        ) : (
          <a className={styles.stageNext} href="http://127.0.0.1:8787/?start=guided">
            Open local Wale <ArrowRight aria-hidden="true" />
          </a>
        )}
      </div>
    </footer>
  );
}

export function AuthorityCallout({ children }: { children: React.ReactNode }) {
  return (
    <aside className={styles.authorityCallout}>
      <ShieldCheck aria-hidden="true" />
      <div>
        <span>Authority boundary</span>
        <p>{children}</p>
      </div>
    </aside>
  );
}

export function UnknownCallout({ children }: { children: React.ReactNode }) {
  return (
    <aside className={styles.unknownCallout}>
      <AlertTriangle aria-hidden="true" />
      <div>
        <span>Open unknown</span>
        <p>{children}</p>
      </div>
    </aside>
  );
}
