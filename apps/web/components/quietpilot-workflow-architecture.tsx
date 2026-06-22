import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  CalendarPlus,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  FileCheck2,
  Inbox,
  Package,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { quietPilotWorkflowSteps, type QuietPilotWorkflowStepId } from '@/lib/quietpilot-marketing';

const workflowIcons: Record<QuietPilotWorkflowStepId, LucideIcon> = {
  'lead-intake': Inbox,
  'inventory-cogs': Package,
  'quote-versioning': ClipboardCheck,
  approval: ShieldCheck,
  'proposal-acceptance': FileCheck2,
  'payment-gate': CreditCard,
  'job-creation': CalendarPlus,
  'downstream-sync': RefreshCw
};

export function QuietPilotWorkflowArchitecture() {
  return (
    <section className="border-b border-indigo-100 bg-[#f7f8fc]">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[0.84fr_1.16fr] lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-400">Workflow architecture</p>
          <h2 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-tight text-indigo-950 md:text-5xl">
            The core engine for service businesses.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-indigo-700">
            A multi-tenant SaaS workflow that moves from inquiry to readiness while keeping commercial state explicit, auditable, and operator-owned.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/quietpilot/architecture"
              className="inline-flex items-center gap-2 rounded-md bg-indigo-950 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              View topology
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-indigo-100 bg-white p-5 shadow-sm">
          <div className="rounded-lg border border-indigo-50 bg-[radial-gradient(circle_at_1px_1px,rgba(99,102,241,0.16)_1px,transparent_0)] bg-[length:16px_16px] p-5">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-indigo-300">Workflow architecture</p>
            <ol className="relative space-y-4">
              <span className="absolute left-[1.22rem] top-7 h-[calc(100%-3.5rem)] w-px bg-indigo-100" aria-hidden="true" />
              {quietPilotWorkflowSteps.map((step, index) => {
                const Icon = workflowIcons[step.id];
                return (
                  <li key={step.id} className="relative grid grid-cols-[2.5rem_1fr] gap-4">
                    <div className="relative flex justify-center">
                      <span className="absolute left-[-0.35rem] top-4 h-2 w-2 rounded-full border border-indigo-200 bg-white" aria-hidden="true" />
                      <span className="z-10 flex h-10 w-10 items-center justify-center rounded-md border border-indigo-100 bg-white text-indigo-400 shadow-sm">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </div>
                    <div className="min-w-0 pb-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[0.68rem] font-semibold text-indigo-300">{String(index + 1).padStart(2, '0')}</span>
                        <h3 className="text-sm font-semibold text-indigo-950">{step.label}</h3>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-indigo-600">{step.summary}</p>
                      <p className="mt-1 text-xs font-medium text-cyan-700">{step.signal}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
