# Source: chapters/09-probability-foundations.md
outcomes = [0, 1, 2]
probabilities = [0.25, 0.50, 0.25]
mean = sum(x * p for x, p in zip(outcomes, probabilities))
variance = sum((x - mean) ** 2 * p
               for x, p in zip(outcomes, probabilities))
prior_distant = 0.10
late_probability = 0.30 * prior_distant + 0.05 * (1 - prior_distant)
posterior_distant = 0.30 * prior_distant / late_probability
print(mean, variance)
print(late_probability, posterior_distant)
