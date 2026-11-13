"""Chapter 12: a complete two-hidden-unit binary network and gradient check."""
import numpy as np

X_INPUT = np.array([1., 2.])
TARGET = 1.

def unpack(parameters):
    return parameters[:4].reshape(2, 2), parameters[4:6], parameters[6:8], parameters[8]

def forward_backward(parameters):
    W, b, v, c = unpack(parameters)
    preactivation = W @ X_INPUT + b
    hidden = np.tanh(preactivation)
    score = v @ hidden + c
    probability = np.exp(-np.logaddexp(0., -score))
    loss = max(score, 0.) - TARGET * score + np.log1p(np.exp(-abs(score)))
    delta_score = probability - TARGET
    delta_hidden = delta_score * v * (1 - hidden ** 2)
    gradient = np.concatenate([
        np.outer(delta_hidden, X_INPUT).ravel(),
        delta_hidden, delta_score * hidden, [delta_score]
    ])
    return loss, gradient, (preactivation, hidden, score, probability)

def gradient_check(parameters):
    loss, gradient, _ = forward_backward(parameters)
    numerical = np.empty_like(parameters)
    for j in range(len(parameters)):
        offset = np.zeros_like(parameters)
        offset[j] = 1e-5
        numerical[j] = (forward_backward(parameters + offset)[0]
                        - forward_backward(parameters - offset)[0]) / 2e-5
    np.testing.assert_allclose(gradient, numerical, rtol=1e-6, atol=1e-8)
    return float(np.max(np.abs(gradient - numerical)))

if __name__ == '__main__':
    parameters = np.array([.1, -.2, 0., .3, 0., 0., .4, -.5, 0.])
    loss, gradient, trace = forward_backward(parameters)
    print('preactivation, hidden, score, probability:', trace)
    print('gradient:', gradient)
    print('maximum gradient-check discrepancy:', gradient_check(parameters))
    updated_loss = forward_backward(parameters - .05 * gradient)[0]
    assert updated_loss < loss
    print('loss before / after one step:', loss, updated_loss)
