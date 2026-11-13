# Independent cross-review: foundations, computation and experiment

Reviewed chapter prose and worked solutions for 01, 02, 03, 27 and 28. The review covered introductory arithmetic and units, coordinate geometry and products, calculus definitions and hypotheses, kinematic examples, numerical convergence/stability, uncertainty propagation, regression and experimental claims. No substantive numerical or physics error was found in the inspected worked examples.

Two prerequisite bridges were improved directly:

1. Chapter 02's dot-product derivation invoked the cosine rule before establishing it. Added its construction from horizontal/vertical projections and Pythagoras, so a beginner can follow the entire bridge from previously taught geometry.
2. Chapter 28 used covariance in uncertainty propagation without an explicit mathematical definition. Added the expectation-of-centered-product definition, sign interpretation and units before applying it. Chapter 14 had mentioned cross-covariances but did not provide that local definition.

Selected examples were checked independently with `foundations_cross_checks.py`, using NumPy's least-squares implementation and covariance matrix to verify the synthetic regression rather than only repeating the chapter's centered-sum arithmetic. The check also covers unit conversions, vector orientation, passive-rotation norm, projectile values, numerical-difference error, diffusion step bound, Monte Carlo error, sample spread and pendulum uncertainty. Results are recorded in `foundations-cross-results.json` after execution.

The numerical-method text correctly distinguishes verification from validation, local from global error, stability from positivity and accuracy, and grid from artificial-boundary errors. The experiment chapter distinguishes measured and synthetic data, standard uncertainty and confidence intervals, and fit agreement and independent validation. Proposed laboratory work remains explicitly future learner work; no invented measurements were found.

This is a selected independent content review, not exhaustive mathematical certification or a claim that the proposed physical labs were performed.
