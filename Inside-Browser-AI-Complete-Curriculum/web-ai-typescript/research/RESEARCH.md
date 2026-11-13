# Research synthesis: three axes of browser AI

Research date: **13 November 2026**. This synthesis joins primary documentation, model/runtime source and original papers. The [source ledger](SOURCES.md) records 38 resources and distinguishes indexes, selected sections and inspected pages. It does not claim every linked website or full paper was read. All course explanations and figures are original.

## The distinction that organizes the ecosystem

Separate **inference location**, **model ownership**, and **action exposure**. Cloud versus local answers where computation runs. WebLLM versus native Chrome AI answers who selects, loads and manages model artifacts. WebMCP answers how page operations become explicit to an agent-capable environment. These axes can be combined; they are not competing names for one product category.

| Route | Strengths when it fits | Main constraints | Course implementation |
| --- | --- | --- | --- |
| Cloud model behind a trusted server | Broad model choice; server-controlled deployment; little client model memory | Input transfer, credentials, network, quotas, cost, provider lifecycle | Optional Gemini complete-response route with explicit opt-in |
| WebLLM | Application-selected local model; inspectable catalog; worker/stream interface | Large artifacts, compatible compiled libraries, GPU memory, cache and device support | Pinned 0.2.88 worker-backed engine |
| Native Chrome AI | Browser-managed provisioning and task interfaces | Browser/device eligibility, model changes, language/modality and trial constraints | Prompt plus six task operations with capability diagnostics |
| Transformers.js | Task pipelines including embeddings, using supported runtime backends | Model/task/backend compatibility and asset loading | Pinned 3.8.1 WASM MiniLM embedding ranking |
| WebMCP | Structured page operations, shared application logic, visible human/agent context | Experimental browser/host integration; validation and authority still required | Same-origin imperative and declarative read-only search |

