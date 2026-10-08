'use client';

import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, Check, Copy, GitBranch, Menu, Pause, Play, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { normalizeGithubRepository } from '../lib/wale-repository';
import { chapterCopyOpacity, scrollCueOpacity } from '../lib/wale-copy-motion';
import { WaleMusic } from './wale-music';
import styles from './wale-particles.module.css';

const SignalField = dynamic(() => import('./wale-signal-field').then(module => module.WaleSignalField), { ssr: false });
const LOCAL_WALE_URL = 'http://127.0.0.1:8787/?start=guided';
const chapters = [
  { id: 'discover', verb: 'Discover.', title: 'First, see what’s there.', body: 'Intent. Structure. Dependencies. Bring the separate signals of your repository into one shared picture.', detail: 'The relationships matter as much as the parts.', terms: ['Intent', 'Structure', 'Dependencies'] },
  { id: 'understand', verb: 'Understand.', title: 'Find the connections.', body: 'Follow the relationships between what your system is meant to do and how it actually works.', detail: 'Keep the evidence close to the explanation.', terms: ['Context', 'Evidence', 'Relationships'] },
  { id: 'improve', verb: 'Improve.', title: 'Change what matters.', body: 'Expose a constraint. Consider the smallest useful intervention. Keep the decision yours.', detail: 'Recommendations remain reviewable. Changes need your approval.', terms: ['Constraint', 'Possibility', 'Human judgment'] },
  { id: 'evolve', verb: 'Evolve.', title: 'A system that moves forward.', body: 'Turn understanding into a bounded plan. Verify what changed before calling it progress.', detail: 'Discover. Understand. Improve. Learn.', terms: ['Prepare', 'Verify', 'Learn'] }
] as const;

function ProfileSystemButton({ onClick, className = '' }: { onClick: () => void; className?: string }) {
  return <button type="button" className={`${styles.profileAction} ${className}`} onClick={onClick}><span>Profile my system</span><ArrowRight size={20} strokeWidth={1.5} aria-hidden="true" /></button>;
}

