"""Tiny complete learning experiments for later chapters; NumPy only."""
import numpy as np
from models import finite_difference, softmax


def dropout_and_normalization():
    rng=np.random.default_rng(35)
    h=np.array([1.,2.,3.])
    samples=(rng.random((100000,3))>=.5)*h/.5
    assert np.allclose(samples.mean(axis=0),h,atol=.04)
    X=np.array([[1.,2.],[3.,8.],[5.,2.]])
    batch=(X-X.mean(axis=0))/(X.std(axis=0)+1e-8)
    layer=(X-X.mean(axis=1,keepdims=True))/(X.std(axis=1,keepdims=True)+1e-8)
    assert np.allclose(batch.mean(axis=0),0)
    assert np.allclose(layer.mean(axis=1),0)
    return samples.mean(axis=0),batch,layer


def hypernetwork():
    x,c=np.array([2.,1.]),np.array([1.,0.])
    A=np.eye(2)
    def objective(A): return .5*((A@c)@x-1)**2
    analytic=np.outer((((A@c)@x)-1)*x,c)
    numeric=finite_difference(objective,A)
    assert np.allclose(analytic,numeric,atol=1e-7)
    start=objective(A)
    for _ in range(30):
        error=(A@c)@x-1
        A-=.1*np.outer(error*x,c)
    assert objective(A)<start/1000
    return start,objective(A)


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


def continuous_denoising():
    """Learn a small time-conditioned linear noise predictor, not an image model."""
    rng=np.random.default_rng(52)
    n=5000
    clean=rng.normal(loc=1.,scale=.5,size=n)
    alpha_bar=rng.uniform(.05,.95,n)
    noise=rng.normal(size=n)
    noisy=np.sqrt(alpha_bar)*clean+np.sqrt(1-alpha_bar)*noise
    # A finite feature map lets coefficients respond to time and input.
    design=np.column_stack([np.ones(n),noisy,alpha_bar,noisy*alpha_bar])
    w=np.zeros(4)
    def objective(w): return np.mean((design@w-noise)**2)/2
    gradient=design.T@(design@w-noise)/n
    assert np.allclose(gradient,finite_difference(objective,w),atol=1e-7)
    before=objective(w)
    for _ in range(1500): w-=.1*(design.T@(design@w-noise)/n)
    assert objective(w)<before*.7
    # Check the declared forward marginal's conditional mean and variance.
    beta=.1
    draws=np.sqrt(1-beta)*2+np.sqrt(beta)*rng.normal(size=100000)
    assert abs(draws.mean()-np.sqrt(.9)*2)<.01
    assert abs(draws.var()-.1)<.005
    return before,objective(w)


def discrete_denoising():
    """Fit a finite-table conditional denoiser on three-token binary sequences.

    The middle token is independent; the last copies the first. Each (position,
    corrupted-sequence) context has logits. This is an actual learned tiny table,
    not a transformer or a reproduction of a large diffusion model.
    """
    rng=np.random.default_rng(53)
    MASK=2
    clean=np.array([[a,b,a] for a in range(2) for b in range(2)],dtype=int)
    examples=np.repeat(clean,64,axis=0)
    corrupted=examples.copy()
    mask=rng.random(corrupted.shape)<.5
    corrupted[mask]=MASK
    logits=np.zeros((3,27,2))
    contexts=corrupted@np.array([9,3,1])
    positions,rows=[],[]
    for row in range(len(examples)):
        for pos in np.flatnonzero(mask[row]):
            rows.append(row);positions.append(pos)
    rows=np.array(rows);positions=np.array(positions)
    context_ids=contexts[rows];target=examples[rows,positions]
    def objective():
        z=logits[positions,context_ids]
        return np.mean(np.logaddexp.reduce(z,axis=1)-z[np.arange(len(rows)),target])
    before=objective()
    for _ in range(500):
        residual=softmax(logits[positions,context_ids])
        residual[np.arange(len(rows)),target]-=1
        gradient=np.zeros_like(logits)
        np.add.at(gradient,(positions,context_ids),residual/len(rows))
        logits-=5*gradient
    assert objective()<before*.8
    sequence=np.full(3,MASK)
    # Reveal one sampled coordinate each step and recompute conditionals.
    for _ in range(3):
        hidden=np.flatnonzero(sequence==MASK)
        context=int(sequence@np.array([9,3,1]))
        p=softmax(logits[hidden,context])
        chosen=int(np.argmax(p.max(axis=1)))
        sequence[hidden[chosen]]=rng.choice(2,p=p[chosen])
    assert np.all(sequence!=MASK)
    return before,objective(),sequence


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


if __name__=='__main__':
    print('dropout means',dropout_and_normalization()[0])
    print('hypernetwork loss',hypernetwork())
    print('GCN loss',graph_convolution())
    print('continuous denoising loss',continuous_denoising())
    print('discrete denoising',discrete_denoising())
    print('recommendation and harmonic labels',recommendation_and_labels())
