# 11. Statistical inference: learning from a finite dataset

This chapter contains outline lessons 41–44. You need likelihood-related products, expectation, sampling distributions, Gaussian and beta models, and the distinction between an observed value and a random variable. Our central problem is estimating an unknown feature of a data-generating process without treating one finite sample as the whole population.

<a id="lesson-41"></a>
## Session 41 — Estimators, bias, variance, consistency, and identifiability

### A procedure is random before it sees data

Suppose $X_1,\ldots,X_n$ are iid Bernoulli observations with unknown success probability $p$. The estimator $\widehat p=\bar X$ is a function of the random sample. After observing seven successes in ten trials, its realized estimate is $0.7$. The parameter $p$, estimator $\widehat p$, and estimate $0.7$ are different objects.

Bias is $\mathbb E_p[\widehat\theta]-\theta$, where the expectation is over repeated datasets at a fixed true parameter. For the Bernoulli sample mean, expectation equals $p$, so it is unbiased. Its variance is $p(1-p)/n$. Unbiasedness alone is not a quality guarantee: an estimator can fluctuate wildly while averaging to the correct value.

Mean squared estimation error decomposes as

$$
\mathbb E[(\widehat\theta-\theta)^2]
=\operatorname{Var}(\widehat\theta)+\operatorname{Bias}(\widehat\theta)^2.
$$

Write the difference as $(\widehat\theta-\mathbb E\widehat\theta)+(\mathbb E\widehat\theta-\theta)$ and expand. The cross term vanishes because the first part has mean zero. This is a decomposition across repeated training samples, distinct from the average prediction error within one training set.

For iid real observations with finite variance, the sample variance

$$
S^2=\frac1{n-1}\sum_i(X_i-\bar X)^2,\qquad n>1,
$$

is unbiased for population variance. To derive the denominator, use

$$
\sum_i(X_i-\bar X)^2
=\sum_i(X_i-\mu)^2-n(\bar X-\mu)^2.
$$

Expectation gives $n\sigma^2-n(\sigma^2/n)=(n-1)\sigma^2$. Dividing by $n$ instead creates downward bias, though that choice can still arise from maximum likelihood. A correction called “unbiased” depends on its target and sampling assumptions.

Consistency means an estimator approaches the true parameter as sample size increases, often in probability. The weak law proves consistency of the iid sample mean under its stated assumptions. An estimator can be biased for each finite sample and still consistent. For example, $(n/(n+1))\bar X$ has shrinking finite-sample bias and tends to the same population mean.

Identifiability asks whether distinct parameters imply distinct distributions. If a model only depends on $a+b$, then no amount of data can identify $a$ and $b$ separately without extra constraints. Estimation difficulty due to finite samples differs from structural nonidentifiability. A prior or penalty can select a particular representation, but it does not make the data alone distinguish equivalent distributions.

<a id="lesson-42"></a>
## Session 42 — Likelihood, maximum likelihood, and MAP

### Hold the observations fixed and vary the explanation

Given data $x$, likelihood is the joint probability mass or density viewed as a function of the model parameter: $L(\theta;x)=p_\theta(x)$. It is not a probability distribution over $\theta$ unless additional structure is supplied. In continuous models a density can exceed one; therefore a likelihood need not be bounded by one.

For $s$ successes in $n$ independent Bernoulli trials, ignoring factors constant in $p$,

$$
L(p)=p^s(1-p)^{n-s},\qquad
\ell(p)=s\ln p+(n-s)\ln(1-p).
$$

For $0<s<n$, differentiating gives $\ell'(p)=s/p-(n-s)/(1-p)$. Setting it to zero yields $s(1-p)=(n-s)p$, hence $\widehat p=s/n$. The second derivative is negative throughout $(0,1)$, giving a unique interior maximum. If every observation is a success or every one a failure, the constrained maximum occurs at the boundary one or zero; dividing by a boundary probability in the interior derivative is not valid.

For iid Gaussian observations with known variance, the log likelihood differs from $-\sum_i(x_i-\mu)^2/(2\sigma^2)$ only by constants independent of $\mu$. Maximizing it gives the sample mean. With both mean and variance unknown, the variance MLE divides the centered sum by $n$, while the unbiased estimator divides by $n-1$. Different optimization criteria can yield different finite-sample properties.

