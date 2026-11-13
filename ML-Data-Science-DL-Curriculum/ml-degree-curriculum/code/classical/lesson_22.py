import numpy as np

def softmax(z):
    z = np.asarray(z, dtype=float)
    if z.ndim == 0 or z.shape[-1] == 0 or np.isnan(z).any() or np.isposinf(z).any():
        raise ValueError('softmax needs nonempty rows without NaN or positive infinity')
    if not np.isfinite(z.max(axis=-1)).all():
        raise ValueError('every softmax row needs a finite allowed score')
    z = z - z.max(axis=-1, keepdims=True)
    e = np.exp(z)
    return e / e.sum(axis=-1, keepdims=True)

class MultinomialNB:
    def fit(self,X,y,alpha=1.):
        X=np.asarray(X,float)
        y=np.asarray(y)
        if X.ndim != 2 or 0 in X.shape or y.shape != (len(X),):
            raise ValueError('counts must have shape (n,d) and labels shape (n,)')
        if not np.isfinite(X).all() or np.any(X<0) or not np.isfinite(alpha) or alpha <= 0:
            raise ValueError('nonnegative counts and positive alpha required')
        self.classes=np.unique(y)
        counts=np.stack([X[y==c].sum(axis=0) for c in self.classes])+alpha
        self.log_likelihood=np.log(counts/counts.sum(axis=1,keepdims=True))
        self.log_prior=np.log(np.array([(y==c).mean() for c in self.classes]))
        return self

    def predict_proba(self,X):
        X=np.asarray(X,float)
        if X.ndim != 2 or X.shape[1] != self.log_likelihood.shape[1] or not np.isfinite(X).all() or np.any(X<0):
            raise ValueError('query counts must be finite, nonnegative, and match the vocabulary')
        return softmax(X@self.log_likelihood.T+self.log_prior)

    def predict(self,X):
        return self.classes[self.predict_proba(X).argmax(axis=1)]

if __name__ == "__main__":
    X=np.array([[8.,2.],[1.,9.]])
    y=np.array([1,0])
    model=MultinomialNB().fit(X,y)
    print(model.classes,model.predict_proba(np.array([[1.,1.]])))
