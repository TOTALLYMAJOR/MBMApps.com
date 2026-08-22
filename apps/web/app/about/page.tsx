import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { NorthstarPageHero } from '@/components/northstar-page-hero';

export const metadata: Metadata = {
  title: 'About',
  description: 'MBMApps helps teams launch high-quality web platforms with confidence and speed.'
};

export default function AboutPage() {
  return (
    <div className="pb-20">
      <NorthstarPageHero
        eyebrow="About MBMApps"
        title="A product company with an operator’s point of view."
        description="MBMApps builds focused software products and helps ambitious teams turn complex operating work into clear, durable systems. Product thinking, modern cloud architecture, and disciplined delivery stay in the same room."
        signal="CHI / US"
        actions={<Link href="/contact" className="storefront-hero-button storefront-hero-button--primary">Work with MBMApps <ArrowUpRight className="h-4 w-4" /></Link>}
        aside={(
          <div>
            <p className="font-display text-3xl font-light tracking-[-0.04em] text-white">Build capability, not dependency.</p>
            <p className="mt-4 text-sm leading-7 text-white/50">Architecture decisions remain visible, releases remain explainable, and teams leave with systems they can operate.</p>
          </div>
        )}
      />

      <section className="northstar-section northstar-container grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="northstar-kicker">Our posture</p>
          <h2 className="northstar-section-heading mt-4">Quality is an operating choice.</h2>
        </div>
        <div className="northstar-rule-list border-y border-white/10">
          {[
            ['01', 'Reliability', 'Production readiness through typed contracts, observability, and robust release workflows.'],
            ['02', 'Velocity', 'Focused delivery cycles with predictable milestones and transparent technical decisions.'],
            ['03', 'Partnership', 'Hands-on collaboration that leaves your team with more capability and less dependency.']
          ].map(([index, title, detail]) => (
            <article key={title} className="grid gap-4 py-7 sm:grid-cols-[3rem_10rem_1fr]">
              <span className="northstar-number text-xs">{index}</span>
              <h3 className="font-display text-xl font-medium text-white">{title}</h3>
              <p className="text-sm leading-7 text-white/48">{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="northstar-container northstar-section--tight" aria-label="Inside the studio">
        <figure className="northstar-portrait">
          <div className="northstar-portrait__frame">
            <Image
              src="/media/hero.png"
              alt="An MBMApps operator reviewing the QuietPilot and LeaguePilot product surfaces on a studio display."
              fill
              sizes="(max-width: 1280px) 92vw, 1200px"
            />
          </div>
          <figcaption className="northstar-portrait__caption">
            <p className="northstar-kicker">In practice</p>
            <p>
              We stay close enough to the operation to see where judgment still belongs—then build the system around it.
            </p>
          </figcaption>
        </figure>
      </section>

      <section className="northstar-container grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <article className="northstar-card min-h-[28rem] p-7 md:p-10">
          <p className="northstar-kicker">What we build</p>
          <h2 className="mt-24 max-w-3xl font-display text-4xl font-light tracking-[-0.05em] text-white md:text-6xl">Products for revenue movement, operational clarity, and focused work.</h2>
          <Link href="/apps" className="storefront-detail-link mt-7">Browse the app portfolio <ArrowUpRight className="h-4 w-4" /></Link>
        </article>
        <article className="northstar-card flex min-h-[28rem] flex-col p-7 md:p-10">
          <p className="northstar-kicker">How we deliver</p>
          <p className="mt-auto font-display text-3xl font-light leading-tight tracking-[-0.04em] text-white">Next.js. TypeScript. Contract modules. Automated QA. Cloud portability.</p>
          <p className="mt-5 text-sm leading-7 text-white/48">The stack changes when the problem requires it. The standard for legibility and release confidence does not.</p>
        </article>
      </section>
    </div>
  );
}
