# 4. Build a speech-to-text, reasoning, and text-to-speech pipeline

We now have enough foundations to make a complete speech turn. Start with a valid recording, transcribe it, ask a language model for a short reply, synthesize that reply, and save the result. This first implementation waits for each stage. It is intentionally easier to inspect than a continuously streaming application. Once its boundaries are clear, we can overlap work without losing the ability to diagnose it.

The complete implementations are `examples/python/providers.py` and `examples/typescript/providers.ts`. They use HTTP interfaces rather than depending on a rapidly changing speech SDK. Both provide a `tts` mode for testing synthesis in isolation and a `cascade` mode for a whole recorded utterance. These are paid network examples, not the offline companion. They were inspected and syntax-checked; live provider calls require your credentials and were not executed during this edition's verification.

## Establish the input and the contract

Use a short, non-sensitive WAV recording containing speech. The synthetic tone from chapter 2 is useful for checking audio formats, but it is not a meaningful transcription test. A recognizer may return no text or a spurious interpretation for a tone. That is not evidence about its ability to recognize ordinary speech.

The pipeline's input is one utterance file. Its intermediate data is a transcript string and then a response string. Its output is a playable file: WAV for the Cartesia adapter or MP3 for the ElevenLabs adapter. It has no persistent conversation memory, no realtime microphone, and no booking authority. Keeping those limits explicit lets you verify one behavior at a time.

Before running, set `OPENAI_API_KEY`, `OPENAI_STT_MODEL`, and `OPENAI_TEXT_MODEL` in the server process. Choose model identifiers that your account currently supports for transcription and Responses respectively. They are deliberately required configuration rather than hidden “latest” defaults. For Cartesia, also set `CARTESIA_API_KEY` and `CARTESIA_VOICE_ID`; for ElevenLabs, use the corresponding key and voice ID. Never paste keys into the example source or a browser bundle.

A typical shell invocation after configuring those variables is:

```bash
python examples/python/providers.py cascade utterance.wav cartesia
node examples/typescript/providers.ts cascade utterance.wav elevenlabs
```

Run only the command matching your intended language and provider. It writes `reply.wav` or `reply.mp3` in the current directory. The program prints the transcript and answer so you can inspect the text boundary. Use synthetic or permitted speech for that reason; console logs are also a data-retention surface.

## Stage one: send a recording for transcription

An HTTP transcription request commonly carries a model identifier and a file as multipart form data. Multipart means the request body contains separate named fields, each with its own boundary markers and metadata. It is not a JSON object containing an arbitrary filesystem path. The remote service cannot read a local path unless you upload the bytes or provide a supported accessible resource.

Python's example constructs a small multipart request using the standard library. It generates a unique boundary, adds a `model` field, adds the WAV file under the `file` field, and ends with a closing boundary. The boundary in the `Content-Type` header must match the boundary in the body. Missing carriage-return/newline separators can make a seemingly plausible request unparsable.

TypeScript uses native `FormData` and `Blob`. It reads the recording, wraps those bytes in a Blob with a WAV media type, and attaches a filename. Fetch generates the multipart boundary. Do not manually set a generic `multipart/form-data` header when using this mechanism; doing so can omit the boundary that the runtime needs to add.