Maximum a posteriori estimation, MAP, maximizes likelihood times prior density. Equivalently, minimize negative log likelihood minus log prior, when these quantities are defined. A zero-mean Gaussian prior on coefficients contributes a squared-norm penalty; a Laplace prior contributes an absolute-value penalty. The scaling depends on noise variance, prior variance, and whether the likelihood is summed or averaged.

MAP is a point summary of a posterior, not the whole posterior distribution. It is also not generally invariant to reparameterization, because probability densities change by a Jacobian factor. Maximum likelihood is invariant under one-to-one parameter transformations in the ordinary sense of transforming its maximizer; posterior modes need not transform that way.

<a id="lesson-43"></a>
## Session 43 — Bayesian updating and predictive distributions

### Update a distribution rather than only a point

A Bayesian model treats an unknown parameter as a variable with a prior distribution. Bayes' rule gives

$$
p(\theta\mid x)=\frac{p(x\mid\theta)p(\theta)}{p(x)},\qquad
p(x)=\int p(x\mid\theta)p(\theta)d\theta.
$$

The denominator is the marginal probability or density of the observed data under the model. A proper prior integrates to one. An improper prior does not, and can sometimes produce a proper posterior, but that requires checking; we use proper priors in the worked examples.

For Bernoulli data and prior $p\sim\operatorname{Beta}(\alpha,\beta)$, multiply the powers in prior and likelihood:

$$
p(p\mid x)\propto p^{\alpha+s-1}(1-p)^{\beta+n-s-1}.
$$

The posterior is $\operatorname{Beta}(\alpha+s,\beta+n-s)$. This is conjugacy: the family is preserved by updating. The posterior mean is $(\alpha+s)/(\alpha+\beta+n)$. With a uniform beta prior and seven successes in ten observations, it is $8/12=2/3$, compared with the MLE $0.7$.

If both posterior shapes exceed one, its mode is $(\alpha+s-1)/(\alpha+\beta+n-2)$. That interior-mode formula must not be used when a shape is at most one; the density can peak at a boundary or have multiple boundary singularities. A memorized expression without its domain can produce an invalid estimate.

The posterior predictive probability of success on the next conditionally independent trial is

$$
P(X_{n+1}=1\mid x)=\int p\,p(p\mid x)dp
=\mathbb E[p\mid x].
$$

For several future trials, integrating a binomial likelihood against the beta posterior gives a beta-binomial count distribution. Future outcomes are independent conditional on $p$, but become dependent after integrating over shared parameter uncertainty. This is an important distinction between conditional independence and marginal independence.

For a normal mean with known observation variance $\sigma^2$ and prior $\mu\sim N(m_0,\tau_0^2)$, completing the square gives posterior precision and mean

$$
\tau_n^{-2}=\tau_0^{-2}+n\sigma^{-2},\qquad
m_n=\tau_n^2\left(m_0\tau_0^{-2}+n\bar x\sigma^{-2}\right).
$$

Precision is inverse variance. The mean is weighted by information from prior and data, and the posterior variance shrinks as independent observations accumulate. The next observation's predictive variance is $\sigma^2+\tau_n^2$, combining observation noise and uncertainty about the mean.

A credible interval contains a stated posterior probability under the model and prior. A 95 percent equal-tailed beta interval leaves posterior probability 2.5 percent in each tail. This is a probability statement about the parameter conditional on observed data within the Bayesian model. Its interpretation differs from a frequentist confidence interval even if numerical endpoints sometimes coincide.

<a id="lesson-44"></a>
## Session 44A — Confidence intervals and hypothesis tests

### Coverage is a property of a repeated procedure

A 95 percent confidence interval is a random interval construction whose coverage probability is 0.95 under stated sampling assumptions. Once a particular interval has been observed, the fixed frequentist parameter either belongs to it or does not. The 95 percent refers to the procedure over repetitions, not a newly assigned probability distribution on the fixed parameter.

For iid Gaussian observations with known $\sigma$, the statistic $(\bar X-\mu)/(\sigma/\sqrt n)$ is standard normal. Inverting its central 95 percent probability gives

$$
\bar X\pm1.959964\frac\sigma{\sqrt n}.
$$

When $\sigma$ is unknown and $n>1$, under iid Gaussian sampling the statistic $(\bar X-\mu)/(S/\sqrt n)$ has $t_{n-1}$ distribution. Replace the normal critical value by its t counterpart. Exact t coverage relies on Gaussian sampling; for other populations it is an approximation with validity depending on sample size and tail behavior.

