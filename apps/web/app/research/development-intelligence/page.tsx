import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { DevelopmentIntelligenceExplorer } from '@/components/development-intelligence-explorer';
import { TerminalArticleShell } from '@/components/terminal-article-shell';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Development Intelligence',
  description: 'A privacy-safe study of 2,701 development conversations and the recurring architecture, delivery, and evidence patterns inside them.',
  alternates: { canonical: '/research/development-intelligence' },
  openGraph: {
    title: 'Development Intelligence | MBMApps',
    description: 'What three years of development history reveal about building durable intelligent systems.',
    url: `${siteConfig.url}/research/development-intelligence`
  }
};

const studyStats = [
  ['2,701', 'conversations'],
  ['63,943', 'message records'],
  ['35', 'months observed'],
  ['10', 'synthesized findings']
];

export default function DevelopmentIntelligencePage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Development Intelligence',
    description: metadata.description,
    author: { '@type': 'Organization', name: 'MBMApps' },
    publisher: { '@type': 'Organization', name: 'MBMApps' },
    mainEntityOfPage: `${siteConfig.url}/research/development-intelligence`
  };

  return (
    <TerminalArticleShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <header className="terminal-shell development-hero">
        <div className="development-hero__copy">
          <p className="terminal-command"><span>~/mbmapps/research</span> $ trace --development-history</p>
          <p className="development-hero__eyebrow">Development intelligence · 2023—2026</p>
          <h1>The work leaves a trail. The trail can become a system.</h1>
          <p className="development-hero__lede">
            A privacy-safe analysis of three years of development conversations reveals how experiments became products—and how repeated decisions can become reusable operating intelligence.
          </p>
        </div>
        <div className="development-hero__signal" aria-label="Development history signal">
          <div className="development-hero__signal-grid" aria-hidden="true">
            {Array.from({ length: 35 }, (_, index) => (
              <i key={index} style={{ '--height': `${22 + ((index * 17) % 68)}%`, '--delay': `${index * 18}ms` } as CSSProperties} />
            ))}
          </div>
          <p><span>signal</span> recurring architecture + delivery patterns</p>
        </div>
      </header>

      <section className="terminal-shell development-study" aria-labelledby="study-scope-title">
        <div className="development-study__statement">
          <p className="development-kicker"><span>*</span> observed corpus</p>
          <h2 id="study-scope-title">Not a highlight reel. A longitudinal read of the decisions behind the software.</h2>
          <p>
            The analysis separates observed counts from interpretation. It tracks recurring system concerns, product focus, delivery language, and recovery patterns without publishing private message content.
          </p>
        </div>
        <dl className="development-study__stats">
          {studyStats.map(([value, label]) => (
            <div key={label}>
              <dt>{value}</dt>
              <dd>{label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="terminal-shell development-explorer-shell">
        <DevelopmentIntelligenceExplorer />
      </div>

      <section className="terminal-shell development-method" aria-labelledby="development-method-title">
        <div>
          <p className="development-kicker"><span>$</span> cat methodology.md</p>
          <h2 id="development-method-title">From archive to usable evidence</h2>
        </div>
        <ol>
          <li><span>01</span><div><strong>Normalize</strong><p>Separate original submissions, inherited context, and repeated text before counting.</p></div></li>
          <li><span>02</span><div><strong>Classify</strong><p>Map project, architecture, workflow, and delivery signals with overlapping labels.</p></div></li>
          <li><span>03</span><div><strong>Review</strong><p>Human-review representative examples before promoting a pattern to a finding.</p></div></li>
          <li><span>04</span><div><strong>Synthesize</strong><p>Turn repeatable decisions into bounded delivery contracts—not “magic prompts.”</p></div></li>
        </ol>
        <aside>
          <strong>Evidence boundary</strong>
          <p>Frequency is not quality, and repeated language is not proof of outcome. These findings are directional evidence designed to guide deeper review.</p>
        </aside>
      </section>

      <section className="terminal-shell development-cta" aria-label="Work with MBMApps">
        <div>
          <p className="development-kicker"><span>→</span> apply the pattern</p>
          <h2>Your history already contains the beginnings of your operating system.</h2>
          <p>MBMApps helps turn scattered product decisions into governed workflows, durable architecture, and evidence-backed delivery.</p>
        </div>
        <Link href="/contact">Start a conversation <ArrowUpRight aria-hidden="true" /></Link>
      </section>
    </TerminalArticleShell>
  );
}
