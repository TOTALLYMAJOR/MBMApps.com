import type { Metadata } from 'next';
import { ArrowRight, CheckCircle2, ClipboardCheck, Lock, Package, ShieldCheck, Users } from 'lucide-react';
import { QuietPilotCommandPreview } from '@/components/quietpilot-command-preview';
import { TrackedLink } from '@/components/tracked-link';
import { quietPilotProduct, siteConfig } from '@/lib/site';

const pageTitle = 'QuietPilot Service Operations Command Center';
const pageDescription =
  'QuietPilot is the MBMApps flagship product for service businesses that need a calm command center for leads, quotes, proposals, staffing, inventory, jobs, and payments.';

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: quietPilotProduct.path
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: `${siteConfig.url}${quietPilotProduct.path}`,
    siteName: siteConfig.name,
    type: 'website'
  }
};

const outcomes = [
  {
    title: 'Lead intake stays actionable',
    summary: 'New inquiries, missing details, and high-intent signals surface where operators already work.',
    icon: Users
  },
  {
    title: 'Quotes stay controlled',
    summary: 'Pricing, discounts, approvals, and proposal follow-up stay visible before commercial risk compounds.',
    icon: ClipboardCheck
  },
  {
    title: 'Jobs expose readiness early',
    summary: 'Staffing, payment, inventory, and schedule gaps are easy to scan before the day turns urgent.',
    icon: Package
  }
];

const confidencePoints = [
  'Tenant-aware workflows that keep customer and operator context explicit.',
  'Immutable quote snapshots so historical pricing is not silently rewritten.',
  'Auditable proposal acceptance paths for binding commercial records.',
  'Thin integrations that support operations without becoming the source of truth.'
];

export default function QuietPilotPage() {
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: quietPilotProduct.name,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: quietPilotProduct.description,
    url: `${siteConfig.url}${quietPilotProduct.path}`,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.legalName,
      url: siteConfig.url
    }
  };

  return (
    <main className="bg-[#f7f8fc] text-zinc-950">
      <section className="relative overflow-hidden border-b border-indigo-100">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(14,165,233,0.18),transparent_34%),linear-gradient(180deg,#ffffff_0%,#f7f8fc_88%)]" />
        <div className="relative mx-auto w-full max-w-[1360px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid w-full gap-8 xl:grid-cols-[minmax(280px,0.78fr)_minmax(0,1.22fr)] xl:items-center xl:gap-10">
            <div>
              <p className="text-xs font-semibold uppercase text-indigo-500">QuietPilot by MBMApps</p>
              <h1 className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-tight text-indigo-950 md:text-4xl xl:text-5xl">
                The service-operations command center from lead intake to job readiness.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-indigo-700">
                QuietPilot gives service operators one calm place to watch leads, quotes, proposals, staffing, inventory, jobs, and payment risk without turning the business into a spreadsheet chase.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <TrackedLink
                  href={quietPilotProduct.appUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-indigo-950 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-800"
                  trackingEvent="quietpilot_opened"
                  trackingMetadata={{ surface: 'quietpilot-hero', target: 'quietpilot-app' }}
                >
                  Open QuietPilot
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </TrackedLink>
                <TrackedLink
                  href={quietPilotProduct.demoPath}
                  className="inline-flex items-center gap-2 rounded-md border border-indigo-200 bg-white px-4 py-3 text-sm font-semibold text-indigo-950 shadow-sm transition hover:bg-indigo-50"
                  trackingEvent="cta_clicked"
                  trackingMetadata={{ surface: 'quietpilot-hero', target: 'demo' }}
                >
                  View Demo
                </TrackedLink>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ['Actionable', 'operator queue'],
                  ['Auditable', 'proposal flow'],
                  ['Connected', 'job readiness']
                ].map(([value, label]) => (
                  <div key={value} className="rounded-lg border border-indigo-100 bg-white/75 p-3 shadow-sm">
                    <p className="text-sm font-semibold text-indigo-950">{value}</p>
                    <p className="mt-1 text-xs text-indigo-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="min-w-0 xl:justify-self-end">
              <QuietPilotCommandPreview className="mx-auto w-full max-w-[860px]" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-4 px-6 py-12 md:grid-cols-3 lg:px-8">
        {outcomes.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="rounded-lg border border-indigo-100 bg-white p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-950 text-white">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-indigo-950">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-indigo-600">{item.summary}</p>
            </article>
          );
        })}
      </section>

      <section className="border-y border-indigo-100 bg-white">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="mt-5 font-display text-3xl font-semibold text-indigo-950">Built for commercial confidence.</h2>
            <p className="mt-4 text-sm leading-7 text-indigo-600">
              QuietPilot is marketed here, but operational and commercial state stays inside the product. MBMApps.com remains the public sales surface for the platform.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {confidencePoints.map((point) => (
              <div key={point} className="flex gap-3 rounded-lg border border-indigo-100 bg-[#fafafa] p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan-600" aria-hidden="true" />
                <p className="text-sm leading-6 text-indigo-700">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-12 lg:px-8">
        <div className="grid gap-6 rounded-lg border border-indigo-100 bg-indigo-950 p-6 text-white shadow-xl shadow-indigo-950/10 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-cyan-200">
              <Lock className="h-4 w-4" aria-hidden="true" />
              Flagship product
            </div>
            <h2 className="mt-3 font-display text-3xl font-semibold">See QuietPilot from the operator seat.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-indigo-100">
              Start with the live app or review the demo environment to understand the operating model before a sales conversation.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <TrackedLink
              href={quietPilotProduct.appUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-semibold text-indigo-950 transition hover:bg-cyan-50"
              trackingEvent="quietpilot_opened"
              trackingMetadata={{ surface: 'quietpilot-footer-cta', target: 'quietpilot-app' }}
            >
              Open App
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </TrackedLink>
            <TrackedLink
              href="/contact"
              className="inline-flex items-center rounded-md border border-white/20 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              trackingEvent="cta_clicked"
              trackingMetadata={{ surface: 'quietpilot-footer-cta', target: 'contact' }}
            >
              Contact MBMApps
            </TrackedLink>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
    </main>
  );
}
