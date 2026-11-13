# Chapter 28 — Analysis as needed: sums, limits, Euler products and primes

A finite list of primes lets us factor particular integers. An infinite collection of primes raises different questions: how sparse can the primes be, how quickly does their counting function grow, and what does an infinite product over primes mean? The algebra of unique factorization still drives the answers, but an additional language is required to control infinite processes.

This chapter develops that language from the beginning. We will define limits, convergence and infinite series before using them. We will then prove an Euler product for a convergent series, prove that the sum of prime reciprocals diverges, and establish a nontrivial elementary lower bound for the number of primes. We will distinguish these proved results from the prime number theorem, whose full proof is beyond the course.

No prior calculus is assumed. You need the order properties of real numbers, geometric sums, unique factorization and basic logarithms; we explain the necessary real-number and logarithm facts locally. The [prime companion lab](../companion/index.html) computes finite counts and sums. Finite data can illustrate a limiting statement, but cannot prove it. [Optional exercises and solutions](../solutions/28-solutions.md) support the analysis and number theory together.

## 28.1 A sequence is an ordered mathematical process

A real sequence is a function from the positive integers to the real numbers, usually written $a_1,a_2,\ldots$. For example, $a_n=1/n$ describes one number at each stage. A sequence converges to $L$ if its terms eventually become arbitrarily close to $L$ and remain close thereafter.

The precise definition is: for every $\varepsilon>0$, there exists an integer $N$ such that $n\ge N$ implies $|a_n-L|<\varepsilon$. The number $N$ may depend on the requested tolerance $\varepsilon$. It may not depend on the later index $n$, because one stage must control every sufficiently late term.

For $a_n=1/n$, given $\varepsilon>0$, choose $N>1/\varepsilon$. Then for $n\ge N$, we have $0<1/n\le1/N<\varepsilon$. This proves convergence to zero. Saying merely that the terms “look small” would not establish the required quantifiers.

The sequence $(-1)^n$ does not converge. Its even-index terms are one and its odd-index terms are minus one. If a proposed limit lay within distance less than one-half of both values, the triangle inequality would make their distance less than one, although their actual distance is two. Every sufficiently late tail still contains both values, so no limit works.

A useful distinction is between boundedness and convergence. A sequence is bounded if all terms stay inside a fixed interval. The alternating sequence is bounded but not convergent. A nondecreasing bounded sequence, however, does converge. Let $L$ be the least upper bound of its values. Given $\varepsilon>0$, some term exceeds $L-\varepsilon$; otherwise that smaller number would be an upper bound. Monotonicity then traps all later terms between $L-\varepsilon$ and $L$.

This argument uses completeness of the real numbers: every nonempty set bounded above has a least upper bound. Completeness is the specific analysis principle we need for nonnegative series. Rational numbers alone do not possess it; rational approximations to $\sqrt2$ already demonstrate a missing rational limit.

## 28.2 Infinite sums are limits of finite sums

The expression $\sum_{n=1}^{\infty}a_n$ means the limit, if it exists, of partial sums $S_N=\sum_{n=1}^N a_n$. An infinite sum is not a very long but completed act of addition. It is a statement about the behavior of the explicitly defined finite sums.

If every $a_n\ge0$, the partial sums are nondecreasing. Therefore the series converges to a finite number exactly when the partial sums are bounded above. If they are unbounded, we say the series diverges to infinity. Nonnegative terms make many arguments safer because adding further terms cannot undo earlier contributions.

For $0\le r<1$, the finite geometric identity is

$$
1+r+\cdots+r^N=\frac{1-r^{N+1}}{1-r}.
$$

It follows by multiplying the sum by $1-r$ and canceling adjacent terms. Since $r^{N+1}\to0$, the infinite geometric series converges to $1/(1-r)$. The tail after the $N$th power is exactly $r^{N+1}/(1-r)$, giving an explicit error bound.

Why does $r^N$ tend to zero? For $0<r<1$, write $r=1/(1+c)$ with $c>0$. The binomial theorem gives $(1+c)^N\ge1+Nc$, so $0<r^N\le1/(1+Nc)$, and the right-hand side tends to zero. This proof requires no exponential function or calculus.

