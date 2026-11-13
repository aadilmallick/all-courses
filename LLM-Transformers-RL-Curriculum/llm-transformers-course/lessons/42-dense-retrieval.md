# 42. Dense retrieval, contrastive encoders, and vector search

[Previous](41-context-memory.md) · [Index](../README.md) · [Next](43-rag-hybrid-ranking.md)

**Part:** Retrieval and agent systems. **Prerequisite:** read lessons 01–41 in order, or verify the earlier definitions used here.

## Retrieval is a measurable ranking task

Given query $q$, rank documents so useful evidence appears near the top. A dual encoder separately maps queries and documents into vectors, making document indexing reusable. Similarity can be a dot product or cosine according to training. A cross-encoder jointly processes query and document and can model detailed interactions, but typically costs more per candidate.

For a batch of query-document pairs, scores $S_{ij}=f(q_i)^\top g(d_j)/\tau$ and diagonal labels give $L=-B^{-1}\sum_i\log\operatorname{softmax}(S_i)_i$. Each row treats the paired document as positive. A symmetric objective also predicts queries from documents. False negatives occur when another document in the batch is relevant.

## Exact search before approximation

Normalize vectors if cosine is the intended score, then compute all query-document dot products and sort. This is an exact baseline. Approximate nearest-neighbor indexes trade recall, latency, build cost, and memory using structures such as graphs or quantized partitions. Approximation should be evaluated against exact neighbors under the same vectors and score.

ANN recall is not the same as task retrieval recall. An approximate index may faithfully retrieve the embedding model's nearest neighbors even when those documents do not answer the question. Separate encoder quality from index approximation quality.

## Work a retrieval metric

If relevant IDs are $\{d_2,d_5\}$ and top three results contain only $d_5$, recall at three is $1/2$. Precision at three is $1/3$. Reciprocal rank is the inverse of the first relevant rank. For a single first relevant result at rank two, it is $1/2$. Each metric answers a different question about ranking.

Document chunks need stable IDs, source locations, timestamps, and access-control metadata. Retrieve only evidence the caller is authorized to use. Filtering after taking a tiny top-$k$ can leave too few results; filtering strategy and candidate budget affect recall.

## Distribution and query conventions matter

Some encoders expect different query and document prefixes or pooling rules. Use the model's documented conventions when integrating an actual encoder. Changing them alters embeddings. Evaluate short questions, exact identifiers, rare entities, negation, and multilingual inputs rather than relying only on semantic paraphrases.

The code uses hand-designed vectors to make ranking and metrics inspectable. It demonstrates exact cosine search and contrastive loss, not a trained text encoder or an ANN implementation. The later hybrid lesson adds lexical matching for exact terms.

### Derive cosine search as Euclidean search under normalization

For unit vectors $u,v$, squared Euclidean distance is $\|u-v\|^2=u^\top u+v^\top v-2u^\top v=2-2u^\top v$. Minimizing this distance is equivalent to maximizing the dot product. Without equal unit norms, the extra norm terms vary and the ranking equivalence can fail. An index configured for Euclidean distance can therefore match cosine ranking only when normalization and its handling of zero vectors are correct. State the vector preprocessing as part of the retrieval specification, not as an optional display choice.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
from core import log_softmax
vectors = np.array([[1., 0.], [.8, .2], [0., 1.], [-1., 0.]])
vectors = vectors/np.linalg.norm(vectors, axis=1, keepdims=True)
query = np.array([1., .1])
query /= np.linalg.norm(query)
scores = vectors @ query
ranking = np.argsort(-scores)
relevant = {1, 2}
recall = len(set(ranking[:2]) & relevant)/len(relevant)
first = next(rank for rank, item in enumerate(ranking, 1) if item in relevant)
contrastive_loss = -log_softmax(scores/.2)[1]
print('ranking', ranking, 'recall@2', recall, 'reciprocal rank', 1/first, 'loss', contrastive_loss)

```

### Code structure and observed intermediate values


#### Stage 3

```python
vectors = np.array([[1., 0.], [.8, .2], [0., 1.], [-1., 0.]])
```

An observed state during this stage was:

- `vectors`: `[[ 1.   0. ]  [ 0.8  0.2]  [ 0.   1. ]  [-1.   0. ]]`

#### Stage 4

```python
vectors = vectors/np.linalg.norm(vectors, axis=1, keepdims=True)
```

An observed state during this stage was:

- `vectors`: `[[ 1.       0.     ]  [ 0.97014  0.24254]  [ 0.       1.     ]  [-1.       0.     ]]`

#### Stage 5

```python
query = np.array([1., .1])
```

An observed state during this stage was:

- `query`: `[1.  0.1]`

#### Stage 6

```python
query /= np.linalg.norm(query)
```

An observed state during this stage was:

- `query`: `[0.99504 0.0995 ]`

#### Stage 7

```python
scores = vectors @ query
```

An observed state during this stage was:

- `scores`: `[ 0.99504  0.98946  0.0995  -0.99504]`

#### Stage 8

```python
ranking = np.argsort(-scores)
```

An observed state during this stage was:

- `ranking`: `[0 1 2 3]`

#### Stage 9

```python
relevant = {1, 2}
```

An observed state during this stage was:

- `relevant`: `{1, 2}`

#### Stage 10

```python
recall = len(set(ranking[:2]) & relevant)/len(relevant)
```

An observed state during this stage was:

- `recall`: `0.5`

#### Stage 11

```python
first = next(rank for rank, item in enumerate(ranking, 1) if item in relevant)
```

An observed state during this stage was:

- `first`: `2`

#### Stage 12

```python
contrastive_loss = -log_softmax(scores/.2)[1]
```

An observed state during this stage was:

- `contrastive_loss`: `0.7129513`

#### Stage 13

```python
print('ranking', ranking, 'recall@2', recall, 'reciprocal rank', 1/first, 'loss', contrastive_loss)
```

Run from the course root:

```bash
python code/42_dense_retrieval.py
```

### Recorded output from the supplied environment

```text
ranking [0 1 2 3] recall@2 0.5 reciprocal rank 0.5 loss 0.7129513026132387
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

