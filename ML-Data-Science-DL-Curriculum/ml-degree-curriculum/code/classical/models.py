"""Transparent float64 teaching models; deliberately small, CPU-oriented APIs."""
import numpy as np


def _supervised(X, y):
    """Preserve the row-batch contract; never broadcast targets implicitly."""
    X, y = np.asarray(X, dtype=float), np.asarray(y, dtype=float)
    if X.ndim != 2 or y.ndim != 1 or len(X) == 0 or X.shape[1] == 0 or len(y) != len(X):
        raise ValueError('X must be nonempty (n,d) and y must have shape (n,)')
    if not np.isfinite(X).all() or not np.isfinite(y).all():
        raise ValueError('training values must be finite')
    return X, y


def softmax(z):
    z = np.asarray(z, dtype=float)
    if z.ndim == 0 or z.shape[-1] == 0 or np.isnan(z).any() or np.isposinf(z).any():
        raise ValueError('softmax needs nonempty rows without NaN or positive infinity')
    if not np.isfinite(z.max(axis=-1)).all():
        raise ValueError('every softmax row needs a finite allowed score')
    z = z - z.max(axis=-1, keepdims=True)
    e = np.exp(z)
    return e / e.sum(axis=-1, keepdims=True)


def sigmoid(z):
    return np.exp(-np.logaddexp(0., -np.asarray(z, dtype=float)))


def finite_difference(function, parameters, step=1e-5):
    if not np.isfinite(step) or step <= 0:
        raise ValueError('finite difference step must be positive and finite')
    parameters = np.asarray(parameters, dtype=float).copy()
    result = np.zeros_like(parameters)
    for index in np.ndindex(parameters.shape):
        original = parameters[index]
        parameters[index] = original + step
        plus = function(parameters)
        parameters[index] = original - step
        minus = function(parameters)
        parameters[index] = original
        result[index] = (plus-minus)/(2*step)
    return result


class Standardizer:
    def fit(self, X):
        X = np.asarray(X, dtype=float)
        if X.ndim != 2 or 0 in X.shape or not np.isfinite(X).all():
            raise ValueError('X must be a nonempty finite feature matrix')
        self.mean = X.mean(axis=0)
        self.scale = X.std(axis=0)
        self.scale = np.where(self.scale == 0, 1., self.scale)
        return self

    def transform(self, X):
        X = np.asarray(X, dtype=float)
        if X.ndim != 2 or X.shape[1] != len(self.mean) or not np.isfinite(X).all():
            raise ValueError('query feature count must match the fitted scaler')
        return (X-self.mean)/self.scale


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


def binary_objective(w,X,y,penalty=0.):
    X,y=_supervised(X,y)
    w=np.asarray(w,float)
    if w.shape != (X.shape[1],) or not np.isfinite(w).all():
        raise ValueError('w must be a finite vector with one entry per feature')
    if np.any((y<0)|(y>1)) or not np.isfinite(penalty) or penalty<0:
        raise ValueError('binary targets must lie in [0,1] and penalty must be nonnegative')
    z=X@w
    loss=np.mean(np.logaddexp(0.,z)-y*z)+penalty*(w@w)/2
    grad=X.T@(sigmoid(z)-y)/len(y)+penalty*w
    return loss,grad


def fit_logistic(X,y,rate=0.2,steps=1000,penalty=0.):
    w=np.zeros(X.shape[1])
    for _ in range(steps):
        _,g=binary_objective(w,X,y,penalty)
        w-=rate*g
    return w


def multiclass_objective(W,X,y,penalty=0.):
    X=np.asarray(X,float);W=np.asarray(W,float);y=np.asarray(y)
    if X.ndim != 2 or 0 in X.shape or W.ndim != 2 or W.shape[0] != X.shape[1] or W.shape[1]==0 or y.shape != (len(X),):
        raise ValueError('multiclass arrays must have shapes X:(n,d), W:(d,k), y:(n,)')
    if not np.isfinite(X).all() or not np.isfinite(W).all() or not np.issubdtype(y.dtype,np.integer) or np.any(y<0) or np.any(y>=W.shape[1]):
        raise ValueError('use finite features and weights with integer class indices in [0,k)')
    if not np.isfinite(penalty) or penalty<0:
        raise ValueError('penalty must be finite and nonnegative')
    z=X@W
    p=softmax(z)
    logsum=np.logaddexp.reduce(z,axis=1)
    loss=np.mean(logsum-z[np.arange(len(y)),y])+penalty*np.sum(W*W)/2
    residual=p.copy()
    residual[np.arange(len(y)),y]-=1
    return loss,X.T@residual/len(y)+penalty*W