A necessary condition for convergence of any series is $a_n\to0$, because $a_n=S_n-S_{n-1}$. It is not sufficient. The harmonic series below is the essential counterexample. Confusing “individual terms get small” with “all remaining terms have a small total” is the most common first error in infinite-sum arguments.

## 28.3 The harmonic series diverges

Let $H_N=1+1/2+\cdots+1/N$. Group terms between consecutive powers of two. In the block from $2^{j-1}+1$ to $2^j$, there are $2^{j-1}$ terms, each at least $1/2^j$. Hence every such block contributes at least one-half.

Consequently,

$$
H_{2^k}\ge1+\frac{k}{2}.
$$

The right-hand side grows beyond every fixed bound as $k$ grows. Thus the partial sums are unbounded, and the harmonic series diverges. Because the harmonic partial sums are nondecreasing, unboundedness along this subsequence suffices for divergence of the entire sequence.

The numerical growth is slow. Going from $N$ to $2N$ adds a quantity of order one rather than multiplying the sum by a fixed large factor. A finite table may therefore make the sum appear almost stable. The proof's repeated blocks show that this apparent stability can never become a finite limiting value.

The argument also highlights the correct use of inequalities. Replacing every denominator in a block by the largest denominator makes each reciprocal smaller, so it gives a lower bound. Reversing this inequality would invalidate the divergence proof. When working with reciprocals of positive numbers, the order reverses.

For contrast, the series of reciprocals of powers of two converges:

$$
\sum_{j=0}^{\infty}\frac1{2^j}=2.
$$

An infinite set can therefore have a convergent reciprocal sum. Infinitely many primes alone does not imply divergence of $\sum_p1/p$. Proving prime-reciprocal divergence will give stronger information about how the primes populate the integers.

## 28.4 The series $\sum n^{-s}$ for $s>1$

For a real number $s>1$, define

$$
\zeta(s)=\sum_{n=1}^{\infty}\frac1{n^s}.
$$

We use the name zeta function only for this real, convergent series in this chapter. Analytic continuation and complex-variable theory are separate subjects; no property of those extensions is being assumed.

To prove convergence, group positive integers into blocks $2^j\le n<2^{j+1}$. There are $2^j$ integers in such a block, and each term is at most $2^{-js}$. Its total is therefore at most $2^{j(1-s)}$. Since $s>1$, the ratio $2^{1-s}$ is less than one. A convergent geometric series bounds the block totals, proving that the zeta series converges.

The same calculation supplies a tail bound at a power of two:

$$
\sum_{n\ge2^J}\frac1{n^s}
\le\frac{2^{J(1-s)}}{1-2^{1-s}}.
$$

This bound is not always sharp, but it is explicit and sufficient for exchanging a finite approximation with the limiting sum. It also shows why estimates deteriorate as $s$ approaches one from above: the geometric ratio approaches one, so increasingly many terms are needed for a given accuracy.

At $s=1$, this proof stops working because the ratio is one, and the harmonic series actually diverges. For $s<1$ with $s>0$, the terms $n^{-s}$ are at least $n^{-1}$, so their series diverges by comparison. Thus the boundary at one is a genuine change in convergence, not a weakness of the chosen proof.

For $s=2$, $\zeta(2)$ is finite. The famous exact value $\pi^2/6$ is not needed for any argument here. We will not use that value without proving it. A central point of first-principles work is that a theorem can often be established with less machinery than a celebrated closed form might suggest.

## 28.5 Defining an infinite product correctly

An infinite product $\prod_{j=1}^{\infty}b_j$ means the limit of finite products $P_k=b_1\cdots b_k$, when that limit is meaningful. For the positive factors used below, we will prove convergence directly. One cannot distribute infinitely many factors merely by copying a finite algebraic identity.

For a finite set of primes $S$, consider

$$
P_S(s)=\prod_{p\in S}\left(1-\frac1{p^s}\right)^{-1}.
$$

Each factor is a convergent geometric series $1+p^{-s}+p^{-2s}+\cdots$. Expanding a finite number of these series gives a sum indexed by exponent choices for the primes in $S$. Unique factorization identifies those choices with positive integers whose prime factors all lie in $S$. Therefore

$$
P_S(s)=\sum_{\substack{n\ge1\\\text{all prime factors of }n\text{ lie in }S}}n^{-s}.
$$

