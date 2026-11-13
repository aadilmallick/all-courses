# 2. Build the TypeScript boundary around the model

A model call becomes useful only when an application can start it, receive data, stop it, explain failures, and protect credentials. The central problem of this chapter is building that boundary. We will connect a browser interface to a local TypeScript server, stream a deliberately labeled transport fixture, and examine the optional remote-model route. The fixture demonstrates networking without pretending to generate intelligent text.

Chapter 1 established that tokens, characters, and bytes are different units. We now need asynchronous programming, runtime validation, HTTP, and resource ownership. These prerequisites are taught here because WebLLM and native Chrome AI both rely on them. The goal is practical fluency: understand what executes where, what an awaited operation means, and who must clean up if the user navigates away.

The complete server is [cloud-server.ts](../examples/cloud-server.ts), the stream parser is [core.ts](../src/core.ts), and the browser orchestration is [main.ts](../src/main.ts). The companion's second experiment exercises routing and the fixture. The chapter uses selected listings to explain those files; it does not require assembling hidden fragments from unrelated tutorials.

## Establish the execution environment

The project uses TypeScript source, Vite for browser bundling, and Node for scripts and the example server. Browsers execute the JavaScript produced by the build. Node 22.18 or newer can run this project's erasable TypeScript syntax directly. Type erasure removes annotations; it does not type-check the program. The separate `tsc --noEmit` build step checks types before Vite produces assets.

The package deliberately pins TypeScript 5.9.3 as a compatible baseline rather than claiming it is the newest release. The lockfile records the complete dependency graph. The environment used to produce the verification report is named there. If you upgrade dependencies later, regenerate the lockfile, rebuild, and repeat the relevant checks. Reproducibility is a property of a recorded environment, not a promise that packages never change.

From the extracted project directory, run these commands in separate terminals as appropriate:

```text
npm ci
npm run dev
npm run server
```

The browser development server normally uses port 5173. The course API listens on loopback port 8787. Vite forwards `/api` requests during development, letting the browser use one origin. The production preview serves the built reading companion, but its default server does not include the development API proxy. Use development mode when following the transport or optional cloud lab, or configure an explicit same-origin backend in a deployment.

`npm ci` installs the exact lockfile versions. `npm run build` checks TypeScript and produces `dist/`. `npm run preview` serves that output for inspection. Opening `index.html` directly through a `file:` URL is not the supported environment: module imports, fetching, and secure-context capabilities behave differently from a served application. A small local HTTP server is part of the learning setup.

## TypeScript describes expectations

Start with an object containing a user's question. An interface describes the expected shape of a value during development. A union describes a value that may take one of several forms. A function signature records the inputs and result. These features make boundaries visible, but the annotations disappear when the program runs.

```ts
interface Question {
  text: string;
  sensitive: boolean;
}

type Route = 'local' | 'cloud' | 'unavailable';

function describeQuestion(question: Question): string {
  return `${question.text.length} code units; sensitive=${question.sensitive}`;
}

console.log(describeQuestion({ text: 'Explain model downloads.', sensitive: false }));
```

The parameter must have a string `text` and boolean `sensitive` according to the checker. The return type promises a string. Template literals interpolate expressions inside `${...}`. `text.length` measures UTF-16 code units, not model tokens. This distinction should now be familiar from chapter 1.

A type assertion such as `value as Question` tells the checker to trust the programmer. It does not inspect `value`. Network data, model JSON, local storage, and tool arguments can all violate a declared type. A useful rule is to receive external data as `unknown`, inspect it, and construct a trusted application value only after successful validation. The [TypeScript narrowing handbook](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) explains how runtime checks refine static types.

The included `unknownRecord` helper checks that an unknown value is a non-null object and not an array. `parseSearch` then checks its allowed keys and the query's length and content. These are two separate levels of validation: first establish a container shape, then enforce the domain contract. A library schema validator can reduce repetition in larger systems; it does not change the need for a runtime check.

## Narrow unknown values before using them

