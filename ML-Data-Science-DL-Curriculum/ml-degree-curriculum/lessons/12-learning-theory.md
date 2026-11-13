# 12. Generalization, inductive bias, bias variance, and double descent

[Previous](11-optimization.md) · [Course index](../README.md) · [Next](13-splits-cross-validation.md)

## Fitting and generalizing answer different questions

Training risk averages loss on observed cases. Population risk $R(f)=E_{(X,Y)\sim P}[\ell(f(X),Y)]$ measures the target distribution. We cannot evaluate that expectation exactly from a finite sample. Held-out data estimate it only to the extent that the held-out sampling process represents the intended deployment situation.

An inductive bias is a preference among possible rules. Linear models prefer a restricted functional form. Nearest neighbors prefer local similarity under a selected distance. Convolution prefers locality and shared spatial structure. Regularization and optimization introduce additional preferences. A model that can interpolate every finite training set still requires a way to choose among those interpolating rules.

## Derive the squared-error decomposition

At a fixed input $x$, let $Y=f_*(x)+\epsilon$ with $E[\epsilon\mid x]=0$ and variance $\sigma^2(x)$. Let $\widehat f_D(x)$ depend on a random training set $D$, independent of the new test noise. Add and subtract $m(x)=E_D\widehat f_D(x)$:

$$Y-\widehat f_D=\epsilon+(f_*-m)+(m-\widehat f_D).$$

Squaring and taking expectation leaves three squared terms. Cross terms vanish by the zero means and independence assumptions. Therefore expected squared error is

$$\sigma^2(x)+(f_*(x)-m(x))^2+E_D[(\widehat f_D(x)-m(x))^2].$$

These are irreducible noise, squared bias, and variance. This identity does not say variance must increase monotonically with every definition of model size. It therefore does not contradict observed double descent.

## A finite-class generalization argument

Suppose losses lie in $[0,1]$, examples are iid, and a finite hypothesis set $\mathcal H$ is fixed before observing the sample. Hoeffding's inequality gives, for one fixed rule, $P(|R-\widehat R|>\epsilon)\le2e^{-2n\epsilon^2}$. A union bound over all rules gives at most $2|\mathcal H|e^{-2n\epsilon^2}$. Solving for failure probability $\delta$ yields a simultaneous deviation bound

$$\epsilon=\sqrt{\frac{\log(2|\mathcal H|/\delta)}{2n}}.$$

The simultaneous part matters: it permits selecting a rule after looking at training data. A bound for a single prespecified rule cannot simply be applied to whichever of millions happened to fit best. Continuous classes need richer capacity measures such as VC dimension or Rademacher complexity; this finite-class calculation motivates them rather than proving those more general theorems.

## Interpolation and double descent

Near an interpolation threshold, a model may need unstable parameter values to fit noise, producing a peak in test error. Beyond that threshold, optimization or minimum-norm selection can favor interpolating solutions that generalize better. Model-wise, epoch-wise, and sample-wise curves depend on distinct experimental choices. Double descent is an empirical and theoretical phenomenon in specified settings, not a guarantee that larger models always improve performance.

## A useful failure analysis

High training and validation error suggests underfitting, optimization failure, poor features, label problems, or an inappropriate target. Low training error with high validation error suggests a generalization gap, but leakage or mismatched preprocessing can also distort comparisons. Plot learning curves against both training steps and dataset size. Compare simple baselines. Change a diagnosis-driven variable instead of automatically adding layers.

Optional application: generate noisy quadratic data, fit polynomial degrees from 0 upward with SVD, and repeat across several training samples. Estimate the mean predictor and its variation at a fixed point. Describe how regularization changes both quantities. A single training run cannot directly reveal the expectation over training sets appearing in the decomposition.


## Why the ERM bound has two deviations

Suppose the uniform deviation bound $|R(h)-\widehat R(h)|\le\epsilon$ holds for every $h$ in the fixed class. Let $\widehat h$ minimize empirical risk and $h^*$ minimize population risk in that class. Then

$$R(\widehat h)\le\widehat R(\widehat h)+\epsilon\le\widehat R(h^*)+\epsilon\le R(h^*)+2\epsilon.$$

The first and last inequalities use uniform generalization, while the middle uses empirical optimality. This bounds estimation error relative to the best class member. It does not bound the approximation error between that class and every possible predictor.

VC dimension measures how many observations a binary hypothesis class can label in every possible way. Thresholds on a line can shatter one point, but cannot label two ordered points positive then negative if the rule is always positive to the right. Their VC dimension is one. The definition concerns all label assignments on a selected point set, not how many training points one fitted threshold classifies correctly.
