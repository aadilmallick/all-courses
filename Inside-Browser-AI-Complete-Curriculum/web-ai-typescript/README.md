# Inside Browser AI

A complete first-principles curriculum and companion textbook for building LLM-powered web applications in **TypeScript**. Research edition: **13 November 2026**.

Start with [the curriculum](CURRICULUM.md), read [the single-volume textbook](book.md), or follow the [eight canonical chapters](chapters/01-models-tokens-attention.md). The book includes the complete application source in an appendix. The browser companion provides a readable chapter view and eight experiment groups.

## What is included

- Eight substantial lessons, each at least 5,000 `cl100k_base` tokens and 2,500 prose words; measured results are in [depth-and-links.json](depth-and-links.json).
- LLM foundations, attention arithmetic, TypeScript, streams, server boundaries, retrieval, embeddings, WebLLM, Chrome's seven AI API families, WebMCP, agents, evaluation, security and deployment.
- Complete TypeScript application and examples, pinned packages and lockfile, built browser assets in `dist/`, original diagrams, six guided project applications, source ledger and verification report.
- Deterministic experiments that require no model, plus explicitly optional real-model integrations.

## Setup

Use Node **22.18+**, npm, and a current desktop browser. This edition was built with Node 26.7.0; see [verification.md](verification.md) for observed checks. Basic variables/functions are assumed; asynchronous TypeScript and model mathematics are taught in the chapters.

From this directory:

```text
npm ci
npm run dev
```

Open the printed local URL, normally `http://127.0.0.1:5173`. In a second terminal, run `npm run server` for the chapter-2 streaming fixture and optional cloud route. The fixture works without credentials and clearly labels that no model ran.

Other useful commands:

```text
npm run demo
node examples/bigram.ts
node examples/quantization.ts
node examples/agent-loop.ts
npm test
npm run book
npm run verify
npm run build
npm run preview
```

`preview` serves the built reading companion, normally on port 4173. It has **no development API proxy**: use `dev` with the course server for transport/cloud labs. The build can also be served by a local static server. Opening HTML directly as a file is not supported. No hosted site or external repository is created.

## Optional model paths

**WebLLM:** chapter 4 explicitly loads a selected model from the pinned package catalog. Requires suitable WebGPU support, memory, storage and network for initial artifacts. Weights are not included. Catalog models have their own licenses and requirements.

**Chrome AI:** chapter 5 detects constructors/readiness and calls native APIs only when you choose a run button. Browser/device eligibility and trial access vary. The current baseline uses `LanguageModel` and `document.modelContext`; see [API-BASELINE.md](research/API-BASELINE.md).

**Embeddings:** chapter 3 optionally downloads MiniLM through Transformers.js and uses WASM. It is separate from the deterministic lexical retriever.

**Cloud:** configure `GEMINI_API_KEY` and `GEMINI_MODEL` only in the server's environment, then start `npm run server`. Choose an account-supported model ID from current provider documentation. Chapter 8 requires explicit transfer opt-in. No paid provider call was made during authoring.

No model weights download on initial page load. Optional library code is loaded when its lab is entered or its action is chosen. This is a served local learning app, not a complete offline-installed PWA. Downloads, browser caches and runtime readiness are distinct.

## Read and modify

Read chapters in order first. Practice is optional; there are no mandatory quizzes. The [project guide](projects/PROJECTS.md) identifies implemented behaviors and clearly labels future extensions. [Research synthesis](research/RESEARCH.md) explains the ecosystem decisions, [sources](research/SOURCES.md) records inspection scope, and [verification](verification.md) states what was actually executed.

Canonical text lives in `chapters/`; canonical application code lives in `src/` and `examples/`. `npm run book` assembles `book.md`, the manifest, source ledger and figure copies. Rebuild and reverify after changes. The ZIP excludes `node_modules`, credentials, caches, Git metadata and unrelated workspace material.
