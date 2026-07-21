export const siteConfig = {
  name: 'MBMApps',
  legalName: 'MBMApps LLC',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mbmapps.com',
  description:
    'Explore MBMApps applications for catering operations, youth-sports management, and quote-to-event workflows, or start a conversation about a custom system.',
  email: 'flightcontrol@quietpilot.us',
  social: {
    github: 'https://github.com/TOTALLYMAJOR'
  }
};

export const quietPilotProduct = {
  name: 'QuietPilot',
  path: '/quietpilot',
  purchasePath: '/quietpilot/purchase',
  demoPath: '/demo',
  appUrl: process.env.NEXT_PUBLIC_QUIETPILOT_APP_URL ?? 'https://www.quietpilot.us/login',
  description:
    'QuietPilot is an inventory-to-cash command center for service operators who need quoting, proposals, staffing, inventory, and job readiness in one auditable workflow.'
};

export const navigation = [
  { href: '/apps', label: 'Apps' },
  { href: '/#approach', label: 'Approach' },
  { href: '/#studio', label: 'Studio' },
  { href: '/about', label: 'About' }
];