Why is this expansion legitimate? One may first truncate every geometric series, multiply the finite sums, and then increase the truncation bounds. All coefficients are nonnegative, and every exponent tuple eventually appears. The finite products of geometric partial sums increase to the displayed product. There is no cancellation or rearrangement of positive and negative terms.

Let $S_y$ be the primes at most $y$. Every integer at most $y$ has all its prime factors in $S_y$. Thus

$$
\sum_{n\le y}n^{-s}\le P_{S_y}(s)\le\zeta(s).
$$

The left-hand side tends to $\zeta(s)$ as $y$ tends to infinity. The two inequalities squeeze the middle expression to the same limit. We have proved the Euler product

$$
\zeta(s)=\prod_p\left(1-p^{-s}\right)^{-1},\qquad s>1.
$$

Notice that unique factorization supplied the exact terms, while convergence supplied permission to pass to the infinite limit. Neither ingredient alone would have completed the argument.

## 28.6 A finite numerical picture of the Euler product

For $s=2$, the factors at two, three and five give

$$
\left(1-\frac14\right)^{-1}
\left(1-\frac19\right)^{-1}
\left(1-\frac1{25}\right)^{-1}
=\frac43\cdot\frac98\cdot\frac{25}{24}
=\frac{25}{16}.
$$

This product is $1.5625$. It sums reciprocals of squares of all numbers built only from the primes two, three and five, including numbers far larger than five such as $72$ and $625$. It is not the sum of just the terms $1,1/4,1/9,1/25$.

Adding the factor at seven includes all numbers whose prime factors lie among two, three, five and seven. Every previously included term stays present, and new positive terms enter. Thus the partial Euler products increase. Their upper bound is $\zeta(2)$, so their convergence can also be seen from the monotone bounded sequence principle.

The terms missing from the product over primes at most $y$ all correspond to integers greater than $y$. Hence an immediate error estimate is

$$
0\le\zeta(s)-P_{S_y}(s)\le\sum_{n>y}n^{-s}.
$$

The dyadic estimate from Section 28.4 can control this tail. A sharper estimate can be obtained with an integral comparison, but sharpening is unnecessary for the logical conclusion. The finite error bound already says exactly what more computation can establish.

This is a useful way to interpret the companion lab. A displayed difference between a partial sum and a partial product need not indicate an error, because the two approximations include different sets of integers. To compare them rigorously, compare each to the same infinite limit with a proven tail bound. Raw numerical proximity is suggestive; an inequality explains why it should occur.

## 28.7 Prime reciprocals diverge without taking logarithms

We now prove a stronger theorem than the infinitude of primes:

$$
\sum_{p\text{ prime}}\frac1p=\infty.
$$

The proof uses only finite products and the harmonic divergence already established. Suppose instead that the prime reciprocal series converges. Its tails must then become arbitrarily small. Choose a threshold $y$ such that the sum of $1/p$ over primes greater than $y$ is less than one-half.

We need a finite inequality. For numbers $0\le a_1,\ldots,a_r\le1$,

$$
\prod_{j=1}^r(1-a_j)\ge1-\sum_{j=1}^ra_j.
$$

For two factors the extra product term $a_1a_2$ is nonnegative. Induction proves the general case: multiply the previous inequality by $1-a_r\ge0$, expand, and retain the additional nonnegative term. This is the same elementary inequality that often appears in a union bound in probability.

Apply it to reciprocals of any finite collection of primes greater than $y$. Their sum is less than one-half, so the product of $1-1/p$ is greater than one-half. Its reciprocal is therefore less than two. The contribution from the finitely many primes at most $y$ is the fixed finite constant

$$
C=\prod_{p\le y}(1-1/p)^{-1}.
$$

For any $N>y$, split the product over primes at most $N$ into these small-prime factors and the remaining factors. The latter product is less than two, giving

$$
\prod_{p\le N}(1-1/p)^{-1}<2C.
$$

The finite geometric expansion at exponent one is still valid for each factor, even though the product over all primes is not yet defined as a finite limit. Every integer from one to $N$ has prime factors at most $N$, so

$$
H_N\le\prod_{p\le N}(1-1/p)^{-1}<2C.
$$

