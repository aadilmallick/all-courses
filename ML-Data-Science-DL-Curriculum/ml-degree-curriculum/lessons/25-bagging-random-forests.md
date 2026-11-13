# 25. Bootstrap aggregation, random forests, and ensemble variance

[Previous](24-decision-trees.md) · [Course index](../README.md) · [Next](26-boosting.md)

## Averaging can reduce variance

Suppose $M$ predictors have identical error variance $\sigma^2$ and pairwise error correlation $\rho$. The average error has variance

$$\operatorname{Var}\left(\frac1M\sum_m e_m\right)=\frac1{M^2}\left[M\sigma^2+M(M-1)\rho\sigma^2\right]
=\rho\sigma^2+\frac{1-\rho}{M}\sigma^2.$$

The first term is a correlation floor. Adding highly similar models may bring little gain. These equal-variance, equal-correlation assumptions are a simplifying model, not a universal exact description of real forests.

## Bootstrap aggregation

A bootstrap sample draws $n$ training indices with replacement from $n$ original cases. A particular observation is absent with probability $(1-1/n)^n$, approaching $e^{-1}\approx0.368$. Thus each tree typically omits a substantial subset of original observations even though its bootstrap contains $n$ draws.

Bagging fits an unstable base learner such as a deep tree to each resample and averages predictions. It primarily targets variability. It does not necessarily reduce bias, and resampling cannot compensate for an unrepresentative source population. If observations form groups, a row bootstrap can break the dependence structure; resample the appropriate units instead.

## Random forests add feature randomness

At each candidate split, a random forest evaluates a subset of features. This can weaken an individual tree but reduce correlation between trees. The variance calculation shows why that trade can help. Bagging all features and random-subspace splitting are distinct sources of diversity.

For classification, average tree class probabilities or votes according to the selected implementation, then form the final decision. Averaging probabilities and taking a majority of hard predictions need not produce identical results. The supplied forest averages positive-class leaf fractions from binary trees.

## Out-of-bag evaluation

For each observation, aggregate predictions only from trees whose bootstrap omitted it. Compare those predictions with its target. This provides a convenient internal estimate, but preprocessing fit on all rows can still leak into out-of-bag predictions. Repeatedly tuning using the same out-of-bag scores also makes them part of selection. A final held-out evaluation retains a distinct role.

The number of out-of-bag trees differs per observation. With too few trees, some rows may receive no such prediction. An implementation should report or handle those rows rather than quietly count them as correct or negative.

## Feature importance and deployment

Permutation importance shuffles a feature in held-out data and measures the score change. It asks how much the fitted model relies on that feature under the permutation procedure. Correlated features can substitute for each other, and independent shuffling may create unrealistic inputs. Impurity importance and permutation importance answer different questions.

Forests can be strong tabular baselines, but memory and inference cost grow with the number and size of trees. They do not naturally extrapolate a numerical trend beyond the training partitions as a linear model can. Evaluate on temporal and range-shifted slices when extrapolation matters.

Optional application: plot validation performance as the forest grows, then compare feature-subset sizes at a fixed compute budget. Measure both score variation across seeds and average score. A single lucky split is insufficient evidence of a robust improvement.


## Complete algorithm laboratory

The following program is saved as [the lesson laboratory](../code/classical/lesson_25.py). It uses only NumPy. The final small dataset is chosen so that you can connect each array to the preceding derivation. Run it from the course root with `python code/classical/lesson_25.py`.

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

class Forest:
    def __init__(self,trees=20,max_depth=4,seed=0):
        self.trees,self.depth,self.seed=trees,max_depth,seed

    def fit(self,X,y):
        rng=np.random.default_rng(self.seed)
        self.models=[]
        self.inbag=[]
        for _ in range(self.trees):
            index=rng.integers(len(X),size=len(X))
            model=Tree(self.depth,classification=True,max_features=max(1,int(np.sqrt(X.shape[1]))),seed=int(rng.integers(2**30)))
            model.fit(X[index],y[index])
            self.models.append(model)
            self.inbag.append(np.unique(index))
        return self

    def predict_proba_positive(self,X):
        return np.mean([model.predict(X) for model in self.models],axis=0)

if __name__ == "__main__":
    rng=np.random.default_rng(25)
    X=rng.normal(size=(100,3))
    y=(X[:,0]>0).astype(int)
    model=Forest(seed=25).fit(X,y)
    print(np.mean((model.predict_proba_positive(X)>.5)==y))
```

The recorded output in the supplied CPU environment was:

```text
1.0
```
