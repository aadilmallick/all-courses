# Deepgram Voice Agent API


## What the Voice Agent API does

Deepgram's Voice Agent API brings speech recognition, language-model integration, and speech generation into one conversational connection. Its getting-started guide describes a WebSocket workflow: connect, send settings, stream audio, and handle events and audio output. This is different from calling a transcription endpoint and building the remaining conversation loop yourself. [Voice Agent overview](https://developers.deepgram.com/docs/voice-agent), [Build a Voice Agent](https://developers.deepgram.com/docs/build-a-voice-agent)

This chapter builds understanding through **Build Status**, an original assistant that answers questions about synthetic CI jobs. It can tell a developer which stage failed and explain the fixture's diagnostic note. It cannot rerun a build or alter a pipeline. The example focuses on streaming correctness and factual tool results, two issues that remain important even when a service manages the speech pipeline.

Allow three to five hours for a first implementation. You need basic JavaScript or Python, an understanding of credentials, and a microphone for a live conversation. The offline experiments need only Node.js. No Deepgram session, provider key, or paid usage was created during authoring. The API configuration fragments are examples to study with current documentation, not evidence of a completed live deployment.

## Why one connection is useful, and what it does not solve

Without a managed pipeline, you coordinate recognition output, model input, model streaming, synthesis, interruption, and connection lifecycle yourself. A combined service can reduce those integration seams. You still need to send the correct audio, interpret events, connect business tools, handle failures, and ensure the person hears a truthful result.

Build Status makes this concrete. A person asks, “Why did the morning staging build fail?” The service can hear and respond, but it does not know your build system unless you provide a tool or context. If your lookup returns yesterday's result, the conversation may sound natural while being wrong. If your client sends stereo float samples while declaring mono signed integer samples, the model may receive unusable audio despite an apparently healthy connection.

Separate the problem into three layers: media correctness, conversational behavior, and build truth. Media correctness asks whether bytes match the declared format and reach the right place. Conversational behavior asks whether turns and interruptions feel understandable. Build truth asks whether the requested job and returned evidence agree. A passing result needs all three.

This separation gives you a useful debugging order. Prove the transport with a known sample or unchanged official starter. Prove the lookup with an offline fixture. Then combine them and investigate how the agent selects and explains the result. Do not begin by tuning the prompt to compensate for malformed audio.

## Audio prerequisites explained practically

Digital audio represents sound as samples. **Sample rate** is samples per second per channel. **Channel count** distinguishes mono from stereo. **Encoding** says how each sample is represented. **Container** refers to a wrapper that may include headers and metadata. Raw PCM and a WAV file can contain related sample data, but sending the entire WAV file as if it were headerless samples can be wrong for the receiver's declared expectations.

For a simple teaching example, mono 16-bit PCM at 16,000 samples per second uses 32,000 bytes per second before transport overhead: 16,000 samples multiplied by two bytes. A 20-millisecond chunk contains 320 samples and therefore 640 bytes. These are mathematical properties of the example format, not Deepgram pricing or performance claims.

A browser microphone often exposes audio in a representation different from your chosen wire format. Do not relabel it. Conversion may require resampling, channel mixing, and conversion from floating-point values to integer samples. Each step should have a test. A library or browser SDK may handle much of this, which is a good reason to use the documented client route before writing a custom media pipeline.

**Streaming** means send chunks over time rather than waiting for one whole recording. Chunk sizes affect buffering and overhead. **Backpressure** means the receiver or network is not keeping up. If you keep appending audio to an unbounded queue, memory and perceived delay grow even though the connection remains open.

You do not need to memorize every codec. You need to know the exact format at each boundary and avoid assuming that all objects called “audio” are interchangeable. Keep a small format table in your project: capture format, transmitted format, generated output format, and playback format.

## Follow the current connection lifecycle

