'use client';

import Link from 'next/link';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown, ExternalLink, LockKeyhole, Moon, Send, Sun, X } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { currentConsentPolicyVersion, type ChatLeadDeliveryResponse } from '@mbm/contracts';
import { BrandMark } from '@/components/brand-mark';
import { homepagePortfolio, projectScreens, type HomepagePortfolioItem } from '@/lib/projects';
import { siteConfig } from '@/lib/site';
import { OperatingWorldSphere, type OperatingWorldMode } from '@/components/operating-world-sphere';
import { LiveProductSite } from '@/components/live-product-site';
import { SiteSessionExit, useSiteSession } from '@/components/site-session';
import { WaleHomeSection } from '@/components/wale-home-section';

type ChatLine = { from: 'studio' | 'visitor'; text: string };
type ChatDeliveryState = { status: 'idle' | 'sending' | 'saved' | 'sent' | 'error'; message: string };

const prompts = [
  'I need help choosing an app',
  'I need custom software',
  'I want to discuss a partnership'
];

const approachSteps = [
  { id: 'observe', title: 'Map the real operation', detail: 'See the handoffs, evidence, and places where guesswork enters the work.' },
  { id: 'verify', title: 'Separate claims from proof', detail: 'Distinguish what is known from what is planned, assumed, or still blocked.' },
  { id: 'ship', title: 'Build the operating surface', detail: 'Give each role a focused product with clear state and decision boundaries.' },
  { id: 'prove', title: 'Keep the proof register', detail: 'Connect product claims to evidence and keep the system faithful as work changes.' }
] as const satisfies readonly { id: OperatingWorldMode; title: string; detail: string }[];

const featuredDestinations = homepagePortfolio.filter((item) => item.featured);
const moreDestinations = homepagePortfolio.filter((item) => !item.featured);
function PortfolioDestination({ item, primary = false, hiddenFromKeyboard = false }: { item: HomepagePortfolioItem; primary?: boolean; hiddenFromKeyboard?: boolean }) {
  const external = item.href.startsWith('http');
  const protectedExperience = item.kind === 'Protected showcase';
  const behavior = external ? 'External site' : protectedExperience ? 'Protected experience' : 'MBMApps route';

  return (
    <a
      className={primary ? 'is-primary' : undefined}
      href={item.href}
      data-portfolio-slug={item.slug}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      tabIndex={hiddenFromKeyboard ? -1 : undefined}
    >
      <span className="terminal-destination__copy">
        <strong>{item.name}</strong>
        <small>{item.kind}</small>
        <em>{behavior}</em>
      </span>
      <span className="terminal-destination__action">
        {primary ? 'Explore system' : external ? 'Visit site' : 'Open'}
        {external ? <ExternalLink aria-hidden="true" /> : protectedExperience ? <LockKeyhole aria-hidden="true" /> : <ArrowUpRight aria-hidden="true" />}
      </span>
    </a>
  );
}

