# ADR 0002: Firebase site access and chat authorization

- Status: Accepted
- Date: 2026-10-12

## Context

The Signal Lock entrance was a visual simulation. Its simulation request could open the portfolio without credentials, and disabling its environment gate bypassed site protection. The owner selected a different product boundary: every visitor must establish an identity before entering; a visitor may choose restricted guest access; and a guest must have no visibility of guided chat or the Discord discussion surface.

The repository already uses Firebase client authentication in the web app and Firebase Admin in the Express API. Replacing those authorities with another identity platform would add a second authentication system and migration burden.

## Decision

Firebase Authentication is the identity authority for whole-site access.

- Google, Microsoft, and Apple Firebase providers produce `member` access.
- Firebase Anonymous Authentication produces `guest` access.
- The browser sends only its Firebase ID token to the same-origin Next route. The Next route forwards the bounded token to the Express API, where Firebase Admin verifies validity and revocation before deriving the role from `firebase.sign_in_provider`.
- The browser cannot assert `guest`, `member`, or a provider name. Unsupported verified providers are refused.
- After verification, the Next route issues a short-lived, HTTP-only, same-site, HMAC-signed cookie containing only the role and expiry. Missing Firebase Admin configuration or a missing session-signing secret fails closed.
- Middleware requires a valid site session for all application pages and APIs except the entrance and its session endpoint.
- Guest sessions may browse the portfolio. They cannot reach `/discuss` or `/api/chat`, and chat/discussion controls are omitted from homepage, header, and footer rendering. The Next chat route forwards the signed session to the API, which independently requires `member` before accepting a chat lead; the public API address cannot bypass the web decision.
- Sign-out clears both the server session cookie and the browser Firebase session.

## Consequences

The site is no longer public content. Protected pages are marked `noindex`, and the discussion route is omitted from the sitemap. Provider setup, authorized domains, Firebase Admin credentials, the session signing secret, and a reachable API are runtime requirements.

Google and Microsoft use their Firebase OAuth configurations. Apple sign-in also requires Apple-side configuration and may require an Apple Developer membership. A local test or build proves only application control flow; hosted acceptance requires real provider sign-in, anonymous sign-in, guest route denial, member chat access, expiry, sign-out, and recovery checks in the target environment.