The documented agent endpoint is `wss://agent.deepgram.com/v1/agent/converse`. The build guide also lists regional alternatives; choose and verify the endpoint that fits your implementation rather than changing a hostname by guesswork. The lifecycle begins with configuration before ordinary audio exchange. [Build a Voice Agent](https://developers.deepgram.com/docs/build-a-voice-agent)

Use the official JavaScript or Python starter for your first live session. The documentation provides language-specific guides and template applications. Keep their dependency versions coherent. A recent SDK example and a much older event handler can each look reasonable while being incompatible together. [JavaScript guide](https://developers.deepgram.com/docs/build-a-voice-agent-javascript)

Record the SDK version, endpoint, selected recognition/model/voice configuration, and input/output formats. Keep the provider key in a server or appropriately documented credential flow. Do not embed a long-lived key into a public browser file simply because a local demo makes that easy.

Before adding Build Status tools, run one short conversation against the unchanged starter. Confirm that the connection opens, settings are accepted, audio is understood, a reply plays, and ending the session releases resources. This test establishes a media baseline. It does not establish correctness of your future build lookup.

## Read settings as a contract

Deepgram documents a `Settings` message with separate audio and agent configuration. The current configuration guide distinguishes input and output media settings and provider-specific configuration. Follow the provider model pages for supported choices rather than assuming that every model name works in every slot. [Configure the Voice Agent](https://developers.deepgram.com/docs/configure-voice-agent)

This is an **audio-settings fragment**, not a complete agent configuration:

```json
{
  "type": "Settings",
  "audio": {
    "input": {"encoding": "linear16", "sample_rate": 16000},
    "output": {"encoding": "linear16", "sample_rate": 16000, "container": "none"}
  }
}
```

It describes the format you intend to send and receive. It does not convert microphone data or select the full listening, thinking, and speaking configuration. Add the remaining fields from the current official starter, then make your media code satisfy this contract. A mismatch can produce noisy audio, altered speed, or no useful recognition.

Keep output configuration connected to playback. If output samples are interpreted at the wrong rate, the voice may sound too fast or too slow. That is not necessarily a model problem. If the service sends raw samples, the client must play them using the correct format rather than assuming every chunk is a complete browser-playable file.

Avoid adding undocumented fields copied from another speech API. Similar products use similar words with different schemas. A JSON object can be syntactically valid while semantically ignored or rejected. Check the server's configuration acknowledgment and errors rather than assuming successful socket creation means the configuration is active.

## A runnable media-size experiment

Save this complete program as `audio_contract_demo.mjs` and run `node audio_contract_demo.mjs`. It uses only Node's built-in assertion module. It creates no microphone recording and sends no audio to a service.

```javascript
import assert from 'node:assert/strict';

function pcmBytes({sampleRate, channels, bitsPerSample, milliseconds}) {
  for (const value of [sampleRate, channels, bitsPerSample, milliseconds]) {
    if (!Number.isFinite(value) || value <= 0) throw new Error('Positive values required');
  }
  if (bitsPerSample % 8 !== 0) throw new Error('Whole-byte samples required');
  const samplesPerChannel = sampleRate * milliseconds / 1000;
  if (!Number.isInteger(samplesPerChannel)) throw new Error('Fractional sample count');
  return samplesPerChannel * channels * bitsPerSample / 8;
}

const format = {sampleRate: 16000, channels: 1, bitsPerSample: 16};
const oneChunk = pcmBytes({...format, milliseconds: 20});
const oneSecond = pcmBytes({...format, milliseconds: 1000});
assert.equal(oneChunk, 640);
assert.equal(oneSecond, 32000);
assert.equal(pcmBytes({...format, channels: 2, milliseconds: 20}), 1280);

const tenSeconds = Buffer.alloc(oneSecond * 10);
assert.equal(tenSeconds.length, 320000);
console.log({oneChunk, oneSecond, tenSecondBytes: tenSeconds.length});
```

The expected values are 640 bytes, 32,000 bytes, and 320,000 bytes. `Buffer.alloc` creates zero-valued bytes; in the chosen signed PCM representation, that is a useful silence fixture. The calculation does not include file headers, compression, or network framing. Those omissions are explicit because this is an audio-contract exercise.

Now change `channels` from one to two. The byte requirement doubles, even though the duration stays the same. If a capture device produces stereo while your receiver expects mono, simply sending the bytes does not preserve the intended interpretation. The experiment makes the mismatch visible before you diagnose it through distorted speech.

Use a similar calculation in development metrics. If ten seconds of declared mono PCM produces only a few hundred bytes, inspect the capture or chunking path. If it produces far more than expected, check channel count, sample width, duplication, and container overhead. Numbers can localize a media bug faster than repeatedly asking the assistant “can you hear me?”

## Add the Build Status business function

Start with a complete offline lookup. Save this as `build_lookup_demo.mjs` and run it with Node.js.

```javascript
import assert from 'node:assert/strict';

const jobs = new Map([
  ['demo-staging-72', {id: 'demo-staging-72', environment: 'staging',
    state: 'failed', failedStage: 'schema-check',
    evidence: 'Synthetic fixture: required demo column was absent.',
    productionAffected: false}],
  ['demo-staging-73', {id: 'demo-staging-73', environment: 'staging',
    state: 'running', failedStage: null,
    evidence: 'Synthetic fixture: integration tests are running.',
    productionAffected: false}]
]);

function getBuildStatus({buildId} = {}) {
  if (typeof buildId !== 'string' || !/^demo-staging-\d+$/.test(buildId)) {
    return {status: 'invalid_build_id'};
  }
  const build = jobs.get(buildId);
  return build ? {status: 'ok', build} : {status: 'not_found'};
}

assert.equal(getBuildStatus({buildId: 'demo-staging-72'}).build.state, 'failed');
assert.equal(getBuildStatus({buildId: 'demo-staging-73'}).build.state, 'running');
assert.equal(getBuildStatus({buildId: 'demo-staging-99'}).status, 'not_found');
assert.equal(getBuildStatus({buildId: '../private'}).status, 'invalid_build_id');
console.log('Four synthetic build lookup cases passed.');
```

The regular expression restricts the identifier format used by this demo. It is not an authorization policy. In a real CI integration, the backend must also verify that the current user may access the requested project. Derive identity from your application, not from a model-supplied username.

Notice that a running job has no failed stage. The assistant should not invent one just because the user asks “why did it fail?” The tool result can correct the premise: “That build is still running; I do not have a failure to explain.” This is a valuable evaluation case because fluent agents often try to satisfy the form of a question even when its premise is false.

Attach the function using the current Voice Agent function-calling guide and reference. Preserve function-call identifiers in responses and follow the documented result shape. The portable function above is only the business layer; it is not the full wire protocol.

## Give the assistant an evidence policy

Use this original instruction set for the project:

```text
You are Build Status, an AI assistant for synthetic CI build records.
Ask which build the user means when its identifier is unclear.
Use the status lookup for state, failed stage, and diagnostic evidence.
Explain the result briefly in spoken language. If the job is running,
say that it is running rather than inventing a failure. Distinguish
staging from production. If lookup fails, say the status is unverified.
You cannot rerun jobs, change pipelines, or repair a deployment.
When the user changes the build identifier, use the revised identifier.
```

Keep a small factual result and let the voice explain it. Do not send an enormous CI log into every turn if one diagnostic field answers the question. If the person asks for more detail, retrieve a focused section through another read-only operation. This reduces context noise and makes evidence easier to inspect.

Treat build logs as untrusted reference data. A log line containing “ignore previous instructions” is still a log line. Your tool description and application boundary should not allow repository content or test output to redefine the assistant's role or grant new capabilities.

For spoken identifiers, provide a visual companion where possible. Long build IDs are difficult to hear accurately. Let the person select a build in the UI and use voice for the explanation. This often improves the product more than trying to make the model spell every identifier perfectly.

## Handle the event stream deliberately

A persistent connection can carry different kinds of information: lifecycle messages, configuration acknowledgments, text events, function requests, errors, and audio output. Use explicit handlers and preserve unknown-event diagnostics in development. Do not parse every incoming message as JSON if the connection also carries binary audio.

The official reference is the authority for current event names and payloads. The documented workflow includes events and audio handling; your application should correlate tool requests and responses rather than relying on their arrival order alone. [Build a Voice Agent](https://developers.deepgram.com/docs/build-a-voice-agent), [Voice Agent API reference](https://developers.deepgram.com/reference/voice-agent/voice-agent)

For Build Status, keep a local request revision. If the person changes from build 72 to build 73, a delayed build-72 result should not become the answer. Cancellation can save work, but the result handler still needs a relevance check because a request may complete just as it is canceled.

Separate errors by scope. A recoverable tool error should not necessarily destroy the media session. A broken media connection may require a new session. An invalid settings message requires configuration repair. Reporting all three as “the AI is unavailable” makes both the user experience and debugging less useful.

## Make interruption and playback observable

When a person interrupts, your client must coordinate current playback with the service's conversation behavior. Audio already buffered locally may continue even after the server changes course. Inspect the current audio/playback guidance for your chosen SDK and use its documented interruption mechanism. Do not assume a new transcript automatically empties your speaker queue.

Test a precise scenario: start an explanation of build 72, interrupt with “I meant 73,” and verify that obsolete audio stops and the next answer describes a running job. Keep the transcript, tool arguments, tool result, and listening notes together. A generated transcript may contain text that was never fully played.

Also test ordinary backchannels such as “okay.” They should not necessarily trigger the same behavior as “stop” or a corrected build identifier. The desired policy depends on the application, but the difference should be intentional. Evaluate the whole interaction rather than simply counting whether any interrupt event occurred.

Use headphones for the initial baseline. If the assistant hears its own speaker output through the microphone, you may observe false turns or repeated replies. Add more realistic device conditions after the basic path works. A clean baseline makes an acoustic feedback problem easier to recognize.

## Measure latency with a trace, not a slogan

Choose timing points that reflect the task: final user word, turn acceptance, lookup start, lookup completion, first reply audio, and first useful factual content. Where a stage is not observable, say so. Do not subtract timestamps from clocks that are not synchronized and present the difference as precise network latency.

Compare short known lookups with an intentionally delayed fixture. If the delayed fixture dominates the wait, tuning speech output is unlikely to solve the main pause. If the tool returns quickly but first audio is slow, inspect the remaining path. A stage-by-stage trace gives you a concrete next experiment.

Measure failure rates alongside speed. A system that responds faster by guessing the build identifier may look good in a latency chart and fail the actual job. Keep incorrect incident/build selection, false failure explanations, and stale-result errors visible in the report.

Do not treat vendor demo latency as a promise for your environment. Provider choices, geography, network conditions, tool response times, and client playback all affect the result. Your acceptance thresholds should be based on the intended user experience and measured with the application you plan to deploy.

## Operate connection lifecycle and cost responsibly

The current build guide states that Voice Agent usage is calculated from WebSocket connection time. This makes idle sessions operationally meaningful: ending the visible conversation should also close the underlying connection according to the documented client lifecycle. Check current pricing and provider arrangements before budgeting. [Build a Voice Agent](https://developers.deepgram.com/docs/build-a-voice-agent)

Set a deliberate inactivity policy. Warn the person before ending a useful session, and provide an easy restart route. Do not keep a hidden socket alive indefinitely after the UI says the conversation ended. Track active sessions and cleanup errors in development so you can detect leaked connections.

For remote deployment, keep secrets in the host's secret store, verify outbound connectivity, and use an application authentication layer appropriate to the data. Localhost inside a server process is not your development laptop. If the build lookup works locally but fails remotely, inspect endpoint addresses and network permissions before changing the prompt.

Pin a working SDK and configuration, then upgrade in a controlled step. Replay the media baseline and business scenarios after changes to encoding, transport, provider, or event handling. Keep the same synthetic fixtures so the comparison remains interpretable.

## Troubleshooting by observable symptom

| Symptom | First check | Small experiment |
| --- | --- | --- |
| Socket opens but no useful speech | Settings acknowledgment and input bytes | Unchanged official starter |
| Audio sounds fast or slow | Declared versus playback sample rate | Known-duration synthetic sample |
| Noise instead of speech | Encoding, channel count, container | Inspect format contract at each boundary |
| Correct transcript, wrong build | Tool arguments and current selection | Offline lookup with identical identifier |
| Old reply continues after correction | Local playback queue and stale results | Delayed build-72 lookup |
| Memory grows during a call | Unbounded queues and backpressure | Log queue size over time |
| Costs continue after visible end | Socket cleanup | Check server session count after stop |

Repair the smallest failing boundary. A bad sample conversion needs a media fix. A wrong build identifier needs a context or UI fix. A lookup timeout needs a service or fallback fix. Adding “be accurate” to a prompt does not address any of these specifically.

## Compare alternatives and complete the project

Deepgram Voice Agent is useful to study when a managed speech pipeline and explicit WebSocket integration fit the application. Compare [LiveKit](01-livekit.md) and [Pipecat](02-pipecat.md) for broader code-centered frameworks. Compare [Vapi](03-vapi.md) and [Retell](04-retell.md) for managed assistant workflows, and [OpenAI Realtime](06-openai-realtime.md) for a direct speech-to-speech session model.

For the optional Build Status project, deliver two synthetic builds, one read-only tool, a start/end interface, and a format contract. Test missing identifier, running build, failed build, unknown build, lookup outage, interruption, and a delayed obsolete result. Acceptance means answers follow fixture evidence, production is not described as affected, no rerun is claimed, and ending the session stops capture and connection usage.

Use this coding-assistant prompt:

```text
Inspect the current Deepgram Voice Agent starter and official docs.
Build a read-only Build Status demo with synthetic CI records. First
document capture, wire, output, and playback audio formats. Preserve
the starter's working media path. Add validated build lookup, explicit
not-found/error results, and stale-result rejection after a corrected
build ID. Keep credentials server-side and close the session on end.
Deliver offline format/lookup checks plus a manual interruption test.
Report what required live audio and was not tested. Do not connect a
production CI system, rerun jobs, or expose a broad execution tool.
```

## A controlled audio-format debugging lab

Keep a known-duration sample with a documented format alongside your media adapter tests. For example, use a short synthetic tone or silence created in your own test environment, record its expected sample count, and verify the transmitted byte count before connecting a model. The purpose is to prove the adapter's arithmetic and framing independently of speech recognition quality.

Test one intentional mismatch at a time in a local playback environment. Declaring the wrong sample rate changes the interpreted duration and pitch. Treating a header as raw samples can create an artifact at the beginning. Duplicating chunks creates repeated sound. Dropping chunks creates gaps. These symptoms provide a vocabulary for explaining what you hear instead of calling every problem “bad audio.” Do not send deliberately malformed media into a shared production service.

Then test queue growth. Feed chunks into a local consumer that is deliberately slower than the producer and log queued duration, not just item count. Ten items can represent very different amounts of audio if chunk size varies. Set a bounded policy and verify it. For a realtime conversation, playing ten seconds of old speech is often worse than reporting a recoverable interruption and restarting the current turn.

Keep the results separate from recognition accuracy. A correctly formatted recording can still be hard to recognize because of noise, pronunciation, or domain vocabulary. Conversely, a recognizer may recover some words from a flawed stream and make the transport appear healthy. Use format checks and listening checks before judging the model's language understanding.

Finally, repeat the known sample after any change to capture device, browser adapter, resampler, encoding option, or playback library. This is a small, meaningful regression test because those changes can alter the bytes without touching the agent prompt. The output should report the declared format, observed sample or byte count, and expected duration, giving the next developer enough information to reproduce the result.

One last check is reproducibility: give another developer the declared format table, the synthetic build fixture, and the lockfile. They should be able to reproduce the offline results without your account or private data. Their first live run should require only their own documented credentials and the current starter setup. If an undocumented local conversion script or hidden device setting is required, add it to the project notes before considering the learning artifact complete.

Keep the media fixture synthetic and labeled, so future reviewers never mistake a generated tone or a silent buffer for evidence of real speech-recognition quality.

## Sources and verification boundary

Checked **November 13, 2026**: [Voice Agent overview](https://developers.deepgram.com/docs/voice-agent), [Build a Voice Agent](https://developers.deepgram.com/docs/build-a-voice-agent), [JavaScript guide](https://developers.deepgram.com/docs/build-a-voice-agent-javascript), [Configure the Voice Agent](https://developers.deepgram.com/docs/configure-voice-agent), and [Voice Agent API reference](https://developers.deepgram.com/reference/voice-agent/voice-agent). The format arithmetic, build fixtures, project workflow, and test criteria are original instructional examples.

No live WebSocket, microphone stream, function callback, provider model, or deployment was exercised during authoring. Verify the current SDK, regional endpoint, supported provider configuration, media requirements, and account billing before implementing a live system.
