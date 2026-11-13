# 40. Subword tokenization, embeddings, and representation geometry

[Previous](39-nlp-tasks-preprocessing.md) · [Course index](../README.md) · [Next](41-attention-derivation.md)

## Represent text before learning its function

Tokenization maps text to discrete symbols; embedding maps symbol addresses to learned vectors. These are different stages. A token ID is not a scalar semantic coordinate. ID 20 need not be twice as meaningful as ID 10. A learned embedding lookup selects a row from a matrix, and repeated occurrences contribute gradients to the same row.

BPE, WordPiece, and unigram tokenizers make different vocabulary choices. SentencePiece is a framework that can implement tokenization algorithms including unigram and BPE; it is not synonymous with one algorithm. Byte representations improve coverage but can expand sequence length for some writing systems. Compare segmentation and token budgets across languages rather than assume equal efficiency.

## Detailed tokenization and embedding laboratories
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
python code/neural/08_tokenization_bpe.py
```

### Recorded output from the supplied environment

```text
merge ('l', 'o') count 5
merge ('lo', 'w') count 5
merge (' ', 'low') count 3
merge ('e', 'r') count 1
[['low', ' low'], ['low', 'er', ' low'], ['n', 'e', 'w', ' low']]
```

## A lookup table becomes a representation

For vocabulary size $V$ and width $D$, an embedding table is $E\in\mathbb R^{V\times D}$. Token ID $i$ retrieves row $E_i$. Multiplying a one-hot row by $E$ gives the same result: only one term in each output coordinate survives. The integer value of the ID has no distance meaning.

Why do nearby vectors sometimes have related meanings? A learning objective rewards similar behavior in similar contexts. If two words predict similar neighbors, training can make their representations useful in similar ways. Geometry is an outcome of the objective and data. It is not a guarantee that every semantic relation becomes a straight line.

## A contrastive example

Let query $q$ and candidate vectors $d_j$ produce scores $s_j=q^\top d_j/\tau$, with temperature $\tau>0$. If candidate zero is correct, minimize $L=-\log[\exp(s_0)/\sum_j\exp(s_j)]$. From the softmax gradient,

$$\frac{\partial L}{\partial q}=\frac1\tau\left(\sum_jp_jd_j-d_0\right).$$

To derive it, differentiate each score: $\partial s_j/\partial q=d_j/\tau$. Multiply by $p_j-\mathbf1[j=0]$ and sum over candidates. Gradient descent moves the query toward the positive relative to its probability-weighted alternatives. If all candidates are identical, this gradient is zero and the task supplies no discriminating signal.

Negative examples need care. Another document in the batch may also answer the question. Treating every other document as negative then creates false-negative pressure. Batch size changes the candidate distribution and the objective, not just its estimation variance.

## Static, contextual, token, and sentence representations

A static table gives the same vector for a token every time. A contextual transformer produces a representation that depends on neighboring tokens. A sentence representation must aggregate those contextual vectors or use a specially trained pooling token. Mean pooling with padding included biases toward sequence length and padded states.

A generative model's hidden vector is not automatically a good retrieval embedding. Retrieval usually benefits from explicit similarity training and matching query/document conventions. Likewise, normalization is appropriate only if the scoring system is trained or selected for that geometry.

The experiment differentiates a contrastive query by hand. It checks the derivative numerically and checks the effect of a small update. The tiny candidates are chosen to make the geometry readable; meaningful text embeddings require a dataset and a trained encoder.

Optional application: replace the positive with an identical vector to a negative. The loss cannot reach zero by changing only the query because the tied scores remain equal. This is an identifiability limitation, not an optimizer malfunction.

### Normalization changes the gradient too

If an encoder emits raw vector $h$ and retrieval uses $u=h/\|h\|$ for nonzero $h$, its Jacobian is $(I-uu^\top)/\|h\|$. Derive this by differentiating $h(h^\top h)^{-1/2}$ with the product rule. The resulting gradient removes the radial component, so infinitesimal learning changes direction rather than normalized length. A small raw norm amplifies this Jacobian, explaining the need to handle near-zero outputs. Simply treating normalized vectors as independent unconstrained parameters would differentiate a different system.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

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

### Code structure and observed intermediate values


#### Stage 3

```python
candidates = np.array([[1., 0.], [0., 1.], [-1., 0.]])
```

An observed state during this stage was:

- `candidates`: `[[ 1.  0.]  [ 0.  1.]  [-1.  0.]]`

#### Stage 4

```python
query = np.array([0.2, 0.3])
```

An observed state during this stage was:

- `query`: `[0.2 0.3]`

#### Stage 5

```python
temperature = 0.7
```

An observed state during this stage was:

- `temperature`: `0.7`

#### Stage 6

```python
def objective(vector):
    return -log_softmax(vector @ candidates.T / temperature)[0]
