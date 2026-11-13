# 7. Decide whether the system is dependable enough to ship

A demonstration answers one question successfully. A product must answer many kinds of questions, fail coherently, respect data boundaries, remain usable on supported devices, and stay within resource budgets. The central problem of this chapter is turning observed behavior into evidence for a release decision. We will distinguish software correctness, retrieval quality, model quality, platform compatibility, and operational reliability.

The prerequisites are the complete application pipeline from the earlier chapters. We have a deterministic retriever, optional local and remote generators, native browser APIs, and a read-only tool interface. That separation gives us useful test seams. We can test a parser without a model, evaluate retrieval without generation, and inspect an agent dispatcher without asking an LLM to plan.

The companion's seventh experiment runs a small deterministic retrieval evaluation and reports a latency statistic. The automated checks in [core.test.ts](../tests/core.test.ts) challenge numerical invariants, stream framing, authorization filters, routing policy, and bounded agent behavior. The [verification report](../verification.md) distinguishes those executed checks from native model or GPU inference that was not exercised.

## Define success as an observable contract

Name the unit of evaluation before calculating a score: a request, passage, claim, action, or complete user journey. Different units can produce very different percentages from the same underlying run. Preserve enough per-case detail to explain the aggregate rather than letting one number conceal the failure that matters.

“The AI is good” is too vague to test. “For public course-note questions, the retriever returns the expected source in the first three results and never returns a private-tenant passage” is observable. “Every answer cites only supplied IDs and exposes unsupported questions” is another contract, though semantic support requires a deeper check than identifier validity.

Separate product outcomes from implementation activity. A model generating text proves generation occurred. It does not prove the answer helped the user. A WebMCP callback firing proves an invocation path worked. It does not prove that an external agent chose the right action. A TypeScript build passing proves certain static constraints, not that a browser GPU loaded a model.

Write acceptance criteria before tuning. Include positive cases, negative cases, boundary conditions, and unavailable states. For a writing helper, preserve dates and quantities. For a document assistant, test evidence support and abstention. For an agent tool, test unauthorized targets and unsupported operation names. For local inference, test startup, memory pressure, interruption, and teardown.

The quality target should match the consequence of failure. A playful brainstorming widget and an account-management action need different evidence. This course's capstone is an educational document assistant with explicit limitations. It does not claim to be a certified system for consequential decisions merely because its architecture includes validators and citations.

## Use a layered evaluation model

At the numerical layer, test known results and invariants. Softmax probabilities should be nonnegative and sum approximately to one. Shifting every logit by the same constant should preserve the distribution. Cosine of a nonzero vector with itself should be approximately one. The memory calculator should scale linearly with the relevant input under its stated simplified formula.

At the transport layer, test arbitrary byte splits, multiple records per chunk, missing final newlines, oversized records, malformed JSON, early cancellation, and multibyte characters. These are deterministic software properties. They do not require a model, paid credentials, or a GPU, so they should remain inexpensive and repeatable.

At the retrieval layer, test relevance, permission filtering, empty results, exact identifiers, paraphrases, conflicting sources, and updates. At the generation layer, hold evidence fixed and evaluate factual support, completeness, formatting, and abstention. At the full-system layer, combine realistic user journeys with latency, failure handling, and data-flow checks.

Finally, test platform behavior in actual target environments. A browser build can succeed on a machine where no supported GPU exists. Native Chrome constructors may be absent in a generic test browser. An origin trial can require a participating origin. Record these as explicit coverage gaps rather than filling them with simulated success.

## Design a useful evaluation set

Start with questions that represent actual tasks, using synthetic or appropriately authorized data. Include easy and difficult cases, but do not let easy wording dominate. A document assistant should see paraphrases, short ambiguous queries, questions requiring two sources, requests outside the collection, and attempts to access another tenant's material.

Label what is relevant and what a satisfactory answer must preserve. For a download question, the answer may need both initial provisioning and possible cache eviction. A single expected sentence is often too brittle because several phrasings can be correct. Use a rubric with concrete required facts and forbidden unsupported claims.

