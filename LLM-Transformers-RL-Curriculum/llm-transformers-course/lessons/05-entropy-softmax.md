# 05. Entropy, KL divergence, softmax, and cross-entropy

[Previous](04-probability-conditioning.md) · [Index](../README.md) · [Next](06-neural-networks-autodiff.md)

**Part:** Foundations. **Prerequisite:** read lessons 01–04 in order, or verify the earlier definitions used here.

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
python code/05_entropy_softmax.py
```

### Recorded output from the supplied environment

```text
loss 0.9121664402303955 entropy 0.8018185525433373 KL 0.11034788768705825
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

Binary cross-entropy with a soft target of 0.7; its derivative is sigmoid minus target.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=- \frac{7 x}{10} + \log{\left(e^{x} + 1 \right)}.$$

Its first derivative is

$$f^{(1)}(x)=- \frac{7}{10} + \frac{e^{x}}{e^{x} + 1}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=\frac{e^{x}}{e^{x} + 1} - \frac{e^{2 x}}{\left(e^{x} + 1\right)^{2}}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 0 | 0.693147181 | -0.2 | 0.25 |
| 0.2 | 0.658138869 | -0.150166003 | 0.247516573 |
| 0.4 | 0.633015252 | -0.10131234 | 0.240260746 |

#### Evaluation 1: substitute $x=0$

$$f(0)=\log{\left(2 \right)}\approx 0.693147181.$$
At this coordinate the slope is $-0.2$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.25$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.0002$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.25e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000199875$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0.2$

$$f(0.2)=- \frac{7}{50} + \log{\left(1 + e^{\frac{1}{5}} \right)}\approx 0.658138869.$$
At this coordinate the slope is $-0.150166003$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.247516573$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.000150166003$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.23758286e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000150042249$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.4$

$$f(0.4)=- \frac{7}{25} + \log{\left(1 + e^{\frac{2}{5}} \right)}\approx 0.633015252.$$
At this coordinate the slope is $-0.10131234$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.240260746$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.00010131234$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.20130373e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000101192217$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | -0.150207078 | 4.1075e-05 |
| 0.01 | -0.1501664138 | 4.1115e-07 |
| 0.001 | -0.1501660068 | 4.1115e-09 |
| 0.0001 | -0.1501660027 | 4.0026e-11 |
| 1e-05 | -0.1501660027 | 4.9385e-12 |
| 1e-06 | -0.1501660026 | 1.1041e-10 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=\frac{e^{x}}{e^{x} + 1} - \frac{3 e^{2 x}}{\left(e^{x} + 1\right)^{2}} + \frac{2 e^{3 x}}{\left(e^{x} + 1\right)^{3}}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 0.693147181 | 0.68817207 | 0.693122401 | 2.4779e-05 |
| -0.1 | 0.67439666 | 0.67315547 | 0.674393053 | 3.6076e-06 |
| 0.1 | 0.644355244 | 0.643122269 | 0.644359852 | 4.6075e-06 |
| 0.2 | 0.633015252 | 0.628105669 | 0.633056 | 4.0748e-05 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: LLM](https://aman.ai/primers/LLM/)
- [Aman.ai: knowledge-distillation](https://aman.ai/primers/knowledge-distillation/)

[Previous](04-probability-conditioning.md) · [Index](../README.md) · [Next](06-neural-networks-autodiff.md)
