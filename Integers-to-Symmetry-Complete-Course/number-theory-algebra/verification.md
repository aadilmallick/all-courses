# Verification report

Edition date: November 13, 2026. The course contains all thirty planned chapters, thirty separate eight-exercise solution sets (240 worked exercise solutions), the continuous textbook, two optional semester checkpoints, and fourteen implemented laboratory experiments.

## Structural and depth evidence

- All thirty chapters exist in prerequisite order. The final chapter sources contain **152,564 whitespace-separated words** in total; the shortest has **5,030 words** including its headings and navigation. Every chapter also exceeded 5,000 words before the generated navigation was added.
- A suitable installed model tokenizer was unavailable. Word counts are the documented conservative depth proxy; exact model token compliance was **not** measured or claimed.
- The continuous volume was regenerated from canonical chapters. Its table of contents uses thirty explicit unique chapter anchors.
- Chapter/solution relative links, code fences, dollar-delimiter parity, required files, and unfinished markers were checked. The separate textbook structural/depth validator checks the manifest, local assets, experiment entries, book links, and minimum prose depth.
- Independent source review checked mathematical brace/environment pairing, matrix/cases/aligned row structure and obvious command spelling. It found and repaired a malformed cases-row separator and several missing spacing-command backslashes.

The machine-readable results are in `verification/structure.json` and `verification/textbook-validator.json`. Structural checks cannot establish theorem truth.

## Mathematical evidence

The course authors checked their own assigned proofs and exercises. Independent reviews covered generalized CRT, quotient isomorphisms, polynomial arguments, primitive roots and unit-group lifting, Cauchy/Sylow, Gaussian factorization, quadratic reciprocity, Smith form, finite fields, Pell, Artin’s theorem/Galois correspondence, cyclotomy, A₅/S₅ arguments, convergent Euler products, and the associated solution sets. The integrator additionally sampled the central arguments and cross-chapter dependencies.

The review found no outstanding substantive mathematical error. Minor precision changes were applied: the trivial multiplicative group is treated separately; geometric reflection conventions are explicit; prerequisites precede their use; cyclotomic coordinate claims correctly distinguish adjoining i from extracting real coordinates; and experiment descriptions match the implemented controls. This is a reasoned editorial/math review, not a formal proof-assistant certificate.

Executed evidence includes:

- **104,122 laboratory assertions** under Node v24.22.1. These include bounded exhaustive CRT compatibility/solutions, Bézout identities, unit counts/orders, inverse checks in quadratic quotients, field axioms in F₈, Burnside versus explicit enumeration, Pell reference solutions, Hensel compatibility, evaluation-code erasure recovery, and all fourteen default experiment calculations.
- **21 independent exact reference cases** checked with SymPy 1.14.0: selected congruences, Gaussian representations, Legendre/Jacobi distinctions, polynomial irreducibility and factorization, discriminants, Pell/Hensel examples, codewords, and prime counts.
- Supplementary independent reviews executed further exact finite checks, including 3,926 Gauss-lemma/reciprocity/Gaussian assertions, all messages for the toy RSA modulus 55, finite permutation checks, finite-field inverses, and all-pair distance among 125 evaluation-code words. Their reports describe their domains; these counts are not combined into an inflated claim of independent theorem proofs.

See `verification/numerical.json`, `verification/reference-cases.json`, and the independent `review-*.md` reports. Review notes record the pre-integration text; minor findings noted there were resolved as described above. The [proof-status map](PROOF-STATUS.md) distinguishes full proofs from imported or sketched results. PNT, general ideal factorization, the full general radical-solvability equivalence, and reduction-cycle machinery are not mislabeled as locally proved.

## Runnable companion evidence

The documented Node server was started, and its six main HTML/CSS/module/catalog resources returned 200. A missing resource returned 404. There are no third-party runtime dependencies and no build step; source and runnable output coincide. The arithmetic modules and all default experiment functions executed under Node. Reset/event-handler code was inspected in source, but browser interaction was not successfully exercised.

**Browser/visual limitation:** the available Playwright browser installation was absent. The installed Chromium fallback failed before loading a page because a process-singleton socket operation was blocked by the execution environment. No browser screenshot, mobile-layout verification, keyboard/screen-reader test, or visual-inspection pass is claimed. Modern-browser DOM behavior and responsive layout remain unverified. This does not change the recorded arithmetic and HTTP results.

## Mathematical rendering limitation

Dollar delimiters, brace/environment structure and representative formula source were checked. A TeX syntax-rendering attempt was blocked because the installed pdflatex executable lacks its format file. No chapter expressions were compiled by that attempt. GitHub/MathJax visual equation rendering was not independently exercised, and no typeset PDF is delivered. Read the mathematical Markdown in a compatible reader; the complete source remains available.

## Reproduce the checks

Reading requires no software installation. The server and core checks need Node 18+; the actual tested version was 24.22.1. Python 3.12.14 was used for standard-library assembly/structural checks. The supported commands are:

```sh
node scripts/check_companion.mjs
node scripts/check_http.mjs
python scripts/assemble.py
python scripts/check_project.py
```

The optional independent reference-case check requires SymPy 1.14.0 as tested. The optional math-syntax helper requires a fully configured TeX installation and reports a blocked status when its format is unavailable. Neither is a reading or laboratory dependency.

The ZIP is checked for required chapters/solutions, integrity, safe relative names and unintended dependency/cache/source-extraction files. `verification/archive.json` records its inspected inventory. No website, account, repository, or deployment was created.
