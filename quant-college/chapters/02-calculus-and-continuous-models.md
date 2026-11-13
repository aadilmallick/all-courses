# 2. Calculus and continuous models

## 2.1 Measuring change without choosing an arbitrary interval

An account follows V(t) = 100(1 + t)², where t is time in years. Between t = 1 and t = 2, its value rises from 400 to 900, so its average rate of change is 500 dollars per year. Between t = 1 and t = 1.1, it rises from 400 to 441, an average rate of 410 dollars per year. Both answers are correct, but they answer questions about different intervals. We want a rate at a particular instant. That requires investigating what happens as the interval shrinks.

For a function f, the difference quotient at x over an increment h is [f(x + h) − f(x)]/h, with h nonzero. The numerator measures an output change and the denominator measures an input change. On a graph, their ratio is the slope of a secant line through two points. If these slopes approach a single finite value as h approaches zero from both sides, that value is the derivative f'(x).

For f(x) = x², expansion gives [(x + h)² − x²]/h = (2xh + h²)/h = 2x + h. Cancellation is valid because h is nonzero during the calculation. As h tends to zero, 2x + h tends to 2x. Thus f'(x) = 2x. The derivative was obtained from nearby distinct inputs; we never divided by zero. For V(t), V'(t) = 200(1 + t), so the instantaneous rate at t = 1 is 400 dollars per year. The 410-dollar average rate over the short interval is close because the slope changes gradually.

Calculus is not a replacement for discrete models. Financial data arrive at discrete times, and cash flows often occur on specified dates. Continuous models can make relationships tractable and provide useful approximations. Their assumptions must still connect to the actual contract or observation process. The difference between a convenient smooth model and a jagged observed price path will become central in stochastic calculus.

## 2.2 Limits give approximation a precise meaning

The statement f(x) tends to L as x tends to a means that f(x) can be made arbitrarily close to L by keeping x sufficiently close to a, excluding x = a itself if necessary. Formally, for every epsilon greater than zero there exists delta greater than zero such that 0 < |x − a| < delta implies |f(x) − L| < epsilon. Epsilon specifies the desired output tolerance; delta specifies an input tolerance sufficient to achieve it.

For f(x) = 3x + 2 near a = 1, the candidate limit is 5. Since |f(x) − 5| = 3|x − 1|, choosing delta = epsilon/3 proves the claim. This example shows the logical order. The desired tolerance is given first; we find a rule for satisfying it. Choosing one convenient epsilon would illustrate the behavior but would not prove the universal claim.

A function is continuous at a when its limit at a equals f(a). The function g(x) = (x² − 1)/(x − 1) is undefined at x = 1 but equals x + 1 elsewhere, so its limit there is 2. Defining g(1) = 2 repairs the removable discontinuity. By contrast, a jump from zero to one cannot be repaired by changing one point: the left and right limits differ. A derivative requires continuity, but continuity does not guarantee a derivative. The absolute-value function is continuous at zero and has left slope −1 and right slope +1, so it is not differentiable there.

Sequences also have limits. The sequence 1/n tends to zero because, for any positive epsilon, n > 1/epsilon makes 1/n < epsilon. A convergent series is a limit of partial sums. These definitions underlie discounted infinite cash flows, infinite moving-average representations, and the convergence of numerical algorithms. They also warn us that an apparently stable finite calculation does not automatically prove a limiting statement.

## 2.3 Derivative rules and why they work

Linearity follows directly from distributing a difference quotient: the derivative of af + bg is af' + bg' for constants a and b. The derivative of a constant is zero because its numerator change is zero. For integer powers, expansion of (x + h)^n gives nx^(n−1) as the only term that remains after division by h and passage to the limit. This leads to the power rule d(x^n)/dx = nx^(n−1), with suitable domains for noninteger powers.

For a product fg, add and subtract f(x + h)g(x) in the numerator. The quotient becomes f(x + h)[g(x + h) − g(x)]/h + g(x)[f(x + h) − f(x)]/h. Taking limits gives (fg)' = fg' + gf'. Both terms are needed because both factors change. The false rule (fg)' = f'g' fails even for x × x: it would predict 1 rather than 2x.

The chain rule handles composition. If y = f(u) and u = g(x), then dy/dx = f'(g(x))g'(x) when the derivatives exist. For f(u) = u² and g(x) = 1 + x, the result is 2(1 + x). A useful intuition is “output change per intermediate change” times “intermediate change per input change.” This unit-cancellation picture is intuition; the formal justification comes from controlling the approximation errors in both local linearizations.

