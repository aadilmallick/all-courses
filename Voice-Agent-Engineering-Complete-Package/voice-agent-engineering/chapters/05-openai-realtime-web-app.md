# 5. A native OpenAI Realtime web application

The cascaded baseline made every text boundary explicit. We will now connect the browser microphone to a native conversational audio session. The browser owns capture and playback, the backend owns the permanent credential and initial configuration, and the provider owns the model session. This division is small enough to inspect completely while still teaching a realistic web-app architecture.

The delivered application consists of `examples/web/index.html`, `examples/web/client.mjs`, and either `examples/python/openai_server.py` or `examples/typescript/openai-server.ts`. Both backend choices serve the same browser client and expose the same local `/session` route. Run one backend at a time. This is a localhost teaching application; publishing it requires the authentication, quotas, and deployment work in chapter 12.

## Choose one protocol and keep it consistent

A major practical hazard is combining examples from different API generations. This edition uses OpenAI Realtime GA: the backend posts multipart session configuration and SDP to `/v1/realtime/calls`, and receives an SDP answer. It uses `session.type = realtime`, audio configuration under `session.audio`, and GA event names. It does not send the older beta header.

The inspected [Realtime migration guide](https://developers.openai.com/api/docs/guides/realtime) identifies the GA changes. The inspected call reference lists `gpt-realtime-2.1`, which is the example's configurable default. This is an edition baseline, not a guarantee of account access or future availability. Set `OPENAI_REALTIME_MODEL` to a currently supported compatible model when your deployment requires it.

Some current guide pages also describe a newer Live protocol with different endpoints and session events. Treat those as a separate integration. Renaming a model while leaving an incompatible event schema is not a migration. When upgrading, verify the endpoint, authentication flow, session fields, media transport, events, tool semantics, and shutdown behavior together.

The server code deliberately uses HTTP and browser APIs directly. A higher-level agent SDK can reduce boilerplate, but first understanding the underlying responsibilities makes its lifecycle easier to evaluate. The raw implementation is also useful when diagnosing whether a failure originates in browser capture, signaling, media transport, or model configuration.

## Understand the trust boundary

A permanent API key is a server secret. It must not appear in HTML, client JavaScript, a public environment variable, or a URL sent to the browser. The browser sends an SDP offer to your backend. The backend attaches its key when calling the provider and returns only the SDP answer. The continuous media path is then negotiated between browser and provider.

This design keeps the key out of the browser, but does not by itself authorize every user to create sessions. A public `/session` endpoint without application authentication can still spend your account's budget. The delivered server binds to loopback and checks host and origin as local-demo protections. The chapter does not present those checks as a substitute for real user authentication.

The alternative is a provider-supported short-lived client credential. Your backend authenticates the user, requests a restricted ephemeral credential, and passes it to the browser. That credential is still a bearer capability: anyone who obtains it may be able to use it within its scope and lifetime. Keep it out of logs, caches, and persistent browser storage, and enforce server-side issuance limits.

Initial session instructions are also not an authorization mechanism. The browser can be modified by its user, and some client credential configurations may be overridden. Put business permissions in trusted backend tools. The teaching demo exposes no business write tools at all, so its spoken claims cannot create appointments.

## Run the complete application

From the package root, configure `OPENAI_API_KEY` in your shell or local secret manager. Optionally configure `OPENAI_REALTIME_MODEL`. Then choose one server:

```bash
python examples/python/openai_server.py
```

or:

```bash
node examples/typescript/openai-server.ts
```

Open `http://localhost:3000`. Select Start conversation, grant microphone permission, and speak after the connection is ready. Audio is sent to the provider. The page shows an audio control, mute and end controls, and the latest agent transcript. Actual provider use can incur charges. No live paid calls were made as part of the supplied verification.

The TypeScript server uses Node 24's built-in support for erasable TypeScript syntax. There is no npm install step for this sample. This execution support is not a full TypeScript type-checker. The verification report distinguishes Node execution and syntax parsing from `tsc` type-checking, which was not available in the authoring environment.

The Python variant uses the standard library. `ThreadingHTTPServer` accepts requests locally, and `urllib.request` makes the upstream request. It is intentionally not a production application server. For deployment, use an appropriate service runtime and preserve the same authentication, timeout, size-limit, and secret-handling responsibilities.

## Walk through browser startup

Startup first records a fresh generation number and creates a resource owner. It disables Start and enables End immediately. This prevents repeated clicks from creating overlapping starts and gives the user a way to cancel while permission is still pending. The status says that the application is waiting for microphone permission, rather than falsely claiming to be connected.

The client requests audio with echo cancellation, noise suppression, and automatic gain control. If permission resolves after the user has ended the session, the generation no longer matches. The client stops those late-arriving tracks and exits. This is an important case to understand because a permission dialog can remain open much longer than a typical network request.

Next, the client creates an `RTCPeerConnection`, registers handlers, and adds the microphone tracks. Adding a track makes it available for negotiation. It does not mean the provider has already received audio. The client also creates the `oai-events` data channel before creating its offer, so the negotiated session includes the event channel.

The client creates an SDP offer, sets it as its local description, and waits for ICE gathering. It then posts the resulting SDP to `/session` using the `application/sdp` media type. A six-second gathering timeout and a broader connection timeout prevent setup from remaining silently pending forever. These values are teaching defaults to measure and tune, not universal network guarantees.

## Walk through the backend relay

The backend checks the route, method, host, origin, content type, body size, and credential presence. Each check narrows the input contract. An offer larger than the allowed bound is rejected rather than accumulated indefinitely. The request must begin with the expected SDP version line. This is a basic input check, not a complete SDP security validator.

The backend constructs a multipart request with two fields: `sdp` and `session`. The session field contains JSON describing the Realtime model, short-answer instructions, and output voice. In TypeScript, native `FormData` handles the boundaries. In Python, a UUID-based boundary and explicit separators construct the same wire format.

The upstream call has a timeout. A successful response is relayed as an SDP answer. A rejected response becomes a sanitized local error that includes the upstream status but not a raw body or credential. This keeps the learning application understandable without returning internal details directly to the page. In production, correlate the error with a sanitized server trace identifier.

The browser then applies the answer as the remote description. That completes the signaling exchange, while connection establishment continues through WebRTC's state machine. The page updates when the peer connection becomes connected. A provider readiness event could support more detailed application status; the demo keeps its status claims limited to the connection state it actually observes.

## Receive audio and events separately

The remote `track` event supplies generated audio. The client attaches the received stream to the audio element. If the browser rejects `play()`, the page tells the user to press Play on the visible controls. This is better than hiding playback behind an animated indicator that offers no recovery when autoplay policy intervenes.

Transcript deltas arrive on the data channel using the Realtime GA event name `response.output_audio_transcript.delta`. The client appends each delta to the displayed latest response and clears the display when a new response is created. It uses `textContent`, so model output is treated as text rather than executable HTML. This is a small but important UI boundary.

A generated transcript is not proof that all those words have been heard. The media stream and data channel have distinct timing. Use the transcript as a helpful textual companion, not an exact playback receipt. If a product requires an accurate record of what the user heard, it needs a dedicated playout accounting design rather than equating transcript completion with speaker completion.

Likewise, `response.done` describes response generation completion, not necessarily the end of audible playback. Audio can remain buffered. Design speaking indicators and turn timing around the media behavior or provider events appropriate to the selected transport. A status label that says “Listening” while several seconds of agent speech remain queued can confuse the user about whether interruption is possible.

## Muting and ending have different meanings

Mute disables the owned microphone tracks through their `enabled` property. That produces a muted input state while leaving the conversation connection active. Agent replies may continue. The page explicitly says so. Muting is not ending, and the interface should not imply that all provider processing or billing stops merely because microphone input is disabled.

End increments the generation, aborts an in-flight signaling request, closes the data channel and peer connection, stops the microphone tracks, pauses playback, and clears the attached stream. Cleanup can be called from user action, timeout, connection failure, or page lifecycle. The common disposal path makes those cases consistent.

Closing local media is not a durable business rollback and is not represented as a verified provider billing receipt. Production systems should use the selected provider's session termination and usage mechanisms when authoritative closure matters. The demo reports only that local resources were ended. This distinction avoids overclaiming what a client cleanup function establishes.

`pagehide` triggers cleanup when leaving the page. It is a useful defense against obvious leaks, but browser shutdown behavior is not an absolute delivery guarantee. Do not rely on a last-millisecond network call during navigation to commit important application state. Persist required state earlier through a reliable backend workflow.

## Add typed event handling without inventing a universal schema

A production TypeScript app can define a discriminated union for the event types it supports. A discriminant is a field such as `type` whose literal value identifies the shape. The handler can then narrow to the expected fields. Still validate incoming JSON at runtime: TypeScript annotations do not inspect bytes from a socket.

The following is an intentionally limited integration fragment for a GA event adapter:

```typescript
type TranscriptDelta = {
  type: 'response.output_audio_transcript.delta';
  delta: string;
  response_id: string;
};
function isTranscriptDelta(value: unknown): value is TranscriptDelta {
  if (typeof value !== 'object' || value === null) return false;
  const event = value as Record<string, unknown>;
  return event.type === 'response.output_audio_transcript.delta'
    && typeof event.delta === 'string'
    && typeof event.response_id === 'string';
}
```

The guard checks only the fields this adapter needs. It does not claim to validate every provider event. Keep unknown event handling deliberate: log a sanitized event kind for diagnosis, but do not crash the whole session simply because a provider adds an unrelated event. Conversely, do not ignore an error that invalidates the active audio or tool workflow.

Python can apply the same policy using dictionary checks or a validation library. The conceptual order is identical: parse JSON, recognize a supported event, validate required fields, map it into internal application state, and reject stale session or response identities. The language changes the syntax, not the trust boundary.

## Tool calls require a second design

A native audio session may request tools while speech is ongoing. Do not attach privileged calendar credentials to browser-callable functions and assume a system prompt protects them. A trusted backend should bind tool execution to the authenticated application user, validate arguments, enforce allowed actions, and provide a result associated with the provider's call identifier.

There are provider-specific ways to maintain server-side control or a separate session connection. Use the current documentation for your selected protocol. This book deliberately does not fabricate a sideband endpoint from a similarly named guide. The included browser demo has no live function-call handler; chapter 10 supplies a local, tested transaction model and explains how to integrate it through a verified provider adapter.

A tool result should distinguish available, proposed, pending, confirmed, and failed states. The spoken response can then truthfully describe what happened. A function call returning “success” merely because a browser modal opened is not the same as a booking transaction committing. Trace the actual result from the backend system of record.

For tools that may take time, the conversation needs a waiting policy. A brief acknowledgement can help, but repeated filler becomes irritating. Decide whether the user can ask something else while a lookup is pending, and how that affects the original task. These policies are part of the product, even when the model protocol supports asynchronous tool calls.

## Read a connection timeline as a causal trace

Imagine the page records these relative times: Start at zero, microphone ready at 300 milliseconds, ICE gathered at 700, backend answer at 1,100, peer connected at 1,250, and first remote audio at 1,900. Startup to first audio is 1,900 milliseconds. It would be incorrect to call all of that model latency. Permission, connectivity, signaling, and response generation each occupy part of the path.

Now imagine a second run where permission takes seven seconds because the user is deciding. That longer startup is not necessarily a performance regression. Keep permission wait separate from machine-controlled setup. The user-visible state should say what is happening, while the engineering trace preserves enough boundaries to compare runs fairly.

The same approach clarifies an error. If End occurs at 500 milliseconds and the backend answer arrives at 1,100, the answer belongs to an obsolete generation. The client must ignore it and keep resources closed. If it instead applies that answer to a new peer connection, the old request has crossed its ownership boundary. This failure can be reproduced with delayed local responses and does not require a model conversation.

For production telemetry, use opaque IDs and numeric intervals rather than raw SDP. SDP can contain network-related information and is rarely necessary in ordinary user-facing diagnostics. If specialized transport debugging requires it, handle that evidence under an explicit restricted process. Normal startup monitoring can remain much smaller and less sensitive.

## Diagnose the application by layers

If Start fails immediately, check browser support, secure context, and permission. If microphone permission succeeds but setup fails, inspect the local route and server configuration. If the server returns an upstream error, check the model identifier, account access, and session schema. Keep the error category separate from the user's recording so debugging does not require retaining audio.

If signaling succeeds but audio never arrives, inspect peer connection state, remote tracks, and playback policy. Corporate networks and mobile conditions can affect connection establishment. If transcripts arrive but there is silence, the data path may work while playback does not. That observation is more informative than “the API connected.”

If the microphone remains active after an error, inspect resource cleanup. If a new session's status changes because an older request failed, inspect generation guards. If the page speaks twice, inspect whether two peer connections survived. These are application lifecycle problems that persist regardless of how capable the model is.

The companion's UX and cancellation simulations let you rehearse those states without provider access. The supplied browser checks exercise denied permission and ending before permission resolves through controlled test doubles. Real microphone acoustics, speaker echo, and live model conversation remain separate tests. The next chapter keeps the same lifecycle principles while switching to Gemini Live's explicit PCM-over-WebSocket model.
