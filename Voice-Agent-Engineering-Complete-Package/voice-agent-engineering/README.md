# Voice Agent Engineering

A complete 12-lesson curriculum and continuous textbook on voice agents in Python and TypeScript, with researched provider comparisons and eight local browser experiments.

## Start here

1. Read `CURRICULUM.md` for the dependency-ordered learning path.
2. Open `book.html` for the offline reader, or `book.md` for Markdown. Individual lessons are in `chapters/`.
3. From this extracted folder, run `node companion/server.mjs`, then open `http://localhost:4173/companion/index.html`.
4. Follow `examples/README.md` for the optional provider integrations.
5. Read `verification.md` before interpreting the examples' test coverage.

The companion needs Node 24 and a modern browser, with no npm install, microphone, network provider, or key. It computes latency budgets, PCM frames, endpoints, cancellation races, proposal receipts, UX states, percentiles, and illustrative costs. The static source is served directly; there is no separate bundled production build.

Python exercises need Python 3.11+. The Gemini Python example additionally uses `websockets==16.0`. Optional local-model recipes have separate direct-dependency pins and were not installed or executed. Node examples use Node 24 type stripping; this is execution support, not full TypeScript type-checking.

## Files

| Path | Purpose |
| --- | --- |
| `CURRICULUM.md` | Outcomes, prerequisites, sequence, optional projects |
| `chapters/` | Twelve substantial canonical lessons |
| `book.md`, `book.html` | Assembled volume and portable HTML reader |
| `research.md`, `sources.json` | Landscape comparison, primary sources, access limitations |
| `examples/` | Complete Python, TypeScript, and browser source |
| `companion/` | Eight local interactive experiments and readable source |
| `tests/` | Numerical, state, transaction, and browser checks |
| `verification.md`, `verification-results.json` | Executed evidence and untested boundaries |
| `book.json`, `scripts/` | Reproducible assembly and structural validation |

## Reproduce checks

```bash
python -m unittest discover -s tests -p 'test_*.py'
node --test tests/core.test.ts tests/dom.test.mjs
python scripts/assemble_textbook.py .
python scripts/validate_textbook.py .
```

`tests/browser_checks.py` needs Playwright and a Chromium installation, and starts the companion and demo servers itself. It could not run in the authoring host because Chromium was blocked from creating a required Unix socket. See its header and the verification report. The HTML reader is a generated static artifact; its build script requires `marked==17.0.5` as an optional authoring dependency. It is not needed to read the book or run the labs.

The demo backend binds to localhost and has no application login. Authenticate users, enforce quotas, add a real text fallback, and follow the deployment chapter before exposing a provider-backed service. No provider keys, recordings, model weights, or provisioned accounts are included.
