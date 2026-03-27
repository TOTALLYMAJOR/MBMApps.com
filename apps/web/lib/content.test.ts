import { describe, expect, it } from 'vitest';
import { getCaseStudies, getInsights } from '@/lib/content';

describe('content loader', () => {
  it('loads insights', async () => {
    const insights = await getInsights();
    expect(insights.length).toBeGreaterThan(0);
    expect(insights[0]?.frontmatter.title.length).toBeGreaterThan(2);
  });

  it('loads case studies', async () => {
    const caseStudies = await getCaseStudies();
    expect(caseStudies.length).toBeGreaterThan(0);
    expect(caseStudies[0]?.slug).toBeTruthy();
  });
});
