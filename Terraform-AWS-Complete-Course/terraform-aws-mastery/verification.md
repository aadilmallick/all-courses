# Verification report

Verified November 13, 2026. This report describes the delivered local edition; it does not claim that your AWS account or a hosted CI system was exercised.

## Textbook and structure

- Twelve canonical chapters, one assembled Markdown volume, and one prebuilt HTML reader.
- **45,310 prose words**, excluding fenced code, across the chapters. **60,438 cl100k_base tokens** including useful code and chapter Markdown, measured deterministically with tiktoken 0.12.0. Every chapter exceeds 5,000 tokens; the per-chapter counts are in [depth-report.json](references/depth-report.json).
- The Textbook Workshop validator ran in final mode with zero structural/depth errors. Package-wide Markdown link and fence checks also passed.
- Reading order, local prerequisite teaching, worked intermediate behavior, deliberate fragment labels, optional applications/reference approaches, source provenance, complete source paths, and declared limitations were reviewed.
- The generated HTML reader was inspected in the installed Chrome browser on Windows at desktop and narrow viewport sizes. Chapter navigation/search and code rendering worked. Representative Chapter 1/mobile and Chapter 9/desktop screenshots were visually inspected. This is not a claim to inspect every screenful of the full book or every Markdown viewer.

## Terraform and local execution

- Terraform **1.17.2 windows_amd64** executed; HashiCorp AWS provider **6.0.0** obtained through the official registry package path and checksum record. The downloaded CLI archive matched the published SHA-256 checksum. No claim of independent CLI GPG signature verification is made.
- `terraform fmt -check -recursive` passed for the delivered source.
- **14** roots/modules validated against the selected schemas with **zero errors and zero warnings**.
- **37** Terraform/test HCL files parsed with python-hcl2 7.3.1.
- **3** built-in-provider Terraform test runs passed for the local catalog; **5** mocked AWS contract test runs passed across storage, network, and health API modules.
- A real local apply created the built-in service manifest; its observed API/worker replicas matched expectations. It was destroyed through Terraform afterward.
- A real moved-block plan contained no create/delete resource actions, application preserved the managed ID, and the local demonstration was destroyed afterward.
- The portable pipeline executed a real local plan, parsed its actual JSON, passed the narrow policy, and applied the same reviewed plan. Wrong approval digest, changed source, tampered plan bytes, and invalid age interval were refused before apply.
- The Lambda package rebuilt to identical bytes; its sole archive entry was handler.py at the archive root, matching the included source.

See [execution-results.json](references/execution-results.json) and [verification-results.json](references/verification-results.json).

## Python and browser companion

- Python **3.12.14** on Windows ran **15 unittest methods** for handler behavior and policy parsing, including replacement action order, scoped exceptions, malformed/unsupported input, incomplete plans, and unknown required flags.
- All **12** companion models passed deterministic assertions covering reconciliation, collection identity, simplified IAM decisions, CIDR arithmetic/longest route, average concurrency, lock ownership/stale writes, module defaults, migrations, policy, artifact age/identity, architecture heuristics, and cost arithmetic.
- Browser interaction checks exercised all experiment navigation/default results, invalid network input, route updates, competing lock refusal, reset, replacement policy, cost recalculation, source loading, reader contents filtering, and sensitive-path server refusal.
- Desktop **1440×1000** and mobile **390×844** layouts had no observed document-level horizontal overflow. The network experiment desktop/mobile and representative reader layouts were visually inspected. No browser exceptions occurred in the exercised flows.
- The companion and reader have no third-party runtime dependencies or remote assets. The server binds to localhost and serves an explicit distributed-file allowlist. Optional authoring tools are separately pinned.

See [browser-results.json](references/browser-results.json). Keyboard controls use native elements and visible focus; no complete screen-reader or assistive-technology audit was performed. Other browsers and operating systems remain untested.

## Deliberately unexecuted service behavior

No AWS login, real AWS plan/apply, cloud resource creation, HTTP request to a deployed AWS endpoint, database connection/restore, real multi-account role assumption, hosted OIDC/CI, HCP Terraform workspace/Stack, or provider-defined action was executed. Real service acceptance, organization policies, current region/zone/engine/class availability, quotas, costs, performance, and cloud recovery need an authorized sandbox and the chapter-specific evidence.

The reference health API implements only a public nonsecret GET /health response. It does not implement note CRUD, authenticated data routes, table access, private artifact delivery, custom domains, or multi-region failover. The capstone's error alarm has no invented notification destination. Optional RDS infrastructure is cost-bearing and deletion-protected; no complete database application is claimed.

## Reproduction and archive

Use the commands in README.md and each module README. Standard-library Python and dependency-free Node checks require no authoring packages. `scripts/measure_depth.py` uses the optional pinned authoring requirements and the named encoding; tokenizer vocabulary download may be required on a new machine.

The portable ZIP is assembled from intended relative-path course files, with caches, real local inputs, state, plans, credentials, temporary verification work, and Git internals excluded. Archive CRC/inventory checks and a SHA-256 digest accompany delivery. `SHA256SUMS` records packaged source/output bytes; it is an integrity inventory, not an authenticated signature.
