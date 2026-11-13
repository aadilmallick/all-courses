# 5. Calculus from first principles: limits and local models

This chapter contains outline lessons 17–20. Its central problem is estimating the effect of a small input change. We need no prior calculus. Algebra and functions are enough to begin; the definitions will tell us precisely what “small,” “near,” and “approximately linear” mean.

<a id="lesson-17"></a>
## Session 17 — Sequences, limits, continuity, and convergence

### Approaching a value without reaching it

The sequence $a_n=1/n$ begins $1,1/2,1/3,\ldots$. Its terms never equal zero, yet they eventually become smaller than any positive tolerance. We define $a_n\to L$ if, for every $\varepsilon>0$, there is an integer $N$ such that $n\ge N$ implies $|a_n-L|<\varepsilon$.

Quantifier order is crucial. The threshold $N$ may depend on the requested tolerance, but it must work for all later terms. For $a_n=1/n$, choose $N>1/\varepsilon$. Then every $n\ge N$ gives $0<1/n\le1/N<\varepsilon$. This is a complete proof of convergence, not just a picture of shrinking numbers.

A convergent sequence need not decrease: $(-1)^n/n$ oscillates but still tends to zero because its absolute value is $1/n$. A bounded sequence need not converge: $(-1)^n$ keeps alternating between two values. Convergence concerns eventual closeness to one number, rather than monotonicity or boundedness alone.

Limits are unique. Suppose a sequence converged to distinct $L$ and $M$. Choose $\varepsilon=|L-M|/3$. Far enough along, both $|a_n-L|$ and $|a_n-M|$ would be smaller than $\varepsilon$. The triangle inequality would give $|L-M|<2|L-M|/3$, an impossibility. This proof illustrates how the ability to request an arbitrarily small tolerance produces a definite conclusion.

Function limits replace “large index” with “nearby input.” We write $f(x)\to L$ as $x\to a$ if every positive output tolerance can be guaranteed by a sufficiently small positive input tolerance, for inputs in the domain with $0<|x-a|<\delta$. The exclusion of $x=a$ means a limit can exist even if the function is undefined there.

For example,

$$
\frac{x^2-1}{x-1}=x+1\quad\text{when }x\ne1,
$$

so its limit as $x\to1$ is two. Cancelling the factor is legal at the nearby nonzero denominators, not at the missing point itself. Defining the function to equal two at the point would make it continuous there.

Continuity at $a$ means $f$ is defined at $a$ and $\lim_{x\to a}f(x)=f(a)$. It says small input changes give small output changes at that point. A step function that is zero for negative inputs and one for nonnegative inputs is not continuous at zero: no matter how close the negative input, its output remains a whole unit away from the value at zero.

Sums and products of finite limits have the expected limits. For products, write $a_nb_n-LM=(a_n-L)b_n+L(b_n-M)$. A convergent sequence $b_n$ is eventually bounded, so both terms can be made small. This decomposition explains why the rule works instead of treating it as symbolic substitution. Quotients require a nonzero denominator limit; that hypothesis prevents division from magnifying arbitrarily small denominator values without control.

Two important existence facts will be used later. A continuous real function on a closed bounded interval attains a minimum and maximum. A continuous function taking values on opposite sides of a level must attain that level somewhere between them. These are the extreme value and intermediate value theorems. We state them here; their full proofs rely on completeness of the real numbers. An open interval can fail the first theorem: $f(x)=x$ on $(0,1)$ has no attained minimum.

<a id="lesson-18"></a>
## Session 18 — Derivatives as local linear approximations

### A slope for a curve

For $f(x)=x^2$, an input change $h$ produces

$$
f(x+h)-f(x)=(x+h)^2-x^2=2xh+h^2.
$$

Divide by $h\ne0$ to obtain the average rate $2x+h$. As $h\to0$, that rate tends to $2x$. The derivative is defined by

$$
f'(x)=\lim_{h\to0}\frac{f(x+h)-f(x)}h
$$

when the finite two-sided limit exists. At $x=3$, the derivative is six. For $h=0.01$, the predicted change from the derivative is $6(0.01)=0.06$, while the exact change is $0.0601$. The discrepancy is the second-order term $h^2$.

An equivalent definition expresses the key local model:

$$
f(x+h)=f(x)+f'(x)h+r(h),\qquad \frac{r(h)}{|h|}\to0.
$$

The remainder is negligible relative to the size of the input change. The notation $r(h)=o(|h|)$ abbreviates that limit. This is more informative than saying the tangent “looks like” the curve. It states the scale against which approximation error vanishes.