The exponential function e^x has derivative e^x. Its inverse ln(x), defined for x > 0, therefore has derivative 1/x: differentiating e^(ln x) = x gives e^(ln x)(ln x)' = 1. Applying the chain rule, the derivative of ln(1 + x) is 1/(1 + x), for x > −1. These identities let us compare simple and log returns by studying their local change rates.

The quotient rule follows by treating division as multiplication by an inverse. For g nonzero, (f/g)' = (f'g − fg')/g². For a discounted payment P(y) = 100/(1 + y)², the derivative is −200/(1 + y)³ on y > −1. Increasing the discount rate lowers the present value. The sign of the derivative expresses an economic relationship; its magnitude quantifies sensitivity near the chosen rate.

## 2.4 Local linearity, curvature, and optimization

Differentiability means f(x + h) = f(x) + f'(x)h + error, where error/h tends to zero as h tends to zero. The tangent line is therefore a locally accurate approximation. If a two-year zero-coupon payment of 100 is discounted at 5%, its price is 100/1.05², approximately 90.7029. Its derivative there is approximately −172.7675 per unit decimal yield. A one-basis-point increase has h = 0.0001 and a first-order price change of approximately −0.01728.

The second derivative measures how the first derivative changes. For the bond example it is 600/(1 + y)^4, which is positive. The price-yield graph bends upward. Taylor's second-order approximation adds half the second derivative times h²:

$$f(x+h)\approx f(x)+f'(x)h+\frac12f''(x)h^2.$$

When the third derivative is bounded by M between x and x + h, the magnitude of the omitted second-order Taylor remainder is at most M|h|³/6. This condition explains why the approximation improves rapidly as the step shrinks and why it may fail over large moves or near singularities.

For a differentiable function with an interior local minimum, the derivative must vanish: slopes from either side cannot consistently point downhill through the proposed minimum. A zero derivative is necessary, not sufficient. The function x³ has derivative zero at zero but no minimum there. A positive second derivative at a stationary point gives a strict local minimum under the usual smoothness conditions. Boundaries require direct examination: minimizing x on [0, 1] gives x = 0 even though the derivative is one everywhere.

Consider minimizing f(x) = (x − 3)² + 2. Its derivative is 2(x − 3), so the stationary point is x = 3. The second derivative is 2, and the square is nonnegative for every real x. Therefore 3 is the unique global minimizer, with value 2. The global argument uses the function's structure, going beyond a local derivative test. In Chapter 12, convexity will provide systematic versions of this reasoning.

## 2.5 Integrals accumulate small contributions

Suppose a cash flow arrives continuously at rate c(t) dollars per year. Over a short interval of width delta t, the amount received is approximately c(t) delta t. Add these contributions over a partition of the time interval. If the sums approach a common limit as the largest interval width shrinks, that limit is the integral of c. The integral's units are dollars because dollars/year is multiplied by years.

For c(t) = 2t on [0, 1], right-endpoint sums using n equal intervals are sum from k = 1 to n of 2(k/n)(1/n). Using the sum of the first n integers gives (n + 1)/n, which tends to one. Thus the area under 2t from zero to one is one. Finite sums approximate accumulation; the integral captures the limiting idealization.

The fundamental theorem of calculus connects differentiation and integration. If f is continuous, F(x) = integral from a to x of f(t)dt has derivative f(x). Consequently, if G' = f, the definite integral from a to b equals G(b) − G(a). For 2t, an antiderivative is t², giving 1² − 0² = 1. The theorem's continuity assumption can be weakened in more advanced analysis, but we will state the version we use rather than silently extending it.

An indefinite integral describes a family of antiderivatives, differing by constants. Integral 2t dt = t² + C because differentiation erases C. A definite integral is a number and has no arbitrary constant. Integrals can be negative when the integrand lies below zero; they represent signed accumulation, not always geometric area.

Substitution reverses the chain rule. To integrate 2x e^(x²), set u = x², so du = 2x dx, leaving integral e^u du = e^u + C. Integration by parts reverses the product rule: integral u dv = uv − integral v du. For integral t e^t dt, take u = t and dv = e^t dt to obtain t e^t − e^t + C. Choosing a technique is recognizing structure, not memorizing an isolated list.

## 2.6 Infinite horizons and probability densities

An improper integral is defined through a limit when the interval is unbounded or the integrand becomes singular. For r > 0, the integral of e^(−rt) from zero to infinity is the limit of (1 − e^(−rT))/r as T grows, which equals 1/r. If r = 0, the integrand is one and the integral diverges. If r < 0, it grows exponentially and also diverges. A perpetual continuous payment rate c therefore has present value c/r only under positive constant discounting and the assumed infinite payment stream.

