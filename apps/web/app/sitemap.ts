import type { MetadataRoute } from 'next';
import { getCaseStudies, getInsights } from '@/lib/content';
import { quietPilotProduct, siteConfig } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const insights = await getInsights();
  const caseStudies = await getCaseStudies();

  const baseRoutes: MetadataRoute.Sitemap = [
    '',
    quietPilotProduct.path,
    '/services',
    '/case-studies',
    '/about',
    '/insights',
    '/contact',
    '/demo'
  ].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : path === quietPilotProduct.path ? 0.9 : 0.7
  }));

  const insightRoutes: MetadataRoute.Sitemap = insights.map((post) => ({
    url: `${siteConfig.url}/insights/${post.slug}`,
    lastModified: new Date(post.frontmatter.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.65
  }));

  const caseStudyRoutes: MetadataRoute.Sitemap = caseStudies.map((caseStudy) => ({
    url: `${siteConfig.url}/case-studies/${caseStudy.slug}`,
    lastModified: new Date(caseStudy.frontmatter.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.7
  }));

  return [...baseRoutes, ...insightRoutes, ...caseStudyRoutes];
}
