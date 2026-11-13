# 40. Prompting, structured output, search, and test-time computation

[Previous](39-grpo-verifiable-rewards.md) · [Index](../README.md) · [Next](41-context-memory.md)

**Part:** Retrieval and agent systems. **Prerequisite:** read lessons 01–39 in order, or verify the earlier definitions used here.

## A prompt is a conditioning interface

A prompt selects a conditional distribution of a fixed model. It can specify a task, input, examples, constraints, and output format. It does not update weights by ordinary use. Clear instructions reduce ambiguity, but a well-written instruction cannot supply missing facts or guarantee that the model follows every constraint.

A useful prompt contract states the goal, the evidence available, what to do when evidence is insufficient, the output schema, and the checks that will judge the result. Few-shot examples demonstrate desired behavior; they also consume context and may bias style or labels. Keep examples representative and separate from evaluation cases.

## Structured output needs validation

JSON syntax is weaker than semantic correctness. A parser can establish valid JSON; a schema can establish required fields and types; application checks can establish constraints such as a cited document ID existing in the retrieved set. None alone proves the answer is true.

For an evidence answer, request `answer`, `evidence_ids`, and `status` fields. Validate types, check every ID against supplied evidence, and allow `insufficient_evidence`. Treat retrieved text as data rather than instructions. These boundaries are part of reliable software behavior, not merely wording preferences.

## Decomposition and search spend additional compute

Task decomposition can break a large problem into smaller verifiable outputs. Self-consistency samples multiple candidates and aggregates answers. Tree or graph search explores alternative partial solutions and uses a scoring or verification rule. Their value depends on candidate diversity and evaluator reliability. Repeating the same error many times does not create independent evidence.

If each independent candidate succeeds with probability $p$, the probability of at least one success among $n$ is $1-(1-p)^n$. This is a pass-at-least-one calculation, not the probability that a selector chooses the correct candidate. Correlated samples and imperfect selection weaken the simple benefit.

Generated explanations may help solve a task, but a plausible explanation is not guaranteed to describe the computation that caused the answer. Evaluate final correctness and inspectable intermediate artifacts. Avoid treating verbose reasoning as a substitute for an external check.

## Keep prompt experiments controlled

Hold model version, decoding settings, tool access, context budget, and test examples fixed when comparing prompts. Record cost and latency as well as quality. A prompt optimized on twenty examples may overfit their phrasing; reserve a separate test set.

The code validates a structured answer against an evidence ID set and computes the independent-candidate success formula. It performs no model API call. This explicit boundary keeps the exercise runnable and prevents a deterministic mock from being mistaken for measured LLM behavior.

### A selector can erase the benefit of more samples

For two independent candidates with correctness probability $p$, at least one is correct with probability $1-(1-p)^2$. If a selector chooses uniformly at random without using correctness information, its chosen answer is still correct with probability $p$, not the larger at-least-one probability. A perfect verifier could realize the larger value, while an imperfect verifier realizes something between or even worse depending on its bias. This simple counterexample separates generation diversity from selection quality and explains why test-time search needs a measured evaluator.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import json
payload = '{"answer":"The service uses 8443.","evidence_ids":["doc-2"],"status":"answered"}'
answer = json.loads(payload)
evidence = {'doc-1', 'doc-2'}
assert set(answer) == {'answer', 'evidence_ids', 'status'}
assert isinstance(answer['answer'], str)
assert isinstance(answer['evidence_ids'], list)
assert all(isinstance(item, str) and item in evidence for item in answer['evidence_ids'])
assert answer['status'] in {'answered', 'insufficient_evidence'}
probability, samples = .3, 5
print('validated answer', answer)
print('independent at-least-one success', 1-(1-probability)**samples)

