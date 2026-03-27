import { promises as fs } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';

const frontmatterSchema = z.object({
  title: z.string().min(2),
  summary: z.string().min(20),
  industry: z.string().min(2),
  outcome: z.string().min(2),
  publishedAt: z.string(),
  tags: z.array(z.string().min(2)).min(1),
  featured: z.boolean().default(false)
});

export type ContentFrontmatter = z.infer<typeof frontmatterSchema>;

export type ContentEntry = {
  slug: string;
  content: string;
  frontmatter: ContentFrontmatter;
};

function contentDir(section: 'insights' | 'case-studies') {
  return path.join(process.cwd(), '..', '..', 'content', section);
}

async function listEntries(section: 'insights' | 'case-studies'): Promise<ContentEntry[]> {
  const sectionPath = contentDir(section);
  const files = (await fs.readdir(sectionPath)).filter((file) => file.endsWith('.mdx'));

  const parsed = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace(/\.mdx$/, '');
      const source = await fs.readFile(path.join(sectionPath, file), 'utf8');
      const { data, content } = matter(source);
      const frontmatter = frontmatterSchema.parse(data);

      return {
        slug,
        content,
        frontmatter
      } satisfies ContentEntry;
    })
  );

  return parsed.sort((a, b) => {
    return new Date(b.frontmatter.publishedAt).getTime() - new Date(a.frontmatter.publishedAt).getTime();
  });
}

export async function getInsights() {
  return listEntries('insights');
}

export async function getCaseStudies() {
  return listEntries('case-studies');
}

export async function getInsightBySlug(slug: string) {
  const insights = await getInsights();
  return insights.find((entry) => entry.slug === slug) ?? null;
}

export async function getCaseStudyBySlug(slug: string) {
  const caseStudies = await getCaseStudies();
  return caseStudies.find((entry) => entry.slug === slug) ?? null;
}
