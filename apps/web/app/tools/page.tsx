import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Tools',
  description: 'Focused MBMApps utilities for composing interfaces and turning AI workflows into repeatable production recipes.',
  alternates: { canonical: '/tools' }
};

const tools = [
  {
    command: 'launch --utility component-studio@4',
    name: 'Component Studio',
    description: 'Browse, tune, and compose production-minded interface components into an implementation-ready design pack.',
    href: '/component-studio.html',
    meta: '150 components · browser-local state'
  },
  {
    command: 'launch --utility prompt-register@1',
    name: 'AI Production Prompt Register',
    description: 'Search 100 non-traditional workflows that turn websites, screenshots, documents, and data into interfaces, code, and design records.',
    href: '/tools/prompt-register',
    meta: '100 recipes · searchable · JSON export'
  }
] as const;

export default function ToolsPage() {
  return (
    <div className="terminal-home terminal-page">
      <section className="terminal-shell terminal-pagehead">
        <p className="terminal-command"><span>~/mbmapps/tools</span> $ ls --utilities --available</p>
        <h1>tools<span className="terminal-cursor" aria-hidden="true" /></h1>
        <p className="terminal-lede">Small, focused instruments for moving from a vague direction to a concrete design or production artifact.</p>
        <div className="terminal-links"><Link href="/">[back home]</Link><Link href="/contact">[request a utility]</Link></div>
      </section>

      <section className="terminal-section terminal-shell" aria-labelledby="tools-title">
        <div className="terminal-section__head"><div><h2 id="tools-title"><span>*</span> available utilities</h2><p><span>$</span> inspect --capabilities</p></div><p>{tools.length} browser tools</p></div>
        <div className="terminal-system-grid">
          {tools.map((tool) => (
            <article key={tool.name}>
              <p className="terminal-fact__label">$ {tool.command}</p>
              <h3>{tool.name}</h3>
              <p>{tool.description}</p>
              <p className="terminal-proof-note">{tool.meta}</p>
              <div className="terminal-links"><Link href={tool.href}>[open tool]</Link></div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
