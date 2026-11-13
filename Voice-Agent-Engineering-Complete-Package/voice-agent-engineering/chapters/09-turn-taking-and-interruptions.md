# 9. Turn-taking, interruption, and what the user heard

A conversation is not a sequence of perfectly separated recordings. People pause mid-sentence, correct themselves, acknowledge an answer, and interrupt before the other speaker finishes. A useful voice agent needs rules for those situations. This chapter develops the rules as observable state changes rather than hiding them under a vague instruction to “be natural.”

We will distinguish acoustic activity, turn completion, response generation, and audible playback. The companion's endpoint and interruption experiments make these distinctions concrete. The matching `endpoint` and `Playback` implementations in Python and TypeScript provide small tested models. They are deliberately not a production VAD or a full audio engine; they isolate the decisions you must understand before tuning a framework.

## Speech activity is not the same as a finished thought

Voice activity detection, or VAD, estimates whether an audio region contains speech. It can use signal features or learned models. It does not by itself know that the user has completed an intention. A speaker can pause while saying “I need an appointment on… Wednesday.” The pause may contain no speech even though the turn is unfinished.

Endpointing decides when to treat the current user turn as complete. A basic endpoint rule waits for a period of silence after speech. A semantic rule also considers whether the words appear complete. A hybrid rule combines acoustic evidence and language context. Each has a tradeoff between responding quickly and avoiding premature interruption.

Suppose the user says “Could you move it to” and pauses for 600 milliseconds before saying “Friday?” A 400-millisecond silence threshold may commit too early. A 900-millisecond threshold may wait appropriately for that case but feel slow after a short complete question. There is no single silence duration that perfectly identifies all human turn boundaries.

