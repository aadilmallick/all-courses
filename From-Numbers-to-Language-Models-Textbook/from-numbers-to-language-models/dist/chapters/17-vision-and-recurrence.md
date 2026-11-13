# Beyond text: visual representations, cross-modal generation, and recurrent depth

## An image needs a representation before it can share a computation

A text tokenizer provides a sequence of symbolic IDs. An image begins as a spatial array of pixel measurements. To use transformer-style sequence processing, a vision system needs a way to turn that spatial structure into feature tokens without forgetting how those tokens relate to the image.

Patch extraction is one such transformation. It does not learn meaning by itself; it rearranges pixels and supplies them to learned projections. Spatial positions, resolution, color conventions, and cropping all affect what information reaches the model. Shape compatibility alone cannot establish that two modalities are semantically aligned.

## Vision transformers, image patches, and CLIP

### Images can become sequences of learned features

A vision transformer divides an image into patches, flattens each patch, projects it into model width, adds positional information, and processes the sequence. For image height $H$, width $W$, channels $C$, and square patch side $P$, a divisible image produces $N=(H/P)(W/P)$ patches, each with $P^2C$ numbers.

Flattening is a deterministic reindexing. A learned patch projection maps local pixels to features. The transformer then relates patches globally. Larger patches shorten the sequence but discard fine spatial granularity in the initial representation. Padding, interpolation, and positional handling matter for images whose dimensions differ from training.

### Contrastive image-text alignment

CLIP-style learning uses an image encoder and a text encoder. Normalize their output vectors and form scores $S_{ij}=u_i^\top v_j/\tau$. Matching image-caption pairs sit on the diagonal. A symmetric contrastive loss predicts each image's caption and each caption's image. The objective aligns modalities in a shared similarity space; it does not itself make a text generator describe arbitrary images.

For two pairs, a score matrix with large diagonal and small off-diagonal entries yields low loss. If both captions describe both images equally well, the diagonal-only target can impose false-negative pressure. Dataset ambiguity and bias remain part of the training signal.

### Zero-shot classification is prompt-conditioned retrieval

Encode candidate class descriptions such as 'a photo of a cat' and compare them with an image embedding. The selected class depends on the wording and candidate set. A softmax over these candidates is a relative score, not automatically a calibrated probability over every possible real-world object.

Spatial reasoning and counting can be hard for a global embedding. The objective rewards matching whole image-text pairs, which may not require precise binding of every object and relation. An embedding can retrieve related scenes while confusing 'left of' and 'right of.' Evaluate the relation directly.

### Trace the patch indexing

The experiment takes a four-by-four single-channel image, extracts nonoverlapping two-by-two patches with reshape and transpose, reconstructs the image, and checks exact equality. This catches the common error of flattening patches with the wrong spatial ordering. It then computes a symmetric contrastive loss from illustrative normalized vectors.

No pretrained visual model is downloaded. The vectors are constructed examples, and the loss calculation demonstrates the objective only. Actual image understanding requires trained encoders, representative data, and a suitable evaluation set.

#### Patch size changes the attention term quadratically

For a $224\times224$ image and $16\times16$ patches, there are $14^2=196$ patch tokens before any class token. Using $8\times8$ patches yields $28^2=784$, four times as many tokens. Dense attention score entries then increase by roughly sixteen times, holding heads fixed. This arithmetic excludes patch projection and feed-forward costs, so it is not an end-to-end latency prediction. It does show why fine spatial resolution becomes a sequence-budget problem and why resampling or hierarchical visual encoders can be useful.


## Trace patch order with labels instead of random colors

Use a four-by-four image containing integers zero through fifteen in row order. A two-by-two patch from the top left contains zero, one, four, and five. The patch to its right contains two, three, six, and seven. A reshape that groups consecutive flattened elements without the required transpose can mix rows and produce a different patch layout.

The reconstruction equality in the example is an independent way to check indexing. It does not establish visual understanding, but it catches a fundamental representation error before training. With real images, also document channel order and numerical scale. An encoder trained on normalized RGB inputs cannot be assumed to interpret arbitrary byte arrays correctly.


