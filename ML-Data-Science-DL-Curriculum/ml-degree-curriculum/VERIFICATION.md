# Verification report

Verification date: **2026-11-12 (America/New_York)**.

**The supported CPU verification passes after corrections.** The archive contains all 60 lessons and maps all 47 supplied primers. Remaining depth and framework-execution limitations are listed below; this is not a certification of every statement or every hardware path.

## Results

| Verification | Result |
|---|---|
| Executed demonstration programs | **76 passed** |
| Unit and regression tests | **54 passed** |
| Exact symbolic identities | **33/33 passed** |
| Independent estimator comparisons | **8 passed**, included in the test count |
| Copied model definitions | **34 matched** their canonical source |
| Complete lesson code listings | **20 matched** their executable source |
| Python files and lesson blocks | Syntax checks passed |
| Navigation, command paths, math delimiters, source-map count | Structural checks passed |
| Original archive | CRC and all manifest hashes matched |
| Revised archive | CRC, membership, and hashes checked during packaging |

## Corrections made

- **EM return consistency:** the scalar Gaussian mixture now recomputes responsibilities and likelihood after the final parameter update. Previously, a short run could return responsibilities for the preceding parameters. The trace now has an initial entry plus one per update.
- **Array and label contracts:** binary and multiclass losses reject incorrect target shapes and out-of-domain labels. Hinge loss and the binary tree enforce their distinct label encodings. The scaler and RBF kernel reject feature-width mismatches that NumPy could otherwise broadcast.
- **Probability and parameter domains:** naive Bayes rejects negative prediction counts; GP observation-noise standard deviation cannot be negative; PCA component counts and finite-difference steps are validated. An all-masked softmax row raises an error rather than returning NaNs.
- **HMM inference:** probability rows, symbol indices, and state dimensions are validated. Viterbi rejects an impossible sequence instead of selecting an arbitrary path from all negative-infinity scores.
- **Lesson synchronization:** the 14 standalone classical programs and their displayed code and output were regenerated from the corrected canonical implementations. Six advanced-function listings were also checked against their executable definitions; the diffusion listing matched.
- **Mathematical assumptions and rendering:** the EM Jensen derivation now states the required support condition. A missing inline-math delimiter in lesson 01 was repaired. BatchNorm notes distinguish training variance from the running-variance estimator.
- **Execution instructions:** the PyTorch example README now points to the actual `code/pytorch` folder. The structural checker now verifies those script paths and math delimiters, in addition to links, fences, and Python syntax.

The expanded tests compare ridge, lasso, naive Bayes, PCA, Gaussian-process predictions, a simple tree, DBSCAN, and a k-means fixed point against the installed scikit-learn estimators under matched settings. The symbolic checks cover selected chain rules, losses, softmax derivatives, regularization, kernels, boosting, diffusion variance, policy gradients, cost thresholds, and dropout moments. They are selected checks, not a full formal proof audit.

## Remaining limitations

**PyTorch is not installed in this environment.** Framework, CUDA, fused-kernel, compilation, export, server, and distributed execution remain untested at runtime. Selected API semantics were checked against official documentation; that does not replace execution.

**The uniform chapter-depth target is not established.** 55 of the 60 lessons are below the conservative 5,000-whitespace-word proxy. No compatible model tokenizer was available, so this is not a measured count of chapters below 5,000 model tokens. Core lessons contain 93,969 whitespace words and workshops contain 35,801; code, outputs, and deliberately repeated workshop passages are included. This verification pass corrected problems but did not expand every shorter chapter to the depth target.

Large-scale model quality, production suitability, and every theorem or source claim were not verified. The 47-primer map establishes topic destinations, not exhaustive coverage of every subsection of every primer. Math delimiter checks establish structural matching, not a rendered audit of every equation.

## Inspect or repeat the checks

Run `python tools/run_validation.py` for the supported CPU route. Install `requirements-verification.txt` to include the optional SymPy checks. Code-listing and structural checks can also be run independently with `python tools/check_consistency.py` and `python tools/verify_course.py`.

Exact evidence is in [execution-results.json](execution-results.json), [math-verification.json](math-verification.json), [consistency-results.json](consistency-results.json), and [structural-report.json](structural-report.json). The per-lesson length inventory and execution scope are in [VALIDATION.md](VALIDATION.md).
