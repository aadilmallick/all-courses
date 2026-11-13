# From Numbers to Language Models

A guided textbook covering the mathematics and code of attention, transformers, LLM training, adaptation, reinforcement learning, preference optimization, retrieval, agents, multimodal models, recurrent depth, and physical-action foundations.

## Open the book

- [Continuous Markdown textbook](book.md)
- [Typeset offline HTML reader](book.html)
- [Chapter and source coverage](COVERAGE.md)
- [Verification and limitations](verification.md)

There are **18 substantial main chapters and four reference appendices**. All 54 original curriculum lessons are mapped into the new sequence. Complete numerical-engine and alignment-training source also appears at the end of the continuous volume.

## Run the browser experiments

With Node.js 22 or newer, from this folder:

```bash
node companion/server.mjs
```

Open `http://127.0.0.1:8765/`. Use the chapter list, visible controls, and reset buttons. The reader is at `http://127.0.0.1:8765/book.html`.

To serve the included built output instead:

```bash
node companion/server.mjs --dist
```

The gallery has 18 genuine small experiments. It uses local modules, actual calculations, no JavaScript packages, no API keys, and no external model calls. Synthetic data, simplified models, and oracle assumptions are labeled. The full trainable transformer is in the Python companion.

## Run the Python examples

Use a Python version compatible with NumPy 2.3.5; Python 3.12.14 was checked. The preface explains virtual-environment setup.

```bash
python -m pip install -r requirements.txt
python examples/20_train_gpt.py
python examples/sequence_alignment.py
python examples/run_all.py
python -m unittest discover -s tests -v
```

## Check and rebuild

```bash
node companion/check.mjs
node companion/test.mjs
node companion/test-interactions.mjs
python tools/check_package.py
python tools/verify_examples.py
python tools/check_worked_answers.py
python tools/check_cross_runtime.py
python tools/check_http.py
```

The interaction test uses a minimal DOM test double. It establishes parameter recalculation, reset, error recovery, and disposal behavior in that harness; it is not a browser-layout test.

To rebuild the continuous Markdown, MathML reader, and `dist/`, install Pandoc and run:

```bash
python tools/build_book.py
```

Pandoc 3.1.11.1 was used. The shipped reader already contains native MathML, so using the built output does not require Pandoc or a math-rendering service. Optional symbolic checks require `requirements-authoring.txt`, then `python tools/check_math.py`.

## Portability

Keep the directory together so relative source and figure links remain usable. The package can be committed to a Git repository you choose. No repository or hosted website was created or published. Choose an appropriate repository license before making public licensing claims.

Browser startup was blocked by the execution environment, so visual rendering, mobile layout, and native keyboard interaction remain unverified. Numerical execution, static HTML/math conversion, local HTTP delivery, and DOM-harness interaction checks are recorded in the verification report.

## Real-browser verification on a machine that permits browser startup

The optional runner starts its own local server, exercises all 18 laboratories, checks reset behavior and repeated navigation, checks the mobile reader for page overflow and native MathML layout, and tests a failed-module message. A successful automated run still deserves human visual review.

```bash
python -m pip install -r requirements-browser-verification.txt
python -m playwright install chromium
python tools/check_browser.py
```

This environment denied Chromium's required local socket, so that runner reports a blocked startup here. Numerical and DOM-test-double checks remain distinct from a browser pass.
