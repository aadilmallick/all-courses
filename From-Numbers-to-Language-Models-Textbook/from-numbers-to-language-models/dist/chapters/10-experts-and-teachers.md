# Allocating capacity: mixtures of experts and knowledge distillation

## Two questions that sound similar but are not

How can a model store more parameters without using all of them for every token? How can a smaller model learn useful behavior from a larger one? The first question motivates conditional computation and mixtures of experts. The second motivates distillation. Both concern resource allocation, but they change different parts of the learning system.

An MoE can have many stored experts while activating only a few per token. A distilled student usually has its own fixed architecture and learns from teacher outputs or distributions. The teacher need not be present when the student is deployed. An MoE router, by contrast, remains part of the deployed computation because it decides which expert branches to execute.

## Start with a two-expert scalar calculation

Suppose expert zero returns two, expert one returns eight, and a gate assigns probabilities 0.25 and 0.75. A dense mixture returns $0.25\cdot2+0.75\cdot8=6.5$. A top-one design could select only expert one. If it keeps the original gate weight, output is six. If it renormalizes over the selected set, output is eight. Three reasonable-looking snippets implement three different functions.

We must specify which one we mean before differentiating or counting work. In particular, a renormalized top-one weight is identically one within a fixed selection region. The task's smooth gate-weight derivative then disappears through that path. A router can still receive other signals under a method's chosen design, but those signals are not supplied by the name MoE alone.

## Mixture-of-experts routing, capacity, and balancing

### Conditional computation separates capacity from active work

A dense feed-forward sublayer applies all its weights to each token. A sparse mixture-of-experts layer chooses a small number of expert networks per token. A router maps hidden vector $x$ to logits $r=xW_r$, probabilities $p=\operatorname{softmax}(r)$, and selected expert IDs. The output combines selected expert results under a stated weighting rule.

For selected set $S(x)$, one convention is $y=\sum_{e\in S}\widetilde p_eE_e(x)$ where $\widetilde p$ renormalizes probabilities within the selected set. Another keeps original router probabilities. These define different functions and gradients. In particular, renormalized top-one weight is always one, so the task loss provides no ordinary smooth router-weight gradient through that weight alone. Discrete selection requires other training mechanisms or weighting choices.

### Capacity is a systems constraint

With $N$ tokens, $E$ experts, $k$ selections per token, and capacity factor $c$, a simple per-expert capacity is $\lceil cNk/E\rceil$. This is one convention; implementations differ. If assignments exceed capacity, a system may drop, reroute, or process overflow. Dropping an expert branch can leave the token's residual stream intact while still losing that expert computation.

For $N=8,E=4,k=1,c=1$, capacity is two assignments per expert. If six tokens choose expert zero, four assignments overflow there even though other experts are underused. Total nominal capacity being adequate does not guarantee balanced dispatch.

### Load balancing is not a proof of specialization

A common auxiliary term combines assignment fractions $f_e$ and mean routing probabilities $P_e$ as $E\sum_e f_eP_e$. The discrete assignments are treated according to the method's gradient convention, often with no derivative through argmax. This loss encourages aggregate utilization but does not guarantee meaningful semantic expert specialization or optimal task accuracy.

Router instability, outlier activations, uneven token lengths, and all-to-all communication complicate training. Total parameter count determines weight storage, while active experts influence per-token arithmetic. Communication and expert placement determine much of the practical latency.

The code implements a clearly specified top-one router with original softmax weights, counts capacity overflow without silently changing outputs, and computes a balancing statistic. It is a local mathematical example, not a distributed MoE kernel.

Optional application: set all router logits equal. A deterministic argmax tie rule may send every token to expert zero despite uniform probabilities. This shows why probability balance and actual dispatch balance must both be monitored.

#### Top-one normalization can remove a gradient path

If one selected expert's weight is renormalized by the sum over the selected set, it becomes $p_e/p_e=1$. Within a fixed selection region, differentiating that weight with respect to router logits gives zero. Using the original $p_e$ instead retains a smooth magnitude path, while the argmax choice remains discrete. This is a small but important implementation distinction: two snippets both described as top-one MoE can train differently. Router auxiliary losses, noise, and specialized estimators can add other signals, but they must be specified rather than assumed.


