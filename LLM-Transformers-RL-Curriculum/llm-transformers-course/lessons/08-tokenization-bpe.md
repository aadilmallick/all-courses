# 08. Tokenization, byte pairs, and text boundaries

[Previous](07-language-modeling.md) · [Index](../README.md) · [Next](09-embeddings.md)

**Part:** Language and attention. **Prerequisite:** read lessons 01–07 in order, or verify the earlier definitions used here.

## Why words are not an adequate fixed vocabulary

A word-level vocabulary cannot enumerate every name, spelling, code identifier, or language variation. Character models have a small vocabulary but longer sequences. Subword tokenization learns reusable pieces between these extremes. The tokenizer is part of the model definition: a weight matrix trained for one vocabulary cannot be paired casually with another.

In byte-pair encoding, begin with elementary symbols and repeatedly merge a frequent adjacent pair into a new symbol. Training records an ordered merge list. Encoding applies the learned rules rather than learning new merges from the input. Our demonstration uses characters, including spaces, for readability. Production byte-level variants encode UTF-8 bytes and handle special tokens and pre-tokenization differently.

## Work through one merge

Suppose sequences include `(l,o,w)` twice and `(l,o,w,e,r)` once. Pair `(l,o)` occurs three times, as does `(o,w)`. A deterministic tie rule is needed. If `(l,o)` is selected, create symbol `lo` and replace nonoverlapping occurrences. The sequences become `(lo,w)` and `(lo,w,e,r)`. Count pairs again; the next most frequent pair may be `(lo,w)`.

A single left-to-right pass avoids merging overlapping occurrences twice. For `(a,a,a)`, replacing pair `(a,a)` produces `(aa,a)`, not two overlapping `aa` symbols. Merge order affects the vocabulary and encodings. A tokenizer must serialize this order to be reproducible.

## Tokens alter computational cost

Attention cost grows roughly with the square of sequence length for dense prefill. If a tokenizer needs twice as many tokens for the same text, the attention score work grows roughly fourfold before other factors. Vocabulary growth, however, increases embedding and output projection sizes. There is no universal smallest-cost vocabulary independent of the corpus and architecture.

Normalization can collapse distinct inputs. Lowercasing loses case; Unicode normalization may combine visually equivalent forms but must be deliberate. A reversible byte tokenizer preserves a representation of arbitrary input bytes, whereas a character scheme with an unknown symbol can lose information. Round-trip tests are therefore part of correctness.

## Boundaries matter to learning and generation

Special tokens identify roles, document boundaries, and end conditions. Their semantics depend on training, not just their printed spelling. Never infer that a model supports a chat template because strings like `[assistant]` look plausible.

The code shows actual pair counting and nonoverlapping replacement. It learns a few merges on a toy corpus and verifies that concatenating resulting symbols reconstructs the original text. This checks this simple character representation only. It does not validate a production tokenizer or its treatment of byte sequences.

Optional application: compare characters per token across prose, Python, and another language. Report both compression and vocabulary coverage. A high average compression rate can conceal poor treatment of a minority domain.

### A segmentation ambiguity and why training order resolves it

Consider text `abc` and learned merges `(a,b)->ab` and `(b,c)->bc`. Applying the first merge yields `(ab,c)`; applying the second first yields `(a,bc)`. Both decode to the same text but produce different token IDs, lengths, and embedding lookups. An ordered merge table resolves the ambiguity. A tokenizer implementation must also define how special tokens bypass ordinary merging and how text normalization is applied. A round-trip test alone cannot distinguish these two valid decodings; compare exact IDs against a reference tokenizer when reproducing a model.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
from collections import Counter
corpus = [list(text) for text in ['low low', 'lower low', 'new low']]
def replace_pair(tokens, pair):
    output, position = [], 0
    while position < len(tokens):
        if tuple(tokens[position:position + 2]) == pair:
            output.append(''.join(pair))
            position += 2
        else:
            output.append(tokens[position])
            position += 1
    return output
original = [''.join(row) for row in corpus]
for _ in range(4):
    counts = Counter(pair for row in corpus for pair in zip(row, row[1:]))
    pair = sorted(counts, key=lambda p: (-counts[p], p))[0]
    corpus = [replace_pair(row, pair) for row in corpus]
    print('merge', pair, 'count', counts[pair])
