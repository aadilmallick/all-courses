# 58. Interpretability, causal reasoning, fairness, and reliable decisions

[Previous](57-recommendation-anomaly-semisupervised.md) · [Course index](../README.md) · [Next](59-capstone.md)

## Explanations describe a model under assumptions

A coefficient, feature attribution, or saliency map can reveal how a fitted rule uses its inputs. It does not automatically establish a causal effect. Correlated features, representation choices, and the reference distribution can change an attribution while predictions remain similar.

Permutation importance measures performance change after a specified shuffle. Partial dependence averages predictions over a chosen background while changing one feature; it can create implausible feature combinations under dependence. Individual conditional expectation shows separate example-level curves but inherits the same intervention-on-input caveat. Shapley-style attributions allocate a prediction relative to a coalition value function, whose conditional or interventional definition matters.

Gradient saliency is local: $\partial f/\partial x_j$ measures an infinitesimal sensitivity. Saturation can produce a small gradient for a feature important to a finite change. Integrated gradients accumulates gradients along a declared path from a baseline. The baseline and path are modeling choices, and completeness of an attribution sum is not a proof of causal truth.

## Correlation and intervention

A causal graph states assumptions about how variables are generated. If $Z$ influences both $X$ and $Y$, conditioning on observed $X$ can mix the effect of $X$ with differences in $Z$. The intervention $do(X=x)$ replaces the mechanism generating $X$ rather than merely selecting observations with $X=x$.

Under an appropriate backdoor adjustment set $Z$ and its assumptions, $P(Y\mid do(X=x))=\sum_zP(Y\mid X=x,Z=z)P(Z=z)$. This formula requires a causal justification for the graph and adjustment, plus support for the relevant combinations. Predictive feature selection alone does not identify that set. Conditioning on a collider can introduce dependence rather than remove confounding.

Random assignment supports causal comparison by balancing confounders in expectation, but missing outcomes, noncompliance, interference, and selection still need analysis. An A/B result should state its population, treatment, outcome window, uncertainty, and assumptions.

## Fairness metrics can conflict

Demographic parity compares positive prediction rates across groups. Equalized odds compares true-positive and false-positive rates conditional on the true outcome. Predictive parity compares positive predictive value. Calibration compares predicted probabilities with outcome frequencies. When base rates differ and errors are imperfect, these criteria can conflict under common conditions. Choosing one requires a task-specific account of harms and measurement quality, not a universal “fair model” score.

Sensitive-attribute removal does not eliminate proxy information. A training label can encode historical disparities. Report uncertainty within small subgroups and inspect intersectional groups when data permit. Interventions should be judged in context rather than declared fair because one metric improved.

## Distribution shift and selective prediction

Covariate shift changes $P(X)$ under a conditional invariance assumption; label shift changes $P(Y)$ under a class-conditional invariance assumption; concept shift changes $P(Y\mid X)$. Distinguishing them is difficult from limited observations. Monitor inputs and outcomes where available, but a drift statistic is a trigger for investigation rather than automatic evidence a model is unsafe or must be retrained.

A selective predictor can abstain when uncertain or out of distribution. Measure both coverage and error on accepted cases, plus who is disproportionately rejected. A model's confidence can be high under shift, so abstention based only on maximum softmax probability needs validation.

Optional application: create two features that are strongly correlated, fit a classifier, and compare marginal permutation with a conditional permutation preserving their relationship. Explain the different question each importance calculation answers before choosing a plot.
