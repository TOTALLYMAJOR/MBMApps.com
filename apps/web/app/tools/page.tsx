import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import { getGitHubProjects, groupGitHubProjects } from '@/lib/github-projects';
import { toolCategories, tools } from '@/lib/tools';

export const metadata: Metadata = {
  title: 'Tools and Simulators',
  description: 'Explore every MBMApps browser utility, design instrument, reasoning tool, and interactive simulator from one catalog.',
  alternates: { canonical: '/tools' }
};

export default async function ToolsPage() {
  const githubPortfolio = groupGitHubProjects(await getGitHubProjects());

  return (
    <div className="terminal-home terminal-page tool-library">
      <section className="terminal-shell terminal-pagehead tool-library__hero">
        <p className="terminal-command"><span>~/mbmapps/tools</span> $ ls --all --grouped</p>
        <div className="tool-library__hero-grid">
          <div>
            <h1>tools and simulators<span className="terminal-cursor" aria-hidden="true" /></h1>
            <p className="terminal-lede">One home for the focused instruments behind MBMApps: compose interfaces, structure reasoning, inspect decisions, and test cause-and-effect without leaving the browser.</p>
            <div className="terminal-links"><Link href="/">[back home]</Link><Link href="/apps">[browse applications]</Link></div>
          </div>
          <dl className="tool-library__summary" aria-label="Tools catalog summary">
            <div><dt>Available</dt><dd>{tools.length}</dd></div>
            <div><dt>Families</dt><dd>{toolCategories.length}</dd></div>
            <div><dt>Default</dt><dd>Local first</dd></div>
          </dl>
        </div>
      </section>

      <nav className="terminal-shell tool-library__index" aria-label="Tool categories">
        <span>Catalog</span>
        {toolCategories.map((category) => <a key={category} href={`#${category.toLowerCase()}`}>{category}</a>)}
      </nav>

      <main className="terminal-section terminal-shell" aria-labelledby="tools-title">
        <div className="terminal-section__head">
          <div><h2 id="tools-title"><span>*</span> browser instruments</h2><p><span>$</span> inspect --capabilities --boundaries</p></div>
          <p>Real interfaces, not concept cards</p>
        </div>

        <div className="tool-library__grid">
          {tools.map((tool, index) => (
            <article
              key={tool.id}
              id={tools.find((candidate) => candidate.category === tool.category)?.id === tool.id ? tool.category.toLowerCase() : undefined}
              className={`tool-card${tool.featured ? ' tool-card--featured' : ''}`}
            >
              <Link href={tool.href} className="tool-card__preview" aria-label={`Open ${tool.name}`}>
                <Image src={tool.preview} alt={tool.previewAlt} fill sizes={tool.featured ? '(min-width: 900px) 62vw, 100vw' : '(min-width: 900px) 31vw, 100vw'} priority={index < 2} quality={90} />
                <span>{tool.category}</span>
              </Link>
              <div className="tool-card__body">
                <p className="terminal-fact__label">$ {tool.command}</p>
                <div className="tool-card__title"><h3>{tool.name}</h3><ArrowUpRight aria-hidden="true" /></div>
                <p>{tool.description}</p>
                <div className="tool-card__meta"><span>{tool.meta}</span><span><Check aria-hidden="true" /> {tool.accessDescription}</span></div>
                <Link className="tool-card__action" href={tool.href}>Open {tool.name} <ArrowUpRight aria-hidden="true" /></Link>
              </div>
            </article>
          ))}
        </div>
      </main>

      <section className="terminal-section terminal-shell tool-library__repos" aria-labelledby="utility-repositories-title">
        <div className="terminal-section__head">
          <div><h2 id="utility-repositories-title"><span>*</span> open-source systems</h2><p><span>$</span> gh repo list --utilities</p></div>
          <p>{githubPortfolio.utilities.length} public repositories</p>
        </div>
        <div className="tool-library__repo-grid">
          {githubPortfolio.utilities.map((utility) => (
            <a key={utility.url} href={utility.url}>
              <span>{utility.language?.toLowerCase() ?? 'mixed'} · {utility.stars} {utility.stars === 1 ? 'star' : 'stars'}</span>
              <strong>{utility.name}</strong>
              <p>{utility.description}</p>
              <ArrowUpRight aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>

      <section className="terminal-section terminal-shell terminal-contact" aria-label="Request a utility">
        <div><p className="terminal-command"><span>~/mbmapps/tools</span> $ request</p><h2><span>*</span> need a different instrument?</h2><p>Describe the decision, repeated task, or evidence gap. The studio will tell you whether an existing app, tool, or focused build fits.</p></div>
        <div className="terminal-contact__actions"><Link href="/contact">[contact the studio]</Link><Link href="/apps">[browse applications]</Link></div>
      </section>
    </div>
  );
}
