# 52. Continuous diffusion, denoising objectives, and reverse sampling

[Previous](51-vae-gan.md) · [Course index](../README.md) · [Next](53-discrete-diffusion-language.md)

## Corrupt data in a known direction

A Gaussian diffusion forward step is $q(x_t\mid x_{t-1})=\mathcal N(\sqrt{\alpha_t}x_{t-1},\beta_tI)$ with $\alpha_t=1-\beta_t$. Let $\bar\alpha_t=\prod_{s=1}^t\alpha_s$. Repeated Gaussian composition gives

$$x_t=\sqrt{\bar\alpha_t}x_0+\sqrt{1-\bar\alpha_t}\epsilon,\qquad\epsilon\sim\mathcal N(0,I).$$

To see the variance recursion, assume $x_{t-1}=\sqrt{\bar\alpha_{t-1}}x_0+\sqrt{1-\bar\alpha_{t-1}}\epsilon'$. Multiplication by $\sqrt{\alpha_t}$ and addition of independent noise gives conditional variance $\alpha_t(1-\bar\alpha_{t-1})+\beta_t=1-\bar\alpha_t$. This justifies direct sampling at a chosen time without simulating every prior step.

## Learn the reverse direction

The forward corruption is known; reversing it requires information about the data distribution. A neural model predicts noise $\epsilon_\theta(x_t,t)$ using a squared objective $E\|\epsilon-\epsilon_\theta\|^2$ under a declared time sampling and weighting rule. Different parameterizations predict clean data, noise, score, or velocity. They are related but their training weights and conditioning must be specified.

For the noise parameterization, a common reverse mean is

$$\mu_\theta(x_t,t)=\frac1{\sqrt{\alpha_t}}\left(x_t-\frac{\beta_t}{\sqrt{1-\bar\alpha_t}}\epsilon_\theta(x_t,t)\right).$$

A reverse sampler adds appropriately chosen variance noise except at the final step under its convention. The Gaussian forward posterior conditioned on $x_0$ has variance $\widetilde\beta_t=\beta_t(1-\bar\alpha_{t-1})/(1-\bar\alpha_t)$. Computing it uses a product of two Gaussian densities and completion of the square. A learned reverse model replaces the unknown clean-data dependence with predictions from noisy observations.

## Score interpretation

For the conditional corruption density, $\nabla_{x_t}\log q(x_t\mid x_0)=-(x_t-\sqrt{\bar\alpha_t}x_0)/(1-\bar\alpha_t)=-\epsilon/\sqrt{1-\bar\alpha_t}$. Thus a noise prediction corresponds to a score prediction up to a time-dependent factor. The marginal data score requires averaging the appropriate conditional quantity under the posterior; it is not obtained by assuming the unknown clean sample is available at inference.

## Guidance and sampling tradeoffs

Classifier-free guidance combines conditional and unconditional predictions after training with dropped conditions, for example $\epsilon_u+s(\epsilon_c-\epsilon_u)$. The scale changes the generated distribution and can trade diversity for stronger conditioning. Fewer sampling steps require a suitable solver or a trained/distilled procedure; skipping arbitrary transitions does not preserve the original distribution exactly.

A denoising loss decrease is a local training check. It does not establish image quality, diversity, or absence of memorization. Evaluate generated samples using a declared protocol and include limitations of summary metrics.

## Executable bridges

The advanced NumPy laboratory implements a tiny scalar noise predictor with a learned time feature and verifies that its denoising objective decreases. The PyTorch program `code/pytorch/06_diffusion_training_step.py` supplies a framework training step; it is not a full production sampler.

## 6.12 Denoising connects to diffusion training

A denoiser learns to recover structure from a corrupted observation. In a diffusion-style objective, clean data `x0` is combined with Gaussian noise at a sampled noise level:

\[
x_t=\sqrt{\bar\alpha_t}x_0+\sqrt{1-\bar\alpha_t}\epsilon.
\]

A network receives the noisy observation and a representation of time or noise level, then predicts the added noise. Squared error between predicted and actual noise supplies a supervised learning signal. The network architecture can be a CNN, transformer, or another suitable function.

```python
import torch
from torch import nn

torch.manual_seed(67)
model = nn.Sequential(nn.Linear(3, 32), nn.SiLU(), nn.Linear(32, 2))
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
clean = torch.randn(64, 2)
noise_level = torch.rand(64, 1)
alpha_bar = (1.0 - 0.95 * noise_level).clamp(0.01, 0.99)
noise = torch.randn_like(clean)
noisy = alpha_bar.sqrt() * clean + (1 - alpha_bar).sqrt() * noise
prediction = model(torch.cat([noisy, noise_level], dim=1))
loss = (prediction - noise).square().mean()
optimizer.zero_grad(set_to_none=True)
loss.backward()
optimizer.step()
print(loss.item())
```

This is a complete noise-prediction training step with a simple continuous noise-level parameterization. It is not a complete DDPM sampler, and the chosen level schedule is educational rather than a reproduction of a paper. Generation requires a consistent reverse process, schedule, and sampling rule. Learning to predict noise is only one part of that system.

The conceptual connection is valuable: a complicated generative model can still use ordinary tensors, a conditioned neural network, an explicit target, and backpropagation. Understanding those components lets you read specialized diffusion implementations without mistaking their objective for unexplained magic.


## Inspect the complete numerical experiment

This is the exact function in [advanced.py](../code/classical/advanced.py). Its module imports NumPy plus `finite_difference` and `softmax` from the adjacent `models.py`. Run `python code/classical/advanced.py` to execute all of these experiments. Assertions check the stated finite example; they do not claim general capability.

```python
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
```