## Separate assignments from probabilities

A probability vector is smooth in its logits. Selecting the largest entry creates a discrete assignment. A balancing statistic can depend on both, and they can disagree dramatically. If all router logits are equal, probabilities are uniform. A deterministic tie rule can nevertheless assign every token to expert zero. Looking only at mean probabilities would miss the dispatch imbalance.

During debugging, record token counts per expert, mean probabilities, overflow or dropped assignments, and task loss separately. If a few experts receive nearly all tokens, ask whether the cause is initialization, tie handling, a routing objective, data skew, or capacity behavior. Increasing capacity can reduce dropped work while leaving the routing imbalance unresolved.

## Work a capacity example without hiding overflow

With twelve tokens, four experts, top-two selection, and capacity factor one, nominal assignment count is 24 and a simple capacity formula gives six assignments per expert. If expert zero receives ten assignments, four overflow there even if another expert receives only two. Total available slots equal total assignments, yet distribution prevents all work from fitting under the per-expert cap.

What happens to overflow is part of the algorithm. Dropping the expert branch, rerouting to another expert, and processing extra work dynamically have different quality and system costs. A residual stream can keep a dropped token alive while still omitting the expert transformation it was meant to receive. 'Token not dropped from the sequence' does not imply 'no computation was lost.'


### Executable calculation

Run `python examples/29_mixture_of_experts.py` from the package root. Complete source is also included as [29_mixture_of_experts.py](../examples/29_mixture_of_experts.py).

```python
import numpy as np
from core import softmax
rng = np.random.default_rng(29)
x = rng.normal(size=(8, 3))
router = rng.normal(size=(3, 4))
experts = rng.normal(size=(4, 3, 3))
probability = softmax(x @ router)
chosen = probability.argmax(axis=1)
output = np.stack([probability[t, e]*(x[t] @ experts[e]) for t, e in enumerate(chosen)])
counts = np.bincount(chosen, minlength=4)
capacity = int(np.ceil(len(x)/4))
overflow = np.maximum(counts-capacity, 0).sum()
fraction = counts/len(x)
balance = 4*np.sum(fraction*probability.mean(axis=0))
print('assignments', counts, 'overflow', overflow, 'balance', balance, 'shape', output.shape)
```

Recorded output on the checked Python/NumPy environment:

```text
assignments [2 3 1 2] overflow 1 balance 1.0051254686339979 shape (8, 3)
```


## Sparse activation is not free storage

Only a few experts may run per token, but all expert weights need to be available somewhere. Expert parallelism can distribute them across devices, requiring token dispatch and result collection. Computation savings can be offset by communication, uneven loads, and small inefficient batches. Total parameters, active parameters, memory capacity, bandwidth, and latency are distinct measures.

A fair comparison states which measure is held fixed. Equal total parameters may give different active work. Equal active work may give different storage. Equal wall time depends on hardware and implementation. The browser experiment deliberately focuses on routing arithmetic and capacity, while the book treats distributed execution as an engineering extension requiring actual measurement.

## Change the question: learn from a teacher

Now suppose a teacher assigns probabilities `(0.7,0.2,0.1)` to three candidate tokens. A hard target would preserve only the chosen class. A soft target tells the student that the second candidate is more plausible than the third. Matching that structure can transfer useful information, provided the teacher's distribution is useful for the task.

Teacher output is not truth by definition. If the teacher is systematically wrong about a domain, a well-trained student can reproduce the error. If teacher responses are generated with a privileged context unavailable at deployment, the student may be asked to imitate behavior without the information that caused it. Distillation design includes the input distribution and available evidence, not just a loss formula.

## Distinguish compression of parameters from compression of behavior

