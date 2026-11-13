# 12. Sums, products, and growth rates

An algorithm repeats work, a payment model combines contributions at different times, and a stack of blocks accumulates tiny overhangs. All lead to sums. Sometimes an exact expression is available; sometimes a bound is more informative. Source Chapter 14 develops geometric and power sums, integral estimates, harmonic numbers, products, double sums, and asymptotic notation.

## Geometric sums by perturbation

Let $S=1+r+r^2+\cdots+r^{n-1}$. Multiply by $r$ to shift every exponent, then subtract:

$$rS=r+r^2+\cdots+r^n,\qquad S-rS=1-r^n.$$

For $r\ne1$, $S=(1-r^n)/(1-r)$. For $r=1$, every term equals one, so $S=n$. The exceptional case cannot be obtained by dividing by zero. This perturbation method creates a second version of the sum whose difference cancels nearly everything.

At $r=2,n=5$, the formula gives $(1-32)/(1-2)=31$, matching $1+2+4+8+16$. At $r=1/2,n=4$, it gives $(1-1/16)/(1/2)=15/8$. If $|r|<1$, then $r^n\to0$, so the infinite sum is $1/(1-r)$. If $|r|\ge1$, that convergence argument fails; the terms themselves generally do not even approach zero.

Index bounds matter. The sum $\sum_{i=0}^n r^i$ has $n+1$ terms and equals $(1-r^{n+1})/(1-r)$. The sum $\sum_{i=1}^n r^i$ subtracts the constant term from that expression. Writing the first and last few terms before applying a formula prevents off-by-one errors.

## A mathematical annuity model

Suppose a model deposits a fixed amount $a$ at the end of each of $n$ periods and multiplies a balance by $1+i$ each period. At the end of the final period, the oldest deposit has grown for $n-1$ periods and the newest for zero. Thus

$$V=a\sum_{j=0}^{n-1}(1+i)^j
=a\frac{(1+i)^n-1}{i},\qquad i\ne0.$$

For $a=100,i=0.1,n=3$, the contributions are $121,110,100$, total $331$. Depositing at the beginning instead multiplies the result by $1+i$. If $i=0$, the total is $an$. This is an algebra exercise with an explicitly assumed constant rate and timing, not a forecast or recommendation about an actual investment.

Present value reverses growth: a payment $a$ arriving in period $k$ is discounted by $(1+i)^k$ in this model. Again a geometric sum appears. The key teaching point is to draw the timeline first. Identical-looking formulas can differ by one power because they value payments at different moments.

## Weighted geometric sums

To evaluate $T=\sum_{k=1}^n kr^k$, multiply by $r$ and subtract. Coefficients cancel into an ordinary geometric sum:

$$T-rT=r+r^2+\cdots+r^n-nr^{n+1}.$$

Substituting the geometric formula and simplifying gives

$$T=\frac{r-(n+1)r^{n+1}+nr^{n+2}}{(1-r)^2},\qquad r\ne1.$$

For an infinite sum with $|r|<1$, the terms involving $nr^n$ vanish, yielding $\sum_{k\ge1}kr^k=r/(1-r)^2$. This later gives the mean of a geometric waiting time. The derivation can be done by finite subtraction, so calculus is unnecessary.

## Sums of powers and telescoping

Pairing terms gives $\sum_{k=1}^n k=n(n+1)/2$. To derive the sum of squares, use

$$k^3-(k-1)^3=3k^2-3k+1.$$

Sum from one to $n$. The left side telescopes to $n^3$, while the right side becomes $3\sum k^2-3\sum k+n$. Solve and substitute the linear sum:

$$\sum_{k=1}^n k^2=\frac{n(n+1)(2n+1)}6.$$

For $n=3$, this is $3\cdot4\cdot7/6=14$, matching $1+4+9$. Similar finite-difference identities derive higher power sums. Induction can then verify any proposed closed formula. Derivation and verification are different activities that support each other.

A telescoping sum has adjacent cancellation. Since $1/[k(k+1)]=1/k-1/(k+1)$,

$$\sum_{k=1}^n\frac1{k(k+1)}=1-\frac1{n+1}.$$

Writing three consecutive terms reveals the pattern. For a different denominator, partial fractions may expose a similar cancellation, but it should be derived rather than guessed.

## Estimating sums with area

