'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AbyssArrival } from './abyss-arrival';

export function WaleHomeChapter() {
  const router = useRouter();
  const chapterRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPreference = () => setReducedMotion(preference.matches);
    syncPreference();
    preference.addEventListener('change', syncPreference);
    return () => preference.removeEventListener('change', syncPreference);
  }, []);

  useEffect(() => {
    const chapter = chapterRef.current;
    if (!chapter) return;
    const observer = new IntersectionObserver(
      ([entry]) => setActive(Boolean(entry?.isIntersecting)),
      { threshold: 0.18 }
    );
    observer.observe(chapter);
    return () => observer.disconnect();
  }, []);

  return (
    <div id="wale" ref={chapterRef} className="terminal-wale-chapter">
      <AbyssArrival
        reducedMotion={reducedMotion}
        transitioning={false}
        active={active}
        embedded
        captureNavigation={false}
        onEnter={() => router.push('/wale')}
      />
    </div>
  );
}
