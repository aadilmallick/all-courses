# 27. A complete classical ML experiment and model comparison

[Previous](26-boosting.md) · [Course index](../README.md) · [Next](28-pca-factorization.md)

## Define a comparison before fitting

Use one dataset, one deployment question, one development protocol, and one final test set. Compare a constant baseline, a regularized linear model, a distance model, a forest, and boosting when those families fit the target. Some models need feature scaling; others do not. A fair comparison allows each family an appropriate pipeline while keeping the held-out protocol and evaluation definition fixed.

For a small reproducible classification study, scikit-learn's packaged breast-cancer dataset can illustrate a binary workflow without a network download. Treat it as an educational table, not evidence that the resulting model is suitable for medical decisions. For a completely synthetic study, generate a known decision boundary and specify what aspects of reality it omits.

## Build the experimental sequence

1. Separate the final test observations using a declared rule.
2. On development data, construct a training pipeline for each family.
3. Choose a small, comparable search budget and cross-validation protocol.
4. Record every candidate and metric, including failures.
5. Select a model and threshold from development evidence.
6. Refit the selected procedure on available development data.
7. Evaluate the frozen result once on final test data and write a model card.

A search budget is not automatically fair just because every family receives the same number of configurations. One model may be much more expensive or sensitive to settings. State whether the constraint is trials, elapsed compute, or human effort. Report those tradeoffs explicitly.

## The implementation contract

`code/classical/project.py` contains a complete train/test experiment with cross-validation inside development data. It uses built-in data, pipelines, fixed seeds, and stable APIs. The output includes the selected family and test metrics. This is a runnable reference for information flow, while `models.py` exposes the arithmetic of individual algorithms.

Do not manually select the family after seeing which one does best on the final test output. If that happens, label the result exploratory and obtain new untouched evaluation data. Changing a threshold after viewing the confusion matrix is a selection decision too.

## Compare what each model assumes

| Family | Useful preference | Common failure to investigate |
|---|---|---|
| Linear/logistic | Additive effect in supplied features | Missing nonlinear interactions |
| kNN | Nearby cases have related targets | Poor metric, irrelevant features, query cost |
| Naive Bayes | Conditional factorization | Duplicate evidence, miscalibration |
| SVM | Large margin in selected feature space | Scale and kernel mismatch |
| Tree | Recursive axis-aligned partition | Instability, noisy small leaves |
| Forest | Diverse randomized partitions | Correlated trees, poor extrapolation |
| Boosting | Additive correction of current loss | Sensitive tuning, label noise |
| Neural network | Learned compositional representation | Data and optimization demands |

These are diagnostic starting points, not a universal league table. Include simple preprocessing and a regularized baseline before concluding that advanced architecture is necessary.

## Turn a result into an explanation

Record train and validation learning curves, runtime, model size, and subgroup or time-slice errors relevant to the intended use. Investigate incorrect examples without retroactively redefining the metric to hide them. Separate data problems, optimization problems, and model-class limitations.

Optional application: intentionally fit the scaler before cross validation, then repair the workflow. Explain the information that leaked even if the score difference is small on this particular dataset. The correctness of a protocol does not depend on whether one accidental leak happens to change the third decimal.