def knn_predict(X,y,query,k=3):
    if not 1 <= k <= len(X):
        raise ValueError('k must be between one and training sample size')
    classes=np.unique(y)
    distances=((query[:,None,:]-X[None,:,:])**2).sum(axis=-1)
    # Stable sort means training order resolves equal-distance boundaries.
    neighbors=np.argsort(distances,axis=1,kind='stable')[:,:k]
    votes=np.stack([(y[neighbors]==label).sum(axis=1) for label in classes],axis=1)
    return classes[votes.argmax(axis=1)]


class MultinomialNB:
    def fit(self,X,y,alpha=1.):
        X=np.asarray(X,float)
        y=np.asarray(y)
        if X.ndim != 2 or 0 in X.shape or y.shape != (len(X),):
            raise ValueError('counts must have shape (n,d) and labels shape (n,)')
        if not np.isfinite(X).all() or np.any(X<0) or not np.isfinite(alpha) or alpha <= 0:
            raise ValueError('nonnegative counts and positive alpha required')
        self.classes=np.unique(y)
        counts=np.stack([X[y==c].sum(axis=0) for c in self.classes])+alpha
        self.log_likelihood=np.log(counts/counts.sum(axis=1,keepdims=True))
        self.log_prior=np.log(np.array([(y==c).mean() for c in self.classes]))
        return self

    def predict_proba(self,X):
        X=np.asarray(X,float)
        if X.ndim != 2 or X.shape[1] != self.log_likelihood.shape[1] or not np.isfinite(X).all() or np.any(X<0):
            raise ValueError('query counts must be finite, nonnegative, and match the vocabulary')
        return softmax(X@self.log_likelihood.T+self.log_prior)

    def predict(self,X):
        return self.classes[self.predict_proba(X).argmax(axis=1)]


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


class Tree:
    """Greedy squared-error regression or Gini classification tree.

    Leaves are training means. Classification expects labels 0 and 1.
    """
    def __init__(self,max_depth=3,min_leaf=1,classification=False,max_features=None,seed=0):
        self.max_depth=max_depth
        self.min_leaf=min_leaf
        self.classification=classification
        self.max_features=max_features
        self.rng=np.random.default_rng(seed)

    def impurity(self,y):
        return 2*y.mean()*(1-y.mean()) if self.classification else y.var()

    def fit(self,X,y):
        X,y=_supervised(X,y)
        if self.classification and not np.isin(y,[0.,1.]).all():
            raise ValueError('this teaching classification tree requires labels 0 and 1')
        def build(X,y,depth):
            value=y.mean()
            if depth >= self.max_depth or len(y) < 2*self.min_leaf or self.impurity(y) < 1e-14:
                return (value,)
            features=np.arange(X.shape[1])
            if self.max_features is not None:
                features=self.rng.choice(features,min(self.max_features,len(features)),replace=False)
            best=None
            score=self.impurity(y)
            for j in features:
                unique=np.unique(X[:,j])
                for threshold in (unique[:-1]+unique[1:])/2:
                    left=X[:,j]<=threshold
                    nleft=left.sum()
                    if min(nleft,len(y)-nleft)<self.min_leaf:
                        continue
                    candidate=(nleft*self.impurity(y[left])+(len(y)-nleft)*self.impurity(y[~left]))/len(y)
                    if candidate < score-1e-14:
                        score=candidate
                        best=(j,threshold,left)
            if best is None:
                return (value,)
            j,t,left=best
            return (int(j),float(t),build(X[left],y[left],depth+1),build(X[~left],y[~left],depth+1))
        self.root=build(X,y,0)
        return self

    def predict(self,X):
        def one(row):
            node=self.root
            while len(node)>1:
                j,t,left,right=node
                node=left if row[j]<=t else right
            return node[0]
        return np.array([one(row) for row in np.asarray(X)])


class Forest:
    def __init__(self,trees=20,max_depth=4,seed=0):
        self.trees,self.depth,self.seed=trees,max_depth,seed

    def fit(self,X,y):
        rng=np.random.default_rng(self.seed)
        self.models=[]
        self.inbag=[]
        for _ in range(self.trees):
            index=rng.integers(len(X),size=len(X))
            model=Tree(self.depth,classification=True,max_features=max(1,int(np.sqrt(X.shape[1]))),seed=int(rng.integers(2**30)))
            model.fit(X[index],y[index])
            self.models.append(model)
            self.inbag.append(np.unique(index))
        return self

    def predict_proba_positive(self,X):
        return np.mean([model.predict(X) for model in self.models],axis=0)


class GradientBoosting:
    def __init__(self,steps=30,rate=.1,depth=2):
        self.steps,self.rate,self.depth=steps,rate,depth

    def fit(self,X,y):
        self.base=y.mean()
        prediction=np.full(len(y),self.base)
        self.models=[]
        for _ in range(self.steps):
            model=Tree(self.depth).fit(X,y-prediction)
            prediction+=self.rate*model.predict(X)
            self.models.append(model)
        return self

    def predict(self,X):
        prediction=np.full(len(X),self.base)
        for model in self.models:
            prediction+=self.rate*model.predict(X)
        return prediction


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