A student can have fewer parameters while storing a different approximation to the teacher's function. Distillation does not copy a collection of independent facts from one memory box to another. It optimizes the student's predictions on selected inputs under a chosen loss. Which inputs are selected determines which aspects of behavior are practiced, and the student's architecture constrains which relationships it can represent.

Suppose the teacher is uncertain between two valid answers but the dataset stores only one sampled answer each time. Sequence-level training sees those samples over repeated examples; token-level distribution matching can expose uncertainty on each example directly. Neither signal is universally better. The distributional target may be expensive to obtain or incompatible with the student's vocabulary, while sampled text can be filtered and evaluated under an explicit task contract.

A practical compression record should therefore describe teacher identity, student architecture, input and prefix distribution, target construction, loss direction, temperature, and held-out evaluation. Without these, a claim that one model is a distilled version of another leaves most of the training procedure unspecified.

Also measure the deployment system. A smaller matrix can run inefficiently on a device optimized for another shape. A lower-bit format may require dequantization overhead. A compact student may need more generated tokens to solve a task. Parameter count is one resource indicator, while latency, memory, energy, and answer quality describe other consequences. Holding those distinctions throughout the experiment lets you explain what was actually gained and what was traded away.

## Knowledge distillation, temperature, and prefix distributions

### A student can learn from distributions

A hard label says which class is correct. A teacher distribution also encodes relative alternatives. Classical distillation trains student probabilities to match softened teacher probabilities, often combined with a hard-label loss. Teacher confidence is not equivalent to truth, so matching a teacher can transfer its mistakes.

Let $p_T=\operatorname{softmax}(z_T/\tau)$ and $p_S=\operatorname{softmax}(z_S/\tau)$. A conventional loss is $\tau^2D_{KL}(p_T\Vert p_S)$. Holding the teacher fixed, differentiate with respect to student logits:

$$\frac{\partial L}{\partial z_{S,k}}=\tau(p_{S,k}-p_{T,k}).$$

The softmax cross-entropy derivative contributes the probability difference, the division by temperature contributes $1/\tau$, and the prefactor contributes $\tau^2$. Their product is $\tau$. The scaling convention is motivated partly by high-temperature gradient behavior; it does not make all temperatures equivalent.

### Direction of divergence changes the target behavior

Forward KL penalizes failing to assign mass where the teacher assigns mass. Reverse KL weights expectations under the student and can favor concentrating on modes. These descriptions are heuristics whose practical effect depends on support, model class, and optimization. If the teacher assigns zero mass where the student is positive, reverse KL can be infinite. Finite logits avoid exact zeros in exact arithmetic, but numerical underflow still matters.

Sequence-level distillation trains on teacher-generated responses as targets. Token-level distillation matches distributions at each supplied prefix. The prefix source is crucial: teacher-generated, dataset, and student-generated prefixes expose different states. A student may imitate well on teacher prefixes but drift during its own rollout.

### On-policy is a distribution choice

On-policy distillation collects prefixes from the student and asks for teacher guidance there. This can address rollout mismatch but requires teacher coverage and reliable feedback on those states. It does not create a theorem that the student must improve. Using teacher-only hidden data at training time can create a mismatch with deployment context.

Compression evaluation should include held-out tasks, out-of-domain behavior, calibration, and actual serving cost. Fewer parameters may not yield proportional speed improvements on a given backend. Synthetic data provenance and teacher/model permissions are practical parts of a reproducible distillation experiment.

The code checks the temperature-scaled gradient against finite differences. It freezes teacher logits and computes stable log-probabilities. The lesson's scalar audit studies a binary soft-target objective; it is the local component of distillation, not a full student-training claim.

#### A temperature calculation with all factors visible

For two student logits $(x,0)$ and teacher target $(q,1-q)$ at temperature $\tau$, the teacher-dependent cross-entropy term is $\tau^2[\log(1+e^{x/\tau})-qx/\tau]$. Differentiate: the logarithm contributes $\sigma(x/\tau)/\tau$, and the linear term contributes $-q/\tau$. Multiplying by $\tau^2$ yields $\tau(\sigma(x/\tau)-q)$. The second derivative is $\sigma(x/\tau)(1-\sigma(x/\tau))$. This verifies the code's scale and shows that matching the same softened target under a different temperature is still a different objective.


