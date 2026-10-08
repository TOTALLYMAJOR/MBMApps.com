# Wale particle landing and opt-in music

## Release boundary

The owner's current Wale particle experience replaces the old `/wale` route
experience. The MBMApps homepage, shared layout, existing Wale home chapter,
API and dependency lockfile are retained from production revision
`2be833594f4738956817d074c5ba204b1d9bed47`.

The existing development checkout remains untouched except for the bounded
audio implementation. Release integration is in a separate worktree. The new
particle stylesheet is named `wale-particles.module.css` so the retained older
Wale components keep their existing styles. Shared footer suppression applies
only when the new experience is mounted. The shared layout retains ownership
of the page's main landmark.

## Owner-selected design and delivery

- Retain the white particle field, wider/deeper arrangements, ground lift,
  thin cobalt sweep, scrolling chapter fades and two white profile actions.
- No astronaut, no action inside the particle ring.
- Music: Beethoven, Moonlight Sonata, first movement; Paul Pitman / Musopen.
- Delivery: self-hosted MP3, native HTML audio, no third-party player scripts.
- Default off. No audio URL is assigned until activation. Initial volume 24%.
- Pause/resume, keyboard activation, cancellable loading, visible failure and
  retry. Pause when the document is hidden; do not resume without activation.
- No forced looping or autoplay. A user can independently pause scene motion.
- Asset download is 7,181,083 bytes; browser reports 335.79102 seconds.
- Credit remains visible in the Wale footer. See `apps/web/public/audio/README.md`
  for source revision, permission statement, checksum and recording provenance.

## Functional boundaries

Particles are illustrative, not live repository evidence. Repository entry
checks URL syntax only. Opening local Wale requires the local bridge on port
8787 and the matching checkout. The public site does not upload, analyze or
transfer the repository to the local origin.

## Verification and known limits

The browser music check covers default-off/no initial request, actual playback
clock advancement, pause/resume, keyboard activation, blocked download/retry,
and 1672, 768, 390 and 320 pixel layouts. Captures and the browser check script
are retained locally under `wale-artifacts/lusion-system-discovery-v2/music/`.
A failed-download check exposed and fixed an error/pause-event state race.

Release must pass `npm run validate`, local smoke checks, browser verification
of `/wale`, and the protected `validate` GitHub check before merge. Provider
READY and live route verification are separate from local tests.

Known inherited limits: frame rate depends on hardware; narrow desktop framing
may crop the particle ring and bright particles can cross repository copy.
The existing dependency audit has advisories; dependencies are unchanged here.
No legal-clearance or real repository analysis claim is made.

## Reversal

Revert the scoped release commit or roll back to the previous Vercel production
deployment. Do not reset or remove the owner's development checkout.
