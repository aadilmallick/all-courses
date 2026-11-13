# 34. Policy gradients and REINFORCE from the likelihood ratio

[Previous](33-td-q-learning.md) · [Index](../README.md) · [Next](35-actor-critic-gae.md)

**Part:** Reinforcement learning and alignment. **Prerequisite:** read lessons 01–33 in order, or verify the earlier definitions used here.

## Differentiate an expectation whose samples depend on parameters

Let trajectory $\tau$ have probability $p_\theta(\tau)$ and return $R(\tau)$ independent of $\theta$ once the trajectory is fixed. The objective is $J(\theta)=\sum_\tau p_\theta(\tau)R(\tau)$. Assuming differentiation and summation can be interchanged,

$$\nabla J=\sum_\tau p_\theta(\tau)R(\tau)\nabla\log p_\theta(\tau)
=\mathbb E[R(\tau)\nabla\log p_\theta(\tau)].$$

The identity uses $\nabla p=p\nabla\log p$ on positive-probability trajectories. If environment transitions and the initial distribution do not depend on policy parameters, only policy factors contribute to the log derivative. Thus $\nabla\log p_\theta(\tau)=\sum_t\nabla\log\pi_\theta(a_t\mid s_t)$.

## Remove irrelevant past rewards

An action cannot affect rewards already received. Conditional-expectation arguments permit using reward-to-go instead of total episode reward for each action. This reduces variance without changing the expected gradient under the stated sampling assumptions.

A state baseline $b(s)$ also leaves the expected score gradient unchanged:

$$\sum_a\pi(a\mid s)b(s)\nabla\log\pi(a\mid s)
=b(s)\nabla\sum_a\pi(a\mid s)=0.$$

The baseline must be independent of the sampled action conditional on state for this elementary argument. In an autodiff surrogate, return and baseline targets are usually detached so the policy update differentiates only the intended log-probability term.

## A two-action derivation

Let action one have probability $p=\sigma(\theta)$ and expected reward $0.8$, while action zero has reward mean $0.2$. Expected reward is $J=0.2+0.6p$, giving derivative $0.6p(1-p)$. The score derivative for sampled binary action $a$ is $a-p$. Therefore $R(a-p)$ is an unbiased gradient estimator. Its individual samples can be noisy even though its mean has the correct sign.

Gradient ascent maximizes reward. Most optimizers minimize a loss, so use negative log-probability times advantage. A sign error trains away from the rewarded behavior. Entropy bonuses encourage exploration but also change the optimized objective.

The experiment compares a large Monte Carlo mean with the exact bandit gradient. The tolerance accounts for sampling noise. It separately prints a baseline estimator to show variance reduction can be measured rather than assumed.

For LLMs, a response log-probability is a sum of token log-probabilities conditional on its prefixes. The same score identity applies, while reward definition, sampling cost, and long-horizon credit assignment become the hard practical questions.

### Derive the softmax policy score for any action count

For logits $z$ and action $a$, $\log\pi(a)=z_a-\log\sum_j e^{z_j}$. Therefore $\partial\log\pi(a)/\partial z_k=\mathbf1[k=a]-\pi(k)$. Multiply this vector by a fixed return or advantage to get a sampled ascent direction. Summing the components gives zero, consistent with invariance to a common logit shift. In the two-action sigmoid parameterization with only the action-one logit free, the score reduces to $a-p$. This connects the bandit code to the general categorical policy derivative.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
rng = np.random.default_rng(34)
theta = 0.3
p = 1/(1+np.exp(-theta))
action = rng.random(100000) < p
mean_reward = np.where(action, .8, .2)
reward = (rng.random(len(action)) < mean_reward).astype(float)
score = action.astype(float)-p
estimate = np.mean(reward*score)
exact = .6*p*(1-p)
baseline = .2+.6*p
centered = (reward-baseline)*score
assert abs(estimate-exact) < .005
print('Monte Carlo', estimate, 'exact', exact, 'variances', np.var(reward*score), np.var(centered))

