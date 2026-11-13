# 49. Recurrent depth, recursive transformers, and latent computation

[Previous](48-generative-vlm.md) · [Index](../README.md) · [Next](50-recursive-self-improvement.md)

**Part:** Multimodal and embodied models. **Prerequisite:** read lessons 01–48 in order, or verify the earlier definitions used here.

## Reuse a transformation across depth

An ordinary stack applies different parameterized layers in sequence. A recurrent-depth model repeatedly applies a shared transformation: $h^{(k+1)}=F_\theta(h^{(k)},x,k)$. The input injection and depth signal are architectural choices. Reusing weights can reduce parameter count for a given number of transformation steps, but each step still costs computation.

Recurrence across depth differs from autoregression across tokens. It also differs from an outer program recursively calling a language model on subproblems. These three forms of repeated computation can be combined, but their states, gradients, and costs are different.

## Differentiate shared weights across steps

For two steps $h_1=F_\theta(h_0)$ and $h_2=F_\theta(h_1)$, the total parameter derivative of a scalar loss includes a direct contribution through step two and an indirect contribution through step one:

$$\frac{dL}{d\theta}=\frac{\partial L}{\partial h_2}\left(\frac{\partial F_\theta(h_1)}{\partial\theta}+\frac{\partial F_\theta(h_1)}{\partial h_1}\frac{\partial F_\theta(h_0)}{\partial\theta}\right).$$

The same parameter appears at multiple nodes, so reverse mode accumulates its contributions. Treating the repeated calls as independent weights would train another architecture. Truncating gradients through earlier recurrences is an approximation whose effect should be measured.

## Fixed points require conditions

If a map is a contraction on a complete space, repeated application converges to a unique fixed point. A generic transformer block is not automatically a contraction. Residual growth, normalization, nonlinearities, and learned weights can produce convergence, oscillation, or divergence. Running more recurrences than seen in training is an extrapolation experiment, not a guaranteed improvement.

Adaptive computation can decide when to stop per example or token. Such a decision requires a halting rule and training signal, plus clear accounting for remaining probability mass or compute budgets under the chosen method. Fewer parameters do not imply smaller key/value storage for every recurrent architecture; cache semantics must be specified separately.

## Latent steps are not readable reasoning by default

Extra hidden-state updates can provide useful computation without generating additional visible tokens. Their semantic interpretation needs evidence. A claim that a particular hidden update represents a proof step is stronger than observing improved accuracy with more updates. Test generalization, ablations, and matched-compute baselines.

The code checks a shared scalar parameter's derivative through four recurrent tanh updates using the course autodiff engine and finite differences. It then shows a separate contractive scalar iteration with a known stability condition. These demonstrations establish the mechanics, not that any arbitrary transformer will benefit from looping.

### Recurrent depth has a simple stability counterexample

For scalar update $h_{k+1}=ah_k+b$, the fixed point for $a\ne1$ is $h^*=b/(1-a)$. Error obeys $h_{k+1}-h^*=a(h_k-h^*)$, so convergence for every initial state requires $|a|<1$. With $a=-0.5$, errors alternate sign while shrinking. With $a=1.1$, they grow. With $a=1,b\ne0$, no fixed point exists and the state drifts linearly. A learned recurrent transformer can have far more complicated dynamics, but this exact counterexample disproves any blanket claim that repeating a shared block must converge or improve an answer.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
from core import Tensor, finite_difference
weight = Tensor([[.6]])
hidden = Tensor([[.2]])
for _ in range(4):
    hidden = (hidden @ weight+.1).tanh()
loss = (hidden ** 2).mean()
loss.backward()
def objective(values):
    state = .2
    for _ in range(4):
        state = np.tanh(state*values[0]+.1)
    return state**2
numeric = finite_difference(objective, np.array([.6]))[0]
assert np.allclose(weight.grad[0, 0], numeric, atol=1e-7)
print('shared gradient', weight.grad[0, 0], 'numerical', numeric)

```

### Code structure and observed intermediate values


#### Stage 3

```python
weight = Tensor([[.6]])
```

An observed state during this stage was:

- `weight`: `Tensor(data=[[0.6]])`

#### Stage 4

```python
hidden = Tensor([[.2]])
```

An observed state during this stage was:

- `hidden`: `Tensor(data=[[0.2]])`

#### Stage 5

```python
for _ in range(4):
    hidden = (hidden @ weight+.1).tanh()
