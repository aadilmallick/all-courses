import numpy as np
from core import finite_difference
beta = .4
policy_logp = np.array([-1.2, -1.8])
reference_logp = np.array([-1., -2.])
delta = policy_logp[0]-policy_logp[1]-reference_logp[0]+reference_logp[1]
def objective(value):
    return np.logaddexp(0, -beta*value[0])
analytic = -beta/(1+np.exp(beta*delta))
numeric = finite_difference(objective, np.array([delta]))[0]
assert np.allclose(analytic, numeric, atol=1e-7)
print('adjusted gap', delta, 'loss', objective(np.array([delta])), 'gradient', analytic)
