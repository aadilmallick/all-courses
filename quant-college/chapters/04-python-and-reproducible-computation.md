# 4. Python and reproducible computation

## 4.1 A program is an explicit sequence of decisions

Research should be repeatable from stated inputs. If someone must remember which spreadsheet cells to edit or which notebook cells to run first, the procedure is only partly specified. A program records the operations. We begin with Python because its notation is approachable and its scientific ecosystem supports arrays, tables, statistics, and plotting. Learning the language is different from learning a trading platform. We will first build calculations that require no accounts, remote services, or market-data subscriptions.

The examples in this package's `examples` directory use Python's standard library and run without third-party installation. They are the reproducible computational baseline. NumPy, pandas, Matplotlib, SciPy, scikit-learn, and Jupyter are taught as the scientific-workflow path; examples using those libraries require their documented installation and are distinguished from the standard-library baseline. The verification report records which environments were actually executed.

Install a supported Python 3 interpreter from its official distribution or your institution's approved environment. On Windows, `py --version` often checks the installed launcher; `python --version` may work instead. In a terminal opened in the extracted course directory, run `py examples/core_labs.py`. On systems where the command is `python3`, substitute it consistently. A terminal is an interface for starting programs; it is not the Python language itself. Type Python source into a `.py` file or the interpreter, not directly into an unrelated command shell.

A project folder should separate source code, input data, generated outputs, and explanatory text. Never rely on an unexplained absolute path belonging to one machine. Use paths relative to the script location for bundled fixtures. For a new scientific project, create an isolated environment with `py -m venv .venv`, then activate it using the instructions appropriate to your shell. If organizational policy prevents activation scripts, invoke the environment's Python executable directly. Environment isolation keeps one project's library choices from unexpectedly changing another's.

## 4.2 Values, names, expressions, and types

The expression `200 * (1 + 0.05)` evaluates to 210.0. Assigning `initial_wealth = 200.0` binds a name to a value. A later expression can reuse it. The equals sign performs assignment in Python; `==` checks equality. Names should reveal meaning and units. `annual_rate_decimal` is more informative than `r` in a long data pipeline, even though concise mathematical symbols remain useful in derivations.

Python has integers, floating-point numbers, Boolean values, strings, and collections. Integers represent whole numbers; floats approximate real-valued calculations. `True` and `False` represent logical outcomes. A string is text enclosed in quotes. The string `"0.05"` is different from the number `0.05`; parsing converts valid numeric text into a number. Invalid text should raise a clear error rather than quietly becoming zero.

```python
initial_wealth = 200.0
return_decimal = 0.05
final_wealth = initial_wealth * (1.0 + return_decimal)
print(final_wealth)  # 210.0
```

Each assignment evaluates its right side before binding the left-side name. The printed number follows the compounding definition from Chapter 1. Multiplication uses `*`, exponentiation uses `**`, and division uses `/`. The caret `^` is a bitwise operator, not exponentiation. In a beginner's valuation program, that single-symbol mistake can produce a confusing error or an irrelevant result.

Floating-point arithmetic needs tolerant checks. `0.1 + 0.2 == 0.3` can be false because these decimals lack exact binary representations. Use `math.isclose` with tolerances meaningful for the calculation. For money accounting that requires exact decimal rounding, the `decimal` module is available, but it does not turn an uncertain economic estimate into an exact one. Separate numerical representation from model uncertainty.

## 4.3 Collections and iteration

A list stores an ordered sequence: `prices = [100.0, 103.0, 101.0]`. Index zero refers to the first entry, so `prices[0]` is 100.0. A slice `prices[1:]` includes the second entry onward. Negative indices count backward from the end. Indexing is exact bookkeeping: if prices and dates become misaligned, the program may calculate valid arithmetic for the wrong observations.

A `for` loop repeats operations over a collection. The following complete example computes two consecutive returns:

```python
prices = [100.0, 103.0, 101.0]
returns = []
for previous, current in zip(prices[:-1], prices[1:]):
    if previous <= 0.0:
        raise ValueError("Return denominator must be positive")
    returns.append(current / previous - 1.0)
print([round(value, 6) for value in returns])
# [0.03, -0.019417]
```

