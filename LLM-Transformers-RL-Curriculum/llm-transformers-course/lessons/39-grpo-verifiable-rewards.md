# 39. GRPO, group baselines, and verifiable rewards

[Previous](38-dpo-preference-optimization.md) · [Index](../README.md) · [Next](40-prompting-search.md)

**Part:** Reinforcement learning and alignment. **Prerequisite:** read lessons 01–38 in order, or verify the earlier definitions used here.

## Relative feedback within a prompt

For a prompt, sample a group of responses and assign rewards $R_1,\ldots,R_G$. A common group-relative advantage is $A_i=(R_i-\overline R)/(s_R+\epsilon)$, with a stated standard-deviation convention. This avoids learning a separate value model in that design, but the group statistic is still an estimator with its own finite-sample behavior.

If rewards are $(0,0,1,1)$, the population mean is $0.5$ and population standard deviation is $0.5$, so normalized advantages are approximately $(-1,-1,1,1)$. If every reward is identical, centered advantages are zero. A prompt on which every sampled response fails may therefore supply no relative task gradient under this rule, although other regularizers may remain active.

## Relate the update to PPO carefully

A GRPO-style objective can use old-policy importance ratios, clipped surrogates, and a reference-policy KL term with group-derived advantages. Token versus sequence reduction, response-length weighting, group normalization, and KL estimators vary between methods. 'GRPO' alone does not specify all those choices. Read the actual algorithm and implementation configuration before reproducing a result.

A group mean includes each response's own reward. For iid samples without normalization, centering by this mean introduces a finite-group factor in a simple score-function expectation: the expected centered estimator is $(1-1/G)$ times the uncentered reward gradient. A leave-one-out baseline avoids that particular self-inclusion effect under its assumptions. Division by random standard deviation introduces further behavior.

## What verifiability buys and what it does not

An exact arithmetic checker or executable test can provide reliable feedback for a specified condition. It may still be incomplete. Code can overfit visible tests; mathematical answers can have correct final values and invalid reasoning; parsers can accept unintended formats. Reward coverage determines what is optimized.

Separate answer correctness, formatting, and process constraints. Track reward hacking, answer extraction failures, pass rates under independent tests, and performance outside the rewarded domain. More optimization against a narrow checker does not prove broad reasoning improvement.

## A bounded numerical experiment

The code normalizes groups with both mixed and constant rewards, verifies zero mean, and computes a clipped policy surrogate. It explicitly uses population standard deviation with `ddof=0`. It does not implement a production rollout service or make a claim about the quality of generated explanations.

Optional application: compare groups of size two and eight under the same Bernoulli reward rate. Count how often every reward is equal. This quantifies how frequently a relative-only signal disappears for that sampling problem.

### Quantify all-equal reward groups

With independent Bernoulli success probability $p$ and group size $G$, all rewards are equal when either every response fails or every response succeeds. The probability is $(1-p)^G+p^G$. For $p=0.1,G=4$, it is $0.9^4+0.1^4=0.6562$. Thus most groups in this example carry no centered relative reward signal. Increasing group size changes this probability but also sampling cost. Curriculum choice, prompt difficulty, and alternative baselines can matter as much as the clipping equation when designing a practical relative-reward learner.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
def group_advantage(rewards):
    rewards = np.asarray(rewards, dtype=float)
    return (rewards-rewards.mean())/(rewards.std(ddof=0)+1e-8)
mixed = group_advantage([0, 0, 1, 1])
constant = group_advantage([0, 0, 0, 0])
assert np.allclose(mixed.mean(), 0)
assert np.allclose(constant, 0)
ratio = np.array([.9, 1.1, 1.3, .8])
surrogate = np.minimum(ratio*mixed, np.clip(ratio, .8, 1.2)*mixed)
print('mixed advantages', mixed, 'constant', constant, 'surrogate', surrogate.mean())

