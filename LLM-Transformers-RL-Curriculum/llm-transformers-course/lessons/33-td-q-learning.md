# 33. Temporal differences, Q-learning, and exploration

[Previous](32-bellman-dynamic-programming.md) · [Index](../README.md) · [Next](34-policy-gradients.md)

**Part:** Reinforcement learning and alignment. **Prerequisite:** read lessons 01–32 in order, or verify the earlier definitions used here.

## Learn from sampled transitions

Dynamic programming assumes a known transition model. Temporal-difference learning uses observed transitions. With value estimate $V$, TD(0) error is $\delta_t=r_t+\gamma V(s_{t+1})-V(s_t)$, and the tabular update is $V(s_t)\leftarrow V(s_t)+\alpha\delta_t$. At a true terminal transition, omit the bootstrap term.

The target uses an estimate of future value, so TD bootstraps. Monte Carlo instead waits for a sampled complete return. Bootstrapping can reduce variance while introducing dependence on current value errors. This is a tradeoff, not a universal dominance claim.

## On-policy and off-policy targets

SARSA updates $Q(s_t,a_t)$ toward $r_t+\gamma Q(s_{t+1},a_{t+1})$, using the next action actually selected by the behavior policy. Q-learning uses $r_t+\gamma\max_aQ(s_{t+1},a)$, targeting greedy control even when behavior explores. The distinction is in the target policy, not whether the data were collected in a file or in memory.

For a transition to a terminal goal with reward one, the target is exactly one. If current $Q=0.2$ and $\alpha=0.1$, the updated value is $0.2+0.1(1-0.2)=0.28$. A preceding zero-reward state with discount $0.9$ eventually inherits value about $0.9$ when reaching that goal is optimal.

## Convergence has conditions

Tabular Q-learning has convergence results under finite discounted settings, sufficient visitation, and suitable diminishing step sizes, among other assumptions. Constant learning rates in one finite simulation do not meet every asymptotic condition. Neural function approximation, bootstrapping, and off-policy learning can interact unstably; tabular guarantees do not transfer automatically.

Deep Q-learning often uses replay buffers and target networks. Replay changes sample reuse and correlation. A target network temporarily holds bootstrap targets more stable. Double-Q ideas address maximization bias caused by using noisy estimates to select and evaluate the same action.

## Termination and truncation differ

A task-terminal state has no future task return. A rollout stopped only by a sampling time limit may still have future value, depending on the task definition. Treating all truncations as terminal can bias value estimates. Record both flags when the environment distinguishes them.

The code uses a deterministic three-state line world with a genuine terminal goal. It checks that the learned start-state greedy action moves right. This is a compact control example, not an implementation of a neural value learner or an LLM training system.

Optional application: add a negative step reward. The optimal policy should still reach the goal, but loops become less attractive. Derive the expected return for a path before changing the code so reward semantics remain clear.

### Why maximizing noisy estimates can overestimate value

Suppose two actions both have true value zero, but estimates independently take values plus or minus one with equal probability. The maximum estimate is minus one only when both are minus one, probability one quarter; otherwise it is plus one, probability three quarters. Expected maximum is therefore $-1/4+3/4=1/2$, even though the maximum true value is zero. This exact example explains maximization bias. Separating action selection from evaluation with suitably independent estimates can reduce that bias, though realistic estimates are not perfectly independent.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
rng = np.random.default_rng(33)
q = np.zeros((3, 2))
for episode in range(1500):
    state = 0
    for _ in range(20):
        action = int(rng.integers(2)) if rng.random() < .2 else int(q[state].argmax())
        next_state = min(2, state+1) if action == 1 else max(0, state-1)
        terminal = next_state == 2
        reward = float(terminal)
        target = reward if terminal else reward+.9*q[next_state].max()
        q[state, action] += .1*(target-q[state, action])
        state = next_state
        if terminal:
            break
assert q[0].argmax() == 1
print('Q values', q)

```

### Code structure and observed intermediate values


#### Stage 2

```python
rng = np.random.default_rng(33)
```

#### Stage 3

```python
q = np.zeros((3, 2))
```

An observed state during this stage was:

- `q`: `[[0. 0.]  [0. 0.]  [0. 0.]]`

#### Stage 4

```python
for episode in range(1500):
    state = 0
    for _ in range(20):
        action = int(rng.integers(2)) if rng.random() < .2 else int(q[state].argmax())
        next_state = min(2, state+1) if action == 1 else max(0, state-1)
        terminal = next_state == 2
        reward = float(terminal)
        target = reward if terminal else reward+.9*q[next_state].max()
        q[state, action] += .1*(target-q[state, action])
        state = next_state
        if terminal:
            break
```

An observed state during this stage was:

- `state`: `0`

This is one recorded iteration state, not necessarily the final loop state. The final printed result below is authoritative for the completed run. Long loops are deliberately sampled to keep the trace readable.

#### Stage 5

```python
assert q[0].argmax() == 1
```

#### Stage 6

```python
print('Q values', q)
```

Run from the course root:

```bash
python code/33_td_q_learning.py
```

### Recorded output from the supplied environment

```text
Q values [[0.81       0.9       ]
 [0.80999999 1.        ]
 [0.         0.        ]]
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

One tabular action-value regression step toward a fixed sampled TD target.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=\frac{\left(x - \frac{9}{10}\right)^{2}}{2}.$$

Its first derivative is

$$f^{(1)}(x)=x - \frac{9}{10}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=1.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 0 | 0.405 | -0.9 | 1 |
| 0.2 | 0.245 | -0.7 | 1 |
| 0.4 | 0.125 | -0.5 | 1 |

#### Evaluation 1: substitute $x=0$

$$f(0)=\frac{81}{200}\approx 0.405.$$
At this coordinate the slope is $-0.9$, so the function decreases under a sufficiently small positive perturbation. The curvature is $1$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.0009$. The quadratic correction is $f^{(2)}(x)h^2/2\approx5e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.0008995$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0.2$

$$f(0.2)=\frac{49}{200}\approx 0.245.$$
At this coordinate the slope is $-0.7$, so the function decreases under a sufficiently small positive perturbation. The curvature is $1$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.0007$. The quadratic correction is $f^{(2)}(x)h^2/2\approx5e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.0006995$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.4$

$$f(0.4)=\frac{1}{8}\approx 0.125.$$
At this coordinate the slope is $-0.5$, so the function decreases under a sufficiently small positive perturbation. The curvature is $1$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.0005$. The quadratic correction is $f^{(2)}(x)h^2/2\approx5e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.0004995$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | -0.7 | 3.3307e-16 |
| 0.01 | -0.7 | 1.9984e-15 |
| 0.001 | -0.7 | 7.6605e-15 |
| 0.0001 | -0.7 | 1.3256e-13 |
| 1e-05 | -0.7 | 7e-13 |
| 1e-06 | -0.7 | 2.1504e-11 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=0.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 0.405 | 0.385 | 0.405 | 5.5511e-17 |
| -0.1 | 0.32 | 0.315 | 0.32 | 1.1102e-16 |
| 0.1 | 0.18 | 0.175 | 0.18 | 0 |
| 0.2 | 0.125 | 0.105 | 0.125 | 1.3878e-17 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: reinforcement-learning](https://aman.ai/primers/reinforcement-learning/)

[Previous](32-bellman-dynamic-programming.md) · [Index](../README.md) · [Next](34-policy-gradients.md)