export function WaleLaunch() {
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [sceneStatus, setSceneStatus] = useState<'loading' | 'ready' | 'fallback'>('loading');
  const [repository, setRepository] = useState('');
  const [error, setError] = useState('');
  const [validated, setValidated] = useState('');
  const [copied, setCopied] = useState(false);
  const [launchRequested, setLaunchRequested] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const navigatingFromMenu = useRef(false);
  const scrollTween = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => { setReducedMotion(media.matches); if (media.matches) scrollTween.current?.progress(1); };
    updateMotion();
    media.addEventListener('change', updateMotion);
    let frame = 0;
    const update = () => {
      frame = 0;
      const end = document.getElementById('repository')?.offsetTop ?? window.innerHeight * 5;
      setProgress(Math.max(0, Math.min(5, window.scrollY / Math.max(1, end) * 5)));
      document.querySelectorAll<HTMLElement>(`.${styles.chapterCopy}, .${styles.chapterBottom}`).forEach(copy => {
        const rect = copy.getBoundingClientRect();
        copy.style.setProperty('--copy-opacity', String(chapterCopyOpacity(rect.top, copy.offsetTop, window.innerHeight)));
      });
      document.querySelectorAll<HTMLElement>(`.${styles.heroBottom} a, .${styles.chapterDetail}>a`).forEach(cue => {
        const opacity = scrollCueOpacity(cue.getBoundingClientRect().top, window.innerHeight);
        cue.style.setProperty('--cue-opacity', String(opacity));
        cue.dataset.hidden = String(opacity < 0.01);
      });
    };
    const request = () => { if (!frame) frame = requestAnimationFrame(update); };
    const interrupt = () => scrollTween.current?.kill();
    const interruptWithKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement && (event.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName))) return;
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) interrupt();
    };
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    window.addEventListener('wheel', interrupt, { passive: true });
    window.addEventListener('touchstart', interrupt, { passive: true });
    window.addEventListener('keydown', interruptWithKey);
    update();
    return () => {
      media.removeEventListener('change', updateMotion);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      window.removeEventListener('wheel', interrupt);
      window.removeEventListener('touchstart', interrupt);
      window.removeEventListener('keydown', interruptWithKey);
      cancelAnimationFrame(frame); scrollTween.current?.kill();
    };
  }, []);

  const goTo = useCallback((id: string, focusInput = false) => {
    navigatingFromMenu.current = Boolean(dialog.current?.open);
    dialog.current?.close(); setMenuOpen(false); scrollTween.current?.kill();
    const target = document.getElementById(id);
    if (!target) return;
    const finish = () => (focusInput ? input.current : target)?.focus({ preventScroll: true });
    if (reducedMotion) { window.scrollTo({ top: target.offsetTop, behavior: 'instant' }); finish(); return; }
    const position = { y: window.scrollY };
    scrollTween.current = gsap.to(position, { y: target.offsetTop, duration: 1.05, ease: 'power3.inOut', onUpdate: () => window.scrollTo({ top: position.y, behavior: 'instant' }), onComplete: finish });
  }, [reducedMotion]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = normalizeGithubRepository(repository);
    setCopied(false); setLaunchRequested(false);
    if (!result.ok) { setValidated(''); setError(result.error); input.current?.focus(); return; }
    setError(''); setRepository(result.value); setValidated(result.value);
  };

  return (
    <div className={styles.experience} data-experience="living-signal-field" data-chapter={Math.round(progress)} data-motion-paused={paused || menuOpen}>
      <a className={styles.skip} href="#repository">Skip to repository entry</a>
      <div className={styles.scene} aria-hidden="true">
        <div className={styles.fallback} data-visible={sceneStatus !== 'ready'} />
        <SignalField progress={progress} paused={paused || menuOpen} reducedMotion={reducedMotion} onStatus={setSceneStatus} />
        <div className={styles.sceneShade} />
      </div>
      <header className={styles.header}>
        <a href="#intro" onClick={event => { event.preventDefault(); goTo('intro'); }} className={styles.wordmark} aria-label="Wale home">wale<span>.</span></a>
        <nav className={styles.navigation} aria-label="Main navigation">
          <a className={styles.textLink} href="#discover" onClick={event => { event.preventDefault(); goTo('discover'); }}>The way forward</a>
          <ProfileSystemButton onClick={() => goTo('repository', true)} />
          <button ref={menuButton} className={styles.iconButton} aria-label="Open navigation" aria-expanded={menuOpen} aria-controls="wale-menu" onClick={() => { dialog.current?.showModal(); setMenuOpen(true); }}><Menu size={22} /></button>
        </nav>
      </header>
      <div>
        <section id="intro" className={`${styles.chapter} ${styles.hero}`} tabIndex={-1} aria-labelledby="hero-title">
          <div className={styles.heroCopy}>
            <h1 id="hero-title">Make the<br />whole system<br /><span>work.</span></h1>
            <p>See how it fits together.<br />Discover what it could become.</p>
            <ProfileSystemButton onClick={() => goTo('repository', true)} />
          </div>
          <div className={styles.heroBottom}><p>System discovery.<br />Human-directed evolution.</p><a href="#discover" onClick={event => { event.preventDefault(); goTo('discover'); }} aria-label="Scroll to discover"><ArrowDown size={22} /></a></div>
        </section>
        {chapters.map((chapter, index) => (
          <section id={chapter.id} key={chapter.id} className={styles.chapter} tabIndex={-1} aria-labelledby={`${chapter.id}-title`}>
            <div className={styles.chapterCopy}><span className={styles.number}>0{index + 1} / 04</span><h2 id={`${chapter.id}-title`}>{chapter.title}</h2><p>{chapter.body}</p></div>
            <div className={styles.chapterBottom}><p className={styles.largeVerb}>{chapter.verb}</p><div className={styles.chapterDetail}><div className={styles.terms}>{chapter.terms.map(term => <span key={term}>{term}</span>)}</div><p>{chapter.detail}</p><a href={`#${chapters[index + 1]?.id ?? 'repository'}`} onClick={event => { event.preventDefault(); goTo(chapters[index + 1]?.id ?? 'repository', index === 3); }} aria-label={index === 3 ? 'Enter your repository' : `Continue to ${chapters[index + 1]?.id}`}><ArrowDown size={24} /></a></div></div>
          </section>
        ))}
        <section id="repository" className={`${styles.chapter} ${styles.repository}`} tabIndex={-1} aria-labelledby="repository-title">
          <div className={styles.repositoryContent}>
            <h2 id="repository-title">Your system.<br /><span>A clearer future.</span></h2>
            <p>Start with the repository you want to understand.</p>
            <form onSubmit={submit} className={styles.form} noValidate>
              <label htmlFor="repository-url">GitHub repository</label>
              <div className={styles.inputRow}><GitBranch size={24} aria-hidden="true" /><input ref={input} id="repository-url" value={repository} onChange={event => { setRepository(event.target.value); setValidated(''); setError(''); setLaunchRequested(false); }} placeholder="https://github.com/owner/repository" autoCapitalize="none" autoCorrect="off" spellCheck={false} type="url" aria-invalid={Boolean(error)} aria-describedby={`repository-prerequisites${error ? ' repository-error' : ''}`} /><button type="submit" aria-label="Review repository URL"><ArrowRight size={24} /></button></div>
              {error && <p className={styles.error} id="repository-error" role="alert">{error}</p>}
              <p id="repository-prerequisites" className={styles.prerequisites}>Before opening Wale: run your local Wale bridge on port 8787 and select the matching checkout there. This page checks the URL format only. It does not upload, analyze, or send your repository to the local app.</p>
            </form>
            {validated && <div className={styles.handoff} role="status"><p><Check size={18} aria-hidden="true" /> URL format checked. Continue in your local Wale.</p><div className={styles.handoffActions}><a href={LOCAL_WALE_URL} aria-describedby="repository-prerequisites" target="_blank" rel="noopener noreferrer" className={styles.primary} onClick={() => setLaunchRequested(true)}>Open local Wale <ArrowRight size={18} /></a><button className={styles.copy} onClick={async () => { try { await navigator.clipboard.writeText(validated); setCopied(true); } catch { setError('Clipboard unavailable. Select and copy the repository URL from the field above.'); input.current?.focus(); } }}><Copy size={16} />{copied ? 'Copied' : 'Copy URL'}</button></div>{launchRequested && <p className={styles.launchNote}>Local window requested—not a confirmed connection. If it did not open, start your bridge and try again. Choose the matching repository inside Wale.</p>}</div>}
          </div>
            <footer className={styles.footer}><span className={styles.wordmark}>wale<span>.</span></span><p>Understand first.<br />Improve with intention.<small className={styles.musicCredit}>Moonlight Sonata I · Paul Pitman / <a href="https://musopen.org/" target="_blank" rel="noopener noreferrer">Musopen</a></small></p><a href="#intro" onClick={event => { event.preventDefault(); goTo('intro'); }}>Back to the beginning ↑</a></footer>
        </section>
      </div>
      <WaleMusic />
      <div className={styles.sceneControls}><span>{sceneStatus === 'fallback' ? 'Static view · ' : sceneStatus === 'loading' ? 'Preparing scene · ' : ''}Illustrative system · no repository connected</span><button onClick={() => setPaused(current => !current)} disabled={reducedMotion || sceneStatus !== 'ready'} aria-label={paused ? 'Resume ambient motion' : 'Pause ambient motion'}>{paused || reducedMotion ? <Play size={13} /> : <Pause size={13} />}<span>{reducedMotion ? 'Reduced motion' : paused ? 'Resume' : 'Pause'}</span></button></div>
      <dialog ref={dialog} id="wale-menu" className={styles.menu} onClose={() => { setMenuOpen(false); if (!navigatingFromMenu.current) menuButton.current?.focus(); navigatingFromMenu.current = false; }} aria-label="Wale navigation"><div className={styles.menuTop}><span className={styles.wordmark}>wale<span>.</span></span><button className={styles.iconButton} aria-label="Close navigation" onClick={() => dialog.current?.close()}><X size={24} /></button></div><nav aria-label="Chapters">{[{ id: 'intro', verb: 'The whole system.' }, ...chapters].map((item, index) => <a key={item.id} href={`#${item.id}`} onClick={event => { event.preventDefault(); goTo(item.id); }}><span>0{index}</span>{item.verb}<ArrowRight /></a>)}<button className={styles.primary} onClick={() => goTo('repository', true)}>Profile your system <ArrowRight size={20} /></button></nav><p>From scattered signals to a clearer way forward.</p></dialog>
    </div>
  );
}
