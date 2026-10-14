'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight, CircleDot, Crosshair, GitBranch, Radio, ShieldCheck } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  getMasterScView,
  masterScCommands,
  masterScFactions,
  masterScCheckpoints,
  type MasterScCommandId,
  type MasterScFactionId,
  type MasterScSupply
} from '@/lib/master-sc';
import styles from './master-sc-showcase.module.css';

type MasterScProductTruth = {
  name: string;
  status: string;
  accessDescription: string;
  proofBoundary: string;
  sourceRepository: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
};

const modules = [
  { id: 'msc-command', number: '01', label: 'Command' },
  { id: 'msc-operations', number: '02', label: 'Operations' },
  { id: 'msc-doctrine', number: '03', label: 'Doctrine' },
  { id: 'msc-assets', number: '04', label: 'Asset bay' }
] as const;

function TacticalMark({ variant, compact = false }: { variant: MasterScFactionId | 'relay'; compact?: boolean }) {
  const size = compact ? 42 : 94;

  return (
    <svg width={size} height={size} viewBox="0 0 96 96" aria-hidden="true" focusable="false">
      <circle cx="48" cy="48" r="41" fill="none" stroke="currentColor" strokeOpacity=".18" />
      <circle cx="48" cy="48" r="31" fill="none" stroke="currentColor" strokeOpacity=".34" strokeDasharray="3 7" />
      {variant === 'forge' ? (
        <>
          <path d="M48 16 71 36 64 72 48 82 32 72 25 36Z" fill="currentColor" fillOpacity=".08" stroke="currentColor" />
          <path d="m48 28 12 18-12 25-12-25Z" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M25 54h15m16 0h15" stroke="currentColor" />
        </>
      ) : null}
      {variant === 'prism' ? (
        <>
          <path d="M48 15 72 48 48 81 24 48Z" fill="currentColor" fillOpacity=".07" stroke="currentColor" />
          <path d="m48 27 13 21-13 21-13-21Z" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="48" cy="48" r="6" fill="currentColor" />
        </>
      ) : null}
      {variant === 'tide' ? (
        <>
          <path d="M24 61c8-20 18-30 31-30 8 0 14 4 18 12-9-4-17-2-24 5-8 8-15 13-25 13Z" fill="currentColor" fillOpacity=".12" stroke="currentColor" />
          <path d="M27 70c9-15 19-22 31-22 5 0 9 1 13 4-7 2-13 6-19 12-7 6-15 8-25 6Z" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="59" cy="37" r="4" fill="currentColor" />
        </>
      ) : null}
      {variant === 'relay' ? (
        <>
          <circle cx="48" cy="48" r="10" fill="currentColor" fillOpacity=".12" stroke="currentColor" strokeWidth="2" />
          <path d="M48 11v20M48 65v20M11 48h20M65 48h20" stroke="currentColor" strokeWidth="2" />
          <path d="m25 25 14 14m18 18 14 14m0-46L57 39M39 57 25 71" stroke="currentColor" strokeOpacity=".55" />
        </>
      ) : null}
    </svg>
  );
}

