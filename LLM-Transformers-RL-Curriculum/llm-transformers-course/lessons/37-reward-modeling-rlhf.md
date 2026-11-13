# 37. Reward modeling, RLHF, and constrained policy optimization

[Previous](36-ppo.md) · [Index](../README.md) · [Next](38-dpo-preference-optimization.md)

**Part:** Reinforcement learning and alignment. **Prerequisite:** read lessons 01–36 in order, or verify the earlier definitions used here.

## Preferences are observations, rewards are a model

A preference dataset may contain a prompt $x$, chosen response $y_w$, and rejected response $y_l$. A reward model assigns scalar score $r_\phi(x,y)$. A Bradley-Terry model predicts the chosen response wins with probability $\sigma(r_w-r_l)$. Minimize $-\log\sigma(r_w-r_l)$. The scale and meaning of the reward depend on data and model assumptions.

Adding any prompt-dependent constant to all responses' rewards leaves pairwise probabilities unchanged because it cancels in the difference. Absolute reward zero is therefore not identified by this pairwise objective. Cyclic, noisy, or context-dependent preferences can violate the simple scalar-ranking model.

## KL-regularized optimization

For one prompt and finite response set, maximize $\sum_y\pi(y)r(y)-\beta\sum_y\pi(y)\log[\pi(y)/\pi_{\rm ref}(y)]$, with $\beta>0$, normalized $\pi$, and reference support covering candidate responses. Introduce a Lagrange multiplier for $\sum_y\pi(y)=1$. Differentiating with respect to $\pi(y)$ gives

$$r(y)-\beta\left(\log\frac{\pi(y)}{\pi_{\rm ref}(y)}+1\right)+\lambda=0.$$

Rearrange and normalize to obtain