One contrastive retrieval row with a positive and two negatives at temperature 0.5.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=- 2 x + \log{\left(e^{2 x} + 1 + e^{- 2 x} \right)}.$$

Its first derivative is

$$f^{(1)}(x)=\frac{2 e^{2 x} - 2 e^{- 2 x}}{e^{2 x} + 1 + e^{- 2 x}} - 2.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=\frac{\left(- 2 e^{2 x} + 2 e^{- 2 x}\right) \left(2 e^{2 x} - 2 e^{- 2 x}\right)}{\left(e^{2 x} + 1 + e^{- 2 x}\right)^{2}} + \frac{4 e^{2 x} + 4 e^{- 2 x}}{e^{2 x} + 1 + e^{- 2 x}}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 0 | 1.09861229 | -2 | 2.66666667 |
| 0.2 | 0.751250514 | -1.480413 | 2.46506512 |
| 0.4 | 0.501517729 | -1.03331981 | 1.9770555 |

#### Evaluation 1: substitute $x=0$

$$f(0)=\log{\left(3 \right)}\approx 1.09861229.$$
At this coordinate the slope is $-2$, so the function decreases under a sufficiently small positive perturbation. The curvature is $2.66666667$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.002$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.33333333e-06$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.00199866667$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0.2$

$$f(0.2)=- \frac{2}{5} + \log{\left(e^{- \frac{2}{5}} + 1 + e^{\frac{2}{5}} \right)}\approx 0.751250514.$$
At this coordinate the slope is $-1.480413$, so the function decreases under a sufficiently small positive perturbation. The curvature is $2.46506512$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.001480413$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.23253256e-06$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.00147918078$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.4$

$$f(0.4)=- \frac{4}{5} + \log{\left(e^{- \frac{4}{5}} + 1 + e^{\frac{4}{5}} \right)}\approx 0.501517729.$$
At this coordinate the slope is $-1.03331981$, so the function decreases under a sufficiently small positive perturbation. The curvature is $1.9770555$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.00103331981$. The quadratic correction is $f^{(2)}(x)h^2/2\approx9.8852775e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.00103233174$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | -1.483563162 | 0.0031502 |
| 0.01 | -1.480444736 | 3.1737e-05 |
| 0.001 | -1.480413317 | 3.174e-07 |
| 0.0001 | -1.480413002 | 3.1742e-09 |
| 1e-05 | -1.480412999 | 4.2304e-11 |
| 1e-06 | -1.480412999 | 9.0922e-11 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=\frac{\left(- 4 e^{2 x} - 4 e^{- 2 x}\right) \left(2 e^{2 x} - 2 e^{- 2 x}\right)}{\left(e^{2 x} + 1 + e^{- 2 x}\right)^{2}} + \frac{\left(- 4 e^{2 x} + 4 e^{- 2 x}\right) \left(- 2 e^{2 x} + 2 e^{- 2 x}\right) \left(2 e^{2 x} - 2 e^{- 2 x}\right)}{\left(e^{2 x} + 1 + e^{- 2 x}\right)^{3}} + \frac{2 \left(- 2 e^{2 x} + 2 e^{- 2 x}\right) \left(4 e^{2 x} + 4 e^{- 2 x}\right)}{\left(e^{2 x} + 1 + e^{- 2 x}\right)^{2}} + \frac{8 e^{2 x} - 8 e^{- 2 x}}{e^{2 x} + 1 + e^{- 2 x}}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 1.09861229 | 1.04733311 | 1.09663442 | 0.0019779 |
| -0.1 | 0.911901433 | 0.899291814 | 0.911617139 | 0.00028429 |
| 0.1 | 0.6151888 | 0.603209214 | 0.615534539 | 0.00034574 |
| 0.2 | 0.501517729 | 0.455167914 | 0.504469216 | 0.0029515 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: embeddings](https://aman.ai/primers/embeddings/)
- [Aman.ai: RAG](https://aman.ai/primers/RAG/)

[Previous](41-context-memory.md) · [Index](../README.md) · [Next](43-rag-hybrid-ranking.md)