`zip` pairs corresponding entries from two sequences. The first slice contains 100 and 103; the second contains 103 and 101. Each pair produces one return. Indentation groups the statements belonging to the loop or condition. The error prevents a calculation outside our chosen price-domain assumptions. The final list comprehension creates a presentation-only rounded list; the stored values retain precision.

A dictionary maps keys to values, such as `{"symbol": "SYNTH_A", "currency": "USD"}`. It is useful for metadata and configuration. A tuple is an immutable ordered collection, useful for a fixed pair like `(date, value)`. A set stores unique elements and supports membership checks, useful for detecting repeated identifiers. Choose a collection based on what relationship it represents rather than memorizing syntax in isolation.

## 4.4 Functions make assumptions reusable

A function packages a calculation with named inputs and a returned result. `return` sends a value to the caller; `print` displays text and is not a substitute for returning a result. Pure functions, whose outputs depend only on their inputs and which do not modify external state, are easier to reason about and test.

```python
import math

def simple_returns(prices):
    if len(prices) < 2:
        raise ValueError("At least two prices are required")
    if any(not math.isfinite(p) or p <= 0 for p in prices):
        raise ValueError("Prices must be finite and positive")
    return [b / a - 1.0 for a, b in zip(prices[:-1], prices[1:])]

print(simple_returns([50.0, 55.0, 52.25]))
# Approximately [0.10, -0.05]
```

The import provides established numerical functions. `len` counts entries. `any` checks whether at least one condition is true. `math.isfinite` rejects infinities and missing numeric values represented as NaN. The function's validation matches the mathematical domain. If negative settlement prices are relevant to a different contract, design a different return definition rather than deleting validation without reconsidering the model.

An exception signals that the program cannot fulfill its stated contract. Catch an exception when you can add useful context or recover meaningfully. A broad `except: pass` can hide data corruption. At the boundary of a data pipeline, report the file, row, and rule that failed. Inside a mathematical routine, state the invalid input condition. Clear failures are preferable to plausible-looking incorrect outputs.

## 4.5 Modules, paths, and reproducibility

A module is a Python source file that can define reusable functions. The convention `if __name__ == "__main__":` separates behavior when the file is run as a program from behavior when another file imports it. This keeps an import from unexpectedly executing a full experiment. Small modules with clear responsibilities are easier to audit than one notebook containing years of accumulated state.

Use `pathlib.Path` to construct portable paths. `Path(__file__).resolve().parent` identifies the directory containing a script. A bundled fixture can then be located relative to that directory. When reading CSV files with Python's `csv` module, specify encoding and use `newline=""` as recommended by the module's documentation. Parse dates explicitly rather than trusting ambiguous strings such as `03/04/2025`.

Reproducibility requires more than a random seed. Record input-file hashes, retrieval dates, time zones, package versions, code version, configuration, and the separation between model selection and final evaluation. A seed controls a particular pseudorandom generator's sequence under a particular implementation; it does not guarantee that every parallel computation or future library version reproduces identical bits.

Keep raw input immutable. Write cleaned data to a separate location with a description of transformations. If an analysis excludes missing values, preserve which rows were excluded and why. A repeated run should either reuse a documented snapshot or clearly declare that it retrieved updated data. An output difference can then be traced to data, code, configuration, or random variation.

## 4.6 NumPy: arrays and shapes

NumPy represents homogeneous multidimensional arrays and supplies efficient numerical operations. In a scientific environment with NumPy installed:

```python
import numpy as np

returns = np.array([[0.01, 0.02], [-0.02, 0.00], [0.03, -0.01]])
weights = np.array([0.6, 0.4])
portfolio_returns = returns @ weights
print(portfolio_returns)
# [ 0.014 -0.012  0.014]
```

Rows are dates and columns are assets, so the array has shape `(3, 2)`. The weight vector has length two. Matrix multiplication using `@` produces one portfolio return per row. Elementwise multiplication using `*` has a different meaning. State the data layout before performing an operation; a transposed array can otherwise produce a result with a convincing but wrong interpretation.

