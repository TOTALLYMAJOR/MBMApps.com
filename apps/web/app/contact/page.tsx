import Link from 'next/link';
import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact-form';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Start a discovery call with MBMApps to scope your web platform and growth roadmap.'
};

export default function ContactPage() {
  const schedulingUrl = process.env.NEXT_PUBLIC_SCHEDULING_URL ?? 'https://calendly.com/mbmapps/discovery-call';

  return (
    <div className="pb-20">
      <section className="hero-mesh relative overflow-hidden border-b border-white/10">
        <div className="ambient-grid pointer-events-none absolute inset-0 opacity-50" />
        <div className="mx-auto w-full max-w-6xl px-6 pb-14 pt-16 lg:px-8 lg:pt-20">
          <p className="kicker">Let&apos;s Build</p>
          <h1 className="mt-3 max-w-4xl font-display text-5xl text-white md:text-6xl">Tell us what outcome you need next.</h1>
          <p className="text-mbm-muted mt-4 max-w-3xl text-lg leading-8">
            Share your goals and constraints. We reply with a scoped technical approach, architecture recommendation, and realistic timeline to launch.
          </p>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[1.08fr_1fr] lg:px-8">
        <section className="space-y-6">
          <div className="surface-card p-5 text-sm text-white/85">
            <p className="font-semibold text-white">Prefer booking directly?</p>
            <p className="text-mbm-muted mt-2">Use our scheduling link to reserve a discovery call.</p>
            <Link href={schedulingUrl} className="btn-theme mt-4">
              Book Call
            </Link>
          </div>

          <div className="surface-panel p-5">
            <p className="kicker text-white/70">What You Receive</p>
            <div className="mt-4 space-y-3 text-sm text-white/90">
              {[
                'A focused architecture recommendation based on your context',
                'Suggested delivery phases with risk-aware scope boundaries',
                'An implementation path across product, infrastructure, and operations'
              ].map((item) => (
                <p key={item} className="surface-card px-4 py-3">
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-electric/30 bg-electric/10 p-5">
            <p className="kicker text-white/80">Response Commitment</p>
            <p className="mt-2 text-sm leading-6 text-white/90">
              MBMApps reviews submissions quickly and responds with practical next steps, not generic discovery scripts.
            </p>
          </div>
        </section>

        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