For Bernoulli data, the elementary Wald interval $\widehat p\pm1.96\sqrt{\widehat p(1-\widehat p)/n}$ can perform poorly near boundaries or in small samples. Wilson's score interval is often a more reliable basic choice. For critical applications, choose a procedure justified for the design and required coverage rather than relying on a generic normal approximation. Here our focus is the mathematical distinction, not a domain-specific analysis recommendation.

A null hypothesis specifies a distribution or parameter restriction. A test statistic measures departure from it. A p-value is the null-model probability of a statistic at least as extreme as the observed one, with “extreme” defined by the test. It is not the probability the null is true and not the probability the result occurred by chance in every possible explanation.

For a two-sided normal mean test with known standard deviation, $z=(\bar x-\mu_0)/(\sigma/\sqrt n)$ and p-value $2[1-\Phi(|z|)]$. A significance threshold $\alpha$ controls type I error under the null for a valid test. Power is the chance of rejection under a specified alternative. A small p-value does not establish a large effect; large samples can detect tiny departures.

Repeatedly searching many hypotheses changes error rates. If $m$ valid tests each use level $\alpha/m$, the union bound limits the probability of any false rejection among true nulls to at most $\alpha$, without requiring test independence. This is Bonferroni control and can be conservative. Choosing tests after inspecting results or stopping when significance first appears requires procedures that account for that selection.

## Session 44B — Bootstrap, correlation, and ANOVA

### Approximate repeated sampling using the empirical distribution

The ordinary nonparametric bootstrap draws a size-$n$ sample with replacement from the observed $n$ values, recomputes a statistic, and repeats. It approximates the sampling distribution by replacing the unknown population with its empirical distribution. The bootstrap standard error is the standard deviation of the replicated statistics.

For observations $[8,10,12,14]$, one resample might be $[8,8,14,10]$, with mean ten. Many resamples produce a distribution of means. A percentile interval takes empirical quantiles of those means. It can be useful, but does not automatically provide exact coverage. Heavy tails, boundaries, nonsmooth estimators, and small samples can undermine it. Time series need resampling that respects dependence, such as appropriate blocks, rather than independent shuffling of individual observations.

Correlation estimates standardized linear association. A positive sample correlation between route distance and delivery time does not establish that changing distance alone causes the observed change: route conditions or other variables may influence both. A curved deterministic relation can also have zero linear correlation. Always distinguish a descriptive coefficient, a probabilistic dependence claim, and a causal intervention claim.

One-way analysis of variance, ANOVA, compares group means under a model with independent Gaussian errors and a common variance. With $G$ groups and total sample size $N>G$, define

$$
SS_B=\sum_g n_g(\bar x_g-\bar x)^2,\qquad
SS_W=\sum_g\sum_i(x_{gi}-\bar x_g)^2.
$$

The identity $SS_T=SS_B+SS_W$ follows by writing each deviation as within-group plus group-mean deviation; the within-group cross terms sum to zero. Under the null of equal group means and the model assumptions,

$$
F=\frac{SS_B/(G-1)}{SS_W/(N-G)}\sim F_{G-1,N-G}.
$$

The numerator and denominator compare between-group and within-group variation per degree of freedom. A significant result indicates some mean difference under the model, not which groups differ or why. Follow-up comparisons and unequal-variance designs need their own appropriate procedures.

### A confidence interval derivation you can reverse

Start from a standardized sample mean with a known normal sampling distribution. The central probability statement says that this random standardized error falls between two fixed critical values with probability 0.95. Multiply by the positive standard error, then rearrange the inequalities to place the unknown mean in the middle. The endpoints become random functions of the sample mean.

This inversion explains the frequentist interval. Before sampling, the endpoints move while the parameter stays fixed. After sampling, the observed endpoints are numbers. The coverage guarantee was about the random construction. This does not make the interval uninformative; it identifies exactly what kind of reliability the procedure supplies.

For unknown Gaussian variance, a random estimated standard error replaces the known one. The t distribution accounts for that additional randomness, producing wider critical values in small samples. Simply inserting an estimated standard deviation into the normal formula without changing the reference distribution discards that exact finite-sample adjustment.

A prediction interval for a new observation includes another noise contribution. Estimating a mean precisely does not make each new outcome nearly deterministic. Even with enormous sample size, a prediction interval retains the outcome's inherent variation, while an interval for the population mean can shrink. The normal posterior predictive example expresses the same distinction using Bayesian uncertainty.

