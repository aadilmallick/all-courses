import numpy as np
rng = np.random.default_rng(52)
action = np.array([-.5, .2, .8])
noise = rng.normal(size=3)
alpha_bar = .4
corrupted = np.sqrt(alpha_bar)*action+np.sqrt(1-alpha_bar)*noise
recovered = (corrupted-np.sqrt(1-alpha_bar)*noise)/np.sqrt(alpha_bar)
assert np.allclose(recovered, action)
source, destination = rng.normal(size=3), action
state = source.copy()
velocity = destination-source
for _ in range(10):
    state += .1*velocity
assert np.allclose(state, destination)
print('oracle reconstruction', recovered, 'oracle flow endpoint', state)
