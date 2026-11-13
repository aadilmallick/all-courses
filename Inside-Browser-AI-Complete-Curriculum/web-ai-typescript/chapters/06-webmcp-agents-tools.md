# 6. Expose meaningful application actions with WebMCP

An agent trying to use a website can infer meaning from pixels and DOM structure, or the website can expose explicit operations such as “search course notes.” The central problem in this chapter is defining those operations so they are discoverable, well scoped, validated, and connected to the same application logic used by people. WebMCP is the browser-facing mechanism we will study; an LLM remains a separate component.

The prerequisites are runtime validation from chapter 2, the retrieval function from chapter 3, and resource ownership from chapter 4. We will expose a read-only search operation imperatively through TypeScript and declaratively through a form. Then we will examine a bounded agent loop and the additional controls required before exposing consequential actions.

The complete implementation is [webmcp.ts](../src/webmcp.ts), [declarative.ts](../src/declarative.ts), and [agent-loop.ts](../examples/agent-loop.ts). The companion's sixth experiment deliberately distinguishes a direct function call, native registration, native discovery/execution, and a normal HTML form enhanced with experimental annotations. A direct call succeeding does not establish that native WebMCP exists.

## Start with the application operation

Our operation accepts a query and returns public course-note passages. It does not choose a model, generate an answer, modify data, or infer a user identity. This narrow contract makes its behavior understandable to both a human reviewer and an agent. The same `searchNotes` function can serve a button, a form, and an agent tool.

This shared-function design matters because duplicated paths drift. If the visible UI checks input length but the agent callback does not, the tool path can bypass a real constraint. If the UI applies tenant permissions but the tool trusts a model-supplied tenant field, the agent integration has created an authorization flaw. The correct abstraction is a shared validated domain operation, with presentation-specific adapters around it.

The tool description should state what the operation does and what it returns. “Search public course notes and return matching passages with source IDs” is clearer than “help the user with anything.” Broad descriptions encourage incorrect selection and make side effects hard to assess. A good description also names important limitations, such as the collection scope and whether data is changed.

Tool metadata is untrusted input from an agent platform's perspective. A malicious page can publish a misleading description or embed instructions in it. As an application author, write accurate metadata; as an agent integrator, do not assume every tool's declared purpose proves its behavior. Technical validation and policy enforcement must remain outside natural-language descriptions.

## Separate WebMCP, MCP, and inference

