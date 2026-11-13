# 17. Variance, sampling, and tail bounds

An average alone does not describe reliability. Two tasks can have the same expected cost while one is nearly constant and the other occasionally becomes enormous. Source Chapter 20 develops deviation bounds, variance, random sampling, Chernoff bounds, load balancing, and a record-waiting paradox. We assume the probability and expectation definitions from Chapters 15 and 16.

## Markov's inequality

If $X\ge0$ and $a>0$, then

$$\Pr(X\ge a)\le\frac{\mathbb E[X]}a.$$

For every outcome, $X\ge aI_{\{X\ge a\}}$. Taking expectations preserves the inequality and gives $\mathbb E[X]\ge a\Pr(X\ge a)$. This proof identifies the nonnegativity requirement: without it, negative values could cancel large positive values in the mean.

If expected requests in a minute are twelve, Markov gives probability of at least sixty requests at most $12/60=0.2$. The bound does not need a detailed distribution. It can be sharp: take value sixty with probability $0.2$ and zero otherwise. A result using little information cannot generally promise a much stronger conclusion.

If $X\ge b$, apply Markov to $X-b$: for $a>b$, $\Pr(X\ge a)\le(\mathbb E[X]-b)/(a-b)$. For a variable bounded above, apply it to the nonnegative gap $M-X$ to bound the opposite tail. Translating a variable can turn a weak-looking theorem into the right tool.

## Variance and standard deviation

For finite second moment, define $\mu=\mathbb E[X]$ and

$$\operatorname{Var}(X)=\mathbb E[(X-\mu)^2].$$

Squaring prevents positive and negative deviations from cancelling. The standard deviation is $\sigma=\sqrt{\operatorname{Var}(X)}$, in the original units; variance has squared units. Expanding the square and using linearity gives $\operatorname{Var}(X)=\mathbb E[X^2]-\mu^2$.

A variable taking zero and two equally has mean one and variance one. A constant variable equal to one has the same mean and variance zero. A variable taking zero with probability $0.99$ and one hundred with probability $0.01$ also has mean one, but second moment one hundred and variance ninety-nine. Equal means can hide very different risks.

For constants $a,b$, $\operatorname{Var}(aX+b)=a^2\operatorname{Var}(X)$. Shifting changes the center but not deviations, and scaling multiplies each deviation by $a$. For Bernoulli $I$ with chance $p$, $I^2=I$, so variance is $p-p^2=p(1-p)\le1/4$.

For geometric $G$ counting trials through first success, the variance is $(1-p)/p^2$. One derivation conditions on the first trial to obtain a recurrence for $\mathbb E[G^2]$, using finiteness justified by the geometrically decaying tails. With $q=1-p$,

$$\mathbb E[G^2]=p+q\mathbb E[(1+G)^2]
=1+2q/p+q\mathbb E[G^2],$$

so $\mathbb E[G^2]=(2-p)/p^2$; subtracting $1/p^2$ gives the variance. At $p=1$, the variance is zero as expected.

## Chebyshev's inequality

Apply Markov to $(X-\mu)^2$. For $t>0$,

$$\Pr(|X-\mu|\ge t)\le\frac{\sigma^2}{t^2}.$$

Equivalently, probability of at least $k$ standard deviations is at most $1/k^2$ when $\sigma>0$. This is a general bound, not the tighter familiar percentages associated with a normal distribution. No bell-shaped assumption is made.

If mean cost is one hundred and variance twenty-five, then $\Pr(|X-100|\ge20)\le25/400=1/16$. A one-sided event such as $X\ge120$ is contained in the two-sided event and obeys the same upper bound, though a specialized one-sided inequality may improve it. Finite variance is required; a heavy-tailed variable may lack it.

## Covariance and sums

Define $\operatorname{Cov}(X,Y)=\mathbb E[(X-\mathbb E[X])(Y-\mathbb E[Y])]$. Expanding gives $\mathbb E[XY]-\mathbb E[X]\mathbb E[Y]$. Then

$$\operatorname{Var}\left(\sum_iX_i\right)
=\sum_i\operatorname{Var}(X_i)+2\sum_{i<j}\operatorname{Cov}(X_i,X_j).$$

