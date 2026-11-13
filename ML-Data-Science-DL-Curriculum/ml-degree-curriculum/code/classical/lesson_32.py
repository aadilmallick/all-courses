import numpy as np

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

if __name__ == "__main__":
    initial=np.array([.6,.4])
    A=np.array([[.7,.3],[.4,.6]])
    B=np.array([[.5,.5],[.1,.9]])
    logp,filtered=hmm_forward(initial,A,B,[0,1,0])
    print(np.exp(logp),filtered)
    print(hmm_viterbi(initial,A,B,[0,1,0]))
