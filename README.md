# MBMApps.com

Production-ready company site and technical showcase for `MBMapps.com`, built as a monorepo with:

- `apps/web`: Next.js App Router marketing + demo experience
- `apps/api`: Dockerized TypeScript API for demo metrics, pipeline, contact intake, and telemetry
- `packages/contracts`: Shared API/event/data contracts used by both app and API

## Architecture

### Web (`apps/web`)
- Next.js 15 + TypeScript + Tailwind
- Routes: `/`, `/services`, `/case-studies`, `/about`, `/insights`, `/contact`, `/demo`
- MDX-driven content for insights and case studies from `/content`
- SEO: metadata, JSON-LD schema, OG image route, robots, and sitemap
- Lead funnel: contact form with anti-spam honeypot and server-side submission route
- Observability: web vitals + event telemetry (`contact_submitted`, `demo_login`, `case_study_viewed`)

### API (`apps/api`)
- Express + TypeScript + Zod validation
- Endpoints:
  - `GET /healthz`
  - `GET /v1/demo/metrics`
  - `GET /v1/demo/pipeline`
  - `POST /v1/contact`
  - `POST /v1/events`
- Rate limiting + helmet + CORS + structured logging
- Firebase Admin integration with synthetic fallback data when credentials are absent

### Shared Contracts (`packages/contracts`)
- `DemoMetric`
- `PipelineSnapshot`
- `ContactSubmission`
- `ApiError`
- `EventTelemetryPayload`

## Local Development

1. Copy envs:
   - `cp .env.example .env`
2. Install dependencies:
   - `npm install`
3. Run web and API separately:
   - `npm run dev:web`
   - `npm run dev:api`

## Docker

### Build and run both services

- `docker compose up --build`

This brings up:
- Web at `http://localhost:3000`
- API at `http://localhost:4000`

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
