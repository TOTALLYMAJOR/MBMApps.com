import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bot,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  Database,
  FileSearch,
  GitBranch,
  History,
  Layers3,
  Network,
  Play,
  RotateCcw,
  Scale,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  UserRoundCheck,
  WalletCards,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  DEFAULT_SCENARIO,
  STAGES,
  buildCauseEffect,
  calculateOutcome,
} from "./lib/causeEffect.js";

const STAGE_META = {
  objective: {
    icon: Target,
    x: 50,
    y: 8,
    helper: "What changed?",
  },
  context: {
    icon: Network,
    x: 77,
    y: 18,
    helper: "What evidence applies?",
  },
  reconsider: {
    icon: GitBranch,
    x: 84,
    y: 42,
    helper: "What alternatives move?",
  },
  simulate: {
    icon: Layers3,
    x: 73,
    y: 68,
    helper: "What happens next?",
  },
  authority: {
    icon: ShieldCheck,
    x: 51,
    y: 82,
    helper: "May the action commit?",
  },
  act: {
    icon: Play,
    x: 27,
    y: 78,
    helper: "What is permitted?",
  },
  validate: {
    icon: CheckCircle2,
    x: 12,
    y: 58,
    helper: "Did the decision hold?",
  },
  memory: {
    icon: Database,
    x: 15,
    y: 28,
    helper: "What should persist?",
  },
};

const EDGES = [
  ["objective", "context"],
  ["context", "reconsider"],
  ["reconsider", "simulate"],
  ["simulate", "authority"],
  ["authority", "act"],
  ["act", "validate"],
  ["validate", "memory"],
  ["memory", "objective"],
];

const METRIC_META = {
  Confidence: { icon: BadgeCheck, suffix: "%" },
  "Residual risk": { icon: ShieldCheck, suffix: "%" },
  Margin: { icon: BarChart3, suffix: "%" },
  "Win probability": { icon: TrendingUp, suffix: "%" },
  "Revenue protected": { icon: WalletCards, money: true },
};

function formatMoney(value) {
  return `$${Math.round(value).toLocaleString()}`;
}

function recommendationTone(code) {
  if (code === "approve") return "approve";
  if (code === "conditional") return "conditional";
  return "escalate";
}

