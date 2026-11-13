# Verification record

This report distinguishes artifact checks from a guarantee of scientific completeness or learner outcomes. Independent numerical and structural evidence is included in checks/. No physical laboratory measurements were performed during authoring; laboratory procedures and capstones are assignments for the learner.

## Content and source checks

All 28 canonical chapters and 56 separate hint/solution files are present. Each chapter has eight original practice problems. The content audit measures every final chapter with **tiktoken 0.14.0, cl100k_base** and requires at least **5,000 tokens** and **2,500 whitespace-separated words outside code fences** per chapter. Equations, headings and original questions contribute to token counts. These are length checks, not a claim that length itself establishes teaching quality. Per-file counts and SHA-256 fingerprints are in [content-audit.json](checks/content-audit.json).

The textbook validator checks final manifest status, declared depth, file resolution, source listings, experiment references, book anchors and links. Additional audits check all Markdown file links, balanced fences, separate solutions and prerequisite ordering. The final reports are [structural.json](checks/structural.json) and [content-audit.json](checks/content-audit.json). The source ledger distinguishes partial attachment inspection from online index inspection; it does not claim every Feynman page was read. The supplied PDF and extracted text are excluded from distribution.

## Mathematical and numerical evidence

| Scope | Executed checks | Evidence |
| --- | --- | --- |
| Mechanics chapters 04–11 | 131 selected assertions | [Author review](checks/mechanics-review.md), executable mechanics-numerical-checks.py |
| Continuum, thermal, fields and quantum foundations 12–19 | 161 selected assertions | [Author review](checks/fields-review.md), fields-numerical-results.json |
| Quantum and modern chapters 20–26 | 56 selected checks | [Author review](checks/quantum-review-final.md), quantum-math-results.json |
| Independent review of foundations 01–03, 27–28 | 21 selected checks | [Review](checks/cross-review-foundations.md), foundations-cross-results.json |
| Independent review of mechanics 04–11 | 68 selected assertions | [Review](checks/cross-review-mechanics.md), cross-review-mechanics-results.json |
| Independent review of selected field/thermal examples 12–19 | 64 selected assertions | [Review](checks/cross-review-fields.md), cross-review-fields.py |
| Companion models | 316 assertions across analytic cases, conservation, normalization, scaling, convergence and invalid domains | [Model test results](checks/models.json), executable models.cjs |
| Independent companion review | 14 comparisons, including integrated quantum amplitudes, sampled wave energy and actual canvas coordinate scaling | [Review](checks/cross-review-companion.md), companion-cross-results.json |

The selected checks include independent quadrature, matrix eigensolvers, regression, collision invariants, entropy balances, electromagnetic boundary/energy relationships, normalization and limiting cases. Some checks use the explicitly rounded constants printed in their chapter, while the companion may use more digits. Differences within the stated rounding are expected. Tests do not establish every algebraic claim for every parameter or validate the models against actual observations.

Cross-review repaired missing bridges for the cosine rule and covariance, clarified which image-charge geometry an energy formula applies to, and corrected split inline math formatting. The companion review also checks numerical conventions and plot fidelity. Its scope and any corrections are recorded in [cross-review-companion.md](checks/cross-review-companion.md).

## Rendering and browser execution

The build renders chapter, practice and single-volume equations with bundled **KaTeX 0.16.22**. [render.json](checks/render.json) records the actual number of render passes and any errors; repeated appearances of an equation count separately. Zero parser errors establish supported syntax, not correct physics. The continuous HTML edition and chapter reader use the same canonical Markdown, rendered at build time, so internet access is unnecessary.

The browser checks ran in a Chromium-based browser on this Windows host, at **1440 × 1000** and **390 × 844**. They loaded every chapter, computed all 23 default experiments, exercised deterministic reset, changed a parameter, tested invalid-input recovery, followed separate practice links, filtered navigation, loaded the continuous book, and checked the embedding interface's cleanup. A separate browser context with network access disabled opened companion/index.html directly from disk and ran a quantum experiment. Results are in [browser.json](checks/browser.json).

Representative desktop and narrow-screen screenshots were visually inspected for reading layout, equations, plots and controls. Long equations scroll in their own regions; the tested narrow layouts had no document-wide horizontal overflow. The final screenshot files are included in checks/. Keyboard-accessible native controls, visible focus, a skip link, text results and reduced-motion styling are provided. A formal screen-reader audit and testing in Safari, Firefox and every mobile device were not performed.

## Packaging and reproducibility

The ZIP is generated from an explicit course directory, excluding the authoring brief, caches, dependency-install directories, private source research, the supplied PDF and unrelated workspace files. Every archived file is compared with its current source bytes, relative paths are checked, required files are confirmed, and ZIP CRC integrity is tested. A separate archive verification file and SHA-256 checksum accompany the ZIP so the checksum need not refer to a file inside itself.

The browser app has no runtime network or package dependencies. Included renderer libraries and license files support rebuilds. Numerical Python checks use the versions stated in their reports, including NumPy 2.3.5 where used; these authoring dependencies are not needed for reading. The optional Node build/server and model suite were executed under the Node version stated in their reports. No PDF export or hosted website is claimed.

## Practical limits

This is a newly authored course with selected computational checks and independent review, not a proof of zero errors, a peer-reviewed textbook edition, or a learner-outcome study. It covers undergraduate core subjects with explicitly bounded modern and graduate introductions. Specialist graduate sequences, supervised apparatus work and original research remain further work. The laboratory procedures and capstones are instructional assignments; no measurements or public-data analyses have been fabricated to represent them as completed.
