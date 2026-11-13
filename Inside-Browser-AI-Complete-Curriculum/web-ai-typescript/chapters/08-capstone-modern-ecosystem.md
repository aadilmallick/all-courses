# 8. Assemble the document assistant and choose its next evolution

The final problem is integrating the pieces into a useful application without losing the boundaries that made each piece understandable. Our capstone is a small document assistant for browser-AI course notes. It retrieves permitted passages, shows the exact evidence prompt, optionally generates a local or explicitly approved cloud answer, and exposes the same search logic through an experimental WebMCP interface.

This is a finished educational application, with a deliberately small synthetic collection. It is not a hosted service, an enterprise document connector, or an unrestricted autonomous agent. Those limits are part of the design: the application can demonstrate inference and tool boundaries without requiring private documents, paid credentials, or irreversible actions just to learn the architecture.

The prerequisites are all earlier chapters. The companion's eighth experiment is the integrated evidence-and-answer view. Chapter 4 supplies a separate real WebLLM generation lab, chapter 5 supplies native task APIs, and chapter 6 supplies native and declarative search tools. Together they form one runnable laboratory with shared data and reusable TypeScript source.

## Begin with the user journey

The user enters a question about local browser AI. The application retrieves public passages. Before invoking a model, it can display the question and evidence bundle in a deterministic prompt. The user can stop there and inspect the source material. This baseline remains useful when no local model capability exists.

If the user chooses native Chrome generation, the app creates an ephemeral native session and submits the grounded prompt. The session is destroyed afterward. If the user explicitly enables the configured cloud route and has not marked the input sensitive, the app sends the same prepared prompt to the local teaching server, which invokes the configured remote model. No failed local operation silently changes this route.

The generated answer is displayed as text. The user must inspect claims against evidence. The current capstone does not automatically certify citation semantics, save conversations, or send the answer to another person. These are meaningful product choices rather than unfinished promises: the delivered app's scope is evidence-backed drafting and experimentation.

The same course-note search is available through the WebMCP lab. A compatible browser agent could use that read-only tool under its host's integration. The app itself does not claim to include a universally available external agent. The native discovery/execution controls let you test the browser path separately when the experimental feature is present.

## Trace one question through the system

Take “What must I do before using a local model offline?” The retriever lowercases and extracts terms, filters to public passages, scores lexical overlap, and returns the highest-ranked matches. The download note contains the relevant facts: an initial model download is required, cached files may be evicted, and disconnected behavior should be tested after warmup.

The evidence bundle contains source IDs, titles, and text. `groundedPrompt` serializes that bundle with the question and adds instructions about evidence use, citation IDs, and abstention. The prompt is visible before generation. If the user notices an irrelevant passage or a missing exception, the problem can be diagnosed at this point without blaming the model.

The chosen generator receives only that prompt. A correct answer should preserve both the initial-download requirement and the conditional nature of offline availability. It should avoid promising that every browser or cache state works. If the output cites an unknown ID, reference integrity failed. If it cites the download note but claims permanence, semantic support failed.

This trace identifies distinct states: input accepted, retrieval completed, evidence prepared, generation started, answer received, and answer reviewed. A production product can represent these states explicitly rather than relying on one spinning “AI” indicator. Each state also suggests what to log, what to test, and what a user can do after failure.

## Keep the core pipeline small

The capstone's core sequence is short because the earlier modules own their respective concerns. The following complete project example prepares evidence without invoking a model:

```ts
import { groundedPrompt, passages, retrieve } from '../src/core.ts';

const question = 'What must happen before offline model use?';
const hits = retrieve(question, passages, 'public', 3);

if (hits.length === 0) {
  console.log('No supporting passages found.');
} else {
  const evidence = hits.map(hit => hit.passage);
  console.log('Selected source IDs:', evidence.map(item => item.id));
  console.log(groundedPrompt(question, evidence));
}
```

The retriever does ranking and filtering. The prompt builder formats evidence. A generator adapter performs inference. The UI coordinates the user's chosen action and renders status. This division makes it possible to replace a lexical retriever with semantic search without rewriting native model lifecycle code, or replace a generator without changing source permissions.

