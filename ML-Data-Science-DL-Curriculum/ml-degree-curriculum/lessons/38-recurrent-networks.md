# 38. Recurrent networks, LSTMs, GRUs, and packed sequences

[Previous](37-convolutional-networks.md) · [Course index](../README.md) · [Next](39-nlp-tasks-preprocessing.md)

## Reuse a state update across time

A simple RNN computes $h_t=\tanh(W_xx_t+W_hh_{t-1}+b)$ and an output from $h_t$. Sharing parameters across positions supports variable-length sequences. Backpropagation through time is ordinary differentiation on the unrolled finite computation graph. A finite training sequence is unrolled for its actual length; it does not require an infinite graph.

The hidden-state derivative contains products of $W_h$ and activation Jacobians over time. Repeated contraction can erase gradients and repeated expansion can amplify them. Gradient clipping bounds update contributions but does not reconstruct information already lost through severe contraction.

LSTM introduces a cell state: $c_t=f_t\odot c_{t-1}+i_t\odot g_t$, $h_t=o_t\odot\tanh(c_t)$. Forget, input, and output gates use sigmoids; the candidate usually uses tanh. The additive cell path can preserve information when forget gates are near one. Gates depend on parameters and prior state, so a full derivative contains more terms than simply multiplying forget values.

One common GRU convention uses reset $r_t$, update $z_t$, candidate $\widetilde h_t$, and $h_t=(1-z_t)\odot\widetilde h_t+z_t\odot h_{t-1}$. Other sources swap the update convention or place the reset in a different algebraic position. Read the library's exact equations before transferring weights or manual derivations.

## Sequence implementations and packed data
## Understand the bottleneck attention replaced

A recurrent neural network processes $x_t$ using a state $h_t=\tanh(x_tW_x+h_{t-1}W_h+b)$. The state summarizes previous inputs. Sharing the same weights across positions permits variable-length sequences, but dependencies across time create a sequential computation path.

In a basic encoder-decoder, the encoder's final state initializes the decoder. Every source detail must influence that fixed-width state. This is a representational and optimization bottleneck, especially for long sequences. It does not mean a fixed-dimensional real vector has a simple finite information capacity in ideal mathematics; finite precision, robustness, and learning impose the practical constraint.

## Derive the long gradient path

Write $a_t=x_tW_x+h_{t-1}W_h+b$. In column-vector Jacobian notation, the derivative from $h_{t-1}$ to $h_t$ contains $W_h$ and a diagonal matrix with entries $1-\tanh^2(a_t)$. Across many steps, these Jacobians multiply. If their relevant singular values repeatedly fall below one, gradients shrink; values above one can amplify. A single eigenvalue statement is insufficient for arbitrary nonnormal, time-varying products.

Gates in LSTMs and GRUs create more controllable paths for storing and updating information. They help but do not guarantee perfect memory or remove all sequential work.

## Attention as alignment over saved states

Instead of retaining only $h_T$, keep encoder outputs $h_1,\ldots,h_T$. At decoder step $t$, let its state be $s_t$. Additive attention computes

$$e_{ti}=v^\top\tanh(W_hh_i+W_ss_t+b),\quad
\alpha_{ti}=\frac{e^{e_{ti}}}{\sum_j e^{e_{tj}}},\quad
c_t=\sum_i\alpha_{ti}h_i.$$

Each energy compares the current decoder need with one source state. Softmax normalizes the energies, and the weighted sum retrieves a context vector. The decoder can focus on a different source region at each output step. The alignment weights are learned through the final task loss; no word-alignment labels are required by this formulation.

The additive scoring network and dot-product scoring are different parameterizations. Attention itself does not require a transformer. The conceptual bridge is saved states plus a query-dependent weighted read.

## Trace the example

Our code encodes three one-dimensional observations with a tiny recurrent state, then constructs an additive attention context from the saved states. It is a forward demonstration, not a trained translator. The sum of weights should be one, and the context should lie within the convex hull of the source states. Reordering inputs changes recurrent states because the recurrence is order-sensitive.

A useful comparison is to replace the weighted context by the final state and inspect the two vectors. Their difference illustrates alternative access paths, without proving one model will train better on a specific dataset.

### One scalar recurrence exposes vanishing and exploding paths

For linear recurrence $h_t=wh_{t-1}$ and initial state $h_0$, $h_T=w^Th_0$. The derivative with respect to $h_0$ is $w^T$. With $w=0.5,T=10$, it is $1/1024$; with $w=2$, it is 1024. This is an exact scalar demonstration of multiplicative path growth. A tanh recurrence adds factors $1-h_t^2$, each between zero and one. Matrices introduce singular directions and noncommuting products, so the scalar example is intuition for the mechanism rather than a complete spectral theorem for every recurrent network.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

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

### Code structure and observed intermediate values


#### Stage 3

```python
observations = np.array([[1.0], [0.0], [-1.0]])
```

