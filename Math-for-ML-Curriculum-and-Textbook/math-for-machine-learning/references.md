# References, provenance, and scope

Access date: **2026-11-12**. The agreed 48-session outline is the organizing input. The textbook's explanations, numerical examples, proofs, and source are original syntheses of standard mathematics. No full external page, book chapter, or source extraction is redistributed.

| ID | Resource | Inspection status and role |
|---|---|---|
| A | [Aman’s AI Journal — Math primer](https://aman.ai/primers/math/) | Partially inspected: topic index, vector material, and opening differential-calculus sections. Establishes the requested topic families: vectors, calculus, probability families, inference, regression, and trigonometry. No claim that every linked section was exhaustively audited. |
| B | [Goodfellow, Bengio, Courville — Deep Learning, Chapter 2](https://www.deeplearningbook.org/contents/linear_algebra.html) | Opening section inspected as a primary textbook orientation for ML linear algebra. The authored treatment extends far beyond this inspected excerpt. |
| C | [Deep Learning, Chapter 3](https://www.deeplearningbook.org/contents/prob.html) | Opening section inspected for probability/information-theory framing. No source prose is copied. |
| D | [Deep Learning, Chapter 4](https://www.deeplearningbook.org/contents/numerical.html) | Opening numerical-computation and overflow/underflow material inspected. Stable formulas in the package are also derived and tested independently. |
| E | [Boyd and Vandenberghe — Convex Optimization](https://web.stanford.edu/~boyd/cvxbook/) | Author-hosted book landing page inspected; it identifies the book and supporting material. The full linked PDF was not read in this run. Offered as an authoritative next reference, not an assertion of exhaustive source verification. |
| F | [NumPy 2.3 `linalg.lstsq`](https://numpy.org/doc/2.3/reference/generated/numpy.linalg.lstsq.html) | Version-matched reference inspected; actual calls executed under NumPy 2.3.5. The live stable documentation resolved to a newer release, so the 2.3 branch is linked deliberately. |
| G | [SciPy 1.17 statistical functions](https://docs.scipy.org/doc/scipy-1.17.0/reference/stats.html) | Version-matched module reference inspected; t quantiles, Gaussian CDF, distribution moments, and ANOVA were checked under SciPy 1.17.0. The reference index is not evidence of reading every distribution page. |

## Original coverage and source boundaries

The primer supplies a starting subject inventory. Functions, proof language, integration, full matrix structure, constrained optimization, error bounds, and generalization arguments were added to make the prerequisite path coherent. Chapter 2 teaches trigonometry locally before it is used in geometric formulas. Chapters 6 and 9 establish density normalization and transformations before the distribution families.

The spectral theorem, change-of-variables theorem, Fubini/Tonelli results, strong law, CLT machinery, Hoeffding bound, and exact sampling laws require substantial supporting theory. Their treatment explicitly distinguishes full elementary derivations, proof sketches, and stated theorems. A numerical check does not promote a sketch to a complete proof.

The ML synthesis derives its objectives from the stated models rather than relying on an external library's fit API. The companion is authored for this subject and evaluates actual formulas. The continuous volume is assembled from the same chapters used for the curriculum.

## Version and redistribution record

Python 3.12.14, NumPy 2.3.5, SciPy 1.17.0, and Node.js 24.22.1 were executed here. Matplotlib is used only to regenerate included figures; its installed version is pinned separately. No third-party runtime or dependency folder is bundled. Users installing dependencies receive them under their own published licenses.

External references remain external links. Their availability is not guaranteed offline. Core prose, equations, images, experiments, and examples remain available in the package. No license is asserted for an external work beyond what its publisher provides. See [NOTICES.md](NOTICES.md).
