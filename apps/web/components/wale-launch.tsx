'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  Check,
  FileCode2,
  Gauge,
  PlugZap,
  Radar,
  ShieldCheck,
  Workflow
} from 'lucide-react';
import styles from './wale-launch.module.css';

const smokeWords = ['interactive', 'development', 'intelligence'];

const auditControls = [
  { id: 'instructions', label: 'Instructions', icon: FileCode2, status: '3 found' },
  { id: 'plugins', label: 'Plugins + MCPs', icon: PlugZap, status: '6 found' },
  { id: 'hooks', label: 'Hooks + packages', icon: Workflow, status: '8 found' },
  { id: 'evidence', label: 'Evidence health', icon: Radar, status: '2 gaps' }
] as const;

type AuditControl = (typeof auditControls)[number]['id'];

export function WaleLaunch() {
  const reduceMotion = Boolean(useReducedMotion());
  const [panel, setPanel] = useState<'hero' | 'demo'>('hero');
  const [huntActive, setHuntActive] = useState(false);
  const [activeControl, setActiveControl] = useState<AuditControl>('plugins');

  const enterDemo = useCallback(() => {
    if (panel !== 'hero' || huntActive) return;
    setHuntActive(true);
  }, [huntActive, panel]);

  useEffect(() => {
    if (!huntActive) return;

    const timer = window.setTimeout(
      () => setPanel('demo'),
      reduceMotion ? 120 : 1900
    );

    return () => window.clearTimeout(timer);
  }, [huntActive, reduceMotion]);

  useEffect(() => {
    const handleEntryKey = (event: KeyboardEvent) => {
      if (panel !== 'hero' || !['ArrowDown', 'PageDown'].includes(event.key)) return;
      event.preventDefault();
      enterDemo();
    };

    window.addEventListener('keydown', handleEntryKey);
    return () => window.removeEventListener('keydown', handleEntryKey);
  }, [enterDemo, panel]);

  const returnHome = useCallback(() => {
    setPanel('hero');
    setHuntActive(false);
  }, []);

  return (
    <div
      className={`${styles.root} wale-launch-root`}
      onWheel={(event) => {
        if (event.deltaY > 14) enterDemo();
      }}
    >
      <header className={styles.header}>
        <button className={styles.brand} type="button" onClick={returnHome} aria-label="Return to Wale introduction">
          <span className={styles.brandMark} aria-hidden="true"><WaleMark /></span>
          <span><strong>WALE</strong><small>by MBMApps</small></span>
        </button>
        <span className={styles.localBadge}><i aria-hidden="true" /> Local-first development intelligence</span>
      </header>

      <main className={styles.viewport}>
        <AnimatePresence mode="wait" initial={false}>
          {panel === 'hero' ? (
            <motion.section
              key="hero"
              className={styles.hero}
              aria-labelledby="wale-title"
              initial={{ opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, filter: 'blur(8px)' }}
              transition={{ duration: reduceMotion ? 0.08 : 0.35 }}
            >
              <div className={styles.copy}>
                <p className={styles.eyebrow}>Development systems, made visible</p>
                <h1 id="wale-title">WALE</h1>
                <p className={styles.smokeLine}>
                  <span className={styles.srOnly}>An interactive development intelligence system.</span>
                  <span className={styles.smokeVisual} aria-hidden="true">
                    <span>An</span>
                    {smokeWords.map((word, index) => (
                      <motion.span
                        key={word}
                        className={styles.smokeWord}
                        data-word={word}
                        initial={reduceMotion ? false : { opacity: 0, filter: 'blur(22px)', y: 24 }}
                        animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                        transition={{ duration: 1.15, delay: 0.2 + index * 0.13, ease: [0.16, 1, 0.3, 1] }}
                      >
                        {word}
                      </motion.span>
                    ))}
                    <span>system.</span>
                  </span>
                </p>
                <motion.p
                  className={styles.lede}
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.75 }}
                >
                  Audit the controls behind your software. See the constraint that matters most.
                  Choose what to improve, then implement with feedback—without surrendering control.
                </motion.p>
                <motion.div
                  className={styles.actions}
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.9 }}
                >
                  <a className={styles.primaryAction} href="http://127.0.0.1:8787/?start=guided">
                    Open local Wale <ArrowUpRight aria-hidden="true" />
                  </a>
                  <button className={styles.secondaryAction} type="button" onClick={enterDemo}>
                    Enter product preview <ArrowDown aria-hidden="true" />
                  </button>
                </motion.div>
                <p className={styles.launchNote}>The guided start requires the loopback Wale bridge and begins with a read-only assessment.</p>
              </div>

              <WhaleScene reduceMotion={reduceMotion} huntActive={huntActive} />

              <button className={styles.scrollCue} type="button" onClick={enterDemo} aria-label="Enter the Wale product preview">
                <span>{huntActive ? 'CAPTURING SIGNAL' : 'SCROLL TO ENTER'}</span>
                <ArrowDown aria-hidden="true" />
              </button>
            </motion.section>
          ) : (
            <motion.section
              key="demo"
              className={styles.demo}
              aria-labelledby="demo-title"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0.08 : 0.42, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.demoHeading}>
                <div>
                  <p>Interactive product preview · sample data</p>
                  <h2 id="demo-title">Choose what Wale should inspect.</h2>
                </div>
                <button type="button" onClick={returnHome}><ArrowLeft aria-hidden="true" /> Back to introduction</button>
              </div>

              <div className={styles.workbench}>
                <aside className={styles.controlRail} aria-label="Audit controls">
                  <p>01 / Audit scope</p>
                  {auditControls.map(({ id, label, icon: Icon, status }) => (
                    <button
                      key={id}
                      type="button"
                      className={activeControl === id ? styles.controlActive : undefined}
                      onClick={() => setActiveControl(id)}
                      aria-pressed={activeControl === id}
                    >
                      <Icon aria-hidden="true" />
                      <span><strong>{label}</strong><small>{status}</small></span>
                    </button>
                  ))}
                </aside>

                <section className={styles.reportPanel} aria-live="polite">
                  <div className={styles.reportTopline}>
                    <span>wale://assessment/current</span>
                    <strong><i aria-hidden="true" /> READY TO REVIEW</strong>
                  </div>
                  <div className={styles.reportBody}>
                    <p className={styles.reportKicker}>Selected control</p>
                    <h3>{auditControls.find((control) => control.id === activeControl)?.label}</h3>
                    <p>Wale distinguishes what is installed, configured, observed, damaged, or still unknown before it recommends a change.</p>

                    <dl className={styles.metrics}>
                      <div><dt>Coverage</dt><dd>Bounded</dd></div>
                      <div><dt>Evidence</dt><dd>Current</dd></div>
                      <div><dt>Authority</dt><dd>Advisory</dd></div>
                    </dl>

                    <div className={styles.finding}>
                      <Gauge aria-hidden="true" />
                      <div><span>Leading constraint</span><strong>Repository knowledge is present but not continuously available to the development harness.</strong></div>
                    </div>

                    <div className={styles.recommendation}>
                      <div><span>Recommended next move</span><strong>Connect Codebase Memory</strong><p>Give Wale a current structural view without surrendering execution authority.</p></div>
                      <button type="button">Include in plan <Check aria-hidden="true" /></button>
                    </div>
                  </div>
                </section>

                <aside className={styles.connectionPanel}>
                  <ShieldCheck aria-hidden="true" />
                  <p>Local connection boundary</p>
                  <ol>
                    <li><span>01</span> Start the loopback bridge</li>
                    <li><span>02</span> Approve repository scope</li>
                    <li><span>03</span> Review before change</li>
                  </ol>
                  <a href="http://127.0.0.1:8787/?start=guided">Start guided Wale <ArrowUpRight aria-hidden="true" /></a>
                  <small>The public site receives bounded status—not ambient filesystem access.</small>
                </aside>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function WaleMark() {
  return (
    <svg viewBox="0 0 48 48" role="presentation">
      <path d="M7 13c7 1 12 5 17 12 5-7 10-11 17-12-1 8-5 14-11 18l-6 5-6-5C12 27 8 21 7 13Z" />
      <path d="M24 25v11" />
    </svg>
  );
}

