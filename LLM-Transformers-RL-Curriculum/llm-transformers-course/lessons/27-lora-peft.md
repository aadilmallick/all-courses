# 27. Parameter-efficient tuning, adapters, and LoRA derivatives

[Previous](26-instruction-sft.md) · [Index](../README.md) · [Next](28-quantization-qlora.md)

**Part:** Adaptation and compression. **Prerequisite:** read lessons 01–26 in order, or verify the earlier definitions used here.

## Freeze a base map and learn a structured change

Full tuning updates every parameter. Parameter-efficient methods update a smaller subset or introduce small trainable modules. Adapters add bottleneck transformations; prompt and prefix tuning learn additional conditioning representations; LoRA parameterizes a low-rank weight update. These methods restrict adaptation in different ways.

Using the row-vector convention, let $W_0\in\mathbb R^{D\times F}$, $A\in\mathbb R^{D\times r}$, and $B\in\mathbb R^{r\times F}$. Define $Y=XW_0+s(XA)B$ with scale $s=\alpha/r$. The update is $\Delta W=sAB$, whose rank is at most $r$. Trainable parameters are $r(D+F)$ instead of $DF$, although the frozen base weights still occupy memory.

## Derive both factor gradients

Let upstream $G$ have the shape of $Y$ and $U=XA$. The output update is $sUB$. Matrix reverse rules give $G_B=sU^\top G$, $G_U=sGB^\top$, and $G_A=X^\top G_U=sX^\top GB^\top$. The input receives both $GW_0^\top$ and $sGB^\top A^\top$.

If $A$ is random and $B=0$ initially, the forward function begins exactly at the base map. The first $A$ gradient is zero because it contains $B^\top$, while $B$ can receive a nonzero gradient through $XA$. After $B$ moves, $A$ can learn. Setting both factors to zero would make both factor gradients zero initially.

## Merging and its conditions

For inference without dropout or other adapter-dependent behavior, replace the base with $W_0+sAB$. The resulting linear map is algebraically identical. With multiple adapters, quantized bases, nonlinear inserted modules, or training-time dropout, merging requires additional care and may involve approximation.

LoRA is a constraint on the update, not proof that important changes are low rank or restricted to high layers. Freezing the base prevents overwriting its stored values, but the adapted model can still behave differently on previously learned tasks. Reversibility of removing an adapter is distinct from absence of behavioral interference while it is active.

## Choose targets experimentally

Applying LoRA only to query and value projections is one possible design; adapting keys, outputs, or feed-forward maps changes capacity and cost. Compare ranks, target modules, scaling, learning rates, and retained capabilities under a fixed evaluation protocol. The original method does not prescribe one universally optimal choice.

The experiment checks zero-initialization behavior, both factor derivatives, and merge equivalence using independently computed numerical gradients. This exposes the main algebra without relying on a package wrapper.

### A rank constraint does not identify the factors

For any invertible $R\in\mathbb R^{r\times r}$, $(AR)(R^{-1}B)=AB$. The same update matrix therefore has many factor representations. Factor norms and optimizer trajectories can differ despite an identical initial product. This is why comparing only the numerical entries of $A$ across runs does not establish whether two adapters learned the same function. Compare the product, the merged linear map, and held-out behavior. The redundancy also explains why initialization and scaling affect optimization even though the rank bound is unchanged.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
from core import finite_difference
rng = np.random.default_rng(27)
x, base = rng.normal(size=(3, 4)), rng.normal(size=(4, 5))
a, b = rng.normal(size=(4, 2)), np.zeros((2, 5))
g, scale = rng.normal(size=(3, 5)), 0.5
ga = scale*x.T @ g @ b.T
gb = scale*(x @ a).T @ g
assert np.allclose(ga, 0)
assert np.linalg.norm(gb) > 0
b += 0.02*gb
ga = scale*x.T @ g @ b.T
numeric = finite_difference(lambda z: np.sum((x @ base+scale*(x @ z) @ b)*g), a)
assert np.allclose(ga, numeric, atol=1e-7)
assert np.allclose(x @ base+scale*(x @ a) @ b, x @ (base+scale*a @ b))
print('trainable parameters', a.size+b.size, 'base parameters', base.size)

