# 6. Integration: accumulated change and transformed quantities

This chapter contains outline lessons 21–24. You need limits, derivatives, continuity, and basic geometry. The central question is how a continuously varying quantity produces a total: distance from velocity, probability from density, or an expectation from weighted values.

<a id="lesson-21"></a>
## Session 21 — Integrals as accumulated quantities

### Add many small contributions

If a vehicle travels at two kilometers per minute for three minutes, its displacement is six kilometers. If velocity changes with time, multiplying one representative velocity by the whole duration can be inaccurate. Split the duration into intervals, multiply a sample velocity in each by its interval width, and add those small displacements.

For a function $f$ on $[a,b]$, choose a partition $a=t_0<t_1<\cdots<t_n=b$ and sample points $\xi_i\in[t_{i-1},t_i]$. A Riemann sum is

$$
\sum_{i=1}^n f(\xi_i)(t_i-t_{i-1}).
$$

If these sums approach the same number as the maximum interval width tends to zero, independently of sample choices, that number is the definite integral $\int_a^b f(t)dt$. Continuous functions on closed bounded intervals have this property. The symbol $dt$ identifies the integration variable and recalls the small widths being accumulated; it is not an ordinary standalone real number.

For $f(t)=t$ on $[0,1]$, right-endpoint equal-width sums give

$$
\frac1n\sum_{i=1}^n\frac in
=\frac{n(n+1)}{2n^2}=\frac12+\frac1{2n}\to\frac12.
$$

The limit matches the area of a triangle of base and height one. This calculation derives an integral from finite sums. For $f(t)=t^2$, using the finite identity $\sum_{i=1}^n i^2=n(n+1)(2n+1)/6$ gives an analogous limit $1/3$. That sum identity can be proved by induction in the same manner as Chapter 1's arithmetic sum.

Integrals are signed accumulations. A negative velocity gives negative displacement. The area between a curve and the axis, counting every piece positively, is $\int_a^b|f(t)|dt$, which differs from the signed integral if the curve crosses zero. Likewise, $\int_{-1}^1 t\,dt=0$ does not mean no values were present; negative and positive contributions cancel.

Linearity follows from linearity of the finite sums and passage to limits:

$$
\int_a^b(\alpha f+\beta g)=\alpha\int_a^bf+\beta\int_a^bg.
$$

Splitting an interval gives $\int_a^c f+\int_c^b f=\int_a^b f$. Reversing the bounds changes the sign. If $f\le g$ pointwise and both are integrable, their sums and therefore integrals preserve that order. These properties are tools for proving bounds even when no closed form is available.

A unit check clarifies meaning. Integrating a density of probability per minute over minutes gives probability. Integrating dollars per unit over units gives dollars. Integrating a dimensionless function over a time interval gives a quantity with time units. “Area” is a picture of multiplication and accumulation; physical interpretation depends on the axes.

<a id="lesson-22"></a>
## Session 22 — The fundamental theorem of calculus

### Differentiation and accumulation undo one another

Let $f$ be continuous on an interval and define an accumulation function

$$
F(x)=\int_a^x f(t)dt.
$$

Increasing the upper limit by $h$ adds only the small strip from $x$ to $x+h$. Thus

$$
\frac{F(x+h)-F(x)}h=\frac1h\int_x^{x+h}f(t)dt.
$$

Subtract $f(x)$ and bound the difference by the largest value of $|f(t)-f(x)|$ over that tiny interval. Continuity makes that bound tend to zero. Therefore $F'(x)=f(x)$ at every interior point. This is the first part of the fundamental theorem, with continuity supplying the key hypothesis.

For the second part, suppose $G'=f$ and $f$ is continuous. Since $F'=G'$, the function $F-G$ has derivative zero throughout the interval. The mean value theorem implies it is constant. Evaluating at $a$ gives

$$
\int_a^b f(t)dt=G(b)-G(a).
$$

An antiderivative $G$ is therefore a way to calculate an accumulated total from endpoint values. The notation $\int f(x)dx=G(x)+C$ describes a family of antiderivatives; a definite integral is one number after bounds are specified. Confusing those two uses of the integral sign can hide constants or omit endpoint evaluation.

For $f(t)=t^2$, an antiderivative is $t^3/3$ because differentiation gives $t^2$. Hence $\int_0^1t^2dt=1/3$. For $f(t)=e^{-t}$ over $[0,2]$, an antiderivative is $-e^{-t}$, giving $1-e^{-2}\approx0.864665$. Differentiating a proposed antiderivative is an inexpensive correctness check.

