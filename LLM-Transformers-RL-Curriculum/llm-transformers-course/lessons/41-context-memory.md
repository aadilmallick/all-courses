# 41. Context engineering, persistent memory, and information budgets

[Previous](40-prompting-search.md) · [Index](../README.md) · [Next](42-dense-retrieval.md)

**Part:** Retrieval and agent systems. **Prerequisite:** read lessons 01–40 in order, or verify the earlier definitions used here.

## The live context is a bounded working set

A system may have instructions, user input, conversation history, retrieved evidence, tool schemas, tool results, and saved notes. The model sees only the material actually placed into its current context. Persistent storage and live model context are different resources. A fact saved somewhere is not automatically available to the next model call.

Context engineering chooses what to include, in what form, with which provenance, and under which budget. Prompt wording is one component. The larger system also retrieves current evidence, maintains task state, and removes stale material.

## Formulate a selection problem

Suppose item $i$ costs $c_i$ tokens and has estimated utility $u_i$. A simple budget model maximizes $\sum_i u_i z_i$ subject to $\sum_i c_i z_i\le B$ and $z_i\in\{0,1\}$. This is a knapsack abstraction. Real utilities are not independent: two individually useful documents may be redundant, and a crucial exception may be valuable only alongside its rule.

Reserve space for instructions, the current request, and output before selecting evidence. Character count is not token count; a rough estimator is acceptable for a toy experiment only if labeled. Production budgeting needs the actual model tokenizer and message serialization overhead.

## Facts, state, and traces serve different purposes

A fact should carry source and time information. Task state records goals, decisions, completed work, unresolved issues, and constraints. A raw execution trace records what happened but may contain dead ends and redundant data. Summarization can shorten a trace while accidentally dropping an exception or decision boundary.

A useful checkpoint preserves exact identifiers, pending actions, authoritative evidence links, and what remains uncertain. Distinguish a user's explicit decision from a model's tentative inference. When facts conflict, retain provenance and resolve the conflict rather than silently averaging statements.

## Compression is an error-producing transformation

A summary can omit or distort information. Evaluate compression by whether downstream questions remain answerable, not just by length reduction. Test questions about dates, exceptions, and decisions are especially revealing. Keeping original sources accessible permits recovery when a summary is insufficient.

Memory retrieval also needs access controls and freshness. A relevant old note may be superseded. A cross-user memory leak is a correctness failure even if the retrieved text is semantically relevant. Treat untrusted stored text as evidence to interpret, not authority to execute instructions.

The experiment performs exact knapsack selection on a few context items using deliberately explicit illustrative token costs. It shows why selecting by utility alone can waste budget. It does not claim a universal utility estimator or implement production memory semantics.

### Greedy context selection can fail even with additive utility

Suppose budget is ten and items have cost-utility pairs $(6,12),(5,9),(5,9)$. Choosing the highest-utility item first yields utility 12 and leaves four unused cost units. Choosing the two five-cost items yields utility 18. Even a seemingly sensible greedy rule can miss the optimum. Utility-per-cost also lacks a universal exact guarantee for binary knapsack. The lesson's exhaustive search is feasible only because there are very few items; larger systems need approximations and task evaluation, especially when utilities include redundancy and dependencies.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
from itertools import product
items = [('current-policy', 6, 10), ('old-thread', 8, 6), ('schema', 3, 5), ('task-state', 4, 8)]
budget = 13
best, score = None, -1
for selection in product([0, 1], repeat=len(items)):
    cost = sum(flag*item[1] for flag, item in zip(selection, items))
    utility = sum(flag*item[2] for flag, item in zip(selection, items))
    if cost <= budget and utility > score:
        best, score = selection, utility
chosen = [item[0] for flag, item in zip(best, items) if flag]
assert sum(flag*item[1] for flag, item in zip(best, items)) <= budget
print('selected', chosen, 'illustrative utility', score)

