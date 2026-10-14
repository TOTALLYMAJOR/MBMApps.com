import type { LucideIcon } from 'lucide-react';
import { CalendarDays, Crosshair, FileCheck2, Route, Workflow } from 'lucide-react';

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
  experienceHref: string;
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

// Homepage destination only: do not invent a catalog brief or source/release claims.
export const sportPilotPreview = {
  slug: 'sportpilot',
  name: 'SportPilot',
  websiteUrl: 'https://sportpilot.mbmapps.com/'
} as const satisfies Pick<ProductRecord, 'slug' | 'name' | 'websiteUrl'>;

export const masterScProduct = {
  id: 'master-sc',
  slug: 'master-sc',
  name: 'SC2 Master Coach',
  shortName: 'MSC',
  parentLabel: 'An MBMApps local-first coaching system',
  category: 'Replay intelligence and guided execution',
  audience: ['Competitive players', 'Replay reviewers', 'Practice-focused coaches'],
  operatingEnvironment: 'Local Windows desktop and loopback interface',
  headline: 'Read the field. Build the response.',
  supportingStatement:
    'Turn replay evidence into a bounded practice decision without claiming live game control.',
  description:
    'SC2 Master Coach is a local-first desktop coaching system that connects replay review, tactical explanation, and guided execution while keeping sample, runtime, and release states distinct.',
  problemStatement:
    'Replay observations are difficult to improve from when the evidence, decision, and next practice action are separated.',
  capabilities: [
    { label: 'Replay intelligence', description: 'Organize local replay evidence into a readable review sequence.' },
    { label: 'Checkpoint coaching', description: 'Connect supply checkpoints to specific observations and bounded responses.' },
    { label: 'Guided execution', description: 'Explain the next practice decision without controlling a live game.' },
    { label: 'Local-first operation', description: 'Keep the coaching workflow on the player’s machine and loopback interface.' }
  ],
  scenario: {
    trigger: 'A player finishes a match and needs to understand one decision that changed the game.',
    decision: 'The player must separate replay evidence from assumptions and choose a focused practice response.',
    systemResponse: 'Master Coach structures the local replay review into checkpoints, signals, and a bounded next action.',
    authorityBoundary: 'The player retains every game and practice decision; the system does not control live play.',
    resultingClarity: 'The review ends with one evidence-linked adjustment instead of a generic list of mistakes.'
  },
  screenshot: {
    src: '/product-screens/master-sc.svg',
    alt: 'Original abstract MasterSC concept artwork showing a tactical relay and three coaching doctrines.',
    caption:
      'Concept artwork for the protected MasterSC showcase. It is not a live game capture or proof of runtime operation.',
    maturity: 'Protected interactive portfolio showcase'
  },
  accentToken: 'amber',
  icon: Crosshair,
  path: '/MasterSC',
  experienceHref: '/MasterSC',
  websiteUrl: 'https://mbmapps.com/MasterSC',
  websiteLabel: 'Open MasterSC showcase',
  analyticsId: 'master-sc',
  status: 'Interactive portfolio showcase',
  accessDescription: 'Available to authenticated guest and member sessions',
  proofBoundary:
    'The interface uses deterministic sample state. It does not prove live game data, local runtime operation, deployment, release acceptance, coaching outcomes, or Blizzard affiliation.',
  sourceRepository: {
    label: 'TOTALLYMAJOR/SC2-Master-Coach',
    href: 'https://github.com/TOTALLYMAJOR/SC2-Master-Coach'
  },
  secondaryAction: {
    label: 'Download public v1.13.0',
    href: 'https://github.com/TOTALLYMAJOR/SC2-Master-Coach/releases/tag/v1.13.0'
  },
  visible: false
} satisfies ProductRecord;

