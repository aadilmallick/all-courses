"""Train a tiny categorical policy with DPO and a bandit policy with PPO.

These are complete small optimization experiments, not language-model quality
benchmarks. A categorical response policy isolates the same log-probability
loss used for whole responses without a sequence model's additional costs.
"""
import numpy as np
from core import Tensor, tensor_log_softmax, softmax


def dpo_train(steps=100, learning_rate=.3):
    logits = Tensor(np.zeros((1, 3)))
    reference_logp = np.log(np.array([.5, .3, .2]))
    beta = .5
    # Response 1 is preferred over response 0; response 2 is unconstrained.
    losses = []
    for _ in range(steps):
        logp = tensor_log_softmax(logits)
        margin = beta*(logp[0, 1]-logp[0, 0]-reference_logp[1]+reference_logp[0])
        # Stable softplus(-margin), with a constant numeric shift.
        value = -margin
        shift = max(float(value.data), 0.)
        loss = ((value-shift).exp()+np.exp(-shift)).log()+shift
        losses.append(float(loss.data))
        loss.backward()
        logits.data -= learning_rate*logits.grad
        logits.grad.fill(0)
    assert losses[-1] < losses[0]
    return softmax(logits.data)[0], losses


def ppo_bandit(updates=40, batch_size=256, seed=1):
    rng = np.random.default_rng(seed)
    logits = np.zeros(2)
    reward_probability = np.array([.2, .8])
    history = []
    for _ in range(updates):
        old_probability = softmax(logits)
        actions = rng.choice(2, size=batch_size, p=old_probability)
        rewards = (rng.random(batch_size) < reward_probability[actions]).astype(float)
        advantage = rewards-rewards.mean()
        for _ in range(4):
            probability = softmax(logits)
            ratio = probability[actions]/old_probability[actions]
            # Derivative of min(r*A, clip(r)*A) away from boundaries.
            active = np.where(advantage >= 0, ratio < 1.2, ratio > .8)
            coefficient = active*ratio*advantage
            score = np.eye(2)[actions]-probability
            gradient = np.mean(coefficient[:, None]*score, axis=0)
            logits += .2*gradient
        history.append(float(softmax(logits) @ reward_probability))
    assert history[-1] > history[0]
    return softmax(logits), history


if __name__ == '__main__':
    policy, losses = dpo_train()
    print('DPO categorical policy:', policy, 'loss:', losses[0], '->', losses[-1])
    policy, rewards = ppo_bandit()
    print('PPO bandit policy:', policy, 'expected reward:', rewards[0], '->', rewards[-1])
