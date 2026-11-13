# 16. Position, sinusoidal features, relative biases, and RoPE

[Previous](15-multihead-gqa.md) · [Index](../README.md) · [Next](17-transformer-blocks.md)

**Part:** Transformer construction. **Prerequisite:** read lessons 01–15 in order, or verify the earlier definitions used here.

## Attention alone does not know sequence order

Without positional information or order-dependent masks, self-attention is permutation equivariant: permuting input rows permutes output rows correspondingly. This follows because the score matrix receives the same permutation on rows and columns, rowwise softmax respects that reindexing, and values are permuted consistently. It cannot distinguish all order-dependent tasks merely from token identity.

Learned absolute embeddings add a trainable position vector to each token embedding. Sinusoidal embeddings use deterministic sine/cosine coordinates at different frequencies. Relative position biases instead add a function of $i-j$ to scores. These are different ways to introduce order, with different extrapolation assumptions.

## Derive rotary position embeddings in two dimensions

For angle $\theta$, define

$$R(\theta)=\begin{pmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{pmatrix}.$$

For column vectors, rotate query at position $m$ by $R(m\omega)$ and key at position $n$ by $R(n\omega)$. Their dot product becomes

$$(R(m\omega)q)^\top R(n\omega)k
=q^\top R(m\omega)^\top R(n\omega)k
=q^\top R((n-m)\omega)k.$$

The first equality moves the left rotation through the transpose. Orthogonality gives $R(\theta)^\top=R(-\theta)$; angle addition gives the final relative rotation. Thus the score contains relative position even though each vector is transformed using its absolute position.

In larger even width, apply a rotation to each coordinate pair using a prescribed frequency schedule. Pairing conventions differ across implementations. You must match the convention and schedule used during training. Values are usually not rotated in standard RoPE attention.

## Relative does not mean unlimited extrapolation

The formula can be evaluated at arbitrary positions, but a model trained on short sequences may not generalize to the resulting phase patterns and attention distributions. Numerical existence is not learned competence. Frequency scaling and position interpolation alter the geometry and often require evaluation or further training.

ALiBi adds a head-specific linear distance penalty to causal scores. It has different structure from rotation: the penalty changes with distance regardless of content, whereas RoPE modifies the content-dependent dot product.

## Trace the program

Our helper takes a two-dimensional column-vector convention, implemented by a matrix-vector product. The assertion checks the exact relative-angle identity numerically and also checks norm preservation. It does not check a whole long-context model.

Optional worked calculation: choose $q=(1,0)$ and $k=(1,0)$. The rotated dot product is $\cos((n-m)\omega)$. Identical content can therefore receive different compatibility scores at different relative distances. With multiple frequencies, these effects superpose across pairs.

### Expand a rotary score coordinate by coordinate

Let $q=(q_1,q_2)$, $k=(k_1,k_2)$, and relative angle $\delta$. Multiplying by the rotation gives $q^\top R(\delta)k=(q_1k_1+q_2k_2)\cos\delta+(q_2k_1-q_1k_2)\sin\delta$. The first coefficient is the ordinary content dot product; the second captures an oriented cross-term. This expansion is useful for checking rotation sign conventions. Swapping the relative-position definition from $n-m$ to $m-n$ changes the sine sign, so code and derivation must use one convention consistently.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
def rotation(angle):
    c, s = np.cos(angle), np.sin(angle)
    return np.array([[c, -s], [s, c]])
q, k = np.array([1., 2.]), np.array([-0.5, 0.7])
m, n, frequency = 3, 8, 0.2
rotated_q, rotated_k = rotation(m * frequency) @ q, rotation(n * frequency) @ k
left = rotated_q @ rotated_k
right = q @ rotation((n-m) * frequency) @ k
assert np.allclose(left, right)
assert np.allclose(np.linalg.norm(q), np.linalg.norm(rotated_q))
print('absolute rotation score', left, 'relative rotation score', right)

```

### Code structure and observed intermediate values


#### Stage 2

```python
def rotation(angle):
    c, s = np.cos(angle), np.sin(angle)
    return np.array([[c, -s], [s, c]])
```

#### Stage 3

```python
q, k = np.array([1., 2.]), np.array([-0.5, 0.7])
```

An observed state during this stage was:

- `q`: `[1. 2.]`
- `k`: `[-0.5  0.7]`

#### Stage 4

```python
m, n, frequency = 3, 8, 0.2
```

An observed state during this stage was:

- `m`: `3`
- `n`: `8`
- `frequency`: `0.2`

#### Stage 5

```python
rotated_q, rotated_k = rotation(m * frequency) @ q, rotation(n * frequency) @ k
```

An observed state during this stage was:

- `rotated_q`: `[-0.30395  2.21531]`
- `rotated_k`: `[-0.6851  -0.52023]`

#### Stage 6

```python
left = rotated_q @ rotated_k
```

An observed state during this stage was:

- `left`: `-0.9442286`

#### Stage 7

```python
right = q @ rotation((n-m) * frequency) @ k
```

An observed state during this stage was:

- `right`: `-0.9442286`

#### Stage 8

```python
assert np.allclose(left, right)
```

#### Stage 9

```python
assert np.allclose(np.linalg.norm(q), np.linalg.norm(rotated_q))
```

#### Stage 10

```python
print('absolute rotation score', left, 'relative rotation score', right)
```

Run from the course root:

```bash
python code/16_position_rope.py
```

### Recorded output from the supplied environment

```text
absolute rotation score -0.9442285988920982 relative rotation score -0.9442285988920983
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

An exact RoPE dot product for unit content vectors as relative position varies continuously for analysis.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=\cos{\left(\frac{x}{5} \right)}.$$

Its first derivative is

$$f^{(1)}(x)=- \frac{\sin{\left(\frac{x}{5} \right)}}{5}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=- \frac{\cos{\left(\frac{x}{5} \right)}}{25}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 2.8 | 0.847255111 | -0.10623724 | -0.0338902044 |
| 3 | 0.825335615 | -0.112928495 | -0.0330134246 |
| 3.2 | 0.802095758 | -0.119439088 | -0.0320838303 |

#### Evaluation 1: substitute $x=2.8$

$$f(2.8)=\cos{\left(\frac{14}{25} \right)}\approx 0.847255111.$$
At this coordinate the slope is $-0.10623724$, so the function decreases under a sufficiently small positive perturbation. The curvature is $-0.0338902044$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.00010623724$. The quadratic correction is $f^{(2)}(x)h^2/2\approx-1.69451022e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000106254184$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=3$

$$f(3)=\cos{\left(\frac{3}{5} \right)}\approx 0.825335615.$$
At this coordinate the slope is $-0.112928495$, so the function decreases under a sufficiently small positive perturbation. The curvature is $-0.0330134246$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.000112928495$. The quadratic correction is $f^{(2)}(x)h^2/2\approx-1.65067123e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000112945001$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=3.2$

$$f(3.2)=\cos{\left(\frac{16}{25} \right)}\approx 0.802095758.$$
At this coordinate the slope is $-0.119439088$, so the function decreases under a sufficiently small positive perturbation. The curvature is $-0.0320838303$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.000119439088$. The quadratic correction is $f^{(2)}(x)h^2/2\approx-1.60419152e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000119455129$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | -0.1129209663 | 7.5284e-06 |
| 0.01 | -0.1129284194 | 7.5286e-08 |
| 0.001 | -0.1129284939 | 7.5287e-10 |
| 0.0001 | -0.1129284947 | 6.8584e-12 |
| 1e-05 | -0.1129284947 | 1.3073e-12 |
| 1e-06 | -0.1129284947 | 4.3102e-11 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=\frac{\sin{\left(\frac{x}{5} \right)}}{125}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 0.847255111 | 0.847921314 | 0.847261045 | 5.9343e-06 |
| -0.1 | 0.83646265 | 0.836628464 | 0.836463397 | 7.4734e-07 |
| 0.1 | 0.813878457 | 0.814042765 | 0.813877698 | 7.5834e-07 |
| 0.2 | 0.802095758 | 0.802749916 | 0.802089647 | 6.1104e-06 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: attention](https://aman.ai/primers/attention/)
- [Aman.ai: LLM](https://aman.ai/primers/LLM/)
- [Aman.ai: transformers](https://aman.ai/primers/transformers/)

[Previous](15-multihead-gqa.md) · [Index](../README.md) · [Next](17-transformer-blocks.md)
