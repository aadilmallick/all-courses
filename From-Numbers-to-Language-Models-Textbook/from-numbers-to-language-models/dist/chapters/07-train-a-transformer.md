# A language model you can train: objectives, the decoder, and a complete run

## Choose information flow before choosing a model name

We now have enough components to build a small transformer, but first decide what information is available for the task. In classification, the whole input may be observed. In next-token generation, future target tokens are not available. In translation, the whole source is observed while the target is generated one token at a time. These are different conditional-prediction problems, and the architecture must respect their boundaries.

A familiar model family name can hide those choices. We will describe the visibility pattern, the target construction, and the output distribution explicitly. That description is useful even when a paper introduces a new acronym, because it identifies the actual computation we must implement.

## Encoders, decoders, and cross-attention objectives

### Architecture follows information availability

An encoder processes all observed input tokens with bidirectional attention. A causal decoder restricts each position to its prefix. An encoder-decoder reads a full source sequence and generates a target sequence through a causal decoder that also cross-attends to source representations. These are visibility patterns and training designs, not simply model-size categories.

BERT-style masked-token prediction corrupts selected input tokens and predicts their original identities. The model sees both left and right context. Its loss is computed on designated prediction positions. It does not directly define the same left-to-right joint distribution as a causal model. Summing masked-token scores is therefore not automatically a normalized sequence likelihood.

A causal language model minimizes next-token negative log-likelihood. A text-to-text denoising model such as T5 maps a corrupted source into a target sequence containing missing spans under a defined serialization. The corruption scheme is part of the objective and influences what the representation learns.

### Cross-attention with different lengths

Let decoder states $Y\in\mathbb R^{T_y\times D_y}$ and encoded source states $X\in\mathbb R^{T_x\times D_x}$. Set $Q=YW_Q$, $K=XW_K$, and $V=XW_V$. Then scores have shape $(T_y,T_x)$, and each target query chooses among source positions. The source and target lengths need not agree.

Source padding must be hidden from cross-attention. Causality applies to the decoder's target-side self-attention; it need not hide source positions because the source is already observed. Accidentally applying a square target causal mask to cross-attention either fails shape checks or imposes an unintended source alignment.

### A training-pair example

For translation source `red cat` and target `chat rouge <eos>`, decoder input begins with `<bos>` followed by `chat rouge`. The output targets are `chat rouge <eos>`. Cross-attention reads the same encoded source at every target step. During teacher forcing, earlier target words are correct; during inference, generated earlier words are used.

The model predicts distributions, while the tokenizer and serialization define which IDs correspond to these symbols. A real chat model adds role and message boundaries learned during instruction training. An arbitrary printable template is not guaranteed to have the same effect.

### Choose a baseline by the actual task

For classification, an encoder with a small head can be efficient. For open-ended generation, a causal decoder is a natural baseline. For constrained source-to-target transformations, encoder-decoder models can separate source processing from generation. These are useful starting hypotheses, not universal rankings.

The experiment demonstrates rectangular cross-attention and a source-padding mask. It verifies that altering the padded source value cannot alter any decoder output. This is the relevant behavioral property, beyond merely checking that the output array has the expected dimensions.

#### Compare likelihood factorizations carefully

For two target tokens, a causal model defines $p(y_1,y_2\mid x)=p(y_1\mid x)p(y_2\mid x,y_1)$. A masked encoder might separately estimate $p(y_1\mid x,y_2)$ and $p(y_2\mid x,y_1)$. Their product is not generally the causal joint, because each conditional uses information the other task lacks and no shared normalization over complete sequences is implied. This small example prevents using a masked model's pseudo-likelihood as if it were directly comparable to a decoder's normalized joint likelihood without qualification.


## Teacher forcing is a training arrangement

During training, the decoder is given the correct earlier target tokens. That permits many next-token losses to be computed in parallel under a causal mask. During generation, earlier target tokens come from the model's own decisions. A mistake can move the prefix into a region poorly represented during training. Teacher forcing is not an error; it is a well-defined likelihood-training procedure with a deployment-distribution consideration.

The rectangular cross-attention example separates target length from source length. This is worth keeping even if your main interest is decoder-only LLMs. It prevents the assumption that attention must always be a square token-by-token matrix.


### Executable calculation

Run `python examples/18_encoder_decoder_architectures.py` from the package root. Complete source is also included as [18_encoder_decoder_architectures.py](../examples/18_encoder_decoder_architectures.py).

