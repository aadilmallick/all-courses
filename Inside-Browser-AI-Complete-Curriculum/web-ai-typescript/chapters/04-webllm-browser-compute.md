# 4. Run a language model in the browser with WebLLM

The user of a private notebook wants help rewriting a paragraph without sending that paragraph to a remote model service. The central problem is now deployment: can the browser load compatible model artifacts, allocate enough memory, perform inference, and remain responsive? WebLLM gives us an application-managed route to local language-model inference, but it also makes download, lifecycle, and compatibility decisions part of our application.

The prerequisites are the next-token and KV-cache concepts from chapter 1 and asynchronous ownership from chapter 2. Retrieval from chapter 3 supplies a later use case. We will start with a memory estimate, inspect the selected runtime's catalog, create a worker-backed engine, stream text deltas, and release the resources we own. The complete code is [webllm.ts](../src/webllm.ts) and [webllm-worker.ts](../src/webllm-worker.ts).

The companion's fourth experiment separates a deterministic memory calculator from real model loading. The calculator runs without downloading weights. The load button explicitly starts a download for a model ID obtained from the installed WebLLM catalog. The generation button works only after an engine has loaded. This distinction prevents a successful numerical demo from being mistaken for successful GPU inference.

## Place WebLLM in the stack

WebLLM is an inference runtime with a TypeScript-facing API. It uses compiled model support and browser compute facilities to execute compatible language models. An OpenAI-style chat-completion interface makes the calling pattern familiar, but it does not imply identical provider behavior, supported parameters, model quality, or networking. In this course, the model computation remains on the device after required artifacts are available.

