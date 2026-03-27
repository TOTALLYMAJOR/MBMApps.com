export const siteConfig = {
  name: 'MBMApps',
  legalName: 'MBMApps LLC',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mbmapps.com',
  description:
    'MBMApps designs and ships high-quality web platforms that scale revenue, operations, and customer experience for growth-focused businesses.',
  email: 'sales@mbmapps.com',
  phone: '+1-312-555-0147',
  location: 'Chicago, IL',
  social: {
    github: 'https://github.com/mbmapps',
    linkedin: 'https://www.linkedin.com/company/mbmapps'
  }
};

export const navigation = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/insights', label: 'Insights' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' }
];