```

### Code structure and observed intermediate values


#### Stage 2

```python
payload = '{"answer":"The service uses 8443.","evidence_ids":["doc-2"],"status":"answered"}'
```

An observed state during this stage was:

- `payload`: `'{"answer":"The service uses 8443.","evidence_ids":["doc-2"],"status":"answered"}'`

#### Stage 3

```python
answer = json.loads(payload)
```

An observed state during this stage was:

- `answer`: `{'answer': 'The service uses 8443.', 'evidence_ids': ['doc-2'], 'status': 'answered'}`

#### Stage 4

```python
evidence = {'doc-1', 'doc-2'}
```

An observed state during this stage was:

- `evidence`: `{'doc-1', 'doc-2'}`

#### Stage 5

```python
assert set(answer) == {'answer', 'evidence_ids', 'status'}
```

#### Stage 6

```python
assert isinstance(answer['answer'], str)
```

#### Stage 7

```python
assert isinstance(answer['evidence_ids'], list)
```

#### Stage 8

```python
assert all(isinstance(item, str) and item in evidence for item in answer['evidence_ids'])
```

#### Stage 9

```python
assert answer['status'] in {'answered', 'insufficient_evidence'}
```

#### Stage 10

```python
probability, samples = .3, 5
```

An observed state during this stage was:

- `probability`: `0.3`
- `samples`: `5`

#### Stage 11

```python
print('validated answer', answer)
```

#### Stage 12

```python
print('independent at-least-one success', 1-(1-probability)**samples)
```

Run from the course root:

```bash
python code/40_prompting_search.py
```

### Recorded output from the supplied environment

```text
validated answer {'answer': 'The service uses 8443.', 'evidence_ids': ['doc-2'], 'status': 'answered'}
independent at-least-one success 0.8319300000000001
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

Independent-candidate at-least-one success probability, extended continuously only for sensitivity analysis.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=1 - \left(\frac{7}{10}\right)^{x}.$$

Its first derivative is

$$f^{(1)}(x)=- \left(\frac{7}{10}\right)^{x} \log{\left(\frac{7}{10} \right)}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=- \left(\frac{7}{10}\right)^{x} \log{\left(\frac{7}{10} \right)}^{2}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 2.8 | 0.631638263 | 0.131385402 | -0.0468618808 |
| 3 | 0.657 | 0.122339506 | -0.0436354364 |
| 3.2 | 0.680615579 | 0.11391642 | -0.0406311329 |

#### Evaluation 1: substitute $x=2.8$

$$f(2.8)=- \frac{49 \sqrt[5]{10} \cdot 7^{\frac{4}{5}}}{1000} + 1\approx 0.631638263.$$
At this coordinate the slope is $0.131385402$, so the function increases under a sufficiently small positive perturbation. The curvature is $-0.0468618808$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.000131385402$. The quadratic correction is $f^{(2)}(x)h^2/2\approx-2.34309404e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000131361974$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=3$

$$f(3)=\frac{657}{1000}\approx 0.657.$$
At this coordinate the slope is $0.122339506$, so the function increases under a sufficiently small positive perturbation. The curvature is $-0.0436354364$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.000122339506$. The quadratic correction is $f^{(2)}(x)h^2/2\approx-2.18177182e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000122317691$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=3.2$

$$f(3.2)=- \frac{343 \cdot 10^{\frac{4}{5}} \sqrt[5]{7}}{10000} + 1\approx 0.680615579.$$
At this coordinate the slope is $0.11391642$, so the function increases under a sufficiently small positive perturbation. The curvature is $-0.0406311329$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.00011391642$. The quadratic correction is $f^{(2)}(x)h^2/2\approx-2.03155664e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000113896107$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | 0.1223654469 | 2.5941e-05 |
| 0.01 | 0.1223397652 | 2.5939e-07 |
| 0.001 | 0.1223395084 | 2.5939e-09 |
| 0.0001 | 0.1223395058 | 2.6002e-11 |
| 1e-05 | 0.1223395058 | 4.9073e-12 |
| 1e-06 | 0.1223395058 | 3.2663e-11 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=- \left(\frac{7}{10}\right)^{x} \log{\left(\frac{7}{10} \right)}^{3}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 0.631638263 | 0.632532099 | 0.63165939 | 2.1127e-05 |
| -0.1 | 0.644545255 | 0.644766049 | 0.644547872 | 2.6172e-06 |
| 0.1 | 0.669018344 | 0.669233951 | 0.669015773 | 2.571e-06 |
| 0.2 | 0.680615579 | 0.681467901 | 0.680595192 | 2.0387e-05 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: prompt-engineering](https://aman.ai/primers/prompt-engineering/)

[Previous](39-grpo-verifiable-rewards.md) · [Index](../README.md) · [Next](41-context-memory.md)
