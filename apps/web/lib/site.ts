export const siteConfig = {
  name: 'MBMApps',
  legalName: 'MBMApps LLC',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mbmapps.com',
  description:
    'MBMApps designs and ships high-quality web platforms that scale revenue, operations, and customer experience for growth-focused businesses.',
  email: 'flightcontrol@quietpilot.us',
  phone: '+1-312-555-0147',
  location: 'Chicago, IL',
  social: {
    github: 'https://github.com/mbmapps',
    linkedin: 'https://www.linkedin.com/company/mbmapps'
  }
};

export const quietPilotProduct = {
  name: 'QuietPilot',
  path: '/quietpilot',
  purchasePath: '/quietpilot/purchase',
  demoPath: '/demo',
  appUrl: process.env.NEXT_PUBLIC_QUIETPILOT_APP_URL ?? 'https://app.quietpilot.com',
  description:
    'QuietPilot is an inventory-to-cash command center for service operators who need quoting, proposals, staffing, inventory, and job readiness in one auditable workflow.'
};

export const championCoachProduct = {
  name: 'Champion Coach OS',
  path: '/apps/champion-coach-os',
  contactPath: '/contact',
  description:
    'Champion Coach OS is a competitive coaching cockpit for champion prep, matchup reads, lane pressure, build timing, and review loops.'
};

export const navigation = [
  { href: '/', label: 'App Panel' },
  { href: '/apps', label: 'Projects' },
  { href: quietPilotProduct.path, label: quietPilotProduct.name },
  { href: '/services', label: 'Services' },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/insights', label: 'Insights' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' }
];
