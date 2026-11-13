# Verification record

Edition date: November 12, 2026 (America/New_York).

## Text and research

- 18 canonical teaching chapters, one continuous `book.md`, and an offline `index.html` reader.
- Chapter text: **90,378 tokens**, measured with **tiktoken 0.12.0 / cl100k_base**. Every chapter exceeds 5,000 tokens; individual counts are in `depth-report.json`.
- **64,928 whitespace-separated prose words excluding fenced code**, as counted by the depth script. This is a word measurement, not a token estimate. The structural validator uses its own documented prose counting rule.
- All eight distinct roadmap courses plus the MIT 2013 predecessor are mapped in `COURSE-COVERAGE.md`. Foundation resources and practical research topics were added.
- 1,321 link records: 401 PDF links, 100 video links, 60 data/code links, 20 archives, 561 course/navigation/detail pages, and 179 optional external readings.
- Of 482 unique download response attempts, 478 returned 200. Three TLS failures and one expired signed publisher link are recorded. The expired link was replaced with an unverified stable publisher landing page. No signed URLs or full source extractions are packaged.
- Index inspection and response checks are not full reading, video viewing, content validation, or a guarantee of continued access. External reading cost and access are not all verified; optional materials are separate from the free core.

## Mathematics and executed code

- Nine standard-library Python tests passed: return-scale invariance and drawdown accounting; invalid prices; hand-computed OLS and residual orthogonality; forecast timing; known Black–Scholes value, parity, monotonicity and limits; tree replication; antithetic Monte Carlo agreement within five estimated standard errors; a known Kalman update; and a covariance inequality.
- All seven synthetic project reference calculations executed and wrote `outputs/synthetic-project-results.json`.
- All fourteen JavaScript experiment defaults executed with finite outputs and deterministic repeat behavior. Additional checks cover a known option price, a constrained optimum, a one-asset portfolio limit, and the invalid-leakage demonstration.
- Nineteen displayed LaTeX expressions rendered with KaTeX 0.16.22 with zero renderer errors. Most shorter equations are written as explicit plain-text mathematical expressions. Rendering does not certify mathematical truth.
- Representative derivations and worked answers were reviewed, with independent numeric checks for pricing, cash-flow valuation, covariance, OLS, and filtering. This is not a formal proof audit of every statement or an external academic review.

## Browser and visual evidence

The local static production files were served on loopback and tested in the installed Microsoft Edge browser through Playwright. Both desktop (1440 × 1000) and narrow (390 × 844) layouts were inspected. All fourteen labs were selected, a displayed input changed, the calculated result changed, and reset restored the exact default result. Invalid input produced a readable message. There were no captured page errors and no page-wide horizontal overflow in the tested narrow layouts.

The reader has 18 valid chapter anchors, 19 rendered equations, and no unresolved math placeholders. The resource reader displayed nine course tables and 1,321 rows. Screenshots in `outputs/` record the reader, a derivatives section, and laboratory layouts. Long controls and results remain vertically scrollable on narrow screens. Opening the laboratory directly from disk shows setup guidance and disables unavailable controls; the static textbook itself remains readable without a server.

## Structural and package evidence

Final structural, fence, local-link, snippet-syntax, and archive checks are recorded in the JSON reports under `outputs/`. The ZIP is created from this project only, excludes caches and bytecode, and is integrity-checked. The source and static reader are assembled from the same canonical chapter files. A companion bundling step is unnecessary because its authored modules are the served production output.

## Limits

The baseline Python examples require no third-party packages. NumPy/pandas/Matplotlib/SciPy/scikit-learn/Jupyter snippets and suggested workflows are supplemental; a full optional scientific-stack installation was not run. Advanced university assignments, general IV/GMM/MCMC solvers, full PDE engines, live data retrieval, and live execution are not all implemented in the companion. The chapters identify analytical/source-based study separately from implemented labs.

The intended offline HTML reader was tested; Markdown equation rendering varies by reader. Windows with the recorded Python, Node, and Edge versions was tested. macOS, Linux, other browsers, screen-reader workflows, and live financial data were not tested. No trades, external publication, financial accounts, or paid enrollments were created.