```

### Code structure and observed intermediate values


#### Stage 2

```python
def group_advantage(rewards):
    rewards = np.asarray(rewards, dtype=float)
    return (rewards-rewards.mean())/(rewards.std(ddof=0)+1e-8)
```

#### Stage 3

```python
mixed = group_advantage([0, 0, 1, 1])
```

An observed state during this stage was:

- `mixed`: `[-1. -1.  1.  1.]`

#### Stage 4

```python
constant = group_advantage([0, 0, 0, 0])
```

An observed state during this stage was:

- `constant`: `[0. 0. 0. 0.]`

#### Stage 5

```python
assert np.allclose(mixed.mean(), 0)
```

#### Stage 6

```python
assert np.allclose(constant, 0)
```

#### Stage 7

```python
ratio = np.array([.9, 1.1, 1.3, .8])
```

An observed state during this stage was:

- `ratio`: `[0.9 1.1 1.3 0.8]`

#### Stage 8

```python
surrogate = np.minimum(ratio*mixed, np.clip(ratio, .8, 1.2)*mixed)
```

An observed state during this stage was:

- `surrogate`: `[-0.9 -1.1  1.2  0.8]`

#### Stage 9

```python
print('mixed advantages', mixed, 'constant', constant, 'surrogate', surrogate.mean())
```

Run from the course root:

```bash
python code/39_grpo_verifiable_rewards.py
```

### Recorded output from the supplied environment

```text
mixed advantages [-0.99999998 -0.99999998  0.99999998  0.99999998] constant [0. 0. 0. 0.] surrogate 0.0
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

An importance-ratio slice before clipping, with old log-probability fixed and a group advantage held constant.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=e^{x}.$$

Its first derivative is

$$f^{(1)}(x)=e^{x}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=e^{x}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| -0.2 | 0.818730753 | 0.818730753 | 0.818730753 |
| 0 | 1 | 1 | 1 |
| 0.2 | 1.22140276 | 1.22140276 | 1.22140276 |

#### Evaluation 1: substitute $x=-0.2$

$$f(-0.2)=e^{- \frac{1}{5}}\approx 0.818730753.$$
At this coordinate the slope is $0.818730753$, so the function increases under a sufficiently small positive perturbation. The curvature is $0.818730753$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.000818730753$. The quadratic correction is $f^{(2)}(x)h^2/2\approx4.09365377e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000819140255$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0$

$$f(0)=1\approx 1.$$
At this coordinate the slope is $1$, so the function increases under a sufficiently small positive perturbation. The curvature is $1$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.001$. The quadratic correction is $f^{(2)}(x)h^2/2\approx5e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $0.00100050017$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.2$

$$f(0.2)=e^{\frac{1}{5}}\approx 1.22140276.$$
At this coordinate the slope is $1.22140276$, so the function increases under a sufficiently small positive perturbation. The curvature is $1.22140276$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.00122140276$. The quadratic correction is $f^{(2)}(x)h^2/2\approx6.10701379e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $0.00122201366$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | 1.0016675 | 0.0016675 |
| 0.01 | 1.000016667 | 1.6667e-05 |
| 0.001 | 1.000000167 | 1.6667e-07 |
| 0.0001 | 1.000000002 | 1.6669e-09 |
| 1e-05 | 1 | 1.2102e-11 |
| 1e-06 | 1 | 2.6755e-11 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=e^{x}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 0.818730753 | 0.8 | 0.82 | 0.0012692 |
| -0.1 | 0.904837418 | 0.9 | 0.905 | 0.00016258 |
| 0.1 | 1.10517092 | 1.1 | 1.105 | 0.00017092 |
| 0.2 | 1.22140276 | 1.2 | 1.22 | 0.0014028 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: preference-optimization](https://aman.ai/primers/preference-optimization/)
- [Aman.ai: reinforcement-learning](https://aman.ai/primers/reinforcement-learning/)

[Previous](38-dpo-preference-optimization.md) · [Index](../README.md) · [Next](40-prompting-search.md)
