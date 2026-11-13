# 05. Limits, derivatives, integrals, and local approximation

[Previous](04-spectral-linear-algebra.md) · [Course index](../README.md) · [Next](06-multivariable-calculus.md)

## Change before symbolic rules

For a function $f$, the quotient $(f(x+h)-f(x))/h$ is an average rate of change over a displacement $h\ne0$. The derivative is its limit as $h\to0$, if that limit exists. For $f(x)=x^2$, expanding $(x+h)^2=x^2+2xh+h^2$ makes the quotient $2x+h$. Its limit is $2x$.

At $x=3$, a small displacement 0.01 changes the square by 0.0601. The derivative predicts $2(3)(0.01)=0.06$. The remaining 0.0001 is the neglected quadratic term. A derivative describes a local linear approximation, not an exact finite change for arbitrary displacements.

## Composition creates the chain rule

Suppose $u=g(x)$ and $f(x)=h(u)$. A small change in $x$ produces approximately $g'(x)\,dx$ in $u$, which produces approximately $h'(u)g'(x)\,dx$ in the output. Under differentiability this yields $f'(x)=h'(g(x))g'(x)$. The local approximations can be made rigorous using their remainders; the informal differential argument explains the mechanism.

For $f(w)=(2w-3)^2$, set $u=2w-3$. Then $df/du=2u$ and $du/dw=2$, so $df/dw=4(2w-3)$. At zero the slope is -12. Moving $w$ a small positive amount decreases the squared error. Gradient descent uses exactly that sign information.

## Integrals and accumulated probability

The definite integral $\int_a^b f(t)dt$ is a limit of weighted sums over ever-finer intervals, when that limit exists. For a nonnegative density it gives probability mass over an interval. A density can exceed one; its integral over the whole domain, not its height at every point, must be one.

The fundamental theorem of calculus connects accumulation and differentiation. If $f$ is continuous and $F(x)=\int_a^x f(t)dt$, then $F'(x)=f(x)$. This will connect a probability density to its cumulative distribution function. Integrating a density over an interval is different from evaluating a probability at one point.

## Curvature and Taylor approximation

For a twice differentiable scalar function, a local expansion is $f(x+h)=f(x)+hf'(x)+h^2f''(x)/2+o(h^2)$. A positive second derivative bends the graph upward. If $f'(x)=0$ and $f''(x)>0$, the point is a strict local minimum. Zero second derivative is inconclusive: $x^4$ has a minimum at zero, while $x^3$ does not.

Absolute value illustrates a nondifferentiable point. Its slope is -1 on the negative side and +1 on the positive side, so no single derivative exists at zero. Optimization can use a subgradient there. ReLU has the same kind of kink, and software must choose a convention for its derivative at zero.

## Additional worked chain-rule program
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
python code/neural/03_calculus_chain_rule.py
```

### Recorded output from the supplied environment

```text
analytic [0.64497852 0.46069894] numerical [0.64497852 0.46069894]
```


## Derive the product and logarithm rules

For $F(x)=u(x)v(x)$, add and subtract $u(x+h)v(x)$ inside the difference quotient. It becomes $u(x+h)[v(x+h)-v(x)]/h+v(x)[u(x+h)-u(x)]/h$. Taking limits using differentiability and continuity yields $F'=uv'+vu'$. This explains the two paths in a multiplication node during backpropagation.

For $y=e^x$, the standard exponential is characterized by $dy/dx=e^x$ and $e^0=1$. For its inverse $x=\log y$, differentiate $e^{\log y}=y$: $e^{\log y}(d\log y/dy)=1$, hence the derivative is $1/y$ for $y>0$. In log likelihood, this reciprocal combines with the derivative of the predicted probability to produce the familiar residual-like gradient.

An integral example makes density normalization concrete. The uniform density on $[0,0.5]$ is 2, not 0.5. Its total mass is $\int_0^{0.5}2\,dx=1$, and the probability of $[0.1,0.2]$ is $2(0.1)=0.2$. A density height above one is therefore fully consistent with probability axioms.
