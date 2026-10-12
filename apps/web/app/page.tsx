import type { Metadata } from 'next';
import { TerminalPortfolioHome } from '@/components/terminal-portfolio-home';
import { projectScreens } from '@/lib/projects';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Purpose-Built Software and Operating Systems',
  description:
    'Explore Wale and MBMApps applications for development intelligence, catering operations, youth-sports management, and quote-to-event workflows.'
};

export default function HomePage() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.legalName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon.svg`,
    email: siteConfig.email,
    sameAs: [siteConfig.social.github]
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'MBMApps applications',
    itemListElement: projectScreens.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: project.name,
        applicationCategory: project.category,
        operatingSystem: 'Web',
        description: project.description,
        url: project.websiteUrl
      }
    }))
  };

  return (
    <>
      <TerminalPortfolioHome />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
    </>
  );
}
