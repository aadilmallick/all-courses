# Verification report

Edition date: November 12, 2026. Original teaching materials were tailored to the supplied Hako onboarding and roadmaps. This report separates observed behavior from documentation checks and future native labs.

## Curriculum structure and depth

Ten complete canonical chapter files were assembled into `book.md` and rendered into a standalone `book.html`. There are approximately 35,681 non-code whitespace-separated words across chapters, including headings and tables. Every chapter exceeds 5,000 tokens under tiktoken 0.12.0 / cl100k_base. This is a named-tokenizer measurement, not a claim about another model's tokenizer. Per-chapter results are in `checks/chapter-depth.json`.

The Textbook Workshop final structural validator passed with no errors. It checked chapter status/depth, companion mappings, module existence, anchors and book links. Additional checks found all local Markdown file targets, no personal machine paths in distributed text, and no unreplaced authoring scaffold. Canonical chapters were reviewed for prerequisite sequence, worked reasoning, code/environment labels, role alignment and source limitations.

## Executed Python and USD evidence

- Python 3.12.14: nine unittest cases passed with SimPy 4.1.1 and usd-core 26.5 available.
- Numerical checks covered transform round trips, FK/IK reconstruction and unreachable targets, projection, wheel rates, stopping distance, residual metrics, nonfinite inputs, timestamps, duplicate rejection and state preservation after invalid input.
- Actual USD 26.5 stages were created and reopened. Reference composition, variant color, sublayer precedence and authored rigid-body/collision APIs were queried successfully. No physics engine ran in the CPU USD test.
- Scalar logistic training and tabular Q-learning executed. The held-out synthetic classifier had TP=96, FP=10, TN=90, FN=4; the greedy grid route was 0→1→2→3→4. These are toy-learning results, not image or robot benchmarks.
- The first model, robot mathematics, learning and observation-pipeline scripts executed; their output is in `checks/example-output.txt`.
- 12 Python example/module files passed AST syntax parsing. Syntax parsing of native scripts does not establish import availability or native execution.

## Executed warehouse evidence

Both teaching policies received identical demand fixtures and the same disclosed nonpreemptive outage. Tests passed for shared demand hash, nondecreasing event times, exclusive pick occupancy, unique shipments and order conservation. The deterministic output is included in `assets/policy-replay.json`.

Before the strict 100-second cutoff, each policy shipped 26 of 40 orders, leaving fourteen unfinished. Baseline completed-order mean/p95 lead time was approximately 27.85/52 seconds; fault-aware mean/p95 was approximately 28.62/46 seconds. This fixture ties throughput and exposes a tradeoff. It does not prove the superiority of Hako's actual unavailable policy or validate Site 1 targets.

## Browser runtime and visual evidence

Chrome 156.0.8078.80 was controlled with Playwright on this Windows host. All fifteen experiments mounted, a relevant keyboard-operated slider changed the computed output, and reset restored initial parameters. Policy play/pause, seeking, repeated navigation and rapid navigation away from an asynchronous load passed. A deliberately aborted replay-data request produced a visible failure and recovered after reset.

Known-case browser-model checks passed separately in Node 26.7.0, including a closed differential-drive arc, controller behavior, Q-learning, confusion-count conservation, event reduction, malformed/duplicate replay rejection and bounded action validation.

Desktop 1440×1000 and narrow 390×844 layouts were inspected. The book and companion showed no page-level horizontal overflow in the checks. Desktop/narrow screenshots of the companion and book were visually inspected; code and table overflow is contained within its own region. Ten chapter anchors, the standalone guide, and the included architecture image loaded. No unhandled page errors were observed. Evidence metadata is in `checks/browser-evidence.json`. QA screenshots are not bundled as curriculum content.

The companion executes explicit lightweight mathematical/process models in JavaScript. It does not run NVIDIA physics, ROS, WebRTC streaming, a real MCP tool or a robot. The source files are the production output; there is no separate web build or runtime dependency installation.

## Native and external limitations

Isaac Sim 6.2.0, Jetbot assets, Replicator, the Kit extension, ROS, cloud streaming and MCP services were not installed or executed here. Their examples received documentation review and syntax checks only. Actual behavior must be verified in the selected compatible runtime. GPU access was confirmed by you; GPU model, VRAM, driver and compatibility were not inspected.

The actual Hako simulation, builder, event exporter, web application, vendor rate block, RO1 asset and economics workbook were not supplied. No modifications or performance claims about those artifacts are made. The original DOCX text was inspected for context; its visual layout was not reviewed. Authenticated courses and videos were not represented as completed.

No physical robot, broker, paid cloud instance or external deployment was connected. The local learning server is loopback-only and read-only. The original private documents, dependency directories, caches, credentials and Git internals are excluded from delivery.

## Packaging

The ZIP contains the readable and Markdown books, ten canonical chapters, guide, provenance/coverage/role records, all example source, companion source, replay data, generated portable USD layers and check results. The final packaging step verifies archive integrity, expected members, safe relative names and exclusions. See the root `FILE_INVENTORY.json` for packaged file hashes; it excludes its own hash to avoid self-reference.