function FactSlider({
  label,
  value,
  min,
  max,
  step,
  formatter,
  baseline,
  onChange,
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const changed = value !== baseline;

  return (
    <div className={`fact-control ${changed ? "changed" : ""}`}>
      <div className="fact-control-head">
        <span>{label}</span>
        <output>{formatter(value)}</output>
      </div>

      <div className="fact-slider">
        <span className="fact-slider-track" />
        <span className="fact-slider-fill" style={{ width: `${pct}%` }} />
        <input
          aria-label={label}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      </div>

      <div className="fact-foot">
        <span>Baseline {formatter(baseline)}</span>
        {changed && (
          <strong>
            {value > baseline ? "↑" : "↓"} {formatter(Math.abs(value - baseline))}
          </strong>
        )}
      </div>
    </div>
  );
}

function ScenarioWorkbench({
  scenario,
  setScenario,
  baseline,
  trace,
  onRunFull,
  onCommitBaseline,
  runningMode,
}) {
  const patch = (next) =>
    setScenario((current) => ({ ...current, ...next }));

  return (
    <aside className="surface scenario-workbench">
      <div className="surface-heading">
        <div>
          <span className="eyebrow">CAUSE INPUTS</span>
          <h2>Scenario Workbench</h2>
          <p>Change one fact and watch the decision system recompute itself.</p>
        </div>
        <button
          className="icon-reset"
          type="button"
          aria-label="Reset scenario"
          onClick={() => setScenario(DEFAULT_SCENARIO)}
        >
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="scenario-summary">
        <span className="scenario-badge">
          <SlidersHorizontal size={14} />
          Pricing decision
        </span>
        <p>
          Evaluate a commercial discount while preserving margin, policy, and
          confidence thresholds.
        </p>
      </div>

      <div className="stress-presets" aria-label="Scenario presets">
        <button type="button" onClick={() => patch({ discount: 22 })}>High discount</button>
        <button type="button" onClick={() => patch({ evidenceCoverage: 4 })}>Thin evidence</button>
        <button type="button" onClick={() => patch({ contractMonths: 3 })}>Short contract</button>
        <button
          type="button"
          onClick={() =>
            setScenario((current) => ({
              ...current,
              discount: 10,
              contractMonths: 18,
              evidenceCoverage: 9,
              requireHumanApproval: false,
            }))
          }
        >
          Safer case
        </button>
      </div>

      <div className="fact-stack">
        <FactSlider
          label="Discount"
          value={scenario.discount}
          baseline={baseline.discount}
          min={0}
          max={30}
          step={1}
          formatter={(value) => `${value}%`}
          onChange={(discount) => patch({ discount })}
        />

        <FactSlider
          label="Contract length"
          value={scenario.contractMonths}
          baseline={baseline.contractMonths}
          min={3}
          max={24}
          step={1}
          formatter={(value) => `${value} mo`}
          onChange={(contractMonths) => patch({ contractMonths })}
        />

        <FactSlider
          label="Deal value"
          value={scenario.dealValue}
          baseline={baseline.dealValue}
          min={50000}
          max={500000}
          step={10000}
          formatter={(value) => `$${Math.round(value / 1000)}K`}
          onChange={(dealValue) => patch({ dealValue })}
        />

        <FactSlider
          label="Evidence coverage"
          value={scenario.evidenceCoverage}
          baseline={baseline.evidenceCoverage}
          min={3}
          max={9}
          step={1}
          formatter={(value) => `${value}/9`}
          onChange={(evidenceCoverage) => patch({ evidenceCoverage })}
        />
      </div>

      <label className="human-gate">
        <span>
          <UserRoundCheck size={17} />
          <span>
            <strong>Require human approval</strong>
            <small>Add a governance gate before action.</small>
          </span>
        </span>

        <input
          type="checkbox"
          checked={scenario.requireHumanApproval}
          onChange={(event) =>
            patch({ requireHumanApproval: event.target.checked })
          }
        />
        <span className="switch" aria-hidden="true">
          <span />
        </span>
      </label>

      <div className="changed-facts">
        <div className="changed-facts-head">
          <strong>Changed facts</strong>
          <span>{trace.facts.length}</span>
        </div>

        {trace.facts.length === 0 ? (
          <div className="empty-diff">
            Change a fact to generate a causal trace.
          </div>
        ) : (
          trace.facts.map((fact) => (
            <div className="fact-diff" key={fact.key}>
              <span>{fact.label}</span>
              <strong>
                {fact.fromLabel}
                <ChevronRight size={12} />
                {fact.toLabel}
              </strong>
            </div>
          ))
        )}
      </div>

      <div className="workbench-actions">
        <motion.button
          type="button"
          className="primary-action"
          onClick={onRunFull}
          whileTap={{ scale: 0.985 }}
          disabled={runningMode === "full"}
        >
          <Play size={16} fill="currentColor" />
          {runningMode === "full" ? "Tracing full decision..." : "Run full trace"}
        </motion.button>

        <button
          type="button"
          className="secondary-action"
          disabled={trace.facts.length === 0}
          onClick={onCommitBaseline}
        >
          <History size={15} />
          Set current as baseline
        </button>
      </div>
    </aside>
  );
}

function NetworkPaths({ impactedStages, activeStage, visitedStages }) {
  const impacted = new Set(impactedStages);
  const visited = new Set(visitedStages);

  return (
    <svg
      className="network-paths"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <filter id="traceGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {EDGES.map(([from, to]) => {
        const a = STAGE_META[from];
        const b = STAGE_META[to];
        const involved = impacted.has(from) || impacted.has(to);
        const reached = visited.has(to) || to === activeStage;

        return (
          <g key={`${from}-${to}`}>
            <path
              d={`M ${a.x} ${a.y} Q ${(a.x + b.x) / 2} ${
                (a.y + b.y) / 2 - 3
              } ${b.x} ${b.y}`}
              className="network-edge-base"
            />
            <motion.path
              d={`M ${a.x} ${a.y} Q ${(a.x + b.x) / 2} ${
                (a.y + b.y) / 2 - 3
              } ${b.x} ${b.y}`}
              className={`network-edge-trace ${
                involved ? "involved" : ""
              } ${reached ? "reached" : ""}`}
              strokeDasharray="2.2 2.8"
              filter={involved ? "url(#traceGlow)" : undefined}
              animate={{ strokeDashoffset: [0, -14] }}
              transition={{ duration: involved ? 1.1 : 2.8, repeat: Infinity, ease: "linear" }}
            />
          </g>
        );
      })}
    </svg>
  );
}