### Executable calculation

Run `python examples/47_vision_clip.py` from the package root. Complete source is also included as [47_vision_clip.py](../examples/47_vision_clip.py).

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

Recorded output on the checked Python/NumPy environment:

```text
patches [[ 0  1  4  5]
 [ 2  3  6  7]
 [ 8  9 12 13]
 [10 11 14 15]] symmetric contrastive loss 0.018636697380712153
```


## Alignment in a shared space differs from conditional generation

A contrastive image-text system compares separately encoded representations. A generative vision-language model uses visual information while producing token distributions. The former can support retrieval or candidate-label classification without having a decoder that describes an image. The latter needs a mechanism connecting visual features to language states.

Training determines whether that connection carries useful information. A random projection can produce exactly the right array width and still be meaningless to a pretrained language model. This is why a connector is trained under an objective rather than selected only by dimensional arithmetic.

## Generative vision-language models and cross-modal fusion

### Similarity alignment and language generation are different tasks

A contrastive model compares image and text embeddings. A generative vision-language model conditions text generation on visual information. One design maps image-encoder features through a learned projector into the language model's embedding width, then inserts those visual tokens into the context. Another uses cross-attention from language states to visual features. Resamplers can compress many visual patches into a smaller latent set.

For visual features $F\in\mathbb R^{N\times D_v}$ and projector $P\in\mathbb R^{D_v\times D}$, projected features are $Z=FP$. They have the correct width to enter a language model, but width equality does not establish semantic alignment. Training must teach the downstream model how to use them.

### Define the supervised objective

Given image $I$, question $x$, and answer tokens $y$, minimize $-\sum_t\log p_\theta(y_t\mid I,x,y_{<t})$, with a specified target mask and reduction. Early training may freeze large encoders and learn only a connector; later stages may tune more components. These choices affect memory, adaptation capacity, and retained behavior.

For a prefix-fusion causal model, visual features placed before answer tokens are visible to answer queries. Whether visual features attend bidirectionally to one another depends on the exact mask design and encoder. A generic triangular text mask is not a complete description of every multimodal architecture.

### Resolution and sequence budget

High resolution can improve small-text or fine-detail tasks but increases patch count and computation. Crops and tiling preserve detail with more tokens and require spatial metadata to maintain layout. Video adds a time axis, frame sampling, and temporal position. Audio requires a suitable representation and alignment with text or other streams.

OCR accuracy, visual grounding, counting, charts, and spatial relations test different abilities. A model that recognizes a scene may still hallucinate small text. Ask for evidence that can be localized or checked where the application needs it.

### Cross-modal gradient flow

If the image encoder is frozen, gradients may still pass through its output to train the connector or language model, but its parameters are not updated. Detaching features can save graph storage when the encoder is frozen; detaching the connector output would prevent learning the connector. Loss masking applies to answer targets, while visual inputs still influence the loss.

The example uses cross-attention from two language queries to three visual feature tokens, then projects the result to vocabulary logits. It checks rectangular shapes and probability normalization. It is a mathematical fusion demonstration using synthetic features, not an image-question answering model.

Optional application: perturb one visual feature and compare answer logits. Dependence on visual input is necessary for grounded generation but not sufficient: a trained model must depend on the right visual evidence.

#### A visual connector has a direct supervised gradient

For visual features $F$, connector $P$, projected tokens $Z=FP$, and scalar answer loss with upstream $G_Z$, the connector gradient is $F^\top G_Z$. If the visual encoder is also trainable, its feature gradient is $G_ZP^\top$. If it is frozen, retain the first gradient and omit its parameter updates; do not detach $Z$ before the language model if the connector needs training. This matrix calculation separates freezing encoder weights from breaking every gradient path out of the visual representation.


## Follow one answer-token gradient into the visual connector

Let image features form matrix $F$ and connector weights form $P$, so visual tokens are $Z=FP$. An answer loss provides upstream gradient $G_Z$. The connector gradient is $F^\top G_Z$, and feature gradient is $G_ZP^\top$. If the image encoder is frozen, do not update its parameters; the connector can still learn. If you detach the connector output before the decoder, that useful gradient path disappears.