```

### Code structure and observed intermediate values


#### Stage 2

```python
rng = np.random.default_rng(34)
```

#### Stage 3

```python
theta = 0.3
```

An observed state during this stage was:

- `theta`: `0.3`

#### Stage 4

```python
p = 1/(1+np.exp(-theta))
```

An observed state during this stage was:

- `p`: `0.57444252`

#### Stage 5

```python
action = rng.random(100000) < p
```

An observed state during this stage was:

- `action`: `array shape=(100000,), min=0, max=1, norm=239.562`

#### Stage 6

```python
mean_reward = np.where(action, .8, .2)
```

An observed state during this stage was:

- `mean_reward`: `array shape=(100000,), min=0.2, max=0.8, norm=196.046`

#### Stage 7

```python
reward = (rng.random(len(action)) < mean_reward).astype(float)
```

An observed state during this stage was:

- `reward`: `array shape=(100000,), min=0, max=1, norm=233.27`

#### Stage 8

```python
score = action.astype(float)-p
```

An observed state during this stage was:

- `score`: `array shape=(100000,), min=-0.574443, max=0.425557, norm=156.377`

#### Stage 9

```python
estimate = np.mean(reward*score)
```

An observed state during this stage was:

- `estimate`: `0.1460571`

#### Stage 10

```python
exact = .6*p*(1-p)
```

An observed state during this stage was:

- `exact`: `0.14667499`

#### Stage 11

```python
baseline = .2+.6*p
```

An observed state during this stage was:

- `baseline`: `0.54466551`

#### Stage 12

```python
centered = (reward-baseline)*score
```

An observed state during this stage was:

- `centered`: `array shape=(100000,), min=-0.261563, max=0.312879, norm=79.1231`

#### Stage 13

```python
assert abs(estimate-exact) < .005
```

#### Stage 14

```python
print('Monte Carlo', estimate, 'exact', exact, 'variances', np.var(reward*score), np.var(centered))
```

Run from the course root:

```bash
python code/34_policy_gradients.py
```

### Recorded output from the supplied environment

```text
Monte Carlo 0.14605710447693573 exact 0.1466749870144475 variances 0.08994359562735979 0.0411855864061244
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

Exact expected bandit return; maximizing this function is the policy-gradient objective.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=\frac{1}{5} + \frac{3}{5 \left(1 + e^{- x}\right)}.$$

Its first derivative is

$$f^{(1)}(x)=\frac{3 e^{- x}}{5 \left(1 + e^{- x}\right)^{2}}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=- \frac{3 e^{- x}}{5 \left(1 + e^{- x}\right)^{2}} + \frac{6 e^{- 2 x}}{5 \left(1 + e^{- x}\right)^{3}}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 0.1 | 0.514987512 | 0.149625624 | -0.00747505303 |
| 0.3 | 0.54466551 | 0.146674987 | -0.0218377104 |
| 0.5 | 0.573475599 | 0.141002227 | -0.0345340769 |

#### Evaluation 1: substitute $x=0.1$

$$f(0.1)=\frac{1}{5} + \frac{3}{5 \left(e^{- \frac{1}{10}} + 1\right)}\approx 0.514987512.$$
At this coordinate the slope is $0.149625624$, so the function increases under a sufficiently small positive perturbation. The curvature is $-0.00747505303$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.000149625624$. The quadratic correction is $f^{(2)}(x)h^2/2\approx-3.73752652e-09$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000149621874$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0.3$

$$f(0.3)=\frac{1}{5} + \frac{3}{5 \left(e^{- \frac{3}{10}} + 1\right)}\approx 0.54466551.$$
At this coordinate the slope is $0.146674987$, so the function increases under a sufficiently small positive perturbation. The curvature is $-0.0218377104$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.000146674987$. The quadratic correction is $f^{(2)}(x)h^2/2\approx-1.09188552e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000146664057$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.5$

$$f(0.5)=\frac{1}{5} + \frac{3}{5 \left(e^{- \frac{1}{2}} + 1\right)}\approx 0.573475599.$$
At this coordinate the slope is $0.141002227$, so the function increases under a sufficiently small positive perturbation. The curvature is $-0.0345340769$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.000141002227$. The quadratic correction is $f^{(2)}(x)h^2/2\approx-1.72670385e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000140984951$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | 0.1465609884 | 0.000114 |
| 0.01 | 0.146673846 | 1.141e-06 |
| 0.001 | 0.1466749756 | 1.141e-08 |
| 0.0001 | 0.1466749869 | 1.1387e-10 |
| 1e-05 | 0.146674987 | 2.8507e-12 |
| 1e-06 | 0.146674987 | 2.5055e-11 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=\frac{3 e^{- x}}{5 \left(1 + e^{- x}\right)^{2}} - \frac{18 e^{- 2 x}}{5 \left(1 + e^{- x}\right)^{3}} + \frac{18 e^{- 3 x}}{5 \left(1 + e^{- x}\right)^{4}}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 0.514987512 | 0.515330513 | 0.514893758 | 9.3754e-05 |
| -0.1 | 0.529900398 | 0.529998011 | 0.529888823 | 1.1576e-05 |
| 0.1 | 0.559212596 | 0.559333009 | 0.55922382 | 1.1224e-05 |
| 0.2 | 0.573475599 | 0.574000507 | 0.573563753 | 8.8155e-05 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: reinforcement-learning](https://aman.ai/primers/reinforcement-learning/)

[Previous](33-td-q-learning.md) · [Index](../README.md) · [Next](35-actor-critic-gae.md)
