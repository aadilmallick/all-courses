# 57. Recommendation, anomaly detection, and semi supervised learning

[Previous](56-reinforcement-finetuning.md) · [Course index](../README.md) · [Next](58-interpretability-causality-fairness.md)

## Recommendation depends on what was observed

A recommender predicts or ranks items conditional on a user, context, and available catalog. Explicit ratings and implicit interactions have different semantics. An absent click may mean disinterest or that the item was never shown. Treating every missing pair as negative can train exposure bias into the result.

A matrix-factorization score is $s(u,i)=b_u+b_i+p_u^\top q_i$. Train only on the declared observed or sampled comparisons. Pairwise ranking can use $-\log\sigma(s(u,i^+)-s(u,i^-))$. Its derivative with respect to score difference $d$ is $\sigma(d)-1$, pushing the preferred item's score upward relative to the sampled negative. Negative sampling defines which comparisons the objective emphasizes.

Evaluate using temporal splits and a declared candidate set. Recall@k asks what fraction of relevant items appears in the top k; precision@k asks what fraction of displayed recommendations is relevant. NDCG discounts lower ranks and normalizes against an ideal ordering. Metrics change when candidate pools or relevance definitions change. Cold-start users and items need content or population-based fallback strategies.

## Anomalies are relative to a reference

Anomaly detection identifies cases unusual under a selected model of normality. A low-density point is not automatically malicious or incorrect. Novelty detection trains on a mostly normal reference set and evaluates new cases. Unsupervised outlier detection allows contaminated training data. These are related but different settings.

A Gaussian Mahalanobis score $(x-\mu)^\top\Sigma^{-1}(x-\mu)$ accounts for correlated feature scales. Isolation forests use random partitions and shorter isolation paths as an anomaly signal. Local outlier factor compares local neighborhood density. Autoencoder reconstruction error flags inputs poorly reconstructed by a learned representation. Each can miss anomalies that align with its inductive bias.

Select thresholds using a meaningful false-alarm budget or labeled development evidence. Under strong class imbalance, a seemingly small false-positive rate can overwhelm reviewers. Track workload, detection delay, and precision at the operational threshold.

## Semi-supervised learning adds assumptions

Pseudo-labeling fits on labeled examples, assigns labels to unlabeled ones, and trains on selected predictions. Consistency methods encourage stable predictions under meaningful perturbations. Graph label propagation spreads labels across a similarity graph. All need assumptions connecting unlabeled structure to the target: low-density separation, local smoothness, or appropriate augmentation invariance.

For graph weights $A$, one smoothness objective is $\sum_{ij}A_{ij}(f_i-f_j)^2$ plus a labeled-data fitting term. The Laplacian identity from lesson 30 explains the penalty. If graph neighborhoods connect different classes, smoothness can propagate errors. Unlabeled data can harm performance when the assumed geometry is wrong.

## An executable extension

The extended laboratory includes a small observed-entry factorization trained by gradient descent, a Gaussian-distance anomaly score, and harmonic graph label propagation with fixed labels. It checks objective decrease, score shape, and exact preservation of labeled boundary values. These checks establish properties of the stated finite examples, not reliability on every deployment distribution.


## Inspect the complete numerical experiment

This is the exact function in [advanced.py](../code/classical/advanced.py). Its module imports NumPy plus `finite_difference` and `softmax` from the adjacent `models.py`. Run `python code/classical/advanced.py` to execute all of these experiments. Assertions check the stated finite example; they do not claim general capability.

```python
def recommendation_and_labels():
    rng=np.random.default_rng(57)
    target=np.array([[5.,4.,1.],[1.,2.,5.],[4.,5.,1.]])
    observed=np.array([[1,1,0],[1,0,1],[0,1,1]],bool)
    rows,cols=np.where(observed)
    U=rng.normal(scale=.2,size=(3,2));V=rng.normal(scale=.2,size=(3,2))
    def loss(U,V): return np.mean(((U@V.T)[observed]-target[observed])**2)/2
    before=loss(U,V)
    for _ in range(1500):
        E=np.zeros_like(target)
        E[rows,cols]=((U@V.T)[rows,cols]-target[rows,cols])/len(rows)
        gU=E@V;gV=E.T@U
        U-=.05*gU;V-=.05*gV
    assert loss(U,V)<before/100
    # Harmonic interpolation on a chain with endpoint labels fixed at 0 and 1.
    adjacency=np.diag(np.ones(3),1)+np.diag(np.ones(3),-1)
    L=np.diag(adjacency.sum(axis=1))-adjacency
    known=np.array([0,3]);unknown=np.array([1,2]);labels=np.array([0.,1.])
    prediction=np.zeros(4);prediction[known]=labels
    prediction[unknown]=np.linalg.solve(L[np.ix_(unknown,unknown)],-L[np.ix_(unknown,known)]@labels)
    assert np.allclose(prediction,[0,1/3,2/3,1])
    normal=rng.normal(size=(1000,2))
    mean=normal.mean(axis=0);cov=np.cov(normal,rowvar=False)
    points=np.array([[0.,0.],[10.,10.]])
    distance=np.einsum('ni,ij,nj->n',points-mean,np.linalg.inv(cov),points-mean)
    assert distance[1]>distance[0]
    return before,loss(U,V),prediction,distance
```