Consider a transport message that should either add a text delta or signal completion. A discriminated union uses a literal field to identify the variant. This lets TypeScript connect a particular `type` value with the fields that are valid for it. We still need a parser to convert arbitrary input into that union.

```ts
type StreamEvent =
  | { type: 'delta'; text: string }
  | { type: 'done' };

function parseEvent(input: unknown): StreamEvent {
  if (typeof input !== 'object' || input === null) {
    throw new TypeError('Expected an event object.');
  }
  const value = input as Record<string, unknown>;
  if (value.type === 'delta' && typeof value.text === 'string') {
    return { type: 'delta', text: value.text };
  }
  if (value.type === 'done') return { type: 'done' };
  throw new TypeError('Unknown event shape.');
}

const event = parseEvent(JSON.parse('{"type":"delta","text":"Hello"}') as unknown);
if (event.type === 'delta') console.log(event.text);
```

After the final condition, the checker knows the event contains text. Before parsing, it does not. This pattern is useful for model output as well: parse JSON syntax, validate structure, enforce domain constraints, then use the result. Valid JSON can still contain the wrong shape, an impossible date, an unauthorized record ID, or an unsafe URL.

The example parser accepts extra fields and constructs a smaller clean object. The project's tool-input parser instead rejects extra keys. Both are deliberate policies. For a public response format, ignoring unknown fields can support forward compatibility. For a narrow action tool, unexpected arguments can indicate a mistake and deserve rejection. State the policy instead of assuming that every validator behaves identically.

## Promises represent future completion

A synchronous function returns its result before the caller continues. An asynchronous operation can return a promise representing a result that will arrive later. An `async` function always returns a promise. `await` pauses that function's continuation until the promise settles; it does not freeze the whole browser while the operation waits for a network response.

This matters because a button handler may start a model download that takes minutes. The interface must remain usable. Show a loading state, allow cancellation where supported, and prevent conflicting operations. A promise is not itself a progress channel; use explicit progress events or callbacks when the underlying API provides them.

`try` and `catch` handle rejected promises when the awaited call is inside the block. `finally` runs when the block completes successfully or unsuccessfully, making it appropriate for releasing owned resources. The native Chrome wrappers create a session, await an operation, and destroy the session in `finally`. The WebLLM wrapper terminates its worker even if unloading fails.

One subtle error is starting an async task without observing its promise. An event listener cannot automatically display a rejection to the user. Our UI handlers use `void operation().catch(...)` or a small helper that attaches a rejection handler. `void` makes the intentional non-await explicit; the `.catch` is what actually handles failure.

## HTTP is an application boundary

An HTTP request has a method, URL, headers, and optional body. A response has a status, headers, and body. A model provider may use JSON over HTTP, streaming events, or another protocol. Your browser application should depend on a small internal contract rather than every provider's entire response object.

The course server exposes two distinct routes. `/api/fixture` emits a fixed NDJSON sequence and requires no key. `/api/generate` calls a configured Gemini model only when the request explicitly includes cloud consent and the server has credentials. The separation is visible in the interface and the output. A successful fixture proves transport handling; it does not prove remote inference or model quality.

The server binds to `127.0.0.1`, limits accepted host and origin values, requires JSON input, and caps request size. Those measures make the local teaching service more controlled. They are not a complete internet-facing authentication system. Before exposing a related service publicly, add authenticated sessions, authorization, quotas, origin/CSRF protections appropriate to the deployment, and operational controls described in chapter 7.

The browser uses a relative path such as `/api/fixture`. During development, Vite forwards that path. A relative path keeps the frontend independent of one hard-coded production hostname, but it does not create a backend in a static hosting environment. Deployment architecture must provide a matching route. A 404 from a static preview is therefore a routing limitation, not evidence that the stream parser is broken.

## Keep secrets on the server

A browser bundle is delivered to the user. Anything inside it can be inspected. Build-time environment variables exposed to client code are not secret merely because they came from an `.env` file. A provider API key belongs in a trusted server environment or an explicitly designed constrained-token flow, not in bundled TypeScript.

