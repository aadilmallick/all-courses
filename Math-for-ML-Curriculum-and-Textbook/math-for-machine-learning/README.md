# From Equations to Learning

A complete mathematics-for-ML curriculum and original textbook: **48 guided sessions, 12 substantial chapters, 13 interactive experiments, and 15 executable Python examples/projects**.

Start with [CURRICULUM.md](CURRICULUM.md) for the reading order or [book.md](book.md) for the continuous volume. Chapter files in [chapters](chapters/) are the canonical editable source. Each chapter has at least 2,500 words of narrative prose excluding code and mathematical expressions; exact measurements and verification limits appear in [verification.md](verification.md).

## What you will learn

Functions and proofs; vectors and matrix structure; eigenvalues, SVD, and PCA; limits, derivatives, integration, Jacobians, and Hessians; constrained and stochastic optimization; probability and distribution families; estimation and uncertainty; regression, logistic/softmax models, information theory, neural backpropagation, and generalization.

Only arithmetic and elementary algebra are assumed. The mathematical path rebuilds its other prerequisites. Python is optional for reading, and the browser laboratory does not need Python. See [CONVENTIONS.md](CONVENTIONS.md), [PROJECTS.md](PROJECTS.md), and [references.md](references.md).

## Open the interactive laboratory

Install a supported Node.js runtime. Tested here: Node.js 24.22.1. From this folder run:

```bash
node companion/server.mjs
```

Open <http://127.0.0.1:8765/companion/>. Leave the terminal running and stop it with Ctrl+C when finished. There are no npm dependencies, installation step, external assets, or build step. The included HTML/CSS/modules are the runnable static output. If port 8765 is occupied, set `MATH_LAB_PORT` to another available port before launching.

The experiment selector covers all 12 chapters. Each experiment includes labeled controls, actual computed results, reset, a chapter link, and a calculation-source link. Zero projection directions and impossible conditioning events produce explanations. The browser's file scheme may block module imports; use the local server instead of double-clicking the HTML file.

## Run the Python examples

Tested with Python 3.12.14, NumPy 2.3.5, and SciPy 1.17.0. Installation requires access to the package index. Other versions/platforms were not independently tested.

On Windows PowerShell, from this folder:

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe examples\03-matrices-and-least-squares.py
.\.venv\Scripts\python.exe examples\neural_network.py
.\.venv\Scripts\python.exe examples\end_to_end.py
```

On macOS/Linux:

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python examples/03-matrices-and-least-squares.py
.venv/bin/python examples/neural_network.py
.venv/bin/python examples/end_to_end.py
```

You can execute any numbered example independently. The first two and several conceptual demonstrations use only the standard library. [examples/README.md](examples/README.md) maps every file and explains expected relationships. Random experiments use fixed seeds where useful; exact low-order digits can vary across platforms.

## Verify and rebuild

Using the Python environment above, run:

```bash
python scripts/extract_examples.py
python scripts/verify_math.py
node companion/check.mjs
python scripts/build_book.py
python scripts/validate_textbook.py .
```

`extract_examples.py` regenerates numbered programs from the chapter listings. Edit the chapter listing first; the three named advanced examples are separate canonical implementations. `build_book.py` assembles the continuous book and adds its references/project appendices. The structural validator does not prove mathematical truth or run a browser. The additional verification report distinguishes those checks.

For an optional full equation syntax/typesetting check, install a working TeX distribution and run `python scripts/verify_equations.py`. The recorded follow-up pass compiled all 1,526 chapter expressions; source hashes bind that evidence to this edition. Actual browser visuals remain unverified in this runtime.

Figure regeneration is optional and needs Matplotlib from `requirements-figures.txt`; reading and executing the primary examples do not. Browser QA and LaTeX QA depend on authoring tools not required by the learner.

## Move to GitHub

Extract the ZIP, copy this folder's contents into your repository, and commit the Markdown, source, figures, and dependency records. No repository or publication is created automatically. Keep relative paths intact so navigation and image references work. GitHub can render the dollar-delimited mathematics; a plain-text Markdown reader may show its source instead. Native Library previews may have different rendering support.

This package includes original instructional material and small synthetic datasets only. It does not include full copies of external reference pages or paid source texts. See [NOTICES.md](NOTICES.md) before choosing a license for your own repository.
