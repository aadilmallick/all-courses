# 07. Probability, conditional reasoning, and Bayes theorem

[Previous](06-multivariable-calculus.md) · [Course index](../README.md) · [Next](08-random-variables-distributions.md)

## Uncertainty has a sample space

An experiment has possible outcomes $\Omega$. An event is a set of outcomes. A probability assigns nonnegative mass, gives the entire sample space mass one, and adds masses of disjoint events. For a fair die, the event “even” contains 2, 4, and 6, so its probability is $3/6=1/2$.

Conditional probability restricts attention to an observed event: $P(A\mid B)=P(A\cap B)/P(B)$ when $P(B)>0$. Multiplying by $P(B)$ gives the product rule. Applying the product rule in both orders yields Bayes' theorem:

$$P(A\mid B)=\frac{P(B\mid A)P(A)}{P(B)}.$$

The denominator normalizes the alternatives. If mutually exclusive classes $C_j$ cover the possibilities, $P(B)=\sum_jP(B\mid C_j)P(C_j)$. Every term has a meaning, and the result must sum to one over classes.

## A base-rate calculation

Suppose 1% of manufactured parts are defective. A screening flag appears on 90% of defective parts and 5% of good parts. Out of 10,000 expected parts, 100 are defective and 9,900 are good. The flag catches 90 defective parts and incorrectly flags 495 good parts. Thus the fraction defective among flagged parts is $90/(90+495)\approx0.1538$.

A 90% sensitivity did not produce a 90% posterior probability. The many good parts generate more false flags in total. This example will return when we study precision, imbalance, and calibration.

## Independence is a specific mathematical assertion

Events are independent if $P(A\cap B)=P(A)P(B)$. Conditional independence is a different assertion: $P(A,B\mid C)=P(A\mid C)P(B\mid C)$. Two words can be correlated overall because both are common in a topic yet become closer to independent after conditioning on the topic. Naive Bayes assumes conditional independence given the class; it does not assume that every feature is unconditionally independent.

The probability chain rule does not require independence:

$$P(x_1,x_2,x_3)=P(x_1)P(x_2\mid x_1)P(x_3\mid x_1,x_2).$$

An autoregressive language model parameterizes these conditional distributions. The factorization is exact; approximations enter through the selected model class and finite training data.

## Further worked conditioning and code
## Uncertainty is represented by a distribution

A categorical variable chooses one label from a finite set. Its probabilities are nonnegative and sum to one. A language model assigns such a distribution to the next token, conditional on a prefix. It does not directly assign a truth value to a sentence.

The joint probability $p(a,b)$ is the probability both events occur. If $p(b)>0$, define $p(a\mid b)=p(a,b)/p(b)$. Multiplying gives $p(a,b)=p(a\mid b)p(b)$. Apply this repeatedly to obtain

$$p(x_1,\ldots,x_T)=\prod_{t=1}^Tp(x_t\mid x_{<t}).$$

This chain rule is exact and does not assume adjacent tokens are independent. A bigram model adds the simplifying assumption $p(x_t\mid x_{<t})=p(x_t\mid x_{t-1})$. A transformer relaxes that short-memory restriction within its available context.

## Bayes' rule with numbers

Suppose a document is relevant with prior probability $0.2$. A retrieval flag appears with probability $0.8$ for relevant documents and $0.1$ for irrelevant documents. The joint probability of relevant and flagged is $0.2\cdot0.8=0.16$. Total flag probability is $0.16+0.8\cdot0.1=0.24$. Consequently relevance given the flag is $0.16/0.24=2/3$. The denominator includes false positives; ignoring their base rate overstates confidence.

## Expectations and likelihood

For discrete $X$, $\mathbb E[f(X)]=\sum_xp(x)f(x)$. The expected reward is a probability-weighted sum of rewards, not necessarily a reward that is ever observed. Variance is $\mathbb E[(X-\mathbb EX)^2]$ and measures spread around that mean.