```

An observed state during this stage was:

- `hidden`: `Tensor(data=[[0.23435]])`

This is one recorded iteration state, not necessarily the final loop state. The final printed result below is authoritative for the completed run. Long loops are deliberately sampled to keep the trace readable.

#### Stage 6

```python
loss = (hidden ** 2).mean()
```

An observed state during this stage was:

- `loss`: `Tensor(data=0.05492)`

#### Stage 7

```python
loss.backward()
```

#### Stage 8

```python
def objective(values):
    state = .2
    for _ in range(4):
        state = np.tanh(state*values[0]+.1)
    return state**2
```

#### Stage 9

```python
numeric = finite_difference(objective, np.array([.6]))[0]
```

An observed state during this stage was:

- `numeric`: `0.20668488`

#### Stage 10

```python
assert np.allclose(weight.grad[0, 0], numeric, atol=1e-7)
```

#### Stage 11

```python
print('shared gradient', weight.grad[0, 0], 'numerical', numeric)
```

Run from the course root:

```bash
python code/49_recursive_transformers.py
```

### Recorded output from the supplied environment

```text
shared gradient 0.2066848751789856 numerical 0.20668487523342602
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

A two-step shared-weight recurrent loss, with both parameter-use paths differentiated.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=\tanh^{2}{\left(x \tanh{\left(\frac{x}{5} + \frac{1}{10} \right)} + \frac{1}{10} \right)}.$$

Its first derivative is

$$f^{(1)}(x)=2 \left(1 - \tanh^{2}{\left(x \tanh{\left(\frac{x}{5} + \frac{1}{10} \right)} + \frac{1}{10} \right)}\right) \left(x \left(\frac{1}{5} - \frac{\tanh^{2}{\left(\frac{x}{5} + \frac{1}{10} \right)}}{5}\right) + \tanh{\left(\frac{x}{5} + \frac{1}{10} \right)}\right) \tanh{\left(x \tanh{\left(\frac{x}{5} + \frac{1}{10} \right)} + \frac{1}{10} \right)}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=2 \left(1 - \tanh^{2}{\left(x \tanh{\left(\frac{x}{5} + \frac{1}{10} \right)} + \frac{1}{10} \right)}\right)^{2} \left(x \left(\frac{1}{5} - \frac{\tanh^{2}{\left(\frac{x}{5} + \frac{1}{10} \right)}}{5}\right) + \tanh{\left(\frac{x}{5} + \frac{1}{10} \right)}\right)^{2} - 4 \left(1 - \tanh^{2}{\left(x \tanh{\left(\frac{x}{5} + \frac{1}{10} \right)} + \frac{1}{10} \right)}\right) \left(x \left(\frac{1}{5} - \frac{\tanh^{2}{\left(\frac{x}{5} + \frac{1}{10} \right)}}{5}\right) + \tanh{\left(\frac{x}{5} + \frac{1}{10} \right)}\right)^{2} \tanh^{2}{\left(x \tanh{\left(\frac{x}{5} + \frac{1}{10} \right)} + \frac{1}{10} \right)} + 2 \left(1 - \tanh^{2}{\left(x \tanh{\left(\frac{x}{5} + \frac{1}{10} \right)} + \frac{1}{10} \right)}\right) \left(- \frac{x \left(\frac{2}{5} - \frac{2 \tanh^{2}{\left(\frac{x}{5} + \frac{1}{10} \right)}}{5}\right) \tanh{\left(\frac{x}{5} + \frac{1}{10} \right)}}{5} - \frac{2 \tanh^{2}{\left(\frac{x}{5} + \frac{1}{10} \right)}}{5} + \frac{2}{5}\right) \tanh{\left(x \tanh{\left(\frac{x}{5} + \frac{1}{10} \right)} + \frac{1}{10} \right)}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 0.4 | 0.0287567674 | 0.0841770027 | 0.241671401 |
| 0.6 | 0.0510505749 | 0.141892762 | 0.335213985 |
| 0.8 | 0.0867033086 | 0.217263207 | 0.413566781 |

