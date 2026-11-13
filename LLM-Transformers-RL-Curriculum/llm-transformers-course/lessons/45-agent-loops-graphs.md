# 45. Tools, bounded agent loops, graphs, and external state

[Previous](44-advanced-rag-evaluation.md) · [Index](../README.md) · [Next](46-llm-judges.md)

**Part:** Retrieval and agent systems. **Prerequisite:** read lessons 01–44 in order, or verify the earlier definitions used here.

## A model call is one component of a program

An agent system repeatedly observes state, proposes an action, executes a permitted tool, records the result, and decides whether to stop. The model supplies probabilistic proposals; deterministic code can validate arguments, enforce budgets, execute tools, and check outcomes. More model calls do not by themselves establish progress.

Represent a loop state with a goal, evidence, pending tasks, completed artifacts, error records, and budgets. A transition function maps state and a validated action to a new state. Termination conditions should include success, exhausted budget, repeated failure, and lack of measurable progress.

## Contracts for tools and nodes

A tool contract specifies its name, arguments, preconditions, result format, failure modes, and side effects. A graph node contract adds input/output schemas and transition rules. Control-flow edges determine which operation runs next; data-flow edges determine which evidence a node can access. These relationships need not be identical.

For a retrieval-answer-review graph, retrieval emits evidence IDs and passages; answer generation emits claims linked to IDs; review checks schema, citation validity, and task criteria. A failed review may return to answer generation with explicit defects. Limit retries and preserve the best verified result rather than overwriting it unconditionally.

## Idempotency and retries

An idempotent action can be repeated without multiplying its effect. Reading a document is naturally close to this; sending a payment is not unless the service supports an idempotency key. A timeout does not establish that a side effect failed. Retrying blindly can duplicate external actions.

Use stable task and action IDs, persist attempted actions, and reconcile ambiguous outcomes. Separate proposing an action from permission to execute it. Text found in a retrieved document should not become a new tool authority.

## Loops require an evaluator

A measurable progress variable might be failing tests remaining, required evidence collected, or unresolved schema errors. A plan becoming longer is not necessarily progress. If a candidate and its evaluator share the same blind spot, repeated self-review can reinforce an error. Independent executable checks or grounded evidence provide stronger feedback where available.

The code implements a finite retrieve-answer-verify loop using deterministic local functions and a strict step budget. It demonstrates orchestration semantics, not LLM intelligence. In a real system, only the proposal function needs to be replaced by a model interface; validation and budget enforcement should remain inspectable code.

Optional application: make the proposal function repeatedly request an unavailable document. Verify that the loop stops with an explicit incomplete result rather than spinning forever or fabricating evidence.

### An ambiguous timeout needs reconciliation

Suppose a tool creates a ticket but the network response is lost. The loop observes a timeout, not proof of failure. If it retries with a new request identity, two tickets may be created. A stable idempotency key or a lookup by the original action ID permits reconciliation. In contrast, repeating a pure local schema check is harmless. Classify tool actions by effects before designing retries. A language model's confidence that a call failed does not substitute for the service's observable state.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
state = {'evidence': {}, 'answer': None, 'steps': 0, 'status': 'running'}
store = {'doc-2': 'Current port is 8443.'}
while state['steps'] < 3 and state['status'] == 'running':
    state['steps'] += 1
    if not state['evidence']:
        state['evidence']['doc-2'] = store['doc-2']
    elif state['answer'] is None:
        state['answer'] = {'port': 8443, 'evidence_id': 'doc-2'}
    else:
        candidate = state['answer']
        valid = candidate['evidence_id'] in state['evidence'] and str(candidate['port']) in state['evidence'][candidate['evidence_id']]
        state['status'] = 'verified' if valid else 'failed'
if state['status'] == 'running':
    state['status'] = 'budget_exhausted'
assert state['status'] == 'verified'
print(state)

```

### Code structure and observed intermediate values


#### Stage 1

```python
state = {'evidence': {}, 'answer': None, 'steps': 0, 'status': 'running'}
```

An observed state during this stage was:

- `state`: `{'evidence': {}, 'answer': None, 'steps': 0, 'status': 'running'}`

#### Stage 2

```python
store = {'doc-2': 'Current port is 8443.'}
```

An observed state during this stage was:

- `store`: `{'doc-2': 'Current port is 8443.'}`

#### Stage 3

```python
while state['steps'] < 3 and state['status'] == 'running':
    state['steps'] += 1
    if not state['evidence']:
        state['evidence']['doc-2'] = store['doc-2']
    elif state['answer'] is None:
        state['answer'] = {'port': 8443, 'evidence_id': 'doc-2'}
    else:
        candidate = state['answer']
        valid = candidate['evidence_id'] in state['evidence'] and str(candidate['port']) in state['evidence'][candidate['evidence_id']]
        state['status'] = 'verified' if valid else 'failed'
