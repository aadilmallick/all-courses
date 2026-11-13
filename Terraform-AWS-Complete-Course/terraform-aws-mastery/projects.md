# Cumulative projects and reference paths

These projects are optional applications. Each has a concrete starting implementation and evidence direction. They do not impose quizzes or claim unfinished extensions are delivered features.

## 1. A local service catalog

Start with `labs/00-local`. Add scheduler with a stable key and a stage-only enabled choice. Publish active names and total desired replicas. Reference: Chapter 2's filtering and sum expressions. Acceptance evidence: expected manifest, validation rejects negative/fractional replicas, adding a key preserves existing addresses. Destroy the local records afterward.

## 2. Private artifact storage

Start with `labs/01-bucket`, then compare `modules/private-bucket`. Reference: Chapters 3 and 7. Evidence: verified account, reviewed plan, service-level settings, a tiny synthetic object-version recovery, deliberate data cleanup. The reusable module is the complete reference for ownership controls and TLS enforcement.

## 3. A network you can explain

Start with `labs/02-network`. Add a third zone with a unique slot. Reference: Chapter 4 and the network module tests. Evidence: correct nonoverlapping CIDRs, existing identities/ranges preserved, explicit route associations, accurate explanation of why S3 access differs from arbitrary internet egress. No real workload connectivity is claimed without a client test.

## 4. A visible service release

Start with `labs/03-serverless` and `assets/handler.py`. Reference: Chapter 5. Evidence: correct handler/package layout, content hash, scoped invocation/logging identities, HTTP status/release, configuration-only release change followed by an artifact change. This is a complete public nonsecret health API, not a user-data service.

## 5. Controlled management and delivery

Use `labs/04-bootstrap`, `labs/05-modules`, `labs/06-refactor`, `scripts/check_plan.py`, and `scripts/pipeline.py`. Reference: Chapters 6–10. Evidence: state migration preserves IDs, address migration preserves ID, replacement is caught by policy, changed artifacts/source refuse old-plan application, normal post-change plan understood. Use a scratch copy for deliberate failure cases.

## 6. Field Notes operations capstone

Start with `labs/07-capstone`. Follow Chapter 12's preflight, checks, plan, apply, probes, release change, drift observation, recovery design, review rubric, and teardown. Deliver a concise runbook and architecture decision with source/artifact/run evidence. Reference implementation includes bucket, release table, health API, logging, and error alarm; notification routing and application CRUD are explicit additional work.

## Expert extensions

The complete `labs/08-multiaccount` root assumes an already-authorized target role. The complete optional `labs/09-rds` root requires current supported engine/class inputs and creates cost-bearing private database infrastructure with deletion protection. Neither creates organization governance or a database application. New CRUD/authentication, custom-domain, container, Kubernetes, or multi-region projects require their own requirements, current service checks, and operating evidence as explained in Chapters 11–12.
