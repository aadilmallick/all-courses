# 5. Probability and random variables

## 5.1 Uncertainty needs a specified experiment

Suppose a position gains 20 dollars in one scenario and loses 10 in another. Is it attractive? We cannot answer without describing the scenario probabilities, the money committed, the investor's preferences, and the possibility that the scenario model is incomplete. Probability supplies a language for weighting outcomes. It does not discover the correct weights by definition. In a fair coin experiment, symmetry may justify equal weights; in financial forecasting, weights must be estimated, assumed, or inferred under a model.

A probability model consists of a sample space, a collection of events, and a probability assignment. The sample space Omega contains possible outcomes. An event is a set of outcomes to which the model assigns probability. A probability measure P assigns values between zero and one, gives the full sample space probability one, and is countably additive over disjoint events. Countable additivity means the probability of a union of disjoint events equals the sum of their probabilities, even for a countably infinite collection.

For one fair six-sided die, Omega = {1, 2, 3, 4, 5, 6}; each singleton has probability 1/6. The event “even” has probability 3/6. For a continuous price model, Omega can be much larger, and the chosen event collection, called a sigma-algebra, is required to contain complements and countable unions. The purpose is to make probability operations coherent. We do not need advanced measure theory to compute the examples, but stating the structure prepares us for information sets in stochastic processes.

An event's complement has probability 1 − P(A). If A and B overlap, P(A union B) = P(A) + P(B) − P(A intersection B). The subtraction prevents counting the overlap twice. A table or Venn diagram can help, but the identity follows by partitioning the events into disjoint pieces. This small argument is a model of probability reasoning: identify disjoint cases, assign weights, and add.

## 5.2 Counting is useful when outcomes are equally likely

If a finite experiment has equally likely outcomes, an event's probability is its count divided by the total count. “Equally likely” is an assumption, not a consequence of writing a list. For two fair independent coins, the four ordered outcomes HH, HT, TH, TT each have probability 1/4. The three unordered categories “zero, one, two heads” are not equally likely: their probabilities are 1/4, 1/2, and 1/4.

The multiplication rule for counting says that if one stage has m options and the next has n options for every first-stage choice, there are mn ordered possibilities. A permutation of n distinct objects has n! arrangements, where n! = n(n − 1)…1. A combination selecting k objects without order has count n!/[k!(n − k)!]. Division by k! removes the orderings of the selected objects; division by (n − k)! removes orderings of those not selected.

Choosing two assets from four gives six unordered pairs. Choosing a first and second asset gives twelve ordered pairs. Which count applies depends on whether roles differ. Counting errors often come from switching between ordered and unordered descriptions halfway through a calculation. Write one concrete outcome before writing a factorial formula.

Sampling without replacement creates dependence. If a box contains three red and two blue balls, the probability of two reds without replacement is (3/5)(2/4) = 3/10. With replacement it is (3/5)² = 9/25. The first draw changes the second draw's distribution only in the first experiment. The language “independent observations” therefore describes a substantive sampling assumption.

## 5.3 Conditioning updates the relevant population

For P(B) > 0, conditional probability is P(A given B) = P(A intersection B)/P(B). Conditioning restricts attention to B and renormalizes its probability to one. It does not by itself express causation. The probability of carrying an umbrella given rain differs from the effect of making someone carry an umbrella on the weather.

Imagine 1,000 hypothetical events. A signal is associated with a genuine opportunity in 10 of them. It fires for eight of those ten and for 99 of the other 990. Among the 107 signal firings, only eight correspond to genuine opportunities. Thus the probability of an opportunity given a firing is 8/107, approximately 7.48%, even though the signal's sensitivity is 80%. Low base rates can dominate an apparently impressive detector.

Bayes' rule follows by writing the same joint probability in two orders:

$$P(A\mid B)=\frac{P(B\mid A)P(A)}{P(B)},\qquad P(B)>0.$$

