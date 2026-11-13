# Predicting uncertainty: probability, information, and language likelihood

## A model must leave room for more than one continuation

After the prefix `the cat`, several next tokens may be plausible. A model that emits only one token hides how uncertain it is. A categorical distribution instead assigns one nonnegative probability to each candidate, with all probabilities adding to one. That distribution is a statement about the model's prediction under the supplied context. It is not automatically a probability that a factual claim is true.

Start with three candidates having probabilities $(0.5,0.3,0.2)$. Sampling chooses the first about half the time over many independent trials. It does not mean every pair of samples contains exactly one first-candidate result. The probability describes a process; a finite realization fluctuates. This difference between an expectation and an observed count will matter when we train reinforcement-learning policies.

## Probability, conditioning, and statistical estimation

### Uncertainty is represented by a distribution

A categorical variable chooses one label from a finite set. Its probabilities are nonnegative and sum to one. A language model assigns such a distribution to the next token, conditional on a prefix. It does not directly assign a truth value to a sentence.

The joint probability $p(a,b)$ is the probability both events occur. If $p(b)>0$, define $p(a\mid b)=p(a,b)/p(b)$. Multiplying gives $p(a,b)=p(a\mid b)p(b)$. Apply this repeatedly to obtain

$$p(x_1,\ldots,x_T)=\prod_{t=1}^Tp(x_t\mid x_{<t}).$$

This chain rule is exact and does not assume adjacent tokens are independent. A bigram model adds the simplifying assumption $p(x_t\mid x_{<t})=p(x_t\mid x_{t-1})$. A transformer relaxes that short-memory restriction within its available context.

### Bayes' rule with numbers

Suppose a document is relevant with prior probability $0.2$. A retrieval flag appears with probability $0.8$ for relevant documents and $0.1$ for irrelevant documents. The joint probability of relevant and flagged is $0.2\cdot0.8=0.16$. Total flag probability is $0.16+0.8\cdot0.1=0.24$. Consequently relevance given the flag is $0.16/0.24=2/3$. The denominator includes false positives; ignoring their base rate overstates confidence.

### Expectations and likelihood

For discrete $X$, $\mathbb E[f(X)]=\sum_xp(x)f(x)$. The expected reward is a probability-weighted sum of rewards, not necessarily a reward that is ever observed. Variance is $\mathbb E[(X-\mathbb EX)^2]$ and measures spread around that mean.

Observe a Bernoulli outcome $y\in\{0,1\}$ with success probability $p$. Its likelihood is $p^y(1-p)^{1-y}$, so its negative log-likelihood is $-y\log p-(1-y)\log(1-p)$. For independent samples, log-likelihoods add. Averaging rescales the objective; it does not change its unregularized minimizer.

With $s$ successes and $f$ failures, the maximum-likelihood estimate is $s/(s+f)$ when the total is positive. A Beta$(a,b)$ prior yields Beta$(a+s,b+f)$ posterior and mean $(a+s)/(a+b+s+f)$. This mean is a different estimator from the maximum-likelihood solution. It avoids zero probability in small samples when $a,b>0$.

### From mathematical probability to measurement

Dataset frequency estimates a probability under a sampling procedure. It need not represent future users. Correlated examples reduce the amount of independent information; duplicated test prompts can make an error bar look more convincing than it is. Conditional performance on one benchmark should not be interpreted as universal competence.

The experiment computes Bayes' rule by summing disjoint cases and evaluates a Bernoulli loss in logit space. The logit parameter is unconstrained, while its sigmoid always lies strictly between zero and one for finite exact inputs.

#### From a finite dataset to uncertainty

For three successes and one failure, the likelihood is $p^3(1-p)$. Its log derivative is $3/p-1/(1-p)$. Setting it to zero gives $3(1-p)=p$, hence $p=3/4$. The second derivative is $-3/p^2-1/(1-p)^2<0$, so this stationary point is a strict maximum of log-likelihood in $(0,1)$. A Beta$(1,1)$ prior instead gives posterior Beta$(4,2)$ and posterior mean $4/6=2/3$. The difference comes from using a prior and a posterior-mean estimator, not from a contradictory probability calculation.


## Conditioning is an update to the question being asked

The prior question is how likely a document is to be relevant before observing a retrieval flag. The conditional question asks how likely it is after the flag is known. The denominator in Bayes' rule accounts for all ways that observation could occur. It prevents us from treating a useful but imperfect signal as conclusive evidence.

The same discipline applies to token prediction. A conditional next-token distribution may change when the prefix changes. That dependence does not violate normalization: each fixed prefix defines its own distribution. A model can be uncertain after one prefix and confident after another without changing its parameters between the two queries.


