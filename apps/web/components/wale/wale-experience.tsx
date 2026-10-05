'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Pause, Play } from 'lucide-react';
import { AbyssArrival } from './abyss-arrival';
import { abyssContract, entryTarget, viewportFocusTarget, viewportPresenceMode } from './abyss-model';
import type { LandingViewport } from './abyss-model';
import { ComparisonScene } from './comparison-scene';
import { DecisionScene } from './decision-scene';
import { PortalTransition } from './portal-transition';
import type { BoundRun, ExperienceScene } from './precision-model';
import { heroCopy, runForDecision } from './precision-model';
import { RevealScene } from './reveal-scene';
import { RunTheater } from './run-theater';
import { WaleMark } from './wale-mark';
import styles from '../wale-launch.module.css';

const sceneOrder: readonly ExperienceScene[] = ['decision', 'portal', 'theater', 'comparison', 'reveal'];
const sceneLabels: Record<ExperienceScene, string> = {
  decision: 'DECISION', portal: 'BOUND', theater: 'RUN', comparison: 'COMPARE', reveal: 'UNDERSTAND'
};

export function WaleExperience() {
  const reduceMotion = useHydrationStableReducedMotion();
  const [viewport, setViewport] = useState<LandingViewport>('abyss');
  const arrivalViewportRef = useRef<HTMLDivElement>(null);
  const precisionViewportRef = useRef<HTMLDivElement>(null);
  const handoffTimerRef = useRef<number | null>(null);
  const focusTarget = viewportFocusTarget(viewport);

  const focusViewport = useCallback(() => {
    const activeViewportRef = focusTarget === 'precision' ? precisionViewportRef : arrivalViewportRef;
    if (document.activeElement && activeViewportRef.current?.contains(document.activeElement)) return;
    const heading = activeViewportRef.current?.querySelector<HTMLElement>('h1');
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  }, [focusTarget]);

  useEffect(() => {
    const timer = window.setTimeout(focusViewport, reduceMotion ? 280 : 420);
    return () => window.clearTimeout(timer);
  }, [focusViewport, reduceMotion, viewport]);

  useEffect(() => () => {
    if (handoffTimerRef.current !== null) window.clearTimeout(handoffTimerRef.current);
  }, []);

  const enterPrecision = useCallback((skipMotion = false) => {
    const target = entryTarget(viewport, reduceMotion || skipMotion);
    if (target === viewport) return;
    if (target === 'precision') {
      setViewport('precision');
      return;
    }
    setViewport('handoff');
    handoffTimerRef.current = window.setTimeout(() => {
      handoffTimerRef.current = null;
      setViewport('precision');
    }, abyssContract.handoffDurationMs);
  }, [reduceMotion, viewport]);

  const returnToArrival = useCallback(() => {
    if (handoffTimerRef.current !== null) {
      window.clearTimeout(handoffTimerRef.current);
      handoffTimerRef.current = null;
    }
    setViewport('abyss');
  }, []);

  const viewportKey = viewport === 'precision' ? 'precision' : 'abyss';

  return (
    <AnimatePresence mode={viewportPresenceMode} initial={false}>
      <motion.div
        key={viewportKey}
        ref={focusTarget === 'precision' ? precisionViewportRef : arrivalViewportRef}
        className={styles.experienceViewport}
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
        transition={{ duration: reduceMotion ? 0.12 : abyssContract.viewportCrossfadeMs / 1_000 }}
      >
        {viewport !== 'precision'
          ? <AbyssArrival reducedMotion={reduceMotion} transitioning={viewport === 'handoff'} onEnter={enterPrecision} />
          : <PrecisionExperience onBack={returnToArrival} />}
      </motion.div>
    </AnimatePresence>
  );
}

interface PrecisionExperienceProps {
  onBack: () => void;
}

