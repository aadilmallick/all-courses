# 31. Bandits, policies, returns, and Markov decision processes

[Previous](30-knowledge-distillation.md) · [Index](../README.md) · [Next](32-bellman-dynamic-programming.md)

**Part:** Reinforcement learning and alignment. **Prerequisite:** read lessons 01–30 in order, or verify the earlier definitions used here.

## Predicting a label differs from choosing an action

In supervised learning, an example supplies a target. In reinforcement learning, an agent chooses an action, receives feedback, and may change what it observes next. A policy describes action selection. A reward describes a task signal. Neither a reward function nor a high measured reward is automatically a complete specification of what people want.

A bandit has actions and rewards without state transitions relevant to future decisions. An MDP adds states $s$, actions $a$, transition law $P(s'\mid s,a)$, reward distribution, initial-state distribution, and discount $\gamma$. The Markov assumption says the current state contains the information needed to predict the next state and reward given the action. A language prefix can be treated as a state, though practical summaries may lose relevant history.

## Define a return before optimizing it

For rewards $r_t$, define discounted return $G_t=\sum_{k=0}^{T-t-1}\gamma^kr_{t+k}$. With rewards $(1,0,2)$ and $\gamma=0.9$, $G_0=1+0.9\cdot0+0.9^2\cdot2=2.62$. The recursion is $G_t=r_t+\gamma G_{t+1}$, with terminal return zero. This follows by factoring one power of $\gamma$ from all terms after the first.

For infinite horizons and $0\le\gamma<1$, bounded rewards ensure the return converges absolutely. Finite-horizon tasks can use $\gamma=1$, but time may need to be included in the state if optimal behavior depends on remaining steps.

## Exploration creates information

A greedy bandit agent selects the largest estimated value and can become stuck after noisy initial feedback. Epsilon-greedy selects a random action with probability $\epsilon$ and otherwise exploits. UCB methods add an uncertainty bonus, while Thompson sampling samples plausible reward parameters. Each approach uses assumptions about stationarity and reward structure.

For sample mean $Q_n$ after $n$ observations, the update $Q_n=Q_{n-1}+(R_n-Q_{n-1})/n$ follows by expanding the new mean. Constant step sizes instead emphasize recent observations and can track drift, at the expense of not converging to the exact historical mean.

## A miniature experiment with a precise boundary

The code simulates three Bernoulli arms and epsilon-greedy learning. The reward probabilities are known to the simulator but hidden from the policy. It reports estimates and action counts; one finite random run is not a performance theorem.

In LLM alignment, a whole response can be treated as one action in a contextual bandit, or generation can be treated as token-by-token sequential decision making. The choice changes where credit assignment and value estimation appear. Both formulations need a clearly defined reward and sampling distribution.

### Markov state is a modeling choice you can test

Suppose a robot's observation is only position, but velocity affects its next position under the same action. Two histories with identical current position and different velocities can have different next-state distributions. Position alone is then not Markov for those dynamics. Adding velocity can restore the property for a suitable physical model. In an LLM agent, a summary that omits whether a tool action already succeeded creates the same type of ambiguity: identical visible summaries can require different next actions. State design is therefore a prerequisite to meaningful policy learning.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
rng = np.random.default_rng(31)
truth = np.array([0.2, 0.5, 0.8])
estimate, counts = np.zeros(3), np.zeros(3, dtype=int)
for step in range(2000):
    action = int(rng.integers(3)) if rng.random() < 0.1 else int(estimate.argmax())
    reward = float(rng.random() < truth[action])
    counts[action] += 1
    estimate[action] += (reward-estimate[action])/counts[action]
rewards = [1., 0., 2.]
returns, running = [], 0.
for reward in rewards[::-1]:
    running = reward+0.9*running
    returns.append(running)
assert np.allclose(returns[-1], 2.62)
print('estimates', estimate, 'counts', counts, 'return', returns[-1])

```

### Code structure and observed intermediate values


#### Stage 2

```python
rng = np.random.default_rng(31)
```

#### Stage 3

```python
truth = np.array([0.2, 0.5, 0.8])
```

An observed state during this stage was:

- `truth`: `[0.2 0.5 0.8]`

#### Stage 4

```python
estimate, counts = np.zeros(3), np.zeros(3, dtype=int)
```

An observed state during this stage was:

- `estimate`: `[0. 0. 0.]`
- `counts`: `[0 0 0]`

#### Stage 5

```python
for step in range(2000):
    action = int(rng.integers(3)) if rng.random() < 0.1 else int(estimate.argmax())
    reward = float(rng.random() < truth[action])
    counts[action] += 1
    estimate[action] += (reward-estimate[action])/counts[action]
```

An observed state during this stage was:

- `estimate`: `[0.21429 0.      0.     ]`

This is one recorded iteration state, not necessarily the final loop state. The final printed result below is authoritative for the completed run. Long loops are deliberately sampled to keep the trace readable.

#### Stage 6

```python
rewards = [1., 0., 2.]
```

#### Stage 7

```python
returns, running = [], 0.
```

#### Stage 8

```python
for reward in rewards[::-1]:
    running = reward+0.9*running
    returns.append(running)
```

#### Stage 9

```python
assert np.allclose(returns[-1], 2.62)
```

#### Stage 10

```python
print('estimates', estimate, 'counts', counts, 'return', returns[-1])
```

Run from the course root:

```bash
python code/31_rl_foundations.py
```

### Recorded output from the supplied environment

```text
estimates [0.15909091 0.5        0.78867102] counts [  88   76 1836] return 2.62
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

Expected bandit reward for a sigmoid policy choosing between arms of means 0.2 and 0.8.

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
| -0.2 | 0.470099602 | 0.148509944 | 0.0148016883 |
| 0 | 0.5 | 0.15 | 0 |
| 0.2 | 0.529900398 | 0.148509944 | -0.0148016883 |

#### Evaluation 1: substitute $x=-0.2$

$$f(-0.2)=\frac{1}{5} + \frac{3}{5 \left(1 + e^{\frac{1}{5}}\right)}\approx 0.470099602.$$
At this coordinate the slope is $0.148509944$, so the function increases under a sufficiently small positive perturbation. The curvature is $0.0148016883$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.000148509944$. The quadratic correction is $f^{(2)}(x)h^2/2\approx7.40084413e-09$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000148517332$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0$

$$f(0)=\frac{1}{2}\approx 0.5.$$
At this coordinate the slope is $0.15$, so the function increases under a sufficiently small positive perturbation. The curvature is $0$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.00015$. The quadratic correction is $f^{(2)}(x)h^2/2\approx0$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000149999987$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.2$

$$f(0.2)=\frac{1}{5} + \frac{3}{5 \left(e^{- \frac{1}{5}} + 1\right)}\approx 0.529900398.$$
At this coordinate the slope is $0.148509944$, so the function increases under a sufficiently small positive perturbation. The curvature is $-0.0148016883$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.000148509944$. The quadratic correction is $f^{(2)}(x)h^2/2\approx-7.40084413e-09$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000148502531$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | 0.1498751249 | 0.00012488 |
| 0.01 | 0.14999875 | 1.25e-06 |
| 0.001 | 0.1499999875 | 1.25e-08 |
| 0.0001 | 0.1499999999 | 1.2531e-10 |
| 1e-05 | 0.15 | 1.2378e-12 |
| 1e-06 | 0.15 | 4.3134e-12 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=\frac{3 e^{- x}}{5 \left(1 + e^{- x}\right)^{2}} - \frac{18 e^{- 2 x}}{5 \left(1 + e^{- x}\right)^{3}} + \frac{18 e^{- 3 x}}{5 \left(1 + e^{- x}\right)^{4}}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 0.470099602 | 0.47 | 0.47 | 9.9602e-05 |
| -0.1 | 0.485012488 | 0.485 | 0.485 | 1.2488e-05 |
| 0.1 | 0.514987512 | 0.515 | 0.515 | 1.2488e-05 |
| 0.2 | 0.529900398 | 0.53 | 0.53 | 9.9602e-05 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: reinforcement-learning](https://aman.ai/primers/reinforcement-learning/)

[Previous](30-knowledge-distillation.md) · [Index](../README.md) · [Next](32-bellman-dynamic-programming.md)
