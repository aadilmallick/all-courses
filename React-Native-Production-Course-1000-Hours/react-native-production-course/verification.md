# Verification report

Verified on **November 13, 2026**, with **Node v24.22.1**.

## Completed checks

| Check | Result |
| --- | --- |
| Planned learner hours | 1,000, exactly |
| Complete teaching chapters | 10 |
| Teaching-chapter whitespace words | 50,718 |
| Depth criterion | Every chapter contains at least 5,000 whitespace-separated words |
| SDK catalog | 90 distinct top-level official SDK entries, package mapping and source per entry |
| Markdown fences | 380 delimiter lines checked; balanced |
| Local links and anchors | 153 checked; no broken targets |
| TypeScript fence syntax | 137 parsed through Node type stripping; no syntax errors |
| Executable domain tests | 23/23 passed |

The depth measure uses Python `str.split()` and counts prose and code as whitespace-separated words. A suitable model tokenizer was not available locally. This is the documented conservative word-count proxy, **not** an exact model-token measurement. No exact 5,000-token claim is made.

TypeScript syntax parsing uses `node:module.stripTypeScriptTypes` (Amaro). It does not resolve imports, check third-party package declarations, perform semantic type checking, compile TSX, or execute a vendor API. Ninety syntax probes are compile-time SDK-discovery examples and invoke no runtime capability. The remaining TypeScript blocks include teaching fragments whose external prerequisites are stated.

## Per-chapter depth and hours

| Chapter | Hours | Whitespace words |
| --- | ---: | ---: |
| [01-typescript-react-and-expo.md](lessons/01-typescript-react-and-expo.md) | 80 | 5,180 |
| [02-router-ui-and-mobile-interactions.md](lessons/02-router-ui-and-mobile-interactions.md) | 100 | 5,115 |
| [03-state-offline-and-expo-sdk.md](lessons/03-state-offline-and-expo-sdk.md) | 110 | 5,089 |
| [04-supabase-and-clerk.md](lessons/04-supabase-and-clerk.md) | 110 | 5,051 |
| [05-firebase-and-better-auth.md](lessons/05-firebase-and-better-auth.md) | 110 | 5,168 |
| [06-amplify-and-appwrite.md](lessons/06-amplify-and-appwrite.md) | 100 | 5,043 |
| [07-payments-and-subscriptions.md](lessons/07-payments-and-subscriptions.md) | 100 | 5,034 |
| [08-pocketpilot-capstone.md](lessons/08-pocketpilot-capstone.md) | 140 | 5,009 |
| [09-quality-security-and-release-engineering.md](lessons/09-quality-security-and-release-engineering.md) | 80 | 5,009 |
| [10-stores-marketing-and-operations.md](lessons/10-stores-marketing-and-operations.md) | 70 | 5,020 |

## Executed behavior

The 23 dependency-free tests exercise integer money parsing, currency exponents, malformed input, safe-integer overflow, currency mixing, real calendar dates, month-end clamping, refunds, pending/transfer exclusions, period boundaries, budget overage, recurring-candidate evidence, entitlement expiry/revocation, duplicate source IDs, modifications/removals, pending-to-posted annotation preservation, cursor consistency, and connection scoping.

See [test output](domain-test-output.txt) and [machine-readable results](verification-results.json). Repeat with `python tools/verify_course.py`.

## Required validation in your own project

Expo and vendor dependencies were not installed here. The mobile overlay was not compiled or run. Full semantic TypeScript checks, TSX compilation, Postgres/RLS execution, cloud authentication/storage, store sandbox purchases, Plaid Sandbox calls, physical devices, signed native builds, and store submission were **not run**. Chapter acceptance work describes how to perform them. No real financial account or payment was used.

The 90-entry SDK catalog is a complete top-level module navigation and TypeScript-discovery catalog for the researched index. It is not an exhaustive reproduction of every upstream method, Expo UI component, or platform-specific option. All module pages were retrieved; some Markdown URLs failed and were resolved through their ordinary page URLs. Native compatibility remains subject to actual builds.

Policy and version facts were checked against primary documentation on the research date. Pricing, quotas, regional billing programs, store deadlines, and SDK compatibility must be rechecked before release. Architecture recommendations and hypothetical revenue examples are identified as judgments or illustrations rather than externally measured results.

## Archive integrity

The delivery archive contains this complete folder, including lessons, references, source labs, verification tools, and results. Archive CRC integrity and extracted-byte comparisons are checked during packaging. The included `MANIFEST.sha256` records each payload file hash for independent checking after extraction.