An axis identifies the dimension being reduced. `returns.mean(axis=0)` calculates each asset's mean across rows; `axis=1` calculates a mean across assets for each date. The default may flatten all entries, answering neither question. Broadcasting lets compatible dimensions expand in elementwise operations, such as subtracting one mean per column. Broadcasting is useful but can silently accommodate an unintended shape, so inspect shapes at important boundaries.

`np.linalg.lstsq(X, y, rcond=None)` solves least-squares problems without requiring an explicit inverse. Its returned values include the coefficient solution and rank-related information. For a covariance matrix, `np.linalg.eigh` exploits symmetry. Check the relevant installed documentation rather than transferring assumptions from a general eigenvalue routine. Numerical code improves when the software call reflects known mathematical structure.

## 4.7 pandas: labels, missingness, and time alignment

pandas adds labeled one- and two-dimensional structures, Series and DataFrame. Labels help align dates and asset names, but automatic alignment is still a decision that needs inspection. Two Series with different date indices can introduce missing values during arithmetic. That is often preferable to silently pairing the wrong dates, yet it can also conceal an unexpected mismatch unless you check it.

```python
import pandas as pd

prices = pd.Series(
    [100.0, 102.0, 101.0],
    index=pd.to_datetime(["2025-01-02", "2025-01-03", "2025-01-06"]),
    name="synthetic_price",
)
returns = prices.pct_change(fill_method=None)
print(returns.dropna())
```

The first return is missing because no prior price is included. `fill_method=None` makes the missing-data convention explicit. The gap from Friday to Monday is one observed trading interval, not one calendar day. If annualizing, identify whether the observations are daily trading returns, weekly returns, or irregular event intervals. The mere presence of dates does not establish a uniform sampling interval.

Do not forward-fill returns to manufacture observations. Forward-filling a stale price can imply a zero return when the true price is unknown. Whether carrying forward a state variable is justified depends on what it represents and when updates become available. Distinguish “no trade,” “market closed,” “missing record,” and “observed unchanged price.” They are different data-generating situations.

An as-of merge can join each decision timestamp to the most recent information available before it. Direction and exact-match conventions matter. A company's fiscal quarter end is not the date its statements became public. A point-in-time join uses publication timestamps, and sometimes amendment history, so the model sees only information that existed at the decision. This is a statistical validity requirement expressed as a data-engineering operation.

## 4.8 Plotting, numerical libraries, and notebooks

Matplotlib creates plots from arrays and tables. A useful figure names variables, units, sample period, and transformation. Plot cumulative wealth on a scale appropriate to the question; a log vertical axis emphasizes proportional growth, while a linear axis emphasizes dollar changes. Show a benchmark and relevant uncertainty where meaningful. A decorative curve without definitions is not evidence.

