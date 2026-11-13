"""Chapter 12 capstone. Synthetic data; preprocessing and selection use training/validation only."""
import numpy as np

rng = np.random.default_rng(23)
raw = rng.normal(size=(600, 2))
time = 5 + 3 * raw[:, 0] + 2 * raw[:, 1] + rng.normal(0, .5, 600)
true_score = -.3 + 1.8 * raw[:, 0] - 1.2 * raw[:, 1]
label = rng.binomial(1, np.exp(-np.logaddexp(0., -true_score)))
order = rng.permutation(len(raw))
train, valid, test = order[:360], order[360:480], order[480:]
center = raw[train].mean(axis=0)
scale = raw[train].std(axis=0)
assert np.all(scale > 0)
X = np.column_stack([np.ones(len(raw)), (raw - center) / scale])

# Leave the intercept unpenalized. Augmentation avoids forming normal equations.
def ridge_fit(strength):
    penalty = np.diag([0., 1., 1.])
    design = np.vstack([X[train], np.sqrt(strength) * penalty])
    target = np.concatenate([time[train], np.zeros(3)])
    return np.linalg.lstsq(design, target, rcond=None)[0]

candidates = [.01, .1, 1., 10.]
ridge = min(((np.mean((X[valid] @ ridge_fit(s) - time[valid]) ** 2), s)
             for s in candidates))
beta = ridge_fit(ridge[1])
print('ridge selected strength / test MSE:', ridge[1],
      np.mean((X[test] @ beta - time[test]) ** 2))

# Average logistic loss plus strength/2 times squared nonintercept coefficients.
def fit_logistic(strength):
    coefficients = np.zeros(3)
    lipschitz = np.linalg.norm(X[train], 2) ** 2 / (4 * len(train)) + strength
    step = 1 / lipschitz
    for _ in range(1000):
        score = X[train] @ coefficients
        probability = np.exp(-np.logaddexp(0., -score))
        penalty_gradient = strength * coefficients
        penalty_gradient[0] = 0
        gradient = X[train].T @ (probability - label[train]) / len(train) + penalty_gradient
        coefficients -= step * gradient
        if np.linalg.norm(gradient) < 1e-8:
            break
    return coefficients

def binary_loss(indices, coefficients):
    score = X[indices] @ coefficients
    return np.mean(np.maximum(score, 0) - label[indices] * score
                   + np.log1p(np.exp(-np.abs(score))))

selection = min((binary_loss(valid, fit_logistic(s)), s) for s in [.001, .01, .1, 1.])
coefficients = fit_logistic(selection[1])
predicted_class = (X[test] @ coefficients >= 0).astype(int)
print('logistic selected strength / test log loss:', selection[1], binary_loss(test, coefficients))
print('logistic test accuracy:', np.mean(predicted_class == label[test]))
