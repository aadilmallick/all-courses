# 3. Streams, transports, and resource ownership

A short request-response web application often lets you think one operation at a time: send a request, await a result, render it. A voice application must listen while receiving audio, update the interface while a tool runs, and react immediately when the user interrupts. The central programming problem is therefore concurrency with ownership. Several activities make progress together, and each needs a clear rule for when it stops.

We will establish the relevant asynchronous ideas in Python and TypeScript without assuming experience with either language's streaming libraries. The purpose is practical: after this chapter, you should be able to explain why an unbounded queue increases latency, why cancelling a task is different from retracting a database write, and why closing a connection does not necessarily dispose of a microphone.

## Waiting is different from computing

Consider receiving a network message. The program often spends most of its time waiting for bytes. An asynchronous runtime can let another activity run during that wait. In Python, `async def` defines a coroutine function, and `await` suspends the current coroutine until an awaitable operation completes. In TypeScript, an `async` function returns a promise, and `await` pauses that function's continuation until the promise settles.

Neither keyword makes CPU-heavy work inexpensive. A long synchronous loop can still block an event loop. If you decode large audio files or run a local model directly on a latency-sensitive event loop, network messages and stop controls may be delayed. Use a suitable worker, process, native library, or inference service for substantial computation. The asynchronous code should coordinate the work and remain responsive.

A task is a scheduled unit of asynchronous execution. A stream is a sequence of values that become available over time. A producer yields values; a consumer processes them. Audio frames, transcript updates, and generated text deltas are all streams, but they have different semantics. An interim transcript may replace previous text, whereas a PCM chunk usually appends samples to a sequence.

This difference matters when designing event types. An event named `transcript_delta` suggests append behavior. An event named `transcript_snapshot` suggests replacement behavior. If a provider sends snapshots but your adapter appends them, “book tomorrow” can become “book book tomorrow book tomorrow afternoon.” The bug lives in the contract, not the model.

## A bounded Python pipeline

Run `python examples/python/core.py`. Its `stream_demo` function creates an `asyncio.Queue(maxsize=2)`, starts a producer and consumer inside a task group, and prints four mock text chunks. The queue is an in-memory buffer. Its maximum size is a limit on buffered items, not a limit on all work that may exist elsewhere in the system.

The producer calls `await queue.put(word)`. If the queue is full, it waits until the consumer removes an item. This is backpressure: a downstream capacity limit slows upstream production. Backpressure prevents a consumer that is temporarily slow from causing an ever-growing memory buffer. It also makes queueing delay visible as a design concern rather than hiding it in an unrestricted list.

The consumer awaits `queue.get()`. When the producer sends `None`, the consumer exits. That sentinel is a teaching convention indicating completion. It is not audio, and it is not a provider event. A production pipeline may use a typed end-of-stream event or close a channel. Whichever convention you choose, every consumer must understand it and every error path must avoid leaving the other side waiting forever.

`asyncio.TaskGroup` provides structured concurrency. The enclosing block waits for its child tasks, and a child failure causes related work to be cancelled. This is useful because a voice session has activities that belong together. If playback or the upstream connection fails, continuing to accumulate microphone frames is rarely useful. The session should own and terminate the related work.

There is a subtle limit: a successful early return from one task does not automatically cancel all sibling tasks. Your lifecycle still needs explicit rules for completion and shutdown. In the Gemini file example, the sender finishes sending its file and the receiver finishes when the turn completes. In a continuously running microphone application, a session supervisor must end both activities when the user stops.

## The TypeScript equivalent is a behavioral contract

TypeScript's `AsyncIterable<T>` describes values produced over time. A `for await` loop consumes them. The language's type system can express whether a stream carries audio frames, text updates, or events. It cannot prove that a producer actually obeys a sample-rate contract or releases a network resource. Runtime checks and ownership remain necessary.

The following complete Node example demonstrates asynchronous iteration without a provider:

```typescript
async function* words(): AsyncGenerator<string> {
  for (const word of ['Your', 'options', 'are', 'ready.']) {
    await Promise.resolve();
    yield word;
  }
}
for await (const word of words()) {
  console.log('chunk:', word);
}
```

`async function*` creates an asynchronous generator. `yield` emits a value to its consumer. `Promise.resolve()` provides an asynchronous continuation point here; it does not simulate realistic network latency. This small program teaches the iteration mechanism before we attach it to a vendor SDK or a socket.

