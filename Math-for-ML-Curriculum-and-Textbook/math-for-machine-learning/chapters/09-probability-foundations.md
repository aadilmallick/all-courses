# 9. Probability: reasoning about uncertain outcomes

This chapter contains outline lessons 33–36. You need sets, sums, and integrals. Our central problem is expressing uncertainty without confusing events, observations, model parameters, and numerical densities. We will derive the rules from a small finite example before using continuous variables.

<a id="lesson-33"></a>
## Session 33 — Outcomes, events, counting, and axioms

### Name the experiment before assigning numbers

Imagine observing whether each of two deliveries is late. A possible sample space is $\Omega=\{00,01,10,11\}$, where one means late and order identifies the delivery. An outcome is one element; an event is a set of outcomes. The event “exactly one is late” is $\{01,10\}$, while “the first is late” is $\{10,11\}$.

A probability measure assigns nonnegative numbers to events, assigns one to the whole space, and is countably additive on pairwise disjoint events. In a finite space it is enough to assign nonnegative masses to outcomes summing to one and add those masses over events. Equal probability is an additional modeling assumption, not a consequence of listing outcomes.

From additivity, the empty event has probability zero and complements satisfy $P(A^c)=1-P(A)$. Decompose $A\cup B$ into disjoint pieces to derive

$$
P(A\cup B)=P(A)+P(B)-P(A\cap B).
$$

The intersection was counted twice in the sum and must be removed once. Dropping it gives the union bound $P(A\cup B)\le P(A)+P(B)$, extended to many events by induction or countable additivity. A bound can be useful even when exact dependence is unknown.

Counting computes probabilities only when equally likely outcomes have been justified. A sequence of $k$ choices from $n$ possibilities with repetition has $n^k$ ordered outcomes. Without repetition it has $n(n-1)\cdots(n-k+1)$. An unordered selection of $k$ distinct objects divides by the $k!$ orderings of each chosen subset, yielding

$$
{n\choose k}=\frac{n!}{k!(n-k)!}.
$$

For five deliveries, there are ${5\choose2}=10$ choices of which two are late. If each independent delivery is late with probability $p$, each particular two-late pattern has probability $p^2(1-p)^3$. Multiplying by ten gives the probability of exactly two. Independence and a common probability are both required for that argument.

Sampling without replacement is different. From a batch of ten items with three defects, the probability of two defective items in a two-item sample is ${3\choose2}/{10\choose2}=3/45=1/15$. It is not $(3/10)^2$, because the first selection changes the composition available for the second. The later hypergeometric family formalizes this finite-population case, though binomial models are our main independent-trial model.

On an uncountable space, events belong to a specified sigma-algebra, a collection closed under complements and countable unions. We will use ordinary intervals and sets built from them. This small measure-theoretic note explains why a probability model consists of more than a sample-space list. Full measure theory is outside our scope, but its distinction between point values and probabilities will matter immediately.

<a id="lesson-34"></a>
## Session 34 — Conditioning, independence, and Bayes' theorem

### Conditioning changes the reference population

For $P(B)>0$, define $P(A\mid B)=P(A\cap B)/P(B)$. The event $B$ becomes the restricted reference population. This is a ratio of two probabilities, not a claim that $B$ causes $A$. Rearranging gives the multiplication rule $P(A\cap B)=P(A\mid B)P(B)$.

Suppose ten percent of deliveries use a distant route. Thirty percent of distant-route deliveries are late, while five percent of nearby-route deliveries are late. In a synthetic population of one thousand deliveries, expect one hundred distant and nine hundred nearby. The corresponding late counts are thirty and forty-five. Thus overall late probability is $75/1000=0.075$.

This is the law of total probability. If $B_1,\ldots,B_k$ partition the sample space,

$$
P(A)=\sum_jP(A\mid B_j)P(B_j).
$$

The partition means disjoint exhaustive cases. Overlapping cases would double count; nonexhaustive cases would omit probability. Terms with zero-probability conditioning events need a formulation through joint probabilities or a suitable conditional distribution, rather than the elementary ratio.

Among late deliveries, the distant-route share is $30/75=0.4$. Algebraically,

$$
P(B\mid A)=\frac{P(A\mid B)P(B)}{P(A)}.
$$

This is Bayes' theorem, derived by writing the joint probability in two orders. The prior $P(B)$ matters: a substantial conditional late rate does not by itself determine the probability a late delivery came from that route. The denominator normalizes all plausible explanations.

