import numpy as np

def _supervised(X, y):
    """Preserve the row-batch contract; never broadcast targets implicitly."""
    X, y = np.asarray(X, dtype=float), np.asarray(y, dtype=float)
    if X.ndim != 2 or y.ndim != 1 or len(X) == 0 or X.shape[1] == 0 or len(y) != len(X):
        raise ValueError('X must be nonempty (n,d) and y must have shape (n,)')
    if not np.isfinite(X).all() or not np.isfinite(y).all():
        raise ValueError('training values must be finite')
    return X, y

def hinge_objective(w,X,y,penalty=0.1):
    X,y=_supervised(X,y)
    w=np.asarray(w,float)
    if w.shape != (X.shape[1],) or not np.isfinite(w).all() or not np.isin(y,[-1.,1.]).all():
        raise ValueError('hinge loss needs finite feature weights and labels -1 or +1')
    if not np.isfinite(penalty) or penalty<0:
        raise ValueError('penalty must be finite and nonnegative')
    margin=y*(X@w)
    active=margin<1
    loss=np.maximum(0,1-margin).mean()+penalty*(w@w)/2
    gradient=penalty*w-X[active].T@y[active]/len(y)
    return loss,gradient

def fit_linear_svm(X,y,penalty=0.1,rate=.05,steps=2000):
    w=np.zeros(X.shape[1])
    for _ in range(steps):
        _,g=hinge_objective(w,X,y,penalty)
        w-=rate*g
    return w

def rbf(X,Z,length=1.):
    X=np.asarray(X,float);Z=np.asarray(Z,float)
    if X.ndim != 2 or Z.ndim != 2 or X.shape[1] != Z.shape[1] or not np.isfinite(X).all() or not np.isfinite(Z).all():
        raise ValueError('RBF inputs must be finite feature matrices with matching widths')
    if not np.isfinite(length) or length <= 0:
        raise ValueError('length must be positive')
    return np.exp(-((X[:,None,:]-Z[None,:,:])**2).sum(axis=-1)/(2*length**2))

def gaussian_process(X,y,query,noise=.1,length=1.):
    """Zero-mean GP; noise is observation standard deviation.

    Returns posterior mean and LATENT marginal variance, not noisy variance.
    """
    X,y=_supervised(X,y)
    if not np.isfinite(noise) or noise < 0:
        raise ValueError('noise standard deviation must be finite and nonnegative')
    K=rbf(X,X,length)+(noise**2+1e-10)*np.eye(len(X))
    L=np.linalg.cholesky(K)
    cross=rbf(X,query,length)
    alpha=np.linalg.solve(L.T,np.linalg.solve(L,y))
    mean=cross.T@alpha
    projected=np.linalg.solve(L,cross)
    variance=1.-(projected**2).sum(axis=0)
    return mean,np.maximum(variance,0.)

if __name__ == "__main__":
    X=np.array([[-2.],[-1.],[1.],[2.]])
    y=np.array([-1.,-1.,1.,1.])
    w=fit_linear_svm(X,y)
    print('SVM weight',w)
    print('GP',gaussian_process(X,y,np.array([[0.],[1.5]])))
