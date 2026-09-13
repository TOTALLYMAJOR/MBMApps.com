'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, ChevronDown, Layers3, Mail, MessageSquare, Moon, Send, Sun, X } from 'lucide-react';
import { currentConsentPolicyVersion, type ChatLeadDeliveryResponse } from '@mbm/contracts';
import { SelectedWorkRail } from '@/components/selected-work-rail';
import { projectScreens } from '@/lib/projects';
import { siteConfig } from '@/lib/site';

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
  const [showAll, setShowAll] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);
  const [studioLoaded, setStudioLoaded] = useState(false);
  const [draft, setDraft] = useState('');
  const [replyEmail, setReplyEmail] = useState('');
  const [chatConsent, setChatConsent] = useState(false);
  const [chatDelivery, setChatDelivery] = useState<ChatDeliveryState>({ status: 'idle', message: '' });
  const [lines, setLines] = useState<ChatLine[]>([
    { from: 'studio', text: 'Hi. Tell me what you are trying to improve. I can point you toward an MBMApps product or prepare an email for the studio.' }
  ]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const studioDialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const studioOpenerRef = useRef<HTMLButtonElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem('mbm-theme');
    setLight(saved === 'light');
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
    const dialog = studioDialogRef.current;
    if (!dialog) return;
    if (studioOpen && !dialog.open) {
      dialog.showModal();
      dialog.querySelector<HTMLButtonElement>('button')?.focus();
    } else if (!studioOpen && dialog.open) {
      dialog.close();
      studioOpenerRef.current?.focus();
    }
  }, [studioOpen]);

  useEffect(() => {
    document.body.style.overflow = chatOpen || studioOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [chatOpen, studioOpen]);

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
    setStudioOpen(false);
    setChatOpen(true);
  }

  function openStudio(event: React.MouseEvent<HTMLButtonElement>) {
    studioOpenerRef.current = event.currentTarget;
    setChatOpen(false);
    setStudioLoaded(true);
    setStudioOpen(true);
  }

  function toggleTheme() {
    setLight((current) => {
      const next = !current;
      window.localStorage.setItem('mbm-theme', next ? 'light' : 'dark');
      return next;
    });
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
    <div className={`terminal-home ${light ? 'terminal-home--light' : ''}`}>
      <nav className="terminal-nav" aria-label="Homepage sections">
        <div className="terminal-shell terminal-nav__inner">
          <div className="terminal-nav__links">
            <a href="#home"><span>[h]</span> home</a>
            <a href="#apps"><span>[a]</span> apps</a>
            <a href="#commerce"><span>[e]</span> commerce</a>
            <button type="button" onClick={openStudio} aria-haspopup="dialog" aria-controls="component-studio-dialog"><span>[u]</span> studio</button>
            <button type="button" onClick={openChat}><span>[m]</span> chat</button>
            <a href="#contact"><span>[c]</span> contact</a>
            <a href="#systems"><span>[s]</span> systems</a>
            <a href="#articles"><span>[r]</span> articles</a>
          </div>
          <button type="button" onClick={toggleTheme} aria-label={`Switch to ${light ? 'dark' : 'light'} theme`}>
            {light ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
            <span>[t] {light ? 'dark' : 'light'}</span>
          </button>
        </div>
      </nav>

      <div>
        <section id="home" className="terminal-shell terminal-hero" data-reveal>
          <div className="terminal-hero__copy">
            <p className="terminal-command"><span>~/mbmapps</span> $ whoami</p>
            <h1>MBMApps<span aria-hidden="true" /></h1>
            <p className="terminal-subline">independent software studio · chicago · proof-driven products</p>
            <p className="terminal-lede">We build focused operating systems for catering, youth sports, and quote-to-event work. Teams can see what is known, what is blocked, and what needs a human decision.</p>
            <div className="terminal-links">
              <a href="#apps">[browse apps]</a>
              <Link href="/about">[about]</Link>
              <a href={siteConfig.social.github}>[github]</a>
              <button type="button" onClick={openChat}>[chat]</button>
              <button type="button" onClick={openStudio} aria-haspopup="dialog" aria-controls="component-studio-dialog">[open component studio]</button>
            </div>
          </div>
          <aside className="terminal-status" aria-label="Studio status">
            <div className="terminal-status__mark">MBM</div>
            <div className="terminal-status__cards">
              <div><span>status</span><strong><i /> open for new engagements</strong></div>
              <div><span>portfolio</span><strong>{projectScreens.length} products live</strong></div>
              <div><span>response</span><strong>direct studio contact</strong></div>
            </div>
          </aside>
        </section>

        <section className="terminal-section terminal-shell" aria-labelledby="stack-title" data-reveal>
          <h2 id="stack-title"><span>*</span> stack</h2>
          <div className="terminal-marquee" aria-label="Core technology and capabilities">
            <div>
              <span className="terminal-marquee__group">{capabilities.map((item) => <span key={item}>{item}</span>)}</span>
              <span className="terminal-marquee__group" aria-hidden="true">{capabilities.map((item) => <span key={`repeat-${item}`}>{item}</span>)}</span>
            </div>
          </div>
        </section>

        <section id="apps" className="terminal-section terminal-shell" aria-labelledby="apps-title" data-reveal>
          <div className="terminal-section__head">
            <div>
              <h2 id="apps-title"><span>*</span> apps</h2>
              <p><span>$</span> ls --products --available</p>
            </div>
            <p>{projectScreens.length} purpose-built systems</p>
          </div>
          <div className="terminal-product-grid">
            {projectScreens.map((product, index) => (
              <article key={product.slug} className={`terminal-product terminal-product--${product.accentToken}`}>
                <Link href={product.path} className="terminal-product__image">
                  <Image src={product.screenshot.src} alt={product.screenshot.alt} fill sizes="(min-width: 800px) 44vw, 100vw" priority={index === 0} />
                </Link>
                <div className="terminal-product__body">
                  <div className="terminal-product__title"><h3>{product.name}</h3><ArrowUpRight aria-hidden="true" /></div>
                  <p className="terminal-product__category">{product.category}</p>
                  <p>{product.description}</p>
                  <div className="terminal-tags">{product.capabilities.slice(0, 4).map((item) => <span key={item.label}>{item.label}</span>)}</div>
                  <div className="terminal-links">
                    <Link href={product.path}>[brief]</Link>
                    <a href={product.websiteUrl}>[live]</a>
                    {product.id === 'quietpilot' ? <a href="https://quietpilot.mbmapps.com/">[mbmapps surface]</a> : null}
                    {product.secondaryAction ? <Link href={product.secondaryAction.href}>[{product.secondaryAction.label.toLowerCase()}]</Link> : null}
                  </div>
                  <p className="terminal-proof"><Check aria-hidden="true" /> {product.accessDescription}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <SelectedWorkRail />

        <section id="systems" className="terminal-section terminal-shell" aria-labelledby="systems-title" data-reveal>
          <h2 id="systems-title"><span>*</span> systems</h2>
          <div className="terminal-system-grid" id="terminal-system-list">
            {projectScreens.slice(0, showAll ? projectScreens.length : 2).map((product) => (
              <article key={product.slug}>
                <Link href={product.path} className="terminal-system-title"><strong>{product.name.toLowerCase()}/authority-map</strong><ArrowUpRight aria-hidden="true" /></Link>
                <p>{product.operatingEnvironment}</p>
                <p>{product.proofBoundary}</p>
              </article>
            ))}
          </div>
          <button className="terminal-disclose" type="button" onClick={() => setShowAll((value) => !value)} aria-expanded={showAll} aria-controls="terminal-system-list">
            [{showAll ? 'show less' : `ls -a (${projectScreens.length})`}] <ChevronDown aria-hidden="true" />
          </button>
        </section>

        <section id="articles" className="terminal-section terminal-shell" aria-labelledby="articles-title" data-reveal>
          <div className="terminal-section__head">
            <div>
              <h2 id="articles-title"><span>*</span> articles</h2>
              <p><span>$</span> cat --ideas --systems</p>
            </div>
            <Link href="/insights">view all articles →</Link>
          </div>
          <article className="terminal-article-feature">
            <Link href="/insights/the-intelligence-improves-your-world-remains" className="terminal-article-feature__image">
              <Image src="/articles/the-intelligence-improves-your-world-remains.webp" alt="A wedding represented as a living operational system connected to observation, policy, action, and verified outcomes" fill sizes="(min-width: 900px) 56vw, 100vw" />
            </Link>
            <div className="terminal-article-feature__copy">
              <p><span>NEW</span> · 2026 · AI SYSTEMS</p>
              <h3><Link href="/insights/the-intelligence-improves-your-world-remains">The Intelligence Improves. Your World Remains.</Link></h3>
              <p>AI&apos;s durable advantage is not a clever prompt or agent diagram. It is a faithful operating world with observation, memory, authority, feedback, and proof.</p>
              <Link href="/insights/the-intelligence-improves-your-world-remains">[read the article] <ArrowUpRight aria-hidden="true" /></Link>
            </div>
          </article>
          <div className="terminal-notes terminal-notes--articles">
            <Link href="/insights/the-proof-register"><strong>The Proof Register</strong><span>Authority, evidence, and the claims software is allowed to make.</span><time>2026</time></Link>
            <Link href="/insights/choosing-cloud-combinations"><strong>Choosing cloud combinations</strong><span>How to assemble infrastructure without hiding operational boundaries.</span><time>2025</time></Link>
          </div>
        </section>

        <section id="contact" className="terminal-section terminal-shell terminal-contact" aria-labelledby="contact-title" data-reveal>
          <div>
            <p className="terminal-command"><span>~/mbmapps/contact</span> $ start</p>
            <h2 id="contact-title"><span>*</span> tell us what needs to work better</h2>
            <p>Share the outcome, the constraint, and what is already in motion. Use the guided chat or contact the studio directly.</p>
          </div>
          <div className="terminal-contact__actions">
            <button type="button" onClick={openChat}><MessageSquare aria-hidden="true" /> [open chat]</button>
            <a href={`mailto:${siteConfig.email}`}><Mail aria-hidden="true" /> [{siteConfig.email}]</a>
          </div>
        </section>
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

      <dialog id="component-studio-dialog" ref={studioDialogRef} className="terminal-studio" aria-labelledby="studio-title" aria-describedby="studio-description" onCancel={(event) => { event.preventDefault(); setStudioOpen(false); }}>
        <header className="terminal-studio__header">
          <div>
            <span>$ launch --utility component-studio</span>
            <h2 id="studio-title"><Layers3 aria-hidden="true" /> Component Studio</h2>
            <p id="studio-description">Compose a visual direction and export an implementation-ready design pack.</p>
          </div>
          <div className="terminal-studio__actions">
            <div className="terminal-studio__status"><i /> local workspace · choices stay in your browser</div>
            <a href="/component-studio.html" target="_blank" rel="noreferrer">[open tab] <ArrowUpRight aria-hidden="true" /></a>
          </div>
          <button type="button" onClick={() => setStudioOpen(false)} aria-label="Close Component Studio"><X aria-hidden="true" /></button>
        </header>
        {studioLoaded ? <iframe src="/component-studio.html" title="Component Studio interface builder" loading="lazy" allow="clipboard-write" /> : null}
      </dialog>
    </div>
  );
}
