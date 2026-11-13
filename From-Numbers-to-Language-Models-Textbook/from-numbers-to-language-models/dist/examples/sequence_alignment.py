"""Complete response-likelihood SFT -> DPO experiment on the tiny transformer.

Synthetic token patterns isolate the optimization. These are real transformer
updates, not a simulation of changes to model probabilities. No general text
understanding or human alignment result is claimed.
"""
import numpy as np
from core import TinyGPT, tensor_log_softmax


def sequence_log_probability(model, tokens):
    tokens = np.asarray(tokens, dtype=int)
    # First token is the given prompt; every later token is a response target.
    inputs, targets = tokens[:-1][None, :], tokens[1:]
    log_probability = tensor_log_softmax(model(inputs))
    return log_probability[0, np.arange(len(targets)), targets].sum()


def softplus(value):
    shift = max(float(value.data), 0.)
    return ((value-shift).exp()+np.exp(-shift)).log()+shift


def experiment():
    model = TinyGPT(4, width=8, heads=2, context=4, seed=71)
    inputs = np.array([[0, 1, 2, 3], [1, 2, 3, 0]])
    targets = (inputs+1) % 4
    initial = float(model.loss(inputs, targets).data)
    for _ in range(80):
        loss = model.loss(inputs, targets)
        loss.backward()
        model.step(.15)
    final_sft = float(model.loss(inputs, targets).data)
    assert final_sft < initial

    # Explicit frozen reference snapshot: same architecture and copied arrays.
    reference = TinyGPT(4, width=8, heads=2, context=4, seed=72)
    for destination, source in zip(reference.parameters(), model.parameters()):
        destination.data[:] = source.data
    chosen = [0, 1, 2, 3, 0]
    rejected = [0, 3, 2, 1, 0]
    reference_gap = float((sequence_log_probability(reference, chosen)-sequence_log_probability(reference, rejected)).data)
    beta, losses = .5, []
    for _ in range(60):
        policy_gap = sequence_log_probability(model, chosen)-sequence_log_probability(model, rejected)
        loss = softplus(-beta*(policy_gap-reference_gap))
        losses.append(float(loss.data))
        loss.backward()
        model.step(.03)
    final_gap = float((sequence_log_probability(model, chosen)-sequence_log_probability(model, rejected)).data)
    assert losses[-1] < losses[0]
    assert final_gap > reference_gap
    # Reference must remain unchanged throughout the policy optimization.
    check_gap = float((sequence_log_probability(reference, chosen)-sequence_log_probability(reference, rejected)).data)
    assert np.allclose(reference_gap, check_gap)
    return {'sft_initial': initial, 'sft_final': final_sft,
            'dpo_initial': losses[0], 'dpo_final': losses[-1],
            'reference_gap': reference_gap, 'adapted_gap': final_gap}


if __name__ == '__main__':
    print(experiment())
