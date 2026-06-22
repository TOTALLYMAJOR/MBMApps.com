import type { LucideIcon } from 'lucide-react';
import {
  CalendarDays,
  CircleDollarSign,
  ClipboardCheck,
  Gamepad2,
  Goal,
  Layers3,
  Map,
  MessageCircle,
  Palette,
  Radar,
  Route,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  Zap
} from 'lucide-react';
import { championCoachProduct, quietPilotProduct } from '@/lib/site';

export type ProjectTone = 'quietpilot' | 'coach' | 'clubhouse' | 'studio' | 'canvas';

export type ProjectMetric = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
};

export type ProjectScreen = {
  slug: string;
  name: string;
  shortName: string;
  category: string;
  status: string;
  tone: ProjectTone;
  icon: LucideIcon;
  path: string;
  sourceRepository: {
    label: string;
    href: string;
  };
  eyebrow: string;
  title: string;
  summary: string;
  description: string;
  audience: string;
  primary: {
    label: string;
    href: string;
    external?: boolean;
  };
  secondary: {
    label: string;
    href: string;
    external?: boolean;
  };
  metrics: ProjectMetric[];
  stages: string[];
  capabilities: string[];
  proofPoints: string[];
};

export const projectScreens: [ProjectScreen, ...ProjectScreen[]] = [
  {
    slug: 'quietpilot',
    name: quietPilotProduct.name,
    shortName: 'QP',
    category: 'Service operations',
    status: 'Live product',
    tone: 'quietpilot',
    icon: Route,
    path: '/apps/quietpilot',
    sourceRepository: {
      label: 'TOTALLYMAJOR/QuietPilot',
      href: 'https://github.com/TOTALLYMAJOR/QuietPilot'
    },
    eyebrow: 'Flagship service operations',
    title: 'Lead intake, quotes, proposals, payment risk, and job readiness in one operator screen.',
    summary:
      'QuietPilot is the revenue operating system for service businesses that need commercial state and fulfillment readiness to move together.',
    description:
      'QuietPilot connects inquiry, quoting, proposal delivery, payment proof, staffing, inventory, readiness, and audit history so operators can see what is commercially true before work moves forward.',
    audience: 'Caterers, rentals teams, field-service operators, and service businesses that need quote-to-ready control.',
    primary: {
      label: 'View QuietPilot',
      href: quietPilotProduct.path
    },
    secondary: {
      label: 'Open app',
      href: quietPilotProduct.appUrl,
      external: true
    },
    metrics: [
      { label: 'New leads', value: '12', detail: '3 need action', icon: MessageCircle },
      { label: 'Proposal value', value: '$42k', detail: '2 viewed today', icon: CircleDollarSign },
      { label: 'Ready jobs', value: '82%', detail: 'after staffing action', icon: CalendarDays }
    ],
    stages: ['Inquiry', 'Quote', 'Proposal', 'Payment', 'Ready'],
    capabilities: ['Configurable quote flow', 'Proposal decision room', 'Payment proof handoff', 'Readiness gates'],
    proofPoints: ['Saved quote versions stay immutable', 'Payment status comes from provider proof', 'Readiness is evidence-backed']
  },
  {
    slug: 'champion-coach-os',
    name: championCoachProduct.name,
    shortName: 'CC',
    category: 'Competitive coaching',
    status: 'Product screen',
    tone: 'coach',
    icon: Gamepad2,
    path: championCoachProduct.path,
    sourceRepository: {
      label: 'TOTALLYMAJOR/champion-coach-os',
      href: 'https://github.com/TOTALLYMAJOR/champion-coach-os'
    },
    eyebrow: 'Competitive coaching cockpit',
    title: 'Champion prep, lane pressure, build timing, and review loops as one performance screen.',
    summary:
      'Champion Coach OS frames matchup reads, recall decisions, item paths, and review notes so a player can practice with a clearer operating model.',
    description:
      'A coaching cockpit for competitive play that turns prep, draft context, lane signals, item timing, and replay notes into a repeatable training workflow.',
    audience: 'Players, coaches, and creators who want structured practice plans instead of scattered notes.',
    primary: {
      label: 'View Champion Coach OS',
      href: championCoachProduct.path
    },
    secondary: {
      label: 'Contact MBMApps',
      href: '/contact'
    },
    metrics: [
      { label: 'Lane calls', value: '9', detail: 'pressure states', icon: Radar },
      { label: 'Build paths', value: '14', detail: 'matchup variants', icon: Zap },
      { label: 'Review notes', value: '27', detail: 'coachable moments', icon: Trophy }
    ],
    stages: ['Scout', 'Draft', 'Lane', 'Build', 'Review'],
    capabilities: ['Champion matchup reads', 'Lane-state planning', 'Build-path branches', 'Review-loop notes'],
    proofPoints: ['Screen-first coaching model', 'Combat UI exploration', 'Practice workflow framing']
  },
  {
    slug: 'little-league-hq',
    name: 'Little League HQ',
    shortName: 'LL',
    category: 'Youth sports',
    status: 'MVP concept',
    tone: 'clubhouse',
    icon: Goal,
    path: '/apps/little-league-hq',
    sourceRepository: {
      label: 'TOTALLYMAJOR/LittleLeaguePlatform',
      href: 'https://github.com/TOTALLYMAJOR/LittleLeaguePlatform'
    },
    eyebrow: 'Parent-friendly soccer clubhouse',
    title: 'A safe team hub for coaches, parents, schedules, game-day questions, and kid-friendly league moments.',
    summary:
      'Little League HQ keeps youth soccer communication organized for families with approachable schedules, team chat, coach notes, and game-day cards.',
    description:
      'A youth league app direction for 4 to 6 year olds that emphasizes parent safety, coach announcements, team coordination, schedules, rosters, and cheerful clubhouse presentation.',
    audience: 'Youth leagues, coaches, parents, and organizers running early-childhood sports seasons.',
    primary: {
      label: 'View project',
      href: '/apps/little-league-hq'
    },
    secondary: {
      label: 'Plan a youth app',
      href: '/contact'
    },
    metrics: [
      { label: 'Team spaces', value: '1/team', detail: 'private parent groups', icon: Users },
      { label: 'Coach notes', value: 'Pinned', detail: 'clear reminders', icon: ShieldCheck },
      { label: 'Game day', value: 'Cards', detail: 'field and arrival info', icon: Map }
    ],
    stages: ['Teams', 'Roster', 'Schedule', 'Chat', 'Game Day'],
    capabilities: ['Team chat', 'Coach announcements', 'Game-day cards', 'Moderation and audit fields'],
    proofPoints: ['No child chat accounts', 'Role-scoped access model', 'Child names minimized in parent-facing UI']
  },
  {
    slug: 'little-legend-studios',
    name: 'Little Legend Studios',
    shortName: 'LS',
    category: 'Creative studio',
    status: 'Studio project',
    tone: 'studio',
    icon: Palette,
    path: '/apps/little-legend-studios',
    sourceRepository: {
      label: 'TOTALLYMAJOR/lit',
      href: 'https://github.com/TOTALLYMAJOR/lit'
    },
    eyebrow: 'Creative product studio',
    title: 'A playful studio surface for story-rich digital products, characters, worlds, and family-friendly experiences.',
    summary:
      'Little Legend Studios is the creative side of the portfolio, focused on warm visual systems, playful product worlds, and story-led experiences.',
    description:
      'A studio project for packaging creative experiments, character-led interfaces, and family-friendly product worlds with a polished digital presence.',
    audience: 'Brands, families, creators, and product teams that need a warmer storytelling layer around software.',
    primary: {
      label: 'View project',
      href: '/apps/little-legend-studios'
    },
    secondary: {
      label: 'Start a studio brief',
      href: '/contact'
    },
    metrics: [
      { label: 'Visual worlds', value: 'Story', detail: 'character-led surfaces', icon: Sparkles },
      { label: 'Experience tone', value: 'Warm', detail: 'family-friendly UI', icon: Palette },
      { label: 'Delivery model', value: 'Digital', detail: 'sites and apps', icon: Layers3 }
    ],
    stages: ['Concept', 'World', 'Interface', 'Story', 'Launch'],
    capabilities: ['Visual direction', 'Story-led product pages', 'Family-friendly interfaces', 'Brand system exploration'],
    proofPoints: ['Dedicated local project', 'Reusable visual-system direction', 'Portfolio-ready product framing']
  },
  {
    slug: 'league-lobby-design-canvas',
    name: 'League Lobby Design Canvas',
    shortName: 'LC',
    category: 'Design simulator',
    status: 'Design canvas',
    tone: 'canvas',
    icon: ClipboardCheck,
    path: '/apps/league-lobby-design-canvas',
    sourceRepository: {
      label: 'TOTALLYMAJOR/LeagueLobbyDesignCanvas',
      href: 'https://github.com/TOTALLYMAJOR/LeagueLobbyDesignCanvas'
    },
    eyebrow: 'Interactive design canvas',
    title: 'A visual playground for lobby, combat, and esports interface experiments before they become product surfaces.',
    summary:
      'League Lobby Design Canvas gives MBMApps a fast place to shape gaming UI concepts, champion panels, decision screens, and combat presentation.',
    description:
      'A Vite-based design canvas for iterating on league lobby and combat UI patterns with richer visual experimentation than a static mockup.',
    audience: 'Product builders exploring esports, game-adjacent dashboards, simulations, and interactive visual prototypes.',
    primary: {
      label: 'View project',
      href: '/apps/league-lobby-design-canvas'
    },
    secondary: {
      label: 'Discuss a canvas',
      href: '/contact'
    },
    metrics: [
      { label: 'Mode', value: 'Canvas', detail: 'interactive exploration', icon: ClipboardCheck },
      { label: 'Domain', value: 'Esports', detail: 'lobby and combat UI', icon: Gamepad2 },
      { label: 'Output', value: 'Signals', detail: 'patterns for apps', icon: Layers3 }
    ],
    stages: ['Explore', 'Preview', 'Tune', 'Validate', 'Reuse'],
    capabilities: ['Lobby visualization', 'Combat screen exploration', 'Prototype iteration', 'Reusable UI signals'],
    proofPoints: ['Active local project', 'Fast Vite workflow', 'Source for app-panel visual experiments']
  }
] satisfies [ProjectScreen, ...ProjectScreen[]];

export function getProjectBySlug(slug: string) {
  return projectScreens.find((project) => project.slug === slug);
}