```

#### Stage 7

```python
probabilities = softmax(query @ candidates.T / temperature)
```

An observed state during this stage was:

- `probabilities`: `[0.36788 0.42437 0.20775]`

#### Stage 8

```python
gradient = (probabilities @ candidates - candidates[0]) / temperature
```

An observed state during this stage was:

- `gradient`: `[-1.19981  0.60625]`

#### Stage 9

```python
assert np.allclose(gradient, finite_difference(objective, query), atol=1e-7)
```

#### Stage 10

```python
updated = query - 0.1 * gradient
```

An observed state during this stage was:

- `updated`: `[0.31998 0.23938]`

#### Stage 11

```python
assert objective(updated) < objective(query)
```

#### Stage 12

```python
print('before', objective(query), 'after', objective(updated))
```

Run from the course root:

```bash
python code/neural/09_embeddings.py
```

### Recorded output from the supplied environment

```text
before 1.0000004739918806 after 0.8294490327932804
```## 5.1 Tokenization establishes a vocabulary contract

A tokenizer converts raw text into a sequence of discrete units. Units may be words, subwords, characters, or bytes. A vocabulary maps those units to integer IDs. An ID is an address, not a magnitude: token seventeen is not numerically more meaningful than token three.

For a teaching example, use whitespace-separated words and a vocabulary fitted on training text. Reserve distinct IDs for padding and unknown tokens. Production tokenizers often need more careful handling of Unicode, punctuation, normalization, and subword boundaries, but the contract remains raw text to ordered IDs.

```python
import torch

training_sentences = ['small models learn', 'models need data']
vocabulary = {'<pad>': 0, '<unk>': 1}
for sentence in training_sentences:
    for token in sentence.split():
        if token not in vocabulary:
            vocabulary[token] = len(vocabulary)

def encode(sentence):
    return torch.tensor([vocabulary.get(token, 1)
                         for token in sentence.split()], dtype=torch.long)

print(vocabulary)
print(encode('small models need examples'))
```

The unseen word becomes the unknown ID. Save the exact vocabulary with the model. Rebuilding it from a different corpus can change addresses while leaving the embedding shape unchanged, producing silent corruption. The tokenizer version and special-token meanings are therefore part of the artifact, just like feature order in tabular learning.

Character tokenization avoids many unknown-word cases and makes a small language-model demonstration self-contained. It produces longer sequences and does not represent language as efficiently as a well-designed subword tokenizer. We will use characters later because their simplicity exposes the training mechanics.



## 5.3 Embeddings turn addresses into learned vectors

An embedding matrix has shape `[V, D]`, where `V` is vocabulary size and `D` is representation width. Looking up token `k` returns row `k`. A batch of token IDs `[B, T]` becomes embedded features `[B, T, D]`.

```python
import torch
from torch import nn

embedding = nn.Embedding(num_embeddings=8, embedding_dim=4, padding_idx=0)
tokens = torch.tensor([[2, 3, 4], [3, 5, 0]])
features = embedding(tokens)
print(features.shape)
print(features[1, 2])
```

The padded row is initialized to zero and is excluded from ordinary embedding-gradient updates under this contract. The other rows are learned parameters. The output vectors can change as the task supplies gradients through the selected rows.

An embedding lookup is equivalent to multiplying a one-hot token vector by an embedding matrix, but avoids constructing the sparse one-hot representation explicitly. This equivalence explains why embeddings are differentiable with respect to matrix entries while token IDs remain discrete. The model learns the representation associated with an address, not a fractional movement between integer addresses.

Distances between embeddings can reflect useful relationships, but their interpretation depends on training. A nearest neighbor in an arbitrary randomly initialized embedding is not a semantic fact. Even a trained geometry may encode task-specific or unwanted patterns rather than a complete theory of word meaning.
