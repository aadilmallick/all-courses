# 46. Transfer learning, fine tuning, LoRA, and hypernetworks

[Previous](45-translation-decoding-evaluation.md) · [Course index](../README.md) · [Next](47-efficient-attention-memory.md)

## Adapt an existing function to a new distribution

Transfer learning starts with parameters learned on a source objective and adapts them for another task. A frozen backbone with a fitted head, full fine-tuning, adapters, and low-rank updates differ in trainable parameters and optimization constraints. They do not define which data are available or which evaluation protocol is valid.

For LoRA, write $W'=W+sAB$ with low-rank factors and scale $s$. If $A:(d,r)$ and $B:(r,k)$, the update rank is at most $r$, while the final matrix can remain full rank. Initialize one factor to zero and the other nonzero so the initial update is zero but at least one factor receives a gradient. Initializing both to zero can make both factor gradients vanish.

## Hypernetworks generate parameters

A hypernetwork $H_\phi(c)$ outputs target-network weights $\theta$ from a conditioning vector $c$. The target predictor is $f_{H_\phi(c)}(x)$. Chain rule gives $\nabla_\phi L=J_{H_\phi}^\top\nabla_\theta L$. This is not merely selecting a learning rate: the output is part or all of another model's parameterization.

For a tiny example let target weights be $w=Ac$, prediction $\widehat y=w^\top x$, and half squared error. Residual $e=\widehat y-y$ gives $\nabla_wL=ex$ and $\nabla_AL=(ex)c^\top$. With $x=(2,1)$, $c=(1,0)$, $A=I$, and $y=1$, prediction is 2, residual 1, and the gradient matrix is $\begin{bmatrix}2&0\\1&0\end{bmatrix}$. A second conditioning coordinate of zero contributes no gradient in this instance.

Hypernetworks can share structure across tasks, but generating every weight can be expensive and conditioning can entangle tasks. A low-dimensional generated update or structured subset is often easier to study. The supplied advanced laboratory performs and audits this actual tiny hypernetwork gradient rather than only printing a weight matrix.

## Fine-tuning and low-rank implementations
## Change the training distribution and objective deliberately

Pretraining learns to continue text. Instruction tuning trains on examples of desired responses to instructions. It uses the same basic next-token likelihood machinery but changes the serialized data and often which target positions receive loss. It does not directly guarantee truthfulness, safety, or broad reasoning improvements.

Let a serialized example contain system text, user text, and assistant response. Use the entire preceding conversation as context, but frequently compute loss only on assistant response tokens. With mask $m_t\in\{0,1\}$,

$$L=-\frac{\sum_t m_t\log\pi_\theta(x_t\mid x_{<t})}{\sum_t m_t}.$$

The denominator counts supervised targets, not total input tokens. Every included target still needs the correctly shifted input. If all mask entries are zero, the objective is undefined; reject the batch or skip it under a documented policy.

## Trace a three-position example

Suppose the input positions end with a user boundary and then two assistant tokens. The target for the boundary position is the first assistant token, so that position's loss should be included. A mask based only on the visible role of the input token can be off by one. Construct masks against target indices, then inspect one decoded example with its labels and mask.

Masked-out prompt tokens still affect response predictions through the forward computation. Excluding their direct loss does not freeze their embedding gradients when those embeddings help predict supervised responses. Loss masking and parameter freezing are separate mechanisms.

## Data quality is a mathematical issue

Contradictory demonstrations produce competing gradients. Repeated templates can distort task balance. Long responses receive more weight under a token mean than short responses unless examples are reweighted. Decide whether the intended objective is per-token performance or equal weighting of conversations.

Keep training and evaluation tasks separate by source and generation process when possible. Synthetic instructions can be useful, but a teacher's errors and style biases can be replicated. Include answerability, uncertainty, and abstention examples if those behaviors matter.

## Evaluate both adaptation and regression

Measure the desired task before and after tuning and also evaluate important retained capabilities. Low tuning loss can coexist with memorization or regression. A small learning rate or frozen base weights can reduce some changes but does not prove that forgetting is absent.

