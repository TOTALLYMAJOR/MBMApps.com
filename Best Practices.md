# MBMApps Development Best Practices

Last updated: 2026-04-01

## 1) Operating Principle

- Optimize for two goals at the same time: production parity and development speed.
- Default to Docker for consistency across local, CI, and deployment environments.
- Keep feedback loops tight with fast restart paths and scoped quality checks.

## 2) Default Local Workflow (Docker-First)

- Start full stack (build + run): `npm run dev`
- Start in detached mode: `npm run dev:docker:detached`
- Fast restart (skip image rebuild): `npm run dev:docker:fast`
- Fast restart detached: `npm run dev:docker:fast:detached`
- Tail logs: `npm run dev:docker:logs`
- Stop stack: `npm run dev:docker:down`

When to use each mode:

- Use `dev` after dependency, Dockerfile, or infrastructure changes.
- Use `dev:docker:fast` for day-to-day code iteration when images do not need rebuild.

Host-only fallback:

- Web only: `npm run dev:host:web`
- API only: `npm run dev:host:api`

## 3) Daily Development Loop

1. Sync branch: `git pull --rebase origin main`
2. Start stack quickly: `npm run dev:docker:fast:detached`
3. Validate targeted changes:
- Web: `npm run build --workspace web`
- API: `npm run build --workspace api`
4. Run full gates before merge: `npm run validate`
5. Confirm runtime behavior with a quick smoke pass (home, demo, API health, media assets).

## 4) Container Build Hygiene

- Keep Docker context small with `.dockerignore`.
- Keep expensive dependency install layers early in Dockerfiles.
- Exclude build artifacts broadly, but explicitly include required artifacts.
- Current important include: `packages/contracts/dist` must remain in Docker context for API build typing.

## 5) CI/CD Reliability Standards

- Keep using `npm ci` in CI for deterministic installs.
- Keep workflow concurrency enabled to cancel stale runs and reduce queue waste.
- Require CI checks before merge to `main`.
- Keep deployment workflows tied to successful CI outputs only.
- For API deploy, continue scope-based deploy decisions to avoid unnecessary releases.

## 6) Branch and Review Governance

- Protect `main` with required status checks and required reviews.
- Add `CODEOWNERS` for `/apps/web`, `/apps/api`, `/packages/contracts`, and infrastructure paths.
- Require conversation resolution before merge.
- Use clear PR scope and include validation evidence in PR description.

## 7) Security Baseline

- Never commit secrets or `.env` values.
- Keep `.env.example` current and accurate.
- Add dependency update automation with bounded PR volume.
- Review user input handling and API mutation endpoints for injection and validation gaps.
- Keep auth, telemetry, and contact submission paths covered by tests.
- Keep champion intelligence data governed: schema version every event, consent metadata on intake, clear PII boundaries, and explicit retention policy fields on stored contact/telemetry records.

## 8) Performance Baseline (Web + Media)

- Place static media under `apps/web/public/media`.
- For hero/demo video, default to user-initiated playback and `preload="metadata"` unless product UX explicitly requires autoplay.
- If autoplay is required, enforce `muted`, `playsInline`, and validate on low-end devices.
- Current approved exception: `/demo` QuietPilot preview uses muted autoplay + loop with top-focused crop for immediate product context.
- Watch page weight and first-load JS trends on key routes (`/`, `/demo`, `/contact`).

## 9) Salesforce Metadata Hygiene

- Treat `.sfdx/tools/*` and `.sfdx/typings/*` as local generated artifacts, not canonical source metadata.
- When object schemas change, refresh local definitions before development and testing.
- For shared changes, document which org/schema snapshot was used when regenerating caches.
- Avoid mixing unrelated `.sfdx` cache regeneration with feature work to keep diffs reviewable.

## 10) AI-Assisted Development Prompts (Repo-Specific)

- Security review:
`Review this MBMApps monorepo change set for security issues. Focus on user input handling, auth boundaries, API mutation routes, and secret leakage risks. Return concrete findings with file paths and fixes.`

- Performance review:
`Analyze this change for runtime and bundle impact in apps/web and apps/api. Identify regressions, quick wins, and no-regret optimizations with expected impact.`

- Contract drift check:
`Verify consistency across packages/contracts, apps/api, and apps/web usage. Flag schema drift, unsafe casts, and missing validation with exact file references.`

- Test gap review:
`Based on this diff, list the top 3 highest-risk missing tests and provide minimal test cases to add first.`

- Refactor discipline:
`Suggest only refactors that reduce complexity without changing behavior. Rank by payoff and implementation risk.`

## 11) Recommended Next Actions (Priority Order)

1. Add `healthcheck` + `depends_on.condition: service_healthy` in `docker-compose.yml`.
2. Add `.github/CODEOWNERS`.
3. Add `.github/dependabot.yml` with grouped weekly updates and controlled PR limits.
4. Add workflow-level `concurrency` to `ci.yml`.
5. Add PR template with checklist for tests, docs, and rollout risk.
6. Add an optional dev compose override for live reload (`docker compose watch` or bind-mounted dev services).

## 12) Reference Links

- Docker Compose startup/readiness: https://docs.docker.com/compose/how-tos/startup-order/
- Docker build cache/context optimization: https://docs.docker.com/build/cache/optimize/
- Docker Compose profiles: https://docs.docker.com/compose/how-tos/profiles/
- GitHub protected branches: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches
- GitHub Actions concurrency: https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency
- GitHub CODEOWNERS: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners
- Dependabot options reference: https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference
- npm ci reference: https://docs.npmjs.com/cli/v10/commands/npm-ci/