### Executable calculation

Run `python examples/04_probability_conditioning.py` from the package root. Complete source is also included as [04_probability_conditioning.py](../examples/04_probability_conditioning.py).

```python
import numpy as np
prior, sensitivity, false_positive = 0.2, 0.8, 0.1
flagged = prior * sensitivity + (1 - prior) * false_positive
posterior = prior * sensitivity / flagged
assert np.allclose(posterior, 2 / 3)
logit = 0.7
probability = 1 / (1 + np.exp(-logit))
labels = np.array([1, 1, 0, 1])
loss = np.mean(np.logaddexp(0, logit) - labels * logit)
print('posterior', posterior, 'probability', probability, 'loss', loss)
```

Recorded output on the checked Python/NumPy environment:

```text
posterior 0.6666666666666666 probability 0.6681877721681662 loss 0.578186048885458
```


## Turn arbitrary scores into a normalized choice

Suppose a neural layer gives logits $(0,\log2,\log3)$. Exponentiating gives positive weights $(1,2,3)$. Their sum is six, so softmax probabilities are $(1/6,2/6,3/6)$. The logits themselves were not probabilities: they included zero and values greater than one, and they did not sum to one. Softmax converts relative score differences into a valid distribution.

Subtracting $\log3$ from every logit gives exponentials $(1/3,2/3,1)$, whose sum is two. Normalization produces exactly the same probabilities. This cancellation is the reason numerical implementations subtract the maximum. It is an algebraic invariance that becomes a stability technique.

## Entropy, KL divergence, softmax, and cross-entropy

### A loss that respects probabilities

A model outputs scores, also called logits, rather than unconstrained probabilities. For a finite vector $z$, softmax produces $p_i=e^{z_i}/\sum_je^{z_j}$. Every entry is positive and the sum is one. Adding the same constant to all logits leaves the probabilities unchanged because that factor cancels from numerator and denominator.

For logits $(0,\log2)$, exponentials are $(1,2)$, so probabilities are $(1/3,2/3)$. Subtracting the largest logit before exponentiation gives $(1/2,1)$ with the same normalized result. This shift prevents overflow without changing the exact function.

### Information in a prediction

The surprisal of event $i$ under $q$ is $-\log q_i$. Entropy is $H(p)=-\sum_i p_i\log p_i$. Cross-entropy is $H(p,q)=-\sum_i p_i\log q_i$. Subtract them:

$$H(p,q)-H(p)=\sum_i p_i\log\frac{p_i}{q_i}=D_{KL}(p\Vert q).$$

KL is nonnegative when distributions have compatible support. One proof uses $\log u\le u-1$: substitute $u=q_i/p_i$, multiply by $p_i$, sum, and negate. The sums of both distributions are one, giving a lower bound of zero. Terms with $p_i=0$ contribute zero by continuity. If $p_i>0$ and $q_i=0$, KL is infinite. KL is asymmetric and generally not a metric.

### Derive the famous gradient

For target class $y$, $L=-\log p_y=-z_y+\log\sum_j e^{z_j}$. Differentiate with respect to $z_k$. The first term contributes $-1$ only if $k=y$. The second contributes $e^{z_k}/\sum_j e^{z_j}=p_k$. Thus

$$\frac{\partial L}{\partial z_k}=p_k-\mathbf1[k=y].$$

For a soft target distribution $q$, replace the indicator by $q_k$. This result assumes the loss is a sum for one example. A batch mean divides gradients by the number of included examples. Averaging over padded positions changes the objective unless their loss is masked.

Perplexity is $\exp(L)$ when loss uses natural logarithms. A uniform distribution over four tokens has loss $\log4$ and perplexity four. Comparing perplexity across different tokenizers is generally misleading because a token represents a different amount of text.

### Numerical and conceptual failure cases

Computing softmax, taking log, and then selecting a very improbable class can underflow. Use log-softmax directly. Also distinguish a low-entropy model from a correct model: a confidently wrong prediction has low entropy and high loss. Entropy describes uncertainty in the model distribution, not whether the model deserves that confidence.

The experiment independently checks the logit gradient and the entropy decomposition. Zero-probability handling is unnecessary here because every chosen probability is positive.

#### Derive the softmax Jacobian directly

Write $p_i=e^{z_i}/Z$ with $Z=\sum_j e^{z_j}$. The quotient rule gives $\partial p_i/\partial z_k=(\mathbf1[i=k]e^{z_i}Z-e^{z_i}e^{z_k})/Z^2$. Divide each term by $Z$ to get $p_i(\mathbf1[i=k]-p_k)$. For two equal logits, both probabilities are $1/2$, so the Jacobian is $\begin{pmatrix}1/4&-1/4\\-1/4&1/4\end{pmatrix}$. Multiplying by $(1,1)^\top$ gives zero: moving both logits together does not change probabilities. The null direction is exactly the common-shift invariance.


