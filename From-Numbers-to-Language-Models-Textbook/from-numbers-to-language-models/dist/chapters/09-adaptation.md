# Adapting a model while measuring what changes

## Name the desired behavior before tuning

Suppose a model can continue text but fails to return a consistent structured answer. Instruction examples may teach the response format. Suppose it lacks a current fact. Retrieval may be more appropriate than repeatedly training that fact into weights. Suppose it performs one domain task poorly under a small hardware budget. A low-rank update may be worth comparing with full tuning. These are different problems, so one adaptation recipe should not be assumed to solve all of them.

Evaluation comes first in this chapter because an intervention is meaningful only relative to a measured goal. Keep a held-out set for the desired behavior and a separate set for important retained capabilities. A lower tuning loss proves better fit to the tuning objective, not universal improvement.

## Evaluation, calibration, and mechanistic investigation

### Decide what success means before measuring it

Next-token loss, factual question answering, code execution, instruction following, and calibrated uncertainty are different targets. A single score cannot establish all of them. Choose a deployment population, specify a metric, reserve an evaluation set, and record uncertainty. Reusing the test set to tune prompts turns it into development data.

Exact match is useful when an answer has a canonical representation. It can punish equivalent wording. Semantic scoring can recognize paraphrases but introduce evaluator bias. Executable tests provide strong evidence for specified behavior but can miss untested cases. Evaluation design is the problem of making these limitations explicit.

### Calibration with a numerical example

A predictor is calibrated for an event if among cases assigned probability $p$, the event occurs with frequency $p$ under the evaluation distribution. Accuracy alone does not establish calibration. A model that is 80 percent correct and always claims 99 percent confidence is overconfident.

For a binary event $y$ and probability $p$, Brier loss is $(p-y)^2$. Its expected value under true success rate $q$ is $q(p-1)^2+(1-q)p^2=p^2-2pq+q$. Differentiating gives $2(p-q)$, so the unique minimizer on $[0,1]$ is $p=q$. This is a proper scoring rule. Log loss is also proper under its support conditions.

Expected calibration error bins confidence and compares empirical accuracy with mean confidence. Its value depends on binning and sample size. A coarse bin can hide errors that cancel. Report reliability data and uncertainty rather than treating one ECE number as a complete description.

### From inspection to causal evidence

Attention maps reveal one intermediate quantity. They do not by themselves identify the cause of a decision. Probe classifiers show information can be decoded, but not that the model uses that information. Ablation removes a component; activation patching replaces internal states between runs; controlled interventions can test causal hypotheses. Distribution shifts caused by an intervention complicate interpretation.

For an induction-like behavior, construct matched examples, locate candidate components, intervene, and measure a specific output change. Include negative controls and alternative explanations. A circuit description is stronger when it predicts behavior beyond the examples used to discover it.

### Statistical discipline

A paired comparison uses the same examples for both systems. Bootstrap over independent units such as users or documents when examples are clustered. A confidence interval quantifies a sampling procedure, not every source of uncertainty, including contamination and evaluator error.

The example computes Brier score and bootstrap uncertainty for a small paired accuracy difference. It illustrates the calculation, but eight examples are too few for a reliable deployment decision. The deliberately modest sample makes this limitation visible.

#### A calibrated constant predictor can still be unhelpful

If a dataset has 70 percent positive labels, always predicting 0.7 can be calibrated at its one confidence value. Yet it distinguishes no individual cases. A perfect ranking model might discriminate examples well but need probability recalibration. Calibration and discrimination are therefore separate axes. Under Brier loss, the constant predictor's expected score is $0.7(0.3)^2+0.3(0.7)^2=0.21$. A perfectly accurate probability predictor has zero. Report calibration alongside task accuracy and discrimination metrics suitable for the application.


## Read confidence in the units of its measurement

A model's confidence can be based on token probabilities, a dedicated classifier, a prompted self-rating, or an external evaluator. These are different quantities. An answer's product of token probabilities tends to decrease with length and does not directly measure factual correctness. A prompted statement such as '90 percent sure' must itself be evaluated for calibration.

For a practical baseline, choose a well-defined event: for example, whether a selected answer is correct on a specified question set. Then compare predicted probabilities with observed outcomes under that task. Avoid asking one confidence number to summarize every possible interpretation of response quality.


### Executable calculation

Run `python examples/25_evaluation_interpretability.py` from the package root. Complete source is also included as [25_evaluation_interpretability.py](../examples/25_evaluation_interpretability.py).