An observed state during this stage was:

- `observations`: `[[ 1.]  [ 0.]  [-1.]]`

#### Stage 4

```python
state = np.zeros(2)
```

An observed state during this stage was:

- `state`: `[0. 0.]`

#### Stage 5

```python
states = []
```

An observed state during this stage was:

- `states`: `[]`

#### Stage 6

```python
wx = np.array([[0.6, -0.2]])
```

An observed state during this stage was:

- `wx`: `[[ 0.6 -0.2]]`

#### Stage 7

```python
wh = np.array([[0.5, 0.1], [-0.2, 0.4]])
```

An observed state during this stage was:

- `wh`: `[[ 0.5  0.1]  [-0.2  0.4]]`

#### Stage 8

```python
for observation in observations:
    state = np.tanh(observation @ wx + state @ wh)
    states.append(state.copy())
```

An observed state during this stage was:

- `states`: `[array([ 0.53704957, -0.19737532]), array([ 0.29861639, -0.02523981]), array([-0.41831167,  0.21629475])]`

This is one recorded iteration state, not necessarily the final loop state. The final printed result below is authoritative for the completed run. Long loops are deliberately sampled to keep the trace readable.

#### Stage 9

```python
states = np.array(states)
```

An observed state during this stage was:

- `states`: `[[ 0.53705 -0.19738]  [ 0.29862 -0.02524]  [-0.41831  0.21629]]`

#### Stage 10

```python
query = np.array([0.3, -0.1])
```

An observed state during this stage was:

- `query`: `[ 0.3 -0.1]`

#### Stage 11

```python
energies = np.tanh(states + query) @ np.array([0.7, -0.4])
```

An observed state during this stage was:

- `energies`: `[ 0.59453  0.42508 -0.12874]`

#### Stage 12

```python
weights = softmax(energies)
```

An observed state during this stage was:

- `weights`: `[0.42932 0.3624  0.20829]`

#### Stage 13

```python
context = weights @ states
```

An observed state during this stage was:

- `context`: `[ 0.25165 -0.04883]`

#### Stage 14

```python
assert np.allclose(weights.sum(), 1)
```

#### Stage 15

```python
print('states', states, 'weights', weights, 'context', context)
```

Run from the course root:

```bash
python code/neural/10_rnn_seq2seq.py
```

### Recorded output from the supplied environment

```text
states [[ 0.53704957 -0.19737532]
 [ 0.29861639 -0.02523981]
 [-0.41831167  0.21629475]] weights [0.42931608 0.36239701 0.2082869 ] context [ 0.25165286 -0.04883187]
```## 5.2 Padding makes a rectangular batch

A tensor batch needs rectangular dimensions, while sentences have different lengths. Padding fills unused positions with a reserved ID. Keep the true lengths or an explicit validity mask so downstream calculations distinguish content from filler.

```python
import torch
from torch.nn.utils.rnn import pad_sequence

sequences = [torch.tensor([2, 3, 4]), torch.tensor([3, 5])]
lengths = torch.tensor([len(sequence) for sequence in sequences])
padded = pad_sequence(sequences, batch_first=True, padding_value=0)
valid = torch.arange(padded.shape[1]).unsqueeze(0) < lengths.unsqueeze(1)
print(padded)
print(valid)
```

The padded tensor has shape `[2, 3]`. The final position in the second row is invalid. The mask is Boolean and has the same token-position shape. A zero embedding for padding does not automatically stop a recurrent model from changing hidden state or an attention model from attending to padding. Mask each mechanism that needs exclusion.

A custom collation function can perform this padding for every batch. Padding to each batch's longest sequence wastes less work than padding every example to a global maximum. Bucketing similar lengths can reduce waste further, but preserve adequate randomization and avoid letting length grouping distort evaluation.

Very long sequences may need truncation or chunking. Either choice changes available context. If the label depends on a discarded portion, truncation introduces an information problem rather than merely a performance optimization. Define what the model is expected to infer from the retained input.



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



## 5.4 A masked average is a useful sequence baseline

Before introducing recurrence or attention, average valid token embeddings and classify the resulting vector. This loses order but gives a simple baseline. It also makes padding arithmetic visible.

```python
import torch
from torch import nn

class MeanClassifier(nn.Module):
    def __init__(self, vocabulary_size, width, classes):
        super().__init__()
        self.embedding = nn.Embedding(vocabulary_size, width, padding_idx=0)
        self.head = nn.Linear(width, classes)
    def forward(self, tokens):
        valid = tokens.ne(0)
        if not valid.any(dim=1).all():
            raise ValueError('Empty sequence is not supported')
        features = self.embedding(tokens)
        summed = (features * valid.unsqueeze(-1)).sum(dim=1)
        averaged = summed / valid.sum(dim=1, keepdim=True)
        return self.head(averaged)

model = MeanClassifier(10, 8, 2)
print(model(torch.tensor([[2, 3, 4], [5, 6, 0]])).shape)
```

