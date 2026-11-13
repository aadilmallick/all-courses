# Verification report

Verification date: November 13, 2026. This report describes the authored learning materials and the small reference companion, not a completed commercial capstone or store-approved binary.

## Completed checks

- Eight substantial Markdown lessons exist in dependency order. The workload totals exactly **1,000 planned hours** and each chapter's disjoint blocks match its allocation.
- The included ordinary-text **cl100k_base reference counter** measures more than 5,000 tokens per lesson. Full results are in [token-counts.json](reference/token-counts.json); rerun `node scripts/count-tokens.mjs` from any directory.
- **14 domain/persistence tests pass** under Node **24.22.1**. They cover terminal-state rejection, exact proposal binding, malformed requests, one-time/expired/mismatched auth callbacks, verified-lease policy, approval/denial, cancellation races, overlapping runs, serialized saves and corrupted local data.
- Four complete JavaScript chapter experiments execute successfully: event loop, PKCE challenge, incremental Unicode JSON-lines parsing and latency aggregation. Results are in [example-results.json](reference/example-results.json).
- The SQLite schema and example message/outbox transaction execute successfully against SQLite **3.53.1** and produce the expected saved row and operation ID.
- Included JavaScript files pass `node --check`. Markdown code fences, local file links, source manifest coverage and workload totals pass the structural validator. Results are in [course-checks.json](reference/course-checks.json).
- The API catalog includes **81 top-level API pages** and links **112 structure pages** at the pinned Electron **v45.3.2** tag. Git blob SHAs are recorded in [api-source-manifest.json](reference/api-source-manifest.json).
- The final archive is opened and CRC-tested before delivery. It contains the actual lessons, references, scripts, examples, companion and templates.

## Depth measurement method

The counter uses the cl100k_base vocabulary supplied by gpt-tokenizer, Git blob `d07f956f41dbd74e4bbbdbffd95dbc91265ddfdc`. Reconstructing its base64 rank file yields SHA-256 `223921b76ee99bde995b7ff738513eef100fb51d18c93597a113bcffe865b2a7`, matching the official tiktoken encoding definition. The standalone byte-pair implementation checks two known encoding fixtures before counting. The split regex is adapted to JavaScript; this run uses JavaScript Unicode **17.0**. Counts describe ordinary text with this included counter, without chat-message overhead or special-token interpretation. Universal Unicode parity with a separately installed official tiktoken package was not independently tested. No word count is presented as a token count.

## Checks blocked or not performed

| Check | Status and reason |
|---|---|
| Browser-only UI smoke | Attempted; default Playwright browser binary was absent. System Chromium fallback then failed because the host denied socket creation. The script remains included; no GUI pass is claimed. |
| Real Electron launch / preload isolation | Not run. Electron is not installed in this environment. Syntax and domain tests do not establish runtime isolation. |
| Forge scaffold / full React TypeScript build | Not run. Tool installation and dependency resolution were not performed; labeled integration fragments require the generated project context. |
| TypeScript compilation | Not run; no TypeScript compiler installed. `.d.ts` provides the intended contract, not compiler validation. |
| Real OAuth / Clerk account login | Not run; learner provider setup, packaging, account and callback registration required. |
| Stripe or Clerk Billing transactions | Not run; learner-owned test credentials and backend required. Domain examples are not payment integration tests. |
| Real model, Hermes gateway, MCP or voice | Not run. Companion is deterministic and performs no real agent side effects. |
| OS keychain behavior | Not run on actual signed macOS/Windows/Linux desktop profiles. |
| Signing, notarization, installed updates | Not run; target hosts and signing accounts/certificates required. |
| Mac App Store / Microsoft Store review | Not submitted. Procedures and edition design are taught; acceptance is not guaranteed. |
| Public publishing / outreach | Not performed. Course provides drafts and implementation plans only. |

## Run the available checks

```bash
python scripts/verify-course.py
node scripts/count-tokens.mjs
cd companion
npm test
```

Run `npm install` and `npm start` on a suitable development machine to launch the reference GUI. Use the release evidence template for actual platform work. Real provider calls and installation/signing require the learner's own configured environment.
