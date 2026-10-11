# MBMApps evidence and lifecycle

## Lifecycle states

Use these states explicitly; do not collapse them into a single “done” label:

1. **Planned** — scoped with an owner, dependencies, invariants, and acceptance criteria.
2. **In progress** — an owned working change exists; no completion claim is allowed.
3. **Implemented** — the intended code/config/content exists and targeted checks pass.
4. **Verified** — the relevant behavior has been checked through declared tests, browser evidence, or source inspection.
5. **Deployed** — the named environment is known to contain the change, with deployment evidence.
6. **Accepted** — the authorized product/operational owner has reviewed the deployed behavior against acceptance criteria.
7. **Blocked** — progress cannot continue without a named external decision, authority, or environment change.

The states are cumulative only when the evidence for each transition exists. `Implemented` does not imply `Verified`; `Deployed` does not imply `Accepted`.

## Evidence grades

- **E0 — assertion:** plan, prose, or agent statement only. Useful for intent; no proof.
- **E1 — static evidence:** source, diff, configuration, or file inspection confirms presence/shape.
- **E2 — automated evidence:** targeted tests, lint, typecheck, build, or contract checks pass.
- **E3 — runtime evidence:** local/browser/smoke execution confirms the named behavior in a named environment.
- **E4 — external environment evidence:** deployment/provider/integration observation confirms behavior outside the local checkout.
- **E5 — authorized acceptance:** named owner confirms the deployed behavior meets the product/operational acceptance criteria.

Report grade, scope, timestamp/commit where relevant, and limitations. Strong claims require converging evidence; a screenshot alone cannot prove persistence, provider delivery, deployment, or acceptance.

## Required proof dimensions

For a meaningful change, collect the dimensions that apply:

- **Engineering:** tests, lint, typecheck, build, contracts, and failure-path checks.
- **Runtime/UX:** route behavior, responsive behavior, keyboard/focus, reduced motion, and browser console/runtime health.
- **Truth:** copy and status labels remain within the product/proof boundary.
- **Operations:** provider, deployment, environment, or human-authority state is named rather than implied.

For imported browser artifacts, also record source path, content fingerprint, static capability review, network/runtime boundary, repository adaptation, and generated output path. Imported source does not become product authority merely because it is committed or rendered.

For reference-led design work, record the source, observed pattern, product relevance, original transformation, rejected identity elements, and desktop/mobile proof gate. A visual resemblance claim is not evidence of usability or originality.

## Validation commands

Repository baseline:

```text
npm run lint
npm run typecheck
npm run test
npm run build
npm run smoke
```

MBM-000 targeted baseline:

```text
npm run test --workspace web
npm run typecheck --workspace web
npm run lint --workspace web
npm run build --workspace web
npm run smoke
```

The smoke command and build may require environment or service availability. Record skipped checks and why; do not convert them to passes.

## Evidence record

Use this compact format in task handoffs:

```text
State: <implemented|verified|deployed|accepted|blocked>
Grade: <E0–E5>
Scope: <what was actually checked>
Commands/evidence: <exact commands, routes, screenshots, logs, or owner>
Result: <pass/fail/partial>
Limitations: <what remains unproven>
Next action: <single highest-value next step>
```