The example compares the model's masked loss with an independently computed selection from log-softmax. It also verifies that changing excluded labels leaves the objective unchanged. The inputs remain fixed, so this is specifically a loss-selection check, not a statement about changing the actual prompt.

### A response mask can change parameter gradients far upstream

Consider prompt token embedding $e_p$, answer state $h=e_pW$, and supervised answer loss $L(h)$. Even if no prompt-target loss is included, $\partial L/\partial e_p=(\partial L/\partial h)W^\top$ can be nonzero. The prompt token influences the answer prediction through the forward graph. Excluding a prompt position from the target reduction removes one direct loss term; it does not detach prompt representations. This distinction matters when debugging unexpectedly nonzero embedding gradients during response-only supervised fine-tuning.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
from core import TinyGPT, log_softmax
model = TinyGPT(6, width=8, heads=2, context=4)
inputs = np.array([[0, 1, 2, 3]])
targets = np.array([[1, 2, 3, 4]])
mask = np.array([[0., 0., 1., 1.]])
actual = float(model.loss(inputs, targets, mask).data)
logp = log_softmax(model(inputs).data)
selected = logp[0, np.arange(4), targets[0]]
manual = -np.sum(mask[0]*selected)/mask.sum()
assert np.allclose(actual, manual)
changed = targets.copy()
changed[0, :2] = 5
assert np.allclose(model.loss(inputs, changed, mask).data, actual)
print('response-only loss', actual)