Independence implies zero covariance when moments exist. Pairwise independence therefore suffices to add variances, while linearity of expectation needed no independence. Zero covariance does not in general imply independence; it describes only one product moment.

If $Y=X$, then $\operatorname{Var}(X+Y)=4\operatorname{Var}(X)$, not twice the variance. If $Y=-X$, the sum is constant and has variance zero. These cases show why ignoring covariance can err in either direction.

Birthday-pair indicators offer a subtle example. Distinct pair indicators are pairwise independent under independent uniform birthdays, including pairs sharing one person: both equalities among three people have probability $1/m^2$. Thus the variance of the number of matching pairs is $\binom k2(1/m)(1-1/m)$. The entire indicator collection is not mutually independent, since two equalities can force a third.

## Estimation by random sampling

Let $X_1,\ldots,X_n$ be independent Bernoulli observations with common unknown probability $p$. Their sample mean $\hat p=(1/n)\sum_iX_i$ has expectation $p$ and variance $p(1-p)/n\le1/(4n)$. Chebyshev gives

$$\Pr(|\hat p-p|\ge\varepsilon)\le\frac1{4n\varepsilon^2}.$$

To make this at most $\delta$, it suffices that $n\ge1/(4\delta\varepsilon^2)$. For error $0.05$ and failure probability at most $0.05$, the sufficient size is two thousand. This is conservative and distribution-free within the Bernoulli independence model.

The sample size does not depend directly on the population size when sampling independently from a population distribution. Bias in who can be sampled is not fixed by increasing $n$. A convenience sample of ten million users can still misrepresent a different target population. Sampling without replacement introduces dependence; finite-population corrections can improve variance, but require a clearly specified sampling design.

Pairwise independent samples preserve the variance calculation and Chebyshev guarantee even without full mutual independence. This can save randomness in algorithm design. It does not automatically permit applying every stronger concentration inequality.

## Confidence and coverage

The bound above implies the interval $[\hat p-\varepsilon,\hat p+\varepsilon]$, clipped to $[0,1]$, contains fixed $p$ in at least $1-\delta$ of repetitions of the sampling procedure. After one sample, the parameter is fixed in this frequentist model; the randomness lies in the interval produced. Interpreting it as a posterior probability for $p$ requires an additional prior model.

A guarantee of failure probability $0.05$ is not permission to repeatedly rerun a study until an attractive answer appears while still reporting the original single-run guarantee. Selection and stopping change the experiment. Likewise, inspecting many subgroups creates a collection of potential failures; the union bound accounts for multiplicity if each event has a valid bound.

## Exponential bounds from exponential moments

For $\lambda>0$, Markov applied to $e^{\lambda X}$ gives

$$\Pr(X\ge a)\le e^{-\lambda a}\mathbb E[e^{\lambda X}].$$

This is the Chernoff method. Choosing $\lambda$ well trades the threshold factor against the exponential moment. If $X$ is a sum of independent variables, the exponential moment factors, because $e^{\lambda\sum_iX_i}=\prod_i e^{\lambda X_i}$. This is where independence enters the proof.

For independent Bernoulli $X_i$ with means $p_i$, let $X=\sum_iX_i$ and $\mu=\sum_i p_i$. Then

$$\mathbb E[e^{\lambda X}]
=\prod_i(1-p_i+p_ie^\lambda)
\le\exp(\mu(e^\lambda-1)),$$

using $1+u\le e^u$. At threshold $(1+\eta)\mu$, choose $\lambda=\ln(1+\eta)$ to obtain

$$\Pr(X\ge(1+\eta)\mu)
\le\left(\frac{e^\eta}{(1+\eta)^{1+\eta}}\right)^\mu.$$

For $0<\eta\le1$, a convenient weaker form is $\exp(-\mu\eta^2/3)$. A corresponding lower-tail bound is $\Pr(X\le(1-\eta)\mu)\le\exp(-\mu\eta^2/2)$ for $0<\eta<1$. The constants differ because the bounding logarithmic inequalities differ. State the range of $\eta$ before choosing a simplified version.

## Comparing bounds and load balancing