function StageNode({
  stage,
  affected,
  active,
  visited,
  message,
  onSelect,
  selected,
}) {
  const meta = STAGE_META[stage.id];
  const Icon = meta.icon;

  return (
    <motion.button
      type="button"
      className={`stage-node ${affected ? "affected" : ""} ${
        active ? "active" : ""
      } ${visited ? "visited" : ""} ${selected ? "selected" : ""}`}
      style={{ left: `${meta.x}%`, top: `${meta.y}%` }}
      onClick={() => onSelect(stage.id)}
      whileTap={{ scale: 0.98 }}
      animate={
        active
          ? {
              boxShadow: [
                "0 0 0 rgba(76,255,156,0)",
                "0 0 30px rgba(76,255,156,.2)",
                "0 0 0 rgba(76,255,156,0)",
              ],
            }
          : {}
      }
      transition={{ duration: 1.2, repeat: active ? Infinity : 0 }}
    >
      <span className="stage-icon">
        <Icon size={18} />
      </span>
      <span className="stage-copy">
        <span className="stage-title">
          <strong>{stage.label}</strong>
          {affected && <i>{visited || active ? "updated" : "affected"}</i>}
        </span>
        <small>{active ? message : meta.helper}</small>
      </span>
    </motion.button>
  );
}

function TraceCore({ activeStage, trace, runningMode }) {
  const stage = STAGES.find((item) => item.id === activeStage);
  const active = stage || STAGES[0];
  const MetaIcon = STAGE_META[active.id].icon;

  return (
    <motion.div
      className="trace-core"
      animate={
        runningMode
          ? { scale: [1, 1.015, 1], rotate: [0, 0.25, 0, -0.25, 0] }
          : {}
      }
      transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div
        className="orbit orbit-a"
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="orbit orbit-b"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      <div className="core-grid" />

      <AnimatePresence mode="wait">
        <motion.div
          key={`${active.id}-${runningMode ?? "idle"}`}
          className="trace-core-copy"
          initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
          transition={{ duration: 0.24 }}
        >
          <MetaIcon size={23} />
          <span className="core-eyebrow">
            {runningMode ? "PROPAGATING CHANGE" : "CURRENT DECISION"}
          </span>
          <strong>{active.label}</strong>
          <p>{trace.stageMessages[active.id]}</p>
        </motion.div>
      </AnimatePresence>

      <div className={`core-severity severity-${trace.severity}`}>
        <span />
        {trace.severity === "high"
          ? "Material decision change"
          : trace.severity === "medium"
          ? "Material metric movement"
          : "Low-impact update"}
      </div>
    </motion.div>
  );
}

