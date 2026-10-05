'use client';

import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowDown, Pause, Play } from 'lucide-react';
import { abyssBubbles, abyssContract, abyssCopy, abyssLogRows } from './abyss-model';
import { specimenForDecision } from './precision-model';
import { SablefinSpecimen } from './sablefin-specimen';
import { WaleMark } from './wale-mark';
import styles from './abyss.module.css';

interface AbyssArrivalProps {
  reducedMotion: boolean;
  transitioning: boolean;
  onEnter: (skipMotion?: boolean) => void;
}

type BubbleStyle = CSSProperties & {
  '--bubble-x': string;
  '--bubble-size': string;
  '--bubble-duration': string;
  '--bubble-delay': string;
  '--bubble-drift': string;
  '--bubble-opacity': number;
};

type LogStyle = CSSProperties & {
  '--log-x': string;
  '--log-duration': string;
  '--log-delay': string;
};

export function AbyssArrival({ reducedMotion, transitioning, onEnter }: AbyssArrivalProps) {
  const [paused, setPaused] = useState(false);
  const [settled, setSettled] = useState(false);
  const entryAvailable = reducedMotion || settled;
  const motionState = reducedMotion ? 'reduced' : paused ? 'paused' : 'playing';

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setTimeout(() => setSettled(true), abyssContract.entryAvailableMs);
    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  useEffect(() => {
    if (!entryAvailable || transitioning) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowDown') return;
      event.preventDefault();
      onEnter(paused);
    };
    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY < 24) return;
      event.preventDefault();
      onEnter(paused);
    };
    window.addEventListener('keydown', handleKey);
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [entryAvailable, onEnter, paused, transitioning]);

  return (
    <section className={styles.root} data-motion={motionState} data-handoff={transitioning} aria-labelledby="abyss-heading">
      <div className={styles.depthField} aria-hidden="true">
        <i /><i /><i />
      </div>

      <div className={styles.bubbleField} aria-hidden="true">
        {abyssBubbles.map((bubble) => (
          <span
            key={bubble.id}
            style={{
              '--bubble-x': `${bubble.x}%`,
              '--bubble-size': `${bubble.size}px`,
              '--bubble-duration': `${bubble.duration}s`,
              '--bubble-delay': `${bubble.delay}s`,
              '--bubble-drift': `${bubble.drift}px`,
              '--bubble-opacity': bubble.opacity
            } as BubbleStyle}
          />
        ))}
      </div>

      <div className={styles.logField} aria-hidden="true">
        {abyssLogRows.map((row) => (
          <p
            key={row.id}
            style={{
              '--log-x': `${row.x}%`,
              '--log-duration': `${row.duration}s`,
              '--log-delay': `${row.delay}s`
            } as LogStyle}
          >
            <span>{row.id}</span><b>{row.stage}</b><em>{row.detail}</em>
          </p>
        ))}
      </div>

      <header className={styles.header}>
        <div className={styles.smallBrand} aria-label="Wale by MBMApps">
          <span className={styles.smallMark} aria-hidden="true"><WaleMark /></span>
          <span><strong>WALE</strong><small>BY MBMAPPS</small></span>
        </div>
        <span className={styles.localBadge}><i aria-hidden="true" /> LOCAL-FIRST DEVELOPMENT INTELLIGENCE</span>
      </header>

      <div className={styles.hero}>
        <div className={styles.heroBrand} aria-hidden="true">
          <span><WaleMark /></span>
          <strong>WALE</strong>
          <small>BY MBMAPPS</small>
        </div>
        <p className={styles.eyebrow}>{abyssCopy.eyebrow}</p>
        <h1 id="abyss-heading">
          <span>{abyssCopy.primary}</span>
          <strong>{abyssCopy.payoff}</strong>
        </h1>
        <p className={styles.support}>{abyssCopy.support}</p>
      </div>

      <div className={styles.sablefinTrack} aria-label="SABLEFIN SF-01 crosses the illustrative sequence from lower left to upper right">
        <SablefinSpecimen state={specimenForDecision(500, true)} ambient />
      </div>
      <div className={styles.handoffAperture} aria-hidden="true"><i /></div>

      <p className={styles.srSummary}>Illustrative sample signals observe a requirement, bind constraints, compare interventions, verify evidence, and retain operator authority.</p>

      <div className={styles.entrySlot} data-available={entryAvailable} aria-hidden={!entryAvailable}>
        <button type="button" onClick={() => onEnter(paused)} disabled={transitioning} tabIndex={entryAvailable ? 0 : -1}>
          <span>{transitioning ? 'ENTERING WALE' : 'ENTER WALE'}</span><ArrowDown aria-hidden="true" />
        </button>
      </div>

      <p className={styles.boundary}>{abyssCopy.boundary}</p>
      <button
        className={styles.motionControl}
        type="button"
        onClick={() => setPaused((current) => !current)}
        disabled={reducedMotion || transitioning}
        aria-pressed={paused}
        aria-label={reducedMotion ? 'Motion disabled by reduced-motion preference' : transitioning ? 'Arrival transition active' : paused ? 'Play arrival motion' : 'Pause arrival motion'}
      >
        {reducedMotion ? <Pause aria-hidden="true" /> : paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
        <span>{reducedMotion ? 'Motion reduced' : paused ? 'Play motion' : 'Pause motion'}</span>
      </button>
    </section>
  );
}