```python
import numpy as np
from core import attention
rng = np.random.default_rng(18)
query = rng.normal(size=(2, 4))
source_key = rng.normal(size=(5, 4))
source_value = rng.normal(size=(5, 3))
allowed = np.array([[True, True, True, True, False]])
output, weights = attention(query, source_key, source_value, allowed)
changed = source_value.copy()
changed[-1] += 1000
modified, _ = attention(query, source_key, changed, allowed)
assert output.shape == (2, 3)
assert np.allclose(output, modified)
print('cross-attention weights', weights, 'output shape', output.shape)
```

Recorded output on the checked Python/NumPy environment:

```text
cross-attention weights [[0.02089186 0.41298293 0.30950774 0.25661747 0.        ]
 [0.85176918 0.03988242 0.07364383 0.03470457 0.        ]] output shape (2, 3)
```


## A complete forward pass, with every intermediate responsibility named

Our model begins with integer IDs of shape `(B,T)`. Embedding lookup changes them to floating features `(B,T,D)`. A position table adds order information. One pre-normalized decoder block creates contextual features. A final normalization and vocabulary projection turn those features into `(B,T,V)` logits. Log-softmax and target selection turn the logits into a scalar training objective.

The model's compact source is not a magical layer introduced after the mathematics. It is the composition of operations already studied. Each operation's backward rule is supplied by the same small engine used in Chapter 2. Keeping that connection visible is what makes writing the model yourself realistic rather than merely copying an architecture definition.

## Build a complete tiny GPT from tensor operations

### Assemble the pieces into one probabilistic model

The supplied `TinyGPT` in `code/core.py` is a complete differentiable causal decoder. It has token embeddings, learned absolute position embeddings, multi-head causal attention, a nonlinear feed-forward network, residual connections, normalization, and a vocabulary output projection. It is intentionally small enough to inspect. It does not implement the architecture or quality of a particular released LLM.

For IDs of shape $(B,T)$, the embedding lookup gives $(B,T,D)$. Add positions, normalize, and form projected queries, keys, and values. Split heads, calculate causal attention, merge heads, and apply the output projection. Add that result to the residual stream, apply a normalized feed-forward branch, add again, normalize once more, and project to $(B,T,V)$ logits.

### Understand the parameter graph

Every trainable array is a `Tensor` leaf. Arithmetic operations create new graph nodes that retain parent references and a local reverse rule. The parameter list contains leaves only. The model builds a new graph for every call; intermediate gradients therefore start at zero. Updating parameter data between forward and backward would invalidate the saved computation and must be avoided.

Embedding lookup uses repeated indexing. If token ID two appears four times, four upstream row gradients must add into embedding row two. The engine uses `np.add.at` because ordinary advanced-index `+=` does not reliably accumulate repeated indices as intended.

For a target at batch $b$, position $t$, select log-probability $\ell_{bt,y_{bt}}$. The mean negative of these selected values is a scalar. Calling `backward()` propagates derivatives through indexing, log-softmax, output projection, both residual branches, and the three attention projections to embeddings.

### Verify more than successful execution

A shape check should confirm output $(B,T,V)$. A causality check should alter the last input ID and verify earlier logits are unchanged. A gradient check should perturb one parameter coordinate and compare the loss change with its autodiff gradient. These are different properties; passing one does not imply the others.

The example checks all three on a tiny vocabulary. Numerical gradients are expensive because each coordinate requires two forward passes. They are practical for representative coordinates and primitive operations, not for every parameter of a large model.

### Deliberate simplifications

The model uses one block, tanh activation, no dropout, and unlearned normalization scale and shift. It trains with float64 NumPy on CPU. It has no attention cache or accelerated kernel. These simplifications preserve the central forward/backward mathematics while making the implementation inspectable.

A model can overfit a tiny pattern without learning general linguistic competence. the next section uses that limitation constructively: first prove the training pipeline can learn a simple pattern, then discuss what changes for realistic data.

#### Count the tiny model before trusting it

For vocabulary $V$, context $T$, and width $D$, our one-block model has token and position tables with $VD+TD$ parameters, four attention matrices with $4D^2$, feed-forward matrices with $8D^2$, and an untied output matrix with $DV$. Total is $2VD+TD+12D^2$. There are no learned biases or normalization affine parameters in this implementation. For $V=5,T=5,D=8$, total is $80+40+768=888$. Compare this arithmetic with the parameter arrays. A mismatch identifies an architectural misunderstanding before any training claim is made.