```

### Code structure and observed intermediate values


#### Stage 2

```python
items = [('current-policy', 6, 10), ('old-thread', 8, 6), ('schema', 3, 5), ('task-state', 4, 8)]
```

An observed state during this stage was:

- `items`: `[('current-policy', 6, 10), ('old-thread', 8, 6), ('schema', 3, 5), ('task-state', 4, 8)]`

#### Stage 3

```python
budget = 13
```

An observed state during this stage was:

- `budget`: `13`

#### Stage 4

```python
best, score = None, -1
```

An observed state during this stage was:

- `best`: `None`
- `score`: `-1`

#### Stage 5

```python
for selection in product([0, 1], repeat=len(items)):
    cost = sum(flag*item[1] for flag, item in zip(selection, items))
    utility = sum(flag*item[2] for flag, item in zip(selection, items))
    if cost <= budget and utility > score:
        best, score = selection, utility
```

An observed state during this stage was:

- `selection`: `(1, 1, 1, 1)`

This is one recorded iteration state, not necessarily the final loop state. The final printed result below is authoritative for the completed run. Long loops are deliberately sampled to keep the trace readable.

#### Stage 6

```python
chosen = [item[0] for flag, item in zip(best, items) if flag]
```

#### Stage 7

```python
assert sum(flag*item[1] for flag, item in zip(best, items)) <= budget
```

#### Stage 8

```python
print('selected', chosen, 'illustrative utility', score)
```

Run from the course root:

```bash
python code/41_context_memory.py
```

### Recorded output from the supplied environment

```text
selected ['current-policy', 'schema', 'task-state'] illustrative utility 23
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

A smooth illustrative utility-versus-context-cost curve; actual item selection is discrete.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=- \frac{x}{5} + 10 - 10 e^{- \frac{x}{5}}.$$

Its first derivative is

$$f^{(1)}(x)=- \frac{1}{5} + 2 e^{- \frac{x}{5}}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=- \frac{2 e^{- \frac{x}{5}}}{5}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 3.8 | 4.56333573 | 0.735332854 | -0.187066571 |
| 4 | 4.70671036 | 0.698657928 | -0.179731586 |
| 4.2 | 4.84289477 | 0.663421047 | -0.172684209 |

#### Evaluation 1: substitute $x=3.8$

$$f(3.8)=\frac{231}{25} - \frac{10}{e^{\frac{19}{25}}}\approx 4.56333573.$$
At this coordinate the slope is $0.735332854$, so the function increases under a sufficiently small positive perturbation. The curvature is $-0.187066571$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.000735332854$. The quadratic correction is $f^{(2)}(x)h^2/2\approx-9.35332854e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000735239327$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=4$

$$f(4)=\frac{46}{5} - \frac{10}{e^{\frac{4}{5}}}\approx 4.70671036.$$
At this coordinate the slope is $0.698657928$, so the function increases under a sufficiently small positive perturbation. The curvature is $-0.179731586$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.000698657928$. The quadratic correction is $f^{(2)}(x)h^2/2\approx-8.98657928e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000698568068$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=4.2$

$$f(4.2)=\frac{229}{25} - \frac{10}{e^{\frac{21}{25}}}\approx 4.84289477.$$
At this coordinate the slope is $0.663421047$, so the function increases under a sufficiently small positive perturbation. The curvature is $-0.172684209$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.000663421047$. The quadratic correction is $f^{(2)}(x)h^2/2\approx-8.63421047e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000663334711$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | 0.69871784 | 5.9912e-05 |
| 0.01 | 0.6986585273 | 5.9911e-07 |
| 0.001 | 0.6986579342 | 5.9907e-09 |
| 0.0001 | 0.6986579283 | 5.8602e-11 |
| 1e-05 | 0.6986579283 | 7.6365e-11 |
| 1e-06 | 0.6986579284 | 1.6518e-10 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=\frac{2 e^{- \frac{x}{5}}}{25}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 4.56333573 | 4.56697877 | 4.56338414 | 4.8412e-05 |
| -0.1 | 4.63593989 | 4.63684457 | 4.63594591 | 6.0211e-06 |
| 0.1 | 4.77568345 | 4.77657615 | 4.77567749 | 5.9612e-06 |
| 0.2 | 4.84289477 | 4.84644194 | 4.84284731 | 4.7453e-05 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: context-engineering](https://aman.ai/primers/context-engineering/)

[Previous](40-prompting-search.md) · [Index](../README.md) · [Next](42-dense-retrieval.md)