The natural logarithm can now be defined by $\ln x=\int_1^xdt/t$ for $x>0$. The theorem gives derivative $1/x$. Applying substitution to this integral establishes $\ln(ab)=\ln a+\ln b$, providing a consistent construction of the logarithm used earlier. The inverse exponential then satisfies derivative equal to itself.

The theorem also gives an integral form of Taylor's first-order remainder. Write

$$
f(a+h)-f(a)-f'(a)h
=\int_0^h[f'(a+t)-f'(a)]dt.
$$

If the derivative is Lipschitz with constant $M$, meaning $|f'(s)-f'(t)|\le M|s-t|$, the absolute remainder is bounded by $Mh^2/2$. A bound on second derivative magnitude is sufficient for that Lipschitz property. This relationship will become the descent lemma for optimization.

<a id="lesson-23"></a>
## Session 23 — Substitution and integration by parts

### Transform an integral by explaining what changes

Substitution is the chain rule in reverse. If $u=g(x)$ is continuously differentiable and $H'=f$, then the derivative of $H(g(x))$ is $f(g(x))g'(x)$. The fundamental theorem gives

$$
\int_a^b f(g(x))g'(x)dx
=\int_{g(a)}^{g(b)}f(u)du.
$$

The derivative factor and transformed limits are essential. For example,

$$
\int_0^1 2x\,e^{x^2}dx
=\int_0^1e^u du=e-1.
$$

The substitution $u=x^2$ sends endpoints zero and one to zero and one, and $du=2x\,dx$ is shorthand for the derivative factor in the theorem. Replacing $x^2$ by $u$ while forgetting that factor changes the integral.

A scale change illustrates units. Set $u=(x-\mu)/s$ with $s>0$, so $dx=s\,du$. Integrating a function of standardized distance requires multiplying by the original scale. This is exactly the factor that later appears in a normal probability density. A narrower distribution must grow taller to preserve total probability.

Integration by parts reverses the product rule. Integrate $(uv)'=u'v+uv'$ and rearrange:

$$
\int_a^b u(x)v'(x)dx
=[u(x)v(x)]_a^b-\int_a^b u'(x)v(x)dx.
$$

Choose $u=x$ and $v'=e^x$, so $u'=1,v=e^x$. Then

$$
\int_0^1xe^x dx=[xe^x]_0^1-\int_0^1e^xdx
=e-(e-1)=1.
$$

The boundary term carries real information and cannot be discarded by habit. On an unbounded interval it may vanish under decay assumptions, but that must be checked rather than presumed.

As another example, $\int_1^2\ln x\,dx$ becomes $[x\ln x-x]_1^2=2\ln2-1$. Here choosing $u=\ln x$ simplifies its derivative to $1/x$, while integrating the other factor one gives $x$. Integration techniques work by changing the problem into a simpler one; not every product benefits from every choice.

Some integrals have no elementary antiderivative. The function $e^{-x^2}$ is a central example. This does not mean its definite integral is undefined or impossible to estimate. A special function, numerical quadrature, or a geometric argument may be the appropriate tool. A symbolic formula in elementary functions is only one form of mathematical understanding.

<a id="lesson-24"></a>
## Session 24 — Improper integrals, multiple integrals, and changes of variables

### Infinity and singularities require explicit limits

An integral over an unbounded interval is defined by a limit, such as

$$
\int_0^\infty e^{-x}dx
=\lim_{b\to\infty}(1-e^{-b})=1.
$$

For $p>0$, the integral $\int_1^\infty x^{-p}dx$ converges exactly when $p>1$. If $p\ne1$, endpoint evaluation gives $(b^{1-p}-1)/(1-p)$. This tends to $1/(p-1)$ for $p>1$ and diverges for $p<1$. At $p=1$, the antiderivative is $\ln b$, which diverges. A curve can tend to zero while its total area remains infinite.

An interior singularity must also be handled by separate one-sided limits. The ordinary improper integral of $1/x$ from minus one to one does not exist because both side integrals diverge. Symmetric cancellation gives a Cauchy principal value of zero, which is a different definition. Do not substitute a principal value for a probability expectation without stating and justifying the change.

A nonnegative density needs total integral one. If a proposed density is proportional to $e^{-x}$ for $x\ge0$, no additional scale is required. If it is proportional to $e^{-2x}$, its integral is one-half, so multiply by two. Normalization turns a relative weighting into a probability model.

### Integrate over a region, one coordinate at a time

For a function on a rectangle, a double integral accumulates contributions over small area elements $dx\,dy$. Under suitable integrability conditions, iterated integrals compute the same result. For a nonnegative measurable function, Tonelli's theorem permits interchange, including infinite values. For an absolutely integrable function, Fubini's theorem permits interchange with a finite integral. These are stated theorems; full measure-theoretic proofs are beyond this finite-dimensional refresher.

