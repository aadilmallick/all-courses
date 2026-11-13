# Source: chapters/11-statistical-inference.md
import numpy as np
from scipy import stats

observed = np.array([8., 10., 12., 14.])
n = observed.size
mean = observed.mean()
standard_error = observed.std(ddof=1) / np.sqrt(n)
critical = stats.t.ppf(0.975, df=n - 1)
interval = mean + np.array([-1., 1.]) * critical * standard_error
posterior_mean = (1 + 7) / (1 + 1 + 10)
print(mean, standard_error)
print(interval)
print(posterior_mean)