## Trace one target through the reverse pass

Choose one target token at one position. Its negative log-probability first creates vocabulary-logit derivatives equal to probabilities minus a one-hot target. The output matrix sends those derivatives back to hidden features. Normalization couples feature derivatives within the token. Residual additions split the upstream signal into direct and transformed branches. Attention then sends contributions to queries, keys, values, and every input token it read.

Several targets share the same weights and embedding rows. Their contributions add. In a token-mean loss, the total is divided by the number of included targets. The model does not independently train one copy of a parameter for each position. Parameter sharing is why a small implementation can generalize a learned local pattern to several positions.


### Executable calculation

Run `python examples/19_implement_gpt.py` from the package root. Complete source is also included as [19_implement_gpt.py](../examples/19_implement_gpt.py).

```python
import numpy as np
from core import TinyGPT
model = TinyGPT(vocabulary=5, width=8, heads=2, context=5)
inputs = np.array([[0, 1, 2, 3]])
targets = np.array([[1, 2, 3, 4]])
logits = model(inputs).data
assert logits.shape == (1, 4, 5)
changed = inputs.copy()
changed[0, -1] = 0
assert np.allclose(model(changed).data[:, :-1], logits[:, :-1])
loss = model.loss(inputs, targets)
loss.backward()
parameter, index = model.wq, (0, 0)
analytic = parameter.grad[index]
original, step = parameter.data[index], 1e-5
parameter.data[index] = original + step
positive = float(model.loss(inputs, targets).data)
parameter.data[index] = original - step
negative = float(model.loss(inputs, targets).data)
parameter.data[index] = original
assert np.allclose(analytic, (positive-negative)/(2*step), atol=1e-6)
print('loss', float(loss.data), 'checked gradient', analytic)
```

Recorded output on the checked Python/NumPy environment:

```text
loss 1.5986828515745766 checked gradient -0.0010531233244849207
```


## Make the first training task intentionally easy

A cyclic ID sequence gives the implementation a task whose rule we know. Failure to learn it is informative: it points to label construction, masks, gradients, optimizer coverage, or learning rate rather than to a mysterious lack of world knowledge. Success establishes those components can work together, while leaving real-language competence entirely untested.

Before optimizing, record an initial loss. During training, record the current loss and unclipped gradient norm. After training, evaluate the same loss without updating. These measurements have different roles. A displayed sample can look plausible by chance, and one noisy loss value can fluctuate. A sustained reduction on a deterministic task is a stronger integration check.

## Train, validate, checkpoint, and sample a tiny language model

### Start with an intentionally easy dataset

Before paying for a large training run, confirm that the implementation can overfit a small deterministic pattern. Our dataset repeats a short sequence of token IDs. A successful run demonstrates that the shifting, loss, gradients, and updates work together. It provides no evidence about general language ability.

Create a batch of prefixes and their one-token-shifted targets. Compute logits, negative log-likelihood, backward derivatives, global gradient norm, and an update. Reset leaf gradients afterward. The ordering matters: clearing gradients before recording a norm loses the diagnostic, and updating weights before backward differentiates a graph whose stored values no longer match.

### Follow one optimization step

With gradient $g$ and clipping threshold $c$, define $\widetilde g=g\min(1,c/(\|g\|+\epsilon))$. Update $\theta\leftarrow\theta-\eta\widetilde g$. The epsilon protects the zero-gradient case. Clipping rescales all parameters together, preserving relative gradient components. Independently clipping each coordinate is a different operation.

Our model uses ordinary gradient descent to expose this process. A production baseline usually uses AdamW with a documented learning-rate schedule, weight-decay exclusions, warmup, and mixed-precision handling. Those choices change training dynamics and need their own controlled comparison.

### Validation and checkpoints

Validation requires fixed held-out examples and no parameter updates. This model has no dropout, but frameworks with dropout must also switch to evaluation mode. A checkpoint should save parameters, architecture configuration, tokenizer, optimizer state when present, random-generator state, step number, and data-position metadata. Saving only weights permits inference but may not permit faithful continuation.

