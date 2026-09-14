import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { ArrowLeft } from 'lucide-react';
import { ContentReadBeacon } from '@/components/content-read-beacon';
import { TerminalArticleShell } from '@/components/terminal-article-shell';
import { getInsightBySlug, getInsights } from '@/lib/content';
import { siteConfig } from '@/lib/site';

type InsightPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const insights = await getInsights();
  return insights.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: InsightPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getInsightBySlug(slug);

  if (post === null) {
    return {};
  }

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.summary,
    openGraph: post.frontmatter.heroImage
      ? {
          title: post.frontmatter.title,
          description: post.frontmatter.summary,
          type: 'article',
          publishedTime: post.frontmatter.publishedAt,
          images: [{ url: post.frontmatter.heroImage, alt: post.frontmatter.heroAlt }]
        }
      : undefined
  };
}

export default async function InsightDetailPage({ params }: InsightPageProps) {
  const { slug } = await params;
  const post = await getInsightBySlug(slug);

  if (post === null) {
    notFound();
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.frontmatter.title,
    description: post.frontmatter.summary,
    datePublished: post.frontmatter.publishedAt,
    author: {
      '@type': 'Organization',
      name: siteConfig.legalName
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.legalName
    },
    image: post.frontmatter.heroImage ? `${siteConfig.url}${post.frontmatter.heroImage}` : undefined
  };

  const publishedDate = new Date(post.frontmatter.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  });

  return (
    <TerminalArticleShell>
      <article className="terminal-reader">
        <ContentReadBeacon
          section="insight"
          slug={slug}
          path={`/insights/${slug}`}
          metadata={{
            industry: post.frontmatter.industry,
            persona: post.frontmatter.persona,
            funnel_stage: post.frontmatter.funnelStage,
            problem: post.frontmatter.problem,
            capability: post.frontmatter.capability,
            champion_signal: post.frontmatter.championSignal,
            primary_outcome: post.frontmatter.primaryOutcome
          }}
        />

        <header className="terminal-shell terminal-reader__header">
          <Link href="/insights" className="terminal-reader__back"><ArrowLeft aria-hidden="true" /> [all articles]</Link>
          <p className="terminal-command"><span>~/mbmapps/articles</span> $ open {slug}</p>
          <div className="terminal-reader__meta">
            <span>article</span>
            <span>{post.frontmatter.industry}</span>
            <time dateTime={post.frontmatter.publishedAt}>{publishedDate}</time>
          </div>
          <h1>{post.frontmatter.title}</h1>
          <p className="terminal-reader__summary">{post.frontmatter.summary}</p>
        </header>

        {post.frontmatter.heroImage ? (
          <figure className="terminal-shell terminal-reader__figure">
            <div>
              <Image
                src={post.frontmatter.heroImage}
                alt={post.frontmatter.heroAlt ?? post.frontmatter.title}
                fill
                sizes="100vw"
                priority
              />
            </div>
            <figcaption>{post.frontmatter.heroAlt ?? post.frontmatter.summary}</figcaption>
          </figure>
        ) : null}

        <section className="terminal-shell terminal-reader__layout" aria-label="Article content">
          <aside className="terminal-reader__details">
            <div><span>published</span><strong>{publishedDate}</strong></div>
            <div><span>domain</span><strong>{post.frontmatter.industry}</strong></div>
            <div className="terminal-reader__tags">
              <span>topics</span>
              <p>{post.frontmatter.tags.map((tag) => <span key={tag}>#{tag}</span>)}</p>
            </div>
            <Link href="/insights"><ArrowLeft aria-hidden="true" /> back to register</Link>
          </aside>

          <div className="mbm-prose terminal-reader__prose">
            <MDXRemote source={post.content} />
          </div>
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      </article>
    </TerminalArticleShell>
  );
}
