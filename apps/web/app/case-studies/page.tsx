import Link from 'next/link';
import type { Metadata } from 'next';
import { getCaseStudies } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Case Studies',
  description: 'Selected outcomes across automation, quoting, and platform reliability projects.'
};

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8">
      <header>
        <p className="text-xs uppercase tracking-[0.24em] text-signal">Case Studies</p>
        <h1 className="mt-3 font-display text-5xl text-white">Proven outcomes under real constraints.</h1>
      </header>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {caseStudies.map((caseStudy) => (
          <article key={caseStudy.slug} className="rounded-3xl border border-white/10 bg-slate-900/65 p-6 shadow-soft">
            <p className="text-xs uppercase tracking-[0.2em] text-signal">{caseStudy.frontmatter.industry}</p>
            <h2 className="mt-3 font-display text-2xl text-white">{caseStudy.frontmatter.title}</h2>
            <p className="mt-3 text-sm leading-6 text-mist">{caseStudy.frontmatter.summary}</p>
            <p className="mt-4 rounded-lg border border-white/10 bg-slate-950/55 px-3 py-2 text-sm text-white/90">
              Outcome: {caseStudy.frontmatter.outcome}
            </p>
            <div className="mt-5 flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {caseStudy.frontmatter.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/15 px-2 py-1 text-xs text-white/75">
                    {tag}
                  </span>
                ))}
              </div>
              <Link href={`/case-studies/${caseStudy.slug}`} className="text-sm font-semibold text-electric hover:text-blue-300">
                Read story
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