## Why log loss punishes confident errors

For a correct token assigned probability 0.8, negative log-probability is about 0.2231. At probability 0.1, it is about 2.3026. At probability 0.001, it is about 6.9078. These are not arbitrary penalty values: logarithms turn products of conditional probabilities into sums, so token losses add into sequence negative log-likelihood.

If a model assigns exact zero to an event that occurs, the log loss is infinite. Smoothing in a count model avoids this in small datasets. Finite-logit softmax gives strictly positive probabilities in exact arithmetic, but an unstable implementation can still underflow to zero. Computing log-softmax directly avoids unnecessarily taking the logarithm of an already rounded tiny probability.

Entropy measures spread under a distribution. Cross-entropy evaluates one distribution using another. Their difference is KL divergence, which quantifies a mismatch under a particular weighting direction. Keep the arguments in order. A teacher-weighted expectation and a student-weighted expectation ask different questions, even when both are called a KL loss.


### Executable calculation

Run `python examples/05_entropy_softmax.py` from the package root. Complete source is also included as [05_entropy_softmax.py](../examples/05_entropy_softmax.py).

```python
import numpy as np
from core import softmax, log_softmax, finite_difference
scores = np.array([0.2, -0.3, 0.8])
target = np.array([0.1, 0.2, 0.7])
def loss(values):
    return -np.sum(target * log_softmax(values))
analytic = softmax(scores) - target
assert np.allclose(analytic, finite_difference(loss, scores), atol=1e-7)
entropy = -np.sum(target * np.log(target))
kl = np.sum(target * (np.log(target) - log_softmax(scores)))
assert np.allclose(loss(scores), entropy + kl)
print('loss', loss(scores), 'entropy', entropy, 'KL', kl)
```

Recorded output on the checked Python/NumPy environment:

```text
loss 0.9121664402303955 entropy 0.8018185525433373 KL 0.11034788768705825
```


## Expand a sequence probability one conditional at a time

For three tokens $a,b,c$, the joint probability is $p(a)p(b\mid a)p(c\mid a,b)$. This follows by multiplying the definition of conditional probability twice. No short-memory assumption was needed. A bigram model deliberately replaces the last conditional by $p(c\mid b)$, forgetting the earlier token. That simplification makes counting easy but limits what patterns the model can represent.

A transformer will retain a wider prefix through contextual hidden states, but the chain-rule factorization stays the same. Architectural sophistication changes how a conditional is computed; it does not remove the need to define the conditional distribution or the training target.

## Read a mean log loss as a geometric mean probability

If N included targets have probabilities $p_1,\ldots,p_N$, their mean negative log loss is $L=-N^{-1}\sum_i\log p_i$. Negating and exponentiating gives $e^{-L}=(\prod_i p_i)^{1/N}$, the geometric mean target probability. This is not the arithmetic mean probability and not the fraction of correctly chosen tokens. For probabilities 0.9 and 0.1, the geometric mean is 0.3 while the arithmetic mean is 0.5. Log loss strongly registers the poorly predicted case. Perplexity is the reciprocal of that geometric mean under the stated tokenization and weighting. This identity is a useful way to interpret a reported loss without turning it into an unsupported task-accuracy claim.

## Language modeling from counts to autoregression

### Start with a problem small enough to solve exactly

Given a prefix, predict the next token. A bigram table stores a distribution for every previous token. Counting transitions supplies the maximum-likelihood estimate, but an unseen transition receives probability zero. One such event makes the probability of the whole sequence zero. Smoothing trades exact fit for more robust estimates.

Let $C_{ij}$ count transitions from token $i$ to token $j$, with vocabulary size $V$. Add-$\alpha$ smoothing defines $p(j\mid i)=(C_{ij}+\alpha)/(\sum_k C_{ik}+\alpha V)$ for $\alpha>0$. Summing the numerators over $j$ reproduces the denominator, proving normalization. A row with no observations becomes uniform. Smoothing is a prior-like modeling choice, not evidence that all transitions actually occur.

For counts $(3,1,0)$ and $\alpha=1$, probabilities become $(4,2,1)/7$. The observed first token's probability decreases from $3/4$ to $4/7$ because some mass is reserved for uncertainty. In a neural model, shared parameters permit statistical generalization across prefixes; a count table has no such learned representation.

