import numpy as np

def least_squares(X, y, ridge=0.):
    """No automatic intercept. Augmentation avoids inverting X.T @ X.

    Penalty is ridge * ||w||^2 added to the SUM of squared residuals.
    All supplied columns, including a supplied intercept, are penalized.
    """
    X, y = np.asarray(X,float), np.asarray(y,float)
    if ridge < 0:
        raise ValueError('ridge must be nonnegative')
    if ridge:
        X = np.vstack([X, np.sqrt(ridge)*np.eye(X.shape[1])])
        y = np.concatenate([y, np.zeros(X.shape[1])])
    return np.linalg.lstsq(X,y,rcond=None)[0]

if __name__ == "__main__":
    X=np.array([[1.,0.],[1.,1.],[1.,2.]])
    y=np.array([1.,3.,5.])
    print(least_squares(X,y))
