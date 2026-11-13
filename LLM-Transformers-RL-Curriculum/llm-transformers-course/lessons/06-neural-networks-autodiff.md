# 06. Neural networks, backpropagation, and optimization

[Previous](05-entropy-softmax.md) · [Index](../README.md) · [Next](07-language-modeling.md)

**Part:** Foundations. **Prerequisite:** read lessons 01–05 in order, or verify the earlier definitions used here.

## Why stack learned transformations

A linear layer maps $x$ to $xW+b$. Two consecutive linear layers can be collapsed into one affine map. A nonlinearity between them changes the class of functions the network can express. Our small networks use $\tanh$, a smooth function with output in $(-1,1)$; production transformers often use GELU or gated SiLU variants instead.

A network is a directed computation graph. Nodes store numerical results; edges describe dependencies. Reverse mode starts with derivative one at a scalar loss and propagates local vector-Jacobian products in reverse topological order. The graph is an accounting device for the chain rule, not an additional learning algorithm.

## Derive the matrix reverse pass

For $Y=XW$ and upstream gradient $G=\partial L/\partial Y$, expand $Y_{ij}=\sum_kX_{ik}W_{kj}$. Holding $W$ fixed, an input perturbation gives $dY=dXW$. The scalar change is $dL=\sum_{ij}G_{ij}dY_{ij}$. Regroup the finite sums by $dX_{ik}$ to obtain $\partial L/\partial X=GW^\top$. Regroup by $dW_{kj}$ instead to obtain $\partial L/\partial W=X^\top G$.

If a bias is shared over examples, its gradient sums the upstream gradients across the shared axis. Broadcasting in the forward pass becomes summation in the backward pass. If one weight is used in two paths, its gradients add. The supplied `Tensor` class implements both rules explicitly.

## Optimization is another layer of reasoning

Gradient descent uses $\theta_{k+1}=\theta_k-\eta g_k$. Stochastic gradients estimate a dataset gradient from a minibatch. Momentum maintains a moving average of gradients. Adam also maintains an average of squared gradients and bias-corrects the moving estimates. AdamW applies decoupled weight decay; adding an L2 penalty to Adam's loss is not generally identical.

For scalar quadratic $L=\lambda\theta^2/2$, gradient descent gives $\theta_{k+1}=(1-\eta\lambda)\theta_k$. Convergence requires $|1-\eta\lambda|<1$, or $0<\eta<2/\lambda$ for positive $\lambda$. This is a complete proof for that quadratic, not a universal learning-rate rule for neural networks.

Global gradient clipping replaces $g$ by $g\min(1,c/\|g\|)$. It limits the length of the raw gradient while preserving its direction. It does not fix a wrong loss, corrupted labels, or an exploding activation. Log unclipped norms so clipping does not hide instability.

## Follow the implementation

`core.py` provides a deliberately small NumPy autodiff engine. Its `backward()` visits every parent before appending a node and traverses the resulting order backward. Fresh graphs are built on each training step, and leaf gradients are reset after updates. The tiny fitting experiment learns a scalar affine relationship. It demonstrates optimization mechanics, not language understanding.

A trustworthy check compares autodiff against finite differences before attempting a large training run. If a training loss stays flat, inspect parameter participation, gradient norms, learning rate, and label alignment in that order.

### Derive Adam's initial bias correction

If $m_t=\beta m_{t-1}+(1-\beta)g_t$ and $m_0=0$, then $m_t=(1-\beta)\sum_{i=1}^t\beta^{t-i}g_i$. Under a stationary mean gradient $\mathbb E g_i=\mu$, take expectations and sum the geometric series to get $\mathbb E m_t=(1-\beta^t)\mu$. Dividing by $1-\beta^t$ removes this initialization bias under that assumption. It does not remove stochastic noise or make the gradient stationary. Adam applies an analogous correction to its second-moment accumulator, then divides the corrected first moment by the square root of the corrected second moment plus epsilon.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
from core import Tensor
inputs = Tensor(np.array([[-1.0], [0.0], [1.0], [2.0]]))
target = Tensor(2 * inputs.data + 0.5)
weight, bias = Tensor([[0.0]]), Tensor([0.0])
initial = None
for step in range(100):
    prediction = inputs @ weight + bias
    loss = ((prediction - target) ** 2).mean()
    if initial is None:
        initial = float(loss.data)
    loss.backward()
    for parameter in (weight, bias):
        parameter.data -= 0.1 * parameter.grad
        parameter.grad.fill(0)
    inputs.grad.fill(0)
    target.grad.fill(0)
