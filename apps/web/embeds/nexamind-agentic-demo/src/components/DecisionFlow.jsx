import { useMemo, useState } from "react";
import {
  Target, Network, FileSearch, Box, ShieldCheck, Play, CheckCircle2,
  Database, Activity, Workflow, GitCompareArrows, FileStack, Scale,
  CircleCheck, CircleDashed,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { buildScenarioVariants, EVIDENCE_SOURCES } from "../lib/scenario.js";

const STEPS = [
  { id: "objective", title: "Objective", subtitle: "Parsed and structured", icon: Target, x: 28, y: 6 },
  { id: "context", title: "Context", subtitle: "Relevant data + policy", icon: Network, x: 60, y: 6 },
  { id: "reconsider", title: "Reconsider", subtitle: "Stress-test alternatives", icon: FileSearch, x: 74, y: 28 },
  { id: "simulate", title: "Simulate", subtitle: "Model downstream outcomes", icon: Box, x: 75, y: 55 },
  { id: "authority", title: "Authority Check", subtitle: "Policy + risk boundary", icon: ShieldCheck, x: 56, y: 76 },
  { id: "act", title: "Act", subtitle: "Prepare bounded action", icon: Play, x: 25, y: 76 },
  { id: "validate", title: "Validate", subtitle: "Compare outcome to intent", icon: CheckCircle2, x: 7, y: 56 },
  { id: "memory", title: "Memory", subtitle: "Feed result forward", icon: Database, x: 8, y: 28 },
];

const TABS = [
  ["flow", "Agentic Decision Flow", Workflow],
  ["simulation", "Simulation View", GitCompareArrows],
  ["evidence", "Evidence Map", FileStack],
  ["policy", "Policy & Rules", Scale],
];

function FlowNode({ step, index, activeStep, completed, running, setFocusedStep }) {
  const Icon = step.icon;
  const active = index === activeStep;
  const isComplete = completed.includes(index);

  return (
    <motion.button
      type="button"
      className={`flow-node ${active ? "active" : ""} ${isComplete ? "complete" : ""}`}
      style={{ left: `${step.x}%`, top: `${step.y}%` }}
      onPointerEnter={() => setFocusedStep(index)}
      onPointerLeave={() => setFocusedStep(null)}
      onFocus={() => setFocusedStep(index)}
      onBlur={() => setFocusedStep(null)}
      animate={
        active && running
          ? { boxShadow: ["0 0 0 rgba(63,255,154,0)", "0 0 34px rgba(63,255,154,.24)", "0 0 0 rgba(63,255,154,0)"] }
          : {}
      }
      transition={{ duration: 1.4, repeat: active && running ? Infinity : 0 }}
    >
      <span className="flow-node-icon"><Icon size={20} /></span>
      <span className="flow-node-copy">
        <span className="flow-node-title">
          <strong>{index + 1}. {step.title}</strong>
          {isComplete ? <CircleCheck size={14} /> : active && running ? <CircleDashed size={14} className="spin-icon" /> : null}
        </span>
        <small>{active && running ? "Working..." : step.subtitle}</small>
      </span>
    </motion.button>
  );
}

function FlowView({ activeStep, completed, running, progress, scenario, outcome }) {
  const [focusedStep, setFocusedStep] = useState(null);
  const displayStep = focusedStep ?? activeStep;
  const active = STEPS[displayStep] ?? STEPS[0];
  const ActiveIcon = active.icon;

  return (
    <div className="decision-stage">
      <svg className="decision-routes" viewBox="0 0 1000 680" preserveAspectRatio="none" aria-hidden="true">
        <ellipse cx="500" cy="340" rx="420" ry="250" className="route-base" />
        <motion.ellipse
          cx="500" cy="340" rx="420" ry="250"
          className="route-dash" strokeDasharray="12 18"
          animate={{ strokeDashoffset: [0, -120] }}
          transition={{ duration: 3.2, ease: "linear", repeat: Infinity }}
        />
      </svg>

      <div className="learn-label">Learn<br />and improve</div>
      <div className="reason-label">Continuous<br />reasoning</div>

      {STEPS.map((step, index) => (
        <FlowNode
          key={step.id}
          step={step}
          index={index}
          activeStep={activeStep}
          completed={completed}
          running={running}
          setFocusedStep={setFocusedStep}
        />
      ))}

      <motion.div
        className="analysis-core"
        animate={running ? { scale: [1, 1.018, 1], rotate: [0, 0.35, 0, -0.35, 0] } : {}}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div className="core-orbit orbit-one" animate={{ rotate: 360 }} transition={{ duration: 24, repeat: Infinity, ease: "linear" }} />
        <motion.div className="core-orbit orbit-two" animate={{ rotate: -360 }} transition={{ duration: 17, repeat: Infinity, ease: "linear" }} />
        <div className="core-mesh" />

        <AnimatePresence mode="wait">
          <motion.div
            className="core-copy"
            key={`${active.id}-${running}`}
            initial={{ opacity: 0, y: 7, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -7, filter: "blur(4px)" }}
          >
            <ActiveIcon size={21} className="core-step-icon" />
            <span className="core-kicker">{running ? "ANALYZING YOUR SCENARIO" : "DECISION SYSTEM READY"}</span>
            <strong>{active.title}</strong>
            <small>
              {running
                ? `${active.subtitle} · ${progress}% complete`
                : `Current recommendation: ${outcome.recommendation}`}
            </small>
          </motion.div>
        </AnimatePresence>

        <div className="core-dots">
          {STEPS.map((_, index) => (
            <span
              key={index}
              className={index === activeStep ? "current" : completed.includes(index) ? "done" : ""}
            />
          ))}
        </div>
      </motion.div>

      <div className="stage-status">
        <Activity size={15} />
        {running
          ? `${active.title}: processing evidence and consequences...`
          : `${scenario.discount}% discount · ${scenario.contractMonths} months · ${outcome.confidence}% confidence`}
      </div>
    </div>
  );
}

function SimulationView({ scenario }) {
  const variants = useMemo(() => buildScenarioVariants(scenario), [scenario]);

  return (
    <div className="tab-body simulation-view">
      <div className="tab-intro">
        <span className="mini-kicker">COUNTERFACTUAL MODEL</span>
        <h3>Three futures, one decision.</h3>
        <p>The system compares consequences before allowing the real-world action to cross the authority boundary.</p>
      </div>

      <div className="variant-grid">
        {variants.map((variant, index) => (
          <motion.article
            key={variant.id}
            className={`variant-card ${index === 1 ? "recommended" : ""}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <div className="variant-top">
              <strong>{variant.label}</strong>
              {index === 1 && <span>Recommended</span>}
            </div>
            <div className="variant-metric"><span>Confidence</span><strong>{variant.outcome.confidence}%</strong></div>
            <div className="variant-metric"><span>Policy risk</span><strong>{variant.outcome.residualRisk}%</strong></div>
            <div className="variant-metric"><span>Revenue protected</span><strong>${(variant.outcome.revenueProtected / 1000).toFixed(0)}K</strong></div>
            <div className="variant-bar"><span style={{ width: `${variant.outcome.confidence}%` }} /></div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function EvidenceMap() {
  return (
    <div className="tab-body evidence-map">
      <div className="tab-intro">
        <span className="mini-kicker">PROVENANCE GRAPH</span>
        <h3>Every conclusion points back to evidence.</h3>
        <p>Evidence can influence the recommendation without automatically becoming authority to execute it.</p>
      </div>

      <div className="evidence-map-grid">
        <div className="evidence-hub">
          <FileStack size={22} />
          <strong>Decision Package</strong>
          <small>6 sources linked</small>
        </div>

        {EVIDENCE_SOURCES.slice(0, 5).map((source, index) => (
          <motion.div
            key={source.id}
            className="evidence-map-node"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.07 }}
          >
            <span className="source-dot" />
            <strong>{source.label}</strong>
            <small>{source.system}</small>
            <em>{source.confidence}%</em>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PolicyView({ scenario, outcome }) {
  const rules = [
    { label: "Direct discount authority", detail: "≤ 12%", pass: scenario.discount <= 12 },
    { label: "Conditional approval band", detail: "≤ 18%", pass: scenario.discount <= 18 },
    { label: "Residual policy risk", detail: "≤ 6.2%", pass: outcome.residualRisk <= 6.2 },
    { label: "Evidence coverage", detail: "≥ 7 sources", pass: outcome.evidenceCoverage >= 7 },
    { label: "Human approval", detail: scenario.requireHumanApproval ? "Required" : "Optional", pass: true },
  ];

  return (
    <div className="tab-body policy-view">
      <div className="tab-intro">
        <span className="mini-kicker">AUTHORITY BOUNDARY</span>
        <h3>Reasoning can recommend. Policy decides what may commit.</h3>
      </div>

      <div className="policy-list">
        {rules.map((rule) => (
          <div className={`policy-row ${rule.pass ? "pass" : "fail"}`} key={rule.label}>
            <span className="policy-status">
              {rule.pass ? <CircleCheck size={17} /> : <CircleDashed size={17} />}
            </span>
            <span><strong>{rule.label}</strong><small>{rule.detail}</small></span>
            <em>{rule.pass ? "PASS" : "REVIEW"}</em>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DecisionFlow({ scenario, outcome, running, progress, activeStep, completed }) {
  const [tab, setTab] = useState("flow");

  return (
    <section className="panel decision-panel" id="lab">
      <div className="decision-tabs">
        <div className="tab-list">
          {TABS.map(([id, label, Icon]) => (
            <button key={id} className={tab === id ? "active" : ""} type="button" onClick={() => setTab(id)}>
              <Icon size={16} />{label}
            </button>
          ))}
        </div>
        <span className="live-pill"><span className="pulse-dot" />Live</span>
      </div>

      {tab === "flow" && (
        <FlowView
          activeStep={activeStep} completed={completed} running={running}
          progress={progress} scenario={scenario} outcome={outcome}
        />
      )}
      {tab === "simulation" && <SimulationView scenario={scenario} />}
      {tab === "evidence" && <EvidenceMap />}
      {tab === "policy" && <PolicyView scenario={scenario} outcome={outcome} />}
    </section>
  );
}
