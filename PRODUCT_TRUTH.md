# MBMApps product truth

This document states the public product and proof boundaries the MBMApps site must preserve. It follows `CONTEXT.md`, accepted ADRs, and the canonical source models.

## Canonical product registry

`apps/web/lib/projects.ts` owns product names, descriptions, routes, access language, status, proof boundaries, and source-repository links. Presentation code must consume that registry rather than restating product truth.

The visible catalog currently contains:

- Wale
- QuietPilot
- LeaguePilot
- QuoteFlow

Visibility is a publication decision, not evidence that a product is deployed, configured, available to every visitor, or operationally effective.

QuietPilot's homepage showcase renders its canonical capabilities, explicitly including Inventory, Staffing, and Partner portals. Partner collaboration is scoped to an authenticated event grant; this showcase neither opens private operations nor proves hosted portal acceptance. Staffing and inventory planning do not establish readiness. The existing catering artwork remains a visual illustration, not an operational receipt.

The homepage also includes an owner-requested SportPilot website preview as the final product chapter, after QuietPilot and below MasterSC. `sportPilotPreview` in the canonical product source owns its name and URL, `https://sportpilot.mbmapps.com/`. It reuses the scroll-through preview with an accessible full-site link. This is not a new catalog brief, source-repository claim, or verification of SportPilot authentication or operational outcomes. The destination owns its interface and access rules.

MasterSC remains a protected homepage product section after LeaguePilot and before QuietPilot and SportPilot. Its preview and full-showcase link use the same-origin `/MasterSC` route and `masterScProduct`; sample state is explicitly labeled. Its `visible: false` catalog setting and existing source/release boundaries remain unchanged. Local inclusion does not establish public deployment.

## Site and route roles

- `/` is the MBMApps terminal portfolio, rendered by `TerminalPortfolioHome`.
- `/apps` lists visible canonical product records.
- `/apps/[slug]` renders a product brief from the registry.
- `/wale` is the current Wale Living Archive, rendered by `WaleArchiveShell`.
- `/concepts` is the protected retained Wale concept page, rendered separately from both the homepage and the current `/wale` experience.
- `/MasterSC` is the protected SC2 Master Coach showcase with deterministic sample interface state.

The homepage links directly to `/wale` and does not own a competing `#wale` destination. The root portfolio, current Wale route, `/concepts`, and `/MasterSC` are distinct surfaces. A concept or historical prototype does not replace the current Wale route unless a later accepted decision and implementation explicitly do so.

## Wale boundary

Wale helps a repository owner inspect selected development controls, understand supported constraints, compare bounded improvements, and prepare approval-gated work.

The public site has no ambient filesystem access. Repository analysis requires a separately started local Wale bridge and an explicitly selected repository. An assessment, recommendation, plan, local validation, commit, or pull request does not by itself prove approval, deployment, production operation, effectiveness, or efficiency.

The repository owner retains scope and change authority. AgentFlow remains the execution owner where that integration is selected and authorized.

## Shared evidence language

Use the narrowest accurate state:

- `configured`: settings or code exist.
- `validated locally`: a named local check passed.
- `committed`: a Git commit contains the change.
- `published for review`: a remote branch or pull request exists.
- `deployed`: a named provider reports a deployment for an exact commit.
- `verified in production`: the deployed behavior was observed on the named production surface.

Never collapse proposal acceptance, provider acceptance, payment settlement, operational readiness, deployment, or outcome proof into a generic success claim.

## Lead intake

Persistence determines whether a lead was accepted. Notification is a separate follow-up state. Honeypot filtering never claims persistence, and guided chat is deterministic session-local assistance rather than a human or autonomous support agent.

## Reconciliation note

The `codex-sync-preserve-2026-10-10` stash included a Wale-only homepage and catalog state. That state was not adopted because current source and the merged `/wale` experience establish the root portfolio and Wale route as separate surfaces. The reusable Wale product record and governance material were reconciled without hiding the other canonical products.
