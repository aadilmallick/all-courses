# Verification report

Verified on **12 November 2026** in Windows, using **Node.js 26.7.0**, the bundled Python runtime, **KaTeX 0.16.22**, **marked 17.0.5**, and headless Microsoft Edge **156.0.8078.80**. The companion has no runtime installation step beyond having Node.js available. Third-party library files and licenses are bundled locally.

## Structure and teaching materials

- All **18 canonical chapters** exist and are assembled into `book.md` and `book.html` in prerequisite order.
- Chapters contain **45,485 whitespace-separated words outside code fences**, with **2,508–2,644 per chapter**. This measure includes equations, headings, and problem statements. It is not a tokenizer count or a claim of 45,485 prose-only words.
- **101 original optional practice problems** have matching, unique solution labels and separate hints. Concrete semester examinations and keys, four projects (one optional), rubrics, and a 32-week schedule are included.
- **417 indexed source instructional sections/subsections**, excluding reference-only sections, have coverage rows pointing to their companion chapters. The index was extracted from the supplied edition, not substituted from the different 2015 online edition.
- Chapter/asset/reference links, balanced code fences, **290 explicit book anchors**, required files, unfinished-text markers, and archive-safe relative paths passed the package checker. The Textbook Workshop structural validator also passed in final mode with zero reported errors.
- The chapter text was reviewed for prerequisite order, introduced notation, assumptions, numerical examples, and the distinction between a proof, an intuition, and a stated advanced theorem. Length checks are supplementary evidence, not proof of teaching quality.

Machine-readable evidence: [structure-check.json](verification/structure-check.json) and [workshop-structural-check.json](verification/workshop-structural-check.json).

## Equations and visual presentation

The build made **5,288 successful equation-rendering passes** with strict KaTeX error checking and zero rendering errors. Repeated renderings of canonical chapters, support pages, and the assembled book are counted separately. This establishes supported mathematical syntax, not mathematical truth.

The standalone HTML volume was also opened directly as a local file: **2,522 rendered math elements**, all included images loaded, and the font-loading status was `loaded`. This reading route works without the local server. The interactive reader needs the documented server because it loads chapter data and modules.

Desktop curriculum and mathematical chapter pages, a displayed recurrence equation, a prerequisite diagram, and narrow-screen reader/lab layouts were visually inspected. Observed samples had readable equations and text with no clipping or document-level horizontal overflow. This was representative visual inspection, not an inspection of every line in every viewport. No PDF edition was generated or claimed.

Evidence: [render-check.json](verification/render-check.json), [direct-file-check.json](verification/direct-file-check.json), [desktop reader](verification/reader-desktop.png), [mathematical chapter](verification/chapter-desktop.png), [narrow reader](verification/reader-mobile.png), [desktop laboratory](verification/lab-desktop.png), and [narrow laboratory](verification/lab-mobile.png).

## Mathematical and algorithmic execution

`node companion/check.mjs` passed **19,494 assertions**. The executed checks include:

- gcds compared with direct divisibility enumeration; extended Euclid results; modular inverses compared with an independent residue search; modular powers compared with repeated multiplication;
- binomial coefficient sums, Fibonacci and bracket cases, finite convolution, birthday and Bayes examples;
- binomial normalization and means plus Markov, Chebyshev, and applicable Chernoff inequalities compared with finite exact-tail sums across a parameter grid;
- gambler's-ruin probabilities and expected durations compared with independent Gaussian-elimination solutions of the finite first-step linear systems;
- graph walk counts, DAG/cycle behavior, bipartite detection, matching, minimum spanning trees, network formulas, and ranking normalization/residual;
- seeded Monty Hall, coupon collection, and random-walk samples compared with theoretical quantities using stated numerical tolerances;
- actual default computation for every one of the **24 laboratories**.

The tests are finite independent checks of selected algorithms and examples. They do not constitute a formal verification of every theorem or a numerical proof of a universal mathematical statement. Handwritten worked arguments remain subject to mathematical review.

Evidence: [math-check.json](verification/math-check.json). The test source is included and can be rerun without installing packages.

## Browser behavior

The documented local-server setup was executed. All **24 lab default paths** ran in the actual browser. Checks exercised parameter changes, reset restoration, numeric validation, invalid bracket input, chapter navigation, figure loading, and standalone-book loading. Layouts at **1440 × 1000** and **390 × 844** were checked; the narrow reader and laboratory had no document-level horizontal overflow. The observed run reported zero page errors and zero failed resource requests.

No continuous animation or background loop is used. Changing labs disposes the previous listener group. Controls use native labels and buttons, visible focus styling, a skip link, textual results, and status messages. Reduced motion is respected. Screen-reader behavior, every keyboard combination, and every possible invalid text input were not exhaustively audited. Other browser engines and operating systems were not run.

Evidence: [browser-check.json](verification/browser-check.json).

## Packaging and source limits

The ZIP was integrity-tested, required files and relative paths were checked, and a SHA-256 sidecar is supplied alongside it. The archive contains authored learning materials, built reader output, source, bundled renderer dependencies/licenses, diagrams, and verification evidence. It excludes the original PDF, full PDF extraction, working scripts outside this package, credentials, Git internals, and dependency-installation directories. Packaging is rerun after final report/build updates so the delivered archive represents the same edition as the loose files.

Source inspection was partial manual inspection after complete machine extraction/indexing. The package covers the source's instructional topic scope, while the source's full exercise collections remain optional extension banks. It does not claim to solve every exercise, manually check every source page, reproduce all historical narratives, prove long advanced theorems omitted in the source, or guarantee learner mastery. See [sources](sources.md) and [coverage notes](coverage.md) for the exact boundaries.

## Reproduce the checks

From the package folder, run:

```text
node companion/check.mjs
node scripts/build.mjs
python scripts/verify-package.py
```

The last command requires Python 3.10 or later and only its standard library. Add `--zip` to the package checker to regenerate and integrity-check the ZIP in the parent folder. Browser checks recorded here used the author's available browser automation environment; that extra environment is not required to read the book, use the labs, or run the included mathematical checks.
