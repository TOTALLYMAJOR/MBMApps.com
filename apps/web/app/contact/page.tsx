import Link from 'next/link';
import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact-form';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Start a direct, structured conversation with MBMApps about the operating outcome you need.'
};

export default function ContactPage() {
  const schedulingUrl = process.env.NEXT_PUBLIC_SCHEDULING_URL ?? 'https://calendly.com/mbmapps/discovery-call';

  return (
    <div className="terminal-home terminal-page">
      <section className="terminal-shell terminal-pagehead">
        <p className="terminal-command"><span>~/mbmapps/contact</span> $ start</p>
        <h1>start a conversation<span className="terminal-cursor" aria-hidden="true" /></h1>
        <p className="terminal-lede">Share the outcome, the constraint, and what is already in motion. Your request is saved only when you explicitly submit it.</p>
        <div className="terminal-links"><a href={`mailto:${siteConfig.email}`}>[email directly]</a><Link href="/">[back home]</Link><a href={schedulingUrl} target="_blank" rel="noreferrer">[book a call]</a></div>
      </section>

      <section className="terminal-section terminal-shell terminal-intake" aria-labelledby="contact-form-title">
        <div className="terminal-section__head"><div><h2 id="contact-form-title"><span>*</span> guided studio intake</h2><p><span>$</span> compose --direct --persist-on-submit</p></div><p>7 concise steps</p></div>
        <div className="terminal-intake__grid">
          <aside>
            <p className="terminal-command"><span>what you receive</span></p>
            <ul>
              <li>A focused architecture recommendation based on your context.</li>
              <li>Suggested delivery phases with risk-aware scope boundaries.</li>
              <li>An implementation path across product, infrastructure, and operations.</li>
            </ul>
            <p className="terminal-proof-note">Useful context: budget, timeline, current tools, and the cost of the present workflow.</p>
          </aside>
          <ContactForm />
        </div>
      </section>

      <section className="terminal-section terminal-shell terminal-contact" aria-label="Direct contact details">
        <div><p className="terminal-command"><span>~/mbmapps/contact</span> $ cat details</p><h2><span>*</span> direct lines</h2><p>The studio replies directly. Expect a considered answer, not an automated sequence.</p></div>
        <div className="terminal-contact__actions"><a href={`mailto:${siteConfig.email}`}>[{siteConfig.email}]</a><a href={schedulingUrl} target="_blank" rel="noreferrer">[book discovery call]</a></div>
      </section>
    </div>
  );
}
