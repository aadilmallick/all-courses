import numpy as np
def simulate(gain, dt=.1, steps=20):
    state, trajectory = 1., [1.]
    for _ in range(steps):
        action = -gain*state
        state += dt*action
        trajectory.append(state)
    return np.array(trajectory)
stable = simulate(5)
unstable = simulate(25)
assert abs(stable[-1]) < abs(stable[0])
assert abs(unstable[-1]) > abs(unstable[0])
print('stable final', stable[-1], 'unstable final', unstable[-1])
print('opposite demonstration mean', np.mean([-1., 1.]))
