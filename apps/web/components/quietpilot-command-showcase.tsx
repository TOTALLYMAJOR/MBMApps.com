import {
  AlertTriangle,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  FileText,
  Home,
  Inbox,
  Package,
  Plus,
  Search,
  Settings,
  Sparkles,
  Users
} from 'lucide-react';

const navSections = [
  {
    label: 'Work',
    items: [
      { label: 'Command Center', icon: Home, active: true },
      { label: 'Leads', icon: Inbox, count: '3' },
      { label: 'Quotes', icon: ClipboardList },
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
    items: [{ label: 'Settings', icon: Settings }]
  }
];

const actionQueue = [
  {
    tone: 'critical',
    label: 'Critical',
    title: 'Job Blocked: Smith Wedding Setup',
    detail: 'Missing 2 senior technicians. Job cannot proceed until staffed.',
    cta: 'Assign Staff'
  },
  {
    tone: 'due',
    label: 'Due Soon',
    title: 'Proposal Viewed: Tech Gala 2024',
    detail: 'Customer viewed the $12,450 proposal for the third time.',
    cta: 'Review Proposal'
  },
  {
    tone: 'info',
    label: 'Informational',
    title: 'Approval Needed: Corporate Retreat',
    detail: 'Quote exceeds standard discount limit by 5 percent.',
    cta: 'Review Quote'
  },
  {
    tone: 'due',
    label: 'Due Soon',
    title: 'Payment Overdue: Apex Brand Launch',
    detail: 'Invoice INV-0034 is overdue. Follow up before readiness slips.',
    cta: 'Send Reminder'
  }
] as const;

const metrics = [
  { label: 'New Leads', value: '12', note: 'This week', icon: Inbox },
  { label: 'Active Quotes', value: '8', note: 'Total $42k', icon: ClipboardList },
  { label: 'Proposals Out', value: '4', note: '2 viewed', icon: FileText },
  { label: 'Pending Payment', value: '$18.5k', note: '1 overdue', icon: CircleDollarSign }
];

const inquiries = [
  ['Sarah Jenkins', 'Premium package for outdoor event.', '2h ago'],
  ['Oasis Corp', 'Follow-up on previous corporate booking.', 'Yesterday'],
  ['Luxe Events Co.', 'Request for custom lighting and AV.', '2 days ago']
];

const jobs = [
  { name: 'Miller Anniversary', date: 'Oct 24, 10:00 AM', payment: true, staff: true, status: 'Ready' },
  { name: 'Apex Brand Launch', date: 'Oct 26, 2:00 PM', payment: true, staff: false, status: 'At Risk' },
  { name: 'Corporate Retreat', date: 'Oct 30, 9:00 AM', payment: true, staff: true, status: 'Ready' }
];

const actionTone = {
  critical: 'border-blue-500/45 bg-blue-500/10 text-blue-100',
  due: 'border-amber-400/45 bg-amber-400/10 text-amber-100',
  info: 'border-cyan-400/45 bg-cyan-400/10 text-cyan-100'
} satisfies Record<(typeof actionQueue)[number]['tone'], string>;

export function QuietPilotCommandShowcase() {
  return (
    <section
      className="scene-panel mx-auto w-full max-w-[1280px] px-4 py-14 sm:px-6 lg:px-8"
      data-rot-y="0.38"
      data-cam-z="4.15"
      data-cam-y="0.08"
      data-cam-x="-0.05"
      aria-labelledby="quietpilot-showcase-title"
    >
      <div className="mb-6 max-w-3xl">
        <p className="kicker">QuietPilot showcase</p>
        <h2 id="quietpilot-showcase-title" className="mt-4 font-display text-3xl font-semibold text-white md:text-5xl">
          A live command-center view for the work that decides revenue.
        </h2>
        <p className="mt-4 text-sm leading-7 text-white/70 md:text-base">
          The home page now previews the product surface directly: action queue, readiness risk, active quotes, proposals, and payment blockers in one operational frame.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-cyan-300/20 bg-[#030712] shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
        <div className="grid min-h-[690px] lg:grid-cols-[220px_1fr]">
          <aside className="hidden border-r border-white/10 bg-[#07101f] lg:flex lg:flex-col">
            <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-300/50 bg-cyan-300/10 text-cyan-200">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
              </div>
              <span className="text-sm font-semibold tracking-[0.08em] text-white">QUIETPILOT</span>
            </div>
            <div className="flex-1 space-y-6 px-3 py-5">
              {navSections.map((section) => (
                <div key={section.label}>
                  <p className="mb-2 px-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-400">{section.label}</p>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.label}
                          className={`flex items-center gap-3 rounded-md px-3 py-2 text-xs font-semibold ${
                            item.active
                              ? 'border border-cyan-300/30 bg-cyan-300/15 text-white shadow-[0_0_28px_rgba(34,211,238,0.12)]'
                              : 'text-slate-300'
                          }`}
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                          <span>{item.label}</span>
                          {item.count ? <span className="ml-auto rounded-full bg-cyan-300/15 px-2 text-cyan-100">{item.count}</span> : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="m-3 rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-100">
                <Bell className="h-4 w-4" aria-hidden="true" />
                QuietPilot AI
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">Review-only recommendations monitor workflow risk without mutating records.</p>
            </div>
          </aside>

          <div className="min-w-0 bg-[radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.16),transparent_30%),linear-gradient(180deg,#050b16_0%,#070b14_100%)]">
            <div className="flex h-16 items-center justify-between gap-4 border-b border-white/10 px-4 sm:px-6">
              <div className="text-sm font-semibold text-cyan-200">Work / <span className="text-slate-300">Command Center</span></div>
              <div className="hidden min-w-0 flex-1 justify-end gap-3 sm:flex">
                <div className="flex w-full max-w-xs items-center gap-2 rounded-md border border-white/10 bg-black/30 px-3 py-2 text-xs text-slate-400">
                  <Search className="h-4 w-4" aria-hidden="true" />
                  Search anything...
                </div>
                <button type="button" className="inline-flex items-center gap-2 rounded-md border border-cyan-300/40 bg-cyan-300/10 px-3 py-2 text-xs font-semibold text-white">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  New Quote
                </button>
              </div>
            </div>

            <div className="space-y-5 p-4 sm:p-6">
              <div>
                <h3 className="font-display text-2xl font-semibold text-white">Good morning. Here is your operational overview.</h3>
                <p className="mt-1 text-sm text-cyan-200">You have 3 items requiring immediate attention today.</p>
              </div>

              <div className="grid gap-4 rounded-xl border border-cyan-300/25 bg-[#071326]/90 p-4 shadow-[0_0_38px_rgba(14,165,233,0.09)] lg:grid-cols-[1fr_280px]">
                <div className="flex gap-4">
                  <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-full border border-blue-400/60 bg-blue-400/10 text-blue-200 sm:flex">
                    <Users className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase">
                      <span className="rounded bg-blue-500/15 px-2 py-1 text-blue-200">Blocked Job</span>
                      <span className="text-slate-400">Staffing gap detected</span>
                    </div>
                    <p className="mt-3 text-xl font-semibold text-white">Stabilize Smith Wedding</p>
                    <p className="mt-1 text-sm text-slate-300">Missing 2 senior technicians. Job cannot proceed until staffed.</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="rounded border border-white/10 px-2 py-1 text-slate-300">Today</span>
                      <span className="rounded border border-emerald-300/25 bg-emerald-300/10 px-2 py-1 text-emerald-100">Revenue Impact: $12,450</span>
                      <span className="rounded border border-orange-300/25 bg-orange-300/10 px-2 py-1 text-orange-100">Priority: High</span>
                    </div>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-slate-400">Readiness after action</p>
                  <p className="mt-2 text-3xl font-semibold text-white">82%</p>
                  <p className="text-xs text-slate-400">2 staff gaps</p>
                  <button type="button" className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-blue-300/35 bg-blue-500/45 px-3 py-2 text-xs font-semibold text-white">
                    Open staffing plan
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">Action Queue</p>
                  <span className="text-xs text-cyan-200">View all actions</span>
                </div>
                <div className="overflow-hidden rounded-lg border border-white/10">
                  {actionQueue.map((item) => (
                    <div key={item.title} className="grid gap-3 border-b border-white/10 bg-white/[0.03] p-3 last:border-b-0 md:grid-cols-[130px_1fr_auto] md:items-center">
                      <div className={`rounded-md border px-3 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.12em] ${actionTone[item.tone]}`}>
                        {item.label}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{item.title}</p>
                        <p className="mt-1 text-xs text-slate-400">{item.detail}</p>
                      </div>
                      <button type="button" className="rounded-md border border-cyan-300/35 bg-cyan-300/10 px-3 py-2 text-xs font-semibold text-white">
                        {item.cta}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-4">
                {metrics.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <div key={metric.label} className="rounded-lg border border-cyan-300/20 bg-[#071326]/80 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-cyan-200">{metric.label}</p>
                        <Icon className="h-4 w-4 text-slate-400" aria-hidden="true" />
                      </div>
                      <p className="mt-3 text-2xl font-semibold text-white">{metric.value}</p>
                      <p className="mt-1 text-xs text-emerald-200">{metric.note}</p>
                    </div>
                  );
                })}
              </div>

              <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-lg border border-white/10 bg-white/[0.03]">
                  <div className="border-b border-white/10 px-4 py-3 text-sm font-semibold text-white">Recent Inquiries</div>
                  <div className="divide-y divide-white/10">
                    {inquiries.map(([name, summary, time]) => (
                      <div key={name} className="flex items-center gap-3 px-4 py-3">
                        <span className="h-2 w-2 rounded-full bg-cyan-300" aria-hidden="true" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-100">{name}</p>
                          <p className="truncate text-xs text-slate-400">{summary}</p>
                        </div>
                        <span className="text-xs text-slate-500">{time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/[0.03]">
                  <div className="border-b border-white/10 px-4 py-3 text-sm font-semibold text-white">Upcoming Jobs Readiness</div>
                  <div className="min-w-full overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="text-slate-400">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Job Details</th>
                          <th className="px-3 py-3 font-semibold">Payment</th>
                          <th className="px-3 py-3 font-semibold">Staff</th>
                          <th className="px-4 py-3 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {jobs.map((job) => (
                          <tr key={job.name}>
                            <td className="px-4 py-3">
                              <p className="font-semibold text-slate-100">{job.name}</p>
                              <p className="text-slate-500">{job.date}</p>
                            </td>
                            <td className="px-3 py-3">
                              {job.payment ? <CheckCircle2 className="h-4 w-4 text-cyan-200" aria-label="Payment ready" /> : <AlertTriangle className="h-4 w-4 text-amber-300" aria-label="Payment blocked" />}
                            </td>
                            <td className="px-3 py-3">
                              {job.staff ? <CheckCircle2 className="h-4 w-4 text-cyan-200" aria-label="Staff ready" /> : <AlertTriangle className="h-4 w-4 text-amber-300" aria-label="Staff at risk" />}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`rounded px-2 py-1 text-[0.65rem] font-semibold uppercase ${job.status === 'Ready' ? 'bg-cyan-300/10 text-cyan-100' : 'bg-amber-300/10 text-amber-100'}`}>
                                {job.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
