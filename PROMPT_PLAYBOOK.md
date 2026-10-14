# MBMApps Codex prompt playbook

These are reusable prompt shapes, not substitutes for the repository contract. Start every task by loading the relevant context and naming file ownership. Keep claims proportional to evidence.

## Global task frame

```text
Repository: TOTALLYMAJOR/MBMApps.com
Task: <ID and objective>
Outcome: <user/system outcome, not just files>
Read first: CONTEXT.md, applicable docs/adr/*, AGENTS.md, <control-pack doc>, owning source/tests.
Canonical authorities: <models/contracts/ADR/source files>
Modify: <exact files>
Do not modify: <exact files>
Preserve: <invariants and behavior>
Validate: <targeted commands, runtime checks, evidence grade>
Finish with: changed files, actual evidence, limitations, next action.
```
## Context loading

```text
Load the smallest relevant repository context for <task>. Separate observed facts, established decisions, inference, and unknowns. Identify the canonical authority for each claim and any contradiction before proposing a change. Do not treat generated artifacts or supporting prose as stronger than source and accepted ADRs.
```

## Execution

```text
Implement <task> within the declared ownership. Work in vertical slices. Preserve existing behavior unless the acceptance criteria explicitly change it. Before editing, state the current behavior and the seam being introduced. After each slice, run the narrowest meaningful check, then run the task gate. Do not broaden scope to opportunistic cleanup.
```

## TDD

```text
Use a red → green → refactor loop. Choose one externally observable behavior, write the smallest behavior test, make it pass with minimal code, then refactor only after green. Prefer public interfaces and domain vocabulary from CONTEXT.md; avoid tests coupled to private implementation or exact formatting. For extraction work, pin behavior before moving it and add structural checks only for durable architectural invariants.
```

## Adversarial review

```text
Review this change as a capable user, operator, security reviewer, and future maintainer. Ask what claim is overstated, what authority boundary is crossed, what failure path is untested, what data could leak, what happens on retry/provider failure, what reduced-motion/keyboard state breaks, and what a stale source would cause. Return findings ranked by consequence with exact files and evidence needed to resolve them.
```

## Diff review

```text
Review only the proposed diff against the task contract. Check ownership, unnecessary scope, behavior preservation, contract drift, duplicate product truth, SSR safety, cleanup, accessibility, and validation coverage. Distinguish confirmed defects from hypotheses. Do not request style changes unless they affect correctness, locality, or maintainability.
```

## Failure recovery

```text
The last check failed: <failure>. Stop and classify it as implementation defect, test defect, environment defect, stale assumption, or unrelated worktree issue. Return to the last reliable evidence, reproduce with the narrowest command, make one reversible correction, and rerun the discriminating check. Do not weaken or delete the check to obtain green. If blocked, record the exact external dependency and next decision.
```

## Validation and evidence

```text
Validate <task> using the declared commands and runtime checks. Report lifecycle state and evidence grade from E0–E5. Say exactly what passed, what environment was tested, what remains unproven, and whether the result proves implementation, verification, deployment, or acceptance. A local pass cannot be reported as production or provider acceptance.
```

## Handoff

```text
Handoff for <task>:
- State/grade:
- Objective completed:
- Changed files:
- Ownership preserved:
- Commands actually run and results:
- Runtime/browser evidence:
- Known limitations or contradictions:
- Files/behavior the next task may rely on:
- Exact next action:
```
