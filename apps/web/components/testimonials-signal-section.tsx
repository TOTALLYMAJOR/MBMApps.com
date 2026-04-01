type Testimonial = {
  quote: string;
  role: string;
  company: string;
  impact: string;
};

type GlyphName = 'slack' | 'chevrons' | 'command' | 'figma' | 'asterisk' | 'link' | 'aperture' | 'toggle';

type PartnerNode = {
  label: string;
  glyph: GlyphName;
  motionClass: string;
};

const flowLines = [
  {
    path: 'M 125,280 C 125,550 480,500 500,680',
    flowDuration: 8,
    flowDelay: 0,
    packetDuration: 4.1,
    packetDelay: 0
  },
  {
    path: 'M 375,280 C 375,550 490,500 500,680',
    flowDuration: 10,
    flowDelay: 0.4,
    packetDuration: 5.2,
    packetDelay: 0.6
  },
  {
    path: 'M 625,280 C 625,550 510,500 500,680',
    flowDuration: 9,
    flowDelay: 0.2,
    packetDuration: 4.7,
    packetDelay: 0.4
  },
  {
    path: 'M 875,280 C 875,550 520,500 500,680',
    flowDuration: 11,
    flowDelay: 0.9,
    packetDuration: 5.8,
    packetDelay: 1.2
  }
] as const;

const partnerNodes: PartnerNode[] = [
  { label: 'Slack', glyph: 'slack', motionClass: 'testimonial-glyph-wiggle' },
  { label: 'Chevrons', glyph: 'chevrons', motionClass: 'testimonial-glyph-slide' },
  { label: 'Command', glyph: 'command', motionClass: 'testimonial-glyph-pop' },
  { label: 'Figma', glyph: 'figma', motionClass: 'testimonial-glyph-float' },
  { label: 'Asterisk', glyph: 'asterisk', motionClass: 'testimonial-glyph-rotate' },
  { label: 'Link', glyph: 'link', motionClass: 'testimonial-glyph-pop' },
  { label: 'Aperture', glyph: 'aperture', motionClass: 'testimonial-glyph-rotate-reverse' },
  { label: 'Toggle', glyph: 'toggle', motionClass: 'testimonial-glyph-switch' }
];

const testimonials: Testimonial[] = [
  {
    quote:
      'Quote turnaround dropped from days to minutes, and leadership gained a live funnel instead of stale spreadsheets.',
    role: 'Revenue Operations Lead',
    company: 'Regional Catering Group',
    impact: '2.5 days to 42 minutes'
  },
  {
    quote:
      'The shared dashboard changed weekly retrospective reporting into same-day decision making across every location.',
    role: 'Operations Director',
    company: 'Multi-Location Food Services Team',
    impact: 'Weekly latency to near-real-time'
  },
  {
    quote:
      'Docker parity across providers gave our team confidence during incidents and removed lock-in anxiety from planning.',
    role: 'Engineering Manager',
    company: 'SaaS Platform Team',
    impact: 'Cross-provider portability program'
  }
];

function PartnerGlyph({ glyph }: { glyph: GlyphName }) {
  switch (glyph) {
    case 'slack':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect width="3" height="8" x="13" y="2" rx="1.5" />
          <path d="M19 8.5V10h1.5A1.5 1.5 0 1 0 19 8.5" />
          <rect width="3" height="8" x="8" y="14" rx="1.5" />
          <path d="M5 15.5V14H3.5A1.5 1.5 0 1 0 5 15.5" />
          <rect width="8" height="3" x="14" y="13" rx="1.5" />
          <path d="M15.5 19H14v1.5a1.5 1.5 0 1 0 1.5-1.5" />
          <rect width="8" height="3" x="2" y="8" rx="1.5" />
          <path d="M8.5 5H10V3.5A1.5 1.5 0 1 0 8.5 5" />
        </svg>
      );
    case 'chevrons':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 17 5-5-5-5" />
          <path d="m13 17 5-5-5-5" />
        </svg>
      );
    case 'command':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
        </svg>
      );
    case 'figma':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
          <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
          <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" />
          <path d="M5 19.5A3.5 3.5 0 0 1 8.5 23H12v-3.5a3.5 3.5 0 1 1-7 0z" />
          <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" />
        </svg>
      );
    case 'asterisk':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 6v12" />
          <path d="M17.196 9 6.804 15" />
          <path d="m6.804 9 10.392 6" />
        </svg>
      );
    case 'link':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      );
    case 'aperture':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="m14.31 8 5.74 9.94" />
          <path d="M9.69 8h11.48" />
          <path d="m7.38 12 5.74-9.94" />
          <path d="M9.69 16 3.95 6.06" />
          <path d="M14.31 16H2.83" />
          <path d="m16.62 12-5.74 9.94" />
        </svg>
      );
    case 'toggle':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect width="20" height="12" x="2" y="6" rx="6" ry="6" />
          <circle cx="16" cy="12" r="2" />
        </svg>
      );
  }
}

function FrameCorners() {
  return (
    <>
      <span className="absolute left-0 top-0 h-1.5 w-1.5 border-l border-t border-blue-500/35 transition-all duration-300 group-hover:h-2.5 group-hover:w-2.5 group-hover:border-blue-400" />
      <span className="absolute right-0 top-0 h-1.5 w-1.5 border-r border-t border-blue-500/35 transition-all duration-300 group-hover:h-2.5 group-hover:w-2.5 group-hover:border-blue-400" />
      <span className="absolute bottom-0 left-0 h-1.5 w-1.5 border-b border-l border-blue-500/35 transition-all duration-300 group-hover:h-2.5 group-hover:w-2.5 group-hover:border-blue-400" />
      <span className="absolute bottom-0 right-0 h-1.5 w-1.5 border-b border-r border-blue-500/35 transition-all duration-300 group-hover:h-2.5 group-hover:w-2.5 group-hover:border-blue-400" />
    </>
  );
}