The inspected [OpenAI VAD guide](https://developers.openai.com/api/docs/guides/realtime-vad) distinguishes server and semantic turn detection. LiveKit's [turn overview](https://docs.livekit.io/agents/logic/turns/) likewise separates related controls. Use provider-specific options only after understanding their units and scope. A framework endpoint delay and a provider endpoint delay can accidentally stack if both are active.

## Derive the deterministic endpoint experiment

The teaching function receives a list of boolean frames. `True` means an upstream detector has marked speech; `False` means it has not. The function does not analyze audio. It tracks whether a speech region is active and how long the subsequent quiet interval has lasted. Once quiet time reaches the configured threshold, it emits a commit time and resets.

At 20 milliseconds per frame, ten speech frames last 200 milliseconds. Twenty-five quiet frames last 500 milliseconds. With a 500-millisecond silence threshold, the commit occurs at 700 milliseconds from the beginning: 200 milliseconds of speech plus 500 milliseconds of quiet. This known result appears in both language tests.

If the threshold is not a multiple of the frame duration, the decision occurs at the first frame boundary that reaches or exceeds it. For a 510-millisecond threshold and 20-millisecond frames, the quiet duration must reach 520 milliseconds. This quantization is small but real. Precision in a numeric input does not mean the system can decide between arbitrary sample times.

Initial silence does not produce a user turn in this model. Once a commit occurs, additional silence does not repeatedly produce more commits. These are useful invariants. Without them, a silence-driven loop can generate repeated empty turns or repeated “Are you still there?” prompts even though the user has said nothing new.

## Add semantic evidence carefully

A semantic detector can estimate that “Yes, Friday at three” is likely complete while “Could you check whether” is not. It can reduce some premature commits without requiring every user to wait through a long fixed silence. However, it introduces another model and another source of uncertainty. Test it with the language and speaking styles your product supports.

A semantic completion score is not a business-confidence score. It may say the utterance sounds finished while the date remains ambiguous. Harbor still needs to resolve which Friday, what timezone, and whether three means morning or afternoon when context does not establish those facts. Turn completion permits reasoning to begin; it does not authorize a transaction.

Users with speech differences, second-language pauses, or slow deliberation can be disadvantaged by aggressive endpointing. Provide a more deliberate input mode such as push-to-talk, a “Done speaking” control, or a user-adjustable pause setting when appropriate. These options can improve both accessibility and recognition quality without pretending that one automatic detector fits everyone.

Do not punish a user for correcting the system. If endpointing cuts them off, stop the agent's response promptly, preserve useful task context, and let the correction finish. A brief repair can be more effective than repeatedly apologizing while continuing to speak over the user. The essential behavior is to yield and update the current request.

## Full duplex is an interaction policy

Full duplex means the system can receive user audio while output audio is playing. Half duplex permits one direction at a time. Push-to-talk makes the user's turn boundary explicit through an action. These modes are not a hierarchy in which one is always more advanced. They fit different environments and expectations.

An open microphone can feel fluid in a quiet room with headphones. In a noisy shared space, it can mistake other voices or speaker leakage for interruptions. A push-to-talk mode may be more predictable. A task that reads a short confirmation may also benefit from clear turn controls rather than continuous listening.

If the agent can be interrupted, explain it through behavior and a visible stop control. Do not require the user to guess whether speaking will work. If a portion of speech cannot be interrupted for a specific product reason, make that choice exceptional and deliberate. Long uninterruptible answers are particularly frustrating because the user cannot correct an early misunderstanding.

The audio path must support the policy. A UI that claims full duplex while muting capture throughout playback is not actually accepting spoken interruptions. Conversely, leaving capture active without echo handling can cause the agent to interrupt itself. Align the visible state, capture state, and turn controller.

## Separate backchannels from taking the turn

A backchannel is a short acknowledgement such as “right,” “okay,” or “mm-hm” that can occur while someone else speaks. It may indicate attention rather than a request to stop. A correction such as “No, Wednesday” usually deserves immediate attention. A noise burst should not automatically have the same meaning as either.

A basic barge-in policy may stop on any detected speech. A more selective policy can require minimum duration, recognized words, or a learned interruption decision. More selectivity can avoid false interruptions but risks ignoring legitimate short commands such as “Stop.” Evaluate the whole behavior, including how quickly the user can recover when the detector is wrong.

The inspected [LiveKit tuning guide](https://docs.livekit.io/agents/logic/turns/tuning/) discusses the relationship between turn controls and timing. Its values belong to a particular framework and version. This book does not prescribe a universal duration. Use a representative test set and compare false interruptions, missed interruptions, and stop latency.

A useful product fallback is an explicit Stop speaking button that bypasses semantic interpretation. It gives the user control even when acoustic detection fails. Keep it reachable by keyboard and visible while speech is active. A small visual control can complement conversational intelligence rather than competing with it.

## Interruption is a multi-step operation

When a user takes the turn, first stop the old audio locally. That includes currently scheduled sources or the worklet queue, not just the list of future chunks. Next invalidate the old response generation so late chunks cannot become audible. Then request cancellation upstream and reconcile history according to the selected provider's protocol.

The order matters for perceived responsiveness. Waiting for a round trip to confirm remote cancellation before stopping the speaker adds avoidable latency. The player can become silent immediately while the remote cancellation proceeds. At the same time, simply muting a global volume and later unmuting can accidentally reveal stale queued audio unless the queue is also cleared or invalidated.

The `Playback` class models the invalidation step. A response starts with epoch zero. After interruption, epoch becomes one and the queue empties. A late chunk labeled zero is rejected. A new chunk labeled one can be accepted. This does not require trusting that the remote service stopped instantly.

Use response identity as well as an epoch in a complete implementation. An epoch is a local freshness mechanism; a provider response ID helps correlate incoming events. Map the two in an adapter and do not assign new incoming chunks the current epoch blindly. If you do, stale provider output can be relabeled as fresh and bypass the protection.

## Generated, transmitted, and heard are three timelines

Suppose the model generates “Your appointment is Tuesday at three, and the confirmation number is…” The application has received the full transcript, the network has delivered one second of audio, and the speaker has played only the first half-second. These are three different frontiers. A user interruption occurs relative to what was heard, not what the model internally completed.

A history containing all generated words can mislead the next turn. The model may behave as if the user heard a confirmation number that never played. A history containing too little can make it repeat information the user already heard. Accurate reconciliation uses playout position or provider mechanisms designed for the chosen transport.

Some protocols provide conversation truncation or automatic media-history synchronization. Their event names and semantics differ. For an application-owned PCM player, you may need to track accepted sample duration and send a supported truncation operation. For provider-managed WebRTC playback, verify what synchronization the service provides before adding manual operations that could conflict.

Do not equate elapsed wall time with heard duration when playback was paused, underrun, or blocked. A one-second timer after receiving audio does not prove one second was audible. For precise history, use actual scheduling and device-facing playback state as far as the platform allows, and document remaining uncertainty.

## Handle false interruption as a repairable event

A cough may stop the agent even though the user did not intend to speak. The system can wait briefly for meaningful speech, then resume or ask a short question according to policy. Resuming requires knowing where playback stopped and whether the old response is still valid. It should not restart the whole answer automatically if that creates an irritating loop.

An adaptive system may distinguish a false interruption from a genuine turn. This is still fallible. Keep the behavior observable in traces: interruption candidate, accepted interruption, local stop, response cancellation, and resume decision are useful separate events. A single log line saying “interrupted” hides the information needed to tune the experience.

Avoid resuming an answer after the user has already asked a new question. Freshness rules apply to recovery too. A delayed false-interruption timer from response A must not resume A while response B is active. Bind timers and callbacks to the response generation that created them, and dispose them on supersession.

When in doubt, a concise clarification can be better than an elaborate automatic recovery. Harbor can say, “Would you like me to continue?” after a meaningful pause. It should not ask that after every background sound. Evaluate the repair frequency and user effort along with raw detection accuracy.

## Speculation can help only when it is reversible

Preemptive generation begins reasoning before the turn is certainly finished. It can reduce first-response latency when the prediction is right. When the user continues, the speculative response must be cancelled or discarded. The system needs a clear distinction between speculative computation and committed output.

Read-only availability lookup is often a reasonable speculative action if its cost is bounded. Speaking a speculative answer is more visible and can be disruptive. Committing a booking is a different category and should not occur merely because a partial utterance appears complete. Keep speculative tasks behind a version gate and prevent them from acquiring write authority.

Speculation also affects cost. Discarded responses may still consume tokens, synthesis compute, or inference capacity. Measure the fraction of speculative work used, cancelled, or superseded. A latency optimization that doubles cost and increases interruption errors may be a poor trade for the product.

The companion lets you observe late output after an interrupt and whether it is accepted. Extend that mental model to speculative results: every result belongs to the state that requested it. Before applying it, compare that identity with the current state. Cancellation improves efficiency; identity checks preserve correctness when cancellation arrives late.

## Trace a correction across the audio and task states

At time zero, Harbor begins speaking about Tuesday. At 300 milliseconds, the user says “No, Wednesday.” The local detector accepts an interruption at 420 milliseconds, and the speaker becomes silent at 450. The observed detector-to-stop interval is 30 milliseconds, while attempt-to-stop is 150. Both numbers are useful, but they answer different questions.

At 500 milliseconds, a final Tuesday audio chunk arrives from the network. Its response identity maps to the old epoch, so it is rejected. At 650, a Tuesday lookup result also arrives. Its task version is obsolete, so it cannot replace the Wednesday request. Audio freshness and task freshness use similar reasoning but are checked in different subsystems.

At 900 milliseconds, Wednesday becomes the accepted turn and a new lookup begins. The agent can acknowledge the correction briefly if useful. It should not continue the interrupted sentence merely because remote cancellation completed late. The current user intention, rather than network arrival order, determines which work remains relevant.

This trace explains why one global boolean such as `isInterrupted` is fragile. The application needs identities and ownership over time. A boolean can say that something was interrupted, but cannot reliably distinguish which response, which lookup, or which timer still has permission to affect the current conversation.

## Tune with scenarios rather than one average

Create a small scenario set: a short direct question, a long mid-sentence pause, a correction after a date, a backchannel during speech, an explicit stop, background conversation, and a user who speaks slowly. Run each through the same configuration and record the behavior. This reveals tradeoffs that a mean latency number cannot show.

Measure endpoint delay from the last meaningful speech to the turn commit, and interruption delay from the interruption attempt to local silence. Also measure premature commits, missed interruptions, and repair turns. A system that improves delay by 100 milliseconds but doubles repair frequency has not clearly improved the experience.

Inspect traces and listen to representative audio under an appropriate consent policy. Automated event timings cannot tell you whether a cutoff occurred at a confusing word boundary or whether a short acknowledgement sounded rude. Conversely, listening alone may not reveal an accumulating output queue until it becomes severe. Use both kinds of evidence.

Keep user-visible controls as the final authority over local output. End should stop capture and playback even when the model, network, or framework is busy. The next chapter applies the same separation of state and authority to tools, memory, retrieval, and business actions.