The route tradeoffs above are engineering inferences from the documented contracts, not a universal performance ranking. No cross-device benchmark or real-model comparison was performed for this edition. [WebLLM](https://webllm.mlc.ai/docs/user/basic_usage.html), [Chrome AI](https://developer.chrome.com/docs/ai/built-in), and [Transformers.js](https://huggingface.co/docs/transformers.js/v3.8.1/en/index) define their respective integration surfaces.

## WebMCP: a live experimental boundary

The inspected community report is dated 12 November 2026 and explicitly is not a W3C Standard. Chrome documents origin-trial access and a local testing flag. This is the reason the course uses progressive enhancement and an explicit absent state. It does not assume that registering a page tool makes it available to every assistant. [Community report](https://webmachinelearning.github.io/webmcp/), [Chrome overview](https://developer.chrome.com/docs/ai/webmcp).

The implementation baseline uses async `document.modelContext.registerTool`, abort-signal lifetime management, `getTools`, and object-form `executeTool` arguments. The course intentionally avoids combining old `navigator.modelContext` snippets with a newer lifecycle API. Form annotations provide a second path that preserves ordinary form behavior. [Imperative API](https://developer.chrome.com/docs/ai/webmcp/imperative-api), [Declarative API](https://developer.chrome.com/docs/ai/webmcp/declarative-api).

The application inference is straightforward: domain operations should be implemented once and adapted to manual and agent entry points. Tool schemas aid discoverability; runtime parsing, authenticated identity and transaction design enforce meaning and authority. Read-only annotations do not prove a callback is actually read-only. A production integration needs tests at the domain, native browser and external agent-host layers.

## WebLLM: compatible artifacts and ownership dominate integration

The pinned runtime's catalog is the source of selectable model IDs. A model deployment combines weights, tokenizer/configuration and compatible compiled code. The practical consequence is to version artifact sets together and test actual hardware, rather than selecting a model solely from a parameter count. The systems paper explains the browser execution architecture; its historical measurements are not reproduced here. [Systems paper](https://arxiv.org/html/2412.15803v1), [pinned source](https://github.com/mlc-ai/web-llm/blob/v0.2.88/src/config.ts).

The source implementation places the engine in an owned worker, serializes generation, supports interruption and terminates the worker during disposal. Service workers have browser-managed lifetimes and should not be treated as permanent model daemons. The advanced guide also contains experimental modality paths that require specific model builds; these are not baseline promises for every catalog entry. [Advanced guide](https://webllm.mlc.ai/docs/user/advanced_usage.html).

This edition teaches resumability as an optional persistence feature, not a default privacy improvement. The documented journal can retain prompt and output data, and recovery depends on compatible state. The companion leaves it disabled. [Resumable generation](https://webllm.mlc.ai/docs/user/resumable_generation.html).

## Chrome AI: status, capability and execution are separate evidence

The status overview and per-API pages do not always use identical trial wording or date metadata. The baseline appendix preserves that uncertainty. The course checks constructors and availability, then treats session creation/execution as separate operations. It never calls a cloud service to simulate a missing native API. [Status table](https://developer.chrome.com/docs/ai/built-in-apis).

The Prompt API's current web surface differs from older tutorials, including context-oriented property names and sampling-control differences between web pages and extensions. The baseline uses text-only requests and omits trial-sensitive sampling controls. The moving explainer can contain proposals beyond Chrome's implementation, so it is not treated as proof of shipping support. [Chrome Prompt guide](https://developer.chrome.com/docs/ai/prompt-api), [explainer](https://github.com/webmachinelearning/prompt-api/blob/main/README.md).

The practical product inference is to choose the narrow task API when it matches the job, keep original material reversible, and evaluate meaning preservation rather than API completion alone. Translation, summarization and proofreading are different contracts. The course implements each separately and records native execution limits honestly.

## Compute APIs are not model APIs

WebGPU exposes graphics/compute facilities. WebAssembly supports portable execution. WebNN is a dedicated neural-network acceleration interface with its own standardization and implementation status. Libraries can use these at different levels. A browser exposing one feature does not guarantee a particular model graph, operator set or memory allocation will work. [WebGPU](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API), [WebNN status](https://www.w3.org/TR/webnn/).

ONNX Runtime Web's provider guides illustrate explicit backend choices and lifecycle concerns. This course uses its functionality indirectly through Transformers.js for embeddings; it does not claim a separately executed low-level WebNN session. [WebGPU provider](https://onnxruntime.ai/docs/tutorials/web/ep-webgpu.html), [WebNN provider](https://onnxruntime.ai/docs/tutorials/web/ep-webnn.html).

## Stable concepts versus change-sensitive implementation

Stable teaching includes conditional prediction, softmax, vector similarity, attention mixtures, training/inference separation, explicit trust boundaries and evidence evaluation. Change-sensitive teaching includes exact model IDs, browser eligibility, experimental method names, origin-trial configuration, compiled model versions and provider endpoints. The curriculum places the former in explanations and the latter in a dated adapter/baseline record.

Original numerical examples are deliberately small enough to verify. The count-based training program is not a transformer. The quantization program is not a model-conversion tool. The NDJSON stream and planner are labeled fixtures. These distinctions prevent attractive demonstrations from overstating what was executed.

## Coverage matrix

| Topic family | Primary research anchor | Teaching | Runnable path | Evidence boundary |
| --- | --- | --- | --- | --- |
| Prediction/attention | Transformer paper; instruction-tuning paper | Chapter 1 | Softmax/attention CLI + lab | Numerical toy, no trained transformer |
| Async/streaming | TypeScript and Streams references | Chapter 2 | Node server + UTF-8 parser | Fixture is not inference |
| RAG/embeddings | RAG paper; MiniLM model card | Chapter 3 | Lexical retrieval; optional embedding pipeline | Model download optional; source support still reviewed |
| Local LLM | WebLLM docs/source/paper | Chapter 4 | Real worker engine route | Hardware/model execution separately reported |
| Native AI | Chrome per-API pages | Chapter 5 | Native wrappers | Presence/availability/execution distinguished |
| Agent page tools | WebMCP draft and Chrome docs; MCP architecture | Chapter 6 | Shared function, native tool and form | External agent selection not inferred |
| Dependability | Application contracts and preceding sources | Chapter 7 | Tests and evaluation lab | Static checks do not prove model truth |
| Integration/adaptation | LoRA paper and preceding sources | Chapter 8 | Assistant, bigram, quantization | No frontier training or arbitrary LoRA deployment claimed |

## What to recheck for the next edition

Recheck WebMCP draft and Chrome implementation together, native API status and modality/language support, WebLLM release/model-library compatibility, external model revisions/licenses, and provider model availability. Rebuild from the lockfile and repeat affected experiments. Keep a separate record for source inspection, static checks, fixtures and observed native inference; none substitutes for the others.
