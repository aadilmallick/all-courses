# 36. PPO, importance ratios, clipping, and KL monitoring

[Previous](35-actor-critic-gae.md) · [Index](../README.md) · [Next](37-reward-modeling-rlhf.md)

**Part:** Reinforcement learning and alignment. **Prerequisite:** read lessons 01–35 in order, or verify the earlier definitions used here.

## Reuse a rollout without pretending the policy stayed fixed

Collect actions under an old policy $\pi_{\text{old}}$, then update parameters. The action probability ratio is $r_t(\theta)=\pi_\theta(a_t\mid s_t)/\pi_{\text{old}}(a_t\mid s_t)$. Compute it as $\exp(\log\pi_\theta-\log\pi_{\text{old}})$ for numerical convenience. Old log-probabilities and advantage targets are fixed during optimization.

The PPO clipped surrogate maximizes

$$L^{\text{clip}}=\mathbb E\left[\min(r_t\widehat A_t,\operatorname{clip}(r_t,1-\epsilon,1+\epsilon)\widehat A_t)\right].$$

A minimization implementation negates this expression. A critic loss and entropy term may be added with explicit coefficients. Different implementations make different choices about value clipping and normalization.

## Work through both signs

Take $\epsilon=0.2$ and advantage $A=2$. At ratio $r=1.3$, the unclipped term is 2.6 and clipped term is 2.4, so the minimum is 2.4. Further increasing this action's probability supplies no additional surrogate benefit in that region.

Now take $A=-2$ and $r=0.7$. The unclipped term is -1.4 and clipped term is -1.6, so the minimum is -1.6. Further decreasing a bad action's probability past the lower bound likewise supplies no additional benefit. For a bad action whose probability increases, the unfavorable gradient remains active. Clipping is asymmetric because it limits improvement pressure, not all changes.

## Clipping is not a hard trust region

The objective does not constrain every action ratio or the full policy KL to a fixed bound. Ratios can move outside the clip range, including because parameters are shared across actions and examples. Monitor empirical KL, ratio distributions, clip fraction, entropy, reward, and critic behavior. Early stopping on a KL estimate is a separate control mechanism.

A sampled log-ratio statistic is not automatically an unbiased estimate of any chosen KL direction without the correct sampling distribution. State which policy supplied the samples. Keep reference-policy KL used in RLHF distinct from the old-policy ratio used to control one PPO update.

## Sequence models add masks and lengths

Token-level policy terms must exclude padding and prompt positions under the chosen objective. Terminal response rewards must be assigned under a documented return scheme. Averaging token terms versus averaging responses changes relative weight by response length.

The code prints surrogate values for positive and negative advantages and estimates derivatives away from clipping boundaries. It verifies the expected flat regions. At the boundary itself, the objective is piecewise differentiable and a finite difference can straddle two regions; do not use that as a smooth-gradient test.

### A complete local PPO optimizer is included

Run `python code/alignment_training.py` from the course root. The bandit experiment collects actions under an old categorical policy, stores the old probabilities, computes fixed centered rewards, and performs several clipped-surrogate updates. Its derivative uses $rA(\mathbf1_a-\pi)$ only where the selected surrogate branch is active. At positive advantage and ratio above the upper boundary, the branch is flat; at negative advantage and ratio below the lower boundary, it is flat. The experiment reports exact expected bandit reward under the known simulator means, avoiding confusion with one noisy sampled batch.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
def surrogate(ratio, advantage, epsilon=.2):
    return np.minimum(ratio*advantage, np.clip(ratio, 1-epsilon, 1+epsilon)*advantage)
ratios = np.array([.7, .9, 1., 1.1, 1.3])
print('positive', surrogate(ratios, 2.))
print('negative', surrogate(ratios, -2.))
def derivative(ratio, advantage):
    h = 1e-5
    return (surrogate(ratio+h, advantage)-surrogate(ratio-h, advantage))/(2*h)
assert np.allclose(derivative(1.3, 2.), 0)
assert np.allclose(derivative(.7, -2.), 0)
assert np.allclose(derivative(.9, 2.), 2)
print('active positive slope', derivative(.9, 2.))