Avoid a universal abstraction that hides every difference between backends. WebLLM has an engine and worker lifecycle. Native Chrome has browser-managed sessions and transient-activation constraints. A remote service has network, credential, rate-limit, and data-transfer concerns. A shared “generate” interface can normalize the result while still exposing capabilities and lifecycle requirements to its owner.

## Explain the backend decision to the user

For the native route, the button says native Chrome and warns that provisioning may download a model. For the cloud route, the checkbox names the configured remote service and the fact that the question and evidence are transferred. The sensitive-input control blocks that educational cloud path. The underlying server also requires the explicit consent field before making the optional provider call.

This is a teaching consent mechanism, not an authoritative enterprise classification system. A production server cannot trust a client to label restricted documents honestly. It must enforce trusted document and organizational policies. The course separates this limitation from the useful interaction pattern: make a changed data boundary visible and intentional.

When capability is absent, preserve the question and evidence view. Offer a specific explanation rather than a blank result. Do not label deterministic retrieval as an AI-generated answer. Do not label a transport fixture as a model response. Clear provenance of the operation is as important as provenance of the source text.

If a future product allows a user-selected default route, store that preference deliberately and provide a way to inspect or change it. A preference for one task or document class should not automatically authorize every future transfer. Route policy can depend on document sensitivity, task type, model capability, and current device state.

## Add WebLLM as a generator without hiding its ownership

The delivered laboratory already loads and runs WebLLM in chapter 4. To use that engine with retrieved evidence, pass the prepared prompt to its `generate` method and accumulate deltas. Keep the loaded engine in an application owner that survives the question form but is released when the user unloads the model or leaves the application.

The following integration fragment uses the included wrapper and must be called from an interface that explicitly starts a model download:

```ts
import { loadLocal } from '../src/webllm.ts';
import { groundedPrompt, passages, retrieve } from '../src/core.ts';

const engine = await loadLocal(selectedCatalogId, console.log);
try {
  const evidence = retrieve(question, passages, 'public')
    .map(hit => hit.passage);
  if (evidence.length === 0) throw new Error('No evidence.');
  await engine.generate(groundedPrompt(question, evidence), delta => {
    resultView.append(document.createTextNode(delta));
  });
} finally {
  await engine.dispose();
}
```

The surrounding interface supplies `selectedCatalogId`, `question`, and `resultView`; this is intentionally a labeled integration fragment. The complete engine-loading interface already exists in the companion. The fragment demonstrates composition rather than claiming a second hidden finished UI. A repeated-question product would usually retain the engine between questions instead of unloading after every answer, while preserving explicit ownership.

The context budget now includes retrieved passages, not just a short prompt. Revisit memory estimates and latency with realistic evidence size. A model that generates a one-sentence greeting successfully may fail with a long document bundle. Evaluate the actual workload the capstone creates.

## Use structured state for drafts and actions

If you extend the assistant to draft a support reply, keep the draft separate from the original question and source documents. Store a draft ID, text, source IDs, selected backend, and generation status. A user edit should be preserved independently of a later regeneration. Avoid overwriting the user's work when an older async request finishes.

If you add sending, create a separate operation with a separate authorization and confirmation path. The generator should produce a draft, not silently invoke a send endpoint. Bind the reviewed recipient, subject, and body to the action that is committed. The prepare-review-commit pattern from chapter 6 applies here.

A workflow can remain deterministic around the model. For example: retrieve notes, generate a draft, validate source IDs, show a preview, and wait for user acceptance. This is often easier to reason about than an open-ended agent deciding when to search, rewrite, send, retry, and stop. Add autonomy only where it solves a demonstrated user problem.

For accessibility, make state changes visible and announce important transitions. Preserve focus when a result appears. Let users copy the answer without copying hidden diagnostic text. Keep the original evidence accessible during review rather than replacing the whole page with a polished but unsupported response.

## Learn training with a count-based baseline

The browser libraries in this course perform inference. To make the training boundary concrete, the included [bigram.ts](../examples/bigram.ts) builds a tiny count-based language model from four synthetic sentences. A bigram model predicts the next word using only the current word. It is much simpler than a transformer, which is exactly why its learned state is easy to inspect.

Training walks adjacent word pairs and increments counts. After the word “models,” the fixture has seen “need” twice and “keep” once. Normalizing that row gives probabilities `2/3` and `1/3`. Generation samples from the row, appends a word, then uses the new word to select another row. Start and end markers define sentence boundaries.

