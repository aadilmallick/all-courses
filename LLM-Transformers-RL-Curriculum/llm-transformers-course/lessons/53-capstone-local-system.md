# 53. Capstone: train, adapt, retrieve, and verify one local system

[Previous](52-generative-actions-world-models.md) · [Index](../README.md) · [Next](54-research-reproducibility.md)

**Part:** Synthesis and independent research. **Prerequisite:** read lessons 01–52 in order, or verify the earlier definitions used here.

## Integrate interfaces without confusing demonstrations with capabilities

This capstone has two real executable components: a small trainable autoregressive model and an evidence-retrieval answer path. The tiny model learns a synthetic symbol pattern. The evidence path answers a narrow port question using deterministic extraction and citations. Combining their interfaces teaches system boundaries; it does not turn a small symbol model into a general factual assistant.

Begin by running the transformer training lesson and inspecting loss reduction. Then inspect the retrieval index and the selected evidence. Finally validate a structured answer against the selected passage. Each stage has a check whose meaning is clear.

## Define the artifacts

The model artifact consists of architecture configuration and trained arrays. The data artifact records vocabulary and token sequences. The retrieval artifact records document IDs, text, timestamps, and ranking configuration. The answer artifact records the claim, evidence IDs, status, and relevant configuration versions. Keeping these separate makes a failed answer diagnosable.

For this task, the knowledge corpus has an old port note, a current port note, and an unrelated backup note. A lexical retriever should rank the current configuration highly. The deterministic answer extractor recognizes a numeric port in the selected passage. A verifier checks that the cited passage contains that number and is the intended current configuration. This is a narrow check, not a general natural-language entailment engine.

## Add adaptation as a controlled experiment

Use response-only SFT masks from lesson 26 to teach a small formatting pattern. For a larger model, compare full tuning with LoRA under a fixed held-out task set. If adding preferences, compute response log-probability sums and verify the DPO sign on a known pair before optimizing. Do not tune the generator and judge simultaneously and then claim an independent improvement measurement.

The local capstone does not claim to execute every larger-scale extension. It supplies working foundational components and a precise interface for experiments. Real model weights, training data, and compute budgets are separate choices with version and evaluation requirements.

## A failure-oriented acceptance protocol

Change the old note's port and confirm the current answer remains correct. Remove current evidence and require abstention. Insert an instruction inside a document and verify the retrieval pipeline treats it as text. Corrupt a citation ID and require validation failure. Shift target labels incorrectly and verify the model-training tests catch the mismatch.

For an actual end-to-end learned answerer, add a held-out question set and evaluate retrieval, oracle-context generation, answer support, calibration, latency, and cost separately. A single integrated success example establishes connectivity, not reliable general performance.

The executable example below performs the narrow retrieval and answer verification task. It uses no network calls or secret credentials, making it suitable for a public learning repository.

### A concrete extension path with acceptance conditions

First preserve the current deterministic retrieval baseline and its abstention behavior. Add a learned embedding retriever while keeping the corpus and held-out questions fixed; require improved evidence recall without unauthorized passages. Then add a real conditional generator and measure unsupported claims under both ordinary and oracle evidence. Only after those checks, compare full tuning, LoRA, and preference tuning on a separate response-quality set. Each stage changes one subsystem and leaves a runnable baseline. This sequence turns a broad capstone into a set of causal experiments instead of an opaque bundle of new components.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import re
corpus = [
    {'id': 'old', 'current': False, 'text': 'Old service port 443.'},
    {'id': 'current', 'current': True, 'text': 'Current service port 8443.'},
    {'id': 'backup', 'current': True, 'text': 'Backup runs daily.'},
]
query = {'current', 'service', 'port'}
def rank(document):
    words = set(re.findall(r'\w+', document['text'].lower()))
    return len(query & words)
evidence = max(corpus, key=rank)
match = re.search(r'port (\d+)', evidence['text'])
if match and evidence['current'] and rank(evidence) == len(query):
    answer = {'port': int(match.group(1)), 'citation': evidence['id'], 'status': 'answered'}
