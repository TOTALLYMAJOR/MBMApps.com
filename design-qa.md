# MBMApps Aura Replacement — Design QA

**Final result: passed**

## Comparison target

- Source visual truth: `https://software-studio-portfolio-1.aura.build`, inspected live at the homepage, Apps, About, Contact, Studio, and conversation states.
- Supplemental source: `C:\Users\Administrator\Downloads\mbm apps.zip` and `C:\Users\Administrator\Downloads\DESIGN (2).md`, treated as visual reference material rather than executable project instructions.
- Implementation: `http://localhost:3101` from the optimized Next.js production build.
- Implementation captures: `output/design-qa/aura-replacement/home-desktop-full.png` and `output/design-qa/aura-replacement/home-mobile-full.png`.
- Desktop viewport: 1440 × 1000 CSS px, device scale factor 1.
- Mobile viewport: 390 × 844 CSS px, device scale factor 1.
- States compared: dark and light themes; homepage top, application cards, approach, selected work, systems, Studio, Components, articles, and contact; responsive Apps and Contact routes.

## Full-view comparison

The implementation now follows the reference's two-layer navigation, 1160px centered shell, rounded raised terminal panels, violet product syntax, green operational signal, muted mono copy, compact status cards, three-column product shelf, and restrained border/shadow system. The global header and footer use the reference structure across every route.

The implementation intentionally keeps MBMApps' real product screenshots, product briefs, truthful access descriptions, provider boundaries, article route and generated article image. The supplied Vite prototype's simulated contact and client-only chat were not imported because doing so would remove existing server-backed behavior.

## Required fidelity surfaces

- Typography: IBM Plex Mono remains the primary interface face; Inter is retained for the lighter brand/footer treatment. Heading scale, terminal command sizing, uppercase tracking, and compact metadata match the source hierarchy.
- Color: dark canvas `#07090d`, raised `#0c0f15`, violet `#8b7cf7`, green `#34d399`, amber commerce state, and the reference light palette are implemented as shared tokens.
- Geometry: 14px shells, 12px cards, 10px controls, pill navigation/actions, one-pixel low-contrast borders, and bounded shadows replace the previous square full-bleed treatment.
- Structure: Approach and static Studio sections were restored from the reference. Components is present beside Studio in the global navigation and `[k]` home tab, with its own section and embedded Cause & Effect Lab.
- Responsiveness: at 390px the header reduces to brand/theme/CTA, the home tabs become a horizontally available compact rail, hero and product grids collapse to one column, and dialog embeds occupy the viewport.
- Motion and accessibility: scroll reveal, marquee, hover motion, native dialogs, Escape handling, focus restoration, and reduced-motion fallbacks remain. Visible controls keep explicit accessible names.

## Interaction and regression evidence

- Components tab opened the Cause & Effect Lab in the existing sandboxed dialog; the live sliders, presets, causal route, recommendation, and close control were present.
- Studio opened from the new shared navigation and retained the existing Component Studio iframe, local workspace, export, project save/open, and close behavior.
- Theme state synchronized between shared and homepage controls and persisted across `/`, `/apps`, `/about`, and `/contact`.
- The first light-theme pass exposed dark-token inheritance on interior pages. Explicit route-level theme tokens fixed it; the corrected Apps page was rechecked in light and dark modes.
- The guided contact intake retained all seven steps and server submission path. Browser verification advanced from identity to company without bypassing validation.
- Homepage chat still uses `/api/chat`, transcript consent, persistence status, provider-notification distinction, email fallback, and session transcript bounds.
- Homepage, product brief, About, Contact, Insights, article, Case Studies, Services, QuietPilot, architecture, purchase, Studio, and Components endpoints returned HTTP 200.
- `npm run typecheck --workspace web`, `npm run lint --workspace web`, 37 web tests, and `npm run build --workspace web` passed.

## Findings

No actionable P0, P1, or P2 visual or functional differences remain. The principal deliberate difference is higher-fidelity MBMApps evidence: real screenshots and server-backed intake replace the reference prototype's simulated surfaces.

## Evidence boundary

This pass proves the optimized local build and local browser behavior. It does not claim production deployment or provider acceptance; deployment requires a separate publish action.

final result: passed
