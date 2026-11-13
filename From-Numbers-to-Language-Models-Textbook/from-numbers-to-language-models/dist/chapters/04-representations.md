# From text to representations: tokenization, embeddings, and sequence memory

## Decide what one prediction unit will be

A language model predicts tokens, but a token is not necessarily a word. It might be a character, byte, word fragment, punctuation mark, or special boundary symbol. The tokenizer decides how text becomes IDs; the model's embedding and output tables are trained for those IDs. A mismatch between tokenizer and weights is a mismatch in the meaning of every row.

We will use tiny vocabularies to make calculations inspectable. Their simplicity is a teaching choice. A four-symbol model can demonstrate shifting, probability normalization, attention, and optimization without pretending to understand ordinary language. When you later load a real model, preserve the tokenizer, normalization rules, special symbols, and serialization template as part of its configuration.

## Tokenization, byte pairs, and text boundaries

### Why words are not an adequate fixed vocabulary

A word-level vocabulary cannot enumerate every name, spelling, code identifier, or language variation. Character models have a small vocabulary but longer sequences. Subword tokenization learns reusable pieces between these extremes. The tokenizer is part of the model definition: a weight matrix trained for one vocabulary cannot be paired casually with another.

In byte-pair encoding, begin with elementary symbols and repeatedly merge a frequent adjacent pair into a new symbol. Training records an ordered merge list. Encoding applies the learned rules rather than learning new merges from the input. Our demonstration uses characters, including spaces, for readability. Production byte-level variants encode UTF-8 bytes and handle special tokens and pre-tokenization differently.

### Work through one merge

Suppose sequences include `(l,o,w)` twice and `(l,o,w,e,r)` once. Pair `(l,o)` occurs three times, as does `(o,w)`. A deterministic tie rule is needed. If `(l,o)` is selected, create symbol `lo` and replace nonoverlapping occurrences. The sequences become `(lo,w)` and `(lo,w,e,r)`. Count pairs again; the next most frequent pair may be `(lo,w)`.

A single left-to-right pass avoids merging overlapping occurrences twice. For `(a,a,a)`, replacing pair `(a,a)` produces `(aa,a)`, not two overlapping `aa` symbols. Merge order affects the vocabulary and encodings. A tokenizer must serialize this order to be reproducible.

### Tokens alter computational cost

Attention cost grows roughly with the square of sequence length for dense prefill. If a tokenizer needs twice as many tokens for the same text, the attention score work grows roughly fourfold before other factors. Vocabulary growth, however, increases embedding and output projection sizes. There is no universal smallest-cost vocabulary independent of the corpus and architecture.

Normalization can collapse distinct inputs. Lowercasing loses case; Unicode normalization may combine visually equivalent forms but must be deliberate. A reversible byte tokenizer preserves a representation of arbitrary input bytes, whereas a character scheme with an unknown symbol can lose information. Round-trip tests are therefore part of correctness.

### Boundaries matter to learning and generation

Special tokens identify roles, document boundaries, and end conditions. Their semantics depend on training, not just their printed spelling. Never infer that a model supports a chat template because strings like `[assistant]` look plausible.

The code shows actual pair counting and nonoverlapping replacement. It learns a few merges on a toy corpus and verifies that concatenating resulting symbols reconstructs the original text. This checks this simple character representation only. It does not validate a production tokenizer or its treatment of byte sequences.

Optional application: compare characters per token across prose, Python, and another language. Report both compression and vocabulary coverage. A high average compression rate can conceal poor treatment of a minority domain.

#### A segmentation ambiguity and why training order resolves it

Consider text `abc` and learned merges `(a,b)->ab` and `(b,c)->bc`. Applying the first merge yields `(ab,c)`; applying the second first yields `(a,bc)`. Both decode to the same text but produce different token IDs, lengths, and embedding lookups. An ordered merge table resolves the ambiguity. A tokenizer implementation must also define how special tokens bypass ordinary merging and how text normalization is applied. A round-trip test alone cannot distinguish these two valid decodings; compare exact IDs against a reference tokenizer when reproducing a model.


## Reconstruct the merge loop on an overlapping example