export const products: [ProductRecord, ...ProductRecord[]] = [
  {
    id: 'wale',
    slug: 'wale',
    name: 'Wale',
    shortName: 'W',
    parentLabel: 'An MBMApps development system',
    category: 'System discovery and improvement',
    audience: ['Repository owners', 'Engineering leads', 'Agentic development teams'],
    operatingEnvironment: 'Repository-scoped development systems and evidence',
    headline: 'Make the whole system work.',
    supportingStatement:
      'Audit controls, diagnose the leading constraint, prepare bounded improvements, and verify evidence with feedback.',
    description:
      'Wale is a repository-first development intelligence system that audits instructions, tools, hooks, packages, architecture, quality, and evidence before preparing bounded improvements for human review.',
    problemStatement:
      'Development environments accumulate powerful controls without one trustworthy view of what exists, what is effective, and what should change next.',
    capabilities: [
      { label: 'Control map', description: 'Choose the instructions, tools, integrations, packages, and evidence Wale should audit.' },
      { label: 'Constraint diagnosis', description: 'Explain the strongest supported bottleneck and the unknowns that could change it.' },
      { label: 'Advisory catalog', description: 'Compare bounded recommendations, permissions, tradeoffs, and verification requirements.' },
      { label: 'Guided implementation', description: 'Select individual capabilities and prepare an approval-gated implementation plan.' },
      { label: 'Outcome verification', description: 'Compare evidence after an intervention without overstating effectiveness or cost.' }
    ],
    scenario: {
      trigger: 'A repository has accumulated instructions, hooks, plugins, MCPs, packages, and validation rules.',
      decision: 'The owner must determine which controls are current, which constraints matter, and which improvements are justified.',
      systemResponse: 'Wale inspects the selected repository, reports evidence health, ranks supported findings, and prepares selectable recommendations.',
      authorityBoundary: 'The owner approves scope and changes; AgentFlow remains the execution owner when implementation is authorized.',
      resultingClarity: 'The team sees what exists, what remains unknown, and the next responsible improvement.'
    },
    screenshot: {
      src: '/product-screens/wale.svg',
      alt: 'Concept artwork for Wale showing a teal whale crossing a gridded system landscape.',
      caption:
        'Concept artwork for the public Wale experience. Repository assessment requires a separately started local bridge and an explicitly selected repository.',
      maturity: 'Public product experience with local repository bridge'
    },
    accentToken: 'field',
    icon: Workflow,
    path: '/apps/wale',
    experienceHref: '/wale',
    websiteUrl: 'https://mbmapps.com/wale',
    websiteLabel: 'Open Wale archive',
    analyticsId: 'wale',
    status: 'Public product experience',
    accessDescription: 'Public archive available; repository analysis requires the local Wale bridge',
    proofBoundary:
      'The public site has no ambient filesystem access. An assessment or prepared plan does not prove approval, execution, deployment, effectiveness, or efficiency.',
    sourceRepository: {
      label: 'TOTALLYMAJOR/design-intelligence',
      href: 'https://github.com/TOTALLYMAJOR/design-intelligence'
    },
    visible: true
  },
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
      { label: 'Inventory', description: 'Surface stock requirements and missing inventory evidence.' },
      { label: 'Staffing', description: 'Surface coverage gaps and staffing requirements.' },
      { label: 'Partner portals', description: 'Grant-scoped event collaboration; private operations remain protected.' },
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
    experienceHref: 'https://www.quietpilot.us',
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
    experienceHref: 'https://www.leaguepilot.us',
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
    id: 'quoteflow',
    slug: 'quoteflow',
    name: 'QuoteFlow',
    shortName: 'QF',
    parentLabel: 'An MBMApps product',
    category: 'Quote-to-event operations',
    audience: ['Catering sales teams', 'Administrators', 'Event teams'],
    operatingEnvironment: 'Guided quoting, customer decisions, and event handoff',
    headline: 'Move from first inquiry to a clearer event.',
    supportingStatement:
      'Guided quotes, customer decisions, payment state, and event production—with their boundaries intact.',
    description:
      'QuoteFlow is the product system behind the QuotePilot workspace, connecting quote configuration, proposals, customer decisions, payment context, and event-production planning.',
    problemStatement:
      'Quote revisions, customer decisions, payment state, and production details become unreliable when they live in separate tools.',
    capabilities: [
      { label: 'Guided quote building', description: 'Configure event details, menus, staffing, rentals, and terms.' },
      { label: 'Scenario comparison', description: 'Shape Good, Better, and Best paths without losing the baseline.' },
      { label: 'Customer decisions', description: 'Record a clear proposal review and approval path.' },
      { label: 'Production checklist', description: 'Carry approved scope into event planning.' },
      { label: 'Event messaging', description: 'Keep customer and team communication tied to the right quote or event, not scattered threads.' }
    ],
    scenario: {
      trigger: 'A proposal changes after a customer reviews the event scope.',
      decision: 'Sales must preserve the approved baseline while making the next version clear to the customer and event team.',
      systemResponse: 'QuoteFlow keeps quote versions, customer decisions, payment context, and production planning connected.',
      authorityBoundary: 'Customer approval, provider-backed payment, and operational readiness remain separate facts.',
      resultingClarity: 'Everyone can see the current commercial version and what still needs confirmation.'
    },
    screenshot: {
      src: '/product-screens/quoteflow.webp',
      alt: 'QuoteFlow product surface showing the connected inquiry, proposal, decision, payment, and event-operations workflow.',
      caption:
        'This current product surface demonstrates the QuotePilot workflow model. The staff workspace requires authentication and tenant configuration.',
      maturity: 'Authenticated staff workspace'
    },
    accentToken: 'amber',
    icon: FileCheck2,
    path: '/apps/quoteflow',
    experienceHref: 'https://quotepilot.mbmapps.com',
    websiteUrl: 'https://quotepilot.mbmapps.com',
    websiteLabel: 'Open QuotePilot',
    analyticsId: 'quoteflow',
    status: 'Public product site and staff workspace',
    accessDescription: 'Public product site; staff sign-in for the workspace',
    proofBoundary:
      'Proposal approval, payment verification, booking, and production readiness remain distinct states with separate authority.',
    sourceRepository: {
      label: 'TOTALLYMAJOR/quoteflow',
      href: 'https://github.com/TOTALLYMAJOR/quoteflow'
    },
    visible: true
  },
  masterScProduct
] satisfies [ProductRecord, ...ProductRecord[]];