Keep development examples separate from a held-out evaluation set. Repeatedly adjusting a prompt until it passes the same ten questions can overfit the prompt to those questions. Version the dataset and record why cases were added. A regression case should preserve a meaningful failure mode, not just memorialize one exact random model response.

Include adversarial content relevant to the product. A source passage can contain instructions to ignore the user, reveal other documents, or invoke an unrelated tool. The expected outcome is defined by application authority: unauthorized data remains unavailable and unsupported actions remain blocked even if the model becomes confused. Evaluate both model behavior and the external enforcement boundary.

## Compute metrics with clear denominators

Accuracy is the number of passing cases divided by the total cases under a defined criterion. If 18 of 20 retrieval questions place the expected source first, top-1 accuracy is 0.9. That does not mean 90 percent of every generated answer is correct. The metric's unit is a question-level ranking outcome.

Precision measures the fraction of returned items that are relevant. Recall measures the fraction of relevant items that were returned. If a question has two relevant passages and your top-three list contains one of them plus two irrelevant passages, precision at three is `1/3`, while recall at three is `1/2`. Both numbers describe the same result from different perspectives.

For abstention, measure both missed answers and unsupported answers. A system that always says “I don't know” may avoid hallucinated claims while being useless. A system that always answers may appear helpful while inventing facts. Report the tradeoff on answerable and unanswerable subsets rather than collapsing everything into a single attractive percentage.

The companion's tiny fixture uses top-1 accuracy with one expected source per question. It is intentionally too small to estimate production quality. Its purpose is to demonstrate the measurement path and provide a stable software regression signal. A full evaluation must reflect the real collection, audience, languages, and task distribution.

## Model judges are fallible evaluators

An LLM can help score answers against a rubric, identify possible unsupported claims, or compare alternative drafts. It can also miss errors, prefer verbose answers, be influenced by formatting, or follow instructions embedded in the answer being judged. Treat model judging as a measurement process that needs validation.

Use clear rubrics, blind comparisons where practical, and a sample checked by humans. Measure agreement and investigate disagreements. If the same model family both generates and judges, correlated mistakes can hide problems. A judge's score should not be presented as a proof of truth or a substitute for deterministic checks available in the domain.

For arithmetic or record existence, use the authoritative calculator or database. For citation IDs, use a set-membership validator. For source support, a model judge can flag candidates for review, but important conclusions may still need a human inspecting the passage. Match the evaluator to the property being measured.

Do not send private evaluation data to a remote judge without the same data-policy analysis used for generation. Evaluation is still processing. Logs, benchmark exports, and screenshots can disclose sensitive content even when the production model runs locally.

## Measure latency as several experiences

Users experience download time, initialization time, input preparation, retrieval, model prefill, first visible output, and total completion. These stages can overlap or dominate differently. A local model with fast warm generation may have a poor first-use experience. A remote service may have variable network and queueing delays.

Time to first visible output describes responsiveness after a request starts. Total completion describes how long the user waits for the full result. Tokens per second describes one generation-rate dimension under a particular measurement. None alone captures the whole task. For a document assistant, source retrieval and rendering can also be material.

Use a monotonic timer such as `performance.now()` for durations within one execution environment. Wall-clock timestamps are useful for logs but can jump due to clock adjustments. Record the start and end boundaries consistently. A benchmark that excludes downloads should say warm inference rather than implying first-use latency.

The included percentile helper uses the nearest-rank convention. For sorted durations `[100, 200, 300, 400]` milliseconds and fraction 0.95, the selected index is `ceil(0.95 × 4) - 1 = 3`, giving 400. With only four samples, this is a very coarse tail estimate. A displayed p95 from a tiny fixture demonstrates a calculation, not a reliable service-level objective.

## Estimate cost without inventing a price

Provider prices change, so this textbook does not bake a current price table into code. Instead, separate usage quantities from rate inputs. If input and output prices are quoted per million tokens, cost is `inputTokens / 1,000,000 × inputRate + outputTokens / 1,000,000 × outputRate`, plus any separately billed features. Use the provider's current authoritative rates for a real estimate.

