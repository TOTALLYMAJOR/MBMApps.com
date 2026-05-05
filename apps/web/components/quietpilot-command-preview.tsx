'use client';

import { useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Bell,
  CalendarDays,
  Calculator,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  DollarSign,
  Eye,
  FileText,
  Home,
  Inbox,
  Menu,
  Package,
  PlusCircle,
  Radar,
  Route,
  Search,
  Settings,
  Sparkles,
  Users,
  XCircle,
  Zap
} from 'lucide-react';
import { trackEvent } from '@/lib/telemetry';
import { cn } from '@/lib/utils';

type PreviewNavItem = {
  label: string;
  icon: LucideIcon;
  active?: boolean;
  count?: string;
};

type ActionItem = {
  tone: 'critical' | 'warm' | 'review';
  label: string;
  title: string;
  meta?: string;
  detail: string;
  primary: string;
  secondary: string;
  icon: LucideIcon;
};

const navGroups: { label: string; items: PreviewNavItem[] }[] = [
  {
    label: 'Work',
    items: [
      { label: 'Command Center', icon: Home, active: true },
      { label: 'Leads', icon: Inbox, count: '3' },
      { label: 'Quotes', icon: Calculator },
      { label: 'Proposals', icon: FileText }
    ]
  },
  {
    label: 'Operations',
    items: [
      { label: 'Jobs Board', icon: CalendarDays },
      { label: 'Staff', icon: Users },
      { label: 'Inventory', icon: Package }
    ]
  },
  {
    label: 'System',
    items: [
      { label: 'Analytics', icon: BarChart3 },
      { label: 'Settings', icon: Settings }
    ]
  }
];

const filters = ['Urgent', 'Blocked Jobs', 'Overdue Payments', 'High-Value Quotes', 'New Leads'];

const actions: ActionItem[] = [
  {
    tone: 'critical',
    label: 'Critical',
    title: 'Job Blocked: Smith Wedding Setup',
    meta: 'In 2 days',
    detail: 'Missing 2 senior technicians. Job cannot proceed until staffed.',
    primary: 'Assign Staff',
    secondary: 'View Job',
    icon: AlertCircle
  },
  {
    tone: 'warm',
    label: 'Due Soon',
    title: 'Proposal Viewed: Tech Gala',
    meta: '10 mins ago',
    detail: 'Customer viewed the $12,450 proposal for the third time.',
    primary: 'Review Proposal',
    secondary: 'Dismiss',
    icon: Eye
  },
  {
    tone: 'review',
    label: 'Informational',
    title: 'Approval Needed: Corporate Retreat',
    detail: 'Quote exceeds the standard discount limit by 5 percent.',
    primary: 'Review Quote',
    secondary: 'Dismiss',
    icon: ClipboardCheck
  }
];

const metrics = [
  { label: 'New Leads', value: '12', detail: 'This week', icon: Inbox },
  { label: 'Active Quotes', value: '8', detail: 'Total $42k', icon: Calculator },
  { label: 'Proposals Out', value: '4', detail: '2 viewed', icon: FileText },
  { label: 'Pending Payment', value: '$18.5k', detail: '1 overdue', icon: DollarSign, urgent: true }
];

const inquiries = [
  {
    name: 'Sarah Jenkins',
    time: '2h ago',
    summary: 'Inquiry: Premium package for outdoor event.',
    status: 'New',
    note: 'High intent, missing date',
    unread: true
  },
  {
    name: 'Oasis Corp',
    time: 'Yesterday',
    summary: 'Follow up on previous corporate booking.',
    status: 'Needs Info'
  },
  {
    name: 'Elena Rossi',
    time: 'Oct 12',
    summary: 'Requested custom quote for photography.',
    status: 'Quote Started'
  }
];

const jobs = [
  { name: 'Miller Anniversary', date: 'Oct 24, 10:00 AM', payment: 'ready', staff: 'ready', status: 'Ready' },
  { name: 'Apex Brand Launch', date: 'Oct 26, 2:00 PM', payment: 'pending', staff: 'ready', status: 'Not Ready' },
  { name: 'Smith Wedding', date: 'Oct 28, 8:00 AM', payment: 'ready', staff: 'blocked', status: 'Blocked' }
] as const;

