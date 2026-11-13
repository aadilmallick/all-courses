import numpy as np

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

if __name__ == "__main__":
    rng=np.random.default_rng(31)
    x=np.r_[rng.normal(-3,.3,50),rng.normal(3,.3,50)]
    prior,mean,var,r,trace=gaussian_mixture_1d(x,k=2,seed=3)
    print(prior,mean,var)
    assert np.all(np.diff(trace)>=-1e-7)
