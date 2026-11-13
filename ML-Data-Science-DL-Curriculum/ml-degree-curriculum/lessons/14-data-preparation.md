# 14. Data exploration, missing values, features, and scaling

[Previous](13-splits-cross-validation.md) · [Course index](../README.md) · [Next](15-sampling-imbalance.md)

## Explore the measurement process

Before modeling, describe row counts, units, time coverage, duplicate identifiers, missingness, invalid values, target prevalence, and feature availability. A histogram can reveal a mixture of meters and feet or a sentinel value such as -999. A statistical outlier may be a measurement failure or the event that matters most. Investigation must precede deletion.

Missing completely at random means missingness is independent of the data. Missing at random permits dependence on observed values. Missing not at random permits dependence on unobserved values. These are assumptions about a process, not properties established just by inspecting a blank cell. Median imputation is a useful baseline; it is not a universal correction for informative missingness.

## Fit a transformation using training data

For training feature $j$, compute $\mu_j=\frac1n\sum_i x_{ij}$ and population-style variance $s_j^2=\frac1n\sum_i(x_{ij}-\mu_j)^2$. Transform using $z_{ij}=(x_{ij}-\mu_j)/s_j$. On held-out rows, reuse the training $\mu_j,s_j$. Do not recompute them from the held-out batch.

If a training column is constant, $s_j=0$ and ordinary division is undefined. One explicit contract is to replace zero scales by one and map the training constant to zero. This avoids numerical failure while preserving that future deviations from the constant remain visible.

Min-max scaling maps $x$ to $(x-a)/(b-a)$ using training minimum $a$ and maximum $b$. Future values can fall below zero or above one. Clipping them changes the transformation and should be an explicit decision. Unit-length normalization divides each row by its own norm; it answers a different question from scaling feature columns.

## Why scale matters

In Euclidean distance, a feature with a range of 100,000 can dominate another with a range of 1. Standardization changes the metric and can improve conditioning for gradient methods. It does not prove equal importance of features. Decision trees based on axis-aligned thresholds are largely invariant to strictly monotone transformations of an individual feature, while kNN and penalized linear models generally are not.

Categorical variables need a representation contract. One-hot encoding avoids pretending category IDs have a meaningful numerical distance. Unseen categories need handling. Target encoding uses target statistics and therefore needs out-of-fold construction during training to avoid leaking a row's label into its own features.

```python
import numpy as np
train=np.array([[1.,10.],[3.,10.],[5.,10.]])
mean=train.mean(axis=0)
scale=train.std(axis=0)
scale=np.where(scale==0,1.,scale)
z=(train-mean)/scale
new=(np.array([[7.,12.]])-mean)/scale
assert np.allclose(z.mean(axis=0),0)
print(z,new)
```

The second standardized training column is zero; the new second coordinate is two. A rule that silently zeroed all future values in a previously constant column would hide this change. State the intended behavior.

Optional application: compare nearest-neighbor identities before and after rescaling one feature by 1,000. Then standardize using training statistics and repeat. Explain which changes arise from units and which from a deliberate similarity assumption.


## Verification note

The scaler implementation now rejects a different feature count at transform time. A one-column query must not silently broadcast across a two-feature training representation.