If cases A_i partition the sample space, the denominator is sum P(B given A_i)P(A_i), the law of total probability. In the signal example it is 0.8 × 0.01 + 0.1 × 0.99 = 0.107. Bayes' rule is ordinary probability bookkeeping. Bayesian statistical inference later treats unknown parameters within a probability model and uses the same identity.

Independence of events means P(A intersection B) = P(A)P(B). When P(B) > 0 this is equivalent to P(A given B) = P(A). Pairwise independence of several events does not guarantee joint independence. For two fair coin bits X and Y and their exclusive-or Z, each pair is independent, yet knowing X and Y determines Z. This counterexample explains why assumptions about an entire collection cannot always be checked one pair at a time.

## 5.4 Random variables describe measurable outcomes

A random variable X assigns a number to each outcome in a way compatible with the event collection. For a die, X might be the face value or a payoff such as 10 if the face is six and −2 otherwise. Different random variables can describe the same underlying experiment. “Random” refers to uncertain outcome selection under the model, not to a variable changing mysteriously without a defined experiment.

The cumulative distribution function F(x) = P(X ≤ x) describes the entire one-dimensional distribution. It is nondecreasing, tends to zero at negative infinity and one at positive infinity, and is right-continuous. A discrete variable has probability masses p(x) = P(X = x). A continuous variable with density f has interval probabilities obtained by integrating f. Some distributions mix discrete masses and continuous components.

For a uniform variable on [0, 1], density is one inside the interval and zero outside. The probability of [0.2, 0.5] is 0.3. Each exact point has probability zero, but the variable must take some value. There is no contradiction: countable additivity concerns countable unions, whereas the interval contains uncountably many points. A zero probability event is not always logically impossible in a continuous model.

A quantile at level alpha is commonly defined as inf{x: F(x) ≥ alpha}. This definition handles jumps and nonunique inverses. A median is a 0.5 quantile. Quantile conventions in finite samples can differ because interpolation is a software choice. When comparing risk metrics, match the mathematical definition and the empirical implementation.

## 5.5 Expectation and variance from weighted sums

For a discrete variable, expectation is E[X] = sum x p(x), when the relevant integrability condition holds. For a density, it is integral x f(x)dx. Expectation is a probability-weighted average, not necessarily a possible realized value. A fair die has expectation 3.5 although it never lands on 3.5.

For a payoff +20 with probability 0.4 and −10 with probability 0.6, expected payoff is 8 − 6 = 2 dollars. The deviations from the mean are 18 and −12. Variance is the weighted mean squared deviation: 0.4 × 18² + 0.6 × 12² = 216 dollars squared. Standard deviation is sqrt(216), approximately 14.697 dollars. Positive expected payoff coexists with substantial loss probability.

Linearity gives E[aX + bY] = aE[X] + bE[Y] for integrable variables, whether or not they are independent. Variance behaves differently:

$$\operatorname{Var}(aX+bY)=a^2\operatorname{Var}(X)+b^2\operatorname{Var}(Y)+2ab\operatorname{Cov}(X,Y).$$

Covariance is E[(X − E[X])(Y − E[Y])]. Independence implies zero covariance when the moments exist, but zero covariance need not imply independence. If X is uniform on [−1, 1] and Y = X², symmetry gives E[X] = E[X³] = 0, hence covariance zero. Yet Y is completely determined by X. Linear association misses this nonlinear dependence.

Correlation divides covariance by the product of positive standard deviations. It is dimensionless and lies between −1 and 1 by Cauchy–Schwarz. If a variance is zero, the usual correlation is undefined. Changing a variable's unit by a positive factor does not change correlation, but it changes covariance. Neither correlation nor covariance fully specifies a joint distribution except in special distribution families.

## 5.6 Common distributions and their mechanisms

A Bernoulli variable is one with success probability p and zero otherwise. Its expectation is p and variance p(1 − p). A sum of n independent identically distributed Bernoulli variables is binomial, with mean np and variance np(1 − p). The binomial probability of k successes is the combination count times p^k(1 − p)^(n−k). The count handles which trials succeed; independence supplies the product probability.

