# Glossary and proof guide

| Term | Working meaning | Chapter |
|---|---|---|
| Model family | Set of functions indexed by allowed parameters | 1 |
| Domain / image | Allowed inputs / outputs actually attained | 1 |
| Quantifier | Specifies every object or existence of an object | 1 |
| Span | All linear combinations of selected directions | 2 |
| Independence | Only the zero coefficient combination produces zero | 2 |
| Basis | Independent spanning collection | 2 |
| Inner product | Positive symmetric bilinear measurement of alignment | 2 |
| Projection | Closest representable vector in a stated geometry | 2–3 |
| Rank / nullity | Retained output dimension / invisible input dimension | 3 |
| Identifiability | Distinct parameters imply distinct observables | 3, 11 |
| Eigenvector | Nonzero direction preserved up to scaling | 4 |
| Singular value | Nonnegative scale between orthogonal input/output directions | 4 |
| Conditioning | Sensitivity of the mathematical answer to changed inputs | 4, 12 |
| Derivative | Linear coefficient of a locally accurate approximation | 5 |
| Taylor remainder | Error after a stated finite-order local polynomial | 5, 7 |
| Integral | Limit of accumulated contributions | 6 |
| Jacobian | Output-by-input matrix of a total derivative | 7 |
| Gradient | Column representing a scalar derivative in Euclidean coordinates | 7 |
| Hessian | Matrix describing change in a gradient | 7 |
| Convexity | Segment inequality that connects local to global optimization | 8 |
| KKT conditions | Feasibility, stationarity, multiplier signs, complementary slackness | 8 |
| Probability density | Probability per coordinate volume, integrated over regions | 9 |
| Conditional expectation | Average outcome after conditioning on information | 9 |
| Standard error | Spread of an estimator across repeated samples | 10–11 |
| Consistency | Approach to the target as sample information grows | 11 |
| Likelihood | Data mass/density viewed as a function of candidate parameters | 11 |
| Posterior predictive | Future-outcome distribution averaged over posterior parameters | 11 |
| Confidence coverage | Repeated-sampling reliability of a random interval procedure | 11 |
| Cross-entropy | Expected negative log predictive probability | 12 |
| KL divergence | Excess cross-entropy relative to the target entropy | 12 |
| Generalization | Transfer from sample-based fitting to distributional performance | 12 |
| Numerical stability | Reliability of the algorithm's arithmetic path | 12 |

## Proof landmarks

| Claim | Treatment | Location |
|---|---|---|
| Zero squared loss iff exact training fit | Complete elementary proof | Chapter 1 |
| Sum of first n integers | Induction proof | Chapter 1 |
| Independent directions give unique coordinates | Complete proof | Chapter 2 |
| Cauchy–Schwarz and line projection | Completed-square proofs | Chapter 2 |
| Rank–nullity | Basis-extension proof | Chapter 3 |
| Normal equations characterize least squares | Perturbation proof | Chapter 3 |
| Spectral theorem | Clearly labeled proof sketch | Chapter 4 |
| SVD structure | Construction using the stated spectral theorem | Chapter 4 |
| PCA variance maximization | Eigenbasis proof | Chapter 4 |
| Derivative rules | Limit and local-expansion proofs | Chapter 5 |
| Fundamental theorem | Continuity and mean-value argument | Chapter 6 |
| Gaussian normalization | Polar integral derivation | Chapter 6 |
| Gradient is Euclidean steepest ascent | Cauchy–Schwarz proof | Chapter 7 |
| Backpropagation | Jacobian chain-rule derivation | Chapter 7 |
| Smooth descent lemma | Integral proof | Chapter 8 |
| Convex stationary points are global | Supporting-plane proof | Chapter 8 |
| Bayes and total probability | Joint-event derivations | Chapter 9 |
| Conditional-mean squared-loss optimality | Orthogonal decomposition proof | Chapter 9 |
| Weak law with finite variance | Chebyshev proof | Chapter 10 |
| CLT | Characteristic-function proof sketch | Chapter 10 |
| Sample variance denominator | Expectation identity | Chapter 11 |
| Beta-binomial update | Direct density multiplication | Chapter 11 |
| KL nonnegativity | Logarithm inequality proof | Chapter 12 |
| Finite-class generalization | Hoeffding plus union bound | Chapter 12 |

Some proofs invoke a clearly stated supporting theorem rather than rebuilding all of analysis or measure theory. The distinction is made in the chapter, and numerical checks are described separately in verification.md.
