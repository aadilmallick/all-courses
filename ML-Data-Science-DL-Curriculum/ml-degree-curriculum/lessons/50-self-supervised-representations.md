# 50. Self supervised, contrastive, and multimodal representation learning

[Previous](49-graphs-knowledge-gnn.md) · [Course index](../README.md) · [Next](51-vae-gan.md)

## Supervision can come from the data

Supervised learning uses externally supplied targets. Self-supervised learning constructs a target from observed structure, such as a masked token, an augmented view, or a future segment. Unsupervised learning describes a broader setting without externally supplied outcome labels. These terms overlap by convention, so name the exact objective rather than treat the categories as mutually exclusive mathematical laws.

For normalized anchor $u_i$, paired positive $v_i$, and comparison vectors $v_j$, an InfoNCE-style loss is

$$\ell_i=-\log\frac{\exp(u_i^\top v_i/\tau)}{\sum_j\exp(u_i^\top v_j/\tau)}.$$

This is cross entropy on pair identity. Differentiating with respect to unnormalized score $s_{ij}=u_i^\top v_j$ gives $(p_{ij}-\mathbf1[j=i])/\tau$. Lower temperature sharpens the distribution and scales gradients, but also increases numerical sensitivity. A false negative can push apart two examples that should be related.

Augmentations state invariance assumptions. Two crops may preserve object identity but remove the feature relevant to another task. A representation useful for one objective can discard information another task needs. Evaluate transfer and subgroup behavior rather than infer universal semantic understanding from low contrastive training loss.

## Multimodal geometry and worked code
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
python code/neural/47_vision_clip.py
```

### Recorded output from the supplied environment

```text
patches [[ 0  1  4  5]
 [ 2  3  6  7]
 [ 8  9 12 13]
 [10 11 14 15]] symmetric contrastive loss 0.018636697380712153
```## 6.18 Contrastive learning builds representations through comparisons

A supervised classifier receives a target class. A contrastive objective instead defines which representations should be similar and which should be distinguishable. For example, two permitted augmentations of the same observation can form a positive pair. Other observations in a batch can provide negative comparisons under a particular method.

Normalize representation vectors to separate direction from magnitude, compute pairwise dot-product similarities, divide by a positive temperature, and use a classification-style objective to identify the matching partner. The temperature controls how concentrated the comparison distribution is and changes gradient behavior.

```python
import torch
from torch.nn import functional as F

first = F.normalize(torch.randn(4, 8, requires_grad=True), dim=-1)
second = F.normalize(torch.randn(4, 8, requires_grad=True), dim=-1)
scores = first @ second.T / 0.2
matching_indices = torch.arange(4)
loss = 0.5 * (F.cross_entropy(scores, matching_indices)
              + F.cross_entropy(scores.T, matching_indices))
loss.backward()
print(loss.item())
```

This complete calculation demonstrates a symmetric paired objective on synthetic representations. It does not define an image augmentation policy, encoder, or full training experiment. The diagonal correspondence supplies supervision: row `i` should match column `i`. A real application must justify why those pairs share the intended information.

False negatives arise when two different observations should actually be similar but the objective treats them as competitors. A representation can also learn augmentation artifacts rather than semantic structure. Evaluate on downstream tasks and controlled retrieval cases instead of assuming that a lower contrastive loss guarantees a universally useful embedding.