else:
    answer = {'port': None, 'citation': None, 'status': 'insufficient_evidence'}
assert answer['port'] == 8443 and answer['citation'] == 'current'
print(answer)

```

### Code structure and observed intermediate values


#### Stage 2

```python
corpus = [
    {'id': 'old', 'current': False, 'text': 'Old service port 443.'},
    {'id': 'current', 'current': True, 'text': 'Current service port 8443.'},
    {'id': 'backup', 'current': True, 'text': 'Backup runs daily.'},
]
```

An observed state during this stage was:

- `corpus`: `[{'id': 'old', 'current': False, 'text': 'Old service port 443.'}, {'id': 'current', 'current': True, 'text': 'Current service port 8443.'}, {'id': 'backup', 'current': True, 'text': 'Backup runs daily.'}]`

#### Stage 3

```python
query = {'current', 'service', 'port'}
```

An observed state during this stage was:

- `query`: `{'current', 'port', 'service'}`

#### Stage 4

```python
def rank(document):
    words = set(re.findall(r'\w+', document['text'].lower()))
    return len(query & words)
```

#### Stage 5

```python
evidence = max(corpus, key=rank)
```

An observed state during this stage was:

- `evidence`: `{'id': 'current', 'current': True, 'text': 'Current service port 8443.'}`

#### Stage 6

```python
match = re.search(r'port (\d+)', evidence['text'])
```

#### Stage 7

```python
if match and evidence['current'] and rank(evidence) == len(query):
    answer = {'port': int(match.group(1)), 'citation': evidence['id'], 'status': 'answered'}
else:
    answer = {'port': None, 'citation': None, 'status': 'insufficient_evidence'}