function PrecisionExperience({ onBack }: PrecisionExperienceProps) {
  const reduceMotion = useHydrationStableReducedMotion();
  const [paused, setPaused] = useState(false);
  const [scene, setScene] = useState<ExperienceScene>('decision');
  const [budget, setBudget] = useState(500);
  const [preserveArchitecture, setPreserveArchitecture] = useState(true);
  const [interacted, setInteracted] = useState(false);
  const [boundRun, setBoundRun] = useState<BoundRun>(() => runForDecision(500, true));
  const sceneRef = useRef<HTMLDivElement>(null);
  const portalTimerRef = useRef<number | null>(null);
  const sceneInitializedRef = useRef(false);
  const motionState = reduceMotion ? 'reduced' : paused ? 'paused' : 'playing';

  useEffect(() => () => {
    if (portalTimerRef.current !== null) window.clearTimeout(portalTimerRef.current);
  }, []);

  const focusScene = useCallback(() => {
    if (document.activeElement && document.activeElement !== document.body && document.activeElement !== document.documentElement) return;
    const heading = sceneRef.current?.querySelector<HTMLElement>('h1');
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  }, []);

  useEffect(() => {
    if (!sceneInitializedRef.current) {
      sceneInitializedRef.current = true;
      return;
    }
    if (scene === 'portal') return;
    const focusTimer = window.setTimeout(focusScene, 450);
    return () => window.clearTimeout(focusTimer);
  }, [focusScene, scene]);

  const updateBudget = (value: number) => {
    setBudget(value);
    setInteracted(true);
  };

  const updateArchitecture = (preserve: boolean) => {
    setPreserveArchitecture(preserve);
    setInteracted(true);
  };

  const enterRun = () => {
    setBoundRun(runForDecision(budget, preserveArchitecture));
    if (reduceMotion) {
      setScene('theater');
      return;
    }
    setScene('portal');
    if (portalTimerRef.current !== null) window.clearTimeout(portalTimerRef.current);
    portalTimerRef.current = window.setTimeout(() => setScene('theater'), 1_320);
  };

  const replay = () => {
    setScene('decision');
    setBudget(500);
    setPreserveArchitecture(true);
    setInteracted(false);
    setPaused(false);
  };

  return (
    <div className={`${styles.root} wale-launch-root`} data-motion={motionState} data-scene={scene}>
      <WaleHeader onBack={onBack} />
      <nav className={styles.experienceRail} aria-label="Wale experience progress">
        {sceneOrder.filter((item) => item !== 'portal').map((item, index) => {
          const currentIndex = sceneOrder.indexOf(scene === 'portal' ? 'theater' : scene);
          const itemIndex = sceneOrder.indexOf(item);
          return <span key={item} data-state={item === scene || (scene === 'portal' && item === 'theater') ? 'current' : itemIndex < currentIndex ? 'past' : 'future'}><i>{String(index + 1).padStart(2, '0')}</i>{sceneLabels[item]}</span>;
        })}
      </nav>

      <div className={styles.viewport} ref={sceneRef}>
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            className={styles.sceneFrame}
            key={scene}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: scene === 'portal' ? 0.98 : 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.12 : 0.18 }}
            onAnimationComplete={scene !== 'portal' ? focusScene : undefined}
          >
            {scene === 'decision' && (
              <DecisionScene
                budget={budget}
                preserveArchitecture={preserveArchitecture}
                interacted={interacted}
                onBudgetChange={updateBudget}
                onArchitectureChange={updateArchitecture}
                onRun={enterRun}
                onComparePreset={() => { setBudget(5_000); setPreserveArchitecture(false); setInteracted(true); }}
              />
            )}
            {scene === 'portal' && <PortalTransition budget={budget} preserveArchitecture={preserveArchitecture} />}
            {scene === 'theater' && (
              <RunTheater
                budget={budget}
                preserveArchitecture={preserveArchitecture}
                run={boundRun}
                paused={paused}
                reducedMotion={reduceMotion}
                onBack={() => setScene('decision')}
                onAlternative={() => setScene('comparison')}
              />
            )}
            {scene === 'comparison' && <ComparisonScene onBack={() => setScene('theater')} onReveal={() => setScene('reveal')} />}
            {scene === 'reveal' && <RevealScene onBack={() => setScene('comparison')} onReplay={replay} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <p className={styles.claimBoundary}>{heroCopy.boundary}</p>
      <button
        className={styles.motionControl}
        type="button"
        onClick={() => setPaused((current) => !current)}
        disabled={reduceMotion}
        aria-pressed={paused}
        aria-label={reduceMotion ? 'Motion disabled by reduced-motion preference' : paused ? 'Play interface motion' : 'Pause interface motion'}
      >
        {reduceMotion ? <Pause aria-hidden="true" /> : paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
        <span>{reduceMotion ? 'Motion reduced' : paused ? 'Play motion' : 'Pause motion'}</span>
      </button>
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

function WaleHeader({ onBack }: { onBack: () => void }) {
  return (
    <header className={styles.header}>
      <div className={styles.brand} aria-label="Wale by MBMApps">
        <span className={styles.brandMark} aria-hidden="true"><WaleMark /></span>
        <span><strong>WALE</strong><small>BY MBMAPPS</small></span>
      </div>
      <button className={styles.arrivalBack} type="button" onClick={onBack}><ArrowLeft aria-hidden="true" /> Back to arrival</button>
      <span className={styles.localBadge}><i aria-hidden="true" /> LOCAL-FIRST DEVELOPMENT INTELLIGENCE</span>
    </header>
  );
}