This bounds every harmonic partial sum by the same constant, contradicting its divergence. The assumption was false, and the prime reciprocal series diverges.

Observe what we did not do. We did not substitute $s=1$ into a convergent Euler-product identity or subtract two divergent quantities. Every displayed product before the contradiction was finite. The only use of an infinite sum was the convergence assumption, which supplied a uniformly small tail.

## 28.8 What the prime number theorem says

Define the prime-counting function by $\pi(x)=\#\{p\le x:p\text{ is prime}\}$ for real $x\ge0$. The symbol $\#$ means the number of elements of the finite set. The function is constant between primes and jumps by one at each prime.

The prime number theorem states

$$
\lim_{x\to\infty}\frac{\pi(x)}{x/\log x}=1.
$$

This is stated as an important theorem, not proved in this course. Its usual proofs require analysis beyond the elementary tools developed here. The result is much stronger than the infinitude of primes or divergence of prime reciprocals. It gives the first-order asymptotic size of their counting function.

The notation $f(x)\sim g(x)$ means $f(x)/g(x)\to1$, provided the denominator is eventually nonzero. It does not mean that $f(x)-g(x)\to0$. For example, $x+\sqrt x\sim x$, although their difference grows without bound. Thus the prime number theorem permits absolute errors that grow, as long as they are small relative to $x/\log x$.

The natural logarithm $\log x$ can be introduced geometrically as the signed area under the curve $1/t$ between one and $x$. Formally that area is the limit of upper and lower rectangle sums; continuity of $1/t$ on every closed positive interval ensures agreement. This construction gives $\log1=0$, a strictly increasing continuous function, and $\log(ab)=\log a+\log b$. The product identity follows by scaling the rectangles in the integral from $a$ to $ab$.

Only elementary logarithm properties are needed below. In particular, $\log(2^k)=k\log2$, and applying an increasing logarithm preserves inequalities between positive numbers. If your prior algebra course used base-ten logarithms, changing base gives $\log_{10}x=\log x/\log10$; the constant matters in an asymptotic formula.

The heuristic phrase “an integer near $x$ has probability about $1/\log x$ of being prime” must be interpreted carefully. A fixed integer is either prime or composite. The phrase describes a density heuristic for ranges or sampling models. It does not assert independence of primality events, and arithmetic constraints such as parity immediately contradict naive independence.

## 28.9 A proved lower bound from a binomial coefficient

We can prove substantial growth information without the prime number theorem. Consider the central binomial coefficient

$$
B_n=\binom{2n}{n}=\frac{(2n)!}{(n!)^2}.
$$

The binomial coefficients in row $2n$ sum to $2^{2n}=4^n$. There are $2n+1$ of them, and the central one is largest; the ratio of consecutive coefficients verifies this. Therefore

$$
B_n\ge\frac{4^n}{2n+1}.
$$

We next bound the contribution of each prime to $B_n$. The exponent of $p$ in $m!$ is

$$
v_p(m!)=\sum_{j\ge1}\left\lfloor\frac{m}{p^j}\right\rfloor.
$$

The first term counts factors divisible by $p$, the second counts the additional factors supplied by multiples of $p^2$, and so on. Only finitely many terms are nonzero. Hence

$$
v_p(B_n)=\sum_{j\ge1}\left(\left\lfloor\frac{2n}{p^j}\right\rfloor
-2\left\lfloor\frac{n}{p^j}\right\rfloor\right).
$$

Each parenthesized term is zero or one. Indeed, for any real $u$, writing $u=m+r$ with $0\le r<1$ gives $\lfloor2u\rfloor-2\lfloor u\rfloor=\lfloor2r\rfloor\in\{0,1\}$. The number of potentially nonzero terms is at most the largest integer $k$ with $p^k\le2n$. It follows that $p^{v_p(B_n)}\le p^k\le2n$.

All prime divisors of $B_n$ are at most $2n$, so unique factorization gives

$$
B_n\le(2n)^{\pi(2n)}.
$$

Combine this with the lower bound and take natural logarithms:

$$
\pi(2n)\ge\frac{n\log4-\log(2n+1)}{\log(2n)}.
$$

This is an explicit elementary lower bound. Its main size is $(2n)\log2/\log(2n)$. It does not prove the prime number theorem's constant one, but it already prevents the primes from being arbitrarily sparse. The proof combines factorial valuations, finite combinatorics and a small amount of analysis.

