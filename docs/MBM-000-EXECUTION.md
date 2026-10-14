# MBM-000 execution contract — homepage architecture extraction

## Objective

Decompose `apps/web/components/terminal-portfolio-home.tsx` into explicit homepage seams while preserving current visual, interaction, product-truth, lead/intake, SSR, accessibility, and route behavior. This is an enabling refactor for later MBM work, not a redesign.

## Current evidence

The current component owns homepage static arrays (`capabilities`, `prompts`, `approachSteps`), navigation and section markup, product rendering from `projectScreens`, GitHub utilities/projects, approach interaction, theme state, hash/panel routing, reveal effects, body locking, guided chat and transcript delivery, Component Studio, and Cause & Effect Lab dialogs. `apps/web/app/page.tsx` is already a thin server route that loads GitHub projects and renders the homepage.

## Dependency order

```text
MBM-000A → MBM-000B → MBM-000C → MBM-000D → MBM-000E → MBM-000F
```

Each task must leave the app buildable and must not begin if the prior task's acceptance evidence is absent.

## Global ownership rules

### May change across MBM-000

- `apps/web/components/terminal-portfolio-home.tsx`
- new files under `apps/web/components/home/`
- new homepage-only model/helper under `apps/web/lib/homepage.ts` if required
- `apps/web/lib/homepage-architecture.test.ts` for MBM-000F

### Must not change for MBM-000

- `apps/web/app/globals.css`
- `apps/web/app/layout.tsx`
- `apps/web/app/page.tsx` behavior or structured-data meaning
- `apps/web/lib/projects.ts` product truth
- `apps/web/lib/site.ts` site identity
- `apps/web/lib/chat-email.ts`, intake routes, API code, or shared contracts
- content, deployment, dependency manifests, or animation-library versions

If a blocker requires one of the prohibited paths, stop and record it rather than silently expanding the task.

## MBM-000A — Extract homepage static configuration

**Owner:** homepage model seam. **Create:** `apps/web/lib/homepage.ts` only if the existing arrays and pure reply/configuration logic can move without semantic change. **Modify:** orchestrator imports and call sites. **Do not modify:** `lib/projects.ts`, CSS, dialogs, or routes.

Move homepage-only capabilities, chat prompts, approach steps, and pure deterministic homepage copy/reply configuration behind named exports. Keep product records in `lib/projects.ts`; keep site identity in `lib/site.ts`; keep API/chat persistence behavior in its existing route/client seams.

Acceptance: no duplicate static arrays remain in the orchestrator; the homepage renders the same copy, order, links, product records, and chat prompt behavior; no browser global is introduced into a server-importable model module.

Validate: web tests, typecheck, lint, and build. Evidence target: E2 static inspection plus E2 automated checks.

Prompt: “Implement MBM-000A using the global task frame. Extract only homepage-local static configuration. Preserve current output and do not duplicate product or API truth. Add or update one behavior/contract check if needed, then run the A gate and report evidence.”

## MBM-000B — Extract presentational homepage sections

**Owner:** homepage section seams. **Create:** focused files under `apps/web/components/home/` for hero, stack, products, projects/utilities, approach, systems, studio/components entry points, and contact as the repository supports. **Modify:** orchestrator wiring. **Do not modify:** CSS or behavior-owned dialog/API modules.

Move markup and local presentation concerns, passing canonical records and callbacks as props. Do not let presentation modules import `@/lib/projects` merely to rediscover product truth, import API routes, or read long-form content directly. Preserve IDs and navigation targets exactly.

Acceptance: each extracted section has a small explicit interface; section anchors remain unique (`home`, `apps`, `projects`, `commerce`, `approach`, `systems`, `studio`, `components`, `contact` as currently applicable); product URLs and repository URLs remain sourced from canonical records; no visual or keyboard regression is introduced.

Validate: targeted web tests, typecheck, lint, build; inspect rendered homepage at desktop/mobile if available.

## MBM-000C — Extract dialogs and modal surfaces

