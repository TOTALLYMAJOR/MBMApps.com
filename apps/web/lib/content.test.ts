import { describe, expect, it } from 'vitest';
import { getCaseStudies, getInsightBySlug, getInsights } from '@/lib/content';

describe('content loader', () => {
  it('loads insights', async () => {
    const insights = await getInsights();
    expect(insights.length).toBeGreaterThan(0);
    expect(insights[0]?.frontmatter.title.length).toBeGreaterThan(2);
    expect(insights[0]?.frontmatter.championSignal.length).toBeGreaterThan(2);
  });

  it('loads the intelligence operating system article with its explanatory visual', async () => {
    const article = await getInsightBySlug('the-intelligence-improves-your-world-remains');

    expect(article?.frontmatter.title).toBe('The Intelligence Improves. Your World Remains.');
    expect(article?.frontmatter.heroImage).toBe('/articles/the-intelligence-improves-your-world-remains.webp');
    expect(article?.content).toContain('delegated judgment');
  });

  it('loads case studies', async () => {
    const caseStudies = await getCaseStudies();
    expect(caseStudies.length).toBeGreaterThan(0);
    expect(caseStudies[0]?.slug).toBeTruthy();
    expect(caseStudies[0]?.frontmatter.primaryOutcome.length).toBeGreaterThan(2);
  });
});