A Poisson variable counts events under a specified arrival model and has probability e^(−lambda)lambda^k/k! for nonnegative integer k. Its mean and variance are lambda. A constant-rate Poisson process additionally assumes independent increments and Poisson counts proportional to interval length. Market events can cluster, so equal mean and variance or independent increments should be tested rather than assumed because the formula is convenient.

An exponential waiting time with rate lambda > 0 has survival probability P(T > t) = e^(−lambda t) for t ≥ 0 and mean 1/lambda. Its memoryless property follows from P(T > s + t given T > s) = e^(−lambda t). This is a special structural assumption. A waiting-time distribution can have the same mean without being memoryless.

A normal variable with mean mu and variance sigma² has density proportional to exp[−(x − mu)²/(2sigma²)]. Standardization Z = (X − mu)/sigma gives mean zero and variance one. Normal models are useful for sums, approximation, and conditional calculations. They assign positive probability to arbitrarily extreme positive and negative values; using them for quantities constrained to be positive needs care.

If log X is normal, X is lognormal and positive. If log X has mean m and variance s², E[X] = exp(m + s²/2). Exponentiating the mean log value alone gives the median exp(m), not the mean. This difference reflects convexity: rare large positive values pull the arithmetic mean upward. The relationship will reappear in geometric Brownian motion.

A Student t distribution has heavier tails than a normal distribution. For degrees of freedom nu, its mean exists for nu > 1 and variance for nu > 2; a familiar “center” parameter can exist even when a finite expectation does not. Moment existence is an assumption worth checking. If a model has infinite variance, procedures justified by finite-variance theory may fail even when a finite dataset produces a numerical sample variance.

## 5.7 Joint distributions and conditional expectation

A joint distribution gives probabilities for combinations of variable values. Marginalization sums or integrates out unwanted coordinates. For a two-variable density f(x, y), the marginal density of X is integral f(x, y)dy. Where the marginal is positive, the conditional density of Y given X = x is f(x, y)/f_X(x). This is the continuous counterpart of the conditional-probability ratio.

Conditional expectation E[Y given X] is a function of X giving the probability-weighted mean of Y in each information state. Suppose X labels two regimes: calm with probability 0.75 and stressed with probability 0.25. If mean payoff is 2 in calm and −4 in stressed, total expectation is 0.75 × 2 + 0.25 × (−4) = 0.5. This is the tower property: E[E[Y given X]] = E[Y].

The law of total variance separates within-state and between-state uncertainty:

$$\operatorname{Var}(Y)=E[\operatorname{Var}(Y\mid X)]+\operatorname{Var}(E[Y\mid X]).$$

To see why, write Y − E[Y] as [Y − E[Y given X]] + [E[Y given X] − E[Y]]. Squaring creates two squared terms and a cross term. The cross term has expectation zero because the first bracket has conditional mean zero given X. The identity explains why ignoring changes in regime means can understate total uncertainty.

Conditional expectation also gives the best squared-error prediction based on available information. For any candidate g(X), decompose Y − g(X) into Y − E[Y given X] plus E[Y given X] − g(X). The same orthogonality argument shows its mean squared error equals an irreducible term plus E[(E[Y given X] − g(X))²]. The latter is minimized at zero. Linear regression finds a best prediction within linear functions; conditional expectation permits all integrable functions with the required square moments.

## 5.8 Convergence, large numbers, and the central limit theorem

For independent identically distributed variables with finite mean, a law of large numbers states that their sample mean approaches the population mean under appropriate formulations. With finite variance sigma², the sample-mean variance is sigma²/n. Chebyshev's inequality gives P(|sample mean − mu| ≥ epsilon) ≤ sigma²/(n epsilon²). Thus averaging reduces uncertainty, but ten times greater precision requires roughly one hundred times as many independent observations.

The central limit theorem gives a distributional approximation: sqrt(n)(sample mean − mu)/sigma approaches a standard normal distribution under the familiar independent identically distributed finite-variance conditions. It does not say the original observations become normal, and it does not provide a universal sample size at which approximation is excellent. Skewness, heavy tails, dependence, and the tail probability being estimated all affect accuracy.

