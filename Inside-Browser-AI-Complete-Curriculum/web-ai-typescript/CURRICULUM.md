# Curriculum: LLMs and the modern web AI ecosystem

**Audience:** developers with basic variables/functions. **Language:** TypeScript throughout examples. **Outcome:** design, implement, evaluate and debug a browser-AI application with explicit evidence, data and action boundaries. **Suggested pace:** about 100–140 hours including optional applications; this is an estimate, not a completion requirement.

The chapter files are the full lessons, not outlines. Each teaches prerequisites locally, works examples, explains code, diagnoses failures and connects to the runnable companion. The same canonical chapters form [book.md](book.md).

| Order and full lesson | Target ability | Companion behavior | Suggested time |
| --- | --- | --- | --- |
| [1. Models, tokens and attention](chapters/01-models-tokens-attention.md) | Explain next-token prediction, training/inference, embeddings, attention, context, sampling, hallucinations and runtime choices | Real softmax and toy attention arithmetic; no LLM | 10–14 h |
| [2. TypeScript and streaming architecture](chapters/02-typescript-streaming-architecture.md) | Validate unknown data, handle promises/streams/UTF-8, protect keys, cancel work and route explicitly | Routing policy and local NDJSON fixture; no LLM | 12–18 h |
| [3. Retrieval and grounding](chapters/03-retrieval-embeddings-grounding.md) | Build lexical retrieval, understand cosine/embeddings, preserve permissions/provenance, construct evidence prompts | Deterministic retrieval plus optional actual embedding pipeline | 14–18 h |
| [4. WebLLM and browser compute](chapters/04-webllm-browser-compute.md) | Select compatible artifacts, budget weights/KV memory, own a worker engine, stream/interrupt/dispose, diagnose caches | Memory calculation plus optional real WebGPU model | 14–20 h |
| [5. Chrome built-in AI](chapters/05-chrome-built-in-ai.md) | Negotiate capability/activation; use Prompt, Summarizer, Translator, Detector, Writer, Rewriter, Proofreader | Native capability panel and optional native task calls | 12–18 h |
| [6. WebMCP and agents](chapters/06-webmcp-agents-tools.md) | Distinguish MCP/WebMCP/inference, expose validated tools/forms, manage lifetime, bound planning and authority | Direct function, native registration/discovery/execution, declarative form | 14–18 h |
| [7. Evaluation and production](chapters/07-evaluation-security-production.md) | Design evaluations, interpret metrics, budget latency/cost, enforce policy, package and report evidence | Deterministic retrieval evaluation and routing checks | 12–16 h |
| [8. Integrated capstone](chapters/08-capstone-modern-ecosystem.md) | Trace the full assistant, choose routes, connect evidence, reason about quantization/adaptation/multimodality | Evidence inspector, optional native answer and explicit optional cloud answer | 14–18 h |

## Dependency sequence

Variables/arrays/functions → token probabilities and vectors → async TypeScript and trust boundaries → evidence retrieval → local/native inference → structured agent operations → evaluation → integrated assistant. WebLLM and Chrome can be studied in either order after chapter 3; WebMCP reuses the validated search operation.

## Suggested teaching sessions

1. Read chapter 1 in two sessions: prediction and representations, then training/context/ecosystem. Run the foundations CLI and numerical lab.
2. Read chapter 2 in two or three sessions: TypeScript validation; HTTP and secrets; streaming/cancellation. Run the fixture before configuring any provider.
3. Read chapter 3 in two sessions: lexical retrieval and access, then embeddings/grounding/evaluation. Compare exact terms with paraphrases.
4. Read chapter 4 in two sessions: artifact/memory planning, then engine lifecycle and performance. Real-model loading is optional and device-dependent.
5. Read chapter 5 in two sessions: capability/session mechanics, then task-specific behaviors. Record observed availability rather than assuming support.
6. Read chapter 6 in two sessions: tool/form contracts, then agent budgets and consequential-action design. Native WebMCP is optional; direct domain tests always run.
7. Read chapter 7 in two sessions: quality/latency metrics, then privacy/security/deployment. Review the supplied verification report critically.
8. Read chapter 8 while tracing the source. Try evidence-only mode first, then one supported generator, then evaluate a few synthetic questions.

## Optional project applications and acceptance

See [PROJECTS.md](projects/PROJECTS.md) for six guided projects with complete baseline source and run paths. Acceptance is behavior-based: arithmetic matches known values, streams preserve UTF-8, retrieval excludes private fixtures, resources have owners, native absence is explicit, and tools cannot dispatch unsupported actions. No quiz or active-recall gate is required.

## Scope and research

This is a complete application-oriented course, not an exhaustive survey of every model or a frontier pretraining implementation. It includes conceptual training, adaptation, distillation, quantization, model-architecture variations and multimodal design, with runnable count-based training and quantization examples. The [38-record source ledger](research/SOURCES.md) distinguishes inspected sections from indexes and papers read only in part. The [API baseline](research/API-BASELINE.md) is dated; consult it before upgrading.
