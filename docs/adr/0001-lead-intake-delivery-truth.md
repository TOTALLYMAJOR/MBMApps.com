# ADR 0001: Lead intake delivery truth

- Status: Accepted
- Date: 2026-09-13

## Context

The public contact route previously returned a successful queued response when the backend was unavailable, even though no durable queue existed. Guided-chat notification also risked treating provider acceptance as the primary success condition. Both behaviors could lose leads or cause duplicate retries while presenting stronger proof than the system held.

## Decision

All public lead surfaces use shared contracts and persist through the Express API before the UI claims success.

- Contact submissions write to `contactSubmissions` and return `state: "persisted"` only after Firestore accepts the write.
- Guided-chat leads write to the separate `leadSubmissions` collection so partial chat records cannot distort champion-cohort analysis.
- Missing credentials and Firestore write failures return `503`; synthetic demo fallbacks never apply to lead writes.
- Honeypots return `state: "filtered"` and never claim persistence.
- Guided-chat provider notification runs only after persistence. Its state is reported independently as `provider-accepted`, `unavailable`, or `failed`.
- The Next routes enforce same-origin browser requests and a 16 KiB body limit before forwarding validated data.

## Consequences

The interface can make precise claims, notification failures do not invite duplicate submissions, and tests can inject repository failures without requiring live Firebase. Hosted persistence and inbox delivery still require environment-specific verification; local tests prove control flow and contract behavior only.
