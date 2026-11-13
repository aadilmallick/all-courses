# 03. Derivatives, Jacobians, and the chain rule

[Previous](02-linear-algebra.md) · [Index](../README.md) · [Next](04-probability-conditioning.md)

**Part:** Foundations. **Prerequisite:** read lessons 01–02 in order, or verify the earlier definitions used here.

## What a gradient actually predicts

Training needs a local answer: how does the loss change when a parameter moves slightly? For differentiable $f$, the derivative is the limit $f'(a)=\lim_{h\to0}[f(a+h)-f(a)]/h$. The limit matters: a finite difference estimates a derivative; it is not its definition or an exact replacement.

For $f(x)=x^2$, expand $(a+h)^2-a^2=2ah+h^2$. Divide by $h\ne0$ to obtain $2a+h$, then take the limit to obtain $2a$. We have used the distributive law and the fact that $h\to0$. No memorized power rule was required.

A scalar function $L(\theta)$ of many parameters has gradient whose $i$th component is $\partial L/\partial\theta_i$. Its first-order approximation is $L(\theta+\Delta)\approx L(\theta)+\nabla L^\top\Delta$. Choosing $\Delta=-\eta\nabla L$ gives predicted change $-\eta\|\nabla L\|^2$, negative for nonzero gradient and positive step size. The approximation can fail for a large step.

## Derive a small network

Let $u=wx+b$, $v=\tanh u$, and $L=(v-y)^2/2$. Hold data $x,y$ fixed. The outer derivative is $\partial L/\partial v=v-y$. The activation derivative is $\partial v/\partial u=1-v^2$. The affine derivatives are $\partial u/\partial w=x$ and $\partial u/\partial b=1$. Therefore

$$\frac{\partial L}{\partial w}=(v-y)(1-v^2)x,\qquad
\frac{\partial L}{\partial b}=(v-y)(1-v^2).$$

Every factor describes one edge of the computation. A gradient multiplies along a path and adds across different paths. If $w$ is used twice, both uses contribute. Forgetting one path is a common error in tied embeddings and recurrent models.

## Jacobians and reverse mode

For $f:\mathbb R^n\to\mathbb R^m$, $J_{ij}=\partial f_i/\partial x_j$. Given upstream scalar-loss derivatives $g\in\mathbb R^m$, reverse mode computes $J^\top g\in\mathbb R^n$. It avoids constructing a huge Jacobian explicitly. Backpropagation is the chain rule organized around this vector-Jacobian product.

At an absolute-value cusp, no unique classical derivative exists. At a clipping boundary, a numerical derivative may average two slopes. Check smooth points first. With floating-point subtraction, tiny $h$ can lose significant digits; huge $h$ measures nonlocal curvature. The central difference has truncation error of order $h^2$ for sufficiently smooth functions, but roundoff eventually dominates.

The experiment compares an analytical network derivative with central differences. Agreement at one point provides useful local evidence, not a proof for every input. A proper implementation check also changes the input, uses multiple coordinates, and checks shared-parameter paths.

### A shared-parameter derivative you can reconstruct

Let $u=w^2$, $v=3w$, and $L=(u+v)^2/2$. The derivative at the final square is $u+v$. The first path contributes $(u+v)2w$ and the second contributes $(u+v)3$. Add them to obtain $(w^2+3w)(2w+3)$. At $w=1$, this is $4\cdot5=20$. Differentiating only the $w^2$ occurrence would give eight and miss twelve from the second path. This tiny counterexample explains why an autodiff engine accumulates into a shared leaf instead of overwriting its gradient each time a parent operation is visited.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
from core import finite_difference
sample, target = 1.4, -0.2
def objective(parameter):
    value = np.tanh(parameter[0] * sample + parameter[1])
    return 0.5 * (value - target) ** 2
parameter = np.array([0.3, -0.1])
value = np.tanh(parameter[0] * sample + parameter[1])
local = (value - target) * (1 - value ** 2)
analytic = np.array([local * sample, local])
numerical = finite_difference(objective, parameter)
assert np.allclose(analytic, numerical, atol=1e-7)
print('analytic', analytic, 'numerical', numerical)

```

### Code structure and observed intermediate values


#### Stage 3

```python
sample, target = 1.4, -0.2
```

An observed state during this stage was:

- `sample`: `1.4`
- `target`: `-0.2`

#### Stage 4

```python
def objective(parameter):
    value = np.tanh(parameter[0] * sample + parameter[1])
    return 0.5 * (value - target) ** 2
```

#### Stage 5

```python
parameter = np.array([0.3, -0.1])
```

An observed state during this stage was:

- `parameter`: `[ 0.3 -0.1]`

#### Stage 6

```python
value = np.tanh(parameter[0] * sample + parameter[1])
```

An observed state during this stage was:

- `value`: `0.30950692`

#### Stage 7

```python
local = (value - target) * (1 - value ** 2)
```

An observed state during this stage was:

- `local`: `0.46069894`

#### Stage 8

```python
analytic = np.array([local * sample, local])
```

An observed state during this stage was:

- `analytic`: `[0.64498 0.4607 ]`

#### Stage 9

```python
numerical = finite_difference(objective, parameter)
```

An observed state during this stage was:

- `numerical`: `[0.64498 0.4607 ]`

#### Stage 10

```python
assert np.allclose(analytic, numerical, atol=1e-7)
```

#### Stage 11

```python
print('analytic', analytic, 'numerical', numerical)
```

Run from the course root:

```bash
python code/03_calculus_chain_rule.py
```

### Recorded output from the supplied environment

```text
analytic [0.64497852 0.46069894] numerical [0.64497852 0.46069894]
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

