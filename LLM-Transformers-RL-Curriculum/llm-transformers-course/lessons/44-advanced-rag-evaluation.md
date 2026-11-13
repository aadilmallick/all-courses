# 44. Advanced RAG, graph retrieval, and failure diagnosis

[Previous](43-rag-hybrid-ranking.md) · [Index](../README.md) · [Next](45-agent-loops-graphs.md)

**Part:** Retrieval and agent systems. **Prerequisite:** read lessons 01–43 in order, or verify the earlier definitions used here.

## More retrieval stages need more observable boundaries

A query may require several pieces of evidence: a service's current version, that version's support policy, and a date exception. Query decomposition can retrieve each part. Query rewriting can improve recall but can also change the question. Preserve the original request and measure whether rewriting helps the actual task.

Graph retrieval represents entities and relationships explicitly. A query can follow links such as service-to-version-to-policy. Entity resolution, edge provenance, timestamps, and extraction errors become central. A graph is not automatically more factual than text; it can store incorrect or stale edges in a more structured form.

## Marginalization versus prompt concatenation

The original probabilistic RAG formulation can treat retrieved document $z$ as a latent variable, such as $p(y\mid x)=\sum_zp_\eta(z\mid x)p_\theta(y\mid x,z)$ under a specified retrieval set. Many practical systems instead concatenate passages and generate once. Both are called RAG in practice, but their mathematical objectives differ.

For two documents with retrieval probabilities $(0.7,0.3)$ and answer probabilities $(0.8,0.2)$, marginal answer probability is $0.7\cdot0.8+0.3\cdot0.2=0.62$. Selecting only the first document gives 0.8 for this toy conditional, a different model. A retriever similarity score is not automatically a calibrated document probability.

## Diagnose with intervention

Evaluate retrieval with known relevant evidence. Then give the generator oracle evidence and measure answer quality. Compare ordinary retrieval against the oracle condition. If oracle evidence fixes the answer, retrieval or context construction is implicated. If the answer remains wrong, generation or task formulation may be the larger problem.

Measure citation precision, evidence coverage, answer correctness, and unsupported-claim rate separately. A response can cite true evidence while omitting a critical exception. A system can retrieve all needed documents but truncate the crucial paragraph during context assembly.

## Temporal and multi-hop examples

For current-port questions, rank newer authoritative configuration above old discussion, but retain provenance. For a two-hop policy question, first identify the deployed version and then retrieve the applicable rule. Do not combine a version from one environment with a policy from another. Metadata filters are part of the evidence logic.

The example performs a tiny graph traversal and computes a latent-document marginal. Its graph is manually specified so the reasoning can be checked. It does not demonstrate automatic graph extraction or prove that graph retrieval beats lexical or dense retrieval on real questions.

Optional application: remove one edge and observe whether the answer becomes unavailable. A robust system should return insufficient evidence rather than inventing the missing relation. This is a useful end-to-end abstention test.

### Diagnose retrieval versus synthesis with a four-cell experiment

Evaluate ordinary retrieved evidence and oracle evidence, each with the baseline and changed generator. If both generators improve greatly under oracle context, retrieval or context assembly is a likely bottleneck. If the changed generator helps under both contexts, generation contributes independently. If only one interaction improves, inspect compatibility between evidence format and generator behavior. These observations remain empirical, but the controlled design isolates causes better than comparing two completely different pipelines whose retriever, prompt, model, and context budget all changed together.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
graph = {'service-A': [('version', 'v2')], 'v2': [('policy', 'policy-2026')],
         'policy-2026': [('port', '8443')]}
node, path = 'service-A', []
for relation in ['version', 'policy', 'port']:
    matches = [target for edge, target in graph.get(node, []) if edge == relation]
    assert len(matches) == 1
    path.append((node, relation, matches[0]))
    node = matches[0]
retrieval_probability = np.array([.7, .3])
answer_probability = np.array([.8, .2])
marginal = retrieval_probability @ answer_probability
assert np.allclose(marginal, .62)
print('evidence path', path, 'marginal answer probability', marginal)

```

### Code structure and observed intermediate values


#### Stage 2

```python
graph = {'service-A': [('version', 'v2')], 'v2': [('policy', 'policy-2026')],
         'policy-2026': [('port', '8443')]}
```

An observed state during this stage was:

- `graph`: `{'service-A': [('version', 'v2')], 'v2': [('policy', 'policy-2026')], 'policy-2026': [('port', '8443')]}`

#### Stage 3

```python
node, path = 'service-A', []
```

An observed state during this stage was:

- `node`: `'service-A'`
- `path`: `[]`

#### Stage 4

```python
for relation in ['version', 'policy', 'port']:
    matches = [target for edge, target in graph.get(node, []) if edge == relation]
    assert len(matches) == 1
    path.append((node, relation, matches[0]))
    node = matches[0]
