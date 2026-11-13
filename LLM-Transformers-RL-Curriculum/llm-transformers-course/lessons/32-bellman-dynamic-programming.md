# 32. Bellman equations, policy evaluation, and dynamic programming

[Previous](31-rl-foundations.md) · [Index](../README.md) · [Next](33-td-q-learning.md)

**Part:** Reinforcement learning and alignment. **Prerequisite:** read lessons 01–31 in order, or verify the earlier definitions used here.

## A value is an expected future return

For fixed policy $\pi$, $V^\pi(s)=\mathbb E_\pi[G_t\mid s_t=s]$. Split the first reward from the return and condition on the next action and state:

$$V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s'}P(s'\mid s,a)\left(r(s,a,s')+\gamma V^\pi(s')\right).$$

The sums are the law of total expectation. Define policy-averaged reward vector $r_\pi$ and transition matrix $P_\pi$. Then $V=r_\pi+\gamma P_\pi V$, or $(I-\gamma P_\pi)V=r_\pi$. For finite states and $\gamma<1$, this has a unique solution under standard stochastic transition assumptions.

## Why repeated backups converge

Define $T_\pi V=r_\pi+\gamma P_\pi V$. For any vectors $U,V$, the absolute difference at a state is bounded by $\gamma\sum_{s'}P_\pi(s'\mid s)|U(s')-V(s')|\le\gamma\|U-V\|_\infty$. Taking the maximum gives a contraction. Repeated application shrinks value error geometrically, proving convergence to the unique fixed point.

