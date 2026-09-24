'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styles from './signal-lock.module.css';

export function SignalLock() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('Ready when you are.');
  const [submitting, setSubmitting] = useState(false);

  async function enter() {
    if (submitting) return;
    setSubmitting(true);
    setMessage('Opening the portfolio…');

    try {
      const response = await fetch('/api/site-gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'simulation', next: searchParams.get('next') ?? '/' })
      });
      const result = await response.json().catch(() => null) as { ok?: boolean; next?: string; message?: string } | null;

      if (!response.ok || !result?.ok) {
        setMessage(result?.message ?? 'The entrance could not open. Try again.');
        return;
      }

      setMessage('Entrance confirmed.');
      window.location.assign(result.next ?? '/');
    } catch {
      setMessage('The entrance service is unavailable. Check the connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className={`${styles.signalLock} signal-lock-root`} aria-labelledby="signal-lock-title">
      <div className={styles.atmosphere} aria-hidden="true">
        <span className={styles.glow} />
        <span className={`${styles.signalLine} ${styles.signalLineNorth}`} />
        <span className={`${styles.signalLine} ${styles.signalLineSouth}`} />
        <span className={styles.orbit}><i /><i /><i /></span>
      </div>

      <div className={styles.shell}>
        <header className={styles.header}>
          <Link href="/" className={styles.brand} aria-label="MBMApps entrance">
            <strong>MBM</strong><span>Apps</span>
          </Link>
          <p><i aria-hidden="true" /> Entrance simulation</p>
        </header>

        <main className={styles.layout}>
          <div className={styles.entrance}>
            <div className={styles.entranceMark} aria-hidden="true"><span>01</span><i /><span>ENTER</span></div>
            <p className={styles.enterEyebrow}>No account / no credentials</p>
            <h1 id="signal-lock-title">Step inside<br />the system.</h1>
            <p className={styles.intro}>A deliberate threshold before the portfolio. This is an interaction, not authentication.</p>

            <div className={styles.enterFrame}>
              <button className={styles.enterButton} type="button" onClick={enter} disabled={submitting}>
                <span>{submitting ? 'Entering…' : 'Enter'}</span>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 7l5 5-5 5" /></svg>
              </button>
            </div>

            <p className={styles.entranceStatus} role="status" aria-live="polite"><span aria-hidden="true" />{message}</p>
          </div>
        </main>

        <footer className={styles.footer}>
          <span>MBMApps / Chicago</span>
          <span>Simulation only · grants no private access</span>
        </footer>
      </div>
    </section>
  );
}
