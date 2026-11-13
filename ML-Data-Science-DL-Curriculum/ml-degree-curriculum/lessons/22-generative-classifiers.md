# 22. Naive Bayes, discriminant analysis, and generative classification

[Previous](21-nearest-neighbors.md) · [Course index](../README.md) · [Next](23-svm-kernels-gaussian-processes.md)

## Model a class and its observations jointly

A generative classifier models $P(Y=c)$ and $P(X=x\mid Y=c)$. Bayes' theorem converts them into $P(Y=c\mid X=x)$. For choosing the most probable class, the common denominator can be omitted, but calibrated probabilities require normalization.

Naive Bayes approximates the conditional likelihood by $\prod_jP(x_j\mid c)$. Taking logs gives the additive score $\log P(c)+\sum_j\log P(x_j\mid c)$. Conditional independence is a modeling assumption, often false in real text, yet the resulting decision rule can still be effective. Strong performance does not prove the assumption is literally true.

## A complete small text calculation

Suppose the vocabulary is `offer, meeting`. Spam training counts total $(8,2)$ and nonspam counts total $(1,9)$. With add-one smoothing, spam token probabilities become $(9/12,3/12)$ and nonspam probabilities $(2/12,10/12)$. For equal class priors and a document with one `offer` and one `meeting`, unnormalized scores are $0.5(9/12)(3/12)=0.09375$ and $0.5(2/12)(10/12)\approx0.06944$. Normalize by their sum to obtain spam probability approximately 0.5745.

Multinomial models use counts and token probability vectors. A multinomial combinatorial coefficient depends on the observed count vector but is common to all classes, so it can be omitted when comparing classes. Bernoulli naive Bayes models presence and absence separately. Gaussian naive Bayes models each continuous feature with a class-specific scalar Gaussian. Applying a multinomial count likelihood to arbitrary negative standardized features is not appropriate.

## Smoothing and zero probabilities

Without smoothing, one unseen class-token pair can assign zero likelihood to any document containing it. Add-$\alpha$ smoothing uses $(N_{cj}+\alpha)/(\sum_jN_{cj}+\alpha V)$. This is also a Dirichlet posterior-predictive form under the appropriate prior. Smoothing strength, vocabulary, and preprocessing belong in model selection.

Products of many small probabilities underflow. Compute log scores and normalize with log-sum-exp or softmax. A probability of 0.99 from naive Bayes may be overconfident when correlated features repeatedly count the same evidence. Evaluate calibration independently of accuracy.

## Linear and quadratic discriminant analysis

Assume $X\mid Y=c\sim\mathcal N(\mu_c,\Sigma)$ with one covariance shared across classes. The class log density contains $-\tfrac12(x-\mu_c)^\top\Sigma^{-1}(x-\mu_c)$. Expanding produces a quadratic term in $x$ common to all classes, which cancels in comparisons. Remaining scores are linear:

$$\delta_c(x)=x^\top\Sigma^{-1}\mu_c-\tfrac12\mu_c^\top\Sigma^{-1}\mu_c+\log\pi_c.$$

This is linear discriminant analysis, distinct from latent Dirichlet allocation despite the shared abbreviation LDA. If each class has its own covariance, quadratic terms no longer cancel, yielding QDA. More covariance parameters increase flexibility and estimation demands. A singular estimated covariance needs a regularized estimator or other explicit treatment.

Optional application: duplicate a text feature and compare predicted probabilities. The duplicated evidence violates conditional independence and can increase confidence even when the classification stays the same. Diagnose why this differs from obtaining an independent second measurement.


## Gaussian naive Bayes in one numerical decision

Suppose one feature has class means 0 and 2, common variance 1, and equal priors. At query $x=1.5$, class log scores, ignoring the common normal-density constant, are $\log0.5-(1.5-0)^2/2$ and $\log0.5-(1.5-2)^2/2$. Their difference in favor of class one is $-0.125-(-1.125)=1$. The normalized class-one probability is therefore $\sigma(1)\approx0.7311$.

If variances differ, the $-\tfrac12\log\sigma_c^2$ term no longer cancels. Ignoring it favors broad distributions incorrectly. In several conditionally independent dimensions, add the scalar Gaussian log densities. A variance floor prevents division by zero for constant training features, but must be treated as part of the estimator's numerical/statistical contract.

Notice the conceptual bridge to logistic regression: under Gaussian class assumptions with shared covariance, log posterior odds are linear in the input. Generative estimation and discriminative fitting can then produce the same functional family through different parameter estimates and assumptions.


## Complete algorithm laboratory

The following program is saved as [the lesson laboratory](../code/classical/lesson_22.py). It uses only NumPy. The final small dataset is chosen so that you can connect each array to the preceding derivation. Run it from the course root with `python code/classical/lesson_22.py`.

```python
import numpy as np

def softmax(z):
    z = np.asarray(z, dtype=float)
    if z.ndim == 0 or z.shape[-1] == 0 or np.isnan(z).any() or np.isposinf(z).any():
        raise ValueError('softmax needs nonempty rows without NaN or positive infinity')
    if not np.isfinite(z.max(axis=-1)).all():
        raise ValueError('every softmax row needs a finite allowed score')
    z = z - z.max(axis=-1, keepdims=True)
    e = np.exp(z)
    return e / e.sum(axis=-1, keepdims=True)

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

if __name__ == "__main__":
    X=np.array([[8.,2.],[1.,9.]])
    y=np.array([1,0])
    model=MultinomialNB().fit(X,y)
    print(model.classes,model.predict_proba(np.array([[1.,1.]])))
```

The recorded output in the supplied CPU environment was:

```text
[0 1] [[0.42553191 0.57446809]]
```
