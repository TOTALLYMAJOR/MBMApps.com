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
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-16 lg:grid-cols-[1.1fr_1fr] lg:px-8">
      <section>
        <p className="text-xs uppercase tracking-[0.22em] text-signal">Let&apos;s Build</p>
        <h1 className="mt-3 font-display text-5xl text-white">Tell us what outcome you need next.</h1>
        <p className="mt-4 max-w-xl text-lg text-mist">
          Share your product goals and constraints. We&apos;ll reply with an implementation path, architecture recommendation, and a realistic execution timeline.
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900/55 p-5 text-sm text-white/85">
          <p className="font-semibold text-white">Prefer booking directly?</p>
          <p className="mt-2 text-mist">Use our scheduling link to reserve a discovery call.</p>
          <Link
            href={schedulingUrl}
            className="mt-4 inline-flex rounded-full border border-electric/60 bg-electric/15 px-4 py-2 text-sm font-semibold text-white hover:bg-electric/30"
          >
            Book Call
          </Link>
        </div>
      </section>

      <ContactForm />
    </div>
  );
}