For a sum of independent Bernoulli variables with mean one hundred, Markov bounds $\Pr(X\ge150)$ by $2/3$. Since variance is at most one hundred, Chebyshev bounds it by $100/50^2=0.04$. The Chernoff upper-tail form with $\eta=0.5$ gives at most $e^{-100(0.25)/3}\approx0.0002404$. The stronger conclusion uses stronger structural information, not a contradiction between the theorems.

In randomized load balancing, independently assign $m$ jobs uniformly among $b$ servers. A fixed server's load is binomial with mean $\mu=m/b$. A tail bound for one server does not directly bound the maximum load. Apply the union bound over servers: if each exceeds a threshold with probability at most $\delta/b$, then the chance that any server exceeds it is at most $\delta$.

For $m=10{,}000,b=100$, mean load is one hundred. At threshold 150, the simplified Chernoff bound per server is about $0.0002404$, so the chance any server reaches that threshold is at most about $0.02404$. These are sufficient upper bounds, not exact probabilities. Correlated assignments or unequal job sizes require a different model.

## A useful additive sampling bound

For independent variables in $[0,1]$ with common mean $p$, Hoeffding's inequality gives $\Pr(|\hat p-p|\ge\varepsilon)\le2e^{-2n\varepsilon^2}$. This is a convenient additional concentration theorem, stated with its assumptions. It yields sufficient $n\ge\ln(2/\delta)/(2\varepsilon^2)$. For $\varepsilon=0.05,\delta=0.05$, rounding up gives 738, much smaller than the conservative Chebyshev size two thousand.

We include it to connect sampling practice with the exponential-moment method, not to replace the source's Chernoff treatment. Its proof uses a bounded-variable exponential-moment lemma beyond the Bernoulli derivation shown above. A formula that needs an unproved auxiliary theorem is identified as such.

## Many opportunities for failure

For mutually independent events $A_i$, the chance none occurs is $\prod_i(1-p_i)\le e^{-\sum_i p_i}$. If the expected number of occurrences is ten, the probability of none is at most $e^{-10}$. This is the source's mathematical version of “Murphy's law”: many small independent risks can accumulate into a high chance that something happens.

Without independence the product step fails. If all events are the same event with probability $0.01$, summing their probabilities a thousand times gives ten but the chance none occurs remains $0.99$. The expectation of the count is still ten by linearity; the tail behavior differs radically. This example puts the role of independence in sharp focus.

## Record waiting and infinite means

Let an initial fair-coin run have $K$ tails before its first head. Then $\Pr(K=k)=2^{-(k+1)}$. After observing $K=k$, start independent trials, each trying to produce $k+1$ tails before a head. Each attempt succeeds with probability $2^{-(k+1)}$, so the expected number of attempts through success is $2^{k+1}$.

Average over the initial run:

$$\mathbb E[\text{attempts}]=\sum_{k\ge0}2^{k+1}2^{-(k+1)}=\infty.$$

Counting failed attempts instead subtracts one conditionally, leaving an infinite unconditional mean. For each fixed finite $k$, eventual success has probability one, and the initial $K$ is finite almost surely. Nevertheless the mixed waiting-time mean is infinite. The precise fee convention can change a finite additive constant, but not the divergence.

## A bound for a shifted variable

Suppose a nonnegative task cost is always at least five and has mean seven. Markov applied directly bounds the probability of cost at least fifteen by seven fifteenths. Apply it instead to $X-5$, whose mean is two, at threshold ten. The resulting upper bound is one fifth, much stronger. The lower endpoint supplied useful information that the direct application ignored.

If the assumed lower bound were incorrect, the shifted variable could be negative and the proof would fail. This is a reminder that sharpening a bound is not merely algebraic cleverness: it requires a valid additional fact about the distribution. If all we know is a mean, a supposedly better universal tail bound may be disproved by a two-point distribution.

## Estimating a mean of bounded costs

Suppose independent sampled costs lie between ten and thirty. Normalize with $Y=(X-10)/20$, so $Y$ lies in $[0,1]$. An error of one unit in estimating the mean of $X$ is an error of $1/20$ in estimating the mean of $Y$. A bounded-variable concentration bound can then be applied on the normalized scale and translated back. State the units before choosing an error tolerance.

Using an absolute tolerance as though it were a relative percentage changes the question. An error of one is five percent of a mean of twenty but fifty percent of a mean of two. A relative-error Chernoff bound depends on the mean scale, while an additive bounded-variable bound uses the interval width. The two formulas answer related but distinct accuracy requirements.