A nonnegative function p(x) with integral one can represent a probability density. Probability over an interval [a, b] is the integral of p there. This is a preview of Chapter 5, not an assumption that probability is already known. For p(x) = 2x on [0, 1] and zero elsewhere, the total integral is one and the probability of the interval [0, 0.5] is 0.25. The height p(0.5) = 1 is not the probability of one exact point. Integrating over a zero-width interval gives zero.

The integral of x p(x) weights possible values by their probability density. In the preceding example it equals integral from zero to one of 2x² dx = 2/3. This is the continuous counterpart of a weighted mean. The relationship between sums and integrals will let us move from finite scenarios to continuous distributions without changing the central question: how much weight belongs to each possible value?

## 2.7 Multiple inputs: gradients and Hessians

A function can depend on several variables, such as f(x, y) = x² + xy + 2y². A partial derivative changes one input while holding the others fixed. Thus partial f/partial x = 2x + y and partial f/partial y = x + 4y. At (1, 2), these values are 4 and 9. A small change (dx, dy) changes the output approximately by 4dx + 9dy. This generalizes one-dimensional local linearity.

The gradient is the column vector of partial derivatives. Its dot product with a direction gives the directional rate of change. The Hessian is the matrix of second partial derivatives. Here it is [[2, 1], [1, 4]]. For a change vector h, the quadratic correction is one half h-transpose H h. Chapter 3 will develop matrix notation fully; at this point, expand the expression to understand it: one half times (2dx² + 2dxdy + 4dy²).

At an unconstrained interior optimum of a differentiable multivariable function, every partial derivative is zero. Solve 2x + y = 0 and x + 4y = 0. The first gives y = −2x; the second then gives −7x = 0. Thus x = y = 0. The quadratic expression is positive away from the origin because x² + xy + 2y² = (x + y/2)² + 7y²/4. This establishes a unique global minimum without relying on a matrix theorem we have not yet proved.

Constrained problems differ. Minimize x² + y² subject to x + y = 1. Substitution gives f(x, 1 − x) = 2x² − 2x + 1. Its derivative vanishes at x = 1/2, giving y = 1/2 and value 1/2. The unconstrained minimizer (0, 0) is infeasible. Optimization must respect the problem's allowable set before interpreting derivatives.

## 2.8 Ordinary differential equations

A differential equation describes a relationship involving an unknown function and its derivatives. The growth equation dV/dt = rV says the rate of change is proportional to current wealth. For V positive, divide by V and integrate: integral dV/V = integral r dt. With constant r, ln V = rt + C. Exponentiating and imposing V(0) = V0 yields V(t) = V0 e^(rt). The initial condition selects one trajectory from a family of solutions.

For a mean-reverting deterministic quantity x, dx/dt = k(theta − x) with k > 0. Let y = x − theta. Then dy/dt = −ky, so y(t) = y(0)e^(−kt), giving x(t) = theta + [x(0) − theta]e^(−kt). The distance from theta shrinks exponentially. The half-life solves e^(−kt) = 1/2, so t = ln(2)/k. Units matter: if k is per year, the half-life is in years.

Differential equations do not automatically have a unique solution. Conditions such as local continuity and a suitable Lipschitz bound in the state variable provide standard existence and uniqueness results. The equation x' = 2sqrt(|x|) with x(0) = 0 illustrates trouble: a solution can stay at zero for a while and then follow a growing branch. We will use well-behaved deterministic equations and identify additional assumptions when introducing stochastic equations.

Euler's numerical method approximates x(t + h) by x(t) + h f(t, x(t)) for x' = f(t, x). For mean reversion with k = 1, theta = 0, x0 = 1, and h = 0.1, the first update is 0.9 and the second 0.81. The exact value at t = 0.2 is e^(−0.2), approximately 0.81873. The numerical discrepancy is discretization error. Decreasing h usually improves a stable consistent approximation, but computational cost rises.

Stability can matter more than local accuracy. For x' = −kx, Euler multiplies the state by 1 − kh each step. If |1 − kh| > 1, the computed path grows in magnitude although the true solution decays. Thus h must satisfy 0 < kh < 2 for this particular method's stability. A plausible-looking update formula can fail spectacularly when its step is too large.

## 2.9 Trigonometry and frequency before spectral models

An angle in radians measures arc length divided by radius. A full circle is 2pi radians. On a unit circle, cos(theta) is the horizontal coordinate and sin(theta) the vertical coordinate of the point at angle theta. Both oscillate between −1 and 1; cosine begins at one and sine at zero. Their derivatives are −sin(theta) and cos(theta), respectively, when angles use radians.

