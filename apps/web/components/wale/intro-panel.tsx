import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Crosshair, LockKeyhole } from 'lucide-react';
import { BootTelemetry } from './boot-telemetry';
import { ConstraintBreachScene } from './constraint-breach-scene';
import styles from './intro.module.css';

const systemWords = ['interactive', 'development', 'intelligence'];

interface IntroPanelProps {
  reduceMotion: boolean;
  breachActive: boolean;
  entryButtonRef: React.RefObject<HTMLButtonElement | null>;
  onEnter: () => void;
  onReady: () => void;
}

export function IntroPanel({ reduceMotion, breachActive, entryButtonRef, onEnter, onReady }: IntroPanelProps) {
  useEffect(() => {
    if (breachActive) return;
    const frame = window.requestAnimationFrame(onReady);
    return () => window.cancelAnimationFrame(frame);
  }, [breachActive, onReady]);

  return (
    <motion.section
      key="intro"
      className={styles.intro}
      aria-labelledby="wale-title"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.995 }}
      transition={{ duration: reduceMotion ? 0.05 : 0.4 }}
    >
      <div className={styles.protocolLabel} aria-hidden="true">
        <span>CONSTRAINT BREACH PROTOCOL</span>
        <i />
        <span>BLACK-BOX SAMPLE / 01</span>
      </div>

      <div className={styles.introCopy}>
        <motion.p
          className={styles.eyebrow}
          initial={reduceMotion ? false : { opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          Development systems, made visible
        </motion.p>

        <motion.h1
          id="wale-title"
          initial={reduceMotion ? false : { opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.72, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
        >
          WALE
        </motion.h1>

        <p className={styles.systemLine}>
          <span className={styles.srOnly}>An interactive development intelligence system.</span>
          <span className={styles.systemLineVisual} aria-hidden="true">
            <span>An</span>
            {systemWords.map((word, index) => (
              <motion.span
                key={word}
                className={styles.systemWord}
                data-word={word}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.26 + index * 0.11, ease: [0.16, 1, 0.3, 1] }}
              >
                {word}
              </motion.span>
            ))}
            <span>system.</span>
          </span>
        </p>

        <motion.p
          className={styles.introLede}
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.58, delay: 0.62 }}
        >
          Map the control surface. Separate evidence from assumption. Isolate the constraint.
          Prepare the smallest intervention that keeps the operator in command.
        </motion.p>

        <motion.div
          className={styles.introCoordinates}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.78 }}
          aria-hidden="true"
        >
          <span><Crosshair /> SCOPE 06</span>
          <span>EVIDENCE 24</span>
          <span>ADJUSTMENTS 18</span>
          <span>AUTHORITY OPERATOR</span>
        </motion.div>
      </div>

      <ConstraintBreachScene reduceMotion={reduceMotion} breachActive={breachActive} />
      <BootTelemetry reduceMotion={reduceMotion} />

      <div className={styles.localLaunch}>
        <a href="http://127.0.0.1:8787/?start=guided">
          Open local Wale <ArrowUpRight aria-hidden="true" />
        </a>
        <span><LockKeyhole aria-hidden="true" /> Start local Wale first · loopback only</span>
      </div>

      <button
        ref={entryButtonRef}
        className={styles.entryCue}
        type="button"
        onClick={onEnter}
        aria-label="Enter the Wale product preview"
        aria-describedby="telemetry-boundary"
      >
        <span>{breachActive ? 'CONSTRAINT BREACHED' : 'SCROLL / SWIPE TO ENTER'}</span>
        <ArrowDown aria-hidden="true" />
      </button>

      <p className={styles.motionStatus} aria-live="polite">
        {breachActive ? 'Signal captured. Constraint breached. Opening the illustrative audit workbench.' : ''}
      </p>
    </motion.section>
  );
}
