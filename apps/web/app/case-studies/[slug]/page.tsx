import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { ContentReadBeacon } from '@/components/content-read-beacon';
import { EventBeacon } from '@/components/event-beacon';
import { getCaseStudies, getCaseStudyBySlug } from '@/lib/content';
import { siteConfig } from '@/lib/site';

type CaseStudyPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const caseStudies = await getCaseStudies();
  return caseStudies.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);

  if (caseStudy === null) {
    return {};
  }

  return {
    title: caseStudy.frontmatter.title,
    description: caseStudy.frontmatter.summary
  };
}

export default async function CaseStudyDetailPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);

  if (caseStudy === null) {
    notFound();
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: caseStudy.frontmatter.title,
    description: caseStudy.frontmatter.summary,
    datePublished: caseStudy.frontmatter.publishedAt,
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
    <article className="terminal-case-study mx-auto w-full max-w-3xl px-6 py-16 lg:px-8">
      <EventBeacon
        event="case_study_viewed"
        path={`/case-studies/${slug}`}
        metadata={{
          case_study: slug,
          industry: caseStudy.frontmatter.industry,
          persona: caseStudy.frontmatter.persona,
          funnel_stage: caseStudy.frontmatter.funnelStage,
          champion_signal: caseStudy.frontmatter.championSignal
        }}
      />
      <ContentReadBeacon
        section="case-study"
        slug={slug}
        path={`/case-studies/${slug}`}
        metadata={{
          industry: caseStudy.frontmatter.industry,
          persona: caseStudy.frontmatter.persona,
          funnel_stage: caseStudy.frontmatter.funnelStage,
          problem: caseStudy.frontmatter.problem,
          capability: caseStudy.frontmatter.capability,
          champion_signal: caseStudy.frontmatter.championSignal,
          primary_outcome: caseStudy.frontmatter.primaryOutcome
        }}
      />
      <p className="northstar-kicker">{caseStudy.frontmatter.industry}</p>
      <h1 className="mt-3 font-display text-5xl font-light tracking-[-0.04em] text-white">{caseStudy.frontmatter.title}</h1>
      <p className="text-mbm-muted mt-4 text-lg">{caseStudy.frontmatter.summary}</p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <span className="instrument-chip instrument-chip--ember instrument-chip--live">
          <span className="instrument-chip__dot" aria-hidden="true" />
          Outcome: {caseStudy.frontmatter.outcome}
        </span>
        {caseStudy.frontmatter.liveUrl ? (
          <a
            href={caseStudy.frontmatter.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="storefront-detail-link"
          >
            Visit live site <ArrowUpRight className="h-4 w-4" />
          </a>
        ) : null}
      </div>
      <div className="mbm-prose mt-10">
        <MDXRemote source={caseStudy.content} />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
    </article>
  );
}