An integral can be understood here as area under a nonnegative curve. For a decreasing function $f$, rectangles of width one with heights $f(k)$ can be compared with the curve. This yields

$$\int_1^{n+1}f(x)\,dx\le\sum_{k=1}^n f(k)
\le f(1)+\int_1^n f(x)\,dx.$$

The inequalities come from whether each rectangle sits above or below the curve. We use only two elementary area formulas: $\int_1^n1/x\,dx=\ln n$ and $\int_1^n x^p\,dx=(n^{p+1}-1)/(p+1)$ for $p\ne-1$. The latter can be justified by the standard power-area rule; readers wanting a full derivation can treat this as a locally stated calculus fact rather than an assumed previous course.

For the harmonic number $H_n=\sum_{k=1}^n1/k$, the comparison gives

$$\ln(n+1)\le H_n\le1+\ln n.$$

Thus $H_n$ grows without bound but very slowly. Grouping terms also proves divergence without integrals: terms from $2^{j-1}+1$ through $2^j$ each have size at least $1/2^j$, and there are $2^{j-1}$ of them, giving at least one half per group. Infinitely many groups force divergence.

For $\sum1/k^2$, the same area comparison gives a finite upper bound, because $\int_1^n x^{-2}\,dx=1-1/n$. Terms approaching zero are necessary but not sufficient for series convergence; the harmonic series supplies the counterexample.

## Block overhang

In an idealized model of equal uniform blocks of length one, a stack remains balanced when each supported collection's center of mass lies over its support. Place the top block with overhang $1/2$ relative to the next. The top two can extend another $1/4$ beyond the third; the top three another $1/6$ beyond the fourth. With $n$ blocks, the ideal maximum overhang is

$$\frac12\left(1+\frac12+\cdots+\frac1n\right)=\frac{H_n}{2}.$$

Why $1/(2k)$? Treat the top $k$ blocks as a combined mass of weight $k$. Position their center of mass just over the supporting edge; adding the next equal block changes the combined center according to the weighted average, yielding the next allowed shift. Induction on the stack size formalizes the construction.

Harmonic divergence permits arbitrarily large ideal overhang, but the required number of blocks grows exponentially in the desired overhang. Real stability margins, thickness, friction, and deformation are outside the model. A theoretical unbounded possibility and a practical construction cost are distinct conclusions.

## Products and factorials

The product $n!=1\cdot2\cdots n$ counts permutations. Taking logarithms turns multiplication into addition:

$$\ln(n!)=\sum_{k=1}^n\ln k.$$

Area comparison for the increasing function $\ln x$ shows $\ln(n!)=n\ln n-n+O(\ln n)$. This already gives the dominant scale. Stirling's formula sharpens it:

$$n!\sim\sqrt{2\pi n}\left(\frac ne\right)^n.$$

The notation $\sim$ means the ratio tends to one, not that the two values are equal for every $n$. We state Stirling's refined theorem without its longer proof; the logarithmic estimate explains why its main exponential term has that form. For numerical work, logarithms help avoid overflow from directly multiplying very large factors.

Products of probabilities often simplify by logarithms too. If $0\le x_i<1$, then $\prod_i(1-x_i)\le e^{-\sum_i x_i}$ using $1-x\le e^{-x}$. This inequality can be shown from the exponential series or its tangent-line property. Later it bounds collision-free samples and the probability that no independent failure occurs.

## Double sums

For finite sums, changing the summation order is safe when it counts the same index pairs. Consider

$$\sum_{i=1}^n\sum_{j=1}^i1=\sum_{i=1}^n i=\frac{n(n+1)}2.$$

The index region is $1\le j\le i\le n$. Reverse the order: for fixed $j$, $i$ ranges from $j$ through $n$, so the sum is $\sum_{j=1}^n(n-j+1)$. Drawing the triangular region makes the new bounds visible.

A more revealing example is $\sum_{i=1}^n\sum_{j=1}^i1/i$. Summing by rows gives $n$. Reversing gives $\sum_{j=1}^n\sum_{i=j}^n1/i$, still $n$. Replacing the changing denominator $i$ by $j$ would change the terms and is invalid. Reindexing changes names and bounds, not the value assigned to a pair.

Infinite rearrangements need additional conditions. Nonnegative series allow monotone interchange; absolutely convergent series allow rearrangement without changing value. Conditionally convergent series can behave differently. Our finite algorithm sums avoid that issue unless an infinite limit is explicitly introduced.

