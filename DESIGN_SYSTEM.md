# MBMApps design system

This document records the current visual and interaction boundaries. It is subordinate to accepted ADRs, `CONTEXT.md`, canonical source, and `PRODUCT_TRUTH.md`.

## Shared principles

- Product truth stays legible before visual novelty.
- Links and controls must remain keyboard reachable with visible focus.
- Motion must respect `prefers-reduced-motion` and must not be required to understand content.
- Product imagery must identify whether it is an implemented capture, a public demo, or concept artwork.
- Responsive layouts must preserve content, actions, and proof boundaries without clipping or horizontal overflow.
- Route-specific identities may differ, but shared navigation and access language must remain coherent.

## Root portfolio

The root route uses the terminal/editorial MBMApps identity implemented by `TerminalPortfolioHome`, with the orange system palette, structured product sections, real links, server-backed intake behavior, and the existing operating-world visual. It is a product surface, not a disposable marketing mockup.

Product cards consume `projectScreens`. Adding or removing a visible product is a canonical product-registry change, not a presentational JSX edit.

### Owner-selected studio arrival — 2026-10-12

- Every normal visit to `/` renders the existing Google/Microsoft/Apple/Guest entrance first. A server-established returning session gets an explicit Continue control; it is not signed out or forced through OAuth again.
- After identity establishment or Continue, a black screen with white typography reads: “Michael Brandon & MBMapp Studios welcome you.” It holds briefly, then fades into the existing orange terminal homepage. The visitor may continue early; reduced motion removes the hold and fade. The welcome marker is presentation-only and grants no access.
- The homepage hero and operating-world sphere remain intact. Below that hero, the existing Living Archive mounts at Cinema quality only when its section enters the viewport. `/wale` remains the full direct experience; the homepage does not duplicate the blue concept workflow.
- Technology: retain the selected React/Framer Motion stack for the welcome and a native IntersectionObserver for viewport activation. Reuse the existing renderer and its pixel-budget, DPR, and reduced-motion safeguards. No dependency, new imagery, scroll interception, or paid service is added. Cinema startup/runtime cost remains device-dependent and is not a measured universal frame-rate guarantee.
- Preserve `/conceptdesigns`, `/MasterSC`, Firebase identity authority, guest chat/discussion restrictions, and the separate loopback workbench preview (observed on port 8788). A local four-digit preview code is not public website identity.
- First proof: local desktop/mobile entrance → Continue → welcome → homepage captures, no archive iframe before scrolling, Cinema iframe after scrolling, reload returning to the entrance, reduced-motion behavior, and no horizontal overflow. Provider and deployed-site acceptance remain separate checks.

### Owner-selected homepage hierarchy refinement — 2026-10-13

- Visual direction: retain the black, white, and orange terminal world while making Wale the unmistakable primary path. The first viewport offers only Wale and one portfolio path; the navigation keeps Wale, Portfolio, Studio, and the member-only discussion destination.
- Page shape: preserve the Wale archive as the lead chapter and follow it with QuoteFlow and QuietPilot as the two supporting product stories. The owner-selected proof-driven operating-world composition then replaces the typed portfolio index and dedicated studio close: its sphere, stage controls, labels, and current-state bar lead into one destination hierarchy. Featured Systems keeps Wale primary beside QuoteFlow and QuietPilot; More Destinations progressively reveals LeaguePilot, SportPilot, and SC2 Master Coach; Studio Paths retains local-bridge-aware Wale profiling, member chat when authorized, and the existing control-plane simulation. Contact is the closing primary action.
- Taxonomy: homepage labels distinguish a development system, product system, product, website preview, and protected showcase. Names, destinations, statuses, catalog visibility, and proof boundaries continue to derive from the canonical product records; presentation does not redefine them.
- Technology and constraints: reuse the existing Next.js client component, GSAP/Lenis motion, Wale renderer, and CSS system. Add no dependency, asset, paid service, route, authentication behavior, persistence behavior, or provider claim. Reduced-motion behavior and current product routes remain protected.
- Typography: keep the established Bricolage Grotesk display voice and IBM Plex Mono interface voice, with functional navigation, action, status, arrival, and footer text raised above the earlier microtype floor. Touch targets remain at least 44px where the refined homepage owns them.
- Business objective: within five seconds, the visitor should understand that MBMApps builds focused, evidence-led operating products; the journey should make Wale and the two featured products credible enough to explore, then offer one unmistakable route to discuss a real operation. Usability scoring does not replace this persuasion test.
- First observable proof: local desktop, mobile, deep-scroll, keyboard, and reduced-motion captures show the restored operating-world relationship, working stage selection, all six destination links, explicit external/protected cues, retained studio actions, readable functional type, visible focus, and no clipping or horizontal overflow. Tests and local captures do not establish owner acceptance, provider state, deployment, or production behavior.

