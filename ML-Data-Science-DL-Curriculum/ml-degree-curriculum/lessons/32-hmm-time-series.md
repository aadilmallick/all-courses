# 32. Hidden Markov models, sequence inference, and time series

[Previous](31-mixtures-latent-variables.md) · [Course index](../README.md) · [Next](33-neural-networks-backprop.md)

## Hidden state gives a sequence memory

An HMM has an initial state distribution $\pi$, transition probabilities $A_{ij}=P(Z_t=j\mid Z_{t-1}=i)$, and emission probabilities $B_{jv}=P(X_t=v\mid Z_t=j)$. Each transition row sums to one; each emission row sums to one. The hidden-state Markov assumption and conditional emission assumption simplify an otherwise enormous joint distribution.

For states $z_{1:T}$ and observations $x_{1:T}$,

$$p(z,x)=\pi_{z_1}B_{z_1x_1}\prod_{t=2}^T A_{z_{t-1}z_t}B_{z_tx_t}.$$

An HMM is not a recurrent neural network: its hidden state is a modeled random variable with a transition distribution, while a standard RNN updates a deterministic vector conditional on inputs and prior state.

## Forward inference sums alternatives

Define $\alpha_t(j)=P(x_{1:t},Z_t=j)$. At time one, $\alpha_1(j)=\pi_jB_{jx_1}$. For later times, sum over the preceding state:

$$\alpha_t(j)=B_{jx_t}\sum_i\alpha_{t-1}(i)A_{ij}.$$

The observation likelihood is $\sum_j\alpha_T(j)$. This dynamic program costs $O(TK^2)$ rather than enumerating $K^T$ state paths. It works because all paths ending in the same state share the same conditional future structure.

For $\pi=(0.6,0.4)$ and first-observation emission probabilities $(0.5,0.1)$, unnormalized forward values are $(0.3,0.04)$ and evidence is 0.34. The filtered state distribution is $(0.88235,0.11765)$. Multiplying many raw probabilities underflows, so normalize each forward vector and accumulate the logarithms of its normalization factors. The code implements that scaled calculation.

## Viterbi selects a path

Forward inference uses a sum to marginalize all paths. Viterbi replaces the sum with a maximum to find the most probable single hidden path. In log space, transition products become sums. Store the maximizing predecessor for each state and backtrack from the best final state. Choosing the most likely state independently at each time need not give the most probable joint path.

The backward recursion supports smoothing, which conditions on both past and future observations. Combining forward and backward messages yields posterior state occupancies and adjacent-state probabilities. Baum-Welch uses these expected counts in EM updates for transitions and emissions. Filtering, smoothing, decoding, and parameter learning are distinct tasks.

## Time series extends beyond HMMs

A scalar autoregression predicts $x_t=c+\sum_{j=1}^pa_jx_{t-j}+\epsilon_t$. Lag features reduce it to regression, but the evaluation remains temporal. Seasonal baselines, moving averages, state-space models, and recurrent models embody different assumptions. A random row split can expose future regimes and overlapping targets.

For AR(1), $x_t=ax_{t-1}+\epsilon_t$, a stationary finite-variance solution with white-noise innovation variance $\sigma^2$ requires $|a|<1$ under the usual assumptions. Taking variances gives $V=a^2V+\sigma^2$, hence $V=\sigma^2/(1-a^2)$. This calculation shows why values near unit magnitude create persistent dependence and why iid uncertainty formulas can fail.

Optional application: enumerate all hidden paths for a two-state sequence of length three and compare their summed probability with the forward algorithm and their maximum with Viterbi. This verifies two different dynamic programs against a transparent exact calculation.


## Backward messages and an EM bridge

Define $\beta_t(i)=P(x_{t+1:T}\mid Z_t=i)$ with terminal value 1. Condition on the next state to get $\beta_t(i)=\sum_jA_{ij}B_{j,x_{t+1}}\beta_{t+1}(j)$. The product $\alpha_t(i)\beta_t(i)$ is proportional to posterior state probability at time $t$. Normalize across $i$ to obtain $\gamma_t(i)$.

The posterior probability of adjacent states is proportional to $\alpha_t(i)A_{ij}B_{j,x_{t+1}}\beta_{t+1}(j)$; normalize across both indices to obtain $\xi_t(i,j)$. Baum-Welch updates a transition row using expected transition counts divided by expected state departure counts: $A_{ij}^{new}=\sum_{t<T}\xi_t(i,j)/\sum_{t<T}\gamma_t(i)$. Emission probabilities use expected symbol counts in each state. Initial probabilities use the posterior at time one.

These updates are EM: latent paths supply expected sufficient statistics. They require consistent scaling if forward and backward values are normalized, and zero expected counts need a prior or an explicit rule. A numerically stable forward routine alone does not automatically implement a complete Baum-Welch trainer; the supplied code executes forward inference and Viterbi decoding, while these equations derive the learning extension.


## Complete algorithm laboratory

The following program is saved as [the lesson laboratory](../code/classical/lesson_32.py). It uses only NumPy. The final small dataset is chosen so that you can connect each array to the preceding derivation. Run it from the course root with `python code/classical/lesson_32.py`.

```python
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
```

The recorded output in the supplied CPU environment was:

```text
0.069616 [[0.88235294 0.11764706]
 [0.52411874 0.47588126]
 [0.86287635 0.13712365]]
[0 0 0]
```


## Verification note

The forward and Viterbi routines now validate state dimensions, stochastic probability rows, and symbol indices. Zero probabilities are permitted, while an impossible observed sequence raises ValueError. A negative symbol index is rejected rather than interpreted as Python indexing from the end.