```

### Code structure and observed intermediate values


#### Stage 3

```python
rng = np.random.default_rng(27)
```

#### Stage 4

```python
x, base = rng.normal(size=(3, 4)), rng.normal(size=(4, 5))
```

An observed state during this stage was:

- `x`: `[[ 1.25445  0.7769   0.96488 -1.08218]  [ 0.86702 -0.16816 -0.18966  1.12057]  [-0.43678 -1.27965 -0.4695  -1.19683]]`
- `base`: `[[-1.83986 -0.14556  0.39828 -2.16206  0.01448]  [ 0.2552   0.17319 -1.27009 -0.31096 -0.18622]  [ 0.43298 -1.28735  0.38341  0.99188 -2.28765]  [ 0.22394 -1.52661 -0.17047 -0.68015  1.27364]]`

#### Stage 5

```python
a, b = rng.normal(size=(4, 2)), np.zeros((2, 5))
```

An observed state during this stage was:

- `a`: `[[ 0.05711  0.79529]  [-1.04678  0.46053]  [ 1.42237 -0.70726]  [ 0.66587  0.48137]]`
- `b`: `[[0. 0. 0. 0. 0.]  [0. 0. 0. 0. 0.]]`

#### Stage 6

```python
g, scale = rng.normal(size=(3, 5)), 0.5
```

An observed state during this stage was:

- `g`: `[[-0.06467 -1.25149  0.2831  -0.27029  0.60202]  [ 0.77888  1.53454 -0.83656  0.86504  0.70082]  [ 0.07542  0.61179  0.13169  0.67131  0.392  ]]`
- `scale`: `0.5`

#### Stage 7

```python
ga = scale*x.T @ g @ b.T
```

An observed state during this stage was:

- `ga`: `[[0. 0.]  [0. 0.]  [0. 0.]  [0. 0.]]`

#### Stage 8

```python
gb = scale*(x @ a).T @ g
```

An observed state during this stage was:

- `gb`: `[[ 0.2706   0.54881 -0.3162   0.26532  0.1895 ]  [ 0.45123  0.53008 -0.59397  0.13919  0.26485]]`

#### Stage 9

```python
assert np.allclose(ga, 0)
```

#### Stage 10

```python
assert np.linalg.norm(gb) > 0
```

#### Stage 11

```python
b += 0.02*gb
```

An observed state during this stage was:

- `b`: `[[ 0.00541  0.01098 -0.00632  0.00531  0.00379]  [ 0.00902  0.0106  -0.01188  0.00278  0.0053 ]]`

#### Stage 12

```python
ga = scale*x.T @ g @ b.T
```

An observed state during this stage was:

- `ga`: `[[ 0.00266  0.00571]  [-0.01592 -0.01516]  [-0.0131  -0.0131 ]  [ 0.02017  0.02433]]`

#### Stage 13

```python
numeric = finite_difference(lambda z: np.sum((x @ base+scale*(x @ z) @ b)*g), a)
```

An observed state during this stage was:

- `numeric`: `[[ 0.00266  0.00571]  [-0.01592 -0.01516]  [-0.0131  -0.0131 ]  [ 0.02017  0.02433]]`

#### Stage 14

```python
assert np.allclose(ga, numeric, atol=1e-7)
```

#### Stage 15

```python
assert np.allclose(x @ base+scale*(x @ a) @ b, x @ (base+scale*a @ b))
```

#### Stage 16

```python
print('trainable parameters', a.size+b.size, 'base parameters', base.size)
```

Run from the course root:

```bash
python code/27_lora_peft.py
```

### Recorded output from the supplied environment

```text
trainable parameters 18 base parameters 20
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

A LoRA factor coordinate loss with the other factor and base held fixed.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=\frac{\left(\frac{7 x}{20} - \frac{7}{10}\right)^{2}}{2}.$$

Its first derivative is

$$f^{(1)}(x)=\frac{49 x}{400} - \frac{49}{200}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=\frac{49}{400}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 0 | 0.245 | -0.245 | 0.1225 |
| 0.2 | 0.19845 | -0.2205 | 0.1225 |
| 0.4 | 0.1568 | -0.196 | 0.1225 |

#### Evaluation 1: substitute $x=0$

$$f(0)=\frac{49}{200}\approx 0.245.$$
At this coordinate the slope is $-0.245$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.1225$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.000245$. The quadratic correction is $f^{(2)}(x)h^2/2\approx6.125e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.00024493875$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0.2$

$$f(0.2)=\frac{3969}{20000}\approx 0.19845.$$
At this coordinate the slope is $-0.2205$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.1225$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.0002205$. The quadratic correction is $f^{(2)}(x)h^2/2\approx6.125e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.00022043875$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.4$

$$f(0.4)=\frac{98}{625}\approx 0.1568.$$
At this coordinate the slope is $-0.196$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.1225$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.000196$. The quadratic correction is $f^{(2)}(x)h^2/2\approx6.125e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.00019593875$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | -0.2205 | 1.3878e-16 |
| 0.01 | -0.2205 | 1.3878e-16 |
| 0.001 | -0.2205 | 1.2351e-14 |
| 0.0001 | -0.2205 | 1.8194e-13 |
| 1e-05 | -0.2205 | 8.7585e-13 |
| 1e-06 | -0.2205 | 2.2716e-11 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=0.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 0.245 | 0.24255 | 0.245 | 5.5511e-17 |
| -0.1 | 0.2211125 | 0.2205 | 0.2211125 | 5.5511e-17 |
| 0.1 | 0.1770125 | 0.1764 | 0.1770125 | 0 |
| 0.2 | 0.1568 | 0.15435 | 0.1568 | 5.5511e-17 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: parameter-efficient-fine-tuning](https://aman.ai/primers/parameter-efficient-fine-tuning/)

[Previous](26-instruction-sft.md) · [Index](../README.md) · [Next](28-quantization-qlora.md)
