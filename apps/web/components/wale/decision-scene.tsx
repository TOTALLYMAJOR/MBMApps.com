import { useEffect, useId, useState } from 'react';
import type { ChangeEvent } from 'react';
import { ArrowRight, GitCompareArrows } from 'lucide-react';
import { EvidenceReader } from './evidence-reader';
import {
  budgetAnchors,
  budgetFromSlider,
  budgetProjection,
  heroCopy,
  sliderFromBudget,
  specimenForDecision
} from './precision-model';
import { SablefinSpecimen } from './sablefin-specimen';
import styles from './precision.module.css';

interface DecisionSceneProps {
  budget: number;
  preserveArchitecture: boolean;
  interacted: boolean;
  onBudgetChange: (value: number) => void;
  onArchitectureChange: (preserve: boolean) => void;
  onRun: () => void;
  onComparePreset: () => void;
}

export function DecisionScene({
  budget,
  preserveArchitecture,
  interacted,
  onBudgetChange,
  onArchitectureChange,
  onRun,
  onComparePreset
}: DecisionSceneProps) {
  const sliderId = useId();
  const numericId = useId();
  const [detailBudget, setDetailBudget] = useState(budget);
  const [projectionBudget, setProjectionBudget] = useState(budget);
  useEffect(() => {
    const detailTimer = window.setTimeout(() => setDetailBudget(budget), 120);
    const projectionTimer = window.setTimeout(() => setProjectionBudget(budget), 180);
    return () => {
      window.clearTimeout(detailTimer);
      window.clearTimeout(projectionTimer);
    };
  }, [budget]);
  const projection = budgetProjection(projectionBudget);
  const specimen = specimenForDecision(budget, preserveArchitecture);
  const settledSpecimen = specimenForDecision(detailBudget, preserveArchitecture);
  const updateSlider = (event: ChangeEvent<HTMLInputElement>) => onBudgetChange(budgetFromSlider(Number(event.target.value)));
  const updateNumeric = (event: ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value);
    if (Number.isFinite(next)) onBudgetChange(Math.max(1, Math.min(10_000, Math.round(next))));
  };

  return (
    <section className={styles.decisionScene} aria-labelledby="wale-hero-title">
      <div className={styles.decisionScroll}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{heroCopy.eyebrow}</p>
          <h1 id="wale-hero-title">
            <span>{heroCopy.primary}</span>
            <strong>{heroCopy.payoff}</strong>
          </h1>
          <p className={styles.heroSupport}>{heroCopy.support}</p>
          <p className={styles.invitation}>{heroCopy.invitation}</p>
        </div>

        <div className={styles.specimenStage}>
          <div className={styles.stageCalibration} aria-hidden="true"><span>Y 038.20</span><span>OPTICAL DATUM / 01</span><span>±0.04</span></div>
          <SablefinSpecimen state={specimen} />
          <dl className={styles.morphReadout} aria-label="Live specimen morphology">
            <div><dt>PLATES</dt><dd>{settledSpecimen.plates}</dd></div>
            <div><dt>BRANCHES</dt><dd>{settledSpecimen.branches}</dd></div>
            <div><dt>DATUMS</dt><dd>{settledSpecimen.measurements}</dd></div>
            <div><dt>REACH</dt><dd>{Math.round(settledSpecimen.reach * 100)}%</dd></div>
          </dl>
        </div>

        <section className={styles.decisionControls} aria-label="Engineering decision controls">
          <header className={styles.controlHeader}>
            <div><span>DECISION / 01</span><h2>CHANGE BUDGET</h2></div>
            <output htmlFor={sliderId} aria-live="polite"><strong>{budget.toLocaleString()}</strong><span>MAX ELIGIBLE CHANGED SOURCE LOC</span></output>
          </header>
          <label className={styles.srOnly} htmlFor={sliderId}>Maximum eligible changed source lines of code</label>
          <input
            id={sliderId}
            className={styles.budgetRange}
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={sliderFromBudget(budget)}
            onChange={updateSlider}
            aria-valuetext={`${budget.toLocaleString()} maximum eligible changed source lines of code`}
          />
          <div className={styles.rangeAnchors} aria-hidden="true">
            {budgetAnchors.map((anchor) => <span key={anchor}>{anchor >= 1_000 ? `${anchor / 1_000}K` : anchor}</span>)}
          </div>
          <div className={styles.exactEntry}>
            <label htmlFor={numericId}>EXACT MAXIMUM</label>
            <input id={numericId} type="number" min="1" max="10000" value={budget} onChange={updateNumeric} aria-describedby={`${numericId}-hint`} />
            <span id={`${numericId}-hint`}>1–10,000 LOC</span>
          </div>

          <div className={styles.projection}>
            <div className={styles.projectionTitle}><span>SAMPLE PROJECTION</span><strong>{projection.label}</strong></div>
            <dl>
              <div><dt>FILES</dt><dd>{projection.files}</dd></div>
              <div><dt>EXPECTED SOURCE LOC</dt><dd>~{projection.estimatedLoc.toLocaleString()}</dd></div>
              <div><dt>TRANSACTION</dt><dd>{projection.transactions}</dd></div>
              <div><dt>ARCHITECTURE</dt><dd>{preserveArchitecture ? projection.architecture : 'SECONDARY ABSTRACTION +1'}</dd></div>
            </dl>
          </div>

          {interacted && <div className={styles.afterInteraction} data-visible="true">
            <label className={styles.architectureToggle}>
              <input type="checkbox" checked={preserveArchitecture} onChange={(event) => onArchitectureChange(event.target.checked)} />
              <span className={styles.toggleTrack} aria-hidden="true"><i /></span>
              <span><b>ENGINEERING CONSTRAINT</b><strong>PRESERVE EXISTING ARCHITECTURE</strong></span>
              <em>{preserveArchitecture ? 'ON' : 'OFF'}</em>
            </label>
            <div className={styles.scopeList}>
              <div><b>IN BOUNDS</b>{projection.included.map((item) => <span key={item}>✓ {item}</span>)}</div>
              <div><b>DEFERRED</b>{projection.deferred.length ? projection.deferred.map((item) => <span key={item}>— {item}</span>) : <span>— none in sample projection</span>}</div>
            </div>
          </div>}
        </section>

        <aside className={styles.decisionEvidence}>
          <div className={styles.interactionCopy} data-visible={interacted} aria-hidden={!interacted}>
            <h2>The agent is not the only variable.</h2>
            <p>Task size, constraints, instructions, strategy, and human involvement can all change what gets built.</p>
          </div>
          <EvidenceReader active={interacted} />
        </aside>
      </div>

      {interacted && <footer className={styles.decisionActions} data-visible="true">
        <span className={styles.configurationStatus}><i aria-hidden="true" /> CONFIGURATION READY · {budget.toLocaleString()} LOC · {preserveArchitecture ? 'PRESERVE ARCHITECTURE' : 'OPEN EXECUTION'}</span>
        <div>
          <button className={styles.secondaryAction} type="button" onClick={onComparePreset}><GitCompareArrows aria-hidden="true" /> Compare another</button>
          <button className={styles.primaryAction} type="button" onClick={onRun}>Run this configuration <ArrowRight aria-hidden="true" /></button>
        </div>
      </footer>}
    </section>
  );
}
