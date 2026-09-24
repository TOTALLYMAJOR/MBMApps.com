import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useMemo, useState } from 'react';

const nodes = {
  event: { x: 500, y: 52, w: 290, h: 48, title: 'CHANGE EVENT / BUSINESS OBJECTIVE', sub: 'new intent enters the system', stage: 0 },
  control: { x: 500, y: 160, w: 392, h: 80, title: 'DEVELOPMENT CONTROL PLANE', sub: 'scope • evidence • authority • dependency graph', third: 'what changes / what stays / what must be proven', stage: 1 },
  decision: { x: 245, y: 300, w: 248, h: 66, title: 'Decision Intelligence', sub: 'consequence • assumptions • business truth', stage: 2 },
  design: { x: 500, y: 300, w: 248, h: 66, title: 'Design Intelligence', sub: 'interaction intent • UX constraints • hierarchy', stage: 2 },
  agent: { x: 755, y: 300, w: 248, h: 66, title: 'Agent Orchestration', sub: 'plan • split • execute • reconcile', stage: 2 },
  repo1: { x: 160, y: 455, w: 205, h: 58, title: 'QuotePilot', sub: 'product / workflow repo', stage: 3 },
  repo2: { x: 390, y: 455, w: 205, h: 58, title: 'Decision Systems', sub: 'domain / intelligence repo', stage: 3 },
  repo3: { x: 625, y: 455, w: 205, h: 58, title: 'Design Systems', sub: 'UI / interaction repo', stage: 3 },
  proof: { x: 500, y: 566, w: 320, h: 44, title: 'VALIDATION • EVIDENCE • PROOF', sub: 'completion requires observable evidence', stage: 4 }
};

const edges = [
  { id: 'e1', d: 'M500 76 L500 120', p: [[500,76],[500,98],[500,120]], stage: 0 },
  { id: 'e2', d: 'M500 200 C420 222 335 235 245 267', p: [[500,200],[430,218],[335,234],[245,267]], stage: 1 },
  { id: 'e3', d: 'M500 200 L500 267', p: [[500,200],[500,232],[500,267]], stage: 1 },
  { id: 'e4', d: 'M500 200 C580 222 665 235 755 267', p: [[500,200],[570,218],[665,234],[755,267]], stage: 1 },
  { id: 'e5', d: 'M245 333 C205 361 177 388 160 426', p: [[245,333],[210,356],[182,386],[160,426]], stage: 2 },
  { id: 'e6', d: 'M245 333 C300 365 350 389 390 426', p: [[245,333],[296,360],[345,388],[390,426]], stage: 2 },
  { id: 'e7', d: 'M500 333 C460 364 425 390 390 426', p: [[500,333],[465,360],[427,390],[390,426]], stage: 2 },
  { id: 'e8', d: 'M500 333 C548 363 587 390 625 426', p: [[500,333],[548,361],[587,390],[625,426]], stage: 2 },
  { id: 'e9', d: 'M755 333 C680 368 555 396 160 426', p: [[755,333],[665,366],[520,394],[340,410],[160,426]], stage: 2 },
  { id: 'e10', d: 'M755 333 C710 364 669 392 625 426', p: [[755,333],[714,362],[670,392],[625,426]], stage: 2 },
  { id: 'e11', d: 'M160 484 C250 517 350 532 445 545', p: [[160,484],[245,513],[340,529],[445,545]], stage: 3 },
  { id: 'e12', d: 'M390 484 C420 513 447 530 474 545', p: [[390,484],[420,511],[447,530],[474,545]], stage: 3 },
  { id: 'e13', d: 'M625 484 C580 515 545 532 520 545', p: [[625,484],[580,513],[546,531],[520,545]], stage: 3 }
];

const nodeIds = Object.keys(nodes);
const edgeIds = edges.map((edge) => edge.id);