Convergence in probability means the probability of a deviation larger than any fixed positive tolerance tends to zero. Convergence in distribution concerns limiting cumulative probabilities at continuity points. Almost-sure convergence is stronger in a different sense: the pathwise convergence holds outside a probability-zero exceptional set. We will name the mode of convergence when it matters, particularly for quadratic variation and estimator theory.

Financial observations often violate independence. For a stationary sequence with autocovariance gamma(k), the variance of the sample mean is [n gamma(0) + 2 sum from k = 1 to n−1 of (n − k)gamma(k)]/n². Positive serial covariance can make uncertainty much larger than sigma²/n. Chapters 9 and 10 develop estimators that account for such dependence.

## 5.9 Bounds and nonlinear expectations

Markov's inequality states that for nonnegative X and a > 0, P(X ≥ a) ≤ E[X]/a. It follows because X is at least a on the event X ≥ a, so E[X] ≥ aP(X ≥ a). Applying it to (X − mu)² gives Chebyshev's inequality. These bounds may be loose, but they require much less distributional knowledge than a normal approximation.

Jensen's inequality states that for a convex function phi and an integrable variable under suitable expectation conditions, phi(E[X]) ≤ E[phi(X)]. Convexity means the graph lies below chords. For phi(x) = x², this becomes (E[X])² ≤ E[X²], equivalent to nonnegative variance. For phi(x) = e^x, it explains why exponentiating an average log return differs from averaging gross returns.

For concave ln on positive wealth, E[ln W] ≤ ln E[W]. This does not mean every investor should optimize expected log wealth; it identifies a mathematical relationship and a particular utility criterion. A gamble can raise expected wealth while reducing expected log wealth. For equal-probability gross wealth 0.5 and 1.5, expected gross wealth is one, while expected log wealth is one half ln(0.75), which is negative.

Tail dependence asks whether extremes occur together, a question correlation alone may not answer. Two joint distributions can share marginals and correlation while assigning different probabilities to simultaneous large losses. A copula is a representation of dependence separated from marginal distributions. At this stage, understand the modeling purpose; estimating a complex dependence model requires more data than fitting two means and a correlation, and its tail behavior can be weakly identified.

## 5.10 Simulation is probability made executable

A pseudorandom generator deterministically produces a sequence designed to mimic selected random properties. A seed makes a teaching experiment repeatable. To generate a Bernoulli variable from a uniform U on [0, 1), return one if U < p and zero otherwise. The interval below p has length p, so the generated success probability matches the requested value under the uniform idealization.

Inverse-transform sampling uses X = F^(−1)(U) with a suitable generalized inverse. For an exponential variable, solving u = 1 − e^(−lambda x) gives x = −ln(1 − u)/lambda. Special care near u = 1 avoids numerical issues. Normal generators use specialized algorithms rather than a simple elementary inverse. Prefer established library generators unless implementing one is itself the lesson.

A Monte Carlo estimate of E[g(X)] averages independent generated values g(X_i). If their variance is finite, estimated standard error is sample standard deviation divided by sqrt(n). The output should include the estimate, number of draws, standard error, seed, and sampling model. A small Monte Carlo standard error says little about whether the model for X resembles the market. Simulation error and model error are separate.

In the sampling laboratory, increase the number of draws and inspect the distribution of sample means. The plotted concentration illustrates the law of large numbers, while repeated sample means illustrate sampling distributions. A single sample's mean need not move monotonically toward the truth as you add observations. Convergence is a probabilistic statement, not a promise that every additional draw improves the realized estimate.

### Transformations need a change-of-variable factor

If X has a density and Y = g(X) is a differentiable strictly monotone transformation, probability conservation gives f_Y(y) = f_X(g_inverse(y)) times the absolute derivative of g_inverse(y). The derivative adjusts for how the transformation stretches intervals. Without it, the transformed density usually fails to integrate to one.