A derivative has units of output per input. If $f$ measures minutes and $x$ kilometers, $f'$ measures minutes per kilometer. A second derivative measures minutes per squared kilometer. Unit checks remain useful even when expressions become complicated.

Differentiability implies continuity: the local expansion gives $f(x+h)-f(x)=f'(x)h+r(h)$, and both terms tend to zero. The converse fails. At zero, $|x|$ is continuous, but its difference quotient is one for positive $h$ and minus one for negative $h$, so no common derivative exists. Choosing a computational convention at this point does not make the mathematical derivative exist.

A derivative of zero is not a claim that a function is constant near the point. For $x^2$, the slope at zero is zero although the function increases away from it. It says the leading first-order change vanishes. Higher-order terms then determine behavior.

If $f$ is differentiable on an interval and continuous at its endpoints, the mean value theorem states there is some interior $c$ with

$$
f(b)-f(a)=f'(c)(b-a).
$$

A proof uses a line connecting endpoint values: subtract that line from $f$, then apply Rolle's theorem to the resulting function with equal endpoint values. Rolle's theorem follows because a nonconstant continuous function attains an interior extremum, where differentiability forces derivative zero. This argument makes explicit why continuity, a closed interval, and interior differentiability are needed.

Consequently, if $|f'|\le M$ throughout an interval, then $|f(b)-f(a)|\le M|b-a|$. A derivative bound controls finite changes. This is a bridge from an infinitesimal definition to a practically useful error guarantee.

<a id="lesson-19"></a>
## Session 19 — Product, quotient, and chain rules

### Rules are consequences of the local model

For differentiable $f,g$, add and subtract $f(x+h)g(x)$ inside a difference of products:

$$
\frac{f(x+h)g(x+h)-f(x)g(x)}h
=f(x+h)\frac{g(x+h)-g(x)}h
+g(x)\frac{f(x+h)-f(x)}h.
$$

Continuity gives $f(x+h)\to f(x)$, while the quotients tend to the respective derivatives. Therefore $(fg)'=f'g+fg'$. Both terms are necessary: two changing factors create two first-order contributions. The product of their changes is second order and disappears in the limit.

The reciprocal rule follows from

$$
\frac{1/g(x+h)-1/g(x)}h
=-\frac{g(x+h)-g(x)}{h\,g(x+h)g(x)}.
$$

If $g(x)\ne0$ and $g$ is differentiable, nearby denominators stay away from zero. Taking limits gives $(1/g)'=-g'/g^2$. Combining with the product rule yields $(f/g)'=(f'g-fg')/g^2$. The denominator restriction is part of the theorem, not a detail to add after manipulating an invalid expression.

For composition, let $u=g(x)$ and $\Delta u=g(x+h)-g(x)$. Local expansions give $\Delta u=g'(x)h+o(|h|)$ and

$$
f(u+\Delta u)=f(u)+f'(u)\Delta u+o(|\Delta u|).
$$

Differentiability of $g$ ensures $\Delta u=O(|h|)$, meaning its magnitude is bounded by a constant times $|h|$ nearby. Hence the final remainder is also $o(|h|)$. Substitution proves

$$
(f\circ g)'(x)=f'(g(x))g'(x).
$$

This proof handles even cases where $\Delta u=0$ for some nearby changes, avoiding an unjustified division by the intermediate change. The chain rule says sensitivities multiply along composition.

For $F(x)=(3x+1)^2$, the outer square has derivative $2u$ and the inner map derivative three. Thus $F'(x)=6(3x+1)$. At $x=2$, this is forty-two. Expanding $9x^2+6x+1$ gives derivative $18x+6$, the same result. Agreement between two derivations is a useful check.

By induction using the product rule, $(x^n)'=nx^{n-1}$ for positive integers $n$. Negative integers use reciprocals. General real powers on $x>0$ can be written $x^a=e^{a\ln x}$ and differentiated by the chain rule once exponential and logarithmic derivatives are established.

One rigorous construction of the natural logarithm is $\ln x=\int_1^x dt/t$, for $x>0$. Chapter 6 proves the fundamental theorem that gives derivative $1/x$. Its inverse $e^x$ then has derivative $e^x$ by differentiating $\ln(e^x)=x$. Here we state those derivatives with that construction in view rather than pretending that familiar identities alone prove them.

Standard trigonometric derivatives use radians: $(\sin x)'=\cos x$ and $(\cos x)'=-\sin x$. Their proofs use angle addition and the limit $\sin h/h\to1$. If angles were entered in degrees, a conversion factor $\pi/180$ would appear. The choice of angular unit affects derivatives even though the geometric rotations are the same.

