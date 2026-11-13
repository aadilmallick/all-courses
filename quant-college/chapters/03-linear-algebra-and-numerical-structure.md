# 3. Linear algebra and numerical structure

## 3.1 Several positions, one portfolio

Suppose a portfolio holds 3 shares of one asset and 2 shares of another. Their prices are 10 and 25 dollars. The portfolio's value is 3 × 10 + 2 × 25 = 80 dollars. A vector is an ordered collection that lets us represent this calculation without inventing a separate notation for every new asset. Let holdings h = (3, 2) and prices p = (10, 25). Their dot product h-transpose p is 80. Order matters because the first holding must match the first price.

We treat vectors as columns. The transpose symbol turns a column into a row, allowing h-transpose p to represent row-by-column multiplication. The same algebra can combine portfolio weights and returns. If weights are (0.6, 0.4) and asset returns are (0.02, −0.01), portfolio return over one holding period is 0.6 × 0.02 + 0.4 × (−0.01) = 0.008, or 0.8%, assuming weights are established at the beginning and no unmodeled cash flows occur. A vector's coordinates carry a defined order and unit; it is not an unlabeled bag of numbers.

Vector addition combines coordinates and scalar multiplication scales them. Adding holdings (3, 2) and (−1, 4) gives (2, 6). A linear combination a u + b v mixes vectors using scalar coefficients. A portfolio of assets is literally a linear combination of their state-dependent payoffs. This perspective will connect elementary algebra to replication, regression, principal components, and no-arbitrage pricing.

## 3.2 Geometry: length, angle, and projection

The Euclidean norm of x = (x1, …, xn) is sqrt(sum x_i²). For (3, 4) the length is five by the Pythagorean theorem. Norms measure size, but the choice matters. The one-norm sums absolute coordinates; the infinity-norm takes the largest absolute coordinate. A change that is small in one scale or unit need not be small in another. Standardizing inputs is a modeling choice that changes geometry.

The dot product x-transpose y equals sum x_i y_i. For nonzero vectors, it also equals ||x|| ||y|| cos(theta), defining their angle. Orthogonal vectors have dot product zero. The vectors (1, 1) and (1, −1) are orthogonal because their coordinate products sum to zero. Orthogonality is a geometric relationship; statistical independence is a probability relationship. They can connect, but they are not interchangeable.

To approximate y by a multiple of nonzero x, minimize ||y − ax||² over a. Expand the square: y-transpose y − 2a x-transpose y + a² x-transpose x. Differentiating gives −2x-transpose y + 2a x-transpose x. Setting it to zero yields a = (x-transpose y)/(x-transpose x). The residual y − ax is orthogonal to x because its dot product with x is zero. Projection therefore emerges from an optimization problem rather than a formula to memorize.

For x = (1, 1) and y = (2, 0), a = 2/2 = 1. The projection is (1, 1), residual (1, −1), and squared residual length is two. Any different coefficient increases the squared distance. This two-dimensional example contains the central idea of least-squares regression: find the component explained by an allowable collection of directions, then analyze what remains.

The Cauchy–Schwarz inequality states |x-transpose y| ≤ ||x|| ||y||. One proof uses the fact that ||y − ax||² is nonnegative and substitutes its minimizing coefficient. The remaining expression is ||y||² − (x-transpose y)²/||x||² ≥ 0. Rearranging gives the inequality when x is nonzero; the zero case is immediate. Equality occurs when the vectors are proportional. This bound later ensures that correlation lies between −1 and 1.

## 3.3 Matrices are linear maps

A matrix A with m rows and n columns maps an n-dimensional vector into an m-dimensional vector. The entry A_ij is in row i and column j. Multiplying A by x takes a dot product of each row with x. With A = [[1, 2], [3, 4]] and x = (5, 6), the result is (17, 39). The first output is 1 × 5 + 2 × 6; the second is 3 × 5 + 4 × 6.

An alternative view combines columns: Ax is x1 times the first column plus x2 times the second. For the same example, 5(1, 3) + 6(2, 4) = (17, 39). The row view explains how each output is calculated; the column view explains what combinations are possible. Both are needed for understanding a system of equations.