For the triangular region $0\le x\le1$, $0\le y\le x$, its area is

$$
\int_0^1\int_0^x1\,dy\,dx
=\int_0^1x\,dx=\frac12.
$$

Reversing order requires redrawing the region: $0\le y\le1$ and $y\le x\le1$. Then $\int_0^1\int_y^1dx\,dy=\int_0^1(1-y)dy=1/2$. Merely swapping differential symbols while preserving the original variable limits would describe a different or invalid region.

For a joint density on a triangle, normalization proceeds the same way. A constant density two on this triangle integrates to one. The marginal density of $X$ is $\int_0^x2dy=2x$ for $0\le x\le1$. Longer vertical slices contain more probability even though the joint density is constant on its support.

### Why a Jacobian determinant appears

In one dimension, stretching an interval by a factor $s$ multiplies its length by $|s|$. In two dimensions, a linear map multiplies tiny areas by the absolute value of its determinant. For a differentiable invertible coordinate transformation $x=T(u)$, the derivative matrix $J_T$ gives the local linear map. Subject to the usual smoothness, one-to-one, and nonzero-determinant conditions,

$$
\int_{T(D)}f(x)dx
=\int_D f(T(u))\,|\det J_T(u)|du.
$$

Chapter 7 develops the derivative matrix in detail. Here its role is area or volume conversion. The absolute value removes orientation signs because geometric area and probability are nonnegative. The theorem needs care if a parameterization covers the same region multiple times; naively integrating the whole parameter domain would overcount.

For polar coordinates $x=r\cos\theta,y=r\sin\theta$, the derivative matrix is

$$
J=\begin{pmatrix}\cos\theta&-r\sin\theta\\
\sin\theta&r\cos\theta\end{pmatrix},\qquad \det J=r.
$$

Thus $dx\,dy=r\,dr\,d\theta$. A thin ring has circumference approximately $2\pi r$, which gives the same area intuition. Integrating one over a radius-$R$ disk produces $\int_0^{2\pi}\int_0^R r\,dr\,d\theta=\pi R^2$.

To normalize the Gaussian, let $I=\int_{-\infty}^\infty e^{-x^2/2}dx$. The positive integrand allows a double-integral calculation:

$$
I^2=\int_{\mathbb R^2}e^{-(x^2+y^2)/2}dxdy
=\int_0^{2\pi}\int_0^\infty e^{-r^2/2}r\,dr\,d\theta=2\pi.
$$

Substitute $u=r^2/2$ in the radial integral to get one. Since $I>0$, $I=\sqrt{2\pi}$. Therefore $e^{-x^2/2}/\sqrt{2\pi}$ integrates to one. Shifting by $\mu$ and scaling by $s>0$ gives the density $e^{-(x-\mu)^2/(2s^2)}/(s\sqrt{2\pi})$. We have explained its often-mysterious constant through geometry and accumulation.

### A complete change-of-variables probability calculation

Suppose a nonnegative waiting time has exponential density with rate two per minute. We want the distribution of the same wait measured in seconds. A time of s seconds corresponds to s divided by sixty minutes. Probability in a small seconds interval must equal probability in its matching minutes interval, whose width is one-sixtieth as large numerically.

Substituting the converted time into the original density is only half the calculation. We also multiply by one-sixtieth for the interval-width conversion. The resulting density is one-thirtieth times the exponential of minus s divided by thirty, for nonnegative seconds. Its mean is thirty seconds, consistent with the original mean of one-half minute. Omitting the width factor would make its total probability sixty rather than one.

This unit-conversion example is the simplest Jacobian calculation. It establishes why a density is not an intrinsic height independent of coordinates. Probability attached to a region is invariant, while the numeric density changes when the coordinate scale changes. The multivariate determinant factor performs exactly that conversion for volumes.

For a nonlinear example, start from a uniform variable on zero to one and square it. Values near zero are compressed: an interval of outputs near zero corresponds to a relatively wider interval of original inputs. Therefore the output density rises near zero. The inverse derivative quantifies that compression. The density can be unbounded there while each sufficiently small interval still carries a probability below one.

### Probability density, cumulative probability, and expectation

Use a density that equals twice x between zero and one. At x equal to one-half, the density equals one. This does not assign probability one to that point. The cumulative probability to one-half is one-quarter, because the integral accumulates the whole triangular region below the density curve.

