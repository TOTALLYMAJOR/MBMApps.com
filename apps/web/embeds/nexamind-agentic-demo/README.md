# NexaMind Agentic Decision Lab embed

A complete React implementation of the interactive agentic decision dashboard, packaged as an isolated static homepage embed for MBMApps.

## What is interactive

- Scenario use-case selector
- Natural-language objective editor
- Discount, contract-length, and deal-value sliders
- Context toggles
- Live computed confidence, policy risk, revenue protection, time savings, and margin impact
- "Run Agentic Analysis" animation across eight reasoning stages
- Agentic Decision Flow / Simulation / Evidence Map / Policy & Rules tabs
- Before-vs-after simulation table
- Evidence filters
- Recommendation state that changes with the scenario
- "Take Action" package state
- Responsive mobile layout

## Build

```bash
npm run build:embed:nexamind --workspace web
```

The build writes a self-contained iframe document to `apps/web/public/nexamind-agentic-demo/index.html`. Keeping the JavaScript and styles in one document allows the homepage iframe to retain a strict opaque-origin sandbox. The main web build runs this automatically through its `prebuild` script.

The demo calculations live in `src/lib/scenario.js`. They are deterministic illustrative logic, designed to show how the interface responds to evidence, constraints, policy, and simulation. They are not production evidence or an autonomous decision authority.
