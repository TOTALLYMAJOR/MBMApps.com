# MBMApps.com

Production-ready company site and technical showcase for `MBMapps.com`, built as a monorepo with:

- `apps/web`: Next.js App Router marketing + demo experience
- `apps/api`: Dockerized TypeScript API for demo metrics, pipeline, outcome snapshots, champion cohorts, contact intake, and telemetry
- `packages/contracts`: Shared API/event/data contracts used by both app and API

## Architecture

### Web (`apps/web`)
- Next.js 15 + TypeScript + Tailwind
- Routes: `/`, `/services`, `/case-studies`, `/about`, `/insights`, `/contact`, `/demo`
- MDX-driven content for insights and case studies from `/content`
- SEO: metadata, JSON-LD schema, OG image route, robots, and sitemap
- Lead funnel: enriched contact form with anti-spam honeypot, champion profile signals, consent metadata, and server-side submission route
- Observability: web vitals + intent telemetry with session, anonymous visitor, attribution, device class, schema version, and data quality context
- Homepage: animated testimonials signal section integrated into `HomeImmersive`
- Demo media: `/demo` QuietPilot preview autoplays muted, loops, and uses top-focused crop for above-the-fold context

### API (`apps/api`)
- Express + TypeScript + Zod validation
- Endpoints:
  - `GET /healthz`
  - `GET /v1/demo/metrics`
  - `GET /v1/demo/pipeline`
  - `GET /v1/demo/outcomes`
  - `GET /v1/champion/cohorts`
  - `POST /v1/contact`
  - `POST /v1/events`
- Rate limiting + helmet + CORS + structured logging
- Firebase Admin integration with synthetic fallback data when credentials are absent

### Shared Contracts (`packages/contracts`)
- `DemoMetric`
- `PipelineSnapshot`
- `OperationalOutcomeSnapshot`
- `ContactSubmission`
- `ChampionProfile`
- `ChampionScore`
- `ChampionCohort`
- `ApiError`
- `EventTelemetryPayload`

## Champion Intelligence Layer

The platform now captures richer data to help define an Elkite champion: a best-fit QuietPilot/MBMApps operator with strong fit, urgency, adoption intent, operational complexity, commercial readiness, and measurable outcome potential.

- Contact intake captures role, industry, company size, locations, team size, quote volume, current tools, operational maturity, primary pain, top constraint, and consent metadata.
- API contact storage derives and persists `ChampionProfile` and `ChampionScore` alongside lifecycle status and data-quality governance fields.
- Demo data includes numeric operational outcome snapshots for quote turnaround, win rate, response time, proposal views, job readiness, payment risk, staffing gaps, inventory blockers, and revenue influenced.
- Content frontmatter includes persona, funnel stage, problem, capability, champion signal, and primary outcome; detail pages emit read-depth telemetry.
- Telemetry taxonomy includes journey events such as `cta_clicked`, `quietpilot_opened`, `demo_started`, `demo_stage_selected`, `dashboard_drilldown_viewed`, `content_read`, `quote_interest`, `scheduling_started`, and `scheduling_completed`.

## Local Development

1. Copy envs:
   - `cp .env.example .env`
2. Install dependencies:
   - `npm install`
3. Start development stack (Docker-first default):
   - `npm run dev`

This boots both services with Docker Compose:
- Web at `http://localhost:3001`
- API at `http://localhost:4000`

Helpful controls:
- Detached mode: `npm run dev:docker:detached`
- Fast restart (skip rebuild): `npm run dev:docker:fast`
- Fast restart detached: `npm run dev:docker:fast:detached`
- Tail logs: `npm run dev:docker:logs`
- Stop stack: `npm run dev:docker:down`

If you need a different web host port, override before starting:
- `WEB_HOST_PORT=3010 npm run dev`

Host-only fallback (without Docker):
- `npm run dev:host:web`
- `npm run dev:host:api`

## Salesforce Metadata Cache (Local)

This repo includes local Salesforce DX metadata cache artifacts used for object discovery and IDE assistance:

- `.sfdx/tools/sobjects/standardObjects/*.cls`: generated Apex object definitions
- `.sfdx/tools/soqlMetadata/standardObjects/*.json`: SOQL Builder object metadata
- `.sfdx/typings/lwc/sobjects/*.d.ts`: LWC typing stubs for sObjects

Use this cache for reference while building integrations. Refresh it from VS Code with `SFDX: Refresh SObject Definitions` when object schemas change.

These files are local tooling artifacts and may vary by org; keep them out of commits unless your branch explicitly requires sharing regenerated metadata.

## Firebase Seed (optional)

If Firebase Admin env vars are configured, seed demo data:

- `npm run seed:firebase`

## Quality Gates

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- `npm run smoke`

## CI/CD

Workflows included in `.github/workflows`:

- `ci.yml`: lint, typecheck, test, build
- `vercel-deploy.yml`: preview deploys for PRs and production deploy on main
- `railway-deploy.yml`: API container deploy on main

Required secrets:

- Vercel: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- Railway: `RAILWAY_TOKEN`, `RAILWAY_SERVICE_ID`

## Deployment Topology (v1)

- **Vercel**: Next.js web app
- **Railway**: Dockerized API service
- **Firebase**: Auth + Firestore data for demo and telemetry persistence
- **Docker**: Local and cloud container parity

## Render Parity (phase 2)

Render portability scaffold is included:

- `infra/render/render.yaml`

Use it to deploy the same API container with matching environment contract.
