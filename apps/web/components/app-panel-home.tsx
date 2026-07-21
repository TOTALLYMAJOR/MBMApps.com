'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Eye,
  Gamepad2,
  Package,
  Search,
  Settings,
  ShoppingBag,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { LandingThreeStage } from '@/components/landing-three-stage';
import { projectScreens, type ProjectMetric, type ProjectScreen, type ProjectTone } from '@/lib/projects';
import { cn } from '@/lib/utils';

type AppScreenId = ProjectScreen['slug'];

type ReadinessTone = 'cyan' | 'amber' | 'emerald' | 'sky';

const readinessToneClasses = {
  amber: 'bg-amber-300',
  cyan: 'bg-cyan-300',
  emerald: 'bg-emerald-300',
  sky: 'bg-sky-300'
} satisfies Record<ReadinessTone, string>;

const quietPilotReadinessRows = [
  { label: 'Proposal acceptance', value: 88, tone: 'cyan' },
  { label: 'Deposit proof', value: 64, tone: 'amber' },
  { label: 'Staffing coverage', value: 82, tone: 'emerald' },
  { label: 'Inventory confidence', value: 74, tone: 'sky' }
] satisfies Array<{ label: string; value: number; tone: ReadinessTone }>;

const championPlanRows = [
  { label: 'Champion', value: 'Vayne', note: 'scaling marksman' },
  { label: 'Opponent', value: 'Ahri', note: 'skillshot pressure' },
  { label: 'Lane state', value: 'Pressured', note: 'protect recall timing' }
] satisfies Array<{ label: string; value: string; note: string }>;

const championReviewMetrics = [
  { label: 'Trade windows', value: '03', icon: Eye },
  { label: 'Item forks', value: '04', icon: Package },
  { label: 'Practice blocks', value: '02', icon: ClipboardCheck }
] satisfies Array<{ label: string; value: string; icon: LucideIcon }>;

const panelSummaryCards = [
  { label: 'Portfolio', value: `${projectScreens.length} app screens`, icon: Trophy },
  { label: 'Primary tracks', value: 'Ops, sports, studio', icon: Sparkles },
  { label: 'Build model', value: 'Screen-first systems', icon: BarChart3 }
] satisfies Array<{ label: string; value: string; icon: LucideIcon }>;

const toneStyles = {
  quietpilot: {
    rail: 'border-cyan-300/45 bg-cyan-300/12 text-cyan-100',
    icon: 'border-cyan-200/40 bg-cyan-300/12 text-cyan-100',
    panel: 'border-cyan-300/25 bg-[#05101d]/92',
    metric: 'border-cyan-300/20 bg-cyan-300/8',
    accent: 'text-cyan-200',
    bar: 'bg-cyan-300'
  },
  coach: {
    rail: 'border-emerald-300/45 bg-emerald-300/12 text-emerald-100',
    icon: 'border-emerald-200/40 bg-emerald-300/12 text-emerald-100',
    panel: 'border-emerald-300/25 bg-[#08120d]/92',
    metric: 'border-emerald-300/20 bg-emerald-300/8',
    accent: 'text-emerald-200',
    bar: 'bg-emerald-300'
  },
  clubhouse: {
    rail: 'border-sky-300/45 bg-sky-300/12 text-sky-100',
    icon: 'border-sky-200/40 bg-sky-300/12 text-sky-100',
    panel: 'border-sky-300/25 bg-[#071221]/92',
    metric: 'border-sky-300/20 bg-sky-300/8',
    accent: 'text-sky-200',
    bar: 'bg-sky-300'
  },
  studio: {
    rail: 'border-yellow-200/50 bg-yellow-200/12 text-yellow-100',
    icon: 'border-yellow-100/40 bg-yellow-200/12 text-yellow-100',
    panel: 'border-yellow-200/25 bg-[#141107]/92',
    metric: 'border-yellow-200/20 bg-yellow-200/8',
    accent: 'text-yellow-100',
    bar: 'bg-yellow-200'
  },
  canvas: {
    rail: 'border-fuchsia-300/45 bg-fuchsia-300/12 text-fuchsia-100',
    icon: 'border-fuchsia-200/40 bg-fuchsia-300/12 text-fuchsia-100',
    panel: 'border-fuchsia-300/25 bg-[#12091a]/92',
    metric: 'border-fuchsia-300/20 bg-fuchsia-300/8',
    accent: 'text-fuchsia-100',
    bar: 'bg-fuchsia-300'
  }
} satisfies Record<ProjectTone, Record<string, string>>;