A cancellation signal is a separate input. `AbortController` owns an `AbortSignal`; calling `abort()` notifies listeners and compatible APIs. Fetch accepts a signal and can stop waiting for a request. A custom generator must inspect or subscribe to the signal itself. Passing a signal to a function that ignores it does not provide cancellation by magic.

Avoid a single global controller reused across sessions. Once aborted, an `AbortSignal` stays aborted. Create fresh owned state for each new session or response. The delivered browser sample stores its controller with the peer connection, data channel, and media stream so one cleanup operation can release the resources that belong together.

## Queue length is a latency measurement

Suppose a producer generates 40 milliseconds of audio every 20 milliseconds of wall time, while playback consumes 20 milliseconds. The queue gains 20 milliseconds each interval. After one second, it contains roughly one extra second of future speech. Memory may still look modest, but the user now hears increasingly stale content. This is a latency failure before it becomes a memory failure.

Measure buffered audio in milliseconds rather than only the number of chunks. Chunk sizes can vary. Ten chunks of 10 milliseconds and ten chunks of 200 milliseconds have very different conversational effects. A useful player tracks scheduled duration and sets a maximum. When that limit is exceeded, the application can apply backpressure, cancel the response, or report an error according to its design.

Dropping arbitrary middle chunks can make speech unintelligible. A bounded queue is not permission to discard random samples while claiming the answer is complete. If you cannot preserve the stream, a controlled interruption or restart may be better. For microphone input, dropping old data can preserve responsiveness in some architectures, but the recognition and turn-history consequences must be understood.

Backpressure also crosses provider boundaries imperfectly. Your local consumer can stop reading, but the remote provider may continue generating and billing until cancellation reaches it. A local bound protects your application. It does not necessarily cap remote work. This is why chapter 9 separates producer cancellation from local playback invalidation.

## WebSocket: reliable ordered messages

WebSocket provides a persistent bidirectional message connection over TCP. It is useful when a provider's protocol is expressed as JSON messages carrying audio, events, and tool results. You can send data while receiving data. That does not mean a single sequential loop that sends the whole recording and then begins reading is a robust full-duplex implementation. Send and receive need to make progress concurrently.

TCP preserves byte order and retransmits lost data. For a document download, that behavior is desirable. For live audio, a lost packet can delay later data behind it. This is often called head-of-line blocking. You can design around some effects with buffering and bounds, but a JSON WebSocket transport does not automatically supply the media behavior of WebRTC.

A browser's `WebSocket.bufferedAmount` reports outgoing queued bytes. It is a useful signal when the network is slower than production. Set a policy before it becomes unbounded. A typical response to sustained congestion might stop capture transmission, report a connection problem, and offer a retry. Silently buffering ten seconds of microphone audio can turn an interactive conversation into a delayed recording.

When a provider puts Base64 audio in JSON, validate both layers. First parse the message and recognize its type. Then decode the audio and check its declared format. A close event is not a successful turn completion. If the socket closes before a completion event, report the output as incomplete rather than writing a partial file and calling the interaction successful.

## WebRTC: media and control together

WebRTC is a browser platform for realtime communication. In the delivered Realtime sample, microphone and generated speech travel as media tracks. JSON conversation events travel on a data channel. The browser handles codec negotiation, packet timing, and media playout through its media stack. Your application does not manually Base64-encode each microphone frame for that path.

To establish a connection, the browser creates an SDP offer. SDP is text describing session capabilities and transport information. The application exchanges that offer for an answer through its backend. Applying the answer lets the peers complete negotiation. The HTTP request that carries the offer is signaling; it is not the continuous audio stream.

ICE is the connectivity process used to find a workable network path. Candidate gathering discovers connection options. A robust implementation handles gathering completion or a timeout rather than assuming the first offer already contains everything needed. The included browser code waits for gathering and rejects a stalled setup. Network environments still differ, so a successful local test does not establish compatibility with every corporate firewall.

A data channel has its own open and close state. The peer connection also has connection states. A session protocol may emit its own readiness event. Avoid treating any one of these as universal proof that every subsystem is ready. Gate commands on the state required by the specific protocol, and attach listeners before initiating operations that can emit events quickly.

## Cancellation has three different meanings

First, cancellation can stop local computation. A Python task can be cancelled, or a JavaScript continuation can observe an aborted signal. This prevents unnecessary local work. Second, cancellation can request that a remote service stop generating. That is a protocol action, subject to network delay and service behavior. Third, cancellation can invalidate data already produced, telling the player to ignore it.