## 28.10 Absolute convergence and a second arithmetic bridge

For a series with positive and negative terms, convergence can become more delicate. A series $\sum a_n$ is absolutely convergent if $\sum|a_n|$ converges. Absolute convergence guarantees that tails can be bounded in total magnitude and that rearranging or multiplying suitably convergent series does not change their sum.

For $s>1$, the series $\sum\mu(n)n^{-s}$ is absolutely convergent because $|\mu(n)|\le1$ and $\sum n^{-s}$ converges. Likewise $\sum n^{-s}$ is absolutely convergent. We may therefore multiply them, grouping pairs of indices by their product:

$$
\left(\sum_{n\ge1}\frac1{n^s}\right)
\left(\sum_{n\ge1}\frac{\mu(n)}{n^s}\right)
=\sum_{m\ge1}\frac{\sum_{d\mid m}\mu(d)}{m^s}=1.
$$

The last equality uses the Möbius identity from Chapter 19: the divisor sum is one for $m=1$ and zero otherwise. Thus

$$
\frac1{\zeta(s)}=\sum_{n\ge1}\frac{\mu(n)}{n^s},\qquad s>1.
$$

To see why absolute convergence justifies grouping, the sum of absolute values of all double-product terms is bounded by $\zeta(s)^2$. Every term corresponds to a pair of positive integers; grouping pairs by their product preserves the total because an absolutely convergent family has arbitrarily small absolute tails. We are not using a formal identity outside its convergence range.

This formula connects a familiar inverse under Dirichlet convolution with an ordinary reciprocal of functions. The arithmetic functions $1$ and $\mu$ are convolution inverses; their Dirichlet series become multiplicative inverses. The new language packages earlier finite divisor identities into an analytic object, while the convergence hypothesis specifies the region where that package is legitimate.

## 28.11 Common errors and the scale of the conclusions

An infinite product must not be manipulated as though it were a polynomial. The finite Euler products are exact sums over restricted prime factors. Their limit required bounds. At $s=1$, the limit is infinite, so writing a reciprocal or logarithm without stating an extended-value convention can obscure the argument. Our prime-reciprocal proof deliberately kept all products finite.

A numerical plateau is not evidence of convergence. Both harmonic and prime-reciprocal partial sums grow very slowly. A convergence claim requires a uniform tail estimate or another theorem. Conversely, a finite sum being large does not prove divergence; a convergent series can have an arbitrarily large finite total after scaling. The issue is behavior beyond every bound, not a particular decimal size.

Different prime assertions have different strengths. Euclid's argument proves infinitely many primes. Prime-reciprocal divergence rules out some extremely sparse distributions. The binomial lower bound forces at least a constant multiple of $x/\log x$ along the displayed scale. The prime number theorem gives a precise leading asymptotic. None of these statements alone gives the exact next prime or a complete description of prime gaps.

The companion's finite experiment can compare $\pi(x)$ with $x/\log x$ and inspect partial reciprocal sums. Small values may behave irregularly; asymptotic statements allow that. Always label the range displayed and distinguish an exact count from a heuristic comparator. If a graph looks convincing, ask which theorem connects its finite range to the infinite statement under discussion.

Most of all, analysis does not replace number theory here. Unique factorization determined the Euler product, valuations controlled the binomial coefficient, and divisor cancellation produced the reciprocal zeta series. Analysis controlled limits and errors. The two subjects answer complementary questions about the same arithmetic structure.

## 28.12 Integrals as bounds, introduced through rectangles

An integral can be useful even when no antiderivative formula is known. For a positive decreasing function $f$ on an interval, a rectangle of width one and height $f(n)$ sits above the graph on $[n,n+1]$, while the rectangle of height $f(n+1)$ sits below it. Adding finitely many such comparisons bounds the area between two finite sums. The integral notation records the limiting area obtained as the rectangle widths shrink.

For $f(t)=1/t$ on positive intervals, this gives

$$
\int_1^{N+1}\frac{dt}{t}\le H_N
\le1+\int_1^N\frac{dt}{t}.
$$