```python
import numpy as np
rng = np.random.default_rng(25)
labels = np.array([1, 0, 1, 1, 0, 0, 1, 0])
probability = np.array([.8, .3, .6, .9, .4, .1, .7, .2])
brier = np.mean((probability-labels)**2)
a = np.array([1, 1, 0, 1, 1, 0, 1, 1])
b = np.array([1, 0, 0, 1, 1, 0, 1, 0])
differences = a-b
samples = rng.choice(differences, size=(2000, len(differences)), replace=True).mean(axis=1)
print('Brier', brier, 'paired improvement', differences.mean())
print('illustrative bootstrap interval', np.quantile(samples, [.025, .975]))
```

Recorded output on the checked Python/NumPy environment:

```text
Brier 0.07500000000000001 paired improvement 0.25
illustrative bootstrap interval [0.    0.625]
```


## Instruction tuning and supervised response losses

### Change the training distribution and objective deliberately

Pretraining learns to continue text. Instruction tuning trains on examples of desired responses to instructions. It uses the same basic next-token likelihood machinery but changes the serialized data and often which target positions receive loss. It does not directly guarantee truthfulness, safety, or broad reasoning improvements.

Let a serialized example contain system text, user text, and assistant response. Use the entire preceding conversation as context, but frequently compute loss only on assistant response tokens. With mask $m_t\in\{0,1\}$,

$$L=-\frac{\sum_t m_t\log\pi_\theta(x_t\mid x_{<t})}{\sum_t m_t}.$$

The denominator counts supervised targets, not total input tokens. Every included target still needs the correctly shifted input. If all mask entries are zero, the objective is undefined; reject the batch or skip it under a documented policy.

### Trace a three-position example

Suppose the input positions end with a user boundary and then two assistant tokens. The target for the boundary position is the first assistant token, so that position's loss should be included. A mask based only on the visible role of the input token can be off by one. Construct masks against target indices, then inspect one decoded example with its labels and mask.

Masked-out prompt tokens still affect response predictions through the forward computation. Excluding their direct loss does not freeze their embedding gradients when those embeddings help predict supervised responses. Loss masking and parameter freezing are separate mechanisms.

### Data quality is a mathematical issue

Contradictory demonstrations produce competing gradients. Repeated templates can distort task balance. Long responses receive more weight under a token mean than short responses unless examples are reweighted. Decide whether the intended objective is per-token performance or equal weighting of conversations.

Keep training and evaluation tasks separate by source and generation process when possible. Synthetic instructions can be useful, but a teacher's errors and style biases can be replicated. Include answerability, uncertainty, and abstention examples if those behaviors matter.

### Evaluate both adaptation and regression

Measure the desired task before and after tuning and also evaluate important retained capabilities. Low tuning loss can coexist with memorization or regression. A small learning rate or frozen base weights can reduce some changes but does not prove that forgetting is absent.

The example compares the model's masked loss with an independently computed selection from log-softmax. It also verifies that changing excluded labels leaves the objective unchanged. The inputs remain fixed, so this is specifically a loss-selection check, not a statement about changing the actual prompt.

#### A response mask can change parameter gradients far upstream

Consider prompt token embedding $e_p$, answer state $h=e_pW$, and supervised answer loss $L(h)$. Even if no prompt-target loss is included, $\partial L/\partial e_p=(\partial L/\partial h)W^\top$ can be nonzero. The prompt token influences the answer prediction through the forward graph. Excluding a prompt position from the target reduction removes one direct loss term; it does not detach prompt representations. This distinction matters when debugging unexpectedly nonzero embedding gradients during response-only supervised fine-tuning.


## Walk a response boundary through label shifting

Suppose serialized input ends with a user-boundary token followed by assistant tokens A and B. The prediction at the boundary position targets A. If response-only supervision starts only at the input position containing A, it may accidentally omit the first assistant target. Construct the mask against target ownership, then map it back to the prediction positions. This is an indexing problem with a semantic consequence.

Masked prompt positions still participate in computing response states. Their embedding rows can receive indirect gradients from supervised later targets. Parameter freezing is a separate decision. To freeze a base model, exclude its parameters from updates or use the framework's documented gradient controls; a target mask cannot implement that policy by itself.


### Executable calculation

Run `python examples/26_instruction_sft.py` from the package root. Complete source is also included as [26_instruction_sft.py](../examples/26_instruction_sft.py).

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

Recorded output on the checked Python/NumPy environment:

```text
response-only loss 1.6445050445689042
```


## Parameter-efficient tuning, adapters, and LoRA derivatives

### Freeze a base map and learn a structured change

Full tuning updates every parameter. Parameter-efficient methods update a smaller subset or introduce small trainable modules. Adapters add bottleneck transformations; prompt and prefix tuning learn additional conditioning representations; LoRA parameterizes a low-rank weight update. These methods restrict adaptation in different ways.

Using the row-vector convention, let $W_0\in\mathbb R^{D\times F}$, $A\in\mathbb R^{D\times r}$, and $B\in\mathbb R^{r\times F}$. Define $Y=XW_0+s(XA)B$ with scale $s=\alpha/r$. The update is $\Delta W=sAB$, whose rank is at most $r$. Trainable parameters are $r(D+F)$ instead of $DF$, although the frozen base weights still occupy memory.

### Derive both factor gradients

Let upstream $G$ have the shape of $Y$ and $U=XA$. The output update is $sUB$. Matrix reverse rules give $G_B=sU^\top G$, $G_U=sGB^\top$, and $G_A=X^\top G_U=sX^\top GB^\top$. The input receives both $GW_0^\top$ and $sGB^\top A^\top$.

If $A$ is random and $B=0$ initially, the forward function begins exactly at the base map. The first $A$ gradient is zero because it contains $B^\top$, while $B$ can receive a nonzero gradient through $XA$. After $B$ moves, $A$ can learn. Setting both factors to zero would make both factor gradients zero initially.

### Merging and its conditions

For inference without dropout or other adapter-dependent behavior, replace the base with $W_0+sAB$. The resulting linear map is algebraically identical. With multiple adapters, quantized bases, nonlinear inserted modules, or training-time dropout, merging requires additional care and may involve approximation.

LoRA is a constraint on the update, not proof that important changes are low rank or restricted to high layers. Freezing the base prevents overwriting its stored values, but the adapted model can still behave differently on previously learned tasks. Reversibility of removing an adapter is distinct from absence of behavioral interference while it is active.

### Choose targets experimentally

Applying LoRA only to query and value projections is one possible design; adapting keys, outputs, or feed-forward maps changes capacity and cost. Compare ranks, target modules, scaling, learning rates, and retained capabilities under a fixed evaluation protocol. The original method does not prescribe one universally optimal choice.

The experiment checks zero-initialization behavior, both factor derivatives, and merge equivalence using independently computed numerical gradients. This exposes the main algebra without relying on a package wrapper.

#### A rank constraint does not identify the factors

For any invertible $R\in\mathbb R^{r\times r}$, $(AR)(R^{-1}B)=AB$. The same update matrix therefore has many factor representations. Factor norms and optimizer trajectories can differ despite an identical initial product. This is why comparing only the numerical entries of $A$ across runs does not establish whether two adapters learned the same function. Compare the product, the merged linear map, and held-out behavior. The redundancy also explains why initialization and scaling affect optimization even though the rank bound is unchanged.


## Count the low-rank update in a realistic dimension

For input and output width 1024 and rank eight, the full matrix has $1024^2=1{,}048{,}576$ parameters. The two LoRA factors have $1024\cdot8+8\cdot1024=16{,}384$, one sixty-fourth as many trainable entries. The base matrix still exists. The major training-memory savings come from avoiding its gradients and optimizer states, while activations and frozen-weight storage remain.

This count does not predict task quality. A rank-eight update might be sufficient for one adaptation and restrictive for another. Compare target modules and rank under the same data, compute, and evaluation rather than treating rank as a universal amount of semantic capacity.


### Executable calculation

Run `python examples/27_lora_peft.py` from the package root. Complete source is also included as [27_lora_peft.py](../examples/27_lora_peft.py).

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

Recorded output on the checked Python/NumPy environment:

```text
trainable parameters 18 base parameters 20
```


## Quantization, numerical error, and QLoRA

### Represent weights with fewer bits

Uniform symmetric quantization chooses a scale $s>0$ and represents a weight by integer $q=\operatorname{clip}(\operatorname{round}(w/s),-Q,Q)$. Reconstruct $\widehat w=sq$. With no clipping, rounding error is at most $s/2$. With clipping, that bound no longer applies. A zero tensor needs a safe nonzero scale convention.

