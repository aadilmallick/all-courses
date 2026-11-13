# 09. Embeddings, distributional learning, and similarity

[Previous](08-tokenization-bpe.md) · [Index](../README.md) · [Next](10-rnn-seq2seq.md)

**Part:** Language and attention. **Prerequisite:** read lessons 01–08 in order, or verify the earlier definitions used here.

## A lookup table becomes a representation

For vocabulary size $V$ and width $D$, an embedding table is $E\in\mathbb R^{V\times D}$. Token ID $i$ retrieves row $E_i$. Multiplying a one-hot row by $E$ gives the same result: only one term in each output coordinate survives. The integer value of the ID has no distance meaning.

Why do nearby vectors sometimes have related meanings? A learning objective rewards similar behavior in similar contexts. If two words predict similar neighbors, training can make their representations useful in similar ways. Geometry is an outcome of the objective and data. It is not a guarantee that every semantic relation becomes a straight line.

## A contrastive example

Let query $q$ and candidate vectors $d_j$ produce scores $s_j=q^\top d_j/\tau$, with temperature $\tau>0$. If candidate zero is correct, minimize $L=-\log[\exp(s_0)/\sum_j\exp(s_j)]$. From the softmax gradient,

$$\frac{\partial L}{\partial q}=\frac1\tau\left(\sum_jp_jd_j-d_0\right).$$

To derive it, differentiate each score: $\partial s_j/\partial q=d_j/\tau$. Multiply by $p_j-\mathbf1[j=0]$ and sum over candidates. Gradient descent moves the query toward the positive relative to its probability-weighted alternatives. If all candidates are identical, this gradient is zero and the task supplies no discriminating signal.

Negative examples need care. Another document in the batch may also answer the question. Treating every other document as negative then creates false-negative pressure. Batch size changes the candidate distribution and the objective, not just its estimation variance.

## Static, contextual, token, and sentence representations

A static table gives the same vector for a token every time. A contextual transformer produces a representation that depends on neighboring tokens. A sentence representation must aggregate those contextual vectors or use a specially trained pooling token. Mean pooling with padding included biases toward sequence length and padded states.

A generative model's hidden vector is not automatically a good retrieval embedding. Retrieval usually benefits from explicit similarity training and matching query/document conventions. Likewise, normalization is appropriate only if the scoring system is trained or selected for that geometry.

The experiment differentiates a contrastive query by hand. It checks the derivative numerically and checks the effect of a small update. The tiny candidates are chosen to make the geometry readable; meaningful text embeddings require a dataset and a trained encoder.

Optional application: replace the positive with an identical vector to a negative. The loss cannot reach zero by changing only the query because the tied scores remain equal. This is an identifiability limitation, not an optimizer malfunction.

### Normalization changes the gradient too

If an encoder emits raw vector $h$ and retrieval uses $u=h/\|h\|$ for nonzero $h$, its Jacobian is $(I-uu^\top)/\|h\|$. Derive this by differentiating $h(h^\top h)^{-1/2}$ with the product rule. The resulting gradient removes the radial component, so infinitesimal learning changes direction rather than normalized length. A small raw norm amplifies this Jacobian, explaining the need to handle near-zero outputs. Simply treating normalized vectors as independent unconstrained parameters would differentiate a different system.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
from core import softmax, log_softmax, finite_difference
candidates = np.array([[1., 0.], [0., 1.], [-1., 0.]])
query = np.array([0.2, 0.3])
temperature = 0.7
def objective(vector):
    return -log_softmax(vector @ candidates.T / temperature)[0]
probabilities = softmax(query @ candidates.T / temperature)
gradient = (probabilities @ candidates - candidates[0]) / temperature
assert np.allclose(gradient, finite_difference(objective, query), atol=1e-7)
updated = query - 0.1 * gradient
assert objective(updated) < objective(query)
print('before', objective(query), 'after', objective(updated))

```

### Code structure and observed intermediate values


#### Stage 3

```python
candidates = np.array([[1., 0.], [0., 1.], [-1., 0.]])
```

An observed state during this stage was:

- `candidates`: `[[ 1.  0.]  [ 0.  1.]  [-1.  0.]]`

#### Stage 4

```python
query = np.array([0.2, 0.3])
```

An observed state during this stage was:

- `query`: `[0.2 0.3]`

#### Stage 5

```python
temperature = 0.7
```

An observed state during this stage was:

- `temperature`: `0.7`

#### Stage 6

```python
def objective(vector):
    return -log_softmax(vector @ candidates.T / temperature)[0]