export const projectScreens = products.filter((product) => product.visible) as [ProductRecord, ...ProductRecord[]];

export function getProjectBySlug(slug: string) {
  return projectScreens.find((product) => product.slug === slug);
}

export type HomepagePortfolioKind =
  | 'Development system'
  | 'Product system'
  | 'Product'
  | 'Website preview'
  | 'Protected showcase';

export type HomepagePortfolioItem = {
  slug: string;
  name: string;
  href: string;
  kind: HomepagePortfolioKind;
  status: string;
  featured: boolean;
};

function requireProduct(slug: string) {
  const product = products.find((candidate) => candidate.slug === slug);
  if (!product) throw new Error(`Missing canonical product record: ${slug}`);
  return product;
}

const wale = requireProduct('wale');
const quoteFlow = requireProduct('quoteflow');
const quietPilot = requireProduct('quietpilot');
const leaguePilot = requireProduct('leaguepilot');

export const homepagePortfolio = [
  {
    slug: wale.slug,
    name: wale.name,
    href: wale.experienceHref,
    kind: 'Development system',
    status: wale.status,
    featured: true,
  },
  {
    slug: quoteFlow.slug,
    name: quoteFlow.name,
    href: quoteFlow.experienceHref,
    kind: 'Product system',
    status: quoteFlow.status,
    featured: true,
  },
  {
    slug: quietPilot.slug,
    name: quietPilot.name,
    href: quietPilot.websiteUrl,
    kind: 'Product',
    status: quietPilot.status,
    featured: true,
  },
  {
    slug: leaguePilot.slug,
    name: leaguePilot.name,
    href: leaguePilot.websiteUrl,
    kind: 'Product',
    status: leaguePilot.status,
    featured: false,
  },
  {
    slug: sportPilotPreview.slug,
    name: sportPilotPreview.name,
    href: sportPilotPreview.websiteUrl,
    kind: 'Website preview',
    status: 'External website preview',
    featured: false,
  },
  {
    slug: masterScProduct.slug,
    name: masterScProduct.name,
    href: masterScProduct.experienceHref,
    kind: 'Protected showcase',
    status: masterScProduct.status,
    featured: false,
  },
] as const satisfies readonly HomepagePortfolioItem[];
