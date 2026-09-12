# MBMApps Terminal Portfolio — Design QA

**Final result: passed**

## Comparison target

- Source visual truth: `output/playwright/source/.playwright-cli/page-2026-09-12T19-32-53-485Z.png` (live pyasma dark desktop), plus `page-2026-09-12T19-33-16-156Z.png` (live mobile) and the user-supplied full-page screenshot.
- Implementation: `output/playwright/prototype/.playwright-cli/page-2026-09-12T22-12-32-903Z.png` (full-width ecommerce composition), `output/playwright/.playwright-cli/page-2026-09-12T22-19-16-621Z.png` (Component Studio overlay desktop), `page-2026-09-12T22-19-58-981Z.png` (Component Studio overlay mobile), and `output/playwright/prototype/.playwright-cli/page-2026-09-12T19-52-58-844Z.png` (mobile guided-chat reply state).
- Desktop viewport and pixels: 1440 × 1000 CSS px, device scale factor 1, 1440 × 1000 PNG for both source and implementation.
- Mobile viewport and pixels: 390 × 844 CSS px, device scale factor 1, 390 × 844 PNG for both source and implementation.
- State: dark theme, homepage top and ecommerce anchor. Interaction evidence additionally covers light theme, chat open/reply, systems disclosure, reveal motion, ecommerce parallax, and the Component Studio open/use/close flow.

## Full-view comparison evidence

The source and implementation were opened together at matching desktop viewport, theme, and density. The implementation preserves the reference's compact command navigation, mono body typography, orange command syntax, two-column identity/status hero, thin rules, flat dark cards, marquee capability strip, and dense responsive rhythm. MBMApps intentionally replaces résumé/activity content with its real products, authority maps, field notes, and contact path.

Focused review was used for the hero/status region, product shelf, mobile navigation/hero, and mobile chat. These are the highest-risk areas for typography, cropping, overflow, and interactive controls.

## Required fidelity surfaces

- Fonts and typography: IBM Plex Mono and Space Grotesk provide the reference's mono/system contrast. Post-review hero sizing was reduced to 78px desktop and 58px mobile maximum to restore terminal restraint and prevent narrow-screen overflow.
- Spacing and layout rhythm: the shell now uses the full viewport with fluid 24–64px desktop gutters; mobile retains 14px gutters. Section spacing, one-pixel borders, card gaps, and the two-column hero track closely with the source. Section headings remain above their content instead of using the source's desktop left rail; this is an intentional product adaptation so product cards retain readable width.
- Colors and tokens: dark canvas, low-contrast gray text, one orange syntax accent, green availability state, and flat panel surfaces match the source language. The light accent was darkened for normal-text contrast.
- Image quality and assets: real local MBMApps product screenshots are used, with responsive Next Image sizing and the first product prioritized for LCP. The ecommerce gallery uses fresh 1440 × 900 captures of Wake for Warriors and Jour et Nuit rather than mock placeholders. The studio mark intentionally replaces the source portrait rather than copying its authored character asset.
- Copy and content: all names, links, access descriptions, proof boundaries, and calls to action come from MBMApps' existing product records. The chat identifies itself as guided and session-local and makes no unsupported AI or delivery claim.

## Comparison history

### Pass 1 findings

- P1: hero type and shell proportions were too large/narrow relative to the reference.
- P1: decorative fireflies introduced visual noise absent from the reference.
- P1: chat used modal ARIA without modal keyboard behavior; nested main landmarks were invalid.
- P1: long chat threads could hide the newest response.
- P2: duplicated marquee content repeated in the accessibility tree and reduced-motion could hide items.
- P2: compact chat controls and theme/link targets were below reliable touch size.
- P2: systems cards showed false link affordances; mailto transcript was unbounded.
- P2: light-theme accent contrast was insufficient at small sizes.

### Fixes made

