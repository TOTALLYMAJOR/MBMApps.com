import type { CSSProperties } from 'react';
import { evidenceEvents } from './precision-model';
import styles from './precision.module.css';

interface EvidenceReaderProps {
  active: boolean;
}

export function EvidenceReader({ active }: EvidenceReaderProps) {
  return (
    <section className={styles.reader} data-active={active} aria-label="Sample run black-box evidence reader">
      <header className={styles.readerHeader}>
        <span className={styles.readerLamp} aria-hidden="true" />
        <div><b>WALE / BLACK-BOX READER</b><small aria-live="polite" aria-atomic="true">{active ? 'EVIDENCE CHANNEL ACTIVE' : 'STANDBY · CHANGE A DECISION TO ACTIVATE'}</small></div>
      </header>
      <div className={styles.readerBoundary}>
        <span>SAMPLE RUN</span><span>SAME REQUIREMENT</span><span>EXACT STARTING SNAPSHOT</span>
      </div>
      <ol className={styles.readerEvents} aria-hidden={!active} aria-label="Deterministic sample evidence events">
        {evidenceEvents.map((event, index) => (
          <li key={event.time} style={{ '--event-index': index } as CSSProperties}>
            <time>{event.time}</time><b>{event.stage}</b><span>{event.message}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
