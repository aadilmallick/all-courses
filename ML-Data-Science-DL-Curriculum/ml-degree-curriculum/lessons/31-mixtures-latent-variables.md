# 31. Gaussian mixtures, EM, and probabilistic topic models

[Previous](30-density-hierarchical-spectral.md) · [Course index](../README.md) · [Next](32-hmm-time-series.md)

## Soft assignments from a probability model

A Gaussian mixture models $p(x)=\sum_{k=1}^K\pi_k\mathcal N(x;\mu_k,\Sigma_k)$ with nonnegative weights summing to one. A latent variable $Z$ identifies the generating component. Unlike k means, components can have unequal covariance and mixture weight. The observed log likelihood contains a log of a sum, making direct parameter updates coupled.

## Expectation maximization step by step

Choose an auxiliary distribution $q_i(k)$ that is positive wherever the joint mass $p(x_i,k)$ is positive. This support condition makes the following rewriting legitimate. Jensen's inequality gives

$$\log\sum_k p(x_i,k)=\log\sum_kq_i(k)\frac{p(x_i,k)}{q_i(k)}
\ge\sum_kq_i(k)\log\frac{p(x_i,k)}{q_i(k)}.$$

Components with both zero joint mass and zero auxiliary mass can be omitted. If the auxiliary distribution assigns zero mass to a component with positive joint mass, use the KL decomposition to establish the general bound rather than the displayed division by that zero weight. The gap equals $D_{KL}(q_i\|p(Z\mid x_i))$. The E step chooses the current posterior, making the bound tight. The M step increases the bound with respect to parameters while keeping $q$ fixed. This proves nondecreasing observed likelihood for exact EM updates under the stated model, not convergence to the global maximum.

Responsibilities are

$$r_{ik}=\frac{\pi_k\mathcal N(x_i;\mu_k,\Sigma_k)}{\sum_c\pi_c\mathcal N(x_i;\mu_c,\Sigma_c)}.$$

Let $N_k=\sum_ir_{ik}$. Maximizing the bound gives $\pi_k=N_k/n$, $\mu_k=\sum_ir_{ik}x_i/N_k$, and $\Sigma_k=\sum_ir_{ik}(x_i-\mu_k)(x_i-\mu_k)^\top/N_k$.

For scalar points 0 and 4, suppose component-one responsibilities are 0.8 and 0.2. Its effective count is 1, its updated mean is $0.8(0)+0.2(4)=0.8$, and variance is $0.8(0-0.8)^2+0.2(4-0.8)^2=2.56$. The second component receives complementary responsibilities and mean 3.2. Soft counts replace hard membership.

## Numerical and statistical failure modes

Compute log joint scores and normalize with log-sum-exp. A covariance can collapse around one observation and drive an unconstrained Gaussian mixture likelihood upward without bound. Variance floors, covariance regularization, priors, and minimum component masses make the fitted problem better behaved. Their constraints change the precise optimization problem and should be documented.

Mixture labels are exchangeable. Different permutations represent the same density. Multiple initializations can yield different local optima. Compare held-out density or a suitable penalized criterion, inspect component stability, and avoid interpreting every fitted component as a true population.

## Latent Dirichlet allocation is a different model

In probabilistic topic modeling, each document has a distribution $\theta_d$ over topics, and each topic has a word distribution $\beta_k$. For each token, draw topic $z\sim\operatorname{Categorical}(\theta_d)$, then word $w\sim\operatorname{Categorical}(\beta_z)$. A Dirichlet prior controls document topic mixtures. This is latent Dirichlet allocation, not linear discriminant analysis.

The document likelihood marginalizes token topics and usually requires approximate posterior inference. Variational inference or collapsed Gibbs sampling estimates the latent structure. Topic labels emerge from recurring word patterns; they are not automatically coherent semantic categories. The code comparison in the extended laboratory uses scikit-learn's variational LDA, while the from-scratch mixture implementation here is explicitly Gaussian and scalar. These are separate demonstrations of latent-variable modeling.


## A full scalar mixture likelihood calculation

Take two components with equal weight, means 0 and 4, variance 1, and observation $x=1$. The common normalizing constant cancels in responsibilities. The first component contributes $0.5e^{-1/2}$ and the second $0.5e^{-9/2}$. Their ratio is $e^4$, so first responsibility is $1/(1+e^{-4})\approx0.9820$. Although the point is nearer the first mean, the posterior is not simply inverse distance: mixture weights and variances also affect it.

