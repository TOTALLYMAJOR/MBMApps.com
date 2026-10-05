'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { IntroPanel } from './intro-panel';
import { useWaleExperience } from './use-wale-experience';
import { Workbench } from './workbench';
import styles from '../wale-launch.module.css';

export function WaleExperience() {
  const reduceMotion = useHydrationStableReducedMotion();
  const controller = useWaleExperience(reduceMotion);
  const touchStartY = useRef<number | null>(null);

  return (
    <div
      className={`${styles.root} wale-launch-root`}
      onWheel={(event) => {
        if (event.deltaY > 14) controller.enterWorkbench();
      }}
      onTouchStart={(event) => {
        touchStartY.current = event.touches[0]?.clientY ?? null;
      }}
      onTouchEnd={(event) => {
        const startY = touchStartY.current;
        const endY = event.changedTouches[0]?.clientY;
        touchStartY.current = null;
        if (startY !== null && endY !== undefined && startY - endY > 36) controller.enterWorkbench();
      }}
    >
      <WaleHeader onReturn={controller.returnToIntro} />
      <div className={styles.viewport}>
        <AnimatePresence mode="wait" initial={false}>
          {controller.panel === 'intro' ? (
            <IntroPanel
              reduceMotion={reduceMotion}
              breachActive={controller.breachActive}
              entryButtonRef={controller.entryButtonRef}
              onEnter={controller.enterWorkbench}
              onReady={() => controller.entryButtonRef.current?.focus()}
            />
          ) : (
            <Workbench
              reduceMotion={reduceMotion}
              controller={controller}
              stageRefs={controller.stageRefs}
              scopeRefs={controller.scopeRefs}
              findingRefs={controller.findingRefs}
              workbenchTitleRef={controller.workbenchTitleRef}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

function useHydrationStableReducedMotion() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPreference = () => setReduceMotion(media.matches);
    syncPreference();
    media.addEventListener('change', syncPreference);
    return () => media.removeEventListener('change', syncPreference);
  }, []);

  return reduceMotion;
}

function WaleHeader({ onReturn }: { onReturn: () => void }) {
  return (
    <header className={styles.header}>
      <button className={styles.brand} type="button" onClick={onReturn} aria-label="Return to Wale introduction">
        <span className={styles.brandMark} aria-hidden="true"><WaleMark /></span>
        <span><strong>WALE</strong><small>by MBMApps</small></span>
      </button>
      <span className={styles.localBadge}><i aria-hidden="true" /> Local-first development intelligence</span>
    </header>
  );
}

function WaleMark() {
  return (
    <svg viewBox="0 0 48 48" role="presentation">
      <path d="M5 11c8 1 14 6 19 14 5-8 11-13 19-14-2 10-6 17-13 21l-6 5-6-5C11 28 7 21 5 11Z" />
      <path d="M24 25v12" />
    </svg>
  );
}
