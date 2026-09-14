import {
  RotateCcw, ChevronDown, Play, SlidersHorizontal, History, Radar,
  LineChart, UserRoundCheck, Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { USE_CASES } from "../lib/scenario.js";

function Toggle({ checked, onChange, label, icon: Icon }) {
  return (
    <label className="toggle-row">
      <span className="toggle-label"><Icon size={15} />{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="toggle-control" aria-hidden="true"><span /></span>
    </label>
  );
}

function SliderRow({ label, value, min, max, step, suffix, formatter, onChange }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="slider-row">
      <div className="slider-label">
        <span>{label}</span>
        <output>{formatter ? formatter(value) : `${value}${suffix ?? ""}`}</output>
      </div>
      <div className="slider-wrap">
        <div className="slider-fill" style={{ width: `${pct}%` }} aria-hidden="true" />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={label}
        />
      </div>
    </div>
  );
}

export default function ScenarioBuilder({
  scenario, setScenario, running, progress, onRun, onReset,
}) {
  const useCase = USE_CASES[scenario.useCase];
  const update = (patch) => setScenario((current) => ({ ...current, ...patch }));

  return (
    <aside className="panel scenario-panel" id="product">
      <div className="panel-heading scenario-heading">
        <div>
          <div className="heading-row">
            <span className="heading-icon"><Sparkles size={20} /></span>
            <h2>Scenario Builder</h2>
          </div>
          <p>Describe a real-world situation and let the system reason through it.</p>
        </div>

        <button className="text-button" type="button" onClick={onReset}>
          <RotateCcw size={14} />Reset
        </button>
      </div>

      <section className="builder-section">
        <div className="step-heading">
          <span className="step-index">1</span><strong>Use Case</strong>
          <span className="section-help">Choose a workflow</span>
        </div>

        <div className="select-shell">
          <select
            value={scenario.useCase}
            onChange={(e) => {
              const next = e.target.value;
              update({ useCase: next, objective: USE_CASES[next].defaultObjective });
            }}
          >
            {Object.entries(USE_CASES).map(([key, item]) => (
              <option key={key} value={key}>{item.label}</option>
            ))}
          </select>

          <div className="select-display" aria-hidden="true">
            <span className="select-icon"><SlidersHorizontal size={18} /></span>
            <span><strong>{useCase.label}</strong><small>{useCase.description}</small></span>
            <ChevronDown size={16} />
          </div>
        </div>
      </section>

      <section className="builder-section">
        <div className="step-heading">
          <span className="step-index">2</span><strong>Objective</strong>
          <span className="muted-copy">(natural language)</span>
          <button
            className="section-help section-help-button"
            type="button"
            onClick={() => update({ objective: USE_CASES[scenario.useCase].defaultObjective })}
          >
            Template
          </button>
        </div>

        <div className="objective-shell">
          <textarea
            maxLength={500}
            value={scenario.objective}
            onChange={(e) => update({ objective: e.target.value })}
            aria-label="Scenario objective"
          />
          <span>{scenario.objective.length}/500</span>
        </div>

        <div className="prompt-chips">
          <button type="button" onClick={() => update({
            objective: `${scenario.objective.trim()} Include a measurable success threshold.`,
          })}>Add success threshold</button>
          <button type="button" onClick={() => update({
            objective: `${scenario.objective.trim()} Preserve current approval policy.`,
          })}>Add guardrail</button>
        </div>
      </section>

      <section className="builder-section">
        <div className="step-heading">
          <span className="step-index">3</span><strong>Parameters</strong>
          <span className="section-help">Live model</span>
        </div>

        <SliderRow
          label="Discount Amount" value={scenario.discount}
          min={0} max={30} step={1} suffix="%"
          onChange={(discount) => update({ discount })}
        />
        <SliderRow
          label="Contract Length" value={scenario.contractMonths}
          min={3} max={24} step={1}
          formatter={(v) => `${v} months`}
          onChange={(contractMonths) => update({ contractMonths })}
        />
        <SliderRow
          label="Deal Value" value={scenario.dealValue}
          min={50000} max={500000} step={10000}
          formatter={(v) => `$${v.toLocaleString()}`}
          onChange={(dealValue) => update({ dealValue })}
        />
      </section>

      <section className="builder-section">
        <div className="step-heading">
          <span className="step-index">4</span><strong>Additional Context</strong>
        </div>

        <div className="toggle-stack">
          <Toggle checked={scenario.includeHistory} onChange={(includeHistory) => update({ includeHistory })} label="Check customer history" icon={History} />
          <Toggle checked={scenario.includeCompetitive} onChange={(includeCompetitive) => update({ includeCompetitive })} label="Include competitive intelligence" icon={Radar} />
          <Toggle checked={scenario.runFinancial} onChange={(runFinancial) => update({ runFinancial })} label="Run financial impact simulation" icon={LineChart} />
          <Toggle checked={scenario.requireHumanApproval} onChange={(requireHumanApproval) => update({ requireHumanApproval })} label="Require human approval" icon={UserRoundCheck} />
        </div>
      </section>

      <div className="scenario-actions">
        <motion.button
          type="button" className="primary-run-button"
          onClick={onRun} disabled={running} whileTap={{ scale: 0.985 }}
        >
          <Play size={18} fill="currentColor" />
          {running ? "Running Agentic Analysis" : "Run Agentic Analysis"}
          <Sparkles size={17} />
        </motion.button>

        <div className="run-status">
          <div className="run-status-line">
            <span><span className={running ? "spinner running" : "spinner"} />{running ? "Analysis in progress..." : "Ready to analyze"}</span>
            <strong>{progress}%</strong>
          </div>
          <div className="progress-track">
            <motion.div className="progress-fill" animate={{ width: `${progress}%` }} />
          </div>
          <small>Eight stages retrieve, reason, simulate, verify, act, validate, and preserve proof.</small>
        </div>
      </div>
    </aside>
  );
}