Run `node examples/bigram.ts`. It prints the learned counts and a seeded generated sentence. The seed makes this fixture repeatable. Changing the training sentences changes the count table. Merely asking it a different question does not change the table. This demonstrates training versus inference without pretending to implement neural optimization.

The baseline's limitations are instructive. It remembers only one word of context, cannot represent unseen transitions, and can recombine familiar fragments without understanding their truth. A transformer has a much richer representation and training process, but the broad distinction remains: learned parameters or statistics determine behavior, while an inference request supplies current context.

## Understand what quantization changes

The included [quantization.ts](../examples/quantization.ts) demonstrates symmetric int8 quantization on a short vector. It finds the largest absolute value, divides that magnitude by 127 to get a scale, rounds scaled values into an integer range, and reconstructs approximate values by multiplying by the scale. The maximum reconstruction error is printed.

For the vector `[-1, -0.1, 0, 0.5, 1]`, the scale is `1/127`. Values near the grid points reconstruct closely; others incur rounding error. Zero is preserved exactly in this symmetric example. Real model formats may use groups, zero points, mixed precision, specialized packing, and different calibration methods. This toy function does not convert an arbitrary model into a valid WebLLM artifact.

Quantization can reduce storage and bandwidth, but its effect on speed depends on available kernels and hardware. A format that is smaller on disk can require dequantization work. Accuracy changes depend on the model and task. Evaluate on your own rubric rather than assuming all four-bit or eight-bit models behave alike.

The memory chapter's bit calculation is therefore a useful idealization, while the quantization example shows why metadata and approximation exist. The two explanations reinforce each other: fewer representable values create a storage benefit and a numerical tradeoff. Deployment compatibility adds another constraint beyond that arithmetic.

## Fine-tuning, LoRA, and retrieval solve different problems

Imagine the assistant consistently uses the wrong tone despite good evidence. A better prompt or task API may be enough. If the behavior is repeated at scale and you have suitable examples, supervised adaptation may be relevant. If the assistant lacks a new policy fact, updating retrieval is often a more direct response than retraining a model.

LoRA represents selected weight updates through low-rank factors. For an illustrative 4096-by-4096 matrix, a full update has 16,777,216 values. Two rank-8 factors have `4096×8 + 8×4096 = 65,536` values, before considering other parameters and scaling. That is a parameter-count illustration, not a guarantee of proportional training speed or equal quality.

Deploying an adapted model still requires a supported artifact path. Some runtimes merge adapters into weights; others support separate adapters under particular constraints. This course does not claim arbitrary LoRA loading in the pinned WebLLM configuration. Check the runtime's supported model-compilation path, model license, and evaluation requirements before choosing an adaptation strategy.

Distillation trains a smaller model to reproduce aspects of a larger model's behavior using suitable training signals. It can support device deployment, but it introduces data, quality, and licensing considerations. A smaller distilled model is not automatically equivalent to its teacher, especially on rare, multilingual, or reasoning-heavy tasks. Evaluate the actual task distribution.

## Recognize architectural variations without overfitting the app

Not every modern model is a dense decoder with exactly the same cache layout. Mixture-of-experts models route computation through subsets of parameters, which can change the relationship between total parameter count and per-token compute. The total model artifacts can still be large. Do not estimate device fit from active-parameter marketing alone.

Grouped-query attention changes KV storage relative to query-head count, as chapter 4 explained. Sliding-window attention limits some attention ranges. Recurrent or hybrid architectures may maintain state beyond a conventional full KV cache. These differences matter when selecting compiled model support and estimating memory, even if the frontend still sends a message array.

Positional methods also vary. The original transformer used explicit positional encodings; many later decoder models use other methods, including rotary representations. You do not need to implement each method to build a web application, but you must keep the compiled architecture and configuration compatible with the weights. Treating model files as interchangeable numerical blobs is the practical mistake to avoid.

Reasoning-oriented models may allocate more generation work before a final answer, affecting latency and output budgeting. Some APIs expose a qualitative reasoning control, others do not. Preserve backend-specific capability information and do not fabricate one universal parameter. Evaluate final task success and resource usage rather than assuming a model's label guarantees better reasoning.

## Place multimodal applications in the same architecture

