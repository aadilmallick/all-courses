# 30. Hierarchical, density, and spectral clustering

[Previous](29-partition-clustering.md) · [Course index](../README.md) · [Next](31-mixtures-latent-variables.md)

## Hierarchy changes the question

Agglomerative clustering begins with singletons and repeatedly merges two clusters. Single linkage uses the minimum cross-cluster distance and can chain through sparse bridges. Complete linkage uses the maximum and favors compact diameter. Average linkage averages pairwise distances. Ward linkage merges to minimize the increase in within-cluster squared error and requires the appropriate Euclidean geometry.

A dendrogram records merge order and merge heights. Choosing a cut determines a partition. A high merge does not itself prove that two natural categories exist; it reflects the selected distance and linkage. Divisive methods reverse the direction by recursively splitting groups, with their own split criteria.

## Density connectivity

DBSCAN uses a neighborhood radius $\epsilon$ and a minimum neighborhood count. A core point has at least that many observations in its radius, usually including itself. Core points connected through overlapping neighborhoods form clusters. A border point lies near a core but is not itself core. Other points are labeled noise.

Take scalar points $(0,0.1,0.2,3,3.1,9)$, $\epsilon=0.25$, and `min_samples=2`. The first three are one density-connected group, the two near 3 form another, and 9 is noise. With `min_samples=3`, the size-two group no longer contains a core. Radius and minimum count jointly define what density means.

DBSCAN can find curved shapes without specifying the number of clusters, but one global radius can fail on widely varying densities. Border points touching two core components can receive order-dependent labels. The core components are more structurally determined than those ambiguous assignments. The teaching code follows a standard expansion convention and reports noise as -1.

## Graph spectra produce another geometry

Construct a nonnegative symmetric affinity matrix $A$ between points. Let $D$ be its degree diagonal and $L=D-A$ its graph Laplacian. For any vector $z$,

$$z^\top Lz=\frac12\sum_{ij}A_{ij}(z_i-z_j)^2.$$

Expand the square and collect degree terms to verify the equality. Small values reward similar coordinates for strongly connected points. Spectral clustering uses selected eigenvectors of a Laplacian or normalized Laplacian to form a new representation, then clusters its rows. This relaxation connects graph partitioning to linear algebra.

A normalized Laplacian needs careful treatment of zero degrees. The choice of affinity radius, nearest-neighbor graph, and kernel scale can dominate the result. A fully connected Gaussian affinity and a sparse kNN graph can encode different notions of cluster structure.

## Library implementation bridge

```python
import numpy as np
from sklearn.cluster import AgglomerativeClustering, DBSCAN, SpectralClustering
X=np.array([[0.,0.],[.1,0.],[0.,.1],[3.,3.],[3.1,3.],[3.,3.1]])
print(AgglomerativeClustering(n_clusters=2,linkage='ward').fit_predict(X))
print(DBSCAN(eps=.3,min_samples=2).fit_predict(X))
print(SpectralClustering(n_clusters=2,affinity='rbf',random_state=0).fit_predict(X))
```

Compare partitions up to label permutation. Do not assert that class zero from one method equals class zero from another. Use these calls after understanding their objective and graph construction; an API name is not a substitute for a model of its behavior.


## Complete algorithm laboratory

The following program is saved as [the lesson laboratory](../code/classical/lesson_30.py). It uses only NumPy. The final small dataset is chosen so that you can connect each array to the preceding derivation. Run it from the course root with `python code/classical/lesson_30.py`.

```python
import numpy as np

def dbscan(X,eps=.5,min_samples=3):
    distance=np.sqrt(((X[:,None,:]-X[None,:,:])**2).sum(axis=-1))
    neighbors=[np.flatnonzero(row<=eps) for row in distance]
    labels=np.full(len(X),-1,dtype=int)
    visited=np.zeros(len(X),bool)
    cluster=0
    for i in range(len(X)):
        if visited[i]:
            continue
        visited[i]=True
        if len(neighbors[i])<min_samples:
            continue
        labels[i]=cluster
        queue=list(neighbors[i]); queued=set(queue)
        while queue:
            j=queue.pop()
            if not visited[j]:
                visited[j]=True
                if len(neighbors[j])>=min_samples:
                    for q in neighbors[j]:
                        if q not in queued:
                            queue.append(q);queued.add(q)
            if labels[j]<0:
                labels[j]=cluster
        cluster+=1
    return labels

if __name__ == "__main__":
    X=np.array([[0.],[.1],[.2],[3.],[3.1],[9.]])
    print(dbscan(X,eps=.25,min_samples=2))
```

The recorded output in the supplied CPU environment was:

```text
[ 0  0  0  1  1 -1]
```
