# 2. From air pressure to browser audio

The first audio bug many developers encounter sounds like a model failure: the voice is too fast, too slow, distorted, or silent. Frequently the model is fine. The application interpreted the bytes using the wrong sample rate, treated compressed audio as raw samples, or scheduled playback in a suspended audio context. To diagnose these problems, we need a precise but practical account of digital audio.

This chapter assumes only arithmetic and basic arrays. We will turn a short list of numbers into a sound, calculate how much data a voice stream needs, and connect those ideas to browser APIs. The runnable files `examples/python/core.py` and `examples/typescript/core.ts` create the same kind of tone. The companion's PCM experiment calculates frame sizes and displays a synthetic waveform. It does not record your voice or perform speech recognition.

## A sample is a measurement at one time

A microphone converts changing air pressure into an electrical signal. An audio device measures that signal repeatedly. Each measurement is a sample. A digital mono recording is an ordered sequence of samples plus information describing how quickly to play them. The samples alone do not tell a player how much time they represent.

The sample rate is measured in samples per second, usually written hertz or Hz. At 16,000 Hz, the device produces 16,000 samples every second for one channel. If you have 8,000 samples at that rate, you have half a second. The relationship is duration = sample count / sample rate. Substituting the values gives 8,000 / 16,000 = 0.5 seconds.

A channel is an independent stream of samples. Mono has one channel; stereo typically has left and right channels. Speech-model interfaces often request mono because a single conversational voice does not require stereo spatial information. A stereo capture cannot be made mono by declaring it to be mono. You must select a channel or combine channels according to a deliberate policy.

A sample's magnitude represents the measured signal amplitude, not a word or a phoneme. In floating-point browser audio, values commonly use a normalized range around minus one to plus one. Silence is near zero. Negative values are ordinary oscillations, not errors. A waveform alternates around zero as pressure changes. A constant positive value is not a constant musical tone; its transitions may produce clicks, and a sustained offset is not useful speech.

## Understand PCM16 before writing any networking code

PCM means pulse-code modulation. In the common signed 16-bit form, each sample occupies two bytes and represents an integer from minus 32,768 through plus 32,767. Little-endian means the less significant byte comes first. Endianness is a byte-order convention. It is unrelated to whether speech is spoken quickly or slowly.

Suppose a normalized sample is 0.25. Multiplying by 32,767 gives 8,191.75. Rounding produces 8,192. In hexadecimal that is `0x2000`, represented in little-endian bytes as `00 20`. A player reading the opposite order interprets a very different integer. Repeated across thousands of samples, that error can sound like harsh noise.

The example conversion clamps values into the allowed normalized interval before quantization. Clamping means replacing values above one with one and values below minus one with minus one. It prevents integer overflow during encoding. It does not repair a recording that was already clipped during capture; the lost waveform detail cannot be reconstructed by lowering the volume afterward.

Here is a complete Python experiment that can run without any dependencies:

```python
import struct

samples = [0.0, 0.25, -0.25, 1.0, -1.0]
encoded = b''.join(
    struct.pack('<h', round(max(-1, min(1, sample)) * 32767))
    for sample in samples
)
print(len(encoded))
print(struct.unpack('<5h', encoded))
```

The first output is `10`, because five samples use two bytes each. The second output contains the five quantized signed integers. The `<` selects little-endian byte order, `h` selects a signed short integer, and `5h` decodes five of them. The negative full-scale sample maps to minus 32,767 in this symmetric teaching conversion. Using minus 32,768 for that extreme is another valid conversion convention; be consistent when comparing exact bytes.

In TypeScript, a `DataView` gives explicit control over the byte order. A typed array alone uses the platform's native layout, which is less explicit when you are teaching a wire format. The following is a runnable Node fragment when saved as a `.ts` file under Node 24:

```typescript
const values = [0, 0.25, -0.25, 1, -1];
const bytes = new ArrayBuffer(values.length * 2);
const view = new DataView(bytes);
values.forEach((value, index) => {
  const clipped = Math.max(-1, Math.min(1, value));
  view.setInt16(index * 2, Math.round(clipped * 32767), true);
});
console.log(bytes.byteLength);
console.log(view.getInt16(2, true));
```

The `true` argument selects little-endian. The second output is 8,192. An offset counts bytes, so sample one begins at byte offset two. This is a small detail with a large practical effect: confusing sample indexes and byte indexes silently shifts or corrupts the stream.

## Calculate frame duration and bandwidth

