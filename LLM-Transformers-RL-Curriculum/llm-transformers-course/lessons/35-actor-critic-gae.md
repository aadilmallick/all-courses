# 35. Actor-critic learning and generalized advantage estimation

[Previous](34-policy-gradients.md) · [Index](../README.md) · [Next](36-ppo.md)

**Part:** Reinforcement learning and alignment. **Prerequisite:** read lessons 01–34 in order, or verify the earlier definitions used here.

## Separate action selection from return prediction

The actor is a policy. The critic estimates a value used to reduce variance or bootstrap future returns. Advantage is $A^\pi(s,a)=Q^\pi(s,a)-V^\pi(s)$, measuring how an action compares with the policy's average at that state. A high-return state can still contain a negative-advantage action.

A sampled TD residual is $\delta_t=r_t+\gamma V(s_{t+1})-V(s_t)$, with terminal bootstrap zero. If the critic is exact, the residual is a noisy estimate of action advantage. An imperfect critic introduces estimation error that depends on its fit and the sampling distribution.

## Derive the GAE recursion

Generalized advantage estimation combines future TD residuals:

$$\widehat A_t=\sum_{l=0}^{T-t-1}(\gamma\lambda)^l\delta_{t+l}.$$

Separate the first residual and factor $\gamma\lambda$ from the rest to obtain $\widehat A_t=\delta_t+\gamma\lambda\widehat A_{t+1}$. Compute this backward, resetting propagation at terminal boundaries. This is a weighted sum of residuals, not a new Bellman equation for the true value function.

When $\lambda=0$, use a one-step residual. When $\lambda=1$ over a truly terminated rollout, the sum telescopes to sampled return minus $V(s_t)$. To see it, expand the value terms: each $+\gamma^{l+1}V(s_{t+l+1})$ cancels the next $-\gamma^{l+1}V(s_{t+l+1})$. At a truncated rollout, a final bootstrap remains.

## Build targets without accidental gradient paths

A common critic target is $\widehat R_t=\widehat A_t+V_{\text{old}}(s_t)$. Fit the new critic to this fixed target with squared error. The actor uses fixed advantages in its policy surrogate. Letting gradients flow through the advantage computation changes the objective and can let the policy manipulate its own training target.

Advantage normalization subtracts the batch mean and divides by a batch standard deviation plus epsilon. It can stabilize numerical scale but changes finite-sample behavior and interacts with grouping and padding. Constant advantages have zero centered signal; be deliberate about whether that is desired.

## Numerical trace

The example computes residuals and a backward GAE recursion for a three-step terminal episode, then checks the $\lambda=1$ telescoping identity against directly computed returns. It keeps the final state's value zero and records terminal status explicitly.

A critic can become more accurate under its regression metric without producing a better policy if the sampled distribution, rewards, or actor update are unsuitable. Track actor reward and held-out task behavior alongside critic loss and explained variance.

### Expand a two-step GAE estimate

For residuals $\delta_0,\delta_1$ in a terminal two-step episode, $A_0=\delta_0+\gamma\lambda\delta_1$ and $A_1=\delta_1$. Substitute $\delta_0=r_0+\gamma V_1-V_0$ and $\delta_1=r_1-V_1$ to get $A_0=r_0+\gamma\lambda r_1-V_0+\gamma(1-\lambda)V_1$. At $\lambda=1$, the intermediate value cancels and the estimate is sampled return minus initial value. At $\lambda=0$, only the one-step bootstrap remains. The expansion shows exactly where critic error enters as lambda changes.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
reward = np.array([0., 0., 1.])
value = np.array([.2, .3, .4, 0.])
gamma, lam = .9, .95
delta = reward+gamma*value[1:]-value[:-1]
def gae(parameter):
    output, running = np.zeros(3), 0.
    for index in range(2, -1, -1):
        running = delta[index]+gamma*parameter*running
        output[index] = running
    return output
returns, running = np.zeros(3), 0.
for index in range(2, -1, -1):
    running = reward[index]+gamma*running
    returns[index] = running
assert np.allclose(gae(1), returns-value[:-1])
print('TD residual', delta, 'GAE', gae(lam), 'return', returns)