```

### Code structure and observed intermediate values


#### Stage 2

```python
def surrogate(ratio, advantage, epsilon=.2):
    return np.minimum(ratio*advantage, np.clip(ratio, 1-epsilon, 1+epsilon)*advantage)
```

#### Stage 3

```python
ratios = np.array([.7, .9, 1., 1.1, 1.3])
```

An observed state during this stage was:

- `ratios`: `[0.7 0.9 1.  1.1 1.3]`

#### Stage 4

```python
print('positive', surrogate(ratios, 2.))
```

#### Stage 5

```python
print('negative', surrogate(ratios, -2.))
```

#### Stage 6

```python
def derivative(ratio, advantage):
    h = 1e-5
    return (surrogate(ratio+h, advantage)-surrogate(ratio-h, advantage))/(2*h)
```

#### Stage 7

```python
assert np.allclose(derivative(1.3, 2.), 0)
```

#### Stage 8

```python
assert np.allclose(derivative(.7, -2.), 0)
```

#### Stage 9

```python
assert np.allclose(derivative(.9, 2.), 2)
```

#### Stage 10

```python
print('active positive slope', derivative(.9, 2.))
```

Run from the course root:

```bash
python code/36_ppo.py
```

### Recorded output from the supplied environment

```text
positive [1.4 1.8 2.  2.2 2.4]
negative [-1.6 -1.8 -2.  -2.2 -2.6]
active positive slope 1.9999999999908977
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

The unclipped positive-advantage PPO branch in log-ratio coordinates; outside its region use the piecewise objective.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=2 e^{x}.$$

Its first derivative is

$$f^{(1)}(x)=2 e^{x}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=2 e^{x}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| -0.2 | 1.63746151 | 1.63746151 | 1.63746151 |
| 0 | 2 | 2 | 2 |
| 0.2 | 2.44280552 | 2.44280552 | 2.44280552 |

#### Evaluation 1: substitute $x=-0.2$

$$f(-0.2)=\frac{2}{e^{\frac{1}{5}}}\approx 1.63746151.$$
At this coordinate the slope is $1.63746151$, so the function increases under a sufficiently small positive perturbation. The curvature is $1.63746151$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.00163746151$. The quadratic correction is $f^{(2)}(x)h^2/2\approx8.18730753e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $0.00163828051$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0$

$$f(0)=2\approx 2.$$
At this coordinate the slope is $2$, so the function increases under a sufficiently small positive perturbation. The curvature is $2$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.002$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1e-06$. Adding them predicts the second-order change. The actual change from direct substitution is $0.00200100033$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.2$

$$f(0.2)=2 e^{\frac{1}{5}}\approx 2.44280552.$$
At this coordinate the slope is $2.44280552$, so the function increases under a sufficiently small positive perturbation. The curvature is $2.44280552$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.00244280552$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.22140276e-06$. Adding them predicts the second-order change. The actual change from direct substitution is $0.00244402733$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | 2.003335 | 0.003335 |
| 0.01 | 2.000033333 | 3.3333e-05 |
| 0.001 | 2.000000333 | 3.3333e-07 |
| 0.0001 | 2.000000003 | 3.3338e-09 |
| 1e-05 | 2 | 2.4205e-11 |
| 1e-06 | 2 | 5.3511e-11 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=2 e^{x}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 1.63746151 | 1.6 | 1.64 | 0.0025385 |
| -0.1 | 1.80967484 | 1.8 | 1.81 | 0.00032516 |
| 0.1 | 2.21034184 | 2.2 | 2.21 | 0.00034184 |
| 0.2 | 2.44280552 | 2.4 | 2.44 | 0.0028055 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: reinforcement-learning](https://aman.ai/primers/reinforcement-learning/)
- [Aman.ai: preference-optimization](https://aman.ai/primers/preference-optimization/)

[Previous](35-actor-critic-gae.md) · [Index](../README.md) · [Next](37-reward-modeling-rlhf.md)
