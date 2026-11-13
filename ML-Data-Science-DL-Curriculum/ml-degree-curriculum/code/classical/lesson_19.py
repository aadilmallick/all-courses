import numpy as np

def _supervised(X, y):
    """Preserve the row-batch contract; never broadcast targets implicitly."""
    X, y = np.asarray(X, dtype=float), np.asarray(y, dtype=float)
    if X.ndim != 2 or y.ndim != 1 or len(X) == 0 or X.shape[1] == 0 or len(y) != len(X):
        raise ValueError('X must be nonempty (n,d) and y must have shape (n,)')
    if not np.isfinite(X).all() or not np.isfinite(y).all():
        raise ValueError('training values must be finite')
    return X, y

def softmax(z):
    z = np.asarray(z, dtype=float)
    if z.ndim == 0 or z.shape[-1] == 0 or np.isnan(z).any() or np.isposinf(z).any():
        raise ValueError('softmax needs nonempty rows without NaN or positive infinity')
    if not np.isfinite(z.max(axis=-1)).all():
        raise ValueError('every softmax row needs a finite allowed score')
    z = z - z.max(axis=-1, keepdims=True)
    e = np.exp(z)
    return e / e.sum(axis=-1, keepdims=True)

def sigmoid(z):
    return np.exp(-np.logaddexp(0., -np.asarray(z, dtype=float)))

def binary_objective(w,X,y,penalty=0.):
    X,y=_supervised(X,y)
    w=np.asarray(w,float)
    if w.shape != (X.shape[1],) or not np.isfinite(w).all():
        raise ValueError('w must be a finite vector with one entry per feature')
    if np.any((y<0)|(y>1)) or not np.isfinite(penalty) or penalty<0:
        raise ValueError('binary targets must lie in [0,1] and penalty must be nonnegative')
    z=X@w
    loss=np.mean(np.logaddexp(0.,z)-y*z)+penalty*(w@w)/2
    grad=X.T@(sigmoid(z)-y)/len(y)+penalty*w
    return loss,grad

def fit_logistic(X,y,rate=0.2,steps=1000,penalty=0.):
    w=np.zeros(X.shape[1])
    for _ in range(steps):
        _,g=binary_objective(w,X,y,penalty)
        w-=rate*g
    return w

def multiclass_objective(W,X,y,penalty=0.):
    X=np.asarray(X,float);W=np.asarray(W,float);y=np.asarray(y)
    if X.ndim != 2 or 0 in X.shape or W.ndim != 2 or W.shape[0] != X.shape[1] or W.shape[1]==0 or y.shape != (len(X),):
        raise ValueError('multiclass arrays must have shapes X:(n,d), W:(d,k), y:(n,)')
    if not np.isfinite(X).all() or not np.isfinite(W).all() or not np.issubdtype(y.dtype,np.integer) or np.any(y<0) or np.any(y>=W.shape[1]):
        raise ValueError('use finite features and weights with integer class indices in [0,k)')
    if not np.isfinite(penalty) or penalty<0:
        raise ValueError('penalty must be finite and nonnegative')
    z=X@W
    p=softmax(z)
    logsum=np.logaddexp.reduce(z,axis=1)
    loss=np.mean(logsum-z[np.arange(len(y)),y])+penalty*np.sum(W*W)/2
    residual=p.copy()
    residual[np.arange(len(y)),y]-=1
    return loss,X.T@residual/len(y)+penalty*W

if __name__ == "__main__":
    X=np.array([[1.,-1.],[1.,1.]])
    y=np.array([0.,1.])
    w=fit_logistic(X,y)
    print(w,sigmoid(X@w))