```

### Code structure and observed intermediate values


#### Stage 2

```python
reward = np.array([0., 0., 1.])
```

An observed state during this stage was:

- `reward`: `[0. 0. 1.]`

#### Stage 3

```python
value = np.array([.2, .3, .4, 0.])
```

An observed state during this stage was:

- `value`: `[0.2 0.3 0.4 0. ]`

#### Stage 4

```python
gamma, lam = .9, .95
```

An observed state during this stage was:

- `gamma`: `0.9`
- `lam`: `0.95`

#### Stage 5

```python
delta = reward+gamma*value[1:]-value[:-1]
```

An observed state during this stage was:

- `delta`: `[0.07 0.06 0.6 ]`

#### Stage 6

```python
def gae(parameter):
    output, running = np.zeros(3), 0.
    for index in range(2, -1, -1):
        running = delta[index]+gamma*parameter*running
        output[index] = running
    return output
```

#### Stage 7

```python
returns, running = np.zeros(3), 0.
```

An observed state during this stage was:

- `returns`: `[0. 0. 0.]`
- `running`: `0`

#### Stage 8

```python
for index in range(2, -1, -1):
    running = reward[index]+gamma*running
    returns[index] = running
```

An observed state during this stage was:

- `returns`: `[0.81 0.9  1.  ]`

This is one recorded iteration state, not necessarily the final loop state. The final printed result below is authoritative for the completed run. Long loops are deliberately sampled to keep the trace readable.

#### Stage 9

```python
assert np.allclose(gae(1), returns-value[:-1])
```

#### Stage 10

```python
print('TD residual', delta, 'GAE', gae(lam), 'return', returns)
```

Run from the course root:

```bash
python code/35_actor_critic_gae.py
```

### Recorded output from the supplied environment

```text
TD residual [0.07 0.06 0.6 ] GAE [0.559915 0.573    0.6     ] return [0.81 0.9  1.  ]
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

A critic regression loss toward the start-state return of a three-step terminal episode.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=\frac{\left(x - \frac{81}{100}\right)^{2}}{2}.$$

Its first derivative is

$$f^{(1)}(x)=x - \frac{81}{100}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=1.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 0 | 0.32805 | -0.81 | 1 |
| 0.2 | 0.18605 | -0.61 | 1 |
| 0.4 | 0.08405 | -0.41 | 1 |

#### Evaluation 1: substitute $x=0$

$$f(0)=\frac{6561}{20000}\approx 0.32805.$$
At this coordinate the slope is $-0.81$, so the function decreases under a sufficiently small positive perturbation. The curvature is $1$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.00081$. The quadratic correction is $f^{(2)}(x)h^2/2\approx5e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.0008095$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0.2$

$$f(0.2)=\frac{3721}{20000}\approx 0.18605.$$
At this coordinate the slope is $-0.61$, so the function decreases under a sufficiently small positive perturbation. The curvature is $1$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.00061$. The quadratic correction is $f^{(2)}(x)h^2/2\approx5e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.0006095$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.4$

$$f(0.4)=\frac{1681}{20000}\approx 0.08405.$$
At this coordinate the slope is $-0.41$, so the function decreases under a sufficiently small positive perturbation. The curvature is $1$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.00041$. The quadratic correction is $f^{(2)}(x)h^2/2\approx5e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.0004095$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | -0.61 | 1.1102e-16 |
| 0.01 | -0.61 | 6.6613e-16 |
| 0.001 | -0.61 | 6.6613e-16 |
| 0.0001 | -0.61 | 8.3933e-14 |
| 1e-05 | -0.61 | 8.8751e-13 |
| 1e-06 | -0.61 | 1.5766e-11 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=0.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 0.32805 | 0.30805 | 0.32805 | 0 |
| -0.1 | 0.25205 | 0.24705 | 0.25205 | 0 |
| 0.1 | 0.13005 | 0.12505 | 0.13005 | 5.5511e-17 |
| 0.2 | 0.08405 | 0.06405 | 0.08405 | 1.3878e-17 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: reinforcement-learning](https://aman.ai/primers/reinforcement-learning/)

[Previous](34-policy-gradients.md) · [Index](../README.md) · [Next](36-ppo.md)
