# Verification report

Follow-up verification date: 2026-11-12. Checks apply to the saved package and its source hashes.

## Results

| Verification layer | Result | Evidence |
|---|---|---|
| Python programs | Passed | All 15 programs executed successfully |
| Numerical/mathematical cross-checks | Passed | 51 checks, including every neural parameter derivative |
| Curriculum and links | Passed | 48 sessions, 12 chapters, 240 local links, no structural errors |
| Companion calculations | Passed | All 13 experiment families |
| Control wiring | Passed on simulated DOM | Updates, reset, listener disposal, and two invalid-input paths |
| TeX expression compilation | Passed | All 1,526 chapter expressions; no missing-glyph or overfull-box warnings |
| Rendered equation samples | Passed | 7 inspected pages from an equation audit of 85 pages |
| Local HTTP server | Passed | Seven actual responses, correct MIME types, and two 404 checks |
| Actual browser visuals/interactions | Blocked | Chromium cannot start under this runtime’s socket restrictions |
| GitHub/Library math preview | Unverified | TeX syntax success does not establish a particular Markdown renderer’s behavior |

The remaining browser limitation is explicit: this report does not mark real browser interactions, canvas output, or responsive layout as passed.

## Depth and structural consistency

The chapters contain 32,152 narrative words excluding code and mathematical expressions. All exceed the authored minimum of 2,500 narrative words.

| Chapter | Narrative words | Mathematical expressions |
|---|---:|---:|
| 01-mathematical-language | 3,042 | 166 |
| 02-vectors-and-geometry | 2,826 | 129 |
| 03-matrices-and-least-squares | 2,602 | 127 |
| 04-matrix-structure-and-pca | 2,738 | 138 |
| 05-calculus-from-first-principles | 2,679 | 161 |
| 06-integration-and-change-of-variables | 2,541 | 131 |
| 07-multivariable-calculus-and-backpropagation | 2,553 | 109 |
| 08-optimization | 2,558 | 129 |
| 09-probability-foundations | 2,595 | 106 |
| 10-distributions-and-sampling-limits | 2,648 | 142 |
| 11-statistical-inference | 2,619 | 80 |
| 12-machine-learning-synthesis | 2,751 | 108 |

The structural validator reports zero errors. Stable IDs cover all 48 sessions; the continuous book is generated from the canonical chapters. Chapter code and extracted examples match. Code fences, asset paths, source listings, internal anchors and equation brace groups pass static checks.

Model-token counts are not certified. A suitable tokenizer was unavailable; no model-token minimum or 5,000-word-per-session proxy is claimed. The measured unit is narrative words per substantial chapter.

## Executed mathematics and examples

All 15 Python programs ran under Python 3.12.14, NumPy 2.3.5, and SciPy 1.17.0. Companion checks used Node v24.22.1.

The 51 mathematical checks cover least squares, SVD and PCA, Taylor bounds, numerical integration and normalization, gradients/Jacobians, constrained stationarity, smooth descent, probability-family moments, Bayesian updating, confidence intervals, ANOVA, information quantities and concentration calculations. The complete named inventory is in verification.json.

The largest analytic versus central-difference discrepancy across all nine neural parameters was 5.17e-11. The smooth-descent inequality was checked on twenty deterministic positive definite quadratics. These finite checks support the examples; they do not prove every general theorem.

The companion calculation suite passes for all 13 families, including extreme logits ±1,000. Its in-memory DOM suite verifies control-result updates, reset, listener disposal, and invalid projection/conditioning paths. It remains a simulated-DOM test. JavaScript syntax checks also pass.

## Equation rendering

All 1,526 chapter math expressions were compiled by pdfTeX/LaTeX with amsmath and amssymb. No missing glyphs or overfull boxes were reported. An equation audit PDF with 85 pages was generated; 7 pages (1, 17, 43, 49, 53, 72, 85) were rendered and visually inspected, including matrices, cases, fractions, multivariable Taylor notation, integrals and Gaussian density notation.

The host’s missing prebuilt format was rebuilt privately from installed TeX sources. Installed Computer Modern/AMS font maps were loaded explicitly; the audit PDF embedded its fonts. System configuration was not changed. The audit is an internal verification artifact, not the layout of the Markdown book.

verification-rendering.json binds this evidence to chapter hashes. scripts/verify_equations.py reproduces the syntax/typesetting check on a working TeX installation; its default draft mode does not produce a PDF. Cached evidence is rejected when source hashes change.

## Local serving and browser limit

The documented Node server was started and reached over localhost. HTML, modules, CSS, one figure and the book returned HTTP 200 with the expected MIME types. Missing and encoded parent-path requests returned 404. This verifies actual static serving, rather than only reading server source.

Chromium launch was attempted and failed before any page could be created because the runtime denied a required socket operation. The supported managed-browser execution tool is unavailable in this session. Actual browser interactions, canvas rendering, desktop/mobile layout, keyboard behavior and assistive-technology behavior therefore remain unverified. No responsive-layout screenshots or browser pass are claimed.

## Reproduction and practical limits

Run README.md’s commands for examples, mathematical checks, companion checks and structural validation. A complete TeX installation is optional for the additional equation check. All three included figures were previously generated and visually inspected. Windows/macOS, other browser engines, alternative runtime versions and native Markdown previews have not been independently tested.

Proofs, proof sketches and stated theorems are distinguished in the prose and indexed in GLOSSARY.md. Source inspection is documented in references.md. The archive is integrity-checked and its file hashes are recorded in checksums.sha256 during packaging. No textbook prose or worked answer required correction in this verification pass; the executable verification suite and evidence record were expanded.
