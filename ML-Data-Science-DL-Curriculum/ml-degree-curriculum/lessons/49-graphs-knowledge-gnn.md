# 49. Graph theory, knowledge graphs, and graph neural networks

[Previous](48-distributed-deployment.md) · [Course index](../README.md) · [Next](50-self-supervised-representations.md)

## Graphs represent relations explicitly

A graph has nodes and edges. Directed edges distinguish source and destination; undirected edges do not. An adjacency matrix $A$ records edges, and a degree matrix $D$ records incident counts or weight sums under a stated convention. Node features form $X:(N,d)$. Edge attributes and relation types carry information that a binary adjacency alone cannot express.

A knowledge graph stores triples such as $(\text{machine},\text{located-in},\text{room})$. Entity linking maps mentions in text to identities; relation extraction predicts typed relationships. Open-world data do not imply that every missing triple is false. Train-test splits for link prediction must prevent inverse or duplicate relation leakage, and negative sampling requires careful interpretation.

## Message passing

A general layer computes messages $m_{ij}=M(h_i,h_j,e_{ij})$, aggregates them with a permutation-invariant operation such as sum or mean, then updates $h_i'=U(h_i,\operatorname{aggregate}_j m_{ij})$. The aggregation must not depend on arbitrary neighbor order if the desired output is graph-equivariant.

For a GCN layer add self loops $\widetilde A=A+I$, compute degrees $\widetilde D$, and use

$$H'=\phi(\widetilde D^{-1/2}\widetilde A\widetilde D^{-1/2}HW).$$

The normalized adjacency averages neighboring information with symmetric degree scaling. It is not generally row stochastic, so its output is not necessarily a convex average in the ordinary coordinate basis. Self loops include a node's own signal and prevent zero degree in this setup.

## A hand trace on a chain

For nodes $1-2-3$ with scalar features $(1,0,3)$, self-loop degrees are $(2,3,2)$. Node one's normalized aggregate is $1/2+0/\sqrt6=0.5$. Node two's is $1/\sqrt6+0/3+3/\sqrt6=4/\sqrt6\approx1.633$. Node three's is $0/\sqrt6+3/2=1.5$. Multiplying by a scalar weight and applying an activation completes a one-channel GCN layer.

GraphSAGE can concatenate a node's state with a sampled-neighbor aggregate. GAT computes attention weights on existing graph edges and normalizes over the neighborhood. Edge-aware message networks include relation or edge features inside the message. These choices encode different inductive biases; the word GNN alone does not specify one update rule.

## Why equivariance holds

Let $P$ be a permutation matrix relabeling nodes. The relabeled adjacency is $PAP^\top$ and features are $PX$. Degrees and normalized adjacency transform in the same way. Therefore $\widehat A'PXW=P\widehat AXW$, and an elementwise activation commutes with the row permutation. The node outputs permute consistently. A graph-level sum or mean then removes node ordering and gives an invariant summary.

The advanced laboratory checks this identity numerically and differentiates the trainable weight matrix against finite differences. A graph can still leak target information through its edges or node features despite an equivariant architecture. Transductive evaluation allows some unlabeled test-node structure during training; inductive evaluation asks for unseen nodes or graphs. State the regime.

## Limitations and knowledge-graph scoring

Repeated aggregation can oversmooth features or compress too much distant information. Homophily assumptions may fail when linked nodes have different classes. Sampling can bias neighborhoods. A translation embedding score such as $-\|h+r-t\|$ for a knowledge-graph triple is a separate model, with constraints on relation patterns and a need for filtered ranking evaluation. It is not automatically a substitute for relational reasoning.

Read the [GCN paper](https://arxiv.org/abs/1609.02907) and compare its assumptions with the graph you intend to model. The course implements a transparent GCN calculation; large-scale neighbor sampling is an extension requiring a separate performance study.


## Inspect the complete numerical experiment

This is the exact function in [advanced.py](../code/classical/advanced.py). Its module imports NumPy plus `finite_difference` and `softmax` from the adjacent `models.py`. Run `python code/classical/advanced.py` to execute all of these experiments. Assertions check the stated finite example; they do not claim general capability.

```python
def graph_convolution():
    rng=np.random.default_rng(49)
    A=np.array([[0.,1.,0.],[1.,0.,1.],[0.,1.,0.]])+np.eye(3)
    degree=A.sum(axis=1)
    normalized=A/np.sqrt(degree[:,None]*degree[None,:])
    X=np.array([[1.,0.],[0.,1.],[3.,1.]])
    W=rng.normal(size=(2,2))
    target=np.array([[1.,0.],[0.,1.],[1.,1.]])
    def objective(W):
        H=np.tanh(normalized@X@W)
        return np.mean((H-target)**2)/2
    H=np.tanh(normalized@X@W)
    G=(H-target)*(1-H**2)/H.size
    analytic=X.T@normalized.T@G
    assert np.allclose(analytic,finite_difference(objective,W),atol=1e-7)
    P=np.eye(3)[[2,0,1]]
    permuted=np.tanh((P@normalized@P.T)@(P@X)@W)
    assert np.allclose(permuted,P@H)
    before=objective(W)
    for _ in range(400):
        H=np.tanh(normalized@X@W)
        W-=.2*(X.T@normalized.T@((H-target)*(1-H**2)/H.size))
    assert objective(W)<before
    return before,objective(W)
```
