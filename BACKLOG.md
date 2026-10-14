# MBMApps implementation backlog

This backlog is the coordination index. Detailed execution for the enabling task is in `docs/MBM-000-EXECUTION.md`. IDs after MBM-000 are intentionally retained from the prior site-upgrade plan; they are not permission to start concurrent work that violates dependencies.

## Delivery order

```text
MBM-000 → MBM-101 → MBM-201
                  ↘ MBM-301 + MBM-401 → MBM-501 → MBM-601
                                      MBM-701 (depends on 201)
```

## MBM-000 — Homepage architecture extraction — P0 / enabling

Objective: turn the homepage client surface into a small orchestration layer with explicit seams while preserving current behavior. Six vertical tasks are defined in `docs/MBM-000-EXECUTION.md`: static/config extraction, section seams, dialog seams, browser hooks, shell consolidation, and structural regression guard.

## MBM-101 — Framer Motion operating-system narrative — P0

Show the inquiry → quote → decision → payment → staffing → operations → proof model through restrained, evidence-linked motion. Depends on MBM-000. Do not run a second reveal system indefinitely; define ownership among Framer Motion, GSAP, and React Three Fiber and preserve reduced motion.

## MBM-201 — Product architecture case studies — P0

Use existing `/case-studies/[slug]`, MDX, metadata, beacons, and product records to explain problem, failed workflow, operating model, architecture, authority boundary, evidence, limitations, and future direction for flagship products. Do not create a parallel case-study platform.

## MBM-301 — Product Proof Register — P0

Add a typed, version-controlled product-capability evidence manifest that separates implementation, validation, deployment, provider state, human authority, and acceptance. It must not fetch arbitrary live provider state and call it truth.

## MBM-401 — Broken Workflow Diagnostic — P0 / commercial

Create a bounded client-side diagnostic that identifies workflow fragmentation and transfers context into the existing conversation/intake path. Do not create a second lead funnel. Instrument meaningful progression and conversion, not vanity completion alone.

## MBM-501 — Interactive Architecture Explorer — P1

Derive product, architecture, and evidence views from real portfolio metadata. A visualization must not invent claims the data cannot support. Depends on MBM-101 and MBM-301.

## MBM-601 — MBMApps Product Universe — P1

Show the repeatable mechanisms across products—identity, workflow, authority, evidence, provider boundaries, human override, observability, and agentic execution—without flattening product-specific differences. Depends on MBM-301 and MBM-501.

## MBM-701 — Inside the Build intelligence layer — P1

Connect existing insights to products, principles, architecture, and capabilities through metadata and links, creating a knowledge layer without a graph database. Depends on MBM-201.

## Backlog acceptance

Every item needs engineering, UX/accessibility, truth/evidence, and commercial/operational acceptance criteria where applicable. No item is complete from code existence alone; use the lifecycle and evidence rules in `EVIDENCE.md`.
