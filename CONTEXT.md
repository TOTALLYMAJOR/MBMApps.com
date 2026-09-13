# MBMApps Domain Context

This glossary names the lead-intake states shared by the web app, API, tests, and operational documentation.

- **Lead**: A visitor-provided contact request or guided-chat transcript that the studio is authorized to use for a reply.
- **Receipt**: The server response describing what happened to a lead. A receipt must not imply more than the system has proven.
- **Persisted**: Firestore accepted the lead write. This is the only state the UI may describe as saved.
- **Filtered**: The request matched an intake filter such as the honeypot. It was deliberately not persisted and must never be reported as persisted.
- **Provider accepted**: After persistence, the configured notification provider accepted the outbound studio notification. This is not proof of inbox delivery or human response.
- **Notification unavailable**: The lead is persisted, but provider configuration is absent.
- **Notification failed**: The lead is persisted, but the provider rejected or failed the notification attempt.
- **Guided chat**: Deterministic, session-local prompts that help a visitor articulate context. It is not represented as a live human or autonomous support agent.

The governing invariant is: **persistence determines lead acceptance; notification is an orthogonal follow-up state**.