- Reduced and rebalanced hero typography; widened the shell; hid the global firefly layer on this route.
- Replaced the nested main landmark and upgraded chat to a native modal dialog with Escape close, browser focus containment, focus restoration, backdrop, body scroll lock, and auto-scroll.
- Made repeated marquee content decorative to assistive technology and static/wrapping under reduced motion.
- Increased key hit targets to at least 44px and darkened the light-theme accent.
- Converted authority-map headings to real links and bounded the transcript handed to email.
- Added responsive full-height mobile chat treatment and prioritized the first product image.

### Post-fix evidence

- Desktop production preview: `output/playwright/prototype/.playwright-cli/page-2026-09-12T21-50-04-559Z.png`.
- Full-width follow-up preview: `output/playwright/prototype/.playwright-cli/page-2026-09-12T21-57-52-813Z.png`; the shell now uses viewport-relative gutters instead of a fixed maximum width.
- Mobile post-review preview: `output/playwright/prototype/.playwright-cli/page-2026-09-12T21-41-09-418Z.png`.
- Browser console after production-preview reload: 0 errors, 0 warnings.
- Mobile overflow check after the full-width change: `innerWidth: 390`, `scrollWidth: 390`.
- Primary interactions tested: anchor navigation availability, dark/light toggle, systems show-all disclosure, chat open/close, guided app-selection reply, and email-transcript link presence.

### Ecommerce and motion pass

- Generated section direction: `/home/administrator/.codex/generated_images/01a096cd-0876-7482-b882-0bb61d1ba2c9/exec-0df3319a-ad13-4527-8ae8-15c22106241f.png`.
- Rendered desktop composition: `output/playwright/prototype/.playwright-cli/page-2026-09-12T22-12-32-903Z.png`.
- The large/small asymmetric gallery, orange command block, indexed descriptions, and live destination links were compared against the generated direction.
- Motion is progressive: sections reveal once when intersecting, product cards stagger, the stack marquee moves continuously, ecommerce media receives bounded scroll drift, and hover states lift/scale content.
- `prefers-reduced-motion: reduce` removes entrance, marquee, parallax, and hover transition motion while leaving every item visible.

### Component Studio utility pass

- The supplied 334,030-byte standalone utility is preserved byte-for-byte at `apps/web/public/component-studio.html` and isolated from homepage globals inside an iframe.
- It lazy-loads only after `[u] studio` is opened, then remains mounted so in-session work is not discarded on close. The utility's own `component-studio.v3` localStorage and project download/export flows remain intact.
- Desktop overlay evidence: `output/playwright/.playwright-cli/page-2026-09-12T22-19-16-621Z.png`.
- Mobile overlay evidence: `output/playwright/component-studio-mobile-final.png` (final production build).
- Browser checks: 390px viewport/scroll width parity, close button focused after open, inner Mobile viewport control usable, focus returned to `[u] studio` after close, and body scroll restored.
- Progressive enhancement check: with JavaScript disabled, reveal sections remain at opacity 1/transform none; motion-only hiding is enabled after client hydration.

## Findings

No actionable P0, P1, or P2 differences remain for the requested "similar format" adaptation.

## Open questions

None blocking. The guided chat is deliberately frontend-only; persistence or live-agent delivery would require a separately authorized backend/integration scope.

## Implementation checklist

- [x] Live desktop and mobile reference captured.
- [x] Responsive MBMApps implementation captured and compared.
- [x] Product links and truthful access states preserved.
- [x] Theme, disclosure, guided chat, focus behavior, email handoff, reveal motion, ecommerce parallax, and Component Studio tested.
- [x] Typecheck, 16 web tests, production build, and browser console passed.

## Follow-up polish

- P3: add an original MBMApps portrait or illustration if the studio later supplies one; the current typographic mark is intentionally minimal.
- P3: consider a desktop section-label rail in a future fidelity pass if reference similarity should take precedence over product-card width.

final result: passed