Loss masking again has a different job. We may compute direct loss only on answer tokens while allowing visual tokens to influence those answers through attention. Excluding a direct visual-token target does not imply that the visual connector should receive no gradient.


### Executable calculation

Run `python examples/48_generative_vlm.py` from the package root. Complete source is also included as [48_generative_vlm.py](../examples/48_generative_vlm.py).

```python
import numpy as np
from core import attention, softmax
rng = np.random.default_rng(48)
visual = rng.normal(size=(3, 5))
projector = rng.normal(size=(5, 4))
visual_tokens = visual @ projector
language_query = rng.normal(size=(2, 4))
context, weights = attention(language_query, visual_tokens, visual_tokens)
output_projection = rng.normal(size=(4, 7))
probability = softmax(context @ output_projection)
assert probability.shape == (2, 7)
assert np.allclose(probability.sum(axis=-1), 1)
print('visual attention', weights, 'answer probabilities', probability)
```

Recorded output on the checked Python/NumPy environment:

```text
visual attention [[0.3290616  0.29450814 0.37643026]
 [0.12926618 0.56831846 0.30241537]] answer probabilities [[0.01426249 0.00318082 0.61410451 0.00195421 0.00192768 0.35062438
  0.01394591]
 [0.06340227 0.00445073 0.47215245 0.01355489 0.00713362 0.40067941
  0.03862664]]
```


## More input tokens and more internal steps are different resources

A high-resolution image creates more visual tokens. A recurrent-depth transformer applies additional transformations to a representation. Both can increase computation, but they address different bottlenecks. More patches can expose small details; more repeated latent updates can provide additional processing of information already present. Neither guarantees better answers on every task.

To understand repeated computation, begin with shared weights and explicit states rather than interpreting hidden updates as human-readable thoughts. The mathematical question is how a state changes under the shared map and how gradients accumulate across its uses.

## Keep compute comparisons honest across representations

An image model using four times as many patch tokens has changed its access to detail and its computational workload. A recurrent model using more internal steps has changed processing depth. If both outperform a smaller baseline, the improvement cannot automatically be attributed to one named architectural idea. Compare fixed-data and fixed-compute settings and report the actual token and step budgets.

For a visual question, also test whether the supplied pixels contain the required evidence. No amount of latent iteration can recover unreadable text from a low-resolution input without introducing assumptions. Additional compute can help process available information; it does not make absent evidence observed. This is the multimodal version of the retrieval lesson: diagnose missing information separately from insufficient processing of the information that is present.

## Recurrent depth, recursive transformers, and latent computation

### Reuse a transformation across depth

An ordinary stack applies different parameterized layers in sequence. A recurrent-depth model repeatedly applies a shared transformation: $h^{(k+1)}=F_\theta(h^{(k)},x,k)$. The input injection and depth signal are architectural choices. Reusing weights can reduce parameter count for a given number of transformation steps, but each step still costs computation.

Recurrence across depth differs from autoregression across tokens. It also differs from an outer program recursively calling a language model on subproblems. These three forms of repeated computation can be combined, but their states, gradients, and costs are different.

### Differentiate shared weights across steps

For two steps $h_1=F_\theta(h_0)$ and $h_2=F_\theta(h_1)$, the total parameter derivative of a scalar loss includes a direct contribution through step two and an indirect contribution through step one:

$$\frac{dL}{d\theta}=\frac{\partial L}{\partial h_2}\left(\frac{\partial F_\theta(h_1)}{\partial\theta}+\frac{\partial F_\theta(h_1)}{\partial h_1}\frac{\partial F_\theta(h_0)}{\partial\theta}\right).$$

The same parameter appears at multiple nodes, so reverse mode accumulates its contributions. Treating the repeated calls as independent weights would train another architecture. Truncating gradients through earlier recurrences is an approximation whose effect should be measured.

### Fixed points require conditions

If a map is a contraction on a complete space, repeated application converges to a unique fixed point. A generic transformer block is not automatically a contraction. Residual growth, normalization, nonlinearities, and learned weights can produce convergence, oscillation, or divergence. Running more recurrences than seen in training is an extrapolation experiment, not a guaranteed improvement.