```

### Code structure and observed intermediate values


#### Stage 3

```python
model = TinyGPT(6, width=8, heads=2, context=4)
```

#### Stage 4

```python
inputs = np.array([[0, 1, 2, 3]])
```

An observed state during this stage was:

- `inputs`: `[[0 1 2 3]]`

#### Stage 5

```python
targets = np.array([[1, 2, 3, 4]])
```

An observed state during this stage was:

- `targets`: `[[1 2 3 4]]`

#### Stage 6

```python
mask = np.array([[0., 0., 1., 1.]])
```

An observed state during this stage was:

- `mask`: `[[0. 0. 1. 1.]]`

#### Stage 7

```python
actual = float(model.loss(inputs, targets, mask).data)
```

An observed state during this stage was:

- `actual`: `1.644505`

#### Stage 8

```python
logp = log_softmax(model(inputs).data)
```

An observed state during this stage was:

- `logp`: `array shape=(1, 4, 6), min=-2.20625, max=-1.34192, norm=8.9819`

#### Stage 9

```python
selected = logp[0, np.arange(4), targets[0]]
```

An observed state during this stage was:

- `selected`: `[-1.75304 -2.19679 -1.41761 -1.8714 ]`

#### Stage 10

```python
manual = -np.sum(mask[0]*selected)/mask.sum()
```

An observed state during this stage was:

- `manual`: `1.644505`

#### Stage 11

```python
assert np.allclose(actual, manual)
```

#### Stage 12

```python
changed = targets.copy()
```

An observed state during this stage was:

- `changed`: `[[1 2 3 4]]`

#### Stage 13

```python
changed[0, :2] = 5
```

An observed state during this stage was:

- `changed`: `[[5 5 3 4]]`

#### Stage 14

```python
assert np.allclose(model.loss(inputs, changed, mask).data, actual)
```

#### Stage 15

```python
print('response-only loss', actual)
```

Run from the course root:

```bash
python code/neural/26_instruction_sft.py
```

### Recorded output from the supplied environment

```text
response-only loss 1.6445050445689042
```

## Freeze a base map and learn a structured change

Full tuning updates every parameter. Parameter-efficient methods update a smaller subset or introduce small trainable modules. Adapters add bottleneck transformations; prompt and prefix tuning learn additional conditioning representations; LoRA parameterizes a low-rank weight update. These methods restrict adaptation in different ways.

Using the row-vector convention, let $W_0\in\mathbb R^{D\times F}$, $A\in\mathbb R^{D\times r}$, and $B\in\mathbb R^{r\times F}$. Define $Y=XW_0+s(XA)B$ with scale $s=\alpha/r$. The update is $\Delta W=sAB$, whose rank is at most $r$. Trainable parameters are $r(D+F)$ instead of $DF$, although the frozen base weights still occupy memory.

## Derive both factor gradients

Let upstream $G$ have the shape of $Y$ and $U=XA$. The output update is $sUB$. Matrix reverse rules give $G_B=sU^\top G$, $G_U=sGB^\top$, and $G_A=X^\top G_U=sX^\top GB^\top$. The input receives both $GW_0^\top$ and $sGB^\top A^\top$.

If $A$ is random and $B=0$ initially, the forward function begins exactly at the base map. The first $A$ gradient is zero because it contains $B^\top$, while $B$ can receive a nonzero gradient through $XA$. After $B$ moves, $A$ can learn. Setting both factors to zero would make both factor gradients zero initially.

## Merging and its conditions

For inference without dropout or other adapter-dependent behavior, replace the base with $W_0+sAB$. The resulting linear map is algebraically identical. With multiple adapters, quantized bases, nonlinear inserted modules, or training-time dropout, merging requires additional care and may involve approximation.

LoRA is a constraint on the update, not proof that important changes are low rank or restricted to high layers. Freezing the base prevents overwriting its stored values, but the adapted model can still behave differently on previously learned tasks. Reversibility of removing an adapter is distinct from absence of behavioral interference while it is active.

## Choose targets experimentally

Applying LoRA only to query and value projections is one possible design; adapting keys, outputs, or feed-forward maps changes capacity and cost. Compare ranks, target modules, scaling, learning rates, and retained capabilities under a fixed evaluation protocol. The original method does not prescribe one universally optimal choice.

The experiment checks zero-initialization behavior, both factor derivatives, and merge equivalence using independently computed numerical gradients. This exposes the main algebra without relying on a package wrapper.

### A rank constraint does not identify the factors

For any invertible $R\in\mathbb R^{r\times r}$, $(AR)(R^{-1}B)=AB$. The same update matrix therefore has many factor representations. Factor norms and optimizer trajectories can differ despite an identical initial product. This is why comparing only the numerical entries of $A$ across runs does not establish whether two adapters learned the same function. Compare the product, the merged linear map, and held-out behavior. The redundancy also explains why initialization and scaling affect optimization even though the rank bound is unchanged.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
from core import finite_difference
rng = np.random.default_rng(27)
x, base = rng.normal(size=(3, 4)), rng.normal(size=(4, 5))
a, b = rng.normal(size=(4, 2)), np.zeros((2, 5))
g, scale = rng.normal(size=(3, 5)), 0.5
ga = scale*x.T @ g @ b.T
gb = scale*(x @ a).T @ g
assert np.allclose(ga, 0)
assert np.linalg.norm(gb) > 0
b += 0.02*gb
ga = scale*x.T @ g @ b.T
numeric = finite_difference(lambda z: np.sum((x @ base+scale*(x @ z) @ b)*g), a)
assert np.allclose(ga, numeric, atol=1e-7)
assert np.allclose(x @ base+scale*(x @ a) @ b, x @ (base+scale*a @ b))
print('trainable parameters', a.size+b.size, 'base parameters', base.size)

```

### Code structure and observed intermediate values


#### Stage 3

```python
rng = np.random.default_rng(27)
```

#### Stage 4

```python
x, base = rng.normal(size=(3, 4)), rng.normal(size=(4, 5))
```

An observed state during this stage was:

- `x`: `[[ 1.25445  0.7769   0.96488 -1.08218]  [ 0.86702 -0.16816 -0.18966  1.12057]  [-0.43678 -1.27965 -0.4695  -1.19683]]`
- `base`: `[[-1.83986 -0.14556  0.39828 -2.16206  0.01448]  [ 0.2552   0.17319 -1.27009 -0.31096 -0.18622]  [ 0.43298 -1.28735  0.38341  0.99188 -2.28765]  [ 0.22394 -1.52661 -0.17047 -0.68015  1.27364]]`

#### Stage 5

```python
a, b = rng.normal(size=(4, 2)), np.zeros((2, 5))
```

An observed state during this stage was:

