import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { heroCopy } from './precision-model';
import styles from './precision.module.css';

interface RevealSceneProps {
  onBack: () => void;
  onReplay: () => void;
}

export function RevealScene({ onBack, onReplay }: RevealSceneProps) {
  return (
    <section className={styles.revealScene} aria-labelledby="reveal-title">
      <div className={styles.sceneToolbar}>
        <button type="button" onClick={onBack}><ArrowLeft aria-hidden="true" /> Comparison</button>
        <div><span>INSTRUMENT / WALE</span><strong>DECISION INTELLIGENCE</strong></div>
        <span>{heroCopy.boundary}</span>
      </div>

      <div className={styles.revealBody}>
        <div className={styles.revealGraphic} aria-hidden="true">
          <svg viewBox="0 0 520 520">
            <circle cx="260" cy="260" r="211" /><circle cx="260" cy="260" r="148" /><circle cx="260" cy="260" r="54" />
            <path d="M260 14v78M260 428v78M14 260h78M428 260h78M85 85l56 56M379 379l56 56M435 85l-56 56M141 379l-56 56" />
            <path className={styles.revealTrace} d="M88 328L166 271L235 294L302 203L371 222L438 142" />
            <g><circle cx="88" cy="328" r="8" /><circle cx="166" cy="271" r="8" /><circle cx="235" cy="294" r="8" /><circle cx="302" cy="203" r="8" /><circle cx="371" cy="222" r="8" /><circle cx="438" cy="142" r="8" /></g>
          </svg>
          <div><span>INTENT</span><span>DECISION</span><span>EXECUTION</span><span>EVIDENCE</span></div>
        </div>

        <div className={styles.revealCopy}>
          <p>THE MEASUREMENT, AFTER THE RUN</p>
          <h1 id="reveal-title">THE AGENT ISN&apos;T THE ONLY VARIABLE.</h1>
          <h2>WALE helps you test how engineering decisions change what autonomous agents actually deliver.</h2>
          <p>Change the scope. Change the instructions. Change the constraints. Change the strategy. Measure the result.</p>
          <div className={styles.revealEquation} aria-label="Wale connects intent, decisions, execution, and evidence">
            <span>HUMAN INTENT</span><i>→</i><span>ENGINEERING DECISION</span><i>→</i><span>MEASURED OUTCOME</span>
          </div>
        </div>

        <section className={styles.finalCta}>
          <span>NEXT CONTROLLED RUN</span>
          <h2>NOW TRY YOUR REPOSITORY.</h2>
          <p>Give WALE a real requirement. Explore the decisions around it before committing to the run.</p>
          <div>
            <a className={styles.primaryAction} href="/contact?topic=wale-repository">Connect a repository <ArrowRight aria-hidden="true" /></a>
            <button className={styles.secondaryAction} type="button" onClick={onReplay}><RotateCcw aria-hidden="true" /> Watch the sample again</button>
          </div>
          <small>Connection begins with a local setup review. This illustrative sample has no repository access.</small>
        </section>
      </div>
    </section>
  );
}