For an example combining these ideas, let $q(x)=\exp(-(x-\mu)^2/(2s^2))$ with fixed $s>0$. The exponent's derivative is $-(x-\mu)/s^2$, so

$$
q'(x)=-\frac{x-\mu}{s^2}q(x).
$$

The sign indicates increasing density-shaped values left of the center and decreasing values right of it. We have not yet interpreted $q$ as a normalized density; that will require an integral and a constant factor.

<a id="lesson-20"></a>
## Session 20 — Higher derivatives, Taylor approximations, and error terms

### A second local layer describes curvature

The second derivative is the derivative of the first. For $f(x)=x^3$, $f'=3x^2$ and $f''=6x$. At positive inputs, slopes increase; at negative inputs, slopes decrease. Curvature is local, and a changing sign of the second derivative can indicate an inflection rather than an optimum.

Taylor's theorem states that if $f$ has continuous derivatives through order $k+1$ on the interval between $a$ and $a+h$, then

$$
f(a+h)=\sum_{j=0}^k\frac{f^{(j)}(a)}{j!}h^j
+\frac{f^{(k+1)}(\xi)}{(k+1)!}h^{k+1}
$$

for some $\xi$ between the endpoints. The expression $j!$ is the product of positive integers through $j$, with $0!=1$. The polynomial matches value and successive derivatives at $a$. The remainder quantifies the effect of everything omitted.

For $f(x)=e^x$ around zero, the second-order approximation is $1+x+x^2/2$. On $|x|\le0.1$, the third derivative is at most $e^{0.1}$, so the absolute remainder is at most $e^{0.1}(0.1)^3/6\approx0.0001842$. At $x=0.1$, the polynomial gives $1.105$ while $e^{0.1}\approx1.1051702$, consistent with the bound. A bound is often larger than the actual error; it is a guarantee across the stated interval.

Taylor's theorem is finite-order and local. It does not automatically assert a function equals its infinite Taylor series on every input. The remainder must tend to zero as the order increases for that conclusion. Smooth functions can even have every derivative zero at a point without being zero nearby. Infinite-series representations require more than differentiability of all orders.

A useful proof idea for the first-order remainder comes from integration: $f(a+h)-f(a)=\int_0^h f'(a+t)dt$. Subtract $f'(a)h$ and integrate the change in slope. If $|f''|\le M$, then $|f'(a+t)-f'(a)|\le M|t|$, yielding remainder at most $Mh^2/2$. The full theorem follows by repeating this accumulation argument. Chapter 6 develops the integral identity, so this is a preview of a proof mechanism rather than a dependency required to use the stated theorem now.

### Read little-o and big-O as different promises

The notation for approximation error is compact enough to look interchangeable, but its meanings differ. Saying a remainder is big-O of a scale means its magnitude is eventually bounded by a fixed constant times that scale. Saying it is little-o means the ratio to that scale tends to zero. Every little-o remainder is also big-O at that scale, but the reverse implication fails.

For example, three times h is big-O of the absolute value of h, yet it is not little-o of that value, because the ratio of magnitudes is always three. The square of h is little-o of the absolute value of h because their ratio is the absolute value of h, which tends to zero. This is why a quadratic remainder is harmless in a first-order derivative model while another nonzero linear contribution would change the derivative.

These statements describe a limiting neighborhood. They do not provide a numerical error guarantee at an arbitrary finite step unless a constant and interval have been established. A statement that error is quadratic does not tell you whether a step of one-tenth gives an error of one-hundredth or one million times one-hundredth. A derivative bound or explicit remainder supplies the missing constant.

This distinction matters when reading convergence rates. An algorithm with a stated asymptotic order may still be slower at practical sizes if its constants or startup costs are large. Likewise a higher-order approximation can be poor outside the region in which its error estimate is controlled. Always identify which variable tends to what limit and which other quantities are held fixed.

### A proof of the derivative of a reciprocal, with domains visible

Take the concrete function one divided by x at a nonzero input a. The difference quotient subtracts one over a from one over a plus h, then divides by h. Combining the two fractions produces a numerator minus h and denominator a times a plus h. Cancelling the nonzero h leaves minus one divided by that denominator. As h tends to zero, the denominator tends to the nonzero number a squared, giving derivative minus one over a squared.

Two exclusions were necessary. The original input a cannot be zero, and nearby h values cannot make a plus h zero. The second exclusion is automatically satisfied in a sufficiently small neighborhood of a nonzero a. At a zero, there is no function value from which to form the derivative. A formula that tends to infinity near zero does not extend differentiability to the missing point.

