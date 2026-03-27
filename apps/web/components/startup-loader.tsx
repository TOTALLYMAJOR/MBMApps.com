'use client';

import { useEffect, useState } from 'react';

const DISPLAY_MS = 1900;
const FADE_MS = 650;

type IntroPhase = 'visible' | 'fading' | 'hidden';

export function StartupLoader() {
  const [phase, setPhase] = useState<IntroPhase>('visible');

  useEffect(() => {
    const alreadySeen = window.sessionStorage.getItem('mbm_intro_seen') === '1';

    if (alreadySeen) {
      setPhase('hidden');
      return;
    }

    const fadeTimeout = window.setTimeout(() => {
      setPhase('fading');
    }, DISPLAY_MS);

    const hideTimeout = window.setTimeout(() => {
      setPhase('hidden');
      window.sessionStorage.setItem('mbm_intro_seen', '1');
    }, DISPLAY_MS + FADE_MS);

    return () => {
      window.clearTimeout(fadeTimeout);
      window.clearTimeout(hideTimeout);
    };
  }, []);

  if (phase === 'hidden') {
    return null;
  }

  const cubes = Array.from({ length: 52 }, (_, index) => {
    const left = (index * 37) % 100;
    const top = (index * 53) % 100;
    const size = 12 + ((index * 19) % 44);
    const opacity = 0.2 + ((index * 13) % 50) / 180;
    const duration = 7 + ((index * 11) % 6);
    const delay = ((index * 7) % 22) * 0.08;
    const driftX = ((index * 17) % 30) - 15;
    const driftY = ((index * 23) % 30) - 15;

    return {
      id: index,
      style: {
        left: `${left}%`,
        top: `${top}%`,
        width: `${size}px`,
        height: `${size}px`,
        opacity,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        '--cube-drift-x': `${driftX}px`,
        '--cube-drift-y': `${driftY}px`
      } as React.CSSProperties
    };
  });

  return (
    <div
      className={`fixed inset-0 z-[120] overflow-hidden bg-black transition-opacity duration-[650ms] ${phase === 'fading' ? 'opacity-0' : 'opacity-100'}`}
      aria-hidden="true"
    >
      <div className="intro-space absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(130,160,255,0.22),transparent_36%),radial-gradient(circle_at_15%_12%,rgba(184,207,255,0.2),transparent_24%),radial-gradient(circle_at_80%_10%,rgba(84,110,196,0.22),transparent_30%)]" />
      <div className="absolute inset-0 overflow-hidden">
        {cubes.map((cube) => (
          <span key={cube.id} className="intro-cube absolute" style={cube.style} />
        ))}
      </div>

      <div className="relative z-10 mx-auto grid h-full w-full max-w-7xl items-center px-6 md:grid-cols-[1.05fr_0.95fr] lg:px-10">
        <div>
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-white/70">Boot Sequence</p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold uppercase leading-[1.02] text-white md:text-6xl">
            Design Systems. Delivery Systems. Growth Systems.
          </h2>
          <p className="mt-4 max-w-xl text-sm uppercase tracking-[0.16em] text-white/55">Initializing MBMApps interface</p>
        </div>

        <div className="mt-10 flex justify-start md:mt-0 md:justify-end">
          <div className="w-full max-w-sm rounded-2xl border border-white/20 bg-black/35 p-4 backdrop-blur-sm">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-white/70">Load Progress</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
              <span className="intro-progress block h-full w-full rounded-full" />
            </div>
            <p className="mt-3 text-xs text-white/65">Rendering cube field and reveal transition</p>
          </div>
        </div>
      </div>
    </div>
  );
}
