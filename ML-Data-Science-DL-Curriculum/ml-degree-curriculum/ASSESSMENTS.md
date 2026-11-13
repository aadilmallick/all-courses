# Optional cumulative applications and assessment criteria

These applications are optional. Read worked examples first; attempt an application before consulting a hint when you want to test reconstruction rather than recognition.

## Foundation investigation: a noisy linear measurement

Generate $y=1+2x+\epsilon$ with centered independent Gaussian noise. Derive the normal equations and the single-feature slope. Implement a stable least-squares solver call and a gradient-descent fit. Compare coefficients, predictions, training loss, held-out loss, and finite-difference gradients. Repeat with a duplicate feature.

Hint 1: include an explicit constant column. Hint 2: residual orthogonality is a useful invariant. Hint 3: with a duplicate feature, compare predictions rather than demand one uniquely correct pair of coefficients.

Acceptance: explain the objective's reduction; derive each gradient coordinate; show agreement within a stated tolerance; identify the nonunique coefficient direction; keep a final holdout separate from any tuning.

## Classical comparison: geometry versus partitions

Construct a curved two-dimensional boundary. Compare scaled logistic regression, kNN, a tree, a forest, and boosting. Use identical development partitions and a final test. Add an irrelevant high-scale feature and repeat the entire development procedure.

Hint 1: a missing nonlinear feature can limit a linear model. Hint 2: scaling changes distance and regularization. Hint 3: assess seed and split variability before interpreting a small score difference.

Acceptance: record all trials, define the metric, show a baseline, explain which model assumption changed the result, and include a case where the winning average model fails.

## Unsupervised investigation: one objective is not every notion of structure

Generate compact groups, unequal-density groups, and a curved group. Compare k means, medoids, DBSCAN, a mixture, and spectral clustering. Evaluate an internal metric, known generating labels when available, and stability across seeds.

Hint 1: cluster identifiers can permute. Hint 2: mixture log likelihood and k-means inertia are different objectives. Hint 3: inspect the affinity graph before blaming the spectral eigenvectors.

Acceptance: state the objective or connectivity rule for every method, show one hand update, check monotonicity where theoretically expected, and explain a mismatch between a metric and your intended grouping.

## Neural investigation: derive, fit, and perturb

Use the supplied NumPy engine to train a tiny decoder. Derive one attention row's gradient, compare with finite differences, and test causal independence. Change a future token and verify that earlier allowed outputs remain unchanged.

Hint 1: check the softmax axis. Hint 2: one input can contribute through several paths. Hint 3: target alignment and attention access need separate tests.

Acceptance: full gradient shape agreement, a decreasing declared training objective, held-out evaluation without future targets, and a precise account of synthetic-task limitations.

## Advanced investigation: choose one focused extension

Choose GCN permutation equivariance, a VAE bound, a diffusion corruption marginal, an HMM forward sum, or an RL Bellman backup. Derive it on a tiny system and compare a program against exact enumeration or a numerical invariant. Explain the assumptions and one counterexample when an assumption is dropped.

Acceptance: separate an algebraic proof from a numerical test and an empirical performance claim. Name what the experiment does not establish.

## Capstone and review

Use the 100-point rubric in lesson 59. Ask another reader to reproduce your main command from a clean environment, or simulate that review by removing cached results and using a fresh output directory. Preserve the source data and split identity. Document every material limitation rather than declaring completion solely because code exits successfully.
