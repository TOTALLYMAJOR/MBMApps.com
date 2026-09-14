# NexaMind Cause & Effect Lab

A complete React + Vite + Motion demo showing **causal propagation** through an agentic decision system.

## What changed in this version

This is no longer just an animated decision loop.

Changing a scenario fact automatically produces a deterministic causal trace:

```text
changed fact
→ impacted reasoning stages
→ downstream metric deltas
→ authority result
→ recommendation transition
→ memory receipt
```

### First-class facts

- Discount
- Contract length
- Deal value
- Evidence coverage
- Human approval requirement

### Causal behavior

Each fact has an explicit route through the system.

Examples:

```text
Discount
→ Objective
→ Reconsider
→ Simulate
→ Authority Check
→ Validate
→ Memory
```

```text
Evidence coverage
→ Context
→ Reconsider
→ Authority Check
→ Validate
→ Memory
```

Only materially affected stages light up during live propagation.

### Recommendation transitions

The modeled recommendation can move between:

- Approve
- Approve with Conditions
- Escalate for Approval

The right-side Impact Simulator shows:

- Before → after metric values
- Confidence movement
- Residual-risk movement
- Margin movement
- Win-probability movement
- Revenue-protected movement
- Authority pass/review
- Previous → current recommendation

### Baselines

The left workbench always compares the current scenario with the last analyzed baseline.

`Set current as baseline` rebases the demonstration so the next change starts a new causal trace.

## Run

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Architecture

```text
src/
├── App.jsx
├── main.jsx
├── styles.css
└── lib/
    └── causeEffect.js
```

`causeEffect.js` intentionally contains the causal model separately from the visualization.

That file defines:

- decision stages
- fact → stage routes
- outcome computation
- authority rules
- recommendation rules
- before/after deltas
- per-stage explanations

This makes the visual layer replaceable without changing the domain model.

## Production integration

The current calculations are deterministic demonstration logic.

For a real system, replace or enrich `calculateOutcome()` with:

- real database reads
- policy services
- model/agent traces
- quote/pricing services
- simulation engines
- evidence/provenance services
- authorization checks

Keep `buildCauseEffect()` as the presentation contract so the UI can continue to explain **why** a changed fact altered the decision.
