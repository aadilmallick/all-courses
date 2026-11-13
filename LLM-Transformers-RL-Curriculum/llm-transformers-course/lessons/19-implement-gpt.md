# 19. Build a complete tiny GPT from tensor operations

[Previous](18-encoder-decoder-architectures.md) · [Index](../README.md) · [Next](20-train-gpt.md)

**Part:** Training and inference. **Prerequisite:** read lessons 01–18 in order, or verify the earlier definitions used here.

## Assemble the pieces into one probabilistic model

The supplied `TinyGPT` in `code/core.py` is a complete differentiable causal decoder. It has token embeddings, learned absolute position embeddings, multi-head causal attention, a nonlinear feed-forward network, residual connections, normalization, and a vocabulary output projection. It is intentionally small enough to inspect. It does not implement the architecture or quality of a particular released LLM.

For IDs of shape $(B,T)$, the embedding lookup gives $(B,T,D)$. Add positions, normalize, and form projected queries, keys, and values. Split heads, calculate causal attention, merge heads, and apply the output projection. Add that result to the residual stream, apply a normalized feed-forward branch, add again, normalize once more, and project to $(B,T,V)$ logits.

## Understand the parameter graph

Every trainable array is a `Tensor` leaf. Arithmetic operations create new graph nodes that retain parent references and a local reverse rule. The parameter list contains leaves only. The model builds a new graph for every call; intermediate gradients therefore start at zero. Updating parameter data between forward and backward would invalidate the saved computation and must be avoided.

Embedding lookup uses repeated indexing. If token ID two appears four times, four upstream row gradients must add into embedding row two. The engine uses `np.add.at` because ordinary advanced-index `+=` does not reliably accumulate repeated indices as intended.

For a target at batch $b$, position $t$, select log-probability $\ell_{bt,y_{bt}}$. The mean negative of these selected values is a scalar. Calling `backward()` propagates derivatives through indexing, log-softmax, output projection, both residual branches, and the three attention projections to embeddings.

## Verify more than successful execution

A shape check should confirm output $(B,T,V)$. A causality check should alter the last input ID and verify earlier logits are unchanged. A gradient check should perturb one parameter coordinate and compare the loss change with its autodiff gradient. These are different properties; passing one does not imply the others.

The example checks all three on a tiny vocabulary. Numerical gradients are expensive because each coordinate requires two forward passes. They are practical for representative coordinates and primitive operations, not for every parameter of a large model.

## Deliberate simplifications

The model uses one block, tanh activation, no dropout, and unlearned normalization scale and shift. It trains with float64 NumPy on CPU. It has no attention cache or accelerated kernel. These simplifications preserve the central forward/backward mathematics while making the implementation inspectable.

A model can overfit a tiny pattern without learning general linguistic competence. The next lesson uses that limitation constructively: first prove the training pipeline can learn a simple pattern, then discuss what changes for realistic data.

### Count the tiny model before trusting it

For vocabulary $V$, context $T$, and width $D$, our one-block model has token and position tables with $VD+TD$ parameters, four attention matrices with $4D^2$, feed-forward matrices with $8D^2$, and an untied output matrix with $DV$. Total is $2VD+TD+12D^2$. There are no learned biases or normalization affine parameters in this implementation. For $V=5,T=5,D=8$, total is $80+40+768=888$. Compare this arithmetic with the parameter arrays. A mismatch identifies an architectural misunderstanding before any training claim is made.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
from core import TinyGPT
model = TinyGPT(vocabulary=5, width=8, heads=2, context=5)
inputs = np.array([[0, 1, 2, 3]])
targets = np.array([[1, 2, 3, 4]])
logits = model(inputs).data
assert logits.shape == (1, 4, 5)
changed = inputs.copy()
changed[0, -1] = 0
assert np.allclose(model(changed).data[:, :-1], logits[:, :-1])
loss = model.loss(inputs, targets)
loss.backward()
parameter, index = model.wq, (0, 0)
analytic = parameter.grad[index]
original, step = parameter.data[index], 1e-5
parameter.data[index] = original + step
positive = float(model.loss(inputs, targets).data)
parameter.data[index] = original - step
negative = float(model.loss(inputs, targets).data)
parameter.data[index] = original
assert np.allclose(analytic, (positive-negative)/(2*step), atol=1e-6)
print('loss', float(loss.data), 'checked gradient', analytic)

