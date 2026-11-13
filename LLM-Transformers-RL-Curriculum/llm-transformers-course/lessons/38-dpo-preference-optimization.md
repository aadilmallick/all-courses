# 38. DPO and the derivation from rewards to policy ratios

[Previous](37-reward-modeling-rlhf.md) · [Index](../README.md) · [Next](39-grpo-verifiable-rewards.md)

**Part:** Reinforcement learning and alignment. **Prerequisite:** read lessons 01–37 in order, or verify the earlier definitions used here.

## Eliminate a fitted reward under a specific model

The previous lesson derived $\pi^*(y\mid x)\propto\pi_{\rm ref}(y\mid x)e^{r(x,y)/\beta}$. Taking logarithms and rearranging gives $r(x,y)=\beta\log[\pi^*(y\mid x)/\pi_{\rm ref}(y\mid x)]+\beta\log Z(x)$. For two responses to the same prompt, the unknown prompt-only normalizer cancels.

Assume a Bradley-Terry preference likelihood based on the reward difference. Substitute the policy-ratio reward parameterization. With

$$\Delta=\log\pi_\theta(y_w\mid x)-\log\pi_\theta(y_l\mid x)-\log\pi_{\rm ref}(y_w\mid x)+\log\pi_{\rm ref}(y_l\mid x),$$

the DPO loss is $L=-\log\sigma(\beta\Delta)$. This derivation relies on the KL-regularized reward model and preference assumptions. It is not a universal equivalence between every RL objective and every pairwise classifier.

## Differentiate and interpret the pressure

Using $-\log\sigma(u)=\log(1+e^{-u})$, the derivative is $dL/d\Delta=-\beta\sigma(-\beta\Delta)$. A badly ordered pair has a larger-magnitude correcting gradient. The objective increases the chosen response's relative log-probability over the rejected response, after accounting for the reference.

A response log-probability is a sum over its generated tokens, excluding prompt tokens and padding. Replacing that sum with a length average changes the objective and its reward interpretation. Length effects are real, but they should be handled explicitly rather than by silently changing the formula.

## The reference matters

The reference provides a baseline for the policy's relative preference. It should be frozen under ordinary DPO training. If both chosen and rejected probabilities move, the loss depends on their difference relative to that baseline; it does not require the chosen response's absolute probability to increase on every update.

DPO avoids an online rollout-and-reward-model stage in its standard offline form, but still depends on coverage and quality of preference data. Distribution shift, label noise, contradictory preferences, and overoptimization can cause problems. Compare held-out task performance and retained capabilities, not only training pair accuracy.

## Related objectives are not interchangeable names

IPO, KTO, ORPO, and other preference objectives use different assumptions, losses, or data formats. Understand their actual equations before choosing one. A beta parameter can have different numerical meaning across formulations. Reusing a hyperparameter value without checking its definition is unsafe experimentally.

The experiment checks the scalar DPO derivative and demonstrates that a reference-adjusted preference can differ from a raw policy preference. It uses stored log-probabilities rather than a model wrapper so every sign is visible.

### Fit a preference policy end to end

The additional `code/alignment_training.py` experiment optimizes a three-response categorical policy with the exact DPO loss. The frozen reference probabilities are $(0.5,0.3,0.2)$, and response one is preferred to response zero. Every step computes policy log-softmax, forms the reference-adjusted margin, applies stable softplus to its negative, backpropagates, and updates logits. Response two has no direct preference label, but normalization couples its probability to the others. The printed decrease in pair loss verifies optimization of this objective; it is not evidence that the resulting policy answers natural-language questions.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
from core import finite_difference
beta = .4
policy_logp = np.array([-1.2, -1.8])
reference_logp = np.array([-1., -2.])
delta = policy_logp[0]-policy_logp[1]-reference_logp[0]+reference_logp[1]
def objective(value):
    return np.logaddexp(0, -beta*value[0])
analytic = -beta/(1+np.exp(beta*delta))
numeric = finite_difference(objective, np.array([delta]))[0]
assert np.allclose(analytic, numeric, atol=1e-7)
print('adjusted gap', delta, 'loss', objective(np.array([delta])), 'gradient', analytic)

```

### Code structure and observed intermediate values


#### Stage 3

```python
beta = .4
```

An observed state during this stage was:

- `beta`: `0.4`

#### Stage 4

```python
policy_logp = np.array([-1.2, -1.8])
```

An observed state during this stage was:

- `policy_logp`: `[-1.2 -1.8]`

#### Stage 5

```python
reference_logp = np.array([-1., -2.])
```

An observed state during this stage was:

- `reference_logp`: `[-1. -2.]`

#### Stage 6

```python
delta = policy_logp[0]-policy_logp[1]-reference_logp[0]+reference_logp[1]
```

An observed state during this stage was:

- `delta`: `-0.4`

#### Stage 7

```python
def objective(value):
    return np.logaddexp(0, -beta*value[0])
