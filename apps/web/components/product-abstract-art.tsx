const PIPELINE_STAGES = 8;
const PIPELINE_X = Array.from({ length: PIPELINE_STAGES }, (_, i) => 30 + i * ((370 - 30) / (PIPELINE_STAGES - 1)));

const CONSTELLATION_NODES: Array<[number, number]> = [
  [60, 50],
  [140, 30],
  [220, 60],
  [310, 40],
  [90, 120],
  [180, 100],
  [260, 130],
  [340, 110],
  [150, 170],
  [280, 180]
];

const CONSTELLATION_EDGES: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [0, 4],
  [1, 5],
  [2, 5],
  [3, 6],
  [4, 5],
  [5, 6],
  [6, 7],
  [4, 8],
  [5, 8],
  [6, 9],
  [8, 9]
];

const FUNNEL_LAYERS = [340, 270, 200, 130, 70];

function PipelineArt() {
  return (
    <svg viewBox="0 0 400 200" className="abstract-art" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Abstract visualization of a connected commercial pipeline">
      <line x1="30" y1="100" x2="370" y2="100" className="abstract-art-stroke" strokeWidth="1.5" opacity="0.3" />
      {PIPELINE_X.map((x, i) => (
        <g key={x}>
          <circle cx={x} cy="100" r="11" className="abstract-art-fill abstract-pulse" style={{ animationDelay: `${i * 0.28}s` }} opacity="0.16" />
          <circle cx={x} cy="100" r="4" className="abstract-art-fill abstract-pulse" style={{ animationDelay: `${i * 0.28}s` }} />
        </g>
      ))}
    </svg>
  );
}

function ConstellationArt() {
  return (
    <svg viewBox="0 0 400 200" className="abstract-art" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Abstract visualization of a connected team network">
      {CONSTELLATION_EDGES.map(([a, b], i) => {
        const from = CONSTELLATION_NODES[a];
        const to = CONSTELLATION_NODES[b];
        if (!from || !to) {
          return null;
        }
        return <line key={i} x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} className="abstract-art-stroke" strokeWidth="1" opacity="0.28" />;
      })}
      {CONSTELLATION_NODES.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" className="abstract-art-fill abstract-pulse" style={{ animationDelay: `${(i % 5) * 0.5}s`, animationDuration: '3.6s' }} />
      ))}
    </svg>
  );
}

function FunnelArt() {
  const layerHeight = 28;
  const gap = 10;
  const startY = 18;
  return (
    <svg viewBox="0 0 400 200" className="abstract-art" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Abstract visualization of a narrowing quote-to-booking funnel">
      {FUNNEL_LAYERS.map((width, i) => {
        const y = startY + i * (layerHeight + gap);
        const x = 200 - width / 2;
        const isLast = i === FUNNEL_LAYERS.length - 1;
        return (
          <rect
            key={width}
            x={x}
            y={y}
            width={width}
            height={layerHeight}
            rx="3"
            className={`abstract-art-fill${isLast ? ' abstract-pulse-slow' : ''}`}
            opacity={0.22 + i * 0.17}
          />
        );
      })}
    </svg>
  );
}

const ART_BY_SLUG: Record<string, () => React.JSX.Element> = {
  quietpilot: PipelineArt,
  leaguepilot: ConstellationArt,
  quoteflow: FunnelArt
};

export function ProductAbstractArt({ slug }: { slug: string }) {
  const Art = ART_BY_SLUG[slug] ?? PipelineArt;
  return <Art />;
}