Take `aaaa` as four symbols. Adjacent pair `(a,a)` appears at three starting positions, but a nonoverlapping replacement pass can create only two `aa` symbols. Counting candidate occurrences and applying the selected merge are therefore separate operations. The implementation advances by two after a replacement so it cannot reuse the same character twice.

After a merge, recompute counts from the new token sequences. Do not retain the old pair counts as if the representation had stayed unchanged. If `(a,a)` becomes `aa`, new pairs such as `(aa,a)` can now exist. The algorithm changes the units on which subsequent statistics are computed.


### Executable calculation

Run `python examples/08_tokenization_bpe.py` from the package root. Complete source is also included as [08_tokenization_bpe.py](../examples/08_tokenization_bpe.py).

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

Recorded output on the checked Python/NumPy environment:

```text
merge ('l', 'o') count 5
merge ('lo', 'w') count 5
merge (' ', 'low') count 3
merge ('e', 'r') count 1
[['low', ' low'], ['low', 'er', ' low'], ['n', 'e', 'w', ' low']]
```


A tokenizer's reversibility and its model compatibility are different tests. Concatenating the demonstration symbols recovers the original text, which checks reversibility for this character scheme. Matching a released tokenizer requires the exact token IDs and special-token handling, not merely the same decoded text. Two valid segmentations of one string can lead a model to entirely different embedding sequences.

## The first learned table

Once token IDs are known, an embedding table gives each token a feature vector. It is tempting to think of the table as a dictionary of meanings. A more useful initial view is that it is a collection of adjustable input parameters. Those rows become representations because a task repeatedly rewards certain relationships among them.

Suppose `cat` and `dog` often occur in similar contexts. A model that shares processing across feature coordinates can benefit from representing some of their predictive behavior similarly. But the training objective determines which similarities matter. A model trained to distinguish legal document categories need not arrange all everyday semantic relationships in an intuitive picture.

## Embeddings, distributional learning, and similarity

### A lookup table becomes a representation

For vocabulary size $V$ and width $D$, an embedding table is $E\in\mathbb R^{V\times D}$. Token ID $i$ retrieves row $E_i$. Multiplying a one-hot row by $E$ gives the same result: only one term in each output coordinate survives. The integer value of the ID has no distance meaning.

Why do nearby vectors sometimes have related meanings? A learning objective rewards similar behavior in similar contexts. If two words predict similar neighbors, training can make their representations useful in similar ways. Geometry is an outcome of the objective and data. It is not a guarantee that every semantic relation becomes a straight line.

### A contrastive example

Let query $q$ and candidate vectors $d_j$ produce scores $s_j=q^\top d_j/\tau$, with temperature $\tau>0$. If candidate zero is correct, minimize $L=-\log[\exp(s_0)/\sum_j\exp(s_j)]$. From the softmax gradient,

$$\frac{\partial L}{\partial q}=\frac1\tau\left(\sum_jp_jd_j-d_0\right).$$

To derive it, differentiate each score: $\partial s_j/\partial q=d_j/\tau$. Multiply by $p_j-\mathbf1[j=0]$ and sum over candidates. Gradient descent moves the query toward the positive relative to its probability-weighted alternatives. If all candidates are identical, this gradient is zero and the task supplies no discriminating signal.

Negative examples need care. Another document in the batch may also answer the question. Treating every other document as negative then creates false-negative pressure. Batch size changes the candidate distribution and the objective, not just its estimation variance.

### Static, contextual, token, and sentence representations

A static table gives the same vector for a token every time. A contextual transformer produces a representation that depends on neighboring tokens. A sentence representation must aggregate those contextual vectors or use a specially trained pooling token. Mean pooling with padding included biases toward sequence length and padded states.

A generative model's hidden vector is not automatically a good retrieval embedding. Retrieval usually benefits from explicit similarity training and matching query/document conventions. Likewise, normalization is appropriate only if the scoring system is trained or selected for that geometry.

The experiment differentiates a contrastive query by hand. It checks the derivative numerically and checks the effect of a small update. The tiny candidates are chosen to make the geometry readable; meaningful text embeddings require a dataset and a trained encoder.

Optional application: replace the positive with an identical vector to a negative. The loss cannot reach zero by changing only the query because the tied scores remain equal. This is an identifiability limitation, not an optimizer malfunction.

