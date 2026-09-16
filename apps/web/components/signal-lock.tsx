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
      <div className={styles.instrument} aria-hidden="true">
        <span className={styles.orbitOne} />
        <span className={styles.orbitTwo} />
        <span className={styles.signalCore} />
      </div>

      <div className={styles.shell}>
        <header className={styles.header}>
          <Link href="/" className={styles.brand} aria-label="MBMApps entrance">
            <strong>MBM</strong><span>Apps</span>
          </Link>
          <p><i aria-hidden="true" /> Private operating world</p>
        </header>

        <div className={styles.layout}>
          <div className={styles.intro}>
            <p className={styles.eyebrow}>Signal Lock / access sequence</p>
            <h1 id="signal-lock-title">Enter through the way we work.</h1>
            <p className={styles.lede}>Arrange the four stages of a responsible AI workflow. The correct path exposes the final control.</p>
            <div className={styles.accessNote}>
              <span>Access model</span>
              <p>The sequence proves attention. Your invite phrase proves access.</p>
            </div>
          </div>

          <form className={styles.console} onSubmit={unlock}>
            <div className={styles.consoleHeader}>
              <span>01 / construct signal</span>
              <button type="button" onClick={resetPath} disabled={!sequence.length}>[reset]</button>
            </div>

            <ol className={styles.path} aria-label="Selected signal path">
              {Array.from({ length: 4 }, (_, index) => {
                const selected = stages.find((stage) => stage.id === sequence[index]);
                return (
                  <li key={index} className={selected ? styles.pathFilled : styles.pathEmpty}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    {selected ? (
                      <button type="button" onClick={() => removeStage(index)} aria-label={`Remove ${selected.label} from position ${index + 1}`}>
                        <strong>{selected.label}</strong><small>{selected.note}</small>
                      </button>
                    ) : <p>Awaiting stage</p>}
                  </li>
                );
              })}
            </ol>

            <fieldset className={styles.stagePicker}>
              <legend>Choose the next stage</legend>
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
              <label htmlFor="signal-passphrase"><span>02 / complete signal</span>Invite phrase</label>
              <div>
                <input
                  ref={phraseRef}
                  id="signal-passphrase"
                  type="password"
                  autoComplete="current-password"
                  value={passphrase}
                  onChange={(event) => setPassphrase(event.target.value)}
                  disabled={!complete || submitting}
                  placeholder={complete ? 'Enter the phrase you were given' : 'Complete the path first'}
                />
                <button type="submit" disabled={!complete || !passphrase.trim() || submitting}>
                  {submitting ? 'Validating…' : 'Open entrance'}
                </button>
              </div>
            </div>

            <p className={styles.status} role="status" aria-live="polite"><span aria-hidden="true">›</span>{message}</p>
          </form>
        </div>

        <footer className={styles.footer}>
          <span>MBMApps / Chicago</span>
          <span>Signed session · 12 hour default · owner-controlled</span>
        </footer>
      </div>
    </section>
  );
}