```

### Code structure and observed intermediate values


#### Stage 3

```python
model = TinyGPT(vocabulary=5, width=8, heads=2, context=5)
```

#### Stage 4

```python
inputs = np.array([[0, 1, 2, 3]])
```

An observed state during this stage was:

- `inputs`: `[[0 1 2 3]]`

#### Stage 5

```python
targets = np.array([[1, 2, 3, 4]])
```

An observed state during this stage was:

- `targets`: `[[1 2 3 4]]`

#### Stage 6

```python
logits = model(inputs).data
```

An observed state during this stage was:

- `logits`: `[[[-0.49307 -0.13454  0.07445 -0.53996  0.06473]   [-0.23169 -0.21648  0.03673 -0.2694   0.35906]   [ 0.10637  0.05112 -0.20411  0.48429  0.29624]   [ 0.20436  0.35609 -0.10427  0.32656 -0.23961]]]`

#### Stage 7

```python
assert logits.shape == (1, 4, 5)
```

#### Stage 8

```python
changed = inputs.copy()
```

An observed state during this stage was:

- `changed`: `[[0 1 2 3]]`

#### Stage 9

```python
changed[0, -1] = 0
```

An observed state during this stage was:

- `changed`: `[[0 1 2 0]]`

#### Stage 10

```python
assert np.allclose(model(changed).data[:, :-1], logits[:, :-1])
```

#### Stage 11

```python
loss = model.loss(inputs, targets)
```

An observed state during this stage was:

- `loss`: `Tensor(data=1.59868)`

#### Stage 12

```python
loss.backward()
```

#### Stage 13

```python
parameter, index = model.wq, (0, 0)
```

An observed state during this stage was:

- `parameter`: `Tensor(data=array shape=(8, 8), min=-0.212857, max=0.224476, norm=0.719617)`
- `index`: `(0, 0)`

#### Stage 14

```python
analytic = parameter.grad[index]
```

An observed state during this stage was:

- `analytic`: `-0.0010531233`

#### Stage 15

```python
original, step = parameter.data[index], 1e-5
```

An observed state during this stage was:

- `original`: `-0.042802494`
- `step`: `1e-05`

#### Stage 16

```python
parameter.data[index] = original + step
```

An observed state during this stage was:

- `parameter`: `Tensor(data=array shape=(8, 8), min=-0.212857, max=0.224476, norm=0.719616)`

#### Stage 17

```python
positive = float(model.loss(inputs, targets).data)
```

An observed state during this stage was:

- `positive`: `1.5986828`

#### Stage 18

```python
parameter.data[index] = original - step
```

An observed state during this stage was:

- `parameter`: `Tensor(data=array shape=(8, 8), min=-0.212857, max=0.224476, norm=0.719617)`

#### Stage 19

```python
negative = float(model.loss(inputs, targets).data)
```

An observed state during this stage was:

- `negative`: `1.5986829`

#### Stage 20

```python
parameter.data[index] = original
```

#### Stage 21

```python
assert np.allclose(analytic, (positive-negative)/(2*step), atol=1e-6)
```

#### Stage 22

```python
print('loss', float(loss.data), 'checked gradient', analytic)
```

Run from the course root:

```bash
python code/19_implement_gpt.py
```

### Recorded output from the supplied environment

```text
loss 1.5986828515745766 checked gradient -0.0010531233244849207
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

A tiny composed language-model logit loss, demonstrating gradients through nonlinear hidden features.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=\log{\left(e^{\tanh{\left(x \right)}} + 1 \right)} - \tanh{\left(x \right)}.$$

Its first derivative is

$$f^{(1)}(x)=\frac{\left(1 - \tanh^{2}{\left(x \right)}\right) e^{\tanh{\left(x \right)}}}{e^{\tanh{\left(x \right)}} + 1} + \tanh^{2}{\left(x \right)} - 1.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=\frac{\left(1 - \tanh^{2}{\left(x \right)}\right)^{2} e^{\tanh{\left(x \right)}}}{e^{\tanh{\left(x \right)}} + 1} - \frac{\left(1 - \tanh^{2}{\left(x \right)}\right)^{2} e^{2 \tanh{\left(x \right)}}}{\left(e^{\tanh{\left(x \right)}} + 1\right)^{2}} + \left(2 - 2 \tanh^{2}{\left(x \right)}\right) \tanh{\left(x \right)} - \frac{\left(2 - 2 \tanh^{2}{\left(x \right)}\right) e^{\tanh{\left(x \right)}} \tanh{\left(x \right)}}{e^{\tanh{\left(x \right)}} + 1}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 0 | 0.693147181 | -0.5 | 0.25 |
| 0.2 | 0.599321264 | -0.433253303 | 0.399693641 |
| 0.4 | 0.521110342 | -0.347508458 | 0.440650543 |

