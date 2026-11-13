# Electron Desktop Mastery: 1,000 hours

Build a secure, local-first agent desktop application inspired by Hermes Desktop. The course teaches architecture, implementation, testing, operations, distribution and commercialization. It is written for a software developer who knows basic programming; missing JavaScript, TypeScript, browser and operating-system concepts are introduced where needed.

The capstone is **Atlas Desk**, an original educational product with streaming conversations, tool approval, workspace files, previews, searchable history, provider settings, optional local models, browser authentication, subscriptions, and a release pipeline. Hermes is the feature reference, not a claimed affiliation. A full agent with arbitrary host execution may need a reduced Mac App Store edition. Do not assume identical features can pass every store's review.

## Reading order and exact workload

These are planned learning hours, not a claim that reading the files consumes 1,000 hours. Each chapter includes reading, guided implementation, investigation, and release evidence. The entire plan totals exactly 1,000 hours; workloads inside each chapter are disjoint.

| Chapter | Hours | Cumulative | Result |
|---|---:|---:|---|
| [01: Foundations and tooling](lessons/01-foundations-and-tooling.md) | 100 | 100 | Reproducible React/TypeScript desktop shell |
| [02: IPC, security and native integration](lessons/02-ipc-security-and-native-integration.md) | 140 | 240 | Narrow native capabilities and OS features |
| [03: UI, persistence and offline operation](lessons/03-ui-data-and-offline.md) | 120 | 360 | Accessible workspace with recoverable local data |
| [04: Identity, payments and entitlements](lessons/04-auth-payments-and-entitlements.md) | 120 | 480 | Browser login and server-authoritative billing |
| [05: Agent engineering](lessons/05-agent-runtime-and-hermes-capstone.md) | 180 | 660 | Controlled, cancellable agent workflow |
| [06: Testing, DX and performance](lessons/06-testing-dx-performance-and-reliability.md) | 120 | 780 | Measured reliability and regression evidence |
| [07: Packaging, signing, stores and updates](lessons/07-distribution-signing-stores-and-updates.md) | 140 | 920 | Platform-specific release candidates and runbooks |
| [08: Capstone integration and product launch](lessons/08-capstone-product-and-marketing.md) | 80 | 1,000 | Reviewed product, onboarding and launch experiment |

At 20 hours per week the plan spans 50 weeks; at 40 hours it spans 25 weeks. Labs are suggested application work, not quizzes or mandatory active recall. Prior experience may shorten a block; spend recovered time on the advanced extensions rather than pretending elapsed time proves expertise.

## Start here

1. Read [versions and research](reference/versions-and-sources.md). The research snapshot is November 13, 2026. Verify releases again before installation.
2. Install a supported Node development runtime compatible with your pinned tools, Git, and an editor. Forge 8 requires Node 22.17 or newer; the author's lightweight checks used Node 24.22.1. Electron embeds its own Node runtime.
3. Read chapter 01 and build the Forge/React/TypeScript shell. Use native Windows tooling for Windows releases; WSL is useful for Linux work but is not a replacement for Windows artifact testing. A Mac is needed for the macOS signing and store workflow.
4. Run `cd companion && npm test` for dependency-free domain examples. `npm install && npm start` additionally requires access to npm and an Electron-capable graphical environment.
5. Work through the chapter implementation blocks, using [the API atlas](reference/electron-api-atlas.md), [complete pinned API signatures](reference/electron-api-signature-catalog.md), [capstone contract](reference/capstone-contract.md), and [release evidence template](templates/release-evidence.md).

## Included code and limits

The companion is a deliberately small, runnable Electron reference with typed domain contracts, secure preload, validated IPC, a deterministic agent simulation, approval, cancellation and an event log. It is not a finished commercial Hermes replacement. The course teaches the production work required to extend it. Its renderer is dependency-free so the process boundaries are visible; chapter 01 teaches the React/TypeScript migration and Forge build route.

Code blocks marked **fragment**, **pseudocode**, or **integration contract** require the described surrounding implementation. Do not copy them as standalone programs. The included companion and tests are the runnable reference. Network providers, OAuth configuration, payment accounts, certificates, paid signing services, native packages and store submissions require learner-owned credentials and host platforms. None are provisioned by reading this course.

## Port to GitHub

Unzip the package, open this directory, run the supplied checks, and create your own repository. Review `.gitignore` before adding files. Keep tokens, signing keys, production databases, private conversations and downloaded agent runtimes out of source control. No repository was created or published for you.

Each lesson exceeds 5,000 ordinary-text tokens with the included cl100k_base reference counter. The package includes its vocabulary, provenance and reproducible measurement script. This is a named-counter measurement, not a claim about every model tokenizer.

See [VERIFICATION.md](VERIFICATION.md) for checks actually performed, the depth measurement method, and platform work that remains to be executed by the learner.