Matrix multiplication represents composition. If B maps inputs to intermediate values and A maps those to outputs, AB applies B first and A second. The inner dimensions must match. In general AB differs from BA. A rotation followed by a directional stretch usually differs from the stretch followed by the rotation. Treating matrix multiplication like ordinary multiplication loses the order of the modeled operations.

The identity matrix I leaves a vector unchanged. An inverse A^(−1), when it exists, reverses A: A^(−1)A = I. But most numerical work should solve Ax = b directly rather than explicitly constructing the inverse. An inverse is useful conceptually; a suitable factorization is usually better computationally. Rectangular matrices do not have ordinary two-sided inverses.

## 3.4 Solving systems and discovering rank

Consider x + 2y = 5 and 3x + 4y = 11. Subtract three times the first equation from the second to obtain −2y = −4, giving y = 2 and x = 1. This is elimination: replace equations by equivalent combinations until the unknowns can be recovered. Row swaps, adding a multiple of another row, and multiplying a row by a nonzero scalar preserve the solution set.

Now change the second equation to 2x + 4y = 10. It contributes no new restriction: it is twice the first. There are infinitely many solutions. If the right side were 11, there would be none. The same coefficient structure can therefore produce nonuniqueness or inconsistency depending on the right-hand side. Rank measures how many independent directions the columns, or equivalently the rows, contain.

The column space is the set of all possible Ax. The null space is the set of x satisfying Ax = 0. If a nonzero z is in the null space and x solves Ax = b, then x + z also solves it. A unique solution requires no hidden direction that leaves outputs unchanged. For an m-by-n matrix, rank plus null-space dimension equals n. This is the rank–nullity relationship.

Linear independence means the only combination of selected vectors that gives zero uses all zero coefficients. A basis is an independent collection spanning a space. Coordinates are coefficients relative to a basis. Choosing different bases changes the numerical description without changing the underlying object. Principal components will choose a basis that makes variation easier to describe; they do not create new information from nothing.

## 3.5 Least squares when exact fitting is impossible

Observed data seldom lie exactly on a model. Suppose y_i is an outcome and row i of X contains its model inputs. We choose coefficients beta to minimize ||y − X beta||². Differentiating gives the normal equations X-transpose X beta = X-transpose y. If X has independent columns, the unique solution is formally (X-transpose X)^(−1)X-transpose y. If columns are dependent, fitted values are still uniquely determined as a projection, but coefficient vectors may not be unique.

Take three observations at x = 0, 1, 2, with outcomes 1, 2, 2. Fit a line a + bx. The design matrix has rows (1, 0), (1, 1), (1, 2). The normal equations are 3a + 3b = 5 and 3a + 5b = 6. Subtraction gives 2b = 1, so b = 0.5 and a = 7/6. Fitted values are 7/6, 5/3, and 13/6. Residuals are −1/6, 1/3, and −1/6. They sum to zero and their weighted sum against x is zero, expressing orthogonality to both columns.

These properties depend on the objective and included columns. Residuals need not sum to zero if the model omits an intercept. Minimizing squared errors does not establish causality, statistical significance, or correct specification. It establishes a geometric best fit relative to the chosen column space and loss function. Statistical interpretation comes later.

Numerically, forming X-transpose X can worsen conditioning. A QR factorization writes X = QR, with orthonormal columns in Q and upper-triangular R. The least-squares problem becomes solving R beta = Q-transpose y. Orthonormal transformations preserve Euclidean lengths, so the objective retains its geometry without explicitly squaring the matrix's condition number. Modern least-squares routines use suitable stable factorizations rather than the inverse expression.

## 3.6 Quadratic forms and covariance geometry

A quadratic form is x-transpose A x. For a symmetric two-by-two matrix with entries a, b, b, c, it expands to ax1² + 2bx1x2 + cx2². Symmetry means A-transpose = A. A symmetric matrix is positive semidefinite if its quadratic form is nonnegative for every x; it is positive definite if the form is strictly positive for every nonzero x.

