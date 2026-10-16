# MBMApps architecture

## Current topology

```text
apps/web (Next.js 16, App Router, TypeScript, MDX, browser UX)
        │  shared contracts / backend client
        ▼
apps/api (Express, TypeScript, Zod, rate limiting, Firebase Admin)
        │
        ├── Firebase Auth / Firestore
        └── optional notification and external providers

packages/contracts (shared request, receipt, telemetry, and domain contracts)
content (MDX insights and case studies)
infra (deployment scaffolds)
```

Local development is Docker-first, with host-only web/API fallbacks. Deployment topology documented in `README.md` is Vercel for web, Railway for API, Firebase for auth/Firestore, and Docker for parity; Render is a portability scaffold. These are documented targets, not proof that every environment is currently deployed or healthy.

## Authority seams

- Product truth: `apps/web/lib/projects.ts` and its consumers.
- Site identity/configuration: `apps/web/lib/site.ts`.
- Shared data contracts: `packages/contracts/src/index.ts`.
- API validation, persistence, and receipts: `apps/api/src/*` plus web API routes.
- Long-form content: `content/` through `apps/web/lib/content.ts`.
- Lead-delivery decisions: `docs/adr/0001-lead-intake-delivery-truth.md` and `CONTEXT.md`.
- Site access and chat authorization: `docs/adr/0002-firebase-site-access-and-chat-authorization.md`.
- Visual tokens and global interaction language: `apps/web/app/globals.css`, component styles, and `design-qa.md`.

## Homepage boundary

Today `TerminalPortfolioHome` is a large client orchestrator. It currently contains homepage static arrays, navigation and sections, theme and browser effects, product rendering, guided chat, transcript delivery, Component Studio, and Cause & Effect Lab dialogs. This is observed current state, not an architectural endorsement.

MBM-000 is the enabling refactor that introduces seams around these concerns without changing behavior:

```text
app/page.tsx                 thin server composition
TerminalPortfolioHome        orchestration and prop wiring
components/home/*            presentational sections and dialogs
components/home/hooks/*      browser lifecycle and cleanup
lib/homepage.ts               homepage-only static/configured behavior
lib/projects.ts               canonical product registry
lib/site.ts                   canonical site identity
```

The extraction must not make presentation modules new authorities for products, APIs, content, or provider state. The planned shape becomes current only after MBM-000A–F and its evidence pass.

## Dependency and state rules

- The web may render data from canonical models and call explicitly owned route/client seams.
- The API owns validation, persistence, and provider-facing mutation boundaries.
- Contracts are shared vocabulary, not a license to bypass API authority.
- A provider event is evidence about that provider, not automatically a business-state transition.
- Browser-only lifecycle code must be SSR-safe, cleanup-complete, and isolated from render-time data composition.
- Public content may describe only the proof boundary supported by its source record.
- Firebase Auth is the identity authority. The same-origin Next.js Node route verifies ID tokens with Firebase Admin and derives `guest` or `member`; the web session carries only that signed role and expiry. The separately hosted API is not required for site entry.
- Guests may browse protected portfolio routes but cannot render or reach guided-chat or Discord discussion surfaces.

## Architecture change test

Before adding a new module, apply the repository skill's deletion test: if removing it merely spreads the same complexity across callers, it is earning its seam; if it is a pass-through, do not add it. Prefer deep modules with small interfaces, high locality, and behavior tests at the interface.