**Owner:** dialog seams. **Create:** `home-chat-dialog`, `home-studio-dialog`, and `home-components-dialog` or equivalent focused modules. **Modify:** orchestrator prop wiring only. **Do not modify:** API routes, transcript contracts, `component-studio.html`, embedded labs, or CSS unless a verified extraction defect makes a minimal local correction unavoidable.

Preserve native dialog behavior, focus restoration, Escape handling, consent language, transcript delivery distinction, mailto fallback, panel-opening events, iframe/embed URLs, and status messages. Chat delivery remains the existing server-backed path.

Acceptance: dialog open/close and deep-link/panel behavior are unchanged; no lead is claimed persisted before the existing receipt; no modal locks body scroll without cleanup.

Validate: web tests, typecheck, lint, build, smoke where runtime services are needed, and keyboard/browser checks.

## MBM-000D — Extract browser lifecycle hooks

**Owner:** browser lifecycle seams. **Create:**

```text
apps/web/components/home/hooks/use-home-theme.ts
apps/web/components/home/hooks/use-home-panel-routing.ts
apps/web/components/home/hooks/use-body-modal-lock.ts
apps/web/components/home/hooks/use-home-reveal.ts
```

Own respectively: `mbm-theme` localStorage and document event sync; initial hash, `mbm-open-panel`, and `hashchange` handling; body overflow lock and cleanup; the existing IntersectionObserver/reduced-motion reveal implementation.

Do not migrate the reveal system to Framer Motion; that belongs to MBM-101. Do not access browser globals during render or module initialization. Do not register duplicate listeners.

Acceptance: listeners are registered once and cleaned up; SSR remains safe; reduced motion and visual timing remain equivalent; orchestrator no longer owns cross-section lifecycle effects.

Validate: web tests, typecheck, lint, build, and browser smoke. Evidence must include source inspection for cleanup.

## MBM-000E — Consolidate the homepage shell

**Owner:** orchestration boundary. **Create if useful:** `home/homepage-shell.tsx` and a small set of composition primitives. **Modify:** `terminal-portfolio-home.tsx`. **Do not modify:** unrelated routes, global CSS, product models, API, or dependency manifests.

Make the orchestrator legible: load hooks, select canonical data, compose sections, and pass state/callbacks. It may coordinate cross-section state but must not become a new data authority or retain extracted lifecycle implementation.

Acceptance: route remains a thin server boundary; orchestrator has no duplicated product truth, direct content loading, backend imports, or unowned browser lifecycle; existing homepage behavior and structured data remain intact.

Validate: full web targeted gate plus `npm run smoke`; inspect the diff for ownership and duplicate behavior.

## MBM-000F — Structural regression guard

**Owner:** architecture contract. **Create:** `apps/web/lib/homepage-architecture.test.ts` (one test file first). **Do not modify:** application behavior.

Guard durable invariants only: extracted module presence, static config outside the orchestrator, canonical product registry ownership, no product URL/source-repository duplication in presentation modules, unique required anchors, navigation targets backed by anchors, no homepage-to-backend/content authority crossing, lifecycle implementation in hooks, and thin route composition.

Do not assert line counts, JSX formatting, CSS class counts, every import, screenshots, or incidental file ordering. The test must complement existing product catalog and behavior tests, not duplicate them.

Acceptance: the guard fails when a future change reintroduces a prohibited authority or removes a required seam, while remaining tolerant of harmless internal refactors.

Validate: `npm run test --workspace web`, then the complete MBM-000 web gate and smoke. Evidence target: E2, with E3 if browser checks run.

## MBM-000 definition of done

- All six tasks are complete in dependency order.
- Existing homepage routes, anchors, products, dialogs, chat/intake, structured data, focus/keyboard behavior, responsive behavior, and reduced motion are preserved.
- No application behavior change is smuggled into the refactor.
- Structural guard covers durable seams without brittle implementation snapshots.
- Targeted and required full checks are recorded with actual results.
- Handoff states what remains unproven; no deployment or acceptance claim is made from local evidence.
