'use client';

import { useState, type CSSProperties } from 'react';

type View = 'timeline' | 'patterns' | 'findings';

const eras = [
  {
    years: '2023—24',
    title: 'Exploration became a working system',
    text: 'Early conversations moved from broad technical exploration toward repeatable delivery patterns, product boundaries, and named operating constraints.',
    signal: 38
  },
  {
    years: '2025',
    title: 'Products separated from experiments',
    text: 'QuietPilot, LeaguePilot, QuotePilot, and MBMApps developed clearer identities while shared architecture patterns continued to travel between them.',
    signal: 74
  },
  {
    years: '2026',
    title: 'Evidence became part of delivery',
    text: 'The work increasingly encoded authority, verification, release gates, and proof boundaries instead of treating them as final-stage documentation.',
    signal: 100
  }
];

const patterns = [
  { label: 'Integrations + APIs', value: 408, width: 100 },
  { label: 'Workflow state', value: 194, width: 48 },
  { label: 'Schemas + migrations', value: 192, width: 47 },
  { label: 'Identity + authorization', value: 160, width: 39 },
  { label: 'Synchronization', value: 122, width: 30 },
  { label: 'Queues + durable work', value: 103, width: 25 },
  { label: 'Audit + evidence', value: 54, width: 13 },
  { label: 'Webhooks + idempotency', value: 52, width: 13 }
];

const findings = [
  {
    index: '01',
    title: 'Delivery contracts are reusable intellectual property.',
    text: 'The durable asset is not a single prompt. It is the recurring contract around authority, scope, evidence, validation, and handoff.'
  },
  {
    index: '02',
    title: 'Shared architecture lives in workflows and schemas.',
    text: 'Reusable leverage appears where products share state transitions, integration seams, and proof requirements—not where their screens merely look alike.'
  },
  {
    index: '03',
    title: 'Recovery history is more valuable than failure counts.',
    text: 'A problem becomes organizational knowledge when the mismatch, corrective move, and verification step can be recognized and reused.'
  },
  {
    index: '04',
    title: 'Project memory needs provenance and authority.',
    text: 'Useful memory must preserve where a decision came from, whether it is still canonical, and what evidence would invalidate it.'
  }
];

const views: Array<{ id: View; label: string }> = [
  { id: 'timeline', label: 'Timeline' },
  { id: 'patterns', label: 'System patterns' },
  { id: 'findings', label: 'Findings' }
];

export function DevelopmentIntelligenceExplorer() {
  const [view, setView] = useState<View>('timeline');

  return (
    <section className="development-explorer" aria-labelledby="development-explorer-title">
      <div className="development-explorer__controls">
        <div>
          <p className="development-kicker"><span>$</span> inspect --history --public</p>
          <h2 id="development-explorer-title">What the work reveals</h2>
        </div>
        <div className="development-explorer__tabs" role="tablist" aria-label="Research views">
          {views.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={view === item.id}
              aria-controls={`development-panel-${item.id}`}
              id={`development-tab-${item.id}`}
              onClick={() => setView(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="development-explorer__panel"
        id={`development-panel-${view}`}
        role="tabpanel"
        aria-labelledby={`development-tab-${view}`}
      >
        {view === 'timeline' ? (
          <div className="development-timeline">
            <div className="development-timeline__rail" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            {eras.map((era) => (
              <article key={era.years} className="development-era" style={{ '--signal': `${era.signal}%` } as CSSProperties}>
                <p>{era.years}</p>
                <div aria-hidden="true"><span /></div>
                <h3>{era.title}</h3>
                <p>{era.text}</p>
              </article>
            ))}
          </div>
        ) : null}

        {view === 'patterns' ? (
          <div className="development-patterns">
            <div className="development-patterns__intro">
              <p>Conversation-level topic signals</p>
              <strong>Architecture repeats before products do.</strong>
              <span>Counts overlap. A conversation can contain more than one system concern.</span>
            </div>
            <div className="development-patterns__chart" aria-label="Architecture topic frequency">
              {patterns.map((pattern) => (
                <div className="development-pattern" key={pattern.label}>
                  <span>{pattern.label}</span>
                  <div><i style={{ width: `${pattern.width}%` }} /></div>
                  <strong>{pattern.value}</strong>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {view === 'findings' ? (
          <div className="development-findings">
            {findings.map((finding) => (
              <article key={finding.index}>
                <span>{finding.index}</span>
                <div>
                  <h3>{finding.title}</h3>
                  <p>{finding.text}</p>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
