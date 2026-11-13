# 10. Entropy, divergence, likelihood, and loss functions

[Previous](09-statistical-inference.md) · [Course index](../README.md) · [Next](11-optimization.md)

## Probability quality becomes an optimization objective

A model predicting a distribution should be rewarded for assigning high probability to what occurs. For observed class $y$, negative log likelihood is $-\log p_y$. It is zero when the assigned probability is one and diverges as that probability approaches zero. A confidently wrong model therefore pays heavily.

Cross entropy is $H(q,p)=-\sum_kq_k\log p_k$. Entropy is $H(q)=-\sum_kq_k\log q_k$. Their difference is KL divergence:

$$D_{KL}(q\|p)=\sum_kq_k\log\frac{q_k}{p_k}=H(q,p)-H(q).$$

The target distribution $q$ is fixed when fitting $p$, so minimizing cross entropy is equivalent to minimizing this forward KL. If $q_k>0$ and $p_k=0$, the divergence is infinite. The order of its arguments matters.

For one-hot targets, only one cross-entropy term survives. For binary $y\in\{0,1\}$ the loss is $-y\log p-(1-y)\log(1-p)$. With logit $z$ and $p=\sigma(z)$, algebra gives the stable expression $\log(1+e^z)-yz$. Use `np.logaddexp(0,z)-y*z` to evaluate it without overflowing $e^z$.

## Why different tasks require different losses

Squared error is minimized at the conditional mean: condition on $X=x$, expand $E[(Y-a)^2\mid x]$ around $E[Y\mid x]$, and the cross term vanishes. Absolute error is minimized at a conditional median, as seen by balancing probability mass on either side. Quantile loss targets another conditional quantile. The correct loss depends on the desired decision, not simply on whether outputs are numbers.

Huber loss is quadratic near zero and linear in the tails, reducing the influence of large residuals relative to squared error. Hinge loss $\max(0,1-yz)$ with labels $\{-1,+1\}$ encourages a margin. It is not a probability model by itself. Dice-style losses compare predicted and target overlap in segmentation; denominator conventions and empty-mask handling must be specified. Focal loss multiplies classification loss by a factor such as $(1-p_y)^\gamma$ to emphasize poorly predicted examples, and changes probability calibration as well as optimization.

## Further entropy, softmax, and numerical stability
## A loss that respects probabilities

A model outputs scores, also called logits, rather than unconstrained probabilities. For a finite vector $z$, softmax produces $p_i=e^{z_i}/\sum_je^{z_j}$. Every entry is positive and the sum is one. Adding the same constant to all logits leaves the probabilities unchanged because that factor cancels from numerator and denominator.

For logits $(0,\log2)$, exponentials are $(1,2)$, so probabilities are $(1/3,2/3)$. Subtracting the largest logit before exponentiation gives $(1/2,1)$ with the same normalized result. This shift prevents overflow without changing the exact function.

## Information in a prediction

The surprisal of event $i$ under $q$ is $-\log q_i$. Entropy is $H(p)=-\sum_i p_i\log p_i$. Cross-entropy is $H(p,q)=-\sum_i p_i\log q_i$. Subtract them:

$$H(p,q)-H(p)=\sum_i p_i\log\frac{p_i}{q_i}=D_{KL}(p\Vert q).$$

KL is nonnegative when distributions have compatible support. One proof uses $\log u\le u-1$: substitute $u=q_i/p_i$, multiply by $p_i$, sum, and negate. The sums of both distributions are one, giving a lower bound of zero. Terms with $p_i=0$ contribute zero by continuity. If $p_i>0$ and $q_i=0$, KL is infinite. KL is asymmetric and generally not a metric.

## Derive the famous gradient

For target class $y$, $L=-\log p_y=-z_y+\log\sum_j e^{z_j}$. Differentiate with respect to $z_k$. The first term contributes $-1$ only if $k=y$. The second contributes $e^{z_k}/\sum_j e^{z_j}=p_k$. Thus

$$\frac{\partial L}{\partial z_k}=p_k-\mathbf1[k=y].$$

For a soft target distribution $q$, replace the indicator by $q_k$. This result assumes the loss is a sum for one example. A batch mean divides gradients by the number of included examples. Averaging over padded positions changes the objective unless their loss is masked.

Perplexity is $\exp(L)$ when loss uses natural logarithms. A uniform distribution over four tokens has loss $\log4$ and perplexity four. Comparing perplexity across different tokenizers is generally misleading because a token represents a different amount of text.