Independence means $P(A\cap B)=P(A)P(B)$. For positive $P(B)$ it is equivalent to $P(A\mid B)=P(A)$. Disjoint positive-probability events are not independent: learning that one occurred rules out the other. Independence expresses unchanged probabilities, while disjointness expresses inability to occur together.

Pairwise independence does not imply mutual independence. Let two fair bits be $U,V$ and a third bit be their parity $W=U\oplus V$. Each pair is independent, but knowing both $U,V$ determines $W$. A joint factorization over many variables requires mutual independence or a specified conditional factorization, not merely checks of pairwise relationships.

Conditional independence means the joint conditional distribution factors after a variable is given. Two symptoms might be independent within each disease state yet dependent overall because both reflect disease. Conversely, conditioning on a shared effect can introduce dependence. These examples warn us that “conditioning removes confounding” is not an automatic algebraic law.

<a id="lesson-35"></a>
## Session 35 — Random variables, masses, densities, and CDFs

### A random variable is a function on outcomes

A random variable maps each outcome to a numerical value. For two late-delivery indicators, $X$ might count late deliveries, taking values zero, one, and two. Different outcomes can map to the same count. Its distribution describes probabilities of those numerical values, rather than changing the underlying experiment.

For a discrete variable, its probability mass function is $p_X(x)=P(X=x)$, with nonnegative entries summing to one. For two independent fair indicators, the count has masses $1/4,1/2,1/4$. A cumulative distribution function is

$$
F_X(t)=P(X\le t).
$$

It is nondecreasing, right-continuous, tends to zero at minus infinity and one at plus infinity. The mass at a point equals the jump there. For the count example, $F_X(0.5)=1/4$ and $F_X(1)=3/4$.

An absolutely continuous distribution has a density $f_X$ with $P(a<X\le b)=\int_a^bf_X(x)dx$. The density itself is not a point probability. For a uniform distribution on $[0,1/2]$, the density is two there, yet every individual point has probability zero. Densities can exceed one because they are probability per unit length, not probabilities.

A continuous CDF need not always have a density in full generality, and a distribution can mix point masses and a density. A waiting time that is exactly zero with some probability and otherwise positive is one such mixture. We mainly use discrete or absolutely continuous families, and name the distinction rather than treating them as exhaustive possibilities.

For density $f(x)=2x$ on $[0,1]$, the CDF is zero below zero, $x^2$ on that interval, and one above one. Thus $P(1/2<X\le3/4)=9/16-1/4=5/16$. On smooth portions the density is the derivative of the CDF, connecting the fundamental theorem of calculus to probability.

### Transform a variable by conserving probability

If $Y=g(X)$ and $g$ is differentiable, strictly monotone, and invertible on the support, then

$$
f_Y(y)=f_X(g^{-1}(y))\left|\frac{d}{dy}g^{-1}(y)\right|.
$$

This is the change-of-variables theorem applied to probability. For $Y=\mu+sX$, $s>0$, its density is $f_X((y-\mu)/s)/s$. Stretching the axis spreads the same probability across a wider interval, so density height shrinks.

For $X$ uniform on $[0,1]$ and $Y=X^2$, the inverse is $\sqrt y$ for $0<y<1$. The density is $1/(2\sqrt y)$. It becomes unbounded near zero but integrates to one. A large density near an endpoint is not itself invalid. If a transformation is not one-to-one, contributions from all inverse branches must be added; ignoring the negative branch for a squared symmetric variable would lose half the probability.

A joint distribution describes several variables together. Marginalization sums or integrates out variables not needed. With a joint density $f_{X,Y}$, $f_X(x)=\int f_{X,Y}(x,y)dy$. A conditional density where $f_X(x)>0$ is $f_{Y\mid X}(y\mid x)=f_{X,Y}(x,y)/f_X(x)$. This is not the elementary ratio $P(Y=y,X=x)/P(X=x)$, whose denominator is zero for a continuous $X$. Conditional densities extend the idea appropriately.

<a id="lesson-36"></a>
## Session 36 — Expectation, variance, covariance, and conditional expectation

### Averages weighted by a model

For a discrete variable, $\mathbb E[X]=\sum_xxp_X(x)$ when the sum is well defined. For a variable with density, use $\int xf_X(x)dx$. Absolute integrability is a clean sufficient condition for a finite expectation. A symmetric density does not guarantee a finite mean; heavy tails can make the positive and negative parts diverge separately.

More generally,

$$
\mathbb E[g(X)]=\sum_xg(x)p_X(x)
\quad\text{or}\quad
\int g(x)f_X(x)dx.
$$