A periodic signal A cos(omega t + phi) has amplitude A, angular frequency omega, and phase phi. If ordinary frequency is f cycles per unit time, omega = 2pi f. Sampling a daily signal imposes limits on distinguishable frequencies. Two continuous oscillations can agree at every sampled time even when their behavior between samples differs. This phenomenon, aliasing, will explain why frequency analysis must respect the observation interval.

The imaginary number i satisfies i² = −1. Complex numbers a + ib are pairs with multiplication defined by this rule. Euler's identity e^(i theta) = cos(theta) + i sin(theta) packages oscillation into exponential notation. We will only need the operational identity and the interpretation of its real and imaginary components for spectral analysis; advanced complex analysis is not a prerequisite for this curriculum.

## 2.10 Numerical integration, roots, and a worked valuation

The trapezoidal rule approximates an integral by adding trapezoid areas. On intervals of width h, use h[f(x0)/2 + f(x1) + … + f(x_(n−1)) + f(xn)/2]. For f(t) = t² on [0, 1] with two intervals, the approximation is 0.5[0/2 + 0.25 + 1/2] = 0.375, compared with the exact 1/3. Refining the partition improves this smooth example. An error bound requires assumptions about derivatives; a discontinuity can change the convergence behavior.

Root finding solves f(x) = 0. Bisection starts with a continuous function whose endpoint values have opposite signs. The intermediate value theorem ensures a root inside. Repeatedly keep the half with the sign change; after n halvings, the interval width is its original width divided by 2^n. Newton's method uses the tangent line: x_new = x − f(x)/f'(x). It can converge quickly near a simple root but can fail with a poor initial value or a near-zero derivative. A reliable calculation combines speed with a checked bracket when available.

Suppose a contract pays 10 dollars per year continuously for three years under constant continuous discount rate r = 0.04. Its present value is integral from zero to three of 10e^(−0.04t)dt = 10(1 − e^(−0.12))/0.04, approximately 28.2699 dollars. The undiscounted amount is 30 dollars, so a value below 30 is sensible. Let r approach zero: the limiting value becomes 30. This limiting check confirms that the apparent division by a small rate corresponds to a well-behaved economic quantity.

To estimate rate sensitivity, differentiate under this finite integral for the smooth integrand: dPV/dr = −integral from zero to three of 10t e^(−rt)dt. It is negative because future positive cash payments lose present value when discounting increases. Here the derivative has units dollars × years per unit rate convention. A complete risk report states whether sensitivity is per unit decimal rate, per percentage point, or per basis point.

### Why a derivative estimate can get worse with a smaller step

The forward difference [f(x + h) − f(x)]/h has truncation error of order h for a sufficiently smooth function. A centered difference [f(x + h) − f(x − h)]/(2h) cancels the leading second-order Taylor contribution and has error of order h² when the required derivatives are controlled. This improved approximation is mathematical, but both formulas subtract nearby floating-point values.

If each function evaluation has a small absolute rounding error of scale epsilon, division by h can amplify that error to scale epsilon/h. Shrinking h reduces truncation error while increasing the rounding contribution. The total error can therefore have a U-shaped pattern. Choosing the smallest representable step is usually a poor numerical differentiation strategy.

For f(x) = x² at x = 1, the exact derivative is two. Calculate forward differences for h = 0.1, 0.01, and 0.001: they are 2.1, 2.01, and 2.001 in exact arithmetic. Continue toward extremely small h in a program and watch finite precision intervene. This experiment connects the limiting definition, Taylor approximation, and numerical implementation without confusing them.

A useful numerical report separates the analytic formula, the approximation rule, the chosen step, and the observed discrepancy. This makes a failed check diagnosable rather than merely surprising.

## 2.11 Practice, experiments, and further study

The growth laboratory corresponds to the ODE and compounding sections. Its finite outputs should agree with V0e^(rt) when continuous compounding is selected. In the Python examples, finite-difference derivatives are compared against known analytic derivatives. The purpose is to inspect convergence and cancellation, not to infer a theorem from a plot.

Suggested practice: derive the derivative of ln(x² + 1); evaluate integral from zero to two of 3t² dt; minimize (x − 2)² on [0, 1]; compute one Euler step for mean reversion toward 5 from initial state 1; explain why the optimum on [0, 1] need not satisfy f' = 0. For hints, apply the chain rule, use an antiderivative t³, inspect the feasible boundary, and substitute the current state into the ODE. Save full solutions until after making a serious attempt.

For a full university treatment, use [MIT 18.01SC Single Variable Calculus](https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/) and [MIT 18.02SC Multivariable Calculus](https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/). These are added foundations. Their exercises supply repetition beyond the original finance roadmap. Work derivative and integral problems until the operations have meaning, then revisit the bond and cash-flow examples. The next chapter develops vectors and matrices, turning several related equations into one coherent system.