The official [WebLLM basic-usage guide](https://webllm.mlc.ai/docs/user/basic_usage.html) documents engine creation, message arrays, and streaming completion chunks. The [WebLLM systems paper](https://arxiv.org/html/2412.15803v1) explains the broader architecture involving browser execution and compilation. Treat historical performance results as measurements on their stated systems, not a speed promise for your laptop or every future model.

WebGPU provides access to GPU computation through a browser API. WebAssembly supports portable low-level code execution used by web runtimes and supporting components. Neither API is a ready-made model. WebLLM coordinates a particular model representation and compiled operations. The presence of WebAssembly in the stack does not establish that every WebLLM model has a supported CPU-only fallback.

Other libraries target different needs. Transformers.js provides task pipelines such as embeddings and classification, typically using ONNX Runtime Web. ONNX Runtime Web offers lower-level model execution and selectable backends. WebNN defines a neural-network acceleration API whose implementation support must be checked separately. Choose based on the model format, task, backend, deployment constraints, and measured behavior rather than assuming all “web AI” tools are interchangeable.

## Model artifacts form a compatibility unit

A model deployment needs more than weights. It may require tokenizer files, configuration, architecture-specific compiled code, tensor manifests, and runtime metadata. A weight shard is meaningful only when interpreted with the correct tensor shapes and computation. A tokenizer mismatch can produce valid-looking integer IDs with the wrong meanings. A compiled-library mismatch can fail before meaningful generation begins.

WebLLM's `prebuiltAppConfig.model_list` describes the catalog bundled with the installed package. The companion populates its dropdown from that catalog instead of maintaining a second handwritten list. This makes the available IDs traceable to the pinned runtime. It also avoids copying a shortened model name from a tutorial when the actual record includes quantization and compilation suffixes.

The package is pinned to 0.2.88 in this edition. That release's [official release record](https://github.com/mlc-ai/web-llm/releases) is part of the source baseline. Optional external model files are still downloaded at runtime and are not frozen merely by pinning the npm package. For a reproducible deployment, record the model repository revision, relevant artifact hashes, configuration, runtime version, and license as well.

Do not treat a model ID as an integrity hash. A remote repository can change while preserving a human-readable name. A controlled deployment can mirror authorized artifacts or pin immutable revisions where the runtime supports the required configuration. Keep provenance separate from the text displayed in a model selector. The educational companion intentionally exposes the catalog and reports this reproducibility limit.

## Estimate weights before clicking download

A parameter is one stored numerical value in the trained model. If a model has three billion parameters and each weight uses four bits in an ideal packed representation, the raw storage is `3,000,000,000 × 4 / 8` bytes, or 1.5 billion bytes. Dividing by `2^30` gives approximately 1.397 GiB. This is a lower-bound estimate for weights, not the model's total download or runtime memory.

Quantization stores values with fewer bits, often with additional scales, grouping, and metadata. A label such as four-bit weights therefore does not mean every byte in the deployment is exactly accounted for by the simple formula. Different quantization schemes can affect compatibility, speed, and accuracy. A smaller file can still require substantial working memory or perform poorly on a particular task.

Use explicit units. A decimal gigabyte is one billion bytes; a gibibyte is `2^30` bytes. Confusing them can produce misleading capacity claims. The project calculator reports GiB. Network download displays may use other conventions, and a browser's memory reporting may not expose the complete GPU allocation picture.

The following complete invocation calculates the course example:

```ts
import { memoryBudget } from '../src/core.ts';

const estimate = memoryBudget({
  parametersBillions: 3,
  bits: 4,
  layers: 28,
  kvHeads: 8,
  headDimension: 128,
  contextTokens: 4096,
  cacheBytes: 2
});

console.log(estimate);
// weightsGiB ≈ 1.39698; kvGiB = 0.4375
```

The architecture values are hypothetical calculator inputs. They are not a claim about every three-billion-parameter model or the selected catalog entry. Use the actual model configuration when estimating a real deployment. The function rejects nonpositive and nonfinite values so a mistaken input does not quietly produce a reassuring answer.

## Derive the KV-cache estimate

For each layer, each cached token stores keys and values. If the model uses `H` KV heads, each with `D` coordinates, that is `2 × H × D` stored values per token per layer. Multiply by the number of layers `L`, context tokens `T`, and bytes per cached value `B`. The resulting idealized byte count is `2 × L × H × D × T × B`.

For the example, `2 × 28 × 8 × 128 × 4096 × 2` equals 469,762,048 bytes, or 0.4375 GiB. Doubling context to 8192 doubles this estimate to 0.875 GiB. Quantizing weights from eight bits to four does not automatically halve a two-byte KV cache. The weight representation and cache representation are separate design choices.

Grouped-query and multi-query attention can use fewer KV heads than query heads. That is why the calculator asks for KV heads specifically. Using the total query-head count can overestimate memory for such architectures, while using the wrong cache precision can underestimate it. Some models use sliding windows or recurrent state that change the storage model, so this formula must be labeled as a simplified full-cache calculation.

Add weight and cache estimates only as a starting point. Runtime scratch buffers, compiled operations, temporary activations, allocator overhead, concurrent sessions, browser state, and driver behavior consume additional resources. A model that barely fits an arithmetic lower bound is a poor candidate for a robust product promise. Test on the lowest-supported device class with realistic context and other tabs open.

## Capability detection is the first gate

The wrapper checks whether `gpu` exists on `navigator`. That is a cheap feature-presence check, not proof that a suitable adapter, device feature set, memory budget, or model configuration is available. Model loading is the next real compatibility test. A browser can expose WebGPU and still fail to allocate the resources your chosen model needs.

WebGPU requires a secure context in supporting browsers. Localhost is commonly treated as trustworthy for development. Production should use HTTPS. Enterprise policy, graphics drivers, remote-desktop environments, device blocks, and browser settings can affect availability. The [WebGPU reference](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API) provides the platform context, but the application should detect actual capabilities rather than infer them from a browser logo.

Avoid promising that a user can solve every missing capability by enabling a flag. Flags are development controls and may disappear or change behavior. A production interface should offer a meaningful unavailable state and, if appropriate, an explicit alternate route. It should not silently send private content to a cloud service when GPU initialization fails.

A helpful error identifies the stage: API absent, model record unknown, download failed, compiled module failed, GPU initialization failed, or generation failed. Preserve a diagnostic category while avoiding sensitive prompt logging. A single “unsupported browser” message can hide a recoverable network problem or a model artifact mismatch that the user cannot fix by switching browsers.

## Put heavy work in an owned worker

A Web Worker runs JavaScript in a separate execution context and communicates through messages. It does not share direct access to the page's DOM. Moving orchestration and heavy runtime work off the main thread can protect interaction responsiveness, although GPU contention and memory use still affect the overall device. A worker is a concurrency mechanism, not a way to create more GPU memory.

The worker module is intentionally small:

```ts
import { WebWorkerMLCEngineHandler } from '@mlc-ai/web-llm';

const handler = new WebWorkerMLCEngineHandler();
self.onmessage = (event: MessageEvent) => {
  void handler.onmessage(event);
};
```

The handler implements the runtime's message protocol. The page creates a module worker using `new URL('./webllm-worker.ts', import.meta.url)`, allowing Vite to identify and build the worker entry. The caller then creates a worker-backed engine. See the [official worker guide](https://webllm.mlc.ai/docs/user/advanced_usage.html) for the API contract. Our wrapper adds application ownership and failure cleanup around it.

The worker belongs to the view that requested the engine. If creation fails, terminate it. If the user leaves while loading, a late-created engine must be disposed instead of attached to a different view. If the view is reset, release the loaded model and worker. A long-lived application might deliberately share an engine through a higher-level service, but then that service must own scheduling and final disposal.

## Create the engine in two conceptual stages

First choose an exact model record. Then initialize a runtime instance and load that record's artifacts. The convenience factory combines initialization and loading into an awaited operation. The progress callback reports the runtime's current loading status. It is useful user feedback, but it should not be interpreted as a universal estimate of remaining time.

This integration fragment comes from the included wrapper:

```ts
const worker = new Worker(
  new URL('./webllm-worker.ts', import.meta.url),
  { type: 'module' }
);

const engine = await CreateWebWorkerMLCEngine(worker, modelId, {
  initProgressCallback: progress => report(progress.text)
});
```

The surrounding file imports the factory, validates the catalog ID, and terminates the worker on failure. Copying only this fragment into a new project omits that ownership contract. Use the complete [webllm.ts](../src/webllm.ts) when reproducing the lab, or recreate its explicit success, failure, and cleanup paths.

The companion disables its load button while loading and requires reset before choosing another model. That is a deliberately simple scheduling policy. More advanced interfaces can support model switching, but they must coordinate unloading, pending requests, progress callbacks, and memory pressure. Starting several large loads at once because each returned a promise is unlikely to improve the user's experience.

## Generate with an explicit message contract

A chat-completion request contains role-labeled messages. The simplest request has one user message. A real conversation sends the intended history according to the runtime's contract. Do not assume the engine permanently knows every message ever displayed in your UI. The application's message store and the runtime's internal cache are related but different state.

The wrapper submits one user message, enables streaming, caps generated output at 256 tokens, and chooses a low numerical temperature supported by WebLLM. The selected engine determines the model; the request does not independently select an unrelated provider model. These choices make the lab small and bounded. They do not guarantee factual accuracy or identical output between devices and runtime versions.

Each chunk may contain text under `choices[0]?.delta.content`. Optional chaining handles chunks without an ordinary text delta. An empty delta is valid. A final usage record or finish indication should not be rendered as text. The wrapper appends only the delta content, so the UI accumulates a response rather than repeatedly replacing it with the latest chunk object.

```ts
const chunks = await engine.chat.completions.create({
  messages: [{ role: 'user', content: 'Explain one limit of local AI.' }],
  stream: true,
  max_tokens: 256,
  temperature: 0.2
});

let answer = '';
for await (const chunk of chunks) {
  answer += chunk.choices[0]?.delta.content ?? '';
}
console.log(answer);
```

This is an integration fragment requiring a loaded engine. It demonstrates the delta contract, not a separate complete application. The companion supplies engine creation, controls, output rendering, interruption, and teardown. Model wording is nondeterministic, so verification should check useful task properties rather than a single exact sentence unless the runtime supports and you have validated a deterministic configuration.

## Serialize access and understand interruption

The wrapper rejects a second generation while one is active. This keeps the lab's state machine explicit: idle, generating, or disposed. Real runtimes may queue or lock requests internally, but the product still needs a policy for what the user sees when multiple operations compete. Queuing invisible work can make a stop button appear ineffective.

`interruptGenerate()` requests that the runtime stop generation. It is distinct from aborting a fetch or destroying a native Chrome session. The wrapper exposes a stop method using this operation and resets its busy flag in `finally`. A partial answer remains partial; the interface should not label it as a complete verified response merely because the loop ended.

On disposal, the wrapper marks itself disposed, requests interruption, awaits unload, and terminates the worker in `finally`. Termination is the final ownership boundary for the worker. It does not guarantee immediate reclamation of every driver allocation at the exact JavaScript line, but it prevents the application from retaining an active worker it no longer intends to use.

Cancellation during model loading is less uniform than cancellation during generation. This edition does not claim a universally reliable download-abort API for WebLLM. Instead, the view suppresses stale updates and disposes a late result. That limitation is visible in the verification report. A production downloader may need a more explicit artifact-loading strategy and cancellation policy.

## Prefill and decode explain performance surprises

Inference commonly has a prompt-processing phase, called prefill, followed by incremental decoding. Prefill processes the supplied context and prepares the state used for generation. Decode repeatedly extends the output. A benchmark with a short prompt can look fast while a document assistant with several retrieved passages spends much longer before the first visible token.

These phases stress hardware differently. Exact behavior depends on architecture, kernels, batch shape, and runtime configuration. The practical lesson is to benchmark your actual prompt and output sizes rather than extrapolating from a greeting. A user waiting for the first answer experiences prefill even if your dashboard emphasizes decode throughput.

Context reuse can avoid some repeated work when a runtime recognizes a matching prefix, but it is not equivalent to persistent conversation storage or a universal cache shared across requests. Changing a system instruction or evidence order can invalidate reuse. Treat caching as an optimization whose correctness depends on identity and state, not as the source of conversational truth.

For retrieval applications, order and size evidence deliberately. Sending every passage in the database consumes context, increases prefill, and may distract the generator. Better retrieval can improve both latency and answer quality. This is a concrete example of system design mattering more than one model's headline speed.

## Download UX is part of the model feature

An explicit load action should tell the user that a download may be large and that device resources will be used. If reliable artifact-size metadata is available, show an estimate and label its unit. If it is unavailable, say so rather than inventing a precise progress forecast. Let users defer optional loading on a constrained connection.

Separate “files downloaded,” “runtime initialized,” and “ready to generate.” A progress callback can move through stages that are not linear in time. A percentage that reaches 100 while GPU compilation continues can be confusing unless the status explains the next stage. Do not repeatedly reset a generic progress bar without naming what is happening.

When a load fails, preserve the selected model ID and a readable diagnostic category. A retry may reuse already cached artifacts, but the app should not promise that it will. If the user chooses a smaller model, release resources from the previous attempt before starting another large allocation. Repeated failed loads can otherwise create a worse environment for recovery.

The companion's catalog is intentionally comprehensive for the installed package, so some entries will be unsuitable for a particular device. A polished product would curate a tested subset and explain its device requirements. Catalog presence is a developer capability record; it should not be presented to end users as a recommendation that every listed model will work well.

## Artifact hosting and integrity are operational concerns

Model files are software supply-chain inputs. A deployment should know which hosts serve them, whether the license permits its intended distribution, and how it detects unexpected changes. A local inference claim says where computation occurs, not that artifact downloads come from no external party.

If you mirror artifacts, preserve the configuration relationships and applicable notices. If you use a remote model repository, record immutable revisions where possible and verify that supporting compiled libraries match. A corrupted or mismatched shard can fail in a way that resembles a GPU problem. Clear provenance makes diagnosis easier.

Browser caching does not replace integrity planning. A cached file may be from an earlier version, while a configuration points to newer tensor metadata. Version artifact sets coherently and test upgrade and rollback paths. A useful deployment unit is a complete compatible model configuration, not one independently updated filename.

The book's ZIP contains the runtime source and built application dependencies needed for its companion, but no external model weights. This keeps the package portable and avoids implying redistribution rights for every catalog model. A learner chooses an optional model and accepts its download under the relevant model's terms and device constraints.

## Caches improve startup, not permanence

The first load can involve large downloads. Later loads may reuse cached artifacts, depending on runtime configuration and browser storage behavior. Storage can be cleared by the user, evicted by the browser, restricted in private contexts, or affected by quota. “Works offline” should therefore mean a tested scenario with the required application assets and model artifacts already available.

Separate application caching from model caching. Serving `dist/` locally makes the application files available; it does not automatically cache them as a progressive web app. Downloading model weights does not automatically preserve every supporting WASM or compiled module for future disconnected navigation. The companion is a served local app and does not claim a complete offline-installation service worker.

A production offline test should warm the exact model, reload under controlled disconnected conditions, run a representative prompt, and inspect all resource failures. Then test after clearing selected storage and after a version upgrade. Make the recovery experience understandable: show that a model must be downloaded again, estimate size where known, and let the user defer on a limited connection.

Local inference narrows one data boundary: prompt computation can happen on the device. It does not automatically make the entire application private. Analytics, crash reports, synchronized browser profiles, document uploads, and persisted conversation journals can still move or retain data. Audit the whole data flow before advertising privacy properties.

## Persistence is a separate feature

The current WebLLM documentation describes opt-in resumable text generation using origin-private storage, with journal and optional KV-checkpoint behavior. The baseline lab does not enable it. Persistence changes the privacy and lifecycle contract because the full prompt and generated state may outlive the page. Recovery also depends on compatible model artifacts, not merely a matching display name.

If you explore this advanced feature, read the [resumable-generation contract](https://webllm.mlc.ai/docs/user/resumable_generation.html), record the runtime version, and test crash recovery separately from ordinary interruption. That document identifies scope restrictions and durability limits. Do not promise protection against every browser eviction, operating-system crash, or power failure. Provide a clear deletion and retention policy for saved sessions.

For many writing-helper use cases, ephemeral sessions are a better starting point. The application can let the user save the final draft deliberately without storing the entire generation journal. Persistence is valuable when recovery matters, but it should be selected for a product need rather than enabled because the API exists.

## Benchmark cold, warm, and interactive behavior

Measure cold startup from the user's load action to a ready engine, including downloads. Measure warm startup with relevant artifacts cached. Measure time to first visible output and total generation time separately. A long prefill can dominate a large prompt even when token generation is fast. A high tokens-per-second number does not describe the first-use experience.

Record model identity, quantization, context length, output length, runtime version, device class, browser version, and power conditions. Running on battery with thermal throttling can differ from a plugged-in benchmark. Repeat enough times to see variation, and report distributions rather than a single favorable measurement. Do not compare a tiny prompt on one model with a long retrieved context on another as if they were the same workload.

Also inspect interaction: can the user scroll, change views, cancel, and recover after failure? A worker can reduce main-thread work while large GPU tasks still affect rendering. Test with realistic document sizes and competing tabs. A model that fits only on the developer's workstation may be an optional enhancement rather than the default route for the entire audience.

Memory failures deserve particular attention because they can appear after successful initialization as context grows. Test maximum supported prompt and output combinations. Reserve capacity for application work. A runtime's advertised model list is a catalog of supported configurations, not a certification that every entry fits every WebGPU device.

## Keep a device observation log

For each real-model run, record the chosen catalog ID, browser version, whether the load was cold or warm, approximate context size, and observed outcome. Keep prompts synthetic. This small record is more useful than remembering that a model “worked once,” because it preserves the conditions under which the result was observed.

## Diagnose the right failure

If the dropdown lacks a model you expected, inspect the installed catalog and package version. If a download fails, inspect artifact URLs, network policy, and storage before changing sampling parameters. If a compiled module fails, check model-library compatibility. If generation is incoherent immediately, inspect tokenizer/configuration consistency and the message template before assuming your prompt is at fault.

If the page freezes, inspect main-thread work and rendering cadence as well as the model runtime. If memory fails after several view changes, check whether workers and models are being retained. If a stopped response continues appearing in a new chapter, check stale-callback guards. These are application bugs around inference, and a different model will not reliably repair them.

As an optional application, use the calculator to compare doubled context and doubled parameter count, then load only a model appropriate to your device. Generate a short answer, interrupt it, reset the view, and inspect the status. Record what actually happened rather than assuming the download succeeded because a progress bar moved. The next chapter changes model ownership: Chrome manages the model, while our application manages capability negotiation, task selection, and session lifecycle.