For the square-root function at a positive a, rationalizing the difference quotient gives one divided by the sum of the two square roots. The limit is one divided by twice the square root of a. At zero the right-hand quotient is one over the square root of h, which grows without bound. There is no finite derivative there. The graph is continuous at the endpoint, but the behavior of its rate is different.

These elementary examples show why algebraic manipulations should preserve their domains. Cancelling a factor can simplify a limit on nearby points, but it does not retroactively define the original expression at an excluded point. In optimization, evaluating a derivative formula outside the original function's domain is an especially easy way to obtain plausible but meaningless updates.

### What a tangent approximation predicts, and what it does not

Suppose a loss at the current parameter has derivative minus two. A small positive parameter step has predicted change minus two times that step, so the loss should initially decrease. The derivative alone does not tell us how far that decrease continues. If the second derivative is large and positive, curvature can reverse the improvement quickly.

A quadratic example makes this exact. For a function equal to ten times the square of x minus two times x, the derivative at zero is minus two. A step of one-hundredth gives a negative change, while a step of one gives a large positive change. Both moves follow the same initial descent direction. Their different outcomes come from the finite size of the second-order contribution.

This is the mathematical reason learning rate cannot be selected from gradient sign alone. The gradient supplies a local direction; smoothness or an actual function evaluation helps choose a safe distance. Chapter 8 turns that reasoning into a bound on step size. Understanding the local approximation first prevents the optimization rule from appearing as an unexplained recipe.

### Numerical differentiation is an approximation with competing errors

A forward difference approximates $f'(x)$ by $[f(x+h)-f(x)]/h$. Taylor expansion gives truncation error about $f''(x)h/2$, so decreasing $h$ initially helps. But a computer rounds each function evaluation. Subtracting almost equal values can leave an error comparable to rounding precision divided by $h$. Making $h$ too small magnifies this error.

A central difference uses

$$
D_hf(x)=\frac{f(x+h)-f(x-h)}{2h}.
$$

Taylor expansion cancels the even-order terms and gives $D_hf(x)=f'(x)+f'''(x)h^2/6+O(h^4)$ with sufficient smoothness. Its leading truncation error is quadratic rather than linear. Still, rounding eventually dominates. There is no universal smallest safe step independent of function scale, input magnitude, and arithmetic precision.

For $f(x)=x^2$ at $x=3$, exact arithmetic gives the central difference exactly six for every nonzero $h$, since the quadratic terms cancel. Real floating point arithmetic may not. To see truncation as well, test $\sin x$, whose higher derivatives do not vanish.

```python
from math import sin, cos

x = 1.0
for h in [1e-1, 1e-3, 1e-5, 1e-7, 1e-9]:
    estimate = (sin(x + h) - sin(x - h)) / (2 * h)
    print(h, estimate, abs(estimate - cos(x)))
```

The estimates should approach $\cos1\approx0.5403023059$ before rounding begins to interfere. Exact final digits depend on the runtime. The point of this experiment is the error pattern, not a promised monotone sequence of improvements. The standard-library `sin` and `cos` functions take radians.

The companion's tangent experiment exposes the point $x$ and step $h$ for the quadratic function. It shows the true derivative, finite-difference estimate, and local tangent. Moving the point changes the derivative; reducing $h$ improves the secant's local interpretation. A separate Taylor display compares a quadratic approximation of the exponential with the exact function over a chosen interval.

### What calculus gives a learner of ML

A derivative is a coefficient of a first-order approximation. Rules let us propagate that coefficient through arithmetic and composition. Higher derivatives describe how the coefficient itself changes. Remainder bounds tell us when the approximation is reliable. These are the ingredients behind parameter updates, backpropagation, and curvature-based optimization.

As an optional application, approximate the change of $\ln x$ near $x=1$ by $h-h^2/2$. For $h=0.1$, this gives $0.095$ versus $\ln1.1\approx0.0953102$. The third derivative is $2/x^3$ and is at most two on $[1,1.1]$, so the second-order remainder is at most $2(0.1)^3/6\approx0.0003333$. Every part of that error statement names a function, interval, order, and derivative bound.

Keep three distinctions clear as we continue: a finite difference is an approximation to a derivative; a derivative is an exact local property if its limit exists; and a Taylor polynomial is an approximation to the function over a stated neighborhood. The next chapter reverses the perspective, accumulating tiny changes into totals. That will connect calculus to areas, probability densities, and expectations.

[Previous chapter](04-matrix-structure-and-pca.md) · [Curriculum](../CURRICULUM.md) · [Next chapter](06-integration-and-change-of-variables.md)
