# 09. Estimation, likelihood, Bayesian inference, and uncertainty

[Previous](08-random-variables-distributions.md) · [Course index](../README.md) · [Next](10-information-losses.md)

## An estimate is itself random

A population parameter describes a distribution. An estimator is a rule mapping a random sample to a numerical guess. Before observing data, that guess has a sampling distribution. Bias is $E[\widehat\theta]-\theta$. Variance is $E[(\widehat\theta-E\widehat\theta)^2]$. Squared error decomposes into variance plus squared bias by adding and subtracting $E\widehat\theta$ and observing that the cross term has expectation zero.

For independent Bernoulli observations, the sample proportion $\widehat p=\sum_i x_i/n$ is unbiased and has variance $p(1-p)/n$. An observed proportion of zero in a tiny sample does not establish that the true probability is zero. Distinguish an estimator's output from a certainty claim.

## Derive maximum likelihood

The Bernoulli likelihood is $L(p)=p^s(1-p)^{n-s}$ where $s=\sum_i x_i$. For $0<p<1$, the log likelihood is $s\log p+(n-s)\log(1-p)$. Its derivative is $s/p-(n-s)/(1-p)$. Setting it to zero and multiplying by $p(1-p)$ gives $s(1-p)-(n-s)p=0$, hence $\widehat p=s/n$. At all-success or all-failure boundaries the maximizer lies at an endpoint; the interior calculation must not silently exclude those cases.

For independent normal observations with known variance, the negative log likelihood differs from $\sum_i(x_i-\mu)^2/(2\sigma^2)$ only by a constant. Differentiating gives $\widehat\mu=\bar x$. This is the probabilistic reason squared error appears in regression.

## Priors and posterior distributions

A Beta$(a,b)$ prior has density proportional to $p^{a-1}(1-p)^{b-1}$. Multiply by the Bernoulli likelihood to obtain powers $p^{a+s-1}(1-p)^{b+n-s-1}$. The posterior is Beta$(a+s,b+n-s)$. Its mean is $(a+s)/(a+b+n)$. A prior Beta$(1,1)$ and three successes in five trials give posterior mean $4/7$, while the MLE is $3/5$.

Maximum a posteriori estimation maximizes the posterior density. Taking minus log converts multiplication into addition: negative log likelihood plus negative log prior. A Gaussian parameter prior yields an L2 penalty. The scaling depends on the variance and on whether the likelihood is summed or averaged. A posterior mode is a point estimate, not a full uncertainty distribution.

## Intervals and hypothesis tests

A frequentist 95% confidence procedure covers the fixed parameter in 95% of repeated samples under its assumptions. It is not, by that definition, a posterior probability that this realized interval contains the parameter. A Bayesian credible interval assigns posterior mass after specifying a prior and likelihood. These statements answer different questions.

For a sample mean, a large-sample standard error estimate is $s/\sqrt n$. A normal approximation interval uses $\bar x\pm1.96s/\sqrt n$ when that approximation is justified. Small normal samples with unknown variance use a Student t quantile. For extreme binomial proportions or small counts, simple symmetric normal intervals can be poor; use an appropriate binomial interval or posterior analysis.

A p-value is the probability, under a specified null model, of a test statistic at least as extreme as the observed one. It is not the probability the null is true and does not measure practical effect size. Repeated model comparisons or repeated peeks at a held-out set change the analysis and can inflate false discoveries.

## Bootstrap and paired comparisons

The ordinary bootstrap samples $n$ observations with replacement from the observed sample and recomputes a statistic. It approximates sampling variability under suitable conditions; it cannot correct systematic sampling bias. If observations are grouped, resample groups. For two models evaluated on the same test cases, resample paired case results so their correlation is preserved.

```python
import numpy as np
rng=np.random.default_rng(9)
errors=np.array([1.,2.,1.,4.,2.,3.])
means=np.array([rng.choice(errors,len(errors),replace=True).mean() for _ in range(3000)])
print(np.quantile(means,[0.025,0.975]))
```

This estimates variability of the mean of these errors under empirical resampling. It does not include model-training variability unless fitting is also repeated, and it does not validate the bootstrap's assumptions merely by producing two endpoints.


## Gaussian variance estimation and its correction

For iid normal observations, the negative log likelihood, ignoring constants, is $n\log\sigma+\sum_i(x_i-\mu)^2/(2\sigma^2)$. Differentiating in $\mu$ gives the sample mean. With $v=\sigma^2$, differentiation gives $n/(2v)-\sum_i(x_i-\bar x)^2/(2v^2)=0$, so the variance MLE is the residual sum divided by $n$.

To see its bias, use $\sum_i(X_i-\bar X)^2=\sum_i(X_i-\mu)^2-n(\bar X-\mu)^2$. Taking expectations yields $n\sigma^2-n(\sigma^2/n)=(n-1)\sigma^2$. Dividing by $n-1$ therefore gives an unbiased variance estimator for iid finite-variance samples. The MLE and unbiased estimator differ because they optimize different criteria, not because one derivation must be wrong.

The denominator correction does not make a procedure robust to temporal correlation or selection bias. Its expectation calculation used independent observations with a common mean and variance. Identify exactly which expectation is being estimated before transferring a familiar correction.
