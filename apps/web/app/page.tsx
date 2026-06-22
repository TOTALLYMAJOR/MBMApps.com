import type { Metadata } from 'next';
import { AppPanelHome } from '@/components/app-panel-home';
import { projectScreens } from '@/lib/projects';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'App Panel',
  description:
    'MBMApps presents each product as a dedicated app screen across operations, sports, youth leagues, studio work, and design canvases.'
};

export default function HomePage() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.legalName,
    url: siteConfig.url,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Chicago',
      addressRegion: 'IL',
      addressCountry: 'US'
    },
    sameAs: [siteConfig.social.github, siteConfig.social.linkedin]
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'MBMApps app panel',
    itemListElement: projectScreens.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: project.name,
        applicationCategory: project.category,
        operatingSystem: 'Web',
        description: project.description,
        url: `${siteConfig.url}${project.path}`
      }
    }))
  };

  return (
    <>
      <AppPanelHome />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
    </>
  );
}
