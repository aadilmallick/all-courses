# 47. Vision transformers, image patches, and CLIP

[Previous](46-llm-judges.md) · [Index](../README.md) · [Next](48-generative-vlm.md)

**Part:** Multimodal and embodied models. **Prerequisite:** read lessons 01–46 in order, or verify the earlier definitions used here.

## Images can become sequences of learned features

A vision transformer divides an image into patches, flattens each patch, projects it into model width, adds positional information, and processes the sequence. For image height $H$, width $W$, channels $C$, and square patch side $P$, a divisible image produces $N=(H/P)(W/P)$ patches, each with $P^2C$ numbers.

Flattening is a deterministic reindexing. A learned patch projection maps local pixels to features. The transformer then relates patches globally. Larger patches shorten the sequence but discard fine spatial granularity in the initial representation. Padding, interpolation, and positional handling matter for images whose dimensions differ from training.

## Contrastive image-text alignment

CLIP-style learning uses an image encoder and a text encoder. Normalize their output vectors and form scores $S_{ij}=u_i^\top v_j/\tau$. Matching image-caption pairs sit on the diagonal. A symmetric contrastive loss predicts each image's caption and each caption's image. The objective aligns modalities in a shared similarity space; it does not itself make a text generator describe arbitrary images.

For two pairs, a score matrix with large diagonal and small off-diagonal entries yields low loss. If both captions describe both images equally well, the diagonal-only target can impose false-negative pressure. Dataset ambiguity and bias remain part of the training signal.

## Zero-shot classification is prompt-conditioned retrieval

Encode candidate class descriptions such as 'a photo of a cat' and compare them with an image embedding. The selected class depends on the wording and candidate set. A softmax over these candidates is a relative score, not automatically a calibrated probability over every possible real-world object.

Spatial reasoning and counting can be hard for a global embedding. The objective rewards matching whole image-text pairs, which may not require precise binding of every object and relation. An embedding can retrieve related scenes while confusing 'left of' and 'right of.' Evaluate the relation directly.

## Trace the patch indexing

The experiment takes a four-by-four single-channel image, extracts nonoverlapping two-by-two patches with reshape and transpose, reconstructs the image, and checks exact equality. This catches the common error of flattening patches with the wrong spatial ordering. It then computes a symmetric contrastive loss from illustrative normalized vectors.

No pretrained visual model is downloaded. The vectors are constructed examples, and the loss calculation demonstrates the objective only. Actual image understanding requires trained encoders, representative data, and a suitable evaluation set.

### Patch size changes the attention term quadratically

For a $224\times224$ image and $16\times16$ patches, there are $14^2=196$ patch tokens before any class token. Using $8\times8$ patches yields $28^2=784$, four times as many tokens. Dense attention score entries then increase by roughly sixteen times, holding heads fixed. This arithmetic excludes patch projection and feed-forward costs, so it is not an end-to-end latency prediction. It does show why fine spatial resolution becomes a sequence-budget problem and why resampling or hierarchical visual encoders can be useful.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
from core import log_softmax
image = np.arange(16).reshape(4, 4, 1)
patches = image.reshape(2, 2, 2, 2, 1).transpose(0, 2, 1, 3, 4).reshape(4, 4)
restored = patches.reshape(2, 2, 2, 2, 1).transpose(0, 2, 1, 3, 4).reshape(4, 4, 1)
assert np.array_equal(restored, image)
visual = np.array([[1., 0.], [0., 1.]])
text = np.array([[.9, .1], [.2, .8]])
text /= np.linalg.norm(text, axis=1, keepdims=True)
scores = visual @ text.T / .2
loss = -(np.diag(log_softmax(scores)).mean()+np.diag(log_softmax(scores.T)).mean())/2
print('patches', patches, 'symmetric contrastive loss', loss)