## Wale route

`/wale` is the canonical current Wale route rendered by `WaleArchiveShell`. Its visual language may use dark archive surfaces, spatial depth, motion, and Wale-specific typography while preserving keyboard access, reduced motion, readable fallbacks, and truthful repository-access boundaries.

The homepage links directly to `/wale` and includes a scroll-started embed of the same archive renderer, not a competing blue `#wale` experience.

`/conceptdesigns` owns the blue Wale `AbyssArrival` and retained deterministic precision workflow through `WaleExperience`. It is explicitly a concept-design surface, not the canonical current Wale product. Earlier signal-field, Three.js, audio, and astronaut experiments remain reference history unless a current route imports them. Their local tests or screenshots do not establish current-route behavior.

- Opening direction: `/wale` begins with a black field and white typographic translation of the concept arrival, without the SABLEFIN specimen, then hands off automatically after a short bounded hold and mounts the Living Archive at Cinema quality. A visible Enter control may advance the handoff early. The archive does not preload because its Cinema initialization can delay the opening timer on a shared browser thread.
- Opening technology: reuse the installed Framer Motion client stack for a route-local opacity/transform exit. Do not add Lenis, scroll interception, or another animation dependency.
- Rendering default: the embedded archive opens with the existing `cinema` quality preset. Its established pixel-budget and DPR caps remain the rendering safety boundary; local checks do not prove performance on every device.
- Accessibility and fallback: the opening remains readable before motion runs, keyboard focus stays outside the archive until it mounts, and reduced-motion preference removes the hold and shortens the crossfade.
- First observable proof: desktop and mobile captures must show the monochrome opening, absence of the specimen, automatic and early-entry handoffs, the archive reporting Cinema in its director controls, visible focus, and no horizontal clipping. Captures support review; they do not establish owner acceptance or hosted behavior.

## Applications index and briefs

`/apps` and `/apps/[slug]` use the terminal portfolio language and canonical product records. Product artwork may be illustrative when its caption says so; it must not be described as an implemented product screenshot.

## MasterSC route

`/MasterSC` is a protected interactive portfolio showcase for SC2 Master Coach. It retains the supplied command-console hierarchy while translating the surface into MBMApps' graphite-and-orange terminal language.

- Visual direction: structured tactical console with a status strip, module rail, doctrine workspace, concept sheet, command grid, supply checkpoints, and asset bay.
- Motion technology: route-local GSAP and ScrollTrigger reveals using transform and opacity only. No Lenis, scroll hijacking, pinned sections, custom cursor, or pointer parallax.
- Asset policy: original abstract geometric marks only. Do not use Figma-hosted URLs, extracted game artwork, Blizzard logos, or redistributed Blizzard assets.
- Product boundary: every interactive value is deterministic sample state. The route does not claim live game telemetry, local runtime operation, deployment, release acceptance, coaching outcomes, or Blizzard affiliation.
  - Publication boundary: the route is present in the protected sitemap. The owner selected a final homepage preview chapter and navigation anchor on 2026-10-13, following Wale → QuotePilot → QuietPilot → SportPilot → LeaguePilot. It links to the same-origin `/MasterSC` route and remains hidden from `projectScreens`, `/apps`, and the footer. SportPilot and MasterSC reuse the existing scroll-through iframe pattern, with full interaction available through their links; no new motion technology or assets are introduced. First proof: desktop/mobile previews, working destination links, and uninterrupted scrolling. This selection does not authorize deployment.
- First observable proof: desktop and mobile route captures showing the command hierarchy, selection states, visible focus, reduced-motion fallback, and no horizontal clipping. Captures support visual review; they do not establish owner acceptance or hosted authentication behavior.

## Visual acceptance

Tests establish structural and behavioral evidence, not visual acceptance. A material visual-direction change requires the owner checkpoint defined in `AGENTS.md`, followed by early rendered evidence at representative desktop and mobile sizes.