Loss of the one-neuron model as its weight changes; the bias is held fixed.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=\frac{\left(\tanh{\left(\frac{7 x}{5} - \frac{1}{10} \right)} + \frac{1}{5}\right)^{2}}{2}.$$

Its first derivative is

$$f^{(1)}(x)=\frac{\left(\frac{14}{5} - \frac{14 \tanh^{2}{\left(\frac{7 x}{5} - \frac{1}{10} \right)}}{5}\right) \left(\tanh{\left(\frac{7 x}{5} - \frac{1}{10} \right)} + \frac{1}{5}\right)}{2}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=\frac{\left(\frac{7}{5} - \frac{7 \tanh^{2}{\left(\frac{7 x}{5} - \frac{1}{10} \right)}}{5}\right) \left(\frac{14}{5} - \frac{14 \tanh^{2}{\left(\frac{7 x}{5} - \frac{1}{10} \right)}}{5}\right)}{2} - \frac{7 \left(\frac{14}{5} - \frac{14 \tanh^{2}{\left(\frac{7 x}{5} - \frac{1}{10} \right)}}{5}\right) \left(\tanh{\left(\frac{7 x}{5} - \frac{1}{10} \right)} + \frac{1}{5}\right) \tanh{\left(\frac{7 x}{5} - \frac{1}{10} \right)}}{5}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 0.1 | 0.0287948835 | 0.335433173 | 1.9161912 |
| 0.3 | 0.129798651 | 0.64497852 | 1.04352066 |
| 0.5 | 0.271621032 | 0.734255315 | -0.111696089 |

#### Evaluation 1: substitute $x=0.1$

$$f(0.1)=\frac{\left(\tanh{\left(\frac{1}{25} \right)} + \frac{1}{5}\right)^{2}}{2}\approx 0.0287948835.$$
At this coordinate the slope is $0.335433173$, so the function increases under a sufficiently small positive perturbation. The curvature is $1.9161912$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.000335433173$. The quadratic correction is $f^{(2)}(x)h^2/2\approx9.580956e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $0.00033639094$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0.3$

$$f(0.3)=\frac{\left(\frac{1}{5} + \tanh{\left(\frac{8}{25} \right)}\right)^{2}}{2}\approx 0.129798651.$$
At this coordinate the slope is $0.64497852$, so the function increases under a sufficiently small positive perturbation. The curvature is $1.04352066$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.00064497852$. The quadratic correction is $f^{(2)}(x)h^2/2\approx5.21760331e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000645499286$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.5$

$$f(0.5)=\frac{\left(\frac{1}{5} + \tanh{\left(\frac{3}{5} \right)}\right)^{2}}{2}\approx 0.271621032.$$
At this coordinate the slope is $0.734255315$, so the function increases under a sufficiently small positive perturbation. The curvature is $-0.111696089$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.000734255315$. The quadratic correction is $f^{(2)}(x)h^2/2\approx-5.58480443e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000734198656$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | 0.6351524266 | 0.0098261 |
| 0.01 | 0.644879067 | 9.9453e-05 |
| 0.001 | 0.6449775255 | 9.9465e-07 |
| 0.0001 | 0.6449785102 | 9.9462e-09 |
| 1e-05 | 0.6449785201 | 9.8245e-11 |
| 1e-06 | 0.6449785202 | 1.4978e-11 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=- \frac{7 \left(\frac{7}{5} - \frac{7 \tanh^{2}{\left(\frac{7 x}{5} - \frac{1}{10} \right)}}{5}\right) \left(\frac{14}{5} - \frac{14 \tanh^{2}{\left(\frac{7 x}{5} - \frac{1}{10} \right)}}{5}\right) \left(\tanh{\left(\frac{7 x}{5} - \frac{1}{10} \right)} + \frac{1}{5}\right)}{5} - \frac{14 \left(\frac{7}{5} - \frac{7 \tanh^{2}{\left(\frac{7 x}{5} - \frac{1}{10} \right)}}{5}\right) \left(\frac{14}{5} - \frac{14 \tanh^{2}{\left(\frac{7 x}{5} - \frac{1}{10} \right)}}{5}\right) \tanh{\left(\frac{7 x}{5} - \frac{1}{10} \right)}}{5} - \frac{7 \left(\frac{14}{5} - \frac{14 \tanh^{2}{\left(\frac{7 x}{5} - \frac{1}{10} \right)}}{5}\right)^{2} \tanh{\left(\frac{7 x}{5} - \frac{1}{10} \right)}}{10} + \frac{98 \left(\frac{14}{5} - \frac{14 \tanh^{2}{\left(\frac{7 x}{5} - \frac{1}{10} \right)}}{5}\right) \left(\tanh{\left(\frac{7 x}{5} - \frac{1}{10} \right)} + \frac{1}{5}\right) \tanh^{2}{\left(\frac{7 x}{5} - \frac{1}{10} \right)}}{25}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 0.0287948835 | 0.000802947346 | 0.0216733606 | 0.0071215 |
| -0.1 | 0.0714725714 | 0.0653007994 | 0.0705184027 | 0.00095417 |
| 0.1 | 0.198503057 | 0.194296503 | 0.199514107 | 0.001011 |
| 0.2 | 0.271621032 | 0.258794355 | 0.279664769 | 0.0080437 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: transformers](https://aman.ai/primers/transformers/)

[Previous](02-linear-algebra.md) · [Index](../README.md) · [Next](04-probability-conditioning.md)
