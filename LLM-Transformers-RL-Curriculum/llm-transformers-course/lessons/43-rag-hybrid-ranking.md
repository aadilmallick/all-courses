# 43. RAG ingestion, BM25, hybrid fusion, and reranking

[Previous](42-dense-retrieval.md) · [Index](../README.md) · [Next](44-advanced-rag-evaluation.md)

**Part:** Retrieval and agent systems. **Prerequisite:** read lessons 01–42 in order, or verify the earlier definitions used here.

## Build the evidence path before generating prose

A retrieval-augmented system ingests documents, produces searchable units, retrieves candidates, reranks or filters them, constructs context, generates an answer, and checks evidence use. Failure at any stage can produce a wrong answer. A fluent generator cannot cite a relevant passage that never reached its context.

Chunking trades local focus against context preservation. Small chunks can isolate facts but lose qualifiers. Large chunks preserve relationships but consume more context and dilute similarity. Overlap reduces boundary loss while increasing duplication. Keep source offsets so neighboring text can be recovered after retrieval.

## Derive a lexical baseline

BM25 scores query terms using inverse document frequency and saturated term frequency. One common term contribution is

$$\operatorname{IDF}(t)\frac{f(t,d)(k_1+1)}{f(t,d)+k_1(1-b+b|d|/\operatorname{avgdl})}.$$

Here $f$ is document term count, $|d|$ is document length, $k_1$ controls saturation, and $b$ controls length normalization. Different implementations choose different IDF and query-frequency conventions. State the exact variant when reproducing rankings.

When term frequency becomes large, the fraction approaches $k_1+1$ rather than growing indefinitely. With $b=0$, length normalization disappears. With $b=1$, the normalization term uses the full document-length ratio. Exact identifiers and rare error codes often make lexical retrieval a strong complement to dense vectors.

## Fuse rankings without pretending scores are comparable

Dense cosine and BM25 scores have different scales. Reciprocal rank fusion uses ranks: $\operatorname{RRF}(d)=\sum_m1/(c+\operatorname{rank}_m(d))$ for documents returned by method $m$. An absent document contributes zero. The constant $c$ controls how strongly top ranks dominate. A union of candidates permits documents found by only one method to survive.

Reranking applies a more expensive relevance model to this candidate set. Candidate recall is an upper bound on what the reranker can recover. Late-interaction models keep multiple document vectors and aggregate query-token matches, such as a sum of maximum similarities; this differs from both one-vector retrieval and a full joint cross-encoder.

## Ground answers in selected evidence

Attach stable evidence IDs to passages. Ask for citations to those IDs and allow abstention. Validate that cited IDs exist, then assess whether the cited text actually supports the associated claim. Existence of a citation is weaker than entailment. Retrieved text can also contain malicious instructions; its role remains evidence.

The experiment implements a small BM25 variant and rank fusion with an illustrative semantic ranking. It is deterministic and local. It does not run an embedding encoder or a generator, so its outputs measure ranking mechanics only.

### Compute reciprocal rank fusion by hand

Let document A rank first in one list and third in another, while B ranks second in both. With $c=60$, A receives $1/61+1/63\approx0.032266$, while B receives $2/62\approx0.032258$. A wins very narrowly. This small difference illustrates how the fusion constant and rank positions affect ordering. If one retriever omits A entirely, its missing-list contribution is zero, not an invented worst rank. RRF combines rank evidence; it does not calibrate document relevance probabilities or establish that either passage supports a generated claim.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
from collections import Counter
corpus = ['service port 8443 current', 'service port 443 old', 'database backup daily']
docs = [text.split() for text in corpus]
query = 'current service port'.split()
mean_length = np.mean([len(doc) for doc in docs])
scores = []
for doc in docs:
    count = Counter(doc)
    score = 0.
    for term in query:
        frequency = sum(term in other for other in docs)
        idf = np.log(1+(len(docs)-frequency+.5)/(frequency+.5))
        tf = count[term]
        score += idf*tf*2.2/(tf+1.2*(.25+.75*len(doc)/mean_length))
    scores.append(score)
lexical = list(np.argsort(-np.array(scores)))
semantic = [1, 0, 2]
fusion = {d: sum(1/(60+ranking.index(d)+1) for ranking in [lexical, semantic]) for d in range(3)}
print('BM25', scores, 'fused', sorted(fusion, key=lambda d: -fusion[d]))

