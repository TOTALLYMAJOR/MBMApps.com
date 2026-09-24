# Private entrance design record

## Objective

Apply the supplied login-screen direction to the existing `/gate` entrance without changing authentication authority or implying unsupported account, password-reset, or identity-provider capabilities.

## Reference

- Source: user-supplied `pasted-text.txt`
- SHA-256: `838b01393a93db65658052453898929fe4264ca742ae3c4f8a005f78f12f680d`
- Observed patterns: centered secure card, circuit-node framing, compact identity block, progressive form controls, password visibility control, restrained status feedback.

## MBMApps transformation

- Retains the existing four-stage signal sequence, invite phrase, `/api/site-gate` submission, signed cookie, safe return path, rate limit, and failure messages.
- Uses the established graphite, warm-white, orange, mono-label, one-pixel-rule, and bounded-shadow language.
- Uses local React, SVG-free CSS marks, and repository fonts. No reference scripts, remote fonts, remote backgrounds, provider marks, copy, or assets were imported.
- Replaces unsupported account creation, password reset, terms/privacy, and social sign-in controls with truthful session and ownership information.

## Proof gate

- Desktop and mobile screenshots.
- No horizontal overflow at 320px or wider.
- Keyboard access for sequence controls, reset, phrase visibility, submit, and public-site return.
- Reduced-motion behavior remains static and complete.
- Existing site-gate tests, lint, typecheck, and production build pass.
- Browser console remains free of application errors.

## Authority boundary

This is a presentation-layer redesign. Server-side validation remains authoritative. A rendered screen or successful local build is not evidence of a configured production gate, valid invite phrase, deployment, or owner acceptance.
