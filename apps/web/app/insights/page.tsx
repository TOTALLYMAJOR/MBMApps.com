import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import { NorthstarPageHero } from '@/components/northstar-page-hero';
import { getInsights } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Articles',
  description: 'Articles on intelligent operating systems, software architecture, reliability, and the decisions that make technology useful.'
};

export default async function InsightsPage() {
  const insights = await getInsights();

  return (
    <div className="pb-20">
      <NorthstarPageHero
        eyebrow="Articles"
        title="Ideas for systems that have to understand and act."
        description="Essays on intelligence, architecture, delivery, and the operating choices that keep software useful after launch."
        signal={`${String(insights.length).padStart(2, '0')} / articles`}
        aside={<p className="text-sm leading-7 text-white/56">Written from implementation work—not a content calendar.</p>}
      />

      <section className="northstar-section northstar-container">
        <div className="grid gap-4 lg:grid-cols-2">
          {insights.map((post, index) => (
            <article key={post.slug} className={`northstar-card flex min-h-[24rem] flex-col p-7 md:p-9 ${index === 0 ? 'lg:col-span-2' : ''}`}>
              {post.frontmatter.heroImage ? (
                <Link href={`/insights/${post.slug}`} className="relative -mx-7 -mt-7 mb-8 block aspect-[16/7] overflow-hidden border-b border-white/10 md:-mx-9 md:-mt-9">
                  <Image src={post.frontmatter.heroImage} alt={post.frontmatter.heroAlt ?? ''} fill sizes="(min-width: 1024px) 90vw, 100vw" className="object-cover transition duration-500 hover:scale-[1.015]" priority={index === 0} />
                </Link>
              ) : null}
              <div className="flex items-center justify-between gap-4">
                <p className="northstar-number text-xs">0{index + 1}</p>
                <time className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-white/34">{new Date(post.frontmatter.publishedAt).toLocaleDateString('en-US', { timeZone: 'UTC' })}</time>
              </div>
              <div className="mt-auto pt-20">
                <h2 className={`max-w-4xl font-display font-light tracking-[-0.045em] text-white ${index === 0 ? 'text-4xl md:text-5xl' : 'text-3xl'}`}>{post.frontmatter.title}</h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/48">{post.frontmatter.summary}</p>
                <Link href={`/insights/${post.slug}`} className="storefront-detail-link mt-6">Read article <ArrowUpRight className="h-4 w-4" /></Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
