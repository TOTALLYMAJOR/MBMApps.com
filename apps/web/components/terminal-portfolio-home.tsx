'use client';

import Link from 'next/link';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight, Moon, Send, Sun, X } from 'lucide-react';
import { currentConsentPolicyVersion, type ChatLeadDeliveryResponse } from '@mbm/contracts';
import { BrandMark } from '@/components/brand-mark';
import { projectScreens } from '@/lib/projects';
import { siteConfig } from '@/lib/site';
import { OperatingWorldSphere, type OperatingWorldMode } from '@/components/operating-world-sphere';
import { LiveProductSite } from '@/components/live-product-site';
import { WaleHomeSection } from '@/components/wale-home-section';

type ChatLine = { from: 'studio' | 'visitor'; text: string };
type ChatDeliveryState = { status: 'idle' | 'sending' | 'saved' | 'sent' | 'error'; message: string };

const capabilities = [
  'Next.js',
  'React',
  'TypeScript',
  'Firebase',
  'PostgreSQL',
  'Stripe',
  'Vercel',
  'Product systems'
];

const prompts = [
  'I need help choosing an app',
  'I need custom software',
  'I want to discuss a partnership'
];

export function TerminalPortfolioHome() {
  const [light, setLight] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [operatingMode, setOperatingMode] = useState<OperatingWorldMode>('observe');
  const methodologyProgress = 0;
  const [draft, setDraft] = useState('');
  const [replyEmail, setReplyEmail] = useState('');
  const [chatConsent, setChatConsent] = useState(false);
  const [chatDelivery, setChatDelivery] = useState<ChatDeliveryState>({ status: 'idle', message: '' });
  const [lines, setLines] = useState<ChatLine[]>([
    { from: 'studio', text: 'Hi. Tell me what you are trying to improve. I can point you toward an MBMApps product or prepare an email for the studio.' }
  ]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem('mbm-theme');
    setLight(saved === 'light');

    const syncTheme = (event: Event) => setLight((event as CustomEvent<{ light: boolean }>).detail?.light ?? false);
    window.addEventListener('mbm-theme-change', syncTheme);
    return () => window.removeEventListener('mbm-theme-change', syncTheme);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (chatOpen && !dialog.open) {
      dialog.showModal();
    } else if (!chatOpen && dialog.open) {
      dialog.close();
      openerRef.current?.focus();
    }
  }, [chatOpen]);

  useEffect(() => {
    document.body.style.overflow = chatOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [chatOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ block: 'nearest' });
  }, [lines]);

  useLayoutEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const home = document.querySelector<HTMLElement>('.terminal-home');
    home?.classList.add('terminal-home--motion-ready');
    const revealItems = Array.from(home?.querySelectorAll<HTMLElement>('[data-reveal]') ?? []);
    if (reducedMotion.matches) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealItems.forEach((item) => observer.observe(item));

    return () => {
      observer.disconnect();
    };
  }, []);

  function openChat(event: React.MouseEvent<HTMLButtonElement>) {
    openerRef.current = event.currentTarget;
    setChatOpen(true);
  }

  function toggleTheme() {
    const next = !light;
    setLight(next);
    window.localStorage.setItem('mbm-theme', next ? 'light' : 'dark');
    document.documentElement.dataset.theme = next ? 'light' : 'dark';
    window.dispatchEvent(new CustomEvent('mbm-theme-change', { detail: { light: next } }));
  }

  function sendMessage(text = draft) {
    const value = text.trim();
    if (!value) return;
    const lower = value.toLowerCase();
    let reply = 'That sounds like a custom workflow conversation. I can hand this to the studio with the context you shared.';
    if (lower.includes('choos') || lower.includes('app')) {
      reply = 'QuietPilot is for catering operations, LeaguePilot is for youth-sports coordination, and QuoteFlow connects quote decisions to event work. Tell me which environment sounds closest.';
    } else if (lower.includes('partner')) {
      reply = 'Partnership conversations are welcome. The fastest next step is an email with the audience, distribution idea, and the outcome you want to create.';
    }
    setLines((current) => [
      ...current,
      { from: 'visitor' as const, text: value },
      { from: 'studio' as const, text: reply }
    ].slice(-20));
    setChatDelivery({ status: 'idle', message: '' });
    setDraft('');
  }

  const transcript = lines.map((line) => `${line.from === 'visitor' ? 'Visitor' : 'MBMApps'}: ${line.text}`).join('\n').slice(-4000);
  const mailto = `mailto:${siteConfig.email}?subject=${encodeURIComponent('MBMApps project conversation')}&body=${encodeURIComponent(`Hello MBMApps,\n\nHere is the context from the website chat:\n\n${transcript}\n\nMy name and preferred contact details:`)}`;
  const hasVisitorMessage = lines.some((line) => line.from === 'visitor');

  async function sendTranscript(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hasVisitorMessage || !replyEmail.trim() || !chatConsent || chatDelivery.status === 'sending') return;

    const website = new FormData(event.currentTarget).get('website');
    setChatDelivery({ status: 'sending', message: 'Saving your transcript...' });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          replyTo: replyEmail.trim(),
          transcript,
          source: 'mbmapps-guided-chat',
          website: typeof website === 'string' ? website : '',
          consent: {
            dataProcessingAccepted: true,
            marketingOptIn: false,
            acceptedAt: new Date().toISOString(),
            policyVersion: currentConsentPolicyVersion
          }
        })
      });
      const result = (await response.json().catch(() => null)) as Partial<ChatLeadDeliveryResponse> & { message?: string } | null;

      if (!response.ok || !result?.ok || result.state !== 'persisted' || !result.notification) {
        setChatDelivery({
          status: 'error',
          message: result?.message ?? 'Direct delivery is unavailable. Use the email-app handoff below.'
        });
        return;
      }

      setChatDelivery({
        status: result.notification === 'provider-accepted' ? 'sent' : 'saved',
        message: result.message ?? 'Your transcript is saved.'
      });
    } catch {
      setChatDelivery({ status: 'error', message: 'Network issue. Use the email-app handoff below.' });
    }
  }

  return (
    <div className={`terminal-home terminal-home--homepage ${light ? 'terminal-home--light' : ''}`}>
      <nav className="terminal-nav" aria-label="Homepage sections">
        <div className="terminal-shell terminal-nav__inner">
          <div className="terminal-nav__links">
            <a className="terminal-nav__brand" href="#home" aria-label="MBMApps home"><BrandMark /></a>
            <a href="#wale"><span>[01]</span> wale</a>
            <a href="#quotepilot"><span>[02]</span> quote pilot</a>
            <a href="#leaguepilot"><span>[03]</span> league pilot</a>
            <Link href="/discuss"><span>[04]</span> discuss ai</Link>
          </div>
          <button type="button" onClick={toggleTheme} aria-label={`Switch to ${light ? 'dark' : 'light'} theme`}>
            {light ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
            <span>[t] {light ? 'dark' : 'light'}</span>
          </button>
        </div>
      </nav>

      <div>
        <section id="home" className="terminal-shell terminal-hero" data-reveal>
          <OperatingWorldSphere
            mode={operatingMode}
            progress={methodologyProgress}
            onModeChange={setOperatingMode}
            showControls={false}
          />
          <div className="terminal-hero__copy">
            <p className="terminal-command"><span>~/mbmapps</span> $ whoami</p>
            <div className="terminal-hero__brand">
              <BrandMark className="terminal-hero__logo" priority />
              <p><strong>MBMApps</strong><span>Independent software studio · Chicago</span></p>
            </div>
            <h1>Software for operations that cannot run on guesswork.</h1>
            <p className="terminal-subline">Focused products · explicit authority · evidence-backed decisions</p>
            <p className="terminal-lede">We build focused operating systems for catering, youth sports, and quote-to-event work. Teams can see what is known, what is blocked, and what needs a human decision.</p>
            <div className="terminal-links terminal-hero__actions">
              <a className="terminal-hero__primary" href="#wale">Explore Wale <ArrowUpRight aria-hidden="true" /></a>
              <a href="#quotepilot">Explore products</a>
              <Link href="/about">See how we work</Link>
              <Link href="/control-plane">Explore control-plane simulation</Link>
              <button type="button" onClick={openChat}>Start a conversation</button>
            </div>
            <div className="terminal-hero__evidence" aria-label="Studio overview">
              <p><strong>Products</strong><span>{projectScreens.map((product) => product.name).join(' · ')}</span></p>
              <p><strong>Method</strong><span>Observe · Verify · Ship · Prove</span></p>
              <p><strong>Studio</strong><span>Chicago · direct contact</span></p>
            </div>
          </div>
          <aside className="terminal-status" aria-label="Studio status">
            <div className="terminal-status__mark">MBM</div>
            <div className="terminal-status__cards">
              <div><span>status</span><strong><i /> open for new engagements</strong></div>
              <div><span>portfolio</span><strong>{projectScreens.length} products listed</strong></div>
              <div><span>response</span><strong>direct studio contact</strong></div>
            </div>
          </aside>
        </section>

        <WaleHomeSection />

        <section className="terminal-section terminal-shell" aria-labelledby="stack-title" data-reveal>
          <h2 id="stack-title"><span>*</span> stack</h2>
          <div className="terminal-marquee" aria-label="Core technology and capabilities">
            <div>
              <span className="terminal-marquee__group">{capabilities.map((item) => <span key={item}>{item}</span>)}</span>
              <span className="terminal-marquee__group" aria-hidden="true">{capabilities.map((item) => <span key={`repeat-${item}`}>{item}</span>)}</span>
            </div>
          </div>
        </section>

        <LiveProductSite slug="quoteflow" id="quotepilot" label="QuotePilot" />
        <LiveProductSite slug="leaguepilot" id="leaguepilot" label="LeaguePilot" />
      </div>

      <footer className="terminal-shell terminal-footer">
        <p>© {new Date().getFullYear()} {siteConfig.legalName} · next.js · typescript</p>
        <p>chicago, usa · built for clear decisions</p>
      </footer>

      <dialog ref={dialogRef} className="terminal-chat" aria-labelledby="chat-title" onCancel={(event) => { event.preventDefault(); setChatOpen(false); }}>
          <header>
            <div><span>$ contact --interactive</span><h2 id="chat-title">MBMApps studio chat</h2></div>
            <button type="button" onClick={() => setChatOpen(false)} aria-label="Close chat"><X aria-hidden="true" /></button>
          </header>
          <div className="terminal-chat__body" aria-live="polite">
            {lines.map((line, index) => <p key={`${line.from}-${index}`} className={`terminal-chat__line terminal-chat__line--${line.from}`}><span>{line.from === 'studio' ? 'mbm' : 'you'}:</span> {line.text}</p>)}
            <div ref={chatEndRef} />
          </div>
          {lines.length < 3 ? <div className="terminal-chat__prompts">{prompts.map((prompt) => <button key={prompt} type="button" onClick={() => sendMessage(prompt)}>{prompt}</button>)}</div> : null}
          <form className="terminal-chat__composer" onSubmit={(event) => { event.preventDefault(); sendMessage(); }}>
            <label htmlFor="chat-message">Message</label>
            <input id="chat-message" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Describe the workflow or product..." maxLength={600} autoFocus />
            <button type="submit" aria-label="Send message"><Send aria-hidden="true" /></button>
          </form>
          <form className="terminal-chat__delivery" onSubmit={sendTranscript}>
            <input className="terminal-chat__honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <label htmlFor="chat-reply-email">Your email for a reply</label>
            <div className="terminal-chat__delivery-row">
              <input id="chat-reply-email" type="email" value={replyEmail} onChange={(event) => { setReplyEmail(event.target.value); setChatDelivery({ status: 'idle', message: '' }); }} placeholder="you@example.com" autoComplete="email" required />
              <button type="submit" disabled={!hasVisitorMessage || !chatConsent || ['sending', 'saved', 'sent'].includes(chatDelivery.status)}>
                {chatDelivery.status === 'sending' ? 'Saving...' : ['saved', 'sent'].includes(chatDelivery.status) ? 'Transcript saved' : 'Send transcript'}
              </button>
            </div>
            <label className="terminal-chat__consent">
              <input type="checkbox" checked={chatConsent} onChange={(event) => { setChatConsent(event.target.checked); setChatDelivery({ status: 'idle', message: '' }); }} />
              <span>MBMApps may use this email and transcript to reply.</span>
            </label>
            {chatDelivery.message ? <p className={`terminal-chat__delivery-status terminal-chat__delivery-status--${chatDelivery.status}`} role="status">{chatDelivery.message}</p> : null}
          </form>
          <a className="terminal-chat__handoff" href={mailto}>Open transcript in my email app <ArrowUpRight aria-hidden="true" /></a>
          <p className="terminal-chat__note">Nothing is sent until you choose direct delivery or send from your email app.</p>
      </dialog>

    </div>
  );
}
