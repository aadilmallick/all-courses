# 53. Discrete diffusion and masked language generation

[Previous](52-continuous-diffusion.md) · [Course index](../README.md) · [Next](54-rl-values.md)

## Discrete symbols require a different corruption process

A token ID is an address, so adding Gaussian noise directly to the ID does not give a meaningful interpolated word. Discrete diffusion defines a transition process over token states. One useful absorbing-mask process independently replaces tokens with a special mask as time increases, and learns to reverse that corruption using contextual predictions.

Let $x_0$ be a sequence of $T$ token IDs. At time $t\in(0,1]$, independently mask each coordinate with probability $t$, obtaining $x_t$. A bidirectional denoiser predicts original tokens from the visible and masked context. A simple training objective is expected masked cross entropy. A commonly analyzed continuous-time absorbing-mask likelihood bound includes a $1/t$ weighting:

$$\mathcal L=E_{t,x_0,x_t}\left[\frac1t\sum_{i=1}^T\mathbf1[x_t^i=\mathrm{MASK}]\,(-\log p_\theta(x_0^i\mid x_t,t))\right].$$

Whether the sum is divided by $T$, how time is sampled, and how endpoints are handled are conventions that change scaling or the estimator. Do not replace this with an unweighted average over whatever masked tokens happened to occur and call the objectives identical.

## A numeric objective trace

Take target tokens $(a,b,a)$, sampled time $t=0.5$, and mask pattern $(1,0,1)$. Suppose the denoiser assigns target probabilities 0.8 and 0.6 at the two masked coordinates. Summed masked loss is $-\log0.8-\log0.6\approx0.7340$. The $1/t$-weighted sum is approximately 1.4679. Dividing this by sequence length gives about 0.4893. Dividing the unweighted sum by the two masks instead gives about 0.3670, a different random objective normalization.

Time near zero creates rare masks and large weights in this estimator. Finite implementations need a specified time interval, estimator, or reformulation to manage variance. The advanced laboratory uses fixed nonzero time and clearly labels its simplified objective; it does not claim to reproduce a full LLaDA training pipeline.

## Generation is iterative conditional prediction

Start with masked output coordinates, preserve any supplied prompt according to the conditioning design, predict token distributions, and reveal some coordinates. A schedule determines how many tokens remain masked. Confidence-based reveal or remasking uses the current model's probabilities, which can be wrong or miscalibrated. Independent per-position predictions at one step do not establish conditional independence of the entire generated sequence across the full reverse trajectory.

An absorbing-mask forward process, uniform-token corruption, and continuous embedding diffusion are different models. Bidirectional masked attention can exploit visible tokens on both sides. An autoregressive decoder instead fixes a left-to-right factorization. The generation latency depends on number of iterations, recomputation, batching, hardware, and quality requirements; parallel token prediction is not a universal speed guarantee.

## Likelihood, training, and evaluation boundaries

A variational likelihood bound is not always an exactly computed sequence likelihood. Autoregressive perplexity and diffusion evaluation estimates may require different calculations. Preference or reinforcement updates must use a likelihood or trajectory objective consistent with the model's sampling process. Multiplying convenient token probabilities from one denoising step does not automatically give the final sequence probability.

The [Large Language Diffusion Models paper](https://arxiv.org/abs/2502.09992) provides a primary model reference. This course focuses on the established absorbing-mask mathematics and deliberately avoids unverified claims about every model family named in a changing primer. The local executable demonstrates corruption, a learned categorical denoiser, and an iterative reveal schedule. It is an educational finite-table model, not a trained large language model.

Optional application: enumerate every mask pattern for a length-two sequence and verify that the expected weighted per-coordinate contribution has the intended mask-probability correction at fixed time. Then distinguish this algebraic check from proving the full continuous-time generative bound.


## Inspect the complete numerical experiment

This is the exact function in [advanced.py](../code/classical/advanced.py). Its module imports NumPy plus `finite_difference` and `softmax` from the adjacent `models.py`. Run `python code/classical/advanced.py` to execute all of these experiments. Assertions check the stated finite example; they do not claim general capability.

```python
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
```
