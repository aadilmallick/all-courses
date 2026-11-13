# Reproducible environment

Reading the course requires a text or Markdown reader. GitHub and mathematical Markdown editors can render the included LaTeX. The canonical sources remain ordinary UTF-8 files.

The laboratory has no external JavaScript dependency, no package installation step, and no build step. Its checked-in source is its runnable output. It uses ES modules, BigInt, native form controls, and standard browser DOM APIs. The server uses only Node.js built-ins. Node 18 or later supplies the required features; the verification report records the exact version actually exercised. No universal browser-support guarantee is implied.

Course assembly and structural checks use Python 3.10 or later, standard library only:

```sh
python scripts/assemble.py
python scripts/check_project.py
```

The numerical experiment suite and local HTTP check use only Node.js:

```sh
node scripts/check_companion.mjs
node scripts/check_http.mjs
```

The mathematics source is complete in `companion/math.mjs`. It is not a production cryptography library. Its small domains keep integer computations exact where Number is used, and growing computations use BigInt. Floating-point sums/products in the prime experiment are labeled approximations.

No remote font, CDN, analytics, login, external API, or hosted service is required. External references in `REFERENCES.md` are optional further reading. Running the local server serves files only from the extracted course root and binds to the loopback address.