#### Normalization changes the gradient too

If an encoder emits raw vector $h$ and retrieval uses $u=h/\|h\|$ for nonzero $h$, its Jacobian is $(I-uu^\top)/\|h\|$. Derive this by differentiating $h(h^\top h)^{-1/2}$ with the product rule. The resulting gradient removes the radial component, so infinitesimal learning changes direction rather than normalized length. A small raw norm amplifies this Jacobian, explaining the need to handle near-zero outputs. Simply treating normalized vectors as independent unconstrained parameters would differentiate a different system.


## Follow a contrastive update geometrically

Let the positive document vector be $(1,0)$, a negative be $(0,1)$, and the current query be $(0,0)$ with temperature one. Both scores are zero, so both probabilities are one half. The query gradient is the probability-weighted document mean minus the positive: $(0.5,0.5)-(1,0)=(-0.5,0.5)$. A descent step of size 0.1 gives query $(0.05,-0.05)$.

The positive score is now 0.05 and the negative score is -0.05. The update improved their ordering because it increased the positive relative to an alternative. This is more informative than saying only that 'similar things move closer.' The precise direction depends on the weighted alternatives, and an incorrectly labeled negative can push against a useful relationship.


### Executable calculation

Run `python examples/09_embeddings.py` from the package root. Complete source is also included as [09_embeddings.py](../examples/09_embeddings.py).

```python
import numpy as np
from core import softmax, log_softmax, finite_difference
candidates = np.array([[1., 0.], [0., 1.], [-1., 0.]])
query = np.array([0.2, 0.3])
temperature = 0.7
def objective(vector):
    return -log_softmax(vector @ candidates.T / temperature)[0]
probabilities = softmax(query @ candidates.T / temperature)
gradient = (probabilities @ candidates - candidates[0]) / temperature
assert np.allclose(gradient, finite_difference(objective, query), atol=1e-7)
updated = query - 0.1 * gradient
assert objective(updated) < objective(query)
print('before', objective(query), 'after', objective(updated))
```

Recorded output on the checked Python/NumPy environment:

```text
before 1.0000004739918806 after 0.8294490327932804
```


## One token can need several contextual meanings

A static embedding returns the same row whenever a token ID appears. Yet `bank` beside `river` and `bank` beside `loan` call for different predictions. A contextual representation starts from the same row but transforms it using the surrounding sequence. Attention will provide one mechanism for that transformation. Recurrent models provide another and help explain why direct access to saved states was valuable.

## A useful failure to recognize

A static embedding can place related words nearby while still failing a sentence task. The phrases `dog bites person` and `person bites dog` contain the same token set but express different relationships. A representation that averages only static word vectors gives the same result for both, losing order and grammatical roles. Contextual processing is needed when the task depends on those distinctions. This example motivates sequence structure without requiring us to claim that any particular contextual architecture will always recover the correct relationship.

## Recurrent networks, sequence-to-sequence, and alignment

### Understand the bottleneck attention replaced

A recurrent neural network processes $x_t$ using a state $h_t=\tanh(x_tW_x+h_{t-1}W_h+b)$. The state summarizes previous inputs. Sharing the same weights across positions permits variable-length sequences, but dependencies across time create a sequential computation path.

In a basic encoder-decoder, the encoder's final state initializes the decoder. Every source detail must influence that fixed-width state. This is a representational and optimization bottleneck, especially for long sequences. It does not mean a fixed-dimensional real vector has a simple finite information capacity in ideal mathematics; finite precision, robustness, and learning impose the practical constraint.

### Derive the long gradient path

Write $a_t=x_tW_x+h_{t-1}W_h+b$. In column-vector Jacobian notation, the derivative from $h_{t-1}$ to $h_t$ contains $W_h$ and a diagonal matrix with entries $1-\tanh^2(a_t)$. Across many steps, these Jacobians multiply. If their relevant singular values repeatedly fall below one, gradients shrink; values above one can amplify. A single eigenvalue statement is insufficient for arbitrary nonnormal, time-varying products.

Gates in LSTMs and GRUs create more controllable paths for storing and updating information. They help but do not guarantee perfect memory or remove all sequential work.

### Attention as alignment over saved states