function WhaleScene({ reduceMotion, huntActive }: { reduceMotion: boolean; huntActive: boolean }) {
  const duration = reduceMotion ? 0.08 : 1.9;

  return (
    <motion.div
      className={styles.scene}
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.35 }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 1200 560" role="presentation">
        <defs>
          <linearGradient id="wale-body" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#68f2dc" />
            <stop offset="0.62" stopColor="#12a99f" />
            <stop offset="1" stopColor="#087c82" />
          </linearGradient>
          <linearGradient id="wale-water" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#197cff" stopOpacity="0" />
            <stop offset="0.45" stopColor="#36b8ff" stopOpacity="0.92" />
            <stop offset="1" stopColor="#197cff" stopOpacity="0" />
          </linearGradient>
          <filter id="wale-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <g className={styles.gridMarks}>
          <path d="M0 86H1200M0 222H1200M0 358H1200M0 494H1200" />
          <path d="M126 0V560M356 0V560M586 0V560M816 0V560M1046 0V560" />
        </g>
        <path className={styles.waterLine} d="M-60 410 C80 370 150 445 290 405 S510 376 650 416 S900 370 1050 410 S1220 438 1280 396" />
        <path className={styles.waterGlow} d="M-60 420 C80 380 150 455 290 415 S510 386 650 426 S900 380 1050 420 S1220 448 1280 406" />

        <motion.g
          className={styles.sonarTrail}
          initial={{ opacity: 0.18, x: 0 }}
          animate={huntActive && !reduceMotion ? { opacity: [0, 0.7, 0.15], x: [0, 38, 0] } : { opacity: 0.18, x: 0 }}
          transition={{ duration, times: [0, 0.55, 1] }}
        >
          <path d="M830 282h108" /><path d="M852 297h72" /><path d="M874 312h38" />
        </motion.g>

        <motion.g
          animate={huntActive
            ? { x: [0, 68, 350, 602], y: [0, -10, 6, 0], rotate: [0, -2, 1, 0] }
            : reduceMotion
              ? { x: 0, y: 0 }
              : { x: [0, 18, 0], y: [0, -9, 0], rotate: [0, -1, 0] }}
          transition={huntActive
            ? { duration, ease: [0.32, 0, 0.15, 1], times: [0, 0.28, 0.72, 1] }
            : { duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        >
          <g filter="url(#wale-glow)">
            <path className={styles.tail} d="M80 272 C24 224 1 232 22 290 C1 341 34 350 87 307 Z" />
            <path fill="url(#wale-body)" d="M70 287 C83 220 158 184 257 198 C333 209 371 258 355 310 C339 362 277 389 187 377 C109 366 58 334 70 287 Z" />
            <path className={styles.belly} d="M91 322 C148 353 251 364 326 318 C306 367 238 390 163 373 C126 364 101 347 91 322 Z" />
            <path className={styles.fin} d="M198 348 C204 401 247 418 258 358 Z" />
            <circle className={styles.eye} cx="298" cy="259" r="7" />
            <circle className={styles.eyeGlint} cx="300" cy="256" r="2" />
            <motion.path
              className={styles.mouth}
              d="M327 307 Q349 318 362 302"
              animate={huntActive && !reduceMotion ? { scaleY: [0.45, 0.45, 2.3, 0.15] } : { scaleY: 0.45 }}
              transition={{ duration, times: [0, 0.7, 0.82, 1] }}
              style={{ transformOrigin: '344px 307px' }}
            />
          </g>
        </motion.g>

        <motion.g
          className={styles.fish}
          initial={{ opacity: 1, x: 0, y: 0 }}
          animate={huntActive
            ? { opacity: [1, 1, 1, 0], x: [0, 44, -8, -8], y: [0, -18, 3, 3] }
            : { opacity: 1, x: reduceMotion ? 0 : [0, 14, 0], y: reduceMotion ? 0 : [0, -5, 0] }}
          transition={huntActive
            ? { duration, times: [0, 0.35, 0.78, 0.84], ease: [0.32, 0, 0.2, 1] }
            : { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M982 286 C1006 267 1046 270 1060 292 C1044 316 1005 316 982 298 Z" />
          <path d="M984 288 L958 271 L961 309 L984 298 Z" />
          <circle cx="1043" cy="287" r="3" />
        </motion.g>

        <motion.circle
          className={styles.pressureRing}
          cx="973"
          cy="303"
          r="34"
          initial={{ opacity: 0, scale: 0.3 }}
          animate={huntActive && !reduceMotion ? { opacity: [0, 0, 0.9, 0], scale: [0.3, 0.3, 1, 1.8] } : { opacity: 0 }}
          transition={{ duration, times: [0, 0.78, 0.84, 1] }}
          style={{ transformOrigin: '973px 303px' }}
        />
      </svg>
    </motion.div>
  );
}
