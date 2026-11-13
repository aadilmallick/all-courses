# API and environment baseline

Snapshot: **13 November 2026**. This is a compatibility record for the included code, not a permanent browser-support promise. Consult [SOURCES.md](SOURCES.md) for access scope and provenance.

## Installed application dependencies

| Component | Pinned version | Used for |
| --- | --- | --- |
| `@mlc-ai/web-llm` | 0.2.88 | Catalog, worker handler/factory, streamed chat, interrupt/unload |
| `@huggingface/transformers` | 3.8.1 | Optional WASM/q8 feature extraction |
| `marked` | 17.0.1 | Authored local chapter rendering; never model-output HTML |
| `typescript` | 5.9.3 | Deliberately compatible checker baseline; not claimed newest |
| `vite` | 8.3.8 | Browser and worker build; development proxy |
| `@types/node` | 24.19.2 | Node declarations |
| `gpt-tokenizer` | 4.1.2 | `cl100k_base` chapter-depth measurement only |

The lockfile pins transitive dependencies. Node 26.7.0/npm 11.19.0 were present during authoring. Documented minimum Node is 22.18 for direct erasable TypeScript execution; cross-version execution was not tested. The compiler checks all application, example, script and test TypeScript. Local interfaces for native Chrome/WebMCP intentionally describe only the used subset; they do not polyfill any API.

## Native Chrome AI

| Family | Included calls | Inspected status and caveat |
| --- | --- | --- |
| Prompt | `LanguageModel.availability/create`; session `prompt`, `destroy` | Web listed from Chrome 148; extensions from 138; eligibility still applies |
| Summarizer | `availability/create/summarize/destroy` | Listed from Chrome 138 |
| Translator | Pair-specific `availability/create/translate/destroy` | Listed from Chrome 138; pair packs and privacy-aware readiness reporting |
| Detector | `availability/create/detect/destroy` | Listed from Chrome 138; ranked candidates |
| Writer | `availability/create/write/destroy` | Trial-stage; individual page documents origin trial/local flag |
| Rewriter | `availability/create/rewrite/destroy` | Trial-stage; relative tone and length values |
| Proofreader | `availability/create/proofread/destroy` | Trial-stage; corrected input/correction records; page snippet inconsistencies noted |

The [status table](https://developer.chrome.com/docs/ai/built-in-apis) and individual pages can differ in trial terminology and date metadata. Runtime detection is mandatory. This edition does not pass numeric `temperature/topK` into a normal web Prompt API call. The inspected web sampling presets are trial-sensitive; the baseline omits them. Older context quota names are not used. [Prompt guide](https://developer.chrome.com/docs/ai/prompt-api).

Availability has four states: unavailable, downloadable, downloading, available. Match language/modality/pair options between preflight and creation. Creation is invoked directly from a click before unrelated awaits so transient activation is not accidentally lost. Sessions are released in `finally`.

Inspected Chrome requirements included desktop OS restrictions, at least 22 GB free profile-volume space, and either GPU with strictly more than 4 GB VRAM or CPU with at least 16 GB RAM and four cores for the foundation-model group; audio prompting required GPU. Translator/Detector had a different desktop-only requirement. These are documentation snapshot values, **not constants used to predict support in code**. Recheck per-API documentation before deployment. No browser flags or trial registrations were changed during authoring.

The wrapper defaults to text English for Prompt and summary, English-to-French translation, neutral short Writer, more-formal shorter Rewriter, and English Proofreader. Unsupported combinations should fail visibly. Prompt and several task APIs have document/worker restrictions; the WebLLM worker pattern is not assumed transferable.

## WebMCP

Current experimental baseline: `document.modelContext`, async `registerTool(tool, {signal})`, `getTools()`, `executeTool(descriptor, object, {signal})`, result string or null. Registration abort controls lifetime. Callback receives input and execution options containing a signal. No invented `unregisterTool()` call and no silent fallback to an older navigator-based shape. [Imperative guide](https://developer.chrome.com/docs/ai/webmcp/imperative-api).

Declarative form baseline: `toolname`, `tooldescription`, optional `toolparamdescription`, and read-only demo `toolautosubmit`. Agent submit extensions are feature-checked before `respondWith` is called. The ordinary form always uses the same validated domain function. [Declarative guide](https://developer.chrome.com/docs/ai/webmcp/declarative-api).

Cross-origin concepts use permissions-policy delegation plus explicit provider/caller origin gates in the inspected draft. The delivered lab is same-origin. Community report: 2026-11-12, not a W3C Standard. Chrome overview describes origin trial from 149 and local testing flag. Older browser experiments may differ. [Draft](https://webmachinelearning.github.io/webmcp/), [Chrome access](https://developer.chrome.com/docs/ai/webmcp).

## External model and provider requirements

- WebLLM model IDs come from the installed catalog. Weights/config/tokenizer/compiled libraries are external; catalog membership does not certify device fit. No model weights or model-specific licenses are bundled.
- MiniLM uses `Xenova/all-MiniLM-L6-v2`, mean pooling, normalized vectors, WASM and q8. The model card identifies Apache-2.0; the lab does not pin an immutable model repository revision. [Model card](https://huggingface.co/Xenova/all-MiniLM-L6-v2).
- Cloud uses server-side `POST /v1beta/models/{model}:generateContent`, key header and `contents[].parts[].text`, with a controlled extracted answer. `GEMINI_MODEL` has no invented default. No credentials or paid call are included. [Provider contract](https://ai.google.dev/api/generate-content).
- Native/browser-managed model identity is not frozen by the npm lockfile. Record browser and observed behavior for any real evaluation.

## Reproducibility limits

The source/build/lockfile are reproducible inputs, not a claim that all remote artifacts are frozen. Model repositories, browser-managed models, trial access, hardware drivers and provider account availability can change. The [verification report](../verification.md) identifies what this edition actually ran.
