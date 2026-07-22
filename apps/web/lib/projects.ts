import type { LucideIcon } from 'lucide-react';
import { CalendarDays, FileCheck2, Route } from 'lucide-react';

export type ProductAccent = 'violet' | 'field' | 'amber';

export type ProductCapability = {
  label: string;
  description: string;
};

export type ProductScenario = {
  trigger: string;
  decision: string;
  systemResponse: string;
  authorityBoundary: string;
  resultingClarity: string;
};

export type ProductRecord = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  parentLabel: string;
  category: string;
  audience: string[];
  operatingEnvironment: string;
  headline: string;
  supportingStatement: string;
  description: string;
  problemStatement: string;
  capabilities: ProductCapability[];
  scenario: ProductScenario;
  screenshot: {
    src: string;
    alt: string;
    caption: string;
    maturity: string;
  };
  accentToken: ProductAccent;
  icon: LucideIcon;
  path: string;
  websiteUrl: string;
  websiteLabel: string;
  analyticsId: string;
  status: string;
  accessDescription: string;
  proofBoundary: string;
  sourceRepository: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  visible: boolean;
};

export const products: [ProductRecord, ...ProductRecord[]] = [
  {
    id: 'quietpilot',
    slug: 'quietpilot',
    name: 'QuietPilot',
    shortName: 'QP',
    parentLabel: 'An MBMApps product',
    category: 'Catering revenue and operations',
    audience: ['Catering operators', 'Sales teams', 'Production leads'],
    operatingEnvironment: 'Accepted-work and event-readiness operations',
    headline: 'Run Catering Without Chaos.',
    supportingStatement: 'Every accepted event becomes a proof-driven production plan.',
    description:
      'QuietPilot connects commercial context with payment evidence, staffing, inventory, production, and readiness so operators can see what is known, what is blocked, and what needs review.',
    problemStatement:
      'Accepted work can move faster than the evidence needed to staff, supply, and safely prepare the event.',
    capabilities: [
      { label: 'Quotes and proposals', description: 'Keep commercial context connected to the event.' },
      { label: 'Payment verification', description: 'Separate payment context from provider-backed proof.' },
      { label: 'Staffing and inventory', description: 'Surface coverage gaps and missing stock evidence.' },
      { label: 'Readiness review', description: 'Show blockers and the next responsible action.' }
    ],
    scenario: {
      trigger: 'A customer accepts a proposal for an upcoming catered event.',
      decision: 'The operator must determine whether payment, staffing, inventory, and production requirements are actually ready.',
      systemResponse: 'QuietPilot carries the accepted commercial context forward and surfaces missing evidence.',
      authorityBoundary: 'The operator retains approval and readiness authority.',
      resultingClarity: 'The team can distinguish accepted work from operationally cleared work.'
    },
    screenshot: {
      src: '/product-screens/quietpilot.png',
      alt: 'QuietPilot public catering demo showing accepted-work, payment, staffing, inventory, and readiness context.',
      caption:
        'This live public view demonstrates connected sample proof states. It does not claim payment settlement or operational clearance.',
      maturity: 'Read-only public demo'
    },
    accentToken: 'violet',
    icon: Route,
    path: '/apps/quietpilot',
    websiteUrl: 'https://www.quietpilot.us',
    websiteLabel: 'Explore QuietPilot',
    analyticsId: 'quietpilot',
    status: 'Public product site',
    accessDescription: 'Read-only demo available',
    proofBoundary:
      'Accepted is not paid, provider return is not settlement, and staffing or inventory planning alone does not prove readiness.',
    sourceRepository: {
      label: 'TOTALLYMAJOR/QuietPilot',
      href: 'https://github.com/TOTALLYMAJOR/QuietPilot'
    },
    secondaryAction: {
      label: 'Purchase QuietPilot',
      href: '/quietpilot/purchase'
    },
    visible: true
  },
  {
    id: 'leaguepilot',
    slug: 'leaguepilot',
    name: 'LeaguePilot',
    shortName: 'LP',
    parentLabel: 'An MBMApps product',
    category: 'Private youth-sports operations',
    audience: ['Parents', 'Coaches', 'League administrators'],
    operatingEnvironment: 'Private team and season coordination',
    headline: 'Stop chasing families. Run the season.',
    supportingStatement:
      'Schedules, RSVPs, coach updates, and Parent Replay in one calm, role-aware home.',
    description:
      'LeaguePilot gives families and approved team staff one private place for schedules, attendance, official updates, practice context, and the details that keep a season moving.',
    problemStatement:
      'Schedule changes and team updates fragment across texts, inboxes, calendars, and sideline conversations.',
    capabilities: [
      { label: 'Schedules and calendars', description: 'Keep official game and practice context together.' },
      { label: 'RSVP visibility', description: 'See responses and unresolved attendance.' },
      { label: 'Team communication', description: 'Center coach and parent updates in one team home.' },
      { label: 'Role-aware access', description: 'Respect team, family, coach, and administrator scope.' }
    ],
    scenario: {
      trigger: 'A schedule change affects players, parents, coaches, and volunteers.',
      decision: 'The league must determine who is affected, who has responded, and what remains unresolved.',
      systemResponse: 'LeaguePilot centralizes the schedule, RSVP state, location context, and role-based visibility.',
      authorityBoundary: 'Coaches and administrators retain control over official team information.',
      resultingClarity: 'Families see one reliable team source instead of fragmented messages.'
    },
    screenshot: {
      src: '/product-screens/leaguepilot.png',
      alt: 'LeaguePilot public product page showing private youth-sports schedules and game-day coordination.',
      caption:
        'This live public view demonstrates the product entry point. Private team areas remain role-scoped and require approved access.',
      maturity: 'Public product overview'
    },
    accentToken: 'field',
    icon: CalendarDays,
    path: '/apps/leaguepilot',
    websiteUrl: 'https://www.leaguepilot.us',
    websiteLabel: 'Explore LeaguePilot',
    analyticsId: 'leaguepilot',
    status: 'Public product site',
    accessDescription: 'Sign-in or access request required for team areas',
    proofBoundary:
      'Private team information remains role-scoped. External notifications and provider delivery depend on configuration and verified sends.',
    sourceRepository: {
      label: 'TOTALLYMAJOR/LittleLeaguePlatform',
      href: 'https://github.com/TOTALLYMAJOR/LittleLeaguePlatform'
    },
    visible: true
  },
  {
    id: 'quotepilot',
    slug: 'quotepilot',
    name: 'QuotePilot',
    shortName: 'QP',
    parentLabel: 'An MBMApps product',
    category: 'Quote-to-event operations',
    audience: ['Catering sales teams', 'Administrators', 'Event teams'],
    operatingEnvironment: 'Guided quoting, customer decisions, and event handoff',
    headline: 'Move from first inquiry to a clearer event.',
    supportingStatement:
      'Guided quotes, customer decisions, payment state, and event production—with their boundaries intact.',
    description:
      'QuotePilot connects quote configuration, proposals, customer decisions, payment context, and event-production planning in one accountable workspace.',
    problemStatement:
      'Quote revisions, customer decisions, payment state, and production details become unreliable when they live in separate tools.',
    capabilities: [
      { label: 'Guided quote building', description: 'Configure event details, menus, staffing, rentals, and terms.' },
      { label: 'Scenario comparison', description: 'Shape Good, Better, and Best paths without losing the baseline.' },
      { label: 'Customer decisions', description: 'Record a clear proposal review and approval path.' },
      { label: 'Production checklist', description: 'Carry approved scope into event planning.' }
    ],
    scenario: {
      trigger: 'A proposal changes after a customer reviews the event scope.',
      decision: 'Sales must preserve the approved baseline while making the next version clear to the customer and event team.',
      systemResponse: 'QuotePilot keeps quote versions, customer decisions, payment context, and production planning connected.',
      authorityBoundary: 'Customer approval, provider-backed payment, and operational readiness remain separate facts.',
      resultingClarity: 'Everyone can see the current commercial version and what still needs confirmation.'
    },
    screenshot: {
      src: '/product-screens/quoteflow.png',
      alt: 'QuotePilot product surface showing the connected inquiry, proposal, decision, payment, and event-operations workflow.',
      caption:
        'This current product surface demonstrates the QuotePilot workflow model. The staff workspace requires authentication and tenant configuration.',
      maturity: 'Authenticated staff workspace'
    },
    accentToken: 'amber',
    icon: FileCheck2,
    path: '/apps/quotepilot',
    websiteUrl: 'https://tonicatering.web.app',
    websiteLabel: 'Open QuotePilot',
    analyticsId: 'quotepilot',
    status: 'Deployed staff application',
    accessDescription: 'Staff sign-in required',
    proofBoundary:
      'Proposal approval, payment verification, booking, and production readiness remain distinct states with separate authority.',
    sourceRepository: {
      label: 'TOTALLYMAJOR/quoteflow',
      href: 'https://github.com/TOTALLYMAJOR/quoteflow'
    },
    visible: true
  }
] satisfies [ProductRecord, ...ProductRecord[]];

export const projectScreens = products.filter((product) => product.visible) as [ProductRecord, ...ProductRecord[]];

export function getProjectBySlug(slug: string) {
  return projectScreens.find((product) => product.slug === slug);
}