- `a`: `[[ 0.05711  0.79529]  [-1.04678  0.46053]  [ 1.42237 -0.70726]  [ 0.66587  0.48137]]`
- `b`: `[[0. 0. 0. 0. 0.]  [0. 0. 0. 0. 0.]]`

#### Stage 6

```python
g, scale = rng.normal(size=(3, 5)), 0.5
```

An observed state during this stage was:

- `g`: `[[-0.06467 -1.25149  0.2831  -0.27029  0.60202]  [ 0.77888  1.53454 -0.83656  0.86504  0.70082]  [ 0.07542  0.61179  0.13169  0.67131  0.392  ]]`
- `scale`: `0.5`

#### Stage 7

```python
ga = scale*x.T @ g @ b.T
```

An observed state during this stage was:

- `ga`: `[[0. 0.]  [0. 0.]  [0. 0.]  [0. 0.]]`

#### Stage 8

```python
gb = scale*(x @ a).T @ g
```

An observed state during this stage was:

- `gb`: `[[ 0.2706   0.54881 -0.3162   0.26532  0.1895 ]  [ 0.45123  0.53008 -0.59397  0.13919  0.26485]]`

#### Stage 9

```python
assert np.allclose(ga, 0)
```

#### Stage 10

```python
assert np.linalg.norm(gb) > 0
```

#### Stage 11

```python
b += 0.02*gb
```

An observed state during this stage was:

- `b`: `[[ 0.00541  0.01098 -0.00632  0.00531  0.00379]  [ 0.00902  0.0106  -0.01188  0.00278  0.0053 ]]`

#### Stage 12

```python
ga = scale*x.T @ g @ b.T
```

An observed state during this stage was:

- `ga`: `[[ 0.00266  0.00571]  [-0.01592 -0.01516]  [-0.0131  -0.0131 ]  [ 0.02017  0.02433]]`

#### Stage 13

```python
numeric = finite_difference(lambda z: np.sum((x @ base+scale*(x @ z) @ b)*g), a)
```

An observed state during this stage was:

- `numeric`: `[[ 0.00266  0.00571]  [-0.01592 -0.01516]  [-0.0131  -0.0131 ]  [ 0.02017  0.02433]]`

#### Stage 14

```python
assert np.allclose(ga, numeric, atol=1e-7)
```

#### Stage 15

```python
assert np.allclose(x @ base+scale*(x @ a) @ b, x @ (base+scale*a @ b))
```

#### Stage 16

```python
print('trainable parameters', a.size+b.size, 'base parameters', base.size)
```

Run from the course root:

```bash
python code/neural/27_lora_peft.py
```

### Recorded output from the supplied environment

```text
trainable parameters 18 base parameters 20
```## 4.11 Transfer learning reuses a learned representation

Training a large vision model from random initialization can require substantial labeled data. A pretrained model may already encode useful visual features. Transfer learning adapts that representation to a new task. This is a hypothesis about relatedness between the pretraining distribution and your task, not a guarantee.

Two common stages are feature extraction and fine-tuning. Feature extraction freezes the backbone and trains a new output head. Fine-tuning updates some or all backbone parameters, often with a smaller learning rate. Begin with the frozen baseline because it is cheaper and provides evidence about representation usefulness.

The following example requires a compatible torchvision installation and a download of pretrained weights if they are not cached. It constructs an inference-ready architecture but does not claim to train it on an unspecified dataset.

```python
import torch
from torch import nn
from torchvision.models import resnet18, ResNet18_Weights

weights = ResNet18_Weights.DEFAULT
model = resnet18(weights=weights)
for parameter in model.parameters():
    parameter.requires_grad_(False)
model.fc = nn.Linear(model.fc.in_features, 3)
model.eval()
model.fc.train()
optimizer = torch.optim.AdamW(model.fc.parameters(), lr=1e-3)
preprocess = weights.transforms()
print(model.fc)
```

The weight enum supplies the associated preprocessing transform. That pairing matters: the pretrained network expects a particular scale and normalization. Replacing the head creates new trainable parameters after freezing the old ones. Constructing the optimizer afterward ensures it references the actual replacement head.

