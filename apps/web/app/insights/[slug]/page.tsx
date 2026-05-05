import type { Metadata } from 'next';
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
    description: post.frontmatter.summary
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
    }
  };

  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-16 lg:px-8">
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
      <p className="kicker">Insight</p>
      <h1 className="mt-3 font-display text-5xl text-white">{post.frontmatter.title}</h1>
      <p className="text-mbm-muted mt-4 text-lg">{post.frontmatter.summary}</p>
      <div className="mbm-prose mt-10">
        <MDXRemote source={post.content} />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
    </article>
  );
}
