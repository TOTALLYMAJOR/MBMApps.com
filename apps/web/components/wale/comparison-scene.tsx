'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowLeft, ArrowRight, Scale } from 'lucide-react';
import { comparisonRows, heroCopy, specimenForDecision } from './precision-model';
import { SablefinSpecimen } from './sablefin-specimen';
import styles from './precision.module.css';

interface ComparisonSceneProps {
  onBack: () => void;
  onReveal: () => void;
}

export function ComparisonScene({ onBack, onReveal }: ComparisonSceneProps) {
  const [resultsVisible, setResultsVisible] = useState(false);
  const resultsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (resultsVisible) resultsRef.current?.focus({ preventScroll: true });
  }, [resultsVisible]);
  return (
    <section className={styles.comparisonScene} aria-labelledby="comparison-title">
      <div className={styles.sceneToolbar}>
        <button type="button" onClick={onBack}><ArrowLeft aria-hidden="true" /> Run theater</button>
        <div><span>CONTROLLED COMPARISON</span><strong>PARALLEL FUTURES</strong></div>
        <span>{heroCopy.boundary}</span>
      </div>

      <div className={styles.comparisonScroll}>
        <header className={styles.comparisonHeading}>
          <p>EXPERIMENT / 02</p>
          <h1 id="comparison-title">WHAT IF YOU HAD MADE A DIFFERENT DECISION?</h1>
          <div><span>SAME REQUIREMENT</span><i aria-hidden="true" /><span>SAME STARTING SNAPSHOT</span></div>
        </header>

        <div className={styles.parallelRuns}>
          <article className={styles.runCandidate}>
            <header><span>RUN A · SF-01A</span><strong>500 LOC</strong><em>PRESERVE ARCHITECTURE</em></header>
            <SablefinSpecimen state={specimenForDecision(500, true)} variant="SF-01A" compact />
            <div className={styles.runProgress} aria-label="Run A stages"><span>PLAN</span><span>EXECUTE</span><span>VERIFY</span><span>RESULT</span></div>
            <p><i aria-hidden="true" /> VERIFIED · 00:53</p>
          </article>
          <div className={styles.comparisonAxis} aria-hidden="true"><span>A</span><i /><Scale /><i /><span>B</span></div>
          <article className={styles.runCandidate}>
            <header><span>RUN B · SF-01B</span><strong>5,000 LOC</strong><em>OPEN EXECUTION</em></header>
            <SablefinSpecimen state={specimenForDecision(5_000, false)} variant="SF-01B" compact />
            <div className={styles.runProgress} aria-label="Run B stages"><span>PLAN</span><span>EXECUTE</span><span>VERIFY</span><span>RESULT</span></div>
            <p><i aria-hidden="true" /> COMPLETED WITH GAPS · 01:41</p>
          </article>
        </div>

        {!resultsVisible ? (
          <div className={styles.comparePrompt}>
            <p>Both controlled runs have completed. Open the measurement surface before drawing a conclusion.</p>
            <button type="button" className={styles.primaryAction} onClick={() => setResultsVisible(true)}>Compare evidence <ArrowRight aria-hidden="true" /></button>
          </div>
        ) : (
          <section ref={resultsRef} tabIndex={-1} className={styles.comparisonResults} aria-label="Controlled sample comparison results">
            <header><span>MEASURED RESULT</span><b>RUN A</b><b>RUN B</b></header>
            <div className={styles.resultRows}>
              {comparisonRows.map((row, index) => (
                <div key={row.label} style={{ '--row-index': index } as CSSProperties}>
                  <span>{row.label}</span><strong>{row.runA}</strong><strong>{row.runB}</strong>
                </div>
              ))}
            </div>
            <div className={styles.comparisonConclusion}>
              <p>BOTH COMPLETED THE REQUIREMENT.</p>
              <h2>RUN A REQUIRED LESS CHANGE, LESS REWORK, AND FEWER HUMAN INTERRUPTIONS IN THIS CASE.</h2>
              <small>Controlled sample only. The evidence supports this case, not a universal strategy ranking.</small>
              <button className={styles.primaryAction} type="button" onClick={onReveal}>What WALE measures <ArrowRight aria-hidden="true" /></button>
            </div>
          </section>
        )}
      </div>
    </section>
  );
}
