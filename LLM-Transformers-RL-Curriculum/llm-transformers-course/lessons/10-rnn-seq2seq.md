# 10. Recurrent networks, sequence-to-sequence, and alignment

[Previous](09-embeddings.md) · [Index](../README.md) · [Next](11-attention-weighted-retrieval.md)

**Part:** Language and attention. **Prerequisite:** read lessons 01–09 in order, or verify the earlier definitions used here.

## Understand the bottleneck attention replaced

A recurrent neural network processes $x_t$ using a state $h_t=\tanh(x_tW_x+h_{t-1}W_h+b)$. The state summarizes previous inputs. Sharing the same weights across positions permits variable-length sequences, but dependencies across time create a sequential computation path.

In a basic encoder-decoder, the encoder's final state initializes the decoder. Every source detail must influence that fixed-width state. This is a representational and optimization bottleneck, especially for long sequences. It does not mean a fixed-dimensional real vector has a simple finite information capacity in ideal mathematics; finite precision, robustness, and learning impose the practical constraint.

## Derive the long gradient path

Write $a_t=x_tW_x+h_{t-1}W_h+b$. In column-vector Jacobian notation, the derivative from $h_{t-1}$ to $h_t$ contains $W_h$ and a diagonal matrix with entries $1-\tanh^2(a_t)$. Across many steps, these Jacobians multiply. If their relevant singular values repeatedly fall below one, gradients shrink; values above one can amplify. A single eigenvalue statement is insufficient for arbitrary nonnormal, time-varying products.

Gates in LSTMs and GRUs create more controllable paths for storing and updating information. They help but do not guarantee perfect memory or remove all sequential work.

## Attention as alignment over saved states

Instead of retaining only $h_T$, keep encoder outputs $h_1,\ldots,h_T$. At decoder step $t$, let its state be $s_t$. Additive attention computes

$$e_{ti}=v^\top\tanh(W_hh_i+W_ss_t+b),\quad
\alpha_{ti}=\frac{e^{e_{ti}}}{\sum_j e^{e_{tj}}},\quad
c_t=\sum_i\alpha_{ti}h_i.$$

Each energy compares the current decoder need with one source state. Softmax normalizes the energies, and the weighted sum retrieves a context vector. The decoder can focus on a different source region at each output step. The alignment weights are learned through the final task loss; no word-alignment labels are required by this formulation.

The additive scoring network and dot-product scoring are different parameterizations. Attention itself does not require a transformer. The conceptual bridge is saved states plus a query-dependent weighted read.

## Trace the example

Our code encodes three one-dimensional observations with a tiny recurrent state, then constructs an additive attention context from the saved states. It is a forward demonstration, not a trained translator. The sum of weights should be one, and the context should lie within the convex hull of the source states. Reordering inputs changes recurrent states because the recurrence is order-sensitive.

A useful comparison is to replace the weighted context by the final state and inspect the two vectors. Their difference illustrates alternative access paths, without proving one model will train better on a specific dataset.

### One scalar recurrence exposes vanishing and exploding paths

For linear recurrence $h_t=wh_{t-1}$ and initial state $h_0$, $h_T=w^Th_0$. The derivative with respect to $h_0$ is $w^T$. With $w=0.5,T=10$, it is $1/1024$; with $w=2$, it is 1024. This is an exact scalar demonstration of multiplicative path growth. A tanh recurrence adds factors $1-h_t^2$, each between zero and one. Matrices introduce singular directions and noncommuting products, so the scalar example is intuition for the mechanism rather than a complete spectral theorem for every recurrent network.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
from core import softmax
observations = np.array([[1.0], [0.0], [-1.0]])
state = np.zeros(2)
states = []
wx = np.array([[0.6, -0.2]])
wh = np.array([[0.5, 0.1], [-0.2, 0.4]])
for observation in observations:
    state = np.tanh(observation @ wx + state @ wh)
    states.append(state.copy())
