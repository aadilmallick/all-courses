# 12. Evaluate, operate, and extend the complete system

A voice agent is ready for a controlled release when its behavior has evidence behind it. A natural-sounding sample proves little about noisy microphones, repeated interruptions, duplicate tools, long sessions, or costs under load. This final chapter turns the earlier lessons into an evaluation and deployment process you can apply to a real web product.

The delivered package includes a local companion, executable Python and TypeScript exercises, provider integration examples, and a verification report. It does not include provisioned provider accounts, a hosted website, downloaded model weights, or a production scheduling backend. The capstone below is a guided extension project with concrete acceptance conditions. It is not described as an already deployed service.

## Define success before selecting a model

Begin with a small task definition. For Harbor, success means the user can find an appropriate slot, review exact details, confirm the intended proposal, and obtain one authoritative receipt. The agent should also handle no availability, a correction, a cancelled session, and a failed lookup. These outcomes are more meaningful than whether the voice sounds impressive in an open-ended conversation.

Set target behaviors and failure budgets before comparison. A target might specify an acceptable first-audio delay, an interruption stop delay, a maximum duplicate-write count of zero in the test set, and a required text fallback path. Numeric latency targets should come from your product and user evaluation. This book's illustrative calculations are not universal service-level objectives.

Separate hard constraints from graded preferences. Required region, supported language, accessibility route, and permission model can eliminate a candidate. Voice preference and expressiveness can be scored afterward. A provider with a beautiful voice but no acceptable deployment path does not satisfy the product requirement.

Keep the model, voice, prompt, tool schema, transport, endpoint settings, and runtime version with every evaluation run. Otherwise a later improvement or regression is difficult to attribute. A result labeled only “provider A” is insufficient when several materially different configurations were possible.

## Build an evaluation set with real failure shapes

Use synthetic or appropriately permitted recordings and scripts. Include a quiet direct request, a long pause, a corrected date, a short stop command, background speech, an ambiguous time, a domain name, and a tool timeout. Add multilingual and device scenarios if your intended audience needs them. The set should represent the product's risks rather than only its easiest demonstrations.

Each case needs an expected task outcome, not necessarily one exact sentence. For “Actually Wednesday,” the accepted date should become Wednesday and the old Tuesday proposal should be superseded. For a timeout after a possible commit, the expected behavior is reconciliation, not an unconditional retry. The wording can vary while the invariant remains fixed.

Store fixtures with provenance and expected format. A recording's sample rate, channel count, duration, and consent or synthetic origin should be known. Avoid using private customer calls merely because they are convenient. A small carefully chosen set can reveal more than a large uncontrolled collection with unclear rights and inconsistent conditions.

Do not optimize only against the fixed set. Hold out cases and inspect new failures from controlled use. A prompt can overfit familiar wording. Evaluate semantic variants, different speaking rates, and repair sequences. Keep the evaluation process useful for detecting regressions rather than turning it into a performance theater.

## Measure time at observable boundaries

Record capture start, last meaningful input, turn commit, first reasoning output, first usable audio received, first audio played, interruption attempt, local silence, tool request, and tool result. Not every architecture exposes every boundary, so state what you can actually observe. An unavailable internal timestamp should remain unavailable rather than be guessed.

For first-audio latency, choose a consistent origin such as the user's last meaningful speech. For endpoint delay, measure from that origin to turn commit. For interruption latency, measure from the interruption attempt or accepted speech onset to local audio stopping, and clearly distinguish those two possible origins. Different definitions can produce very different numbers.

Use a monotonic clock for local intervals. Across browser and server, preserve separate spans unless clocks are synchronized or a round-trip method supports an estimate. A trace can correlate events without pretending all clocks share an exact origin. This is especially important when comparing deployments in different regions.

Report percentiles, not only a mean. If nine turns take 400 milliseconds and one takes 4,000, the mean is 760 milliseconds, but one user in ten experiences a much longer wait. A tail metric such as p95 exposes that behavior. State the percentile definition, since interpolation and nearest-rank methods differ for small samples.

## Work through nearest-rank percentiles

The included Python `percentile` function uses nearest rank. Sort the values, compute `ceil(p / 100 × N)`, and choose that one-based rank, bounded to the first element for p = 0. With five samples `[100, 200, 300, 400, 900]`, p50 has rank `ceil(0.50 × 5) = 3`, so the value is 300. P95 has rank `ceil(0.95 × 5) = 5`, so the value is 900.

