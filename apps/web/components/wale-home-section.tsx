'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import styles from './wale-home-section.module.css';

export const WALE_ARCHIVE_PREVIEW_SRC = '/wale-archive/index.html?quality=cinema';

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
    <section
      id="wale"
      className={styles.section}
      aria-labelledby="home-wale-title"
      data-wale-surface="living-archive"
    >
      <header className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>Development intelligence</p>
          <h2 id="home-wale-title">Wale: The Living Archive</h2>
          <p className={styles.boundary}>
            Explore the public archive. Repository analysis requires the separately started local Wale bridge.
          </p>
        </div>
        <Link className={styles.cta} href="/wale">
          Open Wale archive
          <ArrowUpRight aria-hidden="true" />
        </Link>
      </header>

      <div ref={viewport} className={styles.viewport} data-wale-started={started}>
        {started ? (
          <iframe
            className={styles.archive}
            src={WALE_ARCHIVE_PREVIEW_SRC}
            title="Wale Living Archive preview"
            aria-hidden="true"
            tabIndex={-1}
            loading="lazy"
            allow="autoplay; fullscreen"
          />
        ) : (
          <p className={styles.placeholder}>
            Wale’s white Living Archive begins here as you scroll. Reduced-motion preferences are respected.
          </p>
        )}
      </div>
    </section>
  );
}