assert float(loss.data) < initial / 1000
print('initial', initial, 'final', float(loss.data), 'weight', weight.data)

```

### Code structure and observed intermediate values


#### Stage 3

```python
inputs = Tensor(np.array([[-1.0], [0.0], [1.0], [2.0]]))
```

An observed state during this stage was:

- `inputs`: `Tensor(data=[[-1.]  [ 0.]  [ 1.]  [ 2.]])`

#### Stage 4

```python
target = Tensor(2 * inputs.data + 0.5)
```

An observed state during this stage was:

- `target`: `Tensor(data=[[-1.5]  [ 0.5]  [ 2.5]  [ 4.5]])`

#### Stage 5

```python
weight, bias = Tensor([[0.0]]), Tensor([0.0])
```

An observed state during this stage was:

- `weight`: `Tensor(data=[[0.]])`
- `bias`: `Tensor(data=[0.])`

#### Stage 6

```python
initial = None
```

An observed state during this stage was:

- `initial`: `None`

#### Stage 7

```python
for step in range(100):
    prediction = inputs @ weight + bias
    loss = ((prediction - target) ** 2).mean()
    if initial is None:
        initial = float(loss.data)
    loss.backward()
    for parameter in (weight, bias):
        parameter.data -= 0.1 * parameter.grad
        parameter.grad.fill(0)
    inputs.grad.fill(0)
    target.grad.fill(0)
```

An observed state during this stage was:

- `step`: `7`

This is one recorded iteration state, not necessarily the final loop state. The final printed result below is authoritative for the completed run. Long loops are deliberately sampled to keep the trace readable.

#### Stage 8

```python
assert float(loss.data) < initial / 1000
```

#### Stage 9

```python
print('initial', initial, 'final', float(loss.data), 'weight', weight.data)
```

Run from the course root:

```bash
python code/06_neural_networks_autodiff.py
```

### Recorded output from the supplied environment

```text
initial 7.25 final 4.4017965133294734e-14 weight [[1.99999989]]
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

A quadratic training loss whose curvature gives an exact learning-rate stability bound.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=\frac{\left(2 x - 1\right)^{2}}{2}.$$

Its first derivative is

$$f^{(1)}(x)=4 x - 2.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=4.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| -0.2 | 0.98 | -2.8 | 4 |
| 0 | 0.5 | -2 | 4 |
| 0.2 | 0.18 | -1.2 | 4 |

#### Evaluation 1: substitute $x=-0.2$

$$f(-0.2)=\frac{49}{50}\approx 0.98.$$
At this coordinate the slope is $-2.8$, so the function decreases under a sufficiently small positive perturbation. The curvature is $4$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.0028$. The quadratic correction is $f^{(2)}(x)h^2/2\approx2e-06$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.002798$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0$

$$f(0)=\frac{1}{2}\approx 0.5.$$
At this coordinate the slope is $-2$, so the function decreases under a sufficiently small positive perturbation. The curvature is $4$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.002$. The quadratic correction is $f^{(2)}(x)h^2/2\approx2e-06$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.001998$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.2$

$$f(0.2)=\frac{9}{50}\approx 0.18.$$
At this coordinate the slope is $-1.2$, so the function decreases under a sufficiently small positive perturbation. The curvature is $4$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.0012$. The quadratic correction is $f^{(2)}(x)h^2/2\approx2e-06$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.001198$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | -2 | 4.4409e-16 |
| 0.01 | -2 | 1.7764e-15 |
| 0.001 | -2 | 2.5979e-14 |
| 0.0001 | -2 | 2.2027e-13 |
| 1e-05 | -2 | 3.5512e-12 |
| 1e-06 | -2 | 2.5755e-11 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=0.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 0.98 | 0.9 | 0.98 | 1.1102e-16 |
| -0.1 | 0.72 | 0.7 | 0.72 | 0 |
| 0.1 | 0.32 | 0.3 | 0.32 | 5.5511e-17 |
| 0.2 | 0.18 | 0.1 | 0.18 | 0 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: transformers](https://aman.ai/primers/transformers/)

[Previous](05-entropy-softmax.md) · [Index](../README.md) · [Next](07-language-modeling.md)
