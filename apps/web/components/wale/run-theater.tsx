'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, GitCompareArrows, X } from 'lucide-react';
import type { BoundRun } from './precision-model';
import { heroCopy, intentTrace, specimenForDecision } from './precision-model';
import { SablefinSpecimen } from './sablefin-specimen';
import styles from './precision.module.css';

interface RunTheaterProps {
  budget: number;
  preserveArchitecture: boolean;
  run: BoundRun;
  paused: boolean;
  reducedMotion: boolean;
  onBack: () => void;
  onAlternative: () => void;
}

export function RunTheater({ budget, preserveArchitecture, run, paused, reducedMotion, onBack, onAlternative }: RunTheaterProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [traceOpen, setTraceOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const theaterRef = useRef<HTMLElement>(null);
  const activeEvent = run.events[activeIndex] ?? run.events[0];
  const completed = activeIndex === run.events.length - 1;

  useEffect(() => {
    if (paused || reducedMotion || completed) return;
    const timer = window.setTimeout(() => setActiveIndex((current) => Math.min(current + 1, run.events.length - 1)), 900);
    return () => window.clearTimeout(timer);
  }, [activeIndex, completed, paused, reducedMotion, run.events.length]);

  useEffect(() => {
    if (traceOpen) closeRef.current?.focus();
  }, [traceOpen]);

  const closeTrace = () => {
    setTraceOpen(false);
  };

  return (
    <section ref={theaterRef} className={styles.theaterScene} aria-labelledby="run-theater-title">
      <div className={styles.sceneToolbar}>
        <button type="button" onClick={onBack}><ArrowLeft aria-hidden="true" /> Decisions</button>
        <div><span>BOUND SAMPLE RUN</span><strong>{run.variant}</strong></div>
        <span>{heroCopy.boundary}</span>
      </div>

      <div className={styles.theaterScroll}>
        <header className={styles.theaterHeading}>
          <p>RUN THEATER · WLR-82A91</p>
          <h1 id="run-theater-title">WATCH THE DECISIONS BECOME SOFTWARE.</h1>
          <span>Every meaningful change remains connected to the requirement, constraint, verification, and evidence that produced it.</span>
        </header>

        <nav className={styles.runTimeline} aria-label="Sample run stages">
          {run.events.map((event, index) => (
            <button
              key={event.stage}
              type="button"
              className={index === activeIndex ? styles.timelineActive : ''}
              aria-current={index === activeIndex ? 'step' : undefined}
              data-state={index === activeIndex ? 'current' : index < activeIndex ? 'past' : 'future'}
              onClick={() => setActiveIndex(index)}
            >
              <span>{String(index + 1).padStart(2, '0')}</span><b>{event.stage}</b><i aria-hidden="true" />
            </button>
          ))}
        </nav>

        <div className={styles.theaterObject}>
          <SablefinSpecimen
            state={specimenForDecision(budget, preserveArchitecture)}
            activeSurface={activeEvent?.surface}
            onInspect={() => setTraceOpen(true)}
          />
          <div className={styles.eventCard} aria-live="polite">
            <span>{activeEvent?.time} / {activeEvent?.stage}</span>
            <strong>{activeEvent?.title}</strong>
            <p>{activeEvent?.detail}</p>
          </div>
          <dl className={styles.liveEvidence}>
            <div><dt>BOUND</dt><dd>{budget.toLocaleString()} MAX LOC</dd></div>
            <div><dt>DELIVERED</dt><dd>{activeIndex >= 5 ? run.deliveredLoc.toLocaleString() : '—'} LOC</dd></div>
            <div><dt>FILES</dt><dd>{activeIndex >= 3 ? run.files : '—'}</dd></div>
            <div><dt>CHECKS</dt><dd>{activeIndex >= 6 ? run.checks : '—'}</dd></div>
            <div><dt>EVIDENCE GAPS</dt><dd>{activeIndex >= 6 ? run.evidenceGaps : '—'}</dd></div>
          </dl>
        </div>

        <section className={styles.scrubber} aria-label="Run replay scrubber">
          <div><label htmlFor="wale-run-scrubber">REPLAY / {activeEvent?.time}</label><output>{activeEvent?.stage}</output></div>
          <input id="wale-run-scrubber" type="range" min="0" max={run.events.length - 1} step="1" value={activeIndex} onChange={(event) => setActiveIndex(Number(event.target.value))} />
          <div className={styles.scrubberTicks} aria-hidden="true">{run.events.map((event) => <span key={event.stage}>{event.time}</span>)}</div>
        </section>

        <div className={styles.runResult} data-visible={completed} aria-hidden={!completed}>
          <div><span>BOUND RESULT</span><strong>{run.result}</strong><p>{run.summary}</p><small>Result applies to this exact sample run.</small></div>
          <button type="button" className={styles.primaryAction} onClick={onAlternative}>Run an alternative <GitCompareArrows aria-hidden="true" /></button>
        </div>
      </div>

      <AnimatePresence
        initial={false}
        onExitComplete={() => theaterRef.current?.querySelector<HTMLButtonElement>('button[class*="inspectControl"]')?.focus()}
      >
        {traceOpen && (
          <motion.aside
            className={styles.intentTrace}
            role="dialog"
            aria-modal="false"
            aria-labelledby="intent-trace-title"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 8, transition: { duration: 0.16 } }}
            transition={{ duration: reducedMotion ? 0.12 : 0.22 }}
            onKeyDown={(event) => { if (event.key === 'Escape') closeTrace(); }}
          >
            <header><div><span>INTENT TRACE / COMPONENT 04</span><h2 id="intent-trace-title">WHY DOES THIS EXIST?</h2></div><button ref={closeRef} type="button" onClick={closeTrace} aria-label="Close Intent Trace"><X aria-hidden="true" /></button></header>
            <dl>
              <div><dt>LOCATION</dt><dd>{intentTrace.location}</dd></div>
              <div><dt>INTRODUCED BY</dt><dd>RUN {intentTrace.run}</dd></div>
              <div><dt>BECAUSE OF</dt><dd>{intentTrace.requirement}<br />{intentTrace.reason}</dd></div>
              <div><dt>UNDER CONSTRAINT</dt><dd>{preserveArchitecture ? intentTrace.constraint : 'OPEN EXECUTION · SECONDARY ABSTRACTION ALLOWED'}</dd></div>
              <div><dt>VERIFIED BY</dt><dd>{activeIndex >= 6 ? intentTrace.verification : `LATER SAMPLE EVENT · ${intentTrace.verification}`}</dd></div>
              <div><dt>RESULT</dt><dd>{activeIndex >= 6 ? run.result : 'PENDING · NOT CURRENT EVIDENCE'}</dd></div>
            </dl>
          </motion.aside>
        )}
      </AnimatePresence>
    </section>
  );
}
