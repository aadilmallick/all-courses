# 20. Evaluation metrics, calibration, costs, and uncertainty

[Previous](19-logistic-softmax.md) · [Course index](../README.md) · [Next](21-nearest-neighbors.md)

## Start from a confusion matrix

For binary predictions, true positives are actual positives predicted positive; false positives are actual negatives predicted positive; true negatives and false negatives complete the table. Precision is $TP/(TP+FP)$, recall is $TP/(TP+FN)$, specificity is $TN/(TN+FP)$, and accuracy is $(TP+TN)/N$. A zero denominator needs a declared convention.

With $TP=8,FP=2,FN=12,TN=78$, precision is 0.8, recall is 0.4, and accuracy is 0.86. The harmonic mean $F_1=2PR/(P+R)=16/30\approx0.5333$. These are different summaries of the same predictions. None alone states the cost of missing a positive.

## Threshold curves separate ranking and decisions

Lowering a score threshold generally increases both true positives and false positives. ROC plots recall against false-positive rate. ROC AUC can be interpreted as the probability a randomly selected positive receives a higher score than a randomly selected negative, with half credit for ties. It summarizes ranking across thresholds; it does not identify a deployment threshold or establish calibration.

Precision-recall curves make positive prediction quality visible under imbalance. Their values depend on prevalence. Average precision uses a particular recall-weighted summary and should not be treated as identical to every interpolation of PR area. Report the exact metric implementation.

## Calibration measures a different property

A probability predictor is calibrated when cases assigned probability near $p$ occur approximately $p$ of the time, according to the conditioning convention. A constant predictor equal to the base rate can be calibrated but uninformative. A perfectly ranking score can be badly calibrated. Discrimination and calibration should therefore be assessed separately.

The Brier score averages $(p_i-y_i)^2$. Log loss averages negative observed log probabilities. Both evaluate distribution quality. Reliability diagrams group predictions into bins and compare mean confidence with empirical frequency. Expected calibration error depends on binning, sample size, and weighting; a small value alone is not a guarantee.

Temperature scaling divides logits by a fitted positive temperature. It can change probabilities without changing the multiclass argmax. Fit it on separate calibration data or within the selection protocol. Isotonic regression is flexible but can overfit small calibration sets. Reusing test labels for calibration invalidates their later role as untouched evaluation.

## Regression and uncertainty

MAE reports typical absolute deviations in target units. MSE emphasizes larger residuals and has squared units. RMSE returns to target units. $R^2=1-\sum(y-\widehat y)^2/\sum(y-\bar y)^2$ compares with a constant baseline; it can be negative on held-out data. A constant target makes its usual denominator zero.

A confidence interval for an estimated mean is not a prediction interval for a future individual outcome. A prediction interval includes outcome variability. Quantile models can predict interval endpoints, but coverage must be evaluated on held-out data. Distribution shift can invalidate previously measured coverage.

For exchangeable calibration scores $s_1,\ldots,s_m$, split conformal uses an appropriate upper order statistic at rank $\lceil(m+1)(1-\alpha)\rceil$ to construct marginal coverage. If the rank exceeds $m$, the conservative bound is infinite. Exchangeability and the precise construction matter; marginal coverage does not guarantee coverage within every subgroup.

## Model comparison as a decision

Use the same held-out cases for paired comparisons. Report effect size and uncertainty rather than only the winning decimal. Include latency, memory, data requirements, interpretability, and maintenance when these constrain the application. A tiny average-score improvement can be outweighed by fragile subgroup behavior or a deployment cost that exceeds the available budget.
