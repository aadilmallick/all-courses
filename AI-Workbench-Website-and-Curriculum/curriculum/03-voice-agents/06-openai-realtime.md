# OpenAI Realtime API


## What to learn, and what changed

The OpenAI Realtime API supports speech-to-speech conversations in which the model works with audio, maintains conversation state, and can use tools. The current official quickstart starts with the Agents SDK for a browser app. It also distinguishes **GPT-Live**, a separate voice architecture that can continue a full-duplex conversation while delegating work to a backend. Do not mix the two APIs' session schemas or assume a Realtime example is a GPT-Live example. [Realtime quickstart](https://developers.openai.com/api/docs/guides/realtime), [GPT-Live overview](https://developers.openai.com/api/docs/guides/live)

This chapter teaches Realtime through **Incident Briefing**, an original read-only assistant that explains the state of a synthetic deployment incident. It can query a fixture, summarize the current status, and respond to corrections. It cannot restart services or declare an incident resolved. The focus is the direct speech session and its relationship to application truth.

Plan four to six hours for the first integration. You need browser JavaScript, basic server programming, a microphone, and API access for a live session. You can run the event-state experiment without an account. The API examples here are conceptual implementation guidance; no API key was acquired or used, and no audio session was run while writing the chapter.

## Start from the voice problem

A text assistant can wait for a complete message before responding. In voice, the person expects pauses, interruptions, and repairs to feel natural. The application must decide when a turn is ready, which response is current, what audio has actually been played, and how tool results influence the next answer. These concerns persist even when one model handles both speech understanding and speech generation.

Incident Briefing might hear: “What happened to the staging deployment?” While the assistant is explaining, the person adds, “I mean the one from this morning, not yesterday.” The application must preserve that correction. If a lookup for yesterday returns after the correction, the result is still factually valid but no longer relevant. A direct audio model does not eliminate stale-result handling in your business layer.

The success condition is concrete: the assistant identifies the requested incident, uses the latest fixture result, separates confirmed facts from unknowns, and accurately states what it did. A warm voice and fast first word do not compensate for summarizing the wrong incident.

Keep the first project read-only. You can study turn timing, tool selection, and context without giving a spoken command authority over production infrastructure. When you later add actions, preserve a separate authorization and confirmation policy in the server.

## Prerequisites that explain the architecture