For four-bit signed symmetric illustration, use integer range $[-7,7]$. A maximum absolute weight of 1.4 gives scale 0.2. Weight 0.31 maps to integer two and reconstructs as 0.4, error 0.09. Actual four-bit formats may use asymmetric ranges, nonuniform codebooks, group scales, and packed storage. Our float NumPy array of integers does not itself demonstrate compressed byte storage.

### Propagate error through a layer

Let reconstruction error be $E=\widehat W-W$. For row input $x$, output error is $xE$. By submultiplicativity, $\|xE\|_2\le\|x\|_2\|E\|_2\le\|x\|_2\|E\|_F$. A small weight error bound controls one linear layer's output under bounded input. It does not directly bound a whole autoregressive model's generated text, because nonlinearities and discrete token selection can amplify small changes.

Per-channel or groupwise scales reduce the influence of outlier channels at the cost of scale metadata and more complex kernels. Activation quantization introduces another error source. Calibration data should reflect actual activations and workloads; weight-only experiments cannot establish activation quantization quality.

### What QLoRA adds

QLoRA trains low-rank adapters while using a frozen quantized base. Its specific recipe includes a nonuniform four-bit format, additional compression of quantization constants, and memory-management choices. It is not simply 'round weights and train everything with four-bit gradients.' Computation can dequantize blocks into a higher-precision compute type, while trainable adapters and optimizer states use their documented formats.

The derivative of exact rounding is zero almost everywhere and undefined at thresholds. Quantization-aware training may use surrogate gradients, which are estimators rather than ordinary derivatives of the rounding function. With a frozen quantized base and differentiable adapters, gradients need not update the stored integer codes.

### Evaluate the actual deployment format

Check accuracy, calibration, outlier behavior, throughput, and peak memory. Fewer weight bits do not guarantee faster execution without efficient kernels. Merging an adapter into a quantized base may introduce fresh rounding error and requires re-evaluation.

The experiment quantizes a small matrix, checks the unclipped reconstruction bound, and measures output error against a norm bound. It does not implement NF4, packed kernels, or a complete QLoRA training system.

#### An outlier changes uniform quantization resolution

For weights $(0.1,0.2,0.3,10)$ with symmetric range $[-7,7]$, the shared scale is $10/7\approx1.429$. All three small weights round to zero, losing their differences. If the outlier uses a separate group, the small group's scale is $0.3/7\approx0.0429$, preserving much finer distinctions. Grouping improves this example's resolution but adds scale metadata and changes kernel access patterns. Weight distributions and activation sensitivity determine whether the extra complexity is worthwhile. Mean squared weight error alone may not predict task degradation.


## Precision is a numerical model choice

A lower-bit representation replaces exact stored values by values from a finite codebook. Error depends on scale, clipping, grouping, outliers, and the sensitivity of downstream computations. Integer codes stored in an ordinary NumPy array demonstrate reconstruction but do not automatically use the same packed memory layout or accelerated kernels as a deployment backend.

The companion's **Adapters and precision** experiment changes one LoRA factor, rank scaling, and quantization level. It displays the base output, adapted output, merged output, and quantized reconstruction error. Merge equality is an exact property of the stated linear maps in real arithmetic; quantized merge can add fresh rounding error. The interface keeps those claims separate.


### Executable calculation

Run `python examples/28_quantization_qlora.py` from the package root. Complete source is also included as [28_quantization_qlora.py](../examples/28_quantization_qlora.py).

```python
import numpy as np
rng = np.random.default_rng(28)
weight = rng.normal(size=(4, 5))
limit = 7
scale = max(float(np.max(np.abs(weight)))/limit, 1e-12)
integer = np.clip(np.round(weight/scale), -limit, limit).astype(np.int8)
reconstructed = integer.astype(float)*scale
error = reconstructed-weight
assert np.max(np.abs(error)) <= scale/2+1e-12
x = rng.normal(size=(2, 4))
actual = np.linalg.norm(x @ error)
bound = np.linalg.norm(x)*np.linalg.norm(error)
assert actual <= bound+1e-12
print('scale', scale, 'output error', actual, 'bound', bound)
```

Recorded output on the checked Python/NumPy environment:

```text
scale 0.3343869004438958 output error 0.8619986857257129 bound 1.4927999248301533
```


After a tuning run, compare desired-task quality, retained behavior, memory, latency, and calibration. Keep the adapter or merged checkpoint associated with the exact base version. A small file that loads successfully on the wrong base can produce a valid computation with unintended behavior. The next chapter considers two other ways to allocate capacity: route tokens through selected experts, and train a student using a teacher's distributions.
