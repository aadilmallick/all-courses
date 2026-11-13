import numpy as np
def group_advantage(rewards):
    rewards = np.asarray(rewards, dtype=float)
    return (rewards-rewards.mean())/(rewards.std(ddof=0)+1e-8)
mixed = group_advantage([0, 0, 1, 1])
constant = group_advantage([0, 0, 0, 0])
assert np.allclose(mixed.mean(), 0)
assert np.allclose(constant, 0)
ratio = np.array([.9, 1.1, 1.3, .8])
surrogate = np.minimum(ratio*mixed, np.clip(ratio, .8, 1.2)*mixed)
print('mixed advantages', mixed, 'constant', constant, 'surrogate', surrogate.mean())