The first inequality compares each rectangle of height $1/n$ to the area below it on $[n,n+1]$. The second compares the terms from $n=2$ onward with the area above the graph on the preceding interval. In logarithm notation,

$$
\log(N+1)\le H_N\le1+\log N.
$$

This explains the slow growth observed earlier. It also proves $H_N/\log N\to1$, because the difference between the upper and lower bounds is bounded while $\log N$ grows without bound. To see that logarithms are unbounded without calculus, use $\log(2^k)=k\log2$ and $\log2>0$.

For $s>1$, the same rectangle comparison provides

$$
\sum_{n>N}n^{-s}\le\int_N^\infty t^{-s}\,dt
=\frac{N^{1-s}}{s-1}.
$$

The final equality uses the power-function area formula, which can be derived from elementary calculus if that material is available. It is an optional sharper tail bound; none of the preceding convergence proofs depends on it. If you have not studied integration rules, retain the dyadic geometric bound already proved. A local prerequisite bridge should supply enough for the current argument, rather than silently demanding an entire calculus course.

This separation also clarifies the role of a notation. Writing an integral does not automatically prove an evaluation, just as writing an infinite product does not automatically prove convergence. The rectangle comparisons are elementary inequalities. The power-area evaluation is an additional theorem. Knowing which part you have established lets you use the former safely while postponing the latter.

## 28.13 Coprime pairs and an exact limiting density

We now combine Möbius inversion with convergence in a second concrete way. Choose an ordered pair $(a,b)$ uniformly from $\{1,\ldots,N\}^2$. “Uniformly” means that every one of the $N^2$ ordered pairs receives probability $1/N^2$. Let $C_N$ be the number of pairs with $\gcd(a,b)=1$. We will prove that

$$
\lim_{N\to\infty}\frac{C_N}{N^2}=\frac1{\zeta(2)}.
$$

This is a genuine probability statement because a finite sampling model has been specified at every stage. The limit describes what happens as the sampling square grows. It does not require a nonexistent uniform probability distribution on all positive integers.

The divisor identity for $\mu$ gives

$$
\mathbf1_{\gcd(a,b)=1}=\sum_{d\mid a,\ d\mid b}\mu(d).
$$

Here $\mathbf1$ is an indicator: it equals one when the condition is true and zero otherwise. Summing over $a$ and $b$ and reversing finite sums yields

$$
C_N=\sum_{d=1}^N\mu(d)\left\lfloor\frac Nd\right\rfloor^2.
$$

There are $\lfloor N/d\rfloor$ choices for each coordinate divisible by $d$, which explains the square. Every step is finite, so rearrangement requires no convergence theorem yet.

For each fixed $d$, division by $N^2$ gives

$$
\left(\frac{\lfloor N/d\rfloor}{N}\right)^2\longrightarrow\frac1{d^2}.
$$

It is tempting to pass this limit through the whole growing sum immediately. Instead, fix a cutoff $M$. The first $M$ terms form a fixed finite sum, so their limits can be passed term by term. For the tail, use $|\mu(d)|\le1$ and $\lfloor N/d\rfloor\le N/d$:

$$
\left|\sum_{M<d\le N}\mu(d)
\left(\frac{\lfloor N/d\rfloor}{N}\right)^2\right|
\le\sum_{d>M}\frac1{d^2}.
$$

The right-hand side can be made arbitrarily small by choosing $M$ large, independently of $N$. The tail of $\sum\mu(d)/d^2$ has the same bound. Choose $M$ to control both tails, then choose $N$ to control the finitely many initial terms. This two-stage argument proves the limit is $\sum\mu(d)/d^2=1/\zeta(2)$.

There is an illuminating heuristic consistent with the proof. For a fixed prime $p$, roughly a fraction $1/p^2$ of pairs have both coordinates divisible by $p$. Avoiding that event suggests a factor $1-1/p^2$. The Euler product yields the same limiting answer. However, the proof did not simply assume infinitely many events were independent. It used an exact finite divisor identity and a uniform convergent tail estimate. That is the bridge from an appealing probability picture to a rigorous density calculation.

The value $1/\zeta(2)$ is approximately $0.608$ if one computes enough terms with an error bound. Its familiar expression $6/\pi^2$ requires the separate theorem evaluating $\zeta(2)$. We deliberately retain the zeta expression to show which conclusions follow from the tools actually established here. An exact structural answer need not always be rewritten using a more famous constant.

