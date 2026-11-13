# 13. Dataset splits, cross validation, leakage, and model selection

[Previous](12-learning-theory.md) · [Course index](../README.md) · [Next](14-data-preparation.md)

## First decide what constitutes a new example

If multiple rows belong to one patient, device, document, or customer, a random row split may place related observations on both sides. A model can recognize the shared identity rather than generalize to new identities. If deployment predicts the future, a randomly shuffled past-and-future split may answer the wrong question even without explicit identity leakage.

Define the deployment population and prediction time first. Use random stratified splits for an appropriate iid classification setting, group splits for new entities, and forward splits for future prediction. Stratification stabilizes label proportions; it does not solve grouping, temporal dependence, or biased data collection.

## Train, validation, and test have different jobs

Training observations select fitted parameters. Validation observations select hyperparameters, features, thresholds, and stopping time. The final test observations evaluate the procedure after those choices. Looking repeatedly at test performance and changing the model converts the test set into another validation set, regardless of its filename.

For K-fold cross validation, partition the available development set into $K$ folds. For each fold, fit the entire pipeline on the other folds and evaluate on that fold. Average the scores or aggregate appropriately for the declared metric. The standard deviation across folds is not automatically a confidence interval because training sets overlap and scores are dependent.

Nested cross validation separates inner selection from outer evaluation. For every outer training partition, use inner folds to choose settings; refit with those settings on the outer training data; evaluate once on the outer holdout. After estimating the procedure, choose a final configuration using development data and fit the final deployable model. Do not pick the outer fold whose score looked best and report only that one.

## Leakage includes unsupervised transformations

A scaler computes feature means and variances. If fitted on all data before a split, held-out observations influence the representation. Imputation, PCA, vocabulary learning, feature selection, oversampling, and target encoding can leak too. Fit learned transformations inside each training fold. Apply their fitted state unchanged to validation rows.

```python
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.datasets import load_iris
X,y=load_iris(return_X_y=True)
model=make_pipeline(StandardScaler(),LogisticRegression(max_iter=2000))
cv=StratifiedKFold(n_splits=5,shuffle=True,random_state=13)
print(cross_val_score(model,X,y,cv=cv,scoring='accuracy'))
```

The pipeline clones and fits a scaler within each training fold. This example estimates accuracy for this dataset and split protocol; it does not choose hyperparameters or establish production performance. A temporal or grouped deployment needs a different splitter.

## A protocol that another person can audit

Record identifiers for each partition, the split rule, sampling unit, feature availability cutoff, target construction, fitted transformations, metric direction, and all model-selection choices. Store exact indices when feasible; a random seed alone may not reproduce a split after source data ordering changes.

For time series, use a gap when label windows or features overlap near the boundary. If the target is a seven-day future outcome, rows just before the split can contain outcomes extending into the validation period. Purging or embargo choices depend on those windows. Train-test separation is a statement about information flow, not simply distinct row numbers.

Read [primary cross-validation documentation](https://scikit-learn.org/stable/modules/cross_validation.html) for splitter contracts. The full [training workshop](../workshops/03-data-training-and-evaluation.md) connects these principles to data loaders and checkpoint selection.