For one scalar component's expected complete log likelihood, ignore terms constant in $\mu,v$:

$$Q=-\frac{N_k}{2}\log v-\frac1{2v}\sum_i r_{ik}(x_i-\mu)^2.$$

Differentiate in $\mu$ to obtain $\sum_i r_{ik}(x_i-\mu)/v=0$, giving the weighted mean. Differentiate in $v$ and set to zero to obtain $v=\sum_i r_{ik}(x_i-\mu)^2/N_k$. Maximizing the weight term $\sum_kN_k\log\pi_k$ with a multiplier for $\sum_k\pi_k=1$ gives $N_k/\pi_k=\lambda$. Summing $\pi_k=N_k/\lambda$ yields $\lambda=n$ and the mixture-weight update.

## A first variational topic update

For a document's tokens $w_n$, a mean-field approximation can use a Dirichlet distribution over its topic proportions with parameter $\gamma$, and categorical topic responsibilities $\varphi_{nk}$. Under fixed topic-word distributions $\beta_{kw}$, coordinate updates have $\varphi_{nk}\propto\beta_{k,w_n}\exp(\psi(\gamma_k)-\psi(\sum_j\gamma_j))$, where $\psi$ is the derivative of log Gamma, and $\gamma_k=\alpha_k+\sum_n\varphi_{nk}$.

These equations come from expected log proportions under a Dirichlet approximation, not from simply substituting the posterior mean into a categorical likelihood. The global topic distributions also need fitting, with a prior or regularization as specified. The library laboratory implements a variational algorithm; the equations explain the quantities it approximates, while its engineering details remain in the primary documentation.


## Complete algorithm laboratory

The following program is saved as [the lesson laboratory](../code/classical/lesson_31.py). It uses only NumPy. The final small dataset is chosen so that you can connect each array to the preceding derivation. Run it from the course root with `python code/classical/lesson_31.py`.

```python
import numpy as np

def gaussian_mixture_1d(x,k=2,steps=100,seed=0):
    """EM for scalar Gaussians with a variance floor; returns likelihood trace."""
    x=np.asarray(x,float)
    if x.ndim != 1 or len(x)==0 or not np.isfinite(x).all():
        raise ValueError('x must be a nonempty finite vector')
    if not isinstance(k,(int,np.integer)) or not 1 <= k <= len(x) or not isinstance(steps,(int,np.integer)) or steps<1:
        raise ValueError('k must be in [1,n] and steps must be a positive integer')
    rng=np.random.default_rng(seed)
    mean=rng.choice(x,k,replace=False).astype(float)
    variance=np.full(k,max(x.var(),1e-6))
    prior=np.full(k,1/k)
    history=[]
    def expectation():
        log_joint=np.log(prior)[None,:]-.5*(np.log(2*np.pi*variance)[None,:]+(x[:,None]-mean)**2/variance)
        normalizer=np.logaddexp.reduce(log_joint,axis=1)
        r=np.exp(log_joint-normalizer[:,None])
        return r,float(normalizer.sum())
    r,likelihood=expectation()
    history.append(likelihood)
    for _ in range(steps):
        mass=r.sum(axis=0)
        if not np.isfinite(mass).all() or np.any(mass <= np.finfo(float).tiny):
            raise FloatingPointError('a mixture component lost all effective mass; try another initialization')
        mean=(r*x[:,None]).sum(axis=0)/mass
        variance=np.maximum((r*(x[:,None]-mean)**2).sum(axis=0)/mass,1e-6)
        prior=mass/len(x)
        # Return responsibilities and likelihood for the FINAL parameters.
        r,likelihood=expectation()
        history.append(likelihood)
    return prior,mean,variance,r,np.array(history)

if __name__ == "__main__":
    rng=np.random.default_rng(31)
    x=np.r_[rng.normal(-3,.3,50),rng.normal(3,.3,50)]
    prior,mean,var,r,trace=gaussian_mixture_1d(x,k=2,seed=3)
    print(prior,mean,var)
    assert np.all(np.diff(trace)>=-1e-7)
```

The recorded output in the supplied CPU environment was:

```text
[0.5 0.5] [-3.02815022  2.98647092] [0.07404418 0.0644685 ]
```


## Verification note

The EM return values are synchronized after the final parameter update: responsibilities are recomputed from the returned means, variances, and mixture weights. The likelihood trace includes the initial value and one value after each M step, so steps updates give steps+1 entries. This matters when inspecting an early iteration rather than waiting for convergence.