```

### Code structure and observed intermediate values


#### Stage 3

```python
image = np.arange(16).reshape(4, 4, 1)
```

An observed state during this stage was:

- `image`: `[[[ 0]   [ 1]   [ 2]   [ 3]]   [[ 4]   [ 5]   [ 6]   [ 7]]   [[ 8]   [ 9]   [10]   [11]]   [[12]   [13]   [14]   [15]]]`

#### Stage 4

```python
patches = image.reshape(2, 2, 2, 2, 1).transpose(0, 2, 1, 3, 4).reshape(4, 4)
```

An observed state during this stage was:

- `patches`: `[[ 0  1  4  5]  [ 2  3  6  7]  [ 8  9 12 13]  [10 11 14 15]]`

#### Stage 5

```python
restored = patches.reshape(2, 2, 2, 2, 1).transpose(0, 2, 1, 3, 4).reshape(4, 4, 1)
```

An observed state during this stage was:

- `restored`: `[[[ 0]   [ 1]   [ 2]   [ 3]]   [[ 4]   [ 5]   [ 6]   [ 7]]   [[ 8]   [ 9]   [10]   [11]]   [[12]   [13]   [14]   [15]]]`

#### Stage 6

```python
assert np.array_equal(restored, image)
```

#### Stage 7

```python
visual = np.array([[1., 0.], [0., 1.]])
```

An observed state during this stage was:

- `visual`: `[[1. 0.]  [0. 1.]]`

#### Stage 8

```python
text = np.array([[.9, .1], [.2, .8]])
```

An observed state during this stage was:

- `text`: `[[0.9 0.1]  [0.2 0.8]]`

#### Stage 9

```python
text /= np.linalg.norm(text, axis=1, keepdims=True)
```

An observed state during this stage was:

- `text`: `[[0.99388 0.11043]  [0.24254 0.97014]]`

#### Stage 10

```python
scores = visual @ text.T / .2
```

An observed state during this stage was:

- `scores`: `[[4.96942 1.21268]  [0.55216 4.85071]]`

#### Stage 11

```python
loss = -(np.diag(log_softmax(scores)).mean()+np.diag(log_softmax(scores.T)).mean())/2
```

An observed state during this stage was:

- `loss`: `0.018636697`

#### Stage 12

```python
print('patches', patches, 'symmetric contrastive loss', loss)
```

Run from the course root:

```bash
python code/47_vision_clip.py
```

### Recorded output from the supplied environment

```text
patches [[ 0  1  4  5]
 [ 2  3  6  7]
 [ 8  9 12 13]
 [10 11 14 15]] symmetric contrastive loss 0.018636697380712153
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

One two-candidate image-text contrastive loss at temperature 0.2.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=\log{\left(1 + e^{- 5 x} \right)}.$$

Its first derivative is

$$f^{(1)}(x)=- \frac{5 e^{- 5 x}}{1 + e^{- 5 x}}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=\frac{25 e^{- 5 x}}{1 + e^{- 5 x}} - \frac{25 e^{- 10 x}}{\left(1 + e^{- 5 x}\right)^{2}}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 0.1 | 0.474076984 | -1.88770334 | 5.87509281 |
| 0.3 | 0.201413278 | -0.912127619 | 3.7286613 |
| 0.5 | 0.0788897343 | -0.3792909 | 1.75259291 |

#### Evaluation 1: substitute $x=0.1$

$$f(0.1)=\log{\left(e^{- \frac{1}{2}} + 1 \right)}\approx 0.474076984.$$
At this coordinate the slope is $-1.88770334$, so the function decreases under a sufficiently small positive perturbation. The curvature is $5.87509281$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.00188770334$. The quadratic correction is $f^{(2)}(x)h^2/2\approx2.9375464e-06$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.001884767$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0.3$

$$f(0.3)=\log{\left(e^{- \frac{3}{2}} + 1 \right)}\approx 0.201413278.$$
At this coordinate the slope is $-0.912127619$, so the function decreases under a sufficiently small positive perturbation. The curvature is $3.7286613$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.000912127619$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.86433065e-06$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000910265262$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.5$

$$f(0.5)=\log{\left(e^{- \frac{5}{2}} + 1 \right)}\approx 0.0788897343.$$
At this coordinate the slope is $-0.3792909$, so the function decreases under a sufficiently small positive perturbation. The curvature is $1.75259291$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.0003792909$. The quadratic correction is $f^{(2)}(x)h^2/2\approx8.76296457e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000378415842$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | -0.9316683824 | 0.019541 |
| 0.01 | -0.9123249542 | 0.00019734 |
| 0.001 | -0.9121295926 | 1.9735e-06 |
| 0.0001 | -0.9121276388 | 1.9735e-08 |
| 1e-05 | -0.9121276192 | 1.9881e-10 |
| 1e-06 | -0.912127619 | 3.6204e-13 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=- \frac{125 e^{- 5 x}}{1 + e^{- 5 x}} + \frac{375 e^{- 10 x}}{\left(1 + e^{- 5 x}\right)^{2}} - \frac{250 e^{- 15 x}}{\left(1 + e^{- 5 x}\right)^{3}}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 0.474076984 | 0.383838802 | 0.458412028 | 0.015665 |
| -0.1 | 0.313261688 | 0.29262604 | 0.311269346 | 0.0019923 |
| 0.1 | 0.126928011 | 0.110200516 | 0.128843823 | 0.0019158 |
| 0.2 | 0.0788897343 | 0.0189877542 | 0.0935609802 | 0.014671 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: VLM](https://aman.ai/primers/VLM/)
- [Aman.ai: embeddings](https://aman.ai/primers/embeddings/)

[Previous](46-llm-judges.md) · [Index](../README.md) · [Next](48-generative-vlm.md)
