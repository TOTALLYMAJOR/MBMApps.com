export type SelectedWorkProject = {
  name: string;
  type: string;
  description: string;
  href: `https://${string}`;
  image: `/${string}`;
  alt: string;
  visitLabel: string;
};

export const selectedWorkProjects: readonly SelectedWorkProject[] = [
  {
    name: 'Little Legend Studios',
    type: 'Cinematic product site / personalized keepsakes / guided story worlds',
    description: 'A cinematic product site for personalized story-world keepsakes, combining a narrative landing experience with clear parent entry points.',
    href: 'https://little-legend-studios-web.vercel.app/',
    image: '/product-screens/little-legend-studios.png',
    alt: 'Little Legend Studios product website introducing cinematic story-world keepsakes for families.',
    visitLabel: 'visit site'
  },
  {
    name: 'Wake for Warriors',
    type: 'Ecommerce storefront / Shopify integration / mission-driven brand',
    description: 'A purpose-driven commerce concept that keeps the storefront experience connected to the Wake for Warriors mission before shoppers continue into Shopify.',
    href: 'https://wakeforwarriorsshopify.netlify.app/',
    image: '/product-screens/wake-for-warriors.png',
    alt: 'Wake for Warriors ecommerce storefront concept with mission-led merchandise and Shopify shopping actions.',
    visitLabel: 'visit storefront'
  },
  {
    name: 'Jour et Nuit Concierge',
    type: 'Business website / strategy / professional services',
    description: 'A conversion-focused website for a concierge consultancy, helping entrepreneurs understand the offer and move into a structured consultation.',
    href: 'https://www.jouretnuitconcierge.com/',
    image: '/product-screens/jour-et-nuit.png',
    alt: 'Jour et Nuit Concierge website presenting business readiness and growth consulting services.',
    visitLabel: 'visit site'
  },
  {
    name: 'Arena Advisor',
    type: 'Game UI / champion comparison / decision support',
    description: 'A League-inspired interface that brings champion selection, party context, comparison, and Arena decision support into one focused operating surface.',
    href: 'https://github.com/TOTALLYMAJOR/league-lobby-preview',
    image: '/product-screens/arena-advisor.png',
    alt: 'Arena Advisor game interface with champion cards, roster search, party context, and comparison actions.',
    visitLabel: 'view source'
  },
  {
    name: 'PerformancePilot Wheelchair Rugby',
    type: 'Team website / public season hub / community support',
    description: 'A public-facing season hub that brings team stories, approved competition updates, community support, and team merchandise into one clear experience while keeping private operations protected.',
    href: 'https://public-cjwljt182-mbmapps.vercel.app/',
    image: '/product-screens/performancepilot-wheelchair-rugby.webp',
    alt: 'PerformancePilot Wheelchair Rugby public season website with a wheelchair rugby action scene and support call to action.',
    visitLabel: 'visit site'
  }
] as const;
