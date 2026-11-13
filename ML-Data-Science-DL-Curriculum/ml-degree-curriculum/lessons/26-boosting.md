# 26. AdaBoost, gradient boosting, and second order tree boosting

[Previous](25-bagging-random-forests.md) · [Course index](../README.md) · [Next](27-classical-ml-project.md)

## Build an additive model

Boosting constructs $F_M(x)=F_0(x)+\sum_{m=1}^M\eta h_m(x)$. Each learner is selected in response to the current ensemble's errors. This differs from independently fitting bootstrap models and averaging them.

For squared loss $\ell(y,F)=\tfrac12(y-F)^2$, the derivative with respect to $F$ is $F-y$. Its negative is the residual $y-F$. Fit a small regression tree to these residuals, then add a shrunken version to the current prediction. For targets $(1,3)$, a constant initial mean is 2, residuals are $(-1,1)$, and a tree that fits them exactly with learning rate 0.5 changes predictions to $(1.5,2.5)$. The next residuals are $(-0.5,0.5)$.

## General gradient boosting

For another differentiable loss, replace residuals by pseudo-residuals $r_i=-\partial\ell(y_i,F_i)/\partial F_i$. A regression tree approximates that direction in function space. A line search or leaf-wise optimum may improve the step, and a learning rate controls how much to add. Classification boosting often fits logits, not probabilities directly; applying a sigmoid maps a binary logit to probability.

Early stopping, tree depth, learning rate, subsampling, and number of rounds interact. Many shallow trees can capture interactions gradually. Too many rounds can fit noise. Validation curves guide stopping, while the final test set remains unused during that process.

## AdaBoost from exponential loss

Use labels $\{-1,+1\}$ and base predictions $h(x)\in\{-1,+1\}$. Minimize $\sum_ie^{-y_iF(x_i)}$. At the next step, define weights $w_i\propto e^{-y_iF_{old}(x_i)}$. For weighted error $\epsilon$ of a selected classifier, the new exponential objective is proportional to $(1-\epsilon)e^{-\alpha}+\epsilon e^\alpha$. Differentiating and setting to zero gives

$$\alpha=\frac12\log\frac{1-\epsilon}{\epsilon}.$$

Misclassified observations get multiplied by $e^\alpha$ and correctly classified ones by $e^{-\alpha}$ before renormalization. A learner with error 0.5 gives zero weight. Perfect error zero requires an explicit stopping or numerical convention because the formula diverges. Label noise can repeatedly attract weight.

## Second-order tree boosting

Approximate the loss change at prediction $F_i$ by $g_if_i+\tfrac12h_if_i^2$, where $g_i$ and $h_i$ are first and second derivatives. If one leaf assigns value $v$ to its cases and has L2 penalty $\lambda v^2/2$, its approximate objective is $Gv+\tfrac12(H+\lambda)v^2$, with $G=\sum_i g_i$ and $H=\sum_i h_i$. Differentiation yields $v^*=-G/(H+\lambda)$.

The optimized leaf contribution is $-G^2/[2(H+\lambda)]$. Comparing a split's two optimized children with its parent yields a gain involving their $G,H$ values, minus any added-leaf penalty. This derivation motivates XGBoost-style tree objectives. Histogram splits, sparsity handling, regularization conventions, and production optimizations are additional implementation choices, not consequences of the algebra alone.

## Match implementation claims to evidence

Our local code implements squared-error gradient boosting using regression trees. It does not implement the full XGBoost engine. The lesson derives the second-order extension so you can reconstruct its logic; an independently installed production library is a separate comparison. Gradient boosting is often competitive for structured tables, but no architecture ranking holds for every dataset and budget.


## Trace an AdaBoost reweighting

Start with four equal weights 1/4. A weak classifier makes one mistake, so $\epsilon=1/4$ and $\alpha=\tfrac12\log3\approx0.5493$. Correctly classified cases get multiplier $1/\sqrt3$ and the wrong case gets multiplier $\sqrt3$. The unnormalized masses are three copies of $1/(4\sqrt3)$ and one copy of $\sqrt3/4$.

Their sum is $\sqrt3/2$. After normalization, each correct case has weight $1/6$ and the wrong case has weight $1/2$. The next classifier therefore faces a changed fitting distribution concentrated on the earlier error. This is the source of adaptive emphasis; it is not equivalent to sampling a new independent bootstrap with the original equal weights.

For logistic second-order boosting, $g_i=\sigma(F_i)-y_i$ and $h_i=\sigma(F_i)(1-\sigma(F_i))$. Very confident logits have small curvature, so leaf regularization and minimum Hessian mass can be useful. A second-order formula is an approximation around current predictions; large unconstrained steps can still behave poorly.


## Complete algorithm laboratory

The following program is saved as [the lesson laboratory](../code/classical/lesson_26.py). It uses only NumPy. The final small dataset is chosen so that you can connect each array to the preceding derivation. Run it from the course root with `python code/classical/lesson_26.py`.

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

class GradientBoosting:
    def __init__(self,steps=30,rate=.1,depth=2):
        self.steps,self.rate,self.depth=steps,rate,depth

    def fit(self,X,y):
        self.base=y.mean()
        prediction=np.full(len(y),self.base)
        self.models=[]
        for _ in range(self.steps):
            model=Tree(self.depth).fit(X,y-prediction)
            prediction+=self.rate*model.predict(X)
            self.models.append(model)
        return self

    def predict(self,X):
        prediction=np.full(len(X),self.base)
        for model in self.models:
            prediction+=self.rate*model.predict(X)
        return prediction

if __name__ == "__main__":
    X=np.linspace(-2,2,50)[:,None]
    y=np.sin(X[:,0])
    model=GradientBoosting().fit(X,y)
    print(np.mean((model.predict(X)-y)**2))
```

The recorded output in the supplied CPU environment was:

```text
0.0017671914189900026
```