## A direct Chernoff optimization example

For a binomial variable with mean twenty and threshold forty, set $\eta=1$. The unsimplified Chernoff expression is $(e/4)^{20}$. Its logarithm is $20(1-2\ln2)$, approximately negative 7.7259, yielding a bound around 0.000441. The simplified expression $e^{-20/3}$ is larger, around 0.001273. Both are valid upper bounds; the simpler version sacrifices sharpness for convenience.

An implementation should not accidentally report a lower numerical approximation as a proved upper bound after rounding. Display enough digits or round conservatively when the distinction matters. The companion labels its decimal values as numerical evaluations of theoretical expressions and separately computes exact finite binomial sums to floating-point precision. It does not claim symbolic exactness for transcendental decimal outputs.

## Why pairwise independence is enough for one calculation

The variance expansion contains only single-variable square terms and two-variable cross terms. Therefore pairwise independence eliminates every covariance appearing in that particular expansion. The exponential moment of a sum, however, contains a product involving the whole collection. Factoring that product generally needs mutual independence. The needed assumption follows from the algebraic structure of the proof, not from a general ranking in which one theorem is simply “more probabilistic” than another.

The XOR example makes this visible. Three pairwise independent fair bits have a sum with the same mean and variance as three mutually independent fair bits, but not the same full distribution. Under the XOR construction, not all eight bit triples occur. A tail bound derived from the full independent-product moment cannot be imported solely because the first two moments agree.

## A simulation can miss a rare tail

If an event has probability one in a million, a thousand simulated trials are likely to observe zero occurrences. The resulting empirical frequency zero does not prove the event impossible. Exact enumeration or a valid analytical bound may be more informative than increasing a small simulation slightly. Conversely, observing one rare event in a small run does not establish a reliable estimate of its true rate.

Seeded simulations are reproducible examples, not additional independent evidence each time reset is clicked. Repeating the same seed reproduces the same observations. To study sampling variation, change the seed or run a larger declared collection of trials. The lab exposes this distinction so reproducibility does not accidentally become false confidence.

## From a single failure bound to a system claim

Suppose each of fifty components has a modeled failure probability at most one thousandth during a specified interval. The union bound gives system probability of at least one failure at most five percent, even if failures are dependent. If the failures are independent and all probabilities are exactly one thousandth, the exact probability is one minus $0.999^{50}$, slightly below five percent. The exact product needs assumptions the union bound did not need.

This example connects the chapter's tools. A mean count of failures is the sum of component probabilities by linearity. Markov applied to that count gives the union bound for at least one failure. Independence can then sharpen the answer through a product. Several apparently different formulas are instances of the same underlying relationship between indicators, counts, and events.

An inequality can remain valid while becoming numerically useless. Chebyshev with a threshold smaller than the standard deviation may produce an upper bound above one. Reporting the minimum of that expression and one preserves validity and communicates the lack of useful information. A negative bound, by contrast, signals a parameter or algebra error. The laboratory checks these elementary constraints before presenting a result.

For every concentration theorem, keep three items together: the event being bounded, the distributional assumptions, and the numerical expression. Separating them invites applying an attractive formula to a different event or a dependent process. A concise correct answer can include all three without reproducing the theorem's whole proof.

An applicable but loose bound is useful evidence about the theorem's information requirements. It is not an arithmetic failure that every bound differs from the exact probability.

## Practice and companion

The tail-bound lab shows exact binomial tails beside Markov, Chebyshev, and applicable Chernoff bounds, capped at one. It distinguishes exact probabilities from inequalities and rejects invalid parameters. The sampling lab computes sufficient sample sizes under the stated assumptions.

**17-A.** Derive Markov from the indicator inequality. **17-B.** Find the mean and variance of a Bernoulli variable with $p=1/4$. **17-C.** Use Chebyshev with variance nine to bound deviation at least twelve. **17-D.** Find the conservative sample size for $\varepsilon=0.1,\delta=0.05$. **17-E.** Explain why correlated server assignments can invalidate a binomial tail model. **17-F.** Explain the infinite mean in the record-waiting example despite eventual success.