Observe a Bernoulli outcome $y\in\{0,1\}$ with success probability $p$. Its likelihood is $p^y(1-p)^{1-y}$, so its negative log-likelihood is $-y\log p-(1-y)\log(1-p)$. For independent samples, log-likelihoods add. Averaging rescales the objective; it does not change its unregularized minimizer.

With $s$ successes and $f$ failures, the maximum-likelihood estimate is $s/(s+f)$ when the total is positive. A Beta$(a,b)$ prior yields Beta$(a+s,b+f)$ posterior and mean $(a+s)/(a+b+s+f)$. This mean is a different estimator from the maximum-likelihood solution. It avoids zero probability in small samples when $a,b>0$.

## From mathematical probability to measurement

Dataset frequency estimates a probability under a sampling procedure. It need not represent future users. Correlated examples reduce the amount of independent information; duplicated test prompts can make an error bar look more convincing than it is. Conditional performance on one benchmark should not be interpreted as universal competence.

The experiment computes Bayes' rule by summing disjoint cases and evaluates a Bernoulli loss in logit space. The logit parameter is unconstrained, while its sigmoid always lies strictly between zero and one for finite exact inputs.

### From a finite dataset to uncertainty

For three successes and one failure, the likelihood is $p^3(1-p)$. Its log derivative is $3/p-1/(1-p)$. Setting it to zero gives $3(1-p)=p$, hence $p=3/4$. The second derivative is $-3/p^2-1/(1-p)^2<0$, so this stationary point is a strict maximum of log-likelihood in $(0,1)$. A Beta$(1,1)$ prior instead gives posterior Beta$(4,2)$ and posterior mean $4/6=2/3$. The difference comes from using a prior and a posterior-mean estimator, not from a contradictory probability calculation.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

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

### Code structure and observed intermediate values


#### Stage 2

```python
prior, sensitivity, false_positive = 0.2, 0.8, 0.1
```

An observed state during this stage was:

- `prior`: `0.2`
- `sensitivity`: `0.8`
- `false_positive`: `0.1`

#### Stage 3

```python
flagged = prior * sensitivity + (1 - prior) * false_positive
```

An observed state during this stage was:

- `flagged`: `0.24`

#### Stage 4

```python
posterior = prior * sensitivity / flagged
```

An observed state during this stage was:

- `posterior`: `0.66666667`

#### Stage 5

```python
assert np.allclose(posterior, 2 / 3)
```

#### Stage 6

```python
logit = 0.7
```

An observed state during this stage was:

- `logit`: `0.7`

#### Stage 7

```python
probability = 1 / (1 + np.exp(-logit))
```

An observed state during this stage was:

- `probability`: `0.66818777`

#### Stage 8

```python
labels = np.array([1, 1, 0, 1])
```

An observed state during this stage was:

- `labels`: `[1 1 0 1]`

#### Stage 9

```python
loss = np.mean(np.logaddexp(0, logit) - labels * logit)
```

An observed state during this stage was:

- `loss`: `0.57818605`

#### Stage 10

```python
print('posterior', posterior, 'probability', probability, 'loss', loss)
```

Run from the course root:

```bash
python code/neural/04_probability_conditioning.py
```

### Recorded output from the supplied environment

```text
posterior 0.6666666666666666 probability 0.6681877721681662 loss 0.578186048885458
```


## Independence can disappear after conditioning

Take two independent fair binary variables $A,B$, and let $C$ be the event that they are equal. Before conditioning, $P(A=1,B=1)=1/4=P(A=1)P(B=1)$. Given $C$, only $(0,0)$ and $(1,1)$ remain. Then $P(A=1,B=1\mid C)=1/2$, while the product of the conditional marginals is $1/4$. Conditioning created dependence.

This counterexample explains why conditional and unconditional independence cannot be exchanged casually. In a causal graph, conditioning on a shared consequence can induce an analogous selection effect. In naive Bayes, the independence assumption is explicitly given the class; marginal correlation alone does not directly test that assumption.

The law of total probability also prevents a common normalization error. If a class prior is 0.2 and a feature likelihood is 0.8, their product 0.16 is a joint probability, not the posterior. The alternative classes contribute additional joint mass to the denominator. Only after summing those alternatives can the posterior be computed.