The singleton feature axis on the mask permits broadcasting over embedding dimensions. The denominator counts valid tokens in each example. If we averaged across padded width instead, shorter sequences would have systematically smaller representations. That would introduce an unintended dependence on how the batch happened to be padded.

Order-insensitive models can work surprisingly well when the task depends mostly on word presence. They fail on distinctions such as “dog bites person” versus “person bites dog.” A baseline is useful precisely because its limitations are clear and its performance tells us how much additional sequence structure the dataset demands.



## 5.5 Recurrent networks update a state over time

A simple recurrent network computes a hidden state from the current input and previous state:

\[
h_t=\tanh(W_xx_t+W_hh_{t-1}+b).
\]

The same parameters are reused at every position. The hidden state summarizes history through repeated nonlinear updates. This gives a natural ordered model but creates a long chain for gradients and sequential dependence during execution.

Repeated multiplication through time can shrink or amplify gradients. LSTMs and GRUs introduce gates that control information flow, helping preserve useful state. An LSTM maintains both hidden and cell state, with learned gates regulating writing, forgetting, and output. The gates are continuous functions, so training still uses the chain rule.

```python
import torch
from torch import nn

embedding = nn.Embedding(12, 6, padding_idx=0)
lstm = nn.LSTM(input_size=6, hidden_size=8, batch_first=True)
tokens = torch.tensor([[2, 3, 4], [5, 6, 7]])
outputs, (hidden, cell) = lstm(embedding(tokens))
print(outputs.shape, hidden.shape, cell.shape)
```

The output shape is `[2, 3, 8]`. With one unidirectional layer, hidden and cell shapes are `[1, 2, 8]`: layer-direction, batch, hidden features. `batch_first=True` changes input and output sequence layout; it does not make hidden state batch-first. This distinction is a frequent source of indexing errors.

For a sequence classifier, a final valid state can summarize each sequence. For token tagging, apply a head to each output position. A bidirectional model combines past and future context, useful for offline tagging but invalid when a prediction must depend only on the past.



## 5.6 Packed sequences avoid processing padding

Feeding padded sequences through an LSTM and taking the last padded output is wrong when the desired representation is the last actual token state. One option is gathering outputs at each true final index. Another is packing sequences so the recurrent operation skips padded steps.

```python
import torch
from torch import nn
from torch.nn.utils.rnn import pack_padded_sequence, pad_packed_sequence

embedding = nn.Embedding(10, 5, padding_idx=0)
lstm = nn.LSTM(5, 7, batch_first=True)
tokens = torch.tensor([[2, 3, 4], [5, 6, 0]])
lengths = torch.tensor([3, 2], dtype=torch.long)
packed = pack_padded_sequence(embedding(tokens), lengths.cpu(),
                              batch_first=True, enforce_sorted=False)
packed_outputs, (hidden, cell) = lstm(packed)
outputs, restored_lengths = pad_packed_sequence(packed_outputs, batch_first=True)
print(outputs.shape, hidden[-1].shape)
```

Lengths must be positive for this path. CPU lengths satisfy the documented packing contract. `enforce_sorted=False` permits unsorted batches. The final hidden state now corresponds to processed content under the packed sequence semantics, rather than filler steps added to make a rectangle.

Packing adds complexity and may not be the best performance choice for every workload. It is useful when lengths vary substantially and recurrence is the intended architecture. Regardless of implementation, the semantic requirement is that padding must not be mistaken for genuine history.



## 5.7 Token tagging and masked cross entropy

Named-entity recognition assigns a category to each token. A recurrent or transformer encoder can supply contextual features, and a linear head maps each token representation to class logits. If logits have shape `[B, T, C]`, flatten the first two axes and compare with flattened targets.

```python
import torch
from torch import nn

logits = torch.randn(2, 3, 4, requires_grad=True)
labels = torch.tensor([[0, 1, 2], [3, 1, -100]])
loss = nn.functional.cross_entropy(logits.reshape(-1, 4), labels.reshape(-1),
                                    ignore_index=-100)
loss.backward()
print(loss.item(), logits.grad.shape)
```

The ignored target excludes its position from the ordinary mean reduction over valid class-index targets. Ensure at least one valid target exists; an all-ignored mean can be undefined. For dataset-wide loss reporting, accumulate the valid-position loss sum and valid-position count instead of averaging variable-token batch means.

The supplied primer motivates this kind of padded tagging workflow. Modern code can use the built-in ignore-index contract rather than manually indexing labels that include negative padding IDs. Negative tensor indices are valid Python-style indices, so an improvised gather-and-mask implementation can accidentally select the last class before masking.

Token accuracy is not the same as entity-level quality. A named entity spanning several tokens may be incorrect if only one boundary is wrong. Evaluation for real tagging tasks needs the dataset's span and label conventions, not merely a per-position average.