## Numerical and conceptual failure cases

Computing softmax, taking log, and then selecting a very improbable class can underflow. Use log-softmax directly. Also distinguish a low-entropy model from a correct model: a confidently wrong prediction has low entropy and high loss. Entropy describes uncertainty in the model distribution, not whether the model deserves that confidence.

The experiment independently checks the logit gradient and the entropy decomposition. Zero-probability handling is unnecessary here because every chosen probability is positive.

### Derive the softmax Jacobian directly

Write $p_i=e^{z_i}/Z$ with $Z=\sum_j e^{z_j}$. The quotient rule gives $\partial p_i/\partial z_k=(\mathbf1[i=k]e^{z_i}Z-e^{z_i}e^{z_k})/Z^2$. Divide each term by $Z$ to get $p_i(\mathbf1[i=k]-p_k)$. For two equal logits, both probabilities are $1/2$, so the Jacobian is $\begin{pmatrix}1/4&-1/4\\-1/4&1/4\end{pmatrix}$. Multiplying by $(1,1)^\top$ gives zero: moving both logits together does not change probabilities. The null direction is exactly the common-shift invariance.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
from core import softmax, log_softmax, finite_difference
scores = np.array([0.2, -0.3, 0.8])
target = np.array([0.1, 0.2, 0.7])
def loss(values):
    return -np.sum(target * log_softmax(values))
analytic = softmax(scores) - target
assert np.allclose(analytic, finite_difference(loss, scores), atol=1e-7)
entropy = -np.sum(target * np.log(target))
kl = np.sum(target * (np.log(target) - log_softmax(scores)))
assert np.allclose(loss(scores), entropy + kl)
print('loss', loss(scores), 'entropy', entropy, 'KL', kl)

```

### Code structure and observed intermediate values


#### Stage 3

```python
scores = np.array([0.2, -0.3, 0.8])
```

An observed state during this stage was:

- `scores`: `[ 0.2 -0.3  0.8]`

#### Stage 4

```python
target = np.array([0.1, 0.2, 0.7])
```

An observed state during this stage was:

- `target`: `[0.1 0.2 0.7]`

#### Stage 5

```python
def loss(values):
    return -np.sum(target * log_softmax(values))
```

#### Stage 6

```python
analytic = softmax(scores) - target
```

An observed state during this stage was:

- `analytic`: `[ 0.19166 -0.0231  -0.16856]`

#### Stage 7

```python
assert np.allclose(analytic, finite_difference(loss, scores), atol=1e-7)
```

#### Stage 8

```python
entropy = -np.sum(target * np.log(target))
```

An observed state during this stage was:

- `entropy`: `0.80181855`

#### Stage 9

```python
kl = np.sum(target * (np.log(target) - log_softmax(scores)))
```

An observed state during this stage was:

- `kl`: `0.11034789`

#### Stage 10

```python
assert np.allclose(loss(scores), entropy + kl)
```

#### Stage 11

```python
print('loss', loss(scores), 'entropy', entropy, 'KL', kl)
```

Run from the course root:

```bash
python code/neural/05_entropy_softmax.py
```

### Recorded output from the supplied environment

```text
loss 0.9121664402303955 entropy 0.8018185525433373 KL 0.11034788768705825
```


## Prove KL nonnegativity

For strictly positive probabilities on the support of $q$, concavity of log gives $\sum_kq_k\log(p_k/q_k)\le\log\sum_kq_k(p_k/q_k)$. If $p$ has additional mass outside that support, the sum on the right is at most one; otherwise it is one. Thus the right-hand side is at most zero. Negating yields $D_{KL}(q\|p)\ge0$. Support violations with $q_k>0,p_k=0$ give infinity and preserve the inequality.

Equality, when the distributions are normalized on the same support, occurs when the ratios are constant, forcing $p=q$. Therefore expected log loss is minimized by the true conditional distribution. This is a proper-scoring-rule statement. It does not mean a finite fitted model necessarily reaches that distribution.

For target $q=(0.75,0.25)$ and prediction $p=(0.5,0.5)$, cross entropy is $\log2\approx0.6931$. Target entropy is $-0.75\log0.75-0.25\log0.25\approx0.5623$. Their difference is about 0.1308. A one-hot sample loss and an expected distribution loss are related but distinct quantities.