Adaptive computation can decide when to stop per example or token. Such a decision requires a halting rule and training signal, plus clear accounting for remaining probability mass or compute budgets under the chosen method. Fewer parameters do not imply smaller key/value storage for every recurrent architecture; cache semantics must be specified separately.

### Latent steps are not readable reasoning by default

Extra hidden-state updates can provide useful computation without generating additional visible tokens. Their semantic interpretation needs evidence. A claim that a particular hidden update represents a proof step is stronger than observing improved accuracy with more updates. Test generalization, ablations, and matched-compute baselines.

The code checks a shared scalar parameter's derivative through four recurrent tanh updates using the course autodiff engine and finite differences. It then shows a separate contractive scalar iteration with a known stability condition. These demonstrations establish the mechanics, not that any arbitrary transformer will benefit from looping.

#### Recurrent depth has a simple stability counterexample

For scalar update $h_{k+1}=ah_k+b$, the fixed point for $a\ne1$ is $h^*=b/(1-a)$. Error obeys $h_{k+1}-h^*=a(h_k-h^*)$, so convergence for every initial state requires $|a|<1$. With $a=-0.5$, errors alternate sign while shrinking. With $a=1.1$, they grow. With $a=1,b\ne0$, no fixed point exists and the state drifts linearly. A learned recurrent transformer can have far more complicated dynamics, but this exact counterexample disproves any blanket claim that repeating a shared block must converge or improve an answer.


## Derive a shared two-step update with named intermediates

Let $u=\tanh(0.2w+0.1)$ and $v=\tanh(wu+0.1)$. For loss $L=v^2$, the derivative is $2v(1-v^2)(u+w\,du/dw)$, where $du/dw=0.2(1-u^2)$. The term $u$ is the direct dependence on the second use of $w$; the term $w\,du/dw$ is the indirect dependence through the first use. Both are needed because one parameter participates twice.

Introducing intermediate symbols makes the expanded derivative readable. It also mirrors the computation graph. If a symbolic program prints a very long expression, reconstructing these named stages is often more helpful than memorizing the expanded formula.


### Executable calculation

Run `python examples/49_recursive_transformers.py` from the package root. Complete source is also included as [49_recursive_transformers.py](../examples/49_recursive_transformers.py).

```python
import numpy as np
from core import Tensor, finite_difference
weight = Tensor([[.6]])
hidden = Tensor([[.2]])
for _ in range(4):
    hidden = (hidden @ weight+.1).tanh()
loss = (hidden ** 2).mean()
loss.backward()
def objective(values):
    state = .2
    for _ in range(4):
        state = np.tanh(state*values[0]+.1)
    return state**2
numeric = finite_difference(objective, np.array([.6]))[0]
assert np.allclose(weight.grad[0, 0], numeric, atol=1e-7)
print('shared gradient', weight.grad[0, 0], 'numerical', numeric)
```

Recorded output on the checked Python/NumPy environment:

```text
shared gradient 0.2066848751789856 numerical 0.20668487523342602
```


## Test generalization across modality and compute separately

A model that recognizes objects may still confuse spatial relations, small text, or counts. A model that improves with four recurrent steps may degrade with forty. Vary the specific demand rather than assuming one broad score establishes every capability. Match data and compute where a causal explanation depends on them.

The companion's **Vision and recurrence** experiment extracts numeric patches, calculates a tiny contrastive image-text loss, and iterates a scalar shared map under visible gain and step controls. The patch and contrastive fixtures are synthetic. The recurrence experiment reports actual states and distinguishes contraction from divergence. These are mathematical demonstrations, while the Python examples provide the corresponding code paths for further study.

The time axis introduces another representation choice in video. Frame sampling determines which events are even observed, while temporal positions determine how the selected frames are related. More visual tokens do not recover an event that was never sampled.

The final chapter closes the loop with physical actions. There, errors change the observations that arrive next, and a statistically convenient action average can be physically inappropriate. Representation, learning, planning, and feedback must be considered together.
