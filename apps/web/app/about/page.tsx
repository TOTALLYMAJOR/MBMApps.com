import type { Metadata } from 'next';
import Link from 'next/link';
import { projectScreens } from '@/lib/projects';
import { siteConfig } from '@/lib/site';
import { ContentDirectory } from '@/components/editorial-page';

export const metadata: Metadata = {
  title: 'About',
  description: 'MBMApps is an independent Chicago software studio building proof-driven operating systems.'
};

const principles = [
  ['no guesswork', 'Every surface distinguishes what is known from what is assumed. Accepted is not paid. Planned is not ready.'],
  ['role-aware by default', 'Private information stays scoped to the people who need it — families, staff, and operators — never a public feed.'],
  ['proof over promises', 'Software only makes claims it can back with evidence: verified payments, confirmed sends, and completed checklists.'],
  ['human decisions stay human', 'Systems surface what is blocked and what needs review. The decision belongs to a person, with full context.']
] as const;

export default function AboutPage() {
  return (
    <div className="terminal-home terminal-page">
      <ContentDirectory current="studio" context="Identity, principles, and operating facts" />
      <section className="terminal-shell terminal-pagehead">
        <p className="terminal-command"><span>~/mbmapps/about</span> $ whoami --long</p>
        <h1>about the studio<span className="terminal-cursor" aria-hidden="true" /></h1>
        <p className="terminal-subline">independent software studio · chicago · founded on operational truth</p>
        <p className="terminal-lede">MBMApps LLC builds focused software for work that cannot run on guesswork: catering revenue, youth-sports seasons, and quote-to-event pipelines. Each product started as a real operational problem, not a market thesis.</p>
        <div className="terminal-links"><Link href="/apps">[browse apps]</Link><a href={siteConfig.social.github}>[github]</a><Link href="/contact">[start a conversation]</Link></div>
      </section>

      <section className="terminal-section terminal-shell" aria-labelledby="principles-title">
        <div className="terminal-section__head"><div><h2 id="principles-title"><span>*</span> principles</h2><p><span>$</span> cat --values</p></div><p>4 non-negotiables</p></div>
        <ol className="terminal-approach">
          {principles.map(([command, detail], index) => <li key={command}><span className="terminal-approach__index">0{index + 1}</span><div><p className="terminal-approach__cmd">$ {command}</p><p>{detail}</p></div></li>)}
        </ol>
      </section>

      <section className="terminal-section terminal-shell" aria-labelledby="facts-title">
        <h2 id="facts-title"><span>*</span> studio facts</h2>
        <div className="terminal-system-grid terminal-facts-grid">
          <article><p className="terminal-fact__label">base of operations</p><p>Chicago, USA. Working with operators across the US.</p></article>
          <article><p className="terminal-fact__label">portfolio</p><p>{projectScreens.length} products live: {projectScreens.map((product) => product.name).join(', ')}.</p></article>
          <article><p className="terminal-fact__label">engagement model</p><p>Direct studio contact. No account managers, no ticket queues.</p></article>
          <article><p className="terminal-fact__label">stack</p><p>Next.js, React, TypeScript, Firebase, PostgreSQL, Stripe, and Vercel.</p></article>
        </div>
      </section>

      <section className="terminal-section terminal-shell terminal-contact" aria-label="Start a conversation">
        <div><p className="terminal-command"><span>~/mbmapps/about</span> $ next</p><h2><span>*</span> working on something that needs proof?</h2><p>Tell the studio what needs to work better. You will get a direct reply, not a funnel.</p></div>
        <div className="terminal-contact__actions"><Link href="/contact">[contact the studio]</Link><Link href="/tools">[explore tools]</Link></div>
      </section>
    </div>
  );
}
