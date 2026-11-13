"""Chapter 11: bootstrap standard error and a transparent ANOVA decomposition."""
import numpy as np
from scipy import stats

rng = np.random.default_rng(31)
observed = np.array([8., 10., 12., 14.])
replicated_means = rng.choice(observed, size=(10000, len(observed)), replace=True).mean(axis=1)
print('bootstrap SE:', replicated_means.std(ddof=1))
print('bootstrap percentile interval:', np.quantile(replicated_means, [.025, .975]))
groups = [np.array([1., 2., 3.]), np.array([3., 4., 5.]), np.array([4., 5., 6.])]
all_data = np.concatenate(groups)
grand_mean = all_data.mean()
between = sum(len(g) * (g.mean() - grand_mean) ** 2 for g in groups)
within = sum(np.sum((g - g.mean()) ** 2) for g in groups)
total = np.sum((all_data - grand_mean) ** 2)
np.testing.assert_allclose(total, between + within)
F = (between / (len(groups) - 1)) / (within / (len(all_data) - len(groups)))
reference = stats.f_oneway(*groups)
np.testing.assert_allclose(F, reference.statistic)
print('ANOVA F / p:', F, reference.pvalue)
