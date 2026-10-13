'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { SignalLock } from '@/components/signal-lock';
import styles from './home-arrival.module.css';

export function HomeArrival({ welcome = false, children }: { welcome?: boolean; children: ReactNode }) {
  const [stage, setStage] = useState<'entrance' | 'welcome' | 'home'>(welcome ? 'welcome' : 'entrance');
  const [homeReady, setHomeReady] = useState(false);
  const reduceMotion = useReducedMotion();
  const welcomeTitle = useRef<HTMLHeadingElement>(null);
  const home = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stage !== 'welcome') return;
    // Consume the presentation marker. Reloading now shows the entrance again.
    const url = new URL(window.location.href);
    if (url.searchParams.has('welcome')) {
      url.searchParams.delete('welcome');
      window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
    }
    welcomeTitle.current?.focus({ preventScroll: true });
    const timer = window.setTimeout(() => setStage('home'), reduceMotion ? 0 : 2600);
    return () => window.clearTimeout(timer);
  }, [stage, reduceMotion]);

  useEffect(() => {
    if (!homeReady) return;
    window.scrollTo({ top: 0, behavior: 'instant' });
    home.current?.focus({ preventScroll: true });
  }, [homeReady]);

  return (
    <div className={styles.arrival} data-home-stage={stage}>
      {stage === 'entrance' && <SignalLock onContinue={() => setStage('welcome')} />}
      <AnimatePresence initial={false} onExitComplete={() => setHomeReady(true)}>
        {stage === 'welcome' && (
          <motion.section key="welcome" className={styles.welcome} aria-labelledby="studio-welcome"
            exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.72, ease: [0.22, 1, 0.36, 1] }}>
            <p className={styles.eyebrow}>MBMapp Studios</p>
            <h1 id="studio-welcome" ref={welcomeTitle} tabIndex={-1}>
              Michael Brandon <span>&amp; MBMapp Studios</span> <span className={styles.welcomeLine}>welcome you.</span>
            </h1>
            <button type="button" onClick={() => setStage('home')}>Continue to the studio <span aria-hidden="true">↗</span></button>
          </motion.section>
        )}
      </AnimatePresence>
      {homeReady && <div ref={home} tabIndex={-1} aria-label="MBMApps homepage">{children}</div>}
    </div>
  );
}
