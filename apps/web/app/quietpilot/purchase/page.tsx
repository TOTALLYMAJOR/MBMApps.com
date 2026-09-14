import type { Metadata } from 'next';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { CheckCircle2, CreditCard, LockKeyhole, ShieldCheck } from 'lucide-react';
import { QuietPilotPurchaseForm } from './purchase-form';
import { quietPilotProduct, siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Purchase QuietPilot',
  description: 'Start a QuietPilot purchase through MBMApps and activate a new organization after Stripe payment.',
  alternates: {
    canonical: `${quietPilotProduct.purchasePath}`
  },
  openGraph: {
    title: 'Purchase QuietPilot',
    description: 'Start a QuietPilot purchase through MBMApps and activate a new organization after Stripe payment.',
    url: `${siteConfig.url}${quietPilotProduct.purchasePath}`,
    siteName: siteConfig.name,
    type: 'website'
  }
};

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

const purchaseFlowSteps: Array<{ label: string; icon: LucideIcon }> = [
  { label: 'Stripe Checkout', icon: CreditCard },
  { label: 'Secret webhook', icon: ShieldCheck },
  { label: 'Org activation', icon: LockKeyhole }
];

export default async function QuietPilotPurchasePage({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : {};
  const checkoutState = firstParam(params.checkout);

  return (
    <main className="terminal-purchase min-h-screen bg-[#f7f8fc] text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase text-cyan-700">QuietPilot by MBMApps</p>
            <h1 className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-tight text-slate-950 md:text-5xl">
              Purchase QuietPilot and issue a new operator organization.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
              Payment is handled by Stripe. Once Stripe confirms the checkout is paid, MBMApps sends the activation request to QuietPilot.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={quietPilotProduct.path}
                className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:border-cyan-500 hover:text-cyan-800"
              >
                Back to QuietPilot
              </Link>
              <Link
                href={quietPilotProduct.appUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-md border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-cyan-500 hover:text-cyan-800"
              >
                Open existing org
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-[#f7f8fc] p-5 shadow-sm">
            <div className="grid gap-3 sm:grid-cols-3">
              {purchaseFlowSteps.map(({ label, icon: Icon }) => (
                <div key={label} className="rounded-md border border-slate-200 bg-white p-4">
                  <Icon className="h-5 w-5 text-cyan-700" aria-hidden="true" />
                  <p className="mt-3 text-sm font-semibold text-slate-800">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[0.78fr_1.22fr] lg:px-8">
        <aside className="space-y-4">
          {checkoutState === 'success' ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Payment received
              </div>
              <p className="mt-2 leading-6">QuietPilot provisioning has started for this purchase.</p>
            </div>
          ) : null}

          {checkoutState === 'cancelled' ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
              Checkout was cancelled. No payment was captured.
            </div>
          ) : null}

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Activation handoff</h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              {[
                'Buyer details become Stripe Checkout metadata.',
                'The Stripe webhook verifies the paid Checkout Session.',
                'QuietPilot receives the tenant activation request with verified payment evidence.'
              ].map((item) => (
                <p key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-cyan-700" aria-hidden="true" />
                  <span>{item}</span>
                </p>
              ))}
            </div>
          </div>
        </aside>

        <QuietPilotPurchaseForm />
      </section>
    </main>
  );
}