A small sample does not estimate population tails reliably. The arithmetic is deterministic, but the statistical uncertainty remains large. Use enough representative turns before making a service promise. Also inspect failures separately: dropping failed turns from the latency dataset can make an unreliable system appear fast.

Compare paired scenarios where possible. Run the same utterances and task conditions across configurations. Keep network and device context with the measurements. If one candidate is tested on a warm local connection and another includes cold startup, label the difference rather than interpreting it as pure model performance.

The companion's evaluation experiment calculates a nearest-rank percentile from user-entered values. It rejects an empty or malformed list. This is an actual computation you can inspect, not a prerecorded chart. Replace the sample values with your trace measurements, while remembering that the calculator does not judge whether those measurements were collected correctly.

## Evaluate accuracy at the right level

Word error rate measures substitutions, deletions, and insertions relative to a reference transcript. It is useful for recognition comparison, but not enough for task correctness. A recognizer can have a low overall error rate while getting the appointment date wrong. Measure critical entity accuracy and successful intent repair as well.

For the reasoning layer, evaluate whether the agent asks for missing information, uses the correct tool, stays grounded in results, and avoids premature success claims. For synthesis, evaluate intelligibility, domain pronunciation, and consistency. For the full system, evaluate task completion, repair turns, abandonment, and the user's ability to stop or switch modes.

Automated judges can help triage text behavior, but they should not be the sole authority for spoken quality or business correctness. Use deterministic checks for receipts and ownership, human listening for representative speech, and task observation for the interaction. Each evidence type answers a different question.

Security and isolation scenarios belong in the test set too. Try a tool request with another user's identifier, a conflicting operation key, and a retrieved document containing instructions to ignore permissions. The backend should enforce scope regardless of what the model says. A prompt-only refusal is weaker evidence than a rejected unauthorized operation.

## Calculate cost with explicit units

Provider billing can involve audio input, audio output, text tokens, characters, connected duration, platform minutes, concurrency, and plan limits. Self-hosting adds instance hours, storage, network, and operational labor. Do not reduce every candidate to a single advertised price per minute without checking what that minute includes.

Use current official pricing pages for the selected deployment and account. This edition records links rather than freezing a fragile cross-provider price table. The companion accepts illustrative user-entered rates and clearly labels them as assumptions. It is a scenario calculator, not a live price feed or a quote.

For a simple minute-based example, suppose input costs 0.01 currency units per minute, output costs 0.04, and the average session contains three input minutes and two output minutes. Speech cost is `3 × 0.01 + 2 × 0.04 = 0.11`. If platform cost is 0.02 per connected minute and the session lasts six minutes, add 0.12. Total illustrative cost becomes 0.23 before other services.

The units matter. Input minutes, output minutes, and connected minutes are not interchangeable. A mostly silent session may still incur platform or connection-related costs depending on the service. A TTS character price requires an estimated character volume, not an assumed universal conversion to audio duration. Token-priced audio needs the provider's actual usage accounting rather than a guessed speech-rate formula.

## Compare self-hosted economics honestly

Suppose an inference instance costs 1.20 units per hour and provides 30 useful generated audio-minutes per hour under your measured load. Infrastructure cost is 1.20 / 30 = 0.04 per useful audio-minute. If utilization falls so that only six useful minutes are served per hour, the same instance costs 0.20 per useful minute. Idle capacity changes the result substantially.

This arithmetic excludes development, operations, redundancy, and failed or discarded generation. Include those when the decision requires a total ownership estimate. A local GPU you already own still has capacity and maintenance costs, even if it does not produce a new invoice per request. Conversely, a hosted API may save engineering time that matters more than marginal speech cost at small scale.

Count speculative and cancelled work. A system that generates two answers and plays one may pay for both. Measure cost per completed task as well as per audio minute. A slightly more expensive voice that reduces repair turns can lower task cost, while a cheap but confusing pipeline can increase total usage.

Set budget controls in software. Limit session duration, credential issuance, active sessions per user, response length, and expensive tool concurrency. Alert on unusual usage and provide a way to stop new sessions. A dashboard warning after costs have accumulated is less useful than bounded admission and sensible caps.

## Prepare the backend for long-lived work

Voice sessions are long-lived compared with ordinary HTTP requests. Check load-balancer timeouts, connection limits, process shutdown, and region placement. A platform that works well for short stateless requests may require a different service arrangement for persistent WebSockets or media workers. Verify the capabilities of your actual deployment target.

During a graceful shutdown, stop accepting new sessions, allow an appropriate drain period, and close remaining sessions with a clear client status. Do not terminate a worker in the middle of a possible business commit without preserving the operation ledger. Conversation recovery and transaction recovery have different requirements.

