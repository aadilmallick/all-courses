"""Optional independent numerical audit of all printed scalar laboratories.

Requires sympy==1.14.0 in addition to the normal runtime requirements.
The first derivative is symbolic; the comparison uses function evaluations.
This is not a formal proof or a check of every claim in the course.
"""
from pathlib import Path
import json
import numpy as np
import sympy as sp
root = Path(__file__).resolve().parents[1]
specifications = json.loads((root/'math-specifications.json').read_text())
x = sp.Symbol('x', real=True)
maximum = 0.
for item in specifications:
    expression = sp.sympify(item['expression'], locals={'x': x}, rational=True)
    function = sp.lambdify(x, expression, 'numpy')
    derivative = sp.lambdify(x, sp.diff(expression, x), 'numpy')
    point, step = item['point'], 1e-5
    numeric = float((function(point+step)-function(point-step))/(2*step))
    analytic = float(derivative(point))
    error = abs(numeric-analytic)
    maximum = max(maximum, error)
    assert np.isclose(numeric, analytic, atol=1e-6, rtol=1e-5), (item['lesson'], numeric, analytic)
print(f'PASS {len(specifications)} scalar derivative checks; maximum absolute error={maximum:.6g}')
