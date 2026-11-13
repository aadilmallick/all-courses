# 15. Sampling, class imbalance, weighting, and decision thresholds

[Previous](14-data-preparation.md) · [Course index](../README.md) · [Next](16-data-quality-privacy.md)

## Three different reasons to sample

Sampling can estimate a population, construct a training minibatch, or select candidate negatives. These tasks require different interpretations. A simple random sample supports population estimates under its design. Stratification samples within groups. Cluster sampling selects collections of related observations and changes variance calculations. Negative sampling replaces an expensive comparison against all alternatives with selected comparisons; its objective may differ from full softmax likelihood.

If a population has strata with proportions $\pi_k$ and stratum means $\mu_k$, the population mean is $\sum_k\pi_k\mu_k$. Sampling equal numbers per stratum and averaging without weights estimates an equal-stratum mean instead. Neither quantity is inherently wrong, but they answer different questions.

## Importance weighting

Suppose training observations come from $q(x,y)$ but the desired risk uses $p(x,y)$. If $q>0$ wherever $p>0$, then

$$E_p[\ell]=\int q(x,y)\frac{p(x,y)}{q(x,y)}\ell\,dxdy=E_q[w\ell].$$

The equality is exact when the density ratio is correct. Missing support cannot be repaired by reweighting: no finite weight creates examples that were never sampled. Large weights can create high variance, and estimated or clipped weights introduce their own error or bias.

## Class imbalance and meaningful evaluation

A 99% negative dataset permits 99% accuracy by always predicting negative. Precision asks what fraction of predicted positives are correct. Recall asks what fraction of actual positives are found. Both depend on the operating threshold; precision also depends strongly on class prevalence. A balanced validation set can therefore give precision values that do not represent deployment prevalence.

Oversampling minority examples changes the training distribution. Class-weighted losses change the objective. Synthetic oversampling should occur within each training fold, after appropriate preprocessing; applying it before splitting can generate related points across partitions. None of these interventions guarantees calibrated deployment probabilities.

## Derive a cost threshold

Let $p=P(Y=1\mid x)$, false-positive cost $C_{FP}$, and false-negative cost $C_{FN}$, with correct decisions assigned zero cost. Predicting positive has expected cost $C_{FP}(1-p)$. Predicting negative has expected cost $C_{FN}p$. Choose positive when $C_{FP}(1-p)<C_{FN}p$, which rearranges to

$$p>\frac{C_{FP}}{C_{FP}+C_{FN}}.$$

If missing a failure costs nine times a false alarm, the threshold is 0.1, provided the probabilities and costs correspond to deployment. Selecting this threshold by test-set performance would leak a decision into evaluation.

## Hard negatives and focal loss

A hard negative resembles a positive under the current model. Mining it can focus training on confusing distinctions, but may overemphasize annotation errors or false negatives. Sampled negatives are not necessarily true negatives. Preserve a mechanism to audit them.

For binary positive examples, focal loss is $-(1-p)^\gamma\log p$ in one common convention. With $\gamma=0$ it becomes ordinary cross entropy. Larger $\gamma$ suppresses easy examples. Class weights and focal weighting serve different roles, though they can be combined. Report calibration as well as discrimination after changing the loss.

Optional application: calculate precision and recall from a fixed confusion matrix, then change only the assumed deployment prevalence using estimated sensitivity and specificity. This reveals why a test set's precision cannot be transferred blindly to another population.