```

An observed state during this stage was:

- `state`: `{'evidence': {'doc-2': 'Current port is 8443.'}, 'answer': {'port': 8443, 'evidence_id': 'doc-2'}, 'steps': 3, 'status': 'verified'}`

This is one recorded iteration state, not necessarily the final loop state. The final printed result below is authoritative for the completed run. Long loops are deliberately sampled to keep the trace readable.

#### Stage 4

```python
if state['status'] == 'running':
    state['status'] = 'budget_exhausted'
```

#### Stage 5

```python
assert state['status'] == 'verified'
```

#### Stage 6

```python
print(state)
```

Run from the course root:

```bash
python code/45_agent_loops_graphs.py
```

### Recorded output from the supplied environment

```text
{'evidence': {'doc-2': 'Current port is 8443.'}, 'answer': {'port': 8443, 'evidence_id': 'doc-2'}, 'steps': 3, 'status': 'verified'}
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

Illustrative independent retry success probability; real retries can be correlated and side-effectful.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=1 - \left(\frac{2}{5}\right)^{x}.$$

Its first derivative is

$$f^{(1)}(x)=- \left(\frac{2}{5}\right)^{x} \log{\left(\frac{2}{5} \right)}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=- \left(\frac{2}{5}\right)^{x} \log{\left(\frac{2}{5} \right)}^{2}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 1.8 | 0.807820091 | 0.17609267 | -0.161352081 |
| 2 | 0.84 | 0.146606517 | -0.134334193 |
| 2.2 | 0.866791487 | 0.122057726 | -0.111840363 |

#### Evaluation 1: substitute $x=1.8$

$$f(1.8)=- \frac{2 \cdot 2^{\frac{4}{5}} \sqrt[5]{5}}{25} + 1\approx 0.807820091.$$
At this coordinate the slope is $0.17609267$, so the function increases under a sufficiently small positive perturbation. The curvature is $-0.161352081$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.00017609267$. The quadratic correction is $f^{(2)}(x)h^2/2\approx-8.06760407e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000176012018$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=2$

$$f(2)=\frac{21}{25}\approx 0.84.$$
At this coordinate the slope is $0.146606517$, so the function increases under a sufficiently small positive perturbation. The curvature is $-0.134334193$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.000146606517$. The quadratic correction is $f^{(2)}(x)h^2/2\approx-6.71670964e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000146539371$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=2.2$

$$f(2.2)=- \frac{4 \sqrt[5]{2} \cdot 5^{\frac{4}{5}}}{125} + 1\approx 0.866791487.$$
At this coordinate the slope is $0.122057726$, so the function increases under a sufficiently small positive perturbation. The curvature is $-0.111840363$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.000122057726$. The quadratic correction is $f^{(2)}(x)h^2/2\approx-5.59201816e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000122001823$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | 0.1468117519 | 0.00020523 |
| 0.01 | 0.1466085686 | 2.0515e-06 |
| 0.001 | 0.1466065376 | 2.0515e-08 |
| 0.0001 | 0.1466065173 | 2.0516e-10 |
| 1e-05 | 0.1466065171 | 4.2105e-12 |
| 1e-06 | 0.1466065171 | 6.8917e-12 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=- \left(\frac{2}{5}\right)^{x} \log{\left(\frac{2}{5} \right)}^{3}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 0.807820091 | 0.810678697 | 0.807992013 | 0.00017192 |
| -0.1 | 0.824646684 | 0.825339348 | 0.824667677 | 2.0994e-05 |
| 0.1 | 0.854009034 | 0.854660652 | 0.853988981 | 2.0053e-05 |
| 0.2 | 0.866791487 | 0.869321303 | 0.86663462 | 0.00015687 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: loop-and-graph-engineering](https://aman.ai/primers/loop-and-graph-engineering/)
- [Aman.ai: context-engineering](https://aman.ai/primers/context-engineering/)

[Previous](44-advanced-rag-evaluation.md) · [Index](../README.md) · [Next](46-llm-judges.md)
