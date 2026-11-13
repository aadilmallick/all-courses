import numpy as np

def soft_threshold(value, threshold):
    return np.sign(value)*np.maximum(np.abs(value)-threshold,0.)

def lasso(X, y, penalty=0.1, steps=1000):
    """Cyclic coordinate descent: ||Xw-y||^2/(2n) + penalty*||w||_1.

    No automatic intercept; center data to fit an unpenalized one separately.
    """
    X,y=np.asarray(X,float),np.asarray(y,float)
    if penalty < 0:
        raise ValueError('penalty must be nonnegative')
    n,d=X.shape
    w=np.zeros(d)
    for _ in range(steps):
        old=w.copy()
        for j in range(d):
            residual=y-X@w+X[:,j]*w[j]
            curvature=X[:,j]@X[:,j]/n
            w[j]=soft_threshold(X[:,j]@residual/n,penalty)/curvature if curvature else 0.
        if np.max(np.abs(w-old)) < 1e-10:
            break
    return w

if __name__ == "__main__":
    X=np.eye(3)
    y=np.array([3.,.2,-2.])
    print(lasso(X,y,penalty=.1))