const quietPilotQueue = [
  {
    label: 'Blocked job',
    title: 'Smith Wedding needs 2 senior staff',
    detail: 'Readiness improves after assignments are confirmed.',
    tone: 'border-blue-300/30 bg-blue-400/12 text-blue-100'
  },
  {
    label: 'Warm proposal',
    title: 'Tech Gala viewed the proposal again',
    detail: 'Follow-up is high leverage while intent is fresh.',
    tone: 'border-amber-300/35 bg-amber-300/12 text-amber-100'
  },
  {
    label: 'Payment gate',
    title: 'Apex Brand Launch has deposit risk',
    detail: 'Operations stays visible before fulfillment moves.',
    tone: 'border-rose-300/30 bg-rose-300/12 text-rose-100'
  }
];

const championCoachQueue = [
  {
    label: 'Matchup read',
    title: 'Vayne into Ahri needs safer recall math',
    detail: 'Track wave state, gold, and first component timing.',
    tone: 'border-emerald-300/30 bg-emerald-300/12 text-emerald-100'
  },
  {
    label: 'Build call',
    title: 'Pressure state favors Wits End timing',
    detail: 'Compare lane threat against next fight window.',
    tone: 'border-orange-300/35 bg-orange-300/12 text-orange-100'
  },
  {
    label: 'Review loop',
    title: 'Three trade windows need replay notes',
    detail: 'Tag decision points for the next practice block.',
    tone: 'border-sky-300/30 bg-sky-300/12 text-sky-100'
  }
];

function ProductRailButton({
  screen,
  selected,
  onSelect
}: {
  screen: ProjectScreen;
  selected: boolean;
  onSelect: () => void;
}) {
  const Icon = screen.icon;
  const styles = toneStyles[screen.tone];

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'grid w-full min-w-0 grid-cols-[2.4rem_1fr_auto] items-center gap-3 rounded-lg border px-3 py-3 text-left transition',
        selected ? styles.rail : 'border-white/10 bg-white/[0.04] text-white/72 hover:border-white/24 hover:text-white'
      )}
    >
      <span className={cn('flex h-9 w-9 items-center justify-center rounded-md border', selected ? styles.icon : 'border-white/12 bg-black/20 text-white/55')}>
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold">{screen.name}</span>
        <span className="mt-0.5 block truncate text-xs text-white/48">{screen.status}</span>
      </span>
      <ChevronRight className={cn('h-4 w-4 transition', selected ? 'opacity-100' : 'opacity-35')} aria-hidden="true" />
    </button>
  );
}

function ProductMetricCard({ metric, tone }: { metric: ProjectMetric; tone: ProjectTone }) {
  const Icon = metric.icon;

  return (
    <div className={cn('rounded-lg border p-4', toneStyles[tone].metric)}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-white/56">{metric.label}</p>
        <Icon className="h-4 w-4 text-white/48" aria-hidden="true" />
      </div>
      <p className="mt-3 font-display text-2xl font-semibold text-white">{metric.value}</p>
      <p className="mt-1 text-xs text-white/52">{metric.detail}</p>
    </div>
  );
}

function StageRail({ stages, tone }: { stages: string[]; tone: ProjectTone }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 2xl:grid-cols-5">
      {stages.map((stage, index) => (
        <div key={stage} className="rounded-md border border-white/10 bg-black/24 p-3">
          <div className="mb-3 flex items-center gap-2">
            <span className={cn('h-2 w-2 rounded-full', toneStyles[tone].bar)} aria-hidden="true" />
            <span className="font-mono text-[0.62rem] text-white/46">0{index + 1}</span>
          </div>
          <p className="text-xs font-semibold text-white/82">{stage}</p>
        </div>
      ))}
    </div>
  );
}

