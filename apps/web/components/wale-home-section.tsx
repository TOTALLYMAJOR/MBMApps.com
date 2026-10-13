'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { WaleArchiveShell } from '@/components/wale-archive-shell';
import { getProjectBySlug } from '@/lib/projects';
import styles from './home-arrival.module.css';

function requireWale() {
  const product = getProjectBySlug('wale');
  if (!product) throw new Error('Missing canonical Wale product record');
  return product;
}

const wale = requireWale();

export function WaleHomeSection() {
  const viewport = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const target = viewport.current;
    if (!target) return;
    if (!('IntersectionObserver' in window)) {
      setStarted(true);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      setStarted(true);
      observer.disconnect();
    }, { threshold: 0.08 });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.waleSection} aria-labelledby="home-wale-title" data-cinematic-section>
      <header className={styles.waleHeading} data-cinematic-heading>
        <div className={styles.waleCopy}>
          <h2 id="home-wale-title">Wale: {wale.headline}</h2>
          <p className={styles.waleLead}>{wale.supportingStatement}</p>
          <p className={styles.waleBoundary}>{wale.accessDescription}</p>
        </div>
        <Link className={styles.waleCta} href={wale.experienceHref}>
          {wale.websiteLabel}
          <ArrowUpRight aria-hidden="true" />
        </Link>
      </header>
      <div ref={viewport} className={styles.waleViewport} data-wale-started={started} data-cinematic-visual>
        {started ? <WaleArchiveShell embedded /> : <p className={styles.placeholder}>Wale’s animation begins here as you scroll. Reduced-motion preferences are respected.</p>}
      </div>
    </section>
  );
}