For control, replace policy averaging over actions by a maximum: $(T_*V)(s)=\max_a\mathbb E[r+\gamma V(s')]$. The inequality $|\max_a u_a-\max_a v_a|\le\max_a|u_a-v_a|$ yields the same contraction factor. Value iteration repeatedly applies this optimality backup.

## Policy improvement

Given $V^\pi$, define $Q^\pi(s,a)=\mathbb E[r+\gamma V^\pi(s')]$. A greedy policy selects an action maximizing this quantity. Under the finite discounted setting, this policy is at least as good in value as the original. The key idea is that replacing one decision by a no-worse action and then repeatedly applying the improved policy preserves the inequality through Bellman backups.

The result concerns exact values and the actual MDP. Approximation error, insufficient exploration, and function approximation complicate the guarantee. An LLM reward model is not an exact known environment reward merely because it outputs a number.

## Trace the small system

The code solves a two-state fixed-policy model both by a linear solve and by repeated Bellman backups. Comparing these independent procedures checks the fixed-point implementation. It also reports a residual $\|V-(r+\gamma PV)\|_\infty$, which measures equation consistency.

A terminal state can be represented by zero future value and no further reward, or by an absorbing zero-reward state. Keep the transition convention consistent. Bootstrapping from an arbitrary nonzero terminal value introduces reward that the task never supplied.

### Bellman residual bounds value error in the discounted case

Let $V^*$ be the fixed point of contraction $T$ with factor $\gamma<1$, and let approximate value $V$ have residual $\epsilon=\|V-TV\|_\infty$. By the triangle inequality, $\|V-V^*\|\le\|V-TV\|+\|TV-TV^*\|\le\epsilon+\gamma\|V-V^*\|$. Rearranging gives $\|V-V^*\|_\infty\le\epsilon/(1-\gamma)$. The bound becomes loose as discount approaches one. It applies to the stated exact Bellman operator, not an arbitrary sampled or neural approximation whose residual was evaluated on only a few states.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
transition = np.array([[0.7, 0.3], [0.2, 0.8]])
reward = np.array([1., 0.])
discount = 0.9
exact = np.linalg.solve(np.eye(2)-discount*transition, reward)
value = np.zeros(2)
for _ in range(250):
    value = reward+discount*transition @ value
residual = np.max(np.abs(value-(reward+discount*transition @ value)))
assert np.allclose(value, exact, atol=1e-9)
print('value', value, 'Bellman residual', residual)

```

### Code structure and observed intermediate values


#### Stage 2

```python
transition = np.array([[0.7, 0.3], [0.2, 0.8]])
```

An observed state during this stage was:

- `transition`: `[[0.7 0.3]  [0.2 0.8]]`

#### Stage 3

```python
reward = np.array([1., 0.])
```

An observed state during this stage was:

- `reward`: `[1. 0.]`

#### Stage 4

```python
discount = 0.9
```

An observed state during this stage was:

- `discount`: `0.9`

#### Stage 5

```python
exact = np.linalg.solve(np.eye(2)-discount*transition, reward)
```

An observed state during this stage was:

- `exact`: `[5.09091 3.27273]`

#### Stage 6

```python
value = np.zeros(2)
```

An observed state during this stage was:

- `value`: `[0. 0.]`

#### Stage 7

```python
for _ in range(250):
    value = reward+discount*transition @ value
```

An observed state during this stage was:

- `value`: `[5.07029 3.25211]`

This is one recorded iteration state, not necessarily the final loop state. The final printed result below is authoritative for the completed run. Long loops are deliberately sampled to keep the trace readable.

#### Stage 8

```python
residual = np.max(np.abs(value-(reward+discount*transition @ value)))
```

#### Stage 9

```python
assert np.allclose(value, exact, atol=1e-9)
```

#### Stage 10

```python
print('value', value, 'Bellman residual', residual)
```

Run from the course root:

```bash
python code/32_bellman_dynamic_programming.py
```

### Recorded output from the supplied environment

```text
value [5.09090909 3.27272727] Bellman residual 1.4548362514688051e-12
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

A squared Bellman-target regression loss with the bootstrap target held fixed.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=\frac{\left(x - \frac{14}{5}\right)^{2}}{2}.$$

Its first derivative is

$$f^{(1)}(x)=x - \frac{14}{5}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=1.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| -0.2 | 4.5 | -3 | 1 |
| 0 | 3.92 | -2.8 | 1 |
| 0.2 | 3.38 | -2.6 | 1 |

#### Evaluation 1: substitute $x=-0.2$

$$f(-0.2)=\frac{9}{2}\approx 4.5.$$
At this coordinate the slope is $-3$, so the function decreases under a sufficiently small positive perturbation. The curvature is $1$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.003$. The quadratic correction is $f^{(2)}(x)h^2/2\approx5e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.0029995$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0$

$$f(0)=\frac{98}{25}\approx 3.92.$$
At this coordinate the slope is $-2.8$, so the function decreases under a sufficiently small positive perturbation. The curvature is $1$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.0028$. The quadratic correction is $f^{(2)}(x)h^2/2\approx5e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.0027995$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.2$

$$f(0.2)=\frac{169}{50}\approx 3.38.$$
At this coordinate the slope is $-2.6$, so the function decreases under a sufficiently small positive perturbation. The curvature is $1$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.0026$. The quadratic correction is $f^{(2)}(x)h^2/2\approx5e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.0025995$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | -2.8 | 4.885e-15 |
| 0.01 | -2.8 | 6.3949e-14 |
| 0.001 | -2.8 | 3.082e-13 |
| 0.0001 | -2.8 | 5.0209e-12 |
| 1e-05 | -2.8 | 3.6107e-11 |
| 1e-06 | -2.8 | 3.0256e-10 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=0.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 4.5 | 4.48 | 4.5 | 8.8818e-16 |
| -0.1 | 4.205 | 4.2 | 4.205 | 8.8818e-16 |
| 0.1 | 3.645 | 3.64 | 3.645 | 4.4409e-16 |
| 0.2 | 3.38 | 3.36 | 3.38 | 4.4409e-16 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: reinforcement-learning](https://aman.ai/primers/reinforcement-learning/)

[Previous](31-rl-foundations.md) · [Index](../README.md) · [Next](33-td-q-learning.md)