export function MasterScShowcase({ product }: { product: MasterScProductTruth }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [factionId, setFactionId] = useState<MasterScFactionId>('forge');
  const [supply, setSupply] = useState<MasterScSupply>(20);
  const [commandId, setCommandId] = useState<MasterScCommandId>('scout');
  const [activeSection, setActiveSection] = useState<(typeof modules)[number]['id']>('msc-command');
  const view = getMasterScView(factionId, supply, commandId);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.dataset.motion = reducedMotion ? 'reduced' : 'ready';
    if (reducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.fromTo(
        '[data-master-intro]',
        { y: 24, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.88, ease: 'power4.out', stagger: 0.075 }
      );

      gsap.utils.toArray<HTMLElement>('[data-master-reveal]').forEach((section) => {
        const items = section.querySelectorAll<HTMLElement>('[data-master-item]');
        gsap.fromTo(
          items.length ? items : section,
          { y: 28, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.82,
            ease: 'power3.out',
            stagger: 0.07,
            scrollTrigger: { trigger: section, start: 'top 84%', once: true }
          }
        );
      });

      ScrollTrigger.refresh();
    }, root);

    return () => context.revert();
  }, []);

  useEffect(() => {
    const sections = modules
      .map((module) => document.getElementById(module.id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id as (typeof modules)[number]['id']);
      },
      { rootMargin: '-20% 0px -58% 0px', threshold: [0.1, 0.35, 0.7] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className={styles.experience} data-motion="static">
      <div className={styles.console}>
        <header className={styles.statusBar} aria-label="Sample interface state">
          <div data-master-intro className={styles.identity}>
            <span className={styles.statusLight} aria-hidden="true" />
            <div>
              <strong>MASTERSC // TACTICAL REVIEW</strong>
              <span>Sample interface state</span>
            </div>
          </div>
          <dl data-master-intro className={styles.resources} aria-live="polite">
            <div><dt>Focus</dt><dd>{view.faction.telemetry.focus}</dd></div>
            <div><dt>Signal</dt><dd>{view.faction.telemetry.signal}</dd></div>
            <div><dt>Cadence</dt><dd>{view.faction.telemetry.cadence}</dd></div>
            <div><dt>Supply</dt><dd>{supply}</dd></div>
          </dl>
        </header>

        <div className={styles.shell}>
          <aside data-master-intro className={styles.rail} aria-label="MasterSC modules">
            <div className={styles.railBrand}>
              <TacticalMark variant="relay" compact />
              <span>MSC</span>
            </div>
            <nav>
              {modules.map((module) => (
                <a
                  key={module.id}
                  href={`#${module.id}`}
                  aria-current={activeSection === module.id ? 'location' : undefined}
                  onClick={() => setActiveSection(module.id)}
                >
                  <span>{module.number}</span>
                  {module.label}
                </a>
              ))}
            </nav>
            <div className={styles.supplyRail} aria-label="Supply checkpoints">
              {masterScCheckpoints.map((checkpoint) => (
                <button
                  key={checkpoint.supply}
                  type="button"
                  aria-pressed={supply === checkpoint.supply}
                  onClick={() => setSupply(checkpoint.supply)}
                >
                  <span>{checkpoint.supply}</span> supply
                </button>
              ))}
            </div>
          </aside>

          <main className={styles.workspace}>
            <section id="msc-command" className={styles.hero} aria-labelledby="msc-title">
              <div className={styles.heroCopy}>
                <p data-master-intro className={styles.eyebrow}>Replay intelligence // guided execution</p>
                <h1 data-master-intro id="msc-title">Read the field.<br /><span>Build the response.</span></h1>
                <p data-master-intro className={styles.lede}>{product.name} is a local-first coaching system. This protected showcase demonstrates its decision model with fixed sample state—not live game data.</p>
                <div data-master-intro className={styles.heroActions}>
                  <a href={product.sourceRepository.href} target="_blank" rel="noreferrer">
                    <GitBranch size={17} aria-hidden="true" /> View source <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                  {product.secondaryAction ? (
                    <a href={product.secondaryAction.href} target="_blank" rel="noreferrer">
                      {product.secondaryAction.label} <ArrowUpRight size={15} aria-hidden="true" />
                    </a>
                  ) : null}
                </div>
              </div>
              <div data-master-intro className={styles.heroMark}>
                <TacticalMark variant="relay" />
                <div><span>Interface mode</span><strong>Deterministic sample</strong></div>
              </div>
            </section>

            <section id="msc-operations" className={styles.panel} data-master-reveal aria-labelledby="operations-title">
              <div className={styles.sectionHeading} data-master-item>
                <div><span>01 / Sector interface</span><h2 id="operations-title">Choose a doctrine</h2></div>
                <p>Each selection changes the operation and sample telemetry without contacting a game client or external service.</p>
              </div>
              <div className={styles.factionGrid} data-master-item>
                {masterScFactions.map((faction) => (
                  <button
                    key={faction.id}
                    type="button"
                    className={styles.factionCard}
                    aria-pressed={factionId === faction.id}
                    onClick={() => setFactionId(faction.id)}
                  >
                    <TacticalMark variant={faction.id} />
                    <span>{faction.designation}</span>
                    <strong>{faction.label}</strong>
                  </button>
                ))}
              </div>
              <article className={styles.operation} data-master-item aria-live="polite">
                <div className={styles.operationIndex}><Crosshair aria-hidden="true" /><span>Active operation</span></div>
                <div><p>{view.faction.designation}</p><h3>{view.faction.operation}</h3><p>{view.faction.doctrine}</p></div>
                <dl>
                  <div><dt>Focus</dt><dd>{view.faction.telemetry.focus}</dd></div>
                  <div><dt>Signal</dt><dd>{view.faction.telemetry.signal}</dd></div>
                  <div><dt>Cadence</dt><dd>{view.faction.telemetry.cadence}</dd></div>
                </dl>
              </article>
            </section>

            <section id="msc-doctrine" className={styles.panel} data-master-reveal aria-labelledby="doctrine-title">
              <div className={styles.sectionHeading} data-master-item>
                <div><span>02 / Concept sheet</span><h2 id="doctrine-title">Checkpoint discipline</h2></div>
                <div className={styles.segmented} aria-label="Supply checkpoint">
                  {masterScCheckpoints.map((checkpoint) => (
                    <button
                      key={checkpoint.supply}
                      type="button"
                      aria-pressed={supply === checkpoint.supply}
                      onClick={() => setSupply(checkpoint.supply)}
                    >{checkpoint.supply} supply</button>
                  ))}
                </div>
              </div>
              <div className={styles.conceptGrid} data-master-item aria-live="polite">
                <article><span>Objective</span><h3>{view.checkpoint.label}</h3><p>{view.checkpoint.objective}</p></article>
                <article><span>Read</span><Radio aria-hidden="true" /><p>{view.checkpoint.cue}</p></article>
                <article><span>Respond</span><ShieldCheck aria-hidden="true" /><p>{view.checkpoint.response}</p></article>
              </div>
            </section>

            <section id="msc-assets" className={styles.panel} data-master-reveal aria-labelledby="assets-title">
              <div className={styles.sectionHeading} data-master-item>
                <div><span>03 / Command grid</span><h2 id="assets-title">One bounded move</h2></div>
                <p>Commands explain the coaching response. They do not execute actions in a game.</p>
              </div>
              <div className={styles.commandLayout} data-master-item>
                <div className={styles.commandGrid} aria-label="Sample coaching commands">
                  {masterScCommands.map((command, index) => (
                    <button
                      key={command.id}
                      type="button"
                      aria-pressed={commandId === command.id}
                      onClick={() => setCommandId(command.id)}
                    >
                      <span>0{index + 1}</span>
                      <strong>{command.label}</strong>
                    </button>
                  ))}
                </div>
                <article className={styles.commandReadout} aria-live="polite">
                  <CircleDot aria-hidden="true" />
                  <span>Selected coaching response</span>
                  <h3>{view.command.label}</h3>
                  <p>{view.command.detail}</p>
                </article>
              </div>
              <div className={styles.assetBay} data-master-item aria-label="Original abstract tactical marks">
                {masterScFactions.map((faction) => (
                  <div key={faction.id}><TacticalMark variant={faction.id} compact /><span>{faction.label} mark</span></div>
                ))}
                <div><TacticalMark variant="relay" compact /><span>Relay mark</span></div>
              </div>
            </section>

            <footer className={styles.proof} data-master-reveal>
              <div data-master-item><span>Status</span><strong>{product.status}</strong></div>
              <div data-master-item><span>Access</span><strong>{product.accessDescription}</strong></div>
              <p data-master-item>{product.proofBoundary}</p>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}
