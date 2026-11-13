# Twilio ConversationRelay


## Where ConversationRelay fits

Twilio ConversationRelay connects a phone conversation to your application through a WebSocket interface, handling speech recognition and speech output while your application supplies the conversational intelligence. It is useful when you want to retain your own language-model and business-logic layer inside a Twilio voice application. It is different from receiving raw call audio and implementing the entire speech pipeline yourself. [ConversationRelay overview](https://www.twilio.com/docs/voice/conversationrelay), [Product overview](https://www.twilio.com/en-us/products/conversational-ai/conversationrelay)

This chapter uses **Service Window**, an original assistant for a fictional developer platform's maintenance information. A caller can ask whether a maintenance window affects a demo service and hear a concise, catalog-backed answer. The assistant can offer a real human route when your application provides one. It cannot reschedule maintenance, change infrastructure, or promise that an outage is resolved.

Allow four to six hours for an initial integration. You need basic server programming, HTTP, WebSocket concepts, a Twilio account and suitable calling setup for live tests, and a secure publicly reachable application endpoint. The offline protocol examples require only Node.js. No phone number was purchased, call placed, or Twilio resource configured during authoring.

## Why this architecture exists

A telephone call is a continuous interaction. Your application may already know how to answer text questions, retrieve maintenance records, and call a language model. Rebuilding speech recognition, synthesis, media handling, and telephone routing around that logic is substantial work. ConversationRelay offers a boundary where your server can work primarily with conversational text and control messages while the service handles the speech connection.

That boundary is valuable, but it is not the whole application. Your server must manage each call's state, decide when to ask the model, stream useful output, handle interruption, protect credentials, and recover from backend failures. The maintenance database remains the source of truth. A phone connection does not give the model access to facts it has not retrieved.

For Service Window, the key risk is a confident wrong statement about impact. A caller asks, “Will the API be down tonight?” The answer depends on which API, which region, and which date/timezone. A useful agent clarifies the missing scope and consults the catalog. An unhelpful agent delivers a generic reassuring answer that sounds like an official commitment.

Define the job narrowly: identify the service, identify the window, explain confirmed impact and timing, and offer a next route when the information is unavailable. This gives you a testable first application and limits the number of policies hidden inside the phrase “AI receptionist.”

## Prerequisites in practical terms

**TwiML** is XML that tells Twilio how to handle a call. In this architecture, your HTTP route returns instructions connecting the call to ConversationRelay. **WebSocket** then provides a persistent connection for conversation messages. HTTP setup and WebSocket conversation handling are separate paths and need separate debugging evidence.

An **incoming prompt message** represents recognized caller speech according to the current protocol. An **outgoing text message** supplies text to speak. An **interrupt message** reports interruption of playback. These are protocol messages with documented fields, not arbitrary chat objects. Use the current reference rather than assuming an OpenAI, Vapi, or generic chat envelope will work unchanged. [WebSocket messages](https://www.twilio.com/docs/voice/conversationrelay/websocket-messages)

Understand the difference between a **call identifier** and a **business record identifier**. A call identifies one phone interaction. A maintenance identifier identifies an event in your system. Correlate them in logs without treating either as a user credential. Caller ID alone may not be sufficient authentication for protected information or account actions.

Also understand **streaming text**. A model may return tokens in pieces that contain leading spaces or partial words. Preserve the intended spacing when forwarding them for speech. Joining every token with a new space can corrupt punctuation; trimming every token can run words together. Test the transformation with simple text before blaming speech generation.

Read the [foundations](../reference/foundations.md) for service credentials, tool contracts, and asynchronous work. You do not need to become a telephone-network engineer to build the first bounded demo, but the intended delivery channel must be part of your test plan.

## Draw the complete request path

Use this original architecture sketch:

```text
Caller -> Twilio call handling -> your HTTP TwiML route
       -> ConversationRelay -> your WebSocket application
       -> maintenance lookup + chosen language model
       -> streamed text -> ConversationRelay speech -> caller
```

The HTTP route must be reachable by Twilio, and the WebSocket endpoint must accept the intended secure connection. A local server on your laptop is not automatically reachable from the internet. For development, follow Twilio's current onboarding guidance for a supported way to expose and test the endpoint. [Onboarding guide](https://www.twilio.com/docs/voice/conversationrelay/onboarding)

Keep three classes of secrets separate: Twilio account credentials, model-provider credentials, and maintenance-service credentials. They belong on the server. The maintenance credential should grant only the read access needed by the assistant. A telephone status service does not need a deployment administrator token.

For the first implementation, keep the model response deterministic or use a fixed answer before adding a live model. If a fixed sentence cannot make the round trip, an elaborate prompt will not help. Once speech transport works, attach the read-only lookup, then the model's wording layer.

## Connect with a minimal TwiML instruction

The documented TwiML noun is `<ConversationRelay>` nested under `<Connect>`. This minimal example shows the structure and an intentional placeholder for your secure WebSocket endpoint:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <ConversationRelay
      url="wss://YOUR_APPLICATION_HOST/voice"
      welcomeGreeting="Hello. I can explain the demo service maintenance schedule." />
  </Connect>
</Response>
```

This is not a complete server. Your HTTP route must return the XML using the appropriate content type and must follow the current request-validation and application setup guidance. The endpoint placeholder is not a real host. Do not paste credentials into the URL. [ConversationRelay TwiML reference](https://www.twilio.com/docs/voice/conversationrelay/conversationrelay-noun)

Keep the greeting short. The caller has not yet asked a question, so a long feature tour delays the task. Identify the assistant's role and supported scope, then invite the question. If your product requires an AI disclosure or recording explanation, implement the wording and behavior appropriate to that product and setting; do not invent a generic legal script in place of the actual requirement.

Confirm the first controlled test in this order: the HTTP route is reached, the returned XML is accepted, the WebSocket connects, the greeting is heard, and a caller prompt reaches the application. Store redacted diagnostic evidence for each step so you can localize failures.

## Learn the message shapes before adding a model

The current message guide documents caller prompt messages with `type: "prompt"`, recognized text in `voicePrompt`, and a `last` marker. Outbound text uses `type: "text"`, `token`, and a final marker for the talk cycle. The guide recommends streaming text as it becomes available and preserving token spacing. [WebSocket messages](https://www.twilio.com/docs/voice/conversationrelay/websocket-messages)

An illustrative inbound message is:

```json
{"type":"prompt","voicePrompt":"Does the demo API have maintenance tonight?","last":true}
```

An illustrative outbound message is:

```json
{"type":"text","token":"I will check the demo API schedule.","last":true}
```

These examples use the documented fields, but they are not a complete message catalog. Your handler must account for setup, errors, interruption, and other messages relevant to the options you enable. Do not crash the call because an expected non-prompt event reaches a handler written for one sample.

Choose how to handle partial prompts using the current protocol's semantics. A simple first implementation waits for a final prompt before asking the model. A more aggressive streaming design may do useful early work, but it must not treat provisional speech as final authorization. Correctness comes before shaving a small amount from a demo's response time.

## A runnable protocol-boundary experiment

Save this complete offline program as `relay_messages_demo.mjs` and run `node relay_messages_demo.mjs`. It exercises message routing with synthetic inputs. It does not open a socket, place a call, or connect to Twilio.

```javascript
import assert from 'node:assert/strict';

function createCallState() {
  return {pendingPrompt: '', turns: [], revision: 0, interrupted: false};
}

function receive(state, message) {
  if (!message || typeof message.type !== 'string') {
    return {status: 'invalid'};
  }
  if (message.type === 'interrupt') {
    state.revision += 1;
    state.interrupted = true;
    return {status: 'interrupt', revision: state.revision};
  }
  if (message.type !== 'prompt') return {status: 'ignored'};
  if (typeof message.voicePrompt !== 'string') return {status: 'invalid'};
  state.pendingPrompt += message.voicePrompt;
  if (message.last !== true) return {status: 'partial'};
  const text = state.pendingPrompt;
  state.pendingPrompt = '';
  state.turns.push({role: 'user', text});
  state.revision += 1;
  state.interrupted = false;
  return {status: 'turn', text, revision: state.revision};
}

function outgoing(tokens) {
  return tokens.map((token, index) => ({
    type: 'text', token, last: index === tokens.length - 1
  }));
}

const state = createCallState();
assert.equal(receive(state, {type: 'prompt', voicePrompt: 'Demo API ',
  last: false}).status, 'partial');
const turn = receive(state, {type: 'prompt', voicePrompt: 'tonight?', last: true});
assert.equal(turn.text, 'Demo API tonight?');
const response = outgoing(['The demo API', ' has a maintenance window.']);
assert.equal(response.map(item => item.token).join(''),
  'The demo API has a maintenance window.');
assert.equal(response.at(-1).last, true);
assert.equal(receive(state, {type: 'interrupt'}).status, 'interrupt');
console.log('Synthetic prompt, token-spacing, and interruption cases passed.');
```

This teaching adapter assumes its synthetic prompt pieces are additive. Before adopting that accumulation rule, verify the current message semantics and actual payloads for your configuration; some streaming systems emit revisions or full snapshots instead of additive pieces. The point is to test your adapter against observed protocol behavior, not to treat all partial-text systems identically.

The `revision` is an application technique for invalidating obsolete work. It is not a Twilio message field. A model request captures the revision that started it; the result handler checks whether that revision is still current before speaking. This protects against a late response after interruption or a corrected request.

## Add a maintenance lookup with explicit scope

Use a tiny synthetic catalog first:

```javascript
const maintenance = {
  'demo-api-us': {
    service: 'Demo API', region: 'US demo region',
    window: 'Synthetic example: November 18, 2026, 01:00–01:30 UTC',
    impact: 'Demo requests may fail during the window.',
    status: 'scheduled', productionAffected: false
  }
};

function lookupMaintenance(serviceKey) {
  if (typeof serviceKey !== 'string') return {status: 'invalid'};
  const record = maintenance[serviceKey];
  return record ? {status: 'ok', record} : {status: 'not_found'};
}
console.log(lookupMaintenance('demo-api-us'));
```

This is a complete offline fragment that can be placed in its own `.mjs` file. Its date is explicitly synthetic, not a real service announcement. The record distinguishes the lookup's success from the maintenance event's scheduled status. It also states that production is unaffected, preventing the example's scope from becoming ambiguous.

For real data, return the service, region, start/end timestamps, timezone, impact statement, and source revision or retrieval time. The model can then explain the result without guessing. If the person asks about “tonight,” resolve the intended date and timezone before deciding which window matches.

If no record is found, do not automatically say there is no maintenance. Your catalog may not cover that service or region. Return a coverage-aware result where possible. A service failure should be a separate error status. Unknown, none scheduled, and unavailable lookup are different answers.

## Write instructions for spoken status explanations

Use this original prompt in your own model layer:

```text
You are Service Window, an AI assistant for synthetic maintenance records.
Identify the service, region, and intended date when they are unclear.
Use lookup results for maintenance timing, status, and impact.
Explain one window at a time in concise spoken language. Preserve the
distinction between the demo environment and production. State the
timezone for a maintenance time. If the catalog does not cover the
request or lookup fails, say what cannot be verified and offer the
real support route supplied by the application. Do not reschedule,
restart, or claim a maintenance window is completed without evidence.
```

Keep the model's answer short enough to interrupt naturally. “The demo API has a scheduled thirty-minute window…” is easier to follow than a long incident bulletin. Offer additional detail after the essential impact and timing. Put exact timestamps and links in another channel if your product supplies one; do not claim to have sent them unless a tool did so.

Do not rely on the model to enforce which services the caller may inspect. Your lookup layer should apply access rules. For public status information, the policy can be simple. For private internal maintenance, require an appropriate authentication route rather than treating an incoming telephone number as universal proof of identity.

## Handle interruption and model streaming together

The message guide documents interruption information, including the portion of an utterance played before interruption. Use the current fields to understand what the caller may actually have heard. Generated text and completed playback are different forms of evidence. [WebSocket messages](https://www.twilio.com/docs/voice/conversationrelay/websocket-messages)

When interrupted, stop forwarding obsolete model output and cancel the request where your model client supports it. Also invalidate the request locally so a late callback cannot resume speaking. Cancellation alone is not enough because completion and cancellation may race. Keep a response or revision identifier in your application state.

Preserve token spacing as you stream. If a model gives `"maintenance"` followed by `" window"`, forward the leading space. If you trim both tokens, the spoken text may become “maintenancewindow.” If you add spaces around punctuation, the output may sound awkward. Write a small deterministic test for this transformation.

Choose interruption policy for the content. A short safety-critical notice may need different treatment from a long optional explanation, but the policy must match the product's actual requirements. Do not make every message uninterruptible to avoid handling cancellation; callers need a reliable way to correct the assistant and ask for a human.

## Design a real fallback route

A fallback is a behavior the application can perform, not a sentence promising that someone will help. If you support transfer, configure and test the actual Twilio call-handling route using the current documentation. If you only provide a phone number or website, say that honestly. Do not announce “transferring you” while leaving the caller in the same dead-end connection.

Test what happens when your WebSocket server disconnects, the model provider times out, and the maintenance service fails. Each may need a different response. The HTTP call flow should have an intentional continuation or failure path. A production caller should not hear endless silence because the application only implemented the happy path.

Keep the error explanation short: “I cannot verify the schedule right now” gives the caller useful status. A raw provider error, stack trace, or internal hostname does not. Log a redacted correlation identifier so support can investigate without exposing internal details in speech.

If the caller asks to end the conversation, make ending predictable. Test the actual call lifecycle, not only the model's goodbye. A model can say “goodbye” while a socket and call remain active. Your application should observe and clean up the resources associated with the ended call.

## Validate incoming requests and isolate call state

Follow Twilio's current request-validation guidance for HTTP and the applicable WebSocket connection setup. Do not invent a signature format or assume that a secret URL is sufficient authentication. Use the supported libraries and deployment guidance for your server framework.

Create state per call. A module-level global conversation history can accidentally mix two callers. Include tests with two synthetic call states that ask about different services. Ensure a delayed result for caller A cannot be spoken to caller B. This is a serious correctness issue even when the data is public because it makes the assistant unpredictable.

Keep logs useful and limited. Record call correlation, application version, requested service key, lookup status, model timing, output completion, and cleanup. Avoid logging credentials and unnecessary personal speech. Decide whether recordings are needed for the quality question you are studying and use synthetic calls while learning.

Use durable storage for business records that must survive a server restart. Conversation state can sometimes be ephemeral, but a confirmed callback request or support record should not disappear because one WebSocket worker restarted. The storage choice follows the business requirement, not the convenience of the demo's in-memory object.

## Measure latency and cost across the call

The caller experiences the entire path: speech recognition, turn boundary, application lookup, model generation, speech generation, and playback. Measure where your application can observe those stages, and acknowledge blind spots. A fast model token does not mean the caller heard useful information quickly.

Use three representative cases: a direct catalog hit, a clarifying question, and a lookup failure. Compare time to first useful content and total task time. A filler phrase may hide silence while adding no information. Keep it only if it improves the experience in listening tests.

Budget the complete stack using current rates: telephone usage, number rental where applicable, ConversationRelay, your chosen model, backend hosting, and connected services. Include abandoned calls and retries. Account plans and provider options affect the result, so this guide does not claim one stable per-minute total.

Monitor concurrency and cleanup. A leaked session may consume resources after the caller believes the interaction ended. A server that handles one call correctly may fail under several simultaneous model streams. Begin with a small controlled concurrency test and inspect memory, queue length, and cross-call isolation before widening access.

## Troubleshoot by boundary

| Symptom | First investigation | Controlled test |
| --- | --- | --- |
| Call never reaches greeting | TwiML route and XML response | Fixed documented TwiML without model |
| Greeting works, prompts absent | WebSocket connection and event handling | Log redacted message types |
| Text joins incorrectly | Token trimming or spacing | Offline token concatenation test |
| Caller correction ignored | Cancellation and response revision | Delay old model response intentionally |
| Correct answer goes to wrong call | Shared state | Two isolated synthetic calls |
| Agent says transfer but nothing happens | Real call-control implementation | Test handoff end to end |
| Call ends but server work continues | Cleanup and cancellation | Inspect active tasks after disconnect |

Avoid changing the voice when the HTTP route is failing. Avoid adding prompt instructions when the server is dropping a final marker. State the boundary under test and preserve the smallest failing case. Once fixed, add that case to your regression sheet.

## Compare alternatives and complete the project

ConversationRelay is a useful route when Twilio calling and your own text-oriented application layer are central. Compare [Deepgram Voice Agent](07-deepgram.md) for a combined speech pipeline, [Vapi](03-vapi.md) and [Retell](04-retell.md) for managed assistant workflows, and [LiveKit](01-livekit.md) or [Pipecat](02-pipecat.md) for code-centered realtime frameworks. Compare [OpenAI Realtime](06-openai-realtime.md) when direct speech-to-speech interaction is the focus.

For the optional Service Window project, deliver one synthetic catalog, a TwiML route, a WebSocket handler, a read-only lookup, and an honest fallback. Test unknown service, ambiguous timezone, changed request, interrupted answer, lookup outage, model timeout, and two simultaneous calls. Acceptance means the caller hears catalog-backed status, no production impact is invented, stale output stops, and cleanup completes after disconnect.

Use this coding-assistant prompt:

```text
Inspect this Twilio voice app and current ConversationRelay docs.
Build Service Window using synthetic maintenance records. Keep the
HTTP TwiML route separate from the WebSocket conversation handler.
Implement documented message shapes, preserve streamed token spacing,
isolate state per call, and invalidate obsolete output on interruption.
Use current request-validation guidance and keep provider keys server-side.
Add a read-only lookup with explicit unknown/error statuses and a real
fallback route. Deliver offline handler tests and a manual call test
sheet. Report untested telephony behavior. Do not purchase numbers,
place outbound calls, or connect production infrastructure.
```

## Review the call as a distributed transaction

A phone conversation crosses several independently failing systems. Your HTTP endpoint can succeed while the WebSocket fails. The model can finish while the caller disconnects. The lookup can return valid data after the person changes the requested service. Thinking in terms of one giant “call succeeded” flag hides these differences.

For one synthetic test, write a timeline with connection, prompt completion, lookup start, lookup result, first text sent, interruption, and cleanup. Attach a call correlation identifier and an application response revision. You should be able to tell whether an obsolete result was ignored and whether any work continued after the call ended. If those questions cannot be answered, improve the trace before adding another integration.

Next simulate a backend timeout after a lookup request was accepted. For a read-only status tool, a bounded retry may be reasonable. For a future write action, the same retry would require idempotency and a way to resolve uncertain completion. Do not copy a read-retry policy into a booking or account-update tool without revisiting that distinction.

Finally, inspect the human wording for each failure state. “I could not verify the schedule” matches an unavailable lookup. “There is no maintenance” does not. “The call ended” does not imply a requested callback was saved. Align these phrases with application results and preserve the examples as regression cases. This is a practical way to make a telephone assistant trustworthy without requiring the caller to understand any of the systems behind it.

Package the final demo with a short call-flow diagram, environment-variable names without values, and a redacted sample trace. Another developer should understand which route returns TwiML, which route accepts the socket, and which function owns maintenance truth. This makes the project maintainable after the original demonstration and keeps future changes tied to observable boundaries.

Keep those handoff notes versioned with the application.

## Sources and verification boundary

Checked **November 13, 2026**: [ConversationRelay overview](https://www.twilio.com/docs/voice/conversationrelay), [Product overview](https://www.twilio.com/en-us/products/conversational-ai/conversationrelay), [TwiML reference](https://www.twilio.com/docs/voice/conversationrelay/conversationrelay-noun), and [WebSocket messages](https://www.twilio.com/docs/voice/conversationrelay/websocket-messages). The [guide index](https://www.twilio.com/docs/voice/guides/conversation-relay-guides) supplies the current onboarding and best-practice routes; verify those before deployment.

The Service Window catalog, offline handler, state policy, and test plan are original instructional examples. No telephone call, public endpoint, Twilio account change, live model stream, or deployment was tested during authoring. Current provider support, regional behavior, account access, and billing remain implementation-time checks.
