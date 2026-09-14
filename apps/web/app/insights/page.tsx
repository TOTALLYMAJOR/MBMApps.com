import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import { TerminalArticleShell } from '@/components/terminal-article-shell';
import { getInsights } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Articles',
  description: 'Articles on intelligent operating systems, software architecture, reliability, and the decisions that make technology useful.'
};

export default async function InsightsPage() {
  const insights = await getInsights();
  const [featured, ...notes] = insights;

  return (
    <TerminalArticleShell>
      <header className="terminal-shell terminal-article-index__hero">
        <div>
          <p className="terminal-command"><span>~/mbmapps</span> $ ls --articles</p>
          <h1>Ideas for systems that have to understand and act.</h1>
          <p>Essays on intelligence, architecture, delivery, and the operating choices that keep software useful after launch.</p>
        </div>
        <aside className="terminal-article-count" aria-label={`${insights.length} published articles`}>
          <span>published notes</span>
          <strong>{String(insights.length).padStart(2, '0')}</strong>
          <p>written from implementation work—not a content calendar.</p>
        </aside>
      </header>

      <section className="terminal-shell terminal-section terminal-article-index" aria-labelledby="article-register-title">
        <div className="terminal-section__head">
          <div>
            <h2 id="article-register-title"><span>*</span> article register</h2>
            <p><span>$</span> cat --ideas --systems</p>
          </div>
          <p>latest first · field-tested thinking</p>
        </div>

        {featured ? (
          <>
            <article className="terminal-article-feature terminal-article-feature--index">
              {featured.frontmatter.heroImage ? (
                <Link href={`/insights/${featured.slug}`} className="terminal-article-feature__image">
                  <Image
                    src={featured.frontmatter.heroImage}
                    alt={featured.frontmatter.heroAlt ?? featured.frontmatter.title}
                    fill
                    sizes="(min-width: 900px) 62vw, 100vw"
                    priority
                  />
                </Link>
              ) : null}
              <div className="terminal-article-feature__copy">
                <p><span>{featured.frontmatter.featured ? 'FEATURED' : 'LATEST'}</span> · {new Date(featured.frontmatter.publishedAt).getUTCFullYear()} · {featured.frontmatter.industry}</p>
                <h3><Link href={`/insights/${featured.slug}`}>{featured.frontmatter.title}</Link></h3>
                <p>{featured.frontmatter.summary}</p>
                <Link href={`/insights/${featured.slug}`}>[read the article] <ArrowUpRight aria-hidden="true" /></Link>
              </div>
            </article>

            {notes.length > 0 ? (
              <div className="terminal-notes terminal-notes--articles terminal-notes--index">
                {notes.map((post) => (
                  <Link key={post.slug} href={`/insights/${post.slug}`}>
                    <strong>{post.frontmatter.title}</strong>
                    <span>{post.frontmatter.summary}</span>
                    <time dateTime={post.frontmatter.publishedAt}>{new Date(post.frontmatter.publishedAt).getUTCFullYear()}</time>
                  </Link>
                ))}
              </div>
            ) : null}
          </>
        ) : (
          <p className="terminal-article-empty">No articles are published yet.</p>
        )}
      </section>
    </TerminalArticleShell>
  );
}