SciPy supplies optimization, distributions, integration, and other scientific algorithms. Match the function to the problem and inspect convergence diagnostics. An optimizer returning a vector does not prove it reached a valid optimum. Check feasibility, objective values, gradients or residuals, and sensitivity to initialization when appropriate. Consult [SciPy's tutorials](https://docs.scipy.org/doc/scipy/tutorial/) for the installed version's interface.

scikit-learn provides estimators with consistent `fit` and `predict` methods. Fit learns from training data; predict applies the fitted transformation or model. Pipelines combine preprocessing and estimation so that training-only fitting can be enforced during validation. Financial time ordering still requires an appropriate split. A standard random split can be invalid even when every API call is correct.

Jupyter notebooks combine executable cells, prose, equations, and figures. Their flexibility introduces hidden state: a variable defined in a cell run yesterday may survive after the visible notebook order changes. Before sharing, restart the kernel and run all cells in order. Move reusable core calculations into modules, and use notebooks to explain and inspect them. The final report should be reconstructible from a clean start.

## 4.9 A complete research calculation

Let synthetic prices be 100, 105, 102, 108, and 106. First compute returns 0.05, approximately −0.028571, 0.058824, and −0.018519. Starting from wealth one, repeatedly multiply by gross returns. Wealth becomes 1, 1.05, 1.02, 1.08, and 1.06. This reproduces the normalized price path because there are no dividends or costs in the fixture.

The running peak is 1, 1.05, 1.05, 1.08, and 1.08. Drawdown is current wealth divided by running peak minus one. The worst observed drawdown is approximately −2.8571% at wealth 1.02. The final 1.06 has a smaller drawdown of approximately −1.8519%. Define whether a report presents maximum drawdown as a negative return or a positive loss magnitude; both conventions appear, and mixing them creates sign mistakes.

The standard-library example implements mean, sample variance, covariance, wealth, and drawdown using explicit loops or comprehensions. It then verifies relationships against known small cases. This is a teaching implementation, not a recommendation to replace well-tested scientific libraries for large production datasets. Understanding the calculation makes it possible to use a library critically rather than as a black box.

The next extension is metadata: record whether these are price returns or total returns, the observation interval, currency, and any omitted costs. No annualized Sharpe ratio should be inferred from four unspecified intervals. Annualization is a model assumption, not a formatting switch. Chapter 8 derives when square-root scaling is justified and what changes under serial dependence.

## 4.10 Testing and debugging as research methods

A test should examine a meaningful relationship. Constant positive prices produce zero returns. A single 10% increase produces 0.1. Multiplying all prices by a positive constant leaves simple returns unchanged. A portfolio with all weight in one asset reproduces that asset's return. An option price should respect appropriate bounds under its stated model. Such invariants can expose errors across many inputs.

Tests that merely repeat the implementation's formula can repeat its mistake. Compare with independently derived examples, known limiting cases, or a second method. For a Monte Carlo price, compare a simulated estimate with a closed-form result and a sampling-error interval. For an optimizer, compare against a small problem solved analytically. For a regression, inspect residual orthogonality and a hand-computed fixture.

Debug from the earliest incorrect intermediate state. Print or inspect shapes, date ranges, missing-value counts, and a few known rows before reviewing the final metric. If a cumulative-return plot is implausible, inspect individual returns before changing the plotting code. If a result changes after rerunning a notebook, check hidden state before inventing a market explanation.

Use assertions for internal invariants, and explicit exceptions for invalid external inputs. Assertions may be disabled in some execution modes; they should not be the sole validation of user-supplied data. Log enough context to reproduce a failure without writing credentials or private datasets into public reports. Version control records meaningful source changes; small commits make it easier to identify which change altered an outcome.

### A CSV import with a visible contract

The following complete standard-library example reads an explicitly defined two-column file. It does not guess whether a field contains percentages or dollars. Save a CSV with header `date,price` and rows such as `2025-01-02,100` before using the function. The function is reusable; the call supplies the path to your own fixture.

```python
import csv
import math
from datetime import date
from pathlib import Path

def read_prices(path):
    observations = []
    seen = set()
    with Path(path).open(encoding="utf-8-sig", newline="") as stream:
        reader = csv.DictReader(stream)
        if reader.fieldnames != ["date", "price"]:
            raise ValueError("Expected exactly: date,price")
        for row_number, row in enumerate(reader, start=2):
            try:
                day = date.fromisoformat(row["date"])
                price = float(row["price"])
            except (ValueError, TypeError) as error:
                raise ValueError(f"Invalid data at row {row_number}") from error
            if day in seen:
                raise ValueError(f"Duplicate date at row {row_number}")
            if not math.isfinite(price) or price <= 0:
                raise ValueError(f"Invalid price at row {row_number}")
            if observations and day <= observations[-1][0]:
                raise ValueError("Dates must be strictly increasing")
            seen.add(day)
            observations.append((day, price))
    if len(observations) < 2:
        raise ValueError("Need at least two observations")
    return observations
```

`DictReader` uses the header to label fields. `enumerate` supplies a human-readable row number beginning after the header. `fromisoformat` accepts an unambiguous year-month-day format. The set catches duplicate dates; the final comparison catches unsorted dates. We reject rather than silently sort because unexpected ordering can indicate a bad upstream export. A different pipeline may intentionally sort, but that transformation should be recorded.

### Mutability can alter an experiment unexpectedly

Lists are mutable. Assigning `second = first` does not copy a list; both names refer to the same object. If `second.append(5)` is executed, inspecting `first` reveals the added element too. Use `first.copy()` for a shallow copy when independent outer lists are intended. Nested mutable objects require additional care because a shallow copy still shares the nested elements.

This matters when testing variants. If one model modifies a shared feature table in place, the next model may receive altered inputs even though the notebook appears to reuse the original variable. Prefer functions that return new transformed data or document in-place changes clearly. Keep raw fixtures separate, and test that a calculation does not mutate its inputs unless mutation is part of its contract.

### Record a compact experiment manifest

A useful manifest can be a JSON file containing a dataset hash, seed, feature cutoff, split dates, parameter values, and output names. JSON stores structured values without depending on the state of a notebook. Hash a file using `hashlib.sha256(path.read_bytes()).hexdigest()` for small fixtures; for large files, read in chunks. A hash identifies content, not its correctness or licensing.

When a result changes, compare manifests before changing the statistical explanation. Was the input revised? Did a package version change? Did the training cutoff move? Did a random seed or cost assumption change? This workflow converts “the result looks different” into a sequence of answerable questions. It also prepares a collaborator to reproduce the study without access to your memory.

### A clean execution is a reproducibility test

Run the bundled example from a new terminal and compare its JSON output with the recorded reference. Then run the tests with `python -m unittest discover -s tests -v` from the course folder. A test pass establishes the listed cases; it does not certify every future dataset. Keep the command and runtime version in your own project report.

If the program cannot find Python, resolve the installation or command name before changing source code. If it cannot find a file, inspect the working directory and path construction. If imports fail, inspect the selected interpreter and environment. These are different failure classes, and changing statistical formulas cannot repair them. Treat setup instructions as executable documentation that another learner should be able to follow.

A file hash changes when file bytes change, including line endings or formatting. Two economically equivalent CSV exports can therefore have different hashes. Preserve the original file and document parsing choices; use the hash to identify the exact input, not to decide whether two datasets mean the same thing.

## 4.11 Performance, ethics of evidence, and further practice

Optimize after measuring. A vectorized array operation can be much faster than a Python loop on large numeric data, but speed is irrelevant if dates are misaligned. Algorithms matter too: recomputing a full historical covariance matrix for every date can be far more expensive than updating sufficient statistics. First make the procedure correct and inspectable, then profile the slow stages.

Separate a result from its interpretation. “The code ran” establishes execution; “the calculation matches a known example” establishes a narrow correctness check; “the strategy predicts unseen returns” requires independent evidence. A synthetic demonstration can teach a method without supporting any claim about a live market. Label it accordingly in notebook titles, chart captions, and project reports.

Suggested applications: add dividend cash flows to the return function; reject unsorted or repeated timestamps; write a CSV reader that reports malformed rows; compare a hand-coded covariance with NumPy on the same data; build a notebook that restarts and runs cleanly; record a file hash before analysis. Hints and project guidance appear in the final chapter, while the bundled examples provide reference implementations for core calculations.

Primary references are the [Python 3.12 tutorial](https://docs.python.org/3.12/tutorial/), [NumPy beginner guide](https://numpy.org/doc/stable/user/absolute_beginners.html), [pandas introductory tutorials](https://pandas.pydata.org/docs/getting_started/intro_tutorials/), [Matplotlib tutorials](https://matplotlib.org/stable/tutorials/index.html), [Jupyter installation guide](https://jupyter.org/install), and [scikit-learn cross-validation documentation](https://scikit-learn.org/stable/modules/cross_validation.html). The official Python tutorial assumes some programming familiarity; this chapter supplies the earlier bridge. Historical course assignments may use R or MATLAB; learn their mathematical objective first and use the included Python examples to practice the corresponding ideas.

You now have a way to express a model, execute it, inspect intermediate values, and preserve the evidence. The next chapter introduces uncertainty. Its probability calculations will use the same habits: explicit inputs, defined domains, units, and checks against simple cases.