function CausalGraph({
  trace,
  activeStage,
  visitedStages,
  runningMode,
}) {
  const [selectedStage, setSelectedStage] = useState("simulate");
  const selectedMessage = trace.stageMessages[selectedStage];
  const affected = new Set(trace.impactedStages);
  const visited = new Set(visitedStages);

  return (
    <section className="surface graph-surface">
      <div className="graph-toolbar">
        <div>
          <span className="eyebrow">LIVE PROPAGATION</span>
          <h2>Cause → reasoning → consequence</h2>
        </div>

        <div className="live-status">
          <span className={runningMode ? "pulse-dot fast" : "pulse-dot"} />
          {runningMode
            ? runningMode === "full"
              ? "Full trace running"
              : "Live propagation"
            : "System stable"}
        </div>
      </div>

      <div className="graph-stage">
        <NetworkPaths
          impactedStages={trace.impactedStages}
          activeStage={activeStage}
          visitedStages={visitedStages}
        />

        {STAGES.map((stage) => (
          <StageNode
            key={stage.id}
            stage={stage}
            affected={affected.has(stage.id)}
            active={activeStage === stage.id}
            visited={visited.has(stage.id)}
            message={trace.stageMessages[stage.id]}
            selected={selectedStage === stage.id}
            onSelect={setSelectedStage}
          />
        ))}

        <TraceCore
          activeStage={activeStage || selectedStage}
          trace={trace}
          runningMode={runningMode}
        />
      </div>

      <div className="selected-stage-detail">
        <span className="selected-stage-label">
          {STAGE_META[selectedStage].helper}
        </span>
        <strong>{selectedMessage}</strong>
      </div>

      <div className="causal-ribbon">
        <span className="ribbon-title">Causal route</span>
        <div className="ribbon-route">
          {trace.impactedStages.length === 0 ? (
            <span className="ribbon-empty">No changed facts.</span>
          ) : (
            trace.impactedStages.map((stageId, index) => (
              <span className="route-step" key={stageId}>
                <span
                  className={
                    activeStage === stageId
                      ? "route-pill active"
                      : visited.has(stageId)
                      ? "route-pill visited"
                      : "route-pill"
                  }
                >
                  {STAGES.find((stage) => stage.id === stageId)?.label}
                </span>
                {index < trace.impactedStages.length - 1 && (
                  <ArrowRight size={13} />
                )}
              </span>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function DeltaCard({ metric }) {
  const meta = METRIC_META[metric.label];
  const Icon = meta.icon;
  const improving =
    metric.label === "Residual risk" ? metric.delta < 0 : metric.delta > 0;
  const flat = Math.abs(metric.delta) < 0.05;

  return (
    <motion.article
      className={`delta-card ${flat ? "flat" : improving ? "positive" : "negative"}`}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="delta-card-head">
        <span className="delta-icon">
          <Icon size={17} />
        </span>
        <span>{metric.label}</span>
        {!flat &&
          (improving ? (
            <TrendingUp size={14} />
          ) : (
            <TrendingDown size={14} />
          ))}
      </div>

      <div className="delta-values">
        <span>{metric.before}</span>
        <ArrowRight size={13} />
        <strong>{metric.after}</strong>
      </div>

      <small>{metric.text}</small>
    </motion.article>
  );
}

function OutcomePanel({ trace }) {
  const after = trace.after;
  const before = trace.before;
  const tone = recommendationTone(after.recommendationCode);

  return (
    <aside className="surface outcome-surface">
      <div className="surface-heading">
        <div>
          <span className="eyebrow">DOWNSTREAM EFFECT</span>
          <h2>Impact Simulator</h2>
          <p>The recommendation is derived from the propagated state.</p>
        </div>
        <Activity size={20} className="heading-symbol" />
      </div>

      <div className="outcome-metrics">
        {trace.changedMetrics.length === 0 ? (
          <>
            <DeltaCard
              metric={{
                label: "Confidence",
                before: `${after.confidence} pts`,
                after: `${after.confidence} pts`,
                delta: 0,
                text: "No material change",
              }}
            />
            <DeltaCard
              metric={{
                label: "Residual risk",
                before: `${after.residualRisk} pts`,
                after: `${after.residualRisk} pts`,
                delta: 0,
                text: "No material change",
              }}
            />
          </>
        ) : (
          trace.changedMetrics.slice(0, 5).map((metric) => (
            <DeltaCard metric={metric} key={metric.label} />
          ))
        )}
      </div>

      <div className="decision-gate">
        <div className="gate-head">
          <span>
            <Scale size={17} />
            Authority result
          </span>
          <strong className={after.policyPass ? "gate-pass" : "gate-review"}>
            {after.policyPass ? "PASS" : "REVIEW"}
          </strong>
        </div>

        <div className="gate-rule">
          <span>Residual risk</span>
          <strong>{after.residualRisk}% ≤ 6.2%</strong>
        </div>
        <div className="gate-rule">
          <span>Evidence coverage</span>
          <strong>{after.evidenceCoverage}/9 sources</strong>
        </div>
      </div>

      <div className={`recommendation recommendation-${tone}`}>
        <span className="recommendation-kicker">
          <Sparkles size={15} />
          Recommendation
        </span>

        <AnimatePresence mode="wait">
          <motion.h3
            key={after.recommendation}
            initial={{ opacity: 0, y: 8, filter: "blur(3px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(3px)" }}
          >
            {after.recommendation}
          </motion.h3>
        </AnimatePresence>

        {trace.recommendationChanged && (
          <div className="recommendation-transition">
            <span>{before.recommendation}</span>
            <ArrowRight size={13} />
            <strong>{after.recommendation}</strong>
          </div>
        )}

        <p>{after.rationale}</p>
      </div>
    </aside>
  );
}

function EvidenceStrip({ scenario, baseline, trace }) {
  const sources = [
    { label: "CRM", available: scenario.evidenceCoverage >= 4 },
    { label: "Finance", available: scenario.evidenceCoverage >= 5 },
    { label: "Policy", available: scenario.evidenceCoverage >= 3 },
    { label: "Market", available: scenario.evidenceCoverage >= 6 },
    { label: "Legal", available: scenario.evidenceCoverage >= 7 },
    { label: "External", available: scenario.evidenceCoverage >= 8 },
    { label: "Exception", available: scenario.evidenceCoverage >= 9 },
  ];

  return (
    <section className="surface evidence-strip">
      <div className="evidence-strip-head">
        <div>
          <span className="eyebrow">EVIDENCE PROPAGATION</span>
          <h2>Coverage changes the decision, not just the explanation.</h2>
        </div>
        <div className="coverage-score">
          <strong>{scenario.evidenceCoverage}/9</strong>
          <span>
            baseline {baseline.evidenceCoverage}/9
          </span>
        </div>
      </div>

      <div className="evidence-sources">
        {sources.map((source, index) => (
          <motion.div
            key={source.label}
            className={`evidence-source ${
              source.available ? "available" : "missing"
            }`}
            animate={
              trace.facts.some((fact) => fact.key === "evidenceCoverage")
                ? { scale: [1, 1.03, 1] }
                : {}
            }
            transition={{ delay: index * 0.04 }}
          >
            <span>
              {source.available ? (
                <CheckCircle2 size={14} />
              ) : (
                <CircleAlert size={14} />
              )}
            </span>
            <strong>{source.label}</strong>
            <small>{source.available ? "validated" : "missing"}</small>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function AppHeader() {
  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-mark">
          <Bot size={20} />
        </span>
        <span>
          <strong>NexaMind</strong>
          <small>Cause & Effect Lab</small>
        </span>
      </div>

      <div className="header-thesis">
        <span>Evidence before action</span>
        <span>Simulation before commitment</span>
        <span>Authority before mutation</span>
      </div>

      <div className="system-online">
        <span className="pulse-dot" />
        System live
      </div>
    </header>
  );
}

export default function App() {
  const reducedMotion = useReducedMotion();
  const [baseline, setBaseline] = useState(DEFAULT_SCENARIO);
  const [scenario, setScenario] = useState(DEFAULT_SCENARIO);
  const [activeStage, setActiveStage] = useState(null);
  const [visitedStages, setVisitedStages] = useState([]);
  const [runningMode, setRunningMode] = useState(null);
  const propagationTimer = useRef(null);
  const sequenceTimers = useRef([]);

  const trace = useMemo(
    () => buildCauseEffect(baseline, scenario),
    [baseline, scenario]
  );

  const traceKey = useMemo(
    () =>
      trace.facts
        .map((fact) => `${fact.key}:${fact.from}->${fact.to}`)
        .join("|"),
    [trace.facts]
  );

  const clearTimers = () => {
    if (propagationTimer.current) {
      window.clearTimeout(propagationTimer.current);
      propagationTimer.current = null;
    }
    sequenceTimers.current.forEach((timer) => window.clearTimeout(timer));
    sequenceTimers.current = [];
  };

  const runSequence = (stages, mode = "live") => {
    clearTimers();

    if (stages.length === 0) {
      setActiveStage(null);
      setVisitedStages([]);
      setRunningMode(null);
      return;
    }

    setRunningMode(mode);
    setVisitedStages([]);
    setActiveStage(stages[0]);

    if (reducedMotion) {
      setVisitedStages(stages);
      setActiveStage(stages[stages.length - 1]);
      setRunningMode(null);
      return;
    }

    stages.forEach((stageId, index) => {
      const timer = window.setTimeout(() => {
        setActiveStage(stageId);
        setVisitedStages((current) =>
          current.includes(stageId) ? current : [...current, stageId]
        );

        if (index === stages.length - 1) {
          const finishTimer = window.setTimeout(() => {
            setRunningMode(null);
          }, 380);
          sequenceTimers.current.push(finishTimer);
        }
      }, index * (mode === "full" ? 410 : 300));

      sequenceTimers.current.push(timer);
    });
  };

  useEffect(() => {
    clearTimers();

    if (trace.facts.length === 0) {
      setActiveStage(null);
      setVisitedStages([]);
      setRunningMode(null);
      return undefined;
    }

    propagationTimer.current = window.setTimeout(() => {
      runSequence(trace.impactedStages, "live");
    }, 170);

    return clearTimers;
    // traceKey intentionally represents the fact-level change signature.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [traceKey, reducedMotion]);

  useEffect(() => clearTimers, []);

  const runFullTrace = () => {
    runSequence(STAGES.map((stage) => stage.id), "full");
  };

  const commitBaseline = () => {
    clearTimers();
    setBaseline(scenario);
    setActiveStage(null);
    setVisitedStages([]);
    setRunningMode(null);
  };

  const currentOutcome = calculateOutcome(scenario);

  return (
    <div className="app">
      <AppHeader />

      <main className="app-main">
        <section className="hero">
          <div>
            <span className="hero-eyebrow">
              <Zap size={14} />
              INTERACTIVE AGENTIC SYSTEMS DEMONSTRATOR
            </span>
            <h1>
              Change a fact. <span>Watch the decision change.</span>
            </h1>
            <p>
              This is not a static agent diagram. It is a causal model showing
              how commercial facts propagate through evidence, simulation,
              authority, validation, and recommendation.
            </p>
          </div>

          <div className="hero-score">
            <span>Current state</span>
            <strong>{currentOutcome.confidence}%</strong>
            <small>decision confidence</small>
          </div>
        </section>

        <div className="lab-grid">
          <ScenarioWorkbench
            scenario={scenario}
            setScenario={setScenario}
            baseline={baseline}
            trace={trace}
            onRunFull={runFullTrace}
            onCommitBaseline={commitBaseline}
            runningMode={runningMode}
          />

          <CausalGraph
            trace={trace}
            activeStage={activeStage}
            visitedStages={visitedStages}
            runningMode={runningMode}
          />

          <OutcomePanel trace={trace} />
        </div>

        <EvidenceStrip
          scenario={scenario}
          baseline={baseline}
          trace={trace}
        />
      </main>
    </div>
  );
}