export function TestimonialsSignalSection() {
  return (
    <section
      className="scene-panel mx-auto w-full max-w-6xl px-6 pb-16 lg:px-8"
      data-rot-y="1.82"
      data-cam-z="4.15"
      data-cam-y="-0.03"
      data-cam-x="-0.03"
    >
      <div className="section-shell testimonial-signal relative overflow-visible p-8 md:p-10">
        <div className="testimonial-signal__backdrop pointer-events-none absolute inset-0 rounded-[inherit]" />
        <div className="testimonial-signal__grain pointer-events-none absolute inset-0 rounded-[inherit]" />
        <div className="pointer-events-none absolute inset-0 rounded-[inherit]">
          <div className="absolute left-1/2 top-0 h-[640px] w-full -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(79,140,255,0.18),transparent_70%)] opacity-50" />
          <div className="absolute left-20 top-24 h-1 w-1 animate-pulse rounded-full bg-white/20" />
          <div className="absolute right-1/4 top-44 h-1 w-1 animate-pulse rounded-full bg-blue-300/30 [animation-delay:1s]" />
          <div className="absolute bottom-40 left-1/3 h-1 w-1 animate-pulse rounded-full bg-white/20 [animation-delay:2s]" />
        </div>

        <div className="relative z-10 text-center">
          <p className="kicker reveal">Client Testimonials</p>
          <h2 className="reveal mt-3 font-display text-3xl text-white sm:text-4xl">Trusted partners, measured outcomes.</h2>
          <p className="reveal mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/72 md:text-base">
            This section adapts your visual concept into our current design system while grounding proof points in shipped case-study outcomes.
          </p>
        </div>

        <div className="relative mx-auto mt-12 max-w-5xl">
          <svg
            className="pointer-events-none absolute -top-12 left-0 hidden h-[820px] w-full overflow-visible md:block"
            preserveAspectRatio="none"
            viewBox="0 0 1000 800"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="testimonialFlowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(110, 177, 255, 0.92)" />
                <stop offset="60%" stopColor="rgba(91, 143, 251, 0.5)" />
                <stop offset="100%" stopColor="rgba(58, 94, 208, 0.06)" />
              </linearGradient>
              <filter id="testimonialGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {flowLines.map((line) => (
              <path key={`${line.path}-track`} d={line.path} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            ))}

            {flowLines.map((line) => (
              <path
                key={`${line.path}-flow`}
                className="testimonial-flow-line"
                d={line.path}
                fill="none"
                stroke="url(#testimonialFlowGradient)"
                strokeWidth="2"
                strokeDasharray="220, 380"
                strokeDashoffset="-120"
                style={{ animationDuration: `${line.flowDuration}s`, animationDelay: `${line.flowDelay}s` }}
              />
            ))}

            {flowLines.map((line) => (
              <path
                key={`${line.path}-packet`}
                className="testimonial-flow-packet"
                d={line.path}
                fill="none"
                stroke="#6cb8ff"
                strokeWidth="3"
                strokeDasharray="24, 620"
                strokeDashoffset="-160"
                strokeLinecap="round"
                filter="url(#testimonialGlow)"
                style={{ animationDuration: `${line.packetDuration}s`, animationDelay: `${line.packetDelay}s` }}
              />
            ))}
          </svg>

          <div className="relative z-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {partnerNodes.map((node) => (
              <article
                key={node.label}
                className="group relative flex h-24 items-center justify-center overflow-hidden border border-white/10 bg-[#0b0d14]/95 transition-all duration-300 hover:border-blue-500/35 hover:bg-white/[0.03] hover:shadow-[0_0_24px_rgba(79,140,255,0.16)]"
              >
                <FrameCorners />
                <div className={`testimonial-glyph ${node.motionClass} h-8 w-8 text-slate-300 transition-colors duration-300 group-hover:text-white`}>
                  <PartnerGlyph glyph={node.glyph} />
                </div>
                <span className="sr-only">{node.label}</span>
              </article>
            ))}
          </div>

          <div className="relative z-20 mt-20 flex justify-center md:mt-28">
            <div className="relative flex items-center justify-center">
              <div className="absolute -top-32 h-32 w-[2px] overflow-hidden bg-gradient-to-b from-transparent via-blue-400/55 to-blue-500 shadow-[0_0_18px_rgba(79,140,255,0.6)]">
                <div className="testimonial-scanner absolute inset-x-0 top-0 h-1/2 bg-white/45 blur-[2px]" />
              </div>

              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-blue-400/35 bg-[#03050b] shadow-[0_0_48px_rgba(79,140,255,0.4)]">
                <div className="absolute inset-[-10px] rounded-full border border-dashed border-blue-500/20 animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-[-4px] rounded-full border border-dotted border-blue-300/30 animate-[spin_15s_linear_infinite_reverse]" />
                <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-xl animate-pulse" />
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="testimonial-glyph relative z-10 h-10 w-10 text-white [filter:drop-shadow(0_0_10px_rgba(255,255,255,0.42))]"
                >
                  <circle cx="12" cy="12" r="1" />
                  <path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z" />
                  <path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-14 grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <article key={`${item.company}-${item.role}`} className="surface-card border-white/20 bg-black/40 p-5 backdrop-blur-sm">
              <p className="text-sm leading-7 text-white/88">&ldquo;{item.quote}&rdquo;</p>
              <p className="mt-4 font-display text-lg text-white">{item.role}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-signal/90">{item.company}</p>
              <p className="mt-3 inline-flex rounded-full border border-blue-400/35 bg-blue-500/10 px-3 py-1 text-xs text-white/85">{item.impact}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