## Asymptotic notation with quantifiers

For eventually nonnegative functions, $f(n)=O(g(n))$ means there exist constants $C>0,n_0$ such that $f(n)\le Cg(n)$ for every $n\ge n_0$. It is an eventual upper bound. $f(n)=\Omega(g(n))$ is an eventual lower bound by a positive constant multiple. $f(n)=\Theta(g(n))$ means both. The equals sign is conventional notation for membership in a class of functions, not symmetric algebraic equality.

For $f(n)=3n^2+7n+2$, at $n\ge1$ we have $3n^2\le f(n)\le12n^2$. Thus $f=\Theta(n^2)$ with explicit constants. It is also $O(n^3)$, but that upper bound is less informative. Big O does not mean “exact growth” or “worst case” by itself; it can describe a best-case, average-case, or any other function once that function is specified.

Little o, $f=o(g)$, means that for every $\varepsilon>0$ there is $n_0$ after which $|f(n)|\le\varepsilon|g(n)|$. When $g$ is eventually positive, this is equivalent to $f/g\to0$. Thus $n=o(n^2)$, but $n^2$ is not $o(n^2)$. Asymptotic equivalence $f\sim g$ means $f/g\to1$, stronger than $\Theta$; $2n$ and $n$ are Theta-equivalent but not asymptotically equal.

For every fixed $k>0$ and fixed $a>1$, logarithms grow more slowly than positive powers, and fixed powers grow more slowly than $a^n$. These comparisons concern the limit as $n$ grows; crossover points can be large. Constants can dominate for realistic small inputs, so an asymptotic result is not a complete performance forecast.

## A complete operation-count derivation

Suppose an algorithm has an outer loop with indices one through $n$ and, for each $i$, performs $i$ unit operations. The count is the triangular sum $n(n+1)/2$. If each inner operation takes a fixed cost $c$ and each outer iteration adds overhead $d$, a more detailed model is $c\,n(n+1)/2+dn$. This is Theta of $n^2$ for fixed positive $c$ and nonnegative $d$. The simplified growth statement follows from the model; it does not erase the exact count when small inputs matter.

If the inner loop instead doubles an index until it exceeds $i$, the number of iterations is approximately a logarithm of $i$, with a floor or ceiling depending on initialization and the stopping test. The total is a sum of logarithms, connected to the logarithm of a factorial. Describing each loop before writing the sum prevents confusing a triangular pattern with a rectangular $n$-by-$n$ pattern.

## Comparing logarithms and powers without a graph

To see why a logarithm grows more slowly than a positive power, write $n=2^k$. The comparison becomes one between $k$ and $2^{\varepsilon k}$. A fixed-base exponential eventually outgrows every fixed-degree polynomial; this can be proved by bounding successive ratios or by the binomial theorem with a sufficiently high fixed-degree term. The conclusion applies between powers of two as well using monotonicity.

For a concrete inequality, $k^2$ is eventually smaller than $2^k$. The ratio of consecutive terms of $k^2/2^k$ is $((k+1)/k)^2/2$, which is bounded by a constant less than one once $k$ is sufficiently large. Repeated multiplication by that constant forces the ratio toward zero. This argument explains an eventual limit rather than relying on where two plotted curves happen to cross.

Changing a logarithm's base multiplies it by a positive constant. Therefore the asymptotic classes are unchanged for fixed bases greater than one. But a base depending on $n$ changes the function: $\log_n n$ equals one for $n>1$. Omitting a base is harmless only when the convention really is a fixed base.

## Using integral bounds carefully

For an increasing function, the rectangle inequalities reverse relative to the decreasing case. To estimate $\sum_{k=1}^n k^2$, the lower integral from zero to $n$ lies below the right-endpoint rectangles, while an integral over a shifted interval provides an upper bound. Both have cubic scale, agreeing with the exact formula. A sketch identifying which rectangle sits above the curve is safer than recalling an inequality sign from memory.

The area method can also establish convergence thresholds. For $p>1$, the integral of $x^{-p}$ from one to infinity is finite, so the corresponding decreasing positive series converges. For $0<p\le1$, the integral diverges and comparison yields divergence. These facts explain why the harmonic sum is a boundary case. They do not require the exact value of the convergent series.

