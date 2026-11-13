# 8. Open models, Fish Speech, and self-hosting

Self-hosting changes who owns the difficult parts. Instead of sending a request to a managed speech service, you operate a process that loads model weights, accepts work, schedules inference, produces audio, and survives failures. This can provide useful control over deployment and data flow. It can also introduce cold starts, GPU memory limits, queueing delays, and maintenance work that a model-quality demonstration does not reveal.

We will separate three questions: what the model can do, what you are permitted to do with the exact artifact, and what your infrastructure can deliver under load. The chapter covers Fish Speech, Whisper-related recognition options, Kokoro, and adjacent open speech projects. It does not download or run model weights in the delivered package. The local simulations teach queue and capacity reasoning without implying that a GPU inference benchmark was performed.

## A model is one component of an agent

A TTS model accepts text or related conditioning and generates speech. A recognizer accepts audio and produces text. A native dialogue model may jointly handle conversational speech. These are different capabilities. Installing a TTS checkpoint does not provide turn detection, reasoning tools, a browser transport, or an application permission system.

For a self-hosted cascade, a practical architecture is browser media transport, recognition worker, reasoning service, synthesis worker, and playback. The workers can be independently deployed and scaled. The model-serving APIs should be narrower than the entire application: for example, a synthesis worker should receive approved spoken text and return tagged audio, without being allowed to book appointments.

A model's file size is not its total runtime memory requirement. Loading can involve parameters, intermediate activations, caches, decoder state, and framework overhead. Concurrent sessions add more state. A checkpoint that fits in GPU memory for one offline sample may fail or slow substantially when several live streams arrive together.

The application should preserve the adapter contract from chapter 1. A local synthesis adapter can implement the same response IDs, audio metadata, cancellation, and error categories as a hosted adapter. That makes it possible to compare deployments without rewriting the conversation state machine. It does not imply identical voice quality or timing.

## Distinguish open source, open weights, and hosted access

Open-source code and downloadable model weights are not automatically governed by the same license. A repository may license its inference implementation permissively while a checkpoint imposes use restrictions. A hosted API has service terms that can differ again. Record the exact artifact rather than assigning one legal label to an entire brand.

For an engineering inventory, keep repository URL and commit, checkpoint repository and revision, weight hash, tokenizer or codec artifacts, license files, and any separate voice-asset terms. This is not paperwork detached from implementation. It tells you which deployment you can reproduce and which terms apply when you upgrade or redistribute it.

The inspected Fish sources illustrate the distinction. The S2-Pro model card identifies the Fish Audio Research License. The current inference repository's license page contains a community agreement with its own conditions, including hosted-service considerations. Those documents must be evaluated for the exact intended deployment. This book does not infer that one document silently overrides the other for every checkpoint.

