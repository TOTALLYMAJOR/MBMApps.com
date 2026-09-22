'use client';

import { FormEvent, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styles from './signal-lock.module.css';

const stages = [
  { id: 'verify', label: 'Verify', note: 'Test the claim' },
  { id: 'observe', label: 'Observe', note: 'Read the evidence' },
  { id: 'build', label: 'Build', note: 'Make the artifact' },
  { id: 'reason', label: 'Reason', note: 'Frame the decision' }
] as const;

type StageId = (typeof stages)[number]['id'];

export function SignalLock() {
  const searchParams = useSearchParams();
  const phraseRef = useRef<HTMLInputElement>(null);
  const [sequence, setSequence] = useState<StageId[]>([]);
  const [passphrase, setPassphrase] = useState('');
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [message, setMessage] = useState('Build the signal path to reveal the entrance control.');
  const [submitting, setSubmitting] = useState(false);

  const available = stages.filter((stage) => !sequence.includes(stage.id));
  const complete = sequence.length === stages.length;

  function addStage(stage: StageId) {
    if (sequence.includes(stage)) return;
    const next = [...sequence, stage];
    setSequence(next);
    setMessage(next.length === stages.length
      ? 'Signal path assembled. Complete it with the invite phrase.'
      : `${next.length} of ${stages.length} stages connected.`);
    if (next.length === stages.length) window.setTimeout(() => phraseRef.current?.focus(), 100);
  }

  function removeStage(index: number) {
    setSequence((current) => current.filter((_, currentIndex) => currentIndex !== index));
    setMessage('Signal path reopened. Choose the next stage.');
  }

  function resetPath() {
    setSequence([]);
    setMessage('Path cleared. Begin where evidence begins.');
  }

  async function unlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!complete || !passphrase.trim() || submitting) return;

    setSubmitting(true);
    setMessage('Validating the path…');

    try {
      const response = await fetch('/api/site-gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sequence,
          passphrase,
          next: searchParams.get('next') ?? '/'
        })
      });
      const result = await response.json().catch(() => null) as { ok?: boolean; next?: string; message?: string; field?: string } | null;

      if (!response.ok || !result?.ok) {
        setMessage(result?.message ?? 'The signal could not be validated. Try again.');
        if (result?.field === 'sequence') setSequence([]);
        if (result?.field === 'passphrase') phraseRef.current?.select();
        return;
      }

      setMessage('Signal confirmed. Opening MBMApps…');
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
        <span className={`${styles.circuit} ${styles.circuitNorthWest}`}><i /><b /></span>
        <span className={`${styles.circuit} ${styles.circuitSouthWest}`}><i /><b /></span>
        <span className={`${styles.circuit} ${styles.circuitNorthEast}`}><i /><b /></span>
        <span className={`${styles.circuit} ${styles.circuitSouthEast}`}><i /><b /></span>
      </div>

      <div className={styles.shell}>
        <header className={styles.header}>
          <Link href="/" className={styles.brand} aria-label="MBMApps entrance">
            <strong>MBM</strong><span>Apps</span>
          </Link>
          <p><i aria-hidden="true" /> Protected entrance</p>
        </header>

        <div className={styles.layout}>
          <form className={styles.console} onSubmit={unlock}>
            <div className={styles.identity}>
              <span className={styles.mark} aria-hidden="true"><i /><i /><i /></span>
              <p className={styles.eyebrow}>Signal lock / private access</p>
              <h1 id="signal-lock-title">Enter MBMApps</h1>
              <p>Connect the operating sequence, then use your owner-issued invite phrase.</p>
            </div>

            <div className={styles.sequenceHeader}>
              <span>01 / establish signal path</span>
              <button type="button" onClick={resetPath} disabled={!sequence.length}>Reset</button>
            </div>

            <ol className={styles.path} aria-label="Selected signal path">
              {Array.from({ length: 4 }, (_, index) => {
                const selected = stages.find((stage) => stage.id === sequence[index]);
                return (
                  <li key={index} className={selected ? styles.pathFilled : styles.pathEmpty}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    {selected ? (
                      <button type="button" onClick={() => removeStage(index)} aria-label={`Remove ${selected.label} from position ${index + 1}`}>
                        <strong>{selected.label}</strong><small>Remove</small>
                      </button>
                    ) : <p>Open</p>}
                  </li>
                );
              })}
            </ol>

            <fieldset className={styles.stagePicker}>
              <legend>Choose next stage</legend>
              <div>
                {available.map((stage) => (
                  <button key={stage.id} type="button" onClick={() => addStage(stage.id)}>
                    <strong>{stage.label}</strong><small>{stage.note}</small><span aria-hidden="true">+</span>
                  </button>
                ))}
                {!available.length && <p className={styles.pathComplete}>Four stages connected.</p>}
              </div>
            </fieldset>

            <div className={styles.phrase} data-ready={complete ? 'true' : 'false'}>
              <label htmlFor="signal-passphrase"><span>02 / verify access</span>Invite phrase</label>
              <label className={styles.usernameField} aria-hidden="true">
                Access realm
                <input name="username" value="mbmapps-private-access" autoComplete="username" tabIndex={-1} readOnly />
              </label>
              <div className={styles.passwordField}>
                <input
                  ref={phraseRef}
                  id="signal-passphrase"
                  type={showPassphrase ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={passphrase}
                  onChange={(event) => setPassphrase(event.target.value)}
                  disabled={!complete || submitting}
                  placeholder={complete ? 'Enter your invite phrase' : 'Complete the path first'}
                />
                <button
                  type="button"
                  className={styles.reveal}
                  onClick={() => setShowPassphrase((visible) => !visible)}
                  disabled={!complete}
                  aria-pressed={showPassphrase}
                  aria-label={`${showPassphrase ? 'Hide' : 'Show'} invite phrase`}
                >
                  {showPassphrase ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button className={styles.submit} type="submit" disabled={!complete || !passphrase.trim() || submitting}>
              {submitting ? 'Validating…' : 'Continue to private workspace'}
            </button>

            <p className={styles.status} role="status" aria-live="polite"><span aria-hidden="true">●</span>{message}</p>

            <div className={styles.sessionNote}>
              <span>Signed session</span>
              <span>12 hour default</span>
              <span>Owner controlled</span>
            </div>
          </form>
        </div>

        <footer className={styles.footer}>
          <span>MBMApps / Chicago</span>
          <Link href="/">Return to public site</Link>
        </footer>
      </div>
    </section>
  );
}