states = np.array(states)
query = np.array([0.3, -0.1])
energies = np.tanh(states + query) @ np.array([0.7, -0.4])
weights = softmax(energies)
context = weights @ states
assert np.allclose(weights.sum(), 1)
print('states', states, 'weights', weights, 'context', context)

```

### Code structure and observed intermediate values


#### Stage 3

```python
observations = np.array([[1.0], [0.0], [-1.0]])
```

An observed state during this stage was:

- `observations`: `[[ 1.]  [ 0.]  [-1.]]`

#### Stage 4

```python
state = np.zeros(2)
```

An observed state during this stage was:

- `state`: `[0. 0.]`

#### Stage 5

```python
states = []
```

An observed state during this stage was:

- `states`: `[]`

#### Stage 6

```python
wx = np.array([[0.6, -0.2]])
```

An observed state during this stage was:

- `wx`: `[[ 0.6 -0.2]]`

#### Stage 7

```python
wh = np.array([[0.5, 0.1], [-0.2, 0.4]])
```

An observed state during this stage was:

- `wh`: `[[ 0.5  0.1]  [-0.2  0.4]]`

#### Stage 8

```python
for observation in observations:
    state = np.tanh(observation @ wx + state @ wh)
    states.append(state.copy())
```

An observed state during this stage was:

- `states`: `[array([ 0.53704957, -0.19737532]), array([ 0.29861639, -0.02523981]), array([-0.41831167,  0.21629475])]`

This is one recorded iteration state, not necessarily the final loop state. The final printed result below is authoritative for the completed run. Long loops are deliberately sampled to keep the trace readable.

#### Stage 9

```python
states = np.array(states)
```

An observed state during this stage was:

- `states`: `[[ 0.53705 -0.19738]  [ 0.29862 -0.02524]  [-0.41831  0.21629]]`

#### Stage 10

```python
query = np.array([0.3, -0.1])
```

An observed state during this stage was:

- `query`: `[ 0.3 -0.1]`

#### Stage 11

```python
energies = np.tanh(states + query) @ np.array([0.7, -0.4])
```

An observed state during this stage was:

- `energies`: `[ 0.59453  0.42508 -0.12874]`

#### Stage 12

```python
weights = softmax(energies)
```

An observed state during this stage was:

- `weights`: `[0.42932 0.3624  0.20829]`

#### Stage 13

```python
context = weights @ states
```

An observed state during this stage was:

- `context`: `[ 0.25165 -0.04883]`

#### Stage 14

```python
assert np.allclose(weights.sum(), 1)
```

#### Stage 15

```python
print('states', states, 'weights', weights, 'context', context)
```

Run from the course root:

```bash
python code/10_rnn_seq2seq.py
```

### Recorded output from the supplied environment

```text
states [[ 0.53704957 -0.19737532]
 [ 0.29861639 -0.02523981]
 [-0.41831167  0.21629475]] weights [0.42931608 0.36239701 0.2082869 ] context [ 0.25165286 -0.04883187]
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

Two recurrent transitions along one scalar path; their derivatives multiply.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=\tanh{\left(\frac{\tanh{\left(x \right)}}{2} \right)}.$$

Its first derivative is

$$f^{(1)}(x)=\left(\frac{1}{2} - \frac{\tanh^{2}{\left(x \right)}}{2}\right) \left(1 - \tanh^{2}{\left(\frac{\tanh{\left(x \right)}}{2} \right)}\right).$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=- 2 \left(\frac{1}{2} - \frac{\tanh^{2}{\left(x \right)}}{2}\right)^{2} \left(1 - \tanh^{2}{\left(\frac{\tanh{\left(x \right)}}{2} \right)}\right) \tanh{\left(\frac{\tanh{\left(x \right)}}{2} \right)} - \frac{\left(1 - \tanh^{2}{\left(\frac{\tanh{\left(x \right)}}{2} \right)}\right) \left(2 - 2 \tanh^{2}{\left(x \right)}\right) \tanh{\left(x \right)}}{2}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 0.1 | 0.0497927852 | 0.493805799 | -0.122776984 |
| 0.3 | 0.144634904 | 0.447996489 | -0.320311205 |
| 0.5 | 0.227032609 | 0.372955612 | -0.411289331 |

