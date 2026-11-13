import numpy as np

def kmeans(X,k=2,steps=100,seed=0):
    rng=np.random.default_rng(seed)
    centers=X[rng.choice(len(X),k,replace=False)].astype(float).copy()
    history=[]
    for _ in range(steps):
        distance=((X[:,None,:]-centers[None,:,:])**2).sum(axis=-1)
        labels=distance.argmin(axis=1)
        history.append(float(distance[np.arange(len(X)),labels].sum()))
        new=centers.copy()
        for j in range(k):
            if np.any(labels==j):
                new[j]=X[labels==j].mean(axis=0)
        if np.allclose(new,centers,rtol=0,atol=1e-12):
            break
        centers=new
    distance=((X[:,None,:]-centers[None,:,:])**2).sum(axis=-1)
    return centers,distance.argmin(axis=1),np.array(history)

def kmedoids(X,k=2,steps=30,seed=0):
    """Small exhaustive PAM-style swap implementation; O(n^2) distance storage."""
    rng=np.random.default_rng(seed)
    D=np.sqrt(((X[:,None,:]-X[None,:,:])**2).sum(axis=-1))
    medoids=rng.choice(len(X),k,replace=False)
    cost=D[:,medoids].min(axis=1).sum()
    for _ in range(steps):
        best=(cost,medoids.copy())
        for position in range(k):
            for candidate in np.setdiff1d(np.arange(len(X)),medoids):
                proposal=medoids.copy();proposal[position]=candidate
                value=D[:,proposal].min(axis=1).sum()
                if value < best[0]-1e-12:
                    best=(value,proposal)
        if best[0]>=cost-1e-12:
            break
        cost,medoids=best
    return medoids,D[:,medoids].argmin(axis=1)

def fuzzy_cmeans(X,k=2,m=2.,steps=100,seed=0):
    if m<=1:
        raise ValueError('m must exceed one')
    rng=np.random.default_rng(seed)
    membership=rng.dirichlet(np.ones(k),len(X))
    for _ in range(steps):
        weighted=membership**m
        centers=weighted.T@X/weighted.sum(axis=0)[:,None]
        squared=((X[:,None,:]-centers[None,:,:])**2).sum(axis=-1)
        inverse=np.maximum(squared,1e-24)**(-1/(m-1))
        membership=inverse/inverse.sum(axis=1,keepdims=True)
        zero=squared<=1e-24
        for i in np.flatnonzero(zero.any(axis=1)):
            membership[i]=zero[i]/zero[i].sum()
    return centers,membership

if __name__ == "__main__":
    X=np.array([[0.],[1.],[8.],[9.]])
    print('means',kmeans(X,2,seed=1))
    print('medoids',kmedoids(X,2,seed=1))
    print('fuzzy',fuzzy_cmeans(X,2,seed=1))
