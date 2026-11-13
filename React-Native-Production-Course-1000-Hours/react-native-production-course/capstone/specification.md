# PocketPilot capstone specification

An original personal-finance application inspired by the workflow category of Rocket Money. Required live integrations in the learning project use sandbox/test environments. Real cancellation, negotiation, transfers, credit services, and live bank operations are separate extensions and must never be represented as completed by a simulated button.

## Milestones and 140-hour capstone budget

| Block | Hours | Deliverable |
| --- | ---: | --- |
| Architecture and acceptance design | 14 | Data model, trust boundaries, one chosen stack |
| Domain and fixture UI | 28 | Accurate totals, budgets, recurring candidates, goals |
| Chosen backend | 28 | Auth, isolation, storage, safe user edits |
| Sandbox bank integration | 24 | Link, exchange, cursor sync, reconnection, disconnect |
| Premium and privacy lifecycle | 20 | Purchase/restore, server entitlement, export/deletion |
| Acceptance and recovery | 26 | Device journey, reconciliation, runbooks, evidence |
| **Total** | **140** | Earlier chapters supply prerequisites and prototypes |

## Required behavior

| Feature | Acceptance evidence |
| --- | --- |
| Overview | Defined period/currency and last successful sync time; no invented available-balance claim |
| Transactions | Pagination, stable identity, pending/posted distinction, detail, category annotation |
| Budgets | Minor-unit limit, explicit date interval, refund/transfer policy, visible overage |
| Recurring review | Evidence, estimated date/amount, confirmation/dismissal; false-positive handling |
| Goals | Manual progress clearly described as tracking rather than money transfer |
| Auth | Session restore, recovery, social/native path if chosen, logout/cache clearing |
| Local unlock | Enrollment/denial/cancel handling; server identity remains independent |
| Banking | Short-lived client link token; long-lived credential stays server-only |
| Reconciliation | Added/modified/removed records, pending replacement, atomic cursor consistency |
| Premium | Store sandbox purchase, restore, management, expiry/refund/revocation handling |
| Premium API | Direct free-user request denied despite modified client UI |
| Export | Correct scope, currency/date definitions, safe text escaping, explicit share |
| Disconnect | Stop future sync, revoke/remove connection, explain historical-data policy |
| Deletion | Durable retryable workflow across identity, objects, provider access, caches |
| Accessibility | VoiceOver/TalkBack, large text, reduced motion, meaningful labels |
| Reliability | Offline restart, failed save, expired session, delayed webhook, provider outage |

## Security and data rules

Derive ownership from a verified session. Enforce cross-record ownership constraints. Split provider facts from user annotations. Store secrets only on the server. A webhook is untrusted until its provider verification succeeds. Deduplicate operations and events. Scope query keys, local records, and queues by identity. Do not let delayed events recreate a deleted account. Never aggregate different currencies silently.

## Final demonstration

From a clean install: create an account, restore a session, add a sandbox source, read transactions, edit a category, create a budget, confirm a recurring estimate, adjust a manual goal, purchase and restore sandbox Premium, use an authorized premium feature, export synthetic data, disconnect the source, and initiate deletion. Demonstrate failure and recovery on both iOS and Android release-like builds.

## Review rubric

| Area | Weight | Evidence |
| --- | ---: | --- |
| Domain and reconciliation correctness | 25 | Meaningful automated cases and synthetic incident walkthrough |
| Identity, authorization, privacy | 25 | Two-user isolation, server boundaries, deletion, secret/log review |
| Mobile UX and accessibility | 15 | Device journeys, keyboard, large text, screen readers |
| Payments and lifecycle | 15 | Sandbox lifecycle matrix and server enforcement |
| Build, release, and operations | 10 | Preview builds, compatibility, rollback, runbooks |
| Product and marketing clarity | 10 | Honest listing, activation funnel, bounded experiments |

Treat any cross-user data exposure, client-exposed privileged credential, unverified paid entitlement, or misleading live financial action as a blocking defect regardless of aggregate score. “Ready for review” is distinct from store approval or live-provider authorization.
