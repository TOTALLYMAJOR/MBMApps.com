import {
  BarChart3, DollarSign, ShieldCheck, Clock3, Gauge, BadgeCheck,
  Sparkles, ArrowRight, FileText,
} from "lucide-react";
import { motion } from "framer-motion";

function MetricCard({ icon: Icon, label, value, supporting, positive }) {
  return (
    <motion.article className="metric-card" whileHover={{ y: -3 }}>
      <div className="metric-icon"><Icon size={21} /></div>
      <div>
        <span>{label}</span><strong>{value}</strong>
        <small className={positive ? "metric-positive" : ""}>{supporting}</small>
      </div>
    </motion.article>
  );
}

export default function ImpactSimulator({ outcome, onTakeAction, actionTaken }) {
  return (
    <aside className="panel impact-panel" id="impact">
      <div className="panel-heading">
        <div>
          <div className="heading-row">
            <span className="heading-icon"><BarChart3 size={20} /></span>
            <h2>Impact Simulator</h2>
          </div>
          <p>Real outcomes. Measurable business value.</p>
        </div>
      </div>

      <div className="impact-tabs">
        <button type="button" className="active">Projected Outcome</button>
        <button type="button">Before vs After</button>
      </div>

      <div className="metric-grid">
        <MetricCard icon={DollarSign} label="Revenue Impact" value={`+$${Math.round(outcome.revenueProtected / 1000)}K`} supporting="incremental protected value" positive />
        <MetricCard icon={BarChart3} label="Margin Impact" value={`+${outcome.marginDelta} pts`} supporting={`${outcome.simulatedMargin}% modeled margin`} positive />
        <MetricCard icon={ShieldCheck} label="Risk Reduced" value={`${outcome.riskReduced}%`} supporting={`from ${outcome.baselineRisk}% to ${outcome.residualRisk}%`} positive />
        <MetricCard icon={Clock3} label="Time Saved" value={`${outcome.timeSaved} hrs`} supporting={`from ${outcome.baselineHours} to ${outcome.simulatedHours}`} positive />
        <MetricCard icon={Gauge} label="Confidence Level" value={`${outcome.confidence}%`} supporting={`${outcome.evidenceCoverage} evidence sources`} />
        <MetricCard icon={BadgeCheck} label="Policy Compliance" value={outcome.policyPass ? "Pass" : "Review"} supporting={outcome.policyPass ? "inside modeled guardrails" : "authority escalation required"} positive={outcome.policyPass} />
      </div>

      <motion.div className={`recommendation-card ${actionTaken ? "committed" : ""}`} layout>
        <div className="recommendation-top">
          <span><Sparkles size={16} />Recommended Action</span>
          <em>{outcome.confidence >= 90 ? "High Confidence" : "Reviewed"}</em>
        </div>
        <h3>{actionTaken ? "Action Package Prepared" : outcome.recommendation}</h3>
        <p>
          {actionTaken
            ? "The recommendation, evidence receipt, policy result, and rollback context are packaged for the next authorized step."
            : outcome.rationale}
        </p>
        <div className="recommendation-actions">
          <motion.button type="button" className="take-action" onClick={onTakeAction} whileTap={{ scale: 0.98 }}>
            {actionTaken ? "Prepared" : "Take Action"}<ArrowRight size={16} />
          </motion.button>
          <button type="button" className="rationale-button"><FileText size={15} />View Rationale</button>
        </div>
      </motion.div>
    </aside>
  );
}
