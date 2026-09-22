# Portfolio system redesign

## Mission

Make MBMApps read as a multi-product studio portfolio. Applications receive equal product truth and consistent showcase anatomy. Browser tools, utilities, and simulators live under one `/tools` home.

## Actor and task model

- Actor: prospective customer, collaborator, or technically curious visitor.
- Object: an MBMApps application, tool, simulator, or public project.
- Goal: understand what exists, who it serves, what it does, and where to inspect it.
- Decision: open a product brief, visit a live application, try a tool, inspect source, or contact the studio.
- State: public showcase content; access and proof boundaries remain attached to each object.
- Authority: canonical application truth remains in `apps/web/lib/projects.ts`; tool truth remains in `apps/web/lib/tools.ts`.
- Next action: one dominant action per card, with secondary evidence links kept visible but quieter.

## Aura reference ledger

| Source | Role | Observed pattern | Why it works | MBMApps transformation | Rejected identity elements |
| --- | --- | --- | --- | --- | --- |
| `https://www.aura.build/templates` | navigation | visual catalog with search/category orientation | makes a large library legible | one Tools home with category labels and preview-first entries | Aura navigation, counts, palette, and marketplace identity |
| `https://www.aura.build/component/E4B895` | component | browser-preview service card with a clear action | connects an abstract offering to visible output | real MBMApps screenshots paired with purpose, access state, and one primary link | Tailwind composition, ecommerce framing, and source styling |
| `https://www.aura.build/templates/asnstudioz-content-service` | visual | editorial spacing and high-contrast portfolio hierarchy | improves scanning without extra chrome | generous spacing inside the existing terminal/evidence language | template copy, typography, imagery, pricing, and brand composition |

## Originality guardrails

- Preserve MBMApps orange construction signal, terminal readouts, evidence language, and canonical screenshots.
- Do not copy Aura assets, code, copy, iconography, gradients, or trademark composition.
- Use the reference only for catalog legibility, preview-first hierarchy, and spacing.

## Collection-directory rollout

The approved catalog pattern now extends across Services, Work, Articles, Studio, Contact, and application-detail routes. A shared directory keeps the current collection, route purpose, and sibling destinations visible without forcing a return to the homepage.

MBMApps transforms that principle into a compact evidence register using existing graphite surfaces, orange construction signals, mono metadata, truthful route names, and real destinations. It does not import Aura navigation, branding, icons, scripts, copy, or assets. Page content, structured data, telemetry, forms, and product authority remain unchanged.

## Proof gate

- Desktop and 390px mobile screenshots for `/`, `/apps`, and `/tools`.
- All application cards expose intended user, problem, access state, brief, and live destination.
- `/tools` lists every browser utility and simulator, including Cognitive Strategy Utility.
- Keyboard focus, reduced motion, console health, and horizontal overflow checked.
- Web lint, typecheck, tests, production build, and repository smoke recorded before completion.
