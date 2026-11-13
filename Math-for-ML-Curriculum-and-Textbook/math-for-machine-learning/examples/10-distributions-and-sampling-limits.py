# Source: chapters/10-distributions-and-sampling-limits.md
import numpy as np

rng = np.random.default_rng(7)
probability = 0.2
sample_size = 100
repetitions = 10000
means = rng.binomial(sample_size, probability, size=repetitions) / sample_size
print(means.mean())
print(means.std())
print((probability * (1 - probability) / sample_size) ** 0.5)
