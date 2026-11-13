import numpy as np
rng = np.random.default_rng(34)
theta = 0.3
p = 1/(1+np.exp(-theta))
action = rng.random(100000) < p
mean_reward = np.where(action, .8, .2)
reward = (rng.random(len(action)) < mean_reward).astype(float)
score = action.astype(float)-p
estimate = np.mean(reward*score)
exact = .6*p*(1-p)
baseline = .2+.6*p
centered = (reward-baseline)*score
assert abs(estimate-exact) < .005
print('Monte Carlo', estimate, 'exact', exact, 'variances', np.var(reward*score), np.var(centered))
