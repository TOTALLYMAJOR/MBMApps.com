'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  browserSessionPersistence,
  GoogleAuthProvider,
  OAuthProvider,
  setPersistence,
  signInAnonymously,
  signInWithPopup,
  type UserCredential
} from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase/client';
import { destinationAfterSignIn } from '@/lib/home-arrival';
import { useSiteSession } from '@/components/site-session';
import styles from './signal-lock.module.css';

type EntranceMethod = 'google' | 'microsoft' | 'apple' | 'guest';

export function SignalLock({ onContinue }: { onContinue?: () => void } = {}) {
  const searchParams = useSearchParams();
  const { role } = useSiteSession();
  const [message, setMessage] = useState('Choose an identity to continue.');
  const [submitting, setSubmitting] = useState<EntranceMethod | null>(null);

  async function enter(method: EntranceMethod) {
    if (submitting) return;
    setSubmitting(method);
    setMessage(method === 'guest' ? 'Preparing guest access…' : 'Opening secure sign-in…');

    try {
      const auth = getFirebaseAuth();
      if (!auth) {
        setMessage('Firebase sign-in is not configured for this site.');
        return;
      }

      await setPersistence(auth, browserSessionPersistence);
      let credential: UserCredential;
      if (method === 'guest') {
        credential = await signInAnonymously(auth);
      } else if (method === 'google') {
        credential = await signInWithPopup(auth, new GoogleAuthProvider());
      } else {
        credential = await signInWithPopup(auth, new OAuthProvider(method === 'microsoft' ? 'microsoft.com' : 'apple.com'));
      }

      const idToken = await credential.user.getIdToken(true);
      const response = await fetch('/api/site-gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, next: searchParams.get('next') ?? '/' })
      });
      const result = await response.json().catch(() => null) as { ok?: boolean; next?: string; message?: string } | null;

      if (!response.ok || !result?.ok) {
        setMessage(result?.message ?? 'The entrance could not open. Try again.');
        return;
      }

      setMessage(method === 'guest' ? 'Guest access confirmed.' : 'Identity confirmed.');
      window.location.assign(destinationAfterSignIn(result.next ?? '/'));
    } catch {
      setMessage('Sign-in did not finish. Close any blocked popup and try again.');
    } finally {
      setSubmitting(null);
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
          <p><i aria-hidden="true" /> Protected entrance</p>
        </header>

        <div className={styles.layout}>
          <div className={styles.entrance}>
            <div className={styles.entranceMark} aria-hidden="true"><span>01</span><i /><span>ENTER</span></div>
            <p className={styles.enterEyebrow}>Identity required</p>
            <h1 id="signal-lock-title">Enter<br />MBMApps.</h1>
            <p className={styles.intro}>Sign in with an approved provider, or continue with a restricted guest session.</p>

            <div className={styles.providerGrid} aria-label="Sign-in choices">
              {role && (
                <button className={styles.guestButton} type="button" disabled={submitting !== null}
                  onClick={() => onContinue ? onContinue() : window.location.assign(destinationAfterSignIn(searchParams.get('next')))}>
                  <span>Continue</span><small>Existing {role} session</small>
                </button>
              )}
              <button type="button" onClick={() => enter('google')} disabled={submitting !== null}>
                <span>Google</span><small>{submitting === 'google' ? 'Opening…' : 'Continue'}</small>
              </button>
              <button type="button" onClick={() => enter('microsoft')} disabled={submitting !== null}>
                <span>Microsoft</span><small>{submitting === 'microsoft' ? 'Opening…' : 'Continue'}</small>
              </button>
              <button type="button" onClick={() => enter('apple')} disabled={submitting !== null}>
                <span>Apple</span><small>{submitting === 'apple' ? 'Opening…' : 'Continue'}</small>
              </button>
              <button className={styles.guestButton} type="button" onClick={() => enter('guest')} disabled={submitting !== null}>
                <span>Guest</span><small>{submitting === 'guest' ? 'Preparing…' : 'Portfolio access'}</small>
              </button>
            </div>

            <p className={styles.entranceStatus} role="status" aria-live="polite"><span aria-hidden="true" />{message}</p>
          </div>
        </div>

        <footer className={styles.footer}>
          <span>MBMApps / Chicago</span>
          <span>Guest access · portfolio only</span>
        </footer>
      </div>
    </section>
  );
}