For X uniform on [0, 1] and Y = X², P(Y ≤ y) = P(X ≤ sqrt(y)) = sqrt(y) for y in [0, 1]. Differentiating gives density 1/(2sqrt(y)) on the open interval. The density becomes large near zero because squaring compresses many small X intervals into even smaller Y intervals. Its integral is still one. A density height exceeding one is therefore perfectly possible; probabilities are areas, not heights.

For a normal log price Z and S = exp(Z), the inverse is ln(S) and its derivative is 1/S. The lognormal density includes this 1/S factor. This is the continuous counterpart of carefully tracking units when changing variables. For nonmonotone transformations such as squaring a variable on all real numbers, several inverse branches can contribute and their densities must be added.

### Conditional independence is different from marginal independence

Suppose a hidden regime determines both trading volume and volatility. Conditional on the regime, the two variables might be independent, yet marginally they can move together because the regime shifts both. Conversely, conditioning on a variable influenced by two otherwise independent causes can create association between those causes. A joint-probability table can demonstrate both effects.

For a numerical example, let calm and stressed regimes each have probability one half. In calm, independent binary indicators A and B each equal one with probability 0.1; in stress, each equals one with probability 0.9. Marginal probabilities are both 0.5, but P(A = 1, B = 1) = 0.5 × 0.01 + 0.5 × 0.81 = 0.41, far above 0.25. The variables are conditionally independent within regimes and strongly associated overall.

This example explains why a dependence estimate can reflect common latent conditions. It also shows why stratifying a dataset changes the question. A model conditioned on an observable regime needs a rule for identifying that regime at decision time. Using a regime label assigned retrospectively can introduce future information.

### A tail probability is not a worst-case bound

Saying a loss exceeds 10 with probability 1% under a model does not cap the loss at 10. The remaining tail may contain much larger outcomes. A finite sample with no such event does not show the probability is zero. For independent trials with event probability p, the probability of observing no events in n trials is (1 − p)^n. With p = 0.01 and n = 100, it is about 36.6%.

Rare-event evidence is intrinsically limited. Before interpreting a tail estimate, inspect the number of effectively independent tail observations and the model's extrapolation beyond them. A smooth fitted distribution can produce precise-looking extreme quantiles from little information. Probability calculus makes the conditional calculation valid; it does not supply missing empirical support for the tail model.

### Expected loss and event probability are different summaries

Two positions can each lose money with probability 10% while having very different expected losses. One may lose one dollar in that event and the other one hundred. Conversely, a position with frequent small losses can have a positive expected payoff because of occasional large gains. Write both the event and its magnitude distribution before comparing risks.

This distinction also applies to classifier errors: a false-positive rate counts events, while decision loss weights their consequences. Probability supplies weights; a loss function supplies the cost of each outcome. Neither can be inferred from the other without additional assumptions.

## 5.11 Guided applications and sources

Suggested applications: compute the expected payoff and variance of a three-scenario position; use Bayes' rule for a signal with a 2% base rate, 70% sensitivity, and 5% false-positive rate; construct dependent uncorrelated variables; compare standard errors for independent and positively autocorrelated observations; explain why the average of simulated outcomes can be accurate under the wrong model. Hints: build a joint-probability table before conditioning; use a symmetric X and Y = X²; expand the variance of a sum rather than assuming covariance terms vanish.

For full foundational lectures, [Harvard Statistics 110](https://stat110.hsites.harvard.edu/) provides a legitimate free probability path and links to the authors' online book and practice materials. [MIT 18.642](https://ocw.mit.edu/courses/18-642-topics-in-mathematics-with-applications-in-finance-fall-2024/) supplies probability lectures connected to finance, while its [2013 predecessor](https://ocw.mit.edu/courses/18-s096-topics-in-mathematics-with-applications-in-finance-fall-2013/) supplies additional recordings. These resources complement one another; the embedded probability segment of a finance course is not a complete substitute for sustained foundational practice.

The next chapter reverses the direction of the question. Probability starts with a model and asks what data it might generate. Statistical inference starts with data and asks what claims about a model are justified. Keeping those directions distinct prevents an estimated parameter from being mistaken for a known truth.