### Likelihood values are relative evidence within a model

Suppose two Bernoulli probabilities are candidates after observing seven successes in ten trials. Comparing their likelihoods means comparing how much probability each candidate assigns to that observed data pattern. A likelihood ratio is meaningful for this comparison even though neither likelihood is a posterior probability of the candidate.

To turn candidate parameters into posterior probabilities, supply prior probabilities or a prior density and normalize over the parameter space. A candidate with a larger likelihood can still have a smaller posterior probability if its prior support is sufficiently lower. This is an explicit part of Bayesian modeling, not a correction that can be inferred from likelihood alone.

For continuous parameters, posterior density at one point is also not the posterior probability of that exact point. Probability attaches to intervals or regions through integration. A sharply peaked density can exceed one while integrating to one. This parallels the distinction between observation density and point probability from Chapter 9.

### Bootstrap uncertainty has two sample sizes

In a bootstrap calculation, the original dataset size determines how much information about the population is available. The number of bootstrap replications determines how accurately the resampling distribution is approximated computationally. Increasing replications from one thousand to one hundred thousand reduces Monte Carlo noise in quantiles, but it does not turn four original observations into a large informative dataset.

This distinction is easy to miss because both numbers describe loops or samples in code. One is a statistical information limit; the other is a numerical approximation budget. A very smooth bootstrap histogram can still be based on a poor empirical representation of the population.

For dependent observations, the ordinary bootstrap destroys the dependence by resampling entries independently. A block method can preserve local structure, but block size and the dependence assumptions matter. No resampling method automatically discovers the correct experimental unit. If multiple rows arise from the same person, route, or device, the resampling unit should reflect the inference question and data-generating design.

### Interpret a comparison before interpreting its p-value

Imagine two route policies with a statistically detectable difference in average delivery time. The estimated effect and its interval describe the magnitude and uncertainty in minutes. The p-value describes compatibility with a specified null under the sampling model. These summaries complement each other; none alone determines whether a policy change is useful.

If assignment to policies was not randomized, route difficulty may differ between groups. A difference in means can reflect that imbalance as well as the policy. The algebra of a t test or ANOVA cannot by itself establish causal identification. A causal conclusion needs a design or assumptions connecting group comparisons to an intervention.

Similarly, failing to reject equality does not prove equality. A small sample can yield an imprecise interval covering both negligible and substantial effects. An equivalence claim requires a meaningful tolerance and an appropriate procedure, rather than interpreting a large p-value as confirmation of no difference.

This chapter's procedures are models of inference whose assumptions are visible. The goal is to know what question a calculation answers, which sampling mechanism supports it, and what remains uncertain after its arithmetic is correct.

### A reproducible inference example

```python
import numpy as np
from scipy import stats

observed = np.array([8., 10., 12., 14.])
n = observed.size
mean = observed.mean()
standard_error = observed.std(ddof=1) / np.sqrt(n)
critical = stats.t.ppf(0.975, df=n - 1)
interval = mean + np.array([-1., 1.]) * critical * standard_error
posterior_mean = (1 + 7) / (1 + 1 + 10)
print(mean, standard_error)
print(interval)
print(posterior_mean)
```

The sample mean is eleven and standard error approximately $1.290994$. The t interval is approximately $[6.891479,15.108521]$. This interval is exact in its repeated-sampling coverage under the iid Gaussian model, a strong assumption for only four observations. The last output is the separate beta-binomial posterior predictive probability $2/3$; it is not inferred from those delivery times.

The companion inference experiment updates a beta prior using successes and failures. It displays the posterior mean, variance, and predictive probability. Changing the prior while holding observations fixed makes the model dependence visible. A second display simulates confidence-interval coverage under a stated Gaussian mechanism, distinguishing one realized interval from the repeated procedure.

For optional practice, compare a beta prior with shapes $(1,1)$ to one with shapes $(20,20)$ after seven successes and three failures. The means become $8/12$ and $27/50$. The stronger symmetric prior pulls the latter closer to one-half. This is an explicit modeling influence, whose suitability depends on the problem and evidence supporting that prior.

Inference connects finite data to population claims through a model and a sampling design. The final chapter combines our algebra, calculus, probability, and inference into complete ML derivations, then addresses generalization and numerical reliability.

[Previous chapter](10-distributions-and-sampling-limits.md) · [Curriculum](../CURRICULUM.md) · [Next chapter](12-machine-learning-synthesis.md)
