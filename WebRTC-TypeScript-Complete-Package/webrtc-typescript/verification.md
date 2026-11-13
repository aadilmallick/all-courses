# Verification report

Edition: November 12, 2026. This report distinguishes authored teaching, static validation, executed algorithms/control tests, and native/browser/deployment behavior.

## What was actually executed

| Check | Result | What it establishes |
| --- | --- | --- |
| Node runtime | 24.22.1 | Actual build/test baseline |
| `npm run build` | Passed | Canonical TypeScript strips into included browser JavaScript and static files copy |
| `npm test` | 7 tests passed | Rate invariants, topology arithmetic, SDP selection, chunk preservation/hash vector, backpressure wait/abort/close, credential known value, queued negotiation/ignored glare under a mock |
| `node scripts/check-snippets.mjs` | 31 snippets passed | JavaScript/TypeScript syntax after stripping; contextual fragments are wrapped for syntax parsing |
| `node --check` on built modules and optional worker | Passed | JavaScript syntax only |
| `node scripts/check-server.mjs` | Passed | Built HTML/CSS/modules served and out-of-scope paths rejected |
| `python scripts/check-package.py` | Passed | Required DOM IDs, module paths, local links and worked arithmetic checked |
| Textbook structural validator | Passed; details in `depth-report.json` | Chapter depth, manifest, stable anchors, fences, source and experiment references |
| ZIP inventory and integrity | Passed; recorded during packaging | Required contents, relative paths, no dependency directories, no traversal entries |

The coturn expected credential value was independently computed using Python's standard hmac/hashlib implementation and asserted in the Node test. It uses a synthetic test secret only. Arithmetic checks include the 664 Mbps approximate raw-video example, 50 ms jitter-buffer average, 20 ms decode average, and 270 MB one-way payload estimate.

## What was not verified

Chromium launch was attempted through Playwright, but this environment rejected the browser's process-singleton socket creation. No browser page opened. Therefore no native peer traffic, actual video playback, visual/responsive inspection, permission interaction, real camera/screen capture, two-tab glare, native stats fields, or cross-browser behavior is claimed as executed here. The optional `scripts/browser-smoke.py` provides a starting runner for a suitable local environment; it was syntax-checked only.

No TURN service, SFU, internet signaling service, cloud deployment, real recording workflow, or application-level encryption service was installed or operated. The optional LiveKit listing targets the inspected 2.24.0 reference but was not dependency-installed, type-checked, or run against a server. The pass-through worker is not encryption and was not exercised in a native transform pipeline.

The build removes TypeScript annotations and does not run a TypeScript compiler. A strict tsconfig is supplied for separate compiler verification. The optional browser runner records Playwright 1.62.0; it is not a core runtime dependency. No compiled-package or browser test result should be interpreted as a production security review.

## Teaching and file checks

Ten chapters are complete in prerequisite order. Each exceeds 2,500 prose words using the structural validator's outside-fence whitespace count; code blocks are excluded. Counts are provided per chapter in depth-report.json. Model-token counts were not measured and no tokenizer-specific size claim is made. Length is supplemented by a review of motivation, prerequisites, worked steps, code context, failure diagnosis, and transitions.

The continuous book is assembled from canonical chapters and source, with unique explicit chapter/section anchors, part divisions, linked contents, a complete source appendix, resource research, glossary, and optional project specifications. The assembly script is included. No independent Markdown math/Mermaid rendering was available; the diagrams/equations are source-checked and mathematical examples are numerically checked, without a claim of visual rendering verification.

The source ledger records selective inspection and distinguishes the official sample index from executed demos. No full external books/articles, private files, service secrets, or fetched SDK distributions are bundled. Archive creation excludes scratch helpers and failed browser artifacts.