const pulses = [
  {
    label: 'Today',
    title: 'Stabilize Smith Wedding',
    insight: 'Assign two senior technicians before noon and the blocked job moves from critical to ready.',
    metric: '82%',
    metricLabel: 'readiness after action',
    chip: '2 staff gaps',
    icon: Zap
  },
  {
    label: 'Revenue',
    title: 'Follow the warm proposal',
    insight: 'Tech Gala has three views in ten minutes. A personal note now can accelerate acceptance.',
    metric: '$12.4k',
    metricLabel: 'proposal in motion',
    chip: 'high intent',
    icon: BarChart3
  },
  {
    label: 'Automation',
    title: 'Let QuietPilot draft the chase',
    insight: 'Generate a concise payment reminder and staffing request without leaving command center.',
    metric: '6 min',
    metricLabel: 'estimated time saved',
    chip: 'ready to draft',
    icon: Sparkles
  }
];

const toneClasses = {
  critical: {
    border: 'border-blue-200 hover:border-blue-300',
    stripe: 'bg-blue-600',
    badge: 'border-blue-200 bg-blue-100 text-blue-800',
    icon: 'bg-blue-50 text-blue-700'
  },
  warm: {
    border: 'border-sky-200 hover:border-sky-300',
    stripe: 'bg-sky-500',
    badge: 'border-sky-200 bg-sky-50 text-sky-700',
    icon: 'bg-sky-50 text-sky-600'
  },
  review: {
    border: 'border-indigo-200 hover:border-indigo-300',
    stripe: 'bg-indigo-300',
    badge: 'border-indigo-200 bg-indigo-50 text-indigo-700',
    icon: 'bg-indigo-100 text-indigo-600'
  }
} satisfies Record<ActionItem['tone'], Record<string, string>>;

