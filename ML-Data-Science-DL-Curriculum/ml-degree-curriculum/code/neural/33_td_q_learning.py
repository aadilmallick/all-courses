import numpy as np
rng = np.random.default_rng(33)
q = np.zeros((3, 2))
for episode in range(1500):
    state = 0
    for _ in range(20):
        action = int(rng.integers(2)) if rng.random() < .2 else int(q[state].argmax())
        next_state = min(2, state+1) if action == 1 else max(0, state-1)
        terminal = next_state == 2
        reward = float(terminal)
        target = reward if terminal else reward+.9*q[next_state].max()
        q[state, action] += .1*(target-q[state, action])
        state = next_state
        if terminal:
            break
assert q[0].argmax() == 1
print('Q values', q)