## 28.14 Summation by parts: a finite bridge to counting functions

Integration by parts has a discrete counterpart that needs no calculus. Let $a_1,\ldots,a_N$ be real numbers and define $A(n)=\sum_{j=1}^na_j$, with $A(0)=0$. Since $a_n=A(n)-A(n-1)$, expanding and shifting finite sums gives

$$
\sum_{n=1}^Na_nb_n
=A(N)b_N+\sum_{n=1}^{N-1}A(n)(b_n-b_{n+1}).
$$

To check the identity, inspect the coefficient of each $A(n)$ after expansion: the interior terms contribute $b_n-b_{n+1}$, while the final endpoint contributes $b_N$. This is an exact finite identity, so no limiting hypothesis is required.

Choose $a_n$ to be one when $n$ is prime and zero otherwise. Then $A(n)=\pi(n)$. With $b_n=1/n$, the identity becomes

$$
\sum_{p\le N}\frac1p
=\frac{\pi(N)}N+\sum_{n=1}^{N-1}\pi(n)
\left(\frac1n-\frac1{n+1}\right).
$$

Thus prime reciprocal sums and prime counts are related through an explicit weighted sum. The difference in parentheses equals $1/(n(n+1))$, which is positive and roughly of order $1/n^2$. Bounds for $\pi(n)$ translate into bounds for the reciprocal sum through this formula.

For example, if the primes were so sparse that $\pi(n)\le Cn^\alpha$ eventually for some fixed $\alpha<1$, then the weighted terms would be bounded by a constant times $n^{\alpha-2}$. That series converges because $2-\alpha>1$. The endpoint term $\pi(N)/N$ would tend to zero, and the prime reciprocal sum would converge. Our divergence theorem therefore rules out any such eventual power-law upper bound with exponent below one.

This deduction is weaker than the binomial lower bound but conceptually useful. It says that prime-reciprocal divergence constrains a counting function, not merely a sum. It also demonstrates why changing weights can reveal different aspects of the same set. Counting gives each prime weight one; reciprocal summation gives smaller primes more weight; the finite identity tells us exactly how those viewpoints interact.

A statement such as $\pi(n)\approx n/\log n$ would suggest a reciprocal growth rate resembling $\log\log n$. That stronger quantitative conclusion requires controlled estimates, and is not being proved by replacing symbols heuristically in the finite identity. The identity gives a rigorous starting point. An asymptotic argument must still bound its errors, just as the Euler-product argument did.

## 28.15 What can go wrong when limits move through sums

A simple array shows why the cutoff argument in the coprime-density proof was necessary. For positive integers $N$ and $n$, define $a_{N,n}=1$ when $n=N$, and define it to be zero otherwise. For every fixed $n$, the value $a_{N,n}$ is eventually zero as $N$ grows. Its limit is therefore zero. Yet for every $N$, the sum over all $n$ is one, because exactly one position contains a one.

Consequently,

$$
\lim_{N\to\infty}\sum_{n\ge1}a_{N,n}=1,
\qquad
\sum_{n\ge1}\lim_{N\to\infty}a_{N,n}=0.
$$

Every termwise limit exists, but exchanging the limit and the infinite sum changes the answer. The mass of the array moves outward to a later and later index. A fixed initial block never sees it. The uniform tail bound in Section 28.13 prevents precisely this behavior: after choosing one cutoff, every later array has only a small absolute contribution beyond it.

This example is also a warning about numerical truncation. Increasing a truncation limit and increasing a parameter are two different operations. A computation that works for every fixed parameter can still fail uniformly as the parameter grows. The zeta tail bounds became worse near one for exactly such a reason. There is no single small cutoff that approximates all $\zeta(s)$ uniformly for $s>1$ arbitrarily close to one.

The Cauchy criterion is another way to formulate tail control. A series converges if and only if, for every $\varepsilon>0$, there exists $N$ such that

$$
\left|\sum_{n=k+1}^ma_n\right|<\varepsilon
\qquad\text{whenever }m>k\ge N.
$$