```ts
interface Usage {
  inputTokens: number;
  outputTokens: number;
}

function estimatedCost(usage: Usage, inputPerMillion: number,
  outputPerMillion: number): number {
  const values = [usage.inputTokens, usage.outputTokens,
    inputPerMillion, outputPerMillion];
  if (values.some(value => !Number.isFinite(value) || value < 0)) {
    throw new RangeError('Use nonnegative finite quantities.');
  }
  return usage.inputTokens / 1e6 * inputPerMillion +
    usage.outputTokens / 1e6 * outputPerMillion;
}

console.log(estimatedCost({ inputTokens: 2000, outputTokens: 500 }, 1, 4));
// 0.004 in the hypothetical currency units supplied by these rates.
```

The rates 1 and 4 are illustrative inputs, not an actual provider quotation. Real billing may include caching, tools, media units, minimums, or different accounting rules. A budget controller should use authoritative usage records where available and conservatively handle missing usage rather than treating it as zero.

Local inference also has costs: download bandwidth, storage, electricity, battery, memory, and engineering support. It may reduce per-request server spending while increasing first-use friction. A hybrid architecture should evaluate the full user and operating cost rather than comparing only a remote token bill with an assumed free device.

## Budget before starting expensive work

Set maximum input size, evidence size, output tokens, request duration, tool steps, and concurrent operations. Apply each bound at the appropriate layer. A browser input limit improves interaction, but the server must enforce its own body limit. A prompt token budget should use the actual model's accounting where possible, not only a character estimate.

The course server limits body bytes and prompt length, uses a timeout, and requests a bounded output. These are teaching controls, not a complete rate limiter. A public service also needs per-user or per-tenant quotas, concurrency control, abuse handling, and a strategy for provider rate limits. An API key hidden on a server can still incur uncontrolled usage if the endpoint is open.

Retries need both a resource budget and a semantic policy. A transient read failure may be safely retryable. A timed-out write may have committed. A generation retry can produce a different answer and cost more. Use bounded backoff with jitter only for suitable failures, and expose persistent failure rather than retrying indefinitely.

A circuit breaker can temporarily stop calls to an unhealthy dependency after repeated failures, then probe for recovery. It protects capacity and improves predictable failure behavior. It is not a substitute for authorization, input validation, or a useful fallback. The fallback must preserve the data boundary and state whether a different backend is being used.

## Treat prompts and retrieved text as untrusted data

Prompt injection occurs when content the system should treat as data influences it as an instruction. A retrieved document can contain a malicious command. A tool description can misrepresent its purpose. A webpage can ask an agent to reveal information from another context. Delimiters and system prompts can help communicate intent, but they are not reliable access-control mechanisms.

The strongest protections are outside generation: minimize supplied data, enforce document permissions before retrieval, restrict available tools, validate every invocation, and bind consequential operations to approved application state. If the model never receives a private tenant's passage, it cannot quote that exact passage from the current retrieval bundle. If the dispatcher has no send operation, a generated request to send cannot execute through it.

This does not solve every model risk. A model can still produce harmful or misleading text from general knowledge or confusion. The point is to keep its authority bounded and its outputs reviewable. Separate data confidentiality, action authorization, output safety, and factual quality rather than treating one prompt phrase as a universal solution.

The WebMCP community report's security sections are relevant to tool metadata and output trust. The ordinary web security model remains relevant too. An XSS vulnerability can expose local documents or invoke page functionality regardless of whether the LLM itself follows instructions correctly. AI-specific controls do not replace basic application security.

## Render generated output safely

The companion renders model responses through `textContent`. This avoids interpreting a generated `<script>` or HTML attribute as markup. If a product needs Markdown, choose an explicit sanitization policy and safe link handling. A Markdown parser is not automatically an HTML sanitizer, and raw HTML support can be dangerous for untrusted content.

Keep code blocks as inert text unless the product intentionally provides a separately secured execution environment. An answer containing shell commands should not run because it appears in a model response. Similarly, a model-proposed URL should not automatically become a privileged backend fetch. Rendering, navigation, fetching, and execution are distinct actions.

Content Security Policy can reduce some classes of script injection, but its exact configuration depends on the application's scripts, workers, WASM, and asset hosts. Do not copy a permissive policy merely to make a model runtime load. Start from required capabilities, inspect failures, and allow only the necessary sources and execution features.

