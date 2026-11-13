# 16. Filtering, annotation agreement, privacy, and data provenance

[Previous](15-sampling-imbalance.md) · [Course index](../README.md) · [Next](17-linear-regression.md)

## A label is a measurement

Annotations can disagree because instructions are unclear, examples are ambiguous, or people observe different information. Agreement is a property of an annotation process, not a proof of truth. A group can agree perfectly on a consistently wrong rule. Define labels, sampling, adjudication, and provenance before treating a target column as ground truth.

For two annotators assigning categories, observed agreement $p_o$ is the fraction with identical labels. Let each annotator's category proportions be $a_k,b_k$. The chance baseline used by Cohen's kappa is $p_e=\sum_ka_kb_k$, and

$$\kappa=\frac{p_o-p_e}{1-p_e}.$$

If observed agreement is 0.8 and the two balanced marginals give $p_e=0.5$, kappa is 0.6. If both annotators choose one class almost always, observed agreement can be high while kappa is modest. The baseline comes from marginal distributions, not a universal definition of random agreement. If $p_e=1$, the formula is undefined.

Fleiss' kappa handles suitable multiple-rater categorical settings. Krippendorff's alpha uses observed versus expected disagreement and supports different distance functions and missing annotations under its formulation. Ordinal labels need an ordinal disagreement rule. Pearson correlation measures linear association; it is not equality of ratings. Two raters with scores differing by a fixed offset can correlate perfectly.

## Distributional annotations

Some tasks legitimately have several opinions rather than one correct category. A label distribution preserves that information. Total variation $\tfrac12\sum_k|p_k-q_k|$ measures absolute probability disagreement. KL is asymmetric and can be infinite at support mismatches. Jensen-Shannon divergence averages KLs to the mixture $m=(p+q)/2$ and remains finite for discrete distributions. State logarithm base because it changes numerical bounds.

## Filtering has a selection effect

Deduplication can prevent contamination and reduce memorization, but must handle near duplicates and train-test overlap. Quality filters may remove garbled records, yet a filter trained on one language or writing style can suppress another. A perplexity threshold can preferentially retain familiar text and discard useful rare material. Measure what was removed by source, language, group, time, and task relevance.

Keep a traceable record of source identifiers, permissions, transformations, filter versions, and reasons for exclusion. Hold back an audit sample before tuning filter thresholds. Compare downstream quality and subgroup performance, not only the number of removed records.

## Privacy as an engineering property

Direct identifiers and combinations of quasi-identifiers can reveal people. Removing names does not generally anonymize a dataset. Hashing an email preserves equality relationships and can remain linkable or guessable. Use data minimization, access control, retention limits, and appropriate review for the intended purpose. Legal definitions vary; this course teaches technical mechanisms rather than jurisdiction-specific compliance advice.

Differential privacy is a formal guarantee about neighboring datasets. A randomized mechanism $M$ is $(\epsilon,\delta)$-DP if for neighboring $D,D'$ and every measurable output set $S$,

$$P(M(D)\in S)\le e^\epsilon P(M(D')\in S)+\delta.$$

The adjacency definition matters: one row, one person, or another unit can yield different protection. Gradient clipping and calibrated noise are ingredients of DP-SGD; adding arbitrary noise does not establish DP. Composition and privacy accounting are essential. A larger noise multiplier is not itself a complete privacy statement.

Optional application: build an annotation confusion table, compute marginals and kappa by hand, and compare against simple agreement. Then write a short data card specifying who supplied the data, what one row represents, its intended use, and one reason a filter might introduce selection bias.