#### Evaluation 1: substitute $x=0.1$

$$f(0.1)=\tanh{\left(\frac{\tanh{\left(\frac{1}{10} \right)}}{2} \right)}\approx 0.0497927852.$$
At this coordinate the slope is $0.493805799$, so the function increases under a sufficiently small positive perturbation. The curvature is $-0.122776984$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.000493805799$. The quadratic correction is $f^{(2)}(x)h^2/2\approx-6.13884919e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000493744213$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0.3$

$$f(0.3)=\tanh{\left(\frac{\tanh{\left(\frac{3}{10} \right)}}{2} \right)}\approx 0.144634904.$$
At this coordinate the slope is $0.447996489$, so the function increases under a sufficiently small positive perturbation. The curvature is $-0.320311205$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.000447996489$. The quadratic correction is $f^{(2)}(x)h^2/2\approx-1.60155602e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $0.00044783621$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.5$

$$f(0.5)=\tanh{\left(\frac{\tanh{\left(\frac{1}{2} \right)}}{2} \right)}\approx 0.227032609.$$
At this coordinate the slope is $0.372955612$, so the function increases under a sufficiently small positive perturbation. The curvature is $-0.411289331$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.000372955612$. The quadratic correction is $f^{(2)}(x)h^2/2\approx-2.05644665e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000372749937$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | 0.4467653223 | 0.0012312 |
| 0.01 | 0.4479841549 | 1.2334e-05 |
| 0.001 | 0.4479963657 | 1.2334e-07 |
| 0.0001 | 0.4479964878 | 1.2333e-09 |
| 1e-05 | 0.447996489 | 1.1239e-11 |
| 1e-06 | 0.447996489 | 2.7892e-11 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=- 2 \left(\frac{1}{2} - \frac{\tanh^{2}{\left(x \right)}}{2}\right)^{3} \left(1 - \tanh^{2}{\left(\frac{\tanh{\left(x \right)}}{2} \right)}\right)^{2} + 4 \left(\frac{1}{2} - \frac{\tanh^{2}{\left(x \right)}}{2}\right)^{3} \left(1 - \tanh^{2}{\left(\frac{\tanh{\left(x \right)}}{2} \right)}\right) \tanh^{2}{\left(\frac{\tanh{\left(x \right)}}{2} \right)} + 3 \left(\frac{1}{2} - \frac{\tanh^{2}{\left(x \right)}}{2}\right) \left(1 - \tanh^{2}{\left(\frac{\tanh{\left(x \right)}}{2} \right)}\right) \left(2 - 2 \tanh^{2}{\left(x \right)}\right) \tanh{\left(x \right)} \tanh{\left(\frac{\tanh{\left(x \right)}}{2} \right)} - \frac{\left(1 - \tanh^{2}{\left(x \right)}\right) \left(1 - \tanh^{2}{\left(\frac{\tanh{\left(x \right)}}{2} \right)}\right) \left(2 - 2 \tanh^{2}{\left(x \right)}\right)}{2} + \left(1 - \tanh^{2}{\left(\frac{\tanh{\left(x \right)}}{2} \right)}\right) \left(2 - 2 \tanh^{2}{\left(x \right)}\right) \tanh^{2}{\left(x \right)}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 0.0497927852 | 0.0550356058 | 0.0486293817 | 0.0011634 |
| -0.1 | 0.0983685219 | 0.0998352547 | 0.0982336986 | 0.00013482 |
| 0.1 | 0.187721586 | 0.189434552 | 0.187832996 | 0.00011141 |
| 0.2 | 0.227032609 | 0.234234201 | 0.227827977 | 0.00079537 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: attention](https://aman.ai/primers/attention/)

[Previous](09-embeddings.md) · [Index](../README.md) · [Next](11-attention-weighted-retrieval.md)