Cross-origin isolation may be required for certain shared-memory or threaded runtime configurations. It is not a universal requirement for every WebGPU operation. Headers such as COOP and COEP can affect embedding and resource loading. Apply them based on the selected runtime's documented needs and test the entire deployment, including third-party assets.

## CORS is not authentication

Cross-Origin Resource Sharing controls which browser scripts can read certain responses across origins. It does not establish who the caller is or whether an operation is authorized. Nonbrowser clients can still make requests, and some cross-origin requests can cause effects even when their responses are unreadable to the caller.

The local course server's host, origin, and content-type checks narrow its teaching environment. They do not make it a public authenticated service. A production endpoint should use a trusted identity system, enforce authorization on each relevant operation, and apply CSRF protections where cookie-based sessions and request semantics require them.

Client-provided consent and sensitivity flags are useful user-interface signals, but a malicious client can modify them. Server policy must derive protected classifications from trusted records and entitlements. The capstone's checkbox demonstrates explicit routing, not enterprise data-loss prevention. This limitation is intentional and documented.

Secrets should remain out of browser bundles, logs, archives, and model prompts. Environment variables on a trusted server can hold credentials, but operational tooling can still leak them if commands print full request headers or raw errors. Return controlled diagnostics and maintain a secure path for deeper investigation when needed.

## Observe behavior without collecting everything

A useful trace records request ID, selected backend, model/runtime version where known, stage durations, status category, output size, and resource usage. It need not record the full question, every retrieved passage, and the generated answer by default. Those payloads can contain personal or confidential information.

Use explicit retention and access policies for diagnostic content. Redaction can help, but it is not perfect. Synthetic reproduction cases are often safer for routine debugging. If users opt into sending a problematic example, show what is included and preserve their control. The same principle applies to screenshots and browser crash reports.

For local inference, distinguish model-artifact network requests from prompt transfer. A model download contacts an external host, but that does not necessarily mean the user's question was sent there. Conversely, a local model does not prevent the app's analytics from sending the question. Inspect actual network behavior when validating privacy claims.

Record capability failures in aggregate without using them to build an unnecessary device fingerprint. Browser AI eligibility can reveal hardware and environment characteristics. Collect only what helps support the product and explain its limitations. A detailed diagnostics panel can remain local until the user chooses to share it.

## Test resource ownership and failure recovery

Repeatedly enter and leave the WebLLM view, reset after loading, cancel generation, and simulate a failed artifact request. Look for retained workers, stale status messages, duplicate tool registrations, and results appearing in the wrong view. These failures often emerge only after several interactions, even when the first happy path works.

Test empty text, whitespace-only input, unusually long input, non-Latin text, emoji, malformed transport records, and unsupported languages. Distinguish validation failures from model failures. A useful interface should preserve the user's original input when an operation fails, allowing correction and retry without retyping.

Test narrow layouts, keyboard use, visible focus, and readable overflow for code and tables. A model can be technically correct while its output is inaccessible because a control is off-screen or a screen reader is flooded with updates. The companion uses native controls, but that does not eliminate the need for real accessibility testing on the intended audience's tools.

Keep failure injection honest. A mocked absent constructor tests the UI's absence handling; it does not prove how Chrome behaves under a real enterprise policy. A scripted planner tests dispatcher mechanics; it does not measure model planning. Label fixtures and native observations separately in reports and release notes.

## Package a reproducible release

Include source, lockfile, build output, setup instructions, model-artifact requirements, notices, and the verification report. Exclude credentials, dependency folders, private documents, caches, and unrelated workspace files. An archive should extract with relative paths and contain every referenced local asset. A checksum helps detect accidental corruption or a mismatched edition.

The built companion and the source serve different users. The build is convenient for serving and inspection; the source explains and permits modification. Neither includes external model weights. A clean machine needs package access for rebuilding and network access for optional first model downloads. State those requirements instead of calling the whole package offline-ready.

A release decision should name remaining limits. For this edition, static checking and deterministic tests can pass while native Chrome AI and real WebGPU inference remain unexecuted in the available test environment. That is a useful, bounded result. It would be misleading to convert it into “all AI integrations tested.”

## Compare alternatives with controlled experiments