def gaussian_mixture_1d(x,k=2,steps=100,seed=0):
    """EM for scalar Gaussians with a variance floor; returns likelihood trace."""
    x=np.asarray(x,float)
    if x.ndim != 1 or len(x)==0 or not np.isfinite(x).all():
        raise ValueError('x must be a nonempty finite vector')
    if not isinstance(k,(int,np.integer)) or not 1 <= k <= len(x) or not isinstance(steps,(int,np.integer)) or steps<1:
        raise ValueError('k must be in [1,n] and steps must be a positive integer')
    rng=np.random.default_rng(seed)
    mean=rng.choice(x,k,replace=False).astype(float)
    variance=np.full(k,max(x.var(),1e-6))
    prior=np.full(k,1/k)
    history=[]
    def expectation():
        log_joint=np.log(prior)[None,:]-.5*(np.log(2*np.pi*variance)[None,:]+(x[:,None]-mean)**2/variance)
        normalizer=np.logaddexp.reduce(log_joint,axis=1)
        r=np.exp(log_joint-normalizer[:,None])
        return r,float(normalizer.sum())
    r,likelihood=expectation()
    history.append(likelihood)
    for _ in range(steps):
        mass=r.sum(axis=0)
        if not np.isfinite(mass).all() or np.any(mass <= np.finfo(float).tiny):
            raise FloatingPointError('a mixture component lost all effective mass; try another initialization')
        mean=(r*x[:,None]).sum(axis=0)/mass
        variance=np.maximum((r*(x[:,None]-mean)**2).sum(axis=0)/mass,1e-6)
        prior=mass/len(x)
        # Return responsibilities and likelihood for the FINAL parameters.
        r,likelihood=expectation()
        history.append(likelihood)
    return prior,mean,variance,r,np.array(history)


def _hmm_inputs(initial,transition,emission,observations):
    initial=np.asarray(initial,float)
    transition=np.asarray(transition,float)
    emission=np.asarray(emission,float)
    observations=np.asarray(observations)
    if initial.ndim != 1 or len(initial)==0 or transition.shape != (len(initial),len(initial)) or emission.ndim != 2 or emission.shape[0] != len(initial) or emission.shape[1]==0:
        raise ValueError('HMM state and probability matrix dimensions must agree')
    for probabilities in (initial,transition,emission):
        if not np.isfinite(probabilities).all() or np.any(probabilities<0):
            raise ValueError('HMM probabilities must be finite and nonnegative')
    if not np.isclose(initial.sum(),1.) or not np.allclose(transition.sum(axis=1),1.) or not np.allclose(emission.sum(axis=1),1.):
        raise ValueError('initial probabilities and each probability row must sum to one')
    if observations.ndim != 1 or len(observations)==0 or not np.issubdtype(observations.dtype,np.integer) or np.any(observations<0) or np.any(observations>=emission.shape[1]):
        raise ValueError('observations must be nonempty valid integer symbol indices')
    return initial,transition,emission,observations


def hmm_forward(initial,transition,emission,observations):
    """Scaled forward algorithm; log evidence remains stable over long sequences."""
    initial,transition,emission,observations=_hmm_inputs(initial,transition,emission,observations)
    alpha=initial*emission[:,observations[0]]
    scale=alpha.sum()
    if scale<=0: raise ValueError('impossible observation sequence')
    alpha/=scale
    log_evidence=np.log(scale)
    history=[alpha.copy()]
    for observation in observations[1:]:
        alpha=(alpha@transition)*emission[:,observation]
        scale=alpha.sum()
        if scale<=0: raise ValueError('impossible observation sequence')
        alpha/=scale
        log_evidence+=np.log(scale)
        history.append(alpha.copy())
    return log_evidence,np.array(history)


def hmm_viterbi(initial,transition,emission,observations):
    initial,transition,emission,observations=_hmm_inputs(initial,transition,emission,observations)
    with np.errstate(divide='ignore'):
        log_initial=np.log(initial)
        log_transition=np.log(transition)
        log_emission=np.log(emission)
    score=log_initial+log_emission[:,observations[0]]
    back=[]
    for observation in observations[1:]:
        candidate=score[:,None]+log_transition
        previous=candidate.argmax(axis=0)
        score=candidate.max(axis=0)+log_emission[:,observation]
        back.append(previous)
    if not np.isfinite(score).any():
        raise ValueError('impossible observation sequence')
    state=int(score.argmax());path=[state]
    for pointer in reversed(back):
        state=int(pointer[state]);path.append(state)
    return np.array(path[::-1])