const scenarios = {
  pricing: {
    category: 'Commercial',
    title: 'Pricing policy changes',
    mode: 'Selective execution',
    affected: ['event','control','decision','agent','repo1','repo2','proof'],
    retained: ['design','repo3'],
    blocked: [],
    active: ['e1','e2','e4','e5','e6','e9','e11','e12'],
    repos: 2,
    summary: 'This scenario traces a commercial rule from its authoritative source through downstream consequences and dependent repositories while unrelated design work remains intact.',
    impacts: [
      ['Decision Intelligence','REVISE','Commercial assumptions and consequence models change.'],
      ['Design Intelligence','RETAIN','No UX change unless the policy creates a new user-visible state.'],
      ['QuotePilot','REVISE','Totals, proposal outputs, guardrails, and regression tests update.'],
      ['Design Systems','RETAIN','The current design contract remains valid.']
    ],
    trace: ['Locate authoritative pricing rule','Recompute downstream business consequences','Route work only to dependent repositories','Validate calculations and end-to-end behavior'],
    outcome: 'The commercial path changes while unrelated design work remains valid.'
  },
  design: {
    category: 'Experience',
    title: 'Quote flow redesigned',
    mode: 'Selective execution',
    affected: ['event','control','design','agent','repo1','repo3','proof'],
    retained: ['decision','repo2'],
    blocked: [],
    active: ['e1','e3','e4','e8','e9','e10','e11','e13'],
    repos: 2,
    summary: 'This scenario separates experience intent from business authority so presentation work cannot silently redefine pricing or operational truth.',
    impacts: [
      ['Decision Intelligence','RETAIN','The current business decision remains authoritative.'],
      ['Design Intelligence','REVISE','Hierarchy, flow, interaction states, and accessibility change.'],
      ['QuotePilot','REVISE','Product implementation consumes approved design intent.'],
      ['Decision Systems','RETAIN','Domain semantics remain unchanged.']
    ],
    trace: ['Classify as experience-layer change','Preserve business authority and commercial rules','Route UX intent to product and design repositories','Run interaction, accessibility, visual, and regression proof'],
    outcome: 'The experience changes without allowing the interface to redefine business truth.'
  },
  contract: {
    category: 'Architecture',
    title: 'Shared contract changes',
    mode: 'Coordinated migration',
    affected: nodeIds,
    retained: [],
    blocked: [],
    active: edgeIds,
    repos: 3,
    summary: 'This scenario maps a shared contract change across producers, consumers, and repositories before coordinated implementation begins.',
    impacts: [
      ['Decision Intelligence','RECONSIDER','Determine whether semantics changed or only representation.'],
      ['Design Intelligence','RECONSIDER','Identify UI consumers of the changed contract.'],
      ['Agent Orchestration','SPLIT','Coordinate producer and consumer work separately.'],
      ['All repositories','REVISE','Execute the migration in dependency order.']
    ],
    trace: ['Map producers, consumers, and semantic dependencies','Create a shared contract revision','Split execution by repository and dependency order','Reconcile consumers and run contract plus end-to-end tests'],
    outcome: 'A cross-repository migration becomes coordinated work instead of independent agent edits.'
  },
  failure: {
    category: 'Validation',
    title: 'Agent output fails proof',
    mode: 'Fail closed',
    affected: ['event','control','decision','agent','repo1','proof'],
    retained: ['design','repo2','repo3'],
    blocked: ['proof'],
    active: ['e1','e2','e4','e5','e9','e11'],
    repos: 1,
    summary: 'This scenario shows validation blocking completion, classifying the failure, and limiting rework to the invalid branch.',
    impacts: [
      ['Validation','BLOCK','Evidence does not support completion.'],
      ['Agent Orchestration','REPLAN','Classify the failure before retrying.'],
      ['Decision Intelligence','RECONSIDER','Check whether the original target or assumption was wrong.'],
      ['Unaffected repositories','RETAIN','Do not discard valid completed work.']
    ],
    trace: ['Capture the failed proof and expected outcome','Classify the failure source','Replan only the invalid execution branch','Repeat validation before promotion'],
    outcome: 'Completion remains blocked until evidence passes; valid work is preserved.'
  }
};