#### Evaluation 1: substitute $x=0.4$

$$f(0.4)=\tanh^{2}{\left(\frac{2 \tanh{\left(\frac{9}{50} \right)}}{5} + \frac{1}{10} \right)}\approx 0.0287567674.$$
At this coordinate the slope is $0.0841770027$, so the function increases under a sufficiently small positive perturbation. The curvature is $0.241671401$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx8.41770027e-05$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.208357e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $8.42979154e-05$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0.6$

$$f(0.6)=\tanh^{2}{\left(\frac{1}{10} + \frac{3 \tanh{\left(\frac{11}{50} \right)}}{5} \right)}\approx 0.0510505749.$$
At this coordinate the slope is $0.141892762$, so the function increases under a sufficiently small positive perturbation. The curvature is $0.335213985$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.000141892762$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.67606992e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000142060445$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.8$

$$f(0.8)=\tanh^{2}{\left(\frac{1}{10} + \frac{4 \tanh{\left(\frac{13}{50} \right)}}{5} \right)}\approx 0.0867033086.$$
At this coordinate the slope is $0.217263207$, so the function increases under a sufficiently small positive perturbation. The curvature is $0.413566781$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.000217263207$. The quadratic correction is $f^{(2)}(x)h^2/2\approx2.0678339e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000217470041$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | 0.1426449541 | 0.00075219 |
| 0.01 | 0.1419003133 | 7.5511e-06 |
| 0.001 | 0.1418928377 | 7.5514e-08 |
| 0.0001 | 0.1418927629 | 7.5513e-10 |
| 1e-05 | 0.1418927622 | 6.9407e-12 |
| 1e-06 | 0.1418927622 | 3.4517e-13 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=- 16 \left(1 - \tanh^{2}{\left(x \tanh{\left(\frac{x}{5} + \frac{1}{10} \right)} + \frac{1}{10} \right)}\right)^{2} \left(x \left(\frac{1}{5} - \frac{\tanh^{2}{\left(\frac{x}{5} + \frac{1}{10} \right)}}{5}\right) + \tanh{\left(\frac{x}{5} + \frac{1}{10} \right)}\right)^{3} \tanh{\left(x \tanh{\left(\frac{x}{5} + \frac{1}{10} \right)} + \frac{1}{10} \right)} + 2 \left(1 - \tanh^{2}{\left(x \tanh{\left(\frac{x}{5} + \frac{1}{10} \right)} + \frac{1}{10} \right)}\right)^{2} \left(x \left(\frac{1}{5} - \frac{\tanh^{2}{\left(\frac{x}{5} + \frac{1}{10} \right)}}{5}\right) + \tanh{\left(\frac{x}{5} + \frac{1}{10} \right)}\right) \left(- \frac{2 x \left(\frac{2}{5} - \frac{2 \tanh^{2}{\left(\frac{x}{5} + \frac{1}{10} \right)}}{5}\right) \tanh{\left(\frac{x}{5} + \frac{1}{10} \right)}}{5} - \frac{4 \tanh^{2}{\left(\frac{x}{5} + \frac{1}{10} \right)}}{5} + \frac{4}{5}\right) + 2 \left(1 - \tanh^{2}{\left(x \tanh{\left(\frac{x}{5} + \frac{1}{10} \right)} + \frac{1}{10} \right)}\right)^{2} \left(x \left(\frac{1}{5} - \frac{\tanh^{2}{\left(\frac{x}{5} + \frac{1}{10} \right)}}{5}\right) + \tanh{\left(\frac{x}{5} + \frac{1}{10} \right)}\right) \left(- \frac{x \left(\frac{2}{5} - \frac{2 \tanh^{2}{\left(\frac{x}{5} + \frac{1}{10} \right)}}{5}\right) \tanh{\left(\frac{x}{5} + \frac{1}{10} \right)}}{5} - \frac{2 \tanh^{2}{\left(\frac{x}{5} + \frac{1}{10} \right)}}{5} + \frac{2}{5}\right) + 8 \left(1 - \tanh^{2}{\left(x \tanh{\left(\frac{x}{5} + \frac{1}{10} \right)} + \frac{1}{10} \right)}\right) \left(x \left(\frac{1}{5} - \frac{\tanh^{2}{\left(\frac{x}{5} + \frac{1}{10} \right)}}{5}\right) + \tanh{\left(\frac{x}{5} + \frac{1}{10} \right)}\right)^{3} \tanh^{3}{\left(x \tanh{\left(\frac{x}{5} + \frac{1}{10} \right)} + \frac{1}{10} \right)} - 4 \left(1 - \tanh^{2}{\left(x \tanh{\left(\frac{x}{5} + \frac{1}{10} \right)} + \frac{1}{10} \right)}\right) \left(x \left(\frac{1}{5} - \frac{\tanh^{2}{\left(\frac{x}{5} + \frac{1}{10} \right)}}{5}\right) + \tanh{\left(\frac{x}{5} + \frac{1}{10} \right)}\right) \left(- \frac{2 x \left(\frac{2}{5} - \frac{2 \tanh^{2}{\left(\frac{x}{5} + \frac{1}{10} \right)}}{5}\right) \tanh{\left(\frac{x}{5} + \frac{1}{10} \right)}}{5} - \frac{4 \tanh^{2}{\left(\frac{x}{5} + \frac{1}{10} \right)}}{5} + \frac{4}{5}\right) \tanh^{2}{\left(x \tanh{\left(\frac{x}{5} + \frac{1}{10} \right)} + \frac{1}{10} \right)} - 4 \left(1 - \tanh^{2}{\left(x \tanh{\left(\frac{x}{5} + \frac{1}{10} \right)} + \frac{1}{10} \right)}\right) \left(x \left(\frac{1}{5} - \frac{\tanh^{2}{\left(\frac{x}{5} + \frac{1}{10} \right)}}{5}\right) + \tanh{\left(\frac{x}{5} + \frac{1}{10} \right)}\right) \left(- \frac{x \left(\frac{2}{5} - \frac{2 \tanh^{2}{\left(\frac{x}{5} + \frac{1}{10} \right)}}{5}\right) \tanh{\left(\frac{x}{5} + \frac{1}{10} \right)}}{5} - \frac{2 \tanh^{2}{\left(\frac{x}{5} + \frac{1}{10} \right)}}{5} + \frac{2}{5}\right) \tanh^{2}{\left(x \tanh{\left(\frac{x}{5} + \frac{1}{10} \right)} + \frac{1}{10} \right)} + 2 \left(1 - \tanh^{2}{\left(x \tanh{\left(\frac{x}{5} + \frac{1}{10} \right)} + \frac{1}{10} \right)}\right) \left(- \frac{x \left(\frac{1}{5} - \frac{\tanh^{2}{\left(\frac{x}{5} + \frac{1}{10} \right)}}{5}\right) \left(\frac{2}{5} - \frac{2 \tanh^{2}{\left(\frac{x}{5} + \frac{1}{10} \right)}}{5}\right)}{5} + \frac{2 x \left(\frac{2}{5} - \frac{2 \tanh^{2}{\left(\frac{x}{5} + \frac{1}{10} \right)}}{5}\right) \tanh^{2}{\left(\frac{x}{5} + \frac{1}{10} \right)}}{25} - \frac{3 \left(\frac{2}{5} - \frac{2 \tanh^{2}{\left(\frac{x}{5} + \frac{1}{10} \right)}}{5}\right) \tanh{\left(\frac{x}{5} + \frac{1}{10} \right)}}{5}\right) \tanh{\left(x \tanh{\left(\frac{x}{5} + \frac{1}{10} \right)} + \frac{1}{10} \right)}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 0.0287567674 | 0.0226720224 | 0.0293763021 | 0.00061953 |
| -0.1 | 0.0384606144 | 0.0368612987 | 0.0385373686 | 7.6754e-05 |
| 0.1 | 0.0669896052 | 0.0652398511 | 0.066915921 | 7.3684e-05 |
| 0.2 | 0.0867033086 | 0.0794291273 | 0.086133407 | 0.0005699 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: recursive-transformers](https://aman.ai/primers/recursive-transformers/)

[Previous](48-generative-vlm.md) · [Index](../README.md) · [Next](50-recursive-self-improvement.md)