The relevant interface is documented in [OpenAI's transcription reference](https://developers.openai.com/api/reference/resources/audio/subresources/transcriptions/methods/create). The teaching program expects a successful response with a `text` field. It checks HTTP success before decoding the result. This matters because an error response is not an empty transcript and should not silently become input to the next stage.

## A transcript is a hypothesis with a lifecycle

A whole-file transcription gives you a finished response for that request. Streaming recognition is different. It may produce interim text, finalized segments, timestamps, or replacement hypotheses. Your application needs a contract for when words are stable enough to trigger reasoning. “I want Thursday” can become “I want Thursday, no, Friday” within one turn.

Do not trigger an irreversible action from an interim recognition hypothesis. Even a final transcript is only recognition output, not authorization to act. A useful cascade treats recognition as evidence about what was said. It then resolves intent, missing context, and any confirmation policy through separate logic.

A recognizer can be highly accurate on average and still fail on the one noun that matters. An appointment assistant cares about dates, times, names, and quantities. Measure those entities explicitly. A transcript with one incorrect negation can be more harmful to task correctness than several harmless punctuation differences. Later evaluation therefore includes semantic task checks as well as word error rate.

Language hints and vocabulary hints can help when supported, but they should not force the user into a false transcript. If your app expects a product named “Harbor,” test the recognizer with that name in actual sentences and with similar words. Do not assume a hint guarantees correctness. Keep a repair path such as “I heard Thursday at three. Is that right?” when the detail matters.

## Stage two: request a spoken answer

The language model receives the transcript and instructions. The example asks for one or two short spoken sentences and explicitly forbids claiming that actions were executed. This is a behavior request, not a security boundary. The stronger reason the program cannot book anything is that it has no booking tool or database write path.

The Responses HTTP interface returns structured output items. The example walks through those items and extracts content parts whose type is `output_text`. It does not assume that the entire response object is a single string. A response can contain other items, including tool requests or reasoning-related structures, so extraction should match the documented output shape.

The program rejects an empty extracted answer before calling TTS. This prevents a failed or unsupported reasoning response from becoming a confusing synthesis request. In production, also limit the length of spoken output. A model that produces a thousand-word answer can create cost, delay, and an unpleasant interaction even if the HTTP request is formally successful.

For Harbor, the best next response often asks for one missing detail. If the transcript is “I need an appointment,” a short question about date or purpose is more useful than listing every possible scheduling feature. Speech disappears as it is heard, so the user benefits from a clear next action and a small amount of information at a time.

## Stage three: generate the voice

The synthesis adapter receives the intended spoken text. Cartesia's request calls the text field `transcript`; ElevenLabs calls it `text`. The adapters map these differences while keeping the outer pipeline stable. They also specify a model, voice, and output format. A voice ID is an account/provider resource, not a generic name that works everywhere.

The program saves bytes rather than attempting to parse the audio body as JSON. An API documentation generator may display a generic string response, but your implementation must follow the endpoint's audio response contract. Inspect status and media type when debugging. Saving a JSON error message with a `.wav` extension does not create a valid audio file.

The choice of WAV or MP3 is intentional. WAV PCM is easy to inspect and decode deterministically. MP3 is widely playable and smaller, but compressed chunks require a suitable decoder or media path. For this whole-file baseline, either can be played after download. For low-latency streaming, format and player design need to be reconsidered together.

Voice quality includes pronunciation, timing, intelligibility, and consistency across turns. A dramatic voice demo is not necessarily the best voice for a task assistant. Test numbers, abbreviations, addresses, and the vocabulary your app actually uses. A calm, concise answer that pronounces an appointment time correctly is often more valuable than broad expressive range.

## Trace a concrete utterance through the program

Suppose the recording contains “What information do you need to find an appointment?” The transcription stage returns that text. The reasoning stage might produce “Tell me the day you prefer and whether morning or afternoon works better.” The synthesis stage receives exactly that response string and returns audio bytes. The saved file is then the concrete output you can listen to and compare against the printed text.

If the spoken answer has the wrong day but the printed text is correct, investigate synthesis pronunciation or playback. If the printed answer has the wrong day and the transcript is correct, investigate reasoning context and instructions. If the transcript has the wrong day, investigate capture quality and recognition. This three-way split is the main educational value of the baseline.

Record timestamps around each stage using a monotonic clock. The elapsed transcription request includes upload and processing. The reasoning request includes network and model time. The TTS request includes generation and file transfer. Do not label these measurements as pure model inference latency; they are application-visible stage durations.

A simple trace can record utterance ID, stage name, start time, end time, byte count, and outcome. Avoid raw audio or sensitive text unless explicitly needed for your evaluation policy. This gives you enough information to distinguish a slow request from a large response without treating logging as unrestricted recording.

## Move from whole turns to streaming in safe increments

The first improvement is streaming recognition while the user speaks. This can overlap much of recognition with capture. It does not remove the need to decide when a turn ends. A final-looking segment can still belong to a larger thought. Keep acoustic activity, recognition finalization, and semantic turn completion conceptually separate.

The next improvement is streaming text from the language model. Tokens can arrive before the answer is complete. A TTS system may accept incremental text, or it may require complete text per request. If it accepts incremental input, you still need a buffering policy: sending each token independently can damage prosody, while waiting for an entire paragraph adds delay.

A useful teaching chunker accumulates text until a sentence boundary or a bounded phrase length. It then sends a coherent fragment to synthesis. However, punctuation is not a perfect semantic boundary. Decimal numbers, abbreviations, code, and URLs can contain periods. Production chunking should be evaluated with the actual response domain and the provider's streaming contract.

Finally, stream audio to playback as it becomes usable. The player needs format metadata, response identity, and cancellation freshness. These are the contracts from chapters 2 and 3. A pipeline is only genuinely streaming if intermediate work can progress before the previous complete artifact exists; reading a whole audio response and then yielding it in small slices does not reduce time to first audio.

## Handle a correction before it becomes an action

Imagine recognition emits “Tuesday afternoon,” and the model begins a lookup. The user adds “Actually Wednesday.” You can cancel the Tuesday request if the tool supports it. Whether or not cancellation reaches the tool in time, tag its result with the original turn version. The current conversation should reject stale Tuesday results once Wednesday becomes the active request.

For read-only work, speculation can improve responsiveness. You may begin an availability query before the utterance is final and discard it if the user changes direction. For writes, speculation is dangerous. Do not create an appointment merely because an interim transcript sounded complete. A write needs a deliberate authority and confirmation path, developed later in the book.

Do not present speculative lookup output as settled fact. A short acknowledgement can say that you are checking availability. It should not say that a slot is reserved unless the business system has actually reserved it. The more natural the voice sounds, the more important it becomes to keep these claims tied to real state.

A cascade's explicit text stages make inspection convenient, but they also create opportunities for duplicate work. If every transcript update triggers a new model request, five recognition revisions can create five overlapping answers. Debounce or version the trigger, cancel superseded work, and keep only the response associated with the current accepted turn.

## Failure behavior is part of the pipeline

Set timeouts at every network stage and for the whole turn. A stage can fail before any audio is emitted or after some audio has already played. Those cases need different recovery messages. If the user has heard the first half of an answer, silently restarting the whole answer can sound like a loop. Make the recovery clear and concise.

Retry policies must consider side effects and duplicate audio. Retrying a failed TTS request may be acceptable before playback begins, but can produce repeated speech if the first request actually succeeded and its result arrives late. Retrying a read-only lookup is different from retrying a booking. Track request identity and whether the user has already heard output.

Use provider-specific errors internally and user-oriented categories externally. A user can act on “The connection failed; try again or use text.” They usually cannot act on a stack trace containing a request URL and an SDK exception class. Keep enough sanitized detail in server logs to debug the issue without exposing secrets in the interface.

The delivered file examples intentionally do not retry automatically. This makes each run's behavior easy to reason about and avoids accidental repeated paid requests during learning. A production implementation can add bounded retries with jitter, but should do so only after deciding which stages and outcomes are safe to repeat.

## Inspect a failed turn without rerunning every service

Suppose a saved reply is silent. Preserve the stage outcomes from that run before repeating paid requests. Was there a nonempty transcript? Was there nonempty intended speech? Did the synthesis request return a successful status and an audio body? This sequence can localize the fault without transcribing the same recording again.

Next inspect whether the file is current. A previous successful run may have left `reply.wav` behind while the latest run failed. Use an isolated output directory or record the output path and timestamp for each utterance. Existence is not provenance. For a production trace, bind the output artifact to the same utterance ID as its transcript and reasoning result.

If the output is valid but semantically wrong, compare the three representations side by side. Keep the original user request, recognized text, and intended answer separate. Repair the earliest incorrect boundary rather than compensating later with a more elaborate prompt. A date misrecognized upstream should be corrected or confirmed before reasoning depends on it.

## When this architecture is a good fit

A cascade is attractive when you need explicit control over wording, independent speech providers, or clear intermediate text for evaluation. It also works well when the application already has a strong text assistant and you want to add voice as another input/output channel. You can reuse much of the tool and state logic while changing capture and presentation.

Its costs include additional interfaces, transformations, and cancellation boundaries. You may lose some vocal nuance at the transcript boundary. Operationally, a failure in any one of three providers can affect the turn. Track these dependencies honestly rather than presenting a component's latency as the entire agent's latency.

A native audio model is worth evaluating when conversational timing and vocal understanding are central, or when reducing the number of services helps. That choice does not invalidate the cascade baseline. The baseline remains a useful diagnostic reference and an alternate path for tasks where exact text control matters.

In the companion, vary the latency stages and inspect the serial total. Then read the source adapters side by side. Notice how much of the Python and TypeScript code is the same protocol expressed through different standard libraries. The next chapter replaces these explicit speech stages with a native Realtime session while retaining the lifecycle and trust boundaries we have already established.