## Derive the student's pressure for a concrete distribution

Let student probabilities be `(0.4,0.4,0.2)` and teacher target be `(0.7,0.2,0.1)` at temperature one. The cross-entropy logit gradient is student minus teacher: `(-0.3,0.2,0.1)`. Descent raises the first logit and lowers the others. The components add to zero, reflecting the fact that a common logit shift cannot affect probabilities.

The loss does not separately command each probability to move by exactly those amounts. Parameters change logits, and softmax couples the resulting probabilities. The gradient specifies a local direction in logit space; the actual probability change depends on learning rate and the softmax Jacobian. This is the same local-versus-finite distinction we established in Chapter 2.


### Executable calculation

Run `python examples/30_knowledge_distillation.py` from the package root. Complete source is also included as [30_knowledge_distillation.py](../examples/30_knowledge_distillation.py).

```python
import numpy as np
from core import softmax, log_softmax, finite_difference
teacher = np.array([2., 0.5, -1.])
student = np.array([0.2, -0.1, 0.4])
temperature = 2.0
teacher_p = softmax(teacher/temperature)
teacher_logp = log_softmax(teacher/temperature)
def objective(logits):
    return temperature**2*np.sum(teacher_p*(teacher_logp-log_softmax(logits/temperature)))
analytic = temperature*(softmax(student/temperature)-teacher_p)
numeric = finite_difference(objective, student)
assert np.allclose(analytic, numeric, atol=1e-7)
print('distillation loss', objective(student), 'gradient', analytic)
```

Recorded output on the checked Python/NumPy environment:

```text
distillation loss 0.7258984752800344 gradient [-0.50525896  0.02320531  0.48205365]
```


## Temperature changes what alternatives are visible

Dividing logits by a temperature greater than one flattens the distribution. Alternatives that were nearly invisible can receive more mass and therefore more learning weight. A lower temperature makes the target sharper. The conventional temperature-squared factor is a scaling choice motivated by gradient behavior; it does not make the objectives identical or remove the need to tune the optimizer.

When the teacher and student have different vocabularies, token-level distributions cannot be compared entry by entry without an alignment scheme. Sequence-level distillation can train on text outputs using the student's tokenizer, but it supplies a different signal. Check the representation and support before writing a KL term.

## The prefix distribution decides where imitation is practiced

A teacher-generated answer visits prefixes the teacher tends to produce. A student rollout visits prefixes the student tends to produce, including its mistakes. A student can match the teacher well on the first distribution and behave poorly on the second. On-policy guidance asks for teacher feedback at student-visited prefixes, addressing that mismatch under the teacher's coverage and reliability limits.

This does not mean on-policy is universally better. It can be more expensive, expose states where teacher answers are unreliable, or reduce diversity. State where data came from and which expectation the loss approximates. The same mathematical divergence can have a different practical meaning under another prefix distribution.

## Use a small comparison before making a compression claim

The companion's **Experts and teachers** experiment displays a router's probabilities, selected expert, capacity counts, and a temperature-scaled distillation gradient. Reset restores the fixtures. Changing temperature changes actual probabilities and derivatives; it does not replay a stored animation. The local examples keep the algebra inspectable while the implementation notes explain what a production system would still need.

A compression claim should compare held-out task quality and real serving cost. If a smaller student becomes faster but loses a critical capability, the tradeoff is not summarized by parameter count alone. If a sparse model stores many experts but routes inefficiently on the target hardware, low active arithmetic may not yield useful latency. These observations are why evaluation accompanies every architecture and objective in this book.

A zero KL means identical teacher and student distributions on the evaluated support. Their cross-entropy can still be positive because it includes the teacher's own entropy. Compare the correct quantity when diagnosing an apparent nonzero minimum.

We now leave supervised prediction and imitation to study actions whose consequences affect future observations. Probability and gradients remain our tools, but the distribution of data will become part of the policy's behavior.