$$\pi^*(y)=\frac{\pi_{\rm ref}(y)e^{r(y)/\beta}}{\sum_{y'}\pi_{\rm ref}(y')e^{r(y')/\beta}}.$$

This is an exact finite-set result. Neural policies may not represent it exactly, and practical optimization may not find it. A larger $\beta$ penalizes deviation more strongly under this convention.

## A training pipeline with separate responsibilities

A common RLHF design first performs supervised instruction tuning, fits a reward model on preferences, then optimizes a policy with a reference penalty. PPO is one possible optimizer. The old policy used for PPO ratios and the fixed reference used for alignment regularization play different roles.

Sequence KL decomposes into expected token log-ratios under the policy when prefixes and sampling are handled consistently. A single response's log-ratio can be negative even though expected KL is nonnegative. An individual sampled penalty is therefore not itself a nonnegative divergence.

## Reward optimization can exploit errors

A reward model is reliable only over a measured distribution. Strong optimization may discover outputs that score highly without satisfying the intended task. Monitor independent human or task-grounded evaluations, length effects, style preference, and out-of-distribution behavior. Increasing reward alone is not sufficient evidence of improvement.

The example calculates the closed-form optimum over three responses and checks it against nearby distributions. It also checks that adding a constant to rewards leaves the optimum unchanged. This clarifies the role of the normalizer before introducing direct preference optimization.

### Rewrite the regularized objective as a KL gap

Let $\pi^*(y)=\pi_{\rm ref}(y)e^{r(y)/\beta}/Z$. Taking logs gives $\log[\pi(y)/\pi^*(y)]=\log[\pi(y)/\pi_{\rm ref}(y)]-r(y)/\beta+\log Z$. Multiply by $\pi(y)$ and sum. Rearranging yields $\mathbb E_\pi r-\beta KL(\pi\Vert\pi_{\rm ref})=\beta\log Z-\beta KL(\pi\Vert\pi^*)$. Nonnegativity of KL proves the displayed optimum globally over the finite simplex, with equality at $\pi=\pi^*$. This is stronger than checking a few neighboring distributions numerically.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
from core import softmax
reference = np.array([.5, .3, .2])
reward = np.array([0., 1., .4])
beta = .7
optimum = softmax(np.log(reference)+reward/beta)
def objective(policy):
    return policy @ reward-beta*np.sum(policy*np.log(policy/reference))
assert np.allclose(optimum, softmax(np.log(reference)+(reward+5)/beta))
for epsilon in [-.02, .02]:
    nearby = optimum+np.array([epsilon, -epsilon, 0.])
    assert objective(optimum) >= objective(nearby)
print('optimal policy', optimum, 'objective', objective(optimum))

```

### Code structure and observed intermediate values


#### Stage 3

```python
reference = np.array([.5, .3, .2])
```

An observed state during this stage was:

- `reference`: `[0.5 0.3 0.2]`

#### Stage 4

```python
reward = np.array([0., 1., .4])
```

An observed state during this stage was:

- `reward`: `[0.  1.  0.4]`

#### Stage 5

```python
beta = .7
```

An observed state during this stage was:

- `beta`: `0.7`

#### Stage 6

```python
optimum = softmax(np.log(reference)+reward/beta)
```

An observed state during this stage was:

- `optimum`: `[0.23742 0.59441 0.16817]`

#### Stage 7

```python
def objective(policy):
    return policy @ reward-beta*np.sum(policy*np.log(policy/reference))
```

#### Stage 8

```python
assert np.allclose(optimum, softmax(np.log(reference)+(reward+5)/beta))
```

#### Stage 9

```python
for epsilon in [-.02, .02]:
    nearby = optimum+np.array([epsilon, -epsilon, 0.])
    assert objective(optimum) >= objective(nearby)
```

An observed state during this stage was:

- `nearby`: `[0.25742 0.57441 0.16817]`

This is one recorded iteration state, not necessarily the final loop state. The final printed result below is authoritative for the completed run. Long loops are deliberately sampled to keep the trace readable.

#### Stage 10

```python
print('optimal policy', optimum, 'objective', objective(optimum))
```

Run from the course root:

```bash
python code/37_reward_modeling_rlhf.py
```

### Recorded output from the supplied environment

```text
optimal policy [0.23741925 0.59441242 0.16816833] objective 0.5213463612147314
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

Pairwise reward-model negative log-likelihood as the chosen-minus-rejected score gap changes.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=\log{\left(1 + e^{- x} \right)}.$$

Its first derivative is

$$f^{(1)}(x)=- \frac{e^{- x}}{1 + e^{- x}}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=\frac{e^{- x}}{1 + e^{- x}} - \frac{e^{- 2 x}}{\left(1 + e^{- x}\right)^{2}}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 0 | 0.693147181 | -0.5 | 0.25 |
| 0.2 | 0.598138869 | -0.450166003 | 0.247516573 |
| 0.4 | 0.513015252 | -0.40131234 | 0.240260746 |

#### Evaluation 1: substitute $x=0$

$$f(0)=\log{\left(2 \right)}\approx 0.693147181.$$
At this coordinate the slope is $-0.5$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.25$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.0005$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.25e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000499875$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0.2$

$$f(0.2)=\log{\left(e^{- \frac{1}{5}} + 1 \right)}\approx 0.598138869.$$
At this coordinate the slope is $-0.450166003$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.247516573$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.000450166003$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.23758286e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000450042249$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.4$

$$f(0.4)=\log{\left(e^{- \frac{2}{5}} + 1 \right)}\approx 0.513015252.$$
At this coordinate the slope is $-0.40131234$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.240260746$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.00040131234$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.20130373e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000401192217$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | -0.450207078 | 4.1075e-05 |
| 0.01 | -0.4501664138 | 4.1115e-07 |
| 0.001 | -0.4501660068 | 4.1116e-09 |
| 0.0001 | -0.4501660027 | 4.0881e-11 |
| 1e-05 | -0.4501660027 | 3.688e-12 |
| 1e-06 | -0.4501660026 | 1.0178e-10 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=- \frac{e^{- x}}{1 + e^{- x}} + \frac{3 e^{- 2 x}}{\left(1 + e^{- x}\right)^{2}} - \frac{2 e^{- 3 x}}{\left(1 + e^{- x}\right)^{3}}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 0.693147181 | 0.68817207 | 0.693122401 | 2.4779e-05 |
| -0.1 | 0.64439666 | 0.64315547 | 0.644393053 | 3.6076e-06 |
| 0.1 | 0.554355244 | 0.553122269 | 0.554359852 | 4.6075e-06 |
| 0.2 | 0.513015252 | 0.508105669 | 0.513056 | 4.0748e-05 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: preference-optimization](https://aman.ai/primers/preference-optimization/)
- [Aman.ai: reinforcement-learning](https://aman.ai/primers/reinforcement-learning/)

[Previous](36-ppo.md) · [Index](../README.md) · [Next](38-dpo-preference-optimization.md)