This lets us average a transformed quantity without first deriving its entire distribution. Expectation is linear whether or not variables are independent. For the two-indicator count $X=I_1+I_2$, $\mathbb E[X]=\mathbb E[I_1]+\mathbb E[I_2]$. An indicator has expectation equal to its event probability, since it is one on the event and zero elsewhere.

Variance measures squared spread around the mean:

$$
\operatorname{Var}(X)=\mathbb E[(X-\mu)^2]
=\mathbb E[X^2]-\mu^2.
$$

The second identity follows by expanding the square and using linearity with $\mathbb E[X]=\mu$. Standard deviation is its square root and has the original variable's units. Variance has squared units. Adding a constant changes the mean but not variance; multiplying by $a$ multiplies variance by $a^2$.

Covariance is $\operatorname{Cov}(X,Y)=\mathbb E[(X-\mu_X)(Y-\mu_Y)]$. Expanding a sum gives

$$
\operatorname{Var}(X+Y)=\operatorname{Var}(X)+\operatorname{Var}(Y)+2\operatorname{Cov}(X,Y).
$$

Independence implies zero covariance when second moments exist, because expectations of products factor. The converse is false. For symmetric $X$ uniform on $[-1,1]$, let $Y=X^2$. Symmetry gives $\mathbb E[X]=\mathbb E[X^3]=0$, hence covariance zero. Yet $Y$ is completely determined by $X$.

Correlation divides covariance by both positive standard deviations. It lies in $[-1,1]$ by Cauchy–Schwarz applied to centered random variables. It measures normalized linear association, not every form of dependence. It is undefined when either variance is zero.

For a random vector $X$, covariance is the matrix $\Sigma=\mathbb E[(X-\mu)(X-\mu)^\top]$. It is symmetric PSD because $v^\top\Sigma v=\operatorname{Var}(v^\top X)\ge0$. Thus Chapter 4's eigenvalue geometry describes distributions too. Under a fixed affine transformation $Y=AX+b$, $\mathbb E[Y]=A\mu+b$ and $\operatorname{Cov}(Y)=A\Sigma A^\top$.

### Conditional expectation is a prediction function

For discrete $Z$, $m(z)=\mathbb E[X\mid Z=z]$ is the average outcome within a conditioned group. The random quantity $m(Z)$ selects the appropriate average once the group is observed. The law of total expectation says $\mathbb E[\mathbb E[X\mid Z]]=\mathbb E[X]$. For finite groups, the proof expands the outer weighted sum and recovers the ordinary marginal expectation by total probability.

The law of total variance is

$$
\operatorname{Var}(X)=\mathbb E[\operatorname{Var}(X\mid Z)]
+\operatorname{Var}(\mathbb E[X\mid Z]).
$$

To derive it, write $X-\mu=(X-m(Z))+(m(Z)-\mu)$ and square. The cross term has expectation zero because $\mathbb E[X-m(Z)\mid Z]=0$. The two remaining terms are within-group variation and variation between group means. This decomposition is the conceptual foundation of several later statistical comparisons.

Conditional means also minimize squared prediction error. For any predictor $a(Z)$ and finite second moments,

$$
\mathbb E[(X-a(Z))^2]
=\mathbb E[(X-m(Z))^2]+\mathbb E[(m(Z)-a(Z))^2].
$$

The same zero conditional cross term proves it. The first term is unavoidable given $Z$; the second is extra error from using a different predictor. This is a population result under the true distribution, not a claim that a finite fitted model can know that mean exactly.

### A joint table you can inspect completely

Suppose a population is divided by distant versus nearby route and late versus on-time delivery. Use the probabilities from the earlier example: distant and late has mass 0.03; distant and on-time has mass 0.07; nearby and late has mass 0.045; nearby and on-time has mass 0.855. These four nonnegative masses sum to one and specify the entire joint model.

Marginalization adds across the unwanted distinction. Adding the distant cells gives 0.10, while adding the late cells gives 0.075. Conditioning on lateness divides the two late cells by their total, producing 0.4 and 0.6. Conditioning on distance instead divides by the appropriate route total and returns the original late rates of 0.30 and 0.05.

The table also lets us check independence directly. If distance category and lateness were independent, their joint late-and-distant mass would be 0.10 times 0.075, or 0.0075. The actual mass 0.03 differs, so they are dependent. This is an algebraic conclusion about the stated model, not a causal explanation of why delays occur.