Instead of retaining only $h_T$, keep encoder outputs $h_1,\ldots,h_T$. At decoder step $t$, let its state be $s_t$. Additive attention computes

$$e_{ti}=v^\top\tanh(W_hh_i+W_ss_t+b),\quad
\alpha_{ti}=\frac{e^{e_{ti}}}{\sum_j e^{e_{tj}}},\quad
c_t=\sum_i\alpha_{ti}h_i.$$

Each energy compares the current decoder need with one source state. Softmax normalizes the energies, and the weighted sum retrieves a context vector. The decoder can focus on a different source region at each output step. The alignment weights are learned through the final task loss; no word-alignment labels are required by this formulation.

The additive scoring network and dot-product scoring are different parameterizations. Attention itself does not require a transformer. The conceptual bridge is saved states plus a query-dependent weighted read.

### Trace the example

Our code encodes three one-dimensional observations with a tiny recurrent state, then constructs an additive attention context from the saved states. It is a forward demonstration, not a trained translator. The sum of weights should be one, and the context should lie within the convex hull of the source states. Reordering inputs changes recurrent states because the recurrence is order-sensitive.

A useful comparison is to replace the weighted context by the final state and inspect the two vectors. Their difference illustrates alternative access paths, without proving one model will train better on a specific dataset.

#### One scalar recurrence exposes vanishing and exploding paths

For linear recurrence $h_t=wh_{t-1}$ and initial state $h_0$, $h_T=w^Th_0$. The derivative with respect to $h_0$ is $w^T$. With $w=0.5,T=10$, it is $1/1024$; with $w=2$, it is 1024. This is an exact scalar demonstration of multiplicative path growth. A tanh recurrence adds factors $1-h_t^2$, each between zero and one. Matrices introduce singular directions and noncommuting products, so the scalar example is intuition for the mechanism rather than a complete spectral theorem for every recurrent network.


## Unroll a recurrent state without hiding time

At time zero, choose an initial state, often zeros in a basic demonstration. At the first token, combine its input projection with the old state projection and apply the nonlinearity. Store the result as the first new state. At the second token, repeat using that saved state. The same weight matrices appear at every time step, but the numerical state changes because the inputs and history differ.

The forward computation has a dependency chain across time. During training, gradients follow the reverse chain and add contributions to the shared weights from every use. A long input therefore presents both a representation problem—what to preserve in the state—and an optimization problem—how signals travel through many transformations.


### Executable calculation

Run `python examples/10_rnn_seq2seq.py` from the package root. Complete source is also included as [10_rnn_seq2seq.py](../examples/10_rnn_seq2seq.py).

```python
import numpy as np
from core import softmax
observations = np.array([[1.0], [0.0], [-1.0]])
state = np.zeros(2)
states = []
wx = np.array([[0.6, -0.2]])
wh = np.array([[0.5, 0.1], [-0.2, 0.4]])
for observation in observations:
    state = np.tanh(observation @ wx + state @ wh)
    states.append(state.copy())
states = np.array(states)
query = np.array([0.3, -0.1])
energies = np.tanh(states + query) @ np.array([0.7, -0.4])
weights = softmax(energies)
context = weights @ states
assert np.allclose(weights.sum(), 1)
print('states', states, 'weights', weights, 'context', context)
```

Recorded output on the checked Python/NumPy environment:

```text
states [[ 0.53704957 -0.19737532]
 [ 0.29861639 -0.02523981]
 [-0.41831167  0.21629475]] weights [0.42931608 0.36239701 0.2082869 ] context [ 0.25165286 -0.04883187]
```


## Why alignment is a change in access, not merely more parameters

An encoder-decoder without attention asks the decoder to work mainly from a compact summary. Saving all encoder states makes a richer memory available, but the decoder still needs a rule for selecting useful parts. Alignment scores compare its current need with each saved state. A normalized weighted read turns those scores into a context vector.

That access pattern is the bridge into the next chapter. We will separate the decision of where to read from the content being read, derive the resulting operation, and then derive its gradients. The companion's **Tokens and representations** experiment lets you run merge steps and inspect a small embedding lookup. Treat the displayed vectors as supplied demonstration parameters. Their relationship to text is defined by the fixture, not evidence that the browser has trained a language encoder.
