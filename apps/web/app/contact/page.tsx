import type { Metadata } from 'next';
import { ArrowUpRight, Check } from 'lucide-react';
import { ContactForm } from '@/components/contact-form';
import { NorthstarPageHero } from '@/components/northstar-page-hero';
import { TrackedLink } from '@/components/tracked-link';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Start a discovery call with MBMApps to scope your web platform and growth roadmap.'
};

export default function ContactPage() {
  const schedulingUrl = process.env.NEXT_PUBLIC_SCHEDULING_URL ?? 'https://calendly.com/mbmapps/discovery-call';

  return (
    <div className="pb-20">
      <NorthstarPageHero
        eyebrow="Start a conversation"
        title="Tell us what needs to work better."
        description="Share the outcome, the constraint, and what is already in motion. We’ll respond with a scoped technical approach, an architecture recommendation, and a realistic path to launch."
        signal="INTAKE / OPEN"
        actions={(
          <TrackedLink
            href={schedulingUrl}
            className="storefront-hero-button storefront-hero-button--primary"
            trackingEvent="scheduling_started"
            trackingMetadata={{ surface: 'contact-page', target: 'discovery-call' }}
          >
            Book a discovery call <ArrowUpRight className="h-4 w-4" />
          </TrackedLink>
        )}
        aside={(
          <div>
            <p className="font-display text-3xl font-light tracking-[-0.04em] text-white">Practical next steps, not a generic discovery script.</p>
            <p className="mt-4 text-sm leading-7 text-white/48">MBMApps reviews the operating context before recommending scope.</p>
          </div>
        )}
      />

      <div className="northstar-section northstar-container grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <section className="space-y-4 lg:sticky lg:top-28">
          <div className="northstar-card p-6 md:p-8">
            <p className="northstar-kicker">What you receive</p>
            <div className="northstar-rule-list mt-6 text-sm text-white/76">
              {[
                'A focused architecture recommendation based on your context',
                'Suggested delivery phases with risk-aware scope boundaries',
                'An implementation path across product, infrastructure, and operations'
              ].map((item) => (
                <p key={item} className="flex gap-3 py-4 leading-6">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-indigo-300" aria-hidden="true" />{item}
                </p>
              ))}
            </div>
          </div>

          <div className="northstar-card p-6 md:p-8">
            <p className="northstar-kicker">Useful context</p>
            <p className="mt-4 text-sm leading-7 text-white/52">Budget range, timeline, current tools, and the cost of the present workflow help us shape a credible first response.</p>
            <p className="mt-6 font-mono text-xs text-indigo-200/70">Chicago, IL · Remote delivery</p>
          </div>
        </section>

        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
