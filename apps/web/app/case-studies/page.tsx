import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import { NorthstarPageHero } from '@/components/northstar-page-hero';
import { getCaseStudies } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Case Studies',
  description: 'Selected outcomes across automation, quoting, and platform reliability projects.'
};

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies();

  return (
    <div className="pb-20">
      <NorthstarPageHero
        eyebrow="Selected work"
        title="Proof under real operating constraints."
        description="The useful measure of software is what changes after it ships: turnaround time, decision quality, visibility, recovery posture, and the team’s ability to keep moving."
        signal={`${String(caseStudies.length).padStart(2, '0')} / studies`}
        aside={<p className="font-display text-3xl font-light leading-tight tracking-[-0.04em] text-white">Outcomes before ornament. Evidence before claims.</p>}
      />

      <section className="northstar-section northstar-container">
        <div className="northstar-rule-list border-y border-white/10">
          {caseStudies.map((caseStudy, index) => (
            <article key={caseStudy.slug} className="group grid gap-6 py-9 lg:grid-cols-[4rem_0.75fr_1.25fr_auto] lg:items-start">
              <span className="northstar-number text-xs">0{index + 1}</span>
              <div>
                <p className="northstar-kicker">{caseStudy.frontmatter.industry}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {caseStudy.frontmatter.tags.map((tag) => <span key={tag} className="text-xs text-white/34">{tag}</span>)}
                </div>
              </div>
              <div>
                <h2 className="font-display text-3xl font-light tracking-[-0.04em] text-white transition-colors group-hover:text-indigo-100">{caseStudy.frontmatter.title}</h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/48">{caseStudy.frontmatter.summary}</p>
                <p className="mt-5 border-l border-indigo-300/40 pl-4 text-sm leading-7 text-white/76">{caseStudy.frontmatter.outcome}</p>
              </div>
              <div className="flex flex-col items-start gap-3 lg:items-end">
                <Link href={`/case-studies/${caseStudy.slug}`} className="storefront-detail-link">Read story <ArrowUpRight className="h-4 w-4" /></Link>
                {caseStudy.frontmatter.liveUrl ? (
                  <a
                    href={caseStudy.frontmatter.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-white/48 transition-colors hover:text-indigo-200"
                  >
                    Visit live site ↗
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="northstar-container">
        <div className="northstar-cta-band">
          <p className="northstar-kicker">Your constraint</p>
          <h2 className="mt-5 max-w-4xl font-display text-4xl font-light tracking-[-0.05em] text-white md:text-5xl">If the current workflow is expensive, slow, or hard to trust, it is ready to be mapped.</h2>
          <Link href="/contact" className="storefront-action storefront-action--primary mt-7">Start the conversation <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </div>
  );
}