For A = [[2, 1], [1, 2]], the form is 2x1² + 2x1x2 + 2x2² = (x1 + x2)² + x1² + x2², positive for nonzero x. For B = [[1, 2], [2, 1]], choosing x = (1, −1) gives −2, so B is not positive semidefinite. A matrix can have positive diagonal entries and still have a negative quadratic direction. Checking only individual variances is insufficient for validating a covariance matrix.

A covariance matrix Sigma has entries Cov(R_i, R_j). For weights w, portfolio variance is w-transpose Sigma w because expanding the variance of sum w_i R_i creates every covariance pair. Since variance cannot be negative, every valid covariance matrix is positive semidefinite. This is both a theorem and a practical data-quality check. Pairwise estimates using different missing-data subsets can accidentally produce a matrix violating it.

For two assets with standard deviations 0.2 and 0.1 and correlation 0.3, covariance is 0.3 × 0.2 × 0.1 = 0.006. The covariance matrix is [[0.04, 0.006], [0.006, 0.01]]. Equal weights give variance 0.25 × 0.04 + 0.5 × 0.006 + 0.25 × 0.01 = 0.0155, hence standard deviation approximately 0.12450. The middle term appears twice through the two symmetric covariance entries. Forgetting it changes the portfolio's estimated risk.

## 3.7 Eigenvalues reveal natural directions

An eigenvector v is a nonzero vector satisfying Av = lambda v. The map changes its length and possibly reverses its direction but does not rotate it away from its span. Lambda is the eigenvalue. For [[2, 1], [1, 2]], (1, 1) maps to (3, 3), so it has eigenvalue three. The vector (1, −1) maps to itself and has eigenvalue one. The matrix stretches the shared direction more than the opposing direction.

Real symmetric matrices admit an orthonormal eigenvector basis. Write A = Q Lambda Q-transpose, where Q's columns are orthonormal eigenvectors and Lambda is diagonal. This spectral theorem turns a coupled quadratic form into a sum of independent squared coordinates multiplied by eigenvalues. The matrix is positive semidefinite exactly when all eigenvalues are nonnegative. Repeated eigenvalues allow multiple valid bases within the corresponding subspace.

For a covariance matrix, eigenvalues quantify variance along orthogonal directions. The trace, the sum of diagonal entries, equals the sum of eigenvalues and therefore total variance. A tiny eigenvalue indicates an almost redundant combination; a negative eigenvalue beyond numerical tolerance suggests an invalid covariance estimate or implementation problem. Eigenvectors can flip sign without changing their meaning because both v and −v describe the same one-dimensional direction.

Diagonalization is not available with an orthonormal real basis for every arbitrary matrix. Some nonsymmetric matrices have complex eigenvalues or insufficient independent eigenvectors. We will use symmetric eigensolvers for symmetric covariance matrices and more general decompositions when structure differs. Choosing an algorithm based on a matrix's known properties is a form of mathematical modeling.

## 3.8 Singular values and principal components

Every real m-by-n matrix has a singular value decomposition X = U D V-transpose, with orthonormal singular-vector columns and nonnegative singular values in D. Singular values measure how strongly X stretches particular orthogonal input directions. Their number above an appropriate tolerance estimates numerical rank. Unlike eigenvalue decomposition, the SVD also applies to rectangular matrices.

Principal component analysis begins with a data matrix whose rows are observations and columns are variables. Center each column by subtracting its sample mean. The sample covariance is X-transpose X/(n − 1). Its leading eigenvector gives the unit direction with largest sample variance, because maximizing v-transpose Sigma v subject to v-transpose v = 1 selects the largest eigenvalue direction. Subsequent components maximize remaining variance subject to orthogonality.

For two centered variables that move almost identically, the leading component points near (1, 1), capturing common variation; the second near (1, −1) captures their difference. In a yield-curve dataset, leading empirical components often resemble broad curve movements, but the labels “level,” “slope,” and “curvature” are interpretations checked against loadings, not universal mathematical guarantees. The course's interest-rate PCA materials supply a substantive application.

