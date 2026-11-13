# Six guided application projects

All baseline behaviors below are implemented in the included TypeScript source. Extension ideas are optional future work and are not counted as delivered features. Setup is in [README.md](../README.md).

## 1. A transparent model-mechanics laboratory

**Use case:** explain why sampling changes output and why attention mixes information. Read chapter 1. Run `npm run demo` and open experiment 1. Source: [core.ts](../src/core.ts), [foundations.ts](../examples/foundations.ts).

Change logits and temperature, calculate probabilities, inspect the two-position attention result. Expected: probabilities sum to one; default values are about 0.6652/0.2447/0.0900; attention output is about 6.6976/3.3024. Invalid temperature is rejected. Reset restores the defaults. This is numerical computation, not pretrained inference.

**Optional extension:** add seeded categorical sampling with a histogram. Keep probability calculation separate from random selection and test distribution invariants.

## 2. A dependable streaming boundary

**Use case:** display incremental text without breaking multibyte characters or losing cancellation. Read chapter 2. Run `npm run dev` and `npm run server`; use experiment 2. Source: [cloud-server.ts](../examples/cloud-server.ts), [core.ts](../src/core.ts), [main.ts](../src/main.ts).

Expected fixture output: `Transport fixture: café. No model ran.` Choose a route with the checkboxes, then stream, stop, reset and change views. Cloud is unavailable when not approved or marked sensitive. The fixture requires no credentials. Automated tests split a synthetic UTF-8 stream at every byte boundary.

**Optional extension:** add a separately versioned SSE provider adapter. Do not call the NDJSON parser a general SSE parser.

## 3. An evidence inspector

**Use case:** find the passages supporting a document answer. Read chapter 3. Open experiment 3. Source: [core.ts](../src/core.ts), [embeddings.ts](../src/embeddings.ts).

Search public notes immediately. Optional semantic ranking downloads an actual MiniLM embedding model and uses WASM. Expected: lexical results contain public source IDs; a query for the private fixture's unique code yields no public hit. Semantic scores are similarities, not truth probabilities. Inspect a paraphrase and an exact API name.

**Optional extension:** ingest a small authorized Markdown collection with stable source/version IDs and update/delete tests. File ingestion is not implemented in the baseline.

## 4. A local-model writing workbench

**Use case:** generate a draft locally with explicit artifact loading. Read chapter 4. Open experiment 4. Source: [webllm.ts](../src/webllm.ts), [webllm-worker.ts](../src/webllm-worker.ts).

Calculate memory first. Select an exact catalog ID, explicitly load it, and generate a short answer if the device supports it. Expected: real progress/error status, no automatic cloud fallback, only one generation at a time, interruption control, and resource cleanup on reset/navigation. An absent GPU is a valid observed outcome, not a passed inference test.

**Optional extension:** retain a user-selected engine across questions under a dedicated application owner, then compose it with the evidence builder as shown in chapter 8.

## 5. A native Chrome task desk

**Use case:** summarize, translate, detect language, draft, rewrite and proofread through browser-managed APIs. Read chapter 5. Open experiment 5. Source: [chrome-ai.ts](../src/chrome-ai.ts).

Check availability, choose a task and synthetic text, then run a supported native operation. Expected: explicit absence/trial errors when unsupported, direct creation from a click, disclosed provisioning, readable output and session cleanup. Wording varies; check preserved meaning instead of one exact generated string.

**Optional extension:** add a reversible proofreading diff editor after verifying correction-coordinate semantics. The baseline displays the native proofreading result as JSON.

## 6. A document assistant with read-only agent tools

**Use case:** answer a course-note question from visible sources and expose search to a compatible browser agent. Read chapters 6–8. Use experiments 6–8. Source: [webmcp.ts](../src/webmcp.ts), [declarative.ts](../src/declarative.ts), [agent-loop.ts](../examples/agent-loop.ts), [main.ts](../src/main.ts).

First inspect the evidence prompt in experiment 8; no model runs. Optionally answer through native Chrome or explicitly approved configured cloud. In experiment 6, direct search and ordinary form submission work independently of native WebMCP. Native registration, discovery and execution require a compatible experimental environment. The planner CLI is a labeled deterministic fixture, not an LLM planner.

Expected: empty evidence abstains; private fixture is excluded; no silent remote transfer; unsupported tool names and excessive loop steps are rejected; generated claims remain reviewable. The baseline does not send messages or mutate external accounts.

**Optional extension:** add claim-level citation integrity, a larger authorized corpus, or a real planner adapter under the same bounded dispatcher. Consequential actions require a separate reviewed transaction design.