const order = ['pricing','design','contract','failure'];
const delays = { 0: 0.35, 1: 1.5, 2: 3.0, 3: 4.9, 4: 6.5 };

function stateOf(id, scenario) {
  if (scenario.blocked.includes(id)) return 'blocked';
  if (scenario.affected.includes(id)) return 'affected';
  if (scenario.retained.includes(id)) return 'retained';
  return 'idle';
}

function Particle({ edge, delay, index, reduced }) {
  if (reduced) return null;
  const xs = edge.p.map(([x]) => x);
  const ys = edge.p.map(([, y]) => y);
  const primary = index === 0;
  return (
    <motion.g>
      <motion.circle
        r={primary ? 12 : 8}
        fill={primary ? 'rgba(255,138,0,.12)' : 'rgba(255,179,95,.08)'}
        filter="url(#particleGlow)"
        initial={{ cx: xs[0], cy: ys[0], opacity: 0, scale: .4 }}
        animate={{ cx: xs, cy: ys, opacity: [0,.9,.75,.35,0], scale: [.4,1,1.08,.9,.6] }}
        transition={{ delay: delay + index * .38, duration: 2.35, times: [0,.12,.55,.84,1], ease: 'easeInOut' }}
      />
      <motion.circle
        r={primary ? 4.9 : 3.1}
        fill={primary ? '#ff8a00' : '#ffb35f'}
        initial={{ cx: xs[0], cy: ys[0], opacity: 0, scale: .55 }}
        animate={{ cx: xs, cy: ys, opacity: [0,1,1,.95,0], scale: [.55,1,1,.92,.68] }}
        transition={{ delay: delay + index * .38, duration: 2.35, times: [0,.12,.55,.84,1], ease: 'easeInOut' }}
      />
    </motion.g>
  );
}