**WebRTC** is a transport commonly used for realtime media. In a browser voice app, audio travels as media tracks while a data channel carries control events. **WebSocket** is another persistent connection style that can carry events and audio data, but you own more of the media handling in a lower-level implementation. Use the official connection guide for the chosen route rather than combining fragments from both. [WebRTC guide](https://developers.openai.com/api/docs/guides/voice-webrtc?api=realtime)

An **ephemeral client credential** lets a browser establish a session without receiving your long-lived project key. A trusted server creates it under the appropriate application policy. Short lifetime is useful, but it does not replace authentication, quotas, or tool authorization in your own app. Do not expose your project API key in a browser bundle.

A **conversation item** is information in the interaction history. A **response** is generated output associated with the conversation. A **delta** is one increment of a streamed output. Delta does not mean complete sentence or complete action. Treat completion signals and identifiers as important, not optional decoration.

**Voice activity detection**, or VAD, helps determine speech activity and turn boundaries. It does not establish the meaning or authority of an utterance. A person saying “yes” in background conversation is not automatically approval of a tool operation. Application state and a clear preceding question still matter.

Finally, understand **cancellation**. Stopping generation, stopping local playback, and invalidating a business operation are different events. Some audio may already have been played when generation stops. A tool may finish after the response that requested it was superseded. Design each boundary explicitly.

## Choose a starting abstraction

The current Realtime quickstart uses `RealtimeAgent` and `RealtimeSession` from `@openai/agents/realtime`. That is a useful starting point when you want the SDK to coordinate common session behavior. The lower-level transport guides are appropriate when you need direct control of connection and event handling. [Realtime quickstart](https://developers.openai.com/api/docs/guides/realtime)

Begin with the SDK unless a requirement forces the lower-level path. “I want to understand the protocol” is a valid learning reason for direct events; “a tutorial used this code” is not evidence that the complexity is necessary for your application. Keep the business tool functions independent so you can change transport without rewriting incident lookup rules.

For the learning architecture, use three pieces:

```text
Browser: microphone, speaker, start/end controls, session UI
Application server: user authentication, ephemeral credential creation,
                    read-only incident lookup, usage controls
Realtime service: audio conversation and model interaction
```

This is an original system sketch. It deliberately leaves the incident service behind your server rather than making the browser's possession of a session credential sufficient to retrieve arbitrary incident data. The server should derive which incident records the user may access from application identity.

## Establish a browser session from current docs

The current official example names `gpt-realtime-2.1`. Treat that as the model shown in the documentation checked for this guide, not a guarantee of access in your account or an eternal default. Confirm the current model and entitlement before implementation. Do not replace a model silently when following a versioned example. [Realtime quickstart](https://developers.openai.com/api/docs/guides/realtime)

In a browser project with the Agents SDK installed according to its current setup guide, the central integration looks like this. It is a **browser-module fragment**, not a complete application or server:

```javascript
import { RealtimeAgent, RealtimeSession } from '@openai/agents/realtime';

const tokenResponse = await fetch('/api/realtime-token', { method: 'POST' });
if (!tokenResponse.ok) throw new Error('Session could not be authorized');
const { value: ephemeralKey } = await tokenResponse.json();

const agent = new RealtimeAgent({
  name: 'Incident Briefing',
  instructions: 'Explain only the synthetic incident facts provided by tools.'
});
const session = new RealtimeSession(agent, { model: 'gpt-realtime-2.1' });
await session.connect({ apiKey: ephemeralKey });
```

`/api/realtime-token` is an original route you must implement, not an OpenAI endpoint. The application server authenticates the person, applies usage policy, and returns the ephemeral credential. Follow the official WebRTC guide for the current server request and response schema. Do not cache that credential in a shared cache or print it into logs.

Run connection creation from an intentional user action in the real UI. Provide a visible end control, connection status, and an understandable error state. Follow the SDK's current cleanup method when ending the session; do not assume removing a button or changing a React state variable closes the underlying media connection.

## Keep the server credential boundary explicit

The current GA documentation uses `POST /v1/realtime/client_secrets` to create ephemeral credentials and `/v1/realtime/calls` for WebRTC establishment. Older beta tutorials use different headers and event shapes. Consult the current migration notes before copying an older implementation. [Realtime quickstart](https://developers.openai.com/api/docs/guides/realtime), [WebRTC guide](https://developers.openai.com/api/docs/guides/voice-webrtc?api=realtime)

Your credential route should not be a public unlimited token dispenser. Authenticate the application user where appropriate, rate-limit session creation, and bind the configuration to the task you intend to offer. A browser-supplied “admin” field should not select a more powerful tool set. Return a short, user-appropriate failure if the session cannot be authorized.

Store the project key in the server's secret mechanism. A local environment file can be appropriate for development if it is excluded from source control. Production secret management depends on your host. Do not place the key in a frontend environment variable merely because the framework makes it convenient; some such variables are intentionally bundled into public assets.

Keep session authorization separate from incident authorization. A person may be allowed to use the voice feature while lacking access to a particular incident. Each lookup should enforce the relevant record permission. The model's request is a proposal for the server to validate, not a bypass around your application policy.

## Design the agent's instructions

Use an original prompt that tells the assistant how to handle evidence and uncertainty:

```text
You are Incident Briefing, an AI assistant for synthetic deployment incidents.
Help the user understand the incident they identify. Ask for clarification
when the environment or date is ambiguous. Use the incident lookup tool
for status, impact, timestamps, and mitigations. State what is confirmed
and what remains unknown. Speak in short sections and allow interruption.
When the user corrects the incident or environment, use the correction.
Do not restart services, change incident state, or claim that you did.
If lookup fails, say that you cannot verify the current status.
```

Avoid embedding a changing incident timeline in the system prompt. A tool result should supply current facts with an incident identifier and retrieval time. A prompt can establish how to use those facts, but it should not become an unversioned copy of the incident database.

Keep technical details appropriate to speech. Saying “the staging rollout failed during a schema check” may be useful; reading a twenty-line stack trace aloud is usually not. Display exact identifiers and links in the surrounding UI when possible, while the voice explains the implication.

## Build the read-only business function first

Here is a complete offline Node.js program. Save it as `incident_demo.mjs` and run `node incident_demo.mjs`. It makes no model or network requests. The fixture is intentionally synthetic.

```javascript
import assert from 'node:assert/strict';

const incidents = new Map([
  ['staging-morning', {
    id: 'demo-inc-41', environment: 'staging', status: 'investigating',
    impact: 'Demo rollout paused; production is unaffected.',
    confirmed: ['Schema validation failed before rollout.'],
    unknown: ['Whether the migration or fixture data caused the failure.']
  }],
  ['staging-yesterday', {
    id: 'demo-inc-40', environment: 'staging', status: 'resolved',
    impact: 'Synthetic test incident.', confirmed: ['Fixture corrected.'], unknown: []
  }]
]);

function lookupIncident(key) {
  if (typeof key !== 'string' || key.length > 80) {
    return {status: 'invalid'};
  }
  const incident = incidents.get(key);
  return incident ? {status: 'ok', incident} : {status: 'not_found'};
}

assert.equal(lookupIncident('staging-morning').incident.status, 'investigating');
assert.equal(lookupIncident('staging-yesterday').incident.status, 'resolved');
assert.equal(lookupIncident('production-unknown').status, 'not_found');
console.log(JSON.stringify(lookupIncident('staging-morning'), null, 2));
```

The outer `status` describes the lookup operation. The nested incident's `status` describes the incident. Keeping both avoids ambiguity: a successful lookup can return an unresolved incident. The `confirmed` and `unknown` lists give the assistant a clear distinction to preserve in speech.

Register the function using the tool interface in your installed SDK and the current Realtime tools guide. The function name, schema, and description should make the read-only scope clear. Do not expose shell execution or a broad incident-management credential just to answer a status question. [Realtime with tools](https://developers.openai.com/api/docs/guides/realtime-mcp)

## Understand turn detection as a user-experience decision

The official VAD guide describes automatic turn-detection behavior and configurable options. Use it to understand the current modes and event semantics, then test with your intended users and environment. No single silence setting is best for every speaker or task. [Voice activity detection](https://developers.openai.com/api/docs/guides/realtime-vad)

Someone thinking aloud may pause before the most important clause. Someone asking a short status question may expect an immediate answer. Tune against representative scenarios rather than one developer speaking quickly into a headset. Include accents, technical terms, quiet speech, and ordinary background noise where those are part of the intended use.

Measure two kinds of interruption errors. A false interruption stops the assistant when the person did not intend to take the turn. A missed interruption continues speaking after a meaningful correction. Both are frustrating, but they may need different remedies. A count of “interruptions handled” hides the distinction.

For actions, do not equate end-of-turn detection with consent. Even a perfectly detected “yes” may answer the wrong question if your previous message contained two options. Make confirmation questions specific, and attach approval to the exact operation your backend will validate.

## Learn event handling with a reducer

Realtime applications benefit from a deterministic state model even when model behavior is probabilistic. This complete offline example demonstrates stale-response rejection. Save it as `event_reducer_demo.mjs` and run it with Node.js. **These event names are application-defined teaching events, not OpenAI protocol events.**

```javascript
import assert from 'node:assert/strict';

function reduce(state, event) {
  switch (event.type) {
    case 'intent.changed':
      return {...state, revision: state.revision + 1,
        incidentKey: event.key, answer: '', pending: true};
    case 'lookup.completed':
      if (event.revision !== state.revision) return state;
      return {...state, pending: false, result: event.result};
    case 'answer.delta':
      if (event.revision !== state.revision) return state;
      return {...state, answer: state.answer + event.text};
    case 'session.ended':
      return {...state, ended: true, pending: false};
    default:
      return state;
  }
}

let state = {revision: 0, incidentKey: null, answer: '', pending: false};
state = reduce(state, {type: 'intent.changed', key: 'staging-yesterday'});
const oldRevision = state.revision;
state = reduce(state, {type: 'intent.changed', key: 'staging-morning'});
state = reduce(state, {type: 'lookup.completed', revision: oldRevision,
  result: {status: 'resolved'}});
assert.equal(state.result, undefined);
state = reduce(state, {type: 'lookup.completed', revision: state.revision,
  result: {status: 'investigating'}});
state = reduce(state, {type: 'answer.delta', revision: oldRevision,
  text: 'Yesterday is resolved.'});
assert.equal(state.answer, '');
assert.equal(state.result.status, 'investigating');
console.log('Stale lookup and output were ignored.');
```

The reducer receives a state and event and returns a new state. The revision ties work to the intent that started it. Old work is ignored even if it completes successfully. This is stronger than hoping cancellation always arrives in time. In a live implementation, map current SDK events and tool requests into your application model carefully; do not send these invented event names to the API.

The example omits persistence, multi-tab coordination, and a real media player. That is intentional. It isolates one property you can test before adding the complexity of audio. Extend it only after you can explain which real events advance each state.

## Keep played audio and conversation history aligned

A generated response is not identical to an answer the person heard. If they interrupt after the first sentence, later context should not assume the rest was delivered. The current conversation guide explains the API's audio and conversation mechanisms; follow the SDK or transport-specific interruption path rather than manually appending full planned responses to history. [Realtime conversations](https://developers.openai.com/api/docs/guides/realtime-conversations)

For your own business state, track what was confirmed separately from what the assistant intended to say. If the assistant planned to ask “should I show the report?” but was interrupted before that question, a subsequent “yes” may not be meaningful approval. The safest repair is a short clarification linked to the current task.

Test interruption during a critical fact: the incident identifier, environment, or status. The next answer should recover the missing context without repeating a long obsolete explanation. Listening to the recording reveals problems that a complete generated-text transcript may hide.

Do not infer transport-level delivery from a server timestamp alone. The browser can be muted, disconnected, or playing buffered audio. Use the observations your chosen client exposes, and state their limits in your test report. “Generated” and “heard” should remain different words in your reasoning.

## Compare Realtime with GPT-Live and chained systems

The current GPT-Live guide describes a voice conversation that continues while a separately chosen backend agent works. Realtime uses its own session and tool model. Chained speech applications separate recognition, text reasoning, and synthesis. These are architectural choices, not interchangeable model names. [GPT-Live overview](https://developers.openai.com/api/docs/guides/live)

For Incident Briefing, Realtime is a reasonable learning route when you want direct speech interaction around a small read-only tool. If your application needs ongoing full-duplex conversation while a more extensive backend agent works, study GPT-Live's current delegation model separately. Do not migrate solely because a newer name exists; compare the behavior and integration boundaries your task needs.

A chained design can make intermediate text and provider choice easier to inspect. A speech-to-speech design may preserve aspects of spoken interaction differently. Evaluate the actual task: technical accuracy, interruption recovery, tool behavior, latency, and operating complexity. Avoid declaring one approach universally superior from a hello-world conversation.

Compare [LiveKit](01-livekit.md) and [Pipecat](02-pipecat.md) when you want a broader application framework, and [Vapi](03-vapi.md) or [Retell](04-retell.md) for managed assistant workflows. You may use some of these together, but every added layer should have a concrete purpose.

## Troubleshoot and measure the complete path

| Observation | First boundary to inspect | Controlled test |
| --- | --- | --- |
| Credential creation fails | Server identity, account access, request schema | Inspect redacted status and error category |
| Browser cannot connect | Transport setup and credential lifetime | Fresh credential with unchanged example |
| Correct incident requested, wrong facts spoken | Tool result and context | Fixed read-only fixture |
| Old answer continues after correction | Cancellation and intent revision | Delayed old lookup scenario |
| Session works but microphone stays active | Client cleanup | End, then inspect device capture state |
| Old tutorial events fail | Beta/GA schema mismatch | Compare current event reference and lockfile |
| Short first-word delay but long task time | Filler and tool latency | Measure time to useful factual content |

Keep timing measurements tied to stages: user speech end, turn acceptance, tool request, tool completion, first generated output, and first audible output where observable. Invented benchmark numbers are not useful. Your own slow traces reveal whether the issue is endpointing, network, tool execution, generation, or playback.

Budget with current audio/text usage accounting, selected models, context behavior, and your server costs. Include failed and abandoned sessions. A low per-minute price does not guarantee low cost per correctly completed task. Recheck current pricing and account limits before connecting a public client.

## Optional project and acceptance

Build Incident Briefing around two synthetic incidents. Include a visible start/end UI, a server credential route, one read-only lookup, and a trace linking intent revisions to tool results. Test ambiguous environment, changed date, missing incident, lookup failure, interruption during status, and a stale result arriving after correction.

Acceptance requires that production is never described as affected when only the staging fixture says so, unknown causes remain unknown, obsolete results do not overwrite the current answer, and no restart or resolution action is claimed. Report exact SDK/model configuration, which tests were offline, and which used real audio. A working connection alone is not a completed application test.

Use this prompt with a coding assistant:

```text
Use current official OpenAI Realtime documentation and inspect the
installed Agents SDK before coding. Build Incident Briefing with a
browser session, authenticated ephemeral-credential route, and one
read-only synthetic incident lookup. Keep the project key server-side.
Separate current intent, tool results, generated output, and played
audio. Reject stale results after an incident correction. Use current
GA schemas; do not mix GPT-Live or old beta events into this app.
Deliver a small diff, offline reducer tests, and a manual audio test
sheet. Report every live behavior not tested. Do not connect production
incident systems or grant shell/restart capabilities.
```

## A migration review for an existing voice prototype

If you already have a working older prototype, preserve a baseline before updating it. Record the dependency lockfile, model identifier, connection route, session settings, and a small set of synthetic recordings. Then compare the current documentation against the actual code. Similar names across beta, GA, and newer voice architectures are a reason to inspect schemas carefully, not evidence of compatibility.

Upgrade one boundary at a time. First make session establishment work with the intended current route. Then verify events and interruption. Then restore tools and application-specific context. This makes a failure localizable. Rewriting the transport, model prompt, and business functions together removes the evidence that would tell you which change mattered.

Include a negative test: deliberately send an invalid application-level incident identifier and verify that the backend rejects it without turning the error into an invented status. A migration can preserve a pleasant conversation while accidentally weakening validation. Also check cleanup after failed connection establishment; an error path can leave a microphone or pending task active even when the happy path closes correctly.

Document what you retained and why. Keeping Realtime is a reasonable choice when its session model fits the task. Exploring GPT-Live is a separate architectural experiment with its own acceptance cases. Avoid presenting either route as a mandatory upgrade without a concrete requirement and verified account support.

Keep a short release note with the migration evidence: which connection and tool cases passed, which audio cases were listened to, and which account-dependent behaviors remain unverified. This prevents a successful build or an offline reducer test from being mistaken for proof of a working microphone conversation.

## Sources and verification boundary

Official documentation checked **November 13, 2026**: [Realtime quickstart](https://developers.openai.com/api/docs/guides/realtime), [WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc?api=realtime), [Voice activity detection](https://developers.openai.com/api/docs/guides/realtime-vad), [Realtime conversations](https://developers.openai.com/api/docs/guides/realtime-conversations), [Realtime with tools](https://developers.openai.com/api/docs/guides/realtime-mcp), and [GPT-Live overview](https://developers.openai.com/api/docs/guides/live). Only official OpenAI sources were used for OpenAI product guidance.

The incident fixtures, event reducer, application route, test design, and engineering recommendations are original instructional examples. No model request, credential creation, browser audio connection, or paid API run was performed. Check current SDK syntax, model access, server controls, and pricing before a live implementation.
