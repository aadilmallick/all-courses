# Verification report

Edition reviewed: November 13, 2026.

## Course and teaching structure

- Ten canonical chapters and one continuous textbook are present in prerequisite order. Each chapter contains a motivating problem, explained terms, worked examples, tradeoffs, diagnosis, and a practical studio with the exact module allocation.
- Measured chapter prose: **50,204 whitespace-separated words**, with **5,000+ per chapter**. The per-file counts and SHA-256 values are in verification-results.json. Counting excludes fenced code. A named model tokenizer was not available; exact model-token compliance is unverified and is not claimed.
- The independent course checker verifies that canonical chapter paragraphs appear in the assembled volume, chapter anchors resolve, all cited source identifiers exist, and the synthetic aggregation example matches its stated rates.
- The textbook structural validator ran in final mode: ten chapters, depth targets passed, no missing anchors, source modules or declared experiments, no structural errors.
- The ledger contains exactly **100 sessions × 10 hours = 1,000 hours**. Category totals are **140 study, 160 guided, 380 production, 222 field, 98 review**. Per-module allocations reconcile exactly.
- Teaching review checked the progression from economics and research to content, sales, channel execution, conversion, measurement and operations. Length and structural checks do not establish learner mastery or market demand.

## Arithmetic and executed software

- Node.js **24.22.1** executed **38 numerical checks** against the actual calculation models. These cover known funnel, contribution, pipeline and video examples; Wilson boundary invariants; invalid inputs; zero populations; and zero-capacity behavior.
- Node executed **63 interaction assertions** against the actual companion source modules and the exact built inline script using a deterministic DOM harness. These cover all six experiments, parameter changes, invalid values, reset, repeated navigation, cleanup and the built output's baseline behavior.
- The harness is a small test implementation of the DOM operations needed by the companion. It establishes tested logic and event wiring; it does **not** certify native browser behavior, layout, rendering, assistive technology, or every input-validation detail.
- Both extracted inline scripts passed Node syntax checks. The standalone and embedded lab HTML match exactly. The reader has **203 unique IDs** and **215 resolving fragment links**. There are **no remote runtime assets**. Source links are intentionally external references opened only when selected.
- The synthetic source-mix dataset was recalculated: page A aggregate 5%, page B aggregate 3.5%, with B's observed rate higher within each listed source. This demonstrates an aggregation reversal, not a causal page effect.

Run from the extracted folder:

```bash
python3 tools/check_course.py
node companion/test-models.mjs
node companion/test-interactions.mjs
```

## Browser and visual inspection limit

Playwright/Chromium browser verification was attempted. The available system Chromium could not start because the environment blocked its process-singleton socket with “Operation not permitted.” No actual browser screenshots, mobile/desktop rendering inspection, keyboard inspection, or live browser-control results are claimed. browser-verification.json records the failure. The optional tools/browser_check.py contains the unexecuted browser assertions for a suitable environment; the optional Playwright dependency is pinned in tools/verification-requirements.txt.

The HTML uses semantic headings, native labeled controls, focus styling, responsive layout rules and reduced-motion handling. Those implementation choices passed source inspection, but their rendered accessibility and appearance remain unverified. The Markdown remains a portable reading source. No PDF or hosted website was produced.

## Sources and live systems

The source ledger contains **26 public primary-source pages**, with targeted inspected scope and access date. It is not a claim that every source page, linked page, account interface or editor was comprehensively inspected. The current cross-format YouTube public-view update was verified against official 2026 guidance rather than relying only on the older Shorts announcement.

No social account was connected, no post or private message was sent, no marketing email was delivered, no live checkout was implemented, and no ad spend or live campaign was executed. The course provides complete teaching, examples, reviewable plans and a local runnable companion. Account-specific workflows, vendor prices, regional eligibility, actual customer demand, deliverability, legal implementation and commercial outcomes remain for the learner's explicitly chosen real-world application.

## Archive and rebuilding

The archive is packaged from an explicit course directory inventory, excluding caches, compiled Python files and temporary QA files. Integrity, path safety and required-file checks are recorded in package-verification.json. The ZIP contains canonical chapters, assembled book, offline HTML, complete lab source and output, templates, syllabus, hour ledger, sources and verification evidence.

```bash
python3 tools/rebuild_book.py
```

The rebuild uses Python's standard library and the included source. The custom renderer supports the controlled Markdown subset used in this edition; it is not a general Markdown engine. Re-run affected checks after editing the source. The archive contains no credentials, private account data, full third-party article extractions or dependency directories.
