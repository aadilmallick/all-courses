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
