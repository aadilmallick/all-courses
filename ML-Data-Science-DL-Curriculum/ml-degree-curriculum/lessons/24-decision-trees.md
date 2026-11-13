# 24. Decision trees, impurity, recursive partitioning, and pruning

[Previous](23-svm-kernels-gaussian-processes.md) · [Course index](../README.md) · [Next](25-bagging-random-forests.md)

## A tree partitions the input space

An axis-aligned decision tree asks questions such as “temperature <= 40?” and follows left or right branches. Each leaf predicts a class distribution or a regression value. Training greedily chooses a split that reduces within-child heterogeneity. Greedy means best for the current step under a criterion, not globally optimal among all trees.

For binary class fraction $p$ in a node, Gini impurity is $1-p^2-(1-p)^2=2p(1-p)$. It is zero for a pure node and 0.5 for a balanced one. Entropy is $-p\log p-(1-p)\log(1-p)$, with zero terms defined by limits. A split score must weight child impurities by their sample fractions.

## Calculate one split

Take sorted feature values $(1,2,3,4)$ with labels $(0,0,1,1)$. The parent has $p=1/2$, Gini 0.5. A threshold 2.5 produces two pure children, weighted impurity zero, and gain 0.5. A threshold 1.5 leaves a pure size-one child and a size-three child with positive fraction 2/3. Its Gini is $2(2/3)(1/3)=4/9$, so weighted child impurity is $(1/4)0+(3/4)(4/9)=1/3$. The gain is $1/6$, smaller than at 2.5.

Candidate thresholds can lie midway between adjacent distinct sorted feature values. Equal feature values cannot be separated by one threshold on that feature. A minimum leaf size rules out splits whose improvement relies on very few observations.

## Regression leaves and recursive code

For squared-error regression, the best constant in a leaf is its mean. The split score is the weighted child variance, equivalent to comparing sums of squared residuals. Recursively apply the same procedure to each child until a stopping condition holds. A node representation can be a tuple containing feature, threshold, and two children; a leaf can be a one-item tuple with its prediction.

The supplied tree deliberately stores mean targets. With binary labels, a leaf mean is the positive-class fraction. Thresholding it gives a class, and averaging leaf means across trees gives a probability-like ensemble score. These empirical fractions can be poorly calibrated in small leaves.

## Why trees overfit and how pruning helps

A deep tree can isolate each observation and fit label noise. Small input changes near a split can change the entire path. Maximum depth, minimum samples per leaf, minimum gain, and pruning control complexity. Cost-complexity pruning compares fit against a penalty proportional to the number of leaves. Select the pruning strength using validation data rather than the final test set.

Tree splits do not require differentiating the input. This makes trees useful for nonlinear tabular relationships and mixed feature types after appropriate encoding. But greedy splits can struggle with interactions invisible to every single initial split, such as a perfectly balanced XOR pattern. Randomness or alternative split rules may help; a standard greedy tree is not guaranteed to discover every simple interaction.

## Interpretation and limitations

Feature importance from impurity reduction can favor variables with many potential split points. Correlated features may divide or substitute importance. A path describes how this fitted model computed a prediction; it does not establish that changing the feature would cause the outcome to change. Missing values and unseen categories need an explicit strategy; the simple teaching tree expects finite numerical inputs.

Optional application: duplicate one training row repeatedly and recompute the best split. Explain why sample counts affect weighted impurity and how this relates to sample-weighted training.


## Complete algorithm laboratory

The following program is saved as [the lesson laboratory](../code/classical/lesson_24.py). It uses only NumPy. The final small dataset is chosen so that you can connect each array to the preceding derivation. Run it from the course root with `python code/classical/lesson_24.py`.

```python
import numpy as np

def _supervised(X, y):
    """Preserve the row-batch contract; never broadcast targets implicitly."""
    X, y = np.asarray(X, dtype=float), np.asarray(y, dtype=float)
    if X.ndim != 2 or y.ndim != 1 or len(X) == 0 or X.shape[1] == 0 or len(y) != len(X):
        raise ValueError('X must be nonempty (n,d) and y must have shape (n,)')
    if not np.isfinite(X).all() or not np.isfinite(y).all():
        raise ValueError('training values must be finite')
    return X, y

class Tree:
    """Greedy squared-error regression or Gini classification tree.

    Leaves are training means. Classification expects labels 0 and 1.
    """
    def __init__(self,max_depth=3,min_leaf=1,classification=False,max_features=None,seed=0):
        self.max_depth=max_depth
        self.min_leaf=min_leaf
        self.classification=classification
        self.max_features=max_features
        self.rng=np.random.default_rng(seed)

    def impurity(self,y):
        return 2*y.mean()*(1-y.mean()) if self.classification else y.var()

    def fit(self,X,y):
        X,y=_supervised(X,y)
        if self.classification and not np.isin(y,[0.,1.]).all():
            raise ValueError('this teaching classification tree requires labels 0 and 1')
        def build(X,y,depth):
            value=y.mean()
            if depth >= self.max_depth or len(y) < 2*self.min_leaf or self.impurity(y) < 1e-14:
                return (value,)
            features=np.arange(X.shape[1])
            if self.max_features is not None:
                features=self.rng.choice(features,min(self.max_features,len(features)),replace=False)
            best=None
            score=self.impurity(y)
            for j in features:
                unique=np.unique(X[:,j])
                for threshold in (unique[:-1]+unique[1:])/2:
                    left=X[:,j]<=threshold
                    nleft=left.sum()
                    if min(nleft,len(y)-nleft)<self.min_leaf:
                        continue
                    candidate=(nleft*self.impurity(y[left])+(len(y)-nleft)*self.impurity(y[~left]))/len(y)
                    if candidate < score-1e-14:
                        score=candidate
                        best=(j,threshold,left)
            if best is None:
                return (value,)
            j,t,left=best
            return (int(j),float(t),build(X[left],y[left],depth+1),build(X[~left],y[~left],depth+1))
        self.root=build(X,y,0)
        return self

    def predict(self,X):
        def one(row):
            node=self.root
            while len(node)>1:
                j,t,left,right=node
                node=left if row[j]<=t else right
            return node[0]
        return np.array([one(row) for row in np.asarray(X)])

if __name__ == "__main__":
    X=np.arange(1,5,dtype=float)[:,None]
    y=np.array([0,0,1,1])
    model=Tree(max_depth=2,classification=True).fit(X,y)
    print(model.root)
    print(model.predict(X))
```

The recorded output in the supplied CPU environment was:

```text
(0, 2.5, (np.float64(0.0),), (np.float64(1.0),))
[0. 0. 1. 1.]
```


## Verification note

The teaching classification tree accepts only labels 0 and 1, because its Gini shortcut uses a binary positive-class mean. It now rejects other encodings instead of computing an invalid impurity. A general multiclass tree must form a full class-frequency vector.
