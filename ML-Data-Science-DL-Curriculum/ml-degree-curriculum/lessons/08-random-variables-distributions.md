# 08. Random variables, distributions, expectation, and covariance

[Previous](07-probability-conditioning.md) · [Course index](../README.md) · [Next](09-statistical-inference.md)

## Random variables turn outcomes into numbers

A random variable $X$ is a measurable numerical function of an outcome. Its distribution describes which values occur with which probabilities. For discrete variables the mass function $p(x)$ sums to one. For continuous variables the density $p(x)$ integrates to one, and an individual point normally has probability zero. A density is not the same object as a point probability.

Expectation is a weighted average: $E[X]=\sum_x xp(x)$, or the corresponding integral. For a Bernoulli variable taking 1 with probability $p$ and 0 otherwise, $E[X]=p$. Since $X^2=X$, $E[X^2]=p$. Its variance is $E[(X-p)^2]=E[X^2]-p^2=p(1-p)$.

## Variance and covariance step by step

Expand $(X-\mu)^2=X^2-2\mu X+\mu^2$. Taking expectations and using $E[X]=\mu$ gives $\operatorname{Var}(X)=E[X^2]-\mu^2$. For two variables, covariance is $E[(X-\mu_X)(Y-\mu_Y)]$. It is positive when above-average values tend to occur together. Zero covariance does not generally imply independence: if $X$ is symmetric around zero and $Y=X^2$, their covariance may be zero although $Y$ is completely determined by $X$.

For a vector $x$, the covariance matrix is $\Sigma=E[(x-\mu)(x-\mu)^\top]$. Its diagonal entries are variances. For any fixed $a$, $a^\top\Sigma a=E[(a^\top(x-\mu))^2]\ge0$, proving positive semidefiniteness. This fact supports PCA and Gaussian models.

## The distributions that will recur

| Distribution | Quantity modeled | Parameters and moments |
|---|---|---|
| Bernoulli | One binary event | $p$; mean $p$, variance $p(1-p)$ |
| Binomial | Success count in $n$ independent Bernoulli trials | $n,p$; mean $np$, variance $np(1-p)$ |
| Categorical | One of $K$ classes | $p_k\ge0$, $\sum_kp_k=1$ |
| Multinomial | Class counts in $n$ independent categorical trials | Counts sum to $n$ |
| Poisson | Nonnegative event count | $\lambda>0$; mean and variance $\lambda$ |
| Normal | Continuous location and noise | $\mu,\sigma^2$; density proportional to $e^{-(x-\mu)^2/(2\sigma^2)}$ |
| Beta | Unknown Bernoulli probability | Positive shape parameters $a,b$; mean $a/(a+b)$ |
| Dirichlet | Unknown categorical probability vector | Positive concentration vector; Beta generalization |

Distribution choice encodes assumptions. Poisson equates mean and variance, which may fail for overdispersed counts. Gaussian noise allows negative values, potentially unsuitable for small counts. A good fit cannot be inferred solely from familiar formulas.

## Sampling and averaging

If $X_1,\ldots,X_n$ are independent with common mean $\mu$ and finite variance $\sigma^2$, their sample mean has expectation $\mu$ and variance $\sigma^2/n$. The latter follows by expanding the variance of a sum: cross covariances are zero under independence, leaving $n\sigma^2/n^2$. Correlated observations do not enjoy that same effective sample size.

The law of large numbers describes convergence of averages under its hypotheses. The central limit theorem describes a normalized average approaching a Gaussian under suitable conditions. Neither says that arbitrary raw data become normally distributed. Infinite-variance data and strong dependence require different analysis.

```python
import numpy as np
rng=np.random.default_rng(8)
experiments=rng.binomial(1,0.2,size=(10000,100))
means=experiments.mean(axis=1)
print(means.mean(),means.var())
# Values fluctuate near 0.2 and 0.2*0.8/100 = 0.0016.
```

Rows are repeated experiments; columns are independent trials within an experiment. The variance across row means estimates the sampling variance of a mean, whereas the variance across individual Bernoulli observations estimates $p(1-p)$. Naming the axis makes the statistical question explicit.


## Total expectation and total variance

Partition uncertainty by another variable $Z$. For discrete variables, expand the joint sum and factor $p(x,z)=p(x\mid z)p(z)$ to get $E[X]=E_Z[E[X\mid Z]]$. The same identity holds under appropriate integrability for continuous variables.

Write $X-E[X]=(X-E[X\mid Z])+(E[X\mid Z]-E[X])$. The cross term has conditional expectation zero because $E[X-E[X\mid Z]\mid Z]=0$. Taking squared expectations gives

$$\operatorname{Var}(X)=E[\operatorname{Var}(X\mid Z)]+\operatorname{Var}(E[X\mid Z]).$$

The first term is within-group variation; the second is between-group variation. If two equally likely machine types have means 0 and 4 and each has variance 1, overall mean is 2, within variance is 1, and between variance is $((0-2)^2+(4-2)^2)/2=4$. Total variance is 5. Ignoring the mixture can make a broad distribution appear to require more within-machine noise than it actually has.