Keep session state where its lifetime belongs. A single worker's memory can hold ephemeral audio buffers. Durable proposals and receipts belong in a persistent store. If reconnecting may land on another worker, the application needs a way to restore relevant task state. Sticky routing alone is not a substitute for durable business state.

Place services to reduce unnecessary media hops, but measure the result. A browser-to-backend-to-provider bridge can simplify control while adding network distance. Direct provider media with backend tools can reduce the media path while requiring careful credential issuance and session correlation. Choose the topology that meets your trust and performance requirements together.

## Add observability without recording everything

A useful session trace contains opaque IDs, configuration version, event kinds, durations, queue sizes, usage, and outcome categories. That can diagnose many failures without storing raw audio or full transcripts. Detailed recordings may be valuable for consented evaluation, but their retention and access should be intentional.

Separate user-facing errors from diagnostic detail. The interface needs a clear recovery path. Operators need enough context to identify whether the failure was permission, signaling, provider quota, media transport, playback, or a tool. Avoid logging permanent keys, ephemeral tokens, signed URLs, raw SDP, or credential-bearing WebSocket URLs.

Track connection startup failures, mid-session disconnects, playback underruns, premature turn commits, interruption failures, and tool outcomes. A single aggregate error rate can hide a concentrated browser or device problem. Segment carefully by relevant non-sensitive environment information, and avoid collecting more user data than needed for diagnosis.

A rollback should restore configuration as well as code. Prompts, model IDs, endpoint settings, voice IDs, and tool schemas can change behavior independently. Keep a known-good version and rerun the representative evaluation set after updates. A model alias changing remotely is another reason to monitor behavior rather than assuming unchanged source means unchanged output.

## A guided capstone with acceptance conditions

Build Harbor as a small web app with shared task state for voice and text. Choose either a native session or a cascade after evaluating both against your needs. Start with read-only synthetic availability. Add the proposal and receipt model only after the interaction and cancellation paths behave predictably.

The first milestone is a complete local interaction: start, visible permission state, connected status, short answer, mute, stop output, and end with microphone cleanup. Its acceptance evidence includes ending before permission resolves, a denied permission, blocked playback, and a connection timeout. The delivered demo and tests provide a foundation, not the entire capstone.

The second milestone is grounded lookup and confirmation. The backend must bind user identity, validate tool arguments, supersede stale results, and return an idempotent receipt. Test duplicate confirmation and uncertain downstream outcome. The third milestone adds a real text route, accessible proposal review, and a receipt that remains visible after audio ends.

The final milestone is a controlled deployment with authentication, quotas, session caps, sanitized telemetry, and a documented evaluation result. Run representative device and network tests, compare cost per task, and record untested cases. Release gradually so observed failures can improve the system before broad use.

## Keep a release record a future developer can reproduce

For each controlled release, store the code revision, runtime, provider model and voice, prompt version, tool schema, timing settings, evaluation fixture version, and observed results. Include the known limitations rather than hiding them in conversation history. A future maintainer should be able to distinguish a tested configuration from an untested suggestion.

When an incident occurs, compare the affected release with the last known-good configuration. A prompt edit, remote model alias change, and transport deployment can all alter behavior without changing the same source file. Preserving the complete record makes rollback and diagnosis concrete. It also keeps claims such as “interruption improved” tied to a scenario set and measurement definition rather than a memorable demonstration.

## Use coding assistants as reviewers of concrete work

An AI coding assistant can help inspect lifecycle and transaction code, but give it a bounded task and verification requirement. For example: “Review this player for stale audio after interruption. Identify who owns each scheduled source, propose a minimal fix, and add a test where an old chunk arrives after stop.” That prompt asks for evidence rather than a broad claim that the app is production-ready.

For provider migration, ask it to compare the current pinned protocol with fetched official documentation and list every changed field or event before editing. Require it to preserve secrets and distinguish static checks from live calls. A plausible rewritten SDK example is not enough; inspect the diff and run the applicable tests.

For UX review, provide actual screenshots and state transitions, then ask whether the user can understand and recover from each failure. Do not ask an assistant to certify an experience it has not observed. Human task testing remains valuable, especially for speech timing, pronunciation, and accessibility combinations.

You now have the concepts, source examples, experiments, and verification framework to build and assess a voice agent deliberately. Start from the smallest working path, preserve truthful state and user control, and broaden the system only as each new responsibility has an observable contract and evidence behind it.
