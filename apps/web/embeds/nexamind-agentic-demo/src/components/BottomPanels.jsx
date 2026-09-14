import { useState } from "react";
import {
  BarChart3, FileText, CheckCircle2, AlertTriangle, ExternalLink,
  Database, Landmark, Globe2, Scale, ScanSearch,
} from "lucide-react";
import { EVIDENCE_SOURCES } from "../lib/scenario.js";

const ICONS = {
  crm: Database, finance: Landmark, market: Globe2, legal: Scale,
  web: ScanSearch, regional: AlertTriangle,
};
const money = (v) => `$${Math.round(v).toLocaleString()}`;

export default function BottomPanels({ outcome }) {
  const [view, setView] = useState("all");
  const sources = EVIDENCE_SOURCES.filter((source) =>
    view === "all" ? true : view === "verified" ? source.status === "verified" : source.status === "open"
  );

  const metrics = [
    { label: "Annual Revenue", before: money(outcome.annualizedRevenue), after: money(outcome.simulatedRevenue), change: `+$${Math.round(outcome.revenueProtected / 1000)}K` },
    { label: "Gross Margin", before: `${outcome.baselineMargin}%`, after: `${outcome.simulatedMargin}%`, change: `+${outcome.marginDelta} pts` },
    { label: "Win Probability", before: `${outcome.baselineWin}%`, after: `${outcome.simulatedWin}%`, change: `+${outcome.simulatedWin - outcome.baselineWin} pts` },
    { label: "Policy Risk", before: `${outcome.baselineRisk}%`, after: `${outcome.residualRisk}%`, change: `-${outcome.riskReduced}%` },
  ];

  return (
    <div className="bottom-grid" id="evidence">
      <section className="panel comparison-panel">
        <div className="compact-panel-heading">
          <span><BarChart3 size={18} /><strong>Before vs. After</strong></span>
          <em>SIMULATED</em>
        </div>
        <div className="comparison-tabs">
          <button className="active" type="button">Financial</button>
          <button type="button">Customer</button>
          <button type="button">Risk</button>
          <button type="button">Operational</button>
        </div>
        <div className="comparison-table">
          <div className="comparison-row comparison-head"><span>Metric</span><span>Before</span><span>After</span><span>Change</span></div>
          {metrics.map((metric) => (
            <div className="comparison-row" key={metric.label}>
              <strong>{metric.label}</strong><span>{metric.before}</span>
              <span className="after-value">{metric.after}</span>
              <span className="change-positive">{metric.change}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel evidence-panel">
        <div className="compact-panel-heading evidence-heading">
          <span><FileText size={18} /><span><strong>Evidence & Receipts</strong><small>6 sources · 5 validated · 1 open</small></span></span>
          <div className="evidence-filters">
            <button className={view === "all" ? "active" : ""} type="button" onClick={() => setView("all")}>All</button>
            <button className={view === "verified" ? "active" : ""} type="button" onClick={() => setView("verified")}>Validated</button>
            <button className={view === "open" ? "active" : ""} type="button" onClick={() => setView("open")}>Open</button>
          </div>
        </div>

        <div className="evidence-card-row">
          {sources.map((source) => {
            const Icon = ICONS[source.id] ?? FileText;
            const verified = source.status === "verified";
            return (
              <article className={`source-card ${verified ? "" : "open-source"}`} key={source.id}>
                <div className="source-card-top"><span className="source-icon"><Icon size={17} /></span><ExternalLink size={13} /></div>
                <strong>{source.label}</strong><small>{source.system}</small>
                <span className={`source-status ${verified ? "verified" : "open"}`}>
                  {verified ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                  {verified ? "Verified" : "Needs review"}
                </span>
                <p>{source.detail}</p>
                <footer><span>{source.confidence}% confidence</span><span>{source.age}</span></footer>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