function GraphNode({ id, node, scenario, run, reduced }) {
  const state = stateOf(id, scenario);
  const affected = state === 'affected';
  const retained = state === 'retained';
  const blocked = state === 'blocked';
  const idle = state === 'idle';
  const x = node.x - node.w / 2;
  const y = node.y - node.h / 2;
  const color = affected ? '#ff8a00' : retained ? '#38d6ae' : blocked ? '#f6ba4f' : '#313842';
  const label = affected ? 'AFFECTED' : retained ? 'RETAINED' : blocked ? 'BLOCKED' : '';
  const badgeWidth = retained ? 63 : blocked ? 55 : 61;
  const delay = delays[node.stage];

  return (
    <motion.g
      key={id + '-' + run}
      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      initial={reduced ? false : { opacity: idle ? .14 : .28, scale: .965 }}
      animate={blocked && !reduced
        ? { opacity: 1, scale: 1.02, x: [0,0,-4,4,-3,3,0] }
        : { opacity: idle ? .22 : retained ? .7 : 1, scale: affected ? 1.04 : 1, x: 0 }}
      transition={blocked && !reduced
        ? { opacity: { delay, duration: .42 }, scale: { delay, type: 'spring', stiffness: 145, damping: 18 }, x: { delay: delay + .72, duration: .82 } }
        : reduced ? { duration: 0 } : { delay, type: 'spring', stiffness: 145, damping: 18, mass: 1.05 }}
    >
      {affected ? (
        <>
          <motion.rect
            x={x - 9} y={y - 9} width={node.w + 18} height={node.h + 18} rx="20"
            fill="none" stroke="#ff8a00" filter="url(#routeGlow)"
            initial={reduced ? false : { opacity: 0, scale: .94 }}
            animate={reduced ? { opacity: .12 } : { opacity: [0,.38,.1], scale: [.94,1.035,1.08] }}
            transition={{ delay: delay + .12, duration: 1.8, times: [0,.4,1] }}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          />
          <motion.rect
            x={x - 6} y={y - 6} width={node.w + 12} height={node.h + 12} rx="18"
            fill="none" stroke="#ff8a00"
            initial={reduced ? false : { opacity: 0, scale: .96 }}
            animate={reduced ? { opacity: .2 } : { opacity: [0,.46,.08], scale: [.96,1.02,1.055] }}
            transition={{ delay: delay + .18, duration: 1.6, times: [0,.42,1] }}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          />
        </>
      ) : null}

      <motion.rect
        x={x} y={y} width={node.w} height={node.h} rx={id === 'control' ? 18 : 14}
        fill={affected ? '#15171a' : '#11151b'}
        animate={{ stroke: color, strokeWidth: affected || blocked ? 3 : retained ? 2 : 1.4 }}
        transition={reduced ? { duration: 0 } : { delay, type: 'spring', stiffness: 145, damping: 18 }}
      />

      {!idle ? (
        <motion.g initial={reduced ? false : { opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduced ? 0 : delay + .25, duration: .4 }}>
          <rect x={x + node.w - badgeWidth - 8} y={y + 7} width={badgeWidth} height="16" rx="8" fill="rgba(255,255,255,.02)" stroke={color} strokeOpacity=".6" />
          <text x={x + node.w - badgeWidth / 2 - 8} y={y + 18} textAnchor="middle" fill={color} fontSize="7.2" fontWeight="800" letterSpacing=".8">{label}</text>
        </motion.g>
      ) : null}

      <text x={node.x} y={node.y - (node.third ? 12 : node.sub ? 5 : -4)} textAnchor="middle" className={'nodeTitle ' + (id === 'control' ? 'controlTitle' : '')}>{node.title}</text>
      {node.sub ? <text x={node.x} y={node.y + (node.third ? 9 : 14)} textAnchor="middle" className="nodeSub">{node.sub}</text> : null}
      {node.third ? <text x={node.x} y={node.y + 25} textAnchor="middle" className="nodeThird">{node.third}</text> : null}
    </motion.g>
  );
}

