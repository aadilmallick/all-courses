# Verification and repair report

Verification pass: **2026-11-12, America/New_York**.

**Status: all available automated checks passed. Real-browser verification remains blocked by the environment.**

## Findings repaired

1. The long-context program was present in the code package but missing as a textbook listing. Chapter 8 now includes its complete source and newly executed output.
2. The HTML reader had an empty document-language attribute. The build now declares English and a regression check enforces it.

## Fresh verification results

| Check | Result | Evidence and scope |
|---|---|---|
| Python example suite | **56 passed** | All 54 numbered programs and both complete alignment-training programs executed |
| Numerical unit tests | **10 passed** | Autodiff, matrix products, broadcasting, repeated embedding indices, normalization, causal masks, masked loss, and fitting |
| Printed source listings | **57 matched** | Every Python listing in the continuous book matches an included file by parsed syntax |
| Recorded example outputs | **54 reproduced** | Every numbered chapter example was executed and compared exactly with its printed output |
| Selected worked arithmetic | **33 passed** | Independent numerical checks of attention, Bayes, gradients, cache size, GAE, ranking, control, and other stated answers |
| Retained scalar derivatives | **54 passed** | Symbolic derivatives agree locally with finite differences; max absolute error about 3.62e-10 |
| NumPy / JavaScript agreement | **36 fixtures passed** | Independent comparisons for attention, Bellman solves, DPO, and GAE |
| Joint control endpoints | **200 combinations passed** | Calculated outputs remain finite at combined range/select endpoints |
| DOM test-double interactions | **18 laboratories passed** | Mount, recalculation, reset, numeric error recovery, and listener disposal; no browser layout claim |
| Structure and links | **Passed** | 18 main chapters, four appendices, source references, fences, anchors, and source/build agreement |
| MathML conversion | **1,084 expressions; no raw-TeX fallbacks** | Syntax conversion checked; real-browser visual rendering is still unverified |
| HTTP and package checks | **Passed** | 89 linked resources in source output and 89 in built output; root redirect and missing-module 404; archive CRC/byte checks |

## Browser result and remaining limits

Chromium startup was attempted again, including through the new self-contained browser runner. The environment denied a required local process-singleton socket. The browser never reached a page, so no desktop/mobile screenshots, native keyboard/focus checks, or visual equation/layout checks are claimed.

The package includes `tools/check_browser.py`, which starts its own local server and is ready to exercise all 18 labs, reset behavior, repeated navigation, mobile overflow, native MathML layout, and failed-module handling on a machine that permits browser startup. A successful automated browser run should still be followed by human visual review.

All numerical demonstrations remain scoped to their stated fixtures, assumptions, and simplifications. These checks are not a formal proof of every equation, a universal browser certificate, or an assurance of zero mistakes. No large-model, GPU, commercial-model API, trained visual-model, or physical-hardware execution is claimed.

## Reading-depth inventory

The chapters and appendices contain **50,415 outside-code whitespace words**. This count includes headings, tables, and mathematical notation. A conservative narrative-only proxy removes those elements as well as code and yields **44,416 word-like tokens**. Counts diagnose depth; they do not establish teaching quality. Every main chapter meets its authored structural target.

| Chapter | Outside-code words | Narrative proxy |
|---|---:|---:|
| chapter-01 | 2,526 | 2,264 |
| chapter-02 | 2,516 | 2,194 |
| chapter-03 | 2,521 | 2,187 |
| chapter-04 | 2,527 | 2,254 |
| chapter-05 | 2,540 | 2,192 |
| chapter-06 | 2,820 | 2,504 |
| chapter-07 | 2,552 | 2,301 |
| chapter-08 | 2,828 | 2,553 |
| chapter-09 | 2,697 | 2,411 |
| chapter-10 | 2,508 | 2,294 |
| chapter-11 | 2,512 | 2,222 |
| chapter-12 | 2,506 | 2,223 |
| chapter-13 | 2,543 | 2,263 |
| chapter-14 | 3,229 | 2,893 |
| chapter-15 | 2,506 | 2,336 |
| chapter-16 | 2,521 | 2,328 |
| chapter-17 | 2,520 | 2,246 |
| chapter-18 | 2,548 | 2,296 |
| appendix-notation | 619 | 286 |
| appendix-implementation | 1,330 | 1,115 |
| appendix-projects | 880 | 751 |
| appendix-references | 666 | 303 |

## Repeat the available checks

```bash
python examples/run_all.py
python -m unittest discover -s tests -v
python tools/verify_examples.py
python tools/check_worked_answers.py
python tools/check_cross_runtime.py
python tools/check_http.py
node companion/check.mjs
node companion/test.mjs
node companion/test-interactions.mjs
python tools/check_package.py
```

Optional symbolic audits require `requirements-authoring.txt` and `python tools/check_math.py`. The optional real-browser check requires `requirements-browser-verification.txt`, an installed Playwright Chromium, and `python tools/check_browser.py`. These optional setup instructions are not a claim that browser startup succeeded here.

Machine-readable evidence is preserved in `verification-evidence.json` and `verification.json`. The source edition and access scopes remain in `sources.json` and the references appendix.
