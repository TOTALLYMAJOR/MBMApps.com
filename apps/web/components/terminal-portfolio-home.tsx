'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, ChevronDown, Layers3, Mail, MessageSquare, Moon, Send, Sun, X } from 'lucide-react';
import { projectScreens } from '@/lib/projects';
import { siteConfig } from '@/lib/site';

type ChatLine = { from: 'studio' | 'visitor'; text: string };

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

const commerceProjects = [
  {
    name: 'Wake for Warriors',
    type: 'Ecommerce storefront / Shopify integration / mission-driven brand',
    description: 'A purpose-driven commerce concept that keeps the storefront experience connected to the Wake for Warriors mission before shoppers continue into Shopify.',
    href: 'https://wakeforwarriorsshopify.netlify.app/',
    image: '/product-screens/wake-for-warriors.png',
    alt: 'Wake for Warriors ecommerce storefront concept with mission-led merchandise and Shopify shopping actions.'
  },
  {
    name: 'Jour et Nuit Concierge',
    type: 'Business website / strategy / professional services',
    description: 'A conversion-focused website for a concierge consultancy, helping entrepreneurs understand the offer and move into a structured consultation.',
    href: 'https://www.jouretnuitconcierge.com/',
    image: '/product-screens/jour-et-nuit.png',
    alt: 'Jour et Nuit Concierge website presenting business readiness and growth consulting services.'
  }
];

export function TerminalPortfolioHome() {
  const [light, setLight] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);
  const [studioLoaded, setStudioLoaded] = useState(false);
  const [draft, setDraft] = useState('');
  const [lines, setLines] = useState<ChatLine[]>([
    { from: 'studio', text: 'Hi — tell me what you are trying to improve. I can point you toward an MBMApps product or prepare an email for the studio.' }
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

    let animationFrame = 0;
    const updateParallax = () => {
      animationFrame = 0;
      document.querySelectorAll<HTMLElement>('.terminal-commerce__media[data-parallax]').forEach((item) => {
        const rect = item.getBoundingClientRect();
        const offset = Math.max(-12, Math.min(12, (window.innerHeight / 2 - (rect.top + rect.height / 2)) * 0.025));
        item.style.setProperty('--commerce-drift', `${offset}px`);
      });
    };
    const onScroll = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateParallax);
    };
    updateParallax();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
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
    setLines((current) => [...current, { from: 'visitor', text: value }, { from: 'studio', text: reply }]);
    setDraft('');
  }

  const transcript = lines.slice(-8).map((line) => `${line.from === 'visitor' ? 'Visitor' : 'MBMApps'}: ${line.text}`).join('\n').slice(0, 4000);
  const mailto = `mailto:${siteConfig.email}?subject=${encodeURIComponent('MBMApps project conversation')}&body=${encodeURIComponent(`Hello MBMApps,\n\nHere is the context from the website chat:\n\n${transcript}\n\nMy name and preferred contact details:`)}`;

  return (
    <div className={`terminal-home ${light ? 'terminal-home--light' : ''}`}>
      <nav className="terminal-nav" aria-label="Homepage sections">
        <div className="terminal-shell terminal-nav__inner">
          <div className="terminal-nav__links">
            <a href="#home"><span>[h]</span> home</a>
            <a href="#apps"><span>[a]</span> apps</a>
            <a href="#commerce"><span>[e]</span> commerce</a>
            <button type="button" onClick={openStudio} aria-haspopup="dialog" aria-controls="component-studio-dialog"><span>[u]</span> studio</button>
            <a href="#systems"><span>[s]</span> systems</a>
            <a href="#notes"><span>[n]</span> notes</a>
            <a href="#contact"><span>[c]</span> contact</a>
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
            <p className="terminal-lede">We build focused operating systems for catering, youth sports, and quote-to-event work—so teams can see what is known, what is blocked, and what needs a human decision.</p>
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

        <section id="commerce" className="terminal-section terminal-shell terminal-commerce" aria-labelledby="commerce-title" data-reveal>
          <div className="terminal-commerce__heading">
            <div>
              <p className="terminal-command"><span>04</span> / selected work</p>
              <h2 id="commerce-title"><span>*</span> ecommerce + client work</h2>
              <p>Real businesses. Live websites. Clear paths to action.</p>
            </div>
            <p className="terminal-commerce__command">$ ls --commerce --client-sites</p>
          </div>
          <div className="terminal-commerce__gallery">
            {commerceProjects.map((project, index) => (
              <article key={project.name} className="terminal-commerce__project">
                <a href={project.href} className="terminal-commerce__media" data-parallax aria-label={`Visit ${project.name}`}>
                  <Image src={project.image} alt={project.alt} fill sizes={index === 0 ? '(min-width: 900px) 62vw, 100vw' : '(min-width: 900px) 38vw, 100vw'} />
                  <span><ArrowUpRight aria-hidden="true" /></span>
                </a>
                <div className="terminal-commerce__copy">
                  <span className="terminal-commerce__index">0{index + 1}</span>
                  <div>
                    <h3>{project.name}</h3>
                    <p className="terminal-commerce__type">{project.type}</p>
                    <p>{project.description}</p>
                    <a href={project.href}>[{index === 0 ? 'visit storefront' : 'visit site'}] <ArrowUpRight aria-hidden="true" /></a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

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

        <section id="notes" className="terminal-section terminal-shell" aria-labelledby="notes-title" data-reveal>
          <h2 id="notes-title"><span>*</span> field notes</h2>
          <div className="terminal-notes">
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
          <form onSubmit={(event) => { event.preventDefault(); sendMessage(); }}>
            <label htmlFor="chat-message">Message</label>
            <input id="chat-message" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Describe the workflow or product..." autoFocus />
            <button type="submit" aria-label="Send message"><Send aria-hidden="true" /></button>
          </form>
          <a className="terminal-chat__handoff" href={mailto}>Continue by email with transcript <ArrowUpRight aria-hidden="true" /></a>
          <p className="terminal-chat__note">This guided chat stays in your browser. Email sends only when you choose the handoff.</p>
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