```

An observed state during this stage was:

- `node`: `'8443'`

This is one recorded iteration state, not necessarily the final loop state. The final printed result below is authoritative for the completed run. Long loops are deliberately sampled to keep the trace readable.

#### Stage 5

```python
retrieval_probability = np.array([.7, .3])
```

An observed state during this stage was:

- `retrieval_probability`: `[0.7 0.3]`

#### Stage 6

```python
answer_probability = np.array([.8, .2])
```

An observed state during this stage was:

- `answer_probability`: `[0.8 0.2]`

#### Stage 7

```python
marginal = retrieval_probability @ answer_probability
```

An observed state during this stage was:

- `marginal`: `0.62`

#### Stage 8

```python
assert np.allclose(marginal, .62)
```

#### Stage 9

```python
print('evidence path', path, 'marginal answer probability', marginal)
```

Run from the course root:

```bash
python code/44_advanced_rag_evaluation.py
```

### Recorded output from the supplied environment

```text
evidence path [('service-A', 'version', 'v2'), ('v2', 'policy', 'policy-2026'), ('policy-2026', 'port', '8443')] marginal answer probability 0.62
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

Negative log marginal answer probability when a sigmoid retriever mixes two fixed document-conditioned answers.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=- \log{\left(\frac{1}{5} + \frac{3}{5 \left(1 + e^{- x}\right)} \right)}.$$

Its first derivative is

$$f^{(1)}(x)=- \frac{3 e^{- x}}{5 \left(\frac{1}{5} + \frac{3}{5 \left(1 + e^{- x}\right)}\right) \left(1 + e^{- x}\right)^{2}}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=\frac{3 e^{- x}}{5 \left(\frac{1}{5} + \frac{3}{5 \left(1 + e^{- x}\right)}\right) \left(1 + e^{- x}\right)^{2}} - \frac{6 e^{- 2 x}}{5 \left(\frac{1}{5} + \frac{3}{5 \left(1 + e^{- x}\right)}\right) \left(1 + e^{- x}\right)^{3}} + \frac{9 e^{- 2 x}}{25 \left(\frac{1}{5} + \frac{3}{5 \left(1 + e^{- x}\right)}\right)^{2} \left(1 + e^{- x}\right)^{4}}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 0.3 | 0.607583416 | -0.269293694 | 0.112612894 |
| 0.5 | 0.556039891 | -0.245873107 | 0.120672497 |
| 0.7 | 0.509305674 | -0.221376137 | 0.123472912 |

#### Evaluation 1: substitute $x=0.3$

$$f(0.3)=- \log{\left(\frac{1}{5} + \frac{3}{5 \left(e^{- \frac{3}{10}} + 1\right)} \right)}\approx 0.607583416.$$
At this coordinate the slope is $-0.269293694$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.112612894$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.000269293694$. The quadratic correction is $f^{(2)}(x)h^2/2\approx5.6306447e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000269237378$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0.5$

$$f(0.5)=- \log{\left(\frac{1}{5} + \frac{3}{5 \left(e^{- \frac{1}{2}} + 1\right)} \right)}\approx 0.556039891.$$
At this coordinate the slope is $-0.245873107$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.120672497$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.000245873107$. The quadratic correction is $f^{(2)}(x)h^2/2\approx6.03362487e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000245812766$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.7$

$$f(0.7)=- \log{\left(\frac{1}{5} + \frac{3}{5 \left(e^{- \frac{7}{10}} + 1\right)} \right)}\approx 0.509305674.$$
At this coordinate the slope is $-0.221376137$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.123472912$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.000221376137$. The quadratic correction is $f^{(2)}(x)h^2/2\approx6.17364562e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.0002213144$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | -0.245828601 | 4.4506e-05 |
| 0.01 | -0.2458726627 | 4.4446e-07 |
| 0.001 | -0.2458731027 | 4.4445e-09 |
| 0.0001 | -0.2458731071 | 4.3265e-11 |
| 1e-05 | -0.2458731071 | 6.0724e-12 |
| 1e-06 | -0.2458731072 | 2.1683e-11 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=- \frac{3 e^{- x}}{5 \left(\frac{1}{5} + \frac{3}{5 \left(1 + e^{- x}\right)}\right) \left(1 + e^{- x}\right)^{2}} + \frac{18 e^{- 2 x}}{5 \left(\frac{1}{5} + \frac{3}{5 \left(1 + e^{- x}\right)}\right) \left(1 + e^{- x}\right)^{3}} - \frac{18 e^{- 3 x}}{5 \left(\frac{1}{5} + \frac{3}{5 \left(1 + e^{- x}\right)}\right) \left(1 + e^{- x}\right)^{4}} - \frac{27 e^{- 2 x}}{25 \left(\frac{1}{5} + \frac{3}{5 \left(1 + e^{- x}\right)}\right)^{2} \left(1 + e^{- x}\right)^{4}} + \frac{54 e^{- 3 x}}{25 \left(\frac{1}{5} + \frac{3}{5 \left(1 + e^{- x}\right)}\right)^{2} \left(1 + e^{- x}\right)^{5}} - \frac{54 e^{- 3 x}}{125 \left(\frac{1}{5} + \frac{3}{5 \left(1 + e^{- x}\right)}\right)^{3} \left(1 + e^{- x}\right)^{6}}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 0.607583416 | 0.605214513 | 0.607627963 | 4.4547e-05 |
| -0.1 | 0.581225563 | 0.580627202 | 0.581230565 | 5.0014e-06 |
| 0.1 | 0.532059843 | 0.531452581 | 0.532055943 | 3.8999e-06 |
| 0.2 | 0.509305674 | 0.50686527 | 0.50927872 | 2.6954e-05 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: RAG](https://aman.ai/primers/RAG/)

[Previous](43-rag-hybrid-ranking.md) · [Index](../README.md) · [Next](45-agent-loops-graphs.md)