When comparing two models or prompts, hold the rest of the pipeline stable where possible. Use the same questions, evidence, output budget, and scoring rubric. Randomize presentation order for human comparisons when practical. If one candidate receives better retrieval or a larger context budget, the result measures a whole-system difference rather than an isolated model improvement.

Report sample size and uncertainty. A change from nine passing cases to ten on a ten-case set is interesting but fragile. Inspect which case changed and whether it represents a frequent or consequential failure. Averages can hide regressions on a small but important subgroup, such as a supported language or low-memory device class.

Use paired comparisons when the same cases are evaluated under both alternatives. Keep the raw per-case outcomes so disagreements can be investigated. A single aggregate score is useful for tracking but insufficient for diagnosis. Include latency and resource impact because a quality improvement may come with a first-use experience the audience cannot tolerate.

Do not tune on private production conversations without an approved data-handling process. Synthetic cases and consented examples can provide valuable coverage while limiting exposure. When production feedback is used, distinguish a user's dislike of tone from a factual or authorization failure; those should lead to different engineering work.

## Plan graceful degradation by feature

A reading application can remain useful without inference. A document assistant can show retrieved passages without synthesis. A writing helper can preserve the draft and offer manual editing when a model fails. These are feature-specific degraded modes. They should be designed around what remains dependable, not around displaying an AI-branded result at any cost.

Name the degraded behavior clearly. A lexical search result is a search result. A cached answer is based on an earlier source version. A smaller local model may have a different quality profile. A remote fallback changes the data boundary. Let the user understand the change before depending on the result.

Degradation also needs tests. Simulate an absent constructor, failed model download, empty retrieval result, provider timeout, and interrupted generation. Verify that the original input remains available and the interface does not show stale success. A failure path that preserves user work can be a strong product feature even when the underlying model cannot run.

For resource exhaustion, avoid automatic retry loops that repeatedly allocate the same oversized model. Offer a smaller tested option or a different explicitly chosen route. For a policy restriction, do not suggest bypassing the policy through another backend. The correct degraded state may be unavailable inference with an evidence-only view.

## Separate deployment readiness from publication

A successful build produces assets. Serving them verifies a particular runtime path. Publishing them makes them available under a hosting and access configuration. These are separate milestones. The delivered course includes a local build and source package; it does not claim a hosted deployment or create an external site as a side effect of writing the textbook.

If you deploy the companion later, ensure the browser bundle can load its worker and WASM assets from the chosen base path. Configure the API route separately if you enable cloud generation. A static host will not execute the Node example server. Keep provider credentials in the hosting environment's server-side secret system rather than adding them to the static build.

Check response headers, compression, caching, and asset versioning. Large runtime bundles and WASM files affect download experience even before model weights are fetched. Cache immutable hashed assets appropriately, but avoid caching private API responses accidentally. Test the actual production URL because a development proxy can conceal missing deployment routes.

Maintain a rollback path with compatible source and build versions. If a runtime upgrade changes model artifacts or native assumptions, keep the prior validated package available. A release note should state the changed behavior and verification evidence, not merely say that dependencies were updated.

## Review the report as evidence, not decoration

A verification report should let another person reproduce the meaningful checks and understand their limits. Distinguish a successful command from the property it establishes. The same build result can support confidence in file resolution while saying nothing about whether a native model was available. That precision makes the report useful when deciding what to test next.

## Make the engineering decision explicit

Choose a local runtime when device capability, model size, privacy needs, and startup experience support it. Choose browser-managed APIs when their task and availability contract fit the audience. Choose a remote model when its capability is required and the data policy permits transfer. Combine routes only with explicit policy and a visible user experience.

Fine-tuning, larger contexts, more tools, and more agent steps are not automatic upgrades. Each adds a different cost and failure surface. Use evaluation evidence to justify the change. If a narrow deterministic operation solves the task exactly, preserve it rather than replacing it with probabilistic generation for appearance's sake.

As an optional application, expand the fixture evaluation with one paraphrase, one unanswerable query, one cross-tenant probe, and one source-conflict case. Define expected behavior before running a model. The final chapter assembles the complete document assistant and shows how the same boundaries support realistic extensions without turning the project into an unbounded agent.