When training only this head, keep the backbone's batch normalization layers in evaluation mode if you intend to preserve their running statistics. Calling `model.train()` later recursively changes them back, so reapply the intended mode policy. Freezing `requires_grad` and freezing behavioral state are separate actions.



## 4.12 Fine-tuning without destroying the baseline

After training a head, unfreeze selected backbone layers if validation suggests the representation needs adaptation. Use parameter groups to give the pretrained layers a smaller learning rate than the new head. This reflects a reasonable desire to preserve useful features while allowing correction.

A careful procedure stores the frozen-baseline checkpoint, changes the trainable parameter policy explicitly, rebuilds or adjusts the optimizer deliberately, and compares validation performance under the same split. If the optimizer is rebuilt, its moment history changes. That is acceptable when intentional, but it should not be mistaken for a perfectly continuous training run.

Catastrophic forgetting describes the loss of previously useful behavior during adaptation. A high learning rate, small dataset, or large domain shift can contribute. Smaller updates, partial freezing, and representative validation can help, but none removes the need to evaluate the new task and any old capabilities you still require.

Pretraining can also carry unwanted shortcuts and biases. A model pretrained on ordinary photographs may behave poorly on medical images or industrial textures. Compare against a simpler baseline and inspect error categories. A well-known architecture name is not evidence that its learned features suit your population.

## 5.22 A low-rank adapter from first principles

An affine projection stores a weight matrix with output-by-input shape. Instead of updating that whole matrix, a low-rank adapter adds a correction factored into two smaller matrices. The forward calculation becomes the frozen base output plus a scaled `B(A(x))` branch. If the rank is much smaller than both widths, the branch has many fewer trainable weights.

```python
import torch
from torch import nn

class LowRankLinear(nn.Module):
    def __init__(self, base, rank=2, alpha=2.0):
        super().__init__()
        if rank <= 0:
            raise ValueError('Rank must be positive')
        self.base = base
        for parameter in base.parameters():
            parameter.requires_grad_(False)
        self.down = nn.Linear(base.in_features, rank, bias=False)
        self.up = nn.Linear(rank, base.out_features, bias=False)
        nn.init.zeros_(self.up.weight)
        self.scale = alpha / rank
    def forward(self, features):
        return self.base(features) + self.scale * self.up(self.down(features))

base = nn.Linear(16, 12)
adapted = LowRankLinear(base)
features = torch.randn(3, 16)
assert torch.allclose(adapted(features), base(features))
loss = adapted(features).square().mean()
loss.backward()
print(sum(parameter.numel() for parameter in adapted.parameters()
          if parameter.requires_grad))
```

The zero-initialized output branch makes the initial adapted function equal the base function. The other branch is not also initialized to zero; zeroing both factors would obstruct the initial learning signal. On the first backward pass, the output factor can receive a gradient while the input factor may initially have zero gradient. Subsequent updates allow both to learn.

This is the core low-rank projection mechanism, not a complete pretrained-language-model adapter package. Real integration must select projections, preserve dtype and device, save adapter configuration, and keep the matching base-model identity. The reduction in trainable weights does not remove the need for activations through frozen operations when gradients must reach adapters deeper in the model.


## Inspect the complete numerical experiment

This is the exact function in [advanced.py](../code/classical/advanced.py). Its module imports NumPy plus `finite_difference` and `softmax` from the adjacent `models.py`. Run `python code/classical/advanced.py` to execute all of these experiments. Assertions check the stated finite example; they do not claim general capability.

```python
def hypernetwork():
    x,c=np.array([2.,1.]),np.array([1.,0.])
    A=np.eye(2)
    def objective(A): return .5*((A@c)@x-1)**2
    analytic=np.outer((((A@c)@x)-1)*x,c)
    numeric=finite_difference(objective,A)
    assert np.allclose(analytic,numeric,atol=1e-7)
    start=objective(A)
    for _ in range(30):
        error=(A@c)@x-1
        A-=.1*np.outer(error*x,c)
    assert objective(A)<start/1000
    return start,objective(A)
```