The example writes a temporary in-memory snapshot of parameter arrays, deliberately perturbs a parameter, then restores it and checks identical logits. It avoids creating a misleading checkpoint format without architecture metadata. A practical extension is an `.npz` parameter file plus a JSON manifest.

### Sampling changes the input distribution

At generation time, select a token from the last position's probability distribution, append it, and run again. Greedy selection picks the largest probability; sampling preserves diversity but can choose low-quality alternatives. Prefixes generated by the model can differ from training prefixes, so a low teacher-forced loss does not guarantee robust long generation.

The implementation crops to the learned context table and restarts absolute position indices for the cropped window. That is a defined toy behavior, not an exact reproduction of infinite-history generation or a cached full-prefix model. Keep inference semantics explicit.

The code asserts a substantial training-loss reduction without requiring one exact floating-point final value. This is a meaningful integration check. The generated IDs are shown for inspection; they are not used as a correctness oracle.

#### What a decreasing training loss actually establishes

Suppose loss falls from $\log4\approx1.386$ to 0.2 on a four-token deterministic pattern. Perplexity falls from four to $e^{0.2}\approx1.221$. That means the geometric mean probability assigned to the correct training targets is $e^{-0.2}\approx0.819$, under the stated token weighting. It does not mean 81.9 percent sequence accuracy or 81.9 percent factual correctness. A six-token all-correct sequence probability multiplies six conditional probabilities and can be much lower. Keep token-level likelihood, sampled sequence quality, and task success separate.


## Read the training loop as a sequence of state changes

The forward call constructs a graph using the current parameter values. The backward call fills leaf gradients. The optimizer measures and possibly rescales the accumulated gradient, changes parameter values, and clears their gradients. The next iteration constructs a fresh graph. Changing this order changes the computation; for example, updating a parameter before backward can make a saved forward value inconsistent with the parameter used in a reverse rule.

A checkpoint needs more than a file called `weights`. To reproduce inference, preserve vocabulary, tokenizer conventions, architecture dimensions, and parameter arrays. To resume the same optimization process, also preserve optimizer state, step number, data position, and random state under the chosen training system. Our simple example verifies parameter restoration by comparing logits directly.


### Executable calculation

Run `python examples/20_train_gpt.py` from the package root. Complete source is also included as [20_train_gpt.py](../examples/20_train_gpt.py).

```python
import numpy as np
from core import TinyGPT
model = TinyGPT(vocabulary=4, width=12, heads=2, context=6, seed=20)
inputs = np.array([[0, 1, 2, 3, 0, 1], [1, 2, 3, 0, 1, 2]])
targets = (inputs + 1) % 4
initial = float(model.loss(inputs, targets).data)
for step in range(180):
    loss = model.loss(inputs, targets)
    loss.backward()
    norm = model.step(learning_rate=0.15, max_norm=1)
final = float(model.loss(inputs, targets).data)
assert final < initial * 0.5
snapshot = [p.data.copy() for p in model.parameters()]
before = model(inputs).data.copy()
model.embedding.data += 1
for parameter, saved in zip(model.parameters(), snapshot):
    parameter.data[:] = saved
assert np.allclose(model(inputs).data, before)
print('initial', initial, 'final', final, 'sample', model.generate([0], 8, 0.5))
```

Recorded output on the checked Python/NumPy environment:

```text
initial 1.4719119592561287 final 0.007086804620041463 sample [0, 1, 2, 3, 0, 1, 2, 3, 0]
```


## From inspected code to your own implementation

Rebuild in stages. First implement a vocabulary projection on supplied hidden features and check its loss derivative. Next implement embedding lookup and repeated-ID accumulation. Add one attention head and verify causality. Split into heads only after the single-head version agrees with a reference. Add residual and feed-forward branches, checking each branch before training the full composition.

This order is slower than copying a complete model file but faster than debugging a large opaque system. Each successful check preserves a known property. When a later change breaks training, you have a smaller set of new responsibilities to inspect.

The companion's **Train a conditional language table** experiment trains a genuinely parameterized next-token model in your browser. Its conditional table is smaller than the transformer and is labeled accordingly. You can observe cross-entropy decreasing under gradient descent and compare learning rates. The complete transformer training runs in the included Python examples. The two experiments share the likelihood and optimization mathematics without pretending to share architectural capacity.

The next chapter asks what changes when inputs become long and parameter counts become large. We will count costs, distinguish exact optimizations from approximations, and make inference semantics explicit before discussing speed.