Scaling changes PCA. A variable measured in basis points and another in decimal units can have radically different numerical variances despite identical economic variation. Covariance PCA preserves original scale; correlation PCA standardizes each variable first. Choose according to the question, report the choice, and fit centering and scaling on training data only when evaluating forecasts. Computing components using the future test period leaks future distribution information.

PCA is unsupervised: it maximizes variance in inputs rather than prediction of an outcome. A high-variance component can be irrelevant to the target; a low-variance spread can be economically informative. Truncating components reduces dimension but discards information. Cross-validation or a stated reconstruction objective should justify the truncation.

## 3.9 Numerical conditioning and regularization

A problem is ill-conditioned when small input changes can produce large output changes. Consider equations x + y = 2 and x + (1 + epsilon)y = 2 + epsilon. For epsilon nonzero, the solution is x = y = 1. If the second right side changes by delta, y changes by delta/epsilon. When epsilon is tiny, even a tiny measurement error can produce a large coefficient change. This is a property of the mathematical problem, distinct from an unstable algorithm.

The two-norm condition number of an invertible matrix is its largest singular value divided by its smallest. A large ratio indicates strong amplification in an unfavorable direction. Stable computation cannot recover information absent from nearly redundant measurements. Report uncertainty, reconsider the model, or regularize rather than interpreting unstable coefficients as precise findings.

Ridge regularization minimizes ||y − X beta||² + lambda ||beta||² for lambda > 0. Its normal equation is (X-transpose X + lambda I)beta = X-transpose y. The added term lifts small eigenvalues and discourages large coefficients. It trades some fitting bias for reduced sensitivity. If an intercept should remain unpenalized, exclude its coordinate from the penalty. Scaling inputs matters because the penalty acts on coefficient magnitudes in the chosen units.

Covariance shrinkage uses a similar idea: Sigma_shrunk = (1 − alpha)Sigma_sample + alpha T, where T is a structured positive semidefinite target. If both matrices are positive semidefinite and alpha is between zero and one, the combination remains positive semidefinite because its quadratic form is a nonnegative weighted sum. A shrinkage estimator can improve stability without proving that its target is the true covariance.

## 3.10 Factorizations, computation, and failure diagnosis

Cholesky factorization writes a symmetric positive-definite matrix as LL-transpose with lower-triangular L. It is efficient for solving systems and generating correlated normal variables. If z has identity covariance and x = Lz, then Cov(x) = L I L-transpose = Sigma. A merely semidefinite matrix may require an eigenvalue or rank-aware method. Adding a small diagonal adjustment can make a computation run, but that changes the model and must be reported.

For A = [[4, 2], [2, 3]], choose L11 = 2, L21 = 1, and L22 = sqrt(2), giving L = [[2, 0], [1, sqrt(2)]]. Multiplication recovers A. Solving Ax = b then means first solving Ly = b and then L-transpose x = y. These triangular steps replace a more expensive explicit inverse. Reusing the factorization is valuable when many right-hand sides share the same matrix.

When a solver fails, diagnose the mathematical situation before changing a tolerance. A dimension mismatch means the specified operations do not align. A singular system can indicate duplicate features, an intercept duplicated by dummy variables, or an unidentifiable model. A failed positive-definiteness check can indicate valid redundancy or invalid covariance construction. An overflow can indicate extreme scaling. Each failure has a different remedy.

Numerical tolerances depend on scale. A value of 10^(−12) may be negligible relative to one and enormous relative to 10^(−20). Use comparisons such as |a − b| ≤ atol + rtol|b|, with tolerances chosen for the data and operation. Exact equality is often inappropriate for floating-point results, but an overly generous tolerance can hide substantive errors.

### Replication as a linear system

Suppose two securities have payoffs (120, 80) and (105, 105) across two future states. To replicate target payoff (20, 0), choose holdings a and b satisfying 120a + 105b = 20 and 80a + 105b = 0. Subtracting yields 40a = 20, so a = 0.5 and b = −40/105. The payoff matrix's columns span both state directions, so every two-state payoff can be represented. Its rank is two.