These meanings are related but not interchangeable. Suppose a response is tagged with epoch seven. The user interrupts, so the player increments its accepted epoch to eight and clears its queue. A chunk from epoch seven arrives afterward. Even if remote cancellation was delayed, the player rejects it. The stale data does not regain permission to speak merely because it arrived on an open socket.

The `Playback` classes in both languages implement exactly that small rule. `interrupt()` increments the epoch and empties the queue. `accept()` appends a chunk only if its epoch matches the current one. This is not a complete audio player. It is a runnable model of freshness, and the tests verify that a late chunk cannot repopulate the queue after interruption.

Cancelling a booking tool has a different meaning again. If the database transaction already committed, cancellation cannot make it un-happen. You must query the receipt or run an authorized compensating operation. A spinner disappearing from the UI must never be treated as evidence that an external write did not occur. Chapter 10 develops this distinction in detail.

## Resource ownership makes cleanup reliable

For every resource, identify an owner and an end condition. The session owns its microphone stream and peer connection. A response owns its generation task and pending playback buffers. A tool operation owns a request identifier and possibly a durable transaction. Shared resources, such as a pooled HTTP client, may belong to the server rather than one conversation.

Cleanup should be idempotent: calling it twice should be harmless. This matters because a user may select End at the same moment a connection failure occurs. Both paths may attempt to close the same resources. A cleanup function that assumes it will be called exactly once turns ordinary races into exceptions that interrupt the rest of cleanup.

Do cleanup in failure paths as well as success paths. Microphone permission may succeed before provider setup fails. If you only stop tracks in the normal End handler, a failed setup can leave the microphone active. The included client wraps startup in a guarded lifecycle and calls the same resource disposal logic for errors and explicit ending.

A late asynchronous result must also respect ownership. Imagine session A is ended and session B starts immediately. A's failed request later rejects. If its error handler writes a global “Disconnected” status, it can overwrite B's healthy status. A generation comparison prevents old operations from modifying current state. This is a general UI race pattern, not something unique to speech.

## Events need identity and time

A useful internal event includes a session identifier, response or turn identifier, event kind, and monotonic timestamp. Monotonic time measures elapsed durations without jumping when a wall clock is corrected. Browser `performance.now()` and Python's monotonic clocks are useful for local intervals. Wall-clock time remains useful for human-readable logs, but it is a different purpose.

Do not subtract timestamps from unsynchronized devices and call the result network latency. A browser clock and a server clock may have different origins and drift. Either measure an interval on one clock, establish a synchronization method, or label the metric as an estimate. Precise-looking numbers are not automatically precise measurements.

Provider identifiers should remain opaque. Preserve them for correlation rather than parsing an assumed prefix to determine business meaning. Your application can add its own stable identifiers. When reconnecting, decide whether a new provider session maps to the same logical conversation and how much history should be restored. A new socket alone does not guarantee continuity.

Logs should be useful without retaining raw audio by default. Record event kinds, durations, buffer sizes, error categories, and opaque correlation IDs. Include transcripts or recordings only under an explicit product policy. A credential-bearing WebSocket URL is particularly easy to leak in exception logs, so the Gemini examples deliberately omit that URL from their error messages.

## A debugging walk-through

Suppose Harbor answers correctly once, then becomes slower on each turn. Begin by measuring queue duration at capture, synthesis, and playback boundaries. If the output queue grows, inspect whether generation is allowed to outrun playback. If the input queue grows, inspect network congestion or an upstream consumer that stopped reading. Do not start by changing the model temperature.

Suppose End stops the voice but the browser microphone indicator remains active. Inspect all capture tracks and their owners. Closing the peer connection is not a substitute for calling `stop()` on the local microphone tracks. If the indicator reappears after permission is granted late, inspect the generation guard around `getUserMedia` resolution.

Suppose an interrupted answer begins speaking again. Inspect whether remote cancellation succeeded, whether the local queue was cleared, whether scheduled sources were stopped, and whether new stale chunks were rejected. These are separate observations. The companion's interruption experiment makes the last problem reproducible without requiring a real model or microphone.

Finally, suppose reconnecting produces two simultaneous voices. Check that the previous session's player and event listeners were disposed before mounting the new session. A framework may manage some of these resources, but you still need to know its lifecycle contract. The next chapter uses these concurrency principles to assemble a complete cascaded speech turn and then shows how streaming changes the design.