A frame in this book is a short application chunk of audio samples. Other systems use the word frame differently, so always state the units. We will often use 20-millisecond chunks. Twenty milliseconds is 0.020 seconds. At 16,000 samples per second, the chunk contains 16,000 × 0.020 = 320 samples. With mono PCM16, it occupies 320 × 2 = 640 bytes.

The general equation is bytes = rate × duration_seconds × channels × bytes_per_sample. For one second of 24 kHz mono PCM16, that becomes 24,000 × 1 × 1 × 2 = 48,000 bytes. This is the raw payload, before transport framing, encryption, or protocol metadata. Stereo doubles the payload if the other values stay the same.

Base64 encodes arbitrary bytes as text. It is useful when a protocol places audio inside JSON strings. For a binary input of length `n`, the encoded length is `4 × ceil(n / 3)`. A 640-byte chunk therefore becomes 856 Base64 characters. This is roughly a one-third expansion, with rounding for the final group. JSON property names add further overhead. Base64 does not resample, compress, or improve the audio.

Smaller chunks can reduce the delay before data is sent, but create more messages and scheduling work. Larger chunks reduce message overhead but require more audio to accumulate before transmission. The right setting depends on the interface and playback behavior. A 20-millisecond teaching frame is not a promise that every provider accepts or prefers that exact chunk size.

Chunk duration also affects cancellation. If the producer has already generated two seconds of audio and the player schedules all of it, a tiny network chunk size will not make interruption feel immediate. You must inspect queued audio duration as well as message size. The companion distinguishes these quantities so they do not collapse into a single “buffer size” setting.

## Containers, codecs, and raw samples are different

A WAV file usually contains a header followed by audio data. The header describes properties such as channel count, rate, and encoding. A raw PCM stream has no such header. If an API requests raw PCM, sending an entire WAV file sends header bytes that the receiver may interpret as samples. That can create a click or corrupt the beginning of the turn.

A codec describes how audio is encoded, often with compression. MP3 and Opus are compressed formats. A container organizes encoded data and metadata. WebM is a container commonly encountered with browser recording. `MediaRecorder` may produce WebM/Opus or another supported format depending on the browser. Its chunks do not become raw PCM because you rename the file extension to `.pcm`.

This is why the included Gemini Python example reads a WAV file with the standard `wave` module and extracts its sample frames before sending. The TypeScript Gemini example instead requires a raw PCM input file and rejects a leading RIFF signature. The two inputs teach the same wire representation through different preparation paths. Their README explains the distinction explicitly.

When a provider returns complete MP3 bytes, an HTML audio element can often decode and play the file as a media resource. When a provider returns small raw PCM chunks, you need a PCM playback path, usually involving Web Audio and an appropriate buffering strategy. Feeding raw bytes to an audio element without a supported container is a common source of unexplained silence.

## Why changing a number is not resampling

Suppose a device captures 48,000 samples per second but a provider expects 16,000. Relabeling those samples as 16 kHz makes one second of captured audio last three seconds. It also lowers its apparent pitch. The waveform samples did not change; only the clock used to interpret them changed. This is a playback-speed change, not a conversion to equivalent 16 kHz audio.

Resampling creates a new sequence representing the same signal at another rate. In the idealized 48-to-16 kHz case, the output has one-third as many samples. Before discarding samples, a low-pass filter removes frequencies that the lower rate cannot represent safely. Otherwise high-frequency content can appear at incorrect lower frequencies, an effect called aliasing.

You do not need to derive a production resampler to build a voice app. You do need to use a tested resampling implementation and know its input and output rates. A browser can negotiate or process audio internally, but requested capture constraints are not a universal guarantee. Inspect `AudioContext.sampleRate` and track settings, then convert deliberately when the API requires a fixed format.

A simple linear interpolation experiment can illustrate rate conversion, but should be labeled as educational. It is not automatically a high-quality anti-aliasing resampler. This distinction is an example of a general rule in the book: an implementation that makes a concept visible is useful, but its production claims must remain proportional to what it actually does.

## Make browser capture a user-controlled lifecycle

A browser microphone request returns a promise for a `MediaStream`. That stream contains tracks. An audio track is the owned resource carrying microphone audio. When the user ends a conversation, stop every owned capture track. Closing a WebSocket or hiding a modal does not necessarily stop the microphone. The capture resource has its own lifecycle.

The official [`getUserMedia` documentation](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) describes secure-context requirements, permission prompts, and errors. A request can remain pending if the user does not answer. Design the interface so the user can cancel that waiting state, and so a late permission result cannot restart an already-ended conversation.

The included browser client solves that race with a generation number. Start captures the current generation in a local variable. End increments the shared generation. When microphone permission eventually resolves, the asynchronous start code compares the two values. If they differ, it stops the newly obtained tracks and exits. No model call is necessary to experience or test this bug.

