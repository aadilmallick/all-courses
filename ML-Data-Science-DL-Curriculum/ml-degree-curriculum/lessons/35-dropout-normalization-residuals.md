# 35. Dropout, normalization, residuals, and neural regularization

[Previous](34-activations-initialization.md) · [Course index](../README.md) · [Next](36-pytorch-training.md)

## Several mechanisms influence generalization

A weight penalty changes the objective. Dropout changes stochastic computation during training. Data augmentation changes the distribution of training examples. Early stopping selects an intermediate state. They can all influence generalization, but should not be treated as interchangeable versions of one algebraic penalty.

For inverted dropout with drop probability $p<1$, sample $m_j\sim\operatorname{Bernoulli}(1-p)$ and set $\widetilde h_j=m_jh_j/(1-p)$. Conditional on $h$, the expectation is $h_j$, and variance is $h_j^2p/(1-p)$. At inference use the unmasked activation. This preserves expected activation at one layer; a nonlinear whole network's expected prediction is generally not exactly equal to its deterministic inference prediction.

If $h=2$ and $p=0.5$, the training activation is either 0 or 4, each with probability one half. Its expectation is 2 and variance is 4. Multiplying by $1-p$ again at inference would apply the scaling twice under inverted dropout.

## Normalization specifies axes

Batch normalization computes a feature-wise batch mean and variance, standardizes, then applies learned scale $\gamma$ and shift $\beta$. During ordinary inference it uses stored running statistics. Layer normalization instead computes statistics within each example over chosen feature axes, so it does not need cross-example batch statistics. RMSNorm divides by a root mean square without subtracting the mean.

Standardization does not transform an arbitrary distribution into a Gaussian. Zero mean and unit variance are moment conditions, not a distribution family. Learned scale and bias also change those moments. BatchNorm's historical “internal covariate shift” motivation does not settle the mechanism behind every empirical benefit. Small batches, nonstationary statistics, and train/eval mode errors can matter greatly.

For batch $(1,3)$, mean 2 and population variance 1 produce normalized values $(-1,1)$ before epsilon and learned affine parameters. For a single feature with one observation, the variance is zero and the behavior depends on normalization axes and implementation rules. Do not transfer a scalar example's conclusion blindly to every module.

## Residual paths

A residual block computes $y=x+F_\theta(x)$ when shapes match. Its Jacobian is $I+J_F(x)$. The identity creates a direct derivative path. Across blocks the derivative is a product of these sums, so residual connections help optimization without guaranteeing that all gradients remain well conditioned. A derivative of $F$ near $-I$ can still cancel the path.

When input and output widths differ, use a specified projection on the skip or a different merge. Addition requires compatible shape and combines coordinates. Concatenation preserves separate coordinates and increases width. They are different architectures.

## Implementations and deeper examples
## 4.9 Normalization inside a network

Input standardization transforms measurements before learned computation. Batch normalization and layer normalization transform intermediate activations. Their purpose and axes differ. Batch normalization for image features uses statistics over batch and spatial positions separately for each channel under its ordinary training behavior. Layer normalization uses specified trailing feature axes within each example.

Batch normalization maintains running statistics for evaluation. A small or unusual training batch can give noisy estimates. Freezing weights alone does not stop running statistics from changing if the module remains in training mode. This matters greatly in transfer learning.

Layer normalization does not use the same batch-dependent running-statistic mechanism. It is common in sequence models because it normalizes features at each token position. The next chapter uses it in residual transformer blocks. Do not exchange normalization types solely because they both contain the word normalization; they encode different dependence structures.

Normalization can improve optimization, but it does not excuse poorly scaled raw inputs or invalid preprocessing. It can also alter information the task needs. If absolute signal amplitude predicts a target, normalizing every example independently may remove that signal. Understand what variation the transform suppresses.



## 4.10 Residual connections make depth easier to optimize

A residual block outputs `x + F(x)`, where `F` is a learned transformation. If the identity mapping is already useful, the block can learn a small correction rather than reconstructing the whole signal. The derivative also has an identity contribution, helping information and gradients pass through deep stacks.

```python
import torch
from torch import nn

class ResidualBlock(nn.Module):
    def __init__(self, channels):
        super().__init__()
        self.branch = nn.Sequential(
            nn.Conv2d(channels, channels, 3, padding=1),
            nn.ReLU(),
            nn.Conv2d(channels, channels, 3, padding=1),
        )
        self.activation = nn.ReLU()
    def forward(self, features):
        return self.activation(features + self.branch(features))

block = ResidualBlock(8)
print(block(torch.randn(2, 8, 16, 16)).shape)
```

The addition requires compatible shapes. If a block changes channel count or spatial resolution, use a projection path, often a one-by-one convolution with suitable stride, so the skip branch matches. An accidental broadcast at a residual addition can create a legal but unintended network, so inspect both operands.

Residual connections do not guarantee that arbitrary depth trains well. Initialization, normalization, optimizer settings, and data still matter. The useful intuition is that the architecture offers an easy path for carrying existing features while learning refinements. This same idea reappears in transformers and diffusion networks.


The dropout and normalization experiments in `code/classical/advanced.py` include a direct check of expected inverted-dropout scaling and separate batch versus feature-axis statistics. Run them before adding stochastic regularization to a larger network.


## Inspect the complete numerical experiment

This is the exact function in [advanced.py](../code/classical/advanced.py). Its module imports NumPy plus `finite_difference` and `softmax` from the adjacent `models.py`. Run `python code/classical/advanced.py` to execute all of these experiments. Assertions check the stated finite example; they do not claim general capability.

```python
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
```


### BatchNorm variance conventions

For the default PyTorch BatchNorm configuration, training normalization divides squared deviations by the number of values in each channel's statistics, while the running variance estimate uses its degrees-of-freedom correction. Disabling `track_running_stats` makes evaluation use current-batch statistics too. See the [framework contract](https://docs.pytorch.org/docs/2.15/generated/torch.nn.BatchNorm1d.html).