The Model Context Protocol is a host-client-server protocol for exchanging tools and other context. Its architecture uses JSON-RPC and negotiated capabilities. A host can manage clients connected to local or remote servers. The [MCP architecture specification](https://modelcontextprotocol.io/specification/2025-11-25/architecture) is the relevant primary source for that network/process model.

WebMCP exposes page functionality through browser interfaces and form annotations. It does not make the page automatically listen on an HTTP MCP endpoint, implement every MCP primitive, or connect it to every installed assistant. Browser and agent integration determine how registered page tools become available to a user-facing agent.

Inference is yet another concern. WebLLM can generate text locally. Chrome's Prompt API can invoke a browser-managed model. A cloud service can host a larger model. Any of those might participate in an agent system, but registering a WebMCP tool does not load or select one. Conversely, a page can expose useful tools even when it contains no embedded chat model.

| Mechanism | Main role | What it does not automatically provide |
| --- | --- | --- |
| WebLLM | Local model inference | Page-tool discovery or authorization |
| Chrome AI APIs | Browser-managed AI tasks | Remote MCP server transport |
| MCP | Host/client/server context protocol | Browser-native page registration |
| WebMCP | Page operations for agent-capable environments | Model weights or universal agent availability |

This separation helps you ask the right integration question. “Can my model call this function?” involves the application's planner and dispatcher. “Can an external browser agent discover this page tool?” involves WebMCP support and host integration. “Can another application connect to a remote service?” involves a protocol and authentication deployment. Similar vocabulary does not collapse those boundaries.

## Use a dated experimental baseline

The inspected WebMCP community report is dated 12 November 2026 and explicitly is not a W3C Standard. Chrome's documentation describes origin-trial and local-development access. This edition therefore teaches WebMCP as an experimental progressive enhancement. The [community report](https://webmachinelearning.github.io/webmcp/) and [Chrome overview](https://developer.chrome.com/docs/ai/webmcp) establish that status; actual browser execution is recorded separately in the verification report.

The current baseline uses `document.modelContext`. Older examples often use `navigator.modelContext`, synchronous registration assumptions, or an `unregisterTool` method. This course does not silently blend those eras into one fabricated interface. Registration is awaited, lifetime cleanup uses an abort signal, and discovery/execution follow the current documented shape.

The inspected Chrome guide also notes changes around unregistering while executions are active and object-form execution arguments. These details can differ across experimental browser versions. Pin the browser/channel used for an integration test and record the exact behavior. A structural TypeScript declaration cannot make an older experimental implementation follow a newer draft.

For local testing, Chrome's overview describes the `enable-webmcp-testing` flag. Enabling it is a developer action with browser-specific consequences, not a requirement to read the book. The companion reports native absence gracefully and keeps ordinary search usable. A successful production deployment should not require ordinary users to discover hidden flags just to access the core application.

## Define the input schema and runtime parser

Our tool takes one property, `query`, a nonempty string up to 200 characters. The JSON Schema describes this contract to a browser or agent. `additionalProperties: false` says extra fields are outside the expected shape. The runtime parser independently checks the same constraints because metadata is not a complete enforcement boundary.

```ts
const inputSchema = {
  type: 'object',
  properties: {
    query: { type: 'string', minLength: 1, maxLength: 200 }
  },
  required: ['query'],
  additionalProperties: false
};

console.log(JSON.stringify(inputSchema, null, 2));
```

This complete program constructs the schema object. It does not register a tool. The distinction is useful: a schema is data describing inputs. The callback and browser registration give that description executable meaning. A model proposing a schema-shaped value still has not demonstrated that the query is useful or authorized.

The course's `parseSearch` receives `unknown`, checks the container, rejects extra keys, requires a string, rejects whitespace-only queries, and enforces the maximum length. It returns a trimmed query. The limit is an application policy to keep the educational operation bounded, not a universal WebMCP maximum.

When adapting this pattern, validate identifiers, ranges, enumerations, and relationships between fields. A start date before an end date is a domain constraint beyond checking that both are strings. An order ID must belong to the current user. A URL may need an allowlist. JSON Schema helps communicate shape, while application code enforces the full business contract.

## Register the imperative tool

The complete registration wrapper first checks for native support, creates a lifetime controller, and awaits `registerTool`. Its callback validates input through `searchNotes`, checks execution cancellation, updates the visible result, and returns a serializable object. The controller is returned indirectly as a cleanup function owned by the current view.

```ts
import { registerSearch } from '../src/webmcp.ts';

export async function enableSearchTool(
  resultView: HTMLElement
): Promise<() => void> {
  return registerSearch(result => {
    resultView.textContent = JSON.stringify(result, null, 2);
  });
}
```

This exported browser integration function is complete within the project. Its caller stores and invokes the returned cleanup on unmount. The actual tool definition is intentionally centralized in `webmcp.ts`, keeping the name, schema, annotations, and parser aligned. The [Chrome imperative guide](https://developer.chrome.com/docs/ai/webmcp/imperative-api) documents the browser methods; our surrounding application code supplies the validation and ownership policy.

The tool's annotations say it is read-only, its returned content should be treated as untrusted, and it is not consequential. These are descriptive hints for the browser and agent ecosystem. They do not replace application authorization or guarantee that every host will apply a particular confirmation experience. An annotation falsely claiming read-only behavior cannot make a mutating callback safe.

Returning a plain object keeps the operation's result easy to inspect and serialize. Avoid returning DOM nodes, functions, cyclic structures, or secrets accidentally captured from application state. A tool result should contain the minimum information needed for the requesting task. In a real authenticated application, even read-only results can disclose sensitive information.

## Registration lifetime and execution lifetime are different

The registration controller determines whether the tool remains available for future discovery. The execution callback receives a separate signal representing an individual invocation's cancellation. Do not confuse the two. Removing a tool from the current view does not necessarily mean an already-started external transaction was rolled back.

The current experimental behavior permits unregistering through aborting the registration signal, and newer Chrome behavior separates that removal from breaking in-flight executions. Because this is version-sensitive, the code uses only the documented lifetime mechanism and the book avoids inventing an `unregisterTool()` call. Tests of a particular browser must verify the actual contract they depend on.

For a long-running read, pass the execution signal to a fetch or other cancellable work. Check it before expensive computation and before producing a result. For a write, cancellation can race with a commit. The server must represent whether the action was not started, pending, committed, failed, or unknown. A local promise rejection cannot by itself establish the real-world result.

Framework integrations should tie registration to component or route ownership. Registering on every render can create duplicates or stale callbacks. Removing a view should release its registrations. If a tool is intended to remain global, place it in a global application owner and ensure it reads current authorized state rather than a stale closure captured at initial mount.

## Discover and execute through the browser

The native discovery method returns registered tool descriptors available to the calling document under the browser's rules. Find the tool by its stable name, then pass the descriptor and an input object to native execution. This exercises the browser-mediated path. Calling `searchNotes()` directly bypasses discovery and proves only the underlying function behavior.

```ts
import { nativeContext } from '../src/webmcp.ts';

export async function nativeSearch(query: string): Promise<string | null> {
  const context = nativeContext();
  if (!context) throw new Error('Native WebMCP is absent.');
  const tools = await context.getTools();
  const tool = tools.find(candidate => candidate.name === 'search_course_notes');
  if (!tool) throw new Error('Search tool has not been registered.');
  return context.executeTool(tool, { query });
}
```

The returned value can be null for a navigation-related result in the documented contract. The companion handles that explicitly. Do not assume every tool produces a JSON string with a particular envelope unless your tool contract guarantees it. Different transports and host adapters can normalize outputs differently.

The lab has separate buttons for registration and discovery/execution, so you can diagnose absence, registration failure, missing discovery, callback failure, and rendering independently. A browser extension's agent integration is another layer beyond this same-page test. The verification report does not claim an external assistant selected and executed a tool merely because a native API was present.

## Enhance an ordinary form declaratively

A form already describes named fields, labels, validation, and submission. WebMCP's declarative approach adds attributes identifying a tool name and description, with optional parameter descriptions. The browser can derive structured inputs from the form. The ordinary human interaction should continue to work when the experimental feature is absent.

The course builds the form in TypeScript so the behavior and cleanup remain visible in one source file. It sets `toolname`, `tooldescription`, and a parameter description on the query input. It adds `toolautosubmit` only because the operation is a read-only synthetic search. A consequential workflow should not copy that choice blindly.

The [declarative API guide](https://developer.chrome.com/docs/ai/webmcp/declarative-api) describes the form annotations and experimental submit-event extensions. When an agent-invoked submission supports `respondWith`, the handler supplies a promise for the result after preventing ordinary navigation. The same handler also renders the result for a human submission. Both paths call `searchNotes` and therefore share runtime validation.

The form's input is required and has a maximum length. Browser form validation improves human interaction, while the shared parser remains authoritative for the domain function. Native attributes alone do not protect an operation from other invocation paths. A server receiving a related request must validate it again under the authenticated user's permissions.

## Keep agent feedback visible and accessible

The user should be able to understand what an agent did. A tool invocation can update the same result area, selected filters, or draft view that a manual operation would update. Avoid hidden mutations that leave the visual interface inconsistent with application state. Shared context is useful only if the user can inspect the resulting state.

Use meaningful labels and focus indicators for the ordinary interface. The experimental declarative API includes tool-activation and cancellation signals, but those do not replace accessible form structure. A labeled search field and a visible result area are useful to people and assistive technology regardless of WebMCP support.

Do not flood a screen reader with every partial token or low-level tool event. Announce important state changes such as searching, results ready, or failed. Keep long content in a readable region. If an agent changes a draft, preserve the original and show the revision so the user can understand the difference before accepting it.

The companion uses a plain result view and a polite live region for the declarative form. It is a teaching interface, not a complete accessibility certification. A production audit should test keyboard navigation, focus after agent actions, announcements, zoom, reduced motion, and the interaction with the actual agent host.

## Origins and embedded documents

An origin is the combination of scheme, host, and port. `https://app.example` and `https://widget.example` are different origins even if one embeds the other. WebMCP's current draft includes origin and permissions-policy controls. Do not assume that registering a tool in one frame exposes it to every page or every tab.

The inspected design uses explicit delegation for cross-origin frame access, provider-side exposure to selected origins, and caller-side requests for selected origins. These are distinct gates. An iframe's `allow="tools"` is not a blanket statement that every parent can invoke every operation. The provider's `exposedTo` and caller's `fromOrigins` participate in the current model.

This course's runnable lab stays same-origin. The cross-origin material is a design explanation tied to the dated draft, not an executed integration. If you build a partner widget, test discovery, invocation, navigation, and revocation with the exact embedded origins and browser version. Preserve separate trust domains even when both sides opt in.

Cross-origin permission also does not authorize arbitrary business actions. A partner can be technically allowed to discover a search tool while the authenticated user still lacks access to a particular record. Browser isolation and application authorization operate at different levels. Treat cross-origin descriptions, arguments, and results as untrusted data.

## An agent is a controlled loop around decisions

A useful working definition of an agent is a system that repeatedly observes context, chooses a next step, invokes an allowed operation, and uses the result to continue toward a goal. The planner may be an LLM, but the loop and dispatcher are ordinary software. An agent is not created merely by adding the word “agent” to a prompt.

The included `runAgent` accepts a planner function that returns unknown data. It validates each decision, allows only one named search operation, checks cancellation, appends the result to history, and limits the number of steps. A final-answer decision returns text. An unsupported operation or exhausted budget produces an error rather than an unbounded loop.

The executable example uses a deterministic planner fixture. It requests one search and then returns a labeled completion message. This proves the control flow and validation path without claiming model planning occurred. Run `node examples/agent-loop.ts` from the project root. A real planner adapter would call a supported model and parse its output into the same bounded decision contract.

This interface is intentionally narrow:

```ts
type Decision =
  | { type: 'tool'; name: 'search_course_notes'; arguments: { query: string } }
  | { type: 'answer'; text: string };
```

The actual runner still parses unknown values rather than trusting that union. A static type helps the application author reason about expected variants; an external model can produce invalid JSON, extra fields, unsupported names, or an endless sequence of tool requests. The dispatcher decides what can execute.

## Give the loop budgets and stopping conditions

A maximum step count bounds one dimension of work. Also consider wall-clock time, generated tokens, tool-call cost, response size, and concurrent operations. A model can remain within a step count while requesting an expensive operation. A tool can hang unless it has its own timeout. Budgets belong at the layer where the resource is consumed.

Define success in application terms. “Found relevant public passages and returned them” is observable. “The agent seems satisfied” is not a reliable stopping condition. If an answer requires evidence absent from the tools, the correct result may be an explicit limitation. Do not add more iterations solely because the model continues proposing actions.

Preserve a trace of decisions and outcomes suitable for debugging, with sensitive content minimized. Record the tool name, validated argument category, duration, status, and request identifier. A full transcript can contain private documents and should not automatically become an analytics event. Operational visibility and data minimization must be designed together.

Use deterministic fixtures to test loop mechanics and separate real-model evaluations to test planning quality. A scripted planner passing a test does not establish that an LLM will select the right tool. Conversely, an LLM succeeding once does not establish that unsupported tool names or infinite loops are safely handled.

## Consequential actions need a stronger transaction design

Search is read-only. Purchasing, sending a message, deleting a record, or changing account access creates a different risk and authority model. A tool description should state the real effect, but prose and annotations are insufficient. The server must verify the authenticated user, exact target, allowed operation, and any required confirmation bound to the specific proposed action.

A common pattern is prepare, review, commit. Preparation creates an immutable proposal containing the exact fields and a short-lived identifier. The user reviews that proposal. Commitment references the same proposal and is checked server-side. If the target or amount changes, the confirmation no longer applies. This is a design pattern for an application, not a browser API invented by this course.

Use idempotency when retries could duplicate an action. An idempotency key identifies one intended operation so a repeated request can return the existing result instead of repeating the effect. The key must be scoped to the authenticated user and bound to the action's parameters. Merely generating a random string in the browser does not implement transactional idempotency without server storage and enforcement.

After a timeout, the result may be unknown. Query operation status before retrying a purchase or send. A cancel request cannot undo a committed transaction. The interface should distinguish “not started,” “pending,” “completed,” “failed,” and “status unknown” rather than displaying a reassuring cancellation message that overstates what happened.

## Prompt injection and tool-output trust

Tool results can contain third-party text. A retrieved note might instruct the model to call another tool, disclose context, or change the user's goal. The agent should treat that content as data from a source with limited authority. The application should expose only the capabilities required for the task and validate every proposed invocation independently.

The WebMCP draft explicitly discusses metadata poisoning, output injection, intent misrepresentation, and privacy concerns. This chapter's broader application advice follows from the same boundary: a description or result can influence a model but should not grant new privileges. Source-level hints such as untrusted-content annotations are useful signals, not complete defenses.

A read-only answer stage with no mutation tools has a smaller action surface than a general agent with browser navigation, arbitrary fetch, and sending tools. Tool granularity matters. A narrow `search_course_notes` operation is easier to constrain than an unrestricted “run JavaScript” operation. Prefer domain operations whose inputs and effects can be validated meaningfully.

The capstone deliberately stops at evidence inspection, generated drafts, and read-only search exposure. It does not send messages, purchase services, or modify external accounts. Optional projects describe how to reason about such extensions, but the delivered application never claims that a model's request alone is sufficient authorization.

## Design tools around stable domain concepts

A tool named after a CSS selector or current screen position is fragile. A tool named `search_course_notes` expresses a domain operation that can survive a layout redesign. The visible UI and tool adapter can change independently while both call the same validated function. This is one reason structured operations can be more dependable than a long sequence of inferred clicks.

Avoid a tool for every internal implementation detail. An agent should not need to know which tab must be opened before a query can be parsed if the application can expose one coherent search operation. At the same time, avoid one all-powerful tool with an unbounded instruction string. Useful granularity groups a meaningful task with inputs and effects you can validate.

Return structured outcomes that distinguish success, empty results, validation failure, and unavailable resources where the host contract permits it. A sentence saying “done” is hard for an agent or test to inspect. A result containing source IDs and passages gives the next step concrete evidence. Keep error messages useful without leaking sensitive implementation details.

Version tool contracts deliberately. Changing a field's meaning while retaining the same name can break planners and saved workflows. If compatibility matters, introduce a versioned schema or a new tool name and deprecate the old contract under a clear policy. Experimental browser API changes are already one moving layer; avoid unnecessary ambiguity in your own domain interface.

## Test tool semantics independently of browser discovery

The shared function should have deterministic tests for valid input, whitespace, oversized queries, extra properties, empty results, and tenant isolation. Those checks remain valuable even when native WebMCP is unavailable. They establish the operation's behavior before introducing a browser or agent host.

Then test native registration, discovery, execution, and removal in a compatible browser. Finally test an actual external agent journey if that integration is part of the product. Each layer adds a different failure surface. A report should identify which layers were observed so a reader can distinguish a well-tested function from a fully exercised agent experience.

For consequential tools, include ambiguous completion and duplicate-request cases in server tests before agent testing. A planner's good intentions do not eliminate network retries or timeout races. The domain operation should remain safe and inspectable even if the caller repeats a request or supplies a misleading natural-language justification.

## Diagnose and extend responsibly

If direct search works but native registration fails, inspect browser support and the experimental API baseline. If registration succeeds but discovery misses the tool, inspect lifetime, origin, frame policy, and whether the correct document owns the registration. If native execution reaches the callback but fails, inspect validated arguments and domain logic. If an external agent never selects the tool, evaluate its metadata and the host's actual integration separately.

As an optional application, use the direct call, register the tool when native support is available, discover and invoke it, then reset the view and verify removal under your browser's contract. Submit the ordinary form with and without native support. Finally run the bounded planner fixture and its rejection tests. The next chapter turns these observations into a systematic evaluation and production discipline, covering security, latency, costs, observability, and deployment boundaries.