assert [''.join(row) for row in corpus] == original
print(corpus)

```

### Code structure and observed intermediate values


#### Stage 2

```python
corpus = [list(text) for text in ['low low', 'lower low', 'new low']]
```

An observed state during this stage was:

- `corpus`: `[['l', 'o', 'w', ' ', 'l', 'o', 'w'], ['l', 'o', 'w', 'e', 'r', ' ', 'l', 'o', 'w'], ['n', 'e', 'w', ' ', 'l', 'o', 'w']]`

#### Stage 3

```python
def replace_pair(tokens, pair):
    output, position = [], 0
    while position < len(tokens):
        if tuple(tokens[position:position + 2]) == pair:
            output.append(''.join(pair))
            position += 2
        else:
            output.append(tokens[position])
            position += 1
    return output
```

#### Stage 4

```python
original = [''.join(row) for row in corpus]
```

An observed state during this stage was:

- `original`: `['low low', 'lower low', 'new low']`

#### Stage 5

```python
for _ in range(4):
    counts = Counter(pair for row in corpus for pair in zip(row, row[1:]))
    pair = sorted(counts, key=lambda p: (-counts[p], p))[0]
    corpus = [replace_pair(row, pair) for row in corpus]
    print('merge', pair, 'count', counts[pair])
```

An observed state during this stage was:

- `corpus`: `[['low', ' low'], ['low', 'er', ' low'], ['n', 'e', 'w', ' low']]`

This is one recorded iteration state, not necessarily the final loop state. The final printed result below is authoritative for the completed run. Long loops are deliberately sampled to keep the trace readable.

#### Stage 6

```python
assert [''.join(row) for row in corpus] == original
```

An observed state during this stage was:

- `row`: `['n', 'e', 'w', ' low']`

#### Stage 7

```python
print(corpus)
```

Run from the course root:

```bash
python code/08_tokenization_bpe.py
```

### Recorded output from the supplied environment

```text
merge ('l', 'o') count 5
merge ('lo', 'w') count 5
merge (' ', 'low') count 3
merge ('e', 'r') count 1
[['low', ' low'], ['low', 'er', ' low'], ['n', 'e', 'w', ' low']]
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

A deliberately simplified smooth tradeoff between sequence compression and vocabulary cost; real BPE is discrete.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=2 x + \left(x - 3\right)^{2}.$$

Its first derivative is

$$f^{(1)}(x)=2 x - 4.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=2.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 1.8 | 5.04 | -0.4 | 2 |
| 2 | 5 | 0 | 2 |
| 2.2 | 5.04 | 0.4 | 2 |

#### Evaluation 1: substitute $x=1.8$

$$f(1.8)=\frac{126}{25}\approx 5.04.$$
At this coordinate the slope is $-0.4$, so the function decreases under a sufficiently small positive perturbation. The curvature is $2$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.0004$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1e-06$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000399$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=2$

$$f(2)=5\approx 5.$$
At this coordinate the slope is $0$, so the function has zero first-order change under a sufficiently small positive perturbation. The curvature is $2$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1e-06$. Adding them predicts the second-order change. The actual change from direct substitution is $1e-06$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=2.2$

$$f(2.2)=\frac{126}{25}\approx 5.04.$$
At this coordinate the slope is $0.4$, so the function increases under a sufficiently small positive perturbation. The curvature is $2$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.0004$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1e-06$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000401$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | 0 | 0 |
| 0.01 | 0 | 0 |
| 0.001 | 0 | 0 |
| 0.0001 | 0 | 0 |
| 1e-05 | 0 | 0 |
| 1e-06 | 0 | 0 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=0.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 5.04 | 5 | 5.04 | 0 |
| -0.1 | 5.01 | 5 | 5.01 | 0 |
| 0.1 | 5.01 | 5 | 5.01 | 0 |
| 0.2 | 5.04 | 5 | 5.04 | 0 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: transformers](https://aman.ai/primers/transformers/)
- [Aman.ai: LLM](https://aman.ai/primers/LLM/)

[Previous](07-language-modeling.md) · [Index](../README.md) · [Next](09-embeddings.md)
