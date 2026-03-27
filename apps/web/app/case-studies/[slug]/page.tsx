import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
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
    <article className="mx-auto w-full max-w-3xl px-6 py-16 lg:px-8">
      <EventBeacon
        event="case_study_viewed"
        path={`/case-studies/${slug}`}
        metadata={{
          case_study: slug,
          industry: caseStudy.frontmatter.industry
        }}
      />
      <p className="text-xs uppercase tracking-[0.22em] text-signal">{caseStudy.frontmatter.industry}</p>
      <h1 className="mt-3 font-display text-5xl text-white">{caseStudy.frontmatter.title}</h1>
      <p className="mt-4 text-lg text-mist">{caseStudy.frontmatter.summary}</p>
      <p className="mt-4 inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80">
        Outcome: {caseStudy.frontmatter.outcome}
      </p>
      <div className="mbm-prose mt-10">
        <MDXRemote source={caseStudy.content} />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
    </article>
  );
}
