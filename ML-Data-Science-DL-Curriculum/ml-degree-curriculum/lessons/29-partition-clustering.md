# 29. K means, medoids, fuzzy clustering, and objective descent

[Previous](28-pca-factorization.md) · [Course index](../README.md) · [Next](30-density-hierarchical-spectral.md)

## Clusters need an explicit objective

K means chooses assignments $c_i$ and centers $\mu_k$ to minimize $J=\sum_i\|x_i-\mu_{c_i}\|^2$. Given centers, each point independently chooses the closest one. Given assignments, differentiate each cluster's sum of squares: $2\sum_{i:c_i=k}(\mu_k-x_i)=0$, yielding the sample mean. Alternating these two minimizations never increases the objective, but can converge to a local optimum.

For scalar points $(0,1,8,9)$ and initial centers $(0,8)$, assignments group $(0,1)$ and $(8,9)$. Updated means are 0.5 and 8.5. The objective falls from $0+1+0+1=2$ to four contributions of 0.25, totaling 1. Another assignment pass leaves the groups unchanged.

## Initialization and degeneracy

Different seeds can give different local minima. Multiple restarts and k-means++ initialization can improve results, but do not eliminate every difficulty. If a cluster receives no points, its mean is undefined. The supplied implementation keeps its old center; other valid designs reinitialize it to a selected point. Document the behavior.

K means prefers compact groups under squared Euclidean distance. It can divide an elongated distribution or combine unequal-density groups in ways that do not match human labels. Scaling changes the objective. Cluster IDs have no intrinsic order; swapping their names gives the same partition.

## Medoids use observed representatives

A medoid is a training observation selected as a representative. Minimize the sum of chosen distances to the nearest medoid. It supports distance functions for which an arithmetic mean is inappropriate and is often less sensitive to extreme points than squared-distance means. The supplied small PAM-style algorithm tries swaps between selected and unselected observations and accepts improving swaps. Its exhaustive distance matrix is expensive for large datasets.

For points $(0,1,2,20)$ and one cluster under absolute distance, a median-like medoid at 1 or 2 has total distance 21, whereas the mean is 5.75 and is not even an observed point. Different objectives produce different centers because they formalize different notions of representative.

## Fuzzy membership

Fuzzy c-means assigns memberships $u_{ik}\ge0$ summing to one across clusters. Its objective is $\sum_{ik}u_{ik}^m\|x_i-\mu_k\|^2$ with $m>1$. Holding memberships fixed gives $\mu_k=\sum_i u_{ik}^m x_i/\sum_i u_{ik}^m$. Holding centers fixed and using a multiplier for each membership sum gives memberships proportional to squared distance raised to $-1/(m-1)$.

A point at exactly a center needs a special rule because inverse distance diverges. Assign its mass to coincident centers, sharing if several coincide. The code handles this explicitly. Fuzzy memberships are optimization variables; they are not automatically posterior probabilities from a generative model.

## Evaluate without inventing ground truth

Inertia decreases as the number of centers grows, so minimizing it alone cannot choose $k$. Silhouette compares within-cluster and nearest-other-cluster distances, but encodes its own compactness preference. With reference labels, adjusted Rand index and normalized mutual information evaluate partition agreement. A useful clustering also needs stability, domain relevance, and an action that depends on the grouping.


## Derive fuzzy membership rather than memorize it

For one observation with squared distances $d_k^2>0$, minimize $\sum_ku_k^m d_k^2$ subject to $\sum_ku_k=1$. Introduce multiplier $\lambda$ and differentiate: $m u_k^{m-1}d_k^2+\lambda=0$. Thus $u_k$ is proportional to $(d_k^2)^{-1/(m-1)}$. Normalize across clusters to satisfy the constraint. Positive distances and $m>1$ were needed to use this formula directly.

With two centers at distances 1 and 2 and $m=2$, inverse squared distances are 1 and 1/4. Memberships are 0.8 and 0.2. The larger-distance center still receives mass; hard k means would give membership 1 and 0. Fuzzy membership describes a chosen objective's softness, not necessarily uncertainty about a true discrete generating label.

The objective's alternating updates decrease or preserve its value when solved exactly, but an arbitrary fixed iteration count does not certify convergence. Monitor objective change, center movement, and degenerate effective cluster mass, and compare several initializations.


## Complete algorithm laboratory

The following program is saved as [the lesson laboratory](../code/classical/lesson_29.py). It uses only NumPy. The final small dataset is chosen so that you can connect each array to the preceding derivation. Run it from the course root with `python code/classical/lesson_29.py`.

```python
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
```

The recorded output in the supplied CPU environment was:

```text
means (array([[0.5],
       [8.5]]), array([0, 0, 1, 1]), array([2., 1.]))
medoids (array([1, 2]), array([0, 0, 1, 1]))
fuzzy (array([[0.49962903],
       [8.50037097]]), array([[0.99655712, 0.00344288],
       [0.99556912, 0.00443088],
       [0.00443088, 0.99556912],
       [0.00344288, 0.99655712]]))
```
