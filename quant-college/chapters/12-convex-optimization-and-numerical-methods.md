# 12. Convex optimization and numerical methods

## 12.1 Choosing the best feasible decision

An optimization problem has variables, an objective, and constraints. For a portfolio, variables might be asset weights, the objective expected return minus a risk penalty, and constraints budget, leverage, exposure, or turnover limits. Writing these elements precisely is more important than choosing a solver first. A solver answers the mathematical problem supplied to it, which may differ from the intended economic decision.

Convex optimization is valuable because local improvement and global structure align under appropriate conditions. It does not make uncertain expected returns known or eliminate model risk. This chapter follows the families in [Stanford EE364A](https://see.stanford.edu/Course/EE364A), with the authors' freely available [Convex Optimization book](https://web.stanford.edu/~boyd/cvxbook/) as the full reference. The resource index includes lecture notes, review notes, homework links, solutions, transcripts, and data files.

## 12.2 Convex sets and their geometry

A set C is convex if, for any x and y in C and any theta between zero and one, theta x + (1 − theta)y is also in C. Every line segment between feasible points remains feasible. A portfolio budget hyperplane 1-transpose w = 1 is convex. Adding nonnegative-weight constraints gives a simplex, also convex. A rule “hold either zero or at least 10% of each asset” generally creates a nonconvex set because a midpoint can violate it.

Intersections of convex sets are convex: a segment between two points in the intersection belongs to every set and therefore to the intersection. Affine maps preserve convexity. Norm balls, halfspaces, and positive-semidefinite matrix cones are important examples. A union of convex sets need not be convex; two separated intervals illustrate the failure.

A separating hyperplane can distinguish a point outside a suitable closed convex set from the set. This geometric idea supports duality and optimality certificates. A supporting hyperplane touches a convex set while leaving it on one side. In portfolio terms, a linear objective can be viewed as sliding a hyperplane until it first supports the feasible region. The picture explains why linear constraints and objectives have exploitable geometry.

## 12.3 Convex functions and composition rules

A function f on a convex domain is convex if f(theta x + (1 − theta)y) ≤ theta f(x) + (1 − theta)f(y). Its graph lies below chords. The epigraph, points (x, t) with f(x) ≤ t, is convex exactly when f is convex. This lets us convert some nonlinear objectives into linear objectives with convex constraints by introducing an auxiliary variable.

For differentiable f, convexity is equivalent to f(y) ≥ f(x) + gradient f(x)-transpose(y − x) on the domain. The tangent plane is a global lower bound. For twice differentiable f on an open convex domain, a positive-semidefinite Hessian characterizes convexity. The quadratic w-transpose Sigma w is convex when Sigma is positive semidefinite, directly connecting covariance validity to portfolio optimization.

Positive weighted sums and pointwise maxima of convex functions are convex. Affine composition preserves convexity. General composition requires care: a convex nondecreasing outer function composed with a convex inner function is convex under appropriate domain conditions. Multiplying two arbitrary convex functions does not generally preserve convexity. A disciplined modeling system checks known composition rules rather than guessing from a smooth-looking formula.

The negative logarithm is convex on positive inputs. Log-sum-exp, log(sum exp x_i), is convex and gives a smooth approximation to a maximum. A ratio can be convex, concave, or neither depending on its structure; x²/y is convex for y > 0, while x/y is not generally jointly convex. Domain restrictions are part of the function's curvature statement.

## 12.4 Standard problem families

A linear program minimizes c-transpose x subject to affine equalities and inequalities. A quadratic program adds a quadratic objective with positive-semidefinite Hessian and retains affine constraints. A mean–variance portfolio with linear exposure limits is a convex quadratic program when covariance is positive semidefinite and the objective signs are correct.

A second-order cone constraint has the form ||Ax + b||2 ≤ c-transpose x + d. It can represent standard-deviation limits and robust linear constraints. A semidefinite program uses a symmetric matrix expression constrained to be positive semidefinite, such as F0 + sum x_i F_i semidefinite-positive. Semidefinite structure can model covariance, matrix inequalities, and experimental design, but computational size grows with matrix dimensions.

Geometric programming becomes convex after logarithmic transformations for a specific class of positive-variable monomial and posynomial expressions. “Geometric” here names that mathematical class, not arbitrary spatial geometry. Always state the transformation and domain, then translate the solution back. A transformation that is one-to-one on positive variables can preserve the optimization's meaning; ignoring positivity cannot.

Least squares minimizes ||Ax − b||² and is convex. Least absolute deviations minimizes the one-norm of residuals and can be written as a linear program with auxiliary bounds. Chebyshev fitting minimizes the maximum absolute residual. These objectives penalize errors differently, so the best choice depends on the data and purpose. A solver cannot decide which loss reflects the research question.

## 12.5 Lagrangians and lower bounds

Consider minimizing f0(x) subject to fi(x) ≤ 0 and h_j(x) = 0. The Lagrangian is L(x, lambda, nu) = f0(x) + sum lambda_i fi(x) + sum nu_j h_j(x), with lambda_i nonnegative. For feasible x, the inequality terms are nonpositive and equality terms vanish, so L(x, lambda, nu) ≤ f0(x). Taking the infimum over x gives a lower bound g(lambda, nu) on every feasible objective value.

The dual problem maximizes this lower bound over lambda ≥ 0 and unrestricted nu. Weak duality states that a dual feasible value cannot exceed a primal feasible value. The gap between them is an optimality certificate when both are available. Strong duality says the best values coincide; it requires conditions and is not automatic for every optimization problem.

For convex problems, Slater's condition gives a common sufficient condition for strong duality: a suitable relative-interior point satisfies strict inequalities and the affine equalities, with technical domain qualifications. A failure of Slater does not prove a duality gap; it means this convenient sufficient theorem cannot be invoked. State the actual assumptions used rather than treating a named theorem as a magic label.

## 12.6 KKT conditions and a fully solved example

Under appropriate differentiability and constraint qualifications, the Karush–Kuhn–Tucker conditions combine primal feasibility, dual feasibility, stationarity, and complementary slackness. Complementary slackness is lambda_i fi(x) = 0: an inequality can have a positive multiplier only when active. In a convex problem, a point satisfying suitable KKT conditions is globally optimal. Necessity and sufficiency have different assumptions and should be distinguished.

Minimize one half (x − 2)² subject to x ≤ 1. Write constraint f1(x) = x − 1 ≤ 0. Lagrangian is one half (x − 2)² + lambda(x − 1). Stationarity gives x − 2 + lambda = 0. If the constraint were inactive, lambda = 0 and x = 2, infeasible. Therefore x = 1, and stationarity gives lambda = 1. All conditions hold, so the optimum is x = 1 with objective 0.5.

The multiplier has a sensitivity interpretation. If the bound becomes x ≤ b near b = 1, optimal value is one half (b − 2)² and its derivative with respect to b is b − 2 = −1. Relaxing the bound lowers the objective at rate one, matching the negative multiplier under this constraint convention. Multiplier signs depend on how a constraint is written, so verify the convention before interpreting “shadow prices.”

For portfolio optimization, a multiplier on a risk or exposure bound describes local objective sensitivity to that bound under regularity. It is conditional on estimated inputs and the model. A large multiplier can identify a restrictive constraint, but it does not establish that relaxing it is institutionally appropriate.

## 12.7 Gradient descent and line search

Gradient descent updates x_new = x − alpha gradient f(x), moving opposite the local steepest ascent direction in Euclidean geometry. A step size that is too large can increase the objective or diverge. For f(x) = one half a x² with a > 0, the update is x_new = (1 − alpha a)x. Convergence requires |1 − alpha a| < 1, or 0 < alpha < 2/a. This simple case explains step-size sensitivity.

Backtracking line search starts with a candidate step and repeatedly reduces it until a sufficient-decrease condition holds. The condition compares actual decrease with a fraction of the linear prediction. It requires a descent direction and suitable smoothness. A line-search failure can indicate an invalid gradient, a domain violation, or numerical problems, not merely an inconvenient tolerance.

For a convex differentiable function with Lipschitz-continuous gradient, suitable fixed steps have standard convergence guarantees. Strong convexity gives stronger rates. Ill-conditioning makes gradient directions zigzag in narrow curved valleys. Scaling, preconditioning, or second-order methods can improve convergence. The geometry of the objective explains algorithm performance.

## 12.8 Newton's method and equality constraints

Newton's method approximates f near x by its second-order Taylor model and minimizes that local quadratic. The step solves H delta x = −gradient f, where H is the Hessian. For a positive-definite Hessian near a well-behaved optimum, it can converge rapidly. Far away, damping or a line search can be needed. An indefinite Hessian in a nonconvex problem may produce a direction that is not descending.

With equality constraints A x = b, a Newton step must satisfy A delta x = 0 when starting feasible. The KKT linear system combines curvature and constraints:

$$\begin{bmatrix}H&A^\top\\A&0\end{bmatrix}
\begin{bmatrix}\Delta x\\\nu\end{bmatrix}
=\begin{bmatrix}-\nabla f\\0\end{bmatrix}.$$

The block system is not positive definite in the same way as H; use an appropriate factorization. If starting infeasible, the right-hand side includes the equality residual. A small gradient alone does not establish convergence when constraints remain violated. Check primal residual, dual or stationarity residual, and objective or gap diagnostics.

Solving linear systems often dominates optimization cost. Sparse structure, repeated factorizations, and matrix conditioning matter. Numerical linear algebra from Chapter 3 is therefore a core prerequisite rather than a separate optional topic. Avoid explicitly inverting a large KKT matrix.

## 12.9 Interior-point methods and barriers

A logarithmic barrier for inequality fi(x) < 0 adds −sum log(−fi(x)) to a scaled objective. It becomes large near the boundary, keeping iterates strictly inside when the algorithm preserves the domain. Increasing the objective scale traces a central path toward the constrained optimum under suitable conditions. Newton steps solve each barrier subproblem.

For minimizing f0 with m inequalities, standard barrier analysis relates the duality gap along the central path to m/t under the usual setup. This supplies a principled stopping target rather than stopping only because consecutive iterates look similar. Domain feasibility, conditioning near boundaries, and a suitable starting point remain practical concerns.

An infeasible problem has no allowed point; an unbounded problem permits the objective to improve without limit. A solver can also stop because of numerical failure without establishing either property. Read the status and certificate. Do not convert every non-success status into “no solution” or silently use the last iterate as if optimal.

## 12.10 Statistical estimation and experimental design

Many likelihood objectives are convex in suitable parameters. Logistic negative log likelihood is convex because its Hessian is a nonnegative weighted sum of outer products. Covariance or latent-variable models can be nonconvex, so the word “maximum likelihood” does not guarantee a globally tractable problem. Curvature belongs to a specific parameterization and objective.

Experimental design chooses where to collect measurements to improve parameter information. If information matrix is M(w) = sum w_i a_i a_i-transpose, weights w_i can allocate sampling effort under a budget. D-optimal design maximizes log determinant of M over a positive-definite domain; A-optimal design minimizes trace of its inverse under suitable conditions. These criteria prioritize different summaries of uncertainty.

The interpretation of determinant is geometric: an information matrix defines an uncertainty ellipsoid, and determinant relates to its volume. Trace of inverse information summarizes average marginal variance in the chosen coordinates. Scaling parameters changes these criteria's practical meaning, so define units and target directions. The Stanford course's experimental-design material includes historical errata notes; consult the official book errata when solving those exercises.

Geometric optimization also includes minimum-volume enclosing ellipsoids, distance between convex sets, and separation problems. These applications illustrate how a mathematical formulation can transform a visual problem into a solvable convex program. They are not finance-specific, but they develop the formulation skill needed for portfolio and estimation constraints.

## 12.11 A portfolio program with costs

Let mu be expected returns, Sigma covariance, w_old current weights, and w new weights. One convex objective minimizes one half gamma w-transpose Sigma w − mu-transpose w + c||w − w_old||1, subject to budget and linear exposure limits. The absolute-value term approximates proportional trading costs under a stated convention. All terms need compatible units and a consistent horizon.

Introduce t_i ≥ w_i − w_old_i and t_i ≥ −(w_i − w_old_i), then minimize the linear cost c sum t_i along with the quadratic term. At optimum, positive costs encourage t_i to equal the absolute changes. A leverage limit ||w||1 ≤ L is also convex. A requirement to hold exactly ten assets is combinatorial and generally nonconvex; replacing it with an absolute-value penalty does not make it the same problem.

Before trusting results, check sum of weights, bound violations, factor exposures, objective components, and sensitivity to mu and Sigma. Compare against current weights and simple baselines. If the optimizer recommends huge trades for a tiny expected improvement, inspect input noise and the cost model. A model using constant proportional costs omits nonlinear market impact and capacity.

## 12.12 Robust optimization and model uncertainty

Robust optimization protects against a specified uncertainty set rather than a single estimated parameter. If expected return is mu_hat + delta with ||delta||2 ≤ epsilon, the worst-case portfolio return is mu_hat-transpose w − epsilon||w||2 by Cauchy–Schwarz. This converts parameter uncertainty into a norm penalty. The mathematical transformation is exact for the stated set; the set itself is a modeling choice.

A too-large uncertainty set can produce excessively conservative decisions, while a too-small one offers little protection. Robustness to one set of mean perturbations does not guarantee robustness to regime changes, liquidity shocks, or omitted constraints. Document what uncertainty is modeled and evaluate performance under additional scenarios relevant to the institution.

### A linear-program dual you can verify

Minimize c-transpose x subject to Ax = b and x ≥ 0. Using L = c-transpose x + nu-transpose(b − Ax), the infimum over nonnegative x is finite only when c − A-transpose nu ≥ 0. Otherwise a coordinate with negative coefficient can grow without bound and drive L to negative infinity. The dual is therefore maximize b-transpose nu subject to A-transpose nu ≤ c.

Take primal minimize 2x1 + 3x2 subject to x1 + x2 = 1 and x ≥ 0. The optimum is x1 = 1, x2 = 0, value two. The dual maximizes nu subject to nu ≤ 2 and nu ≤ 3, so nu = 2 gives the same value. Feasible primal and dual points with equal objective certify optimality without inspecting every feasible portfolio.

Complementary slackness says x_i(c_i − a_i-transpose nu) = 0. The second asset has reduced cost one at nu = 2 and zero optimal allocation; the first has zero reduced cost and positive allocation. This is a concrete version of the abstract KKT relationship. A numerical gap of 10^(−8) is meaningful only relative to objective scale and feasibility tolerances.

### Semidefinite constraints in two dimensions

A symmetric matrix [[a, b], [b, c]] is positive semidefinite exactly when a ≥ 0, c ≥ 0, and ac − b² ≥ 0. Necessity follows by testing coordinate directions and the quadratic's discriminant; sufficiency follows by completing the square, with a separate zero-diagonal case. For a correlation matrix [[1, rho], [rho, 1]], this reduces to |rho| ≤ 1.

A semidefinite constraint is a matrix-level generalization of nonnegative curvature. It can enforce that an estimated covariance candidate is valid while optimizing a fitting objective. Entrywise nonnegativity is different: a valid covariance matrix can have negative off-diagonal entries, and a matrix with every entry positive can still have a negative eigenvalue. Use the appropriate cone rather than a visually appealing sign rule.

### Geometry through norms and dual norms

The dual norm of a vector y is the maximum of y-transpose x over ||x|| ≤ 1. For the Euclidean norm, the dual is Euclidean by Cauchy–Schwarz. For the one-norm, the dual is the infinity-norm because the maximizing budget can be concentrated on the coordinate with largest absolute y. For the infinity-norm, the dual is the one-norm because each coordinate can independently take its favorable sign.

This relationship explains robust penalties. If mean uncertainty is bounded in infinity-norm, the worst-case portfolio-mean adjustment is proportional to ||w||1. If bounded in one-norm, it is proportional to ||w||infinity. The uncertainty-set geometry determines which exposure pattern is penalized. Choosing a norm is an economic assumption about plausible errors, not just a software setting.

### Filter design as an optimization example

Suppose a linear filter outputs y_t = sum from j = 0 to p of h_j x_(t−j). Choose coefficients h to approximate a desired response or denoise observations while limiting amplification. Squared fitting errors give a quadratic objective; bounds on frequency response or coefficient norms can give convex constraints under suitable formulations.

In finance, smoothing can make a chart easier to read but introduces lag and changes the statistical object. A centered filter uses future observations and cannot be applied as a real-time feature without delay. A causal filter uses current and past inputs. The Stanford filter-design examples build formulation skills; their application to a trading signal still requires an information-timing argument.

### Why KKT suffices in a convex differentiable problem

Let x_star be feasible and satisfy stationarity with nonnegative multipliers and complementary slackness. Convexity gives f0(x) ≥ f0(x_star) + gradient f0(x_star)-transpose(x − x_star). Substitute stationarity to replace the objective gradient by a negative weighted sum of constraint gradients and equality gradients.

For each convex inequality fi, fi(x) ≥ fi(x_star) + gradient fi(x_star)-transpose(x − x_star). Rearranging and multiplying by nonnegative lambda_i bounds the negative gradient contribution below by lambda_i[fi(x_star) − fi(x)]. Complementary slackness makes the first term zero, and feasibility makes the remaining negative weighted fi(x) nonnegative. Affine equality contributions vanish because both points satisfy the same equalities. Therefore f0(x) ≥ f0(x_star).

The proof identifies the roles of convexity, nonnegative multipliers, feasibility, and complementary slackness. Without convexity, the tangent inequality need not hold globally. Without nonnegative multipliers, multiplying an inequality could reverse its useful direction. A checklist of KKT equations is much easier to remember when the global proof is understood.

### A practical solver review

After solving, independently recompute the objective from returned variables and original inputs. Check every constraint in its original units. Compare the reported duality gap or residuals with meaningful tolerances. Perturb a bound slightly and see whether objective changes agree locally with the multiplier, recognizing that active-set changes can make sensitivity nonsmooth.

Finally compare the optimization output with a feasible simple decision. If the returned objective is worse than a known feasible baseline in a minimization problem, either convergence failed, the objective was recomputed differently, or the formulations differ. This cheap check can reveal mistakes that a polished solver status hides.

### Nondifferentiable convex objectives

The absolute-value function is convex but has no ordinary derivative at zero. A subgradient g at x satisfies f(y) at least f(x) plus g times (y minus x) for every y. For absolute value at zero, every g between minus one and one is a subgradient. Away from zero, the subgradient is the usual sign.

For minimizing a convex function without constraints, zero belonging to the subdifferential certifies a global minimum. This extends the tangent-lower-bound argument without pretending a kink has a unique slope. Lasso and turnover penalties use this structure. A numerical method designed for smooth objectives may behave poorly at such kinks; proximal or other nonsmooth methods exploit the objective's actual form. The correct formulation includes both curvature and differentiability information.

For f(x) = absolute value of x plus one half times (x minus a) squared, optimality is zero in the sum of a subgradient and x minus a. If a exceeds one, the solution is a minus one; if a is below minus one, it is a plus one; otherwise the solution is zero. This soft-threshold rule follows by checking the positive, negative, and zero regions separately. It explains how an absolute-value penalty creates exact zeros rather than merely shrinking every coefficient continuously. The zero region uses the whole subgradient interval, so forcing an arbitrary derivative value at the kink can miss the correct optimality argument. This scalar calculation underlies proximal updates for lasso-type objectives and offers an independent check for a numerical implementation.

## 12.13 Practice, computation, and source study

The optimization laboratory minimizes a one-dimensional quadratic with a bound and shows the unconstrained and constrained solutions. It exposes the role of an active constraint and a local sensitivity calculation. The portfolio laboratory separately explores a two-asset frontier. These are real calculations tied to the derivations, not a general-purpose convex solver. Large quadratic and semidefinite programs are advanced source-based exercises.

Suggested applications: prove intersection preserves convexity; test a Hessian for positive semidefiniteness; derive KKT conditions for nonnegative portfolio weights; solve a bounded quadratic by cases; compare gradient-descent steps for several step sizes; formulate absolute turnover with auxiliary variables; derive the worst-case mean penalty above. Hints: expand definitions before invoking a theorem, and separate feasibility from stationarity.

Follow the full [Stanford EE364A course](https://see.stanford.edu/Course/EE364A) and [Boyd–Vandenberghe book](https://web.stanford.edu/~boyd/cvxbook/) through sets, functions, problems, duality, approximation, estimation, geometry, numerical linear algebra, unconstrained and equality-constrained minimization, and interior-point methods. Historical course examples use MATLAB/CVX; the mathematical formulations transfer, but software syntax must be checked in the chosen environment. Do not treat an old executable assignment as an instruction to install or run unexamined code.

Optimization now supplies a language for deliberate choices and verifiable certificates. The next chapter returns to uncertainty evolving continuously through time, preparing the mathematical basis of derivatives and dynamic financial decisions.
