# Complete curriculum: mathematics for machine learning

The 48 topics from the agreed outline are preserved as guided sessions. Four sessions form one substantial chapter. Read one session at a time; a chapter is a unit of dependency and file organization, not a single sitting. The complete teaching is in the linked chapter, and the same canonical text is assembled into [book.md](book.md).

Start with arithmetic and elementary algebra. Each chapter supplies its new prerequisites. Optional applications have explanations and reference implementations; no quiz or live response is required to continue. A reasonable rhythm is two or three sessions per week, with extra time for the final optimization and synthesis sessions. This is a pacing suggestion, not an estimated completion guarantee.

## Chapter 1: Mathematical language: turning a prediction problem into an equation

Read: [01-mathematical-language.md](chapters/01-mathematical-language.md). Laboratory: `model`.

| Original lesson | Guided session | Ability developed |
|---|---|---|
| 1 | [Functions, inputs, parameters, and models](chapters/01-mathematical-language.md#lesson-01) | Distinguish a model family, prediction, and loss |
| 2 | [Sets, logic, quantifiers, and proof methods](chapters/01-mathematical-language.md#lesson-02) | Audit a statement and construct a short proof |
| 3 | [Sums, products, indices, and notation](chapters/01-mathematical-language.md#lesson-03) | Expand indexed formulas and check shapes |
| 4 | [Powers, exponentials, and logarithms](chapters/01-mathematical-language.md#lesson-04) | Derive log identities and a stable exponential sum |

Prerequisite: arithmetic, signed numbers, and basic algebra. Practice: use the optional application near the end of the chapter and the mapped experiment.

## Chapter 2: Vectors and geometry: describing many features at once

Read: [02-vectors-and-geometry.md](chapters/02-vectors-and-geometry.md). Laboratory: `projection`.

| Original lesson | Guided session | Ability developed |
|---|---|---|
| 5 | [Coordinates, vectors, and operations](chapters/02-vectors-and-geometry.md#lesson-05) | Represent feature inputs and explain scaling |
| 6 | [Linear combinations, span, and independence](chapters/02-vectors-and-geometry.md#lesson-06) | Determine expressible directions and redundant coefficients |
| 7 | [Bases, dimension, and changing coordinates](chapters/02-vectors-and-geometry.md#lesson-07) | Recover coordinates in an alternative basis |
| 8 | [Dot products, trigonometry, and projections](chapters/02-vectors-and-geometry.md#lesson-08) | Derive the closest point on a line |

Prerequisite: the preceding chapter; earlier concepts are used cumulatively. Practice: use the optional application near the end of the chapter and the mapped experiment.

## Chapter 3: Matrices, information, and least squares

Read: [03-matrices-and-least-squares.md](chapters/03-matrices-and-least-squares.md). Laboratory: `least`.

| Original lesson | Guided session | Ability developed |
|---|---|---|
| 9 | [Matrices as functions and multiplication](chapters/03-matrices-and-least-squares.md#lesson-09) | Interpret a matrix as a composed transformation |
| 10 | [Linear systems and elimination](chapters/03-matrices-and-least-squares.md#lesson-10) | Solve and classify small systems |
| 11 | [Rank, null spaces, invertibility, and identifiability](chapters/03-matrices-and-least-squares.md#lesson-11) | Explain retained and invisible parameter directions |
| 12 | [Norms, orthogonality, and least squares](chapters/03-matrices-and-least-squares.md#lesson-12) | Derive and numerically check a least squares fit |

Prerequisite: the preceding chapter; earlier concepts are used cumulatively. Practice: use the optional application near the end of the chapter and the mapped experiment.

## Chapter 4: Matrix structure: eigenvectors, singular values, and PCA

Read: [04-matrix-structure-and-pca.md](chapters/04-matrix-structure-and-pca.md). Laboratory: `matrix`, `pca`.

| Original lesson | Guided session | Ability developed |
|---|---|---|
| 13 | [Eigenvalues and eigenvectors](chapters/04-matrix-structure-and-pca.md#lesson-13) | Calculate invariant directions and powers |
| 14 | [Symmetry, spectral theorem, and quadratic forms](chapters/04-matrix-structure-and-pca.md#lesson-14) | Interpret eigenvalues as signed curvature |
| 15 | [SVD and pseudoinverses](chapters/04-matrix-structure-and-pca.md#lesson-15) | Construct an SVD and minimum-norm solution |
| 16 | [Low rank approximation, PCA, and conditioning](chapters/04-matrix-structure-and-pca.md#lesson-16) | Derive PCA and diagnose sensitive inverses |

Prerequisite: the preceding chapter; earlier concepts are used cumulatively. Practice: use the optional application near the end of the chapter and the mapped experiment.

## Chapter 5: Calculus from first principles: limits and local models

Read: [05-calculus-from-first-principles.md](chapters/05-calculus-from-first-principles.md). Laboratory: `derivative`.

| Original lesson | Guided session | Ability developed |
|---|---|---|
| 17 | [Sequences, limits, continuity, and convergence](chapters/05-calculus-from-first-principles.md#lesson-17) | Prove a simple limit and distinguish continuity |
| 18 | [Derivatives as local linear approximations](chapters/05-calculus-from-first-principles.md#lesson-18) | Construct and interpret a derivative limit |
| 19 | [Product, quotient, and chain rules](chapters/05-calculus-from-first-principles.md#lesson-19) | Derive rules for composed changes |
| 20 | [Higher derivatives, Taylor approximations, and errors](chapters/05-calculus-from-first-principles.md#lesson-20) | Bound a finite approximation error |

Prerequisite: the preceding chapter; earlier concepts are used cumulatively. Practice: use the optional application near the end of the chapter and the mapped experiment.

## Chapter 6: Integration: accumulated change and transformed quantities

Read: [06-integration-and-change-of-variables.md](chapters/06-integration-and-change-of-variables.md). Laboratory: `integral`.

| Original lesson | Guided session | Ability developed |
|---|---|---|
| 21 | [Integrals as accumulated quantities](chapters/06-integration-and-change-of-variables.md#lesson-21) | Construct a total from finite sums |
| 22 | [Fundamental theorem of calculus](chapters/06-integration-and-change-of-variables.md#lesson-22) | Prove why an antiderivative evaluates an integral |
| 23 | [Substitution and integration by parts](chapters/06-integration-and-change-of-variables.md#lesson-23) | Transform and simplify definite integrals |
| 24 | [Improper/multiple integrals and changes of variables](chapters/06-integration-and-change-of-variables.md#lesson-24) | Normalize a density and apply a volume factor |

Prerequisite: the preceding chapter; earlier concepts are used cumulatively. Practice: use the optional application near the end of the chapter and the mapped experiment.

## Chapter 7: Multivariable calculus: gradients, Jacobians, and backpropagation

Read: [07-multivariable-calculus-and-backpropagation.md](chapters/07-multivariable-calculus-and-backpropagation.md). Laboratory: `backprop`.

| Original lesson | Guided session | Ability developed |
|---|---|---|
| 25 | [Partials, directional derivatives, and total differentiability](chapters/07-multivariable-calculus-and-backpropagation.md#lesson-25) | Distinguish coordinate rates from one total derivative |
| 26 | [Gradients and steepest ascent](chapters/07-multivariable-calculus-and-backpropagation.md#lesson-26) | Prove the Euclidean steepest-direction result |
| 27 | [Jacobians, composition, and backpropagation](chapters/07-multivariable-calculus-and-backpropagation.md#lesson-27) | Propagate sensitivities through a network |
| 28 | [Hessians, multivariable Taylor expansions, matrix derivatives](chapters/07-multivariable-calculus-and-backpropagation.md#lesson-28) | Derive shaped gradients and curvature matrices |

Prerequisite: the preceding chapter; earlier concepts are used cumulatively. Practice: use the optional application near the end of the chapter and the mapped experiment.

## Chapter 8: Optimization: when a parameter update improves a model

Read: [08-optimization.md](chapters/08-optimization.md). Laboratory: `descent`.

| Original lesson | Guided session | Ability developed |
|---|---|---|
| 29 | [Minima, stationarity, and curvature](chapters/08-optimization.md#lesson-29) | Classify local candidate points with hypotheses |
| 30 | [Convexity and global optimality](chapters/08-optimization.md#lesson-30) | Prove why convex stationarity is global |
| 31 | [Gradient descent, step sizes, and convergence](chapters/08-optimization.md#lesson-31) | Derive a decreasing step and convergence bound |
| 32 | [Constraints, Lagrange multipliers, KKT, Newton, stochastic updates](chapters/08-optimization.md#lesson-32) | Apply regularity-aware constrained and stochastic methods |

Prerequisite: the preceding chapter; earlier concepts are used cumulatively. Practice: use the optional application near the end of the chapter and the mapped experiment.

## Chapter 9: Probability: reasoning about uncertain outcomes

Read: [09-probability-foundations.md](chapters/09-probability-foundations.md). Laboratory: `bayes`.

| Original lesson | Guided session | Ability developed |
|---|---|---|
| 33 | [Outcomes, events, counting, and probability axioms](chapters/09-probability-foundations.md#lesson-33) | Specify a probability model and count valid outcomes |
| 34 | [Conditioning, independence, total probability, and Bayes](chapters/09-probability-foundations.md#lesson-34) | Reconstruct joint probabilities and reverse conditioning |
| 35 | [Random variables, masses, densities, and CDFs](chapters/09-probability-foundations.md#lesson-35) | Distinguish mass, density, CDF, and transformed distributions |
| 36 | [Expectation, variance, covariance, and conditional expectation](chapters/09-probability-foundations.md#lesson-36) | Derive conditional-mean optimality and variance decompositions |

Prerequisite: the preceding chapter; earlier concepts are used cumulatively. Practice: use the optional application near the end of the chapter and the mapped experiment.

## Chapter 10: Distribution families and the behavior of repeated samples

Read: [10-distributions-and-sampling-limits.md](chapters/10-distributions-and-sampling-limits.md). Laboratory: `sampling`.

| Original lesson | Guided session | Ability developed |
|---|---|---|
| 37 | [Bernoulli, binomial, geometric, and Poisson](chapters/10-distributions-and-sampling-limits.md#lesson-37) | Choose and derive count/waiting models |
| 38 | [Uniform, exponential, gamma, and beta](chapters/10-distributions-and-sampling-limits.md#lesson-38) | Check support, normalization, and rate/scale conventions |
| 39 | [Gaussian, multivariate Gaussian, chi-squared, t, and F](chapters/10-distributions-and-sampling-limits.md#lesson-39) | Connect Gaussian geometry to sampling distributions |
| 40 | [Sampling, LLN, CLT, and concentration](chapters/10-distributions-and-sampling-limits.md#lesson-40) | Distinguish finite-sample bounds from asymptotic approximations |

Prerequisite: the preceding chapter; earlier concepts are used cumulatively. Practice: use the optional application near the end of the chapter and the mapped experiment.

## Chapter 11: Statistical inference: learning from a finite dataset

Read: [11-statistical-inference.md](chapters/11-statistical-inference.md). Laboratory: `posterior`.

| Original lesson | Guided session | Ability developed |
|---|---|---|
| 41 | [Estimators, bias, variance, consistency, and identifiability](chapters/11-statistical-inference.md#lesson-41) | Separate an estimator from an estimate |
| 42 | [Likelihood, MLE, and MAP](chapters/11-statistical-inference.md#lesson-42) | Derive likelihood optimizers and a prior penalty |
| 43 | [Bayesian updating and predictive distributions](chapters/11-statistical-inference.md#lesson-43) | Update conjugate models and predict future outcomes |
| 44 | [Confidence intervals, tests, bootstrap, correlation, and ANOVA](chapters/11-statistical-inference.md#lesson-44) | Interpret intervals/tests and audit resampling assumptions |

Prerequisite: the preceding chapter; earlier concepts are used cumulatively. Practice: use the optional application near the end of the chapter and the mapped experiment.

## Chapter 12: Putting the mathematics together: models, training, and generalization

Read: [12-machine-learning-synthesis.md](chapters/12-machine-learning-synthesis.md). Laboratory: `classifier`.

| Original lesson | Guided session | Ability developed |
|---|---|---|
| 45 | [Linear regression, Gaussian noise, ridge, and bias–variance](chapters/12-machine-learning-synthesis.md#lesson-45) | Connect least squares to a full statistical model |
| 46 | [Logistic/softmax, entropy, cross-entropy, KL, and mutual information](chapters/12-machine-learning-synthesis.md#lesson-46) | Derive classification objectives and information inequalities |
| 47 | [A complete neural forward and backward pass](chapters/12-machine-learning-synthesis.md#lesson-47) | Check every derivative of a small neural model |
| 48 | [Generalization, numerical stability, and synthesis](chapters/12-machine-learning-synthesis.md#lesson-48) | Separate training, selection, test risk, and numerical error |

Prerequisite: the preceding chapter; earlier concepts are used cumulatively. Practice: use the optional application near the end of the chapter and the mapped experiment.

## Source-to-curriculum coverage

| Source topic family | Full treatment | Deliberate expansion |
|---|---|---|
| Primer vectors and trigonometry | Chapters 2–4 | Bases, rank, SVD, PCA, numerical conditioning |
| Primer differential calculus | Chapters 5, 7–8 | Limit definitions, proofs, error bounds, constraints, convergence |
| Integrals needed for continuous distributions | Chapter 6 | FTC, normalization, multidimensional transformations |
| Primer probability families | Chapters 9–10 | Conditional expectation, multivariate geometry, concentration |
| Primer inference and regression | Chapters 11–12 | Estimator theory, uncertainty interpretation, regularization, generalization |

See [references.md](references.md) for exact inspection status. This is an original textbook based on the agreed topic outline, not a reproduction of the primer.

## Dependency structure

Language and vectors support matrix geometry. Limits and derivatives build on functions and algebra; integration provides normalization and expectation. Multivariable calculus combines local approximation with matrices. Optimization uses derivatives and curvature. Probability then supplies the distributional model for inference; the final chapter combines all branches.

Full measure theory, generalization bounds for arbitrary neural architectures, causal identification, stochastic differential equations, and graduate asymptotic theory are follow-on subjects. Major results whose full proofs need those tools are labeled as stated theorems or proof sketches.
