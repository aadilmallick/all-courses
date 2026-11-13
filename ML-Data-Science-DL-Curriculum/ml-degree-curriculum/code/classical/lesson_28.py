import numpy as np

def pca(X,components=2):
    X=np.asarray(X,float)
    if X.ndim != 2 or 0 in X.shape or not np.isfinite(X).all():
        raise ValueError('PCA requires a nonempty finite matrix')
    if not isinstance(components,(int,np.integer)) or isinstance(components,(bool,np.bool_)) or not 1 <= components <= min(X.shape):
        raise ValueError('components must be an integer between 1 and min(n,d)')
    mean=X.mean(axis=0)
    _,singular,vt=np.linalg.svd(X-mean,full_matrices=False)
    directions=vt[:components]
    return (X-mean)@directions.T,directions,mean,singular

if __name__ == "__main__":
    X=np.array([[-2.,-2.],[0.,0.],[2.,2.]])
    Z,V,mean,singular=pca(X,1)
    print(Z)
    assert np.allclose(Z@V+mean,X)