The included server reads `GEMINI_API_KEY` and `GEMINI_MODEL` from its own environment. It does not print the key or return provider error bodies. The model name is deliberately required rather than silently selecting a potentially retired or billable default. Choose an available model for your account from the provider's current documentation before enabling that optional path.

The following is a shell setup example for PowerShell, not TypeScript source:

```text
$env:GEMINI_API_KEY = 'your-key-in-your-own-terminal'
$env:GEMINI_MODEL = 'your-account-supported-model-id'
npm run server
```

Do not commit the real values or paste them into a support screenshot. The placeholder strings above are intentionally not usable credentials. The public browser companion works without configuring this optional integration. The server sends only the prompt supplied to the route, but the application still decides what evidence and question enter that prompt.

The remote request uses the documented `generateContent` endpoint and extracts text from the first candidate's content parts. It excludes parts marked as internal thought, checks for an empty usable answer, and returns a compact application response. Model safety blocks, token limits, and provider errors remain possible. The [Gemini content-generation reference](https://ai.google.dev/api/generate-content) defines that external contract; the course does not assume all providers use it.

## Streaming has several layers

An end-of-stream signal means the transport finished; a separate application event or finish reason may still be needed to establish successful task completion.

A streaming model may generate tokens incrementally. A provider may package text deltas into events. HTTP transmits bytes in arbitrary groups. A browser stream exposes those groups through reads. These boundaries need not align. One read can contain several messages, half a message, or part of a multibyte character.

The fixture uses newline-delimited JSON, or NDJSON: one JSON value per line. Its events look like `{"type":"delta","text":"Transport "}`. Newlines frame messages at the application layer. JSON strings escape embedded newlines, so a literal newline between records has a clear role. This is different from server-sent events, whose framing rules include fields such as `data:` and blank-line separators.

The parser must preserve two kinds of partial state. A streaming UTF-8 decoder preserves incomplete byte sequences. A text buffer preserves an incomplete JSON line. Only when a complete line arrives should the parser call `JSON.parse`. The [Streams API guide](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams) supplies the underlying stream concepts; framing remains the application protocol's responsibility.

The complete implementation is included in `readNDJSON`. Here is its essential progression, shown as an explanatory fragment rather than a second standalone parser:

```ts
// Inside readNDJSON: reader reads Uint8Array chunks.
const decoder = new TextDecoder();
let pending = '';
const decoded = decoder.decode(bytes, { stream: true });
pending += decoded;
// Extract complete newline-delimited records; retain the unfinished suffix.
```

`stream: true` tells the decoder that more bytes may follow. At the end, a final `decoder.decode()` flushes its internal state. The parser also accepts a final complete JSON value without a trailing newline, rejects oversized records, and cancels/releases the reader when iteration ends. These details are why an apparently simple text stream deserves a small dedicated function.

## Consume events without unsafe rendering

The UI loops over parsed values with `for await`. That syntax requests the next value from an asynchronous iterator, waits for it, and repeats. It is useful when values arrive over time. The loop can stop early, which should release the underlying resource through a `finally` block in the producer.

For each delta event, the companion appends text using `textContent`. It never treats model-generated text as executable HTML. If you later render Markdown, use a renderer and sanitization policy appropriate to untrusted output, including link-protocol handling. The reader's chapter Markdown is authored local content; that trust decision must not automatically be extended to model responses or user-supplied documents.

Appending text on every tiny event can make rendering expensive. A production interface can buffer deltas and update at a controlled cadence. Keep the final answer correct even when some animation frames are skipped. Streaming is primarily a perceived-latency and interaction feature; it does not inherently reduce the total model computation required for a response.

The fixture intentionally includes `café` split across textual deltas. Unit tests additionally split its UTF-8 representation at every possible byte boundary. The expected final text remains intact. This is a meaningful parser test because it challenges a transport property independent of how one server happens to group writes on a particular day.

## Cancellation is a request, not time travel