function SequenceRail({ run, failure, reduced }) {
  const phases = [['OBJECTIVE','Intent enters'],['CONTROL','Scope + route'],['REASON','Reconsider'],['EXECUTE','Multi-repo work'],['PROVE','Validate outcome']];
  const phaseDelays = [.35,1.5,3,4.9,6.5];
  return (
    <div className="sequenceRail">
      <div className="sequenceTrack">
        <motion.div
          key={'fill-' + run}
          className={'sequenceFill ' + (failure ? 'failure' : '')}
          initial={reduced ? { scaleX: 1 } : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={reduced ? { duration: 0 } : { duration: 8.2, ease: [.22,1,.36,1] }}
        />
      </div>
      <div className="sequencePhases">
        {phases.map(([label,detail], index) => (
          <motion.div
            key={run + '-' + label}
            className="sequencePhase"
            initial={reduced ? false : { opacity: .36, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : phaseDelays[index], duration: .55 }}
          >
            <i className={failure && index === 4 ? 'blocked' : ''} />
            <div><strong>{label}</strong><span>{detail}</span></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ControlGraph({ scenario, run, replay }) {
  const reduced = useReducedMotion();
  return (
    <section className="graphPanel">
      <div className="graphToolbar">
        <div><div className="eyebrow">Control-plane graph</div><div className="graphTitle">{scenario.title}</div></div>
        <motion.button type="button" className="replay" onClick={replay} whileHover={{ y: -1 }} whileTap={{ scale: .97 }}><span>↻</span> Replay cinematic ripple</motion.button>
      </div>
      <div className="graphScroll">
        <svg viewBox="0 0 1000 610" className="graph" role="img" aria-label={'Development control plane ripple for ' + scenario.title}>
          <defs>
            <filter id="particleGlow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="5" /></filter>
            <filter id="routeGlow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4" /></filter>
            <radialGradient id="spotlightFill"><stop offset="0%" stopColor="#ff8a00" stopOpacity=".1" /><stop offset="62%" stopColor="#ff8a00" stopOpacity=".035" /><stop offset="100%" stopColor="#ff8a00" stopOpacity="0" /></radialGradient>
          </defs>

          <image href="/icon.svg" x="390" y="155" width="220" height="220" opacity=".045" preserveAspectRatio="xMidYMid meet" />

          <motion.circle
            key={'spot-' + run}
            fill="url(#spotlightFill)"
            initial={reduced ? false : { cx: 500, cy: 52, r: 80, opacity: 0 }}
            animate={reduced ? { cx: 500, cy: 300, r: 160, opacity: .16 } : { cx: [500,500,500,390,500], cy: [52,160,300,455,566], r: [80,140,155,170,132], opacity: [0,.58,.5,.38,0] }}
            transition={{ duration: 8.35, times: [0,.18,.4,.62,1], ease: [.22,1,.36,1] }}
          />

          {edges.map((edge) => {
            const active = scenario.active.includes(edge.id);
            const delay = delays[edge.stage];
            return (
              <g key={edge.id + '-' + run}>
                <path d={edge.d} fill="none" stroke="#2c333d" strokeWidth="1.6" strokeLinecap="round" opacity=".22" />
                {active ? (
                  <motion.path
                    d={edge.d} fill="none" stroke="#ff8a00" strokeWidth="8" strokeLinecap="round" filter="url(#routeGlow)"
                    initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: [0,.5,.12] }}
                    transition={reduced ? { duration: 0 } : { delay, duration: 2, times: [0,.52,1], ease: [.22,1,.36,1] }}
                  />
                ) : null}
                <motion.path
                  d={edge.d} fill="none" stroke={active ? '#ff8a00' : '#2c333d'} strokeWidth={active ? 3.2 : 1.7} strokeLinecap="round"
                  initial={reduced ? false : { pathLength: active ? 0 : 1, opacity: active ? 0 : .17 }}
                  animate={{ pathLength: 1, opacity: active ? .92 : .17 }}
                  transition={reduced ? { duration: 0 } : { delay: active ? delay : 0, duration: active ? 1.8 : .35, ease: [.22,1,.36,1] }}
                />
                {active ? [0,1,2].map((index) => <Particle key={index} edge={edge} delay={delay + .24} index={index} reduced={reduced} />) : null}
              </g>
            );
          })}

          {Object.entries(nodes).map(([id,node]) => <GraphNode key={id + '-' + run} id={id} node={node} scenario={scenario} run={run} reduced={reduced} />)}
        </svg>
      </div>

      <SequenceRail run={run} failure={scenario.mode === 'Fail closed'} reduced={reduced} />
      <div className="graphCaption"><span>Objective → simulated control plane → reasoning → repositories → proof.</span><b>~8 sec</b></div>
    </section>
  );
}

function ImpactPanel({ scenario }) {
  return (
    <section className="infoPanel">
      <div className="eyebrow">Control-plane interpretation</div>
      <AnimatePresence mode="wait">
        <motion.div key={scenario.title} initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -6 }} transition={{ duration: .42 }}>
          <h2>{scenario.title}</h2>
          <p className="summary">{scenario.summary}</p>
          <div className="impactList">
            {scenario.impacts.map(([name,status,detail], index) => (
              <motion.article key={name} className="impactRow" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .13 + index * .09, type: 'spring', stiffness: 240, damping: 24 }}>
                <i className={'impactDot ' + (status === 'RETAIN' ? 'retained' : status === 'BLOCK' ? 'blocked' : 'affected')} />
                <div><div className="impactTop"><strong>{name}</strong><span>{status}</span></div><p>{detail}</p></div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function Trace({ scenario, run }) {
  const traceDelays = [1.1,2.7,4.5,6.15];
  return (
    <section className="infoPanel">
      <div className="traceHeader"><div className="eyebrow">Execution trace</div><span className={'mode ' + (scenario.mode === 'Fail closed' ? 'danger' : '')}>{scenario.mode}</span></div>
      <AnimatePresence mode="wait">
        <motion.div key={scenario.title + '-' + run} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="traceList">
            {scenario.trace.map((item,index) => (
              <motion.div key={item} className="traceStep" initial={{ opacity: .18, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: traceDelays[index], duration: .72, ease: [.22,1,.36,1] }}>
                <motion.span className="traceIndex" initial={{ scale: .78, borderColor: '#2e3540' }} animate={{ scale: 1, borderColor: scenario.mode === 'Fail closed' && index === 3 ? '#f6ba4f' : '#ff8a00' }} transition={{ delay: traceDelays[index], type: 'spring', stiffness: 155, damping: 17 }}>{index + 1}</motion.span>
                <span>{item}</span>
              </motion.div>
            ))}
          </div>
          <motion.div className={'outcome ' + (scenario.mode === 'Fail closed' ? 'failure' : '')} initial={{ opacity: 0, y: 9 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 7.15, duration: .85 }}>
            <div className="eyebrow">Outcome</div><p>{scenario.outcome}</p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

export default function App() {
  const [selected, setSelected] = useState('pricing');
  const [run, setRun] = useState(1);
  const scenario = useMemo(() => scenarios[selected], [selected]);

  function choose(id) {
    setSelected(id);
    setRun((value) => value + 1);
  }

  return (
    <main className="app">
      <div className="pageGlow glowOne" />
      <div className="pageGlow glowTwo" />
      <div className="wrap">
        <header className="header">
          <div className="brand">
            <div className="brandMark"><img src="/icon.svg" alt="" /></div>
            <div><div className="eyebrow">MBMApps</div><div className="brandName">Development Control Plane</div></div>
          </div>
          <div className="legend">
            <span><i className="legendDot affected" />Affected</span>
            <span><i className="legendDot retained" />Retained</span>
            <span><i className="legendDot blocked" />Blocked</span>
          </div>
        </header>

        <motion.section className="hero" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .85, ease: [.22,1,.36,1] }}>
          <div className="eyebrow">Interactive workflow simulation</div>
          <h1>One change.<br />Multiple systems.<br /><span>One evidence-backed path.</span></h1>
          <p>Explore a model of how Decision Intelligence, Design Intelligence, agent orchestration, evidence, validation, and repository-specific authority can coordinate multi-repository change.</p>
        </motion.section>

        <div className="scenarioGrid" role="group" aria-label="Choose a system event">
          {order.map((id,index) => (
            <motion.button
              key={id}
              type="button"
              className={'scenarioButton ' + (selected === id ? 'selected' : '')}
              aria-pressed={selected === id}
              onClick={() => choose(id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: .985 }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * .08, type: 'spring', stiffness: 280, damping: 24 }}
            >
              <small>{scenarios[id].category}</small>
              <strong>{scenarios[id].title}</strong>
            </motion.button>
          ))}
        </div>

        <div className="workspace">
          <ControlGraph scenario={scenario} run={run} replay={() => setRun((value) => value + 1)} />
          <aside className="side">
            <div className="metrics">
              {[['Affected',scenario.affected.length],['Retained',scenario.retained.length],['Repos',scenario.repos]].map(([label,value]) => (
                <motion.div className="metric" key={label} layout>
                  <span>{label}</span><motion.strong key={value} initial={{ opacity: 0, scale: .82 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>{value}</motion.strong>
                </motion.div>
              ))}
            </div>
            <ImpactPanel scenario={scenario} />
            <Trace scenario={scenario} run={run} />
          </aside>
        </div>

        <section className="principle">
          <b>Operating principle</b>
          <p>In this simulation, ripple does not mean blast radius. The model keeps unaffected work visible, routes only the work implied by the scenario, and treats proof as the completion condition.</p>
        </section>
      </div>
    </main>
  );
}