Echo cancellation attempts to reduce the speaker's audio reaching the microphone. Noise suppression attempts to reduce non-speech noise, and automatic gain control adjusts levels. These are capture-processing requests, not guarantees of identical behavior on every device. Headphones often make full-duplex testing easier because less generated speech leaks acoustically back into the microphone.

Avoid requesting permission on page load merely because the SDK can do so. Explain what audio will be sent, then tie capture to an explicit action. A visible microphone indicator should reflect actual track state. A “Muted” label should not mean only that the waveform animation has stopped. Check whether your mute action disables capture tracks, stops transmission, or both, and communicate the implemented behavior.

## Playback is a scheduler

A browser has its own audio clock. Web Audio scheduling uses seconds on `AudioContext.currentTime`, not wall-clock dates. If chunks arrive every 20 milliseconds, calling a play operation immediately on every network event can produce gaps or overlaps because network arrivals are irregular. A player normally places chunks consecutively on a short playback timeline.

For a PCM chunk with `N` samples at rate `F`, its duration is `N / F` seconds. If a chunk contains 480 samples at 24 kHz, its duration is 0.020 seconds. The next chunk should start where that chunk ends, subject to a small initial buffer and a policy for underruns. An underrun occurs when the player reaches the end of available audio before the next chunk arrives.

A jitter buffer absorbs variation in arrival times. More buffering can reduce underruns but increase response and interruption latency. This is a tradeoff rather than a knob to maximize. If your target buffer is 80 milliseconds but your implementation quietly schedules two seconds ahead, the nominal setting is not the real behavior. Track actual queued duration and trim or fail according to an explicit bound.

Autoplay policy introduces another failure mode. Audio playback can be rejected until a permitted user interaction occurs. The Realtime demo includes a visible audio control and catches a rejected `play()` promise to explain what the user can do. A silent page that says “Connected” without any recovery control is a UX failure even if every network request succeeded.

## Worklets and real-time boundaries

An `AudioWorklet` is a browser mechanism for running audio processing separately from ordinary page UI work. It is useful when you need continuous sample processing, such as constructing PCM capture frames or maintaining a low-latency playback ring buffer. It is not needed just to forward a microphone track through WebRTC; the media stack already handles that transport path.

Keep worklet processing small and predictable. Avoid network requests, expensive allocations, and unbounded queues inside the sample-processing loop. Transfer batches of samples to the application layer using message passing. The application layer can encode messages and talk to a provider. Separating these responsibilities helps a slow UI update avoid becoming an audible glitch.

The older `ScriptProcessorNode` appears in historical tutorials. This book does not use it as a production capture recommendation. Before adopting any copied audio example, check the current API and browser support. The important concept is that sample processing has timing requirements unlike ordinary event-driven UI work; the exact implementation should follow supported platform facilities.

In the delivered WebRTC sample, the browser sends a media track directly to the peer connection. There is no need to encode PCM manually for that path. In the delivered Gemini file examples, the application owns PCM formatting because the WebSocket protocol expects it. These different responsibilities follow from the transport choice, not from a preference for one programming language.

## A practical audio diagnosis sequence

When a voice sounds wrong, first inspect the format contract at each boundary. Record channel count, rate, sample width, byte order, container, and codec. Next compare expected duration with actual sample count. If 16,000 samples play for one-third of a second, a rate interpretation is probably wrong. If the duration is right but the audio is harsh, inspect quantization, endianness, and clipping.

When there is silence, check capture separately from playback. A permitted microphone track may be disabled. A connected peer may have no attached track. An audio element may have no `srcObject`. A context may be suspended. A provider may return a textual error body that was incorrectly saved as an audio file. Validate content type and response status before treating bytes as sound.

When playback clicks between chunks, inspect scheduling continuity and sample boundaries. Independent audio buffers are not guaranteed to align smoothly if each is started at the moment its network message arrives. Check that all chunks use the same format and that your duration calculation uses sample count rather than byte count. A two-byte sample accidentally counted as two samples doubles the scheduled duration.

Finally, test representative devices. Laptop speakers, Bluetooth headsets, mobile browsers, and USB microphones can behave differently. The deterministic tone and numeric calculations establish a baseline; they cannot certify a physical microphone or speaker. The verification report identifies exactly which browser and simulated media conditions were exercised, leaving real-device acoustic testing as an explicit deployment task.

We now have a concrete audio contract. The next chapter explains how to move those frames through asynchronous code without growing an infinite queue, losing cancellation, or letting an old response return after the conversation has already changed.
