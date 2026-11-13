# 01. The scientific learning process and Python laboratory

[Course index](../README.md) · [Next](02-algebra-notation-proofs.md)

## What it means to learn a rule

Suppose a workshop records hours of use, temperature, and whether a machine failed the next day. A program with a fixed threshold is a rule written by a person. A learned model is a family of rules whose adjustable values are selected using examples. Learning still requires human choices: what outcome matters, which observations are allowed, and how success will be measured.

We will use three recurring settings: tabular prediction, document classification, and sequence prediction. Each gives a different view of the same structure. An input $x$ belongs to a set $\mathcal X$, an outcome $y$ belongs to $\mathcal Y$, and a predictor $f_\theta$ uses parameters $\theta$. Training selects those parameters. Prediction evaluates the selected rule on a new input.

A data table is not automatically a valid experiment. If the target is tomorrow's failure, a column filled in after tomorrow's inspection is unavailable at prediction time. An algorithm can exploit that column perfectly and still solve the wrong problem. Begin every project by writing the prediction time, unit of observation, allowed features, and target definition.

## Python before numerical abstractions

A variable names an object. A list stores ordered items. A function takes inputs and returns a result. Here is a complete program using no ML library:

```python
hours = [1.0, 2.0, 3.0]
observed = [3.0, 5.0, 7.0]
def predict(value, slope, intercept):
    return slope * value + intercept
predicted = [predict(value, 2.0, 1.0) for value in hours]
error = sum((a-b)**2 for a,b in zip(predicted, observed)) / len(hours)
print(predicted, error)
```

The output is `[3.0, 5.0, 7.0] 0.0`. The expression after `return` is evaluated for each input. `zip` pairs corresponding predictions and observations. `**2` squares each error; the average is mean squared error. A zero error on these three examples establishes exact fit on those examples, not a guarantee about future machines.

NumPy places the values in arrays and performs numerical operations over whole arrays. `values.shape` tells you how many entries exist along each axis. If the input matrix has shape $(n,d)$, there are $n$ examples and $d$ features. A parameter vector of shape $(d,)$ produces predictions with `matrix @ weights`, shape $(n,)$. `@` is a sum of products, while `*` is elementwise multiplication.

## A small scientific loop

Choose a baseline before a complex model. A regression baseline predicts the training mean. A classification baseline predicts a majority class or the empirical class probabilities. Train on one subset, choose settings on another, and reserve final evaluation for observations that did not influence either decision. Record the split and seed.

A useful experiment changes one meaningful choice at a time. If scaling, architecture, loss, and split all change together, an improvement cannot be attributed to any one change. A good result includes its comparator, metric, data protocol, variability, and failure cases. The phrase “95% accuracy” alone cannot tell us whether a model is useful.

## Run the laboratory

Use Python 3.10 or later. The tested runtime is documented in VALIDATION.md. Create an isolated environment, then install the requirements using your normal package source. The CPU NumPy track requires only NumPy for its core models. Scikit-learn provides a library comparison, and PyTorch is a separately installed neural track. No account or API key is required by the local examples.

```bash
python -m venv .venv
# Activate .venv using your shell's activation command.
python -m pip install -r requirements.txt
python code/classical/demo.py
python code/neural/19_implement_gpt.py
```

Read an equation beside its array implementation. Give every symbol a meaning and every array a shape. Then check one tiny example by hand. Only after both match should you run a larger fit. This sequence will recur throughout the course because it connects mathematical understanding to implementation.

Optional application: build a three-row prediction report, replace one target with a deliberately wrong value, and describe what changed in the average squared error. This is an application activity, not a gate on proceeding.

## Detailed Python and tensor workshop

The [foundations workshop](../workshops/01-foundations-and-tensors.md) develops Python syntax, numerical arrays, indexing, views, shapes, and error messages at a slower implementation pace. Its framework sections can be revisited when you begin PyTorch in lesson 33.
