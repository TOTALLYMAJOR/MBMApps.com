'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, ChevronDown, Mail, MessageSquare, Moon, Send, Sun, X } from 'lucide-react';
import { currentConsentPolicyVersion, type ChatLeadDeliveryResponse } from '@mbm/contracts';
import { BrandMark } from '@/components/brand-mark';
import { SelectedWorkRail } from '@/components/selected-work-rail';
import { projectScreens } from '@/lib/projects';
import { siteConfig } from '@/lib/site';
import { OperatingWorldSphere, type OperatingWorldMode } from '@/components/operating-world-sphere';
import { groupGitHubProjects, type GitHubProject } from '@/lib/github-projects';
import { tools } from '@/lib/tools';

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

const approachSteps = [
  ['observe', 'Map the real operation', 'We start with the workflow as it actually runs — the handoffs, the evidence, and the places where guesswork creeps in.'],
  ['verify', 'Separate claims from proof', 'Accepted is not paid. Planned is not ready. Every MBMApps system distinguishes what is known from what is assumed.'],
  ['ship', 'Build the operating surface', 'A focused product with role-aware access and clear states: known, blocked, and needs a human decision.'],
  ['prove', 'Keep the proof register', 'Software only makes claims it can back with evidence. Feedback loops keep the system faithful as the work evolves.']
] as const;