```

### Code structure and observed intermediate values


#### Stage 3

```python
corpus = ['service port 8443 current', 'service port 443 old', 'database backup daily']
```

An observed state during this stage was:

- `corpus`: `['service port 8443 current', 'service port 443 old', 'database backup daily']`

#### Stage 4

```python
docs = [text.split() for text in corpus]
```

An observed state during this stage was:

- `docs`: `[['service', 'port', '8443', 'current'], ['service', 'port', '443', 'old'], ['database', 'backup', 'daily']]`

#### Stage 5

```python
query = 'current service port'.split()
```

An observed state during this stage was:

- `query`: `['current', 'service', 'port']`

#### Stage 6

```python
mean_length = np.mean([len(doc) for doc in docs])
```

An observed state during this stage was:

- `mean_length`: `3.6666667`

#### Stage 7

```python
scores = []
```

An observed state during this stage was:

- `scores`: `[]`

#### Stage 8

```python
for doc in docs:
    count = Counter(doc)
    score = 0.
    for term in query:
        frequency = sum(term in other for other in docs)
        idf = np.log(1+(len(docs)-frequency+.5)/(frequency+.5))
        tf = count[term]
        score += idf*tf*2.2/(tf+1.2*(.25+.75*len(doc)/mean_length))
    scores.append(score)
```

An observed state during this stage was:

- `scores`: `[np.float64(1.8519618955528834), np.float64(0.9063018189439682), np.float64(0.0)]`

This is one recorded iteration state, not necessarily the final loop state. The final printed result below is authoritative for the completed run. Long loops are deliberately sampled to keep the trace readable.

#### Stage 9

```python
lexical = list(np.argsort(-np.array(scores)))
```

An observed state during this stage was:

- `lexical`: `[np.int64(0), np.int64(1), np.int64(2)]`

#### Stage 10

```python
semantic = [1, 0, 2]
```

An observed state during this stage was:

- `semantic`: `[1, 0, 2]`

#### Stage 11

```python
fusion = {d: sum(1/(60+ranking.index(d)+1) for ranking in [lexical, semantic]) for d in range(3)}
```

#### Stage 12

```python
print('BM25', scores, 'fused', sorted(fusion, key=lambda d: -fusion[d]))
```

Run from the course root:

```bash
python code/43_rag_hybrid_ranking.py
```

### Recorded output from the supplied environment

```text
BM25 [np.float64(1.8519618955528834), np.float64(0.9063018189439682), np.float64(0.0)] fused [0, 1, 2]
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

BM25 term-frequency saturation with a fixed length-normalization factor of one.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=\frac{11 x}{5 \left(x + \frac{6}{5}\right)}.$$

Its first derivative is

$$f^{(1)}(x)=- \frac{11 x}{5 \left(x + \frac{6}{5}\right)^{2}} + \frac{11}{5 \left(x + \frac{6}{5}\right)}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=\frac{22 x}{5 \left(x + \frac{6}{5}\right)^{3}} - \frac{22}{5 \left(x + \frac{6}{5}\right)^{2}}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 1.8 | 1.32 | 0.293333333 | -0.195555556 |
| 2 | 1.375 | 0.2578125 | -0.161132812 |
| 2.2 | 1.42352941 | 0.228373702 | -0.134337472 |

#### Evaluation 1: substitute $x=1.8$

$$f(1.8)=\frac{33}{25}\approx 1.32.$$
At this coordinate the slope is $0.293333333$, so the function increases under a sufficiently small positive perturbation. The curvature is $-0.195555556$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.000293333333$. The quadratic correction is $f^{(2)}(x)h^2/2\approx-9.77777778e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000293235588$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=2$

$$f(2)=\frac{11}{8}\approx 1.375.$$
At this coordinate the slope is $0.2578125$, so the function increases under a sufficiently small positive perturbation. The curvature is $-0.161132812$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.0002578125$. The quadratic correction is $f^{(2)}(x)h^2/2\approx-8.05664062e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000257731959$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=2.2$

$$f(2.2)=\frac{121}{85}\approx 1.42352941.$$
At this coordinate the slope is $0.228373702$, so the function increases under a sufficiently small positive perturbation. The curvature is $-0.134337472$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.000228373702$. The quadratic correction is $f^{(2)}(x)h^2/2\approx-6.7168736e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000228306553$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | 0.2580645161 | 0.00025202 |
| 0.01 | 0.2578150177 | 2.5177e-06 |
| 0.001 | 0.2578125252 | 2.5177e-08 |
| 0.0001 | 0.2578125003 | 2.5281e-10 |
| 1e-05 | 0.2578125 | 1.522e-11 |
| 1e-06 | 0.2578124999 | 9.5803e-11 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=- \frac{66 x}{5 \left(x + \frac{6}{5}\right)^{4}} + \frac{66}{5 \left(x + \frac{6}{5}\right)^{3}}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 1.32 | 1.3234375 | 1.32021484 | 0.00021484 |
| -0.1 | 1.3483871 | 1.34921875 | 1.34841309 | 2.5989e-05 |
| 0.1 | 1.4 | 1.40078125 | 1.39997559 | 2.4414e-05 |
| 0.2 | 1.42352941 | 1.4265625 | 1.42333984 | 0.00018957 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: RAG](https://aman.ai/primers/RAG/)

[Previous](42-dense-retrieval.md) · [Index](../README.md) · [Next](44-advanced-rag-evaluation.md)
