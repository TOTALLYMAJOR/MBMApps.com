import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { ContentReadBeacon } from '@/components/content-read-beacon';
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

  return (
    <article className="mx-auto w-full max-w-5xl px-6 py-16 lg:px-8">
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
      <div className="mx-auto max-w-3xl">
        <p className="northstar-kicker">{post.frontmatter.industry} / Article</p>
        <h1 className="mt-3 font-display text-5xl font-light tracking-[-0.04em] text-white md:text-6xl">{post.frontmatter.title}</h1>
        <p className="text-mbm-muted mt-4 text-lg leading-8">{post.frontmatter.summary}</p>
      </div>
      {post.frontmatter.heroImage ? (
        <figure className="mt-10">
          <div className="relative aspect-[16/9] overflow-hidden border border-white/10 bg-black">
            <Image src={post.frontmatter.heroImage} alt={post.frontmatter.heroAlt ?? ''} fill sizes="(min-width: 1024px) 960px, 100vw" className="object-cover" priority />
          </div>
          <figcaption className="mt-3 font-mono text-[0.68rem] leading-5 text-white/38">A useful intelligence loop: observe the world, retain context, reason within policy, act, and verify the consequence.</figcaption>
        </figure>
      ) : null}
      <div className="mx-auto max-w-3xl">
        <span className="instrument-chip instrument-chip--ember mt-4">
          {new Date(post.frontmatter.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })}
        </span>
        <div className="mbm-prose mt-10">
          <MDXRemote source={post.content} />
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
    </article>
  );
}
