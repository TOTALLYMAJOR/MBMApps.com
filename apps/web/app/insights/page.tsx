import Link from 'next/link';
import type { Metadata } from 'next';
import { getInsights } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Insights',
  description: 'Engineering insights on scaling web platforms, reliability, and growth architecture.'
};

export default async function InsightsPage() {
  const insights = await getInsights();

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16 lg:px-8">
      <p className="text-xs uppercase tracking-[0.24em] text-signal">Insights</p>
      <h1 className="mt-3 font-display text-5xl text-white">Notes from building systems that must perform.</h1>

      <div className="mt-10 space-y-5">
        {insights.map((post) => (
          <article key={post.slug} className="rounded-2xl border border-white/10 bg-slate-900/65 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-mist">{new Date(post.frontmatter.publishedAt).toLocaleDateString()}</p>
            <h2 className="mt-2 font-display text-2xl text-white">{post.frontmatter.title}</h2>
            <p className="mt-3 text-sm text-mist">{post.frontmatter.summary}</p>
            <Link href={`/insights/${post.slug}`} className="mt-4 inline-flex text-sm font-semibold text-electric hover:text-blue-300">
              Read article
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
