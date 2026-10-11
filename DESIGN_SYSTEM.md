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

## Wale route

`/wale` is an intentionally immersive route rendered by `WaleArchiveShell`. Its visual language may use dark archive surfaces, spatial depth, motion, and Wale-specific typography while preserving keyboard access, reduced motion, readable fallbacks, and truthful repository-access boundaries.

Earlier signal-field, Three.js, audio, and astronaut experiments are reference history unless current route source imports them. Their local tests or screenshots do not establish current-route behavior.

## Applications index and briefs

`/apps` and `/apps/[slug]` use the terminal portfolio language and canonical product records. Product artwork may be illustrative when its caption says so; it must not be described as an implemented product screenshot.

## Visual acceptance

Tests establish structural and behavioral evidence, not visual acceptance. A material visual-direction change requires the owner checkpoint defined in `AGENTS.md`, followed by early rendered evidence at representative desktop and mobile sizes.
