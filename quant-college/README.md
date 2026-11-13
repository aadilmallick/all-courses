# Quantitative Finance from First Principles

Start with **[index.html](index.html)** for the offline reader with typeset equations. Double-click it after extracting the ZIP. It contains the full original textbook and chapter navigation; it does not need an internet connection. External course links require internet access.

The continuous text is **[book.md](book.md)**. Individual chapters live in `chapters/`. Work through their numbered sections in short sessions. The program assumes no finance, programming, calculus, or university mathematics; Chapter 1 rebuilds the necessary arithmetic and algebra.

## Run the laboratory

Install a current supported Node.js release if needed. From this folder:

```text
node companion/server.mjs
```

Open **http://127.0.0.1:8765/companion/index.html**. The server's root **http://127.0.0.1:8765/** opens the book. Fourteen experiments compute locally from displayed assumptions. No accounts, API keys, external data, or trading connections are used. Stop the server with Ctrl+C. If the port is occupied, set `PORT` to another local port before starting. For example, PowerShell: `$env:PORT = '8766'`.

The reader opens directly from disk. The experiment modules require the local server because browsers restrict local module loading. The companion is static source with no separate bundling step; the served source is the production artifact.

## Run the Python references

Use Python 3.12 or later. On Windows, substitute `py` if `python` is not your interpreter command; on many other systems use `python3`.

```text
python examples/core_labs.py
python -m unittest discover -s tests -v
node tests/test_labs.mjs
```

The first command writes `outputs/synthetic-project-results.json`. It covers portfolio analysis, factor regression, an event study, volatility forecasting, chronological prediction, option pricing, and an analytical portfolio optimum. These standard-library examples need no package installation. Scientific-library snippets in Chapter 4 are supplementary and need the named libraries; they are not dependencies of the baseline package.

## Navigate the program

- [Study plan and project studio](chapters/18-project-studio-and-readiness.md): suggested six-term sequence, seven projects, capstone, and readiness rubric.
- [Course coverage](COURSE-COVERAGE.md): topic-by-topic connection to all eight roadmap courses and the 2013 predecessor of 18.642.
- [Resource catalog](resources/RESOURCE-CATALOG.md): direct PDF, video, assignment, solution, code, data, archive, and reading links.
- [Source ledger](SOURCES.md): provenance, access scope, cost classification, and research limits.
- [Verification](verification.md): measured chapter depth, numerical and browser checks, and untested platforms.
- [Glossary](GLOSSARY.md): notation and key distinctions.

The free core uses this original book and freely accessible official materials. A university syllabus can recommend paid books or link to third parties; those links are preserved as references with unknown or separate access terms, not represented as required free purchases. Coursera is not used as the core delivery platform.

## Build the reader after editing

Canonical chapter text is in `chapters/`. Run `python tools/assemble.py` and then `node tools/build_reader.mjs` to regenerate `book.md`, the manifest, resource catalog, and `index.html`. Bundled Marked 17.0.5 and KaTeX 0.16.22 support the local build. Preserve their notices. The depth report was measured with `tiktoken 0.12.0`, encoding `cl100k_base`; that authoring-only counter is not a runtime dependency.

Study time is a planning estimate of 1,800–2,400 hours including external courses and projects. “Ready” means demonstrated independent foundational research ability under the rubric, with further specialization as needed. No course can guarantee a job or profitable trading.
