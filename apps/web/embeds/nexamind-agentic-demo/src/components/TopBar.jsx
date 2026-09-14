import { ArrowUpRight } from "lucide-react";

export default function TopBar() {
  return (
    <header className="topbar">
      <a className="brand" href="#top" aria-label="NexaMind home">
        <span className="brand-mark"><span /><span /><span /></span>
        <strong>NexaMind</strong>
      </a>

      <nav className="topnav" aria-label="Primary">
        <a href="#product">Scenario</a>
        <a href="#lab">Decision flow</a>
        <a href="#impact">Impact</a>
        <a href="#evidence">Evidence</a>
      </nav>

      <div className="topbar-actions">
        <div className="online-pill">
          <span className="pulse-dot" />
          Agents Online
          <span className="agent-count">12</span>
        </div>

        <a className="build-button" href="/apps" target="_top">
          Explore MBMApps
          <ArrowUpRight size={15} />
        </a>
      </div>
    </header>
  );
}