#### Evaluation 1: substitute $x=0$

$$f(0)=\log{\left(2 \right)}\approx 0.693147181.$$
At this coordinate the slope is $-0.5$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.25$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.0005$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.25e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000499874833$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0.2$

$$f(0.2)=- \tanh{\left(\frac{1}{5} \right)} + \log{\left(1 + e^{\tanh{\left(\frac{1}{5} \right)}} \right)}\approx 0.599321264.$$
At this coordinate the slope is $-0.433253303$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.399693641$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.000433253303$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.9984682e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000433053377$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.4$

$$f(0.4)=- \tanh{\left(\frac{2}{5} \right)} + \log{\left(1 + e^{\tanh{\left(\frac{2}{5} \right)}} \right)}\approx 0.521110342.$$
At this coordinate the slope is $-0.347508458$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.440650543$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.000347508458$. The quadratic correction is $f^{(2)}(x)h^2/2\approx2.20325271e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000347288139$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | -0.4324646368 | 0.00078867 |
| 0.01 | -0.4332454222 | 7.8804e-06 |
| 0.001 | -0.4332532238 | 7.8804e-08 |
| 0.0001 | -0.4332533018 | 7.8937e-10 |
| 1e-05 | -0.4332533026 | 4.4433e-12 |
| 1e-06 | -0.4332533025 | 1.0436e-10 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=\frac{\left(1 - \tanh^{2}{\left(x \right)}\right)^{3} e^{\tanh{\left(x \right)}}}{e^{\tanh{\left(x \right)}} + 1} - \frac{\left(1 - \tanh^{2}{\left(x \right)}\right)^{3} e^{2 \tanh{\left(x \right)}}}{\left(e^{\tanh{\left(x \right)}} + 1\right)^{2}} + \frac{2 \left(1 - \tanh^{2}{\left(x \right)}\right)^{3} e^{3 \tanh{\left(x \right)}}}{\left(e^{\tanh{\left(x \right)}} + 1\right)^{3}} - \frac{\left(1 - \tanh^{2}{\left(x \right)}\right)^{2} \left(2 - 2 \tanh^{2}{\left(x \right)}\right) e^{2 \tanh{\left(x \right)}}}{\left(e^{\tanh{\left(x \right)}} + 1\right)^{2}} + \left(1 - \tanh^{2}{\left(x \right)}\right) \left(2 - 2 \tanh^{2}{\left(x \right)}\right) - \frac{3 \left(1 - \tanh^{2}{\left(x \right)}\right) \left(2 - 2 \tanh^{2}{\left(x \right)}\right) e^{\tanh{\left(x \right)}} \tanh{\left(x \right)}}{e^{\tanh{\left(x \right)}} + 1} - \frac{\left(1 - \tanh^{2}{\left(x \right)}\right) \left(2 - 2 \tanh^{2}{\left(x \right)}\right) e^{\tanh{\left(x \right)}}}{e^{\tanh{\left(x \right)}} + 1} + \frac{3 \left(1 - \tanh^{2}{\left(x \right)}\right) \left(2 - 2 \tanh^{2}{\left(x \right)}\right) e^{2 \tanh{\left(x \right)}} \tanh{\left(x \right)}}{\left(e^{\tanh{\left(x \right)}} + 1\right)^{2}} - 2 \left(2 - 2 \tanh^{2}{\left(x \right)}\right) \tanh^{2}{\left(x \right)} + \frac{2 \left(2 - 2 \tanh^{2}{\left(x \right)}\right) e^{\tanh{\left(x \right)}} \tanh^{2}{\left(x \right)}}{e^{\tanh{\left(x \right)}} + 1}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 0.693147181 | 0.685971924 | 0.693965797 | 0.00081862 |
| -0.1 | 0.644554383 | 0.642646594 | 0.644645062 | 9.0679e-05 |
| 0.1 | 0.558061456 | 0.555995933 | 0.557994402 | 6.7054e-05 |
| 0.2 | 0.521110342 | 0.512670603 | 0.520664476 | 0.00044587 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: transformers](https://aman.ai/primers/transformers/)
- [Aman.ai: LLM](https://aman.ai/primers/LLM/)

[Previous](18-encoder-decoder-architectures.md) · [Index](../README.md) · [Next](20-train-gpt.md)