Necessity follows because two sufficiently late partial sums are each close to the common limit, so their difference is small. Sufficiency uses completeness: the partial sums form a Cauchy sequence, and every real Cauchy sequence has a real limit. For nonnegative terms, the condition means the entire remaining mass can be made small. For signed terms, cancellation can make a tail small even when its absolute mass is large.

Consider the alternating harmonic series $1-1/2+1/3-1/4+\cdots$. Its even partial sums increase because each added pair has positive sum. Its odd partial sums decrease because passing from one odd partial sum to the next adds a negative pair. Every even partial sum lies below every following odd partial sum, and the gap between adjacent ones is a reciprocal tending to zero. Both subsequences therefore converge to the same limit. This proves convergence without evaluating that limit.

Its absolute-value series is the harmonic series, which diverges. Thus convergence and absolute convergence are different. Rearranging a conditionally convergent series can change its sum; the reason is that arbitrarily far positive and negative contributions do not have small combined absolute size. We do not need a rearrangement theorem here, because all infinite regroupings used in the Euler product had nonnegative terms, and the Möbius-series multiplication had an absolute bound.

These examples explain a practical proof checklist. When moving a limit through a sum, identify whether the sum is finite, whether terms are nonnegative, or whether a uniform absolute tail bound is available. If none applies, look for an additional convergence theorem rather than copying a finite calculation. When multiplying series, bound the total absolute double sum before grouping by product or by another arithmetic parameter.

The checklist is not an extra layer of bureaucracy. Each condition blocks a specific failure: fixed finite sums cannot hide outward-moving mass, nonnegative sums cannot conceal cancellation, and uniform absolute tails cannot accumulate an uncontrolled distant contribution. The number-theoretic formulas become trustworthy because the analysis tells us exactly which infinite operations preserve their meaning.

One more distinction concerns a limiting density of zero. The prime number theorem implies $\pi(x)/x\to0$, because $1/\log x\to0$. A density-zero set can nevertheless have a divergent reciprocal sum, as the primes do. Density counts the fraction of elements in a long initial interval; reciprocal summation gives relatively more weight to earlier scales and combines contributions over all scales. These measurements are related by summation by parts, but they are not equivalent.

For comparison, the squares have density zero and a convergent reciprocal sum, since their reciprocal sum is $\sum n^{-2}$. The primes have density zero and a divergent reciprocal sum. The full positive integers have density one and a divergent reciprocal sum. These three examples prevent the misleading inference that “rare” has one universal mathematical meaning. A precise question must specify which measure of sparsity is intended.

This perspective will remain useful beyond elementary number theory. Whenever a set is infinite but thin, ask whether the issue is counting growth, weighted summation, density in a sampling model, or algebraic structure. Different tools are adapted to different questions. The strength of the present chapter lies in making those distinctions explicit before invoking any advanced theorem about primes.

## 28.16 Optional practice

1. Prove directly from the definition that $3/(n+2)\to0$.
2. Show that $\sum_{n\ge1}1/\sqrt n$ diverges and $\sum_{n\ge1}1/n^3$ converges, naming the comparisons used.
3. Compute the Euler product for $s=2$ over the primes two, three and five, and explain which integers contribute to its expanded sum.
4. Prove the inequality $\prod_{j=1}^r(1-a_j)\ge1-\sum_{j=1}^ra_j$ for $0\le a_j\le1$.
5. Explain why the set of powers of two has a convergent reciprocal sum while the primes do not, and why mere infinitude does not distinguish them.
6. Compute $v_2\binom{10}{5}$ and $v_3\binom{10}{5}$ using factorial valuations, then compare with the prime factorization of $252$.
7. Give functions $f\sim g$ whose difference tends to infinity, and explain why this matters in interpreting the prime number theorem.
8. Derive the identity $1/\zeta(s)=\sum\mu(n)n^{-s}$ for $s>1$, explicitly identifying the convergence step that fails at $s=1$.

The next chapter returns to congruences, but uses a new limiting viewpoint. Instead of asking for closeness on the ordinary real line, we will ask what it means for two integers to agree modulo larger and larger powers of a fixed prime.

<!-- course-navigation -->

---

[Course index](../README.md) · [Previous chapter](27-solvability-and-galois-computations.md) · [Next chapter](29-hensel-and-p-adic.md) · [Hints and solutions](../solutions/28-solutions.md)