A useful habit is to reconstruct joint probabilities from whichever conditional and marginal quantities are given. A conditional number by itself is often ambiguous because its reference population is hidden in prose. A joint table forces the denominator and exhaustive cases into view. For more than two variables the same idea becomes a multidimensional table or a factorized probabilistic model.

### Independence and identical distribution are separate assumptions

Repeated observations are identically distributed when each has the same marginal distribution. They are independent when their joint distribution factors. Neither property implies the other. Two consecutive copies of one fair coin result have identical fair marginals but are perfectly dependent. Two independent coin flips with different success probabilities are independent but not identically distributed.

The abbreviation iid requires both. A sampling theorem may use identical distribution to establish a common mean or variance and independence to remove covariance terms or factor expectations. If one assumption changes, inspect the proof rather than assuming the same conclusion survives unchanged.

In real datasets, deliveries from the same route, driver, or day can share conditions. Treating them as independent may underestimate uncertainty about an average. The sample size records how many rows were observed; it does not automatically count independent pieces of information. Later resampling and evaluation procedures must reflect that structure.

### Expected loss connects probability to choosing a prediction

Fix observed features and let the outcome remain uncertain. For a proposed scalar prediction a, expected squared loss is the average of the squared difference between the outcome and a. Adding and subtracting the conditional mean separates this expected loss into conditional variance plus the square of a minus that mean. Since only the second term depends on a, the conditional mean is the best squared-error prediction.

Now change the loss to absolute error. The best prediction becomes a conditional median, because moving the prediction slightly right decreases costs for outcomes to the right and increases them for outcomes to the left. A balance occurs when neither side has more than half the probability. For a discrete distribution there can be a whole interval of optimal medians.

For a binary classification decision with equal error costs, choose the more probable class. With unequal costs, the threshold shifts: declaring a positive class should depend on the relative cost of false positives and false negatives, not only on which probability exceeds one-half. The probability model and the decision loss are separate ingredients.

This distinction explains why a calibrated probability can support several decisions. One application may tolerate missed positives but not false alarms, while another has the opposite costs. The underlying posterior probability need not change; the rule converting it into an action can. Our mathematical focus is how expected loss combines those ingredients, without assuming a particular application's cost structure.

### Why a conditional mean can remain uncertain after fitting

The true conditional mean is a property of the population distribution. A learned regression function is an estimate based on finite observations and a restricted model family. Even if squared loss is appropriate, the learned function can differ from that mean because of approximation limits, sampling variability, or incomplete optimization.

These three causes produce different remedies. A richer family may reduce approximation error; more independent representative data may reduce sampling variability; a better numerical procedure may reduce optimization error. Changing the optimizer cannot repair a family that excludes the true pattern, and collecting repeated near-duplicate observations may add less information than expected.

Probability makes these distinctions precise enough to test. We can write a synthetic data-generating distribution, know its true conditional mean, fit a deliberately restricted model, and compare errors across independent samples. The final project uses exactly that transparent setup so theoretical quantities have a concrete interpretation.

### A finite distribution in executable form

```python
outcomes = [0, 1, 2]
probabilities = [0.25, 0.50, 0.25]
mean = sum(x * p for x, p in zip(outcomes, probabilities))
variance = sum((x - mean) ** 2 * p
               for x, p in zip(outcomes, probabilities))
prior_distant = 0.10
late_probability = 0.30 * prior_distant + 0.05 * (1 - prior_distant)
posterior_distant = 0.30 * prior_distant / late_probability
print(mean, variance)
print(late_probability, posterior_distant)
```

The mean is one, variance one-half, total late probability $0.075$, and posterior distant-route probability $0.4$, up to representation rounding. The probability companion exposes prior and conditional rates, computes the implied population counts and posterior, and explains the denominator. Setting evidence probability to zero produces an undefined-condition message rather than an invented posterior.

For optional practice, change the distant-route prior to one percent while keeping both conditional late rates. The posterior becomes $0.003/(0.003+0.0495)\approx0.05714$. A rare route can account for only a small share of late deliveries even when its conditional late risk is much higher. The arithmetic makes the base-rate effect visible.

Probability now gives us a coherent language for outcomes, conditioning, distributions, and weighted averages. The next chapter introduces reusable distribution families and the theorems connecting repeated samples to population quantities. Each family will be chosen because its assumptions describe a data-generating mechanism, rather than because its name is familiar.

[Previous chapter](08-optimization.md) · [Curriculum](../CURRICULUM.md) · [Next chapter](10-distributions-and-sampling-limits.md)