A document assistant can grow into an image-caption helper, audio-note organizer, or screenshot explainer. The pipeline still needs input selection, preprocessing, capability negotiation, inference, validation, and rendering. The data types change, and the privacy surface often grows because media can contain more information than the user's explicit question.

For an image, preserve the original, show the selected crop or frame, and communicate any resizing. For audio, distinguish recording permission from permission to upload. For a transcription, preserve speaker uncertainty and let the user correct names or technical vocabulary. A plausible transcript can contain meaningful errors even when the audio API executed successfully.

Use a runtime and model that support the intended modality. Transformers.js offers task pipelines across several modalities, while WebLLM's current advanced documentation contains experimental model-manifest paths with specific constraints. Chrome's Prompt API has its own supported input types and hardware requirements. These are separate contracts, not evidence that every model can consume every `Blob`.

An optional multimodal extension should remain a complete small workflow. For example, let the user choose one image, invoke a supported local caption path, show the draft caption and original, and allow editing. Do not add microphone and camera permissions merely because they are technically available. The input should serve the user's task.

## Choose the right level of ecosystem tooling

Application frameworks and AI SDKs can normalize streaming, tool definitions, structured output, and provider adapters. They can save substantial repetitive work. They can also hide important differences or change rapidly. Before adopting one, identify which boundary it owns and verify the exact supported version against official documentation.

For this course, direct runtime and browser calls keep the mechanics visible. A future React, Vue, Angular, or server-framework adaptation can preserve the same core functions. Put retrieval, parsers, route policy, and evaluation logic in framework-independent modules. Let components own display and lifecycle rather than burying authorization in rendering code.

An orchestration library does not replace an authenticated backend, an evidence corpus, or a test set. A vector database does not create relevant chunks automatically. A tracing dashboard does not make collected data appropriate to retain. A protocol adapter does not grant permission to invoke every connected tool. These tools are valuable when matched to a specific engineering need.

Keep an upgrade record. Name the package version, browser baseline, API surface used, and tests that depend on it. When an API changes, update code, prose, fixtures, and verification together. A textbook with current prose and obsolete code is especially confusing because the learner cannot tell whether their understanding or the example is wrong.

## A practical project sequence

The [project guide](../projects/PROJECTS.md) maps six optional applications to the delivered modules. The first is the deterministic sampling and attention laboratory. The second is the streaming boundary with its UTF-8 fixture. The third is the evidence inspector with lexical and semantic ranking. The fourth is the local-model writing workbench. The fifth is the native Chrome task desk. The sixth is the integrated document assistant with read-only agent tools.

These are optional application activities, not mandatory quizzes. Each has a concrete outcome, relevant source files, run path, expected behavior, and a verification checklist tied to the operation. Extension ideas are labeled as extensions rather than being counted as completed software. The delivered code supports the baseline project behaviors described in the guide.

If you want one portfolio project, begin with the document assistant and choose a narrow public collection you are permitted to use. Preserve source provenance, replace the fixture ingestion deliberately, add a representative evaluation set, and test one deployment route thoroughly. A coherent small product is more informative than a list of disconnected model demos.

If you want deeper model understanding, run the count-based training and quantization examples, then study a tiny neural model in a separate learning project. Keep the browser application course's scope clear: it teaches practical LLM systems and deployment, not a full implementation of frontier-model pretraining infrastructure.

## Use coding assistants as reviewers of concrete contracts

An AI coding assistant can help extend the project, but give it a bounded task and a way to verify the result. Specify the existing files, the user-visible behavior, constraints, and required checks. Ask it to inspect the pinned interfaces rather than assume an API from memory. Review its changes as ordinary software.

The following reusable prompt is suitable for Codex or Claude; it is a prompt for a future task, not an action already performed:

> Extend the TypeScript document assistant with claim-level citation validation. Inspect the existing core and UI first. Preserve local/cloud route consent and tenant filtering. Add a parser for structured claims containing text and source IDs, reject unknown IDs, and show each claim beside its source excerpts. Do not claim semantic truth from ID validation. Run type checking and meaningful parser tests, then report executed checks and remaining model-dependent limits.

Another bounded prompt focuses on browser compatibility:

> Audit the native Chrome AI adapter against the project's dated API baseline and current official documentation. Identify unsupported assumptions before editing. Preserve feature detection, user-activation timing, explicit model-download actions, and session cleanup. Update code, source provenance, and affected teaching text together. Distinguish documentation inspection, static checks, simulated absence tests, and native inference actually observed.

These prompts are useful because they name the contracts that must survive. A vague request to “make the AI smarter” gives neither the assistant nor the reviewer a clear acceptance condition. Use an assistant to accelerate concrete engineering while keeping responsibility for authority, data movement, and release evidence in the application design.

## Read the research appendix as an update mechanism

The [research synthesis](../research/RESEARCH.md) distinguishes stable concepts from changing implementation facts. The [source ledger](../research/SOURCES.md) records inspected pages and their coverage. The API baseline names the exact methods and experimental assumptions used by this edition. Together they make future revision possible without pretending the ecosystem is static.

When revisiting the course, check runtime releases, browser status, model-artifact compatibility, native task interfaces, and WebMCP draft changes first. Then rerun the software checks and representative native experiments on the target environment. Do not update a version number alone and assume compatibility follows.

The important conceptual relationships are more durable: generation predicts, retrieval selects evidence, tools expose operations, validation checks data, and authorization controls actions. Keeping these boundaries visible makes it easier to adopt new APIs without rebuilding your understanding from scratch. The capstone is designed around those relationships so the learning remains useful after this particular research snapshot ages.

## A decision record for the capstone

The capstone uses a small synthetic corpus so source permission and expected results are inspectable. It uses lexical retrieval as a deterministic baseline and offers semantic ranking as a separately disclosed optional download. This makes it possible to learn retrieval mechanics before introducing model artifacts or approximate similarity behavior.

Native Chrome generation is ephemeral so each answer is tied to the visible evidence bundle. The cloud route is explicit and server-mediated so credentials remain outside the browser and the data transfer is visible. WebLLM is isolated in its own loading laboratory because engine ownership, memory, and download behavior deserve direct attention rather than being hidden behind a generic button.

Read-only WebMCP search demonstrates shared domain logic without introducing external side effects. The bounded planner fixture demonstrates dispatch mechanics without pretending an LLM planned the action. The test suite focuses on deterministic boundaries that can be verified reliably, while the report separately names unexecuted native-model and hardware paths.

These decisions are not universal prescriptions. A different audience might need a curated default local model, a supported cloud backend, persistent drafts, or a larger authorized corpus. The important habit is to explain why each choice serves the user, what tradeoff it creates, and what evidence would justify changing it.

## Move from a learning fixture to a real collection

Replace synthetic notes through an ingestion boundary, not by pasting private files into source code. Decide which file types are supported, how text is extracted, which metadata is retained, and where permission checks occur. Keep original documents available for citation review and record extraction failures instead of silently dropping sections.

Add a lifecycle for updates and deletion, then build an evaluation set from the collection's actual questions. Start with a small authorized subset and inspect retrieval results manually. Only after that baseline is understood should you add larger indexes, rerankers, or agent planning. Scaling a poorly understood retrieval pipeline often makes its failures harder to diagnose.

Finally, revisit the data-flow diagram with the real collection. Identify every place text, vectors, drafts, logs, and model artifacts are stored or transferred. A system that was harmless with synthetic course notes can carry meaningful obligations with employee records or customer conversations. The architecture gives you places to enforce policy, but those places must be connected to trusted identities and real operational controls.

## Preserve the learning edition

Before experimenting with upgrades, keep the original archive and checksum. A known edition gives you a reference when a dependency or browser changes. Record your modifications beside observed results so a later failure can be traced to a concrete difference rather than guessed from memory.

## A complete path through the delivered edition

Read the chapters in order on a first pass. Run the deterministic examples before optional downloads. Use the research appendix when you need to verify a version-sensitive detail. Try a native or WebLLM model only when the device and browser support it and you are comfortable with the disclosed download. Use synthetic text while learning failure behavior.

Then inspect the capstone's evidence prompt, generate through one chosen route, and verify every claim against the supplied passages. Reset, navigate, cancel, and test an unsupported question. Finally compare the observed behavior with the verification report's limits. You will have practiced the full engineering loop: understand a model, define a boundary, build a useful workflow, measure it honestly, and decide what evidence is still needed before expanding its authority.