function SidebarNav() {
  return (
    <aside className="hidden w-48 shrink-0 flex-col border-r border-indigo-200 bg-white md:flex 2xl:w-52">
      <div className="flex h-12 shrink-0 items-center border-b border-indigo-100 px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-950 text-white">
            <Route className="h-4 w-4" aria-hidden="true" />
          </div>
          <span className="text-xs font-semibold text-indigo-950 2xl:text-sm">QUIETPILOT</span>
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-2.5 py-3">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-2.5 text-[11px] font-medium uppercase text-indigo-400">{group.label}</p>
            <nav className="space-y-1" aria-label={group.label}>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href="#preview"
                    className={cn(
                      'flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors',
                      item.active ? 'bg-indigo-100 text-indigo-950' : 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-950'
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span>{item.label}</span>
                    {item.count ? <span className="ml-auto rounded-full bg-sky-50 px-2 py-0.5 text-xs text-sky-600">{item.count}</span> : null}
                  </a>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className="border-t border-indigo-100 p-3">
        <div className="flex items-center gap-3 rounded-md p-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-indigo-300 bg-indigo-200 text-xs font-medium text-indigo-700">OM</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-indigo-950">Operator Mode</p>
            <p className="truncate text-xs text-indigo-500">Service business HQ</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function PilotPulse() {
  const [active, setActive] = useState(0);
  const pulse = pulses[active] ?? pulses[0]!;
  const PulseIcon = pulse.icon;
  const actionText = useMemo(() => (active === 0 ? 'Open staffing plan' : active === 1 ? 'Draft follow-up' : 'Create automations'), [active]);
  const pulseEvent = active === 1 ? 'proposal_viewed' : active === 2 ? 'quote_interest' : 'dashboard_drilldown_viewed';

  return (
    <section className="relative overflow-hidden rounded-lg border border-indigo-200 bg-white/85 shadow-sm backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-indigo-100/80 to-transparent" />
      <div className="relative grid gap-3 p-3 2xl:grid-cols-[1.35fr_0.65fr] 2xl:items-center">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500" />
              </span>
              Pilot Pulse
            </span>
            <span className="text-xs text-indigo-400">Live operator focus</span>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-950 text-white shadow-sm">
              <PulseIcon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-indigo-950 2xl:text-lg">{pulse.title}</h2>
              <p className="mt-1 max-w-2xl text-[13px] leading-5 text-indigo-600 2xl:text-sm 2xl:leading-6">{pulse.insight}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {pulses.map((item, index) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setActive(index);
                  void trackEvent(index === 1 ? 'proposal_viewed' : index === 2 ? 'quote_interest' : 'dashboard_drilldown_viewed', '/quietpilot', {
                    surface: 'quietpilot-preview',
                    pulse: item.label,
                    title: item.title
                  });
                }}
                aria-pressed={active === index}
                className={cn(
                  'rounded-md border px-3 py-1.5 text-xs font-medium transition-colors',
                  active === index ? 'border-indigo-950 bg-indigo-950 text-white shadow-sm' : 'border-indigo-200 bg-white text-indigo-600 hover:bg-indigo-50 hover:text-indigo-950'
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-indigo-200 bg-white/75 p-3 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase text-indigo-400">{pulse.chip}</p>
              <p className="mt-1 text-2xl font-semibold text-indigo-950">{pulse.metric}</p>
              <p className="text-xs text-indigo-500">{pulse.metricLabel}</p>
            </div>
            <div className="relative h-14 w-14 rounded-full bg-indigo-100 p-1 2xl:h-16 2xl:w-16">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-indigo-950">
                <Radar className="h-7 w-7" aria-hidden="true" />
              </div>
              <div className="absolute inset-0 animate-spin rounded-full border-2 border-sky-400/70 border-t-transparent" />
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              void trackEvent(pulseEvent, '/quietpilot', {
                surface: 'quietpilot-preview',
                action: actionText,
                pulse: pulse.label,
                title: pulse.title
              });
            }}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-indigo-950 px-3 py-2 text-[13px] font-medium text-white shadow-sm transition-colors hover:bg-indigo-800 2xl:text-sm"
          >
            {actionText}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}

function ActionQueue() {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-indigo-950">
          <Bell className="h-4 w-4 text-indigo-500" aria-hidden="true" />
          Action Queue
        </h2>
      </div>
      <div className="flex flex-col gap-2.5">
        {actions.map((item) => {
          const Icon = item.icon;
          const classes = toneClasses[item.tone];
          return (
            <article
              key={item.title}
              className={cn('relative overflow-hidden rounded-lg border bg-white p-3 shadow-sm transition-colors', classes.border)}
            >
              <div className={cn('absolute bottom-0 left-0 top-0 w-1', classes.stripe)} />
              <div className="flex flex-col gap-3 pl-2 2xl:flex-row 2xl:items-center 2xl:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <div className={cn('mt-0.5 shrink-0 rounded-md p-1.5', classes.icon)}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={cn('rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase', classes.badge)}>{item.label}</span>
                      <h3 className="truncate font-medium text-indigo-950">{item.title}</h3>
                      {item.meta ? <span className="text-xs font-medium text-indigo-400">{item.meta}</span> : null}
                    </div>
                    <p className="mt-1 text-[13px] leading-5 text-indigo-500 2xl:text-sm">{item.detail}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      void trackEvent(item.title.includes('Proposal') ? 'proposal_viewed' : item.title.includes('Quote') ? 'quote_interest' : 'dashboard_drilldown_viewed', '/quietpilot', {
                        surface: 'quietpilot-action-queue',
                        action: item.primary,
                        queue_item: item.title,
                        tone: item.tone
                      });
                    }}
                    className="rounded-md bg-indigo-950 px-3 py-1.5 text-[13px] font-medium text-white shadow-sm transition-colors hover:bg-indigo-800 2xl:text-sm"
                  >
                    {item.primary}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      void trackEvent('dashboard_drilldown_viewed', '/quietpilot', {
                        surface: 'quietpilot-action-queue',
                        action: item.secondary,
                        queue_item: item.title,
                        tone: item.tone
                      });
                    }}
                    className="rounded-md px-2 py-1.5 text-[13px] font-medium text-indigo-400 transition-colors hover:bg-indigo-50 hover:text-indigo-700 2xl:text-sm"
                  >
                    {item.secondary}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function StatusPill({ status }: { status: (typeof jobs)[number]['status'] }) {
  const isReady = status === 'Ready';
  const isBlocked = status === 'Blocked';
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-md border px-2 py-1 text-[10px] font-medium uppercase',
        isReady && 'border-cyan-200 bg-cyan-50 text-cyan-700',
        isBlocked && 'border-blue-200 bg-blue-100/60 text-blue-800',
        !isReady && !isBlocked && 'border-indigo-200 bg-indigo-100 text-indigo-700'
      )}
    >
      {status}
    </span>
  );
}

function ReadinessIcon({ state }: { state: 'ready' | 'pending' | 'blocked' }) {
  if (state === 'ready') {
    return (
      <div className="flex h-7 w-7 items-center justify-center rounded-full border border-cyan-100 bg-cyan-50 text-cyan-600" title="Ready">
        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
      </div>
    );
  }

  if (state === 'blocked') {
    return (
      <div className="flex h-7 w-7 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-600" title="Blocked">
        <XCircle className="h-4 w-4" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-indigo-200 bg-indigo-100 text-indigo-500" title="Pending">
      <Clock3 className="h-4 w-4" aria-hidden="true" />
    </div>
  );
}

export function QuietPilotCommandPreview({ className }: { className?: string }) {
  return (
    <section
      id="preview"
      aria-label="QuietPilot command center preview"
      className={cn(
        'h-[clamp(520px,calc(100svh-8rem),720px)] overflow-hidden rounded-lg border border-indigo-200 bg-[#fafafa] text-[13px] text-zinc-900 shadow-2xl shadow-indigo-950/10 2xl:text-sm',
        className
      )}
    >
      <div className="flex h-full min-h-0 flex-col md:flex-row">
        <SidebarNav />

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className="flex h-12 shrink-0 items-center justify-between border-b border-indigo-200 bg-white px-4 md:hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-950 text-white">
              <Route className="h-4 w-4" aria-hidden="true" />
            </div>
            <button type="button" className="rounded-md p-2 text-indigo-500 hover:bg-indigo-50" aria-label="Open navigation">
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </header>

          <header className="hidden h-12 shrink-0 items-center justify-between border-b border-indigo-200/80 bg-white/70 px-4 backdrop-blur-md md:flex 2xl:px-6">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-indigo-500">Work</span>
              <span className="text-indigo-300">/</span>
              <span className="font-medium text-indigo-950">Command Center</span>
            </div>
            <div className="flex items-center gap-2 2xl:gap-3">
              <div className="relative block" aria-hidden="true">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-400" aria-hidden="true" />
                <span className="block w-44 rounded-md border border-transparent bg-indigo-100/60 py-1.5 pl-8 pr-3 text-[13px] text-indigo-400 xl:w-52 2xl:w-64 2xl:text-sm">Search anything...</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  void trackEvent('quote_interest', '/quietpilot', {
                    surface: 'quietpilot-preview-header',
                    action: 'new_quote'
                  });
                }}
                className="flex items-center gap-2 rounded-md bg-indigo-950 px-3 py-1.5 text-[13px] font-medium text-white shadow-sm transition-colors hover:bg-indigo-800 2xl:text-sm"
              >
                <PlusCircle className="h-4 w-4" aria-hidden="true" />
                New Quote
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-6xl space-y-4 p-3 2xl:p-4">
              <div>
                <p className="text-lg font-semibold text-indigo-950 2xl:text-xl">Good morning. Here is your operational overview.</p>
                <p className="mt-1 text-indigo-500">You have 3 items requiring immediate attention today.</p>
              </div>

              <section className="rounded-lg border border-indigo-200 bg-white/85 p-3 shadow-sm backdrop-blur-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="mr-1 text-xs font-medium uppercase text-indigo-400">Filters</span>
                  {filters.map((filter, index) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => {
                        void trackEvent('filter_used', '/quietpilot', {
                          surface: 'quietpilot-preview',
                          filter,
                          default_active: index === 0
                        });
                      }}
                      className={cn(
                        'rounded-md border px-3 py-1.5 text-xs font-medium transition-colors',
                        index === 0
                          ? 'border-indigo-950 bg-indigo-950 text-white shadow-sm hover:bg-indigo-800'
                          : 'border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50'
                      )}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </section>

              <PilotPulse />
              <ActionQueue />

              <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {metrics.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article key={item.label} className="flex min-h-28 flex-col justify-between rounded-lg border border-indigo-200 bg-white p-3 shadow-sm">
                      <div className="mb-2 flex items-center justify-between text-indigo-500">
                        <span className="text-xs font-medium uppercase">{item.label}</span>
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-2xl font-semibold text-indigo-950">{item.value}</span>
                        <span className={cn('text-xs', item.urgent ? 'font-medium text-blue-600' : 'text-indigo-400')}>{item.detail}</span>
                      </div>
                    </article>
                  );
                })}
              </section>

              <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
                <section className="flex h-full flex-col">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-indigo-950">Recent Inquiries</h2>
                    <a href="#preview" className="inline-flex items-center gap-1 text-xs font-medium text-indigo-500 transition-colors hover:text-indigo-950">
                      View All Leads
                      <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>
                  <div className="flex-1 overflow-hidden rounded-lg border border-indigo-200 bg-white shadow-sm">
                    <div className="divide-y divide-indigo-100">
                      {inquiries.map((lead) => (
                        <article key={lead.name} className="flex items-start gap-3 p-3 transition-colors hover:bg-indigo-50/50">
                          <div className={cn('mt-2 h-2 w-2 shrink-0 rounded-full', lead.unread ? 'bg-sky-500' : 'border border-indigo-300 bg-transparent')} />
                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex items-center justify-between gap-3">
                              <h3 className="truncate font-medium text-indigo-950">{lead.name}</h3>
                              <span className="shrink-0 text-xs text-indigo-400">{lead.time}</span>
                            </div>
                            <p className="truncate text-sm text-indigo-600">{lead.summary}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <span className="rounded border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium uppercase text-indigo-700">{lead.status}</span>
                              {lead.note ? (
                                <span className="flex items-center gap-1 rounded border border-indigo-200/70 bg-indigo-100/60 px-2 py-0.5 text-xs text-indigo-500">
                                  <Sparkles className="h-3 w-3 text-indigo-400" aria-hidden="true" />
                                  {lead.note}
                                </span>
                              ) : null}
                            </div>
                          </div>
                          <button type="button" className="shrink-0 rounded-md p-1 text-indigo-400 transition-colors hover:bg-indigo-50 hover:text-indigo-950" aria-label={`Open ${lead.name}`}>
                            <ChevronRight className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </article>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="flex h-full flex-col">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-indigo-950">Upcoming Jobs Readiness</h2>
                    <a href="#preview" className="inline-flex items-center gap-1 text-xs font-medium text-indigo-500 transition-colors hover:text-indigo-950">
                      View Board
                      <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>

                  <div className="flex-1 overflow-hidden rounded-lg border border-indigo-200 bg-white p-1 shadow-sm">
                    <div className="hidden grid-cols-12 gap-3 border-b border-indigo-100 p-2 text-xs font-medium uppercase text-indigo-400 sm:grid">
                      <div className="col-span-5">Job Details</div>
                      <div className="col-span-2 text-center">Payment</div>
                      <div className="col-span-2 text-center">Staff</div>
                      <div className="col-span-3 text-right">Status</div>
                    </div>
                    <div className="divide-y divide-indigo-50">
                      {jobs.map((job) => (
                        <article key={job.name} className={cn('grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 rounded-md p-2 transition-colors hover:bg-indigo-50/50 sm:grid-cols-12', job.status === 'Blocked' && 'bg-blue-50/40')}>
                          <div className="min-w-0 sm:col-span-5">
                            <p className="truncate font-medium text-indigo-950">{job.name}</p>
                            <p className="text-xs text-indigo-500">{job.date}</p>
                          </div>
                          <div className="flex justify-center sm:col-span-2">
                            <ReadinessIcon state={job.payment} />
                          </div>
                          <div className="flex justify-center sm:col-span-2">
                            <ReadinessIcon state={job.staff} />
                          </div>
                          <div className="flex justify-end sm:col-span-3">
                            <StatusPill status={job.status} />
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </section>
              </div>

              <div className="h-2" />
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