```

An observed state during this stage was:

- `answer`: `{'port': 8443, 'citation': 'current', 'status': 'answered'}`

#### Stage 8

```python
assert answer['port'] == 8443 and answer['citation'] == 'current'
```

#### Stage 9

```python
print(answer)
```

Run from the course root:

```bash
python code/53_capstone_local_system.py
```

### Recorded output from the supplied environment

```text
{'port': 8443, 'citation': 'current', 'status': 'answered'}
```



## A complete sequence-model alignment extension

The additional program [sequence_alignment.py](../code/sequence_alignment.py) performs supervised learning and DPO on the actual differentiable transformer. This goes beyond the categorical loss exercise: every update backpropagates through attention, normalization, feed-forward computation, and embeddings. It still uses synthetic token patterns, so the result measures implementation behavior rather than natural-language alignment quality.

Run it from the course root:

```bash
python code/sequence_alignment.py
```

### First stage: supervised autoregressive training

The vocabulary has four IDs. Two short training rows follow a cyclic pattern, with target ID equal to input ID plus one modulo four. The model starts with an ordinary negative log-likelihood objective and updates all its parameters. In the checked run, token-mean loss falls from approximately 1.4420 to 0.02573. This verifies that the full transformer can learn that pattern. Since the same tiny task is used for fitting, it is an overfitting check rather than a generalization benchmark.

### Freeze an independent reference

A second model of the same architecture receives copies of the trained arrays. Copying numerical values is essential: assigning both models the same parameter objects would let policy updates change the reference. The program records the reference response gap and checks it remains unchanged after optimization.

The chosen sequence is `(0,1,2,3,0)` and the rejected sequence is `(0,3,2,1,0)`. The initial zero is the prompt. Every subsequent token is part of the response. To compute one response log-probability, feed all but the final token as inputs, select each next token's log-softmax value, then sum. Do not average: the DPO derivation uses the sequence probability product, whose logarithm is a sum.

### Second stage: differentiate the preference objective

Let $s_w$ and $s_l$ be the policy's chosen and rejected response log-probabilities, and let $c=s_w^{\rm ref}-s_l^{\rm ref}$ be the fixed reference gap. Define $\Delta=s_w-s_l-c$ and $L=\log(1+e^{-\beta\Delta})$. Then

$$\frac{\partial L}{\partial s_w}=-\beta\sigma(-\beta\Delta),\qquad
\frac{\partial L}{\partial s_l}=\beta\sigma(-\beta\Delta).$$

The chosen and rejected sequence terms have opposite signs. Every response token contributes to its sequence sum, so each selected token log-probability receives the corresponding scalar upstream factor. Its local log-softmax derivative distributes that factor across vocabulary logits. The graph then carries it through the entire decoder. Shared parameters receive contributions from both sequence graphs and all their positions.

The reference is evaluated numerically without calling backward on it. Its gap is converted to a fixed scalar. Allowing gradients into a jointly updated reference would change the training procedure.

### Interpret the measured result narrowly

The checked run starts the preference stage at loss $\log2\approx0.6931$, because policy and reference initially agree exactly. The final recorded training loss is approximately 0.01313. The policy's chosen-minus-rejected log-probability gap increases from approximately 17.376 to 26.055, while the reference stays fixed. These are sequence log-probability differences for one pair. They do not measure factuality, human preference across tasks, or retained general capabilities.

The reference already prefers the chosen cyclic sequence strongly. DPO pushes that relative preference further. This reveals an important diagnostic: a low pairwise loss can reflect extreme confidence on a narrow pair. A useful real adaptation experiment needs diverse held-out preferences and independent task evaluation, including regressions. This program's purpose is to expose the complete gradient path and the exact quantities that change.

## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

A response-format learning loss slice; retrieval and verification remain separate deterministic components.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=- \frac{4 x}{5} + \log{\left(e^{x} + 1 \right)}.$$

Its first derivative is

$$f^{(1)}(x)=- \frac{4}{5} + \frac{e^{x}}{e^{x} + 1}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=\frac{e^{x}}{e^{x} + 1} - \frac{e^{2 x}}{\left(e^{x} + 1\right)^{2}}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| -0.2 | 0.758138869 | -0.349833997 | 0.247516573 |
| 0 | 0.693147181 | -0.3 | 0.25 |
| 0.2 | 0.638138869 | -0.250166003 | 0.247516573 |

#### Evaluation 1: substitute $x=-0.2$

$$f(-0.2)=\frac{4}{25} + \log{\left(e^{- \frac{1}{5}} + 1 \right)}\approx 0.758138869.$$
At this coordinate the slope is $-0.349833997$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.247516573$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.000349833997$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.23758286e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000349710235$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0$

$$f(0)=\log{\left(2 \right)}\approx 0.693147181.$$
At this coordinate the slope is $-0.3$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.25$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.0003$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.25e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000299875$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.2$

$$f(0.2)=- \frac{4}{25} + \log{\left(1 + e^{\frac{1}{5}} \right)}\approx 0.638138869.$$
At this coordinate the slope is $-0.250166003$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.247516573$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.000250166003$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.23758286e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000250042249$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | -0.3 | 2.2204e-16 |
| 0.01 | -0.3 | 2.2204e-16 |
| 0.001 | -0.3 | 2.2427e-14 |
| 0.0001 | -0.3 | 8.1024e-13 |
| 1e-05 | -0.3 | 8.6267e-12 |
| 1e-06 | -0.3 | 4.6884e-11 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=\frac{e^{x}}{e^{x} + 1} - \frac{3 e^{2 x}}{\left(e^{x} + 1\right)^{2}} + \frac{2 e^{3 x}}{\left(e^{x} + 1\right)^{3}}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 0.758138869 | 0.753147181 | 0.758147181 | 8.3112e-06 |
| -0.1 | 0.72439666 | 0.723147181 | 0.724397181 | 5.2049e-07 |
| 0.1 | 0.66439666 | 0.663147181 | 0.664397181 | 5.2049e-07 |
| 0.2 | 0.638138869 | 0.633147181 | 0.638147181 | 8.3112e-06 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: LLM](https://aman.ai/primers/LLM/)
- [Aman.ai: RAG](https://aman.ai/primers/RAG/)
- [Aman.ai: preference-optimization](https://aman.ai/primers/preference-optimization/)

[Previous](52-generative-actions-world-models.md) · [Index](../README.md) · [Next](54-research-reproducibility.md)