export function TerminalPortfolioHome({ githubProjects }: { githubProjects: GitHubProject[] }) {
  const [light, setLight] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [operatingMode, setOperatingMode] = useState<OperatingWorldMode>('observe');
  const [methodologyProgress, setMethodologyProgress] = useState(0);
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

  useEffect(() => {
    const steps = Array.from(document.querySelectorAll<HTMLElement>('[data-method-step]'));
    const section = document.querySelector<HTMLElement>('.terminal-methodology');
    if (!steps.length || !section) return;

    const modes: OperatingWorldMode[] = ['observe', 'verify', 'ship', 'prove'];
    let frame = 0;

    const update = () => {
      frame = 0;
      const viewportAnchor = window.innerHeight * 0.48;
      const centers = steps.map((step) => {
        const rect = step.getBoundingClientRect();
        return rect.top + rect.height / 2;
      });

      let segment = 0;
      while (segment < centers.length - 1) {
        const nextCenter = centers[segment + 1];
        if (nextCenter === undefined || viewportAnchor <= nextCenter) break;
        segment += 1;
      }

      const next = Math.min(segment + 1, centers.length - 1);
      const start = centers[segment] ?? viewportAnchor;
      const end = centers[next] ?? start;
      const local = next === segment ? 0 : Math.max(0, Math.min(1, (viewportAnchor - start) / Math.max(1, end - start)));
      const progress = Math.max(0, Math.min(3, segment + local));
      setMethodologyProgress((current) => current + (progress - current) * 0.42);

      const nearest = Math.max(0, Math.min(3, Math.round(progress)));
      setOperatingMode(modes[nearest] ?? 'observe');
      section.style.setProperty('--methodology-progress', String(progress));
      section.style.setProperty('--methodology-progress-pct', `${(progress / 3) * 100}%`);
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, []);

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
  const githubPortfolio = groupGitHubProjects(githubProjects);

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
            <a href="#apps"><span>[01]</span> apps</a>
            <Link href="/tools"><span>[02]</span> tools</Link>
            <a href="#approach"><span>[03]</span> approach</a>
            <Link href="/insights"><span>[04]</span> articles</Link>
            <button className="terminal-nav__contact" type="button" onClick={openChat}><span>[05]</span> contact</button>
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
              <a className="terminal-hero__primary" href="#apps">Explore products <ArrowUpRight aria-hidden="true" /></a>
              <a href="#approach">See how we work</a>
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
              <article key={product.slug} className={`terminal-product terminal-product--${product.accentToken} terminal-product--layout-${index + 1}`}>
                <Link href={product.path} className="terminal-product__image">
                  <Image src={product.screenshot.src} alt={product.screenshot.alt} fill sizes="(min-width: 800px) 44vw, 100vw" priority={index === 0} />
                </Link>
                <div className="terminal-product__body">
                  <p className="terminal-product__index">0{index + 1} / product system</p>
                  <div className="terminal-product__title"><h3>{product.name}</h3><ArrowUpRight aria-hidden="true" /></div>
                  <p className="terminal-product__category">{product.category}</p>
                  <p className="terminal-product__audience"><span>For</span> {product.audience.join(' · ')}</p>
                  <p>{product.description}</p>
                  <p className="terminal-product__problem"><span>Solves</span> {product.problemStatement}</p>
                  <div className="terminal-tags">{product.capabilities.slice(0, 4).map((item) => <span key={item.label}>{item.label}</span>)}</div>
                  <div className="terminal-links">
                    <Link href={product.path}>[view brief]</Link>
                    <a href={product.websiteUrl}>[{product.websiteLabel.toLowerCase()}]</a>
                  </div>
                  <p className="terminal-proof"><Check aria-hidden="true" /> {product.accessDescription}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="terminal-section terminal-shell terminal-github" aria-labelledby="projects-title" data-reveal>
          <div className="terminal-github__row terminal-github__row--utilities">
            <div className="terminal-github__rail">
              <h2><span>*</span> tools</h2>
              <p><span>[</span>one catalog · {tools.length} instruments<span>]</span></p>
            </div>
            <div className="terminal-tools-directory">
              <div>
                <p className="terminal-command"><span>~/mbmapps/tools</span> $ ls --all</p>
                <h3>Utilities and simulators now share one home.</h3>
                <p>Design components, production prompts, cognitive strategies, and decision labs—grouped by purpose with their runtime boundaries visible.</p>
                <Link href="/tools">Browse all tools <ArrowUpRight aria-hidden="true" /></Link>
              </div>
              <ol aria-label="Available MBMApps tools">
                {tools.map((tool, index) => <li key={tool.id}><span>0{index + 1}</span><strong>{tool.name}</strong><em>{tool.category}</em></li>)}
              </ol>
            </div>
          </div>

          <div className="terminal-github__divider" aria-hidden="true" />

          <div className="terminal-github__row terminal-github__row--projects">
            <div className="terminal-github__rail">
              <h2 id="projects-title"><span>*</span> projects</h2>
              <p><span>[</span>ls -a ({githubPortfolio.projects.length})<span>]</span></p>
            </div>
            <div className="terminal-github__grid">
              {githubPortfolio.projects.map((project) => (
                <article key={project.url} className="terminal-github__card">
                  <a href={project.url} className="terminal-github__preview" aria-label={`Open ${project.name} on GitHub`}>
                    <span aria-hidden="true">
                      <small>public repository</small>
                      <strong>{project.name}</strong>
                      <em>{project.language?.toLowerCase() ?? 'mixed system'}</em>
                    </span>
                  </a>
                  <div className="terminal-github__body">
                    <div className="terminal-github__title">
                      <h3>{project.name}</h3>
                      <ArrowUpRight aria-hidden="true" />
                    </div>
                    <p>{project.description}</p>
                    <div className="terminal-github__meta">
                      {project.language ? <span><i aria-hidden="true" /> {project.language}</span> : null}
                      {project.topics.map((topic) => <span key={topic}>#{topic}</span>)}
                    </div>
                    <div className="terminal-links">
                      <a href={project.url}>[code]</a>
                      {project.homepage ? <a href={project.homepage}>[live]</a> : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="approach" className="terminal-section terminal-shell terminal-methodology" aria-labelledby="approach-title" data-reveal>
          <div className="terminal-section__head">
            <div>
              <h2 id="approach-title"><span>*</span> approach</h2>
              <p><span>$</span> cat --method --proof-driven</p>
            </div>
            <p>4 steps, one operating world</p>
          </div>

          <div className="terminal-methodology__intro">
            <p>The visual system is the method: fragmented reality becomes verified evidence, then a usable operating surface, then a proof-bearing system.</p>
            <strong>Observe → Verify → Ship → Prove</strong>
          </div>

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
                <strong>{operatingMode}</strong>
                <i aria-hidden="true" />
              </div>
            </div>

            <ol className="terminal-approach terminal-approach--interactive">
              {approachSteps.map(([command, title, detail], index) => {
                const stage = command as OperatingWorldMode;
                const active = operatingMode === stage;
                return (
                  <li key={command} className={active ? 'is-active' : ''} data-method-step={stage}>
                    <button
                      type="button"
                      onPointerEnter={() => setOperatingMode(stage)}
                      onFocus={() => setOperatingMode(stage)}
                      onClick={() => setOperatingMode(stage)}
                      aria-pressed={active}
                    >
                      <span className="terminal-approach__index">0{index + 1}</span>
                      <div>
                        <p className="terminal-approach__cmd">$ {command}</p>
                        <h3>{title}</h3>
                        <p>{detail}</p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="terminal-methodology__handoff">
            <div>
              <p><span>$</span> launch --simulator nexamind/agentic-decision-lab</p>
              <strong>Change the facts and watch authority, recommendations, and proof move with them.</strong>
            </div>
            <Link href="/tools#simulation">
              Explore simulators <ArrowUpRight aria-hidden="true" />
            </Link>
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

        <section id="tools" className="terminal-section terminal-shell" aria-labelledby="tools-section-title" data-reveal>
          <div className="terminal-section__head">
            <div>
              <h2 id="tools-section-title"><span>*</span> tools and simulators</h2>
              <p><span>$</span> ls --all --grouped</p>
            </div>
            <p>{tools.length} focused browser instruments</p>
          </div>
          <div className="terminal-studio-grid terminal-tools-home">
            <div>
              <h3>One catalog. Clear purposes.</h3>
              <p>Compose interfaces, structure prompts, and test decision systems. Every tool now lives under one searchable home with its state and runtime boundary attached.</p>
              <div className="terminal-links">
                <Link href="/tools">[browse all tools]</Link>
                <a href={siteConfig.social.github}>[see the code]</a>
              </div>
            </div>
            <ol className="terminal-tools-home__list">
              {tools.map((tool, index) => <li key={tool.id}><span>0{index + 1}</span><strong>{tool.name}</strong><em>{tool.category}</em></li>)}
            </ol>
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

    </div>
  );
}