function QuietPilotScreen() {
  return (
    <div className="grid h-full gap-4 2xl:grid-cols-[1fr_0.72fr]">
      <div className="space-y-4">
        <div className="rounded-lg border border-cyan-300/20 bg-[#06172a] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200">Command center</p>
              <h3 className="mt-2 text-xl font-semibold text-white">Today&apos;s revenue movement</h3>
            </div>
            <div className="hidden items-center gap-2 rounded-md border border-cyan-300/20 bg-black/22 px-3 py-2 text-xs text-white/62 sm:flex">
              <Search className="h-4 w-4" aria-hidden="true" />
              Operator view
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              ['128', 'qualified accounts'],
              ['$18.5k', 'payment risk'],
              ['22', 'jobs ready']
            ].map(([value, label]) => (
              <div key={label} className="rounded-md border border-white/10 bg-white/[0.04] p-3">
                <p className="font-display text-2xl font-semibold text-white">{value}</p>
                <p className="mt-1 text-xs text-white/48">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-white/10">
          {quietPilotQueue.map((item) => (
            <div key={item.title} className="grid gap-3 border-b border-white/10 bg-white/[0.035] p-3 last:border-b-0 md:grid-cols-[132px_1fr_auto] md:items-center">
              <span className={cn('rounded-md border px-3 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.12em]', item.tone)}>
                {item.label}
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-1 text-xs leading-5 text-white/48">{item.detail}</p>
              </div>
              <button type="button" className="inline-flex items-center justify-center gap-2 rounded-md border border-cyan-300/24 bg-cyan-300/10 px-3 py-2 text-xs font-semibold text-white">
                Open
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-white/10 bg-black/24 p-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Readiness map
        </div>
        <div className="mt-5 space-y-4">
          {quietPilotReadinessRows.map((row) => (
            <div key={row.label}>
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-white/70">{row.label}</span>
                <span className="font-mono text-white/48">{row.value}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <span
                  className={cn('block h-full rounded-full', readinessToneClasses[row.tone])}
                  style={{ width: `${row.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-lg border border-cyan-300/20 bg-cyan-300/8 p-4">
          <p className="text-sm font-semibold text-white">Next best action</p>
          <p className="mt-2 text-xs leading-6 text-white/58">Confirm two senior technicians before payment follow-up so the job moves from blocked to ready.</p>
        </div>
      </div>
    </div>
  );
}

function ChampionCoachScreen() {
  return (
    <div className="grid h-full gap-4 2xl:grid-cols-[0.74fr_1fr]">
      <div className="rounded-lg border border-emerald-300/20 bg-[#07150f] p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-200">Draft desk</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Champion lane plan</h3>
          </div>
          <Gamepad2 className="h-5 w-5 text-emerald-200" aria-hidden="true" />
        </div>

        <div className="mt-5 grid gap-3">
          {championPlanRows.map((row) => (
            <div key={row.label} className="rounded-md border border-white/10 bg-white/[0.04] p-3">
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-white/42">{row.label}</p>
              <p className="mt-2 text-lg font-semibold text-white">{row.value}</p>
              <p className="mt-1 text-xs text-white/48">{row.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-lg border border-orange-300/25 bg-orange-300/10 p-4">
          <p className="text-sm font-semibold text-orange-100">First recall call</p>
          <p className="mt-2 text-xs leading-6 text-white/58">Buy defensively when poke pressure stays high, then reset the next fight around safer spacing.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="overflow-hidden rounded-lg border border-white/10">
          {championCoachQueue.map((item) => (
            <div key={item.title} className="grid gap-3 border-b border-white/10 bg-white/[0.035] p-3 last:border-b-0 md:grid-cols-[128px_1fr_auto] md:items-center">
              <span className={cn('rounded-md border px-3 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.12em]', item.tone)}>
                {item.label}
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-1 text-xs leading-5 text-white/48">{item.detail}</p>
              </div>
              <button type="button" className="inline-flex items-center justify-center gap-2 rounded-md border border-emerald-300/24 bg-emerald-300/10 px-3 py-2 text-xs font-semibold text-white">
                Review
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {championReviewMetrics.map((metric) => {
            const MetricIcon = metric.icon;
            return (
              <div key={metric.label} className="rounded-lg border border-emerald-300/18 bg-emerald-300/8 p-4">
                <MetricIcon className="h-4 w-4 text-emerald-200" aria-hidden="true" />
                <p className="mt-3 font-display text-2xl font-semibold text-white">{metric.value}</p>
                <p className="mt-1 text-xs text-white/50">{metric.label}</p>
              </div>
            );
          })}
        </div>

        <div className="rounded-lg border border-white/10 bg-black/24 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-200">
            <BarChart3 className="h-4 w-4" aria-hidden="true" />
            Review signal
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-md border border-white/10 bg-white/[0.04] p-3">
              <p className="text-xs text-white/48">Focus score</p>
              <p className="mt-2 font-display text-3xl font-semibold text-white">76</p>
            </div>
            <p className="rounded-md border border-white/10 bg-white/[0.04] p-3 text-xs leading-6 text-white/58">
              Biggest gain is cleaner reset timing after pressured trades. The next block should isolate wave state and component value.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectSignalScreen({ active }: { active: ProjectScreen }) {
  const styles = toneStyles[active.tone];
  const Icon = active.icon;

  return (
    <div className="grid h-full gap-4 2xl:grid-cols-[0.78fr_1fr]">
      <div className="rounded-lg border border-white/10 bg-black/24 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={cn('text-xs font-semibold uppercase tracking-[0.14em]', styles.accent)}>{active.category}</p>
            <h3 className="mt-2 text-xl font-semibold text-white">{active.name}</h3>
            <p className="mt-3 text-xs leading-6 text-white/58">{active.description}</p>
          </div>
          <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-md border', styles.icon)}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>

        <div className="mt-5 grid gap-3">
          {active.capabilities.slice(0, 4).map((capability) => (
            <div key={capability} className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.04] p-3">
              <CheckCircle2 className={cn('h-4 w-4 shrink-0', styles.accent)} aria-hidden="true" />
              <p className="text-sm font-semibold text-white/82">{capability}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
          <div className="flex items-center justify-between gap-3">
            <p className={cn('text-xs font-semibold uppercase tracking-[0.14em]', styles.accent)}>Source repo</p>
            <span className="rounded-md border border-white/10 bg-black/24 px-3 py-1 font-mono text-[0.62rem] text-white/42">
              {active.shortName}
            </span>
          </div>
          <Link
            href={active.sourceRepository.href}
            target="_blank"
            rel="noreferrer"
            className="mt-3 block break-words font-mono text-xs leading-6 text-white/58 transition hover:text-white"
          >
            {active.sourceRepository.label}
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {active.metrics.map((metric) => (
            <ProductMetricCard key={metric.label} metric={metric} tone={active.tone} />
          ))}
        </div>

        <div className="rounded-lg border border-white/10 bg-black/24 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/50">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Signals
          </div>
          <div className="mt-4 grid gap-3">
            {active.proofPoints.map((point) => (
              <div key={point} className="rounded-md border border-white/10 bg-white/[0.04] p-3 text-xs leading-6 text-white/58">
                {point}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductScreenPreview({ active }: { active: ProjectScreen }) {
  const screen =
    active.slug === 'quietpilot' ? (
      <QuietPilotScreen />
    ) : active.slug === 'champion-coach-os' ? (
      <ChampionCoachScreen />
    ) : (
      <ProjectSignalScreen active={active} />
    );

  return (
    <div className={cn('min-h-[520px] w-full max-w-full overflow-hidden rounded-lg border p-3 shadow-[0_24px_80px_rgba(0,0,0,0.35)] lg:p-4', toneStyles[active.tone].panel)}>
      <div className="mb-4 flex items-center justify-between gap-3 rounded-md border border-white/10 bg-black/28 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-300" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" aria-hidden="true" />
        </div>
        <p className="truncate font-mono text-[0.64rem] uppercase tracking-[0.16em] text-white/42">{active.name} / screen</p>
        <Settings className="h-4 w-4 text-white/35" aria-hidden="true" />
      </div>

      {screen}
    </div>
  );
}

function StorefrontCard({ project, featured = false }: { project: ProjectScreen; featured?: boolean }) {
  const Icon = project.icon;
  const isAvailable = project.commerce.availability === 'Available now';

  return (
    <article className={cn('storefront-card group relative flex min-h-[24rem] flex-col overflow-hidden', featured && 'storefront-card--featured lg:col-span-2')}>
      <div className="storefront-card__glow" aria-hidden="true" />
      <div className="relative z-10 flex items-start justify-between gap-4">
        <span className="storefront-icon">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className={cn('availability-mark', isAvailable && 'availability-mark--live')}>
          <span className="availability-mark__dot" aria-hidden="true" />
          {project.commerce.availability}
        </span>
      </div>

      <div className="relative z-10 mt-auto pt-16">
        <p className="storefront-index">{project.shortName} / {project.category}</p>
        <h3 className={cn('mt-4 max-w-2xl font-display font-medium tracking-[-0.045em] text-white', featured ? 'text-4xl sm:text-5xl' : 'text-3xl')}>
          {project.name}
        </h3>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62">{project.summary}</p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link href={project.commerce.actionHref} className={cn('storefront-action', isAvailable && 'storefront-action--primary')}>
            {project.commerce.actionLabel}
            {isAvailable ? <ShoppingBag className="h-4 w-4" aria-hidden="true" /> : <ArrowUpRight className="h-4 w-4" aria-hidden="true" />}
          </Link>
          <Link href={project.path} className="storefront-detail-link">
            Explore app
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <p className="mt-4 text-xs text-white/38">{project.commerce.note}</p>
      </div>
    </article>
  );
}

export function AppPanelHome() {
  const [activeId, setActiveId] = useState<AppScreenId>('quietpilot');
  const active = useMemo(() => projectScreens.find((screen) => screen.slug === activeId) ?? projectScreens[0], [activeId]);

  return (
    <>
      <LandingThreeStage />

      <section className="hero storefront-hero relative overflow-hidden border-b border-white/10">
        <div className="storefront-orbit storefront-orbit--one" aria-hidden="true" />
        <div className="storefront-orbit storefront-orbit--two" aria-hidden="true" />
        <div className="ambient-grid pointer-events-none absolute inset-0 opacity-30" />
        <div className="relative z-10 mx-auto grid min-h-[46rem] w-full max-w-[1480px] items-end gap-12 px-6 pb-20 pt-24 lg:grid-cols-[minmax(0,1fr)_24rem] lg:px-8 lg:pb-24">
          <div>
            <div className="intro-reveal inline-flex items-center gap-2 rounded-full border border-indigo-300/25 bg-indigo-300/10 px-3 py-1.5 text-xs font-medium text-indigo-100">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-300 shadow-[0_0_14px_rgba(165,180,252,0.9)]" aria-hidden="true" />
              Independent software, built in Chicago
            </div>
            <h1 className="intro-reveal mt-7 max-w-5xl font-display text-[clamp(3.4rem,8vw,7.8rem)] font-light leading-[0.91] tracking-[-0.065em] text-white">
              Apps that make work <span className="storefront-gradient-text">move.</span>
            </h1>
            <p className="intro-reveal mt-7 max-w-2xl text-base leading-8 text-white/62 sm:text-lg">
              Browse focused software for service operations, competitive coaching, youth sports, and creative production. Buy what is ready or get early access to what is next.
            </p>
            <div className="intro-reveal mt-9 flex flex-wrap gap-3">
              <Link href="#shop-apps" className="storefront-hero-button storefront-hero-button--primary">
                Shop apps
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="#app-panel" className="storefront-hero-button">
                See how they work
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <aside className="intro-reveal storefront-signal-card">
            <div className="flex items-center justify-between gap-4">
              <p className="storefront-index">Portfolio signal</p>
              <span className="font-mono text-xs text-indigo-200">0{projectScreens.length}</span>
            </div>
            <div className="mt-12">
              <p className="font-display text-5xl font-light tracking-[-0.05em] text-white">One clear shelf.</p>
              <p className="mt-4 text-sm leading-7 text-white/55">See availability, open the product page, and take the right next step without hunting through the site.</p>
            </div>
            <div className="mt-10 flex items-center gap-3 border-t border-white/10 pt-5 text-xs text-white/45">
              <CheckCircle2 className="h-4 w-4 text-emerald-300" aria-hidden="true" />
              Purchase paths shown only when available
            </div>
          </aside>
        </div>
      </section>

      <section id="shop-apps" className="relative z-10 mx-auto w-full max-w-[1480px] px-6 py-20 lg:px-8 lg:py-28">
        <div className="mb-10 grid gap-5 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div>
            <p className="storefront-index">The app shelf</p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-light tracking-[-0.045em] text-white sm:text-6xl">Choose the software that fits the work.</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-white/55 lg:justify-self-end">Available products link directly to checkout. Preview and in-development products connect you with MBMApps for access.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {projectScreens.map((project, index) => (
            <StorefrontCard key={project.slug} project={project} featured={index === 0} />
          ))}
        </div>
      </section>

      <section className="northstar-section northstar-container">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="northstar-kicker">More than a portfolio</p>
            <h2 className="northstar-section-heading mt-4">A product studio built around operating leverage.</h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/50">MBMApps builds its own focused products and helps teams modernize the workflows that move revenue, delivery, and decision-making.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/services" className="storefront-action">Explore engineering services <ArrowUpRight className="h-4 w-4" /></Link>
              <Link href="/case-studies" className="storefront-detail-link">See client outcomes <ChevronRight className="h-4 w-4" /></Link>
            </div>
          </div>
          <div className="northstar-rule-list border-y border-white/10">
            {[
              ['01', 'Product systems', 'Production-ready web applications with typed contracts, modular services, and release controls.'],
              ['02', 'Revenue workflows', 'Quote, pricing, CRM, and customer-lifecycle systems shaped around the actual operating model.'],
              ['03', 'Cloud reliability', 'Vercel, Railway, Firebase, Docker, and CI/CD topology selected for parity and recovery.']
            ].map(([index, title, detail]) => (
              <article key={index} className="grid gap-4 py-6 sm:grid-cols-[3rem_11rem_1fr]">
                <span className="northstar-number text-xs">{index}</span>
                <h3 className="font-display text-xl font-medium text-white">{title}</h3>
                <p className="text-sm leading-7 text-white/46">{detail}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-20 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="northstar-card p-7 md:p-10">
            <div className="flex items-center justify-between gap-4">
              <p className="northstar-kicker">Measured outcome</p>
              <span className="northstar-number text-xs">Hospitality</span>
            </div>
            <p className="mt-20 font-display text-[clamp(3.5rem,8vw,7rem)] font-light leading-none tracking-[-0.065em] text-white">42 min.</p>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/52">Quote turnaround reduced from 2.5 days to 42 minutes for a regional catering workflow, with conversion visibility improving alongside speed.</p>
          </article>
          <article className="northstar-card flex flex-col p-7 md:p-10">
            <p className="northstar-kicker">Delivery posture</p>
            <div className="mt-auto pt-20">
              <p className="font-display text-4xl font-light tracking-[-0.05em] text-white">Architecture direction in days, not months.</p>
              <p className="mt-5 text-sm leading-7 text-white/48">Typed boundaries, automated quality gates, and technical decisions tied back to the business result.</p>
              <Link href="/contact" className="storefront-action storefront-action--primary mt-7">Bring us the constraint <ArrowUpRight className="h-4 w-4" /></Link>
            </div>
          </article>
        </div>
      </section>

      <section
        id="app-panel"
        className="scene-panel relative overflow-hidden border-y border-white/10"
        data-rot-y="0"
        data-cam-z="4.8"
        data-cam-y="0"
        data-cam-x="0"
        data-rot-x="0.18"
      >
        <div className="scene-wash pointer-events-none absolute inset-0" />
        <div className="relative z-10 mx-auto w-full max-w-[1480px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="rounded-lg border border-white/12 bg-[#050814]/90 shadow-[0_26px_110px_rgba(0,0,0,0.44)] backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 lg:px-5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md border border-white/14 bg-white/8">
                  <Sparkles className="h-4 w-4 text-cyan-100" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-[0.64rem] uppercase tracking-[0.18em] text-white/45">MBMApps</p>
                  <h1 className="truncate font-display text-lg font-semibold text-white sm:text-xl">App Panel</h1>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/56">
                <CheckCircle2 className="h-4 w-4 text-emerald-200" aria-hidden="true" />
                Product screens online
              </div>
            </div>

            <div className="grid min-w-0 gap-0 lg:grid-cols-[290px_minmax(0,1fr)]">
              <aside className="min-w-0 border-b border-white/10 p-4 lg:border-b-0 lg:border-r lg:p-5">
                  <p className="kicker">Product explorer</p>
                  <p className="mt-3 text-sm leading-6 text-white/60">
                  Select an app to inspect its workflow, operating signals, and next step.
                  </p>

                <div className="mt-5 grid w-full min-w-0 max-w-full gap-3">
                  {projectScreens.map((screen) => (
                    <ProductRailButton
                      key={screen.slug}
                      screen={screen}
                      selected={screen.slug === active.slug}
                      onSelect={() => setActiveId(screen.slug)}
                    />
                  ))}
                </div>
              </aside>

              <div className="min-w-0 p-4 sm:p-5 lg:p-6">
                <motion.div
                  key={active.slug}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.32 }}
                  className="grid min-w-0 gap-5 xl:grid-cols-[minmax(240px,0.32fr)_minmax(0,0.68fr)]"
                >
                  <div className="flex min-w-0 flex-col justify-between gap-5">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={cn('rounded-md border px-3 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.14em]', toneStyles[active.tone].rail)}>
                          {active.eyebrow}
                        </span>
                        <span className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-white/48">
                          {active.status}
                        </span>
                      </div>
                      <h2 className="mt-5 max-w-3xl font-display text-2xl font-semibold leading-tight text-white md:text-3xl">
                        {active.title}
                      </h2>
                      <p className="mt-4 max-w-2xl text-sm leading-7 text-white/64 md:text-base">{active.summary}</p>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <Link
                          href={active.primary.href}
                          target={active.primary.external ? '_blank' : undefined}
                          rel={active.primary.external ? 'noreferrer' : undefined}
                          className="inline-flex items-center justify-center gap-2 rounded-md border border-white/14 bg-white px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-50"
                        >
                          {active.primary.label}
                          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                        <Link
                          href={active.secondary.href}
                          target={active.secondary.external ? '_blank' : undefined}
                          rel={active.secondary.external ? 'noreferrer' : undefined}
                          className="inline-flex items-center justify-center gap-2 rounded-md border border-white/16 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                        >
                          {active.secondary.label}
                          <ChevronRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
                      {active.metrics.map((metric) => (
                        <ProductMetricCard key={metric.label} metric={metric} tone={active.tone} />
                      ))}
                    </div>

                    <StageRail stages={active.stages} tone={active.tone} />
                  </div>

                  <div className="min-w-0">
                    <ProductScreenPreview active={active} />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="scene-panel mx-auto w-full max-w-[1480px] px-4 pb-12 pt-5 sm:px-6 lg:px-8"
        data-rot-y="0.72"
        data-cam-z="4.35"
        data-cam-y="0.08"
        data-cam-x="-0.06"
      >
        <div className="grid gap-4 md:grid-cols-3">
          {panelSummaryCards.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-lg border border-white/10 bg-black/30 p-4 backdrop-blur-sm">
                <Icon className="h-5 w-5 text-white/58" aria-hidden="true" />
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/42">{item.label}</p>
                <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