### Factor a sequence, then form training pairs

For tokens $(a,b,c,d)$, inputs are $(a,b,c)$ and labels are $(b,c,d)$. Position zero predicts $b$ from $a$; it must not see $b$ in its input state. Causal masking preserves this rule while allowing all positions' losses to be computed in one training pass. Teacher forcing provides the correct preceding tokens during training. During generation, the model conditions on its own earlier outputs, so errors can change the future prefix distribution.

The training objective is $L=-N^{-1}\sum_{n,t}\log p_\theta(x_t^{(n)}\mid x_{<t}^{(n)})$, with $N$ the number of included target positions. A token mean and an example mean differ when sequence lengths vary. Specify the denominator rather than saying only 'average loss.'

### Train and validation are different questions

Training loss measures fit to observed examples. Validation loss estimates generalization to a chosen held-out population. Split whole documents before producing overlapping windows; otherwise almost identical text can appear in both sets. A chronological split may be appropriate for forecasting, while a source or domain split tests another kind of generalization.

A small model that memorizes `abac` can achieve low loss without learning natural language. That is acceptable for verifying shifting, masking, gradient flow, and sampling. It is not a substitute for a realistic evaluation.

The code builds a smoothed transition model and computes a sequence loss. The first token is treated as given; a complete document model also needs a beginning distribution and an end-of-sequence convention. This distinction prevents an off-by-one mismatch between the stated probability and the implemented one.

#### A normalized joint needs a stopping convention

Suppose vocabulary is $\{a,\mathrm{EOS}\}$ and each step emits EOS with probability $q\in(0,1)$. The probability of exactly $n$ copies of $a$ followed by EOS is $(1-q)^nq$. Summing over $n\ge0$ gives $q/[1-(1-q)]=1$. Thus the model defines a normalized distribution over finite strings. If EOS probability were always zero, no finite output would terminate under this process. Fixed-length sequence likelihood and variable-length generation are different specifications. Explicit stopping rules matter both to mathematical normalization and to practical token budgets.


## Walk through shifting before trusting training loss

For sequence `(0,1,2,3)`, create inputs `(0,1,2)` and labels `(1,2,3)`. The first output distribution must predict one from the prefix containing zero. The second predicts two from zero and one. If we use identical input and label arrays without the intended shift, the model may learn to copy visible tokens instead of predicting unseen next tokens.

The causal mask and the label shift solve complementary problems. The shift says which token is the target. The mask says which input positions are visible while predicting it. Both can be individually well formed while jointly implementing the wrong task. Decode a tiny example and write each input prefix beside its target before running a long experiment.


### Executable calculation

Run `python examples/07_language_modeling.py` from the package root. Complete source is also included as [07_language_modeling.py](../examples/07_language_modeling.py).

```python
import numpy as np
sequence = np.array([0, 1, 0, 2, 0, 1, 0, 2])
vocabulary, alpha = 3, 1.0
counts = np.zeros((vocabulary, vocabulary))
np.add.at(counts, (sequence[:-1], sequence[1:]), 1)
probability = (counts + alpha) / (counts.sum(axis=1, keepdims=True) + alpha * vocabulary)
assert np.allclose(probability.sum(axis=1), 1)
loss = -np.log(probability[sequence[:-1], sequence[1:]]).mean()
print('counts', counts, 'loss', loss, 'perplexity', np.exp(loss))
```

Recorded output on the checked Python/NumPy environment:

```text
counts [[0. 2. 2.]
 [2. 0. 0.]
 [1. 0. 0.]] loss 0.7291414099486773 perplexity 2.07329972874055
```


## Use likelihood without overstating it

A low average token loss indicates that the model assigns relatively high probability to the evaluated targets under their provided prefixes. It does not establish that sampled long answers will be correct. During sampling, one unusual token changes future prefixes; those new prefixes may be unlike the training examples. Later evaluation chapters separate teacher-forced likelihood from task success, calibration, and evidence support.

The companion's **Probability and information** experiment lets you change logits and a target class. It shows normalized probabilities, target log loss, entropy, and the gradient `probability minus target`. Raising the correct logit usually decreases that target loss; raising all logits together does not change anything. The latter intervention is an excellent way to check whether the implementation respects softmax's shift invariance.

A final probability convention matters: a target with positive probability under one distribution and zero probability under another can make KL infinite. Check support before treating every divergence as a finite number.

We can now represent a sequence, differentiate a loss, and interpret a distribution. Before building attention, we need to understand what the sequence elements represent and how earlier models stored information across time. Tokenization and embeddings provide the input vocabulary; recurrence shows the bottleneck that attention addresses.