An approximation can be interpreted through an error bound. The harmonic inequalities say the difference between $H_n$ and $\ln n$ lies in a bounded interval, so their ratio tends to one as the logarithm grows. This proves $H_n\sim\ln n$, not just $H_n=\Theta(\ln n)$. A stronger asymptotic statement needs correspondingly stronger control of the error relative to the main term.

## Asymptotic substitutions and domains

Suppose $f(n)=n+O(1)$. This means the difference between $f(n)$ and $n$ is eventually bounded in absolute value by some constant. It implies $f(n)/n$ tends to one. In contrast, $f(n)=O(n)$ allows zero, one half of $n$, twice $n$, and many oscillating functions. The notation records only what its definition guarantees.

When composing functions, verify the input enters the range where a bound holds. If $f(x)\le Cg(x)$ only for $x\ge x_0$, substituting $x=\log n$ is legitimate for sufficiently large $n$ because the logarithm tends to infinity. Substituting a bounded oscillating argument may never enter that range. Eventual statements are conditional on eventually reaching their domain of validity.

For nonnegative functions, adding two upper bounds is safe: constants add and thresholds can be replaced by their maximum. Multiplying bounds is also safe when the factors have the required signs. Dividing needs a lower bound on the denominator away from zero in the relevant comparison. These are the same algebraic safeguards from Chapter 01, now applied to classes of functions.

## A product estimate from a sum

Consider the collision-free product in a birthday model. Taking logarithms gives a sum of terms $\ln(1-i/m)$. For small ratios, each term is approximately $-i/m$, and the sum becomes $-k(k-1)/(2m)$. Exponentiating produces the familiar exponential approximation. The derivation reveals its regime: when many ratios approach one, the first-order logarithm approximation is poor, and at more than $m$ samples the exact collision probability is one.

This method connects several strands of the chapter: products become sums under logarithms, sums are approximated by simpler expressions, and the result is interpreted with an explicit domain. A compact final formula carries all of that reasoning. Learning the reasoning makes it possible to adapt the method to a different product rather than memorizing one isolated approximation.

## Exactness and scale answer different questions

The functions $n(n-1)/2$ and $n^2/2$ are asymptotically equivalent because their ratio tends to one. They are not equal, and the first gives zero at one while the second gives one half. If the task asks for an exact count, the lower-order term is essential. If the task asks how the count grows relative to $n^2$, the equivalence is sufficient. State which kind of answer is required before deciding which terms may be omitted.

An asymptotic upper bound can also be valid without being tight. Saying a linear function is big O of a cubic is correct under the definition, but may answer a performance question poorly. A proof of Theta supplies matching scale in both directions. A proof of little o says one function becomes negligible relative to another, a stronger comparison than merely being smaller for the first thousand inputs. The notation is a vocabulary of different claims, not interchangeable ways to say “approximately.”

When comparing experimental timings with an asymptotic model, remember that the input variable and the measured operation must match. Time versus number of digits differs from time versus the represented integer's magnitude. This distinction will matter for primality, modular exponentiation, and recurrence analysis throughout computer science.

For a final sum check, compare the answer with the number of terms times their minimum and maximum. Any exact value outside those bounds is impossible.

## Common errors and practice

Do not subtract big-O terms as though they had known signs or identical constants. $f=O(n)$ and $g=O(n)$ imply $f+g=O(n)$, but not $f-g=\Theta(n)$. They may cancel completely. Nor can one infer $2^{f(n)}=O(2^{g(n)})$ from $f=O(g)$: $f=2n,g=n$ is a counterexample.

The growth lab compares exact finite values, ratios, and harmonic bounds. It illustrates the eventual relationships; the quantified arguments above justify them. The sums lab also compares a finite geometric sum with its closed form and handles $r=1$ separately.

**12-A.** Evaluate $\sum_{k=0}^7 3^k$. **12-B.** Derive $\sum_{k=1}^n1/[k(k+1)]$. **12-C.** Give explicit constants proving $5n+9=O(n)$. **12-D.** Decide whether $n\log_2n=o(n^2)$ and explain. **12-E.** Reverse the bounds in $\sum_{i=1}^n\sum_{j=i}^n1$. **12-F.** Explain why $H_n/2$ grows unboundedly while each additional block contributes less overhang.
