# 5. Use Chrome's browser-managed AI APIs deliberately

A browser application needs to summarize an article, translate a message, rewrite a paragraph, or answer a bounded question. Managing model files itself may be unnecessary. The central problem in this chapter is using browser-managed AI while preserving an honest capability and lifecycle contract. Chrome owns model provisioning and implementation details; our application still owns task selection, input handling, session cleanup, error presentation, and any decision to use a remote alternative.

The prerequisites are promises, event handlers, runtime validation, and explicit routing from chapter 2. The model concepts from chapter 1 explain why generated content still needs review. The complete native wrappers are in [chrome-ai.ts](../src/chrome-ai.ts). The companion's fifth experiment checks available constructors and provides separate buttons for the Prompt API and six task operations.

This is a dated research edition, inspected on 13 November 2026. The [Chrome AI hub](https://developer.chrome.com/docs/ai) is the user's starting resource, but individual API pages, the status table, explainers, and installed browsers can differ. The [API baseline appendix](../research/API-BASELINE.md) records those distinctions. A documentation claim is not proof that the API is available on the computer running this book.

## Browser-managed and application-managed are different contracts

With WebLLM, the application selects a model record and participates directly in loading its artifacts. With a native AI API, the browser supplies a task-oriented interface and manages its own model lifecycle. The site does not choose an arbitrary weight file for `Summarizer.create()`. This can simplify integration and allow browser-level sharing and updates, while reducing application control over exact model identity and numerical behavior.

This distinction changes reproducibility. A pinned npm dependency can freeze your wrapper code, but a browser update may change the underlying native model or availability rules. Evaluate behavior on supported browser versions and keep a record of tested configurations. Do not use exact generated wording as a permanent contract unless the task and model environment actually justify it.

Native inference also changes the privacy boundary without eliminating application responsibility. Chrome's documentation describes local model use after provisioning, but your app can still transmit input through analytics, a fallback route, logs, or document synchronization. Say precisely what remains local. Avoid the vague promise that an entire product is private because one inference step runs on-device.

The browser may require substantial free storage and suitable hardware even when the final model files are smaller than the eligibility threshold. These requirements can change. Consult the current per-API requirements rather than hard-coding this edition's numbers into product copy. A constructor's presence, a model's readiness, and successful execution are separate observations.

## Choose a task API before a general prompt

A task-specific interface expresses intent in a constrained form. A summarizer takes source text and summary preferences. A translator takes a language pair. A rewriter modifies existing text. A general prompt asks a foundation model to perform a broader instruction. The narrower API can simplify configuration and evaluation when it matches the product requirement.

| Product operation | Native entry point | Main contract to inspect |
| --- | --- | --- |
| General text request | `LanguageModel` | Session context, modalities, output constraints |
| Condense source material | `Summarizer` | Summary type, length, language, format |
| Translate between languages | `Translator` | Source/target pair and pack availability |
| Rank likely source languages | `LanguageDetector` | Language codes and confidence-like scores |
| Draft new text | `Writer` | Tone, format, length, trial access |
| Revise existing text | `Rewriter` | Relative tone/length and trial access |
| Correct language errors | `Proofreader` | Corrected input and correction records |

The table is an operation map, not a claim of universal support. The inspected Chrome status table lists Translator, Language Detector, and Summarizer from Chrome 138, and Prompt on the web from Chrome 148. Writer, Rewriter, and Proofreader remain trial-stage in the inspected material. Some individual pages describe origin-trial access more specifically than the overview's “developer trial” label. Use the per-feature instructions and runtime checks when testing. [Chrome's status table](https://developer.chrome.com/docs/ai/built-in-apis) is the reference for this snapshot.

A dedicated task model is not necessarily the same model as the general Prompt API. Translation, for example, uses specialized language-pair resources. Do not infer that enabling one foundation-model feature automatically enables every language pair or modality. Likewise, support in Chrome Extensions does not establish the same feature set on ordinary web pages.

## Detect presence, then inspect readiness

Feature detection asks whether a constructor exists, such as `'Summarizer' in globalThis`. Readiness asks whether the requested capability is unavailable, downloadable, downloading, or available. Execution then tests whether a particular session and input work. These stages answer different questions and deserve different user messages.

`unavailable` means the requested capability cannot currently be used under the detected conditions. `downloadable` means provisioning may be needed. `downloading` indicates provisioning is in progress. `available` means the model resources are ready according to the API's readiness check. None of these states guarantees that every future prompt is valid or that storage will never be reclaimed.

Availability options should match the task you intend to create. A translator check for English-to-French says nothing about another pair. A Prompt API check for text in English says nothing about audio input or a different output language. The companion's general capability panel is a quick diagnostic; an application should perform the option-specific preflight relevant to its actual task.

```ts
import { chromeAI } from '../src/chrome-ai.ts';

const factory = chromeAI().Translator;
const pair = { sourceLanguage: 'en', targetLanguage: 'fr' };

if (!factory) {
  console.log('Translator constructor is absent.');
} else {
  console.log('Requested pair:', await factory.availability(pair));
}
```

This browser integration example uses the course's structural interfaces. Those interfaces describe a deliberately small subset of the dated contract. They are not a polyfill and do not add support to a browser. For a production codebase, use current authoritative declarations where available, review them against the browser baseline, and still perform runtime detection.

## Respect transient user activation

Some model provisioning operations require a recent user gesture. A click handler is a natural place to start creation. A subtle bug occurs when the handler awaits an unrelated slow operation before invoking `create()`: transient activation can expire while waiting. A successful capability check does not preserve the user's gesture indefinitely.

The companion separates the “check availability” action from the “run native API” action. The run handler invokes the async wrapper immediately, and the wrapper reaches `create()` before its first await. This is why the UI does not put these calls behind the generic deferred helper used for some other experiments. The distinction is about the timing of the call, not about whether the function is labeled async.

If input preparation requires an asynchronous file read or network operation, do that first and then present a clear enable/run button. Alternatively, create the permitted session from a user gesture and perform later processing under that established lifecycle. Choose a flow supported by the specific API rather than assuming a promise chain retains activation forever.

User activation is also not blanket authorization for unrelated data transfer. Clicking a local summarize button should not silently approve cloud fallback. Browser permission and application consent answer different questions. Keep the product's route visible when switching from a native local operation to any remote service.

## Create, use, destroy

The basic lifecycle is a resource pattern: select options, create a session, run an operation, and destroy the session when its owner is finished. A `finally` block makes cleanup reliable when prompting throws or the user aborts. A destroyed session cannot be reused. An application that wants repeated operations can keep a session intentionally, but must own its context and teardown.

```ts
import { chromeAI, downloadMonitor } from '../src/chrome-ai.ts';

export async function summarizeFromClick(text: string): Promise<string> {
  const factory = chromeAI().Summarizer;
  if (!factory) throw new Error('Summarizer is absent.');
  const session = await factory.create({
    type: 'key-points',
    length: 'short',
    format: 'plain-text',
    ...downloadMonitor(message => console.log(message))
  });
  try {
    return await session.summarize(text);
  } finally {
    session.destroy();
  }
}
```

This is a complete exported browser function for the project environment. Invoke it directly from a user click. `downloadMonitor` subscribes to model-download progress. The loaded fraction reported by the API is converted to a percentage for display. Progress reaching completion means provisioning completed; it is not the same as the summary finishing.

The real wrapper also accepts an abort signal. Passing it to creation and supported operations ties session work to the view's lifecycle. Some task methods have narrower cancellation surfaces than others in the structural baseline. The interface reports cancellation requests honestly rather than promising instantaneous interruption of every browser-managed operation.

## Prompt API: a session with context

The general entry point is `LanguageModel`, not older `window.ai` examples found in early tutorials. `create()` returns a session. `prompt()` resolves to a complete response, while `promptStreaming()` returns a readable stream. The lab uses the complete-response form to keep rendering and capability diagnosis straightforward.

A session retains conversation context according to its contract. This is useful for follow-up questions but can also cause cross-task contamination if an application reuses one session for unrelated users or documents. The course's `promptOnce` creates an ephemeral session for each operation. That costs session setup but makes the evidence and ownership boundary easier to reason about.

Initial prompts can establish a system instruction and earlier messages. They are not permanent model training. The current interface exposes context-oriented names such as `contextUsage`, `contextWindow`, and `measureContextUsage`; older input-quota names have changed. Keep migration notes near version-sensitive code so a copied tutorial does not silently teach a removed alias. The [Prompt API explainer](https://github.com/webmachinelearning/prompt-api/blob/main/README.md) records this migration separately from Chrome's implementation guide.

The current Chrome documentation distinguishes web sampling presets from extension-specific legacy numeric controls. This course therefore does not pass WebLLM's `temperature` and `topK` settings into a normal web Prompt API call. Sampling presets are themselves a trial-sensitive extension in the inspected material. The baseline wrapper omits sampling controls entirely. [Chrome's Prompt API guide](https://developer.chrome.com/docs/ai/prompt-api) is the implementation reference.

## Context overflow changes meaning

A long-lived session has a finite context budget. The browser's current behavior may remove older prompt-response pairs when enough space is needed, while preserving the system prompt, or reject a request that cannot fit. Your application should not assume that every earlier statement displayed in the UI remains available to the model.

Treat context overflow as an application event. If an assistant relies on a document's exception clause, silently losing that clause can change the answer. A robust design can rebuild an ephemeral evidence prompt for each question, summarize older conversation deliberately, or let the user start a new session. Each strategy has a different continuity and accuracy tradeoff.

Summarizing history is a lossy transformation. A summary can omit a constraint, confuse speakers, or turn an uncertain statement into a fact. Preserve critical structured state outside the conversational summary: selected document IDs, confirmed preferences, pending actions, and authorization scope should remain explicit application data.

For the capstone, each answer starts from the current question and selected passages, so session-history growth is avoided. This is not a universal design rule; it is a deliberate simplification for a document assistant whose authority should come from visible evidence rather than an opaque accumulation of earlier turns.

## Structured output still needs a validator

The Prompt API supports a response constraint for supported structured output. A JSON Schema can describe fields and allowed values. This can improve syntactic and structural reliability when the runtime and model support the constraint. It does not prove that the values correspond to the source document or a real-world fact.

For a support triage task, a schema might require `{ category, urgency }`, with category limited to a few strings. After generation, parse the JSON and validate it. Then apply domain policy: an urgency label should not automatically page an on-call engineer without the application's approved workflow. Structure helps software consume the result; authority remains separate.

The following is an integration fragment requiring a supported `PromptSession`:

```ts
const schema = {
  type: 'object',
  properties: {
    category: { type: 'string', enum: ['download', 'privacy', 'other'] }
  },
  required: ['category'],
  additionalProperties: false
};

const raw = await session.prompt(
  'Classify: the local model download keeps failing.',
  { responseConstraint: schema }
);
const parsed: unknown = JSON.parse(raw);
// Validate parsed before constructing a trusted application value.
```

The validation step is intentionally called out rather than replaced with a type assertion. If the feature is absent or unsupported, report that condition. Do not silently drop the constraint and claim the same reliability contract. A production adapter can expose a capability flag so the caller knows which guarantee was actually requested and exercised.

## Summarization: preserve the source's scope

The Summarizer API offers summary types such as key points, a short overview, teaser, and headline, with format and length preferences. Those options express a desired output shape rather than an exact universal word count. A short headline and short key-points summary are different products. Use the task that matches what the user is trying to scan.

The course selects short key points in plain text. Plain text reduces rendering complexity and avoids treating generated Markdown as trusted HTML. The wrapper can be extended with expected input and output languages and shared context where supported. Keep availability checks aligned with those options. The [Summarizer API guide](https://developer.chrome.com/docs/ai/summarizer-api) describes the current configuration surface.

For a long document, avoid cutting a string at an arbitrary character count and assuming the result fits the model. Chunk by coherent sections, summarize each, then synthesize a higher-level summary while preserving source IDs and critical qualifications. This summary-of-summaries pattern can lose details, so evaluate it on documents with exceptions, negation, and tables.

A summary is an interpretation of source content. Show the original text or a source link and make it easy to compare. For high-consequence material, keep the generated summary as a reading aid rather than the sole authoritative record. Even a correctly functioning API can omit a detail that matters to one user's decision.

## Translation and language detection

Translation requires an explicit source and target language pair. The browser can provision language packs independently of a foundation model. The companion defaults to English-to-French but exposes both codes. Unsupported pairs should produce a meaningful error. Do not assume that every language accepted by a translator is also supported as a Prompt API output language.

The language detector returns ranked candidate languages and associated scores. A short string such as a name or product code may be ambiguous. Use detection as a suggestion and let the user correct it when the result affects communication. Confidence-like scores should be interpreted under the API's contract rather than treated as calibrated probabilities for every text domain.

The [Translator guide](https://developer.chrome.com/docs/ai/translator-api?hl=en) documents on-demand packs and an important privacy detail: availability reporting can intentionally obscure the prior download status of particular language pairs. The [Language Detector guide](https://developer.chrome.com/docs/ai/language-detection) describes its ranking result. These are separate capabilities even when the interface combines them in a translate workflow.

For customer support, preserve the original message and show the translated draft. Names, dates, negation, technical identifiers, and politeness can change meaning if mishandled. Never overwrite the original solely because translation completed. A useful product can label the target language, retain a reversible edit, and provide a copy action for the reviewed result.

## Writer and Rewriter: distinguish creation from revision

Writer creates new content from a task description, with options such as tone, format, length, and shared context. Rewriter starts from existing text and applies relative changes, such as more formal, shorter, or longer. The options are not interchangeable: `formal` and `more-formal` describe different contracts. The course wrapper uses the documented values for each interface.

These APIs remain trial-sensitive in the inspected edition. The lab detects their constructors and reports absence without pretending a prompt-based substitute ran. For local development, the official pages describe flags; for participating origins, they describe trial registration. The course does not register a trial, alter your browser flags, or claim that a preview feature is universally shipped. See the [Writer](https://developer.chrome.com/docs/ai/writer-api) and [Rewriter](https://developer.chrome.com/docs/ai/rewriter-api) guides.

A writing assistant should distinguish a draft from a sent message. The API producing text is not authorization to email it. Keep the user's original material, show the revised version, and let them accept or edit. If an application later adds a send tool, that tool needs its own validated and authorized workflow, developed in chapter 6.

Evaluate revision tasks for meaning preservation as well as fluency. A shorter paragraph that removes a deadline or changes a promise is a failure even if it reads elegantly. Use cases with dates, quantities, uncertainty, and contractual language reveal this problem more effectively than generic happy-path examples.

## Proofreader: corrections need coordinate discipline

The Proofreader API returns a corrected input and correction records. A UI can display the corrected text or highlight edits. The current [Proofreader guide](https://developer.chrome.com/docs/ai/proofreader-api) is experimental and contains example inconsistencies, so this course uses a conservative call shape and returns the result as JSON for inspection rather than copying every page snippet literally.

If you build inline highlighting, determine what the correction indices measure and whether they refer to the original or corrected string. Applying offsets after earlier replacements can shift later ranges. A safer design renders unchanged and changed spans from a fixed source representation or applies edits in reverse offset order when the contract supports that method.

A grammar correction can alter intended voice, dialect, terminology, or quoted content. Let the user review changes. For a source-code comment or product name, a suspicious-looking word may be intentional. A successful proofreading call is evidence that the API ran; it is not evidence that every proposed correction is desirable.

The lab's JSON view is intentionally literal about this boundary. It shows what the native method returned without claiming a production diff editor. An optional project in the capstone appendix describes how to add a reversible correction interface with tests for Unicode, overlapping ranges, and unchanged source preservation.

## Multimodal prompting requires explicit capability negotiation

The current Prompt API documentation includes text, image, and audio input paths, while its ordinary output contract is text. A browser that can create a text session may still reject a requested modality or require different hardware. Declare expected inputs and outputs according to the documented contract and check the same capability before creating the session.

An image input is not a shortcut around document permissions. The user should choose the image, understand what it contains, and know whether processing stays local. Audio can include background voices and environmental information. A document screenshot can contain private text outside the intended selection. Input minimization remains useful even for local processing.

The baseline companion does not request microphone, camera, or file access. It teaches the modality contract and leaves an explicitly described optional extension rather than initiating unrelated permissions. A complete multimodal product must also handle preprocessing, size limits, failed decoding, accessibility, cancellation, and a useful explanation when the selected browser cannot perform the task.

Be careful when reading an evolving explainer: proposed future features can appear before a Chrome implementation supports them. Keep a separate record for specification proposals, documented Chrome behavior, and behavior observed in your test browser. The course intentionally does not add speculative reasoning-output interfaces to its baseline wrapper.

## Frames, workers, and permissions policy

Native APIs can be restricted by document context and permissions policy. An API available in a top-level page may be unavailable inside an embedded cross-origin frame. A host may need to delegate the relevant feature explicitly. Do not solve an embedding error by broadly granting every feature to every origin; delegate only the capability the product needs.

The inspected Prompt, Translator, and Proofreader documentation also identifies worker limitations. The worker strategy from WebLLM is therefore not automatically transferable to native APIs. WebLLM owns a worker-compatible runtime; browser-managed APIs have their own document and policy integration. An abstraction should preserve these differences instead of pretending every backend has identical placement rules.

For an extension, inspect the extension-specific API and permission guidance separately. A content script, extension page, service worker, and ordinary web page are different execution contexts. An example that works in one does not establish support in another. This edition's runnable native lab is an ordinary served web page.

## Test native behavior with a task matrix

Construct a matrix whose rows are tasks and whose columns are browser/device configurations. For each cell, record constructor presence, option-specific availability, creation outcome, execution outcome, and cleanup behavior. A single “supported” checkbox hides too much information. Translation may work while a foundation-model task is unavailable on the same device.

Use synthetic inputs with clear evaluation properties. A summary input can contain a deadline and an exception that must survive. A translation input can contain a name, quantity, and negation. A rewrite input can contain a promise that must not become stronger. A proofread input can include a technical identifier that should remain unchanged. These cases test useful behavior beyond fluency.

Record trial configuration separately from ordinary stable behavior. If a feature works only after enabling a flag, the result belongs to that development configuration. Do not report it as evidence for all stable users. If a native API is absent in the available test browser, test the absence interface and leave native execution unverified rather than substituting a simulated answer.

Browser-managed updates also make regression evaluation valuable. Keep the same synthetic task set and compare outcomes after an upgrade. You may observe different wording without a meaningful regression; focus on preserved facts, supported languages, output structure, latency, and failure semantics. Exact-string comparison is usually too brittle for generative tasks.

## Keep application state independent of model sessions

The user's selected document, draft edits, chosen language pair, and route preference should live in application state. A model session is an execution resource, not the only place that important state exists. If it is destroyed or loses context, the application should still know what the user was doing.

This separation also supports recovery. After a failed summary, preserve the source and options so the user can retry or choose another route deliberately. After a failed translation, keep the original message and target language. After a context reset, rebuild only the information the next operation needs instead of hoping an old conversation still contains it.

The ephemeral wrappers in this edition make that contract easy to inspect. A larger application can pool or reuse sessions for performance, but it must prevent cross-user or cross-document contamination and release idle resources. Reuse is an optimization layered on correct state ownership, not a reason to let invisible model context become the authoritative application database.

## Build a useful unavailable state

If a constructor is absent, report which feature is missing. If availability returns unavailable, mention that device, policy, language, or browser configuration may be responsible without inventing a diagnosis. If creation fails, preserve the exception category in a readable message. Avoid telling users that their input was processed when initialization never succeeded.

Offer an explicit alternate route only when the product supports it and the user approves any changed data boundary. The capstone keeps evidence inspection available even without a model. That is often more useful than a broken “AI” button or an invisible fallback. A browser-specific enhancement can coexist with a dependable baseline application.

As an optional application, run the capability panel, record the results, then try one supported task with a short synthetic input. Reset, navigate away during work, and return. Compare observed behavior with this edition's baseline and document any mismatch. The next chapter moves from asking a model for text to exposing application operations to agents through WebMCP, where schemas and action authority become central.