Now add a third state while keeping only those two securities. The payoff matrix has three rows and two columns, so its column space has dimension at most two. Some three-state target payoffs cannot be replicated. This is the linear-algebra core of market incompleteness. A least-squares approximation can minimize payoff error, but it does not turn the approximate payoff into an exact replication or uniquely determine every unhedgeable claim's price.

The null space has an economic interpretation too. If a nonzero portfolio produces zero payoff in every modeled state, no-arbitrage requires its current cost to be zero under the same feasibility assumptions. Otherwise one direction of the portfolio would deliver an initial gain with no future obligation. Redundant securities impose price restrictions even though they do not expand attainable payoffs.

### Determinants are summaries, not a default algorithm

For a two-by-two matrix [[a, b], [c, d]], the determinant is ad − bc. A nonzero determinant means its columns span the plane and the map is invertible. Geometrically, the absolute determinant scales oriented area; a negative determinant reverses orientation. For larger square matrices, determinant zero similarly indicates singularity, but explicitly expanding determinants is a poor way to solve large numerical systems.

A tiny determinant is not a scale-independent measure of poor conditioning. Multiplying every entry of a well-conditioned n-by-n matrix by a small constant multiplies its determinant by that constant to the nth power without changing its condition number. Conversely, a determinant can look moderate while singular values vary greatly. Use singular values or an appropriate condition estimate to diagnose sensitivity.

### Orthogonalization as an explicit procedure

To build an orthonormal basis from independent vectors, normalize the first, subtract its projection from the second, normalize what remains, and continue. For v1 = (1, 1) and v2 = (1, 0), the first unit vector is (1, 1)/sqrt(2). Subtracting v2's projection leaves (1/2, −1/2), whose normalized direction is (1, −1)/sqrt(2). These become the columns of Q in a QR construction.

Classical Gram–Schmidt expresses the geometry clearly but can lose orthogonality in floating-point arithmetic for nearly dependent columns. Modified Gram–Schmidt or Householder transformations improve numerical behavior. This illustrates a recurring distinction: a mathematically equivalent formula can have a different computational error profile. Learn the transparent derivation, then use a stable implementation appropriate to the scale.

When using a decomposition, retain its diagnostic output where available. Rank estimates, singular values, residual norms, and convergence status explain more than a coefficient vector alone. A small residual can coexist with unstable coefficients when predictors nearly duplicate one another.

## 3.11 Practice and connections

In the portfolio laboratory, the covariance expression changes as you adjust correlation and weights. Verify three limits: putting all weight in the first asset returns its risk; perfect positive correlation eliminates diversification for nonnegative weights; perfect negative correlation permits zero variance at a particular hedge ratio under the model. The zero-risk combination depends on exact model parameters and does not promise a real-world arbitrage.

Suggested exercises: calculate [[1, 2], [0, 1]] times (3, 4); solve x + y = 3 and x − y = 1; project (3, 1) onto (1, 1); find eigenvalues of [[2, 1], [1, 2]] using the directions already identified; explain why duplicate regression columns prevent unique coefficient identification. For an extension, prove that any covariance matrix is positive semidefinite by expanding the variance of a weighted sum.

Use [MIT 18.06SC Linear Algebra](https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/) for full lectures and exercises. [MIT 18.642](https://ocw.mit.edu/courses/18-642-topics-in-mathematics-with-applications-in-finance-fall-2024/) connects the ideas to one-period models and interest-rate PCA. [Stanford EE364A](https://see.stanford.edu/Course/EE364A) uses this language for optimization. The resource catalog includes direct notes and problem links; studying them after this chapter should feel like elaborating a familiar structure rather than encountering an unexplained notation system.

The main dependency is now established: vectors represent related quantities, matrices transform them, subspaces describe what can be represented, and factorizations reveal structure and support stable computation. Chapter 4 turns these operations into reproducible programs, while later chapters attach probability and economic interpretation to them.