```

#### Stage 8

```python
analytic = -beta/(1+np.exp(beta*delta))
```

An observed state during this stage was:

- `analytic`: `-0.21596595`

#### Stage 9

```python
numeric = finite_difference(objective, np.array([delta]))[0]
```

An observed state during this stage was:

- `numeric`: `-0.21596595`

#### Stage 10

```python
assert np.allclose(analytic, numeric, atol=1e-7)
```

#### Stage 11

```python
print('adjusted gap', delta, 'loss', objective(np.array([delta])), 'gradient', analytic)
```

Run from the course root:

```bash
python code/38_dpo_preference_optimization.py
```

### Recorded output from the supplied environment

```text
adjusted gap -0.3999999999999999 loss 0.7763437730407396 gradient -0.21596595382222628
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

The exact scalar DPO loss for beta 0.4 and reference-adjusted response log-probability gap x.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=\log{\left(1 + e^{- \frac{2 x}{5}} \right)}.$$

Its first derivative is

$$f^{(1)}(x)=- \frac{2 e^{- \frac{2 x}{5}}}{5 \left(1 + e^{- \frac{2 x}{5}}\right)}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=\frac{4 e^{- \frac{2 x}{5}}}{25 \left(1 + e^{- \frac{2 x}{5}}\right)} - \frac{4 e^{- \frac{4 x}{5}}}{25 \left(1 + e^{- \frac{2 x}{5}}\right)^{2}}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| -0.6 | 0.820329967 | -0.22388546 | 0.0394294848 |
| -0.4 | 0.776343773 | -0.215965954 | 0.0397450883 |
| -0.2 | 0.733946967 | -0.207995736 | 0.0399360682 |

#### Evaluation 1: substitute $x=-0.6$

$$f(-0.6)=\log{\left(1 + e^{\frac{6}{25}} \right)}\approx 0.820329967.$$
At this coordinate the slope is $-0.22388546$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.0394294848$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.00022388546$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.97147424e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000223865745$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=-0.4$

$$f(-0.4)=\log{\left(1 + e^{\frac{4}{25}} \right)}\approx 0.776343773.$$
At this coordinate the slope is $-0.215965954$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.0397450883$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.000215965954$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.98725442e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000215946081$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=-0.2$

$$f(-0.2)=\log{\left(1 + e^{\frac{2}{25}} \right)}\approx 0.733946967.$$
At this coordinate the slope is $-0.207995736$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.0399360682$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.000207995736$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.99680341e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000207975768$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | -0.2159638389 | 2.1149e-06 |
| 0.01 | -0.2159659327 | 2.1152e-08 |
| 0.001 | -0.2159659536 | 2.1161e-10 |
| 0.0001 | -0.2159659538 | 2.4407e-12 |
| 1e-05 | -0.2159659538 | 1.8856e-12 |
| 1e-06 | -0.2159659538 | 2.0319e-11 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=- \frac{8 e^{- \frac{2 x}{5}}}{125 \left(1 + e^{- \frac{2 x}{5}}\right)} + \frac{24 e^{- \frac{4 x}{5}}}{125 \left(1 + e^{- \frac{2 x}{5}}\right)^{2}} - \frac{16 e^{- \frac{6 x}{5}}}{125 \left(1 + e^{- \frac{2 x}{5}}\right)^{3}}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 0.820329967 | 0.819536964 | 0.820331866 | 1.8989e-06 |
| -0.1 | 0.798138869 | 0.797940368 | 0.798139094 | 2.2448e-07 |
| 0.1 | 0.754946102 | 0.754747178 | 0.754945903 | 1.985e-07 |
| 0.2 | 0.733946967 | 0.733150582 | 0.733945484 | 1.4833e-06 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Continue into sequence-model training

The complete tiny-transformer supervised-to-DPO program is [sequence_alignment.py](../code/sequence_alignment.py). [Lesson 53](53-capstone-local-system.md) derives its response log-probability aggregation and preference gradients and reports the executed result. This extension updates real transformer parameters on synthetic sequences; it does not rely on a simulated probability change.

## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: preference-optimization](https://aman.ai/primers/preference-optimization/)

[Previous](37-reward-modeling-rlhf.md) · [Index](../README.md) · [Next](39-grpo-verifiable-rewards.md)
