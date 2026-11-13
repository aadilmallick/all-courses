# 6. Gemini Live and explicit PCM streaming

The previous chapter let WebRTC carry microphone media without exposing individual samples to application code. Gemini Live provides a useful contrasting lesson: a bidirectional WebSocket protocol in which your application explicitly sends audio data and receives structured messages. This makes audio formatting, simultaneous send/receive, and playback buffering visible responsibilities.

We will begin with one recorded turn, because a file lets us control format and timing. The complete programs are `examples/python/gemini_file.py` and `examples/typescript/gemini-file.ts`. They are server-side learning examples that save generated audio. They do not implement a browser microphone bridge, a production agent service, or tool execution. The chapter explains how those extensions would fit without pretending they are already present.

## Establish the protocol baseline

The inspected [Gemini Live WebSocket reference](https://ai.google.dev/api/live) describes a stateful bidirectional connection. The edition examples use the `v1beta` BidiGenerateContent endpoint and the documented `setup`, `realtimeInput`, and `serverContent` message families. The model is configurable through `GEMINI_LIVE_MODEL`; the inspected documentation names `gemini-3.8-live`, which is the example baseline.

This is a version-sensitive API. Confirm access and model availability before running. The source ledger records that the official documentation redirected some pages to Google's AI Studio documentation host. The code follows the inspected wire reference rather than translating an older SDK tutorial's names from memory. SDK names often use snake_case in Python and camelCase in JavaScript; raw JSON names must match the actual protocol.

The programs use a permanent key only in a server process. The raw WebSocket URL includes that credential as a query parameter, so exceptions and proxy logs require care. The examples avoid printing the URL. A direct browser integration should use the provider's supported ephemeral-token mechanism and its required endpoint/version, not reuse this server-key URL in client source.

A client-side credential is still extractable. Short lifetime, restricted use, issuance quotas, and authenticated backend provisioning reduce exposure. They do not turn a browser into a trusted place for permanent secrets or privileged tool execution. The trust model from chapter 5 therefore transfers intact even though the transport changes.

## Prepare exactly the audio the API expects

The file-turn examples send 16 kHz mono signed PCM16 little-endian input. At 20 milliseconds per chunk, the arithmetic is 16,000 × 0.020 = 320 samples, then 320 × 2 = 640 bytes. Each chunk is Base64-encoded inside a JSON audio object with the MIME description `audio/pcm;rate=16000`.

Python accepts a WAV file and checks its channels, sample width, and rate using `wave`. It then reads only the PCM frames. The WAV header stays local. TypeScript accepts a raw PCM file and checks that its length is even and that it does not begin with a RIFF header. Raw PCM cannot reveal its own sample rate, so the caller must honor the stated input contract.

These are deliberately different file interfaces. If you have a valid 16 kHz mono PCM16 WAV and want raw bytes for the TypeScript example, extract the frames rather than renaming the file. The following dependency-free Python command performs that preparation:

```python
import wave
from pathlib import Path
with wave.open('utterance.wav', 'rb') as source:
    assert (source.getnchannels(), source.getsampwidth(), source.getframerate()) == (1, 2, 16000)
    Path('utterance.pcm').write_bytes(source.readframes(source.getnframes()))
```

The assertion prevents a file with the wrong format from being mislabeled. It does not resample. If your recording is 48 kHz or stereo, use a suitable conversion step first. You can inspect the result by checking that one second of raw input occupies about 32,000 bytes, excluding any container metadata.

## Run one turn in Python

Create a Python environment and install the pinned optional dependency from `requirements-optional.txt`. The other Python examples do not require it. Configure `GEMINI_API_KEY` in the server environment, optionally set `GEMINI_LIVE_MODEL`, and run:

```bash
python -m pip install -r requirements-optional.txt
python examples/python/gemini_file.py utterance.wav
```

The program connects, sends setup, waits for acknowledgement, concurrently streams the recording and receives the reply, and writes `gemini-reply.wav`. The output is represented as 24 kHz mono PCM16 based on the documented native audio response contract. If a future model changes the format, update the decoder and file header together rather than blindly preserving this rate.

`asyncio.timeout(60)` bounds the whole interaction. A `TaskGroup` owns the sender and receiver. If either fails, related work is cancelled. The WebSocket context closes the connection when execution exits. This combination demonstrates structured ownership: a file-turn operation should not leave a sender task running after its output path has failed.

The code checks `setupComplete` before sending the audio stream. It does not assume that the WebSocket's open state means model setup has completed. For a production adapter, also explicitly recognize setup errors and unexpected closure while waiting. The example's global timeout gives the learning script a bounded failure even if no usable acknowledgement arrives.

## Run one turn in TypeScript

Node 24 includes a WebSocket client, so the TypeScript example has no SDK dependency. With the same server-side key configured, run:

```bash
node examples/typescript/gemini-file.ts utterance.pcm
```

It saves `gemini-reply.pcm`, which is raw output audio. The file has no WAV header and requires a player or conversion step that knows its 24 kHz mono PCM16 format. A simple way to wrap it uses Python's `wave` module:

```python
import wave
from pathlib import Path
with wave.open('gemini-reply.wav', 'wb') as output:
    output.setnchannels(1)
    output.setsampwidth(2)
    output.setframerate(24000)
    output.writeframes(Path('gemini-reply.pcm').read_bytes())
```

The TypeScript program handles socket closure separately from successful turn completion. It sets a completion flag only after observing the expected server event and writing output. A closed connection with no completion is an error, not an implicit successful answer. The output's existence alone should not be used as a success signal if an earlier run left a file in the directory.

Timers are owned resources too. The sender interval stops after the recording is exhausted, and the deadline and interval are cleared on closure. In a long-lived application, also ensure that asynchronous output writes cannot race a new session's state. A file example is small enough to finish and exit, but the same pattern must be stricter in a reusable browser component.

## Understand the setup message

The first application message contains a `setup` object. It identifies the model under `models/…` and requests audio output through generation configuration. This initial configuration establishes the session's behavior before normal realtime input. You should construct it from trusted application choices rather than directly accepting arbitrary browser configuration.

A model identifier and an API version are different dimensions. A correct model name can still fail on the wrong endpoint, and a valid endpoint can reject an unavailable model. Record both in configuration and telemetry. When investigating a failed upgrade, compare the whole session contract instead of changing random individual fields until the connection opens.

The official GenAI SDKs can hide some wire details. Python's asynchronous live connection and JavaScript's live callbacks are documented alternatives. They can be good production choices when you pin and test an SDK version. The raw examples here are not a claim that avoiding SDKs is universally better; they make the protocol visible and keep the delivered dependency surface small.

If you use an SDK, inspect its exact message types and cancellation lifecycle. Do not mix a raw-wire JSON field with a differently named SDK property and assume the library will translate it. Keep a thin adapter between provider messages and your application's internal events so the rest of the app does not depend on every SDK naming choice.

## Send and receive concurrently

The sender walks through input bytes in 640-byte slices. After each slice, Python awaits 20 milliseconds; TypeScript uses an interval. This approximately paces the file at its recorded rate. It is a teaching pacing mechanism, not a hard realtime scheduler. Event-loop delays, network buffering, and operating-system scheduling can change actual transmission timing.

The receiver runs at the same time. If you wait to read until after sending all audio, server responses can accumulate and your application may miss an opportunity to react to interruption, errors, or turn state. Full-duplex means both directions can make progress together, not that one socket automatically creates correct application concurrency.

After input is exhausted, the examples send `audioStreamEnd` for the configured automatic activity-detection path. Manual activity signaling is a different protocol mode. Do not send every possible end-of-turn marker out of caution; select one documented mode and follow its contract. Mixing automatic and manual control can produce duplicate or missing turn boundaries.

A continuously captured microphone would add a bounded queue between the audio processor and the socket. That queue needs overflow behavior. If the network cannot keep up, continuing to buffer indefinitely destroys conversational freshness. The same queue-duration reasoning from chapter 3 applies, regardless of whether the data originates in a file or a live worklet.

## Decode response messages carefully

The examples look for `serverContent`, then `modelTurn.parts`, then `inlineData` carrying audio. Not every server message contains generated audio. There may be setup acknowledgements, transcriptions, tool-related events, usage, or lifecycle information. A parser should distinguish these events rather than treating a missing audio field as an error on every message.

Python's JSON decoder returns a Base64 string at the raw protocol boundary, so the example explicitly decodes it. Some SDKs already expose binary bytes for inline audio. Decoding those bytes again would corrupt the data. Always know whether your layer sees wire JSON, SDK objects, or already-decoded audio.

The programs accumulate output chunks until `turnComplete`, then save the result. That choice is deliberately whole-turn playback. It makes the output easier to inspect and avoids pretending a file accumulator is a low-latency browser player. A realtime web application would instead feed chunks into a bounded PCM playback scheduler while tracking response identity and interruption.

The generated stream may finish producing before the user has heard all audio. Once again, generation completion and playback completion are separate facts. If a product's turn indicator depends on audible completion, use local playback accounting or suitable provider events. A server's `turnComplete` message cannot by itself describe the exact state of a remote speaker buffer.

## Handle interruption at both ends

The inspected protocol includes an interruption indication in server content. The example clears accumulated chunks when interrupted. For a file-output program, this discards output that no longer belongs in the current accepted response. For a browser player, clearing a JavaScript array is insufficient if samples have already been scheduled to the audio device.

A live implementation must stop scheduled sources or clear the worklet queue, invalidate the response epoch, and reject late chunks from the interrupted response. It should also preserve the correct conversational history according to the provider's semantics. Do not copy OpenAI's truncation event names into Gemini; shared architectural responsibilities do not imply shared protocol messages.

The user may produce a short backchannel such as “mm-hm” without intending to take the turn. An automatic interruption system may or may not distinguish that from a correction. Evaluate this behavior with representative speech. A good product can expose push-to-talk or a more deliberate turn mode for noisy environments rather than assuming fully open microphones are always best.

Interruption also affects tool work. If a lookup is still relevant, it may continue while the user adds a clarification. If the request has changed, the result must be tagged and rejected as stale. If a write already committed, the agent needs a truthful receipt or recovery path. The transport's interruption signal does not decide business semantics for you.

## Extend the file program into a web application

There are two broad browser topologies. In a backend bridge, the browser sends audio to your application server, which maintains the provider session. This centralizes credentials and tool control, but adds a media hop and operational load. In a direct connection, the browser uses a supported ephemeral credential and talks to the provider while trusted tools remain on your backend.

A browser PCM capture path commonly uses `getUserMedia`, an `AudioContext`, and an `AudioWorklet`. It observes the actual sample rate, converts to the required format with a tested resampler, frames the samples, and sends them through a bounded transport queue. This is additional implementation work; neither delivered file example claims to implement it.

Playback converts received PCM into the browser's audio representation and schedules it using the audio clock. Keep a small target buffer, a maximum queue duration, and explicit underrun handling. Provide output controls and autoplay recovery. On End, stop capture tracks, close owned contexts or nodes, stop output, and close the session connection according to the selected protocol.

For this extension, a mature voice framework can be valuable. It may provide media transport, device handling, and lifecycle management while retaining Gemini as the model. Evaluate the framework's current supported integration rather than assuming its WebRTC abstraction is a native Gemini WebRTC API. A framework can bridge transports without changing the underlying provider protocol.

## Distinguish a decoder problem from a timing problem

Suppose the raw reply contains 48,000 bytes and represents one second of mono PCM16 at 24 kHz. If it is wrapped in a WAV header declaring 16 kHz, it will play for one and a half seconds. The bytes may be valid and the protocol may have succeeded, while the apparent speaking speed is wrong. The correction is to fix the output interpretation, not ask the model to speak faster.

Now suppose the output format is correct but a live player starts and stops every few frames. Inspect arrival intervals and scheduled duration. If chunks arrive in bursts, a short jitter buffer may help. If the buffer repeatedly grows, production is outrunning consumption or the scheduling clock is wrong. These two problems can sound similarly awkward while requiring opposite responses.

Finally, suppose no audio is saved even though the socket remains open. Inspect event kinds and whether setup completed. A session can be connected yet waiting for the end of user activity. A parser can also be looking for an SDK field name in raw JSON. The file examples intentionally expose these layers so you can examine protocol state before adding microphone complexity.

When implementing a browser bridge, test it first with the same known PCM file. That isolates capture and resampling from the provider session. Then replace file input with a live worklet while preserving the exact framing contract. This incremental substitution makes a newly introduced bug easier to locate than connecting every layer at once.

## Reconnect without inventing continuity

A dropped WebSocket does not automatically preserve a conversation. Some APIs provide explicit resumption mechanisms with handles and constraints. When available, follow their documented lifetime and recovery semantics. Otherwise start a new session and restore an application-approved summary or task state. Do not replay old microphone audio indiscriminately.

A resumption handle can be sensitive because it relates to a live conversation. Keep it within the intended session scope and avoid persistent public logs. Track whether a resumed session actually restored provider state or whether the application started fresh. These are different user experiences and should lead to different status messages.

Tool transactions need durable identity across reconnects. If a booking result was lost during a connection failure, query it by operation identifier instead of issuing a second booking. The voice channel is a presentation and interaction mechanism; it should not be the only place where important business outcomes exist.

The next chapter returns to interchangeable speech components and managed platforms. The PCM and lifecycle reasoning here remains useful even when a higher-level SDK hides the wire messages, because the browser still has to capture, play, stop, and tell the user what is happening.