export function TerminalPortfolioHome() {
  const { role } = useSiteSession();
  const canUseChat = role === 'member';
  const [light, setLight] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [showMoreDestinations, setShowMoreDestinations] = useState(false);
  const [operatingMode, setOperatingMode] = useState<OperatingWorldMode>('observe');
  const methodologyProgress = approachSteps.findIndex((step) => step.id === operatingMode);
  const activeApproach = approachSteps[methodologyProgress] ?? approachSteps[0];
  const [draft, setDraft] = useState('');
  const [replyEmail, setReplyEmail] = useState('');
  const [chatConsent, setChatConsent] = useState(false);
  const [chatDelivery, setChatDelivery] = useState<ChatDeliveryState>({ status: 'idle', message: '' });
  const [lines, setLines] = useState<ChatLine[]>([
    { from: 'studio', text: 'Hi. Tell me what you are trying to improve. I can point you toward an MBMApps product or prepare an email for the studio.' }
  ]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const homeRef = useRef<HTMLDivElement>(null);
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
    const home = homeRef.current;
    if (!home) return;

    home.classList.add('terminal-home--motion-ready');
    const revealItems = Array.from(home.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (reducedMotion.matches) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return () => home.classList.remove('terminal-home--motion-ready');
    }

    gsap.registerPlugin(ScrollTrigger);
    home.classList.add('terminal-home--cinematic');

    const lenis = new Lenis({
      lerp: 0.075,
      wheelMultiplier: 0.9,
      smoothWheel: true,
      anchors: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    const advanceLenis = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(advanceLenis);

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      const hero = home.querySelector<HTMLElement>('#home');
      const heroSteps = gsap.utils.toArray<HTMLElement>('[data-home-hero-step]', hero ?? home);
      if (hero) {
        gsap.set(hero, { autoAlpha: 1, y: 0 });
        gsap.fromTo(
          heroSteps,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.78, stagger: 0.075, ease: 'power3.out', delay: 0.12 },
        );
      }

      revealItems.filter((item) => item !== hero).forEach((item) => {
        gsap.fromTo(item, { autoAlpha: 0, y: 22 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.72,
          ease: 'power3.out',
          scrollTrigger: { trigger: item, start: 'top 86%', once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-cinematic-section]', home).forEach((section) => {
        const heading = section.querySelector<HTMLElement>('[data-cinematic-heading]');
        const visual = section.querySelector<HTMLElement>('[data-cinematic-visual]');
        if (heading) {
          gsap.fromTo(heading, { autoAlpha: 0, y: 18 }, {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
            ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 84%', once: true },
          });
        }
        if (visual) {
          gsap.fromTo(visual, { autoAlpha: 0, scale: 0.985 }, {
            autoAlpha: 1,
            scale: 1,
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 78%', once: true },
          });
        }
      });

      media.add('(min-width: 901px)', () => {
        const quietStory = home.querySelector<HTMLElement>('[data-quietpilot-story]');
        const quietImage = home.querySelector<HTMLElement>('[data-quietpilot-image]');
        const quietSweep = home.querySelector<HTMLElement>('[data-quietpilot-sweep]');
        const quietSignals = gsap.utils.toArray<HTMLElement>('[data-quietpilot-signal]', home);
        if (!quietStory || !quietImage || !quietSweep) return;

        const story = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: quietStory,
            start: 'top top+=68',
            end: '+=70%',
            scrub: 0.9,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
          },
        });
        story
          .fromTo(quietImage, { scale: 1.07, xPercent: -1.5 }, { scale: 1, xPercent: 1.5, duration: 1 }, 0)
          .fromTo(quietSweep, { xPercent: -130 }, { xPercent: 250, duration: 1 }, 0)
          .fromTo(quietSignals, { autoAlpha: 0, scale: 0.45 }, { autoAlpha: 1, scale: 1, stagger: 0.12, duration: 0.34, ease: 'power2.out' }, 0.22)
          .to(quietSignals, { autoAlpha: 0.56, stagger: 0.1, duration: 0.3 }, 0.7);
      });
    }, home);

    ScrollTrigger.refresh();

    return () => {
      media.revert();
      context.revert();
      gsap.ticker.remove(advanceLenis);
      lenis.destroy();
      home.classList.remove('terminal-home--motion-ready', 'terminal-home--cinematic');
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
    <div ref={homeRef} className={`terminal-home terminal-home--homepage ${light ? 'terminal-home--light' : ''}`}>
      <nav className="terminal-nav" aria-label="Homepage sections">
        <div className="terminal-shell terminal-nav__inner">
          <div className="terminal-nav__links">
            <a className="terminal-nav__brand" href="#home" aria-label="MBMApps home"><BrandMark /></a>
            <Link href="/wale"><span>[01]</span> wale</Link>
            <a href="#portfolio"><span>[02]</span> portfolio</a>
            <Link href="/about"><span>[03]</span> studio</Link>
            {canUseChat ? <Link href="/discuss"><span>[04]</span> discuss ai</Link> : null}
          </div>
          <button type="button" onClick={toggleTheme} aria-label={`Switch to ${light ? 'dark' : 'light'} theme`}>
            {light ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
            <span>[t] {light ? 'dark' : 'light'}</span>
          </button>
          <SiteSessionExit />
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
            <p className="terminal-command" data-home-hero-step><span>~/mbmapps</span> $ whoami</p>
            <div className="terminal-hero__brand" data-home-hero-step>
              <BrandMark className="terminal-hero__logo" priority />
              <p><strong>MBMApps</strong><span>Independent software studio · Chicago</span></p>
            </div>
            <h1 data-home-hero-step>Software for operations that cannot run on guesswork.</h1>
            <p className="terminal-subline" data-home-hero-step>Focused products · explicit authority · evidence-backed decisions</p>
            <p className="terminal-lede" data-home-hero-step>We build focused operating systems for catering, youth sports, and quote-to-event work. Teams can see what is known, what is blocked, and what needs a human decision.</p>
            <div className="terminal-links terminal-hero__actions" data-home-hero-step>
              <Link className="terminal-hero__primary" href="/wale">Meet Wale <ArrowUpRight aria-hidden="true" /></Link>
              <a href="#portfolio">Browse portfolio</a>
            </div>
            <div className="terminal-hero__evidence" aria-label="Studio overview" data-home-hero-step>
              <p><strong>Current catalog</strong><span>{projectScreens.map((product) => product.name).join(' · ')}</span></p>
              <p><strong>Method</strong><span>Observe · Verify · Ship · Prove</span></p>
              <p><strong>Studio</strong><span>Chicago · direct contact</span></p>
            </div>
          </div>
          <aside className="terminal-status" aria-label="Studio status">
            <div className="terminal-status__mark">MBM</div>
            <div className="terminal-status__cards">
              <div><span>status</span><strong><i /> open for new engagements</strong></div>
              <div><span>portfolio</span><strong>{homepagePortfolio.length} destinations indexed</strong></div>
              <div><span>response</span><strong>direct studio contact</strong></div>
            </div>
          </aside>
        </section>

        <WaleHomeSection />

        <LiveProductSite slug="quoteflow" id="quoteflow" label="QuoteFlow" />
        <LiveProductSite slug="quietpilot" id="quietpilot" label="QuietPilot" />

        <section
          id="portfolio"
          className="terminal-section terminal-shell terminal-methodology terminal-methodology--portfolio"
          aria-label="MBMApps portfolio and destinations"
          data-reveal
          style={{
            '--methodology-progress': methodologyProgress,
            '--methodology-progress-pct': `${(methodologyProgress / 3) * 100}%`
          } as React.CSSProperties}
        >
          <div className="terminal-methodology__experience">
            <div className="terminal-methodology__visual" data-methodology-mode={operatingMode}>
              <OperatingWorldSphere
                mode={operatingMode}
                progress={methodologyProgress}
                onModeChange={setOperatingMode}
                compact
                showControls={false}
              />
              <div className="terminal-methodology__labels" aria-hidden="true">
                <span className="label label--observation">observation</span>
                <span className="label label--memory">memory</span>
                <span className="label label--authority">authority</span>
                <span className="label label--proof">proof</span>
              </div>
              <div className="terminal-methodology__status" aria-live="polite">
                <span>current state</span>
                <strong>{activeApproach.title}</strong>
                <i aria-hidden="true" />
              </div>
            </div>

            <ol className="terminal-approach terminal-approach--interactive" aria-label="Operating method">
              {approachSteps.map((step, index) => (
                <li key={step.id} className={operatingMode === step.id ? 'is-active' : undefined} data-method-step={step.id}>
                  <button
                    type="button"
                    onPointerEnter={() => setOperatingMode(step.id)}
                    onFocus={() => setOperatingMode(step.id)}
                    onClick={() => setOperatingMode(step.id)}
                    aria-pressed={operatingMode === step.id}
                  >
                    <span className="terminal-approach__index">0{index + 1}</span>
                    <span className="terminal-approach__copy">
                      <span className="terminal-approach__cmd">$ {step.id}</span>
                      <h3>{step.title}</h3>
                      <p>{step.detail}</p>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div className="terminal-methodology__destination-rail" aria-labelledby="destinations-title">
            <div className="terminal-methodology__destination-intro">
              <div>
                <h2 id="destinations-title">The method becomes focused products.</h2>
                <p>Wale makes development systems legible. QuoteFlow and QuietPilot bring the same evidence-first discipline to operational work.</p>
              </div>
              <Link className="terminal-methodology__primary-action" href="/contact">
                Discuss your operation <ArrowUpRight aria-hidden="true" />
              </Link>
            </div>

            <section className="terminal-destination-group terminal-destination-group--featured" aria-labelledby="featured-destinations-title" data-destination-group="featured">
              <h3 id="featured-destinations-title">Featured systems</h3>
              <div className="terminal-destination-grid">
                {featuredDestinations.map((item) => <PortfolioDestination key={item.slug} item={item} primary={item.slug === 'wale'} />)}
              </div>
            </section>

            <section className={`terminal-destination-group terminal-destination-group--more ${showMoreDestinations ? 'is-open' : ''}`} aria-labelledby="more-destinations-title" data-destination-group="more">
              <button
                className="terminal-destination-group__toggle"
                type="button"
                onClick={() => setShowMoreDestinations((current) => !current)}
                aria-expanded={showMoreDestinations}
                aria-controls="more-destinations-list"
              >
                <span>
                  <strong id="more-destinations-title">More destinations</strong>
                  <small>{moreDestinations.map((item) => item.name).join(' · ')}</small>
                </span>
                <span>{showMoreDestinations ? 'Hide' : `View ${moreDestinations.length}`} <ChevronDown aria-hidden="true" /></span>
              </button>
              <div id="more-destinations-list" className="terminal-destination-grid terminal-destination-grid--more" aria-hidden={!showMoreDestinations}>
                {moreDestinations.map((item) => <PortfolioDestination key={item.slug} item={item} hiddenFromKeyboard={!showMoreDestinations} />)}
              </div>
            </section>

            <section className="terminal-destination-group terminal-destination-group--studio" aria-labelledby="studio-paths-title" data-destination-group="studio">
              <div>
                <h3 id="studio-paths-title">Studio paths</h3>
                <p>Go deeper only where the next step matches your intent.</p>
              </div>
              <div className="terminal-methodology__links">
                <Link href="/wale"><span><strong>Repository profiling with Wale</strong><small>Public archive · local bridge required</small></span><ArrowUpRight aria-hidden="true" /></Link>
                {canUseChat ? <button type="button" onClick={openChat}><span><strong>Start a member conversation</strong><small>Authenticated members only</small></span><Send aria-hidden="true" /></button> : null}
                <Link href="/control-plane"><span><strong>Open control-plane simulation</strong><small>Illustrative operating model</small></span><ArrowUpRight aria-hidden="true" /></Link>
              </div>
            </section>
          </div>
        </section>
      </div>

      <footer className="terminal-shell terminal-footer">
        <p>© {new Date().getFullYear()} {siteConfig.legalName} · next.js · typescript</p>
        <p>chicago, usa · built for clear decisions</p>
      </footer>

      {canUseChat ? <dialog ref={dialogRef} className="terminal-chat" aria-labelledby="chat-title" onCancel={(event) => { event.preventDefault(); setChatOpen(false); }}>
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
      </dialog> : null}

    </div>
  );
}
