import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import TopBar from "./components/TopBar.jsx";
import ScenarioBuilder from "./components/ScenarioBuilder.jsx";
import DecisionFlow from "./components/DecisionFlow.jsx";
import ImpactSimulator from "./components/ImpactSimulator.jsx";
import BottomPanels from "./components/BottomPanels.jsx";
import { USE_CASES, calculateOutcome } from "./lib/scenario.js";

const DEFAULT_SCENARIO = {
  useCase: "pricing",
  objective: USE_CASES.pricing.defaultObjective,
  discount: 15,
  contractMonths: 12,
  dealValue: 250000,
  includeHistory: true,
  includeCompetitive: true,
  runFinancial: true,
  requireHumanApproval: false,
};

export default function App() {
  const [scenario, setScenario] = useState(DEFAULT_SCENARIO);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [actionTaken, setActionTaken] = useState(false);

  const outcome = useMemo(() => calculateOutcome(scenario), [scenario]);
  const activeStep = Math.min(7, Math.floor(progress / 12.5));
  const completed = Array.from({ length: activeStep }, (_, index) => index)
    .filter(() => progress > 0);

  useEffect(() => {
    if (!running) return undefined;

    const timer = window.setInterval(() => {
      setProgress((current) => {
        const next = Math.min(100, current + 2);
        if (next >= 100) {
          window.clearInterval(timer);
          setRunning(false);
        }
        return next;
      });
    }, 110);

    return () => window.clearInterval(timer);
  }, [running]);

  const runAnalysis = () => {
    setActionTaken(false);
    setProgress(0);
    setRunning(true);
  };

  const reset = () => {
    setScenario(DEFAULT_SCENARIO);
    setProgress(0);
    setRunning(false);
    setActionTaken(false);
  };

  return (
    <div className="app-shell" id="top">
      <TopBar />

      <main className="app-main">
        <section className="hero-copy">
          <div>
            <span className="hero-kicker">AGENTIC DECISION LAB</span>
            <h1>
              From complex decisions to <span>confident outcomes.</span>
            </h1>
            <p>
              A live demonstration of systems that retrieve evidence, reconsider,
              simulate consequences, respect authority, validate outcomes, and
              preserve proof.
            </p>
          </div>

          <motion.div
            className="hero-principle"
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="vertical-line" />
            <span>
              <strong>A SAFER, BRIGHTER FUTURE</strong>
              THROUGH AGENTIC SYSTEMS
            </span>
          </motion.div>
        </section>

        <div className="workspace-grid">
          <ScenarioBuilder
            scenario={scenario}
            setScenario={setScenario}
            running={running}
            progress={progress}
            onRun={runAnalysis}
            onReset={reset}
          />

          <DecisionFlow
            scenario={scenario}
            outcome={outcome}
            running={running}
            progress={progress}
            activeStep={activeStep}
            completed={completed}
          />

          <ImpactSimulator
            outcome={outcome}
            actionTaken={actionTaken}
            onTakeAction={() => setActionTaken(true)}
          />
        </div>

        <BottomPanels outcome={outcome} />
      </main>

      <footer className="app-footer">
        <div className="brand footer-brand">
          <span className="brand-mark"><span /><span /><span /></span>
          <strong>NexaMind</strong>
        </div>
        <span>Agentic AI for better business decisions.</span>
        <div className="footer-status">
          <span className="pulse-dot" />
          System Operational
        </div>
      </footer>
    </div>
  );
}
