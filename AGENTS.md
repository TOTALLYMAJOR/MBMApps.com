# MBMApps Codex operating contract

This file is the repository-level operating contract for Codex and other development agents working in `TOTALLYMAJOR/MBMApps.com`.

## Mission

Improve MBMApps without weakening product truth, authority boundaries, accessibility, operational safety, or the evidence needed to trust a change. Prefer the smallest reversible change that creates useful evidence.

This repository is a Next.js/TypeScript monorepo. The public web experience and the API are separate workspaces, and `packages/contracts` is the shared contract seam. The homepage is a product surface, not a disposable marketing mockup: preserve its real product links, truthful access descriptions, server-backed intake behavior, structured data, and keyboard/reduced-motion behavior.

## Authority order

Resolve conflicts in this order, from strongest to weakest:

1. System, platform, security, and explicit user instructions.
2. This root `AGENTS.md`, then the nearest nested `AGENTS.md` in the directory being changed.
3. Accepted ADRs in `docs/adr/` for the behavior they govern.
4. `CONTEXT.md` for domain vocabulary and invariants.
5. Canonical source models and contracts (`apps/web/lib`, `packages/contracts`, API schemas, and route implementations).
6. Tests and validation scripts as executable checks of observed behavior.
7. `PRODUCT_TRUTH.md`, `ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `EVIDENCE.md`, `BACKLOG.md`, and task documents as control-pack guidance. These documents must describe or constrain work; they must not silently override source or accepted decisions.
8. `README.md`, `Best Practices.md`, `design-qa.md`, and repository-local skills as supporting operational and historical context.

If two sources at the same level disagree, stop and record the contradiction in the task handoff. Do not resolve it by silently choosing the more convenient source.

## Required context load

Before substantive work, read only the documents relevant to the change, starting with:

- `CONTEXT.md`;
- the applicable accepted ADRs;
- `README.md` and `Best Practices.md` for repository workflow;
- the applicable control-pack document;
- the nearest `.agents/skills/*/SKILL.md` and directly linked references;
- the owning source, tests, and package manifest.

Do not treat generated artifacts, `.sfdx` caches, `node_modules`, `.next`, `output`, or `test-results` as canonical product authority.

## Invariants

- Persistence determines lead acceptance. A receipt may say `persisted` only after Firestore accepts the write.
- Notification is an orthogonal follow-up state. Provider acceptance is not inbox delivery, human response, payment settlement, or business truth.
- Honeypot filtering never claims persistence.
- Guided chat is deterministic, session-local assistance. It is not represented as a human or autonomous support agent.
- Public product claims must match the current `ProductRecord` model, access description, status, proof boundary, and source repository.
- UI recommendations may explain or propose; mutation authority remains with the appropriate server, provider, role, or human decision-maker.
- No secret, private customer data, or unverified provider state belongs in committed source or public copy.
- Existing route behavior, structured data, same-origin protection, body limits, validation, consent, telemetry, and reduced-motion behavior remain protected unless the task explicitly owns them.
- A refactor is not complete because files moved. It is complete only when behavior, seams, and evidence are verified.

## Prohibited shortcuts

- Do not invent a queue, deployment, provider delivery, production acceptance, or live capability.
- Do not replace durable lead persistence with an in-memory success path or synthetic fallback.
- Do not duplicate product truth, URLs, repository links, long-form content, or API contracts in presentational JSX when a canonical model exists.
- Do not solve MBM-000 by redesigning the homepage, changing CSS, migrating animation libraries, or adding a new lead funnel.
- Do not add a dependency to avoid understanding existing behavior.
- Do not broaden a task's ownership without recording the reason and new validation surface.
- Do not delete or overwrite user changes, generated artifacts, or reference material merely to make a check pass.

## Ownership and change protocol

Every task must name:

- the objective and user-visible risk;
- files it may modify or create;
- files it must not modify;
- dependencies and invariants;
- tests and validation commands;
- evidence produced;
- remaining uncertainty and handoff state.

Use the smallest coherent diff. Preserve unrelated worktree changes. Prefer a vertical test-to-implementation slice when behavior changes; for pure extraction, first pin the behavior that must remain unchanged, then move one seam at a time.

## Validation baseline

Use targeted checks while iterating and the full repository gate before handoff:

```text
npm run lint
npm run typecheck
npm run test
npm run build
npm run smoke
```

For web-only changes, at minimum use `npm run test --workspace web`, `npm run typecheck --workspace web`, `npm run lint --workspace web`, and `npm run build --workspace web`; add `npm run smoke` when route or runtime behavior could change. `npm run validate` is the combined gate when the environment supports it.

## Handoff standard

Report the changed files, commands actually run, pass/fail results, evidence grade, known limitations, and exact next action. Never report a task as deployed or accepted from local tests alone.

The detailed control pack is indexed from:

- `PRODUCT_TRUTH.md`
- `ARCHITECTURE.md`
- `DESIGN_SYSTEM.md`
- `BACKLOG.md`
- `EVIDENCE.md`
- `PROMPT_PLAYBOOK.md`
- `docs/MBM-000-EXECUTION.md`
