# Source: chapters/01-mathematical-language.md
from math import exp, log

observations = [(1.0, 8.0), (2.0, 11.0), (4.0, 18.0)]

def mse(slope, intercept):
    squared_errors = []
    for distance, observed_time in observations:
        prediction = slope * distance + intercept
        squared_errors.append((prediction - observed_time) ** 2)
    return sum(squared_errors) / len(squared_errors)

def logsumexp(values):
    largest = max(values)
    return largest + log(sum(exp(value - largest) for value in values))

print(round(mse(3.0, 5.0), 6))
print(round(mse(4.0, 5.0), 6))
print(round(logsumexp([1000.0, 999.0]), 6))