`AbortController` owns a signal that can notify an operation to stop. Calling `abort()` marks the signal as aborted. Fetch and many browser APIs observe it. Other operations need their own interruption method, such as WebLLM's `interruptGenerate`. A cancellation button must use the mechanism provided by the operation it actually started.

Even when the client aborts fetch, a remote provider may have already performed work. Aborting cannot erase a completed action or guarantee that no billing occurred. For an action with side effects, the application needs transaction semantics, idempotency, and a way to inspect the result. Chapter 6 treats that as an agent-tool problem rather than a text-generation detail.

The server combines the disconnect signal with a timeout using `AbortSignal.any`. If the browser closes the response before completion, or the timeout expires, the upstream fetch receives cancellation. The server does not assume that cancellation proves an external action was undone. This example only requests generated text, so its side-effect model is relatively narrow.

Cleanup should be idempotent: calling it twice should not break the application. This matters because navigation, user stop, and failure may race. Our engine wrapper tracks disposal, and view cleanup aborts the current controller. Each component releases resources it owns, while shared resources require an explicit higher-level owner.

## Protect the interface from stale async results

Imagine selecting the WebLLM lab, starting a download, then switching to the retrieval chapter. The old promise can still complete. If its callback writes into the new page, the interface becomes misleading. Cancellation alone is insufficient because some operations cannot be stopped promptly or have already resolved.

The companion uses a generation counter. Every view change increments it. A callback captures the value for its originating view and checks whether it still matches before updating the display. A late-created WebLLM engine is disposed if its view is no longer current. This technique separates two concerns: stopping unnecessary computation where possible and suppressing stale presentation regardless.

```ts
let currentView = 0;

async function loadForView(load: () => Promise<string>): Promise<void> {
  const owner = ++currentView;
  const result = await load();
  if (owner !== currentView) return;
  console.log('Still the active view:', result);
}
```

This small complete example demonstrates ownership of a result. The real UI additionally releases resources and handles errors. A generation token is not a substitute for authorization or request IDs on a server; it only prevents a known class of local presentation race.

## Backpressure keeps producers and consumers in balance

A producer can create data faster than a consumer can process it. If every generated chunk is buffered indefinitely, memory grows without bound. Backpressure is the mechanism by which a slower consumer influences the production or delivery rate. It is a general streaming concept, not a feature unique to AI.

The course server checks the boolean returned by `response.write`. When it is false, the server waits for a drain event before continuing. The fixture is tiny, so this is unlikely to dominate a normal run, but the pattern matters for large or slow responses. A production stream should also handle disconnects while waiting; the server passes the cancellation signal into that wait.

At the browser side, the parser requests the next chunk as it advances. The UI then decides how frequently to render accumulated text. A bounded rendering buffer can improve responsiveness, but do not discard content merely because the screen updates more slowly than the stream. Data accumulation and visual refresh are separate responsibilities.

Backpressure does not necessarily propagate all the way to a remote model's GPU. A provider may continue generating while an intermediary buffers output. Know which boundaries are actually controlled. If your budget depends on stopping generation, use the provider's documented cancellation behavior and still allow for work already completed.

## Distinguish SSE from your internal event format

Many model services stream server-sent events. An SSE message can have several `data:` lines, an event type, an ID, comments, and a blank line terminating the event. A parser that splits every network read on newline and calls `JSON.parse` is not a general SSE parser. Even if it works for one sample response, it has confused transport chunks with protocol messages.

Our fixture uses NDJSON precisely so its framing can be taught independently. A provider adapter can parse the provider's SSE contract and emit the application's simpler delta/done events. This normalization keeps the UI from depending on one vendor's field names or end marker. It also creates a place to handle finish reasons, usage events, and errors explicitly.

Do not parse incomplete structured output as if every intermediate prefix were valid JSON. During streaming, a response might temporarily contain only `{"category":`. You can show it as provisional text, use a documented incremental parser, or wait until completion and validate the final structure. The correct choice depends on whether partial presentation helps the task.

The course's optional remote route uses a complete JSON response rather than pretending to implement every provider streaming dialect. The transport lab supplies the streaming mechanics separately. This is an intentional teaching decomposition: the complete source identifies exactly which protocol each route implements.

