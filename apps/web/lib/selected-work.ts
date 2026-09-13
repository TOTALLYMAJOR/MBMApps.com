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
  }
] as const;