The relevant primary references are [the S2-Pro model card](https://huggingface.co/fishaudio/s2-pro/blob/main/README.md) and [the Fish Speech repository license](https://github.com/fishaudio/fish-speech/blob/main/LICENSE). Treat the observations here as artifact identification, not legal advice or a blanket permission grant. A production decision needs the actual terms attached to your chosen version and use.

## Understand Fish Speech as a deployment candidate

Fish Speech is a speech-generation project with downloadable model artifacts and documented inference paths. Its hosted platform also offers speech services. Those are separate choices: calling the hosted API does not mean your application is self-hosting, and running repository code does not mean you are using the same model version or operational stack as the hosted product.

The inspected installation and inference documentation includes a checkpoint layout and commands for the then-current S2-Pro path. Because model loading and serving interfaces evolve, this package links the official recipe rather than inventing a timeless `fish.generate()` call. See [installation](https://github.com/fishaudio/fish-speech/blob/main/docs/en/install.md) and [inference](https://github.com/fishaudio/fish-speech/blob/main/docs/en/inference.md).

When evaluating Fish for Harbor, prepare a fixed set of short utterances with dates, quantities, and corrections. Measure cold-load time, warm time to first audio, sustained generation speed, and output consistency. A long-form narration benchmark does not establish interruption responsiveness. Voice cloning or expressive controls should be assessed separately from the core requirement to speak accurately and promptly.

Check the relationship between reference audio, reference text, and generated speech if the selected model uses voice conditioning. Store only permitted assets, isolate them by tenant when necessary, and avoid accidentally caching one user's voice conditioning for another. Voice identity is data with a lifecycle, not merely an extra string in a synthesis request.

## Recognition candidates: Whisper and its implementations

Whisper is a recognition project with published code and weights. The inspected repository describes usage and its license. A common deployment uses a Python library around the model, while other projects provide optimized or native implementations. Recognition quality and inference cost depend on model size, language, hardware, decoding settings, and input conditions.

[Whisper's official repository](https://github.com/openai/whisper) is the source for its own interface. [faster-whisper](https://github.com/SYSTRAN/faster-whisper) provides a CTranslate2-based implementation, and [whisper.cpp](https://github.com/ggml-org/whisper.cpp) provides a C/C++ path. These projects have distinct installation, model-format, and runtime requirements. Do not assume a checkpoint file can be passed unchanged between every implementation.

Many recognition examples process a complete recording. To use an offline recognizer in a conversational system, you need a streaming strategy: short overlapping windows, incremental hypotheses, stable segment decisions, and a turn policy. Wrapping a batch transcription call in a loop is not automatically a high-quality streaming recognizer. You must manage boundary words, repeated text, and accumulated context.

A practical recognition evaluation includes quiet speech, background speech, accent variation, domain vocabulary, and silence. Some systems can hallucinate text on non-speech audio. Do not treat every decoded string as a true user command. Combine input-quality checks, activity evidence, and task-level confirmation where appropriate, while avoiding the claim that any one threshold eliminates all recognition errors.

## Synthesis candidates: Kokoro and adjacent projects

The inspected [Kokoro-82M model card](https://huggingface.co/hexgrad/Kokoro-82M) identifies Apache-2.0 licensing and a compact open-weight TTS model. That makes it a useful candidate for a small self-hosted synthesis evaluation. It still requires compatible software, voice assets, and realistic listening tests; the label does not establish that it meets your latency or language requirements.

Other projects serve different purposes. [Chatterbox](https://github.com/resemble-ai/chatterbox) is a TTS project worth inspecting for its documented capabilities and artifact terms. [Moshi](https://github.com/kyutai-labs/moshi) explores a speech-text dialogue approach with a streaming codec. A native dialogue research stack should not be compared to a small TTS model as though they perform the same job.

Use these references to broaden the candidate set, not to create an unsupported ranking. A project being popular or newly released is not evidence that it is the best fit for Harbor. Test the specific voice, language, hardware, and concurrency level you intend to use. Keep marketing claims and independent measurements separate in your evaluation notes.

For an initial local experiment, start with one recognizer and one synthesizer on a known machine. Capture exact package versions and model revisions after a successful installation, then create an environment lock or container digest. The optional `examples/python/local_models.py` provides documented faster-whisper and Kokoro file recipes. Its `requirements-models.txt` records direct baseline versions, not a tested transitive or GPU lock; no model installation was performed. Install in a separate environment, check upstream system requirements, and record a successful machine-specific lock before deployment.

## Build a narrow inference service

A useful synthesis service accepts text, an approved voice identifier, output preferences within supported bounds, and a response identity. It returns audio chunks with explicit format metadata. It should reject excessive text length and unsupported formats before allocating expensive inference work. Authentication and tenant limits belong at the service boundary.

Separate model loading from request handling. Load the model once per worker, perform a warmup appropriate to the implementation, and expose readiness only after the worker can produce valid output. A process being alive is a liveness signal. A process that has loaded its model and can accept work is a readiness signal. Confusing these causes traffic to hit workers that are still downloading or compiling.

A worker needs a bounded admission queue. When it is full, reject or defer work according to an explicit policy. A voice request that waits ten seconds in a hidden queue is not a successful low-latency response merely because inference itself took 200 milliseconds. Measure queue wait separately from generation time.

Do not expose arbitrary filesystem paths, model download URLs, or shell commands as request parameters. An inference service should select from installed, approved assets. Model files and deserialization formats can have security implications, so obtain them from intended sources and use supported safe loading practices for the framework. The application user should not choose executable model code at runtime.

## Derive a useful capacity estimate

Real-time factor, or RTF, compares generation time with generated audio duration. If a worker needs 0.4 seconds to produce one second of audio, its RTF is 0.4. Values below one mean faster-than-realtime generation for that workload. This says nothing by itself about time to first audio, which may still be long because of startup or buffering.

Suppose a worker has an RTF of 0.4 for one active stream. An idealized throughput estimate is 1 / 0.4 = 2.5 audio-seconds generated per wall-clock second. It would be unsafe to conclude that the worker can serve exactly two or three conversations. Concurrent state, scheduling, memory, burstiness, and first-chunk latency can change performance. Treat the arithmetic as a starting bound to test.

The user's speaking duty cycle matters. Ten connected sessions may not all require synthesis simultaneously. Capacity should account for active inference demand as well as connection count. However, average duty cycle can hide bursts after a common prompt or reconnect. Load-test overlapping turns rather than dividing a benchmark by an optimistic average.

The companion's capacity and cost inputs use explicit assumptions rather than measured model performance. Vary utilization and hourly infrastructure cost to see how idle time changes economics. Replace those inputs with measurements from your machine before making a deployment decision. A calculator is useful because it exposes assumptions; it does not certify them.

## Batching trades throughput for waiting

Batching combines work to use hardware efficiently. It can improve total throughput but add waiting time while a batch forms. For interactive speech, a large throughput gain may be a poor trade if it delays the first audible response. Continuous batching and streaming schedulers can help, but must be evaluated under the model implementation you actually use.

Measure at least median and tail time to first audio under concurrent load. A worker that serves most requests quickly but occasionally stalls for several seconds can feel unreliable. Also track cancellation: does an interrupted request release compute promptly, or does it continue generating an entire sentence that no one will hear?

Long requests can monopolize a worker if scheduling is naive. Bound spoken text length and consider fairness between sessions. A single narration request should not block every short conversational reply. Separate queues or worker pools may be appropriate when your product mixes long-form audio generation and realtime agents.

Warm workers consume resources even when idle. Autoscaling from zero saves idle cost but adds cold starts. A small warm pool can protect startup latency, while burst capacity handles additional demand. The correct balance depends on measured traffic and your acceptable wait, not on a universal claim that self-hosting is cheaper.

## Protect tenant data and clean up state

A worker may cache voice embeddings, text context, codec state, or generated audio. Identify which caches are global, per-model, per-voice, and per-session. A global model cache can be appropriate; a global conversational buffer containing another user's text is not. Clear session-owned state when the session ends or changes tenant.

Limit what is written to disk. Temporary audio files can persist after a crash. Use scoped temporary directories, defined retention, and cleanup on normal completion and startup recovery. If recording is not a product feature, do not quietly accumulate recordings as a debugging convenience. Store sanitized timing and outcome metrics instead where possible.

Network isolation helps reduce accidental exposure, but self-hosting does not automatically make every deployment private. Model downloads, telemetry, crash reporting, and external reasoning calls can still send data outward. Map the actual data flow. If recognition and synthesis are local but reasoning is hosted, the transcript still crosses that boundary.

Update models as versioned deployments. Keep a known-good checkpoint and configuration available for rollback. Compare the new version against the same fixtures and load conditions. A voice that improves on general samples can still regress on your appointment terminology or language mix. Treat model upgrades as software changes with evidence.

## Separate model improvement from serving improvement

Suppose a new checkpoint produces clearer speech but takes twice as long to load. If workers remain warm for hours, startup may matter little. If your deployment frequently scales from zero, the same change can make the first user wait much longer. Measure both cold and warm paths instead of allowing one average to conceal the difference.

A serving change can also alter quality indirectly. Aggressive batching may preserve the waveform quality of each response while delaying turn starts. Very small text fragments may improve first-audio timing while damaging phrasing. Treat model, scheduler, and chunking policy as a combined configuration during evaluation.

Keep a small known-good audio fixture and its expected format alongside the deployment. A health check can validate that the worker produces decodable audio with plausible duration, while deeper listening checks remain part of release validation. Do not make every health probe generate a long paid or expensive response; probes themselves consume capacity.

For a rollback, preserve the inference code, weight revision, voice conditioning assets, and format contract together. Restoring only a Python package while leaving incompatible new weights mounted can create a different failure. Reproducibility means recovering the complete executable configuration, not merely remembering the model's marketing name.

## A realistic self-hosting pilot

For Harbor, begin with ten synthetic utterances and ten intended spoken responses. Verify formats and output duration first. Next measure cold startup and warm single-turn behavior. Then test two and four concurrent requests, including a cancellation and an intentionally long response. Record queue wait, first audio, total generation, memory, and failures.

Inspect the resulting audio with human listening. Include a repeated date and a long identifier to expose pronunciation and chunking problems. Compare the exact same fixtures against a hosted synthesis adapter. Do not compare local warm inference with hosted cold connection setup without labeling the difference.

Only then build the browser transport and continuous session layer around the candidate. A working file-generation script is useful evidence, but it is not a deployed voice agent. Use the lifecycle, interruption, and UX chapters to complete the missing responsibilities. This sequence prevents expensive infrastructure work from obscuring a model that never met the basic task requirements.

The next chapter focuses on the timing behavior shared by every architecture: deciding when the user has finished, responding without rushing, and stopping promptly when the user changes direction. Those problems remain even if all speech inference runs on your own hardware.