## A failure-state table guides the interface

An application can distinguish validation failure, unavailable capability, initialization failure, active generation, user cancellation, timeout, provider rejection, and completed output. These states tell the user different things. A validation failure may be fixed by editing input. An unavailable capability may require a different device or explicitly chosen route. A timeout may justify retrying only after considering whether the operation had side effects.

Keep the original input visible throughout. Clear only the result owned by the new request, and avoid erasing a useful partial answer without explaining why. If the user edits the question while generation is active, either bind the response to the original request or cancel and restart deliberately. Otherwise the displayed answer can appear to address text it never received.

In a larger application, represent these states with a discriminated union and transition functions rather than loosely related booleans. A state such as `{ type: 'running', requestId, startedAt }` is easier to reason about than `loading=true`, `failed=false`, and an unrelated response variable that may belong to an older request. The companion uses a smaller view counter and explicit controls because its scope is educational, but the ownership principle is the same.

## Routing is a policy decision

A hybrid application can use local inference when available and a cloud service when explicitly allowed. The key word is explicitly. A failed local download should not silently transmit a private document elsewhere. Treat fallback as a named route with its own consent, capability, cost, and data-policy conditions.

The included routing function returns local first, cloud only when allowed and nonsensitive, and unavailable otherwise. The `sensitive` flag in the UI is an educational input to this policy. It is not an authoritative data-classification service. A real system should derive restrictions from trusted document metadata and organizational policy as well as user choices, and enforce them on the server.

The order of decisions matters. If sensitive content is blocked from cloud transfer, checking that rule after making a network request is too late. If a local model is ready, a cloud preference should not be assumed merely because the remote model is more capable. A good interface names the selected route and lets users understand any change before data crosses a boundary.

A route can be unavailable for legitimate reasons: no supported GPU, no local model, no cloud permission, policy restrictions, or no network. An honest unavailable state is a useful product behavior. It allows a deterministic search view or an export path to remain helpful without falsely claiming inference occurred.

## Keep protocol versions explicit

If your internal event shape changes, version it deliberately or preserve backward compatibility. A browser tab can remain open while the backend is deployed. It may receive a new event type from a newer server. Rejecting an unknown event with a useful message can be safer than concatenating unexpected fields into the answer.

For a deployed application, consider a request identifier and protocol version in the request or response envelope. Those fields make traces and compatibility failures easier to connect. They do not replace authentication or validate the model's content. The small course fixture omits a version-negotiation service because both ends ship together, while keeping the event parser narrow and inspectable.

## Debug failures by boundary

If `npm ci` fails, inspect package access and runtime compatibility. If the development page loads but `/api/fixture` fails, check whether the course server is running and whether the URL uses the documented development environment. If parsing fails, capture a synthetic response and inspect framing. If the cloud route returns 503, check server configuration without exposing secrets.

A 400 indicates invalid application input; 413 indicates the body-size limit; 415 indicates a mismatched content type. A provider error becomes a controlled gateway failure rather than leaking raw upstream content. An abort may be an expected user action, while a timeout indicates the application's waiting policy was exceeded. Do not flatten all of these into “AI failed.”

The server intentionally omits automatic retries. Retrying an arbitrary operation can duplicate side effects, and even text-generation retries can add cost or produce different content. A production retry policy should distinguish transient network failures, rate limits, permanent validation errors, and ambiguous completion. Bounded exponential backoff with jitter is useful only after deciding that retrying is semantically safe.

As an optional application, run the fixture, interrupt it, run it again, and navigate away while it streams. The interface should remain coherent. Then choose each routing combination and inspect the result. These experiments develop the systems intuition needed for the more specialized libraries: asynchronous ownership, typed boundaries, and explicit data movement remain the same even when the model API changes.

The next chapter adds evidence. We will turn a question into a ranked set of passages, distinguish lexical overlap from semantic embeddings, and construct a prompt whose sources can be inspected before any model runs. That separation makes a document assistant easier to debug and evaluate.