```

#### Stage 7

```python
probabilities = softmax(query @ candidates.T / temperature)
```

An observed state during this stage was:

- `probabilities`: `[0.36788 0.42437 0.20775]`

#### Stage 8

```python
gradient = (probabilities @ candidates - candidates[0]) / temperature
```

An observed state during this stage was:

- `gradient`: `[-1.19981  0.60625]`

#### Stage 9

```python
assert np.allclose(gradient, finite_difference(objective, query), atol=1e-7)
```

#### Stage 10

```python
updated = query - 0.1 * gradient
```

An observed state during this stage was:

- `updated`: `[0.31998 0.23938]`

#### Stage 11

```python
assert objective(updated) < objective(query)
```

#### Stage 12

```python
print('before', objective(query), 'after', objective(updated))
```

Run from the course root:

```bash
python code/09_embeddings.py
```

### Recorded output from the supplied environment

```text
before 1.0000004739918806 after 0.8294490327932804
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

Contrastive loss for a query coordinate and three candidates with scores x, -x, and zero.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=- x + \log{\left(e^{x} + 1 + e^{- x} \right)}.$$

Its first derivative is

$$f^{(1)}(x)=\frac{e^{x} - e^{- x}}{e^{x} + 1 + e^{- x}} - 1.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=\frac{\left(- e^{x} + e^{- x}\right) \left(e^{x} - e^{- x}\right)}{\left(e^{x} + 1 + e^{- x}\right)^{2}} + \frac{e^{x} + e^{- x}}{e^{x} + 1 + e^{- x}}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 0 | 1.09861229 | -1 | 0.666666667 |
| 0.2 | 0.911901433 | -0.867547921 | 0.653523524 |
| 0.4 | 0.751250514 | -0.7402065 | 0.616266279 |

#### Evaluation 1: substitute $x=0$

$$f(0)=\log{\left(3 \right)}\approx 1.09861229.$$
At this coordinate the slope is $-1$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.666666667$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.001$. The quadratic correction is $f^{(2)}(x)h^2/2\approx3.33333333e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000999666667$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0.2$

$$f(0.2)=- \frac{1}{5} + \log{\left(e^{- \frac{1}{5}} + 1 + e^{\frac{1}{5}} \right)}\approx 0.911901433.$$
At this coordinate the slope is $-0.867547921$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.653523524$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.000867547921$. The quadratic correction is $f^{(2)}(x)h^2/2\approx3.26761762e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.00086722118$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.4$

$$f(0.4)=- \frac{2}{5} + \log{\left(e^{- \frac{2}{5}} + 1 + e^{\frac{2}{5}} \right)}\approx 0.751250514.$$
At this coordinate the slope is $-0.7402065$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.616266279$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.0007402065$. The quadratic correction is $f^{(2)}(x)h^2/2\approx3.08133139e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000739898406$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | -0.8677633916 | 0.00021547 |
| 0.01 | -0.8675500798 | 2.1592e-06 |
| 0.001 | -0.8675479422 | 2.1592e-08 |
| 0.0001 | -0.8675479209 | 2.1425e-10 |
| 1e-05 | -0.8675479207 | 7.7517e-12 |
| 1e-06 | -0.8675479206 | 8.6617e-11 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=\frac{\left(- 2 e^{x} + 2 e^{- x}\right) \left(- e^{x} + e^{- x}\right) \left(e^{x} - e^{- x}\right)}{\left(e^{x} + 1 + e^{- x}\right)^{3}} + \frac{\left(- e^{x} - e^{- x}\right) \left(e^{x} - e^{- x}\right)}{\left(e^{x} + 1 + e^{- x}\right)^{2}} + \frac{2 \left(- e^{x} + e^{- x}\right) \left(e^{x} + e^{- x}\right)}{\left(e^{x} + 1 + e^{- x}\right)^{2}} + \frac{e^{x} - e^{- x}}{e^{x} + 1 + e^{- x}}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 1.09861229 | 1.08541102 | 1.09848149 | 0.0001308 |
| -0.1 | 1.00194285 | 0.998656225 | 1.00192384 | 1.9006e-05 |
| 0.1 | 0.82839017 | 0.825146641 | 0.828414258 | 2.4088e-05 |
| 0.2 | 0.751250514 | 0.738391848 | 0.751462319 | 0.00021181 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: embeddings](https://aman.ai/primers/embeddings/)

[Previous](08-tokenization-bpe.md) · [Index](../README.md) · [Next](10-rnn-seq2seq.md)
