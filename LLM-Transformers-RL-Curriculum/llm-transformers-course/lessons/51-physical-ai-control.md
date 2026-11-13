# 51. Physical AI, partial observability, imitation, and control

[Previous](50-recursive-self-improvement.md) · [Index](../README.md) · [Next](52-generative-actions-world-models.md)

**Part:** Multimodal and embodied models. **Prerequisite:** read lessons 01–50 in order, or verify the earlier definitions used here.

## Acting in the world changes the problem

A physical agent receives imperfect observations and chooses actions whose effects unfold under dynamics and latency. A language instruction alone does not specify a complete control policy. The system also needs perception, state estimation, action representations, timing, feedback, and task constraints.

An MDP state contains information sufficient for predicting transitions. A robot often sees only observation $o_t$ generated from hidden state $s_t$, leading to a partially observable MDP. A belief distribution over states or a learned history representation can summarize uncertainty. Treating one camera frame as a complete state is a modeling assumption that can fail under occlusion or motion ambiguity.

## Behavioral cloning from demonstrations

Given observations and expert actions, behavioral cloning minimizes a supervised action loss, such as $\mathbb E\|\pi_\theta(o)-a^*\|^2$ for suitable continuous actions. Deployment exposes the learner to its own mistakes, shifting the state distribution away from expert demonstrations. Small local errors can compound. Data aggregation with expert corrections is one way to address this mismatch under the method's assumptions.

A single mean-squared-error action prediction can be unsuitable for multimodal actions. If an obstacle can be passed safely on either side, averaging left and right demonstrations can point directly at the obstacle. The conditional mean minimizes squared error but need not be a safe or feasible action.

## Feedback control with a solvable system

Consider scalar dynamics $x_{t+1}=x_t+\Delta t\,u_t$ and target zero. Choose proportional feedback $u_t=-kx_t$. Then $x_{t+1}=(1-\Delta t k)x_t$. Stability requires $|1-\Delta t k|<1$, giving $0<\Delta t k<2$. This is the same geometric convergence structure seen in quadratic optimization, now with a physical state interpretation.

Real dynamics include actuator limits, delays, contacts, and model errors. A high-level vision-language-action model can propose goals or action chunks, while a faster controller handles local feedback. The actual separation of responsibilities should be explicit.

## Evaluation must reflect deployment variation

Measure success across initial conditions, objects, viewpoints, disturbances, and embodiments. Simulation can support repeatability and scale, but simulation-to-real transfer depends on what dynamics and sensing variations are represented. A successful text plan is not evidence of successful physical execution.

The code simulates only the scalar system, compares stable and unstable gains, and reports state trajectories. It sends no commands to hardware. The exact stability derivation applies to this discrete linear model; it does not certify a robot controller or a learned policy.

### Why mean action can be physically wrong

Suppose at an obstacle, expert action is left with probability one half and right with probability one half, represented as $a=-1$ and $a=1$. A deterministic squared-error predictor minimizes $\mathbb E(\widehat a-a)^2=\widehat a^2+1$, whose derivative is $2\widehat a$ and minimizer is zero. If zero points into the obstacle, the statistically optimal mean under this loss is behaviorally unsuitable. A multimodal policy can represent the two alternatives, while feedback and feasibility checks decide how to execute one. The loss must match the action semantics.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
def simulate(gain, dt=.1, steps=20):
    state, trajectory = 1., [1.]
    for _ in range(steps):
        action = -gain*state
        state += dt*action
        trajectory.append(state)
    return np.array(trajectory)
stable = simulate(5)
unstable = simulate(25)
assert abs(stable[-1]) < abs(stable[0])
assert abs(unstable[-1]) > abs(unstable[0])
print('stable final', stable[-1], 'unstable final', unstable[-1])
print('opposite demonstration mean', np.mean([-1., 1.]))

```

### Code structure and observed intermediate values


#### Stage 2

```python
def simulate(gain, dt=.1, steps=20):
    state, trajectory = 1., [1.]
    for _ in range(steps):
        action = -gain*state
        state += dt*action
        trajectory.append(state)
    return np.array(trajectory)
```

#### Stage 3

```python
stable = simulate(5)
```

An observed state during this stage was:

- `stable`: `array shape=(21,), min=9.53674e-07, max=1, norm=1.1547`

#### Stage 4

```python
unstable = simulate(25)
```

An observed state during this stage was:

- `unstable`: `array shape=(21,), min=-2216.84, max=3325.26, norm=4461.3`

#### Stage 5

```python
assert abs(stable[-1]) < abs(stable[0])
```

#### Stage 6

```python
assert abs(unstable[-1]) > abs(unstable[0])
```

#### Stage 7

```python
print('stable final', stable[-1], 'unstable final', unstable[-1])
```

#### Stage 8

```python
print('opposite demonstration mean', np.mean([-1., 1.]))
```

Run from the course root:

```bash
python code/51_physical_ai_control.py
```

### Recorded output from the supplied environment

```text
stable final 9.5367431640625e-07 unstable final 3325.256730079651
opposite demonstration mean 0.0
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

Squared one-step state contraction factor as proportional gain changes in the specified scalar dynamics.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=\left(1 - \frac{x}{10}\right)^{2}.$$

Its first derivative is

$$f^{(1)}(x)=\frac{x}{50} - \frac{1}{5}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=\frac{1}{50}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 4.8 | 0.2704 | -0.104 | 0.02 |
| 5 | 0.25 | -0.1 | 0.02 |
| 5.2 | 0.2304 | -0.096 | 0.02 |

#### Evaluation 1: substitute $x=4.8$

$$f(4.8)=\frac{169}{625}\approx 0.2704.$$
At this coordinate the slope is $-0.104$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.02$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.000104$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.00010399$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=5$

$$f(5)=\frac{1}{4}\approx 0.25.$$
At this coordinate the slope is $-0.1$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.02$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.0001$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $-9.999e-05$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=5.2$

$$f(5.2)=\frac{144}{625}\approx 0.2304.$$
At this coordinate the slope is $-0.096$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.02$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-9.6e-05$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $-9.599e-05$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | -0.1 | 8.3267e-17 |
| 0.01 | -0.1 | 6.8556e-15 |
| 0.001 | -0.1 | 4.4492e-14 |
| 0.0001 | -0.1 | 4.5511e-13 |
| 1e-05 | -0.1 | 4.0633e-12 |
| 1e-06 | -0.1000000001 | 5.8387e-11 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=0.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 0.2704 | 0.27 | 0.2704 | 0 |
| -0.1 | 0.2601 | 0.26 | 0.2601 | 0 |
| 0.1 | 0.2401 | 0.24 | 0.2401 | 0 |
| 0.2 | 0.2304 | 0.23 | 0.2304 | 0 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: physical-ai](https://aman.ai/primers/physical-ai/)

[Previous](50-recursive-self-improvement.md) · [Index](../README.md) · [Next](52-generative-actions-world-models.md)