Now compute a mean by weighting each x by its density before integrating. This changes the integrand to twice x squared, yielding two-thirds. The mean exceeds one-half because larger values receive more density weight. It need not coincide with the point at which half the probability has accumulated. That median solves the cumulative probability equation x squared equals one-half, giving approximately 0.7071.

The mean, median, and mode answer different questions. The mean minimizes expected squared error; a median minimizes expected absolute error; a density mode identifies a highest-density location relative to the chosen coordinate. In this example the density rises toward the endpoint, so its mode is one. Distinct answers are not contradictory because the optimization criteria differ.

Expected squared deviation from the mean gives variance. The second moment is the integral of twice x cubed, equal to one-half. Subtracting the square of two-thirds gives one-eighteenth. Its square root is about 0.2357. This calculation previews how a few integrals provide interpretable summaries of an entire distribution, while still leaving details that those summaries cannot capture.

### Infinite limits must be checked one side at a time

A normalizing constant can exist even when a moment does not. Consider a density proportional to one divided by x squared on x at least one. Its total integral is one, so it is a valid density. Multiplying by x to calculate the mean creates an integrand one over x, whose integral diverges. The model describes finite-valued outcomes but has an infinite expected value.

This is not an arithmetic contradiction. Every observation is finite with probability one, yet rare sufficiently large outcomes dominate the expectation. A finite simulation may look stable for a long time before one large draw changes its average dramatically. The law of large numbers with a finite-mean hypothesis cannot be invoked without checking that hypothesis.

In a two-sided heavy-tailed distribution, positive and negative contributions can each diverge. A symmetric plot does not make their ordinary expectation zero by cancellation. Ordinary expectation requires an appropriate integrability condition; a symmetric principal value uses a different limiting operation. This matters in both statistical theory and numerical integration routines that may sample a symmetric finite interval and produce a misleadingly tidy number.

### A practical quadrature refinement check

For a smooth integrand, compute a trapezoidal approximation on n intervals, then on twice as many intervals. If the leading error is proportional to the square of interval width, halving the width reduces that leading error by about four. The difference between the two approximations can therefore suggest the size of the remaining discretization error.

This diagnostic depends on being in the expected smooth regime. A jump, endpoint singularity, narrow peak, or insufficient initial resolution can break the pattern. Merely agreeing at two coarse grids is not proof of accuracy if both grids miss the same small region. Adaptive methods inspect local error indicators and allocate more evaluations where the function is difficult.

In probability calculations, also check structural invariants. An integrated density should give a nondecreasing cumulative probability between zero and one. The total over its full support should be close to one under the chosen truncation and numerical tolerance. These checks do not prove every value is accurate, but they can expose a missing normalization factor or incorrect transformed bound immediately.

### Numerical integration and an executable check

The trapezoidal rule connects adjacent sampled values by straight segments and sums their areas. A single segment of width $h$ contributes $h[f(a)+f(a+h)]/2$. Composite rules approximate the integral even when no elementary antiderivative exists. A finite grid is an approximation, so refinement or an error estimate is needed.

```python
from math import exp

n = 1000
step = 1.0 / n
total = 0.5 * (exp(0.0) + exp(1.0))
for i in range(1, n):
    total += exp(i * step)
approximation = step * total
exact = exp(1.0) - 1.0
print(approximation)
print(abs(approximation - exact))
```

The first output is close to `1.71828197`; error is about $1.4\times10^{-7}$. Endpoint values get half weight because they belong to only one trapezoid, while interior values belong to two. With a twice continuously differentiable function and a uniform grid, a standard absolute error bound is $(b-a)h^2\max|f''|/12$. For this example it is at most $e/(12n^2)$, consistent with the observed error.

The integration companion displays left rectangles and trapezoids for a selectable grid resolution. Their totals are computed from sampled function values, and the exact result for the example is shown separately. Increasing resolution lets you inspect convergence rather than treating a single approximation as an exact area.

An optional probability application uses density $f(x)=2x$ on $[0,1]$. Its total integral is one. The probability between zero and one-half is $\int_0^{1/2}2x\,dx=1/4$, not one-half. Its average value of $x$ under that weighting is $\int_0^1x(2x)dx=2/3$. These two calculations preview cumulative distributions and expectation.

We can now accumulate local values, reverse derivatives, transform coordinates, and identify when an unbounded integral exists. The next chapter combines local approximation with many inputs and outputs. A derivative will become a linear transformation, and its matrix will explain gradients and neural-network backpropagation.

[Previous chapter](05-calculus-from-first-principles.md) · [Curriculum](../CURRICULUM.md) · [Next chapter](07-multivariable-calculus-and-backpropagation.md)
