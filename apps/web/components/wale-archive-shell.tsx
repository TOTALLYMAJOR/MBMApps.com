'use client';

import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, Copy, GitBranch, X } from 'lucide-react';
import { abyssCopy } from '@/components/wale/abyss-model';
import { canRevealWale, WALE_ARCHIVE_SRC, waleOpeningTiming } from '@/lib/wale-opening';
import { normalizeGithubRepository } from '@/lib/wale-repository';
import styles from './wale-archive-shell.module.css';

const LOCAL_WALE_URL = 'http://127.0.0.1:8787/?start=guided';

export function WaleArchiveShell({ embedded = false }: { embedded?: boolean } = {}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const visitorAdvancedRef = useRef(false);
  const reduceMotion = Boolean(useReducedMotion());
  const [archiveMounted, setArchiveMounted] = useState(embedded);
  const [minimumElapsed, setMinimumElapsed] = useState(false);
  const [visitorAdvanced, setVisitorAdvanced] = useState(false);
  const [repository, setRepository] = useState('');
  const [error, setError] = useState('');
  const [validated, setValidated] = useState('');
  const [copied, setCopied] = useState(false);
  const [launchRequested, setLaunchRequested] = useState(false);
  const timing = waleOpeningTiming(reduceMotion);
  const openingVisible = !embedded && !canRevealWale({ minimumElapsed, visitorAdvanced });

  useEffect(() => {
    if (embedded) return;
    const timer = window.setTimeout(() => setMinimumElapsed(true), timing.holdMs);
    return () => window.clearTimeout(timer);
  }, [timing.holdMs, embedded]);

  const advanceOpening = useCallback(() => {
    visitorAdvancedRef.current = true;
    setVisitorAdvanced(true);
  }, []);

  const openProfile = () => {
    dialog.current?.showModal();
    window.requestAnimationFrame(() => input.current?.focus());
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = normalizeGithubRepository(repository);
    setCopied(false);
    setLaunchRequested(false);

    if (!result.ok) {
      setValidated('');
      setError(result.error);
      input.current?.focus();
      return;
    }

    setError('');
    setRepository(result.value);
    setValidated(result.value);
  };

  return (
    <div className={embedded ? styles.embedded : styles.root}>
      <button
        ref={trigger}
        className={styles.profileButton}
        type="button"
        onClick={openProfile}
        aria-hidden={openingVisible}
        tabIndex={openingVisible ? -1 : 0}
      >
        Profile your system <ArrowRight size={18} aria-hidden="true" />
      </button>

      {archiveMounted && (
        <iframe
          className={styles.archive}
          data-scroll-preview={embedded || undefined}
          inert={embedded}
          tabIndex={embedded ? -1 : undefined}
          aria-hidden={embedded || undefined}
          src={WALE_ARCHIVE_SRC}
          title="Wale living archive"
          allow="autoplay; fullscreen"
        />
      )}

      <AnimatePresence
        initial={false}
        onExitComplete={() => {
          setArchiveMounted(true);
          if (visitorAdvancedRef.current) trigger.current?.focus({ preventScroll: true });
        }}
      >
        {openingVisible && (
          <motion.section
            key="wale-opening"
            className={styles.opening}
            data-wale-opening
            aria-labelledby="wale-opening-title"
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -18 }}
            transition={{ duration: timing.fadeSeconds, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className={styles.openingHeader}>
              <p><strong>WALE</strong><span>BY MBMAPPS</span></p>
              <span>LOCAL-FIRST DEVELOPMENT INTELLIGENCE</span>
            </header>

            <div className={styles.openingBody}>
              <p className={styles.openingEyebrow}>{abyssCopy.eyebrow}</p>
              <h1 id="wale-opening-title">
                <span>{abyssCopy.primary}</span>
                <strong>{abyssCopy.payoff}</strong>
              </h1>
              <p className={styles.openingSupport}>{abyssCopy.support}</p>
              <button type="button" onClick={advanceOpening}>
                Enter Wale <ArrowRight size={17} aria-hidden="true" />
              </button>
            </div>

            <div className={styles.openingStatus} aria-live="polite">
              <span>Cinema quality selected</span>
              <span>{abyssCopy.boundary}</span>
            </div>

            <div className={styles.openingProgress} aria-hidden="true">
              <motion.i
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: timing.holdMs / 1_000, ease: 'linear' }}
              />
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-labelledby="repository-title"
        onClose={() => trigger.current?.focus()}
      >
        <div className={styles.dialogHeader}>
          <div>
            <p>Repository handoff</p>
            <h1 id="repository-title">Profile your system.</h1>
          </div>
          <button type="button" aria-label="Close repository entry" onClick={() => dialog.current?.close()}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <p className={styles.intro}>
          Start with the GitHub repository you want Wale to understand.
        </p>

        <form onSubmit={submit} noValidate>
          <label htmlFor="wale-archive-repository">GitHub repository</label>
          <div className={styles.inputRow}>
            <GitBranch size={20} aria-hidden="true" />
            <input
              ref={input}
              id="wale-archive-repository"
              type="url"
              value={repository}
              placeholder="https://github.com/owner/repository"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              aria-invalid={Boolean(error)}
              aria-describedby={"repository-prerequisites" + (error ? " repository-error" : "")}
              onChange={(event) => {
                setRepository(event.target.value);
                setError('');
                setValidated('');
                setCopied(false);
                setLaunchRequested(false);
              }}
            />
            <button type="submit" aria-label="Review repository URL">
              <ArrowRight size={20} aria-hidden="true" />
            </button>
          </div>

          {error && <p id="repository-error" className={styles.error} role="alert">{error}</p>}

          <p id="repository-prerequisites" className={styles.prerequisites}>
            Before opening Wale, run your local Wale bridge on port 8787 and select the matching checkout there.
            This page checks the URL format only. It does not upload, analyze, or send your repository to the local app.
          </p>
        </form>

        {validated && (
          <div className={styles.handoff} role="status">
            <p><Check size={17} aria-hidden="true" /> URL format checked. Continue in your local Wale.</p>
            <div className={styles.actions}>
              <a
                href={LOCAL_WALE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-describedby="repository-prerequisites"
                onClick={() => setLaunchRequested(true)}
              >
                Open local Wale <ArrowRight size={17} aria-hidden="true" />
              </a>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(validated);
                    setCopied(true);
                  } catch {
                    setError('Clipboard unavailable. Select and copy the repository URL from the field above.');
                    input.current?.focus();
                  }
                }}
              >
                <Copy size={16} aria-hidden="true" /> {copied ? 'Copied' : 'Copy URL'}
              </button>
            </div>
            {launchRequested && (
              <p className={styles.launchNote}>
                Local window requested—not a confirmed connection. If it did not open, start your bridge and try again.
              </p>
            )}
          </div>
        )}
      </dialog>
    </div>
  );
}
