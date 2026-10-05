import { memo, useEffect, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { Activity, Layers3, LockKeyhole, Pause, RadioTower, RotateCcw } from 'lucide-react';
import { telemetryFrames } from './model';
import styles from './intro.module.css';

export const BootTelemetry = memo(function BootTelemetry({ reduceMotion }: { reduceMotion: boolean }) {
  const controls = useAnimationControls();
  const [playing, setPlaying] = useState(!reduceMotion);
  const [replay, setReplay] = useState(0);

  useEffect(() => {
    controls.stop();
    if (reduceMotion) {
      controls.set({ y: -650 });
      setPlaying(false);
      return;
    }
    let mounted = true;
    setPlaying(true);
    controls.set({ y: 32 });
    void controls.start({ y: -650, transition: { duration: 18, ease: 'linear' } }).then(() => {
      if (mounted) setPlaying(false);
    });
    return () => {
      mounted = false;
      controls.stop();
    };
  }, [controls, reduceMotion, replay]);

  const togglePlayback = () => {
    if (playing) {
      controls.stop();
      setPlaying(false);
      return;
    }
    setReplay((value) => value + 1);
  };

  return (
    <section className={styles.telemetry} aria-labelledby="telemetry-title" aria-describedby="telemetry-boundary">
      <div className={styles.telemetryChrome}>
        <div className={styles.windowSignals} aria-hidden="true"><i /><i /><i /></div>
        <span id="telemetry-title"><RadioTower aria-hidden="true" /> WALE / BLACK-BOX READER</span>
        <button
          className={styles.telemetryPause}
          type="button"
          onClick={togglePlayback}
          aria-label={playing ? 'Hold illustrative log' : 'Replay illustrative log'}
        >
          {playing ? <Pause aria-hidden="true" /> : <RotateCcw aria-hidden="true" />}
          {playing ? 'Hold log' : 'Replay log'}
        </button>
      </div>

      <div className={styles.telemetryBoundary} id="telemetry-boundary">
        <Layers3 aria-hidden="true" />
        <span>Illustrative sequence · sample repository · not a live connection</span>
        <LockKeyhole aria-hidden="true" />
      </div>

      <div className={styles.telemetryWindow}>
        <motion.ol
          className={styles.telemetryTrack}
          initial={false}
          animate={controls}
        >
          {telemetryFrames.map((frame) => (
            <li key={`${frame.time}-${frame.channel}`} data-tone={frame.tone}>
              <time>{frame.time}</time>
              <b>{frame.channel}</b>
              <span>{frame.message}</span>
            </li>
          ))}
        </motion.ol>
        <div className={styles.scanLine} aria-hidden="true" />
      </div>

      <div className={styles.telemetryFooter}>
        <span><Activity aria-hidden="true" /> Sequencing sample signals</span>
        <span>operator authority retained</span>
      </div>
    </section>
  );
});
