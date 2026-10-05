import { specimenForDecision } from './precision-model';
import { SablefinSpecimen } from './sablefin-specimen';
import styles from './precision.module.css';

interface PortalTransitionProps {
  budget: number;
  preserveArchitecture: boolean;
}

export function PortalTransition({ budget, preserveArchitecture }: PortalTransitionProps) {
  return (
    <section className={styles.portalScene} aria-label="Configuration bound; entering Run Theater">
      <div className={styles.portalStatus}>
        <span>DECISION / BOUND</span>
        <strong>CONFIGURATION BOUND</strong>
        <p>{budget.toLocaleString()} MAX LOC · {preserveArchitecture ? 'PRESERVE EXISTING ARCHITECTURE' : 'OPEN EXECUTION'}</p>
      </div>
      <div className={styles.portalSpecimen}><SablefinSpecimen state={specimenForDecision(budget, preserveArchitecture)} compact /></div>
      <div className={styles.portalGeometry} aria-hidden="true">
        <i /><i /><i /><i />
        <span>RUN THEATER</span>
      </div>
      <p className={styles.portalBoundary}>ILLUSTRATIVE RUN · SAMPLE REPOSITORY</p>
    </section>
  );
}
